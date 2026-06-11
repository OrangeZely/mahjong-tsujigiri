-- 麻雀 辻斬る！ Supabase スキーマ

-- スコアテーブル
create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  correct_count integer not null default 0,
  total_answered integer not null default 0,
  accuracy numeric(5,2) not null default 0,
  score integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists scores_score_idx on scores(score desc);
create index if not exists scores_created_at_idx on scores(created_at desc);

-- 問題テーブル
-- tiles_str 例: "1m2m3m4m5m6m7m8m9m1p1pz1z1z7"
--   m=萬子, p=筒子, s=索子, z=字牌(z1=東z2=南z3=西z4=北z5=白z6=発z7=中)
-- correct_discards 例: "z7" または "z7,z1"（カンマ区切りで複数可）
create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  tiles_str text not null,
  correct_discards text not null,
  difficulty smallint not null default 2 check (difficulty between 1 and 3),
  description text,
  created_at timestamptz not null default now()
);

-- RLS設定
alter table scores enable row level security;
alter table problems enable row level security;

create policy "誰でもスコアを参照可" on scores for select using (true);
create policy "誰でもスコアを登録可" on scores for insert with check (true);
create policy "誰でも問題を参照可" on problems for select using (true);
