import { person, projects, skillGroups, education, experience } from '../data/portfolio.ts';

export type Action = { type: 'project'; slug: string } | { type: 'browser'; url: string } | { type: 'files'; path: string } | { type: 'editor'; path: string };
export interface TerminalResult { text: string; links?: { label: string; href: string }[]; clear?: boolean; cwd?: string; action?: Action; }

const HOME = '~';
const DESKTOP = '~/Desktop';
const PROJECTS = '~/Desktop/projects';

const projectDoc = (p: typeof projects[number]) => [
  `# ${p.name}`, `${p.type} · ${p.context}`, '', p.description, '', ...p.points.map(x => `- ${x}`), '', `stack: ${p.stack.join(', ')}`, ...(p.live ? [`live:  ${p.live}`] : []), ...(p.repo ? [`repo:  ${p.repo}`] : []),
].join('\n');

const projectList = () => projects.map(p => `  ${p.slug.padEnd(14)}${p.description}`).join('\n');

interface Script { src: string; run(args: string[]): TerminalResult; }
const scripts: Record<string, Script> = {
  'github.sh': { src: `xdg-open ${person.github}`, run: () => ({ text: `Launching browser → ${person.github.replace('https://', '')}`, action: { type: 'browser', url: person.github } }) },
  'linkedin.sh': { src: `xdg-open ${person.linkedin}`, run: () => ({ text: `Launching browser → ${person.linkedin.replace('https://', '')}`, action: { type: 'browser', url: person.linkedin } }) },
  'resume.sh': { src: 'xdg-open ./resume.pdf', run: () => ({ text: 'Opening resume.pdf in browser…', action: { type: 'browser', url: '/resume.pdf' } }) },
  'projects.sh': { src: 'name="$1"\n[ -z "$name" ] && ls projects || cat "projects/$name.md"', run: ([name]) => {
    if (!name) return { text: `Projects (${projects.length}):\n\n${projectList()}\n\nRun ./projects.sh <name> for details, e.g. ./projects.sh drip` };
    const p = projects.find(x => x.slug === name.toLowerCase().replace(/\.md$/, ''));
    if (!p) return { text: `projects.sh: no project named "${name.slice(0, 40)}"\n\n${projectList()}` };
    return { text: projectDoc(p), action: { type: 'project', slug: p.slug } };
  } },
  'experience.sh': { src: 'cat ~/.experience', run: () => ({ text: [
    `${experience.role} @ ${experience.company}`, experience.period, '',
    ...projects.filter(p => p.context.startsWith('RABBITT')).map(p => `  • ${p.name} — ${p.description}`), '',
    `${education.degree}`, `${education.school} · CGPA ${education.cgpa} · ${education.year}`,
  ].join('\n') }) },
  'skills.sh': { src: 'cat ~/.skills', run: () => ({ text: skillGroups.map(g => `${g.name.toUpperCase()}\n  ${g.items}`).join('\n\n') }) },
  'contact.sh': { src: 'echo "$EMAIL"', run: () => ({ text: "Build something interesting? Let's talk.", links: [{ label: person.email, href: `mailto:${person.email}` }, { label: 'GitHub', href: person.github }, { label: 'LinkedIn', href: person.linkedin }] }) },
};

const files: Record<string, string> = {
  [`${DESKTOP}/about.txt`]: [
    `${person.name} — ${person.role}`, person.location, '', person.summary, '',
    `Now:       ${experience.role} @ ${experience.company} (${experience.period})`,
    `Education: ${education.degree}, ${education.school}, CGPA ${education.cgpa}`, '',
    'Try running the .sh files on the desktop, or type `help` in the terminal.',
  ].join('\n'),
  [`${DESKTOP}/resume.pdf`]: '%PDF-1.4 (binary) — use: open resume.pdf',
  ...Object.fromEntries(Object.entries(scripts).map(([n, s]) => [`${DESKTOP}/${n}`, `#!/usr/bin/env bash\n${s.src}`])),
  ...Object.fromEntries(projects.map(p => [`${PROJECTS}/${p.slug}.md`, projectDoc(p)])),
};

const dirs: Record<string, string[]> = {
  [HOME]: ['Desktop'],
  [DESKTOP]: ['about.txt', 'resume.pdf', 'projects', ...Object.keys(scripts)],
  [PROJECTS]: projects.map(p => `${p.slug}.md`),
};

export const listDir = (path: string) => dirs[path] ?? [];
export const isDir = (path: string) => path in dirs;
export const readFile = (path: string) => files[path];

export function resolvePath(cwd: string, p = ''): string {
  const parts = (p.startsWith('~') ? p : `${cwd}/${p}`).split('/');
  const out: string[] = [];
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') { if (out.length > 1) out.pop(); continue; }
    out.push(part);
  }
  return out.join('/') || HOME;
}

