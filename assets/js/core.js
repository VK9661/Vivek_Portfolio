/* =====================================================================
   VIVEK KUMAR — v4 core: shared by every page
   chrome (top bar, menu, contact + footer), smooth scroll, cursor, logo,
   reveals, page transitions, WebGL hover preview
   ===================================================================== */
import * as THREE from 'three';

export const RM = document.documentElement.classList.contains('rm');
export const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
export const S = '';
export const A = S + 'assets/';
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const cover = id => A + 'img/covers/' + id + '.webp';
export const asset = p => S + p;
export const projects = () => (window.PROJECTS || []);
export const projectUrl = id => 'project-' + encodeURIComponent(id) + '.html';
export const pad = n => String(n).padStart(2, '0');
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const CATS = { ux: 'UI/UX', brand: 'Brand', graphic: 'Graphic', motion: 'Motion' };
const C = window.CONTACT || { email: 'vivekgupta9661@gmail.com', behance: 'https://www.behance.net/vivekgupta143', book: 'https://www.behance.net/gallery/257604137/Viveks-Portfolio-2026-Brand-UIUX-Motion', linkedin: 'https://www.linkedin.com/in/vivek-kumar-9641312a8', instagram: 'https://www.instagram.com/16__vivek__' };
export const CONTACT = C;

const NAV = [['works', 'Works', 'works.html'], ['about', 'About', 'about.html'], ['services', 'Services', 'services.html'], ['contact', 'Contact', 'contact.html']];
const PAGES = { 'index.html': 'Home', 'works.html': 'Works', 'about.html': 'About', 'services.html': 'Services', 'contact.html': 'Contact', 'project.html': 'Project' };
const YEAR = new Date().getFullYear();
const roll = t => `<span class="r" data-r="${t}">${t}</span>`;

/* ---------------- chrome ---------------- */
export function chrome(page) {
  const top = $('.top');
  if (top) top.innerHTML = `
    <a class="logo" href="index.html"><span class="sr">Vivek Kumar, home</span><span class="lg-t" aria-hidden="true">Vivek Kumar</span><sup aria-hidden="true"><i class="lg-c">©</i>${String(YEAR).slice(2)}</sup></a>
    <nav class="links" aria-label="Main">${NAV.map(([k, t, h]) => `<a href="${h}" class="ul"${k === page ? ' aria-current="page"' : ''}>${roll(t)}</a>`).join('')}</nav>
    <p class="status mono"><i></i>Available for projects</p>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="r" data-r="Menu">Menu</span></button>`;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="menu" id="menu" hidden>
      <nav aria-label="Mobile">${[['home', 'Home', 'index.html'], ...NAV].map(([k, t, h], i) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}><span class="mono">${pad(i + 1)}</span>${t}</a>`).join('')}</nav>
      <div class="menu-foot"><a href="mailto:${C.email}">${C.email}</a><p class="mono">Open to full-time roles and freelance projects</p></div>
    </div>
    <div class="pt" aria-hidden="true"><div class="pt-bars"><i></i><i></i><i></i><i></i><i></i></div><div class="pt-lbl"><span class="pt-no mono"></span><span class="pt-t"></span></div></div>`);

  const foot = $('[data-foot]');
  if (foot) foot.outerHTML = `
  <section class="contact" id="contact-block"${page === 'contact' ? '' : ' aria-labelledby="ct"'}>
    ${page === 'contact' ? '' : `
    <div class="marq" aria-hidden="true"><div class="mq-row"><span>Let's work together</span><i></i><span>Let's work together</span><i></i><span>Let's work together</span><i></i><span>Let's work together</span><i></i></div></div>
    <h2 id="ct" class="sr">Contact</h2>
    <div class="ct-main">
      <p class="mono label">( Got a role, a project or a question? )</p>
      <a class="mail" href="mailto:${C.email}" data-cursor="Write"><span class="mail-t">${C.email}</span><span class="mail-arr" aria-hidden="true">→</span></a>
    </div>`}
    <footer class="foot"${page === 'contact' ? ' role="contentinfo"' : ''}>
      <div class="f-cols">
        <div><p class="mono label">Elsewhere</p><a class="ul" href="${C.behance}" target="_blank" rel="noopener">Behance</a><a class="ul" href="${C.book}" target="_blank" rel="noopener">Portfolio book</a><a class="ul" href="${C.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a class="ul" href="${C.instagram}" target="_blank" rel="noopener">Instagram</a></div>
        <div><p class="mono label">Pages</p>${[['Home', 'index.html'], ...NAV.map(n => [n[1], n[2]])].map(([t, h]) => `<a class="ul" href="${h}">${t}</a>`).join('')}</div>
        <div class="f-r"><p class="mono">© ${YEAR} Vivek Kumar</p><p class="mono">Graphic · UI/UX · Motion · Video</p><a class="ul mono to-top" href="#top">Back to top ↑</a></div>
      </div>
      <p class="f-name" aria-hidden="true">Vivek Kumar</p>
    </footer>
  </section>`;

  // mobile menu
  const btn = $('.menu-btn'), menu = $('#menu');
  btn?.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true', r = btn.querySelector('.r');
    btn.setAttribute('aria-expanded', open); r.dataset.r = r.textContent = open ? 'Close' : 'Menu';
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false; window.__lenis?.stop();
      if (window.gsap && !RM) { gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'expo.inOut' }); gsap.from($$('.menu nav a'), { yPercent: 60, autoAlpha: 0, duration: .8, ease: 'expo.out', stagger: .05, delay: .3 }); }
    } else {
      const done = () => { menu.hidden = true; }; window.__lenis?.start();
      window.gsap && !RM ? gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .6, ease: 'expo.inOut', onComplete: done }) : done();
      btn.focus();
    }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && btn?.getAttribute('aria-expanded') === 'true') btn.click(); });
}

