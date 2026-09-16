import type { Locale } from "./locale";
import type { FuBreakdownItem, MentsuKind, WaitType } from "@/types/fu";
import type { Tile } from "@/types/mahjong";
import { tileLabel } from "@/lib/mahjong";
export const sets: Record<MentsuKind, {ja: string; en: string}> = {
 shuntsu: {ja:"順子",en:"Sequence"}, ankou:{ja:"暗刻",en:"Concealed triplet"}, minkou:{ja:"明刻",en:"Open triplet"}, ankan:{ja:"暗槓",en:"Concealed quad"}, minkan:{ja:"明槓",en:"Open quad"}
};
export const waits: Record<WaitType, {ja: string; en: string}> = {
 ryanmen:{ja:"両面",en:"Two-sided"}, kanchan:{ja:"嵌張",en:"Closed wait"}, penchan:{ja:"辺張",en:"Edge wait"}, tanki:{ja:"単騎",en:"Pair wait"}, shanpon:{ja:"双碰",en:"Double-pair wait"}
};
export function windLabel(wind: string | undefined, locale: Locale) {
 if (!wind || locale === "ja") return wind;
 return ({東:"East",南:"South",西:"West",北:"North"} as Record<string,string>)[wind] ?? wind;
}
export function pairLabel(pair: Tile[], fu: number, original: string | undefined, locale: Locale): string {
 if (locale === "ja") return original ?? "";
 if (!fu || !pair[0]) return "";
 const reason = pair[0].num >= 5 ? "dragon" : fu === 4 ? "seat and round wind" : original?.includes("場風") ? "round wind" : "seat wind";
 return `${tileLabel(pair[0], locale)} (${reason})`;
}
export function fuItemLabel(item: FuBreakdownItem, locale: Locale): string {
 if (locale === "ja") return item.label;
 switch(item.kind) {
  case "base": return "Base fu";
  case "closedRon": return "Closed hand won by discard";
  case "tsumo": return "Self-draw";
  case "set": return item.mentsu ? `${sets[item.mentsu.kind].en}: ${tileLabel(item.mentsu.tiles[0], locale)}` : "Set";
  case "pair": return `Value pair: ${pairLabel(item.pair ?? [], item.fu, item.label, locale)}`;
  case "wait": return item.waitType ? `${waits[item.waitType].en}` : "Wait";
  default: return item.label; // Older externally stored results remain readable.
 }
}
