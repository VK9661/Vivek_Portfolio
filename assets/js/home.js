/* =====================================================================
   VIVEK KUMAR — v4 Home
   particle portrait · selected-work ring · counters
   (shared engines live in core.js)
   ===================================================================== */
import * as THREE from 'three';
import { RM, FINE, A, $, $$, cover, projects, projectUrl, pad, esc, chrome, boot } from './core.js';

const P = projects(), F = P.filter(p => p.featured);
chrome('home');

/* ring: the five featured projects, twice round so the circle reads full */
const N = F.length, CARDS = N * 2, STEP = 360 / CARDS;
$('#ring').innerHTML = Array.from({ length: CARDS }, (_, i) => {
  const p = F[i % N];
  return `<a class="rc" href="${projectUrl(p.id)}" data-i="${i}" tabindex="${i < N ? 0 : -1}" aria-label="${esc(p.title)}, ${esc(p.kind)}"${i < N ? '' : ' aria-hidden="true"'}><span class="rc-in"><img src="${cover(p.id)}" alt="" draggable="false"><span class="rc-no mono">${pad(i % N + 1)}</span></span></a>`;
}).join('');
$('#dots').innerHTML = F.map((p, i) => `<button type="button" aria-label="Show ${esc(p.title)}" data-d="${i}"><i></i></button>`).join('');
$('#rgt-n').textContent = pad(N);
$('.rg-all sup').textContent = `(${P.length})`;

const first = document.documentElement.classList.contains('first');
const { mouse, lenis, arrived } = boot();
ring();
if (RM || !window.gsap) $('.loader')?.remove();
else home();

