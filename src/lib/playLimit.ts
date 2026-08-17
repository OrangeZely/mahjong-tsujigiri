// 無料ユーザーの1日あたりのプレイ回数制限。
// プレミアム（サブスク）加入者は無制限。Web版・LINE版にも同じ制限を適用する。

export const DAILY_FREE_PLAYS = 10;

const STORAGE_KEY = "tsujigiri_play_count";

interface PlayCount {
  date: string; // YYYY-MM-DD（端末のローカル日付）
  count: number;
}

// 端末のローカル時刻での「今日」。日付が変われば自動でリセットされる。
function today(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function read(): PlayCount {
  if (typeof window === "undefined") return { date: today(), count: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: today(), count: 0 };
    const parsed = JSON.parse(raw) as PlayCount;
    // 日付が変わっていればリセット
    if (parsed.date !== today()) return { date: today(), count: 0 };
    return parsed;
  } catch {
    return { date: today(), count: 0 };
  }
}

// 今日の残りプレイ回数
export function getRemainingPlays(): number {
  return Math.max(0, DAILY_FREE_PLAYS - read().count);
}

export function canPlay(isPremium: boolean): boolean {
  return isPremium || getRemainingPlays() > 0;
}

// ゲーム開始時に呼ぶ。プレミアムなら消費しない。
export function consumePlay(isPremium: boolean): void {
  if (isPremium || typeof window === "undefined") return;
  const current = read();
  const next: PlayCount = { date: current.date, count: current.count + 1 };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 保存できなくてもゲーム自体は続行させる
  }
}

// 次に回数が回復する時刻（翌日0時）の表示用文字列
export function resetsAtLabel(): string {
  return "明日0時";
}
