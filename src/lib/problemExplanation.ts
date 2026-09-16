import translations from "@/i18n/problem-explanations.json";
import type { Problem, GameMode } from "@/types/mahjong";
import type { Locale } from "@/i18n/locale";
type Translation = {source: string; tiles: string[]; discards: string[]; en: string};
const tables = translations as Record<string, Record<string, Translation>>;
export function problemExplanation(problem: Problem, locale: Locale, mode: GameMode): {text: string; language: Locale} {
  if (locale === "ja") return {text: problem.description ?? "", language: "ja"};
  if (problem.descriptionEn?.trim()) return {text: problem.descriptionEn, language: "en"};
  // Bundled reviewed copy works before the DB migration and for old local history.
  // Never apply a translation to changed content with a reused ID.
  const item = tables[mode === "casual" ? "problems_casual" : "problems"][problem.id];
  const tiles = problem.tiles.map(t => `${t.suit}${t.num}${t.isRed ? "r" : ""}`).sort();
  if (item && item.source === (problem.description ?? "") && JSON.stringify(item.tiles) === JSON.stringify(tiles) && JSON.stringify(item.discards) === JSON.stringify([...problem.correctDiscards].sort())) {
    return {text: item.en, language: "en"};
  }
  return {text: problem.description ?? "", language: "ja"};
}
