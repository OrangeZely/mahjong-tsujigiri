# Japanese / English release

Routes keep Japanese URLs and add `/en/`. Both roots are static HTML with the correct `lang`; common screens use a typed dictionary. Native launch at `/` selects a saved preference, then the device language (Japanese or English). Explicit web URLs keep their language. Changing languages reloads the root layout; language controls are absent during game screens.

## Data

`src/i18n/problem-explanations.json` contains reviewed English for the 50 + 120 records fetched on 2026-09-16. This bundle supports the current schema and old history. It is used only when ID, Japanese text, tiles, and accepted discards match. `description_en` from the DB takes precedence. Unknown/untranslated content is labeled as original Japanese.

Apply `supabase/migrations/20260916_english_descriptions.sql` with a privileged connection. The transaction aborts if any of the reviewed source hashes differs or any row is missing. It adds nullable English columns without changing Japanese text, IDs, accepted discards, or RLS. A trigger clears English when its source changes. Check `docs/english-explanation-review.json` for seven source discrepancies and editorial treatment. Strategy probabilities/expected values in the source have not been independently simulated.

## AdMob UMP

Create and publish the applicable privacy message for both platform app IDs in AdMob Privacy & messaging, with English/Japanese and the privacy-policy URL. SDK calls alone do not configure that message.

The native-only consent update precedes Mobile Ads initialization. Every banner/interstitial/rewarded request checks SDK permission; non-personalized requests are explicit. No consent is inferred from app language or stored by this app. Failure disables ads for this launch while play remains possible. Required privacy options are available at the top of app screens.

`scripts/patch-admob-ump.cjs` runs on npm postinstall. It attaches the iOS consent executor to the plugin before initialization, because upstream 8.1.0 otherwise requires Mobile Ads to start before UMP can show a form. Review this narrow patch on every AdMob upgrade.

On iOS and Android test: EEA first launch, outside EEA, accept, decline, return launch, expired consent, reopen/change choices, offline/update error, upgrade to no-ads, and leaving a banner screen while consent is open. Confirm no duplicate forms/ad requests and no late interstitial after results. Never ship forced test geography or reset consent on normal launches. ATT is not introduced in this release.

## Release assets

`store-assets/listing-en-US.json` contains App Store/Play copy and product-localization drafts. Store-provided price strings are used in-app. The daily free-play limit is shared with the UI; update the listing if that setting changes. Generate screenshots from the finished English native build. The app icon/illustrated logo is retained; its Japanese artwork is intentional branding.

## Build and publish

Run `npm run lint`, `npm run test:localization`, `npm run test:consent`, and `npm run build`. Run `npx cap sync` before building native apps. Verify both languages on a narrow phone and tablet, every game mode, old history, purchase restoration, and deep links. Native SDK behavior needs device validation.

Web has no automatic deployment. Publish with `npm run build && npx wrangler deploy` when ready. Native releases require new binaries; the currently published iOS build does not gain features through the web deployment. Verify release/build/product states through APIs or the user interface before submission.

## Verification status (2026-09-16)

Static export, TypeScript, ESLint, localization regression checks, and consent mock checks have passed. Browser checks cover English home, fu play/results/breakdown, persisted history, Japanese switching, and discard-question loading. Native consent/purchase behavior and store configuration remain unverified. The concurrent five-play limit and rewarded extra-play feature have been integrated. Ad test IDs are selected per format; reward completion waits for dismissal, and leaving the screen cancels pending displays. Release still requires native testing and the external setup above.

The final static build was synced to both native projects with `npx cap sync`. English guide/legal pages were checked at 375px without horizontal overflow, and the web daily-limit screen hides the native-only rewarded-ad button. Capacitor sync warns that installed core 8.5.0 and Android 8.4.1 differ; native compilation and device testing remain release checks.
