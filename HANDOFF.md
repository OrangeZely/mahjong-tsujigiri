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
- どちらのモードも開始画面のチェックで**鬼斬りモード**にできる（1問5秒制限、時間切れは不正解。内部フラグ`oniMode`）
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

- `public/tiles/` の37枚PNG。元画像 `~/Downloads/22459104.png`（6667x5000、ライセンス問題なし）から ImageMagick で切り出し
- 切り出しグリッド: W=620 H=980 XS=42 XD=667、行y = 42(萬子) / 1060(索子) / 2078(筒子) / 3096(字牌) ※索子と筒子の行順に注意
- 茶色フチ `rgb(115,75,35)` は **fuzz 5%** で透明化済み（20%だと萬子の漢数字 `rgb(64,32,12)` まで消えるので注意）
- 赤5は列10（x=6045）

## Play Storeリリース状況

- ✅ Capacitorプロジェクト・静的書き出しビルド・cap sync 動作確認済み
- ✅ 署名キー: `android/app/mahjong-upload.jks` + `android/key.properties`（**両方gitignore済み・コミット禁止**）
- ✅ バックアップ: Google Drive マイドライブ「麻雀辻斬る_署名キー_バックアップ」
- ✅ プライバシーポリシー: 本番URL + `/privacy` をPlay Consoleに登録予定
- ⬜ AABビルド: `npm run build && npx cap sync android && cd android && ./gradlew bundleRelease`
- ⬜ Play Console登録（**初回アップロード時にGoogle Play アプリ署名を必ず有効化**）
- ⬜ 個人アカウントのため クローズドテスト テスター12人×14日間 が製品版公開の条件
- ⬜ 収益化はAdMob予定（ポリシーは対応済み。実装時はデータセーフティ申告の更新必須）

## 既知の注意点・宿題

- **Supabase無料プランは1週間アクセスなしで自動停止** → リリース初期は注意
- ランキングはAPIを直接叩けば偽スコアを送れる構造（流行ったら対策）
- Googleログイン（Supabase Auth）は第2弾として保留中。現在は簡易プロフィール（端末保存）
- 旧署名キー（mahjong2026パスワード）はgit履歴に残っているが、新キーに交換済みなので実害なし
- 開発サーバー: `npm run dev`（PATH に `/opt/homebrew/bin` が必要な場合あり）。プレビューのタブが非表示だと requestAnimationFrame が止まりゲームタイマーが動かない（アプリのバグではない）
