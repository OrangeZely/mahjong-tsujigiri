"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useGameStore, GameMode } from "@/store/gameStore";
import GameBoard from "@/components/GameBoard";
import ResultModal from "@/components/ResultModal";

function GameContent() {
  const { phase, gameMode, startGame, resetGame, getResult } = useGameStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = (searchParams.get("mode") === "casual" ? "casual" : "speed") as GameMode;

  // ブラウザバック等で前回の終了状態が残っていたらリセットして開始画面を出す
  useEffect(() => {
    if (useGameStore.getState().phase === "finished") {
      resetGame();
    }
  }, [resetGame]);

  const modeLabel = mode === "casual" ? "何切るモード" : "スピードモード";
  const modeColor = mode === "casual" ? "text-green-300" : "text-red-300";

  if (phase === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 flex flex-col items-center justify-center gap-6">
        <div className="text-6xl animate-spin">⚔️</div>
        <p className="text-white text-xl font-bold">であえ、であえー！...</p>
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
          <p className={`text-sm font-bold mb-1 ${modeColor}`}>{modeLabel}</p>
          <h1 className="text-4xl font-black text-white mb-2">いざ　尋常に</h1>
          <p className="text-gray-400 mb-8">
            {mode === "casual" ? "じっくり考えて斬れ" : "考えるな、感じろ"}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame(mode)}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-3xl px-16 py-6 rounded-2xl shadow-2xl"
          >
            斬！⚔️
          </motion.button>

          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-white text-sm underline transition-colors"
            >
              トップに戻る
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

export default function GamePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 flex items-center justify-center">
        <div className="text-6xl animate-spin">⚔️</div>
      </main>
    }>
      <GameContent />
    </Suspense>
  );
}