/* ---------------- boot: engines shared by all pages ---------------- */
export function boot() {
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  if (RM || !window.gsap) { $('.pt')?.remove(); return { mouse, lenis: null, arrived: Promise.resolve() }; }

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  if (window.Flip) gsap.registerPlugin(Flip);
  CustomEase.create('ease', '.65,.05,0,1');
  CustomEase.create('out', '.16,1,.3,1');

  /* smooth scroll; a new page always opens at its top */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);
  const lenis = new Lenis({ lerp: 0.08 });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = id === '#top' ? 0 : $(id); if (t === null) return;
    e.preventDefault(); lenis.scrollTo(t, { duration: 1.8, easing: x => 1 - Math.pow(1 - x, 4) });
  });
  const top = $('.top');
  lenis.on('scroll', l => top?.classList.toggle('hide', l.direction === 1 && l.scroll > 300 && !document.documentElement.classList.contains('menu-open')));

  /* cursor */
  if (FINE) {
    const cur = $('.cursor'), lbl = $('.c-lbl');
    const cx = gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3' });
    addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); });
    document.addEventListener('pointerover', e => {
      const c = e.target.closest('[data-cursor]'), l = e.target.closest('a,button,input,textarea,label');
      cur.classList.toggle('big', !!c); lbl.textContent = c ? c.dataset.cursor : '';
      cur.classList.toggle('link', !c && !!l);
    });
  }

  /* logo: letters roll in a wave, the copyright mark spins; on hover and on its own */
  (() => {
    const logo = $('.logo'), t = $('.lg-t'), c = $('.lg-c'); if (!logo) return;
    t.innerHTML = [...t.textContent].map(ch => { ch = ch === ' ' ? '&nbsp;' : ch; return `<span class="lg-ch"><span class="in"><span>${ch}</span><span>${ch}</span></span></span>`; }).join('');
    const ins = $$('.lg-ch .in', t);
    const to = (y, d = .55) => gsap.to(ins, { yPercent: y, duration: d, ease: 'ease', stagger: .03, overwrite: true });
    const spin = () => gsap.fromTo(c, { rotation: 0 }, { rotation: 360, duration: .9, ease: 'ease' });
    let hover = false;
    logo.addEventListener('pointerenter', () => { hover = true; to(-50); spin(); });
    logo.addEventListener('pointerleave', () => { hover = false; to(0); });
    const wave = () => { if (!hover && !document.hidden) { to(-50, .5); gsap.delayedCall(1.3, () => { if (!hover) to(0, .5); }); spin(); } gsap.delayedCall(6, wave); };
    gsap.delayedCall(5, wave);
  })();

  /* reveals: identical on every page */
  $$('.split').forEach(h => {
    const s = SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'sl' });
    gsap.from(s.lines, { yPercent: 105, duration: 1.2, ease: 'out', stagger: .08, scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
  $$('.label, .sec-note').forEach(l => { if (l.closest('[data-in]')) return; gsap.from(l, { autoAlpha: 0, y: 14, duration: .9, ease: 'out', scrollTrigger: { trigger: l, start: 'top 92%' } }); });
  $$('[data-up]').forEach(el => gsap.from(el.dataset.up ? $$(el.dataset.up, el) : el, { y: 40, autoAlpha: 0, duration: 1, ease: 'out', stagger: .07, scrollTrigger: { trigger: el, start: 'top 88%' } }));
  $$('[data-fill]').forEach(el => {
    const s = SplitText.create(el, { type: 'words', wordsClass: 'w', aria: 'none' });
    gsap.to(s.words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true } });
  });
  $$('[data-wipe]').forEach(el => {
    gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'ease', scrollTrigger: { trigger: el, start: 'top 85%' } });
    const img = $('img', el);
    if (img) gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('[data-par]').forEach(el => gsap.fromTo(el, { yPercent: -(+el.dataset.par || 8) }, { yPercent: +el.dataset.par || 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('[data-line]').forEach(el => gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.4, ease: 'ease', scrollTrigger: { trigger: el, start: 'top 92%' } }));

  /* accordions (.cap) */
  $$('[data-acc]').forEach(list => {
    const items = $$('.cap', list), single = list.dataset.acc !== 'multi';
    const set = (c, open) => { c.classList.toggle('open', open); $('button', c).setAttribute('aria-expanded', open); gsap.to($('.cap-b', c), { height: open ? 'auto' : 0, duration: .8, ease: 'ease', onComplete: () => ScrollTrigger.refresh() }); };
    items.forEach((c, i) => {
      $('button', c).addEventListener('click', () => { const open = !c.classList.contains('open'); if (single) items.forEach(o => o !== c && o.classList.contains('open') && set(o, false)); set(c, open); });
      if (i === 0 && list.dataset.first !== 'closed') { c.classList.add('open'); $('button', c).setAttribute('aria-expanded', true); gsap.set($('.cap-b', c), { height: 'auto' }); }
    });
    gsap.from(items, { y: 40, autoAlpha: 0, duration: 1, ease: 'out', stagger: .07, scrollTrigger: { trigger: list, start: 'top 88%' } });
  });

  /* magnetic elements */
  if (FINE) $$('[data-mag]').forEach(el => {
    const s = +el.dataset.mag || .3, xt = gsap.quickTo(el, 'x', { duration: .6, ease: 'out' }), yt = gsap.quickTo(el, 'y', { duration: .6, ease: 'out' });
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); xt((e.clientX - r.left - r.width / 2) * s); yt((e.clientY - r.top - r.height / 2) * s); });
    el.addEventListener('pointerleave', () => { xt(0); yt(0); });
  });

  /* contact block + footer */
  const row = $('.mq-row');
  if (row) {
    const loop = gsap.fromTo(row, { xPercent: 0 }, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { const v = Math.abs(s.getVelocity()); gsap.to(loop, { timeScale: (1 + Math.min(v / 300, 5)) * s.direction, duration: .2, overwrite: true }); gsap.to(loop, { timeScale: s.direction, duration: 1.4, delay: .25 }); } });
    gsap.from('.mail', { y: 60, autoAlpha: 0, duration: 1.2, ease: 'out', scrollTrigger: { trigger: '.ct-main', start: 'top 85%' } });
  }
  if ($('.f-name')) gsap.from('.f-name', { yPercent: 40, autoAlpha: 0, duration: 1.4, ease: 'out', scrollTrigger: { trigger: '.foot', start: 'top 90%' } });

  /* page transitions: five shutters close, the next page's name rises, shutters open */
  const pt = $('.pt'), bars = $$('.pt-bars i'), ptT = $('.pt-t'), ptN = $('.pt-no');
  const keyOf = h => { const f = (h.split('/').pop() || 'index.html').split(/[?#]/)[0] || 'index.html'; return /^project-/.test(f) ? 'project.html' : f; };
  const setLbl = (k, id) => { const ks = Object.keys(PAGES), i = ks.indexOf(k), pr = id && projects().find(p => p.id === id); ptT.textContent = pr ? pr.title : (PAGES[k] || ''); ptN.textContent = i > -1 ? pad(i + 1) + ' / ' + pad(ks.length) : ''; };
  let arrive = Promise.resolve();
  const from = sessionStorage.getItem('vk-pt');
  if (from) {
    sessionStorage.removeItem('vk-pt'); setLbl(...from.split('|'));
    gsap.set(pt, { autoAlpha: 1 }); gsap.set(bars, { scaleY: 1, transformOrigin: '50% 0%' }); gsap.set('.pt-lbl > *', { yPercent: 0 });
    arrive = new Promise(r => gsap.timeline({ delay: .1, onComplete: () => gsap.set(pt, { autoAlpha: 0 }) })
      .to('.pt-lbl > *', { yPercent: -120, duration: .6, ease: 'ease', stagger: .05 })
      .to(bars, { scaleY: 0, duration: .9, ease: 'ease', stagger: { each: .06, from: 'start' } }, .25)
      .add(r, .55));
  } else gsap.set(pt, { autoAlpha: 0 });
  let leaving = false;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
    const h = a.getAttribute('href'); if (!h || h.startsWith('#') || /^(mailto|tel|https?):/.test(h) || !/\.html([?#]|$)/.test(h)) return;
    e.preventDefault(); if (leaving) return; leaving = true;
    const k = keyOf(h), id = (h.match(/[?&]id=([^&#]+)/) || h.match(/project-([^/?#]+)\.html/) || [])[1]; setLbl(k, id && decodeURIComponent(id)); sessionStorage.setItem('vk-pt', k + (id ? '|' + decodeURIComponent(id) : ''));
    if (document.documentElement.classList.contains('menu-open')) $('.menu-btn')?.click();
    gsap.set(pt, { autoAlpha: 1 }); gsap.set(bars, { transformOrigin: '50% 100%' });
    gsap.timeline({ onComplete: () => { location.href = h; } })
      .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: .75, ease: 'ease', stagger: { each: .06, from: 'end' } })
      .fromTo('.pt-lbl > *', { yPercent: 120 }, { yPercent: 0, duration: .6, ease: 'out', stagger: .05 }, .45)
      .to({}, { duration: .2 });
  });
  addEventListener('pageshow', ev => { if (ev.persisted) { leaving = false; gsap.set(pt, { autoAlpha: 0 }); } });

  /* page intro: title lines and [data-in] items rise once the shutters open */
  const intro = () => {
    const lines = $$('.pg-title .ln > span');
    gsap.timeline()
      .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'out', stagger: .08 })
      .fromTo($$('[data-in] > *'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'out', stagger: .06 }, .25);
  };
  if ($('.pg-title')) { gsap.set($$('.pg-title .ln > span'), { yPercent: 110 }); gsap.set($$('[data-in] > *'), { autoAlpha: 0 }); arrive.then(intro); }

  /* page titles: every letter gets an orange twin and rolls in a wave, like the logo.
     Each letter keeps the width it had in the set word, so kerning stays intact. */
  const h1 = $('.pg-title:not(.hello)');
  if (h1) Promise.all([document.fonts.ready, arrive]).then(() => {
    const words = $$('.ln > span', h1); if (!words.length) return;
    if (!$('.sr', h1)) { const sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = words.map(w => [...w.childNodes].map(n => n.textContent.trim()).filter(Boolean).join(' ')).join(' '); h1.prepend(sr); $$('.ln', h1).forEach(l => l.setAttribute('aria-hidden', 'true')); }
    words.forEach(w => {
      const fs = parseFloat(getComputedStyle(w).fontSize);
      [...w.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).forEach(n => {
        const t = n.textContent, r = document.createRange(), x = [];
        for (let i = 0; i < t.length; i++) { r.setStart(n, i); r.setEnd(n, i + 1); const b = r.getBoundingClientRect(); x.push([b.left, b.width]); }
        const html = [...t].map((ch, i) => {
          const adv = i < t.length - 1 ? x[i + 1][0] - x[i][0] : x[i][1];
          return `<span class="tc" style="width:${(adv / fs).toFixed(4)}em"><span class="in"><span>${esc(ch)}</span><span>${esc(ch)}</span></span></span>`;
        }).join('');
        const tmp = document.createElement('span'); tmp.innerHTML = html; n.replaceWith(...tmp.childNodes);
      });
    });
    const ins = $$('.tc .in', h1);
    const to = (y, d = .6) => gsap.to(ins, { yPercent: y, duration: d, ease: 'ease', stagger: .028, overwrite: true });
    let over = false;
    gsap.delayedCall(1.1, () => { if (!over) { to(-50); gsap.delayedCall(1.4, () => { if (!over) to(0); }); } });
    if (FINE) { h1.addEventListener('pointerenter', () => { over = true; to(-50); }); h1.addEventListener('pointerleave', () => { over = false; to(0); }); }
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
  return { mouse, lenis, arrived: arrive };
}

/* ---------------- WebGL hover preview: one plane follows the cursor ---------------- */
export function hoverPreview(mouse, anchors, imgOf) {
  if (!FINE || !anchors.length) return;
  const canvas = $('#fx'); if (!canvas) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  let cam;
  const size = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); cam = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -10, 10); };
  size(); addEventListener('resize', size);
  const loader = new THREE.TextureLoader(), cache = {};
  const tex = src => { if (!cache[src]) { cache[src] = loader.load(src); cache[src].colorSpace = THREE.SRGBColorSpace; } return cache[src]; };
  const U = { uTex: { value: null }, uVel: { value: new THREE.Vector2() }, uProg: { value: 0 }, uRatio: { value: new THREE.Vector2(1, 1) } };
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 32, 32), new THREE.ShaderMaterial({
    uniforms: U, transparent: true,
    vertexShader: `uniform vec2 uVel; varying vec2 vUv;
      void main(){ vUv = uv; vec3 p = position; p.x -= sin(uv.y * 3.14159) * uVel.x * .004; p.y += sin(uv.x * 3.14159) * uVel.y * .004;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,
    fragmentShader: `uniform sampler2D uTex; uniform vec2 uVel, uRatio; uniform float uProg; varying vec2 vUv;
      void main(){ vec2 uv = (vUv - .5) * uRatio + .5; uv = (uv - .5) * (1.15 - .15 * uProg) + .5; vec2 s = uVel * .0008;
        vec3 c = vec3(texture2D(uTex, uv + s).r, texture2D(uTex, uv).g, texture2D(uTex, uv - s).b);
        float edge = step(1. - uProg, 1. - abs(vUv.y - .5) * 2.); gl_FragColor = vec4(c, edge); }`
  }));
  const PW = Math.min(420, innerWidth * .28), PH = PW * .75;
  mesh.scale.set(PW, PH, 1); scene.add(mesh);
  const pos = { x: mouse.x, y: mouse.y }, last = { ...pos };
  let active = false;
  const setTex = src => { const t = tex(src); U.uTex.value = t; const fit = () => { const im = t.image, ar = im && im.width ? im.width / im.height : 4 / 3, pr = PW / PH; U.uRatio.value.set(ar > pr ? pr / ar : 1, ar > pr ? 1 : ar / pr); }; t.image ? fit() : (t.onUpdate = fit); };
  anchors.forEach(a => {
    a.addEventListener('pointerenter', () => { setTex(imgOf(a)); active = true; gsap.to(U.uProg, { value: 1, duration: .8, ease: 'out', overwrite: true }); });
    a.addEventListener('pointerleave', () => { active = false; gsap.to(U.uProg, { value: 0, duration: .5, ease: 'power2.in', overwrite: true }); });
  });
  gsap.ticker.add(() => {
    if (U.uProg.value < .001 && !active) { if (canvas.style.opacity !== '0') { renderer.clear(); canvas.style.opacity = '0'; } return; }
    canvas.style.opacity = '1';
    pos.x += (mouse.x - pos.x) * .14; pos.y += (mouse.y - pos.y) * .14;
    const vx = pos.x - last.x, vy = pos.y - last.y; last.x = pos.x; last.y = pos.y;
    U.uVel.value.x += (vx - U.uVel.value.x) * .2; U.uVel.value.y += (vy - U.uVel.value.y) * .2;
    mesh.position.set(pos.x - innerWidth / 2 + PW * .62, -(pos.y - innerHeight / 2), 0);
    mesh.rotation.z = gsap.utils.clamp(-.18, .18, -U.uVel.value.x * .006);
    renderer.render(scene, cam);
  });
}

/* video helpers: films play on hover (desktop) or while in view (touch) */
export function hoverVideo(scope, v) {
  if (!v) return;
  const play = () => { v.preload = 'auto'; v.play().then(() => v.classList.add('on')).catch(() => {}); };
  const stop = () => { v.pause(); v.classList.remove('on'); };
  if (FINE) { scope.addEventListener('pointerenter', play); scope.addEventListener('pointerleave', stop); }
  else if (window.ScrollTrigger) ScrollTrigger.create({ trigger: scope, start: 'top 75%', end: 'bottom 25%', onToggle: s => (s.isActive ? play() : stop()) });
}
