const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
const toggle = document.querySelector<HTMLButtonElement>('#menu-toggle');
function closeMenu() {
  menu?.close();
  toggle?.setAttribute('aria-expanded', 'false');
}
toggle?.addEventListener('click', () => {
  menu?.showModal();
  toggle.setAttribute('aria-expanded', 'true');
});
document.querySelector('#menu-close')?.addEventListener('click', closeMenu);
menu?.addEventListener('close', () => toggle?.setAttribute('aria-expanded', 'false'));
menu?.addEventListener('cancel', () => toggle?.setAttribute('aria-expanded', 'false'));
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

const header = document.querySelector<HTMLElement>('#site-header');
let previousY = window.scrollY;
let scheduled = false;
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if (Math.abs(y - previousY) > 8) {
      header?.classList.toggle('nav-hidden', y > previousY && y > 350);
      previousY = y;
    }
    scheduled = false;
  });
}, { passive: true });

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.desktop-nav a').forEach(link => {
      if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -65% 0px' });
['work', 'lab', 'about', 'contact'].forEach(id => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

export {};
