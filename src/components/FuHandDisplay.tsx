"use client";

import React from "react";
import TileView from "@/components/Tile";
import { Tile as TileType } from "@/types/mahjong";
import { FuMentsu, FuProblem, FuResult } from "@/types/fu";
import { useI18n } from "@/i18n/client";
import { sets, waits, windLabel, pairLabel, fuItemLabel } from "@/i18n/mahjong";

export function MentsuGroup({
  mentsu,
  isWaitGroup,
}: {
  mentsu: FuMentsu;
  isWaitGroup: boolean;
}) {
  const { locale } = useI18n();
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5">
        {mentsu.tiles.map((t: TileType, i: number) => (
          <TileView
            key={t.id}
            tile={t}
            size="sm"
            highlighted={isWaitGroup && mentsu.winningTileLocalIndex === i}
          />
        ))}
      </div>
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          isWaitGroup
            ? "bg-yellow-500/20 text-yellow-300"
            : "bg-white/10 text-gray-300"
        }`}
      >
        {sets[mentsu.kind][locale]}
      </span>
    </div>
  );
}

export function PairGroup({
  pair,
  pairFu,
  pairReason,
  isWaitGroup,
}: {
  pair: TileType[];
  pairFu: number;
  pairReason?: string;
  isWaitGroup: boolean;
}) {
  const { locale, t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5">
        {pair.map((t, i) => (
          <TileView
            key={t.id}
            tile={t}
            size="sm"
            highlighted={isWaitGroup && i === pair.length - 1}
          />
        ))}
      </div>
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          pairFu > 0
            ? "bg-blue-500/20 text-blue-300"
            : "bg-white/10 text-gray-300"
        }`}
      >
        {t("雀頭")}{pairReason ? ` (${pairLabel(pair, pairFu, pairReason, locale)})` : ""}
      </span>
    </div>
  );
}

// 4面子＋雀頭を並べて表示
export function FuHand({ problem }: { problem: FuProblem }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center bg-black/20 rounded-xl p-4">
      {problem.mentsuList.map((m, i) => (
        <MentsuGroup key={i} mentsu={m} isWaitGroup={problem.waitGroupIndex === i} />
      ))}
      <PairGroup
        pair={problem.pair}
        pairFu={problem.pairFu}
        pairReason={problem.pairReason}
        isWaitGroup={problem.waitGroupIndex === -1}
      />
    </div>
  );
}

// ツモ/ロン・面前/鳴き・待ちの形・場風自風の状況タグ
export function FuContextTags({ problem }: { problem: FuProblem }) {
  const showWindContext =
    problem.roundWind !== undefined || problem.seatWind !== undefined;

  const { locale, t } = useI18n();
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="bg-white/10 text-white px-2 py-1 rounded-full font-bold">
        {problem.winType === "tsumo" ? t("ツモ和了") : t("ロン和了")}
      </span>
      <span className="bg-white/10 text-white px-2 py-1 rounded-full font-bold">
        {problem.isMenzen ? t("面前") : t("鳴きあり")}
      </span>
      <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full font-bold">
        {t("待ち:")}{waits[problem.waitType][locale]}
      </span>
      {showWindContext && (
        <span className="bg-white/10 text-white px-2 py-1 rounded-full font-bold">
          {t("場風:")}{windLabel(problem.roundWind, locale)} / {t("自風:")}{windLabel(problem.seatWind, locale)}
        </span>
      )}
    </div>
  );
}

// 符の内訳テーブル
export function FuBreakdown({ result }: { result: FuResult }) {
  const { locale, t } = useI18n();
  return (
    <div className="space-y-1">
      {result.items.map((item, i) => (
        <div key={i} className="flex justify-between text-sm text-gray-300">
          <span>{fuItemLabel(item, locale)}</span>
          <span className="text-yellow-300 font-bold">+{item.fu}{t("符")}</span>
        </div>
      ))}
      <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-sm">
        <span className="text-gray-400">
          {t("fuTotal", {fu: result.rawTotal})}
          {result.isPinfuTsumo && t("（平和ツモは20符固定）")}
          {result.isKuipinfuRon && t("（喰い平和ロンは30符固定）")}
        </span>
        <span className="text-white font-black">{result.total}{t("符")}</span>
      </div>
    </div>
  );
}
