"use client";

import React from "react";
import { useI18n } from "@/i18n/client";
import { tileLabel } from "@/lib/mahjong";
import Image from "next/image";
import { Tile as TileType } from "@/types/mahjong";

function getTileImagePath(tile: TileType): string {
  if (tile.isRed && tile.suit === "m") return `/tiles/p_ms5r_1.png`;
  if (tile.isRed && tile.suit === "p") return `/tiles/p_ps5r_1.png`;
  if (tile.isRed && tile.suit === "s") return `/tiles/p_ss5r_1.png`;
  if (tile.suit === "m") return `/tiles/p_ms${tile.num}_1.png`;
  if (tile.suit === "p") return `/tiles/p_ps${tile.num}_1.png`;
  if (tile.suit === "s") return `/tiles/p_ss${tile.num}_1.png`;
  const jiMap: Record<number, string> = {
    1: "p_ji_e_1.png",
    2: "p_ji_s_1.png",
    3: "p_ji_w_1.png",
    4: "p_ji_n_1.png",
    5: "p_ji_h_1.png",
    6: "p_no_1.png",
    7: "p_ji_c_1.png",
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
  const {locale} = useI18n();
  // 牌画像（542×720）は左右に透明な余白があり、牌の面は x=52〜511 の459px。
  // 箱を面の縦横比にして画像をはみ出させ、余白の分だけ牌を大きく見せる。
  const sizeClasses = {
    sm: "h-14 aspect-[459/720]",
    md: "w-full min-w-0 aspect-[459/720]",
    lg: "h-20 aspect-[459/720]",
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
        ${sizeClasses[size]}
        relative overflow-hidden rounded
        select-none transition-all duration-100
        ${ringClass}
        ${isClickable ? "cursor-pointer hover:scale-110 hover:-translate-y-2 hover:shadow-xl active:scale-95" : "cursor-default"}
        ${disabled ? "opacity-70" : ""}
        bg-transparent border-none p-0 min-w-0
      `}
    >
      <span className="absolute inset-y-0 left-[-11.33%] w-[118.08%]">
        <Image
          src={getTileImagePath(tile)}
          alt={tileLabel(tile, locale)}
          fill
          className="object-fill"
          unoptimized
        />
      </span>
    </button>
  );
}
