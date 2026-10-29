/* Shared card helpers: project-card renderers (Home, Work) and grid balancing (Work, Reading list). */
(function () {
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var swatch = function (p) { return (window.SWATCH || {})[p.color] || '#FF5A8C'; };
  // 4:3 covers fill the frame; other ratios are shown whole (contain), never cropped
  var fit = function (p) { return Math.abs(p.w / p.h - 4 / 3) < 0.03 ? ' class="fill"' : ''; };
  // At most two tags on a card: never one that repeats the project type, and "Motion" first when present
  var cardTags = function (p) {
    var kind = (p.kind || '').toLowerCase();
    return (p.tags || [])
      .filter(function (t) { return kind.indexOf(t.toLowerCase()) < 0; })
      .sort(function (a, b) { return (b === 'Motion') - (a === 'Motion'); })
      .slice(0, 2);
  };

  window.escapeHTML = esc;
  window.swatchOf = swatch;

  window.workCard = function (p) {
    return '<a class="work-card" href="project-' + p.id + '.html" style="--c:' + swatch(p) + '" data-reveal data-cats="' + (p.cats || []).join(' ') + '">' +
      '<div class="media"><span class="m-box"><img' + fit(p) + ' src="' + p.img + '" alt="' + esc(p.title) + ' cover" width="' + p.w + '" height="' + p.h + '" loading="lazy">' +
        (p.loop ? '<video class="card-loop" data-src="' + p.loop + '" muted loop playsinline preload="none" aria-hidden="true"></video>' : '') + '</span></div>' +
      '<div class="body">' +
        '<div><span class="eyebrow muted">' + esc(p.kind) + (p.year ? ' · ' + esc(p.year) : '') + '</span><h3>' + esc(p.title) + '</h3></div>' +
        '<span class="round-ar" aria-hidden="true">&#8599;</span>' +
        '<p>' + esc(p.summary) + '</p>' +
        '<div class="chips">' + cardTags(p).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<dl class="card-facts">' + (p.facts || []).filter(function (f) { return f[0] !== 'Published'; }).map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<span class="btn btn--sm card-cta">View case study <span class="ar" aria-hidden="true">&#8599;</span></span>' +
      '</div></a>';
  };

  // Hover a card with a loop and its cover plays: the clip only downloads on the first hover,
  // and never for touch screens or reduced motion
  var canLoop = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canLoop) {
    var loopOf = function (e) { var c = e.target.closest && e.target.closest('.work-card'); return c && !c.contains(e.relatedTarget) ? c.querySelector('.card-loop') : null; };
    document.addEventListener('mouseover', function (e) {
      var v = loopOf(e); if (!v) return;
      if (!v.src) { v.src = v.getAttribute('data-src'); v.addEventListener('playing', function () { v.classList.add('is-on'); }); }
      v.play().then(function () { v.classList.add('is-on'); }).catch(function () {});
    });
    document.addEventListener('mouseout', function (e) {
      var v = loopOf(e); if (!v) return;
      v.classList.remove('is-on'); v.pause();
    });
  }

  window.rowItem = function (p) {
    // Rows draw ink text on the swatch (chip and hover fill), so ink projects borrow lilac
    var c = p.color === 'ink' ? (window.SWATCH || {}).lilac || '#9DB0FF' : swatch(p);
    return '<a class="row-i" href="project-' + p.id + '.html" style="--c:' + c + '" data-reveal data-cats="' + (p.cats || []).join(' ') + '">' +
      '<span class="th"><img src="' + p.img + '" alt="" width="' + p.w + '" height="' + p.h + '" loading="lazy"></span>' +
      '<div><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p></div>' +
      '<span class="meta"><span class="chip">' + esc(p.kind) + (p.year ? ' · ' + esc(p.year) : '') + '</span><span class="round-ar" aria-hidden="true">&#8599;</span></span>' +
    '</a>';
  };
})();
