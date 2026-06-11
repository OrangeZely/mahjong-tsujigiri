"use client";

import React from "react";
import { Tile as TileType } from "@/types/mahjong";
import { JIHAI_LABELS, SUIT_LABELS } from "@/lib/mahjong";

interface TileProps {
  tile: TileType;
  onClick?: (tile: TileType) => void;
  disabled?: boolean;
  highlighted?: boolean;
  wrong?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Tile({
  tile,
  onClick,
  disabled,
  highlighted,
  wrong,
  size = "md",
}: TileProps) {
  const suitColors: Record<string, string> = {
    m: "text-red-600",
    p: "text-blue-600",
    s: "text-green-600",
    z: "text-purple-700",
  };

  let bgClass = "bg-amber-50 border-amber-200 shadow-sm";
  if (highlighted) bgClass = "bg-green-100 border-green-500 ring-2 ring-green-400 shadow-md";
  if (wrong) bgClass = "bg-red-100 border-red-400 ring-2 ring-red-400 shadow-md";

  const isClickable = onClick && !disabled;

  return (
    <button
      onClick={() => onClick?.(tile)}
      disabled={disabled || !onClick}
      className={`
        w-[6.5%] aspect-[2/3]
        ${bgClass}
        border-2 rounded
        flex flex-col items-center justify-center
        font-bold select-none
        transition-all duration-100
        ${isClickable ? "cursor-pointer hover:scale-110 hover:-translate-y-2 hover:shadow-lg active:scale-95" : "cursor-default"}
        ${disabled ? "opacity-70" : ""}
        min-w-0
      `}
    >
      {tile.suit === "z" ? (
        <span className={`${suitColors.z} leading-none text-[min(2.8vw,13px)] font-black`}>
          {JIHAI_LABELS[tile.num]}
        </span>
      ) : (
        <>
          <span className={`${suitColors[tile.suit]} leading-none font-black text-[min(3.5vw,16px)]`}>
            {tile.num}
          </span>
          <span className={`${suitColors[tile.suit]} leading-none text-[min(2vw,9px)]`}>
            {SUIT_LABELS[tile.suit]}
          </span>
        </>
      )}
    </button>
  );
}
