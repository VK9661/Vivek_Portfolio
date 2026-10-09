/* =====================================================================
   Shared components + interactions for every page.
   Pages mark slots with data attributes and this file fills them:
     <header data-site-nav>    floating pill nav + full-screen menu
     <div data-site-cta>       pink "let's talk" band
     <footer data-site-foot>   footer row
   Page scripts that render content run BEFORE this file.
   ===================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var C = window.CONTACT || {};
  var page = document.body.getAttribute('data-page') || '';

  /* ---------- Smooth scrolling (Lenis) ----------
     Lenis smooths wheel/trackpad scrolling while keeping native scroll,
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
    var lraf = function (time) { lenis.raf(time); requestAnimationFrame(lraf); };
    requestAnimationFrame(lraf);
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

  /* ---------- Nav ---------- */
  var LINKS = [
    { href: 'index.html', key: 'home', label: 'Home' },
    { href: 'work.html', key: 'work', label: 'Work' },
    { href: 'about.html', key: 'about', label: 'About' },
    { href: 'services.html', key: 'services', label: 'Services' },
    { href: 'journal.html', key: 'journal', label: 'Journal' },
    { href: 'playground.html', key: 'play', label: 'Playground' }
  ];
  var current = page === 'project' ? 'work' : page;
  var cur = function (k) { return k === current ? ' aria-current="page"' : ''; };

  var navSlot = $('[data-site-nav]');
  if (navSlot) {
    navSlot.innerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<nav class="nav" aria-label="Primary">' +
        '<a class="nav-logo" href="index.html" aria-label="Vivek Kumar, home">VK</a>' +
        '<div class="nav-links">' + LINKS.slice(1).map(function (l) {
          return '<a class="l" href="' + l.href + '"' + cur(l.key) + '>' + l.label + '</a>';
        }).join('') + '</div>' +
        '<button class="nav-menu" type="button" aria-expanded="false" aria-controls="menu-panel"><span>Menu</span><i aria-hidden="true"></i></button>' +
        '<a class="btn btn--sun btn--sm nav-cta" href="contact.html"' + cur('contact') + '>Say hello</a>' +
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

    var menuBtn = $('.nav-menu'), panel = $('#menu-panel');
    var setMenu = function (open) {
      panel.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.firstChild.textContent = open ? 'Close' : 'Menu';
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
      if (open) { var first = $('a.m', panel); if (first) first.focus({ preventScroll: true }); }
    };
    menuBtn.addEventListener('click', function () { setMenu(!panel.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- Contact band ---------- */
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

  /* ---------- Footer ---------- */
  var footSlot = $('[data-site-foot]');
  if (footSlot) {
    footSlot.className = 'foot';
    footSlot.innerHTML =
      '<div class="wrap foot-row">' +
        '<span>© ' + new Date().getFullYear() + ' Vivek Kumar · Graphic, UI/UX &amp; motion designer</span>' +
        '<div class="foot-links">' +
          '<a href="mailto:' + C.email + '">Email</a>' +
          '<a href="' + C.behance + '" target="_blank" rel="noopener">Behance</a>' +
          '<a href="' + C.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="' + C.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
        '</div>' +
        '<a class="to-top" href="#main" aria-label="Back to top">↑</a>' +
      '</div>';
  }

  /* ---------- Letter drop for the hero headline ---------- */
  $$('.js-drop').forEach(function (el) {
    var i = 0, rot = [-4, 6, -8, 3, -5, 7, -3, 5, -6, 4];
    $$('.row', el).forEach(function (row) {
      var text = row.textContent;
      row.setAttribute('aria-hidden', 'true');
      row.innerHTML = text.split('').map(function (ch) {
        var r = rot[i % rot.length], y = (i % 3 - 1) * .03;
        return '<span class="L" style="--i:' + (i++) + ';--r:' + r + 'deg;--y:' + y + 'em">' + ch + '</span>';
      }).join('');
    });
  });

  /* ---------- Reveal setup ----------
     1. Big headings rise in word by word.
     2. Common blocks get a reveal automatically, so new content animates too.
     3. Items inside grids and lists are staggered. */
  if (!reduceMotion) {
    $$('h1.display:not(.js-drop), h2.display, .cta h2, .intro-p').forEach(function (h) {
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
      if (!h.getAttribute('aria-label')) h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
      wrap(h);
      $$('.rw', h).forEach(function (w) { w.setAttribute('aria-hidden', 'true'); });
      if (!h.closest('[data-reveal]')) h.setAttribute('data-words', '');
    });

    var AUTO = ['.page-hero > *:not(.ast)', '.hero-copy > *', '.sec-head', '.proj-sec', '.proj-head > *', '.board-stack img', '.faq-item',
      '.link-rows a', '.cta-grid > *', '.cta .socials', '.foot-row', '.svc-list .svc', '.cap-col', '.filters', '.journal-empty', '.read', '.w-list li'];
    $$(AUTO.join(',')).forEach(function (el) { if (!el.hasAttribute('data-reveal') && !el.closest('[data-reveal]')) el.setAttribute('data-reveal', ''); });
    $$('.ph-copy > .lead, .ph-copy > .proj-meta, .ph-copy > .btn-row').forEach(function (el, i) { el.setAttribute('data-reveal', ''); el.style.setProperty('--d', (.3 + i * .1) + 's'); });
    $$('.hero-copy > [data-reveal]').forEach(function (el, i) { el.style.setProperty('--d', (.35 + i * .09) + 's'); });
    $$('.page-hero > [data-reveal]').forEach(function (el, i) { el.style.setProperty('--d', (i * .08) + 's'); });

    var STAGGER = '.work-grid, .cases, .rows, .svc-tiles, .glance dl, .principles, .steps-grid, .bento, .slots, .reads, .faq-list, .link-rows, .svc-list, .capboard, .w-list, .chips';
    $$(STAGGER).forEach(function (g) {
      var kids = Array.prototype.slice.call(g.children).filter(function (k) { return k.hasAttribute('data-reveal'); });
      kids.forEach(function (k, i) { if (!k.style.getPropertyValue('--d')) k.style.setProperty('--d', ((i % 4) * .08) + 's'); });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = $$('[data-reveal], [data-words]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // While the intro or the arrival curtain is up, hold reveals so they play when the page is visible
    var held = [];
    var show = function (el) {
      if (document.body.classList.contains('intro-on') || (document.documentElement.classList.contains('is-arriving') && !document.documentElement.classList.contains('is-revealing'))) { held.push(el); return; }
      el.classList.add('is-in');
    };
    window.__flushReveals = function () { held.splice(0).forEach(function (el) { el.classList.add('is-in'); }); };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealTargets.forEach(function (el) { io.observe(el); });
    // Safety net: whatever is already on screen shows even if the observer is throttled
    setTimeout(function () {
      revealTargets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0 && !el.classList.contains('is-in')) { show(el); io.unobserve(el); }
      });
    }, 300);
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Toast + copy ---------- */
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

  /* ---------- Draggable ---------- */
  window.makeDraggable = function (el, opts) {
    opts = opts || {};
    var bounds = opts.bounds || el.offsetParent || document.body;
    var startX, startY, baseX, baseY, moved = false, pid = null;
    if (el.tabIndex < 0) el.tabIndex = 0;
    el.setAttribute('data-cursor', el.getAttribute('data-cursor') || 'drag');
    var get = function () { return { x: parseFloat(el.dataset.dx || 0), y: parseFloat(el.dataset.dy || 0) }; };
    var set = function (x, y) { el.dataset.dx = x; el.dataset.dy = y; el.style.translate = x + 'px ' + y + 'px'; };
    var zTop = function () { window.__z = (window.__z || 10) + 1; el.style.zIndex = window.__z; };
    el.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      pid = e.pointerId; el.setPointerCapture(pid); moved = false;
      startX = e.clientX; startY = e.clientY; var p = get(); baseX = p.x; baseY = p.y;
      el.classList.add('is-dragging'); zTop();
    });
    el.addEventListener('pointermove', function (e) {
      if (pid !== e.pointerId) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      var b = bounds.getBoundingClientRect(), r = el.getBoundingClientRect(), c = get();
      var minX = c.x - (r.left - b.left), maxX = c.x + (b.right - r.right);
      var minY = c.y - (r.top - b.top), maxY = c.y + (b.bottom - r.bottom);
      set(Math.min(maxX, Math.max(minX, baseX + dx)), Math.min(maxY, Math.max(minY, baseY + dy)));
    });
    var end = function (e) {
      if (pid !== e.pointerId) return;
      pid = null; el.classList.remove('is-dragging');
      if (!moved && opts.onTap) opts.onTap(e);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 40 : 10, p = get(), k = e.key;
      if (k === 'ArrowLeft') set(p.x - step, p.y); else if (k === 'ArrowRight') set(p.x + step, p.y);
      else if (k === 'ArrowUp') set(p.x, p.y - step); else if (k === 'ArrowDown') set(p.x, p.y + step);
      else if (k === 'Enter' && opts.onTap) { opts.onTap(e); return; } else return;
      e.preventDefault(); zTop();
    });
    el.resetDrag = function () { set(0, 0); };
  };
  $$('[data-drag]').forEach(function (el) {
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.trim() + ' (sticker, drag or use arrow keys to move)');
    window.makeDraggable(el);
  });

  /* ---------- Blob eyes follow the pointer ---------- */
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

  /* ---------- "hello" cursor bubble ---------- */
  if (finePointer) {
    var cbox = document.createElement('div');
    cbox.className = 'cur'; cbox.setAttribute('aria-hidden', 'true');
    cbox.innerHTML = '<i></i><span>hello</span>';
    document.body.appendChild(cbox);
    var lab = $('span', cbox), tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    var LABELS = { a: 'open', button: 'click', drag: 'drag me', copy: 'copy', write: 'write' };
    var loop = function () {
      cx += (tx - cx) * (reduceMotion ? 1 : .22); cy += (ty - cy) * (reduceMotion ? 1 : .22);
      cbox.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .3) ? requestAnimationFrame(loop) : null;
    };
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY; cbox.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(loop);
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
      cbox.classList.toggle('is-big', !!t);
      cbox.classList.toggle('is-hidden', !txt);
      if (txt) lab.textContent = txt;
    });
  }

  /* ---------- Intro (Home, once per session) ---------- */
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
    document.documentElement.classList.add('is-locked');
    if (lenis) lenis.stop();
    var out = $('.typed', intro), lines = ['Hey there!', 'Welcome to my portfolio.'], li = 0, ci = 0, finished = false;
    var done = function () {
      if (finished) return; finished = true;
      intro.classList.add('is-out');
      document.body.classList.remove('intro-on');
      document.documentElement.classList.remove('is-locked');
      if (lenis) lenis.start();
      setTimeout(function () { if (window.__flushReveals) window.__flushReveals(); }, 350);
      document.removeEventListener('keydown', done);
      setTimeout(function () { intro.remove(); }, 1400);
    };
    var type = function () {
      if (finished) return;
      if (ci < lines[li].length) { out.textContent += lines[li][ci++]; setTimeout(type, li ? 46 : 50); }
      else if (li < lines.length - 1) setTimeout(function () { out.textContent = ''; li++; ci = 0; type(); }, 300);
      else setTimeout(done, 320);
    };
    setTimeout(type, 250);
    intro.addEventListener('click', done);
    document.addEventListener('keydown', done);
    setTimeout(done, 5000); // never trap the visitor
  }

  /* ---------- Page transitions: cobalt curtain ----------
     Leaving: a cobalt panel slides up over the page, then we navigate.
     Arriving: an inline <head> script adds html.is-arriving BEFORE the first
     paint, so the same cobalt panel is already there (no flash). Once fonts
     are ready we lift it off with a single GPU transform. */
  var root = document.documentElement;
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

  // Prefetch internal pages on hover / touch so the next page is already cached
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
    if (window.__lenis) window.__lenis.stop();
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
    if (window.__lenis) window.__lenis.start();
  });
})();
