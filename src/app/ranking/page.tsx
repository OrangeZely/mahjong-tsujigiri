"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchRanking } from "@/lib/supabase";
import { RankingEntry } from "@/types/mahjong";

type Period = "all" | "week";

export default function RankingPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("all");
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRanking(period).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [period]);

  const rankEmoji = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `${i + 1}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-white">🏆 ランキング</h1>
          <p className="text-gray-400 text-sm mt-1">辻斬り剣客たちの記録</p>
        </div>

        {/* 期間切替 */}
        <div className="flex gap-2 justify-center mb-6">
          {(["all", "week"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${
                period === p
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {p === "all" ? "全期間" : "今週"}
            </button>
          ))}
        </div>

        {/* ランキングテーブル */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">読み込み中...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            まだ記録がありません。最初の剣客になろう！
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                  i === 0
                    ? "bg-yellow-500/20 border border-yellow-500/40"
                    : i === 1
                    ? "bg-gray-400/20 border border-gray-400/40"
                    : i === 2
                    ? "bg-orange-500/20 border border-orange-500/40"
                    : "bg-white/5"
                }`}
              >
                {/* 順位 */}
                <div className="text-2xl w-10 text-center font-black">
                  {rankEmoji(i)}
                </div>

                {/* プレイヤー名 */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold truncate">{entry.playerName}</div>
                  <div className="text-gray-400 text-xs">
                    {entry.correctCount}正解 / {entry.totalAnswered}問 •{" "}
                    {entry.accuracy}%
                  </div>
                </div>

                {/* スコア */}
                <div className="text-right">
                  <div className="text-yellow-400 font-black text-xl">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-xs">点</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ボタン */}
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={() => router.push("/game")}
            className="bg-yellow-400 text-gray-900 font-black px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
          >
            プレイする ⚔️
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
          >
            トップへ
          </button>
        </div>
      </div>
    </main>
  );
}
