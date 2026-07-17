#!/bin/bash
make() {
  local src="$1"; local out="$2"; local caption="$3"; local sub="$4"
  local W=1170; local H=2532
  local imgW=1010
  # source is 1170x2532 -> scaled to imgW keeps ratio
  local imgH=$(python3 -c "print(round(2532*$imgW/1170))")
  local imgX=$(( (W-imgW)/2 ))
  local imgY=300
  cat > _tmp.svg <<SVG
<svg width="$W" height="$H" viewBox="0 0 $W $H" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#0f4d31"/>
<stop offset="55%" stop-color="#08301e"/>
<stop offset="100%" stop-color="#061a12"/>
</linearGradient>
<clipPath id="round"><rect x="$imgX" y="$imgY" width="$imgW" height="$imgH" rx="44"/></clipPath>
</defs>
<rect width="$W" height="$H" fill="url(#bg)"/>
<text x="$((W/2))" y="150" font-family="'Hiragino Kaku Gothic ProN',sans-serif" font-size="76" font-weight="bold" fill="#f5c542" text-anchor="middle">$caption</text>
<text x="$((W/2))" y="228" font-family="'Hiragino Kaku Gothic ProN',sans-serif" font-size="40" fill="#dbeadd" text-anchor="middle">$sub</text>
<rect x="$imgX" y="$imgY" width="$imgW" height="$imgH" rx="44" fill="none" stroke="#f5c542" stroke-width="3" opacity="0.55"/>
<image x="$imgX" y="$imgY" width="$imgW" height="$imgH" clip-path="url(#round)" xlink:href="$PWD/$src"/>
</svg>
SVG
  rsvg-convert -w $W -h $H _tmp.svg -o "$out"
  echo "made $out"
}
make shot-home.png    screenshot-1-home.png    "何を切る？"          "実戦の何切るをスキマ時間に"
make shot-game.png    screenshot-2-game.png    "60秒で何問斬れる"      "牌効率が自然と身につくトレーニング"
make shot-ranking.png screenshot-3-ranking.png "全国の剣客と競う"      "スコアと段位で腕試し"
rm -f _tmp.svg
