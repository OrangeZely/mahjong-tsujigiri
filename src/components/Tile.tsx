"use client";

import React from "react";
import { Tile as TileType } from "@/types/mahjong";

// Unicode麻雀牌マッピング
const TILE_UNICODE: Record<string, Record<number, string>> = {
  m: { 1:"🀇", 2:"🀈", 3:"🀉", 4:"🀊", 5:"🀋", 6:"🀌", 7:"🀍", 8:"🀎", 9:"🀏" },
  p: { 1:"🀙", 2:"🀚", 3:"🀛", 4:"🀜", 5:"🀝", 6:"🀞", 7:"🀟", 8:"🀠", 9:"🀡" },
  s: { 1:"🀐", 2:"🀑", 3:"🀒", 4:"🀓", 5:"🀔", 6:"🀕", 7:"🀖", 8:"🀗", 9:"🀘" },
  z: { 1:"🀀", 2:"🀁", 3:"🀂", 4:"🀃", 5:"🀆", 6:"🀅", 7:"🀄" },
  // z: 1=東 2=南 3=西 4=北 5=白 6=発 7=中
};

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
  const sizeClasses = {
    sm: "text-lg",
    md: "text-[20px]",
    lg: "text-5xl",
  };

  const emoji = TILE_UNICODE[tile.suit]?.[tile.num] ?? "🀫";
  const isClickable = onClick && !disabled;

  let filterClass = "";
  if (highlighted) filterClass = "drop-shadow-[0_0_6px_rgba(34,197,94,1)] scale-110 -translate-y-1";
  if (wrong) filterClass = "drop-shadow-[0_0_6px_rgba(239,68,68,1)]";

  return (
    <button
      onClick={() => onClick?.(tile)}
      disabled={disabled || !onClick}
      className={`
        ${sizeClasses[size]}
        ${filterClass}
        leading-none select-none
        transition-all duration-100
        ${isClickable ? "cursor-pointer hover:scale-125 hover:-translate-y-2 active:scale-95" : "cursor-default"}
        ${disabled ? "opacity-70" : ""}
        bg-transparent border-none p-0.5
      `}
      style={{ lineHeight: 1 }}
    >
      {emoji}
    </button>
  );
}
