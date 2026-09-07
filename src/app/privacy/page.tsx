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
        <p className="text-gray-400 text-sm mb-8">最終更新日: 2026年9月7日</p>

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
                <span className="font-bold">購入に関する情報</span>：
                購入履歴、サブスクリプションの状態および購入状態を管理するためのアプリ内ユーザーIDを取り扱います。
              </li>
              <li>
                <span className="font-bold">端末・広告・利用状況・診断に関する情報</span>：
                広告配信やアプリ品質の改善、不正利用の防止のため、第三者サービスが端末ID、広告データ、製品の操作、その他の利用状況データ、
                おおまかな位置情報、クラッシュ情報およびパフォーマンスデータを取得する場合があります。
              </li>
            </ul>
            <p className="mt-2">
              本アプリは、氏名・住所・電話番号・メールアドレス・正確な位置情報の入力を求めません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. 情報の利用目的</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>ランキング機能の提供（スコアの表示・順位の算出）</li>
              <li>購入、サブスクリプションおよび購入の復元の管理</li>
              <li>広告の配信、効果測定および不正利用の防止</li>
              <li>不具合の調査、パフォーマンスの把握およびアプリ品質の改善</li>
            </ul>
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
              広告の配信、効果測定および不正利用の防止のため、Googleが端末情報、広告識別子、利用状況データ、
              おおまかな位置情報および診断情報を取得する場合があります。
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
            <p className="mb-2">本アプリは、以下の第三者サービスを利用しています。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Supabase：ランキングデータの保存</li>
              <li>RevenueCatおよびApple App Store：購入、サブスクリプション、購入の復元の管理</li>
              <li>Google AdMob：広告の配信、効果測定および不正利用の防止</li>
            </ul>
            <p className="mt-2">
              各サービスによる情報の取り扱いには、それぞれのプライバシーポリシーが適用されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. 情報の第三者提供</h2>
            <p>
              開発者は、上記サービスによる処理、利用者の同意がある場合、または法令に基づく場合を除き、収集した情報を第三者に提供しません。
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
