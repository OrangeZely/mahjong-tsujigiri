"use client";

import React from "react";
import Image from "next/image";
import { Tile as TileType } from "@/types/mahjong";

// 牌の種類とファイル名のマッピング
function getTileImagePath(tile: TileType): string {
  if (tile.suit === "m") return `/tiles/p_ms${tile.num}_1.gif`;
  if (tile.suit === "p") return `/tiles/p_ps${tile.num}_1.gif`;
  if (tile.suit === "s") return `/tiles/p_ss${tile.num}_1.gif`;
  // 字牌
  const jiMap: Record<number, string> = {
    1: "p_ji_e_1.gif", // 東
    2: "p_ji_s_1.gif", // 南
    3: "p_ji_w_1.gif", // 西
    4: "p_ji_n_1.gif", // 北
    5: "p_ji_h_1.gif", // 白
    6: "p_no_1.gif",   // 発
    7: "p_ji_c_1.gif", // 中
  };
  return `/tiles/${jiMap[tile.num]}`;
}

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
    sm: "w-7 h-10",
    md: "w-[6.5%] aspect-[3/4]",
    lg: "w-14 h-20",
  };

  const isClickable = onClick && !disabled;

  let ringClass = "";
  if (highlighted) ringClass = "ring-4 ring-green-400 ring-offset-1 brightness-110";
  if (wrong) ringClass = "ring-4 ring-red-400 ring-offset-1 brightness-75";

  return (
    <button
      onClick={() => onClick?.(tile)}
      disabled={disabled || !onClick}
      className={`
        ${size === "md" ? "w-[6.5%] aspect-[3/4]" : sizeClasses[size]}
        relative overflow-hidden rounded
        select-none transition-all duration-100
        ${ringClass}
        ${isClickable ? "cursor-pointer hover:scale-110 hover:-translate-y-2 hover:shadow-xl active:scale-95" : "cursor-default"}
        ${disabled ? "opacity-70" : ""}
        bg-transparent border-none p-0 min-w-0
      `}
    >
      <Image
        src={getTileImagePath(tile)}
        alt={`${tile.suit}${tile.num}`}
        fill
        className="object-contain"
        unoptimized
      />
    </button>
  );
}
