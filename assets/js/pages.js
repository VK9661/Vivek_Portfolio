/* =====================================================================
   VIVEK KUMAR — v4 inner pages: works, project, about, services, contact
   Each page builds its DOM first, then boot() wires the shared motion.
   ===================================================================== */
import { RM, FINE, A, $, $$, cover, asset, projects, projectUrl, pad, esc, CATS, CONTACT, chrome, boot, hoverPreview, hoverVideo } from './core.js';

const page = document.body.dataset.page, P = projects();
const ANIM = () => !RM && window.gsap;
const lines = t => t.split(' ').map(w => `<span class="ln"><span>${esc(w)}</span></span>`).join(' ');

const build = { works: buildWorks, project: buildProject, about: buildAbout, services: buildServices, contact: buildContact }[page];
chrome(page === 'project' ? 'works' : page);
const after = build ? build() : null;
const ctx = boot();
if (after) after(ctx);

/* =====================================================================
   WORKS
   ===================================================================== */
function buildWorks() {
  const root = $('.works'), grid = $('#grid'), list = $('#list'), chips = $('#chips');
  const count = c => c === 'all' ? P.length : P.filter(p => p.cats.includes(c)).length;
  chips.innerHTML = [['all', 'All'], ...Object.entries(CATS)].map(([k, t]) => `<button type="button" class="chip" data-c="${k}" aria-pressed="${k === 'all'}">${t}<sup>${count(k)}</sup></button>`).join('');
  grid.innerHTML = P.map((p, i) => `
    <article class="card" data-cats="${p.cats.join(' ')}">
      <a href="${projectUrl(p.id)}" data-cursor="View">
        <span class="c-no mono">${pad(i + 1)} · ${esc(p.kind)}</span><div class="c-media" style="--ar:${p.w}/${p.h}"><img src="${cover(p.id)}" alt="" loading="lazy" width="${p.w}" height="${p.h}">${p.loop ? `<video src="${asset(p.loop)}" muted loop playsinline preload="none"></video>` : ''}</div>
        <div class="c-row"><h2 class="c-t">${esc(p.title)}<i>↗</i></h2><span class="c-y">${p.year}</span><p class="c-s">${esc(p.summary)}</p><div class="c-tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>
      </a>
    </article>`).join('');
  list.innerHTML = P.map((p, i) => `<li class="row" data-cats="${p.cats.join(' ')}"><a href="${projectUrl(p.id)}" data-img="${cover(p.id)}"><span class="no">${pad(i + 1)}</span><span class="t">${esc(p.title)}</span><span class="k">${esc(p.kind)}</span><span class="y">${p.year}<i>↗</i></span></a></li>`).join('');

  const views = $$('.views button'), pill = $('.views .pill');
  const placePill = b => { pill.style.left = b.offsetLeft + 'px'; pill.style.width = b.offsetWidth + 'px'; };
  $$('.card', grid).forEach((c, i) => { c.dataset.pos = i % 4; });
  placePill(views[0]); addEventListener('resize', () => placePill($('.views [aria-pressed="true"]')));

  return () => {
    $$('.card').forEach(c => hoverVideo($('a', c), $('video', c)));
    hoverPreview(ctx.mouse, $$('#list a'), a => a.dataset.img);
    const empty = $('#empty');

    const apply = (c, animate) => {
      $$('.chip', chips).forEach(b => b.setAttribute('aria-pressed', b.dataset.c === c));
      const on = $(`.chip[data-c="${c}"]`, chips); // on phones the chips are one sideways-scrolling row
      if (on && chips.scrollWidth > chips.clientWidth) chips.scrollTo({ left: on.offsetLeft - chips.offsetLeft - (chips.clientWidth - on.offsetWidth) / 2, behavior: animate ? 'smooth' : 'auto' });
      const cards = $$('.card'), rows = $$('#list .row');
      const state = animate && window.Flip && root.dataset.view === 'grid' ? Flip.getState(cards) : null;
      let n = 0;
      cards.forEach(el => { const on = c === 'all' || el.dataset.cats.split(' ').includes(c); el.classList.toggle('out', !on); n += on; });
      rows.forEach(el => el.classList.toggle('out', !(c === 'all' || el.dataset.cats.split(' ').includes(c))));
      empty.hidden = n > 0;
      let v = 0; cards.forEach(el => { if (!el.classList.contains('out')) el.dataset.pos = v++ % 4; });
      if (state) Flip.from(state, { duration: .9, ease: 'ease', absolute: true, scale: true,
        onEnter: els => gsap.fromTo(els, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: .9, ease: 'out', stagger: .05 }),
        onLeave: els => gsap.to(els, { autoAlpha: 0, scale: .9, duration: .5, ease: 'power2.in' }),
        onComplete: () => ScrollTrigger.refresh() });
      else if (animate && ANIM()) { gsap.fromTo($$('#list .row:not(.out)'), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .7, ease: 'out', stagger: .04 }); ScrollTrigger.refresh(); }
      const u = new URL(location); c === 'all' ? u.searchParams.delete('cat') : u.searchParams.set('cat', c); history.replaceState(null, '', u);
    };
    chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) apply(b.dataset.c, true); });
    const q = new URLSearchParams(location.search).get('cat'); if (q && CATS[q]) apply(q, false);

    views.forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      views.forEach(o => o.setAttribute('aria-pressed', o === b)); placePill(b);
      root.dataset.view = b.dataset.v;
      if (ANIM()) {
        const items = b.dataset.v === 'grid' ? $$('.card:not(.out)') : $$('#list .row:not(.out)');
        gsap.fromTo(items, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, ease: 'out', stagger: .04 });
        ScrollTrigger.refresh();
      }
    }));

    if (!ANIM()) return;
    gsap.from('.wk-bar > *', { y: 20, autoAlpha: 0, duration: 1, ease: 'out', stagger: .08, delay: .6 });
    $$('.card').forEach(c => {
      const m = $('.c-media', c);
      gsap.fromTo(m, { clipPath: 'inset(100% 0% 0% 0% round 6px)' }, { clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.4, ease: 'ease', scrollTrigger: { trigger: c, start: 'top 90%' }, clearProps: 'clipPath' });
      gsap.from($$('.c-row > *', c), { y: 30, autoAlpha: 0, duration: 1, ease: 'out', stagger: .06, scrollTrigger: { trigger: c, start: 'top 85%' } });
    });
    if (FINE) $$('.wk-grid .card[data-pos="1"], .wk-grid .card[data-pos="3"]').forEach(c => gsap.to(c, { y: -80, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } }));
  };
}

