"use client";
import { useI18n } from "@/i18n/client";
import { useLandscapeHintDismissed, useTwoRowHand } from "@/lib/displayPrefs";

// ゲーム開始画面の「見やすさ」設定。縦向きのスマホでだけ表示する
// （横向き・タブレット・PCでは手牌が1段でも十分大きいので出さない）。
export default function HandViewOptions() {
  const { t } = useI18n();
  const [twoRows, setTwoRows] = useTwoRowHand();
  const [hintDismissed, dismissHint] = useLandscapeHintDismissed();

  return (
    <div className="hidden max-sm:portrait:flex flex-col gap-2 max-w-xs mx-auto mb-5 text-left">
      {!hintDismissed && (
        <div className="flex items-start gap-3 bg-sky-950/60 border border-sky-500/50 rounded-xl px-3 py-2.5">
          <span className="text-2xl leading-none mt-0.5" aria-hidden>📱</span>
          <div className="flex-1 text-sm">
            <p className="text-sky-100 font-bold">{t("横向きで牌が約2倍の大きさに")}</p>
            <p className="text-sky-300/80 text-xs mt-0.5">{t("画面の向きのロックはオフに")}</p>
          </div>
          <button
            onClick={dismissHint}
            aria-label={t("閉じる")}
            className="text-sky-300/70 hover:text-white text-lg leading-none px-1"
          >
            ×
          </button>
        </div>
      )}
      <label className="flex items-center gap-2 cursor-pointer select-none bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
        <input
          type="checkbox"
          checked={twoRows}
          onChange={(e) => setTwoRows(e.target.checked)}
          className="w-5 h-5 accent-yellow-400 cursor-pointer"
        />
        <span className="text-sm text-gray-200 font-bold">{t("手牌を2段にして大きく表示")}</span>
      </label>
    </div>
  );
}
