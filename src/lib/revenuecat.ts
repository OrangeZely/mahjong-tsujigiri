import { Capacitor } from "@capacitor/core";
import { Purchases, LOG_LEVEL } from "@revenuecat/purchases-capacitor";

// RevenueCatの「公開」APIキー（クライアントに埋め込んで安全）。
// ビルド時に環境変数から読み込む。未設定なら初期化をスキップする。
const ANDROID_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY ?? "";
const IOS_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY ?? "";

let configured = false;
// 初期化の実行中プロミス。複数箇所から呼ばれても1回だけ走らせ、
// 呼び出し側は「初期化が終わってから」課金APIを使えるようにする。
let initPromise: Promise<void> | null = null;

// 初期化が完了しているか（診断表示にも使う）
export function isRevenueCatConfigured(): boolean {
  return configured;
}

// APIキーの状態を確認する（値そのものは伏せる）
export function getApiKeyInfo(): { platform: string; masked: string } {
  const platform = Capacitor.getPlatform();
  const key = platform === "ios" ? IOS_API_KEY : ANDROID_API_KEY;
  return {
    platform,
    masked: key ? `${key.slice(0, 12)}…(${key.length}文字)` : "(未設定)",
  };
}

// 初期化が終わるまで待つ。既に終わっていれば即座に返る。
export async function ensureRevenueCatReady(timeoutMs = 15000): Promise<boolean> {
  if (configured) return true;
  if (!Capacitor.isNativePlatform()) return false;
  const p = initPromise ?? initRevenueCat();
  await Promise.race([
    p,
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
  return configured;
}

// RevenueCatを初期化する。
// ネイティブ(Capacitor Android)アプリでのみ動作し、Web版(Vercel)・LINEミニアプリでは
// 課金機能が無いので何もしない。アプリ起動時に一度だけ呼ぶ。
export async function initRevenueCat(): Promise<void> {
  if (configured) return;
  // 同時に複数回呼ばれても初期化は1回だけにする
  if (initPromise) return initPromise;
  initPromise = doInit();
  return initPromise;
}

async function doInit(): Promise<void> {
  // Web / LINEミニアプリではRevenueCatは使えないのでスキップ
  if (!Capacitor.isNativePlatform()) return;

  const platform = Capacitor.getPlatform();
  const apiKey = platform === "ios" ? IOS_API_KEY : ANDROID_API_KEY;

  if (!apiKey) {
    console.warn(
      `[RevenueCat] ${platform}用のAPIキーが未設定のため初期化をスキップしました。` +
        "RevenueCatダッシュボードで取得した公開キーを " +
        `.env.local の ${platform === "ios" ? "NEXT_PUBLIC_REVENUECAT_IOS_KEY" : "NEXT_PUBLIC_REVENUECAT_ANDROID_KEY"} に設定してください。`
    );
    return;
  }

  try {
    // 統合中はデバッグログを有効化（リリース時はINFO等に下げてよい）
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey });
    configured = true;
    console.log("[RevenueCat] 初期化完了");
  } catch (e) {
    console.error("[RevenueCat] 初期化に失敗しました", e);
  }
}
