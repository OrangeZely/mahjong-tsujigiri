"use client";

import React, { useEffect, useState } from "react";
import TileView from "@/components/Tile";
import { Tile as TileType } from "@/types/mahjong";
import { FuMentsu, FuProblem, FuResult } from "@/types/fu";
import {
  computeFu,
  generateChoices,
  generateFuProblem,
  MENTSU_KIND_LABELS,
  WAIT_TYPE_LABELS,
} from "@/lib/fu";

function MentsuGroup({
  mentsu,
  isWaitGroup,
}: {
  mentsu: FuMentsu;
  isWaitGroup: boolean;
}) {
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
        {MENTSU_KIND_LABELS[mentsu.kind]}
      </span>
    </div>
  );
}

function PairGroup({
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
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5">
        {pair.map((t) => (
          <TileView key={t.id} tile={t} size="sm" highlighted={isWaitGroup} />
        ))}
      </div>
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          pairFu > 0
            ? "bg-blue-500/20 text-blue-300"
            : "bg-white/10 text-gray-300"
        }`}
      >
        雀頭{pairReason ? `(${pairReason})` : ""}
      </span>
    </div>
  );
}

export default function FuQuizClient() {
  const [problem, setProblem] = useState<FuProblem | null>(null);
  const [result, setResult] = useState<FuResult | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const nextProblem = () => {
    const p = generateFuProblem(`fu_${Date.now()}_${Math.random()}`);
    const r = computeFu(p);
    setProblem(p);
    setResult(r);
    setChoices(generateChoices(r.total));
    setSelected(null);
  };

  useEffect(() => {
    nextProblem();
  }, []);

  if (!problem || !result) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
        問題を準備中...
      </div>
    );
  }

  const handleSelect = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    setTotalCount((c) => c + 1);
    if (value === result.total) setCorrectCount((c) => c + 1);
  };

  const showWindContext =
    problem.roundWind !== undefined || problem.seatWind !== undefined;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">符計算クイズ</h3>
        <span className="text-xs text-gray-400">
          正解 <span className="text-yellow-300 font-bold">{correctCount}</span> /{" "}
          {totalCount}
        </span>
      </div>

      {/* 状況の説明 */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="bg-white/10 text-white px-2 py-1 rounded-full font-bold">
          {problem.winType === "tsumo" ? "ツモ和了" : "ロン和了"}
        </span>
        <span className="bg-white/10 text-white px-2 py-1 rounded-full font-bold">
          {problem.isMenzen ? "面前" : "鳴きあり"}
        </span>
        <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full font-bold">
          待ち: {WAIT_TYPE_LABELS[problem.waitType]}
        </span>
        {showWindContext && (
          <span className="bg-white/10 text-white px-2 py-1 rounded-full font-bold">
            場風:{problem.roundWind} 自風:{problem.seatWind}
          </span>
        )}
      </div>

      {/* 手牌 */}
      <div className="flex flex-wrap gap-3 justify-center bg-black/20 rounded-xl p-4 mb-4">
        {problem.mentsuList.map((m, i) => (
          <MentsuGroup
            key={i}
            mentsu={m}
            isWaitGroup={problem.waitGroupIndex === i}
          />
        ))}
        <PairGroup
          pair={problem.pair}
          pairFu={problem.pairFu}
          pairReason={problem.pairReason}
          isWaitGroup={problem.waitGroupIndex === -1}
        />
      </div>

      <p className="text-center text-gray-300 text-sm mb-3">
        この手牌の<span className="text-yellow-300 font-bold">合計符</span>
        は何符？（黄色い枠＝和了牌）
      </p>

      {/* 4択 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {choices.map((c) => {
          const isCorrectChoice = c === result.total;
          const isSelected = c === selected;
          let cls = "bg-white/10 border-white/20 text-white hover:bg-white/20";
          if (selected !== null) {
            if (isCorrectChoice) {
              cls = "bg-green-500/30 border-green-400 text-green-200";
            } else if (isSelected) {
              cls = "bg-red-500/30 border-red-400 text-red-200";
            } else {
              cls = "bg-white/5 border-white/10 text-gray-500";
            }
          }
          return (
            <button
              key={c}
              onClick={() => handleSelect(c)}
              disabled={selected !== null}
              className={`border-2 rounded-xl py-3 font-black text-lg transition-colors ${cls}`}
            >
              {c}符
            </button>
          );
        })}
      </div>

      {/* 解説 */}
      {selected !== null && (
        <div className="bg-black/20 rounded-xl p-4 space-y-1">
          <p className="text-white font-bold text-sm mb-2">符の内訳</p>
          {result.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm text-gray-300"
            >
              <span>{item.label}</span>
              <span className="text-yellow-300 font-bold">+{item.fu}符</span>
            </div>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-sm">
            <span className="text-gray-400">
              合計{result.rawTotal}符 → 10符単位に切り上げ
              {result.isPinfuTsumo && "（平和ツモは20符固定）"}
              {result.isKuipinfuRon && "（喰い平和ロンは30符固定）"}
            </span>
            <span className="text-white font-black">{result.total}符</span>
          </div>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={nextProblem}
          className="mt-4 w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black py-3 rounded-xl transition-colors"
        >
          次の問題
        </button>
      )}
    </div>
  );
}
