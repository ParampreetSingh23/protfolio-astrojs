import { runCommand, openPath, listDir, isDir, readFile, resolvePath, type TerminalResult, type Action } from './terminal';
import { iconFor, ui } from './icons';
import { person, projects } from '../data/portfolio';
import { logos } from '../data/logos';

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const coarse = matchMedia('(pointer: coarse)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Tiny DOM builder. Strings become text nodes, so fetched data can never inject markup. */
function h(tag: string, attrs: Record<string, string> = {}, ...kids: (Node | string | null | undefined)[]) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  for (const k of kids) if (k != null) el.append(k);
  return el;
}
const svg = (markup: string) => { const s = h('span', { class: 'ico', 'aria-hidden': 'true' }); s.innerHTML = markup; return s; };

// Storage can throw (private mode, blocked site data); preferences are just conveniences.
const load = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const save = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };

/* ---------------- sound (synthesised, off by default) ---------------- */
let soundOn = load('os-sound') === 'on';
let audio: AudioContext | null = null;
const tones = { open: [520, 780], close: [620, 410], tick: [880], error: [190, 140] };
function sfx(kind: keyof typeof tones) {
  if (!soundOn) return;
  audio ??= new AudioContext();
  const a = audio;
  tones[kind].forEach((f, i) => {
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + i * 0.07;
    o.type = kind === 'error' ? 'square' : 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(kind === 'error' ? 0.03 : 0.07, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + 0.13);
  });
}
const soundBtn = $<HTMLButtonElement>('#sound-toggle');
function setSound(on: boolean) {
  soundOn = on; save('os-sound', on ? 'on' : 'off');
  soundBtn.innerHTML = on ? ui.Volume2 : ui.VolumeX;
  soundBtn.setAttribute('aria-pressed', String(on));
  soundBtn.title = soundBtn.ariaLabel = on ? 'Sound on' : 'Sound off';
  sfx('tick');
}
setSound(soundOn);
soundBtn.addEventListener('click', () => setSound(!soundOn));
$('#restart').addEventListener('click', () => location.reload());

/* ---------------- themes ---------------- */
const themes = ['aubergine', 'ocean', 'forest', 'graphite'];
const osEl = $('#os');
function setTheme(t: string) { osEl.dataset.theme = themes.includes(t) ? t : themes[0]; save('os-theme', osEl.dataset.theme); }
setTheme(load('os-theme') ?? themes[0]);

/* ---------------- boot ---------------- */
const bootLines = [
  'GNU GRUB  version 2.12', '', 'Booting `PortfolioOS (Linux 6.8.0-parampreet)`', '',
  '[    0.000000] Linux version 6.8.0-parampreet (gcc 13.2.0) #1 SMP PREEMPT_DYNAMIC',
  '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/portfolio ro quiet splash',
  '[    0.012345] x86/fpu: Supporting XSAVE feature 0x001: \'x87 floating point registers\'',
  '[    0.104210] Memory: 16384K/350+ DSA problems available',
  '[    0.231442] ACPI: Loading CGPA 9.44 tables',
  '[    0.402113] pci 0000:00:1f.0: [chitkara] B.Tech Computer Science',
  '[    0.811999] EXT4-fs (sda1): mounted filesystem ~/projects with ordered data mode',
  '[  OK  ] Started Journal Service.',
  '[  OK  ] Mounted /home/parampreet.',
  '[  OK  ] Started PostgreSQL + Redis cluster.',
  '[  OK  ] Started BullMQ worker (concurrency=per-company).',
  '[  OK  ] Started Docker Application Container Engine.',
  '[  OK  ] Reached target AWS (EC2, S3, RDS, ECS).',
  '[  OK  ] Started Node.js / Next.js / TypeScript runtime.',
  '[  OK  ] Started Rabbitt AI internship service.',
  '[  OK  ] Started Network Manager (github, linkedin).',
  '[  OK  ] Reached target Graphical Interface.',
  '', 'portfolio login: parampreet (automatic login)', 'Starting GNOME session…',
];

