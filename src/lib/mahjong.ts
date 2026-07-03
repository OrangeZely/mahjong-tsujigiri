import { Tile, Suit, Problem } from "@/types/mahjong";

// ==================== 牌ユーティリティ ====================

export const SUIT_LABELS: Record<Suit, string> = {
  m: "萬",
  p: "筒",
  s: "索",
  z: "字",
};

export const JIHAI_LABELS: Record<number, string> = {
  1: "東", 2: "南", 3: "西", 4: "北",
  5: "白", 6: "発", 7: "中",
};

export function tileKey(suit: Suit, num: number): string {
  return `${suit}${num}`;
}

export function tileLabel(tile: Tile): string {
  if (tile.suit === "z") return JIHAI_LABELS[tile.num];
  return `${tile.num}${SUIT_LABELS[tile.suit]}`;
}

export function createTile(suit: Suit, num: number, index: number, isRed = false): Tile {
  return { suit, num, id: `${suit}${num}_${index}${isRed ? "r" : ""}`, isRed: isRed || undefined };
}

// フルデッキ生成（各牌4枚）
export function createFullDeck(): Tile[] {
  const deck: Tile[] = [];
  const suits: Suit[] = ["m", "p", "s"];
  for (const suit of suits) {
    for (let num = 1; num <= 9; num++) {
      for (let i = 0; i < 4; i++) {
        deck.push(createTile(suit, num, i));
      }
    }
  }
  for (let num = 1; num <= 7; num++) {
    for (let i = 0; i < 4; i++) {
      deck.push(createTile("z", num, i));
    }
  }
  return deck;
}

// シャッフル
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==================== シャンテン数計算 ====================

type TileCount = number[]; // インデックス = suit*9 + (num-1)
// m1-m9: 0-8, p1-p9: 9-17, s1-s9: 18-26, z1-z7: 27-33

function suitOffset(suit: Suit): number {
  if (suit === "m") return 0;
  if (suit === "p") return 9;
  if (suit === "s") return 18;
  return 27;
}

export function tilesToCount(tiles: Tile[]): TileCount {
  const count = new Array(34).fill(0);
  for (const t of tiles) {
    count[suitOffset(t.suit) + (t.num - 1)]++;
  }
  return count;
}

// シャンテン数を計算（通常手のみ）
export function calcShanten(count: TileCount): number {
  let minShanten = 8;

  // 対子候補
  for (let jantou = -1; jantou < 34; jantou++) {
    if (jantou >= 0 && count[jantou] < 2) continue;
    const c = [...count];
    if (jantou >= 0) { c[jantou] -= 2; }

    let mentsu = 0;
    let taatsu = 0;
    const work = [...c];

    // 数牌の面子・塔子
    for (let s = 0; s < 3; s++) {
      const base = s * 9;
      for (let n = 0; n < 9; n++) {
        const i = base + n;
        // 刻子
        const kotu = Math.floor(work[i] / 3);
        mentsu += kotu;
        work[i] -= kotu * 3;
      }
      for (let n = 0; n < 9; n++) {
        const i = base + n;
        // 順子
        if (n <= 6 && work[i] > 0 && work[i+1] > 0 && work[i+2] > 0) {
          const seq = Math.min(work[i], work[i+1], work[i+2]);
          mentsu += seq;
          work[i] -= seq;
          work[i+1] -= seq;
          work[i+2] -= seq;
        }
      }
      for (let n = 0; n < 9; n++) {
        const i = base + n;
        if (work[i] >= 2) { taatsu++; work[i] -= 2; }
      }
      for (let n = 0; n < 8; n++) {
        const i = base + n;
        if (work[i] > 0 && work[i+1] > 0) { taatsu++; work[i]--; work[i+1]--; }
        if (n <= 6 && work[i] > 0 && work[i+2] > 0) { taatsu++; work[i]--; work[i+2]--; }
      }
    }
    // 字牌
    for (let n = 27; n < 34; n++) {
      const kotu = Math.floor(work[n] / 3);
      mentsu += kotu;
      work[n] -= kotu * 3;
      if (work[n] >= 2) { taatsu++; work[n] -= 2; }
    }

    const jantouBonus = jantou >= 0 ? 1 : 0;
    const total = mentsu + Math.min(taatsu, 4 - mentsu);
    const shanten = 8 - total * 2 - jantouBonus;
    if (shanten < minShanten) minShanten = shanten;
  }

  return minShanten;
}

// ある牌を捨てたときのシャンテン数
export function shantenAfterDiscard(count: TileCount, idx: number): number {
  const c = [...count];
  c[idx]--;
  return calcShanten(c);
}

