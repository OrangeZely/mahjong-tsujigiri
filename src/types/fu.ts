import { Tile } from "@/types/mahjong";

// 面子の種別
export type MentsuKind = "shuntsu" | "ankou" | "minkou" | "ankan" | "minkan";

// 待ちの形
export type WaitType = "ryanmen" | "kanchan" | "penchan" | "tanki" | "shanpon";

export type WinType = "tsumo" | "ron";

export interface FuMentsu {
  kind: MentsuKind;
  tiles: Tile[]; // shuntsu/kotsu系=3枚、槓子=4枚
  isYaochu: boolean; // 么九（1,9,字牌）を含む面子か
  winningTileLocalIndex?: number; // この面子が待ちの対象のとき、tiles内の和了牌の位置
}

export interface FuProblem {
  id: string;
  mentsuList: FuMentsu[]; // 常に4面子
  pair: Tile[]; // 雀頭（2枚）
  pairFu: 0 | 2 | 4;
  pairReason?: string; // 役牌雀頭のときの表示用理由（例: "白（三元牌）"）
  waitType: WaitType;
  waitGroupIndex: number; // 和了牌が完成させた面子のindex（雀頭完成=単騎のときは-1）
  winType: WinType;
  isMenzen: boolean; // 面前（鳴きなし）かどうか
  roundWind?: string; // 場風の表示（風牌役牌の文脈用）
  seatWind?: string; // 自風の表示
}

export interface FuBreakdownItem {
  label: string;
  fu: number;
}

export interface FuResult {
  items: FuBreakdownItem[];
  rawTotal: number; // 切り上げ前
  total: number; // 最終符（切り上げ・特殊ルール適用後）
  isPinfuTsumo: boolean;
  isKuipinfuRon: boolean;
}
