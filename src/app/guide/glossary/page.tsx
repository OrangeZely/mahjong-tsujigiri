import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "麻雀用語集 — 何切るでよく出る言葉をまとめて解説 | 麻雀 辻斬る！",
  description:
    "シャンテン・テンパイ・両面・嵌張・辺張・フリテン・面前・副露など、麻雀の何切る問題や解説でよく登場する用語をやさしくまとめました。読み方と意味がすぐ確認できます。",
};

interface Term {
  word: string;
  kana: string;
  desc: string;
}

const BASICS: Term[] = [
  {
    word: "面子",
    kana: "メンツ",
    desc: "3枚1組のまとまり。連続する3枚（順子）か、同じ牌3枚（刻子）のこと。和了には4つ必要。",
  },
  {
    word: "雀頭",
    kana: "ジャントウ",
    desc: "同じ牌2枚の組。「アタマ」とも呼ぶ。和了形には必ず1つ必要。",
  },
  {
    word: "順子",
    kana: "シュンツ",
    desc: "同じ種類で連続する3枚（例：3・4・5）。",
  },
  {
    word: "刻子",
    kana: "コーツ",
    desc: "同じ牌3枚（例：5・5・5）。",
  },
  {
    word: "対子",
    kana: "トイツ",
    desc: "同じ牌2枚。雀頭の候補になる。",
  },
  {
    word: "テンパイ",
    kana: "テンパイ",
    desc: "あと1枚で和了できる状態。0シャンテンともいう。",
  },
  {
    word: "シャンテン数",
    kana: "シャンテンスウ",
    desc: "テンパイまであと何枚の入れ替えが必要かを示す数字。小さいほど和了に近い。",
  },
];

const WAITS: Term[] = [
  {
    word: "両面",
    kana: "リャンメン",
    desc: "3・4のように連続した2枚で、両端の2種類を待つ形。受け入れ8枚と最も広い。",
  },
  {
    word: "嵌張",
    kana: "カンチャン",
    desc: "3・5のように1つ空いた形で、間の1種類を待つ。受け入れ4枚。",
  },
  {
    word: "辺張",
    kana: "ペンチャン",
    desc: "1・2または8・9の形で、3または7だけを待つ。受け入れ4枚。",
  },
  {
    word: "単騎",
    kana: "タンキ",
    desc: "雀頭となる1枚を待つ形。受け入れ3枚。",
  },
  {
    word: "シャンポン",
    kana: "シャンポン",
    desc: "対子が2つあり、どちらかが3枚目になるのを待つ形。受け入れ4枚。",
  },
  {
    word: "多面待ち",
    kana: "タメンマチ",
    desc: "3種類以上の牌で和了できる形。清一色でよく現れる。",
  },
];

const PLAY: Term[] = [
  {
    word: "門前",
    kana: "メンゼン",
    desc: "一度も鳴いていない状態。リーチができ、翻数も上がりやすい。",
  },
  {
    word: "副露",
    kana: "フーロ",
    desc: "他家の捨て牌を使って面子を作ること。「鳴き」ともいう。手は早くなるが翻数は下がりやすい。",
  },
  {
    word: "フリテン",
    kana: "フリテン",
    desc: "自分の待ち牌を自分で捨てている状態。ロン和了ができなくなる。",
  },
  {
    word: "ドラ",
    kana: "ドラ",
    desc: "持っているだけで翻数が増えるボーナス牌。ただし役がないと和了できない点に注意。",
  },
  {
    word: "受け入れ",
    kana: "ウケイレ",
    desc: "手が進む牌の種類と枚数のこと。何切るでは受け入れの広さが判断基準になる。",
  },
  {
    word: "牌効率",
    kana: "ハイコウリツ",
    desc: "できるだけ早く和了形に近づくための打ち方の考え方。",
  },
];

function TermList({ title, terms }: { title: string; terms: Term[] }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      <dl className="space-y-3">
        {terms.map((t) => (
          <div
            key={t.word}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <dt className="font-bold text-yellow-300">
              {t.word}
              <span className="text-gray-400 text-sm font-normal ml-2">
                （{t.kana}）
              </span>
            </dt>
            <dd className="text-sm mt-1">{t.desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <p className="text-gray-500 text-sm mb-2">
          <Link href="/guide" className="hover:text-gray-300 underline">
            何切るガイド
          </Link>
          {" › 麻雀用語集"}
        </p>
        <h1 className="text-3xl font-black text-white mb-2">麻雀用語集</h1>
        <p className="text-gray-400 text-sm mb-8">
          何切るの解説を読むときに、ここで意味を確認できます
        </p>

        <div className="space-y-8 text-gray-200 leading-relaxed">
          <TermList title="手牌の基本" terms={BASICS} />
          <TermList title="待ちの形" terms={WAITS} />
          <TermList title="打ち方に関する用語" terms={PLAY} />

          <section className="bg-white/5 border-2 border-yellow-500/50 rounded-2xl p-5 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              用語が分かったら実践へ
            </h2>
            <p className="text-sm mb-4">
              問題を解くと解説が付くので、用語の使われ方も自然に身につきます。
            </p>
            <Link
              href="/"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black px-8 py-3 rounded-xl transition-colors"
            >
              何切るを解いてみる ⚔️
            </Link>
          </section>

          <div className="pt-4 flex gap-4">
            <Link
              href="/guide"
              className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
            >
              ガイド一覧
            </Link>
            <Link
              href="/guide/hai-koritsu"
              className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
            >
              牌効率の基礎
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
