import { create } from "zustand";
import { Problem, GameAnswer, GameResult, Tile } from "@/types/mahjong";
import { fetchProblems } from "@/lib/supabase";

export type GamePhase =
  | "idle"        // スタート前
  | "playing"     // プレイ中
  | "answered"    // 1問回答直後（0.5秒表示）
  | "finished";   // 1分終了

const GAME_DURATION_MS = 60_000;
const QUESTION_DURATION_MS = 5_000;
const ANSWER_DISPLAY_MS = 500;
const PROBLEM_POOL_SIZE = 200;

interface GameState {
  phase: GamePhase;
  problems: Problem[];
  currentIndex: number;
  answers: GameAnswer[];
  lastAnswer: { isCorrect: boolean; tile: Tile } | null;

  // タイマー
  gameStartedAt: number | null;
  questionStartedAt: number | null;
  gameTimeLeft: number;   // ms
  questionTimeLeft: number; // ms

  // アクション
  startGame: () => void;
  submitAnswer: (tile: Tile) => void;
  timeoutQuestion: () => void;
  tickGame: (now: number) => void;
  finishGame: () => void;
  resetGame: () => void;

  // 結果
  getResult: () => GameResult;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "idle",
  problems: [],
  currentIndex: 0,
  answers: [],
  lastAnswer: null,
  gameStartedAt: null,
  questionStartedAt: null,
  gameTimeLeft: GAME_DURATION_MS,
  questionTimeLeft: QUESTION_DURATION_MS,

  startGame: async () => {
    const now = Date.now();
    // まずローディング状態にする
    set({
      phase: "playing",
      problems: [],
      currentIndex: 0,
      answers: [],
      lastAnswer: null,
      gameStartedAt: now,
      questionStartedAt: now,
      gameTimeLeft: GAME_DURATION_MS,
      questionTimeLeft: QUESTION_DURATION_MS,
    });

    // DBから問題を取得してループしながら200問分用意
    const dbProblems = await fetchProblems();
    const repeated: Problem[] = [];
    while (repeated.length < PROBLEM_POOL_SIZE) {
      repeated.push(...dbProblems);
    }
    const problems = repeated.slice(0, PROBLEM_POOL_SIZE);

    set({ problems });
  },

  submitAnswer: (tile: Tile) => {
    const { problems, currentIndex, questionStartedAt, answers } = get();
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

    // 0.5秒後に次の問題へ
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
    const { gameStartedAt, questionStartedAt, phase } = get();
    if (phase !== "playing" || !gameStartedAt || !questionStartedAt) return;

    const gameElapsed = now - gameStartedAt;
    const questionElapsed = now - questionStartedAt;
    const gameTimeLeft = Math.max(0, GAME_DURATION_MS - gameElapsed);
    const questionTimeLeft = Math.max(0, QUESTION_DURATION_MS - questionElapsed);

    if (gameTimeLeft === 0) {
      get().finishGame();
      return;
    }

    if (questionTimeLeft === 0) {
      get().timeoutQuestion();
      return;
    }

    set({ gameTimeLeft, questionTimeLeft });
  },

  finishGame: () => {
    set({ phase: "finished", gameTimeLeft: 0 });
  },

  resetGame: () => {
    set({
      phase: "idle",
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
    const { answers, gameStartedAt } = get();
    const totalAnswered = answers.filter((a) => a.discardedTile.id !== "timeout").length;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const score = correctCount * 100 + accuracy;
    return {
      totalAnswered: answers.length,
      correctCount,
      accuracy,
      score,
      answers,
      durationMs: gameStartedAt ? Date.now() - gameStartedAt : 0,
    };
  },
}));
