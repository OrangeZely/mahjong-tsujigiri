"use client";

import { useEffect, useState } from "react";
import { usePremiumStore } from "@/store/premiumStore";
import { getBannerHeight, subscribeBannerHeight } from "@/lib/ads";

// アダプティブバナーは端末幅で高さが変わり、広告が読み込まれるまで正確な高さも分からない。
// 読み込み前はこの概算値でボタンとの重なりを防ぎ、実測値が届き次第それに差し替える。
const FALLBACK_HEIGHT = 60;

// 画面下部にバナー広告を出す。広告はネイティブのオーバーレイとして表示されるため、
// 同じ高さのスペーサーを置いてコンテンツが隠れないようにする。
// 購入済み・Web版では何も表示しない。
export default function AdBanner() {
  const noAds = usePremiumStore((s) => s.noAds);
  const loaded = usePremiumStore((s) => s.loaded);
  const syncBanner = usePremiumStore((s) => s.syncBanner);
  const [height, setHeight] = useState(getBannerHeight);

  useEffect(() => {
    syncBanner(true);
    const unsubscribe = subscribeBannerHeight(setHeight);
    // 画面を離れるときはバナーを消す（ゲーム画面などに残さない）
    return () => {
      syncBanner(false);
      unsubscribe();
    };
  }, [syncBanner, loaded, noAds]);

  if (!loaded || noAds) return null;
  return (
    <div className="shrink-0" style={{ height: height || FALLBACK_HEIGHT }} aria-hidden />
  );
}
