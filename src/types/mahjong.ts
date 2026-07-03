// 牌の種類
export type Suit = "m" | "p" | "s" | "z"; // 萬子・筒子・索子・字牌

export interface Tile {
  suit: Suit;
  num: number; // 萬子/筒子/索子: 1-9, 字牌: 1-7(東南西北白発中)
  id: string;  // 一意ID（例: "m1_0"）
  isRed?: boolean; // 赤ドラ（赤5）
}

export interface Problem {
  id: string;
  tiles: Tile[];              // 手牌（副露後は14枚未満）
  openSets?: Tile[][];        // 副露牌（ポン/チー/カンのセット）
  isRiichi?: boolean;         // リーチ状態
  dora?: Tile[];              // ドラ表示牌
  correctDiscards: string[];  // 正解牌（suit+num形式）
  difficulty: 1 | 2 | 3;
  description?: string;       // 問題解説
  isAuto: boolean;
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
  incorrectCount: number;
  accuracy: number; // 0-100
  score: number;
  gameMode: "speed" | "casual";
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
  gameMode: "speed" | "casual";
  createdAt: string;
}
