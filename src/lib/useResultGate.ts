import { useEffect, useState } from "react";
import { maybeShowInterstitial } from "@/lib/ads";
import { usePremiumStore } from "@/store/premiumStore";

// ゲーム終了時、結果画面（スコア）を表示する前に全画面広告の表示を試みる。
// 購入済み（noAds）ならスキップ。広告が出ない場合（Web版・頻度制限等）もほぼ即座にreadyになる。
export function useResultGate(isFinished: boolean): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isFinished) {
      setReady(false);
      return;
    }
    let cancelled = false;
    const { noAds, loaded } = usePremiumStore.getState();
    const showAd = loaded && !noAds ? maybeShowInterstitial() : Promise.resolve();
    showAd.finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [isFinished]);

  return ready;
}
