# Parampreet Singh — Digital Engineering Notebook

## Concept

“A digital engineering notebook that accidentally became a portfolio.” Show how Parampreet thinks: building systems, understanding failures, following curiosity and building again. Combine editorial typography, architecture diagrams, notebook annotations, a terminal and personal photography. It should feel like a person, not a résumé, SaaS page, Vercel clone or badge collection.

## Tokens

| Token | Value | Purpose |
| --- | --- | --- |
| Canvas | `#0B0B0A` | Warm dark background |
| Surface | `#11110F` | Quiet diagram and terminal panels |
| Text | `#F1EEE7` | Headings and body |
| Secondary | `#8B8982` | Larger supporting copy |
| Cream | `#D8D2C5` | Paper frames and emphasis |
| Orange | `#FF6B35` | Active nodes, curiosity, links and buttons |
| Green | `#6E8B74` | Operational states, always with text |
| Border | `rgba(241,238,231,0.12)` | Thin 1px rules |

Use orange sparingly. Small metadata needs a lighter neutral for sufficient contrast. No gradients, neon, glassmorphism, particle systems, decorative WebGL or logo walls. At the user's request, small real technology logos retain their original brand colors beside technology labels and in selected diagrams. AWS service icons use the official architecture assets; logos load locally without a runtime library. Grain is fixed, extremely faint and non-interactive. Engineering grids appear only inside selected diagrams.

## Typography and layout

Space Grotesk for display/body; JetBrains Mono for technical labels. Headings use 52–104px desktop and 38–56px mobile, tight tracking, deliberate breaks and restrained weights. Body is 16–18px with 1.6 line height; annotations are 11–12px. Layout uses a maximum width around 1360px, generous margins, asymmetrical columns, mostly square panels and long horizontal rules. Circles identify ports and statuses. Open editorial sections alternate with technical artifacts.

## Navigation and intro

Sticky navigation: PARAMPREET, WORK, LAB, ABOUT, CONTACT and ONLINE. Hide when scrolling down, restore when scrolling up, remain visible when focused. Mobile uses a full-screen menu with focus management, Escape and visible controls. The original volume/build label has been removed at the user's request. A maximum 1–2 second intro shows INITIALIZING, PERSON, CURIOSITY, SYSTEMS, then PARAMPREET SINGH. It is progressive enhancement, never a prerequisite for content, and skipped for reduced motion.

## Narrative

1. **001 / INTRO:** “I like breaking things. Then figuring out why they broke. Then building something that doesn't break again.” Supporting AI × CLOUD × SYSTEMS, name and discipline line. CTAs: ENTER THE SYSTEM and VIEW WORK. A technical dependency graph connects PARAMPREET with AI, CLOUD, DEVOPS, BACKEND, SYSTEMS, LEARNING, BUILDING and small AWS/K8S/DOCKER/TERRAFORM/LLM/LINUX/JAVA/PYTHON annotations. Subtle mouse response and node movement, never a particle cloud. A notebook index leads into WHO IS BEHIND THE SYSTEM? The editorial portrait appears later, not as a conventional hero image.
2. **002 / JOURNEY:** Vertical scroll-drawn timeline from B.Tech in 2023 to Rabbitt AI, Cloud DevOps / SRE Intern, April 2026–present. 2024/2025 artifacts remain labeled placeholders until supplied. Chitkara University, Rajpura, Punjab; final year; CGPA 9.44. Active milestones expand, turn orange, shift slightly and reveal artifacts.
3. **003 / EXPERIENCE:** PRODUCTION at Rabbitt AI. CloudWatcher covers Terraform monitoring modules, CloudWatch collection/alarms, SNS, IAM and collaborative Git workflow. Diagram: AWS/EC2 → CloudWatch → metrics → threshold → alarm → SNS → alert. Healthy nodes are green, alerts orange. DRIP covers multiple LLM providers, code generation/debugging/refactoring, contextual assistance, authentication, modular APIs, SSR, state management, GitHub Actions and AWS. Diagram: USER → NEXT.JS → API → BACKEND → LLM PROVIDERS → POSTGRESQL inside Docker/AWS. Assemble progressively with scrolling. Use screenshots only when supplied.
4. **004 / SYSTEMS:** TisiOps, Founder & Developer. AI-powered DevOps for cloud provisioning, deployment, staging, monitoring, logging and diagnosis. Emphasize PLAN → VALIDATE → APPROVE → EXECUTE → VERIFY. AI proposes a controlled job; Redis/BullMQ and a worker execute it. No uncontrolled LLM shell access. Replayable job demonstration: QUEUED, RUNNING, VERIFYING, DEPLOYED, with explicitly illustrative log entries. Staging: repository → analyse → detect runtime/services/dependencies → staging plan → EC2 → Docker → deploy → verify. Observability: server CPU/RAM/disk/Docker/application → OpenTelemetry → SigNoz. Clearly mark metrics as demo values. CampusBarter is a smaller peer marketplace architecture with factual stack and features. Each project gets a readable MDX case study.
5. **005 / RABBIT HOLES:** Accessible expandable paths: AI/LLMs/agents/tool calling/MCP/AI infrastructure; Docker/containers/Kubernetes/networking/CNI/observability; AWS/EC2/ECS/EKS/IaC/Terraform. Hover activates connected nodes; click or keyboard opens notes. Notes are exploration questions, not invented expertise. AI INFRASTRUCTURE is the current exploration, with no fake completion percentage.
6. **006 / LAB:** Filesystem presentation of confirmed projects, expandable for future entries. THINGS I'VE BROKEN uses unfilled incident templates: what happened, why, debugging, change and learning. Never imply placeholder incidents happened. Technical stack is an interactive category map. Fundamentals include 350+ DSA problems, OS, DBMS, networks, OOP and software design; include the two supplied IBM introductory certifications.
7. **007 / OUTSIDE:** A restrained scrapbook of supplied personal photographs: varying aspect ratios, 1–3 degree rotations, warm highlights, muted shadows, tiny captions, slight hover scale and desktop parallax. Mobile becomes a clean gallery. Missing photos and unconfirmed hobbies remain clear placeholders. The secondary terminal supports help, about, projects, experience, skills, lab, contact and clear.
8. **008 / CONTACT:** BUILD SOMETHING INTERESTING? Let's talk. EMAIL, GITHUB, LINKEDIN use existing confirmed repository links. Closing “You've reached the end. Or maybe...” zooms chapter representations into connected nodes, reconstructing the hero system map. RUN IT AGAIN returns to top.

