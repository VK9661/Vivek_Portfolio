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
      3. Nav: fold on scroll           8. Link prefetch
      4. Day / night theme
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
     Lenis glides wheel and trackpad scrolling toward its target a little
     each frame (lerp), which feels softer than a fixed duration. Touch
     keeps the phone's own native scrolling, which is already the smoothest
     there; sticky elements and keyboard scrolling still work as normal. */
  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      syncTouch: false
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
    { href: 'services.html', key: 'services', label: 'Services' }
  ];
  var current = page === 'project' ? 'work' : page;
  var cur = function (k) { return k === current ? ' aria-current="page"' : ''; };

  var navSlot = $('[data-site-nav]');
  var nav = null, themeBtn = null, menuBtn = null, panel = null;
  if (navSlot) {
    navSlot.innerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<nav class="nav" aria-label="Primary">' +
        '<a class="nav-logo" href="index.html" aria-label="Vivek Kumar, home"><span class="mono" aria-hidden="true">VK</span><img src="assets/img/me/avatar.webp" alt="" width="42" height="42"></a>' +
        '<div class="nav-fold nav-fold--links"><span><span class="nav-links">' + LINKS.slice(1).map(function (l) {
          return '<a class="l" href="' + l.href + '"' + cur(l.key) + '>' + l.label + '</a>';
        }).join('') + '</span></span></div>' +
        '<div class="nav-fold nav-fold--menu"><span>' +
          '<button class="nav-menu" type="button" aria-expanded="false" aria-controls="menu-panel" aria-label="Menu">' +
            '<span class="nav-fold nav-fold--label"><span><span class="nav-menu-text" aria-hidden="true">Menu</span></span></span><i aria-hidden="true"></i>' +
          '</button>' +
        '</span></div>' +
        '<div class="nav-fold nav-fold--cta"><span><a class="btn btn--sun btn--sm nav-cta" href="contact.html"' + cur('contact') + '>Say hello</a></span></div>' +
      // The switch stays in the nav on small screens, clear of page content.
      '<button class="tsw" type="button" role="switch" aria-checked="false" aria-label="Night mode">' +
        '<span class="tsw-sky" aria-hidden="true">' +
          '<i class="tsw-star s1"></i><i class="tsw-star s2"></i><i class="tsw-star s3"></i><i class="tsw-star s4"></i>' +
          '<i class="tsw-cloud c1"></i><i class="tsw-cloud c2"></i>' +
        '</span>' +
        '<span class="tsw-knob" aria-hidden="true"><span class="tsw-rays"></span><span class="tsw-face"><i></i><i></i></span></span>' +
      '</button></nav>' +
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

    nav = $('.nav'); themeBtn = $('.tsw'); menuBtn = $('.nav-menu'); panel = $('#menu-panel');
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
      if (!mini || menuOpen() || e.target.closest('.nav-menu, .tsw')) return;
      e.preventDefault();
      travel = 0;
      setMini(false);
    });
    // (keyboard focus only: a mouse or touch press also focuses, and must stay a tap)
    nav.addEventListener('focusin', function (e) {
      if (mini && !menuOpen() && e.target.matches(':focus-visible') && !e.target.closest('.nav-menu')) setMini(false);
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
      themeBtn.setAttribute('aria-checked', String(dark));
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
          '<h2 id="cta-title">Got a project?<br>Say hello.</h2>' +
          '<p class="lead">Open to design roles and freelance projects in graphic, UI/UX, motion and video. Send a note and I’ll reply soon.</p>' +
          '<div class="row-actions">' +
            '<a class="mail" href="mailto:' + C.email + '?subject=Portfolio%20enquiry">' + C.email + '</a>' +
            '<button class="btn btn--white btn--sm" type="button" data-copy="' + C.email + '">Copy email</button>' +
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
          '<span class="foot-avail"><i class="dot" aria-hidden="true"></i>Open to roles and freelance projects</span></div>' +
        '<nav class="foot-links" aria-label="Footer">' +
          '<span class="foot-h">Pages</span>' +
          LINKS.concat([{ href: 'contact.html', label: 'Contact' }]).map(function (l) { return '<a href="' + l.href + '">' + l.label + '</a>'; }).join('') +
        '</nav>' +
        '<div class="foot-links">' +
          '<span class="foot-h">Elsewhere</span>' +
          '<a href="mailto:' + C.email + '">Email</a>' +
          '<a href="' + C.behance + '" target="_blank" rel="noopener">Behance</a>' +
          '<a href="' + C.book + '" target="_blank" rel="noopener">Portfolio book on Behance</a>' +
          '<a href="' + C.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="' + C.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
          '<a href="assets/cv/Vivek_Kumar_CV.pdf" download>Download CV</a>' +
          '<a href="assets/cv/Vivek_Kumar_Portfolio.pdf" download>Download portfolio PDF</a>' +
        '</div>' +
        '<div class="foot-end"><span>© ' + new Date().getFullYear() + ' Vivek Kumar</span><a class="to-top" href="#main" aria-label="Back to top">↑</a></div>' +
      '</div>' +
      '<div class="wrap foot-mark-wrap"><p class="foot-mark" aria-hidden="true" data-mark="Vivek Kumar"></p></div>';
  }

  /* ---------- 5b. Doodles around every section head, in the hero's colours ---------- */
  var DOODLES = [
    ['spark', '<svg viewBox="0 0 40 40"><path d="M20 0c1.5 11 7 17.5 20 20-13 2.5-18.5 9-20 20-1.5-11-7-17.5-20-20 13-2.5 18.5-9 20-20z"/></svg>'],
    ['burst', '<svg viewBox="0 0 100 100"><path d="M50 4v30M50 66v30M4 50h30M66 50h30M17 17l21 21M62 62l21 21M83 17L62 38M38 62L17 83"/></svg>'],
    ['squig', '<svg viewBox="0 0 70 50"><path d="M4 30c10-22 20-22 22 0s14 20 22 0 14-22 18-8"/></svg>'],
    ['loop', '<svg viewBox="0 0 70 70"><path d="M10 18c26-10 40 6 30 20S16 50 30 58s26-6 30-16"/><path d="M52 36l9 7-11 3"/></svg>']
  ];
  var DCOLS = ['var(--pink)', 'var(--sun)', 'var(--mint)', 'var(--blue)', 'var(--lilac)'];
  $$('.sec-head').forEach(function (h, i) {
    var a = DOODLES[0], b = DOODLES[1 + (i % 3)];
    var ca = DCOLS[i % DCOLS.length], cb = DCOLS[(i + 2) % DCOLS.length];
    if (h.closest('.pop')) { ca = h.closest('.pop--ink') ? 'var(--pink)' : 'var(--sun)'; cb = h.closest('.pop--ink') ? 'var(--blue)' : '#fff'; }
    h.insertAdjacentHTML('beforeend',
      '<span class="s-doodle s-doodle--a s-doodle--' + a[0] + '" style="--dc:' + ca + '" aria-hidden="true">' + a[1] + '</span>' +
      '<span class="s-doodle s-doodle--b s-doodle--' + b[0] + '" style="--dc:' + cb + '" aria-hidden="true">' + b[1] + '</span>');
  });

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
      '.foot-grid', '.svc-list .svc', '.cap-col', '.filters', '.read', '.w-list li'];
    $$(AUTO.join(',')).forEach(function (el) { if (!el.hasAttribute('data-reveal') && !el.closest('[data-reveal]')) el.setAttribute('data-reveal', ''); });
    $$('.ph-copy > .lead, .ph-copy > .proj-meta, .ph-copy > .btn-row').forEach(function (el, i) { el.setAttribute('data-reveal', ''); el.style.setProperty('--d', (.3 + i * .1) + 's'); });
    $$('.page-hero > [data-reveal]').forEach(function (el, i) { el.style.setProperty('--d', (i * .08) + 's'); });

    var STAGGER = '.work-grid, .cases, .rows, .svc-tiles, .glance dl, .gal, .oc-grid, .steps-grid, .bento, .reads, .faq-list, .link-rows, .svc-list, .capboard, .w-list, .chips';
    $$(STAGGER).forEach(function (g) {
      Array.prototype.slice.call(g.children)
        .filter(function (k) { return k.hasAttribute('data-reveal'); })
        .forEach(function (k, i) { if (!k.style.getPropertyValue('--d')) k.style.setProperty('--d', ((i % 4) * .08) + 's'); });
    });
  }

  // While the page scrolls, small looping decorations rest (style.css), so scrolling gets every frame
  var scrollRest = null;
  window.addEventListener('scroll', function () {
    if (!scrollRest) root.classList.add('is-scrolling');
    clearTimeout(scrollRest);
    scrollRest = setTimeout(function () { scrollRest = null; root.classList.remove('is-scrolling'); }, 200);
  }, { passive: true });

  // Looping decorations (marquees, spinning badges, the contact band rays) rest while off screen
  if ('IntersectionObserver' in window) {
    var ioLoop = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-offscreen', !e.isIntersecting); });
    }, { rootMargin: '120px 0px' });
    $$('.hp, .tape, .ph-art, .ph-tape, .cta, .foot, .pop').forEach(function (el) { ioLoop.observe(el); });
  }

  var revealTargets = $$('[data-reveal], [data-words]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var show = function (el) { el.classList.add('is-in'); };
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


  /* ---------- 7. Blob eyes ---------- */
  // Every blob on the page (the one in the contact band and any peeking over a colour block) watches the cursor
  var blobs = $$('.blob');
  if (blobs.length && finePointer && !reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      blobs.forEach(function (blob) {
        var r = blob.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        var d = Math.hypot(dx, dy) || 1, m = Math.min(10, d / 30);
        $('.eyes', blob).style.transform = 'translate(' + (dx / d * m).toFixed(1) + 'px,' + (dy / d * m).toFixed(1) + 'px)';
      });
    });
  }



  /* ---------- 8. Prefetch likely next pages without delaying navigation ---------- */
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

  // Warm the featured case study before a visitor reaches Selected Work.
  if (page === 'home') {
    var warmFeatured = function () {
      var featured = $('#featured > .work-card:first-child');
      if (!featured || fetched[featured.href]) return;
      fetched[featured.href] = 1;
      var hint = document.createElement('link');
      hint.rel = 'prefetch';
      hint.href = featured.href;
      document.head.appendChild(hint);
    };
    if ('requestIdleCallback' in window) requestIdleCallback(warmFeatured, { timeout: 2500 });
    else setTimeout(warmFeatured, 1400);
  }

})();
