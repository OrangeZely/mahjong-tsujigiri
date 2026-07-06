import React from "react";
import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | 麻雀 辻斬る！",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-black text-white mb-2">プライバシーポリシー</h1>
        <p className="text-gray-400 text-sm mb-8">最終更新日: 2026年7月5日</p>

        <div className="space-y-6 text-gray-200 leading-relaxed">
          <section>
            <p>
              「麻雀 辻斬る！」（以下「本アプリ」）は、OrangeZely（以下「開発者」）が提供する麻雀の何切る問題ゲームです。
              本ポリシーは、本アプリにおける利用者情報の取り扱いについて定めるものです。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. 収集する情報</h2>
            <p className="mb-2">本アプリが収集する情報は以下の通りです。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-bold">プレイヤー名（ニックネーム）</span>：
                ランキングへの登録時に利用者が任意で入力するものです。本名などの個人を特定できる情報の入力は不要です。
              </li>
              <li>
                <span className="font-bold">ゲームのスコア・成績</span>：
                ランキング登録時に、正解数・回答数・正答率・スコア・ゲームモードを収集します。
              </li>
              <li>
                <span className="font-bold">広告識別子（広告ID）等</span>：
                広告の配信のため、広告配信事業者が広告識別子や端末情報を収集する場合があります（詳細は「4. 広告について」をご覧ください）。
              </li>
            </ul>
            <p className="mt-2">
              本アプリは、氏名・住所・電話番号・メールアドレス・位置情報などの個人情報を収集しません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. 情報の利用目的</h2>
            <p>
              収集した情報は、ランキング機能の提供（スコアの表示・順位の算出）のためにのみ利用します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. 端末内に保存される情報</h2>
            <p>
              プレイ履歴・過去最高スコアなどのデータは利用者の端末内にのみ保存され、外部サーバーには送信されません。
              これらのデータはアプリ内の「プレイ履歴」画面からいつでも削除できます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. 広告について</h2>
            <p>
              本アプリは、第三者配信の広告サービス「Google AdMob」（Google LLC）を利用する場合があります。
              広告配信事業者は、利用者の興味に応じた広告を表示するため、本アプリを含むアプリの利用情報や広告識別子（広告ID）を取得することがあります。
            </p>
            <p className="mt-2">
              取得される情報および利用方法の詳細は、
              <a
                href="https://policies.google.com/technologies/ads?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 underline"
              >
                Google 広告に関するポリシー
              </a>
              をご確認ください。端末の設定から広告のパーソナライズを無効にすることもできます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. 第三者サービス</h2>
            <p>
              本アプリは、ランキングデータの保存に Supabase（Supabase Inc. が提供するデータベースサービス）を利用しています。
              データは同サービスのサーバーに安全に保存されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. 情報の第三者提供</h2>
            <p>
              開発者は、法令に基づく場合を除き、収集した情報を第三者に提供しません。
              なお、ランキングに登録されたプレイヤー名とスコアは、本アプリの利用者に公開されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">7. データの削除</h2>
            <p>
              ランキングに登録したデータの削除を希望される場合は、下記の連絡先までお問い合わせください。
              登録されたプレイヤー名を確認のうえ、速やかに削除いたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">8. ポリシーの変更</h2>
            <p>
              本ポリシーの内容は、必要に応じて変更されることがあります。
              重要な変更がある場合は、本ページにて告知します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">9. お問い合わせ</h2>
            <p>
              本ポリシーに関するお問い合わせは、以下までお願いいたします。
            </p>
            <p className="mt-2 font-mono text-sm bg-white/5 rounded-lg px-4 py-2 inline-block">
              shintaroorange@gmail.com
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
