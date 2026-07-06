// ==================== プレイヤープロフィール（端末保存） ====================
// プレイヤー名を端末に保存し、ランキング登録時に自動で使用する

const PLAYER_NAME_KEY = "tsujigiri_player_name";

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getPlayerName(): string {
  if (!isBrowser()) return "";
  return localStorage.getItem(PLAYER_NAME_KEY) || "";
}

export function setPlayerName(name: string): void {
  if (!isBrowser()) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  localStorage.setItem(PLAYER_NAME_KEY, trimmed.slice(0, 20));
}
