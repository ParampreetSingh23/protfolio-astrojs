import type { APIRoute } from 'astro';
import { person, projects, updated } from '../data/portfolio';

const urls = ['/', ...projects.map(p => `/projects/${p.slug}/`), '/resume.pdf'];

export const GET: APIRoute = () => new Response(
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${person.site}${u}</loc><lastmod>${updated}</lastmod></url>`).join('\n')}\n</urlset>\n`,
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
