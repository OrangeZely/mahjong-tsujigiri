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
        className="text-center w-full max-w-sm mx-auto"
      >
        <div className="mb-2">
          <span className="text-6xl">⚔️</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
          麻雀
        </h1>
        <h2 className="text-5xl md:text-6xl font-black text-yellow-400 mb-10 tracking-tight">
          辻斬る！
        </h2>

        {/* スピードモード */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/game?mode=speed")}
          className="cursor-pointer bg-gradient-to-br from-red-800 to-red-950 border-2 border-red-500 rounded-2xl p-5 mb-4 text-left shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚡</span>
            <div>
              <div className="text-white font-black text-xl">スピードモード</div>
              <div className="text-red-300 text-xs">1問5秒・高難易度</div>
            </div>
          </div>
          <div className="text-gray-300 text-sm space-y-1">
            <div>・1問につき<span className="text-yellow-300 font-bold">5秒以内</span>に回答</div>
            <div>・タイムオーバーは不正解</div>
            <div>・60秒間で何問正解できるか</div>
          </div>
        </motion.div>

        {/* カジュアルモード */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/game?mode=casual")}
          className="cursor-pointer bg-gradient-to-br from-green-800 to-green-950 border-2 border-green-500 rounded-2xl p-5 mb-8 text-left shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🧘</span>
            <div>
              <div className="text-white font-black text-xl">一分何切るモード</div>
              <div className="text-green-300 text-xs">時間制限なし・じっくり考える</div>
            </div>
          </div>
          <div className="text-gray-300 text-sm space-y-1">
            <div>・1問ごとの制限時間は<span className="text-yellow-300 font-bold">なし</span></div>
            <div>・60秒間で解いた問題数を競う</div>
            <div>・じっくり考えて正解を狙え</div>
          </div>
        </motion.div>

        <div className="bg-yellow-500/20 rounded-xl px-5 py-3 mb-6 text-yellow-200 text-sm">
          スコア = <span className="font-bold text-yellow-300">正解数 × 100</span> +{" "}
          <span className="font-bold text-yellow-300">正答率</span>
        </div>

        <div>
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
