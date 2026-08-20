import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "何切る問題とは？ 上達のための解き方ガイド | 麻雀 辻斬る！",
  description:
    "麻雀の「何切る」問題の意味と、正しい解き方の手順をやさしく解説。シャンテン数の数え方、受け入れ枚数の比べ方、初心者がやりがちな間違いまで、上達に直結する考え方をまとめました。",
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-black text-white mb-2">
          「何切る」とは？ 上達に効く解き方ガイド
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          麻雀の実力は「1枚の選択」の積み重ねで決まります
        </p>

        <div className="space-y-8 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              何切る問題とは
            </h2>
            <p className="mb-3">
              「何切る」とは、配られた手牌から<strong className="text-yellow-300">どの牌を捨てるのが最善か</strong>を考える問題形式のことです。
              麻雀の1局には20回近い打牌の選択があり、その一つひとつが和了率と失点に影響します。
              つまり何切るは、麻雀というゲームを最小単位に切り出した「詰将棋」のようなものです。
            </p>
            <p>
              実戦を何百局も打たなくても、何切るを繰り返せば
              <strong className="text-yellow-300">判断の型</strong>
              が身につきます。1問あたり数秒で解けるため、短時間でも練習量を積めるのが最大の利点です。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              解くときの3ステップ
            </h2>
            <p className="mb-3">
              上級者は感覚で切っているように見えますが、実際には次の順序で考えています。慣れるまでは意識して手順を踏みましょう。
            </p>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">
                  ステップ1: シャンテン数を数える
                </h3>
                <p className="text-sm">
                  シャンテン数とは「テンパイまであと何枚の入れ替えが必要か」を示す数字です。
                  まずは<strong className="text-yellow-300">シャンテン数が増える牌を候補から外します</strong>。
                  これだけで選択肢の大半が消え、判断がぐっと楽になります。
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">
                  ステップ2: 受け入れ枚数を比べる
                </h3>
                <p className="text-sm">
                  シャンテン数が同じ候補が残ったら、次は
                  <strong className="text-yellow-300">どちらが手を進める牌の種類・枚数が多いか</strong>
                  で比べます。同じ1シャンテンでも、受け入れが20枚の形と12枚の形では和了率がまったく違います。
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">
                  ステップ3: 打点と安全度を考える
                </h3>
                <p className="text-sm">
                  受け入れが近い場合に初めて、ドラや役、他家への安全度を天秤にかけます。
                  順序が逆になると「打点は高いが和了れない手」を作りがちです。
                  まず速度、次に打点、と覚えておきましょう。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              初心者がやりがちな3つの間違い
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">きれいな形を残そうとする</strong>：
                連続した数牌が並んでいると残したくなりますが、同じ部分に牌が重なりすぎると
                実は受け入れが狭くなっていることがあります。見た目ではなく枚数で判断しましょう。
              </li>
              <li>
                <strong className="text-white">ドラに固執する</strong>：
                ドラを抱えたまま手が進まず、結局和了れないのは典型的な失敗です。
                ドラ1枚（1翻）のために和了率を大きく下げるのは基本的に損になります。
              </li>
              <li>
                <strong className="text-white">早いうちから安全度を気にする</strong>：
                誰もリーチしていない序盤から安全牌を抱えると、単純に手が遅れます。
                守りに入るのは相手のリーチや明確な仕掛けが入ってからで十分です。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">もっと詳しく</h2>
            <div className="grid gap-3">
              <Link
                href="/guide/hai-koritsu"
                className="block bg-white/5 border border-yellow-500/40 rounded-xl p-4 hover:bg-yellow-500/10 transition-colors"
              >
                <span className="block text-white font-bold">
                  牌効率の基礎 — シャンテン数と受け入れ枚数
                </span>
                <span className="block text-gray-400 text-sm mt-1">
                  何切るの土台になる考え方を、具体的な形と枚数で解説します
                </span>
              </Link>
              <Link
                href="/guide/chinitsu"
                className="block bg-white/5 border border-red-500/40 rounded-xl p-4 hover:bg-red-500/10 transition-colors"
              >
                <span className="block text-white font-bold">
                  清一色の攻略 — 多面待ちを見抜く
                </span>
                <span className="block text-gray-400 text-sm mt-1">
                  多くの人が苦手にする清一色を、分解のコツから練習法まで
                </span>
              </Link>
              <Link
                href="/guide/glossary"
                className="block bg-white/5 border border-blue-400/40 rounded-xl p-4 hover:bg-blue-400/10 transition-colors"
              >
                <span className="block text-white font-bold">麻雀用語集</span>
                <span className="block text-gray-400 text-sm mt-1">
                  シャンテン・リャンメン・フリテンなど、頻出用語をまとめて確認
                </span>
              </Link>
            </div>
          </section>

          <section className="bg-white/5 border-2 border-yellow-500/50 rounded-2xl p-5 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              読んだら、すぐ試そう
            </h2>
            <p className="text-sm mb-4">
              知識は解いて初めて身につきます。60秒で何問斬れるか挑戦してみてください。
            </p>
            <Link
              href="/"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black px-8 py-3 rounded-xl transition-colors"
            >
              何切るを解いてみる ⚔️
            </Link>
          </section>

          <div className="pt-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
