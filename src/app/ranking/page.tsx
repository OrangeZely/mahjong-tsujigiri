"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchRanking } from "@/lib/supabase";
import { RankingEntry } from "@/types/mahjong";
import { getRank } from "@/lib/ranks";

type RankingTab = "all" | "week" | "speed" | "casual";

const TABS: { key: RankingTab; label: string }[] = [
  { key: "all", label: "全期間" },
  { key: "week", label: "今週" },
  { key: "speed", label: "⚡清一色" },
  { key: "casual", label: "🧘何切る" },
];

export default function RankingPage() {
  const router = useRouter();
  const [tab, setTab] = useState<RankingTab>("all");
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  // スワイプ/タブ切替時のスライド方向（1: 右のタブへ, -1: 左のタブへ）
  const [direction, setDirection] = useState(0);

  const tabIndex = TABS.findIndex((t) => t.key === tab);

  const goToTab = (index: number) => {
    if (index < 0 || index >= TABS.length || index === tabIndex) return;
    setDirection(index > tabIndex ? 1 : -1);
    setTab(TABS[index].key);
  };

  // 横スワイプでタブ切替（縦スクロールと区別するため横成分が明確に大きい時だけ反応）
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goToTab(dx < 0 ? tabIndex + 1 : tabIndex - 1);
    }
  };

  useEffect(() => {
    setLoading(true);
    const promise =
      tab === "speed" || tab === "casual"
        ? fetchRanking("all", tab)
        : fetchRanking(tab);
    promise.then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [tab]);

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

        {/* タブ切替 */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {TABS.map((t, i) => (
            <button
              key={t.key}
              onClick={() => goToTab(i)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                tab === t.key
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ランキングテーブル（横スワイプでタブ切替） */}
        <motion.div
          key={tab}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          initial={{ x: direction * 60, opacity: direction === 0 ? 1 : 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="min-h-[300px]"
        >
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
                  <div className="text-white font-bold truncate">
                    <span className="mr-1">{entry.gameMode === "casual" ? "🧘" : "⚡"}</span>
                    {entry.playerName}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {entry.correctCount}正解 / {entry.totalAnswered}問 •{" "}
                    {entry.accuracy}%
                  </div>
                </div>

                {/* スコア & 格付け */}
                <div className="text-right">
                  <div className="text-yellow-400 font-black text-xl">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-orange-400 text-xs font-bold">
                    {getRank(entry.score)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </motion.div>

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
