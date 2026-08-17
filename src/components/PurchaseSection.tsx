"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePremiumStore } from "@/store/premiumStore";
import { DAILY_FREE_PLAYS } from "@/lib/playLimit";

// 課金プランの一覧（サブスク2種＋広告除去の買い切り）と購入の復元。
// ネイティブアプリでのみ表示する（Web版は購入手段が無いため）。
export default function PurchaseSection() {
  const { noAds, premium, loaded, prices, purchasing, purchase, restore } =
    usePremiumStore();
  const [message, setMessage] = useState<string | null>(null);

  if (!loaded) return null;

  // 価格が1つも取れない＝Web版、または課金商品が未作成
  const hasAnyPrice = Boolean(prices.monthly || prices.annual || prices.remove_ads);
  if (!hasAnyPrice) {
    return premium ? (
      <p className="mt-6 text-xs text-emerald-400">✓ プレミアム会員</p>
    ) : null;
  }

  const handle = async (plan: "monthly" | "annual" | "remove_ads") => {
    setMessage(null);
    const outcome = await purchase(plan);
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
    <div className="mt-8 text-left">
      {premium ? (
        <p className="text-center text-sm text-emerald-400">
          ✓ プレミアム会員（無制限プレイ・広告なし）
        </p>
      ) : (
        <>
          <h2 className="text-center text-white font-bold mb-1">
            プレミアムで制限解除
          </h2>
          <p className="text-center text-xs text-gray-400 mb-3">
            プレイ無制限・広告なし・毎月新しい問題が追加されます
            <br />
            （無料プランは1日{DAILY_FREE_PLAYS}回まで）
          </p>

          <div className="flex flex-col gap-2">
            {prices.annual && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handle("annual")}
                disabled={purchasing !== null}
                className="w-full bg-yellow-500/15 border-2 border-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-500/25 transition-colors disabled:opacity-50"
              >
                {purchasing === "annual"
                  ? "処理中…"
                  : `年額 ${prices.annual}　🏅 いちばんお得`}
              </motion.button>
            )}

            {prices.monthly && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handle("monthly")}
                disabled={purchasing !== null}
                className="w-full bg-white/10 border-2 border-white/30 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {purchasing === "monthly" ? "処理中…" : `月額 ${prices.monthly}`}
              </motion.button>
            )}
          </div>
        </>
      )}

      {/* 広告だけ消したい人向けの買い切り。サブスク加入者・購入済みには出さない */}
      {!noAds && prices.remove_ads && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handle("remove_ads")}
          disabled={purchasing !== null}
          className="mt-3 w-full bg-white/5 border border-emerald-400/50 text-gray-200 text-sm py-2.5 rounded-xl hover:bg-emerald-400/15 transition-colors disabled:opacity-50"
        >
          {purchasing === "remove_ads"
            ? "処理中…"
            : `広告を消すだけなら ${prices.remove_ads}（買い切り）`}
        </motion.button>
      )}

      <div className="mt-3 text-center">
        <button
          onClick={handleRestore}
          className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
        >
          購入を復元
        </button>
      </div>

      {message && (
        <p className="mt-2 text-center text-xs text-gray-400">{message}</p>
      )}
    </div>
  );
}
