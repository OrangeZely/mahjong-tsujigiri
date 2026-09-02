"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PurchaseSection from "@/components/PurchaseSection";
import PurchaseDebugPanel from "@/components/PurchaseDebugPanel";
import { DAILY_FREE_PLAYS } from "@/lib/playLimit";

// 課金プランの専用ページ。
// ゲーム画面の「プレミアムで無制限にする」やホームのボタンからここに来る。
// 購入手段の入口を1か所にまとめ、どの画面からでも必ず辿り着けるようにしている。
export default function PremiumPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto py-8"
      >
        <h1 className="text-3xl font-black text-white text-center mb-2">
          プレミアム
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          もっと解きたい人のためのプラン
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-2">
          <h2 className="text-white font-bold mb-3">プレミアムでできること</h2>
          <ul className="space-y-2 text-sm text-gray-200">
            <li className="flex gap-2">
              <span className="text-yellow-300 shrink-0">✓</span>
              <span>
                <span className="font-bold text-white">プレイ回数が無制限</span>
                （無料プランは1日{DAILY_FREE_PLAYS}回まで）
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-300 shrink-0">✓</span>
              <span>
                <span className="font-bold text-white">広告が非表示</span>
                になり、テンポよく解けます
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-300 shrink-0">✓</span>
              <span>
                <span className="font-bold text-white">毎月あたらしい問題</span>
                が追加されます
              </span>
            </li>
          </ul>
        </div>

        {/* 価格・購入ボタン・自動更新の開示・規約リンク・購入の復元はすべてここに含まれる */}
        <PurchaseSection />

        <PurchaseDebugPanel />

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
          >
            トップに戻る
          </button>
        </div>
      </motion.div>
    </main>
  );
}
