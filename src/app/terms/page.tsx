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
            <h2 className="text-xl font-bold text-white mb-2">7. 規約の変更</h2>
            <p>
              本規約の内容は、必要に応じて変更されることがあります。
              重要な変更がある場合は、本ページにて告知します。変更後も本アプリの利用を継続した場合、変更後の規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">8. 準拠法</h2>
            <p>本規約は日本法に準拠し、日本法に従って解釈されます。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">9. お問い合わせ</h2>
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
