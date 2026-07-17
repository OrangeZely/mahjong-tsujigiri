export interface Rank {
  label: string;
  minScore: number;
}

// 称号テーブル（武士テーマ / 2026-07-09 リニューアル）
//   段位: 初段〜10段（1000〜1900）
//   武士の位: 足軽→旗本→軍師→大名→浪人→剣客→師範→大将→将軍（2000〜13000）
//   神域: 魔神・大魔神〜剣豪/剣帝/剣神/剣聖（大・真・超・極）（14000〜75000）
//   頂点: 21世紀の辻斬り（80000）
// ※スコアが minScore 未満の場合は先頭の「初段」が既定として表示される
export const RANKS: Rank[] = [
  { label: "初段", minScore: 1000 },
  { label: "2段", minScore: 1100 },
  { label: "3段", minScore: 1200 },
  { label: "4段", minScore: 1300 },
  { label: "5段", minScore: 1400 },
  { label: "6段", minScore: 1500 },
  { label: "7段", minScore: 1600 },
  { label: "8段", minScore: 1700 },
  { label: "9段", minScore: 1800 },
  { label: "10段", minScore: 1900 },
  { label: "初級足軽", minScore: 2000 },
  { label: "中級足軽", minScore: 2400 },
  { label: "上級足軽", minScore: 2700 },
  { label: "初級旗本", minScore: 3000 },
  { label: "中級旗本", minScore: 3400 },
  { label: "上級旗本", minScore: 3700 },
  { label: "初級軍師", minScore: 4000 },
  { label: "中級軍師", minScore: 4400 },
  { label: "上級軍師", minScore: 4700 },
  { label: "初級大名", minScore: 5000 },
  { label: "中級大名", minScore: 5400 },
  { label: "上級大名", minScore: 5700 },
  { label: "初級浪人", minScore: 6000 },
  { label: "中級浪人", minScore: 6400 },
  { label: "上級浪人", minScore: 6700 },
  { label: "初級剣客", minScore: 7000 },
  { label: "中級剣客", minScore: 7400 },
  { label: "上級剣客", minScore: 7700 },
  { label: "初級師範", minScore: 8000 },
  { label: "中級師範", minScore: 8400 },
  { label: "上級師範", minScore: 8700 },
  { label: "初級大将", minScore: 9000 },
  { label: "中級大将", minScore: 9400 },
  { label: "上級大将", minScore: 9700 },
  { label: "初級将軍", minScore: 10000 },
  { label: "中級将軍", minScore: 12000 },
  { label: "上級将軍", minScore: 13000 },
  { label: "魔神", minScore: 14000 },
  { label: "大魔神", minScore: 15000 },
  { label: "剣豪", minScore: 16000 },
  { label: "剣帝", minScore: 17000 },
  { label: "剣神", minScore: 18000 },
  { label: "剣聖", minScore: 19000 },
  { label: "大剣豪", minScore: 21000 },
  { label: "大剣帝", minScore: 23000 },
  { label: "大剣神", minScore: 25000 },
  { label: "大剣聖", minScore: 27000 },
  { label: "真剣豪", minScore: 30000 },
  { label: "真剣帝", minScore: 33000 },
  { label: "真剣神", minScore: 36000 },
  { label: "真剣聖", minScore: 39000 },
  { label: "超剣豪", minScore: 42000 },
  { label: "超剣帝", minScore: 45000 },
  { label: "超剣神", minScore: 48000 },
  { label: "超剣聖", minScore: 51000 },
  { label: "超魔神", minScore: 54000 },
  { label: "超大魔神", minScore: 57000 },
  { label: "極剣豪", minScore: 60000 },
  { label: "極剣帝", minScore: 65000 },
  { label: "極剣神", minScore: 70000 },
  { label: "極剣聖", minScore: 75000 },
  { label: "21世紀の辻斬り", minScore: 80000 },
];

export function getRank(score: number): string {
  let rank = RANKS[0].label;
  for (const r of RANKS) {
    if (score >= r.minScore) rank = r.label;
  }
  return rank;
}
