# Parampreet Singh — PortfolioOS

Portfolio that boots like a Linux machine. Visitors land on a desktop with files and `.sh` scripts. Double-click (or tap) them, or type commands into the terminal. `./github.sh` opens a live GitHub profile in a built-in mini browser.

Live: https://portfolio.parampreetsingh.dev

## Run locally

Requires Node.js 22.12+.

```sh
npm install
npm run dev        # http://localhost:4321
npm test           # terminal command engine
npm run check      # astro check
npm run build      # static output in dist/client
npm run deploy     # build + wrangler deploy (Cloudflare Workers)
```

## How it fits together

| Path | What it is |
| --- | --- |
| `src/data/portfolio.ts` | **Single source of truth**: identity, experience, projects (`flow`, `points`, `stack`, `live`, `repo`), skills, `updated` date. |
| `src/scripts/terminal.ts` | Pure command engine: virtual filesystem (`~/Desktop`, `~/Desktop/projects`), `.sh` scripts, `ls/cd/cat/open/neofetch…`. Returns text plus an action (open browser/files/editor/project). Tested in `tests/terminal.test.mjs`. |
| `src/scripts/os.ts` | Desktop UI: boot log, window manager (drag, focus, min/max, dock), terminal window, mini browser (GitHub via public API, LinkedIn card, iframes), file manager, text editor, project app, right-click menu, wallpaper themes, synthesized sounds. |
| `src/scripts/icons.ts` | Lucide icons used by the desktop. |
| `src/pages/index.astro` | Desktop markup and a plain-HTML `#readme` summary for crawlers and screen readers (shown when JS is off). |
| `src/pages/projects/*.mdx` + `src/layouts/ProjectLayout.astro` | Crawlable case-study pages, one per project slug. |
| `src/pages/{robots.txt,sitemap.xml,llms.txt,llms-full.txt}.ts` | Generated at build time from `portfolio.ts`. |
| `src/layouts/Layout.astro` | `<head>`: canonical, Open Graph/Twitter, JSON-LD graph (Person, WebSite, plus per-page nodes). |
| `src/styles/` | `base.css` (tokens, fonts, reset), `os.css` (desktop), `doc.css` (project pages). |
| `public/` | Fonts, logos, `resume.pdf`, `og-image.png` (rendered from `og-image.svg`). |

## Editing content

- **Change a fact or add a project:** edit `src/data/portfolio.ts` and bump `updated`. The desktop, terminal, sitemap, `llms*.txt` and JSON-LD all follow. A new project also needs `src/pages/projects/<slug>.mdx`.
- **Add a desktop script:** add an entry to `scripts` in `src/scripts/terminal.ts`. It appears on the desktop automatically. Add a test line.
- **Resume:** replace `public/resume.pdf`.
- **Social preview:** edit `public/og-image.svg`, then re-render it to a 1200×630 PNG with any headless Chromium.

## Notes

- Ordinary sites can't be framed: GitHub and LinkedIn send `X-Frame-Options`. So the mini browser renders GitHub from `api.github.com` (60 requests/hour per visitor IP) and shows a card for LinkedIn. Same-origin pages and sites that allow framing load in an iframe.
- Theme and sound preferences live in `localStorage`; the site works without them.
- Domain move from the apex to `portfolio.` is documented in `DOMAIN-MIGRATION.md`. SEO/GEO status is in `GEO-ANALYSIS.md`.
