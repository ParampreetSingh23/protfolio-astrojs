import { runCommand } from './terminal';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const intro = document.querySelector<HTMLElement>('#intro');
// Content is always visible by default, even if motion code or external assets fail.
if (intro && !reduced.matches && !window.location.hash) {
  try {
    if (!sessionStorage.getItem('notebook-visited')) {
      sessionStorage.setItem('notebook-visited', 'yes');
      intro.hidden = false;
      window.setTimeout(() => { intro.hidden = true; }, 1750);
    }
  } catch { /* Storage may be unavailable; skip the intro. */ }
}

const form = document.querySelector<HTMLFormElement>('#terminal-form');
const input = document.querySelector<HTMLInputElement>('#terminal-input');
const output = document.querySelector<HTMLElement>('#terminal-output');
const history: string[] = [];
let historyIndex = 0;
form?.addEventListener('submit', e => {
  e.preventDefault();
  if (!input || !output) return;
  const command = input.value.trim().slice(0, 120);
  if (!command) return;
  const result = runCommand(command);
  history.push(command);
  if (history.length > 50) history.shift();
  historyIndex = history.length;
  input.value = '';
  if (result.clear) { output.replaceChildren(); return; }
  const entry = document.createElement('div');
  entry.className = 'terminal-entry';
  const prompt = document.createElement('strong');
  prompt.textContent = `$ ${command}`;
  const body = document.createElement('div');
  body.textContent = result.text;
  entry.append(prompt, body);
  result.links?.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    if (link.href.startsWith('https://')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    entry.append(a, document.createElement('br'));
  });
  output.append(entry);
  if (output.children.length > 40) output.firstElementChild?.remove();
  output.scrollTop = output.scrollHeight;
});
input?.addEventListener('keydown', e => {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
  e.preventDefault();
  historyIndex = Math.max(0, Math.min(history.length, historyIndex + (e.key === 'ArrowUp' ? -1 : 1)));
  input.value = history[historyIndex] || '';
});

const jobButton = document.querySelector<HTMLButtonElement>('#replay-job');
const jobState = document.querySelector<HTMLElement>('#job-state');
const jobLogs = document.querySelector<HTMLElement>('#job-logs');
const jobSteps = document.querySelectorAll<HTMLElement>('[data-job-step]');
let timers: number[] = [];
function cancelDemos() {
  timers.forEach(clearTimeout);
  timers = [];
  if (jobButton?.disabled) { jobButton.disabled = false; jobButton.textContent = 'REPLAY DEMO'; }
  if (scanButton?.disabled) { scanButton.disabled = false; scanButton.textContent = 'SCAN DEMO'; }
}
const logLines = ['[12:42:08] job created','[12:42:09] validation passed; approval recorded','[12:42:11] worker started','[12:42:19] infrastructure ready','[12:42:23] deployment verified'];
function setJobStage(index: number) {
  if (!jobState || !jobLogs) return;
  jobState.textContent = ['QUEUED','APPROVED','RUNNING','VERIFYING','DEPLOYED'][index];
  jobSteps.forEach((step,i) => step.classList.toggle('active', i <= index));
  jobLogs.textContent = logLines.slice(0,index+1).join('\n');
}
jobButton?.addEventListener('click', () => {
  if (jobButton.disabled) return;
  jobButton.disabled = true;
  if (reduced.matches) { setJobStage(4); jobButton.disabled = false; jobButton.textContent = 'REPLAY DEMO'; return; }
  setJobStage(0);
  for (let i = 1; i < 5; i++) timers.push(window.setTimeout(() => {
    setJobStage(i);
    if (i === 4) { jobButton.disabled = false; jobButton.textContent = 'REPLAY DEMO'; }
  }, i * 850));
});
const scanButton = document.querySelector<HTMLButtonElement>('#scan-repo');
const scanSteps = document.querySelectorAll<HTMLElement>('[data-scan-step]');
const scanStatus = document.querySelector<HTMLElement>('#scan-status');
scanButton?.addEventListener('click', () => {
  if (scanButton.disabled) return;
  scanButton.disabled = true;
  scanSteps.forEach(step => step.classList.remove('active'));
  if (scanStatus) scanStatus.textContent = 'Demo scan in progress. No repository is accessed.';
  function reveal(index: number) {
    scanSteps[index]?.classList.add('active');
    if (index === scanSteps.length-1) {
      scanButton!.disabled = false;
      scanButton!.textContent = 'REPLAY SCAN';
      if (scanStatus) scanStatus.textContent = 'Demo flow verified. No cloud resources were created.';
    }
  }
  scanSteps.forEach((_,i) => {
    if (reduced.matches) reveal(i);
    else timers.push(window.setTimeout(() => reveal(i), i*350));
  });
});
reduced.addEventListener('change', () => {
  if (intro) intro.hidden = true;
  cancelDemos();
  // A preference change completes visual demos without leaving partial states.
  setJobStage(4);
  scanSteps.forEach(step => step.classList.add('active'));
});
window.addEventListener('pagehide', cancelDemos);

let motionLoaded = false;
function loadMotion() {
  if (motionLoaded || reduced.matches) return;
  motionLoaded = true;
  import('./motion').then(m => m.initMotion()).catch(() => { motionLoaded = false; });
}
if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(loadMotion, { timeout: 1800 });
else window.setTimeout(loadMotion, 150);
reduced.addEventListener('change', loadMotion);
