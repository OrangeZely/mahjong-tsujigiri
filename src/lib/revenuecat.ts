import { Capacitor } from "@capacitor/core";

// RevenueCatのAndroid用「公開」APIキー（goog_... で始まる。クライアントに埋め込んで安全）。
// ビルド時に環境変数から読み込む。未設定なら初期化をスキップする。
const ANDROID_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY ?? "";

let configured = false;

// RevenueCatを初期化する。
// ネイティブ(Capacitor Android)アプリでのみ動作し、Web版(Vercel)・LINEミニアプリでは
// 課金機能が無いので何もしない。アプリ起動時に一度だけ呼ぶ。
export async function initRevenueCat(): Promise<void> {
  if (configured) return;

  // Web / LINEミニアプリではRevenueCatは使えないのでスキップ
  if (!Capacitor.isNativePlatform()) return;

  if (!ANDROID_API_KEY) {
    console.warn(
      "[RevenueCat] APIキーが未設定のため初期化をスキップしました。" +
        "RevenueCatダッシュボードで取得した公開キー(goog_...)を " +
        ".env.local の NEXT_PUBLIC_REVENUECAT_ANDROID_KEY に設定してください。"
    );
    return;
  }

  try {
    // プラグインはネイティブでのみ必要なので動的に読み込む（Webのバンドルを軽く保つ）
    const { Purchases, LOG_LEVEL } = await import("@revenuecat/purchases-capacitor");
    // 統合中はデバッグログを有効化（リリース時はINFO等に下げてよい）
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey: ANDROID_API_KEY });
    configured = true;
    console.log("[RevenueCat] 初期化完了");
  } catch (e) {
    console.error("[RevenueCat] 初期化に失敗しました", e);
  }
}