function boot(done: () => void) {
  const el = $('#boot'), log = $('#boot-log');
  let i = 0, finished = false, timer = 0;
  const finish = () => {
    if (finished) return; finished = true;
    clearTimeout(timer);
    removeEventListener('keydown', finish); el.removeEventListener('pointerdown', finish);
    el.classList.add('boot-out');
    setTimeout(() => el.remove(), 500);
    done();
  };
  const step = () => {
    if (i >= bootLines.length) { timer = window.setTimeout(finish, 450); return; }
    const line = bootLines[i++];
    const row = h('div', {}, line.startsWith('[  OK  ]') ? h('span', { class: 'ok' }, '[  OK  ]') : null, line.startsWith('[  OK  ]') ? line.slice(8) : line);
    log.append(row);
    timer = window.setTimeout(step, i < 4 ? 260 : 40 + Math.random() * 90);
  };
  if (reduced) return finish();
  addEventListener('keydown', finish); el.addEventListener('pointerdown', finish);
  step();
}

/* ---------------- window manager ---------------- */
interface Win { el: HTMLElement; body: HTMLElement; dock: HTMLButtonElement; }
const wins = new Map<string, Win>();
const layer = $('#windows');
const dock = $('#dock');
let z = 10, cascade = 0;

function focus(w: Win) {
  w.el.style.zIndex = String(++z);
  w.el.hidden = false;
  wins.forEach(o => { o.el.classList.toggle('focused', o === w); o.dock.classList.toggle('active', o === w); });
}

function openWindow(id: string, title: string, icon: string, size: [number, number], build: (body: HTMLElement, w: Win) => void): Win {
  const existing = wins.get(id);
  if (existing) { focus(existing); return existing; }
  const el = ($<HTMLTemplateElement>('#win-tpl').content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;
  el.setAttribute('aria-label', title);
  $('.win-title', el).append(svg(icon), title);
  const area = layer.getBoundingClientRect();
  const width = Math.min(size[0], area.width - 24), height = Math.min(size[1], area.height - 24);
  const off = (cascade++ % 6) * 28;
  Object.assign(el.style, { width: `${width}px`, height: `${height}px`, left: `${Math.max(12, (area.width - width) / 2 - 60 + off)}px`, top: `${Math.max(12, (area.height - height) / 2 - 40 + off)}px` });

  let btn = dock.querySelector<HTMLButtonElement>(`[data-app="${id}"]`);
  if (!btn) { btn = h('button', { 'data-app': id, title, 'aria-label': title, 'data-temp': '' }) as HTMLButtonElement; btn.append(svg(icon)); dock.append(btn); }
  btn.classList.add('running');
  const w: Win = { el, body: $('.win-body', el), dock: btn };
  wins.set(id, w);

  el.addEventListener('pointerdown', () => focus(w), true);
  el.querySelectorAll<HTMLButtonElement>('.win-ctrls button').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const act = b.dataset.act;
    if (act === 'close') { sfx('close'); el.remove(); wins.delete(id); btn!.classList.remove('running', 'active'); if (btn!.hasAttribute('data-temp')) btn!.remove(); }
    if (act === 'min') { el.hidden = true; btn!.classList.remove('active'); }
    if (act === 'max') el.classList.toggle('max');
  }));
  const bar = $('.win-bar', el);
  bar.addEventListener('dblclick', e => { if (!(e.target as Element).closest('button')) el.classList.toggle('max'); });
  bar.addEventListener('pointerdown', e => {
    if ((e.target as Element).closest('button') || el.classList.contains('max') || innerWidth < 720) return;
    const sx = e.clientX - el.offsetLeft, sy = e.clientY - el.offsetTop;
    bar.setPointerCapture(e.pointerId);
    el.classList.add('dragging');
    const move = (m: PointerEvent) => {
      const b = layer.getBoundingClientRect();
      el.style.left = `${Math.min(Math.max(m.clientX - sx, 80 - el.offsetWidth), b.width - 80)}px`;
      el.style.top = `${Math.min(Math.max(m.clientY - sy, 0), b.height - 40)}px`;
    };
    const up = () => { bar.removeEventListener('pointermove', move); el.classList.remove('dragging'); };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up, { once: true });
    bar.addEventListener('pointercancel', up, { once: true });
  });

  layer.append(el);
  sfx('open');
  build(w.body, w);
  focus(w);
  return w;
}

