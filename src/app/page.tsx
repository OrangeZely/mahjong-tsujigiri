"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-green-950 to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-2">
          <span className="text-6xl">⚔️</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
          麻雀
        </h1>
        <h2 className="text-5xl md:text-6xl font-black text-yellow-400 mb-6 tracking-tight">
          辻斬る！
        </h2>
        <p className="text-gray-300 text-lg mb-2">
          1分間で何切る問題を斬りまくれ！
        </p>
        <p className="text-gray-400 text-sm mb-10">
          雀士たるもの5秒以内に切るべし
        </p>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 text-left max-w-sm mx-auto space-y-2">
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl">🀄</span>
            <span>表示された手配から最善手を選択</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl">👆</span>
            <span>最善の1枚をタップ</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl">⏱️</span>
            <span>1問5秒・タイムオーバーは不正解</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl">🏆</span>
            <span>60秒間で何問正解できるか競う</span>
          </div>
        </div>

        <div className="bg-yellow-500/20 rounded-xl px-5 py-3 mb-8 text-yellow-200 text-sm">
          スコア = <span className="font-bold text-yellow-300">正解数 × 100</span> +{" "}
          <span className="font-bold text-yellow-300">正答率</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/game")}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-2xl px-12 py-5 rounded-2xl shadow-2xl transition-colors"
        >
          推して参る！
        </motion.button>

        <div className="mt-6">
          <button
            onClick={() => router.push("/ranking")}
            className="text-gray-400 hover:text-white text-sm underline transition-colors"
          >
            ランキングを見る →
          </button>
        </div>
      </motion.div>
    </main>
  );
}
