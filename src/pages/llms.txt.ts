import type { APIRoute } from 'astro';
import { person, projects, experience, education, updated } from '../data/portfolio';

// llmstxt.org format: H1, blockquote summary, then link sections.
export const GET: APIRoute = () => new Response(`# ${person.name}

> ${person.name} is a full-stack software developer from ${person.location}. ${experience.role} at ${experience.company} (${experience.period}); final-year ${education.degree} student at ${education.school.split(',')[0]} (CGPA ${education.cgpa}). Works in TypeScript, Node.js, Next.js, Java and Python, building REST and real-time APIs, job queues and AWS-deployed systems.

The homepage is an interactive Linux-style desktop; all of its content is also available as plain HTML on the pages below. Last updated ${updated}.

## Projects

${projects.map(p => `- [${p.name}](${person.site}/projects/${p.slug}/): ${p.description} Stack: ${p.stack.join(', ')}.`).join('\n')}

## Profile

- [Portfolio home](${person.site}/): summary, projects, skills and contact
- [Resume (PDF)](${person.site}/resume.pdf)
- [GitHub](${person.github})
- [LinkedIn](${person.linkedin})
- Email: ${person.email}

## Optional

- [Full text for LLMs](${person.site}/llms-full.txt): every project write-up and skill in one file
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