/* ---------------------------------------------------------------- ring */
function ring() {
  const ringEl = $('#ring'), cards = $$('.rc', ringEl), stage = $('#stage');
  const tT = $('#rgt'), tK = $('#rgk'), tS = $('#rgs'), tL = $('#rgl'), tN = $('#rgn'), dots = $$('#dots button');
  let R = 0;
  const layout = () => {
    const w = cards[0].offsetWidth;
    R = Math.round(w * CARDS * 1.38 / (2 * Math.PI));
    cards.forEach((c, i) => { c.style.transform = `rotateY(${i * STEP}deg) translateZ(${R}px)`; });
    $('.rg-core').style.setProperty('--rw', Math.round(Math.min(2 * R * .92, innerWidth * .92)) + 'px');
  };
  layout(); addEventListener('resize', layout);

  let current = -1;
  const show = (k, instant) => {
    if (k === current) return; const dir = k > current ? 1 : -1; current = k;
    const p = F[k];
    tN.textContent = pad(k + 1); tL.href = projectUrl(p.id);
    dots.forEach((d, i) => d.classList.toggle('on', i === k));
    const next = document.createElement('span'); next.textContent = p.title;
    const old = $$('span', tT);
    if (instant || RM || !window.gsap) { tT.replaceChildren(next); tK.textContent = `${p.kind} · ${p.year}`; tS.textContent = p.summary; return; }
    tT.appendChild(next);
    gsap.killTweensOf(old);
    const H = tT.offsetHeight * 1.05;
    gsap.fromTo(next, { y: H * dir }, { y: 0, duration: .9, ease: 'out' });
    gsap.to(old, { y: -H * dir, duration: .9, ease: 'out', onComplete: () => old.forEach(o => o.remove()) });
    gsap.to([tK, tS], { autoAlpha: 0, y: -8, duration: .25, ease: 'power2.in', onComplete: () => { tK.textContent = `${p.kind} · ${p.year}`; tS.textContent = p.summary; gsap.to([tK, tS], { autoAlpha: 1, y: 0, duration: .5, ease: 'out', stagger: .05 }); } });
  };

  /* angle = scroll part + user part (drag, dots, auto-advance) */
  const st = { scroll: 0, user: 0, vel: 0, shown: 0 };
  const total = () => st.scroll + st.user;
  const render = () => {
    const a = st.shown;
    ringEl.style.transform = `rotateY(${-a}deg)`;
    let best = 0, bd = 999;
    cards.forEach((c, i) => {
      let d = ((i * STEP - a) % 360 + 540) % 360 - 180;            // -180..180, 0 = front
      const f = Math.cos(d * Math.PI / 180), k = (f + 1) / 2;
      c.style.opacity = (.18 + .82 * Math.pow(k, 2.2)).toFixed(3);
      c.style.filter = `grayscale(${(1 - k).toFixed(2)}) brightness(${(.55 + .45 * k).toFixed(2)})`;
      c.style.pointerEvents = f > .5 ? 'auto' : 'none';
      if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
    });
    show(best % N);
  };

  if (RM || !window.gsap) { st.shown = 0; render(); return; }

  let down = false, lastX = 0, moved = 0, idle = 0, settle = null;
  /* scroll turns the ring one project per step while the section is pinned */
  ScrollTrigger.create({
    trigger: '.ring-sec', start: 'top top', end: () => '+=' + innerHeight * 2.4, pin: '.rg-pin', scrub: true, anticipatePin: 1,
    onUpdate: s => { st.scroll = s.progress * STEP * (N - 1); idle = 0; }
  });

  /* drag with inertia, then settle on the nearest card */
  const snap = () => { const t = total(), target = Math.round(t / STEP) * STEP; settle = gsap.to(st, { user: st.user + (target - t), duration: .9, ease: 'out' }); };
  stage.addEventListener('pointerdown', e => { down = true; moved = 0; lastX = e.clientX; st.vel = 0; settle?.kill(); stage.classList.add('drag'); });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); const k = 180 / Math.max(innerWidth, 600); st.user -= dx * k; st.vel = -dx * k; idle = 0; });
  const up = () => { if (!down) return; down = false; stage.classList.remove('drag'); gsap.to(st, { user: st.user + st.vel * 14, duration: .8, ease: 'power3.out', onComplete: snap }); };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
  ringEl.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  cards.forEach(c => c.addEventListener('focus', () => { const i = +c.dataset.i, t = total(); let d = ((i * STEP - t) % 360 + 540) % 360 - 180; settle?.kill(); settle = gsap.to(st, { user: st.user + d, duration: 1, ease: 'out' }); }));
  dots.forEach((d, i) => d.addEventListener('click', () => { const t = total(), cur = Math.round(t / STEP); let diff = ((i - cur) % N + N) % N; if (diff > N / 2) diff -= N; settle?.kill(); settle = gsap.to(st, { user: st.user + diff * STEP + (cur * STEP - t), duration: 1.2, ease: 'ease' }); idle = 0; }));

  /* auto-advance after a few quiet seconds while in view */
  let inView = false;
  ScrollTrigger.create({ trigger: '.ring-sec', start: 'top 60%', end: 'bottom 40%', onToggle: s => { inView = s.isActive; } });
  gsap.ticker.add((t, dt) => {
    st.shown += (total() - st.shown) * .12;
    render();
    if (!down && inView && !settle?.isActive()) { idle += dt; if (idle > 4200) { idle = 0; settle = gsap.to(st, { user: st.user + STEP, duration: 1.4, ease: 'ease' }); } }
  });

  /* entrance: cards fly out from the centre */
  gsap.from($$('.rc-in', ringEl), { scale: .3, yPercent: 40, autoAlpha: 0, duration: 1.6, ease: 'out', stagger: { each: .06, from: 'center' }, scrollTrigger: { trigger: '.ring-sec', start: 'top 70%' } });
  gsap.from('#rgt', { scale: .8, autoAlpha: 0, duration: 1.4, ease: 'out', scrollTrigger: { trigger: '.ring-sec', start: 'top 60%' } });
  gsap.from('.rg-info > *, .rg-foot > *', { y: 24, autoAlpha: 0, duration: 1, ease: 'out', stagger: .06, scrollTrigger: { trigger: '.ring-sec', start: 'top 50%' } });

  /* desktop: the whole ring leans toward the cursor */
  if (FINE) {
    const rx = gsap.quickTo('#scene', 'rotationX', { duration: 1.2, ease: 'out' }), ry = gsap.quickTo('#scene', 'rotationZ', { duration: 1.2, ease: 'out' });
    stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); rx(-12 + ((e.clientY - r.top) / r.height - .5) * -6); ry(((e.clientX - r.left) / r.width - .5) * 3); });
    stage.addEventListener('pointerleave', () => { rx(-12); ry(0); });
  }
}