dock.addEventListener('click', e => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('button[data-app]');
  if (!btn) return;
  const id = btn.dataset.app!, w = wins.get(id);
  if (w && !w.el.hidden && w.el.classList.contains('focused')) { w.el.hidden = true; btn.classList.remove('active'); return; }
  if (w) return focus(w);
  if (id === 'terminal') openTerminal();
  else if (id === 'browser') openBrowser('about:home');
  else if (id === 'files') openFiles('~/Desktop');
  else if (id === 'about') openEditor('~/Desktop/about.txt');
  else if (id === 'project') openProject(projects[0].slug);
});

function act(action?: Action) {
  if (!action) return;
  if (action.type === 'browser') openBrowser(action.url);
  if (action.type === 'files') openFiles(action.path);
  if (action.type === 'editor') openEditor(action.path);
  if (action.type === 'project') openProject(action.slug);
}

/** Double-click on any file: scripts run visibly in the terminal, everything else opens its app. */
function launch(path: string) {
  if (path.endsWith('.sh')) return openTerminal().exec(`./${path.split('/').pop()}`);
  act(openPath(path).action);
}

/* ---------------- terminal ---------------- */
interface Term { exec(cmd: string): void; }
let term: Term | null = null;

function openTerminal(): Term {
  const existing = wins.get('terminal');
  if (existing && term) { focus(existing); return term; }
  let cwd = '~/Desktop';
  const history: string[] = [];
  let hi = 0;
  let out!: HTMLElement, input!: HTMLInputElement, promptEl!: HTMLElement;
  const prompt = () => [h('span', { class: 'p-user' }, 'parampreet@portfolio'), ':', h('span', { class: 'p-path' }, cwd), '$ '];

  const print = (r: TerminalResult) => {
    if (r.clear) { out.replaceChildren(); return; }
    if (r.text) out.append(h('pre', {}, r.text));
    if (r.links?.length) out.append(h('div', { class: 't-links' }, ...r.links.map(l => h('a', { href: l.href, target: '_blank', rel: 'noopener' }, `↗ ${l.label}`))));
  };
  const exec = (cmd: string) => {
    out.append(h('div', { class: 't-cmd' }, ...prompt(), cmd));
    if (cmd.trim()) { history.push(cmd); hi = history.length; }
    const r = runCommand(cmd, cwd);
    if (r.cwd) { cwd = r.cwd; promptEl.replaceChildren(...prompt()); }
    print(r);
    sfx(r.text.includes('command not found') || r.text.includes('No such') ? 'error' : 'tick');
    out.parentElement!.scrollTop = out.parentElement!.scrollHeight;
    act(r.action);
  };

  openWindow('terminal', 'Terminal — bash', ui.SquareTerminal, [760, 460], body => {
    body.classList.add('term');
    out = h('div', { class: 't-out' });
    promptEl = h('label', { for: 't-in', class: 't-prompt' }, ...prompt());
    input = h('input', { id: 't-in', class: 't-in', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Terminal input' }) as HTMLInputElement;
    const form = h('form', { class: 't-line' }, promptEl, input);
    body.append(out, form);
    body.addEventListener('click', () => { if (!getSelection()?.toString()) input.focus({ preventScroll: true }); });
    form.addEventListener('submit', e => { e.preventDefault(); const v = input.value; input.value = ''; exec(v); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && hi > 0) { input.value = history[--hi]; e.preventDefault(); }
      else if (e.key === 'ArrowDown') { hi = Math.min(hi + 1, history.length); input.value = history[hi] ?? ''; e.preventDefault(); }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const parts = input.value.split(' '), last = parts.pop()!;
        const dir = last.includes('/') ? last.slice(0, last.lastIndexOf('/') + 1) : '';
        const base = resolvePath(cwd, dir.replace(/^\.\//, '') || '.');
        const hits = listDir(base).filter(n => n.startsWith(last.slice(dir.length)));
        if (hits.length === 1) input.value = [...parts, dir + hits[0] + (isDir(`${base}/${hits[0]}`) ? '/' : '')].join(' ');
        else if (hits.length > 1) print({ text: hits.join('  ') });
      } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); out.replaceChildren(); }
    });
    const info = runCommand('neofetch').text;
    print({ text: innerWidth < 720 ? info.split('\n').map(l => l.slice(14)).filter(Boolean).join('\n') : info }); // tux doesn't fit on phones
    print({ text: 'Welcome! Type help to see commands, or try:  ./github.sh   ./projects.sh   cat about.txt' });
  });
  term = { exec };
  if (!coarse) input.focus({ preventScroll: true });
  const w = wins.get('terminal')!;
  $('[data-act="close"]', w.el).addEventListener('click', () => { term = null; });
  return term;
}

