"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import Tile from "./Tile";
import { Tile as TileType } from "@/types/mahjong";

export default function GameBoard() {
  const {
    phase,
    problems,
    currentIndex,
    lastAnswer,
    gameTimeLeft,
    questionTimeLeft,
    answers,
    submitAnswer,
    tickGame,
  } = useGameStore();

  const rafRef = useRef<number | null>(null);

  // ゲームタイマー（requestAnimationFrame）
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

  const problem = problems[currentIndex];
  if (!problem) return null;

  const gameSeconds = Math.ceil(gameTimeLeft / 1000);
  const questionSeconds = Math.ceil(questionTimeLeft / 1000);
  const questionProgress = (questionTimeLeft / 5000) * 100;
  const gameProgress = (gameTimeLeft / 60000) * 100;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalAnswered = answers.length;

  const isDisabled = phase === "answered";

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto px-2 py-4">

      {/* 上部ステータスバー */}
      <div className="w-full flex items-center justify-between bg-gray-900 text-white rounded-xl px-4 py-3">
        {/* 残り時間 */}
        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-xs text-gray-400">残り時間</span>
          <span className={`text-3xl font-black tabular-nums ${gameSeconds <= 10 ? "text-red-400 animate-pulse" : "text-white"}`}>
            {gameSeconds}
          </span>
        </div>

        {/* スコア */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">正解 / 回答</span>
          <span className="text-2xl font-bold">
            <span className="text-green-400">{correctCount}</span>
            <span className="text-gray-500 text-lg"> / {totalAnswered}</span>
          </span>
        </div>

        {/* 問題番号 */}
        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-xs text-gray-400">問題</span>
          <span className="text-xl font-bold text-yellow-300">#{currentIndex + 1}</span>
        </div>
      </div>

      {/* ゲーム進捗バー */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-none"
          style={{ width: `${gameProgress}%` }}
        />
      </div>

      {/* 問題タイマー */}
      <div className="w-full">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>何を切る？</span>
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

      {/* 手牌エリア */}
      <div className="w-full bg-green-900 rounded-2xl px-2 py-3 shadow-xl border border-green-700">
        <p className="text-center text-green-300 text-sm mb-3 font-medium tracking-wide">
          切る牌をタップ
        </p>
        <div className="flex justify-between w-full gap-0.5">
          {problem.tiles.map((tile: TileType) => {
            let highlighted = false;
            let wrong = false;

            if (phase === "answered" && lastAnswer) {
              if (
                lastAnswer.isCorrect &&
                tile.id === lastAnswer.tile.id
              ) {
                highlighted = true;
              } else if (
                !lastAnswer.isCorrect &&
                tile.id === lastAnswer.tile.id
              ) {
                wrong = true;
              } else if (
                !lastAnswer.isCorrect &&
                problem.correctDiscards.includes(`${tile.suit}${tile.num}`)
              ) {
                highlighted = true; // 正解牌を緑で表示
              }
            }

            return (
              <Tile
                key={tile.id}
                tile={tile}
                onClick={isDisabled ? undefined : submitAnswer}
                disabled={isDisabled}
                highlighted={highlighted}
                wrong={wrong}
                size="md"
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}
