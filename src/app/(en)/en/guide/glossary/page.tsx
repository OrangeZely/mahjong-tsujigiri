import EnglishArticle from "@/components/EnglishArticle";
export const metadata = {"title": "Riichi mahjong glossary | Mahjong Tsujigiri!", "description": "Definitions for discard puzzles, fu practice, and answer explanations."};
const sections = [
  {
    "title": "Terms used in this app",
    "table": [
      [
        "Term",
        "Meaning"
      ],
      [
        "Set (mentsu)",
        "A sequence, triplet, or quad. A standard hand has four sets and a pair."
      ],
      [
        "Pair (jantou / toitsu)",
        "Two identical tiles. Jantou is the pair used as the head of a standard winning hand."
      ],
      [
        "Sequence (shuntsu)",
        "Three consecutive numbers in the same suit, such as 3–4–5."
      ],
      [
        "Triplet (koutsu)",
        "Three identical tiles."
      ],
      [
        "Quad (kan / kantsu)",
        "Four identical tiles declared as a quad."
      ],
      [
        "Tenpai",
        "Ready: one winning tile completes the hand."
      ],
      [
        "Shanten",
        "The number of improvements needed to reach ready."
      ],
      [
        "Ukeire",
        "The tile types and available copies that improve the hand."
      ],
      [
        "Fu",
        "Minipoints awarded for hand shape and winning method."
      ],
      [
        "Han",
        "The scoring units awarded for yaku and bonus tiles."
      ],
      [
        "Two-sided wait (ryanmen)",
        "For example, 3–4 waiting on 2 or 5."
      ],
      [
        "Closed wait (kanchan)",
        "For example, 3–5 waiting on 4."
      ],
      [
        "Edge wait (penchan)",
        "1–2 waiting on 3, or 8–9 waiting on 7."
      ],
      [
        "Pair wait (tanki)",
        "Waiting to pair a single tile."
      ],
      [
        "Double-pair wait (shanpon)",
        "Two pairs waiting for either pair to become a triplet."
      ],
      [
        "Multi-sided wait",
        "A wait completed by three or more tile types."
      ],
      [
        "Closed hand (menzen)",
        "A hand with no open calls. A concealed quad does not open the hand."
      ],
      [
        "Open call (furo)",
        "Using an opponent’s discard for a sequence, triplet, or open quad."
      ],
      [
        "Furiten",
        "A restriction on winning by discard, including when your own discards contain a winning tile. Passing a winning discard can also cause furiten. Self-draw is still possible."
      ],
      [
        "Dora",
        "Bonus tiles that add han. Dora alone do not provide a yaku."
      ],
      [
        "Draw / discard",
        "Take a tile from the wall / choose a tile to throw away."
      ],
      [
        "Tsumo / ron",
        "Win by self-draw / win on another player’s discard."
      ],
      [
        "Chii / Pon / Kan",
        "Call a sequence / triplet / quad."
      ],
      [
        "Characters / Circles / Bamboo",
        "The three numbered suits, written m / p / s in explanations."
      ],
      [
        "Honors",
        "East, South, West, North, White Dragon, Green Dragon, and Red Dragon."
      ],
      [
        "Red five",
        "A bonus five, written rm / rp / rs for each suit in these explanations."
      ],
      [
        "Complete one-shanten",
        "A flexible one-shanten shape preserving both sequence completion and pair-based paths to ready."
      ]
    ]
  },
  {
    "title": "Alternative English names",
    "paragraphs": [
      "English yaku names vary between organizations and games. This app uses Full Straight (also called Pure Straight), Twin Sequences (Pure Double Sequence), Mixed Sequences (Mixed Triple Sequence), Common Ends (Chanta / Mixed Outside Hand), and Perfect Ends (Junchan / Pure Outside Hand). Common Terminals means terminals and honors only.",
      "The app’s yaku names follow the saved Taiyo Chemicals terminology as a starting point, with explicit clarifications: Value Honors distinguishes the yaku from honor tiles, and Closed Self-Draw distinguishes the yaku from drawing a tile. Names do not imply that the app uses a tournament’s entire ruleset."
    ]
  }
];
export default function Page() { return <EnglishArticle title="Riichi mahjong glossary" intro="Definitions for discard puzzles, fu practice, and answer explanations." sections={sections} practice="/en/"><section className="mt-8"><h2 className="text-xl font-bold text-white mb-3">Yaku reference</h2><p className="mb-3">Japanese names are shown here as a reference.</p><dl className="grid gap-2"><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">立直</dt><dd>Riichi</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">断么九</dt><dd>All Simples</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">門前清自摸</dt><dd>Closed Self-Draw</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">役牌</dt><dd>Value Honors</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">平和</dt><dd>Pinfu</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">一盃口</dt><dd>Twin Sequences</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">搶槓</dt><dd>Robbing a Quad</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">嶺上開花</dt><dd>Dead Wall Draw</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">海底撈月</dt><dd>Last Tile Draw</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">河底撈魚</dt><dd>Last Tile Claim</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">一発</dt><dd>Ippatsu</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">ダブルリーチ</dt><dd>Double Riichi</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">三色同刻</dt><dd>Mixed Triplets</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">三槓子</dt><dd>Three Quads</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">対々和</dt><dd>All Triplets</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">三暗刻</dt><dd>Three Concealed Triplets</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">小三元</dt><dd>Little Three Dragons</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">混老頭</dt><dd>Common Terminals</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">七対子</dt><dd>Seven Pairs</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">混全帯么九</dt><dd>Common Ends</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">一気通貫</dt><dd>Full Straight</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">三色同順</dt><dd>Mixed Sequences</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">二盃口</dt><dd>Double Twin Sequences</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">純全帯么九</dt><dd>Perfect Ends</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">混一色</dt><dd>Half Flush</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">清一色</dt><dd>Full Flush</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">国士無双</dt><dd>Thirteen Orphans</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">四暗刻</dt><dd>Four Concealed Triplets</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">大三元</dt><dd>Big Three Dragons</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">小四喜</dt><dd>Little Four Winds</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">大四喜</dt><dd>Big Four Winds</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">字一色</dt><dd>All Honors</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">清老頭</dt><dd>All Terminals</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">緑一色</dt><dd>All Green</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">九蓮宝燈</dt><dd>Nine Gates</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">四槓子</dt><dd>Four Quads</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">天和</dt><dd>Blessing of Heaven</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">地和</dt><dd>Blessing of Earth</dd></div><div className="flex flex-wrap justify-between gap-2 border-b border-white/10 py-2"><dt lang="ja">人和</dt><dd>Blessing of Man</dd></div></dl></section></EnglishArticle>; }
