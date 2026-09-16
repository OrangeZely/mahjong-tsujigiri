import type { Locale } from "@/i18n/locale";
export interface Rank {
  label: string;
  labelEn: string;
  minScore: number;
}

// 称号テーブル（武士テーマ / 2026-07-09 リニューアル）
//   段位: 初段〜10段（1000〜1900）
//   武士の位: 足軽→旗本→軍師→大名→浪人→剣客→師範→大将→将軍（2000〜13000）
//   神域: 魔神・大魔神〜剣豪/剣帝/剣神/剣聖（大・真・超・極）（14000〜75000）
//   頂点: 21世紀の辻斬り（80000）
// ※スコアが minScore 未満の場合は先頭の「初段」が既定として表示される
export const RANKS: Rank[] = [
  { label: "初段", labelEn: "1st Dan", minScore: 1000 },
  { label: "2段", labelEn: "2nd Dan", minScore: 1100 },
  { label: "3段", labelEn: "3rd Dan", minScore: 1200 },
  { label: "4段", labelEn: "4th Dan", minScore: 1300 },
  { label: "5段", labelEn: "5th Dan", minScore: 1400 },
  { label: "6段", labelEn: "6th Dan", minScore: 1500 },
  { label: "7段", labelEn: "7th Dan", minScore: 1600 },
  { label: "8段", labelEn: "8th Dan", minScore: 1700 },
  { label: "9段", labelEn: "9th Dan", minScore: 1800 },
  { label: "10段", labelEn: "10th Dan", minScore: 1900 },
  { label: "初級足軽", labelEn: "Novice Foot Soldier", minScore: 2000 },
  { label: "中級足軽", labelEn: "Veteran Foot Soldier", minScore: 2400 },
  { label: "上級足軽", labelEn: "Elite Foot Soldier", minScore: 2700 },
  { label: "初級旗本", labelEn: "Novice Bannerman", minScore: 3000 },
  { label: "中級旗本", labelEn: "Veteran Bannerman", minScore: 3400 },
  { label: "上級旗本", labelEn: "Elite Bannerman", minScore: 3700 },
  { label: "初級軍師", labelEn: "Novice Strategist", minScore: 4000 },
  { label: "中級軍師", labelEn: "Veteran Strategist", minScore: 4400 },
  { label: "上級軍師", labelEn: "Elite Strategist", minScore: 4700 },
  { label: "初級大名", labelEn: "Novice Daimyo", minScore: 5000 },
  { label: "中級大名", labelEn: "Veteran Daimyo", minScore: 5400 },
  { label: "上級大名", labelEn: "Elite Daimyo", minScore: 5700 },
  { label: "初級浪人", labelEn: "Novice Ronin", minScore: 6000 },
  { label: "中級浪人", labelEn: "Veteran Ronin", minScore: 6400 },
  { label: "上級浪人", labelEn: "Elite Ronin", minScore: 6700 },
  { label: "初級剣客", labelEn: "Novice Swordsman", minScore: 7000 },
  { label: "中級剣客", labelEn: "Veteran Swordsman", minScore: 7400 },
  { label: "上級剣客", labelEn: "Elite Swordsman", minScore: 7700 },
  { label: "初級師範", labelEn: "Novice Swordmaster", minScore: 8000 },
  { label: "中級師範", labelEn: "Veteran Swordmaster", minScore: 8400 },
  { label: "上級師範", labelEn: "Elite Swordmaster", minScore: 8700 },
  { label: "初級大将", labelEn: "Novice General", minScore: 9000 },
  { label: "中級大将", labelEn: "Veteran General", minScore: 9400 },
  { label: "上級大将", labelEn: "Elite General", minScore: 9700 },
  { label: "初級将軍", labelEn: "Novice Shogun", minScore: 10000 },
  { label: "中級将軍", labelEn: "Veteran Shogun", minScore: 12000 },
  { label: "上級将軍", labelEn: "Elite Shogun", minScore: 13000 },
  { label: "魔神", labelEn: "Demon Lord", minScore: 14000 },
  { label: "大魔神", labelEn: "Great Demon Lord", minScore: 15000 },
  { label: "剣豪", labelEn: "Sword Champion", minScore: 16000 },
  { label: "剣帝", labelEn: "Sword Emperor", minScore: 17000 },
  { label: "剣神", labelEn: "Sword Deity", minScore: 18000 },
  { label: "剣聖", labelEn: "Sword Saint", minScore: 19000 },
  { label: "大剣豪", labelEn: "Great Sword Champion", minScore: 21000 },
  { label: "大剣帝", labelEn: "Great Sword Emperor", minScore: 23000 },
  { label: "大剣神", labelEn: "Great Sword Deity", minScore: 25000 },
  { label: "大剣聖", labelEn: "Great Sword Saint", minScore: 27000 },
  { label: "真剣豪", labelEn: "True Sword Champion", minScore: 30000 },
  { label: "真剣帝", labelEn: "True Sword Emperor", minScore: 33000 },
  { label: "真剣神", labelEn: "True Sword Deity", minScore: 36000 },
  { label: "真剣聖", labelEn: "True Sword Saint", minScore: 39000 },
  { label: "超剣豪", labelEn: "Transcendent Sword Champion", minScore: 42000 },
  { label: "超剣帝", labelEn: "Transcendent Sword Emperor", minScore: 45000 },
  { label: "超剣神", labelEn: "Transcendent Sword Deity", minScore: 48000 },
  { label: "超剣聖", labelEn: "Transcendent Sword Saint", minScore: 51000 },
  { label: "超魔神", labelEn: "Transcendent Demon Lord", minScore: 54000 },
  { label: "超大魔神", labelEn: "Transcendent Great Demon Lord", minScore: 57000 },
  { label: "極剣豪", labelEn: "Supreme Sword Champion", minScore: 60000 },
  { label: "極剣帝", labelEn: "Supreme Sword Emperor", minScore: 65000 },
  { label: "極剣神", labelEn: "Supreme Sword Deity", minScore: 70000 },
  { label: "極剣聖", labelEn: "Supreme Sword Saint", minScore: 75000 },
  { label: "21世紀の辻斬り", labelEn: "Tsujigiri of the 21st Century", minScore: 80000 },
];

export function getRank(score: number, locale: Locale = "ja"): string {
  let rank = locale === "en" ? RANKS[0].labelEn : RANKS[0].label;
  for (const r of RANKS) {
    if (score >= r.minScore) rank = locale === "en" ? r.labelEn : r.label;
  }
  return rank;
}
