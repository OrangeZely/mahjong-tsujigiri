import React from "react";
import Link from "next/link";

export const metadata = {
  title: "利用規約 | 麻雀 辻斬る！",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-black text-white mb-2">利用規約</h1>
        <p className="text-gray-400 text-sm mb-8">最終更新日: 2026年7月8日</p>

        <div className="space-y-6 text-gray-200 leading-relaxed">
          <section>
            <p>
              本規約は、OrangeZely（以下「開発者」）が提供する「麻雀 辻斬る！」（以下「本アプリ」）の利用条件を定めるものです。
              利用者は、本アプリを利用することにより、本規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. サービス内容</h2>
            <p>
              本アプリは、麻雀の「何切る」問題に回答して得点を競う無料のゲームです。
              アカウント登録は不要で、どなたでも利用できます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. 禁止事項</h2>
            <p className="mb-2">利用者は、以下の行為をしてはなりません。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>不正な手段（プログラムによる自動操作、データの改ざん等）によりスコアを登録する行為</li>
              <li>公序良俗に反する、または他者を不快にさせるプレイヤー名を登録する行為</li>
              <li>本アプリの運営を妨害する行為</li>
              <li>本アプリのコンテンツを無断で複製・転載・販売する行為</li>
              <li>その他、開発者が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. ランキングについて</h2>
            <p>
              ランキングに登録されたプレイヤー名およびスコアは、本アプリの利用者に公開されます。
              開発者は、禁止事項に該当すると判断した登録データを、事前の通知なく削除できるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. 知的財産権</h2>
            <p>
              本アプリに含まれるコンテンツ（問題データ、デザイン、プログラム等）に関する権利は、開発者または正当な権利者に帰属します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. 免責事項</h2>
            <p className="mb-2">
              本アプリは現状有姿で提供され、開発者はその完全性・正確性・有用性を保証しません。
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>開発者は、本アプリの利用により利用者に生じた損害について、一切の責任を負いません。</li>
              <li>開発者は、事前の通知なく本アプリの内容を変更し、または提供を中断・終了することがあります。</li>
              <li>通信環境や端末の状態により、本アプリが正常に動作しない場合があります。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. 広告について</h2>
            <p>
              本アプリには、第三者配信の広告が表示される場合があります。
              広告に関する詳細は
              <Link href="/privacy" className="text-yellow-400 underline">
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">
              7. 有料プランについて
            </h2>
            <p className="mb-3">
              本アプリでは、以下の有料プランを提供しています。価格は日本国内のものであり、
              地域により異なる場合があります。実際の価格はApp Storeの購入画面に表示されます。
            </p>

            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border border-white/10">
                <thead className="bg-white/10">
                  <tr>
                    <th className="text-left p-2 text-white">プラン</th>
                    <th className="text-left p-2 text-white">期間</th>
                    <th className="text-left p-2 text-white">価格</th>
                    <th className="text-left p-2 text-white">内容</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="p-2">プレミアム（月額）</td>
                    <td className="p-2">1ヶ月</td>
                    <td className="p-2">¥380</td>
                    <td className="p-2">
                      プレイ回数無制限・広告非表示・毎月の新規問題追加
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">プレミアム（年額）</td>
                    <td className="p-2">1年</td>
                    <td className="p-2">¥3,800</td>
                    <td className="p-2">同上</td>
                  </tr>
                  <tr>
                    <td className="p-2">広告を消す</td>
                    <td className="p-2">買い切り（期限なし）</td>
                    <td className="p-2">¥300</td>
                    <td className="p-2">広告非表示のみ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-2">
              <span className="font-bold text-white">無料プラン</span>では、1日あたり10回までプレイできます。
              回数は毎日0時（端末のローカル時刻）にリセットされます。
            </p>

            <h3 className="font-bold text-white mt-4 mb-1">自動更新について</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                プレミアムは<span className="font-bold text-white">自動更新される定期購読</span>です。
                現在の期間が終了する24時間前までに解約しない限り、自動的に更新されます。
              </li>
              <li>
                更新料金は、期間終了前の24時間以内にApple IDのアカウントに請求されます。
              </li>
              <li>
                無料トライアル期間が提供される場合、期間終了前に解約しなければ有料プランへ自動的に移行します。
                無料トライアルの未使用分は、有料プランを購入した時点で失効します。
              </li>
            </ul>

            <h3 className="font-bold text-white mt-4 mb-1">解約方法</h3>
            <p>
              解約は、iOSの「設定」アプリ →「ユーザー名」→「サブスクリプション」からいつでも行えます。
              解約後も、購入済みの期間が終了するまではプレミアム機能をご利用いただけます。
              なお、購入済み期間の途中解約による返金は行っておりません。
            </p>

            <h3 className="font-bold text-white mt-4 mb-1">購入の復元</h3>
            <p>
              機種変更や再インストールを行った場合は、アプリ内の「購入を復元」から購入内容を復元できます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">8. 規約の変更</h2>
            <p>
              本規約の内容は、必要に応じて変更されることがあります。
              重要な変更がある場合は、本ページにて告知します。変更後も本アプリの利用を継続した場合、変更後の規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">9. 準拠法</h2>
            <p>本規約は日本法に準拠し、日本法に従って解釈されます。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">10. お問い合わせ</h2>
            <p>本規約に関するお問い合わせは、以下までお願いいたします。</p>
            <p className="mt-2 font-mono text-sm bg-white/5 rounded-lg px-4 py-2 inline-block">
              mahjong.tsujigiri@gmail.com
            </p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-block bg-yellow-400 text-gray-900 font-black px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