/* ---------------------------------------------------------------- home */
function home() {
  if (first) lenis.stop();

  /* counters */
  $$('[data-count]').forEach(b => {
    const end = +b.dataset.count, o = { v: end > 1000 ? end - 26 : 0 };
    b.textContent = o.v;
    gsap.to(o, { v: end, duration: 2, ease: 'out', scrollTrigger: { trigger: b, start: 'top 88%' }, onUpdate: () => { b.textContent = Math.round(o.v); } });
  });
  gsap.from('.stats > div', { y: 40, autoAlpha: 0, duration: 1, ease: 'out', stagger: .1, scrollTrigger: { trigger: '.stats', start: 'top 88%' } });

  const portrait = heroParticles(mouse);

  /* first visit of the session: loader → intro. Later visits: shutters → intro */
  gsap.set($$('.h-name .ln > span'), { yPercent: 105 });
  gsap.set('.h-meta > *, .h-side', { autoAlpha: 0, y: 20 });
  const reveal = () => gsap.timeline()
    .add(() => portrait.intro())
    .to($$('.h-name .ln > span'), { yPercent: 0, duration: 1.4, ease: 'out', stagger: .1 }, .1)
    .to('.h-meta > *, .h-side', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'out', stagger: .08 }, .2);
  if (!first) { $('.loader')?.remove(); sessionStorage.setItem('vk-seen', '1'); Promise.all([portrait.ready, arrived]).then(reveal); }
  else {
    gsap.set('.top', { autoAlpha: 0 });
    const letters = $$('.ld-name span'), num = $('.ld-num'), c = { v: 0 };
    const load = gsap.timeline()
      .from(letters, { yPercent: 110, duration: 1, ease: 'out', stagger: .04 })
      .to(c, { v: 100, duration: 1.8, ease: 'ease', onUpdate: () => { num.textContent = Math.round(c.v) + '%'; } }, 0)
      .to('.ld-line', { scaleX: 1, duration: 1.8, ease: 'ease' }, 0);
    Promise.all([document.fonts.ready, portrait.ready, new Promise(r => load.eventCallback('onComplete', r))]).then(() => {
      sessionStorage.setItem('vk-seen', '1');
      gsap.timeline({ onComplete: () => { $('.loader').remove(); document.documentElement.classList.remove('first'); lenis.start(); ScrollTrigger.refresh(); } })
        .to(letters, { yPercent: -110, duration: .7, ease: 'ease', stagger: .025 })
        .to('.ld-row, .ld-track', { autoAlpha: 0, duration: .4 }, '<')
        .to('.loader', { yPercent: -100, duration: 1.2, ease: 'ease' }, '-=.35')
        .add(reveal, '-=.9')
        .to('.top', { autoAlpha: 1, duration: 1 }, '-=.6');
    });
  }

  /* hero leaves: name drifts, particles scatter */
  gsap.to('.h-name', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.h-meta, .h-side', { y: -80, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '50% top', scrub: true } });
}

/* =====================================================================
   Particle portrait — his real cutout photo sampled into ~35k points.
   Points repel from the cursor and scatter into depth on scroll.
   ===================================================================== */
