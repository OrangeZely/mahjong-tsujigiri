"use client";
import { useI18n } from "@/i18n/client";

import { Capacitor } from "@capacitor/core";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/client";
import { showRewardedAd } from "@/lib/ads";
import { DAILY_FREE_PLAYS } from "@/lib/playLimit";

interface OutOfPlaysCardProps {
  // 広告視聴に成功したときに呼ばれる。呼び出し側でゲームを開始する。
  onPlayViaAd: () => void;
}

// 無料プレイ回数を使い切った画面。プレミアム誘導に加え、
// 広告を1本見るごとに1回だけ追加でプレイできる導線を出す。
export default function OutOfPlaysCard({ onPlayViaAd }: OutOfPlaysCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [watchingAd, setWatchingAd] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const [isNative, setIsNative] = useState(false);

  const adController = useRef<AbortController | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Native-only UI after hydration.
    setIsNative(Capacitor.isNativePlatform());
    return () => { adController.current?.abort(); };
  }, []);

  const handleWatchAd = async () => {
    if (adController.current) return;
    const controller = new AbortController();
    adController.current = controller;
    setAdFailed(false);
    setWatchingAd(true);
    const earned = await showRewardedAd(controller.signal);
    adController.current = null;
    if (controller.signal.aborted) return;
    setWatchingAd(false);
    if (earned) {
      onPlayViaAd();
    } else {
      setAdFailed(true);
    }
  };

  return (
    <div className="bg-white/5 border-2 border-red-500/50 rounded-2xl px-6 py-5 max-w-sm mx-auto">
      <div className="text-red-300 font-bold">{t("本日のプレイ回数を使い切りました")}</div>
      <div className="text-gray-400 text-sm mt-1">{t("resetPlays", { limit: DAILY_FREE_PLAYS })}</div>

      {isNative && <button
        onClick={handleWatchAd}
        disabled={watchingAd}
        className="mt-4 w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition-colors"
      >
        {watchingAd ? t("広告を読み込み中...") : t("📺 広告を見てもう1回プレイ")}
      </button>}
      {adFailed && (
        <p className="text-red-400 text-xs mt-2">{t("広告を表示できませんでした。もう一度お試しください")}</p>
      )}

      <button
        onClick={() => router.push("/premium")}
        className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition-colors"
      >
        {t("プレミアムで無制限にする")}
      </button>
    </div>
  );
}
