/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS build/test script. */
// AdMob 8.1.0 only attaches the UMP view controller in initialize(), which also
// starts Mobile Ads. Attach it in requestConsentInfo so consent can precede ads.
const fs = require("node:fs");
const path = require("node:path");
const file = path.join(__dirname, "../node_modules/@capacitor-community/admob/ios/Sources/AdMobPlugin/AdMobPlugin.swift");
const source = fs.readFileSync(file, "utf8");
const marker = "// Tsujigiri: allow UMP before Mobile Ads initialization.";
if (!source.includes(marker)) {
  const needle = "@objc func requestConsentInfo(_ call: CAPPluginCall) {";
  if (source.split(needle).length !== 2) throw new Error("AdMob UMP patch needs review after SDK update");
  fs.writeFileSync(file, source.replace(needle, needle + "\n        " + marker + "\n        self.consentExecutor.plugin = self"));
}
