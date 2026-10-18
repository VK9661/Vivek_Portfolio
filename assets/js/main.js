/* =====================================================================
   Shared components and interactions for every page.

   Pages mark slots with data attributes and this file fills them:
     <header data-site-nav>    floating pill nav, full-screen menu
     <div data-site-cta>       "let's talk" band
     <footer data-site-foot>   footer row
   Page scripts that render content (assets/js/pages/*.js) load BEFORE
   this file, so their content gets reveals and cursor labels too.

   Contents
     1. Smooth scrolling (Lenis)      6. Toast and copy email
     2. Nav: build, menu              7. Blob eyes, "hello" cursor
     3. Nav: fold on scroll           8. Intro (Home, once a session)
     4. Day / night theme             9. Page transitions
     5. Contact band, footer,
        reveals
   ===================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var C = window.CONTACT || {};
  var page = document.body.getAttribute('data-page') || '';


  /* ---------- 1. Smooth scrolling (Lenis) ----------
     Lenis smooths wheel and trackpad scrolling but keeps native scroll,
     so sticky elements, keyboard scrolling and touch all still work. */
  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4
    });
    window.__lenis = lenis;
    var lenisFrame = function (time) { lenis.raf(time); requestAnimationFrame(lenisFrame); };
    requestAnimationFrame(lenisFrame);
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains('skip-link')) return;
      var id = a.getAttribute('href');
      var target = (id === '#' || id === '#main') ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -100, duration: 1.4 });
    });
  }


  /* ---------- 2. Nav: build, menu ---------- */
  var LINKS = [
    { href: 'index.html', key: 'home', label: 'Home' },
    { href: 'work.html', key: 'work', label: 'Work' },
    { href: 'about.html', key: 'about', label: 'About' },
    { href: 'services.html', key: 'services', label: 'Services' },
    { href: 'journal.html', key: 'journal', label: 'Reading list' }
  ];
  var current = page === 'project' ? 'work' : page;
  var cur = function (k) { return k === current ? ' aria-current="page"' : ''; };

  var navSlot = $('[data-site-nav]');
  var nav = null, themeBtn = null, menuBtn = null, panel = null;
  if (navSlot) {
    navSlot.innerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<nav class="nav" aria-label="Primary">' +
        '<a class="nav-logo" href="index.html" aria-label="Vivek Kumar, home"><span class="mono" aria-hidden="true">VK</span><img src="assets/img/avatar.webp" alt="" width="42" height="42"></a>' +
        '<div class="nav-fold nav-fold--links"><span><span class="nav-links">' + LINKS.slice(1).map(function (l) {
          return '<a class="l" href="' + l.href + '"' + cur(l.key) + '>' + l.label + '</a>';
        }).join('') + '</span></span></div>' +
        '<button class="theme-btn" type="button" aria-pressed="false" aria-label="Night mode">' +
          '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>' +
          '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>' +
        '</button>' +
        '<div class="nav-fold nav-fold--menu"><span>' +
          '<button class="nav-menu" type="button" aria-expanded="false" aria-controls="menu-panel" aria-label="Menu">' +
            '<span class="nav-fold nav-fold--label"><span><span class="nav-menu-text" aria-hidden="true">Menu</span></span></span><i aria-hidden="true"></i>' +
          '</button>' +
        '</span></div>' +
        '<div class="nav-fold nav-fold--cta"><span><a class="btn btn--sun btn--sm nav-cta" href="contact.html"' + cur('contact') + '>Say hello</a></span></div>' +
      '</nav>' +
      '<div class="menu-panel" id="menu-panel" role="dialog" aria-modal="true" aria-label="Menu">' +
        LINKS.concat([{ href: 'contact.html', key: 'contact', label: 'Contact' }]).map(function (l, i) {
          return '<a class="m" href="' + l.href + '"' + cur(l.key) + '><small>0' + (i + 1) + '</small>' + l.label + '</a>';
        }).join('') +
        '<div class="chips">' +
          '<a class="chip" href="mailto:' + C.email + '">Email</a>' +
          '<a class="chip" href="' + C.behance + '" target="_blank" rel="noopener">Behance</a>' +
          '<a class="chip" href="' + C.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a class="chip" href="' + C.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
        '</div>' +
      '</div>';

    nav = $('.nav'); themeBtn = $('.theme-btn'); menuBtn = $('.nav-menu'); panel = $('#menu-panel');
    var menuText = $('.nav-menu-text');
    var menuOpen = function () { return panel.classList.contains('is-open'); };
    $$('#menu-panel > *').forEach(function (el, i) { el.style.setProperty('--i', i); });
    // While the menu is open the page behind it is inert, so focus stays in the nav and menu
    var behind = $$('main, footer, .skip-link');
    var setMenu = function (open) {
      panel.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      menuText.textContent = open ? 'Close' : 'Menu';
      behind.forEach(function (el) { el.inert = open; });
      // one scroll lock only: Lenis when it runs, otherwise the page itself
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
      else root.style.overflow = open ? 'hidden' : '';
      if (open) { var first = $('a.m', panel); if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 250); }
    };
    menuBtn.addEventListener('click', function () { setMenu(!menuOpen()); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen()) { setMenu(false); menuBtn.focus(); } });


    /* ---------- 3. Nav: fold on scroll ----------
       Moving down the page folds the nav to profile + day/night + menu;
       moving back up (or tapping the folded pill) unfolds it. A little
       travel in one direction is needed first, so small jitters do nothing. */
    var mini = false, lastY = window.scrollY, travel = 0, ticking = false;
    var TOP = 96, STEP = 24;
    var setMini = function (on) {
      if (on === mini) return;
      mini = on;
      nav.classList.toggle('is-mini', on);
    };
    var onScroll = function () {
      ticking = false;
      var y = window.scrollY, dy = y - lastY;
      lastY = y;
      if (menuOpen()) return;
      if (y < TOP) { travel = 0; setMini(false); return; }
      travel = (dy > 0) === (travel > 0) ? travel + dy : dy;  // restart the count when direction flips
      if (travel > STEP) setMini(true);
      else if (travel < -STEP) setMini(false);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    if (window.scrollY > TOP) setMini(true);

    // Tapping the folded pill (not its buttons) unfolds it; keyboard focus does too
    nav.addEventListener('click', function (e) {
      if (!mini || menuOpen() || e.target.closest('.theme-btn, .nav-menu')) return;
      e.preventDefault();
      travel = 0;
      setMini(false);
    });
    // (keyboard focus only: a mouse or touch press also focuses, and must stay a tap)
    nav.addEventListener('focusin', function (e) {
      if (mini && !menuOpen() && e.target.matches(':focus-visible') && !e.target.closest('.theme-btn, .nav-menu')) setMini(false);
    });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function (m) { if (m.matches && !mini) setMenu(false); });


    /* ---------- 4. Day / night theme ----------
       The inline head script sets data-theme before the first paint.
       A saved choice wins; otherwise the device setting is followed live.
       Switching opens the new theme as a circle from the switch, using a
       View Transition (a GPU snapshot, so nothing on the page re-renders
       mid-animation). Browsers without it switch instantly. */
    var metaTheme = $('meta[name="theme-color"]');
    var saved = function () { try { return localStorage.getItem('vk-theme'); } catch (e) { return null; } };
    var applyTheme = function (t) {
      var dark = t === 'dark';
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      themeBtn.setAttribute('aria-pressed', String(dark));
      themeBtn.setAttribute('aria-label', dark ? 'Day mode' : 'Night mode');
      themeBtn.setAttribute('data-cursor', dark ? 'day mode' : 'night mode');
      if (metaTheme) metaTheme.setAttribute('content', dark ? '#0E0B25' : '#F2F1FA');
    };
    var switching = false;
    var switchTheme = function (next) {
      if (switching) return;
      themeBtn.classList.remove('is-switching'); void themeBtn.offsetWidth; themeBtn.classList.add('is-switching');
      if (!document.startViewTransition || reduceMotion) { applyTheme(next); return; }
      switching = true;
      var r = themeBtn.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      var vt = document.startViewTransition(function () { applyTheme(next); });
      vt.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 760, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
      vt.finished.then(function () { switching = false; }, function () { switching = false; });
    };
    applyTheme(root.getAttribute('data-theme'));
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('vk-theme', next); } catch (e) {}
      switchTheme(next);
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (m) {
      if (!saved()) switchTheme(m.matches ? 'dark' : 'light');
    });
  }


  /* ---------- 5. Contact band, footer, reveals ---------- */
  var ctaSlot = $('[data-site-cta]');
  if (ctaSlot) {
    ctaSlot.innerHTML =
      '<section class="cta" aria-labelledby="cta-title"><div class="wrap cta-grid">' +
        '<svg class="blob" viewBox="0 0 240 240" aria-hidden="true">' +
          '<g stroke="#1C1747" stroke-width="9" fill="#1C1747"><circle cx="120" cy="60" r="52"/><circle cx="60" cy="120" r="52"/><circle cx="180" cy="120" r="52"/><circle cx="120" cy="180" r="52"/><circle cx="120" cy="120" r="48"/></g>' +
          '<g fill="#6FE3B2"><circle cx="120" cy="60" r="52"/><circle cx="60" cy="120" r="52"/><circle cx="180" cy="120" r="52"/><circle cx="120" cy="180" r="52"/><circle cx="120" cy="120" r="48"/></g>' +
          '<g class="eyes" fill="#1C1747"><rect x="98" y="98" width="15" height="30" rx="7.5"/><rect x="130" y="98" width="15" height="30" rx="7.5"/></g>' +
        '</svg>' +
        '<div>' +
          '<h2 id="cta-title">Got a project?<br>Let’s talk.</h2>' +
          '<p class="lead">Open to design roles and freelance projects in graphic, UI/UX, motion and video. Send a note and I’ll reply soon.</p>' +
          '<div class="row-actions">' +
            '<a class="mail" href="mailto:' + C.email + '?subject=Portfolio%20enquiry" data-cursor="write">' + C.email + '</a>' +
            '<button class="btn btn--white btn--sm" type="button" data-copy="' + C.email + '" data-cursor="copy">Copy email</button>' +
          '</div>' +
          '<div class="chips socials">' +
            '<a class="chip" href="' + C.behance + '" target="_blank" rel="noopener">Behance ↗</a>' +
            '<a class="chip" href="' + C.linkedin + '" target="_blank" rel="noopener">LinkedIn ↗</a>' +
            '<a class="chip" href="' + C.instagram + '" target="_blank" rel="noopener">Instagram ↗</a>' +
          '</div>' +
          '<p class="hand reply">my inbox is open, I reply faster than I should</p>' +
        '</div>' +
      '</div></section>';
  }

  var footSlot = $('[data-site-foot]');
  if (footSlot) {
    footSlot.className = 'foot';
    footSlot.innerHTML =
      '<div class="wrap foot-grid">' +
        '<div class="foot-id"><b>Vivek Kumar</b><span>Graphic, UI/UX &amp; motion designer, video editor</span>' +
          '<span class="foot-avail"><i class="dot" aria-hidden="true"></i>Open to roles and freelance · India, IST</span></div>' +
        '<nav class="foot-links" aria-label="Footer">' +
          LINKS.concat([{ href: 'contact.html', label: 'Contact' }]).map(function (l) { return '<a href="' + l.href + '">' + l.label + '</a>'; }).join('') +
        '</nav>' +
        '<div class="foot-links">' +
          '<a href="mailto:' + C.email + '">Email</a>' +
          '<a href="' + C.behance + '" target="_blank" rel="noopener">Behance</a>' +
          '<a href="' + C.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="' + C.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
          '<a href="assets/cv/Vivek_Kumar_CV.pdf" download>Download CV</a>' +
        '</div>' +
        '<div class="foot-end"><span>© ' + new Date().getFullYear() + ' Vivek Kumar</span><a class="to-top" href="#main" aria-label="Back to top">↑</a></div>' +
      '</div>';
  }

  /* Reveal setup:
     1. Big headings rise in word by word.
     2. Common blocks get a reveal automatically, so new content animates too.
     3. Items inside grids and lists are staggered. */
  if (!reduceMotion) {
    $$('h1.display, h2.display, .cta h2, .intro-p').forEach(function (h) {
      var wi = 0;
      var wrap = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              var o = document.createElement('span'); o.className = 'rw';
              var i = document.createElement('span'); i.textContent = part; i.style.setProperty('--wi', wi++);
              o.appendChild(i); frag.appendChild(o);
            });
            n.parentNode.replaceChild(frag, n);
          } else if (n.nodeType === 1 && n.tagName !== 'BR' && !n.classList.contains('rw')) { wrap(n); }
        });
      };
      var full = h.textContent.replace(/\s+/g, ' ').trim();
      wrap(h);
      $$('.rw', h).forEach(function (w) { w.setAttribute('aria-hidden', 'true'); });
      // screen readers read this copy of the text, not the split-up words
      var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = full; h.appendChild(sr);
      if (!h.closest('[data-reveal]')) h.setAttribute('data-words', '');
    });

    var AUTO = ['.page-hero > *:not(.ast)', '.sec-head', '.proj-sec', '.faq-item', '.link-rows a', '.cta-grid > *', '.cta .socials',
      '.foot-grid', '.svc-list .svc', '.cap-col', '.filters', '.journal-empty', '.read', '.w-list li'];
    $$(AUTO.join(',')).forEach(function (el) { if (!el.hasAttribute('data-reveal') && !el.closest('[data-reveal]')) el.setAttribute('data-reveal', ''); });
    $$('.ph-copy > .lead, .ph-copy > .proj-meta, .ph-copy > .btn-row').forEach(function (el, i) { el.setAttribute('data-reveal', ''); el.style.setProperty('--d', (.3 + i * .1) + 's'); });
    $$('.page-hero > [data-reveal]').forEach(function (el, i) { el.style.setProperty('--d', (i * .08) + 's'); });

    var STAGGER = '.work-grid, .cases, .rows, .svc-tiles, .glance dl, .gal, .steps-grid, .bento, .reads, .faq-list, .link-rows, .svc-list, .capboard, .w-list, .chips';
    $$(STAGGER).forEach(function (g) {
      Array.prototype.slice.call(g.children)
        .filter(function (k) { return k.hasAttribute('data-reveal'); })
        .forEach(function (k, i) { if (!k.style.getPropertyValue('--d')) k.style.setProperty('--d', ((i % 4) * .08) + 's'); });
    });
  }

  var revealTargets = $$('[data-reveal], [data-words]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // While the intro or the arrival curtain is up, hold reveals so they play once the page is visible
    var held = [];
    var show = function (el) {
      if (document.body.classList.contains('intro-on') || (root.classList.contains('is-arriving') && !root.classList.contains('is-revealing'))) { held.push(el); return; }
      el.classList.add('is-in');
    };
    window.__flushReveals = function () { held.splice(0).forEach(function (el) { el.classList.add('is-in'); }); };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    // The footer sits at the very end of the page, inside the bottom margin above,
    // so it gets its own observer that fires as soon as any of it is visible
    var ioEnd = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); ioEnd.unobserve(e.target); } });
    }, { threshold: 0.01 });
    revealTargets.forEach(function (el) { (el.closest('.foot') ? ioEnd : io).observe(el); });
    // Safety net: whatever is already on screen shows even if the observer is throttled
    setTimeout(function () {
      revealTargets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0 && !el.classList.contains('is-in')) { show(el); io.unobserve(el); ioEnd.unobserve(el); }
      });
    }, 300);
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }


  /* ---------- 6. Toast and copy email ---------- */
  var toast;
  window.showToast = function (msg) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toast._t); toast._t = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var text = b.getAttribute('data-copy');
    var done = function () { window.showToast('Email copied'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy the email:', text); });
    else window.prompt('Copy the email:', text);
  });


  /* ---------- 7. Blob eyes, "hello" cursor ---------- */
  var eyes = $('.blob .eyes');
  if (eyes && finePointer && !reduceMotion) {
    var blob = $('.blob');
    window.addEventListener('pointermove', function (e) {
      var r = blob.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var d = Math.hypot(dx, dy) || 1, m = Math.min(10, d / 30);
      eyes.style.transform = 'translate(' + (dx / d * m).toFixed(1) + 'px,' + (dy / d * m).toFixed(1) + 'px)';
    });
  }

  if (finePointer) {
    var cbox = document.createElement('div');
    cbox.className = 'cur'; cbox.setAttribute('aria-hidden', 'true');
    cbox.innerHTML = '<i></i><span>hello</span>';
    document.body.appendChild(cbox);
    var lab = $('span', cbox), tx = 0, ty = 0, cx = 0, cy = 0, craf = null;
    var LABELS = { a: 'open', button: 'click', copy: 'copy', write: 'write' };
    var follow = function () {
      cx += (tx - cx) * (reduceMotion ? 1 : .22); cy += (ty - cy) * (reduceMotion ? 1 : .22);
      cbox.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      craf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .3) ? requestAnimationFrame(follow) : null;
    };
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY; cbox.classList.add('is-on');
      if (!craf) craf = requestAnimationFrame(follow);
    });
    document.addEventListener('mouseleave', function () { cbox.classList.remove('is-on'); });
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, input, textarea, summary');
      var txt = 'hello';
      if (t) {
        var k = t.getAttribute('data-cursor');
        if (k) txt = LABELS[k] || k;
        else if (/^(input|textarea)$/i.test(t.tagName)) txt = '';
        else if (t.tagName === 'A' && t.target === '_blank') txt = 'new tab';
        else txt = t.tagName === 'A' ? 'open' : 'click';
      }
      if (nav && mini && t && t.classList.contains('nav-logo')) txt = 'open menu bar';
      cbox.classList.toggle('is-big', !!t);
      cbox.classList.toggle('is-hidden', !txt);
      if (txt) lab.textContent = txt;
    });
  }


  /* ---------- 8. Intro (Home, once per session) ---------- */
  var introSeen = true;
  try { introSeen = sessionStorage.getItem('vk-intro') === '1'; sessionStorage.setItem('vk-intro', '1'); } catch (e) {}
  if (page === 'home' && !introSeen && !reduceMotion) {
    var touch = window.matchMedia('(hover: none)').matches;
    var intro = document.createElement('div');
    intro.className = 'intro'; intro.setAttribute('aria-hidden', 'true');
    intro.innerHTML = '<div class="bubble"><span class="typed"></span><i class="caret"></i></div>' +
      '<p class="skiphint"><span>' + (touch ? 'tap anywhere to skip' : 'click or press any key to skip') + '</span></p>';
    document.body.appendChild(intro);
    document.body.classList.add('intro-on');
    root.classList.add('is-locked');
    if (lenis) lenis.stop();
    var out = $('.typed', intro), lines = ['Hey there!', 'Welcome to my portfolio.'], li = 0, ci = 0, finished = false;
    var finish = function () {
      if (finished) return; finished = true;
      intro.classList.add('is-out');
      document.body.classList.remove('intro-on');
      root.classList.remove('is-locked');
      if (lenis) lenis.start();
      setTimeout(function () { if (window.__flushReveals) window.__flushReveals(); }, 350);
      document.removeEventListener('keydown', finish);
      setTimeout(function () { intro.remove(); }, 1400);
    };
    var type = function () {
      if (finished) return;
      if (ci < lines[li].length) { out.textContent += lines[li][ci++]; setTimeout(type, li ? 46 : 50); }
      else if (li < lines.length - 1) setTimeout(function () { out.textContent = ''; li++; ci = 0; type(); }, 300);
      else setTimeout(finish, 320);
    };
    setTimeout(type, 250);
    intro.addEventListener('click', finish);
    document.addEventListener('keydown', finish);
    setTimeout(finish, 5000); // never trap the visitor
  }


  /* ---------- 9. Page transitions: cobalt curtain ----------
     Leaving: a cobalt panel slides up over the page, then we navigate.
     Arriving: the inline head script adds html.is-arriving BEFORE the first
     paint, so the same cobalt panel is already there (no flash). Once fonts
     are ready it lifts off with a single GPU transform. */
  var curtain = document.createElement('div');
  curtain.className = 'curtain'; curtain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtain);
  try { sessionStorage.removeItem('vk-curtain'); } catch (e) {}

  var lift = function () {
    if (!root.classList.contains('is-arriving') || root.classList.contains('is-revealing')) return;
    root.classList.add('is-revealing');
    setTimeout(function () { if (window.__flushReveals) window.__flushReveals(); }, 180);
    setTimeout(function () { root.classList.remove('is-arriving', 'is-revealing'); }, 720);
  };
  if (root.classList.contains('is-arriving')) {
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 450); })]).then(function () {
      requestAnimationFrame(function () { requestAnimationFrame(lift); });
      setTimeout(lift, 120); // in case rAF is throttled
    });
  }

  var isInternal = function (a) {
    var href = a.getAttribute('href');
    return href && a.target !== '_blank' && href.charAt(0) !== '#' && !/^(mailto|tel|https?):/i.test(href) && !a.hasAttribute('download');
  };

  // Prefetch internal pages on hover or touch so the next page is already cached
  var fetched = {};
  var prefetch = function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !isInternal(a)) return;
    var url = a.href.split('#')[0];
    if (fetched[url] || url === location.href.split('#')[0]) return;
    fetched[url] = 1;
    var l = document.createElement('link'); l.rel = 'prefetch'; l.href = url; document.head.appendChild(l);
  };
  document.addEventListener('pointerover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });

  var leaving = false;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || !isInternal(a)) return;
    if (reduceMotion) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    try { sessionStorage.setItem('vk-curtain', '1'); } catch (err) {}
    if (lenis) lenis.stop();
    var went = false;
    var go = function () { if (went) return; went = true; window.location.href = a.href; };
    curtain.addEventListener('transitionend', go, { once: true });
    setTimeout(go, 650); // fallback
    requestAnimationFrame(function () { curtain.classList.add('is-in'); });
    setTimeout(function () { curtain.classList.add('is-in'); }, 30);
  });
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    leaving = false; curtain.className = 'curtain';
    root.classList.remove('is-arriving', 'is-revealing');
    if (lenis) lenis.start();
  });
})();
