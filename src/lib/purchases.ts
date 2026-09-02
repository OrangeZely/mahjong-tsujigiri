import { Capacitor } from "@capacitor/core";
import { Purchases as PurchasesPlugin } from "@revenuecat/purchases-capacitor";
import { ensureRevenueCatReady, getApiKeyInfo } from "@/lib/revenuecat";

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

// ⚠️ 重要: Capacitorのプラグインは「どのプロパティにアクセスしても関数を返すProxy」であり、
// `.then` を持つように見えるためJavaScriptからは Promise（thenable）と誤認される。
// そのため async 関数から `return PurchasesPlugin` すると、JSがそれを待とうとして
// ネイティブ側へ then という存在しないメソッド呼び出しが飛び、永久に返ってこなくなる。
// （これが「購入プランを読み込み中」から進まなくなっていた真因）
// 対策として async でラップせず、そのまま同期的に参照する。
const Purchases = PurchasesPlugin;

// RevenueCatの応答が返らないケースがあるため、必ずタイムアウトを設けて呼ぶ。
// これが無いと購入状態が確定せず、広告表示など後続の処理が止まってしまう。
export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

type CustomerInfoResult = Awaited<ReturnType<typeof Purchases.getCustomerInfo>>;

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
  // 初期化前に呼ぶと必ず失敗するので、完了を待ってから使う
  if (!(await ensureRevenueCatReady())) {
    console.warn("[Purchases] RevenueCatの初期化が完了していません");
    return NONE;
  }
  try {
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
  if (!(await ensureRevenueCatReady())) {
    console.warn("[Purchases] RevenueCatの初期化が完了していません");
    return {};
  }
  try {
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
  if (!(await ensureRevenueCatReady())) {
    return { outcome: "error", entitlements: NONE };
  }
  try {
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
  if (!(await ensureRevenueCatReady())) return NONE;
  try {
    const result = await withTimeout(Purchases.restorePurchases(), 15000, null);
    return toEntitlements(result);
  } catch (e) {
    console.error("[Purchases] 復元に失敗", e);
    return NONE;
  }
}

// ── 診断用 ─────────────────────────────────────────────
// 実機で課金情報が取れない原因を切り分けるため、各ステップの結果を文字列で返す。
// /premium?debug=1 で画面に表示される。通常のユーザーには影響しない。
export async function diagnosePurchases(): Promise<string[]> {
  const out: string[] = [];
  const push = (s: string) => out.push(s);

  const { platform, masked } = getApiKeyInfo();
  push(`1. platform=${platform} native=${Capacitor.isNativePlatform()}`);
  push(`2. APIキー: ${masked}`);

  if (!Capacitor.isNativePlatform()) {
    push("→ Web版のため以降はスキップされます");
    return out;
  }

  // プラグインの参照（同期。Proxyをawaitしないこと）
  push(`3. プラグイン参照: ${Purchases ? "OK" : "取得できず(NG)"}`);
  if (!Purchases) return out;

  // 初期化
  const t1 = Date.now();
  const ready = await ensureRevenueCatReady();
  push(`4. 初期化: ${ready ? "OK" : "未完了(NG)"} (${Date.now() - t1}ms)`);

  // 購入状態
  try {
    const t2 = Date.now();
    const info = await withTimeout(Purchases.getCustomerInfo(), 10000, null);
    if (!info) {
      push(`5. getCustomerInfo: タイムアウト (${Date.now() - t2}ms)`);
    } else {
      const active = Object.keys(info.customerInfo.entitlements.active);
      push(`5. getCustomerInfo: OK 有効な権利=[${active.join(",") || "なし"}] (${Date.now() - t2}ms)`);
    }
  } catch (e) {
    push(`5. getCustomerInfo: 例外 ${String((e as Error)?.message ?? e).slice(0, 200)}`);
  }

  // Offering（ここが本命）
  try {
    const t3 = Date.now();
    const offerings = await withTimeout(Purchases.getOfferings(), 15000, null);
    if (!offerings) {
      push(`6. getOfferings: タイムアウト (${Date.now() - t3}ms)`);
    } else {
      const allKeys = Object.keys(offerings.all ?? {});
      push(`6. getOfferings: OK (${Date.now() - t3}ms)`);
      push(`   全Offering=[${allKeys.join(",") || "空"}]`);
      push(`   current=${offerings.current?.identifier ?? "null"}`);
      const pkgs = offerings.current?.availablePackages ?? [];
      push(`   パッケージ数=${pkgs.length}`);
      pkgs.forEach((p) => {
        push(`   - ${p.identifier} / 商品=${p.product.identifier} / ${p.product.priceString}`);
      });
      if (pkgs.length === 0) {
        push("   ⚠ パッケージが空＝Apple側から商品を取得できていません");
      }
    }
  } catch (e) {
    push(`6. getOfferings: 例外 ${String((e as Error)?.message ?? e).slice(0, 300)}`);
  }

  return out;
}
