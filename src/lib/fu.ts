import { Tile, Suit } from "@/types/mahjong";
import { createTile, tileLabel, JIHAI_LABELS } from "@/lib/mahjong";
import {
  FuMentsu,
  FuProblem,
  FuResult,
  FuBreakdownItem,
  MentsuKind,
  WaitType,
} from "@/types/fu";

// ==================== ラベル ====================

export const MENTSU_KIND_LABELS: Record<MentsuKind, string> = {
  shuntsu: "順子",
  ankou: "暗刻",
  minkou: "明刻",
  ankan: "暗槓",
  minkan: "明槓",
};

export const WAIT_TYPE_LABELS: Record<WaitType, string> = {
  ryanmen: "両面",
  kanchan: "嵌張",
  penchan: "辺張",
  tanki: "単騎",
  shanpon: "双碰",
};

const WAIT_TYPE_FU: Record<WaitType, number> = {
  ryanmen: 0,
  kanchan: 2,
  penchan: 2,
  tanki: 2,
  shanpon: 0,
};

function mentsuFu(m: FuMentsu): number {
  switch (m.kind) {
    case "shuntsu":
      return 0;
    case "minkou":
      return m.isYaochu ? 4 : 2;
    case "ankou":
      return m.isYaochu ? 8 : 4;
    case "minkan":
      return m.isYaochu ? 16 : 8;
    case "ankan":
      return m.isYaochu ? 32 : 16;
  }
}

function mentsuLabel(m: FuMentsu): string {
  return `${tileLabel(m.tiles[0])}の${MENTSU_KIND_LABELS[m.kind]}`;
}

// ==================== 符計算 ====================

export function computeFu(problem: FuProblem): FuResult {
  const items: FuBreakdownItem[] = [];
  items.push({ label: "副底", fu: 20 });

  const isPinfuShape =
    problem.mentsuList.every((m) => m.kind === "shuntsu") &&
    problem.pairFu === 0 &&
    problem.waitType === "ryanmen";

  let isPinfuTsumo = false;

  if (problem.winType === "ron" && problem.isMenzen) {
    items.push({ label: "門前加符（ロン）", fu: 10 });
  }

  if (problem.winType === "tsumo") {
    if (isPinfuShape && problem.isMenzen) {
      isPinfuTsumo = true; // 平和のツモはツモ符を加算しない
    } else {
      items.push({ label: "ツモ符", fu: 2 });
    }
  }

  problem.mentsuList.forEach((m) => {
    const fu = mentsuFu(m);
    if (fu > 0) items.push({ label: mentsuLabel(m), fu });
  });

  if (problem.pairFu > 0) {
    items.push({
      label: `雀頭（${problem.pairReason ?? "役牌"}）`,
      fu: problem.pairFu,
    });
  }

  const waitFu = WAIT_TYPE_FU[problem.waitType];
  if (waitFu > 0) {
    items.push({
      label: `待ち（${WAIT_TYPE_LABELS[problem.waitType]}）`,
      fu: waitFu,
    });
  }

  const rawTotal = items.reduce((s, i) => s + i.fu, 0);

  let total: number;
  let isKuipinfuRon = false;

  if (isPinfuTsumo) {
    total = 20;
  } else if (!problem.isMenzen && problem.winType === "ron" && rawTotal === 20) {
    // 喰い平和のロンは特殊ルールで30符固定
    isKuipinfuRon = true;
    total = 30;
  } else {
    total = Math.ceil(rawTotal / 10) * 10;
  }

  return { items, rawTotal, total, isPinfuTsumo, isKuipinfuRon };
}

// ==================== 4択の選択肢生成 ====================

export function generateChoices(correctTotal: number): number[] {
  const choices = new Set<number>([correctTotal]);
  const deltas = [-20, -10, 10, 20, 30, -30];
  let i = 0;
  while (choices.size < 4 && i < deltas.length) {
    const candidate = correctTotal + deltas[i];
    if (candidate >= 20 && candidate <= 130) choices.add(candidate);
    i++;
  }
  // 万一足りなければランダムに埋める
  while (choices.size < 4) {
    const candidate = 20 + Math.floor(Math.random() * 11) * 10;
    if (candidate !== correctTotal) choices.add(candidate);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

// ==================== 問題生成 ====================

const NUMBER_SUITS: Suit[] = ["m", "p", "s"];

function weightedPick<T>(items: [T, number][]): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [item, w] of items) {
    r -= w;
    if (r <= 0) return item;
  }
  return items[items.length - 1][0];
}

// suit+numごとの使用枚数を管理し、4枚を超えないようにする
class TileUsage {
  private counts = new Map<string, number>();

  private key(suit: Suit, num: number) {
    return `${suit}${num}`;
  }

  remaining(suit: Suit, num: number): number {
    return 4 - (this.counts.get(this.key(suit, num)) ?? 0);
  }

