# Moving the portfolio to `portfolio.parampreetsingh.dev`

Goal: serve the site at **https://portfolio.parampreetsingh.dev**. Every old URL on `parampreetsingh.dev` (and `www.`) should **301-redirect** to the same path on the new host. This way Google, LinkedIn and AI engines carry the old URLs' ranking over.

What already exists, checked on 2026-10-19:
- `parampreetsingh.dev` uses Cloudflare nameservers (`kim` / `kanye.ns.cloudflare.com`). It is served by the Worker `protfolio-astrojs`.
- `www.parampreetsingh.dev` already resolves through Cloudflare.
- The code is already switched. `astro.config.mjs` `site`, `person.site`, canonical tags, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` and `og-image.png` all point at `https://portfolio.parampreetsingh.dev`.
- `wrangler.jsonc` lists both hostnames as Custom Domains.

> Do the steps in order. Don't add the redirect (step 3) until the new host works (step 2), or the site goes offline.

---

## 1. Check how the apex is attached today

Cloudflare dashboard → **Workers & Pages** → `protfolio-astrojs` → **Settings → Domains & Routes**.

- If `parampreetsingh.dev` is listed as a **Custom domain**, you're fine. `wrangler.jsonc` already lists it, so deploying keeps it.
- If it's listed as a **Route** (`parampreetsingh.dev/*`), delete that route. Deploying adds it back as a Custom Domain from `wrangler.jsonc`.
- If **DNS → Records** has a manual record named `portfolio`, delete it. Custom Domains create their own record and fail if one already exists.

## 2. Deploy and bring the subdomain up

```bash
npx wrangler login
```

```bash
npm run deploy
```

Wrangler attaches `portfolio.parampreetsingh.dev`. It creates the DNS record and issues the TLS certificate, which takes 1–5 minutes. Verify:

```bash
curl -sI https://portfolio.parampreetsingh.dev | head -1
```

```bash
curl -s https://portfolio.parampreetsingh.dev/robots.txt
```

Expect `HTTP/2 200`, and a `Sitemap:` line pointing at the portfolio host.

## 3. Redirect the apex and www to the subdomain (301, path kept)

Dashboard → zone **parampreetsingh.dev** → **Rules → Redirect Rules → Create rule** (Single Redirect).

- **Name:** `apex → portfolio`
- **If incoming requests match → Custom filter expression → Edit expression:**

  ```
  (http.host in {"parampreetsingh.dev" "www.parampreetsingh.dev"}) and not (http.request.uri.path eq "/google5c674b983799a5da.html")
  ```

  The exception keeps the Google verification file reachable on the old host, so Search Console can still verify the old property during the move.
- **Then → URL redirect → Type: Dynamic:**

  ```
  concat("https://portfolio.parampreetsingh.dev", http.request.uri.path)
  ```

- **Status code:** `301`. **Preserve query string:** ✅
- Deploy.

Redirect Rules run *before* the Worker. The apex stays attached to the Worker only so it keeps a DNS record and certificate, and the rule answers first. Verify:

```bash
curl -sI https://parampreetsingh.dev/projects/drip/ | grep -iE "^HTTP|^location"
```

```bash
curl -sI https://www.parampreetsingh.dev/ | grep -iE "^HTTP|^location"
```

Expect `301` with `location: https://portfolio.parampreetsingh.dev/projects/drip/` (and `/` for the second command). There should be one hop, no chains.

## 4. Don't let Cloudflare block AI crawlers (GEO)

`robots.txt` explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others. Cloudflare can still block them at the edge:

- **Security → Bots:** set *Block AI bots / AI Scrapers and Crawlers* to **off**.
- **AI Crawl Control** (if shown): allow the crawlers you want, and turn off the **managed robots.txt** option, so Cloudflare doesn't prepend its own rules to yours.
- **Bot Fight Mode:** this can challenge legitimate crawlers. If you turn it on, check that `curl -A "GPTBot" https://portfolio.parampreetsingh.dev/llms.txt` returns 200.

## 5. Google Search Console

1. Make sure you have the **old** property verified, e.g. `https://parampreetsingh.dev/`. The `google5c674b983799a5da.html` file keeps that working.
2. **Add the new property.** The best option is a **Domain property** `parampreetsingh.dev` verified by DNS TXT. Add the TXT record in Cloudflare DNS. It covers every subdomain at once. Alternatively, use a URL-prefix property `https://portfolio.parampreetsingh.dev/`: the same HTML verification file is deployed there too.
3. In the new property, go to **Sitemaps** and submit `https://portfolio.parampreetsingh.dev/sitemap.xml`.
4. In the **old** property, go to **Settings → Change of address**. Pick the new property and run the checks; it verifies that the 301s from step 3 are in place. Submit.
5. **URL Inspection → Request indexing** for `/` and the five `/projects/*/` pages.
6. Expect a few weeks of both hosts appearing in results. The old sitemap will show redirect warnings, which is normal.

## 6. Bing (also feeds ChatGPT search and Copilot)

[Bing Webmaster Tools](https://www.bing.com/webmasters) → **Import from Google Search Console**, or add the site manually. Submit the same sitemap. Optionally use **Site Move** with the same old → new mapping.

## 7. Update every link you control

Search engines and AI models trust a page more when other places link to it.

- **GitHub profile → Website:** `https://portfolio.parampreetsingh.dev`
- **This repo's homepage:**

  ```bash
  gh repo edit ParampreetSingh23/protfolio-astrojs --homepage https://portfolio.parampreetsingh.dev
  ```

- **LinkedIn:** Contact info → Website. Also add it to **Featured**.
- **Resume PDF:** add `portfolio.parampreetsingh.dev` to the header line, then replace `public/resume.pdf`.
- **Project READMEs** (TisiOps, CampusBarter): link back to their case-study pages, e.g. `https://portfolio.parampreetsingh.dev/projects/tisiops/`.

## 8. Check the result

- Rich Results Test (`https://search.google.com/test/rich-results`): run it on `/` and `/projects/tally/`. It should detect Person, ProfilePage, BreadcrumbList and Article.
- LinkedIn Post Inspector (`https://www.linkedin.com/post-inspector/`): paste the new URL. This refreshes the cached preview image.
- Open `/robots.txt`, `/sitemap.xml`, `/llms.txt` and `/llms-full.txt` on the new host.

## 9. How long to keep the redirect

**Keep it permanently**, or at least 1 year, as Google recommends. It costs nothing. Removing it would break old links on LinkedIn, in resumes you've already sent and in search caches.

## Rollback

Disable the Redirect Rule from step 3, and the apex serves the site again. To be fully canonical on the apex again, change `site` back in `astro.config.mjs` and `src/data/portfolio.ts`, then redeploy.

## Keeping SEO fresh

All SEO files are generated from `src/data/portfolio.ts`. When you add a project or change a role, edit that file and bump `updated`. The sitemap, `llms.txt`, `llms-full.txt`, JSON-LD and the desktop all update on the next deploy. A new project also needs a `src/pages/projects/<slug>.mdx` case study.
