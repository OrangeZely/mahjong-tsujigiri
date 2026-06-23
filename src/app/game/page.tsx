"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import GameBoard from "@/components/GameBoard";
import ResultModal from "@/components/ResultModal";

export default function GamePage() {
  const { phase, startGame, resetGame, getResult } = useGameStore();
  const router = useRouter();

  // ページ離脱時にリセット
  useEffect(() => {
    return () => {
      // クリーンアップしない（結果を保持する）
    };
  }, []);

  if (phase === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 flex flex-col items-center justify-center gap-6">
        <div className="text-6xl animate-spin">⚔️</div>
        <p className="text-white text-xl font-bold">問題を読み込み中...</p>
      </main>
    );
  }

  if (phase === "idle") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 flex flex-col items-center justify-center p-4 gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-4xl font-black text-white mb-2">いざ　尋常に</h1>
          <p className="text-gray-400 mb-8">考えるな、感じろ</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-3xl px-16 py-6 rounded-2xl shadow-2xl"
          >
            斬！⚔️
          </motion.button>

          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-white text-sm underline transition-colors"
            >
              ← トップに戻る
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 flex flex-col items-center justify-start pt-4 relative">
      <GameBoard />

      {phase === "finished" && (
        <ResultModal
          result={getResult()}
          onReset={() => {
            resetGame();
          }}
        />
      )}
    </main>
  );
}
