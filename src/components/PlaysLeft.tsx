"use client";

import { useEffect } from "react";
import { usePremiumStore } from "@/store/premiumStore";
import { DAILY_FREE_PLAYS } from "@/lib/playLimit";

// 今日の残りプレイ回数の表示。プレミアム会員には出さない。
export default function PlaysLeft() {
  const premium = usePremiumStore((s) => s.premium);
  const remaining = usePremiumStore((s) => s.remainingPlays);
  const refreshRemaining = usePremiumStore((s) => s.refreshRemaining);

  // 画面を開くたびに最新の残り回数にする（日付が変わればリセットされる）
  useEffect(() => {
    refreshRemaining();
  }, [refreshRemaining]);

  if (premium) return null;

  const isEmpty = remaining <= 0;
  return (
    <p
      className={`mt-3 text-xs ${isEmpty ? "text-red-400" : "text-gray-400"}`}
    >
      {isEmpty
        ? "本日のプレイ回数を使い切りました（明日0時に回復）"
        : `本日の残りプレイ回数 ${remaining} / ${DAILY_FREE_PLAYS}`}
    </p>
  );
}
