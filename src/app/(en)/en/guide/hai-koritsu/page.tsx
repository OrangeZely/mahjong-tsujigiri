import EnglishArticle from "@/components/EnglishArticle";
export const metadata = {"title": "Tile efficiency | Mahjong Tsujigiri!", "description": "Understand shanten, improving tiles, and the five-block approach."};
const sections = [
  {
    "title": "Efficiency is about useful draws",
    "paragraphs": [
      "Tile efficiency is the practice of choosing discards that bring a hand closer to completion as quickly as possible. Count useful draws instead of relying only on how a shape looks."
    ]
  },
  {
    "title": "Shanten: distance from ready",
    "bullets": [
      "A complete hand is −1 shanten.",
      "A ready hand is 0 shanten: one winning tile completes it.",
      "A one-shanten hand needs one improvement to become ready, then a winning tile.",
      "A standard hand contains four sets and one pair. Seven Pairs and Thirteen Orphans are special shapes."
    ]
  },
  {
    "title": "Compare wait shapes",
    "paragraphs": [
      "The counts below are maximum available copies before subtracting other tiles visible in your hand, discards, or open sets."
    ],
    "table": [
      [
        "Shape",
        "Example",
        "Completing tiles",
        "Maximum copies"
      ],
      [
        "Two-sided (ryanmen)",
        "3–4",
        "2 or 5",
        "8"
      ],
      [
        "Closed wait (kanchan)",
        "3–5",
        "4",
        "4"
      ],
      [
        "Edge wait (penchan)",
        "1–2",
        "3",
        "4"
      ],
      [
        "Pair wait (tanki)",
        "One 5",
        "5",
        "3"
      ],
      [
        "Double-pair wait (shanpon)",
        "55 and 88",
        "5 or 8",
        "4"
      ]
    ]
  },
  {
    "title": "Think in five blocks",
    "paragraphs": [
      "A standard winning hand needs four sets and a pair. Identify five promising blocks: completed sets, pairs, or incomplete sequences. If you have six, compare which block is weakest before dismantling a strong one. Two-sided shapes usually offer more useful draws than closed or edge shapes.",
      "Do not make the five-block approach an absolute rule. Keeping a sixth block can be useful when shapes are similar or valuable improvements remain."
    ]
  },
  {
    "title": "Isolated tiles",
    "paragraphs": [
      "Middle suit tiles tend to connect in more ways than terminals. Isolated non-value honors are often expendable early, while value honors may be useful for a yaku. Compare nearby groups too: an isolated tile can extend a sequence or create a wide wait.",
      "After choosing a discard, ask which next draws would make you regret it. This helps you preserve flexibility."
    ]
  }
];
export default function Page() { return <EnglishArticle title="Tile efficiency" intro="Understand shanten, improving tiles, and the five-block approach." sections={sections} practice="/en/game/?mode=casual"></EnglishArticle>; }
