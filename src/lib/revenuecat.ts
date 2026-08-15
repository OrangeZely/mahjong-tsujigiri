import { Capacitor } from "@capacitor/core";

// RevenueCatの「公開」APIキー（クライアントに埋め込んで安全）。
// ビルド時に環境変数から読み込む。未設定なら初期化をスキップする。
const ANDROID_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY ?? "";
const IOS_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY ?? "";

let configured = false;

// RevenueCatを初期化する。
// ネイティブ(Capacitor Android)アプリでのみ動作し、Web版(Vercel)・LINEミニアプリでは
// 課金機能が無いので何もしない。アプリ起動時に一度だけ呼ぶ。
export async function initRevenueCat(): Promise<void> {
  if (configured) return;

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
    // プラグインはネイティブでのみ必要なので動的に読み込む（Webのバンドルを軽く保つ）
    const { Purchases, LOG_LEVEL } = await import("@revenuecat/purchases-capacitor");
    // 統合中はデバッグログを有効化（リリース時はINFO等に下げてよい）
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey });
    configured = true;
    console.log("[RevenueCat] 初期化完了");
  } catch (e) {
    console.error("[RevenueCat] 初期化に失敗しました", e);
  }
}