  use(suit: Suit, num: number, count: number) {
    const k = this.key(suit, num);
    this.counts.set(k, (this.counts.get(k) ?? 0) + count);
  }
}

let idCounter = 0;

function makeTiles(usage: TileUsage, suit: Suit, num: number, count: number): Tile[] {
  const startIdx = 4 - usage.remaining(suit, num);
  usage.use(suit, num, count);
  const tiles: Tile[] = [];
  for (let i = 0; i < count; i++) {
    idCounter++;
    tiles.push(createTile(suit, num, startIdx + i + idCounter * 100));
  }
  return tiles;
}

function randomSimpleValue(usage: TileUsage, needCount: number): { suit: Suit; num: number } | null {
  const candidates: { suit: Suit; num: number }[] = [];
  for (const suit of NUMBER_SUITS) {
    for (let num = 2; num <= 8; num++) {
      if (usage.remaining(suit, num) >= needCount) candidates.push({ suit, num });
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function randomYaochuValue(usage: TileUsage, needCount: number): { suit: Suit; num: number } | null {
  const candidates: { suit: Suit; num: number }[] = [];
  for (const suit of NUMBER_SUITS) {
    for (const num of [1, 9]) {
      if (usage.remaining(suit, num) >= needCount) candidates.push({ suit, num });
    }
  }
  for (let num = 1; num <= 7; num++) {
    if (usage.remaining("z", num) >= needCount) candidates.push({ suit: "z", num });
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function buildTripletOrKan(
  usage: TileUsage,
  kind: "ankou" | "minkou" | "ankan" | "minkan",
  forceYaochu?: boolean
): FuMentsu | null {
  const count = kind === "ankan" || kind === "minkan" ? 4 : 3;
  const wantYaochu = forceYaochu ?? Math.random() < 0.5;
  const value =
    (wantYaochu ? randomYaochuValue(usage, count) : randomSimpleValue(usage, count)) ??
    randomSimpleValue(usage, count) ??
    randomYaochuValue(usage, count);
  if (!value) return null;
  const tiles = makeTiles(usage, value.suit, value.num, count);
  const isYaochu = value.suit === "z" || value.num === 1 || value.num === 9;
  return { kind, tiles, isYaochu };
}

// 順子を1つ作る。waitPosition/waitTypeを指定すると、その待ちに矛盾しない形にする
function buildShuntsu(
  usage: TileUsage,
  wait?: { type: "ryanmen" | "kanchan" | "penchan" }
): FuMentsu | null {
  let attempts = 0;
  while (attempts < 40) {
    attempts++;
    let start: number;
    let winningLocalIndex: number | undefined;
    if (wait?.type === "penchan") {
      start = Math.random() < 0.5 ? 1 : 7; // 1-2-3 or 7-8-9
      winningLocalIndex = start === 1 ? 2 : 0;
    } else if (wait?.type === "kanchan") {
      start = 1 + Math.floor(Math.random() * 7); // 1-7
      winningLocalIndex = 1;
    } else if (wait?.type === "ryanmen") {
      start = 2 + Math.floor(Math.random() * 5); // 2-6 (両端が1/9に触れない)
      winningLocalIndex = Math.random() < 0.5 ? 0 : 2;
    } else {
      start = 1 + Math.floor(Math.random() * 7);
    }

    const suit = NUMBER_SUITS[Math.floor(Math.random() * 3)];
    const nums = [start, start + 1, start + 2];
    if (nums.some((n) => usage.remaining(suit, n) < 1)) continue;

    const tiles = nums.map((n) => makeTiles(usage, suit, n, 1)[0]);
    return { kind: "shuntsu", tiles, isYaochu: false, winningTileLocalIndex: winningLocalIndex };
  }
  return null;
}

interface GenOptions {
  isMenzen: boolean;
}

// 使用可能な牌が尽きた極端なケース用の最終フォールバック（実用上はまず発生しない）
function fallbackAnkou(): FuMentsu {
  idCounter++;
  return {
    kind: "ankou",
    tiles: [
      createTile("m", 2, idCounter * 100),
      createTile("m", 2, idCounter * 100 + 1),
      createTile("m", 2, idCounter * 100 + 2),
    ],
    isYaochu: false,
  };
}

function fallbackShuntsu(): FuMentsu {
  idCounter++;
  return {
    kind: "shuntsu",
    tiles: [
      createTile("m", 1, idCounter * 100),
      createTile("m", 2, idCounter * 100 + 1),
      createTile("m", 3, idCounter * 100 + 2),
    ],
    isYaochu: false,
  };
}

function buildFillerMentsu(usage: TileUsage, opts: GenOptions): FuMentsu {
  const kind = weightedPick<"shuntsu" | "triplet" | "kan">([
    ["shuntsu", 55],
    ["triplet", 30],
    ["kan", 15],
  ]);

  if (kind === "shuntsu") {
    return buildShuntsu(usage) ?? buildTripletOrKan(usage, "ankou") ?? fallbackAnkou();
  }

  const openAllowed = !opts.isMenzen;
  const isOpen = openAllowed && Math.random() < 0.5;

  if (kind === "kan") {
    const built = buildTripletOrKan(usage, isOpen ? "minkan" : "ankan");
    if (built) return built;
  }
  return (
    buildTripletOrKan(usage, isOpen ? "minkou" : "ankou") ??
    buildShuntsu(usage) ??
    fallbackShuntsu()
  );
}

interface PairSpec {
  tiles: Tile[];
  pairFu: 0 | 2 | 4;
  pairReason?: string;
  roundWind?: string;
  seatWind?: string;
}

function buildPair(usage: TileUsage): PairSpec {
  const kind = weightedPick<"plain" | "sangen" | "windSingle" | "windDouble">([
    ["plain", 60],
    ["sangen", 20],
    ["windSingle", 10],
    ["windDouble", 10],
  ]);

  if (kind === "sangen") {
    const num = 5 + Math.floor(Math.random() * 3); // 5=白,6=発,7=中
    const tiles = makeTiles(usage, "z", num, 2);
    return {
      tiles,
      pairFu: 2,
      pairReason: `${JIHAI_LABELS[num]}（三元牌）`,
    };
  }

  if (kind === "windSingle" || kind === "windDouble") {
    const windNum = 1 + Math.floor(Math.random() * 4); // 東南西北
    const tiles = makeTiles(usage, "z", windNum, 2);
    const windName = JIHAI_LABELS[windNum];
    if (kind === "windDouble") {
      return {
        tiles,
        pairFu: 4,
        pairReason: `${windName}（連風牌）`,
        roundWind: windName,
        seatWind: windName,
      };
    }
    // 単一役牌: 自風のみ一致させる（場風は別の風にする）
    const otherWinds = ["東", "南", "西", "北"].filter((w) => w !== windName);
    const roundWind = otherWinds[Math.floor(Math.random() * otherWinds.length)];
    return {
      tiles,
      pairFu: 2,
      pairReason: `${windName}（自風牌）`,
      roundWind,
      seatWind: windName,
    };
  }

  // plain: 非役牌の対子（数牌 or 北以外の適当な字牌は避け、数牌のみにする）
  let attempts = 0;
  while (attempts < 30) {
    attempts++;
    const suit = NUMBER_SUITS[Math.floor(Math.random() * 3)];
    const num = 1 + Math.floor(Math.random() * 9);
    if (usage.remaining(suit, num) >= 2) {
      const tiles = makeTiles(usage, suit, num, 2);
      return { tiles, pairFu: 0 };
    }
  }
  const tiles = makeTiles(usage, "m", 2, 2);
  return { tiles, pairFu: 0 };
}

export function generateFuProblem(id: string): FuProblem {
  const usage = new TileUsage();
  const isMenzen = Math.random() < 0.7;
  const winType: FuProblem["winType"] = Math.random() < 0.5 ? "tsumo" : "ron";
  const waitType = weightedPick<WaitType>([
    ["ryanmen", 30],
    ["kanchan", 15],
    ["penchan", 15],
    ["tanki", 20],
    ["shanpon", 20],
  ]);

  const pair = buildPair(usage);

  const mentsuList: FuMentsu[] = [];
  let waitGroupIndex = -1;

  if (waitType === "ryanmen" || waitType === "kanchan" || waitType === "penchan") {
    waitGroupIndex = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
      if (i === waitGroupIndex) {
        mentsuList.push(
          buildShuntsu(usage, { type: waitType }) ?? buildTripletOrKan(usage, "ankou") ?? fallbackAnkou()
        );
      } else {
        mentsuList.push(buildFillerMentsu(usage, { isMenzen }));
      }
    }
  } else if (waitType === "shanpon") {
    waitGroupIndex = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
      if (i === waitGroupIndex) {
        const kind = winType === "tsumo" ? "ankou" : "minkou";
        mentsuList.push(buildTripletOrKan(usage, kind) ?? buildShuntsu(usage) ?? fallbackShuntsu());
      } else {
        mentsuList.push(buildFillerMentsu(usage, { isMenzen }));
      }
    }
  } else {
    // tanki: 雀頭が和了牌。面子は通常どおり生成
    waitGroupIndex = -1;
    for (let i = 0; i < 4; i++) {
      mentsuList.push(buildFillerMentsu(usage, { isMenzen }));
    }
  }

  return {
    id,
    mentsuList,
    pair: pair.tiles,
    pairFu: pair.pairFu,
    pairReason: pair.pairReason,
    waitType,
    waitGroupIndex,
    winType,
    isMenzen,
    roundWind: pair.roundWind,
    seatWind: pair.seatWind,
  };
}
