"use client";

import { useEffect } from "react";
import { initRevenueCat } from "@/lib/revenuecat";

// アプリ起動時にRevenueCatを初期化する（ネイティブAndroidのみ実際に動作）
export default function RevenueCatInit() {
  useEffect(() => {
    initRevenueCat();
  }, []);
  return null;
}
