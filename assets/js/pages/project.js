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
  document.title = p.title + ' — ' + p.kind + ' | Vivek Kumar';
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
            (p.behance ? '<a class="btn" href="' + p.behance + '" target="_blank" rel="noopener">View on Behance <span class="ar" aria-hidden="true">&#8599;</span></a>' : '') +
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
    '<section class="proj-overview">' +
      '<div class="facts card" data-reveal><h2 class="eyebrow">Project facts</h2><dl>' +
        (p.facts || []).map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') +
      '</dl>' + (p.behance ? '<a class="btn btn--sm btn--sun" href="' + p.behance + '" target="_blank" rel="noopener">Behance <span class="ar" aria-hidden="true">&#8599;</span></a>' : '') + '</div>' +
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
        return '<figure class="gal-i" data-reveal><button class="gal-open" type="button" data-cursor="view" aria-label="View larger: ' + esc(g[3]) + '">' +
          '<img src="' + g[0] + '" alt="' + esc(p.title) + ': ' + esc(g[3]) + '" width="' + g[1] + '" height="' + g[2] + '" loading="lazy" decoding="async"></button>' +
          '<figcaption>' + esc(g[3]) + '</figcaption></figure>';
      }).join('') + '</div></section>';
  }

  if (p.behance) {
    html += '<section class="pending"><div class="card taped" data-reveal><h2>See every frame</h2><p>The full ' + esc(p.title) + ' presentation, with all boards' + (p.cats.indexOf('motion') > -1 ? ' and the animation' : '') + ', lives on Behance.</p>' +
      '<a class="btn" href="' + p.behance + '" target="_blank" rel="noopener">Open on Behance <span class="ar" aria-hidden="true">&#8599;</span></a></div></section>';
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
  var img = null, cap = box.querySelector('figcaption'), closeBtn = box.querySelector('.lightbox-close'), opener = null;
  var close = function () {
    box.classList.remove('is-open');
    if (window.__lenis) window.__lenis.start();
    setTimeout(function () { box.hidden = true; }, 300);
    if (opener) opener.focus({ preventScroll: true });
  };
  gal.addEventListener('click', function (e) {
    var b = e.target.closest('.gal-open'); if (!b) return;
    var src = b.querySelector('img');
    if (!img) { img = document.createElement('img'); box.querySelector('figure').insertBefore(img, cap); }
    opener = b; img.src = src.src; img.alt = src.alt; cap.textContent = b.parentNode.querySelector('figcaption').textContent;
    box.hidden = false; void box.offsetWidth; box.classList.add('is-open');
    if (window.__lenis) window.__lenis.stop();
    closeBtn.focus({ preventScroll: true });
  });
  box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('.lightbox-close')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
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
