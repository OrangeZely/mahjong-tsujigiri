import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import FuQuizClient from "./FuQuizClient";

export const metadata: Metadata = {
  title: "符計算の覚え方 - 麻雀の点数計算をクイズで練習 | 麻雀 辻斬る！",
  description:
    "麻雀の符計算のルールをやさしく解説し、完成した手牌の符をクイズ形式で練習できます。副底（基本符）・面子の符・待ちの形・雀頭の役牌判定・切り上げまで、点数計算の基礎が身につきます。",
};

export default function FuCalculationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-black text-white mb-2">
          符計算の覚え方
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          「何符何翻」の&ldquo;符&rdquo;の部分だけを、手を動かして覚えましょう
        </p>

        <div className="space-y-8 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              符計算とは
            </h2>
            <p className="mb-3">
              麻雀の点数は「符（ふ）」と「翻（はん）」の掛け算で決まります。
              翻は役の種類で決まりますが、符は
              <strong className="text-yellow-300">
                手牌の形そのもの
              </strong>
              から計算します。同じ役でも、面子の作り方や待ちの形によって符は変わります。
            </p>
            <p>
              最初は複雑に見えますが、ルールは実は多くありません。
              下の早見表を確認してから、クイズで実際の手牌に当てはめて練習してみましょう。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">符の早見表</h2>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">① 基本の符</h3>
                <ul className="text-sm space-y-1">
                  <li>副底（基本符ともいいます）: どんな手でも一律 20符</li>
                  <li>門前ロン加符: 面前（鳴きなし）でロン和了なら +10符</li>
                  <li>
                    ツモ符: ツモ和了なら +2符（例外: 平和のツモは加算せず20符固定）
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">② 面子の符</h3>
                <p className="text-sm mb-2">
                  順子（連続した3枚）は0符。
                  <strong className="text-yellow-300">
                    刻子・槓子は「鳴いたか（明刻か暗刻）」×「1・9・字牌を含むか」
                  </strong>
                  で符が変わります。
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-center">
                    <thead className="text-gray-400">
                      <tr>
                        <th className="text-left font-normal">面子</th>
                        <th className="font-normal">中張牌(2〜8)</th>
                        <th className="font-normal">么九牌(1,9,字牌)</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      <tr className="border-t border-white/10">
                        <td className="text-left py-1">明刻（ミンコ）</td>
                        <td>2符</td>
                        <td>4符</td>
                      </tr>
                      <tr className="border-t border-white/10">
                        <td className="text-left py-1">暗刻（アンコ）</td>
                        <td>4符</td>
                        <td>8符</td>
                      </tr>
                      <tr className="border-t border-white/10">
                        <td className="text-left py-1">明槓（ミンカン）</td>
                        <td>8符</td>
                        <td>16符</td>
                      </tr>
                      <tr className="border-t border-white/10">
                        <td className="text-left py-1">暗槓（アンカン）</td>
                        <td>16符</td>
                        <td>32符</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">
                  ③ 雀頭（対子）の符
                </h3>
                <p className="text-sm">
                  三元牌（白・発・中）、または場風・自風と一致する風牌の雀頭は
                  +2符。場風と自風が両方一致する風牌（連風牌）なら +4符。
                  それ以外の雀頭は0符です。
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">④ 待ちの符</h3>
                <p className="text-sm">
                  両面待ち・双碰（シャンポン）待ちは0符。
                  嵌張（カンチャン）・辺張（ペンチャン）・単騎待ちは
                  +2符です。
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-1">⑤ 最後に切り上げ</h3>
                <p className="text-sm">
                  ①〜④を全部足した合計を、
                  <strong className="text-yellow-300">
                    10符単位に切り上げ
                  </strong>
                  ます（例: 38符→40符）。平和のツモは例外的に20符固定、
                  鳴きありのオール順子＋非役牌雀頭＋両面ロン（喰い平和）は
                  計算上20符でも30符固定という特殊ルールがあります。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              実際にクイズで練習しよう
            </h2>
            <p className="text-sm mb-4">
              完成した手牌が表示されます。黄色い枠は和了牌（アガリ牌）です。
              状況（ツモ/ロン・面前/鳴き・待ちの形）をヒントに、合計符を4択から選んでみましょう。
              答えた後は内訳がすべて表示されるので、間違えても復習になります。
            </p>
            <FuQuizClient />
          </section>

          <div className="pt-4 flex gap-4 justify-center flex-wrap">
            <Link
              href="/guide"
              className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
            >
              ガイド一覧に戻る
            </Link>
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
