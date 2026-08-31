import { create } from "zustand";
import {
  getEntitlements,
  getPrices,
  purchasePlan,
  restorePurchases,
  withTimeout,
  PlanId,
  PurchaseOutcome,
} from "@/lib/purchases";
import { hideBanner, showBanner } from "@/lib/ads";
import { getRemainingPlays, DAILY_FREE_PLAYS } from "@/lib/playLimit";

interface PremiumState {
  noAds: boolean; // 広告非表示（買い切り or サブスク）
  premium: boolean; // 無制限プレイ（サブスクのみ）
  loaded: boolean; // 購入状態の確認が済んだか（確認前は広告を出さない）
  prices: Partial<Record<PlanId, string>>;
  purchasing: PlanId | null;
  remainingPlays: number; // 今日の残りプレイ回数（無料ユーザー用）

  pricesLoading: boolean; // 価格の取得中かどうか（購入画面のローディング表示用）

  load: () => Promise<void>;
  // 価格の再取得。通信不良などで取れなかったときに手動でやり直せるようにする。
  reloadPrices: () => Promise<void>;
  refreshRemaining: () => void;
  purchase: (plan: PlanId) => Promise<PurchaseOutcome>;
  restore: () => Promise<boolean>;
  // 広告を出してよい画面で呼ぶ。購入済みなら何もしない。
  syncBanner: (visible: boolean) => Promise<void>;
}

export const usePremiumStore = create<PremiumState>((set, get) => ({
  noAds: false,
  premium: false,
  loaded: false,
  prices: {},
  purchasing: null,
  pricesLoading: false,
  // 初期値は満タン。クライアントで refreshRemaining() を呼んで実際の値にする
  // （ビルド時に localStorage は読めないため）
  remainingPlays: DAILY_FREE_PLAYS,

  load: async () => {
    // まず購入済みかどうかだけを確定させる（ここで広告の出し分けが決まる）。
    // RevenueCatの応答が返らないことがあるため全体にもタイムアウトをかけ、
    // 確認できなくても必ず loaded を立てる（広告表示が永久に止まらないように）。
    const ent = await withTimeout(getEntitlements(), 6000, {
      noAds: false,
      premium: false,
    });
    set({ noAds: ent.noAds, premium: ent.premium, loaded: true });
    get().refreshRemaining();
    if (ent.noAds) await hideBanner();

    // 価格は購入ボタンの表示にしか使わないので、取得が遅くても広告表示は待たせない
    await get().reloadPrices();
  },

  reloadPrices: async () => {
    set({ pricesLoading: true });
    const prices = await getPrices();
    // 取得できなかった場合に既存の価格を消さない（一度出た購入ボタンが消えるのを防ぐ）
    if (Object.keys(prices).length > 0) set({ prices });
    set({ pricesLoading: false });
  },

  refreshRemaining: () => {
    set({ remainingPlays: getRemainingPlays() });
  },

  purchase: async (plan) => {
    if (get().purchasing) return "cancelled";
    set({ purchasing: plan });
    const { outcome, entitlements } = await purchasePlan(plan);
    if (outcome === "purchased") {
      set({ noAds: entitlements.noAds, premium: entitlements.premium });
      if (entitlements.noAds) await hideBanner();
    }
    set({ purchasing: null });
    return outcome;
  },

  restore: async () => {
    const ent = await restorePurchases();
    if (ent.noAds || ent.premium) {
      set({ noAds: ent.noAds, premium: ent.premium });
      if (ent.noAds) await hideBanner();
      return true;
    }
    return false;
  },

  syncBanner: async (visible) => {
    const { noAds, loaded } = get();
    // 購入状態が不明なうちは広告を出さない（購入済みユーザーに一瞬でも出さないため）
    if (!loaded || noAds || !visible) {
      await hideBanner();
      return;
    }
    await showBanner();
  },
}));
