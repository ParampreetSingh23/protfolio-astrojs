# SEO / GEO status — portfolio.parampreetsingh.dev

Updated 2026-10-19. This covers what the repository ships. Live indexing, crawler access at the CDN and citations by AI engines have not been measured yet. Verify them after the domain move (see `DOMAIN-MIGRATION.md`).

## What ships

| Area | Implementation |
| --- | --- |
| Canonical host | `https://portfolio.parampreetsingh.dev`, set once in `astro.config.mjs` and `src/data/portfolio.ts` |
| Crawlable content | Prerendered HTML. The homepage includes a plain-HTML `#readme` summary (bio, every project with links, skills, contact), so engines that don't run JS still read everything the desktop shows. |
| Case studies | `/projects/{tally,drip,cloudwatcher,tisiops,campusbarter}/`. Each opens with a self-contained "What is X?" passage that names Parampreet Singh, the context and the stack, followed by question-led sections. |
| Structured data | `@graph` containing Person (job title, employer, university as `affiliation`, location, `knowsAbout`, `sameAs` GitHub/LinkedIn) and WebSite. The homepage adds ProfilePage and ItemList of projects. Project pages add TechArticle (about a SoftwareApplication, with `url`/`codeRepository` where they exist) and BreadcrumbList. |
| Meta | Unique title and description per page, canonical, Open Graph, Twitter card, 1200×630 `og-image.png`, `max-image-preview:large`. |
| robots.txt | Generated. Allows everyone, and names AI search/answer crawlers explicitly (OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Bingbot). Links the sitemap. |
| sitemap.xml | Generated from project data; `lastmod` = `updated`. |
| llms.txt / llms-full.txt | Generated. `llms.txt` follows the llmstxt.org shape (summary + links). `llms-full.txt` holds every project write-up in one file. |
| Accuracy | All facts come from the October 2026 resume. No invented metrics, users or outcomes. The university is `affiliation`, not `alumniOf`, and no degree credential is claimed, because Parampreet is still enrolled. |

## Known gaps (highest impact first)

1. **Off-site signals.** Point the GitHub profile, repo homepages, LinkedIn and resume at the new domain. AI engines lean heavily on corroboration from other sites.
2. **Search Console / Bing.** Submit the sitemap, run Change of Address, and request indexing of the case studies.
3. **Cloudflare bot settings.** Make sure "Block AI bots" / managed robots.txt aren't overriding `robots.txt`.
4. **Evidence in case studies.** Add real screenshots, a redacted job payload (TisiOps) or an architecture image. Pages with concrete artifacts are cited more often.
5. **Original writing.** One or two technical posts, e.g. idempotent Tally voucher posting, or safe AI-driven infrastructure, would give engines something unique to cite.

Don't fabricate brand mentions, reviews or Wikipedia/Wikidata entries.
