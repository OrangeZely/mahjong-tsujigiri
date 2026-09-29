// 表示の好み（端末ごとに localStorage へ保存）
import { useSyncExternalStore } from "react";

const TWO_ROW_KEY = "tsujigiri_two_row_hand";
const LANDSCAPE_HINT_KEY = "tsujigiri_landscape_hint_dismissed";
const listeners = new Set<() => void>();

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(key: string, on: boolean): void {
  try {
    if (on) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch {
    // 保存できなくても今の画面では切り替える
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// 縦向きのスマホで手牌を2段に分けて、牌を約2倍の大きさにする
export function useTwoRowHand(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribe, () => readFlag(TWO_ROW_KEY), () => false);
  return [on, (next) => writeFlag(TWO_ROW_KEY, next)];
}

export function useLandscapeHintDismissed(): [boolean, () => void] {
  const dismissed = useSyncExternalStore(subscribe, () => readFlag(LANDSCAPE_HINT_KEY), () => true);
  return [dismissed, () => writeFlag(LANDSCAPE_HINT_KEY, true)];
}
