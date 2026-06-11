"use client";

import React from "react";
import { Tile as TileType } from "@/types/mahjong";
import { JIHAI_LABELS, SUIT_LABELS } from "@/lib/mahjong";

interface TileProps {
  tile: TileType;
  onClick?: (tile: TileType) => void;
  disabled?: boolean;
  highlighted?: boolean; // 正解ハイライト
  wrong?: boolean;       // 不正解ハイライト
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
  const sizeClasses = {
    sm: "w-8 h-12 text-xs",
    md: "w-12 h-16 text-sm",
    lg: "w-14 h-20 text-base",
  };

  const suitColors: Record<string, string> = {
    m: "text-red-600",
    p: "text-blue-600",
    s: "text-green-600",
    z: "text-purple-700",
  };

  let bgClass = "bg-white border-gray-300";
  if (highlighted) bgClass = "bg-green-100 border-green-500 ring-2 ring-green-400";
  if (wrong) bgClass = "bg-red-100 border-red-500 ring-2 ring-red-400";

  const isClickable = onClick && !disabled;

  return (
    <button
      onClick={() => onClick?.(tile)}
      disabled={disabled || !onClick}
      className={`
        ${sizeClasses[size]}
        ${bgClass}
        border-2 rounded-md
        flex flex-col items-center justify-center
        font-bold select-none
        transition-all duration-100
        ${isClickable ? "cursor-pointer hover:scale-110 hover:-translate-y-1 hover:shadow-lg active:scale-95" : "cursor-default"}
        ${disabled ? "opacity-60" : ""}
      `}
    >
      {tile.suit === "z" ? (
        <span className={`${suitColors.z} leading-none`}>
          {JIHAI_LABELS[tile.num]}
        </span>
      ) : (
        <>
          <span className={`${suitColors[tile.suit]} text-lg leading-none font-black`}>
            {tile.num}
          </span>
          <span className={`${suitColors[tile.suit]} text-xs leading-none`}>
            {SUIT_LABELS[tile.suit]}
          </span>
        </>
      )}
    </button>
  );
}
