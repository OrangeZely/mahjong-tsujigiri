import EnglishArticle from "@/components/EnglishArticle";
import Link from "next/link";
export const metadata = {"title": "What to Discard: a practice guide | Mahjong Tsujigiri!", "description": "Better mahjong starts with better decisions, one tile at a time."};
const sections = [
  {
    "title": "What are discard puzzles?",
    "paragraphs": [
      "A “what to discard” puzzle asks you to choose the best tile to discard from a hand. Each decision affects how quickly you can win and the value of your hand. Practicing individual decisions helps you recognize useful patterns without playing hundreds of full games.",
      "Mahjong Tsujigiri! focuses on riichi mahjong. These are hand-building exercises; a real game also requires attention to opponents, discards, scores, and the round."
    ]
  },
  {
    "title": "1. Check the shanten number",
    "paragraphs": [
      "Shanten measures how far a hand is from ready (tenpai). First compare discards that keep the smallest shanten number. Avoid moving farther from ready without a good reason."
    ]
  },
  {
    "title": "2. Count improving tiles",
    "paragraphs": [
      "With equal shanten, compare ukeire: the types and remaining copies of tiles that move the hand forward. Two one-shanten hands can have very different chances of reaching ready. Also consider the quality of the eventual wait."
    ]
  },
  {
    "title": "3. Weigh value and safety",
    "paragraphs": [
      "When efficiency is close, compare dora, yaku, and the safety of your discards. Do not chase a valuable hand so stubbornly that you rarely complete it. In an actual game, a dangerous opponent may make defense the priority."
    ]
  },
  {
    "title": "Common mistakes",
    "bullets": [
      "Keeping a tidy-looking shape without counting its improving tiles.",
      "Holding an isolated dora at the expense of a much faster hand.",
      "Forgetting that visible tiles reduce the number of copies still available.",
      "Treating a puzzle answer as a universal rule, regardless of game context."
    ]
  },
  {
    "title": "A short practice routine",
    "paragraphs": [
      "Try a 60-second round, then review your answers. Revisit a missed shape until you can explain why a discard works. Oni Challenge adds a five-second limit to each question; consecutive correct answers double the points up to 8×."
    ]
  }
];
export default function Page() { return <EnglishArticle title="What to Discard: a practice guide" intro="Better mahjong starts with better decisions, one tile at a time." sections={sections} practice="/en/"><nav className="mt-8 grid gap-3"><Link className="text-yellow-300 underline" href="/en/guide/hai-koritsu/">Tile efficiency</Link><Link className="text-yellow-300 underline" href="/en/guide/chinitsu/">Full-flush waits</Link><Link className="text-yellow-300 underline" href="/en/guide/fu-calculation/">Fu calculation</Link><Link className="text-yellow-300 underline" href="/en/guide/glossary/">Mahjong glossary</Link></nav></EnglishArticle>; }