/* ---------------- files ---------------- */
function openFiles(path: string) {
  const w = openWindow('files', 'Files', ui.Folder, [600, 400], () => {});
  w.body.className = 'win-body files';
  const crumbs = h('div', { class: 'f-path' }, path.replace('~', '/home/parampreet'));
  const grid = h('ul', { class: 'icons f-grid' });
  if (path !== '~/Desktop' && path !== '~') grid.append(fileButton('..', resolvePath(path, '..')));
  for (const name of listDir(path)) grid.append(fileButton(name, `${path}/${name}`));
  w.body.replaceChildren(crumbs, grid);
}

function fileButton(name: string, path: string) {
  const icon = h('span', { 'aria-hidden': 'true' }); icon.innerHTML = iconFor(name === '..' ? '' : name);
  const b = h('button', { class: 'file-icon', 'data-path': path }, icon, h('span', { class: 'file-name' }, name));
  return h('li', {}, b);
}

/* ---------------- editor ---------------- */
function openEditor(path: string) {
  const name = path.split('/').pop()!;
  openWindow(`edit:${path}`, `${name} — Text Editor`, ui.FileText, [640, 460], body => {
    body.classList.add('editor');
    body.append(h('pre', { tabindex: '0' }, readFile(path) ?? ''));
  });
}

/* ---------------- project app ---------------- */
const plated = ['aws', 'nextjs-icon', 'prisma', 'express', 'github-icon'];
function openProject(slug: string) {
  const i = projects.findIndex(p => p.slug === slug);
  if (i < 0) return;
  const p = projects[i], n = projects.length;
  const prev = projects[(i - 1 + n) % n], next = projects[(i + 1) % n];
  const w = openWindow('project', 'Projects', ui.Layers, [860, 620], body => {
    body.tabIndex = -1;
    body.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const cur = projects.findIndex(x => x.slug === body.dataset.slug);
      openProject(projects[(cur + (e.key === 'ArrowLeft' ? n - 1 : 1)) % n].slug);
    });
  });
  w.body.className = 'win-body proj';
  w.body.dataset.slug = slug;
  $('.win-title', w.el).lastChild!.textContent = `${p.name} — Projects`;
  const btn = (label: string, icon: string, fn: () => void, cls = '') => { const b = h('button', { class: `proj-btn ${cls}` }, svg(icon), label); b.addEventListener('click', fn); return b; };
  w.body.replaceChildren(
    h('header', { class: 'proj-hero' },
      h('span', { class: 'proj-eyebrow' }, `${p.type} · ${p.context}`), h('h2', {}, p.name), h('p', {}, p.description),
      h('div', { class: 'proj-actions' },
        p.live ? btn('Live demo', ui.Play, () => openBrowser(p.live!), 'primary') : null,
        p.repo ? h('a', { class: 'proj-btn', href: p.repo, target: '_blank', rel: 'noopener' }, svg(ui.FolderGit2), 'Source ↗') : null,
        btn('Case study', ui.FileText, () => openBrowser(`/projects/${p.slug}/`)),
        btn('Open in terminal', ui.SquareTerminal, () => openTerminal().exec(`cat ~/Desktop/projects/${p.slug}.md`)))),
    h('section', {}, h('h3', {}, 'How it flows'),
      h('ol', { class: 'flow' }, ...p.flow.map((step, k) => h('li', { style: `--i:${k}` }, h('span', { class: 'flow-n' }, String(k + 1).padStart(2, '0')), step)))),
    h('section', {}, h('h3', {}, 'Highlights'), h('ul', { class: 'proj-points' }, ...p.points.map(x => h('li', {}, x)))),
    h('section', {}, h('h3', {}, 'Stack'),
      h('ul', { class: 'chips' }, ...p.stack.map(t => {
        const f = logos[t];
        return h('li', {}, f ? h('img', { src: `/logos/${f}.svg`, alt: '', width: '16', height: '16', ...(plated.includes(f) ? { class: 'plate' } : {}) }) : null, t);
      }))),
    h('nav', { class: 'proj-nav', 'aria-label': 'Other projects' },
      btn(prev.name, ui.ChevronLeft, () => openProject(prev.slug)),
      h('span', { class: 'proj-count' }, `${i + 1} / ${n}  ·  ← → keys`),
      btn(next.name, ui.ChevronRight, () => openProject(next.slug), 'rev')),
  );
  w.body.scrollTop = 0;
}