/** What a desktop/file-manager double-click on `path` does, expressed as a shell command or action. */
export function openPath(path: string): TerminalResult {
  const name = path.split('/').pop()!;
  if (isDir(path)) return { text: '', action: { type: 'files', path } };
  if (name.endsWith('.pdf')) return { text: '', action: { type: 'browser', url: `/${name}` } };
  if (name.endsWith('.sh')) return runCommand(`./${name}`, path.slice(0, path.lastIndexOf('/')));
  if (path.startsWith(PROJECTS + '/')) return { text: '', action: { type: 'project', slug: name.replace(/\.md$/, '') } };
  if (path in files) return { text: '', action: { type: 'editor', path } };
  return { text: `open: ${name}: No such file` };
}

const tux = String.raw`
    .--.
   |o_o |
   |:_/ |
  //   \ \
 (|     | )
/'\_   _/'\
\___)=(___/`;

const help = `Available commands:
  ls [dir]          list files            cat <file>     print a file
  cd <dir>          change directory      pwd            print directory
  ./<script>.sh     run a script          open <file>    open with default app
  whoami            who is this           neofetch       system info
  clear             clear screen          help           this message

Scripts on the desktop: ${Object.keys(scripts).join('  ')}`;

export function runCommand(input: string, cwd = DESKTOP): TerminalResult {
  const raw = input.trim().slice(0, 200);
  const [cmd = '', ...args] = raw.split(/\s+/);
  const command = cmd.toLowerCase();

  const scriptPath = command === 'bash' || command === 'sh' ? args.shift() : command.endsWith('.sh') ? cmd : undefined;
  if (scriptPath !== undefined) {
    if (!scriptPath) return { text: `${command}: missing script name` };
    const path = resolvePath(cwd, scriptPath);
    const script = scripts[path.slice(DESKTOP.length + 1)];
    if (!script || !path.startsWith(DESKTOP + '/')) return { text: `bash: ${scriptPath.slice(0, 60)}: No such file or directory` };
    return script.run(args);
  }

  switch (command) {
    case '': return { text: '' };
    case 'help': return { text: help };
    case 'clear': return { text: '', clear: true };
    case 'pwd': return { text: cwd.replace('~', '/home/parampreet') };
    case 'whoami': return { text: `${person.name} — ${person.role}\n${person.summary}` };
    case 'date': return { text: new Date().toString() };
    case 'uname': return { text: 'Linux portfolio 6.8.0-parampreet x86_64 GNU/Linux' };
    case 'echo': return { text: args.join(' ') };
    case 'exit': return { text: 'logout — nice try, the portfolio stays open :)' };
    case 'sudo': return { text: 'parampreet is not in the sudoers file. This incident will be reported.' };
    case 'rm': return { text: 'rm: permission denied — this portfolio is read-only' };
    case 'neofetch': {
      const info = ['parampreet@portfolio', '--------------------', 'OS:      PortfolioOS (Linux x86_64)', `Role:    ${person.role}`, `Work:    ${experience.company}`, `Edu:     ${education.school.split(',')[0]} · CGPA ${education.cgpa}`, 'Shell:   bash 5.2', 'Stack:   TypeScript · Node.js · Next.js · AWS', `Contact: ${person.email}`];
      const art = tux.split('\n').slice(1);
      return { text: info.map((line, i) => `${(art[i] ?? '').padEnd(14)}${line}`).join('\n') };
    }
    case 'ls': case 'll': case 'dir': {
      const path = resolvePath(cwd, args.find(a => !a.startsWith('-')));
      if (readFile(path)) return { text: path.split('/').pop()! };
      if (!isDir(path)) return { text: `ls: cannot access '${args.join(' ').slice(0, 60)}': No such file or directory` };
      return { text: listDir(path).map(n => (isDir(`${path}/${n}`) ? `${n}/` : n)).join('  ') };
    }
    case 'cd': {
      const path = resolvePath(cwd, args[0] ?? DESKTOP);
      return isDir(path) ? { text: '', cwd: path } : { text: `cd: ${(args[0] ?? '').slice(0, 60)}: No such directory` };
    }
    case 'cat': case 'less': case 'more': {
      if (!args[0]) return { text: `${command}: missing file operand` };
      const path = resolvePath(cwd, args[0]);
      if (isDir(path)) return { text: `${command}: ${args[0].slice(0, 60)}: Is a directory` };
      const content = readFile(path);
      return content === undefined ? { text: `${command}: ${args[0].slice(0, 60)}: No such file or directory` } : { text: content };
    }
    case 'open': case 'xdg-open': {
      if (!args[0]) return { text: `${command}: missing file operand` };
      if (/^https?:\/\//.test(args[0])) return { text: `Opening ${args[0]}`, action: { type: 'browser', url: args[0] } };
      const path = resolvePath(cwd, args[0]);
      return isDir(path) || readFile(path) ? openPath(path) : { text: `${command}: ${args[0].slice(0, 60)}: No such file` };
    }
    default: return { text: `${cmd.slice(0, 60)}: command not found\nType help for available commands.` };
  }
}
