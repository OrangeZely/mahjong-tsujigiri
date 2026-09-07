"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFuGameStore } from "@/store/fuGameStore";
import { FuHand, FuContextTags } from "@/components/FuHandDisplay";

export default function FuGameBoard() {
  const {
    phase,
    oniMode,
    rounds,
    currentIndex,
    lastAnswer,
    gameTimeLeft,
    questionTimeLeft,
    answers,
    submitAnswer,
    tickGame,
  } = useFuGameStore();

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "playing" && phase !== "answered") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      tickGame(Date.now());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, tickGame]);

  const round = rounds[currentIndex];
  if (!round) return null;

  const gameSeconds = Math.ceil(gameTimeLeft / 1000);
  const questionSeconds = Math.ceil(questionTimeLeft / 1000);
  const questionProgress = (questionTimeLeft / 5000) * 100;
  const gameProgress = (gameTimeLeft / 60000) * 100;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalAnswered = answers.length;

  let combo = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].isCorrect) combo++;
    else break;
  }
  const oniBase = 100;
  const nextGain = Math.min(oniBase * Math.pow(2, combo), oniBase * 8);

  const isDisabled = phase === "answered";

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto px-2 py-4">
      {/* 上部ステータスバー */}
      <div className="w-full flex items-center justify-between bg-gray-900 text-white rounded-xl px-4 py-3">
        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-xs text-gray-400">残り時間</span>
          <span className={`text-3xl font-black tabular-nums ${gameSeconds <= 10 ? "text-red-400 animate-pulse" : "text-white"}`}>
            {gameSeconds}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">正解 / 回答</span>
          <span className="text-2xl font-bold">
            <span className="text-green-400">{correctCount}</span>
            <span className="text-gray-500 text-lg"> / {totalAnswered}</span>
          </span>
        </div>

        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-xs text-gray-400">問題</span>
          <span className="text-xl font-bold text-yellow-300">#{currentIndex + 1}</span>
        </div>
      </div>

      {/* ゲーム進捗バー */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-none"
          style={{ width: `${gameProgress}%` }}
        />
      </div>

      {/* 問題タイマー＆コンボ（鬼斬りモードのみ） */}
      {oniMode && (
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>
              🧮 次の正解{" "}
              <span className={`font-bold ${combo > 0 ? "text-red-400" : "text-gray-400"}`}>
                +{nextGain.toLocaleString()}点
              </span>
              {combo > 0 && (
                <span className="ml-1 text-yellow-400 font-bold">({combo}連斬中!)</span>
              )}
            </span>
            <span className={questionSeconds <= 2 ? "text-red-500 font-bold" : ""}>
              {questionSeconds}秒
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-none ${
                questionSeconds <= 2
                  ? "bg-red-500"
                  : questionSeconds <= 3
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${questionProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 正解/不正解オーバーレイ */}
      <AnimatePresence>
        {phase === "answered" && lastAnswer && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="absolute z-10"
          >
            <div
              className={`text-5xl font-black px-8 py-4 rounded-2xl shadow-2xl ${
                lastAnswer.isCorrect
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {lastAnswer.isCorrect ? "✓ 正解！" : "✗ 不正解"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 状況タグ */}
      <FuContextTags problem={round.problem} />

      {/* 手牌 */}
      <div className="w-full bg-green-900 rounded-2xl px-2 py-4 shadow-xl border border-green-700">
        <p className="text-center text-green-300 text-sm mb-3 font-medium tracking-wide">
          この手牌の合計符は？（黄色い枠＝和了牌）
        </p>
        <FuHand problem={round.problem} />
      </div>

      {/* 4択 */}
      <div className="w-full grid grid-cols-2 gap-2">
        {round.choices.map((c) => {
          const isCorrectChoice = c === round.result.total;
          const isSelected = lastAnswer?.chosenFu === c;
          let cls = "bg-white/10 border-white/20 text-white hover:bg-white/20";
          if (isDisabled) {
            if (isCorrectChoice) {
              cls = "bg-green-500/30 border-green-400 text-green-200";
            } else if (isSelected) {
              cls = "bg-red-500/30 border-red-400 text-red-200";
            } else {
              cls = "bg-white/5 border-white/10 text-gray-500";
            }
          }
          return (
            <button
              key={c}
              onClick={isDisabled ? undefined : () => submitAnswer(c)}
              disabled={isDisabled}
              className={`border-2 rounded-xl py-4 font-black text-xl transition-colors ${cls}`}
            >
              {c}符
            </button>
          );
        })}
      </div>
    </div>
  );
}
