"use client";

import { useEffect } from "react";
import { initRevenueCat } from "@/lib/revenuecat";
import { withTimeout } from "@/lib/purchases";
import { initAds } from "@/lib/ads";
import { usePremiumStore } from "@/store/premiumStore";

// アプリ起動時にRevenueCatと広告SDKを初期化する（ネイティブアプリでのみ実際に動作）。
// 購入状態を先に確定させてから広告を出す（購入済みユーザーに広告を見せないため）。
// RevenueCatの応答が返らない場合でも広告表示が止まらないよう、待ち時間に上限を設ける。
export default function RevenueCatInit() {
  const load = usePremiumStore((s) => s.load);

  useEffect(() => {
    (async () => {
      await withTimeout(initRevenueCat(), 5000, undefined);
      await load();
      await initAds();
    })();
  }, [load]);

  return null;
}
