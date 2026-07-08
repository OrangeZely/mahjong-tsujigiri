export interface Rank {
  label: string;
  minScore: number;
}

// 称号はモードごとに狙える帯で棲み分ける設計:
//   0〜2,200      カジュアル帯（何切るモード: 1問100点 → 100点刻みの段位）
//   2,300〜19,000 清一色帯（通常: 1問1,000点・不正解−300点 → 200〜1,000点刻み）
//   20,000〜      鬼帯（連続正解ボーナス込み → 10,000点刻み）
// 最上位「令和の辻斬り」150,000点は鬼モードで約21問連続ノーミス相当
export const RANKS: Rank[] = [
  // --- カジュアル帯 ---
  { label: "初段", minScore: 0 },
  { label: "2段", minScore: 1100 },
  { label: "3段", minScore: 1200 },
  { label: "4段", minScore: 1300 },
  { label: "5段", minScore: 1400 },
  { label: "6段", minScore: 1500 },
  { label: "7段", minScore: 1600 },
  { label: "8段", minScore: 1700 },
  { label: "9段", minScore: 1800 },
  { label: "10段", minScore: 1900 },
  { label: "初級賢者", minScore: 2000 },
  { label: "中級賢者", minScore: 2100 },
  { label: "上級賢者", minScore: 2200 },
  // --- 清一色帯 ---
  { label: "初級武者", minScore: 2300 },
  { label: "中級武者", minScore: 2500 },
  { label: "上級武者", minScore: 2700 },
  { label: "初級闘者", minScore: 2900 },
  { label: "中級闘者", minScore: 3100 },
  { label: "上級闘者", minScore: 3300 },
  { label: "初級覇者", minScore: 3500 },
  { label: "中級覇者", minScore: 3700 },
  { label: "上級覇者", minScore: 3900 },
  { label: "初級賢王", minScore: 4200 },
  { label: "中級賢王", minScore: 4500 },
  { label: "上級賢王", minScore: 4800 },
  { label: "初級武王", minScore: 5100 },
  { label: "中級武王", minScore: 5400 },
  { label: "上級武王", minScore: 5700 },
  { label: "初級闘王", minScore: 6000 },
  { label: "中級闘王", minScore: 6300 },
  { label: "上級闘王", minScore: 6600 },
  { label: "初級覇王", minScore: 6900 },
  { label: "中級覇王", minScore: 7200 },
  { label: "上級覇王", minScore: 7500 },
  { label: "初級賢神", minScore: 8000 },
  { label: "中級賢神", minScore: 8500 },
  { label: "上級賢神", minScore: 9000 },
  { label: "初級武神", minScore: 9500 },
  { label: "中級武神", minScore: 10000 },
  { label: "上級武神", minScore: 10500 },
  { label: "初級闘神", minScore: 11000 },
  { label: "中級闘神", minScore: 11500 },
  { label: "上級闘神", minScore: 12000 },
  { label: "初級覇神", minScore: 12500 },
  { label: "中級覇神", minScore: 13000 },
  { label: "上級覇神", minScore: 13500 },
  { label: "魔神", minScore: 14000 },
  { label: "大魔神", minScore: 15000 },
  { label: "雀豪", minScore: 16000 },
  { label: "雀帝", minScore: 17000 },
  { label: "雀神", minScore: 18000 },
  { label: "雀聖", minScore: 19000 },
  // --- 鬼帯 ---
  { label: "光賢者", minScore: 20000 },
  { label: "光武者", minScore: 30000 },
  { label: "光闘者", minScore: 40000 },
  { label: "光覇者", minScore: 50000 },
  { label: "真賢王", minScore: 60000 },
  { label: "真武王", minScore: 70000 },
  { label: "真闘王", minScore: 80000 },
  { label: "真覇王", minScore: 90000 },
  { label: "超賢神", minScore: 100000 },
  { label: "超武神", minScore: 110000 },
  { label: "超闘神", minScore: 120000 },
  { label: "超覇神", minScore: 130000 },
  { label: "超大魔神", minScore: 140000 },
  { label: "令和の辻斬り", minScore: 150000 },
];

export function getRank(score: number): string {
  let rank = RANKS[0].label;
  for (const r of RANKS) {
    if (score >= r.minScore) rank = r.label;
  }
  return rank;
}
