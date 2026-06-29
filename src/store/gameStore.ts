import { create } from "zustand";
import { Problem, GameAnswer, GameResult, Tile } from "@/types/mahjong";
import { fetchProblems, fetchCasualProblems } from "@/lib/supabase";

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

interface GameState {
  phase: GamePhase;
  gameMode: GameMode;
  problems: Problem[];
  currentIndex: number;
  answers: GameAnswer[];
  lastAnswer: { isCorrect: boolean; tile: Tile } | null;

  gameStartedAt: number | null;
  questionStartedAt: number | null;
  gameTimeLeft: number;
  questionTimeLeft: number;

  startGame: (mode: GameMode) => void;
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
  problems: [],
  currentIndex: 0,
  answers: [],
  lastAnswer: null,
  gameStartedAt: null,
  questionStartedAt: null,
  gameTimeLeft: GAME_DURATION_MS,
  questionTimeLeft: QUESTION_DURATION_MS,

  startGame: async (mode: GameMode) => {
    set({ phase: "loading", gameMode: mode });

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
      questionTimeLeft: QUESTION_DURATION_MS,
    });
  },

  submitAnswer: (tile: Tile) => {
    const { problems, currentIndex, questionStartedAt, answers, gameMode } = get();
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
        questionTimeLeft: gameMode === "speed" ? QUESTION_DURATION_MS : Infinity,
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
    const { gameStartedAt, questionStartedAt, phase, gameMode } = get();
    if (phase !== "playing" || !gameStartedAt || !questionStartedAt) return;

    const gameElapsed = now - gameStartedAt;
    const questionElapsed = now - questionStartedAt;
    const gameTimeLeft = Math.max(0, GAME_DURATION_MS - gameElapsed);
    const questionTimeLeft = gameMode === "speed"
      ? Math.max(0, QUESTION_DURATION_MS - questionElapsed)
      : Infinity;

    if (gameTimeLeft === 0) {
      get().finishGame();
      return;
    }

    if (gameMode === "speed" && questionTimeLeft === 0) {
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
