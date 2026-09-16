"use client";
import { useI18n } from "@/i18n/client";
import { problemExplanation } from "@/lib/problemExplanation";
import type { Problem, GameMode } from "@/types/mahjong";
export default function ProblemExplanation({problem, mode}: {problem: Problem; mode: GameMode}) {
 const {locale,t} = useI18n();
 const {text,language} = problemExplanation(problem,locale,mode);
 if (!text) return null;
 return <div className="whitespace-pre-line">{language !== locale && <p className="font-bold text-sm mb-1">{t("originalExplanation")}</p>}<p lang={language}>💡 {text}</p></div>;
}
