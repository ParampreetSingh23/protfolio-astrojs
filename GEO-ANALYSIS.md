# GEO analysis — Parampreet Singh

Assessment date: 3 October 2026. Scope: local generated portfolio and four project case studies. This is an editorial readiness assessment, not a ranking, citation probability, or measured external search visibility score. The live domain, CDN response headers, indexing, and third-party mentions were not audited.

## GEO readiness score: 80/100

| Area | Score | Evidence |
| --- | --- | --- |
| Citability | 21/25 | Four self-contained factual summaries, explicit scope and evidence limits |
| Structure | 18/20 | One H1 per route; logical sections; question-led case studies and expandable notes |
| Multimodal content | 12/15 | Supplied portrait and three personal photographs, architecture diagrams, accessible interactive demonstrations; genuine screenshots pending |
| Authority | 10/20 | Named author, university, supplied role, bylines/dates, confirmed social links; implementation evidence and external validation pending |
| Technical accessibility | 19/20 | Static HTML, canonical metadata, sitemap, robots.txt, JSON-LD, llms.txt; deployment not verified |

## Platform breakdown

These qualitative scores describe local content preparedness, not actual visibility on a platform.

- **Google AI Overviews: 81/100.** Clear titles, metadata, heading hierarchy, factual explanatory passages, and indexable HTML. Search Console indexing and real-world discovery remain unverified.
- **ChatGPT: 78/100.** Explicit identity, job and education facts, self-contained project notes, sameAs links and navigational llms.txt. Independent corroboration is not established by this review.
- **Perplexity: 77/100.** Readable project explanations with precise limits, diagrams and bylines. External community mentions and citations are unverified.

## AI crawler access

`public/robots.txt` uses `User-agent: *` with `Allow: /`. At the repository level, no crawler is blocked, including OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, PerplexityBot, CCBot, anthropic-ai, Bytespider, and cohere-ai. GPTBot is a training crawler; OAI-SearchBot is the search crawler. These roles must not be conflated. Wildcard permission is the existing policy; no new selective training restrictions were imposed. Robots directives do not prove CDN/WAF access, crawler behavior, indexing or citation.

## llms.txt

Present at `/llms.txt`. It links the notebook and all four project routes, describes identity and confirmed experience, gives contact links, and distinguishes illustrations from actual telemetry. It is supplementary navigation; there is no assumption that a search engine or AI system consumes it. No RSL license is added because the user has supplied no licensing policy.

## Brand mention analysis

- **GitHub:** Repository-provided profile URL is included in visible contact links and Person `sameAs`.
- **LinkedIn:** Repository-provided profile URL is included in visible contact links and Person `sameAs`.
- **Wikipedia/Wikidata:** Not checked. No presence or absence claimed.
- **Reddit:** Not checked. No presence or absence claimed.
- **YouTube:** Not checked. No presence or absence claimed.

A personal portfolio should earn external references through real work and useful public explanations. Do not fabricate mentions or create an encyclopedia entry without independent notability.

## Passage-level citability

Each project begins with a question-led definition that stands alone, identifies Parampreet, explains supplied technologies and scope, and explicitly excludes unsupported results. Counts use whitespace-delimited words; 134–167 words is a writing heuristic, not an established guarantee of selection.

| Route | Passage | Words |
| --- | --- | --- |
| `/projects/cloudwatcher/` | What is CloudWatcher? | 141 |
| `/projects/drip/` | What is DRIP? | 138 |
| `/projects/tisiops/` | What is TisiOps? | 139 |
| `/projects/campusbarter/` | What is CampusBarter? | 144 |

The homepage provides shorter editorial entry points. Project routes supply fuller explanations without adding invented metrics, customers or outcomes. The supplied brief remains the content source; no actual résumé PDF was supplied.

## Rendering and JavaScript dependency

Astro prerenders all five routes to HTML under `dist/client/`. Biography, experience, project descriptions, stacks, diagrams, case studies and contact links are available in the initial HTML. Native details elements provide learning notes and templates without JavaScript. A fallback mobile navigation is shown when JavaScript is disabled.

JavaScript enhances navigation, the terminal, visual job/scan controls, custom cursor, smooth scrolling and purposeful diagram/timeline motion. GSAP, ScrollTrigger and Lenis are a deferred homepage chunk. No React SPA, client-only biography, Three.js, video background, or remotely fetched project content is used. Static HTML provides crawler access without requiring execution; this does not imply every crawler lacks JavaScript capability.

## Top five highest-impact next changes

1. Publish permitted project screenshots, redacted implementation artifacts and concrete engineering decisions in the case studies.
2. Replace unfilled incident templates and 2024/2025 milestones with documented events, including the debugging method and actual lesson.
3. Supply a genuine résumé PDF and verify the public identity/role data against it before linking it.
4. After deployment, verify canonical URLs, HTTP status, CDN/WAF crawler access, sitemap fetches and indexing through Search Console/Bing tools.
5. Publish original engineering notes with evidence and primary references, then use existing genuine GitHub/LinkedIn profiles to make them discoverable. Never manufacture brand mentions.

## Schema recommendations

Implemented `Person` schema includes name, URL, current supplied job title, employer, university affiliation, confirmed sameAs URLs, email and relevant topics. University is represented as an affiliation, not `alumniOf`, because the user is still enrolled. Route-specific title, canonical URL and social metadata are present.

Optional future additions: `CreativeWork` or `TechArticle` on documented technical case studies, with truthful author, publication/modification dates and images. Do not claim Article evidence, awards, affiliations, product reviews, ratings or commercial FAQ rich-result eligibility that the visible content does not support.

## Specific content reformatting suggestions

- **CloudWatcher:** Replace the pending evidence section with one real Terraform resource or redacted alarm example, followed by why its threshold and notification policy were chosen.
- **DRIP:** Add a factual request/context boundary and provider-selection decision, with a genuine screenshot if permitted.
- **TisiOps:** Add a redacted job contract, approval rule and actual verification result. Keep demo logs separated from real incident evidence.
- **CampusBarter:** Add one documented authentication or WebSocket delivery edge case and its resolution. Do not add fabricated adoption figures.
- **Failure notes:** Preserve the five-question template and fill it with an actual event. Empty templates should never be quoted as incidents.
