"use client";

import React, { useEffect, useState } from "react";
import { diagnosePurchases } from "@/lib/purchases";

// 課金情報が取得できない原因を実機で切り分けるための診断パネル。
// /premium?debug=1 のときだけ表示される（通常のユーザーには出ない）。
// props: 価格の取得に失敗しているときは自動で診断を表示する（原因調査中の暫定措置）
export default function PurchaseDebugPanel({
  autoShow = false,
}: {
  autoShow?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [lines, setLines] = useState<string[]>(["診断中…"]);

  useEffect(() => {
    const byQuery =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("debug") === "1";
    const enabled = byQuery || autoShow;
    setShow(enabled);
    if (!enabled) return;
    diagnosePurchases()
      .then(setLines)
      .catch((e) => setLines([`診断自体が失敗: ${String(e)}`]));
  }, [autoShow]);

  if (!show) return null;

  return (
    <div className="mt-6 border border-yellow-500/60 rounded-xl p-3 bg-black/40">
      <p className="text-yellow-300 text-xs font-bold mb-2">課金の診断結果</p>
      <pre className="text-[10px] text-gray-200 whitespace-pre-wrap break-all leading-relaxed">
        {lines.join("\n")}
      </pre>
      <button
        onClick={() => {
          setLines(["診断中…"]);
          diagnosePurchases().then(setLines);
        }}
        className="mt-2 text-xs text-yellow-300 underline"
      >
        もう一度診断する
      </button>
    </div>
  );
}
