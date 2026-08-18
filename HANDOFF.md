# 麻雀 辻斬る！ 開発引き継ぎドキュメント

最終更新: 2026-07-06
開発者: jelly (OrangeZely) — 非プログラマー。説明は平易な日本語で。コード変更後は必ず commit & push（Vercelが自動デプロイ）。

## プロジェクト概要

麻雀の「何切る」問題を解くWebゲーム。Google Play Storeでのリリース準備中。

- **リポジトリ**: https://github.com/OrangeZely/mahjong-tsujigiri （PUBLIC — 秘密情報は絶対コミットしない）
- **場所**: `~/mahjong-tsujigiri`
- **スタック**: Next.js (App Router, 静的書き出し `output: "export"`) + TypeScript + Tailwind + Zustand + Framer Motion + Supabase
- **デプロイ**: GitHub push → Vercel 自動デプロイ
- **アプリ化**: Capacitor（`android/` ディレクトリ、appId `com.orangezely.mahjongtsujigiru`）
- **Notion**: 「🀄 麻雀何切るアプリ - PlayStore公開プロジェクト」ページで管理。アップロードマニュアルあり

## ゲーム仕様

- 2モード: **清一色モード**（旧スピード、内部ID・DBは`speed`のまま）/ **カジュアル=何切るモード**。どちらも1問の制限なし・全体60秒
- どちらのモードも開始画面のチェックで**鬼斬りモード**にできる（1問5秒制限、時間切れは不正解。内部フラグ`oniMode`）。アイコンは清一色×鬼斬り=👹、何切る×鬼斬り=👺（通常は⚡/🧘）
- URL: `/game?mode=speed` / `/game?mode=casual`
- スコア: 清一色 `正解×1000 − 不正解×300 + 正答率`、カジュアル `正解×100 − 不正解×50 + 正答率`、下限0点
- 鬼斬りモードのスコア: 連続正解で獲得点が倍々（素点の8倍で頭打ち。清一色 1000→…→8000、カジュアル 100→…→800）、不正解・時間切れで素点にリセット。減点・正答率加算は元モードと同じ。ランキングは元モードのgame_modeで登録される
- 格付け: スコアから段位を算出（`src/lib/ranks.ts`、初段〜令和の辻斬り）。モード別の帯設計: 〜2,200カジュアル帯（100点刻み）/ 2,300〜19,000清一色帯（初級/中級/上級あり、200〜1,000点刻み）/ 20,000〜150,000鬼帯（10,000点刻み）
- プレイヤー名は初回登録して端末保存（localStorage）、以降ランキング登録に自動使用

## 牌の表記ルール（tiles_str）

- `1m`-`9m` 萬子 / `1p`-`9p` 筒子 / `1s`-`9s` 索子 / `1z`-`7z`（またはz1-z7）字牌（東南西北白発中）
- `rm` / `rp` / `rs` = 赤5
- 副露・リーチ: `手牌|副露1,副露2|RIICHI`（`|` 区切り）
- correct_discards はカンマ区切りで複数可（例 `8m,9m`）
- パーサーは `src/lib/mahjong.ts`（parseTileString / parseProblemStr / normalizeTileKey）

## Supabase テーブル

- `problems` — スピードモード用問題（tiles_str, correct_discards, difficulty, description）
- `problems_casual` — カジュアル用。**dora列あり**（例 `9m` や `5m,2z`）。CSVインポートまたはSQLで問題追加
- `scores` — ランキング（player_name, correct_count, total_answered, accuracy, score, **game_mode**）
- RLSポリシー設定済み（public read等）。環境変数は `.env.local`（NEXT_PUBLIC_SUPABASE_URL / ANON_KEY）

## 主要ファイル

