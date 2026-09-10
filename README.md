# Motif AI — website

Static site for Motif AI (モティフAI), served at <https://yoshilaj.github.io/motif-ai/>.

Plain HTML + one CSS file. No framework, no build step, no external scripts, no analytics.

## Files

| File | Purpose |
|---|---|
| `index.html` | Top page: what it does, how it works, scope, price card, early-access CTA, short English section |
| `pricing.html` | Price, billing, cancellation and refund summary, requirements |
| `tokushoho.html` | 特定商取引法に基づく表記 |
| `privacy.html` | プライバシーポリシー |
| `terms.html` | 利用規約 (incl. キャンセル・返金ポリシー, §5) |
| `404.html` | Not-found page (GitHub Pages serves it automatically) |
| `style.css` | The only stylesheet |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (no Jekyll processing) |

All links between pages are relative, so the site works under the `/motif-ai/` sub-path. The one exception is `404.html`, which uses absolute `/motif-ai/...` paths because GitHub serves it for any missing URL, including nested ones.

## Publishing

1. Create the GitHub repository `yoshilaj/motif-ai` (public).
2. Push this directory to its `main` branch:
   ```sh
   git remote add origin git@github.com:yoshilaj/motif-ai.git
   git push -u origin main
   ```
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose branch `main` and folder `/ (root)`, then save.
4. After a minute or two the site is live at `https://yoshilaj.github.io/motif-ai/`.

Every later push to `main` redeploys automatically.

## Editing

- Price, refund wording and contact address appear on several pages (`index.html`, `pricing.html`, `tokushoho.html`, `terms.html`). Change them together.
- Update the 最終更新日 line on `tokushoho.html`, `privacy.html` and `terms.html` when their text changes.
- Preview locally with any static server, e.g. `python3 -m http.server 8000` from this directory, then open `http://localhost:8000/`. (The 404 page's absolute links will only resolve once deployed under `/motif-ai/`.)