## Motion

GSAP ScrollTrigger handles meaningful line drawing, milestone activation, diagram construction, text clipping, slight horizontal movement and closing map scale. Do not fade every section. Lenis runs only when motion is allowed, preserving anchors and browser navigation. Desktop fine pointers get a small cream/orange cursor with VIEW/OPEN/CODE/GO labels; keep native cursor until enhancement is ready. Disable custom cursor on touch and reduced motion. Buttons move subtly; project links shift 2–4px; photo hover restores color and scales at most 1.04. Pause decorative motion offscreen.

Reduced motion skips intro, smooth scrolling, cursor effects, parallax, large transforms and continuous decorative motion, including live preference changes. Core content is readable without JavaScript or animation. Mobile diagrams reflow rather than shrinking unreadably; no horizontal page overflow or scroll hijacking.

## Assets and factual boundaries

Folders: `public/images/profile`, `personal`, `projects`, `timeline`, `textures`. Central optional asset data controls URLs, dimensions, alt text and captions. Use lazy loading and responsive images when supplied. Product screenshots remain accurate and unfiltered. Personal images may use monochrome and warm treatments. Missing assets use CSS/SVG diagrams or clearly labeled frames, never stock images or generated people.

The supplied brief is the factual source until an actual résumé arrives. Never invent employers, roles, accomplishments, incidents, users, revenue, performance gains, production scale, awards, certifications, metrics or URLs. Diagrams and mock telemetry are explicitly demonstrations. The existing `resume.pdf` is a text placeholder; do not present it as a working résumé download. Undocumented years, photos, screenshots, hobby details and repository URLs stay pending.

## Architecture and discoverability

Astro statically generates content. Tailwind v4 supplies tokens/utilities; TypeScript implements small interactions; GSAP/ScrollTrigger and Lenis load only where needed. MDX supplies long-form project routes. Lucide SVGs render at build time. These interactions need no React or Three.js. Group related sections into maintainable Astro components, avoiding unnecessary one-purpose abstractions.

SEO title: **Parampreet Singh — AI, Cloud & Systems**. Description: **Personal portfolio of Parampreet Singh — Computer Science student, Cloud DevOps / SRE intern, and builder of AI-powered and cloud-native systems.** Provide route-aware canonical/social metadata, favicon, sitemap, robots.txt, confirmed Person/sameAs data and llms.txt. Use clear bylines, dates and self-contained factual project passages. GEO readiness is a local editorial assessment, not a prediction of rankings or AI citations. Do not invent third-party mentions or licensing terms.

## Acceptance

Implement and verify in stages: repository/configuration, tokens/layout, hero/map, journey, projects, motion, personal sections/terminal, optimization. Confirm production build, Astro/TypeScript checks, working terminal and demo controls, keyboard navigation, accessible focus/labels, mobile widths, reduced motion and JavaScript-free content. Semantic landmarks, one H1 per route, ordered headings, meaningful alt text and 44px controls are mandatory. Aim for excellent Lighthouse performance; report scores only when measured. Publishing is a separate step.
