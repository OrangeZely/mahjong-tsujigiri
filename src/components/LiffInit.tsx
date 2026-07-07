"use client";

import { useEffect } from "react";
import { initLiff } from "@/lib/liff";

export default function LiffInit() {
  useEffect(() => {
    initLiff();
  }, []);
  return null;
}