// 最善打（シャンテン数が最も小さくなる捨て牌）を求める
export function bestDiscards(tiles: Tile[]): string[] {
  const count = tilesToCount(tiles);
  let best = 9;
  const results: string[] = [];

  const suits: Suit[] = ["m", "p", "s", "z"];
  for (const suit of suits) {
    const max = suit === "z" ? 7 : 9;
    for (let num = 1; num <= max; num++) {
      const idx = suitOffset(suit) + (num - 1);
      if (count[idx] === 0) continue;
      const sh = shantenAfterDiscard(count, idx);
      if (sh < best) {
        best = sh;
        results.length = 0;
        results.push(tileKey(suit, num));
      } else if (sh === best) {
        results.push(tileKey(suit, num));
      }
    }
  }
  return results;
}

// ==================== 問題生成 ====================

export function generateProblem(id: string): Problem {
  const deck = shuffle(createFullDeck());
  const hand = deck.slice(0, 14);
  hand.sort((a, b) => {
    const so = suitOffset(a.suit) - suitOffset(b.suit);
    return so !== 0 ? so : a.num - b.num;
  });

  const corrects = bestDiscards(hand);

  return {
    id,
    tiles: hand,
    correctDiscards: corrects,
    difficulty: 2,
    isAuto: true,
  };
}

// 問題プールを生成
export function generateProblemPool(size: number): Problem[] {
  return Array.from({ length: size }, (_, i) =>
    generateProblem(`auto_${Date.now()}_${i}`)
  );
}

// ==================== 牌文字列パース ====================
// 例: "1m2m3m4p5p6pz1z1z7z7" → Tile[]
export function parseTileString(str: string): Tile[] {
  const tiles: Tile[] = [];
  // z1〜z7形式（z先頭）と1m〜9z形式（数字先頭）の両方に対応
  // rm/rp/rs は赤5として扱う
  const regex = /z(\d)|r([mps])|(\d)([mpsz])/g;
  let match;
  const countMap: Record<string, number> = {};

  while ((match = regex.exec(str)) !== null) {
    let num: number;
    let suit: Suit;
    let isRed = false;
    if (match[1] !== undefined) {
      // z{num} 形式
      suit = "z";
      num = parseInt(match[1]);
    } else if (match[2] !== undefined) {
      // r{suit} 形式（赤5）
      suit = match[2] as Suit;
      num = 5;
      isRed = true;
    } else {
      // {num}{suit} 形式
      num = parseInt(match[3]);
      suit = match[4] as Suit;
    }
    const key = `${suit}${num}`;
    countMap[key] = (countMap[key] || 0) + 1;
    tiles.push(createTile(suit, num, countMap[key] - 1, isRed));
  }
  return tiles;
}

// tiles_strを手牌・副露牌・リーチ状態にパース
// 形式: "手牌|副露1,副露2|RIICHI"
// 例: "1m2m3m4m5m6m7m8m9m1p1p|3m4m5m,z7z7z7"
// 例: "1m2m3m4m5m6m7m8m9m1p1pz1z1z7||RIICHI"
export function parseProblemStr(str: string): { tiles: Tile[]; openSets: Tile[][]; isRiichi: boolean } {
  const parts = str.split("|");
  const tiles = parseTileString(parts[0]);
  const openSets: Tile[][] = [];
  let isRiichi = false;

  if (parts[1] !== undefined) {
    for (const setStr of parts[1].split(",")) {
      const trimmed = setStr.trim();
      if (!trimmed) continue;
      openSets.push(parseTileString(trimmed));
    }
  }
  if (parts[2] !== undefined && parts[2].trim().toUpperCase() === "RIICHI") {
    isRiichi = true;
  }

  return { tiles, openSets, isRiichi };
}

// Supabaseのレコードから Problem を生成
// "7z" → "z7"、"1m" → "m1" のように スーツ+数字 形式に正規化
function normalizeTileKey(s: string): string {
  if (/^\d[mpsz]$/.test(s)) return s[1] + s[0];
  return s;
}

export function rowToProblem(row: {
  id: string;
  tiles_str: string;
  correct_discards: string;
  difficulty: number;
  description?: string;
  dora?: string;
}): Problem {
  const { tiles, openSets, isRiichi } = parseProblemStr(row.tiles_str);
  const corrects = row.correct_discards.split(",").map((s) => normalizeTileKey(s.trim()));
  const doraTiles = row.dora ? parseTileString(row.dora) : [];
  return {
    id: row.id,
    tiles,
    openSets: openSets.length > 0 ? openSets : undefined,
    isRiichi: isRiichi || undefined,
    dora: doraTiles.length > 0 ? doraTiles : undefined,
    correctDiscards: corrects,
    difficulty: row.difficulty as 1 | 2 | 3,
    description: row.description,
    isAuto: false,
  };
}
