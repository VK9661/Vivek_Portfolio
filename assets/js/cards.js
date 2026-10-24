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
    return '<a class="work-card" href="project-' + p.id + '.html" style="--c:' + swatch(p) + '" data-reveal data-cats="' + (p.cats || []).join(' ') + '" data-cursor="view">' +
      '<div class="media"><img' + fit(p) + ' src="' + p.img + '" alt="' + esc(p.title) + ' cover" width="' + p.w + '" height="' + p.h + '" loading="lazy"></div>' +
      '<div class="body">' +
        '<div><span class="eyebrow muted">' + esc(p.kind) + (p.year ? ' · ' + esc(p.year) : '') + '</span><h3>' + esc(p.title) + '</h3></div>' +
        '<span class="round-ar" aria-hidden="true">&#8599;</span>' +
        '<p>' + esc(p.summary) + '</p>' +
        '<div class="chips">' + cardTags(p).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<dl class="card-facts">' + (p.facts || []).filter(function (f) { return f[0] !== 'Published'; }).map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<span class="btn btn--sm card-cta">View case study <span class="ar" aria-hidden="true">&#8599;</span></span>' +
      '</div></a>';
  };

  /* Keeps a card grid free of a lonely last row: when the visible items don't
     fill the last row, the first one or two span two columns (they lie on their
     side), and dense flow packs the rest. Reruns on filter and resize. */
  window.balanceGrid = function (grid) {
    var run = function () {
      var items = Array.prototype.filter.call(grid.children, function (el) { return !el.classList.contains('is-hidden'); });
      Array.prototype.forEach.call(grid.children, function (el) { el.classList.remove('is-wide'); });
      var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      var r = items.length % cols;
      if (cols < 2 || r === 0) return;
      items.slice(0, cols - r).forEach(function (el) { el.classList.add('is-wide'); });
    };
    run();
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(run, 150); });
    return run;
  };

  window.rowItem = function (p) {
    // Rows draw ink text on the swatch (chip and hover fill), so ink projects borrow lilac
    var c = p.color === 'ink' ? (window.SWATCH || {}).lilac || '#9DB0FF' : swatch(p);
    return '<a class="row-i" href="project-' + p.id + '.html" style="--c:' + c + '" data-reveal data-cats="' + (p.cats || []).join(' ') + '" data-cursor="view">' +
      '<span class="th"><img src="' + p.img + '" alt="" width="' + p.w + '" height="' + p.h + '" loading="lazy"></span>' +
      '<div><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p></div>' +
      '<span class="meta"><span class="chip">' + esc(p.kind) + (p.year ? ' · ' + esc(p.year) : '') + '</span><span class="round-ar" aria-hidden="true">&#8599;</span></span>' +
    '</a>';
  };
})();
