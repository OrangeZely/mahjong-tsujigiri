"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Capacitor } from "@capacitor/core";

// App Storeのアプリページ。未公開のうちは未設定にしておき、バナーを表示しない。
const APP_URL = process.env.NEXT_PUBLIC_IOS_APP_URL ?? "";

// Web版・LINEミニアプリで、iOSアプリ版への誘導を出す。
// ネイティブアプリ内では当然不要なので表示しない。
export default function AppPromoBanner() {
  // 静的ビルド時にはCapacitorの判定ができないため、マウント後に判断する
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(Boolean(APP_URL) && !Capacitor.isNativePlatform());
  }, []);

  if (!show) return null;

  return (
    <motion.a
      href={APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="mt-6 flex items-center gap-3 bg-white/10 border-2 border-yellow-500/60 rounded-2xl px-4 py-3 hover:bg-yellow-500/15 transition-colors"
    >
      <span className="text-3xl shrink-0">📱</span>
      <span className="text-left">
        <span className="block text-white font-bold">アプリ版なら もっと快適</span>
        <span className="block text-gray-300 text-xs mt-0.5">
          サクサク動作・段位や履歴もそのまま。App Storeで無料配信中
        </span>
      </span>
      <span className="ml-auto text-yellow-300 font-bold shrink-0">入手 ›</span>
    </motion.a>
  );
}
