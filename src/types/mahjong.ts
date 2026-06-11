// 牌の種類
export type Suit = "m" | "p" | "s" | "z"; // 萬子・筒子・索子・字牌

export interface Tile {
  suit: Suit;
  num: number; // 萬子/筒子/索子: 1-9, 字牌: 1-7(東南西北白発中)
  id: string;  // 一意ID（例: "m1_0"）
}

export interface Problem {
  id: string;
  tiles: Tile[];          // 手牌13枚
  correctDiscards: string[]; // 正解牌のID群（suit+num形式）
  difficulty: 1 | 2 | 3;
  description?: string;   // 問題解説
  isAuto: boolean;        // 自動生成かどうか
}

export interface GameAnswer {
  problemId: string;
  discardedTile: Tile;
  isCorrect: boolean;
  timeMs: number;
}

export interface GameResult {
  totalAnswered: number;
  correctCount: number;
  accuracy: number; // 0-100
  score: number;
  answers: GameAnswer[];
  durationMs: number;
}

export interface RankingEntry {
  id: string;
  playerName: string;
  correctCount: number;
  totalAnswered: number;
  accuracy: number;
  score: number;
  createdAt: string;
}
