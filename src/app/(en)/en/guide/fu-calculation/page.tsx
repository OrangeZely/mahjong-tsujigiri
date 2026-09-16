import EnglishArticle from "@/components/EnglishArticle";
export const metadata = {"title": "How to calculate fu | Mahjong Tsujigiri!", "description": "Practice the hand-shape part of riichi mahjong scoring."};
const sections = [
  {
    "title": "Fu and han",
    "paragraphs": [
      "Fu are minipoints based on the shape of the hand and how it was won. Han come from yaku and bonus tiles. Both contribute to the final score; the final payment also depends on the dealer, win type, and scoring limits. This mode asks for fu only."
    ]
  },
  {
    "title": "1. Base and winning method",
    "bullets": [
      "Start a standard four-set-and-pair hand at 20 fu.",
      "Add 10 fu for winning a closed hand by discard (ron).",
      "Add 2 fu for self-draw (tsumo), except that closed Pinfu won by self-draw is fixed at 20 fu."
    ]
  },
  {
    "title": "2. Sets",
    "paragraphs": [
      "Sequences add no fu. Triplets and quads depend on whether they are open or concealed and whether the tile is a simple (2–8) or a terminal/honor. A triplet completed by ron is open for fu, even if the hand otherwise remains closed."
    ],
    "table": [
      [
        "Set",
        "Simples (2–8)",
        "Terminals / honors"
      ],
      [
        "Open triplet",
        "2 fu",
        "4 fu"
      ],
      [
        "Concealed triplet",
        "4 fu",
        "8 fu"
      ],
      [
        "Open quad",
        "8 fu",
        "16 fu"
      ],
      [
        "Concealed quad",
        "16 fu",
        "32 fu"
      ]
    ]
  },
  {
    "title": "3. The pair",
    "paragraphs": [
      "A dragon pair adds 2 fu. A pair of your seat wind or the round wind adds 2 fu. This app awards 4 fu when the pair is both the seat and round wind. Other pairs add no fu. Rules for a double-wind pair can differ between rulesets."
    ]
  },
  {
    "title": "4. The wait",
    "paragraphs": [
      "A closed wait, edge wait, or pair wait adds 2 fu. Two-sided and double-pair waits add no wait fu."
    ]
  },
  {
    "title": "5. Round up, with exceptions",
    "paragraphs": [
      "Add the fu and round up to the next multiple of 10: 38 becomes 40, while 40 stays 40.",
      "Closed Pinfu self-draw stays at 20 fu. An open all-sequence hand with a non-value pair and a two-sided ron is fixed at 30 fu even if the sum is 20.",
      "Seven Pairs is fixed at 25 fu and is not part of this mode’s generated four-set-and-pair questions."
    ]
  },
  {
    "title": "Try it in Fu Practice",
    "paragraphs": [
      "Look at the highlighted winning tile, check whether the hand is open or closed, then choose one of four fu totals. Review the breakdown after your round to see where each fu came from."
    ]
  }
];
export default function Page() { return <EnglishArticle title="How to calculate fu" intro="Practice the hand-shape part of riichi mahjong scoring." sections={sections} practice="/en/fu-game/"></EnglishArticle>; }
