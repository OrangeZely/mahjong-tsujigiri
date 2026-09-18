import { Capacitor } from "@capacitor/core";
import * as AdMobPlugin from "@capacitor-community/admob";

// AdMobの広告ユニットID。
// 本番IDは環境変数で渡す。未設定ならGoogle公式の「テスト広告」IDを使う。
// ※テストIDのままリリースすると収益が出ないので、本番前に必ず設定すること。
const TEST_IDS = {
  ios: {
    banner: "ca-app-pub-3940256099942544/2934735716",
    interstitial: "ca-app-pub-3940256099942544/4411468910",
    rewarded: "ca-app-pub-3940256099942544/1712485313",
  },
  android: {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
    rewarded: "ca-app-pub-3940256099942544/5224354917",
  },
};

function adIds() {
  const platform = Capacitor.getPlatform() === "ios" ? "ios" : "android";
  const env =
    platform === "ios"
      ? {
          banner: process.env.NEXT_PUBLIC_ADMOB_IOS_BANNER,
          interstitial: process.env.NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL,
          rewarded: process.env.NEXT_PUBLIC_ADMOB_IOS_REWARDED,
        }
      : {
          banner: process.env.NEXT_PUBLIC_ADMOB_ANDROID_BANNER,
          interstitial: process.env.NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL,
          rewarded: process.env.NEXT_PUBLIC_ADMOB_ANDROID_REWARDED,
        };
  const banner = env.banner || TEST_IDS[platform].banner;
  const interstitial = env.interstitial || TEST_IDS[platform].interstitial;
  const rewarded = env.rewarded || TEST_IDS[platform].rewarded;
  // 本番IDが未設定＝テスト広告なので、AdMobにもテストとして伝える
  const isTesting = { banner: !env.banner, interstitial: !env.interstitial, rewarded: !env.rewarded };
  return { banner, interstitial, rewarded, isTesting };
}

let initialized = false;
let canRequestAds = false;
let initPromise: Promise<void> | undefined;
let bannerVisible = false;
let bannerWanted = false;
let bannerTask: Promise<void> | undefined;
let rewardInProgress = false;
let privacyRequired = false;
let privacyTask: Promise<void> | undefined;
let bannerHeight = 0;
const heightListeners = new Set<(height: number) => void>();
const privacyListeners = new Set<() => void>();
const { AdMob, BannerAdPluginEvents, BannerAdSize, BannerAdPosition, AdmobConsentStatus, AdmobConsentDebugGeography, RewardAdPluginEvents } = AdMobPlugin;

// EEA/UK/スイス以外（日本など）では、UMPの同意フォームは通常出ない。
// それを検証用に強制するオプション。NEXT_PUBLIC_ADMOB_TEST_DEVICE_IDS が空なら
// 何も付けない。debugGeography はGoogleのUMP SDKが testDeviceIdentifiers に
// 載っている端末にしか適用しないため、この変数を設定しない限り本番ビルドに
// 混じっても実際の利用者には影響しない。IDはUMP SDKが初回起動時にコンソールへ
// 出力するテスト端末IDを .env.local に控えて使う。
function consentRequestOptions(): AdMobPlugin.AdmobConsentRequestOptions | undefined {
  const ids = process.env.NEXT_PUBLIC_ADMOB_TEST_DEVICE_IDS?.split(",").map(s => s.trim()).filter(Boolean);
  if (!ids?.length) return undefined;
  return { debugGeography: AdmobConsentDebugGeography.EEA, testDeviceIdentifiers: ids };
}