function heroParticles(mouse) {
  const canvas = $('#gl');
  let resolveReady; const ready = new Promise(r => (resolveReady = r));
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { resolveReady(); return { ready, intro() {} }; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100); camera.position.z = 10;
  const group = new THREE.Group(); scene.add(group);
  const U = {
    uTime: { value: 0 }, uIntro: { value: 0 }, uScatter: { value: 0 }, uMouse: { value: new THREE.Vector2(99, 99) }, uStr: { value: 0 },
    uSize: { value: 2.5 }, uPR: { value: renderer.getPixelRatio() }, uColor: { value: new THREE.Color('#EDEBE6') }, uAcc: { value: new THREE.Color('#FF4A1C') }
  };
  let visH = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(17.5)), visW = visH;
  const img = new Image(); img.crossOrigin = 'anonymous'; img.src = A + 'img/me/portrait-cutout.webp';
  img.decode().then(() => {
    const mobile = innerWidth < 700, sw = mobile ? 190 : 300, sh = Math.round(sw * img.height / img.width);
    const cv = document.createElement('canvas'); cv.width = sw; cv.height = sh;
    const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, sw, sh);
    const d = ctx.getImageData(0, 0, sw, sh).data;
    const pos = [], rnd = [], lum = [], del = [];
    const H = 5.9, W = H * sw / sh;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      const i = (y * sw + x) * 4; if (d[i + 3] < 140) continue;
      const l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255;
      if (l < .06 && Math.random() < .3) continue;
      pos.push((x / sw - .5) * W + (Math.random() - .5) * .02, -(y / sh - .5) * H, (Math.random() - .5) * .08);
      rnd.push(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      lum.push(Math.max(Math.pow(l, .85) * 1.2, .22)); del.push(Math.random() * .6 + (y / sh) * .25);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aRand', new THREE.Float32BufferAttribute(rnd, 3));
    g.setAttribute('aLum', new THREE.Float32BufferAttribute(lum, 1));
    g.setAttribute('aDelay', new THREE.Float32BufferAttribute(del, 1));
    const m = new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime,uIntro,uScatter,uSize,uPR,uStr; uniform vec2 uMouse;
        attribute vec3 aRand; attribute float aLum; attribute float aDelay;
        varying float vLum; varying float vHot;
        void main(){
          vec3 p = position;
          float t = clamp(uIntro*1.7 - aDelay, 0., 1.); t = 1. - pow(1. - t, 4.);
          p = mix(p + aRand*vec3(5.,4.,9.), p, t);
          p.xy += vec2(sin(uTime*.7 + aRand.y*9.), cos(uTime*.6 + aRand.z*9.)) * .006;
          p.z += sin(uTime*.9 + aRand.x*7.) * .025;
          vec2 dd = p.xy - uMouse; float dist = length(dd);
          float f = smoothstep(.85, 0., dist) * uStr;
          p.xy += normalize(dd + 1e-4) * f * .5; p.z += f * 1.4 * aRand.z;
          vHot = f;
          p += aRand * vec3(3.5, 2.8, 7.) * uScatter;
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPR * (.32 + aLum * 1.35) * (10. / -mv.z);
          vLum = aLum * t;
        }`,
      fragmentShader: `
        uniform vec3 uColor, uAcc; uniform float uScatter; varying float vLum; varying float vHot;
        void main(){
          float r = length(gl_PointCoord - .5); if (r > .5) discard;
          float a = smoothstep(.5, .1, r);
          vec3 col = mix(uColor * (.5 + vLum * .75), uAcc, clamp(vHot * 1.6, 0., 1.));
          gl_FragColor = vec4(col, a * (.3 + vLum * .85) * (1. - uScatter * .85));
        }`
    });
    group.add(new THREE.Points(g, m));
    layout(); resolveReady();
  }).catch(() => resolveReady());

  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    visH = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(17.5)); visW = visH * camera.aspect;
    const mobile = w < 700;
    group.scale.setScalar(mobile ? .68 : 1);
    group.position.set(mobile ? 0 : visW * .17, -visH / 2 + 5.9 * (mobile ? .68 : 1) / 2 - .02, 0);
  }
  addEventListener('resize', layout); layout();

  // pointer → world (z = 0 plane), smoothed; strength rises while the cursor is inside
  const target = new THREE.Vector2(99, 99), sm = new THREE.Vector2(99, 99); let inside = false;
  const hero = $('.hero');
  hero.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    target.set(((e.clientX - r.left) / r.width * 2 - 1) * visW / 2 - group.position.x, -((e.clientY - r.top) / r.height * 2 - 1) * visH / 2 - group.position.y).divideScalar(group.scale.x);
    inside = true;
  });
  hero.addEventListener('pointerleave', () => { inside = false; });

  let on = true;
  ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: s => { on = s.isActive; } });
  gsap.to(U.uScatter, { value: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.ticker.add(t => {
    if (!on) return;
    U.uTime.value = t;
    sm.lerp(target, .12); U.uMouse.value.copy(sm);
    U.uStr.value += ((inside ? 1 : 0) - U.uStr.value) * .06;
    renderer.render(scene, camera);
  });
  return { ready, intro() { gsap.to(U.uIntro, { value: 1, duration: 3, ease: 'power2.out' }); } };
}
