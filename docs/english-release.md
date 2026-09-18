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

## Web release (2026-09-18)

The English web version is published. `main` was pushed to origin at `13887f8`, `npm run build` produced 30 static routes including every `/en/` page, and `npx wrangler deploy` uploaded 152 files (version `07ae8f86-f359-45c0-8cd1-7ee12a32ae03`) to `https://mahjong-tsujigiri.translation-qa-web.workers.dev`.

Verified on the deployed site: `/en/` serves `lang="en"` with English home, mode cards, and daily-limit text; `/` still serves `lang="ja"` unchanged with the language switcher. A full-flush session was played to the timer, and the results breakdown rendered English explanations and localized tile names and rank from the bundled translations. The Supabase migration is still unapplied, so this confirms the bundle fallback path works in production.

Native releases are unaffected by this deployment. Ad unit IDs for iOS rewarded and all three Android formats remain unset, so those formats would serve Google test ads in a native build; web carries no ads, so this does not affect the deployment above.

## Native 1.2.0 preparation (2026-09-18)

Versions were bumped to iOS `1.2.0` build `8` and Android `versionCode 3` / `versionName 1.2`, then `npx cap sync` copied the deployed static build into both native projects. The build number was chosen after querying App Store Connect: builds 1-7 are all uploaded, and 1.1.1 (READY_FOR_SALE) is the live version, so 8 is the next free build number. Build 7 was uploaded on 2026-09-03, before the 2026-09-07 commits that added Fu Practice, so 1.2.0 is the first released build to contain that mode. Release notes say so rather than describing English support alone.

`store-assets/shoot-store.mjs` captures store screenshots from the deployed site for either locale. It drives headless Chrome over CDP and writes each store's exact pixel size: App Store 6.9in, 6.5in and iPad 13in as plain app screens, and the Play Store phone size composited under a caption, matching the style of the existing Japanese assets. English output is in `store-assets/en/`; run `node store-assets/shoot-store.mjs ja` to refresh the Japanese set the same way. Deploy before shooting, because the script reads the public site.

`store-assets/listing-en-US.json` and `appstore-listing-en.md` are final drafts, regenerated from the JSON so the two cannot drift. Every field is within its store's character limit, and the marketing, support and privacy URLs return 200 on `tsujigiri.orangezely.com`. Release notes disclose that the free plan is now 5 plays per day, down from 10.

Not done: the English localization does not exist in App Store Connect yet, where only `ja` is present, and nothing has been submitted. `store-assets/appstore-listing-ja.md` still describes two modes and needs its own update before this release ships. Ad unit IDs and the AdMob privacy message are unchanged from the web-release note above, and native device testing of consent and purchases is still required.

## Japanese listing update (2026-09-18)

`store-assets/appstore-listing-ja.md` was rewritten for 1.2.0. It had gone stale: it described two modes, pointed every URL at `mahjong-tsujigiri.vercel.app`, guessed a 4+ age rating, and said the in-app purchases were not created yet. It now covers three modes plus Oni, carries the subscription terms Apple requires for auto-renewing products, states the actual 12+ rating and the three `READY_TO_SUBMIT` products, links the live `tsujigiri.orangezely.com` pages, and adds Japanese release notes for this version. Every length-limited field was measured against Apple's limit.

`store-assets/playstore-listing-ja.md` only needed release notes for versionCode 3 and a privacy URL that answers 200 instead of redirecting. Its description was already current. Those notes deliberately omit Fu Practice: versionCode 2 went to the closed test on 2026-09-08, after the mode landed, so Android testers already have it. The App Store notes do announce it, because build 7 predates it.

Android still has no RevenueCat public key in `.env.local`, so purchases do not work in an Android build. The Play listing memo already says so and remains accurate.

## iOS signing recovery and the 1.2.0 archive (2026-09-18)

Signing had to be repaired first. The `Tsujigiri App Store Manual` profile is bound to certificate `6S8VVQMF93`, whose private key exists only in the locked `tsujigiri-signing` keychain, and that keychain's password is not known. The login keychain holds certificate `ADZMZCV7AB` (serial `4C98B320...`), which was bound only to the TransLoop profile and so could not sign this bundle id.

With the user's approval, a new App Store profile `Tsujigiri App Store Manual v2` was created through the API for `com.orangezely.mahjongtsujigiru` against `ADZMZCV7AB`, installed to `~/Library/MobileDevice/Provisioning Profiles/`, and named in `project.pbxproj` and `ExportOptions.plist`. Existing certificates and profiles were left untouched. The profile expires 2027-09-17.

The archive is signed at archive time rather than at export, because signing an unsigned archive drops entitlements. `xcodebuild archive` and `-exportArchive` both succeeded, with no keychain prompt: Xcode picked identity `389D2A67...`, the login-keychain copy of `ADZMZCV7AB`, because the profile allows only that certificate.

Verified in `build/export/App.ipa`: version 1.2.0, build 8, `ja` and `en` localizations with the right display names, App Store entitlements with `get-task-allow` false and `beta-reports-active` true, a valid signature that satisfies its designated requirement, the expected embedded profile, and the bundled web assets containing every `/en/` route.

The binary has not been uploaded. Uploading needs `xcrun altool --upload-app` and the user's go-ahead, and the device testing listed above is still outstanding.

