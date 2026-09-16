"use client";
import { useI18n } from "@/i18n/client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/i18n/client";
import { motion } from "framer-motion";
import { useFuGameStore } from "@/store/fuGameStore";
import FuGameBoard from "@/components/FuGameBoard";
import FuResultModal from "@/components/FuResultModal";
import OutOfPlaysCard from "@/components/OutOfPlaysCard";
import { usePremiumStore } from "@/store/premiumStore";
import { canPlay, consumePlay, DAILY_FREE_PLAYS } from "@/lib/playLimit";
import { useResultGate } from "@/lib/useResultGate";

export default function FuGamePage() {
  const { t } = useI18n();
  const { phase, rounds, startGame, resetGame, getResult } = useFuGameStore();
  const router = useRouter();
  const [oni, setOni] = useState(false);

  const premium = usePremiumStore((s) => s.premium);
  const remainingPlays = usePremiumStore((s) => s.remainingPlays);
  const refreshRemaining = usePremiumStore((s) => s.refreshRemaining);

  useEffect(() => {
    if (useFuGameStore.getState().phase === "finished") {
      resetGame();
    }
  }, [resetGame]);

  useEffect(() => {
    refreshRemaining();
  }, [refreshRemaining]);

  const outOfPlays = !premium && remainingPlays <= 0;
  const resultReady = useResultGate(phase === "finished");

  const handleStart = () => {
    if (!canPlay(premium)) {
      refreshRemaining();
      return;
    }
    consumePlay(premium);
    refreshRemaining();
    startGame(oni);
  };

  // リワード広告視聴後の追加プレイ。無料枠を消費せずそのまま開始する。
  const handlePlayViaAd = () => {
    startGame(oni);
  };

  if (phase === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-950 flex flex-col items-center justify-center gap-6">
        <div className="text-6xl animate-spin">🧮</div>
        <p className="text-white text-xl font-bold">{t("であえ、であえー！...")}</p>
      </main>
    );
  }

  if (phase === "idle") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-950 flex flex-col items-center justify-center p-4 gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🧮</div>
          <p className="text-sm font-bold mb-1 text-purple-300">{t("符計算モード")}</p>
          <h1 className="text-4xl font-black text-white mb-2">{t("いざ 尋常に")}</h1>
          <p className="text-gray-400 mb-8">{t("完成した手牌から合計符を斬れ")}</p>

          {/* 鬼斬りモード切替 */}
          <label className="flex items-center justify-center gap-2 mb-5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={oni}
              onChange={(e) => setOni(e.target.checked)}
              className="w-5 h-5 accent-red-600 cursor-pointer"
            />
            <span className={`font-bold ${oni ? "text-red-400" : "text-gray-300"}`}>
              {t("👹 鬼斬りモード")}</span>
          </label>
          {oni && (
            <div className="bg-red-950/60 border-2 border-red-500 rounded-xl px-5 py-3 mb-5 text-center max-w-xs mx-auto">
              <div className="text-red-100 font-black text-lg">
                {t("1問")}<span className="text-yellow-300 text-2xl">{t("5秒")}</span>{t("以内に回答！")}</div>
              <div className="text-red-300 text-xs mt-1">{t("（時間切れは不正解）")}</div>
            </div>
          )}

          {outOfPlays ? (
            <OutOfPlaysCard onPlayViaAd={handlePlayViaAd} />
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-3xl px-16 py-6 rounded-2xl shadow-2xl"
            >
              {t("斬！⚔️")}</motion.button>
          )}

          {!premium && !outOfPlays && (
            <p className="mt-4 text-gray-400 text-xs">
              {t("本日の残りプレイ回数")}{remainingPlays} / {DAILY_FREE_PLAYS}
            </p>
          )}

          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-white text-sm underline transition-colors"
            >
              {t("トップに戻る")}</button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-950 flex flex-col items-center justify-start pt-4 relative">
      <FuGameBoard />

      {phase === "finished" && (
        resultReady ? (
          <FuResultModal
            result={getResult()}
            rounds={rounds}
            onReset={() => {
              resetGame();
            }}
          />
        ) : (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="text-6xl animate-spin">🧮</div>
          </div>
        )
      )}
    </main>
  );
}