/* =====================================================================
   PROJECT (project.html?id=…)
   ===================================================================== */
function buildProject() {
  const id = document.body.dataset.id || new URLSearchParams(location.search).get('id'), i = P.findIndex(p => p.id === id), p = P[i], root = $('#pj');
  if (!p) {
    document.title = 'Project not found | Vivek Kumar';
    root.innerHTML = `<section class="nf"><p class="mono label">Not found</p><h1 class="h-sec" style="margin:20px 0 34px">That project isn’t here.</h1><a class="btn" href="works.html"><span class="r" data-r="See all works">See all works</span><i class="arr">↗</i></a></section>`;
    return null;
  }
  document.title = `${p.title}: ${p.kind} | Vivek Kumar`;
  $('meta[name="description"]').content = p.seo || p.summary;
  const nx = P[(i + 1) % P.length];
  const num = s => `<span>${s}</span>`;
  const isV = it => it[2] > it[1];
  const vids = p.video ? p.video.items : [];

  root.innerHTML = `
  <header class="pj-hero">
    <div class="pj-top" data-in><a class="back" href="works.html"><i>←</i>All works</a><p class="mono">Project ${pad(i + 1)} / ${pad(P.length)} · ${esc(p.kind)}</p></div>
    <h1 class="pj-title pg-title">${lines(p.title)}</h1>
    <div class="pj-sub" data-in>
      <p class="mono">${p.tags.map(esc).join(' · ')}</p>
      <p class="lead">${esc(p.summary)}</p>
      <p class="mono" style="text-align:right;color:var(--fg)">Published ${esc(p.published)}</p>
    </div>
  </header>
  <div class="pj-cover" style="aspect-ratio:${p.w}/${p.h};width:min(calc(100% - 2 * var(--pad)), calc(86vh * ${p.w} / ${p.h}))"><img src="${cover(p.id)}" alt="${esc(p.title)} cover" width="${p.w}" height="${p.h}" fetchpriority="high"></div>

  <section class="sec" aria-labelledby="f-h">
    <h2 id="f-h" class="sr">Project facts</h2>
    <dl class="facts" data-up=":scope > div">${p.facts.map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="sec-grid" style="margin-top:14vh"><p class="mono label">About the project</p><p class="about-p" data-fill>${esc(p.about)}</p></div>
  </section>

  <section class="sec" style="padding-top:0" aria-label="Write-up">
    <div class="wu">${p.writeup.map((w, k) => `
      <div class="wu-i"><h3>${num(pad(k + 1))}${esc(w.h)}</h3><div class="wu-b" data-up=":scope > *">
        ${(w.p || []).map(t => `<p>${esc(t)}</p>`).join('')}
        ${w.list ? `<ul>${w.list.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${(w.quotes || []).map(t => `<blockquote>${esc(t)}</blockquote>`).join('')}
      </div></div>`).join('')}
    </div>
  </section>

  ${vids.length ? `<section class="sec" style="padding-top:0" aria-labelledby="v-h">
    <div class="sec-grid" style="margin-bottom:6vh"><p class="mono label">Watch</p><h2 id="v-h" class="h-sec split">The ${esc(p.video.label)}</h2></div>
    <div class="film${vids.some(isV) ? ' v' : ''}" style="margin:0">${vids.map(it => `
      <div class="f" style="--ar:${it[1]}/${it[2]}" data-host="${p.video.host || 'vimeo'}" data-id="${esc(it[0])}" data-t="${esc(it[3])}">
        <img src="${A}img/video/${esc(it[0])}.webp" alt="" loading="lazy">
        <button class="play" type="button" aria-label="Play ${esc(it[3])}" data-mag=".25"><span>Play</span></button>
        <p class="f-cap mono">${esc(it[3])}</p>
      </div>`).join('')}
    </div>
  </section>` : ''}

  <section class="sec" style="padding-top:${vids.length ? 0 : '0'}" aria-labelledby="r-h">
    <div class="sec-grid"><p class="mono label">My role</p><div><h2 id="r-h" class="sr">My role</h2><div class="roles" data-up=":scope > span">${p.role.map(r => `<span>${esc(r)}</span>`).join('')}</div></div></div>
    <div class="sec-grid" style="margin-top:14vh"><p class="mono label">Design process</p><h2 class="h-sec split">${p.process.length} steps from start to finish</h2></div>
    <div class="steps" id="steps"><i class="bar"></i>${p.process.map(([n, d], k) => `<div class="step"><span class="mono">${pad(k + 1)}</span><b>${esc(n)}</b><p>${esc(d)}</p></div>`).join('')}</div>
  </section>

  <section class="sec" aria-labelledby="o-h" style="background:var(--bg-2);border-block:1px solid var(--line)">
    <div class="sec-grid"><p class="mono label">Outcome</p><div><h2 id="o-h" class="h-sec split">What came out of it</h2><p class="oc-note">${esc(p.outcome.note)}</p></div></div>
    <div class="oc" data-up=":scope > div">
      <div><h3>What I delivered</h3><ul>${p.outcome.delivered.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
      <div><h3>How I’d measure success</h3><ul>${p.outcome.measure.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
      <div><h3>What it shows</h3><ul>${p.outcome.shows.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
    </div>
  </section>

  ${p.gallery && p.gallery.length ? `<section class="sec" aria-labelledby="g-h">
    <div class="sec-grid" style="margin-bottom:10vh"><p class="mono label">Gallery</p><h2 id="g-h" class="h-sec split">Key boards</h2></div>
    <div class="gal" style="padding:0">${p.gallery.map(([src, w, h, cap], k) => `<figure><div class="g-img" data-wipe><img src="${asset(src)}" alt="${esc(cap)}" width="${w}" height="${h}" loading="lazy"></div><figcaption><span class="mono">${pad(k + 1)} / ${pad(p.gallery.length)}</span><span class="mono" style="color:var(--fg)">${esc(cap)}</span></figcaption></figure>`).join('')}</div>
  </section>` : ''}

  <section class="sec" style="padding-top:${p.gallery && p.gallery.length ? '4vh' : '16vh'}" aria-labelledby="b-h">
    <div class="sec-grid"><p class="mono label">Full presentation</p><div>
      <h2 id="b-h" class="h-sec split">See every frame on Behance</h2>
      <div class="cta-row"><a class="btn" href="${p.behance}" target="_blank" rel="noopener"><span class="r" data-r="Open on Behance">Open on Behance</span><i class="arr">↗</i></a><a class="btn ghost" href="works.html"><span class="r" data-r="All works">All works</span><i class="arr">↗</i></a></div>
      ${p.credits ? `<p class="credits" style="margin-top:6vh">${esc(p.credits)}</p>` : ''}
    </div></div>
  </section>

  <a class="next" href="${projectUrl(nx.id)}" data-cursor="Next">
    <p class="mono"><span>Next project</span><span>${pad((i + 1) % P.length + 1)} / ${pad(P.length)}</span></p>
    <p class="next-t">${esc(nx.title)}<i>→</i></p>
    <p class="mono" style="margin-top:14px;justify-content:flex-start">${esc(nx.kind)} · ${nx.year}</p>
    <span class="next-img"><img src="${cover(nx.id)}" alt="" loading="lazy"></span>
  </a>`;

  /* films load only on press */
  $$('.film .f').forEach(f => $('.play', f).addEventListener('click', () => {
    const host = f.dataset.host, vid = f.dataset.id;
    let el;
    if (host === 'file') { el = document.createElement('video'); el.src = A + 'video/' + vid + '.mp4'; el.controls = true; el.autoplay = true; el.playsInline = true; }
    else { el = document.createElement('iframe'); el.src = host === 'youtube' ? 'https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1&rel=0' : 'https://player.vimeo.com/video/' + vid + '?autoplay=1&dnt=1&title=0&byline=0&portrait=0'; el.allow = 'autoplay; fullscreen; picture-in-picture'; el.allowFullscreen = true; el.title = f.dataset.t; }
    f.replaceChildren(el);
  }));

  return () => {
    if (!ANIM()) return;
    const cv = $('.pj-cover');
    ctx.arrived.then(() => gsap.to(cv, { clipPath: 'inset(0% 0% 0% 0% round 8px)', duration: 1.8, ease: 'ease', delay: .3 }));
    gsap.fromTo($('img', cv), { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: cv, start: 'top bottom', end: 'bottom top', scrub: true } });
    const steps = $$('.step'), bar = $('#steps .bar');
    ScrollTrigger.create({ trigger: '#steps', start: 'top 75%', end: 'bottom 45%', scrub: true,
      onUpdate: s => { gsap.set(bar, { scaleX: s.progress }); steps.forEach((st, k) => st.classList.toggle('lit', s.progress >= k / Math.max(1, steps.length - 1) - .01)); } });
    gsap.from(steps, { y: 30, autoAlpha: 0, duration: 1, ease: 'out', stagger: .08, scrollTrigger: { trigger: '#steps', start: 'top 85%' } });
    gsap.from('.film .f', { y: 60, autoAlpha: 0, duration: 1.2, ease: 'out', stagger: .08, scrollTrigger: { trigger: '.film', start: 'top 85%' } });
    gsap.from('.next-t', { yPercent: 40, autoAlpha: 0, duration: 1.3, ease: 'out', scrollTrigger: { trigger: '.next', start: 'top 85%' } });
  };
}

/* =====================================================================
   ABOUT
   ===================================================================== */
function buildAbout() {
  const fill = (el, items) => { const one = items.map(t => `<span>${t}</span><i></i>`).join(''); el.innerHTML = `<div aria-hidden="true" style="display:contents">${one.repeat(4)}</div>`; };
  const rows = $$('.tl-row');
  fill(rows[0], ['Figma', 'Canva', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'CapCut']);
  fill(rows[1], ['Claude AI', 'ChatGPT', 'Gemini', 'NotebookLM', 'Google Flow', 'Midjourney', 'Stitch', 'Lovable']);
  return () => {
    if (!ANIM()) return;
    // same on-screen speed as the "Let's work together" ribbon (half its row every 26s)
    const mq = $('.mq-row'), pxS = mq ? mq.scrollWidth / 2 / 26 : innerWidth * .0866;
    rows.forEach(r => {
      const d = +r.dataset.dir;
      const loop = gsap.fromTo(r, { xPercent: d < 0 ? 0 : -50 }, { xPercent: d < 0 ? -50 : 0, duration: r.scrollWidth / 2 / pxS, ease: 'none', repeat: -1 });
      ScrollTrigger.create({ trigger: '.tools', start: 'top bottom', end: 'bottom top', onUpdate: s => { const v = Math.abs(s.getVelocity()); gsap.to(loop, { timeScale: 1 + Math.min(v / 300, 5), duration: .2, overwrite: true }); gsap.to(loop, { timeScale: 1, duration: 1.4, delay: .25 }); } });
    });
    gsap.from('.xp-h h3', { yPercent: 30, autoAlpha: 0, duration: 1.2, ease: 'out', scrollTrigger: { trigger: '.xp', start: 'top 85%' } });
  };
}

/* =====================================================================
   SERVICES
   ===================================================================== */
function buildServices() {
  const SV = [
    ['Website design', 'Landing pages and web products that are easy to read and act on, from the first sketch to a Figma file ready for handoff.', ['Wireframes and user flows', 'High-fidelity prototyping', 'Design systems', 'Usability testing'], 'ux'],
    ['Mobile app design', 'Mobile flows designed for one-thumb use, with research behind each screen.', ['User research and interviews', 'Information architecture', 'Interaction patterns', 'Interactive prototypes'], 'ux'],
    ['Brand identity', 'Logos and visual systems that stay consistent from a business card to a billboard.', ['Logo design', 'Brand systems', 'Typography and colour', 'Packaging and collateral'], 'brand'],
    ['Social media creatives', 'Campaign and content posts that look like the same brand on every platform.', ['Post and carousel design', 'Campaign systems', 'Typography and hierarchy'], 'graphic'],
    ['Posters and ads', 'Marketing posters and ads, each built around one clear message.', ['Poster design', 'Ad creatives', 'Editorial and print layouts'], 'graphic'],
    ['Motion and video', 'Animation that explains a product or brand, and video edits cut for pace.', ['After Effects animation', 'UI micro-interactions', 'Parallax and carousel animation', 'Logo reveals and intros', 'Kinetic typography', 'Short-form video editing'], 'motion']
  ];
  const PR = [['Research', 'Talk to users and study the market, so the problem is clear before any solution.'], ['Strategy', 'Agree on the goals, the scope and what success looks like.'], ['Wireframe', 'Sketch the flows and structure, and check the logic before any visual design.'], ['Design', 'Type, colour, hierarchy and the final polish.'], ['Prototype', 'Stitch the screens together so they click and swipe like the real thing.'], ['Iterate', 'Test with people, fix what doesn’t work, and keep improving after launch.']];
  const CP = [['Research', ['User research & interviews', 'Problem framing', 'Heuristic audits', 'Usability testing', 'User flows']], ['Design', ['Wireframes & prototypes', 'High-fidelity UI', 'Typography & hierarchy', 'Responsive design', 'Interaction design']], ['Systems', ['Design systems', 'Brand identity & logos', 'Poster & campaign design', 'Social media creatives', 'Engineering handoff']], ['Motion', ['After Effects animation', 'UI micro-interactions', 'Parallax & carousel', 'Logo reveals & intros', 'Video editing']]];
  const FQ = [['What kind of work do you take on?', 'Graphic design, UI/UX design, motion graphics and video editing: websites, mobile apps, brand identities, social media creatives, posters and ads, and motion pieces.'], ['Are you open to new roles or freelance work?', 'Yes, both: full-time design roles and freelance projects in graphic, UI/UX, motion and video. Email me.'], ['What tools do you design with?', 'Figma, Canva, Photoshop, Illustrator, After Effects, Premiere Pro and CapCut. For parts of the work I also use AI tools: Claude, ChatGPT, Gemini, NotebookLM, Google Flow, Midjourney, Stitch and Lovable.']];

  $('#svc').innerHTML = '<h2 class="sr">What I offer</h2>' + SV.map(([t, d, l, c], k) => {
    const rel = P.filter(p => p.cats.includes(c)).slice(0, 3);
    return `<article class="sv" style="top:${90 + k * 14}px">
      <span class="sv-no">${pad(k + 1)}</span>
      <h3>${esc(t)}</h3>
      <div class="sv-rel"><p class="mono note">${CATS[c]} work</p><div>${rel.map(p => `<a href="${projectUrl(p.id)}" aria-label="${esc(p.title)}" data-cursor="${esc(p.title)}"><img src="${cover(p.id)}" alt="" loading="lazy"></a>`).join('')}</div></div>
      <p class="sv-d">${esc(d)}</p>
      <ul>${l.map((x, j) => `<li>${esc(x)}<span>${pad(j + 1)}</span></li>`).join('')}</ul>
      <i class="sv-shade" aria-hidden="true"></i>
    </article>`;
  }).join('');
  $('#prt').insertAdjacentHTML('beforeend', PR.map(([n, d], k) => `<div class="pr"><span class="pr-n">${pad(k + 1)}</span><b>${n}</b><p>${d}</p></div>`).join(''));
  $('#capg').innerHTML = CP.map(([h, l], k) => `<div><h3>${h}<span>${pad(k + 1)}</span></h3><ul>${l.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
  $('#faq').innerHTML = FQ.map(([q, a], k) => `<li class="cap"><button type="button" aria-expanded="false"><span class="mono">${pad(k + 1)}</span><span class="cap-t" style="font-size:clamp(24px,2.8vw,46px)">${esc(q)}</span><span class="pm" aria-hidden="true"></span></button><div class="cap-b"><p>${esc(a)}</p><p class="mono"></p></div></li>`).join('');

  return () => {
    if (!ANIM()) return;
    const cards = $$('.sv');
    cards.forEach((c, k) => {
      gsap.from($$('.sv-no, h3, .sv-d, li, .sv-rel', c), { y: 40, autoAlpha: 0, duration: 1, ease: 'out', stagger: .05, scrollTrigger: { trigger: c, start: 'top 75%' } });
      const nx = cards[k + 1]; if (!nx || innerWidth <= 900) return;
      gsap.to(c, { scale: .92, ease: 'none', scrollTrigger: { trigger: nx, start: 'top bottom', end: `top ${90 + (k + 1) * 14}px`, scrub: true } });
      gsap.to($('.sv-shade', c), { opacity: .6, ease: 'none', scrollTrigger: { trigger: nx, start: 'top bottom', end: `top ${90 + (k + 1) * 14}px`, scrub: true } });
    });

    const track = $('#prt'), prs = $$('.pr', track), n = prs.length;
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.proc', start: 'top top', end: () => '+=' + (dist() + innerHeight * .6), pin: '.pr-pin', scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: s => { gsap.set('#prl', { scaleX: s.progress }); const a = Math.min(n - 1, Math.floor(s.progress * n * .999)); $('#prn').textContent = pad(a + 1); prs.forEach((p, k) => p.classList.toggle('lit', k <= a)); } } });
    gsap.from('.capg > div', { y: 50, autoAlpha: 0, duration: 1, ease: 'out', stagger: .08, scrollTrigger: { trigger: '.capg', start: 'top 85%' } });
  };
}

/* =====================================================================
   CONTACT
   ===================================================================== */
function buildContact() {
  $$('[data-chars]').forEach(s => { s.innerHTML = [...s.textContent].map(c => `<span class="ch">${c}</span>`).join('') + (s.hasAttribute('data-dot') ? '<span class="ch dot">.</span>' : ''); });
  const mail = CONTACT.email;
  $('#mail').href = 'mailto:' + mail; $('#mail').textContent = mail;
  $('#else').innerHTML = [['Behance', CONTACT.behance], ['Portfolio book', CONTACT.book], ['LinkedIn', CONTACT.linkedin], ['Instagram', CONTACT.instagram]].map(([t, h]) => `<a href="${h}" target="_blank" rel="noopener">${t}<i>↗</i></a>`).join('');

  const copy = $('#copy');
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(mail); } catch (e) { const r = document.createRange(); r.selectNodeContents($('#mail')); getSelection().removeAllRanges(); getSelection().addRange(r); }
    copy.classList.add('done'); setTimeout(() => copy.classList.remove('done'), 1800);
  });

  const form = $('#form'), err = $('#err'), ok = $('#ok');
  $$('input,textarea', form).forEach(i => { i.setAttribute('aria-describedby', 'err'); i.addEventListener('input', () => { if (i.hasAttribute('aria-invalid')) { i.removeAttribute('aria-invalid'); err.textContent = ''; } }); });
  $$('.fld', form).forEach(f => { const i = $('input,textarea', f); i.addEventListener('input', () => f.classList.toggle('has', !!i.value)); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form), name = (d.get('name') || '').trim(), from = (d.get('email') || '').trim(), msg = (d.get('msg') || '').trim();
    const bad = !name ? ['name', 'Please add your name.'] : !from ? ['email', 'Please add your email, so I can reply.'] : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(from) ? ['email', 'That email doesn’t look right. Check it and try again.'] : !msg ? ['msg', 'Please write a short message.'] : null;
    $$('input,textarea', form).forEach(i => i.removeAttribute('aria-invalid'));
    ok.hidden = true;
    if (bad) { const f = form.elements[bad[0]]; f.setAttribute('aria-invalid', 'true'); err.textContent = bad[1]; f.focus(); return; }
    err.textContent = '';
    location.href = `mailto:${mail}?subject=${encodeURIComponent('Hello from ' + name)}&body=${encodeURIComponent(msg + '\n\n' + name + ' · ' + from)}`;
    ok.hidden = false; ok.focus();
  });

  return () => {
    if (!ANIM() || !FINE) return;
    $$('.hello .ch').forEach(c => c.addEventListener('pointerenter', () => gsap.fromTo(c, { yPercent: 0, rotation: 0 }, { keyframes: [{ yPercent: -14, rotation: gsap.utils.random(-8, 8), duration: .25, ease: 'power2.out' }, { yPercent: 0, rotation: 0, duration: .9, ease: 'elastic.out(1,.4)' }] })));
  };
}
