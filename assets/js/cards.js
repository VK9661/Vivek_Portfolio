/* Shared project-card renderers (Home, Work, Project pages). */
(function () {
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var swatch = function (p) { return (window.SWATCH || {})[p.color] || '#FF5A8C'; };
  // 4:3 covers fill the frame; other ratios are shown whole (contain), never cropped
  var fit = function (p) { return Math.abs(p.w / p.h - 4 / 3) < 0.03 ? ' class="fill"' : ''; };

  window.escapeHTML = esc;
  window.swatchOf = swatch;

  window.workCard = function (p, i, numbered) {
    return '<a class="work-card" href="project.html?id=' + p.id + '" style="--c:' + swatch(p) + '" data-reveal data-cats="' + (p.cats || []).join(' ') + '" data-cursor="view">' +
      (numbered ? '<span class="num-sticker" aria-hidden="true">0' + (i + 1) + '</span>' : '') +
      '<div class="media"><img' + fit(p) + ' src="' + p.img + '" alt="' + esc(p.title) + ' cover" width="' + p.w + '" height="' + p.h + '" loading="lazy"></div>' +
      '<div class="body">' +
        '<div><span class="eyebrow muted">' + esc(p.kind) + (p.year ? ' · ' + esc(p.year) : '') + '</span><h3>' + esc(p.title) + '</h3></div>' +
        '<span class="round-ar" aria-hidden="true">&#8599;</span>' +
        '<p>' + esc(p.summary) + '</p>' +
        '<div class="chips">' + p.tags.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
      '</div></a>';
  };

  window.rowItem = function (p, i) {
    return '<a class="row-i" href="project.html?id=' + p.id + '" style="--c:' + swatch(p) + '" data-reveal data-cats="' + (p.cats || []).join(' ') + '" data-cursor="view">' +
      '<span class="n" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="th"><img src="' + p.img + '" alt="" width="' + p.w + '" height="' + p.h + '" loading="lazy"></span>' +
      '<div><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p></div>' +
      '<span class="meta"><span class="chip">' + esc(p.kind) + (p.year ? ' · ' + esc(p.year) : '') + '</span><span class="round-ar" aria-hidden="true">&#8599;</span></span>' +
    '</a>';
  };
})();
