"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getBestScore } from "@/lib/history";
import { getRank } from "@/lib/ranks";
import { getPlayerName, setPlayerName } from "@/lib/profile";
import { PLAYER_NAME_EVENT } from "@/lib/liff";

export default function HomePage() {
  const router = useRouter();
  const [bestScore, setBestScore] = useState(0);
  const [playerName, setPlayerNameState] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBestScore(getBestScore());
    setPlayerNameState(getPlayerName());
    setLoaded(true);

    // LIFF（LINEミニアプリ）がプロフィール名を設定したら反映する
    const onLiffName = (e: Event) => {
      setPlayerNameState((e as CustomEvent<string>).detail);
    };
    window.addEventListener(PLAYER_NAME_EVENT, onLiffName);
    return () => window.removeEventListener(PLAYER_NAME_EVENT, onLiffName);
  }, []);

  const handleRegister = () => {
    const name = nameInput.trim();
    if (!name) return;
    setPlayerName(name);
    setPlayerNameState(name);
    setEditingName(false);
    setNameInput("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-green-950 to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center w-full max-w-sm mx-auto"
      >
        <div className="mb-3 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-panda.jpg"
            alt="麻雀 辻斬る！"
            width={220}
            height={220}
            className="w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl ring-1 ring-white/10"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
          麻雀
        </h1>
        <h2 className="text-5xl md:text-6xl font-black text-yellow-400 mb-6 tracking-tight">
          辻斬る！
        </h2>

        {/* プレイヤー名 & 過去最高段位 */}
        {loaded && (playerName && !editingName ? (
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <span className="text-gray-400 text-xs mr-2">雀士</span>
              <span className="text-white font-black">{playerName}</span>
              <button
                onClick={() => { setNameInput(playerName); setEditingName(true); }}
                className="ml-2 text-gray-500 hover:text-gray-300 text-xs underline"
              >
                変更
              </button>
            </div>
            {bestScore > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl px-4 py-2">
                <span className="text-yellow-200 text-xs mr-2">最高段位</span>
                <span className="text-yellow-400 font-black">{getRank(bestScore)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
            <p className="text-white text-sm font-bold mb-3">
              {playerName ? "プレイヤー名を変更" : "⚔️ プレイヤー名を登録して参戦！"}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="プレイヤー名"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                className="flex-1 min-w-0 bg-white/90 rounded-xl px-3 py-2 text-center text-gray-900 font-bold focus:outline-none placeholder-gray-400"
              />
              <button
                onClick={handleRegister}
                disabled={!nameInput.trim()}
                className="bg-yellow-400 text-gray-900 font-black px-4 py-2 rounded-xl hover:bg-yellow-300 disabled:opacity-40 transition-colors"
              >
                登録
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              ランキングにはこの名前で自動登録されます
            </p>
          </div>
        ))}

        {/* 清一色モード */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/game?mode=speed")}
          className="cursor-pointer bg-gradient-to-br from-red-800 to-red-950 border-2 border-red-500 rounded-2xl p-5 mb-4 text-left shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚡</span>
            <div>
              <div className="text-white font-black text-xl">清一色モード</div>
              <div className="text-red-300 text-xs">染め手特訓・高難易度</div>
            </div>
          </div>
          <div className="text-gray-300 text-sm space-y-1">
            <div>・清一色の何切る問題に挑戦</div>
            <div>・60秒間で何問正解できるか</div>
            <div>・<span className="text-yellow-300 font-bold">👹鬼斬りモード</span>は1問5秒＆連続正解で獲得点倍々</div>
          </div>
        </motion.div>

        {/* カジュアルモード（何切る） */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/game?mode=casual")}
          className="cursor-pointer bg-gradient-to-br from-green-800 to-green-950 border-2 border-green-500 rounded-2xl p-5 mb-8 text-left shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🧘</span>
            <div>
              <div className="text-white font-black text-xl">何切るモード</div>
              <div className="text-green-300 text-xs">60秒間で何問正解できるか</div>
            </div>
          </div>
          <div className="text-gray-300 text-sm space-y-1">
            <div>・1問ごとの制限時間は<span className="text-yellow-300 font-bold">なし</span></div>
            <div>・60秒間で解いた問題数を競う</div>
            <div>・<span className="text-yellow-300 font-bold">👺鬼斬りモード</span>は1問5秒＆連続正解で獲得点倍々</div>
          </div>
        </motion.div>

        <div className="flex gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/ranking")}
            className="flex-1 bg-white/10 border-2 border-yellow-500/60 text-white font-bold py-3 rounded-xl hover:bg-yellow-500/20 transition-colors"
          >
            🏆 ランキング
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/history")}
            className="flex-1 bg-white/10 border-2 border-blue-400/60 text-white font-bold py-3 rounded-xl hover:bg-blue-400/20 transition-colors"
          >
            📜 プレイ履歴
          </motion.button>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push("/privacy")}
            className="text-gray-600 hover:text-gray-400 text-xs underline transition-colors"
          >
            プライバシーポリシー
          </button>
        </div>
      </motion.div>
    </main>
  );
}
