"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GameResult } from "@/types/mahjong";
import { saveScore, fetchMyRank } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { tileLabel } from "@/lib/mahjong";
import { getRank } from "@/lib/ranks";
import Tile from "@/components/Tile";

interface Props {
  result: GameResult;
  onReset: () => void;
}

export default function ResultModal({ result, onReset }: Props) {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const problems = useGameStore((s) => s.problems);

  const handleSave = async () => {
    if (!playerName.trim()) return;
    setSaving(true);
    const [{ error }, rank] = await Promise.all([
      saveScore(playerName.trim(), result),
      fetchMyRank(result.score),
    ]);
    setSaving(false);
    if (!error) {
      setMyRank(rank);
      setSubmitted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
          <div className="text-4xl mb-1">⚔️</div>
          <h2 className="text-3xl font-black">そこまで！</h2>
        </div>

        {/* スコア */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-3xl font-black text-green-600">
                {result.correctCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">正解数</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="text-3xl font-black text-blue-600">
                {result.totalAnswered}
              </div>
              <div className="text-xs text-gray-500 mt-1">回答数</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="text-3xl font-black text-purple-600">
                {result.accuracy}%
              </div>
              <div className="text-xs text-gray-500 mt-1">正答率</div>
            </div>
          </div>

          {/* スコア & 格付け */}
          <div className="text-center bg-yellow-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">スコア</div>
            <div className="text-5xl font-black text-yellow-600">
              {result.score.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {result.gameMode === "speed"
                ? "正解×1000 − 不正解×300"
                : "正解×100 − 不正解×50"}
            </div>
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <div className="text-xs text-gray-500 mb-1">格付け</div>
              <div className="text-2xl font-black text-orange-600">
                {getRank(result.score)}
              </div>
            </div>
          </div>

          {myRank && (
            <div className="text-center text-indigo-600 font-bold text-lg">
              🏆 あなたの順位: <span className="text-2xl">{myRank}位</span>
            </div>
          )}

          {/* 名前入力 & 登録 */}
          {!submitted ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="プレイヤー名を入力"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-lg focus:outline-none focus:border-indigo-400 placeholder-gray-500"
              />
              <button
                onClick={handleSave}
                disabled={!playerName.trim() || saving}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "登録中..." : "ランキングに登録 🏆"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/ranking")}
              className="w-full bg-yellow-500 text-white rounded-xl py-3 font-bold text-lg hover:bg-yellow-600 transition-colors"
            >
              ランキングを見る
            </button>
          )}

          {/* 答え合わせ */}
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="w-full bg-gray-100 text-gray-700 rounded-xl py-3 font-bold hover:bg-gray-200 transition-colors"
          >
            {showDetails ? "答え合わせを閉じる ▲" : "答え合わせを見る ▼"}
          </button>

          {showDetails && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {result.answers.map((answer, i) => {
                const problem = problems.find((p) => p.id === answer.problemId);
                const isTimeout = answer.discardedTile.id === "timeout";
                return (
                  <div
                    key={i}
                    className={`rounded-xl p-3 border-2 ${answer.isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xl font-black ${answer.isCorrect ? "text-green-600" : "text-red-500"}`}>
                        {answer.isCorrect ? "○" : "✗"}
                      </span>
                      <span className="text-sm font-bold text-gray-600">問題 {i + 1}</span>
                    </div>

                    {/* 手牌 */}
                    {problem && (
                      <div className="flex flex-wrap gap-0.5 mb-2">
                        {problem.tiles.map((tile) => {
                          const isCorrectTile = problem.correctDiscards.includes(`${tile.suit}${tile.num}`);
                          const isChosen = !isTimeout && tile.suit === answer.discardedTile.suit && tile.num === answer.discardedTile.num;
                          return (
                            <Tile
                              key={tile.id}
                              tile={tile}
                              size="sm"
                              highlighted={isCorrectTile}
                              wrong={isChosen && !answer.isCorrect}
                            />
                          );
                        })}
                      </div>
                    )}

                    <div className="text-xs space-y-0.5">
                      <div>
                        <span className="text-gray-500">正解: </span>
                        <span className="font-bold text-green-700">
                          {problem?.correctDiscards.map((cd) => {
                            const suit = cd[0] as import("@/types/mahjong").Suit;
                            const num = parseInt(cd[1]);
                            return tileLabel({ suit, num, id: cd });
                          }).join(" / ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">あなた: </span>
                        <span className={`font-bold ${answer.isCorrect ? "text-green-700" : "text-red-600"}`}>
                          {isTimeout ? "時間切れ" : tileLabel(answer.discardedTile)}
                        </span>
                      </div>
                      {problem?.description && (
                        <div className="mt-1 text-gray-600 bg-white/70 rounded-lg px-2 py-1">
                          💡 {problem.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* もう一度 */}
          <button
            onClick={onReset}
            className="w-full bg-gray-100 text-gray-700 rounded-xl py-3 font-bold hover:bg-gray-200 transition-colors"
          >
            もう一度プレイ 🔄
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
