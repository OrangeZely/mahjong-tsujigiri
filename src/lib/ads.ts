import { Capacitor } from "@capacitor/core";

// AdMobの広告ユニットID。
// 本番IDは環境変数で渡す。未設定ならGoogle公式の「テスト広告」IDを使う。
// ※テストIDのままリリースすると収益が出ないので、本番前に必ず設定すること。
const TEST_IDS = {
  ios: {
    banner: "ca-app-pub-3940256099942544/2934735716",
    interstitial: "ca-app-pub-3940256099942544/4411468910",
  },
  android: {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
  },
};

function adIds() {
  const platform = Capacitor.getPlatform() === "ios" ? "ios" : "android";
  const env =
    platform === "ios"
      ? {
          banner: process.env.NEXT_PUBLIC_ADMOB_IOS_BANNER,
          interstitial: process.env.NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL,
        }
      : {
          banner: process.env.NEXT_PUBLIC_ADMOB_ANDROID_BANNER,
          interstitial: process.env.NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL,
        };
  const banner = env.banner || TEST_IDS[platform].banner;
  const interstitial = env.interstitial || TEST_IDS[platform].interstitial;
  // 本番IDが未設定＝テスト広告なので、AdMobにもテストとして伝える
  const isTesting = !env.banner || !env.interstitial;
  return { banner, interstitial, isTesting };
}

// ゲーム終了何回に1回、全画面広告を出すか（毎回出すと体験が悪いため）
const INTERSTITIAL_EVERY = 3;

let initialized = false;
let finishCount = 0;
let bannerVisible = false;

async function loadAdMob() {
  return await import("@capacitor-community/admob");
}

// 広告SDKを初期化する。Web/LINEミニアプリでは何もしない。
//
// 注意: ATT（App Tracking Transparency）は現在あえて要求していない。
// AdMob.requestTrackingAuthorization() を呼ぶとプラグインのネイティブ処理が詰まり、
// 以降の showBanner などが実行されず広告が一切出なくなる事象を確認したため。
// そのため広告は「パーソナライズなし」で配信され、トラッキングは行わない。
// 将来ATTを入れる場合は、必ず実機で広告が表示され続けることを確認すること。
export async function initAds(): Promise<void> {
  if (initialized) return;
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { AdMob } = await loadAdMob();
    await AdMob.initialize({
      initializeForTesting: adIds().isTesting,
    });
    initialized = true;
  } catch (e) {
    console.error("[Ads] 初期化に失敗", e);
  }
}

// 画面下部にバナー広告を表示する
export async function showBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform() || bannerVisible) return;
  await initAds();
  if (!initialized) return;

  try {
    const { AdMob, BannerAdSize, BannerAdPosition } = await loadAdMob();
    const { banner, isTesting } = adIds();
    await AdMob.showBanner({
      adId: banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting,
    });
    bannerVisible = true;
  } catch (e) {
    console.error("[Ads] バナー表示に失敗", e);
  }
}

// バナー広告を消す（購入時・ゲーム画面など）
export async function hideBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !bannerVisible) return;
  try {
    const { AdMob } = await loadAdMob();
    await AdMob.removeBanner();
    bannerVisible = false;
  } catch (e) {
    console.error("[Ads] バナー削除に失敗", e);
  }
}

// ゲーム終了時に呼ぶ。数回に1回だけ全画面広告を出す。
export async function maybeShowInterstitial(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  finishCount += 1;
  if (finishCount % INTERSTITIAL_EVERY !== 0) return;

  await initAds();
  if (!initialized) return;

  try {
    const { AdMob } = await loadAdMob();
    const { interstitial, isTesting } = adIds();
    await AdMob.prepareInterstitial({ adId: interstitial, isTesting });
    await AdMob.showInterstitial();
  } catch (e) {
    console.error("[Ads] 全画面広告の表示に失敗", e);
  }
}
