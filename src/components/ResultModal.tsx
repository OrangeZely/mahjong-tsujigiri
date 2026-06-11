"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GameResult } from "@/types/mahjong";
import { saveScore, fetchMyRank } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Props {
  result: GameResult;
  onReset: () => void;
}

export default function ResultModal({ result, onReset }: Props) {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
          <div className="text-4xl mb-1">⚔️</div>
          <h2 className="text-2xl font-black">試合終了！</h2>
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

          {/* スコア */}
          <div className="text-center bg-yellow-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">スコア</div>
            <div className="text-5xl font-black text-yellow-600">
              {result.score.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              正解数×100 + 正答率
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
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-lg focus:outline-none focus:border-indigo-400"
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
              ランキングを見る 📊
            </button>
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
