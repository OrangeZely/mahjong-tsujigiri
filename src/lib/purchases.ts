import { Capacitor } from "@capacitor/core";

// 広告非表示エンタイトルメントの識別子（RevenueCatダッシュボードと一致させること）
export const NO_ADS_ENTITLEMENT = "no_ads";
// 広告除去パッケージの識別子（default offering 内）
const REMOVE_ADS_PACKAGE = "$rc_lifetime";

// RevenueCatのプラグインはネイティブでのみ必要なので動的に読み込む
async function loadPurchases() {
  const mod = await import("@revenuecat/purchases-capacitor");
  return mod.Purchases;
}

// RevenueCatの応答が返らないケースがあるため、必ずタイムアウトを設けて呼ぶ。
// これが無いと購入状態が確定せず、広告表示など後続の処理が止まってしまう。
export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

// 広告非表示を購入済みかどうか。Web/LINEミニアプリでは常にfalse（広告自体を出さない）
export async function hasNoAds(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const Purchases = await loadPurchases();
    const info = await withTimeout(Purchases.getCustomerInfo(), 8000, null);
    if (!info) {
      console.warn("[Purchases] 購入状態の取得がタイムアウトしました");
      return false;
    }
    return NO_ADS_ENTITLEMENT in info.customerInfo.entitlements.active;
  } catch (e) {
    console.error("[Purchases] 購入状態の取得に失敗", e);
    return false;
  }
}

// 広告除去の価格を表示用に取得する（例: "¥300"）。取得できなければnull
export async function getRemoveAdsPrice(): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const Purchases = await loadPurchases();
    const offerings = await withTimeout(Purchases.getOfferings(), 8000, null);
    const pkg = offerings?.current?.availablePackages.find(
      (p) => p.identifier === REMOVE_ADS_PACKAGE
    );
    return pkg?.product.priceString ?? null;
  } catch (e) {
    console.error("[Purchases] 価格の取得に失敗", e);
    return null;
  }
}

export type PurchaseOutcome = "purchased" | "cancelled" | "error";

// 広告除去を購入する。ユーザーがキャンセルした場合は "cancelled" を返す
export async function purchaseRemoveAds(): Promise<PurchaseOutcome> {
  if (!Capacitor.isNativePlatform()) return "error";
  try {
    const Purchases = await loadPurchases();
    const { current } = await Purchases.getOfferings();
    const aPackage = current?.availablePackages.find(
      (p) => p.identifier === REMOVE_ADS_PACKAGE
    );
    if (!aPackage) {
      console.error("[Purchases] 広告除去パッケージが見つかりません");
      return "error";
    }
    const { customerInfo } = await Purchases.purchasePackage({ aPackage });
    return NO_ADS_ENTITLEMENT in customerInfo.entitlements.active
      ? "purchased"
      : "error";
  } catch (e) {
    // ユーザーによるキャンセルはエラー扱いしない
    if ((e as { code?: string }).code === "1" || (e as { userCancelled?: boolean }).userCancelled) {
      return "cancelled";
    }
    console.error("[Purchases] 購入に失敗", e);
    return "error";
  }
}

// 購入の復元（機種変更・再インストール時にApp Storeが必須としている機能）
export async function restorePurchases(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const Purchases = await loadPurchases();
    const { customerInfo } = await Purchases.restorePurchases();
    return NO_ADS_ENTITLEMENT in customerInfo.entitlements.active;
  } catch (e) {
    console.error("[Purchases] 復元に失敗", e);
    return false;
  }
}
