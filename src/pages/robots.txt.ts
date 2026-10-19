import type { APIRoute } from 'astro';
import { person } from '../data/portfolio';

// Everything is public. AI search/answer crawlers are named explicitly so the intent is unambiguous.
const aiBots = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot'];

export const GET: APIRoute = () => new Response(
  `User-agent: *\nAllow: /\n\n${aiBots.map(b => `User-agent: ${b}`).join('\n')}\nAllow: /\n\nSitemap: ${person.site}/sitemap.xml\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