## Two native defects found in the simulator (2026-09-18)

Running the build on an iPhone 17 Pro Max simulator found two problems that no web check could have caught. Both are fixed and re-verified on the simulator.

**English was unreachable in the native app.** Capacitor's `CapacitorRouter` maps every extension-less path to the root `index.html`, which is right for a single-page app and wrong for this static export, where `/en/` and `/game/` each have their own `index.html`. A full page load of `/en/` therefore served the Japanese root, so both the launch redirect and the language links silently stayed in Japanese. `AppDelegate.swift` now defines `StaticExportRouter`, which returns `<path>/index.html` when that file exists and falls back to the root otherwise, and `StaticExportViewController`, which supplies it. `Main.storyboard` points at that controller instead of `CAPBridgeViewController`. The router lives in `AppDelegate.swift` so no file had to be added to the Xcode project. Deep links into `/game/` and the other routes are fixed by the same change.

**The top of the screen sat under the status bar.** The web view covers the whole display, and nothing in the project set `viewport-fit` or read the safe-area insets, so the language switcher overlapped the clock and, worse, the game header hid `残り時間`, `正解 / 回答` and `問題` behind the status bar and the Dynamic Island. The game screen has shipped that way; the language switcher was new in this release. Both layouts now export `viewportFit: "cover"` and `globals.css` pads the body by `env(safe-area-inset-top)`. Two follow-on details matter: the body's background is set to `--color-gray-900` so the inset strip matches the top of every screen instead of showing white, and `.min-h-screen` is reduced by the same inset so screens do not gain a scrollbar the height of the padding.

Three approaches were tried before the body padding. Padding `body > *:first-child` hits the `<div hidden>` that Next puts first; excluding hidden elements then hits the `<template>` that appears on client-rendered routes. Padding the body itself depends on nothing Next injects.

Also worth knowing: `npm run build` did not pick up an edit to `globals.css` until `.next` was deleted. The emitted stylesheet kept its old content hash. Delete `.next` when changing that file.

Verified on the simulator after the fixes: Japanese and English home screens, the language switch, the language preference surviving relaunch, the full-flush start screen and game board in both languages with the header fully visible, no white strip at the top, and AdMob test banners rendering, which also shows the consent gate allows ads outside the EEA.

**Android had the same defect, and is fixed in the web layer rather than natively.** `WebViewLocalServer` routes any last path segment without a dot to the root `index.html` while `html5mode` is on. Two native repairs were tried on a Pixel emulator and both failed. `RouteProcessor` cannot help: the `html5mode` branch calls it with `/index.html` instead of the requested path. Turning `server.html5mode` off does not help either, because `handleLocalRequest` ends with `if (path.lastIndexOf(".") >= 0)` on the *original* request path and returns null below it, so `/en/` became `ERR_CONNECTION_REFUSED` before the processor was ever consulted.

What works on both platforms is to stop requesting extension-less paths. `staticExportHref` in `src/i18n/locale.ts` rewrites a directory-style path to its `index.html`, and `LanguageControls` applies it, only on native, to the two navigations that reload the page: the launch redirect and the language links. Paths carrying an extension are served directly by both platforms. `localePath` strips a leading `/en` before rebuilding, so `/en/index.html` round-trips correctly, and in-app navigation is unaffected because the client router handles it without touching the asset server. `scripts/test-localization.cjs` covers the rewrite and the round trip.

The iOS `StaticExportRouter` is kept even though the web-layer fix now covers this case. The two are not redundant: the router repairs *any* full load of an extension-less path, including deep links into `/game/`, which Android has no equivalent hook for.

Verified on a Pixel emulator: the app launches into English on an English device, `/en/index.html` is served with the `(en)` chunks, tapping 日本語 loads `/index.html` with the `(ja)` chunks, and the safe-area padding behaves as it does on iOS. Re-verified on the iOS simulator after the same change.

## App Store Connect listing entry (2026-09-18)

Build 8 uploaded (Delivery UUID `c87add85-b510-496a-8871-f5736d892192`) and reached `VALID`. A 1.2.0 version record was created (`ae79c99a-78af-49a6-9e08-0713b96665ba`, `PREPARE_FOR_SUBMISSION`, release type manual) and build 8 is attached to it.

The app had only a `ja` localization. Creating the `en-US` app-info localization also creates the matching version localization, so the English copy is written with a PATCH rather than a POST. Both locales' text is read from `store-assets/listing-en-US.json` and `store-assets/appstore-listing-ja.md` rather than retyped, so the store and the drafts cannot drift. The Japanese subtitle, keywords, description, promotional text, release notes, privacy-policy URL and marketing/support URLs were updated to the 1.2.0 drafts.

The Japanese screenshots were replaced. The set carried over from 1.1.1 showed only two modes, which contradicts release notes that announce Fu Practice, so `shoot-store.mjs ja` regenerated them from the deployed site and the stale images were deleted. A 6.9-inch set was added for both locales, which neither had before. Nine English and nine Japanese screenshots are uploaded across 6.9-inch, 6.5-inch and 13-inch iPad, and App Store Connect reports every one `COMPLETE` with no errors.

Nothing has been submitted for review. That still waits on the AdMob privacy message being published and on device testing of consent and purchases.
