"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import { usePremiumStore } from "@/store/premiumStore";
import { DAILY_FREE_PLAYS } from "@/lib/playLimit";

// 課金プランの一覧（サブスク2種＋広告除去の買い切り）と購入の復元。
// ネイティブアプリでのみ表示する（Web版は購入手段が無いため）。
export default function PurchaseSection() {
  const { noAds, premium, loaded, prices, purchasing, purchase, restore } =
    usePremiumStore();
  const [message, setMessage] = useState<string | null>(null);

  // ネイティブ判定はマウント後に行う。ビルド時のプリレンダリングでは
  // 常に false になるため、直接呼ぶとハイドレーションがずれる。
  const [isNative, setIsNative] = useState(false);
  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  const hasAnyPrice = Boolean(prices.monthly || prices.annual || prices.remove_ads);

  // Web版・LINEミニアプリには購入手段が無いので、課金UIごと出さない。
  if (!isNative) return null;

  // ネイティブでは、価格が取れていなくても定期購読の開示事項と規約リンクを必ず出す。
  // App Store ガイドライン 3.1.2(c) はこれらがアプリ内に存在することを要求しており、
  // 価格取得の成否に連動して消えると審査でリジェクトされる。
  if (!loaded) return null;

  const handle = async (plan: "monthly" | "annual" | "remove_ads") => {
    setMessage(null);
    const outcome = await purchase(plan);
    if (outcome === "error") {
      setMessage("購入できませんでした。時間をおいて再度お試しください。");
    }
  };

  const handleRestore = async () => {
    setMessage(null);
    const restored = await restore();
    setMessage(
      restored ? "購入を復元しました" : "復元できる購入が見つかりませんでした"
    );
  };

  return (
    <div className="mt-8 text-left">
      {premium ? (
        <p className="text-center text-sm text-emerald-400">
          ✓ プレミアム会員（無制限プレイ・広告なし）
        </p>
      ) : (
        <>
          <h2 className="text-center text-white font-bold mb-1">
            プレミアムで制限解除
          </h2>
          <p className="text-center text-xs text-gray-400 mb-3">
            プレイ無制限・広告なし・毎月新しい問題が追加されます
            <br />
            （無料プランは1日{DAILY_FREE_PLAYS}回まで）
          </p>

          {/* App Store ガイドライン 3.1.2 で必須の開示事項 */}
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            プレミアムは自動更新される定期購読です。年額プランは1年ごと、月額プランは1ヶ月ごとに、
            上記の内容をご利用いただけます。期間終了の24時間前までに解約されない限り自動更新され、
            更新料金はApple IDに請求されます。解約はiOSの「設定」→「サブスクリプション」から
            いつでも行えます。
          </p>

          <div className="flex flex-col gap-2">
            {prices.annual && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handle("annual")}
                disabled={purchasing !== null}
                className="w-full bg-yellow-500/15 border-2 border-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-500/25 transition-colors disabled:opacity-50"
              >
                {purchasing === "annual"
                  ? "処理中…"
                  : `${prices.annual} / 1年（自動更新）　🏅 いちばんお得`}
              </motion.button>
            )}

            {prices.monthly && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handle("monthly")}
                disabled={purchasing !== null}
                className="w-full bg-white/10 border-2 border-white/30 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {purchasing === "monthly"
                  ? "処理中…"
                  : `${prices.monthly} / 1ヶ月（自動更新）`}
              </motion.button>
            )}
          </div>

          {/* 価格取得に失敗した場合。無言で消えると購入手段が無いように見えるため、
              状況を明示する。 */}
          {!hasAnyPrice && (
            <p className="text-center text-xs text-gray-400 mt-1">
              購入プランを読み込めませんでした。
              <br />
              通信環境をご確認のうえ、アプリを再起動してください。
            </p>
          )}
        </>
      )}

      {/* 広告だけ消したい人向けの買い切り。サブスク加入者・購入済みには出さない */}
      {!noAds && prices.remove_ads && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handle("remove_ads")}
          disabled={purchasing !== null}
          className="mt-3 w-full bg-white/5 border border-emerald-400/50 text-gray-200 text-sm py-2.5 rounded-xl hover:bg-emerald-400/15 transition-colors disabled:opacity-50"
        >
          {purchasing === "remove_ads"
            ? "処理中…"
            : `広告を消すだけなら ${prices.remove_ads}（買い切り）`}
        </motion.button>
      )}

      <div className="mt-3 flex gap-4 justify-center">
        <button
          onClick={handleRestore}
          className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
        >
          購入を復元
        </button>
        {/* App Store ガイドライン 3.1.2 で必須の規約リンク */}
        <Link
          href="/terms"
          className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
        >
          利用規約
        </Link>
        <Link
          href="/privacy"
          className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
        >
          プライバシーポリシー
        </Link>
      </div>

      {message && (
        <p className="mt-2 text-center text-xs text-gray-400">{message}</p>
      )}
    </div>
  );
}
