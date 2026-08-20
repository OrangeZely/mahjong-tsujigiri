import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "牌効率の基礎 — シャンテン数と受け入れ枚数の考え方 | 麻雀 辻斬る！",
  description:
    "麻雀の牌効率をゼロから解説。シャンテン数の意味、受け入れ枚数の数え方、両面・嵌張・辺張の枚数比較、5ブロック理論、孤立牌を切る優先順位まで、何切るで迷わなくなる基礎知識をまとめました。",
};

export default function HaiKoritsuPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <p className="text-gray-500 text-sm mb-2">
          <Link href="/guide" className="hover:text-gray-300 underline">
            何切るガイド
          </Link>
          {" › 牌効率の基礎"}
        </p>
        <h1 className="text-3xl font-black text-white mb-2">牌効率の基礎</h1>
        <p className="text-gray-400 text-sm mb-8">
          シャンテン数と受け入れ枚数がわかれば、何切るの8割は解ける
        </p>

        <div className="space-y-8 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              牌効率とは何か
            </h2>
            <p>
              牌効率とは、<strong className="text-yellow-300">できるだけ早く和了形に近づくための打ち方</strong>のことです。
              麻雀は同じ手牌でも切る牌によって和了率が大きく変わります。
              牌効率は「どの選択が最も和了に近いか」を、感覚ではなく<strong className="text-yellow-300">枚数という数字</strong>で判断するための道具です。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              シャンテン数 — ゴールまでの距離
            </h2>
            <p className="mb-3">
              シャンテン数は<strong className="text-yellow-300">テンパイまであと何回の入れ替えが必要か</strong>を表します。
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>和了形＝<strong className="text-white">-1シャンテン</strong>（和了）</li>
              <li>テンパイ＝<strong className="text-white">0シャンテン</strong>（あと1枚で和了）</li>
              <li>1シャンテン＝あと2枚必要</li>
            </ul>
            <p>
              和了形は「4つの面子（3枚組）＋1つの雀頭（対子）」が基本です。
              まず手牌を面子・面子候補・雀頭候補に分解し、
              何が足りないかを数えるとシャンテン数が見えてきます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              受け入れ枚数 — 同じ距離なら広い方を選ぶ
            </h2>
            <p className="mb-4">
              シャンテン数が同じ選択肢が並んだら、次は
              <strong className="text-yellow-300">手が進む牌が何種類・何枚あるか</strong>で比べます。
              代表的な待ちの形と枚数は必ず覚えてください。
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
                <thead className="bg-white/10">
                  <tr>
                    <th className="text-left p-2 text-white">形</th>
                    <th className="text-left p-2 text-white">例</th>
                    <th className="text-left p-2 text-white">受け入れ</th>
                    <th className="text-left p-2 text-white">枚数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="p-2 font-bold text-yellow-300">両面</td>
                    <td className="p-2">3・4</td>
                    <td className="p-2">2と5</td>
                    <td className="p-2 font-bold">8枚</td>
                  </tr>
                  <tr>
                    <td className="p-2">嵌張</td>
                    <td className="p-2">3・5</td>
                    <td className="p-2">4</td>
                    <td className="p-2">4枚</td>
                  </tr>
                  <tr>
                    <td className="p-2">辺張</td>
                    <td className="p-2">1・2</td>
                    <td className="p-2">3</td>
                    <td className="p-2">4枚</td>
                  </tr>
                  <tr>
                    <td className="p-2">対子（シャンポン）</td>
                    <td className="p-2">5・5</td>
                    <td className="p-2">5</td>
                    <td className="p-2">2枚</td>
                  </tr>
                  <tr>
                    <td className="p-2">単騎</td>
                    <td className="p-2">7</td>
                    <td className="p-2">7</td>
                    <td className="p-2">3枚</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              両面が<strong className="text-yellow-300">8枚と圧倒的に広い</strong>ことが一目でわかります。
              「迷ったら両面を残す」が基本になるのはこのためです。
              逆に辺張・嵌張は同じ4枚なので、打点や安全度で選んで構いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              5ブロック理論 — 手牌を5つの箱に分ける
            </h2>
            <p className="mb-3">
              和了形には面子4つと雀頭1つ、つまり
              <strong className="text-yellow-300">合計5つのブロック</strong>が必要です。
              手牌を見たら、まず「ブロックがいくつあるか」を数えましょう。
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">ブロックが6つ以上ある</strong>：
                余分なブロックのうち、最も弱いもの（辺張・嵌張など）を崩します。
              </li>
              <li>
                <strong className="text-white">ブロックが4つ以下しかない</strong>：
                孤立牌を育ててブロックを作る必要があるため、安易に数牌を切ってはいけません。
              </li>
            </ul>
            <p className="mt-3">
              「何を切るか迷う」場面の多くは、ブロックが6つある状態です。
              数えるだけで答えが決まることも珍しくありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              孤立牌を切る優先順位
            </h2>
            <p className="mb-3">
              どこにも繋がっていない1枚（孤立牌）を切るときは、
              <strong className="text-yellow-300">将来ブロックになりにくいものから</strong>切ります。
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="font-bold text-white mb-2">切る順番（弱い順）</p>
              <p className="text-sm">
                役に関係ない字牌 → <span className="text-gray-400">1・9</span> →{" "}
                <span className="text-gray-300">2・8</span> →{" "}
                <span className="text-yellow-300">3・7</span> →{" "}
                <span className="text-yellow-300 font-bold">4・5・6</span>
              </p>
            </div>
            <p className="mt-3 text-sm">
              理由は単純で、<strong className="text-white">両面を作れる可能性</strong>が違うからです。
              5は4-6どちらにも繋がり両面になりますが、1は2-3と繋がっても辺張にしかなりません。
              中央の牌ほど価値が高い、と覚えておけば十分です。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              練習が一番の近道
            </h2>
            <p>
              牌効率は理屈を読むだけでは身につきません。
              同じ判断を何十回も繰り返すことで、初めて「見た瞬間に分かる」状態になります。
              1問数秒の何切るは、この反復に最適な練習方法です。
            </p>
          </section>

          <section className="bg-white/5 border-2 border-yellow-500/50 rounded-2xl p-5 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              覚えたての知識を試す
            </h2>
            <p className="text-sm mb-4">
              解いた問題には解説が付くので、間違えたところがすぐ分かります。
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
              href="/guide/glossary"
              className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
            >
              用語集で確認する
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
