import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "清一色の攻略 — 多面待ちを見抜くコツ | 麻雀 辻斬る！",
  description:
    "麻雀で多くの人が苦手にする清一色（チンイツ）を解説。手牌を分解する手順、多面待ちの代表的な形、待ちを見落とさないための練習法まで、実戦で使えるコツをまとめました。",
};

export default function ChinitsuPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <p className="text-gray-500 text-sm mb-2">
          <Link href="/guide" className="hover:text-gray-300 underline">
            何切るガイド
          </Link>
          {" › 清一色の攻略"}
        </p>
        <h1 className="text-3xl font-black text-white mb-2">清一色の攻略</h1>
        <p className="text-gray-400 text-sm mb-8">
          苦手な人が多い分、できるようになると大きな武器になります
        </p>

        <div className="space-y-8 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              清一色とはどんな役か
            </h2>
            <p className="mb-3">
              清一色は、萬子・筒子・索子のうち
              <strong className="text-yellow-300">1種類の数牌だけで手牌を揃える</strong>役です。
              字牌も使えません。翻数は<strong className="text-white">門前で6翻、鳴くと5翻</strong>と非常に高く、
              満貫以上がほぼ確定する主力級の役です。
            </p>
            <p>
              高い代わりに、和了までの道のりは長くなります。
              使える牌が全体の3分の1に限られるため、序盤から狙うかどうかの判断が重要です。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              なぜ清一色は難しいのか
            </h2>
            <p className="mb-3">
              普通の手牌は種類が分かれているため、面子の切れ目が自然に見えます。
              ところが清一色は同じ種類の牌が10枚以上並ぶため、
              <strong className="text-yellow-300">どこで区切るかの候補が一気に増えます</strong>。
            </p>
            <p>
              結果として「待ちが5種類あるのに3種類しか見えていない」という見落としが起こります。
              清一色が難しいのは牌が特殊だからではなく、
              <strong className="text-white">分解のパターンが多いから</strong>なのです。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              基本の手順 — 端から順番に切り分ける
            </h2>
            <p className="mb-3">
              多面待ちを見抜くコツは、思いつきで区切らず
              <strong className="text-yellow-300">必ず端から機械的に処理する</strong>ことです。
            </p>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">1. 数字を並べて書く</h3>
                <p className="text-sm">
                  頭の中で「1が3枚、2が1枚…」と数字の並びに変換します。
                  牌の絵柄で考えるより圧倒的に速くなります。
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">
                  2. 左端から3枚ずつ面子を取る
                </h3>
                <p className="text-sm">
                  一番小さい数字から順に、刻子（同じ3枚）か順子（連続3枚）を取っていきます。
                  迷ったら両方のパターンを試すのが確実です。
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">
                  3. 雀頭の候補をずらして試す
                </h3>
                <p className="text-sm">
                  同じ牌が2枚ある箇所を順番に雀頭とみなし、残りが面子に分かれるか確認します。
                  ここを飛ばすと待ちを見落とします。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              覚えておきたい代表的な形
            </h2>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-yellow-300 mb-1">
                  2345678 — 三面待ちの基本
                </h3>
                <p className="text-sm">
                  雀頭が別にある状態でこの7枚が残ると、
                  <strong className="text-white">2・5・8</strong>の3種類で和了できます。
                  「234＋5678」「2345＋678」など、区切り方を変えると別の待ちが現れる典型例です。
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-yellow-300 mb-1">
                  1112345678999 — 九蓮宝燈
                </h3>
                <p className="text-sm">
                  同じ種類のこの13枚が揃うと、
                  <strong className="text-white">1から9のすべて</strong>で和了できる純正九蓮宝燈になります。
                  役満であると同時に、清一色の多面待ちがどこまで広がるかを示す極端な例でもあります。
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-yellow-300 mb-1">
                  刻子が混ざる形に注意
                </h3>
                <p className="text-sm">
                  同じ数字が3枚ある部分は、刻子として使うか順子の一部として使うかで待ちが変わります。
                  清一色の見落としはこのパターンで最も起こりやすいので、
                  必ず両方を試してください。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              狙うべきか、降りるべきか
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">序盤で同じ種類が6〜7枚あるなら狙う価値あり</strong>：
                残り枚数と巡目を考えると、これくらいが目安です。
              </li>
              <li>
                <strong className="text-white">中盤以降で5枚以下なら見送る</strong>：
                手が間に合わず、他家に対して無防備になるリスクの方が大きくなります。
              </li>
              <li>
                <strong className="text-white">1種類に寄せると読まれやすい</strong>：
                捨て牌が偏るため、相手に警戒されて和了しにくくなる点も頭に入れておきましょう。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              上達には反復しかない
            </h2>
            <p>
              清一色の多面待ちは、理屈を知っていても
              <strong className="text-yellow-300">見た瞬間に分かるまで反復しないと実戦で使えません</strong>。
              時間制限のある状態で繰り返し解くのが、最も効率のよい練習になります。
            </p>
          </section>

          <section className="bg-white/5 border-2 border-red-500/50 rounded-2xl p-5 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              清一色モードで特訓する
            </h2>
            <p className="text-sm mb-4">
              清一色の何切る問題だけを集めた専用モードがあります。60秒で何問斬れるか挑戦してみてください。
            </p>
            <Link
              href="/"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black px-8 py-3 rounded-xl transition-colors"
            >
              清一色モードに挑戦 ⚔️
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