- `src/store/gameStore.ts` — ゲーム状態・タイマー・スコア計算。`window.__gameStore` でデバッグ可能
- `src/components/GameBoard.tsx` — ゲーム画面（ドラ表示・副露・リーチ表示あり）
- `src/components/ResultModal.tsx` — リザルト画面（答え合わせ・格付け・自動名前登録）
- `src/components/Tile.tsx` — 牌画像（`public/tiles/*.png`、md=flex-1で最大表示）
- `src/app/ranking/page.tsx` — 4タブ（全期間/今週/スピード/何切る）
- `src/app/history/page.tsx` — プレイ履歴＋振り返り（localStorage、直近50戦、最高段位）
- `src/app/privacy/page.tsx` — プライバシーポリシー（AdMob対応済み、全9条）
- `src/lib/history.ts` / `src/lib/profile.ts` — 端末保存（履歴・最高スコア・プレイヤー名）
- `src/lib/liff.ts` — LINEミニアプリ連携（ユーザーが追加、PLAYER_NAME_EVENT）

## 牌画像について

- `public/tiles/` の37枚PNG（透過・542x720）。**2026-07-29 に自作パンダ牌デザインへ差し替え済み**
- 元データ: Google Drive「牌デザイン🐼」（manzu/pinzu/souzu/zihai に `1m.png`〜`z7.png` 形式で2000x2000の透過PNG）
- ファイル名の対応は `src/components/Tile.tsx` の `getTileImagePath`。実ファイル名は `p_ms{n}_1`(萬)/`p_ps{n}_1`(筒)/`p_ss{n}_1`(索)/赤5=`p_ms5r_1`等、字牌=`p_ji_e/s/w/n/h_1`(東南西北白)・`p_no_1`(發)・`p_ji_c_1`(中)
- 差し替え手順: 全牌の内容を囲む共通bboxで切り出し→高さ720に縮小→上記の実ファイル名で保存（PILスクリプトで実施）。ファイル名を変えなければコード変更不要
- 字牌の並び順 z1東/z2南/z3西/z4北/z5白/z6發/z7中 は目視確認済み（標準順）

## Play Storeリリース状況

- ✅ Capacitorプロジェクト・静的書き出しビルド・cap sync 動作確認済み
- ✅ 署名キー: `android/app/mahjong-upload.jks` + `android/key.properties`（**両方gitignore済み・コミット禁止**）
- ✅ バックアップ: Google Drive マイドライブ「麻雀辻斬る_署名キー_バックアップ」
- ✅ プライバシーポリシー: 本番URL + `/privacy` をPlay Consoleに登録予定
- ⬜ AABビルド: `npm run build && npx cap sync android && cd android && ./gradlew bundleRelease`
- ⬜ Play Console登録（**初回アップロード時にGoogle Play アプリ署名を必ず有効化**）
- ⬜ 個人アカウントのため クローズドテスト テスター12人×14日間 が製品版公開の条件
- ⬜ 収益化はAdMob予定（ポリシーは対応済み。実装時はデータセーフティ申告の更新必須）

## 課金モデル（2026-08-17 決定・実装済み）

| 商品 | 種別 | 価格 | 解放される権利 |
|---|---|---|---|
| `remove_ads` | 非消耗型（買い切り） | ¥300 | `no_ads` |
| `premium_monthly` | 自動更新サブスク | ¥380/月（US $3.99） | `no_ads` + `premium` |
| `premium_annual` | 自動更新サブスク | ¥3,800/年（US $39.99） | `no_ads` + `premium` |

- 年額の基本価格は**¥3,800（月額の10ヶ月分＝2ヶ月分お得）**。**基本価格は動かさない**こと（値下げ後に戻すと「値上げ」扱いになり既存加入者の同意が必要になるため）
- セールは**入門オファー（前払い型）**で初年度¥2,800（US $29.99）にする。期間指定できるので終了後は自動で通常価格に戻る
- 入門オファーは1人1回・グループにつき同時に1種類のみ。**通常時は7日間無料トライアル**、セール時だけ¥2,800に差し替える運用
- 個別配布の割引は**オファーコード**を使う（入門オファーとは別枠）

