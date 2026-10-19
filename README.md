# Parampreet Singh — Engineering Notebook

A personal portfolio built as an interactive engineering notebook: cloud architecture, production work, learning paths, a small terminal, and the human behind the system.

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Visit `http://localhost:4321`. Production output is static HTML, built with Astro and Tailwind CSS. Fonts are hosted locally and photographs have responsive build-time image variants, with original files preserved. GSAP/ScrollTrigger and Lenis load as progressive enhancements on the homepage; no React or Three.js is needed. Lucide icons render at build time. Project field notes are MDX routes.

```sh
npm run check
npm test
npm run build
npm run preview
```

The existing Cloudflare adapter and Wrangler deployment setup are retained. The generated HTML and assets are in `dist/client/`; the adapter writes generated deployment configuration under `.wrangler/deploy/`. No deployment was performed. `npm run deploy` builds and deploys to the configured Cloudflare account.

## Edit content

- `DESIGN.md`: visual system, interaction principles, factual rules, and acceptance criteria based on the supplied brief.
- `src/data/portfolio.ts`: confirmed identity/contact links, project stacks, and optional image assets.
- `src/data/logos.ts` and `public/logos/`: local brand SVG mappings and source notes. AWS ECR/EKS use official AWS architecture icons; generic concepts retain text labels.
- `src/components/`: grouped sections, diagrams, navigation icons, and the system map.
- `src/pages/projects/*.mdx`: project case studies.
- `src/scripts/`: accessible controls, terminal parser, visual demonstrations, and deferred motion.
- `src/styles/global.css`: tokens, responsive composition, and reduced-motion behavior.
- `GEO-ANALYSIS.md`: local discoverability assessment and remaining evidence gaps.

The supplied brief is the factual source. The previous `public/resume.pdf` is a text placeholder, not an actual PDF, and is not linked. Replace it with a genuine PDF before adding a résumé download.

## Images

The approved transparent portrait is `public/images/profile/parampreet-cutout.png`. Set `assets.profile` in `src/data/portfolio.ts` to replace it. The editing prompt and provenance are in `public/images/README.md`.

Add personal photographs or real project screenshots under the corresponding `public/images/` folder. Every photo entry includes `src`, `alt`, `caption`, `width`, and `height`. The same data file controls the gallery and screenshots. The three supplied personal photos fill the gallery. Future missing photos, timeline artifacts, and failure stories are visibly labeled placeholders. Do not substitute stock photography, fake product screenshots, or invented incidents.

## Behavior

The terminal supports `help`, `about`, `projects`, `experience`, `skills`, `lab`, `contact`, and `clear`, plus arrow-key command history. It does not execute shell commands. Job replay and repository scanning are labeled visual demonstrations; no infrastructure is created, no repository is accessed, and metrics are static examples.

Content, links, diagrams, and expandable notes remain available without JavaScript. Reduced motion disables the intro, smooth scrolling, custom cursor, parallax, and scroll animation; visual demos complete immediately. Mobile navigation uses a native modal dialog with keyboard focus and Escape handling.

## Search

Route-aware canonical/social metadata, Person structured data, a sitemap, permissive robots.txt, and llms.txt are included. The existing domain and social links are preserved. Update all domain references together if the site moves. The four case studies contain self-contained factual summaries and clear limits on unsupported claims. No third-party brand mentions or AI citation outcomes are assumed.

## Dependency audit

The framework, MDX integration, Cloudflare adapter and Wrangler were updated together to compatible current versions. The previous Vite 7 override was removed because Astro 7 requires Vite 8. As of 3 October 2026, npm audit reports four high-severity entries caused by one upstream `http-cache-semantics` advisory (GHSA-ch52-4w7c-c8xp, versions through 4.2.0). The audit suggests incompatible framework downgrades; these were not applied. The portfolio is prerendered and does not implement authenticated server response caching. Recheck the upstream fix before deployment.
