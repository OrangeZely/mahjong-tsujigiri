"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePremiumStore } from "@/store/premiumStore";

// 広告除去の購入ボタンと復元リンク。
// ネイティブアプリでのみ表示する（Web版・LINEミニアプリでは広告自体が無いため非表示）。
export default function RemoveAdsSection() {
  const { noAds, loaded, price, purchasing, purchase, restore } =
    usePremiumStore();
  const [message, setMessage] = useState<string | null>(null);

  // 購入状態の確認前、またはWeb版（価格が取得できない）では何も出さない
  if (!loaded) return null;

  if (noAds) {
    return (
      <p className="mt-6 text-xs text-emerald-400">✓ 広告非表示を購入済み</p>
    );
  }

  if (!price) return null;

  const handlePurchase = async () => {
    setMessage(null);
    const outcome = await purchase();
    if (outcome === "error") {
      setMessage("購入できませんでした。時間をおいて再度お試しください。");
    }
  };

  const handleRestore = async () => {
    setMessage(null);
    const restored = await restore();
    setMessage(
      restored ? "購入を復元しました" : "復元できる購入が見つかりませんでした"
    );
  };

  return (
    <div className="mt-6">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handlePurchase}
        disabled={purchasing}
        className="w-full bg-white/10 border-2 border-emerald-400/60 text-white font-bold py-3 rounded-xl hover:bg-emerald-400/20 transition-colors disabled:opacity-50"
      >
        {purchasing ? "処理中…" : `🚫 広告を消す（${price}）`}
      </motion.button>

      <button
        onClick={handleRestore}
        className="mt-2 text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
      >
        購入を復元
      </button>

      {message && <p className="mt-2 text-xs text-gray-400">{message}</p>}
    </div>
  );
}
