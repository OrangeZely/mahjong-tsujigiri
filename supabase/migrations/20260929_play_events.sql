-- プレイ集計（運営ダッシュボード /admin 用）
--
-- アプリは匿名キー（anon）で play_events に INSERT するだけ。読み取りは一切できない。
-- 集計は admin_play_stats() を service_role キーで呼ぶ（Cloudflare Worker の /admin から）。
-- 送るのは端末ごとのランダムIDと数値だけで、プレイヤー名や広告IDは入れない。
begin;

create table if not exists public.play_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id uuid not null,
  event text not null check (event in ('start', 'finish', 'limit_hit')),
  mode text not null check (mode in ('speed', 'casual', 'fu')),
  oni boolean not null default false,
  source text check (source in ('free', 'premium', 'ad')),
  platform text not null check (platform in ('ios', 'android', 'web')),
  locale text not null check (locale in ('ja', 'en')),
  premium boolean not null default false,
  correct smallint check (correct between 0 and 1000),
  answered smallint check (answered between 0 and 1000),
  score integer check (score between -10000000 and 100000000)
);

create index if not exists play_events_created_at_idx on public.play_events (created_at);

alter table public.play_events enable row level security;

-- 送信時刻はサーバーで決める（created_at と id は書かせない）
revoke all on public.play_events from anon, authenticated;
grant insert (device_id, event, mode, oni, source, platform, locale, premium, correct, answered, score)
  on public.play_events to anon, authenticated;

drop policy if exists "誰でもプレイイベントを記録可" on public.play_events;
create policy "誰でもプレイイベントを記録可" on public.play_events
  for insert to anon, authenticated with check (true);
-- SELECT のポリシーは作らない＝アプリからは読めない

-- ダッシュボード用の集計。日付は日本時間で区切る。
-- security invoker（既定）なので、万一 anon が呼べても RLS で何も読めない。
create or replace function public.admin_play_stats()
returns jsonb
language sql
stable
set search_path = public
as $$
with ev as (
  select *,
    (created_at at time zone 'Asia/Tokyo')::date as day
  from play_events
  where created_at >= now() - interval '31 days'
),
today as (select (now() at time zone 'Asia/Tokyo')::date as d),
starts as (select * from ev where event = 'start'),
finishes as (select * from ev where event = 'finish'),
days as (
  select generate_series((select d from today) - 29, (select d from today), interval '1 day')::date as day
),
first_seen as (
  select device_id, min((created_at at time zone 'Asia/Tokyo')::date) as day
  from play_events group by device_id
),
per_device_7d as (
  select device_id, count(*) as n from starts
  where day > (select d from today) - 7 group by device_id
)
select jsonb_build_object(
  'generated_at', now(),
  'today', (select d from today),

  -- モード別プレイ数（start 件数）
  'by_mode', (
    select coalesce(jsonb_agg(x order by x->>'mode'), '[]') from (
      select jsonb_build_object(
        'mode', m.mode,
        'today', count(s.*) filter (where s.day = (select d from today)),
        'd7', count(s.*) filter (where s.day > (select d from today) - 7),
        'd30', count(s.*) filter (where s.day > (select d from today) - 30),
        'oni_d30', count(s.*) filter (where s.day > (select d from today) - 30 and s.oni),
        'ad_d30', count(s.*) filter (where s.day > (select d from today) - 30 and s.source = 'ad'),
        'players_d30', count(distinct s.device_id) filter (where s.day > (select d from today) - 30)
      ) as x
      from (values ('speed'), ('casual'), ('fu')) m(mode)
      left join starts s on s.mode = m.mode
      group by m.mode
    ) t
  ),

  -- 終了したプレイの成績（直近30日、通常／鬼斬り別）
  'results', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'mode', mode, 'oni', oni, 'finishes', n,
      'avg_correct', round(avg_correct, 1), 'avg_answered', round(avg_answered, 1),
      'avg_score', round(avg_score), 'accuracy', round(accuracy, 1)
    ) order by mode, oni), '[]') from (
      select mode, oni, count(*) n,
        avg(correct) avg_correct, avg(answered) avg_answered, avg(score) avg_score,
        100.0 * sum(correct) / nullif(sum(answered), 0) accuracy
      from finishes where day > (select d from today) - 30
      group by mode, oni
    ) r
  ),

  -- 日別（直近30日）
  'daily', (
    select jsonb_agg(jsonb_build_object(
      'day', d.day,
      'speed', (select count(*) from starts s where s.day = d.day and s.mode = 'speed'),
      'casual', (select count(*) from starts s where s.day = d.day and s.mode = 'casual'),
      'fu', (select count(*) from starts s where s.day = d.day and s.mode = 'fu'),
      'finishes', (select count(*) from finishes f where f.day = d.day),
      'players', (select count(distinct device_id) from starts s where s.day = d.day),
      'new_players', (select count(*) from first_seen fs where fs.day = d.day),
      'limit_hits', (select count(*) from ev e where e.day = d.day and e.event = 'limit_hit')
    ) order by d.day)
    from days d
  ),

  'players', jsonb_build_object(
    'dau', (select count(distinct device_id) from starts where day = (select d from today)),
    'wau', (select count(distinct device_id) from starts where day > (select d from today) - 7),
    'mau', (select count(distinct device_id) from starts where day > (select d from today) - 30),
    'total', (select count(*) from first_seen),
    'premium_d30', (select count(distinct device_id) from starts where premium and day > (select d from today) - 30)
  ),

  'funnel_d30', jsonb_build_object(
    'starts', (select count(*) from starts where day > (select d from today) - 30),
    'finishes', (select count(*) from finishes where day > (select d from today) - 30),
    'limit_hits', (select count(*) from ev where event = 'limit_hit' and day > (select d from today) - 30),
    'limit_hit_players', (select count(distinct device_id) from ev where event = 'limit_hit' and day > (select d from today) - 30),
    'ad_plays', (select count(*) from starts where source = 'ad' and day > (select d from today) - 30)
  ),

  -- 1人あたりの直近7日のプレイ回数の分布
  'frequency_d7', (
    select jsonb_build_object(
      '1', count(*) filter (where n = 1),
      '2-4', count(*) filter (where n between 2 and 4),
      '5-9', count(*) filter (where n between 5 and 9),
      '10-19', count(*) filter (where n between 10 and 19),
      '20+', count(*) filter (where n >= 20)
    ) from per_device_7d
  ),

  'platform_d30', (
    select coalesce(jsonb_object_agg(platform, n), '{}') from (
      select platform, count(*) n from starts where day > (select d from today) - 30 group by platform
    ) p
  ),
  'locale_d30', (
    select coalesce(jsonb_object_agg(locale, n), '{}') from (
      select locale, count(*) n from starts where day > (select d from today) - 30 group by locale
    ) l
  ),

  -- 集計を始める前からある唯一のモード別データ：ランキング登録数
  'ranking_entries', (
    select coalesce(jsonb_object_agg(mode, jsonb_build_object('all', n_all, 'd30', n_30)), '{}') from (
      select coalesce(game_mode, 'speed') mode, count(*) n_all,
        count(*) filter (where created_at >= now() - interval '30 days') n_30
      from scores group by 1
    ) r
  )
);
$$;

revoke execute on function public.admin_play_stats() from public, anon, authenticated;
grant execute on function public.admin_play_stats() to service_role;

commit;
