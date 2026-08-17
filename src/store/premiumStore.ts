import { create } from "zustand";
import {
  hasNoAds,
  getRemoveAdsPrice,
  purchaseRemoveAds,
  restorePurchases,
  withTimeout,
  PurchaseOutcome,
} from "@/lib/purchases";
import { hideBanner, showBanner } from "@/lib/ads";

interface PremiumState {
  noAds: boolean; // 広告除去を購入済みか
  loaded: boolean; // 購入状態の確認が済んだか（確認前は広告を出さない）
  price: string | null; // 表示用の価格（例: "¥300"）
  purchasing: boolean;

  load: () => Promise<void>;
  purchase: () => Promise<PurchaseOutcome>;
  restore: () => Promise<boolean>;
  // 広告を出してよい画面で呼ぶ。購入済みなら何もしない。
  syncBanner: (visible: boolean) => Promise<void>;
}

export const usePremiumStore = create<PremiumState>((set, get) => ({
  noAds: false,
  loaded: false,
  price: null,
  purchasing: false,

  load: async () => {
    // まず購入済みかどうかだけを確定させる（ここで広告の出し分けが決まる）。
    // RevenueCatの応答が返らないことがあるため全体にもタイムアウトをかけ、
    // 確認できなくても必ず loaded を立てる（広告表示が永久に止まらないように）。
    const noAds = await withTimeout(hasNoAds(), 6000, false);
    set({ noAds, loaded: true });
    if (noAds) {
      await hideBanner();
      return;
    }
    // 価格は購入ボタンの表示にしか使わないので、取得が遅くても広告表示は待たせない
    const price = await getRemoveAdsPrice();
    set({ price });
  },

  purchase: async () => {
    if (get().purchasing) return "cancelled";
    set({ purchasing: true });
    const outcome = await purchaseRemoveAds();
    if (outcome === "purchased") {
      set({ noAds: true, price: null });
      await hideBanner();
    }
    set({ purchasing: false });
    return outcome;
  },

  restore: async () => {
    const restored = await restorePurchases();
    if (restored) {
      set({ noAds: true, price: null });
      await hideBanner();
    }
    return restored;
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
