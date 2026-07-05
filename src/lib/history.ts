import { GameResult, Problem, GameAnswer } from "@/types/mahjong";

// ==================== プレイ履歴のローカル保存 ====================
// 端末のlocalStorageに保存する（Supabaseには送らない）

const HISTORY_KEY = "tsujigiri_history";
const BEST_SCORE_KEY = "tsujigiri_best_score";
const MAX_HISTORY = 50; // 保存する最大試合数

// 振り返り用に問題のスナップショットも一緒に保存する
export interface HistoryAnswer {
  answer: GameAnswer;
  problem: Problem | null;
}

export interface GameRecord {
  id: string;
  playedAt: string; // ISO日時
  gameMode: "speed" | "casual";
  correctCount: number;
  totalAnswered: number;
  accuracy: number;
  score: number;
  details: HistoryAnswer[];
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

// 試合結果を履歴に追加
export function saveGameRecord(result: GameResult, problems: Problem[]): void {
  if (!isBrowser()) return;

  const details: HistoryAnswer[] = result.answers.map((answer) => ({
    answer,
    problem: problems.find((p) => p.id === answer.problemId) ?? null,
  }));

  const record: GameRecord = {
    id: `game_${Date.now()}`,
    playedAt: new Date().toISOString(),
    gameMode: result.gameMode,
    correctCount: result.correctCount,
    totalAnswered: result.totalAnswered,
    accuracy: result.accuracy,
    score: result.score,
    details,
  };

  try {
    const history = loadHistory();
    history.unshift(record); // 新しい順
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));

    // 過去最高スコアの更新
    if (result.score > getBestScore()) {
      localStorage.setItem(BEST_SCORE_KEY, String(result.score));
    }
  } catch {
    // 容量オーバーなどで保存できなくてもゲームは続行できるようにする
  }
}

// 履歴一覧を取得（新しい順）
export function loadHistory(): GameRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 履歴を全消去
export function clearHistory(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(BEST_SCORE_KEY);
}

// 過去最高スコア
export function getBestScore(): number {
  if (!isBrowser()) return 0;
  const raw = localStorage.getItem(BEST_SCORE_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}
