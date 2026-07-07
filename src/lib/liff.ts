// ==================== LIFF（LINEミニアプリ）連携 ====================
// NEXT_PUBLIC_LIFF_ID を設定してビルドした場合のみ動作する。
// LINE内で開かれたときはLINEのプロフィール名をプレイヤー名の初期値にする。
// 通常のWeb・Capacitor版では LIFF_ID 未設定のため何もしない。

import { getPlayerName, setPlayerName } from "@/lib/profile";

const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";

// プレイヤー名がLIFF経由で設定されたときに発火するイベント
export const PLAYER_NAME_EVENT = "tsujigiri:player-name";

export async function initLiff(): Promise<void> {
  if (!liffId || typeof window === "undefined") return;

  try {
    const { default: liff } = await import("@line/liff");
    await liff.init({ liffId });

    // LINEアプリ内で開けば自動ログイン済み。外部ブラウザでは強制ログインしない
    if (!liff.isLoggedIn()) return;

    // すでに名前を登録済みなら上書きしない
    if (getPlayerName()) return;

    const profile = await liff.getProfile();
    if (profile.displayName) {
      setPlayerName(profile.displayName);
      window.dispatchEvent(
        new CustomEvent<string>(PLAYER_NAME_EVENT, {
          detail: profile.displayName,
        })
      );
    }
  } catch (e) {
    // LIFF初期化失敗時も通常のWebアプリとして動作を継続する
    console.warn("LIFF init failed:", e);
  }
}
