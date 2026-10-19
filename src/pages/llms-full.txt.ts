import type { APIRoute } from 'astro';
import { person, projects, experience, education, skillGroups, updated } from '../data/portfolio';
import { projectDoc } from '../scripts/terminal';

export const GET: APIRoute = () => new Response(`# ${person.name} — ${person.role}

Source: ${person.site}/ · Updated: ${updated}

${person.summary}

## Experience

${experience.role}, ${experience.company} — ${experience.period}

## Education

${education.degree}, ${education.school}. CGPA ${education.cgpa}. ${education.year}.

## Projects

${projects.map(p => `${projectDoc(p).replace(/^# /, '### ')}\nPage: ${person.site}/projects/${p.slug}/`).join('\n\n')}

## Skills

${skillGroups.map(g => `- ${g.name}: ${g.items}`).join('\n')}

## Contact

- Email: ${person.email}
- GitHub: ${person.github}
- LinkedIn: ${person.linkedin}
- Resume: ${person.site}/resume.pdf
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
