import { useEffect, useState } from "react";
import { maybeShowInterstitial } from "@/lib/ads";
import { usePremiumStore } from "@/store/premiumStore";

const RESULT_GATE_TIMEOUT_MS = 8_000;

// ゲーム終了時、結果画面（スコア）を表示する前に全画面広告の表示を試みる。
// 購入済み（noAds）ならスキップ。広告が出ない場合（Web版・頻度制限等）もほぼ即座にreadyになる。
export function useResultGate(isFinished: boolean): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isFinished) {
      // ゲームを再開したとき、次の終了判定に備えてゲートを閉じ直す。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(false);
      return;
    }
    let cancelled = false;
    const { noAds, loaded } = usePremiumStore.getState();
    const showAd = loaded && !noAds ? maybeShowInterstitial() : Promise.resolve();

    const finish = () => {
      if (!cancelled) setReady(true);
    };
    // ネイティブ広告SDKが応答しなくても、結果画面を永久に塞がない。
    const timeoutId = window.setTimeout(finish, RESULT_GATE_TIMEOUT_MS);
    void showAd.then(finish, finish).finally(() => window.clearTimeout(timeoutId));

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [isFinished]);

  return ready;
}
