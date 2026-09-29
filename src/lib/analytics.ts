// ==================== プレイ集計（運営ダッシュボード用） ====================
// どのモードがどれだけ遊ばれているかを知るため、Supabase の play_events に匿名で記録する。
// 送るのは端末ごとのランダムID・モード・正解数などの数値だけで、プレイヤー名は送らない。
// 送信に失敗してもゲームには一切影響させない（待たない・例外を外に出さない）。

import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabase";
import { usePremiumStore } from "@/store/premiumStore";
import { GameMode } from "@/types/mahjong";

const DEVICE_KEY = "tsujigiri_device_id";

export type PlayEvent = "start" | "finish" | "limit_hit";
// start の内訳。無料枠・プレミアム・リワード広告視聴による追加プレイ
export type PlaySource = "free" | "premium" | "ad";

interface PlayEventDetail {
  mode: GameMode;
  oni?: boolean;
  source?: PlaySource;
  correct?: number;
  answered?: number;
  score?: number;
}

function deviceId(): string | null {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function trackPlay(event: PlayEvent, detail: PlayEventDetail): void {
  if (typeof window === "undefined") return;
  const id = deviceId();
  if (!id) return;
  const platform = Capacitor.getPlatform();
  void Promise.resolve(
    supabase.from("play_events").insert({
      device_id: id,
      event,
      mode: detail.mode,
      oni: detail.oni ?? false,
      source: detail.source ?? null,
      platform: platform === "ios" || platform === "android" ? platform : "web",
      locale: window.location.pathname.startsWith("/en") ? "en" : "ja",
      premium: usePremiumStore.getState().premium,
      correct: detail.correct ?? null,
      answered: detail.answered ?? null,
      score: detail.score ?? null,
    })
  ).catch(() => {});
}