- `no_ads` = 広告非表示 / `premium` = プレイ無制限＋毎月の新問題
- **無料は1日10回まで**（`src/lib/playLimit.ts`、localStorageで日付管理・翌0時リセット）。Web/LINE版にも同じ制限を適用
- RevenueCat側の商品・エンタイトルメント・パッケージ（`$rc_lifetime`/`$rc_monthly`/`$rc_annual`）は設定済み
- **App Store Connect側の課金商品はまだ未作成**。上表の製品IDと価格で作ること。作るまで `getOfferings` がエラーになり購入UIは表示されない
- サブスクには7日間の無料トライアル（導入価格）を付ける想定
- 「毎月問題を追加する」ことがサブスクの価値なので、Supabaseの`problems`/`problems_casual`へ定期的に追加が必要（現在 清一色50問・何切る99問）

## 広告（AdMob）＋広告除去課金 2026-08-17 実装

- `@capacitor-community/admob@8.1.0`。実装は `src/lib/ads.ts`（バナー＋結果画面の全画面広告、3回に1回）・`src/lib/purchases.ts`（購入/復元）・`src/store/premiumStore.ts`（購入状態）・`src/components/AdBanner.tsx` / `RemoveAdsSection.tsx`
- バナーはホーム・ランキング・履歴のみ（ゲーム画面には出さない）。Web/LINE版は全て無効
- RevenueCat: 商品 `remove_ads`(non_consumable) / エンタイトルメント `no_ads` / default offering の `$rc_lifetime`
- **ハマりどころ①**: RevenueCatの `getCustomerInfo` / `getOfferings` が応答を返さないことがあり、購入状態が確定せず広告が永久に出なかった。→ `withTimeout` で必ず打ち切り、`loaded` を必ず立てる実装にしてある。**このタイムアウトを外さないこと**
- **ハマりどころ②**: `AdMob.requestTrackingAuthorization()`(ATT) を呼ぶとプラグインのネイティブ処理が詰まり、以降の `showBanner` が実行されず広告が出なくなる。→ **ATTは呼んでいない**。トラッキングなし＝パーソナライズなし広告。入れる場合は実機で要検証
- **ハマりどころ③**: SwiftPMのキャッシュに壊れた残骸があると `Could not resolve package dependencies` で失敗する。→ `~/Library/Caches/org.swift.swiftpm/artifacts/` の該当ディレクトリを削除して再ビルド
- **未完了（本番前に必須）**: AdMobアカウント未作成のため**Google公式のテスト広告IDを使用中**。本番の広告ユニットIDを `.env.local` の `NEXT_PUBLIC_ADMOB_IOS_BANNER` / `NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL`（Android版も同様）に設定し、`ios/App/App/Info.plist` の `GADApplicationIdentifier` と `android/app/src/main/AndroidManifest.xml` の `com.google.android.gms.ads.APPLICATION_ID` を本番アプリIDに差し替えること。**テストIDのままでは収益ゼロ**
- **未完了**: App Store Connectで課金商品 `remove_ads`（非消耗型・¥300）の作成。作成前は `getOfferings` がエラーになり購入ボタンは表示されない（現状そうなっている）
- 課金を入れたバージョンは v1.1 として別途審査が必要。プライバシー申告も「広告」関連の更新が必要（識別子・使用状況データを広告目的で第三者=Googleが収集）

## iOSビルド＆App Storeアップロード手順（2026-08-15 確立・重要）

**Xcode GUIのArchiveは使えない**（このチームは実機デバイス未登録のため、自動署名が開発用プロファイルを作れず失敗する）。以下のCLI手順を使うこと:

```bash
cd ~/mahjong-tsujigiri && npm run build && npx cap sync ios
cd ios/App
# 1) 署名なしでアーカイブ
xcodebuild archive -project App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath ~/mahjong-tsujigiri/build/App.xcarchive \
  -derivedDataPath ./build-archive \
  CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO
# 2) APIキーで自動署名して .ipa 書き出し（ExportOptions.plistは method=app-store-connect / teamID=UDQUL243D2 / signingStyle=automatic）
cd ~/mahjong-tsujigiri
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportPath build/export \
  -exportOptionsPlist ExportOptions.plist -allowProvisioningUpdates \
  -authenticationKeyPath ~/.appstoreconnect/private_keys/AuthKey_856294GLP4.p8 \
  -authenticationKeyID 856294GLP4 -authenticationKeyIssuerID 37ea8707-9d58-436d-9557-ca12bdfd7b8d
# 3) アップロード
xcrun altool --upload-app -f build/export/App.ipa -t ios \
  --apiKey 856294GLP4 --apiIssuer 37ea8707-9d58-436d-9557-ca12bdfd7b8d
```

