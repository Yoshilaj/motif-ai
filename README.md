# motif-ai.app

Motif AI（モティフAI）の公式サイト。GitHub Pages で `main` のルートをそのまま配信する静的サイトです。ビルド・依存・外部ライブラリーはありません。

| ファイル | 内容 |
|---|---|
| `index.html` | トップページ |
| `pricing.html` | 料金 |
| `access.html` | はじめ方（Stripe での申し込み・相談フォーム・インストール手順） |
| `thanks.html` | Stripe 決済後の戻り先 |
| `privacy.html` / `terms.html` / `tokushoho.html` | プライバシーポリシー・利用規約・特定商取引法に基づく表記 |
| `404.html` | GitHub Pages の 404 |
| `site.css` / `site.js` | 全ページ共通のスタイル（ダーク基調・Geist / Noto Sans JP・黄緑アクセント）と、ナビ・スクロール連動の製品ステージ・出現アニメーション・カウントアップ・相談フォームのスクリプト |
| `assets/` | 画像・動画（Higgsfield で生成したイメージ素材を web 用に変換したもの）、favicon、OG 画像。`ui-scrub.mp4` はトップのスクロール連動ステージ用（キーフレーム間隔を短くエンコード）、`ui-hero.jpg` はそのポスター、`step-*.jpg` は同じ画面の切り出し |
| `CNAME` | カスタムドメイン `motif-ai.app` |

## プレビュー

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

`http://127.0.0.1:4173/` を開きます。

## 外部との接点

- **申し込み** — `access.html` の「Stripe で申し込む」は Stripe Payment Link（本番）。決済後は `thanks.html` に戻ります。
- **相談フォーム** — `access.html` の `#access-form` は `https://motif-ai-license.fly.dev/v1/access/request` に JSON を POST します（ライセンスサービス `apps/backend`、CORS は `motif-ai.app` のみ許可）。送信内容はサービスの volume に保存され、Resend で運営者へメールされます。
- **フォント** — Google Fonts（Noto Sans JP / Inter）。それ以外の外部読み込み、アクセス解析、Cookie はありません。

## 確認用

`index.html?review` を付けて開くと、スクロール連動のステージを通常のブロックに戻し、出現アニメーション待ちの要素をすべて表示した状態になります。ヘッドレスブラウザーでスクリーンショットを撮るときに使います。

## 更新するとき

- 全ページの `<head>`・ヘッダー・フッターは同じ構造です。ナビやフッターを変えるときは全ページに同じ変更を入れてください。
- 料金・返金条件は `index.html`・`pricing.html`・`terms.html`・`tokushoho.html` の四か所にあります。変えるときは四つとも。
- ページ内の人物写真・映像は生成イメージで、フッターにその旨を明記しています。実機のスクリーンショットに差し替える場合は `assets/` の同名ファイルを置き換えてください。
