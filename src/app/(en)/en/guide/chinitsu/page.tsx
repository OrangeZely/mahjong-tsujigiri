import EnglishArticle from "@/components/EnglishArticle";
export const metadata = {"title": "Reading full-flush waits | Mahjong Tsujigiri!", "description": "Learn to split a single-suit hand without overlooking a winning tile."};
const sections = [
  {
    "title": "Full Flush (Chinitsu)",
    "paragraphs": [
      "Full Flush uses only one suit: Characters, Circles, or Bamboo, with no honors. It is worth 6 han closed or 5 han open. Its value is high, but collecting a single suit can take time."
    ]
  },
  {
    "title": "Why these hands are difficult",
    "paragraphs": [
      "In a mixed-suit hand, suit boundaries help separate the sets. In a full flush, the same tiles can often be split into sets and pairs in several ways. The difficulty is checking all those interpretations."
    ]
  },
  {
    "title": "A reliable way to read the hand",
    "bullets": [
      "Convert the tiles into a sorted sequence of numbers.",
      "Try each possible pair, then work from the lowest remaining number.",
      "Remove a sequence or triplet when possible. If both are possible, explore both.",
      "For a ready hand, try adding each number from 1 to 9 and check for a complete four-set-and-pair structure. Never use more than four copies of a tile."
    ]
  },
  {
    "title": "Shapes to remember",
    "paragraphs": [
      "23456 can wait on 1, 4, or 7 when the rest of the hand supplies two completed sets and a pair. Try completing it as 123 + 456, 234 + 456, and 234 + 567.",
      "2345678 can wait on 2, 5, or 8 when the rest supplies two completed sets. The added tile forms the pair; there is no separate pair already fixed.",
      "1112345678999 is the nine-sided ready shape for Nine Gates: any tile from 1 to 9 in that suit completes it.",
      "A group of three identical tiles is not always a triplet. Reusing those tiles in sequences can reveal additional waits."
    ]
  },
  {
    "title": "When to pursue a full flush",
    "paragraphs": [
      "Six or seven tiles of one suit early in the hand can be a reason to consider a flush, depending on shape, visible tiles, and time remaining. With only a few suited tiles later in the hand, forcing it is often too slow. A heavily biased discard pile also warns opponents about your chosen suit."
    ]
  },
  {
    "title": "Practice until recognition becomes quick",
    "paragraphs": [
      "Start by checking all possibilities carefully, then repeat the patterns under a timer. After a round, compare every accepted discard and its waits rather than memorizing just one answer."
    ]
  }
];
export default function Page() { return <EnglishArticle title="Reading full-flush waits" intro="Learn to split a single-suit hand without overlooking a winning tile." sections={sections} practice="/en/game/?mode=speed"></EnglishArticle>; }
