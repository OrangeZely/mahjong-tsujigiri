"use client";
import { useState, useSyncExternalStore } from "react";
import { isPrivacyOptionsRequired, subscribePrivacyOptions, showAdPrivacyOptions } from "@/lib/ads";
import { useI18n } from "@/i18n/client";
export default function AdPrivacyOptions() {
  const required = useSyncExternalStore(subscribePrivacyOptions, isPrivacyOptionsRequired, () => false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const {t} = useI18n();
  if (!required) return null;
  return <div className="bg-gray-900 text-gray-300 text-center px-4 py-3 text-xs">
    <button className="underline disabled:opacity-50" disabled={busy} onClick={async () => {
      setBusy(true); setError(false);
      try { await showAdPrivacyOptions(); } catch { setError(true); } finally {setBusy(false);}
    }}>{t("privacyChoices")}</button>
    {error && <p role="alert" className="mt-2">{t("privacyError")}</p>}
  </div>;
}
