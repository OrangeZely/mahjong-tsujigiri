"use client";

import { useEffect } from "react";
import { usePremiumStore } from "@/store/premiumStore";

// 画面下部にバナー広告を出す。広告はネイティブのオーバーレイとして表示されるため、
// 同じ高さのスペーサーを置いてコンテンツが隠れないようにする。
// 購入済み・Web版では何も表示しない。
export default function AdBanner() {
  const noAds = usePremiumStore((s) => s.noAds);
  const loaded = usePremiumStore((s) => s.loaded);
  const syncBanner = usePremiumStore((s) => s.syncBanner);

  useEffect(() => {
    syncBanner(true);
    // 画面を離れるときはバナーを消す（ゲーム画面などに残さない）
    return () => {
      syncBanner(false);
    };
  }, [syncBanner, loaded, noAds]);

  if (!loaded || noAds) return null;
  // アダプティブバナーの想定高さ分の余白
  return <div className="h-[60px] shrink-0" aria-hidden />;
}
