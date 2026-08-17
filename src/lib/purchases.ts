import { Capacitor } from "@capacitor/core";

// エンタイトルメント（RevenueCatダッシュボードと一致させること）
export const NO_ADS_ENTITLEMENT = "no_ads"; // 広告非表示（買い切り・サブスクどちらでも付与）
export const PREMIUM_ENTITLEMENT = "premium"; // 無制限プレイ＋新問題（サブスクのみ）

// 購入プランと、default offering 内のパッケージ識別子の対応
export type PlanId = "remove_ads" | "monthly" | "annual";
const PACKAGE_BY_PLAN: Record<PlanId, string> = {
  remove_ads: "$rc_lifetime",
  monthly: "$rc_monthly",
  annual: "$rc_annual",
};

export interface Entitlements {
  noAds: boolean;
  premium: boolean;
}

const NONE: Entitlements = { noAds: false, premium: false };

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

type CustomerInfoResult = Awaited<
  ReturnType<Awaited<ReturnType<typeof loadPurchases>>["getCustomerInfo"]>
>;

function toEntitlements(info: CustomerInfoResult | null): Entitlements {
  if (!info) return NONE;
  const active = info.customerInfo.entitlements.active;
  return {
    noAds: NO_ADS_ENTITLEMENT in active,
    premium: PREMIUM_ENTITLEMENT in active,
  };
}

// 現在の購入状態。Web/LINEミニアプリでは購入手段が無いので常に未購入扱い。
export async function getEntitlements(): Promise<Entitlements> {
  if (!Capacitor.isNativePlatform()) return NONE;
  try {
    const Purchases = await loadPurchases();
    const info = await withTimeout(Purchases.getCustomerInfo(), 8000, null);
    if (!info) console.warn("[Purchases] 購入状態の取得がタイムアウトしました");
    return toEntitlements(info);
  } catch (e) {
    console.error("[Purchases] 購入状態の取得に失敗", e);
    return NONE;
  }
}

// 各プランの表示用価格（例: "¥380"）。取得できなかったものは含まれない。
export async function getPrices(): Promise<Partial<Record<PlanId, string>>> {
  if (!Capacitor.isNativePlatform()) return {};
  try {
    const Purchases = await loadPurchases();
    const offerings = await withTimeout(Purchases.getOfferings(), 8000, null);
    const packages = offerings?.current?.availablePackages ?? [];
    const prices: Partial<Record<PlanId, string>> = {};
    (Object.keys(PACKAGE_BY_PLAN) as PlanId[]).forEach((plan) => {
      const pkg = packages.find((p) => p.identifier === PACKAGE_BY_PLAN[plan]);
      if (pkg) prices[plan] = pkg.product.priceString;
    });
    return prices;
  } catch (e) {
    console.error("[Purchases] 価格の取得に失敗", e);
    return {};
  }
}

export type PurchaseOutcome = "purchased" | "cancelled" | "error";

export async function purchasePlan(
  plan: PlanId
): Promise<{ outcome: PurchaseOutcome; entitlements: Entitlements }> {
  if (!Capacitor.isNativePlatform()) {
    return { outcome: "error", entitlements: NONE };
  }
  try {
    const Purchases = await loadPurchases();
    const { current } = await Purchases.getOfferings();
    const aPackage = current?.availablePackages.find(
      (p) => p.identifier === PACKAGE_BY_PLAN[plan]
    );
    if (!aPackage) {
      console.error("[Purchases] パッケージが見つかりません:", plan);
      return { outcome: "error", entitlements: NONE };
    }
    const result = await Purchases.purchasePackage({ aPackage });
    return { outcome: "purchased", entitlements: toEntitlements(result) };
  } catch (e) {
    // ユーザーによるキャンセルはエラー扱いしない
    const err = e as { code?: string; userCancelled?: boolean };
    if (err.userCancelled || err.code === "1") {
      return { outcome: "cancelled", entitlements: NONE };
    }
    console.error("[Purchases] 購入に失敗", e);
    return { outcome: "error", entitlements: NONE };
  }
}

// 購入の復元（機種変更・再インストール時にApp Storeが必須としている機能）
export async function restorePurchases(): Promise<Entitlements> {
  if (!Capacitor.isNativePlatform()) return NONE;
  try {
    const Purchases = await loadPurchases();
    const result = await withTimeout(Purchases.restorePurchases(), 15000, null);
    return toEntitlements(result);
  } catch (e) {
    console.error("[Purchases] 復元に失敗", e);
    return NONE;
  }
}
