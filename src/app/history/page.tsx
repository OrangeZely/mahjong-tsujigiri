"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GameRecord, loadHistory, clearHistory, getBestScore } from "@/lib/history";
import { getRank } from "@/lib/ranks";
import { tileLabel } from "@/lib/mahjong";
import { Suit } from "@/types/mahjong";
import Tile from "@/components/Tile";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecords(loadHistory());
    setBestScore(getBestScore());
    setLoaded(true);
  }, []);

  const handleClear = () => {
    if (!confirm("プレイ履歴と最高記録を全て削除します。よろしいですか？")) return;
    clearHistory();
    setRecords([]);
    setBestScore(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-white">📜 プレイ履歴</h1>
          <p className="text-gray-400 text-sm mt-1">これまでの戦績（この端末に保存）</p>
        </div>

        {/* 最高段位 */}
        {bestScore > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-2xl p-4 mb-6 text-center">
            <div className="text-xs text-yellow-200 mb-1">過去最高段位</div>
            <div className="text-3xl font-black text-yellow-400">{getRank(bestScore)}</div>
            <div className="text-gray-400 text-sm mt-1">
              最高スコア: <span className="text-yellow-300 font-bold">{bestScore.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* 履歴リスト */}
        {!loaded ? (
          <div className="text-center text-gray-400 py-12">読み込み中...</div>
        ) : records.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            まだプレイ履歴がありません。一戦交えてきましょう！
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="bg-white/5 rounded-xl overflow-hidden"
              >
                {/* サマリー行（タップで開閉） */}
                <button
                  onClick={() => setOpenId(openId === rec.id ? null : rec.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-2xl">{rec.oniMode ? (rec.gameMode === "casual" ? "👺" : "👹") : rec.gameMode === "casual" ? "🧘" : "⚡"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold">
                      {rec.correctCount}正解 / {rec.totalAnswered}問 • {rec.accuracy}%
                    </div>
                    <div className="text-gray-400 text-xs">{formatDate(rec.playedAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-black text-lg">
                      {rec.score.toLocaleString()}
                    </div>
                    <div className="text-orange-400 text-xs font-bold">{getRank(rec.score)}</div>
                  </div>
                  <span className="text-gray-500 text-sm">{openId === rec.id ? "▲" : "▼"}</span>
                </button>

                {/* 振り返り（答え合わせ） */}
                {openId === rec.id && (
                  <div className="px-4 pb-4 space-y-3 max-h-96 overflow-y-auto">
                    {rec.details.map((d, j) => {
                      const isTimeout = d.answer.discardedTile.id === "timeout";
                      return (
                        <div
                          key={j}
                          className={`rounded-xl p-3 border ${
                            d.answer.isCorrect
                              ? "border-green-500/40 bg-green-500/10"
                              : "border-red-500/40 bg-red-500/10"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-lg font-black ${d.answer.isCorrect ? "text-green-400" : "text-red-400"}`}>
                              {d.answer.isCorrect ? "○" : "✗"}
                            </span>
                            <span className="text-sm font-bold text-gray-300">問題 {j + 1}</span>
                          </div>

                          {d.problem && (
                            <div className="flex flex-wrap gap-0.5 mb-2">
                              {d.problem.tiles.map((tile) => {
                                const isCorrectTile = d.problem!.correctDiscards.includes(`${tile.suit}${tile.num}`);
                                const isChosen =
                                  !isTimeout &&
                                  tile.suit === d.answer.discardedTile.suit &&
                                  tile.num === d.answer.discardedTile.num;
                                return (
                                  <Tile
                                    key={tile.id}
                                    tile={tile}
                                    size="sm"
                                    highlighted={isCorrectTile}
                                    wrong={isChosen && !d.answer.isCorrect}
                                  />
                                );
                              })}
                            </div>
                          )}

                          <div className="text-xs space-y-0.5 text-gray-300">
                            <div>
                              <span className="text-gray-500">正解: </span>
                              <span className="font-bold text-green-400">
                                {d.problem?.correctDiscards
                                  .map((cd) => {
                                    const suit = cd[0] as Suit;
                                    const num = parseInt(cd[1]);
                                    return tileLabel({ suit, num, id: cd });
                                  })
                                  .join(" / ")}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">あなた: </span>
                              <span className={`font-bold ${d.answer.isCorrect ? "text-green-400" : "text-red-400"}`}>
                                {isTimeout ? "時間切れ" : tileLabel(d.answer.discardedTile)}
                              </span>
                            </div>
                            {d.problem?.description && (
                              <div className="mt-2 text-base leading-relaxed text-gray-200 bg-white/10 rounded-lg px-3 py-2">
                                💡 {d.problem.description}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* ボタン */}
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => router.push("/")}
            className="bg-yellow-400 text-gray-900 font-black px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
          >
            トップへ
          </button>
          {records.length > 0 && (
            <button
              onClick={handleClear}
              className="bg-white/10 text-gray-400 px-6 py-3 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm"
            >
              履歴を削除
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
