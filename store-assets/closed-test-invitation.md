# 麻雀 辻斬る！ クローズドテスト 招待文（フォーム版・一通で完結）

TransLoopと同じ仕組み（Googleフォーム→スプレッドシート→Apps Script自動送信）を辻斬る用に構築。
**Googleフォームは公開済み・動作確認済み**。スプレッドシートの列追加とApps Scriptだけは、この
セッションの自動操作では保存が反映されない制約に当たったため、下記をコピペで手動セットアップしてください（3分程度）。

## 送る前に

クローズドテストは **Play Consoleに事前登録したGmailアドレスの人だけ**が参加できます。
「Gmailアドレスを教えてもらう」を、**Googleフォーム**で自動化する設計です。

### 運用フロー
1. 下記の文面を**1通**送る（フォームのリンク入り）
2. 相手がフォームに「お名前」「Gmailアドレス」を入力 → 自動でスプレッドシートに記録
3. jellyさんが [スプレッドシート](https://docs.google.com/spreadsheets/d/1C_bDtgVvCHzuppHo1uXWrLgNzAaKVOJHu-vcLrmL0RU/edit) を開き、
   届いたGmailアドレスをPlay Consoleのメーリングリストにコピペ登録
   （※ここだけは公式APIがなく手動です）
4. 登録できたら、スプレッドシートの **D列のチェックボックスをON** にする
   → GAS（Apps Script）が自動でダウンロードリンク付きの案内メールを送信
   → E列に「送信済み」と記録される

### 現状データ（2026-09-11時点）
- Play Consoleのメーリングリストに**既に8人登録済み**（まーちゃお3・テスト3・友人1・部外1）
  ※TransLoopと同じテスターグループを流用している模様
- インストール済みユーザー数: 2人（Play Console実績）
- **12人以上必要なので、あと4人以上**
- クローズドテスト参加リンク（Android）: `https://play.google.com/apps/testing/com.orangezely.mahjongtsujigiru`

---

## 送る文面（これ1通でOK）

```
【お願い】アプリのテストに協力してもらえませんか？

「麻雀 辻斬る！」という、何切るクイズ・符計算クイズで牌効率を鍛えられる
麻雀アプリを作りました。

正式リリース前のテストで、12人以上に14日間使ってもらう必要があり、
声をかけさせてもらいました！Androidのスマホをお持ちでしたら、
1分だけお時間いただけると助かります🙏

① 下記フォームに「お名前」「Androidで使っているGmailアドレス」を入力
　https://forms.gle/Lyikm4Qgzqj9EP1i6

②登録が完了したら、こちらからダウンロード用リンクをメールで
　お送りします（数分〜数時間かかることがあります）

③届いたメールのリンクを開いて「テスターになる」→
　「Google Playでダウンロード」の順にタップ
　（※アプリ名が一時的に「com.orangezely.mahjongtsujigiru」と表示されますが、
　　審査が通るまでの仕様なので、それで大丈夫です）

④何切る問題か符計算問題を1問解くだけでOK！
　サインインなしでもすぐ試せます。

テスト期間: 登録日から14日間
※期間中、たまにアプリを開いてもらえるだけで大丈夫です。
※期間中はアンインストールせずに置いていただけると助かります🙏
※気づいたこと・使いにくい点があれば、このトークに送ってもらえると嬉しいです。

よろしくお願いします！
```

---

## 補足（聞かれたときに）

- **何のアプリ？**: 麻雀の「何切る」クイズと符計算クイズで牌効率・符計算を鍛えられるトレーニングアプリ。60秒タイムアタックやランキングもある。
- **なんでフォーム入力が必要？**: Google Playのクローズドテストは、開発者が事前に登録したGoogleアカウントにしか配信できない仕様のため。登録以外の用途では使いません。
- **個人情報は大丈夫？**: サインインなしでも全機能使えます（ゲストプレイ可）。
- **お金はかかる？**: 無料で1日10回まで各モード遊べます。テストなので課金は不要です。
- **なぜテストが必要？**: Google Playのルールで、一般公開の前に「12人以上×14日間」のクローズドテストが必須のため。

---

## 参考リンク（2026年9月11日時点）

| 用途 | URL |
|---|---|
| 参加申込フォーム（協力者に送る・公開済み） | https://forms.gle/Lyikm4Qgzqj9EP1i6 |
| フォームの回答スプレッドシート（jelly さん用） | https://docs.google.com/spreadsheets/d/1C_bDtgVvCHzuppHo1uXWrLgNzAaKVOJHu-vcLrmL0RU/edit |
| クローズドテスト参加リンク（Android） | https://play.google.com/apps/testing/com.orangezely.mahjongtsujigiru |
| Play Console（辻斬るのクローズドテスト管理） | https://play.google.com/console/u/0/developers/5695586909313287362/app/4974971242394298112/closed-testing |

---

## 手動セットアップ手順（jellyさん作業・3分）

### ① スプレッドシートにD列・E列を追加
上記スプレッドシートを開き、C列の右に2列追加して見出しを入れる：
- D列見出し: `Play Console登録済み`（D2以降をチェックボックスにする：D2:D200を選択 → 挿入 → チェックボックス）
- E列見出し: `送信ステータス`

### ② Apps Scriptを設定
スプレッドシートのメニュー「拡張機能」→「Apps Script」を開き、新しいスクリプトファイルを追加して以下を貼り付け：

```javascript
function onEditInstallable(e) {
  var sheet = e.range.getSheet();
  var col = e.range.getColumn();
  var row = e.range.getRow();
  if (col !== 4 || row === 1) return;
  if (e.value !== 'TRUE') return;
  var statusCell = sheet.getRange(row, 5);
  var status = statusCell.getValue().toString();
  if (status.indexOf('送信済み') === 0) return;
  var name = sheet.getRange(row, 2).getValue();
  var email = sheet.getRange(row, 3).getValue();
  if (!email) return;
  var testingUrl = 'https://play.google.com/apps/testing/com.orangezely.mahjongtsujigiru';
  var subject = '【麻雀 辻斬る！】クローズドテストのご案内';
  var lines = [];
  lines.push(name + ' 様');
  lines.push('');
  lines.push('この度は「麻雀 辻斬る！」のクローズドテストにご協力いただきありがとうございます。');
  lines.push('Play Console側の登録が完了しましたので、下記のリンクからテスターとして参加し、アプリをダウンロードしてください。');
  lines.push('');
  lines.push(testingUrl);
  lines.push('');
  lines.push('①上記リンクを開く');
  lines.push('②「テスターになる」を選択（初回のみ確認画面が出ます）');
  lines.push('③「Google Playでダウンロード」からアプリをインストール');
  lines.push('');
  lines.push('※反映まで数分〜数時間かかることがあります。');
  lines.push('※アプリ名が一時的に「com.orangezely.mahjongtsujigiru」と表示されますが、審査が通るまでの仕様なので問題ありません。');
  lines.push('※テスト期間中はアンインストールせずに置いていただけると助かります。');
  lines.push('');
  lines.push('よろしくお願いいたします。');
  var body = lines.join('\n');
  GmailApp.sendEmail(email, subject, body);
  statusCell.setValue('送信済み ' + new Date());
}
```

保存後、左側時計アイコン「トリガー」→「トリガーを追加」で以下を設定：
- 実行する関数: `onEditInstallable`
- イベントのソース: `スプレッドシートから`
- イベントの種類: `編集時`

保存時にGmail送信の権限承認（自分のアカウントで）を求められるので許可してください。

### ③ 動作確認
D列のチェックボックスを1つONにして、E列に「送信済み」と入り、対象のメールアドレスに案内メールが届けば完成です。

### 仕組みのポイント（TransLoopと同じ）
- D列チェックボックスをONにすると、onEditトリガーが起動し、GmailApp経由で案内メールを自動送信します（E列に送信済み記録）。
- 二重送信防止済み（E列が「送信済み」で始まっていれば再送しません）。
- Play Console公式には「メーリングリストへの外部登録API」が存在しないため、**手動登録の一手間だけ**はどうしても残ります。

※14日間のカウントは**各テスターがオプトインした日**から始まるため、製品版を申請できる日は最後に参加した人次第です。
