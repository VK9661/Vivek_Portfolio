/* Project page: renders project-<id>.html (or project.html?id=<id>) from
   window.PROJECTS, then the cover tilt (mouse) and scroll drift. */
(function () {
  var list = window.PROJECTS, esc = window.escapeHTML;
  var id = document.body.getAttribute('data-project') || new URLSearchParams(location.search).get('id');
  var idx = list.findIndex(function (p) { return p.id === id; });
  // Old project.html?id= links move to the project's own page, whose link preview shows the project
  if (idx > -1 && !document.body.hasAttribute('data-project')) { location.replace('project-' + id + '.html' + location.hash); return; }
  var root = document.getElementById('project');

  if (idx < 0) {
    document.title = 'Project not found | Vivek Kumar';
    root.innerHTML = '<div class="nf"><h1 class="display t-xl">Not found</h1><p class="lead">That project doesn’t exist (yet).</p><a class="btn" href="work.html">All work <span class="ar" aria-hidden="true">&#8599;</span></a></div>';
    return;
  }

  var p = list[idx];
  var prev = list[(idx - 1 + list.length) % list.length], next = list[(idx + 1) % list.length];
  document.title = p.title + ': ' + p.kind + ' | Vivek Kumar';
  var md = document.querySelector('meta[name="description"]'); if (md) md.content = p.summary;

  // Accent: the project's colour, but light enough to carry ink text (ink projects get sun, cobalt ones lilac)
  var sw = window.swatchOf(p), accent = p.color === 'ink' ? window.SWATCH.sun : p.color === 'blue' ? window.SWATCH.lilac : sw;
  var num = String(idx + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
  var meta = '<div class="proj-meta">' +
    p.tags.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') +
  '</div>';
  // The intro: its first sentence large, the rest as body text
  var intro = (function (t) { var m = t.match(/^(.+?[.!?]["”]?)\s+(.+)$/); return m ? [m[1], m[2]] : [t, '']; })(p.about || '');
  var tapeWords = [p.kind].concat(p.tags, p.published ? ['Published ' + p.published] : []);
  var tapeHTML = ''; for (var k = 0; k < 6; k++) tapeWords.forEach(function (w) { tapeHTML += '<span>' + esc(w) + '</span><i>✳</i>'; });

  // At a glance: the problem, the idea and either verified proof or what was delivered
  function glance() {
    var ch = (p.writeup || []).filter(function (s) { return s.h === 'The challenge'; })[0];
    var ap = (p.writeup || []).filter(function (s) { return s.h === 'The approach'; })[0];
    var idea = ap && ap.p && ap.p[0] ? (ap.p[0].match(/^(.+?[.!?])(\s|$)/) || [0, ap.p[0]])[1] : '';
    var cell = function (title, col, body) { return '<div class="gl-i" style="--c:' + col + '"><h2>' + title + '</h2>' + body + '</div>'; };
    var list = function (items) { return '<ul>' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; };
    var cells = '';
    if (ch && ch.list) cells += cell('The problem', 'var(--pink)', (ch.p && ch.p[0] ? '<p class="gl-lead">' + esc(ch.p[0]) + '</p>' : '') + list(ch.list.slice(0, 2)));
    if (idea) cells += cell('The idea', 'var(--sun)', '<p>' + esc(idea) + '</p>');
    if (p.proof && p.proof.length) cells += cell('Evidence', 'var(--mint)', list(p.proof.slice(0, 3)));
    else if (p.outcome && p.outcome.delivered) cells += cell('Delivered', 'var(--mint)', list(p.outcome.delivered.slice(0, 3)));
    return cells ? '<section class="glance-card" aria-label="At a glance" data-reveal>' + cells + '</section>' : '';
  }

  // The films from the Behance post. A poster and a play button first; the player loads only on press
  function watch() {
    if (!p.video || !p.video.items || !p.video.items.length) return '';
    var v = p.video, many = v.items.length > 1;
    return '<section class="watch" aria-labelledby="watch-title">' +
      '<div class="sec-head" data-reveal><div><span class="kicker" aria-hidden="true">press play</span><h2 class="display t-lg" id="watch-title">Watch the <em class="hl">' + esc(v.label) + '</em></h2></div></div>' +
      '<div class="vids vids--' + v.items.length + '">' + v.items.map(function (it) {
        return '<figure class="vid-f' + (it[2] > it[1] ? ' vid-f--tall' : '') + '" data-reveal><button class="vid" type="button" data-host="' + esc(v.host || 'vimeo') + '" data-id="' + esc(it[0]) + '" data-title="' + esc(it[3]) + '" style="aspect-ratio:' + it[1] + ' / ' + it[2] + '">' +
          '<img src="assets/img/video/' + esc(it[0]) + '.webp" alt="" loading="lazy" decoding="async">' +
          '<span class="vid-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>' +
          '<span class="sr-only">Play ' + esc(it[3]) + '</span></button>' +
          (many ? '<figcaption>' + esc(it[3]) + '</figcaption>' : '') + '</figure>';
      }).join('') + '</div></section>';
  }

  // Give recruiters one final interface before the long case-study narrative.
  function preview() {
    if ((p.cats || []).indexOf('ux') < 0 || !p.gallery || !p.gallery.length) return '';
    var g = p.gallery[0];
    return '<section class="case-preview" aria-labelledby="preview-title" data-reveal>' +
      '<div class="case-preview-copy"><span class="kicker" aria-hidden="true">final interface</span><h2 class="display t-lg" id="preview-title">A quick <em class="hl">look</em></h2></div>' +
      '<figure><img src="' + g[0] + '" alt="' + esc(p.title) + ': ' + esc(g[3]) + '" width="' + g[1] + '" height="' + g[2] + '" loading="lazy" decoding="async"><figcaption>' + esc(g[3]) + '</figcaption></figure>' +
    '</section>';
  }

  var html =
    '<header class="ph" style="--accent:' + accent + ';--c:' + sw + '">' +
      '<div class="ph-bar">' +
        '<a class="back" href="work.html">← All work</a>' +
        '<span class="ph-count" aria-label="Project ' + (idx + 1) + ' of ' + list.length + '">' + num + '</span>' +
      '</div>' +
      '<div class="ph-grid">' +
        '<div class="ph-copy">' +
          '<span class="ph-kind">' + esc(p.kind) + '</span>' +
          '<h1 class="ph-title">' + esc(p.title) + '</h1>' +
          '<p class="lead">' + esc(p.summary) + '</p>' + meta +
          '<div class="btn-row">' +
            (p.behance ? '<a class="btn" href="' + p.behance + '" target="_blank" rel="noopener noreferrer">View on Behance <span class="ar" aria-hidden="true">&#8599;</span></a>' : '') +
            '<a class="btn btn--white" href="#story">Read the story <span class="ar" aria-hidden="true">&#8595;</span></a>' +
          '</div>' +
        '</div>' +
        '<div class="ph-art">' +
          '<span class="ph-blob" aria-hidden="true"></span>' +
          '<svg class="ast" viewBox="-50 -50 100 100" aria-hidden="true"><path d="M0-31V31M-31 0H31M-22-22L22 22M-22 22L22-22" stroke="currentColor" stroke-width="21" stroke-linecap="round"/></svg>' +
          '<figure class="ph-cover taped"><img src="' + p.img + '" alt="' + esc(p.title) + ' cover" width="' + p.w + '" height="' + p.h + '"></figure>' +
          (p.year ? '<span class="star ph-year">' + esc(p.published || p.year) + '</span>' : '') +
          '<span class="note ph-note">scroll for<br>the story ↓</span>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<div class="ph-tape" aria-hidden="true" style="--accent:' + accent + '"><div class="track">' + tapeHTML + '</div></div>' +
    '<span id="story"></span>' +
    glance() + preview() + watch() +
    '<section class="proj-overview">' +
      '<div class="facts card" data-reveal><h2 class="eyebrow">Project facts</h2><dl>' +
        (p.facts || []).map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') +
      '</dl>' + (p.behance ? '<a class="btn btn--sm btn--sun" href="' + p.behance + '" target="_blank" rel="noopener noreferrer">Behance <span class="ar" aria-hidden="true">&#8599;</span></a>' : '') + '</div>' +
      '<div class="writeup">' +
        '<div class="w-intro" data-reveal><p class="intro-p">' + esc(intro[0]) + '</p>' + (intro[1] ? '<p class="intro-rest">' + esc(intro[1]) + '</p>' : '') + '</div>' +
        (p.writeup || []).map(function (s, i) {
          var cols = ['var(--pink)', 'var(--sun)', 'var(--mint)', 'var(--sky)', 'var(--lilac)'];
          return '<article class="w-sec" data-reveal style="--c:' + cols[i % cols.length] + '">' +
            '<h2><span class="w-dot" aria-hidden="true"></span>' + esc(s.h) + '</h2>' +
            (s.p || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
            (s.quotes ? '<div class="quotes">' + s.quotes.map(function (q) { return '<blockquote class="note" style="--c:var(--sun)">“' + esc(q) + '”</blockquote>'; }).join('') + '</div>' : '') +
            (s.list ? '<ul class="w-list">' + s.list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
          '</article>';
        }).join('') +
        (p.credits ? '<p class="w-credits" data-reveal>' + esc(p.credits) + '</p>' : '') +
      '</div>' +
    '</section>';

  // Every project: My role, then the design process
  if (p.role) {
    html += '<section class="proj-sec" data-reveal><h2>My role</h2><div class="chips">' +
      p.role.map(function (r) { return '<span class="chip">' + esc(r) + '</span>'; }).join('') + '</div></section>';
  }
  if (p.process) {
    var stepCols = ['var(--sun)', 'var(--pink)', 'var(--mint)', 'var(--lilac)', 'var(--sky)'];
    html += '<section class="proj-sec" data-reveal><h2>Design process</h2><div class="steps">' +
      p.process.map(function (s, i) { return '<div class="step" style="--c:' + stepCols[i % 5] + ';--r:' + (i % 2 ? 2 : -2) + 'deg"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('') + '</div></section>';
  }

  // Outcome: what was delivered, how success would be measured, what it shows
  if (p.outcome) {
    var oc = function (title, items, col) {
      return '<article class="oc" style="--c:' + col + '" data-reveal><h3>' + title + '</h3><ul class="oc-list">' +
        items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></article>';
    };
    html += '<section class="outcome" aria-labelledby="oc-title"><div class="sec-head"><div><span class="kicker" aria-hidden="true">how it landed</span><h2 class="display t-lg" id="oc-title"><em class="hl">Outcome</em></h2>' +
      (p.outcome.note ? '<p class="hand">' + esc(p.outcome.note) + '</p>' : '') + '</div></div>' +
      '<div class="oc-grid">' +
        oc('What I delivered', p.outcome.delivered, 'var(--mint)') +
        oc('How I’d measure success', p.outcome.measure, 'var(--sun)') +
        oc('What it shows', p.outcome.shows, 'var(--lilac)') +
      '</div></section>';
  }

  // A few key images from the presentation; tap one to see it larger
  if (p.gallery && p.gallery.length) {
    html += '<section class="gallery pop pop--ink pop--panel" style="--pop:color-mix(in srgb, ' + accent + ' 36%, #fff)" aria-labelledby="gal-title"><div class="sec-head"><div><span class="kicker" aria-hidden="true">a peek inside</span><h2 class="display t-lg" id="gal-title"><em class="hl">Highlights</em></h2></div></div>' +
      '<div class="gal gal--' + p.gallery.length + '">' + p.gallery.map(function (g) {
        return '<figure class="gal-i" data-reveal><button class="gal-open" type="button" aria-label="View larger: ' + esc(g[3]) + '">' +
          '<img src="' + g[0] + '" alt="' + esc(p.title) + ': ' + esc(g[3]) + '" width="' + g[1] + '" height="' + g[2] + '" loading="lazy" decoding="async"></button>' +
          '<figcaption>' + esc(g[3]) + '</figcaption></figure>';
      }).join('') + '</div></section>';
  }

  if (p.behance) {
    html += '<section class="pending"><div class="card taped" data-reveal><h2>See every frame</h2><p>The full ' + esc(p.title) + ' presentation, with all boards' + (p.cats.indexOf('motion') > -1 ? ' and the animation' : '') + ', lives on Behance.</p>' +
      '<a class="btn" href="' + p.behance + '" target="_blank" rel="noopener noreferrer">Open on Behance <span class="ar" aria-hidden="true">&#8599;</span></a></div></section>';
  }

  // Previous / next: a neutral card with a thumbnail; the project's colour is the accent bar
  // (ink projects borrow lilac, so the bar shows on the dark theme too)
  var accentOf = function (q) { return q.color === 'ink' ? window.SWATCH.lilac : window.swatchOf(q); };
  var pg = function (q, dir) {
    return '<a class="pg pg--' + dir + '" href="project-' + q.id + '.html" style="--c:' + accentOf(q) + '">' +
      '<span class="pg-th"><img src="' + q.img + '" alt="" width="' + q.w + '" height="' + q.h + '" loading="lazy"></span>' +
      '<span class="pg-txt"><span class="pg-dir">' + (dir === 'prev' ? '← Previous project' : 'Next project →') + '</span><b>' + esc(q.title) + '</b><small>' + esc(q.kind) + '</small></span>' +
    '</a>';
  };
  html += '<nav class="pager" aria-label="More projects">' + pg(prev, 'prev') + pg(next, 'next') + '</nav>';

  root.innerHTML = html;

  // Press play: the poster becomes the player (Vimeo or YouTube without tracking, or the site's own file)
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button.vid'); if (!b) return;
    var id = b.getAttribute('data-id'), host = b.getAttribute('data-host'), f;
    if (host === 'file') {
      f = document.createElement('video');
      f.src = 'assets/video/' + id + '.mp4';
      f.controls = true; f.autoplay = true; f.playsInline = true;
      f.setAttribute('aria-label', b.getAttribute('data-title'));
    } else {
      f = document.createElement('iframe');
      f.src = host === 'youtube'
        ? 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'
        : 'https://player.vimeo.com/video/' + id + '?autoplay=1&dnt=1&title=0&byline=0&portrait=0';
      f.title = b.getAttribute('data-title');
      f.allow = 'autoplay; fullscreen; picture-in-picture';
    }
    f.className = 'vid'; f.style.aspectRatio = b.style.aspectRatio;
    b.replaceWith(f);
    f.focus(); // keyboard users land on the player, not back at the top of the page
  });
})();

(function () {
  // Lightbox for the highlights: opens the image at full size, Esc or a tap closes it
  var gal = document.querySelector('.gal');
  if (!gal) return;
  var box = document.createElement('div');
  box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Image viewer'); box.hidden = true;
  box.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">×</button><figure><figcaption></figcaption></figure>';
  document.body.appendChild(box);
  // the image element is created on first open, so the page never holds an <img> without a source
  var img = null, cap = box.querySelector('figcaption'), closeBtn = box.querySelector('.lightbox-close'), opener = null, blocked = [], closeTimer = null, previousOverflow = '';
  var setPageInert = function (on) {
    if (on) {
      blocked = Array.prototype.map.call(document.body.children, function (node) { return { node: node, wasInert: node.inert }; }).filter(function (item) { return item.node !== box; });
      blocked.forEach(function (item) { item.node.inert = true; });
    } else {
      blocked.forEach(function (item) { item.node.inert = item.wasInert; });
      blocked = [];
    }
  };
  var close = function () {
    box.classList.remove('is-open');
    if (window.__lenis) window.__lenis.start();
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      box.hidden = true;
      setPageInert(false);
      document.documentElement.style.overflow = previousOverflow;
      if (opener) opener.focus({ preventScroll: true });
    }, 300);
  };
  gal.addEventListener('click', function (e) {
    var b = e.target.closest('.gal-open'); if (!b) return;
    var src = b.querySelector('img');
    if (!img) { img = document.createElement('img'); box.querySelector('figure').insertBefore(img, cap); }
    opener = b; img.src = src.src; img.alt = src.alt; cap.textContent = b.parentNode.querySelector('figcaption').textContent;
    clearTimeout(closeTimer); setPageInert(true);
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    box.hidden = false; void box.offsetWidth; box.classList.add('is-open');
    if (window.__lenis) window.__lenis.stop();
    closeBtn.focus({ preventScroll: true });
  });
  box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('.lightbox-close')) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus({ preventScroll: true }); }
  });
})();

(function () {
  // Hero cover: leans toward the cursor, and drifts slightly as you scroll
  var cover = document.querySelector('.ph-cover');
  if (!cover || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cover.addEventListener('pointermove', function (e) {
      var r = cover.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      cover.style.transform = 'perspective(1000px) rotateX(' + (-y * 10).toFixed(2) + 'deg) rotateY(' + (x * 12).toFixed(2) + 'deg) scale(1.02)';
    });
    cover.addEventListener('pointerleave', function () { cover.style.transform = ''; });
  }
  // Once per frame at most, and only while the cover is still drifting (the first 600px)
  var last = -1, queued = false;
  var drift = function () {
    queued = false;
    var y = Math.min(1, window.scrollY / 600);
    if (y === last) return;
    last = y;
    cover.style.translate = '0 ' + (y * -30).toFixed(1) + 'px';
  };
  window.addEventListener('scroll', function () {
    if (!queued && (window.scrollY < 640 || last < 1)) { queued = true; requestAnimationFrame(drift); }
  }, { passive: true });
  drift();
})();
