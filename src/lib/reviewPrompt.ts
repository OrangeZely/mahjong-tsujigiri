import { Capacitor } from "@capacitor/core";
import * as InAppReviewPlugin from "@capacitor-community/in-app-review";

// ==================== アプリ内レビュー依頼 ====================
// ネイティブアプリ（iOS/Android）のみ。累計10問以上に回答した端末にだけ、
// 結果画面から離脱するタイミングで、OS標準のレビューダイアログをリクエストする。
// 依頼は端末ごとに原則1回だけ（ダイアログが実際に表示されるかはOS側の判断による）。

const TOTAL_ANSWERED_KEY = "tsujigiri_total_answered";
const REQUESTED_KEY = "tsujigiri_review_requested";
const REVIEW_THRESHOLD = 10;

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readTotalAnswered(): number {
  if (!isBrowser()) return 0;
  const raw = localStorage.getItem(TOTAL_ANSWERED_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

function hasRequestedReview(): boolean {
  // 判定できない環境（SSR等）では「依頼済み」扱いにして呼ばれないようにする
  if (!isBrowser()) return true;
  return localStorage.getItem(REQUESTED_KEY) === "1";
}

function markReviewRequested(): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(REQUESTED_KEY, "1");
  } catch {
    // 保存できなくても致命的ではない（最悪もう一度依頼が飛ぶだけ）
  }
}

// 1セッション分の回答数を累計に加算する。結果画面の表示時に1回だけ呼ぶ。
export function recordAnsweredCount(count: number): void {
  if (!isBrowser() || count <= 0) return;
  try {
    localStorage.setItem(TOTAL_ANSWERED_KEY, String(readTotalAnswered() + count));
  } catch {
    // 保存できなくてもゲームは続行させる
  }
}

// RevenueCat/AdMobと同じ理由で静的importにしている
// （Capacitorプラグインは async 関数からそのままreturnすると thenable と誤認されて
// 応答が返らなくなることがあるため、モジュール全体を同期的に参照する）
async function loadInAppReview() {
  return InAppReviewPlugin;
}

// 結果画面から離脱するタイミング（もう一度プレイ／トップに戻る／ランキング登録後）で呼ぶ。
// ネイティブアプリでなければ何もしない。累計回答数が閾値未満、または依頼済みなら何もしない。
export async function maybeRequestReview(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (hasRequestedReview()) return;
  if (readTotalAnswered() < REVIEW_THRESHOLD) return;

  // 依頼は原則1回。呼び出し前にフラグを立てることで、
  // 短時間に複数の離脱操作が重なっても二重に呼ばれないようにする。
  markReviewRequested();

  try {
    const { InAppReview } = await loadInAppReview();
    await InAppReview.requestReview();
  } catch (e) {
    console.error("[Review] レビュー依頼に失敗", e);
  }
}
