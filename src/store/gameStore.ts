import { create } from "zustand";
import { Problem, GameAnswer, GameResult, Tile } from "@/types/mahjong";
import { fetchProblems, fetchCasualProblems } from "@/lib/supabase";
import { saveGameRecord } from "@/lib/history";

export type GamePhase =
  | "idle"
  | "loading"
  | "playing"
  | "answered"
  | "finished";

export type GameMode = "speed" | "casual";

const GAME_DURATION_MS = 60_000;
const QUESTION_DURATION_MS = 5_000;
const ANSWER_DISPLAY_MS = 500;
const PROBLEM_POOL_SIZE = 200;
const ONI_BASE_GAIN = 1000; // 鬼モード: 正解1問目の獲得点（連続正解で倍々）

interface GameState {
  phase: GamePhase;
  gameMode: GameMode;
  oniMode: boolean; // 清一色モードのみ: 1問5秒制限＋連続正解で獲得点倍々
  problems: Problem[];
  currentIndex: number;
  answers: GameAnswer[];
  lastAnswer: { isCorrect: boolean; tile: Tile } | null;

  gameStartedAt: number | null;
  questionStartedAt: number | null;
  gameTimeLeft: number;
  questionTimeLeft: number;

  startGame: (mode: GameMode, oni?: boolean) => void;
  submitAnswer: (tile: Tile) => void;
  timeoutQuestion: () => void;
  tickGame: (now: number) => void;
  finishGame: () => void;
  resetGame: () => void;

  getResult: () => GameResult;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "idle",
  gameMode: "speed",
  oniMode: false,
  problems: [],
  currentIndex: 0,
  answers: [],
  lastAnswer: null,
  gameStartedAt: null,
  questionStartedAt: null,
  gameTimeLeft: GAME_DURATION_MS,
  questionTimeLeft: QUESTION_DURATION_MS,

  startGame: async (mode: GameMode, oni: boolean = false) => {
    const oniMode = mode === "speed" && oni;
    set({ phase: "loading", gameMode: mode, oniMode });

    const dbProblems = mode === "casual"
      ? await fetchCasualProblems()
      : await fetchProblems();

    if (dbProblems.length === 0) {
      alert("問題が登録されていません。Supabaseに問題を追加してください。");
      set({ phase: "idle" });
      return;
    }

    const repeated: Problem[] = [];
    while (repeated.length < PROBLEM_POOL_SIZE) {
      const shuffled = [...dbProblems].sort(() => Math.random() - 0.5);
      repeated.push(...shuffled);
    }
    const problems = repeated.slice(0, PROBLEM_POOL_SIZE);

    const now = Date.now();
    set({
      phase: "playing",
      problems,
      currentIndex: 0,
      answers: [],
      lastAnswer: null,
      gameStartedAt: now,
      questionStartedAt: now,
      gameTimeLeft: GAME_DURATION_MS,
      questionTimeLeft: oniMode ? QUESTION_DURATION_MS : Infinity,
    });
  },

  submitAnswer: (tile: Tile) => {
    const { problems, currentIndex, questionStartedAt, answers, oniMode } = get();
    const problem = problems[currentIndex];
    if (!problem) return;

    const isCorrect = problem.correctDiscards.includes(`${tile.suit}${tile.num}`);
    const timeMs = Date.now() - (questionStartedAt ?? Date.now());

    const answer: GameAnswer = {
      problemId: problem.id,
      discardedTile: tile,
      isCorrect,
      timeMs,
    };

    set({
      phase: "answered",
      lastAnswer: { isCorrect, tile },
      answers: [...answers, answer],
    });

    setTimeout(() => {
      const { gameTimeLeft, phase } = get();
      if (phase === "finished") return;
      if (gameTimeLeft <= 0) {
        get().finishGame();
        return;
      }
      set({
        phase: "playing",
        currentIndex: get().currentIndex + 1,
        questionStartedAt: Date.now(),
        questionTimeLeft: oniMode ? QUESTION_DURATION_MS : Infinity,
        lastAnswer: null,
      });
    }, ANSWER_DISPLAY_MS);
  },

