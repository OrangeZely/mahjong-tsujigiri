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

-- インデックス（ランキング取得高速化）
create index if not exists scores_score_idx on scores(score desc);
create index if not exists scores_created_at_idx on scores(created_at desc);

-- 手動問題テーブル（管理者が登録する問題）
create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  tiles jsonb not null,          -- Tile[] JSON
  correct_discards text[] not null, -- 例: ["m3","p7"]
  difficulty smallint not null default 2 check (difficulty between 1 and 3),
  description text,
  created_at timestamptz not null default now()
);

-- RLS（誰でも読み取り可、書き込みは認証ユーザーのみ）
alter table scores enable row level security;
alter table problems enable row level security;

create policy "誰でもスコアを参照可" on scores for select using (true);
create policy "誰でもスコアを登録可" on scores for insert with check (true);

create policy "誰でも問題を参照可" on problems for select using (true);
