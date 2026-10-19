import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const lenis = new Lenis({ anchors: true, duration: .85, smoothWheel: true });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const introDelay = document.querySelector<HTMLElement>('#intro')?.hidden === false ? 1.45 : 0;
    gsap.from('.hero-line', { clipPath: 'inset(0 0 100% 0)', y: 12, duration: .65, stagger: .1, delay: introDelay, ease: 'power2.out' });
    gsap.from('.hero-art', { x: 14, duration: .9, delay: introDelay, ease: 'power2.out' });
    gsap.from('.timeline-progress', { scaleY: 0, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 65%', end: 'bottom 65%', scrub: .5 } });
    document.querySelectorAll<HTMLElement>('.milestone').forEach(milestone => {
      ScrollTrigger.create({ trigger: milestone, start: 'top 65%', end: 'bottom 20%', toggleClass: 'is-active' });
      gsap.from(milestone.querySelector('.timeline-artifact'), { x: 12, duration: .45, scrollTrigger: { trigger: milestone, start: 'top 75%', once: true } });
    });
    document.querySelectorAll<HTMLElement>('[data-architecture]').forEach(diagram => {
      ScrollTrigger.create({ trigger: diagram, start: 'top bottom', end: 'bottom top', toggleClass: 'is-visible' });
      const paths = diagram.querySelectorAll<SVGPathElement>('[data-draw]');
      const sequence = gsap.timeline({ scrollTrigger: { trigger: diagram, start: 'top 85%', end: 'bottom 60%', scrub: .6 } });
      paths.forEach(path => {
        const length = path.getTotalLength();
        sequence.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1 }, 0);
      });
      const nodes = diagram.querySelectorAll('[data-node]');
      if (nodes.length) sequence.from(nodes, { y: 8, stagger: .18, duration: .6 }, .15);
    });
    document.querySelectorAll<HTMLElement>('.loop-map .map-node').forEach((node,i) => {
      gsap.from(node, { x: 4, duration: .5, delay: i*.1, scrollTrigger: { trigger: '.loop', start: 'top 75%', once: true } });
    });
    gsap.from('.closing-map', { scale: 1.14, transformOrigin: 'center', scrollTrigger: { trigger: '.loop', start: 'top 90%', end: 'bottom 80%', scrub: .6 } });
    const detailsRefresh = () => requestAnimationFrame(() => { lenis.resize(); ScrollTrigger.refresh(); });
    document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', detailsRefresh));
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.querySelectorAll('details').forEach(detail => detail.removeEventListener('toggle', detailsRefresh));
      document.querySelectorAll('.milestone').forEach(m => m.classList.remove('is-active'));
    };
  });

  media.add('(min-width: 1024px) and (pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)', () => {
    const cursor = document.querySelector<HTMLElement>('#custom-cursor');
    if (!cursor) return;
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const cursorX = gsap.quickTo(cursor, 'x', { duration: .12 });
    const cursorY = gsap.quickTo(cursor, 'y', { duration: .12 });
    document.addEventListener('pointermove', e => {
      cursor.style.display = 'block';
      document.documentElement.classList.add('cursor-ready');
      cursorX(e.clientX);
      cursorY(e.clientY);
      const target = (e.target as Element).closest<HTMLElement>('[data-cursor]');
      const label = target?.dataset.cursor || '';
      cursor.textContent = label;
      cursor.classList.toggle('cursor-label', !!label);
    }, options);
    document.addEventListener('pointerleave', () => {
      cursor.style.display = 'none';
      document.documentElement.classList.remove('cursor-ready');
    }, options);
    document.querySelectorAll<HTMLElement>('[data-system-map]').forEach(map => {
      const svg = map.querySelector('svg');
      const moveX = gsap.quickTo(svg, 'x', { duration: .6 });
      const moveY = gsap.quickTo(svg, 'y', { duration: .6 });
      const nodes = map.querySelectorAll('.map-node');
      const drift = gsap.to(nodes, { y: 'random(-3,3)', duration: 3, stagger: .2, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
      ScrollTrigger.create({ trigger: map, start: 'top bottom', end: 'bottom top', onToggle: self => self.isActive ? drift.play() : drift.pause() });
      map.addEventListener('pointermove', e => {
        const bounds = map.getBoundingClientRect();
        moveX(((e.clientX-bounds.left)/bounds.width-.5)*7);
        moveY(((e.clientY-bounds.top)/bounds.height-.5)*7);
      }, options);
      map.addEventListener('pointerleave', () => { moveX(0); moveY(0); }, options);
    });
    document.querySelectorAll<HTMLElement>('[data-photo]').forEach(photo => {
      gsap.to(photo, { y: -14, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: .7 } });
    });
    document.querySelectorAll<HTMLElement>('.magnetic').forEach(button => {
      const moveX = gsap.quickTo(button, 'x', { duration: .3 });
      const moveY = gsap.quickTo(button, 'y', { duration: .3 });
      button.addEventListener('pointermove', e => {
        const bounds = button.getBoundingClientRect();
        moveX((e.clientX-bounds.left-bounds.width/2)*.06);
        moveY((e.clientY-bounds.top-bounds.height/2)*.08);
      }, options);
      button.addEventListener('pointerleave', () => { moveX(0); moveY(0); }, options);
    });
    return () => {
      controller.abort();
      cursor.style.display = 'none';
      document.documentElement.classList.remove('cursor-ready');
    };
  });
  window.addEventListener('pagehide', () => media.revert(), { once: true });
}