  timeoutQuestion: () => {
    const { problems, currentIndex, answers } = get();
    const problem = problems[currentIndex];
    if (!problem) return;

    const answer: GameAnswer = {
      problemId: problem.id,
      discardedTile: { suit: "m", num: 0, id: "timeout" },
      isCorrect: false,
      timeMs: QUESTION_DURATION_MS,
    };

    set({
      phase: "answered",
      lastAnswer: { isCorrect: false, tile: { suit: "m", num: 0, id: "timeout" } },
      answers: [...answers, answer],
    });

    setTimeout(() => {
      const { gameTimeLeft, phase } = get();
      if (phase === "finished") return;
      if (gameTimeLeft <= 0) {
        get().finishGame();
        return;
      }
      set({
        phase: "playing",
        currentIndex: get().currentIndex + 1,
        questionStartedAt: Date.now(),
        questionTimeLeft: QUESTION_DURATION_MS,
        lastAnswer: null,
      });
    }, ANSWER_DISPLAY_MS);
  },

  tickGame: (now: number) => {
    const { gameStartedAt, questionStartedAt, phase, oniMode } = get();
    if (phase !== "playing" || !gameStartedAt || !questionStartedAt) return;

    const gameElapsed = now - gameStartedAt;
    const questionElapsed = now - questionStartedAt;
    const gameTimeLeft = Math.max(0, GAME_DURATION_MS - gameElapsed);
    const questionTimeLeft = oniMode
      ? Math.max(0, QUESTION_DURATION_MS - questionElapsed)
      : Infinity;

    if (gameTimeLeft === 0) {
      get().finishGame();
      return;
    }

    if (oniMode && questionTimeLeft === 0) {
      get().timeoutQuestion();
      return;
    }

    set({ gameTimeLeft, questionTimeLeft });
  },

  finishGame: () => {
    set({ phase: "finished", gameTimeLeft: 0 });
    // プレイ履歴を端末に保存
    const { problems } = get();
    saveGameRecord(get().getResult(), problems);
  },

  resetGame: () => {
    set({
      phase: "idle",
      oniMode: false,
      problems: [],
      currentIndex: 0,
      answers: [],
      lastAnswer: null,
      gameStartedAt: null,
      questionStartedAt: null,
      gameTimeLeft: GAME_DURATION_MS,
      questionTimeLeft: QUESTION_DURATION_MS,
    });
  },

  getResult: (): GameResult => {
    const { answers, gameStartedAt, gameMode, oniMode } = get();
    const totalAnswered = answers.filter((a) => a.discardedTile.id !== "timeout").length;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const incorrectCount = answers.filter((a) => !a.isCorrect).length;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    let rawScore: number;
    if (gameMode === "casual") {
      rawScore = correctCount * 100 - incorrectCount * 50 + accuracy;
    } else if (oniMode) {
      // 鬼モード: 連続正解で獲得点が倍々(1000→2000→4000...)、不正解・時間切れで1000に戻る
      let gain = ONI_BASE_GAIN;
      let earned = 0;
      for (const a of answers) {
        if (a.isCorrect) {
          earned += gain;
          gain *= 2;
        } else {
          gain = ONI_BASE_GAIN;
        }
      }
      rawScore = earned - incorrectCount * 300 + accuracy;
    } else {
      rawScore = correctCount * 1000 - incorrectCount * 300 + accuracy;
    }
    const score = Math.max(0, rawScore);
    return {
      totalAnswered: answers.length,
      correctCount,
      incorrectCount,
      accuracy,
      score,
      gameMode,
      oniMode,
      answers,
      durationMs: gameStartedAt ? Date.now() - gameStartedAt : 0,
    };
  },
}));

// デバッグ用: ブラウザコンソールから window.__gameStore で状態を確認できる
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__gameStore = useGameStore;
}
