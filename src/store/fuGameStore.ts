import { create } from "zustand";
import { GameAnswer, GameResult, GameMode } from "@/types/mahjong";
import { FuProblem, FuResult } from "@/types/fu";
import { generateFuProblem, computeFu, generateChoices } from "@/lib/fu";
import { saveGameRecord } from "@/lib/history";

export type FuGamePhase =
  | "idle"
  | "loading"
  | "playing"
  | "answered"
  | "finished";

const GAME_DURATION_MS = 60_000;
const QUESTION_DURATION_MS = 5_000;
const ANSWER_DISPLAY_MS = 500;
const ROUND_POOL_SIZE = 200;
const ONI_MAX_MULTIPLIER = 8;
const BASE_SCORE = 100; // 何切るモードと同じ配点（4択の難易度感が近いため）
const PENALTY_SCORE = 50;

export interface FuRound {
  problem: FuProblem;
  result: FuResult;
  choices: number[];
}

interface FuGameState {
  phase: FuGamePhase;
  oniMode: boolean;
  rounds: FuRound[];
  currentIndex: number;
  answers: GameAnswer[];
  lastAnswer: { isCorrect: boolean; chosenFu: number } | null;

  gameStartedAt: number | null;
  questionStartedAt: number | null;
  gameTimeLeft: number;
  questionTimeLeft: number;

  startGame: (oni?: boolean) => void;
  submitAnswer: (chosenFu: number) => void;
  timeoutQuestion: () => void;
  tickGame: (now: number) => void;
  finishGame: () => void;
  resetGame: () => void;

  getResult: () => GameResult;
}

function generatePool(size: number): FuRound[] {
  return Array.from({ length: size }, (_, i) => {
    const problem = generateFuProblem(`fu_${Date.now()}_${i}_${Math.random()}`);
    const result = computeFu(problem);
    const choices = generateChoices(result.total);
    return { problem, result, choices };
  });
}

export const useFuGameStore = create<FuGameState>((set, get) => ({
  phase: "idle",
  oniMode: false,
  rounds: [],
  currentIndex: 0,
  answers: [],
  lastAnswer: null,
  gameStartedAt: null,
  questionStartedAt: null,
  gameTimeLeft: GAME_DURATION_MS,
  questionTimeLeft: QUESTION_DURATION_MS,

  startGame: (oni: boolean = false) => {
    set({ phase: "loading", oniMode: oni });

    const rounds = generatePool(ROUND_POOL_SIZE);
    const now = Date.now();
    set({
      phase: "playing",
      rounds,
      currentIndex: 0,
      answers: [],
      lastAnswer: null,
      gameStartedAt: now,
      questionStartedAt: now,
      gameTimeLeft: GAME_DURATION_MS,
      questionTimeLeft: oni ? QUESTION_DURATION_MS : Infinity,
    });
  },

  submitAnswer: (chosenFu: number) => {
    const { rounds, currentIndex, questionStartedAt, answers, oniMode } = get();
    const round = rounds[currentIndex];
    if (!round) return;

    const isCorrect = chosenFu === round.result.total;
    const timeMs = Date.now() - (questionStartedAt ?? Date.now());

    const answer: GameAnswer = {
      problemId: round.problem.id,
      chosenFu,
      correctFu: round.result.total,
      isCorrect,
      timeMs,
    };

    set({
      phase: "answered",
      lastAnswer: { isCorrect, chosenFu },
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
    const { rounds, currentIndex, answers } = get();
    const round = rounds[currentIndex];
    if (!round) return;

    const answer: GameAnswer = {
      problemId: round.problem.id,
      correctFu: round.result.total,
      timedOut: true,
      isCorrect: false,
      timeMs: QUESTION_DURATION_MS,
    };

    set({
      phase: "answered",
      lastAnswer: { isCorrect: false, chosenFu: -1 },
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
    const { rounds } = get();
    saveGameRecord(get().getResult(), rounds.map((r) => r.problem));
  },

  resetGame: () => {
    set({
      phase: "idle",
      oniMode: false,
      rounds: [],
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
    const { answers, gameStartedAt, oniMode } = get();
    const totalAnswered = answers.filter((a) => !a.timedOut).length;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const incorrectCount = answers.filter((a) => !a.isCorrect).length;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    let rawScore: number;
    if (oniMode) {
      let gain = BASE_SCORE;
      let earned = 0;
      for (const a of answers) {
        if (a.isCorrect) {
          earned += gain;
          gain = Math.min(gain * 2, BASE_SCORE * ONI_MAX_MULTIPLIER);
        } else {
          gain = BASE_SCORE;
        }
      }
      rawScore = earned - incorrectCount * PENALTY_SCORE + accuracy;
    } else {
      rawScore = correctCount * BASE_SCORE - incorrectCount * PENALTY_SCORE + accuracy;
    }
    const score = Math.max(0, rawScore);
    const gameMode: GameMode = "fu";

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

// デバッグ用: ブラウザコンソールから window.__fuGameStore で状態を確認できる
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__fuGameStore = useFuGameStore;
}