- App Store Connect APIキー(.p8)は `~/.appstoreconnect/private_keys/` に配置済み（chmod 600、gitには入れない）
- `project.pbxproj` の `CODE_SIGN_IDENTITY` はCapacitorが `"iPhone Developer"` を書き込むため、`cap add ios` をやり直したら Release=`Apple Distribution` / Debug=`Apple Development` に直すこと
- 再アップロード時は `CURRENT_PROJECT_VERSION`（ビルド番号）を上げる必要あり
- **2026-08-15: v1.0(build 1) のアップロード成功**（Delivery UUID 1a93926d-9def-4840-a8f6-84e0826e2877）

## iOS / App Store対応 2026-08-15 着手

- `npx cap add ios` でiOSプロジェクト生成済み（`ios/App`、Capacitor 8.5・**SPM構成**でPods不使用）。Bundle ID `com.orangezely.mahjongtsujigiru`、表示名「麻雀辻斬る」、v1.0
- アイコン設定済み（`ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`＝1024・不透明・パンダ緑）
- RevenueCat iOS SDK(5.83.0)もSPMで統合され、依存解決は成功
- **ブロッカー**: Xcodeに**iOSプラットフォーム(シミュレータランタイム)が未導入**のため実ビルド不可。`xcodebuild -downloadPlatform iOS` または Xcode > Settings > Components から導入が必要
- シミュレータMCPツールは `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`（要パスワード）を求める。CocoaPodsはbrewで導入済みだがSPM構成のため不要だった
- 残タスク: Xcodeで署名チーム設定 → アーカイブ → App Store Connectでアプリ作成・アップロード・審査。RevenueCat iOSは別途 `appl_` キーが必要（RevenueCatにiOSアプリ登録）
- Apple Developer Program: 登録済み

## 課金（RevenueCat）2026-08-15 導入

- SDK `@revenuecat/purchases-capacitor@13.4.0` をインストール済み（Capacitor 8対応）
- 初期化: `src/lib/revenuecat.ts` の `initRevenueCat()` を `src/components/RevenueCatInit.tsx` 経由で `layout.tsx` から起動時に呼ぶ。**ネイティブAndroidのみ動作**（Web版/LINEミニアプリは自動スキップ）
- **要対応**: RevenueCatダッシュボードで取得する公開キー(`goog_...`)を `.env.local` の `NEXT_PUBLIC_REVENUECAT_ANDROID_KEY` に設定 → `npm run build && npx cap sync android` で反映。未設定の間は初期化スキップ（起動はする）
- ダッシュボード側（プロジェクト/アプリ/商品/エンタイトルメント/Offering作成）は未着手。RevenueCat MCPは要認証（非対話セッションでは不可）
- 次のステップ候補: paywall表示・購入フロー・エンタイトルメントによる機能ゲート

## 既知の注意点・宿題

- **Supabase無料プランは1週間アクセスなしで自動停止** → リリース初期は注意
- ランキングはAPIを直接叩けば偽スコアを送れる構造（流行ったら対策）
- Googleログイン（Supabase Auth）は第2弾として保留中。現在は簡易プロフィール（端末保存）
- 旧署名キー（mahjong2026パスワード）はgit履歴に残っているが、新キーに交換済みなので実害なし
- 開発サーバー: `npm run dev`（PATH に `/opt/homebrew/bin` が必要な場合あり）。プレビューのタブが非表示だと requestAnimationFrame が止まりゲームタイマーが動かない（アプリのバグではない）