/* ---------------- browser ---------------- */
const gh = new Map<string, Promise<[any, any[]]>>();
function fetchGitHub(user: string) {
  if (!gh.has(user)) gh.set(user, Promise.all([
    fetch(`https://api.github.com/users/${user}`).then(r => { if (!r.ok) throw r; return r.json(); }),
    fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=30`).then(r => { if (!r.ok) throw r; return r.json(); }),
  ]).catch(e => { gh.delete(user); throw e; }));
  return gh.get(user)!;
}

const langColor: Record<string, string> = { TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219', 'C++': '#f34b7d', HCL: '#844FBA', Astro: '#ff5a03', HTML: '#e34c26', CSS: '#663399', Shell: '#89e051', Go: '#00ADD8' };
function githubPage(user: string, page: HTMLElement) {
  page.append(h('p', { class: 'br-loading' }, `Loading github.com/${user}…`));
  fetchGitHub(user).then(([u, repos]) => {
    const own = repos.filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count || Date.parse(b.pushed_at) - Date.parse(a.pushed_at)).slice(0, 8);
    const avatar = h('img', { src: u.avatar_url, alt: '', width: '120', height: '120', class: 'gh-avatar' });
    const side = h('aside', { class: 'gh-side' }, avatar, h('h2', {}, u.name ?? u.login), h('p', { class: 'gh-login' }, u.login),
      u.bio ? h('p', {}, u.bio) : null,
      h('p', { class: 'gh-meta' }, svg(ui.Users), `${u.followers} followers · ${u.following} following`),
      u.location ? h('p', { class: 'gh-meta' }, svg(ui.MapPin), u.location) : null,
      h('a', { class: 'gh-follow', href: u.html_url, target: '_blank', rel: 'noopener' }, 'Follow on GitHub ↗'));
    const cards = own.map(r => h('a', { class: 'gh-repo', href: r.html_url, target: '_blank', rel: 'noopener' },
      h('strong', {}, r.name), h('p', {}, r.description ?? 'No description'),
      h('span', { class: 'gh-meta' }, r.language ? h('i', { class: 'gh-lang', style: `background:${langColor[r.language] ?? '#8b949e'}` }) : null, r.language ?? '', svg(ui.Star), String(r.stargazers_count), svg(ui.GitFork), String(r.forks_count))));
    page.replaceChildren(h('div', { class: 'gh' }, side, h('section', {}, h('h3', {}, `Repositories (${u.public_repos})`), h('div', { class: 'gh-grid' }, ...cards))));
  }).catch(() => page.replaceChildren(h('div', { class: 'br-card' }, h('h2', {}, `github.com/${user}`), h('p', {}, 'GitHub API rate limit hit or offline. Open the profile directly:'), h('a', { class: 'gh-follow', href: `https://github.com/${user}`, target: '_blank', rel: 'noopener' }, 'Open GitHub ↗'))));
}

function linkedinPage(page: HTMLElement) {
  page.append(h('div', { class: 'br-card li' },
    h('div', { class: 'li-banner' }), h('img', { src: '/images/profile/parampreet-cutout.png', alt: '', class: 'li-photo', width: '96', height: '96' }),
    h('h2', {}, person.name), h('p', {}, `${person.role} · Rabbitt AI · Chitkara University`), h('p', { class: 'gh-meta' }, svg(ui.MapPin), person.location),
    h('p', { class: 'li-note' }, 'LinkedIn does not allow itself to be embedded inside other sites, so here is the short version.'),
    h('a', { class: 'gh-follow', href: person.linkedin, target: '_blank', rel: 'noopener' }, 'Connect on LinkedIn ↗')));
}

function homePage(page: HTMLElement, go: (u: string) => void) {
  const links: [string, string][] = [['GitHub', person.github], ['LinkedIn', person.linkedin], ['Resume', '/resume.pdf'], ['CampusBarter (live)', 'https://campusbarter.onrender.com']];
  page.append(h('div', { class: 'br-home' }, h('h2', {}, 'parampreet.dev'), h('p', {}, 'Bookmarks'),
    h('div', { class: 'br-marks' }, ...links.map(([label, url]) => { const b = h('button', {}, label); b.addEventListener('click', () => go(url)); return b; }))));
}

let browserGo: ((url: string) => void) | null = null;
function openBrowser(url: string) {
  if (wins.has('browser') && browserGo) { focus(wins.get('browser')!); return browserGo(url); }
  const stack: string[] = []; let pos = -1;
  openWindow('browser', 'Browser', ui.Globe, [980, 640], (body, w) => {
    body.classList.add('browser');
    body.append($<HTMLTemplateElement>('#browser-tpl').content.cloneNode(true));
    const page = $('.br-page', body), bar = $<HTMLInputElement>('.br-url input', body), ext = $<HTMLAnchorElement>('.br-ext', body);
    const title = $('.win-title', w.el);
    const render = () => {
      const u = stack[pos];
      bar.value = u.replace(/^https?:\/\//, '');
      ext.href = u.startsWith('about:') ? person.site : u;
      title.lastChild!.textContent = `${bar.value} — Browser`;
      page.replaceChildren();
      const ghMatch = u.match(/^https?:\/\/(?:www\.)?github\.com\/([\w-]+)\/?$/i);
      if (u === 'about:home') homePage(page, go);
      else if (ghMatch) githubPage(ghMatch[1], page);
      else if (/linkedin\.com/i.test(u)) linkedinPage(page);
      else if (u.endsWith('.pdf') && !navigator.pdfViewerEnabled) page.append(h('div', { class: 'br-card' }, h('h2', {}, u.split('/').pop()!), h('p', {}, 'This browser cannot show PDFs inline.'), h('a', { class: 'gh-follow', href: u, target: '_blank', rel: 'noopener' }, 'Open PDF ↗')));
      // Chrome refuses PDFs in sandboxed frames, so only third-party pages get the sandbox.
      else page.append(h('iframe', { src: u, title: bar.value, ...(u.startsWith('/') ? {} : { sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups', referrerpolicy: 'no-referrer' }) }));
    };
    const go = (u: string) => { stack.splice(pos + 1); stack.push(u); pos = stack.length - 1; render(); };
    browserGo = go;
    body.querySelector('[data-nav="back"]')!.addEventListener('click', () => { if (pos > 0) { pos--; render(); } });
    body.querySelector('[data-nav="fwd"]')!.addEventListener('click', () => { if (pos < stack.length - 1) { pos++; render(); } });
    body.querySelector('[data-nav="reload"]')!.addEventListener('click', render);
    $('.br-url', body).addEventListener('submit', e => {
      e.preventDefault();
      const v = bar.value.trim();
      if (v) go(v.startsWith('/') || v.startsWith('about:') ? v : /^https?:\/\//.test(v) ? v : `https://${v}`);
    });
    $('[data-act="close"]', w.el).addEventListener('click', () => { browserGo = null; });
    go(url);
  });
}

/* ---------------- context menu ---------------- */
type Item = [label: string, icon: string, run: () => void] | 'sep' | HTMLElement;
let menu: HTMLElement | null = null;
const closeMenu = () => { menu?.remove(); menu = null; };

function showMenu(x: number, y: number, items: Item[]) {
  closeMenu();
  const m = h('div', { class: 'ctx', role: 'menu' });
  for (const it of items) {
    if (it === 'sep') m.append(h('hr'));
    else if (it instanceof HTMLElement) m.append(it);
    else {
      const b = h('button', { role: 'menuitem' }, svg(it[1]), it[0]);
      b.addEventListener('click', () => { closeMenu(); sfx('tick'); it[2](); });
      m.append(b);
    }
  }
  osEl.append(m);
  const r = m.getBoundingClientRect();
  m.style.left = `${Math.max(4, Math.min(x, innerWidth - r.width - 6))}px`;
  m.style.top = `${Math.max(4, Math.min(y, innerHeight - r.height - 6))}px`;
  m.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
  menu = m;
}

function desktopMenu(): Item[] {
  const swatches = h('div', { class: 'ctx-themes' }, h('span', {}, svg(ui.Palette), 'Wallpaper'),
    h('div', {}, ...themes.map(t => {
      const b = h('button', { 'data-theme': t, 'aria-label': `${t} wallpaper`, title: t, ...(osEl.dataset.theme === t ? { 'aria-current': 'true' } : {}) });
      b.addEventListener('click', () => { setTheme(t); sfx('tick'); closeMenu(); });
      return b;
    })));
  return [
    ['Open Terminal', ui.SquareTerminal, () => openTerminal()],
    ['Open Files', ui.Folder, () => openFiles('~/Desktop')],
    ['Browse projects', ui.Layers, () => openProject(projects[0].slug)],
    'sep', swatches, 'sep',
    [soundOn ? 'Mute sounds' : 'Turn sounds on', soundOn ? ui.VolumeX : ui.Volume2, () => setSound(!soundOn)],
    ['About this computer', ui.Info, () => openTerminal().exec('neofetch')],
    ['Restart', ui.RefreshCw, () => location.reload()],
  ];
}

function fileMenu(path: string): Item[] {
  const name = path.split('/').pop()!;
  const items: Item[] = [[name.endsWith('.sh') ? 'Run' : 'Open', name.endsWith('.sh') ? ui.Play : ui.ExternalLink, () => launch(path)]];
  if (isDir(path)) items.push(['Open in Terminal', ui.SquareTerminal, () => { const t = openTerminal(); t.exec(`cd ${path}`); t.exec('ls'); }]);
  else if (!name.endsWith('.pdf')) items.push([name.endsWith('.sh') ? 'View source' : 'Show in Terminal', ui.SquareTerminal, () => openTerminal().exec(`cat ${path}`)]);
  if (name.endsWith('.md')) items.push(['Open as plain text', ui.FileText, () => openEditor(path)]);
  return items;
}

document.addEventListener('contextmenu', e => {
  const t = e.target as Element;
  const icon = t.closest<HTMLElement>('.file-icon');
  if (!icon && (t.closest('.win') || !t.closest('.desktop'))) return; // windows keep the native menu
  e.preventDefault();
  icon?.classList.add('selected');
  showMenu(e.clientX, e.clientY, icon ? fileMenu(icon.dataset.path!) : desktopMenu());
});
document.addEventListener('pointerdown', e => { if (menu && !menu.contains(e.target as Node)) closeMenu(); }, true);
document.addEventListener('keydown', e => {
  if (!menu) return;
  if (e.key === 'Escape') return closeMenu();
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  e.preventDefault();
  const items = [...menu.querySelectorAll<HTMLElement>('button')];
  const k = items.indexOf(document.activeElement as HTMLElement);
  items[(k + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length]?.focus();
});
addEventListener('resize', closeMenu);

/* ---------------- desktop ---------------- */
document.addEventListener('click', e => {
  const icon = (e.target as Element).closest<HTMLButtonElement>('.file-icon');
  document.querySelectorAll('.file-icon.selected').forEach(x => x !== icon && x.classList.remove('selected'));
  if (!icon) return;
  icon.classList.add('selected');
  if (coarse || e.detail === 0) launch(icon.dataset.path!); // touch tap or keyboard Enter opens directly
});
document.addEventListener('dblclick', e => {
  const icon = (e.target as Element).closest<HTMLButtonElement>('.file-icon');
  if (icon && !coarse) launch(icon.dataset.path!);
});

const clock = $('#clock');
const tick = () => { clock.textContent = new Date().toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };
tick(); setInterval(tick, 15_000);

boot(() => { document.body.classList.add('booted'); openTerminal(); });