function setBannerHeight(height: number) {
  bannerHeight = height;
  heightListeners.forEach(fn => fn(height));
}
export function getBannerHeight() { return bannerHeight; }
export function subscribeBannerHeight(fn: (height: number) => void) {
  heightListeners.add(fn);
  return () => { heightListeners.delete(fn); };
}
export function isPrivacyOptionsRequired() { return privacyRequired; }
export function subscribePrivacyOptions(fn: () => void) {
  privacyListeners.add(fn);
  return () => { privacyListeners.delete(fn); };
}
function acceptConsentInfo(info: AdMobPlugin.AdmobConsentInfo) {
  canRequestAds = info.canRequestAds === true;
  // @capacitor-community/admob@8.1.0 は PrivacyOptionsRequirementStatus enum を
  // パッケージのエクスポートから漏らしている（型定義には存在するが実行時に取得できない）ため、
  // 値そのもの（実体は文字列）で比較する。
  privacyRequired = String(info.privacyOptionsRequirementStatus) === "REQUIRED";
  privacyListeners.forEach(fn => fn());
}
async function bounded<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("Ad SDK request timed out")), 8000);
    })]);
  } finally { clearTimeout(timer); }
}
async function initializeSdk() {
  if (initialized || !canRequestAds) return;
  await bounded(AdMob.initialize({initializeForTesting: false}));
  await AdMob.addListener(BannerAdPluginEvents.SizeChanged, info => setBannerHeight(info.height));
  initialized = true;
}
// One consent update per app launch, shared by every ad entry point.
// No application-cached consent and no geography inferred from UI language.
// The iOS postinstall patch permits this sequence before Mobile Ads starts.
export function initAds(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return Promise.resolve();
  return initPromise ??= (async () => {
    try {
      let info = await bounded(AdMob.requestConsentInfo(consentRequestOptions()));
      // Keep the privacy entry point even if presenting the first form fails.
      acceptConsentInfo(info);
      canRequestAds = false;
      if (info.status === AdmobConsentStatus.REQUIRED && info.isConsentFormAvailable) {
        // A human may take any amount of time to answer. Do not time out the form.
        info = await AdMob.showConsentForm();
      }
      acceptConsentInfo(info);
      await initializeSdk();
    } catch (error) {
      // The plugin cannot read cached SDK consent after an update failure.
      // Keep ads off; gameplay remains available. Retry on the next launch.
      canRequestAds = false;
      setBannerHeight(0);
      console.warn("[Ads] Consent or initialization failed", error);
    }
  })();
}
export async function showBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  bannerWanted = true;
  await initAds();
  if (!bannerWanted || !initialized || !canRequestAds || bannerVisible) return;
  if (bannerTask) return bounded(bannerTask).catch(() => {});
  bannerTask = (async () => {
    try {
      const {banner, isTesting} = adIds();
      // Retain the native promise so a late banner can still be removed after navigation.
      await AdMob.showBanner({adId: banner, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: isTesting.banner, npa: true});
      bannerVisible = true;
      if (!bannerWanted || !canRequestAds) await removeBanner();
    } catch (error) { setBannerHeight(0); console.warn("[Ads] Banner failed", error); }
    finally { bannerTask = undefined; }
  })();
  return bounded(bannerTask).catch(() => {});
}
async function removeBanner() {
  if (!bannerVisible) return;
  try { await bounded(AdMob.removeBanner()); }
  finally { bannerVisible = false; setBannerHeight(0); }
}
export async function hideBanner(): Promise<void> {
  bannerWanted = false;
  if (!Capacitor.isNativePlatform()) return;
  try { await removeBanner(); } catch (error) { console.warn("[Ads] Remove banner failed", error); }
}
export function showAdPrivacyOptions(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return Promise.resolve();
  return privacyTask ??= (async () => {
    try {
      await initAds();
      if (!privacyRequired) return;
      canRequestAds = false;
      await removeBanner();
// A pending banner removes itself if it arrives while permission is suspended.
      await AdMob.showPrivacyOptionsForm();
      acceptConsentInfo(await bounded(AdMob.requestConsentInfo(consentRequestOptions())));
      await initializeSdk();
      if (bannerWanted && canRequestAds) await showBanner();
    } catch (error) { canRequestAds = false; throw error; }
    finally { privacyTask = undefined; }
  })();
}
// Preserve the current policy: try an interstitial after every game.
// Never hold a game for an outstanding consent form or show an ad after leaving results.
export async function maybeShowInterstitial(signal?: AbortSignal): Promise<void> {
  if (!Capacitor.isNativePlatform() || !initialized || !canRequestAds || signal?.aborted) return;
  try {
    const {interstitial, isTesting} = adIds();
    await bounded(AdMob.prepareInterstitial({adId: interstitial, isTesting: isTesting.interstitial, npa: true}));
    if (signal?.aborted || !canRequestAds) return;
    await bounded(AdMob.showInterstitial());
  } catch (error) { console.warn("[Ads] Interstitial failed", error); }
}

// 無料プレイ枠を使い切ったユーザー向けのリワード広告。
// 視聴完了(reward獲得)でtrue、途中で閉じた／読み込み失敗ならfalseを返す。
export async function showRewardedAd(signal?: AbortSignal): Promise<boolean> {
  if (!Capacitor.isNativePlatform() || rewardInProgress || signal?.aborted) return false;
  rewardInProgress = true;
  const handles: { remove: () => Promise<void> }[] = [];
  try {
    await initAds();
    if (!initialized || !canRequestAds || signal?.aborted) return false;
    const {rewarded, isTesting} = adIds();
    await bounded(AdMob.prepareRewardVideoAd({adId: rewarded, isTesting: isTesting.rewarded, npa: true}));
    if (!canRequestAds || signal?.aborted) return false;

    let earned = false;
    let resolveResult!: (earned: boolean) => void;
    const result = new Promise<boolean>(resolve => { resolveResult = resolve; });
    // Reward callbacks precede dismissal. Wait for dismissal so the game clock
    // does not run while the ad is still covering the app.
    handles.push(await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { earned = true; }));
    handles.push(await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => resolveResult(earned)));
    handles.push(await AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => resolveResult(false)));
    if (!canRequestAds || signal?.aborted) return false;
    void AdMob.showRewardVideoAd().then(() => { earned = true; }, () => resolveResult(false));
    const completed = await result;
    return completed && !signal?.aborted;
  } catch (error) {
    console.warn("[Ads] Rewarded ad failed", error);
    return false;
  } finally {
    await Promise.allSettled(handles.map(handle => handle.remove()));
    rewardInProgress = false;
  }
}
