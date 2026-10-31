/* Home: tape marquee, "Selected work" grid and the "Also in the drawer" list with category filters. */
(function () {
  // Tape marquee words (duplicated so the loop is seamless)
  var words = ['UI/UX design', 'Brand systems', 'Motion studies', 'Video editing', 'Interaction design', 'Prototyping', 'Visual hierarchy', 'Social creatives'];
  var html = '';
  for (var k = 0; k < 4; k++) words.forEach(function (w) { html += '<span>' + w + '</span><i>✳</i>'; });
  Array.prototype.forEach.call(document.querySelectorAll('.tape .track'), function (t) { t.innerHTML = html; });

  var P = window.PROJECTS;
  Array.prototype.forEach.call(document.querySelectorAll('[data-count="projects"]'), function (n) { n.textContent = P.length; });
  var featured = P.filter(function (p) { return p.featured; });
  document.getElementById('featured').innerHTML = featured.map(window.workCard).join('');

  // The hero's peek card: the first featured project, hanging under the sheet (desktop)
  var peek = document.getElementById('hero-peek'), first = featured[0];
  if (peek && first) {
    peek.href = 'project-' + first.id + '.html';
    peek.setAttribute('aria-label', 'Latest project: ' + first.title);
    peek.innerHTML = '<img src="' + first.img + '" alt="" width="' + first.w + '" height="' + first.h + '" loading="lazy"><span>' + window.escapeHTML(first.title) + '<b aria-hidden="true">&#8599;</b></span>';
  }

  // The drawer opens on "More" (the projects not featured above). A category
  // lists every project in it, featured ones included, and its count matches.
  var drawerItems = P.filter(function (p) { return !p.featured; });
  var drawer = document.getElementById('drawer'), df = document.getElementById('drawer-filters');
  drawer.innerHTML = P.map(window.rowItem).join('');
  Array.prototype.forEach.call(drawer.children, function (row, i) { if (P[i].featured) row.classList.add('is-feat', 'is-hidden'); });

  // Category buttons (only categories that have something in them)
  var CATS = [['more', 'More'], ['ux', 'UI/UX'], ['brand', 'Brand'], ['graphic', 'Graphic'], ['motion', 'Motion']];
  var count = function (k) { return k === 'more' ? drawerItems.length : P.filter(function (p) { return p.cats.indexOf(k) > -1; }).length; };
  df.innerHTML = CATS.filter(function (c) { return count(c[0]) > 0; }).map(function (c, i) {
    return '<button type="button" data-f="' + c[0] + '" aria-pressed="' + (i === 0) + '">' + c[1] + '<span class="count">' + count(c[0]) + '</span></button>';
  }).join('');
  df.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    var k = b.getAttribute('data-f');
    Array.prototype.forEach.call(df.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    Array.prototype.forEach.call(drawer.children, function (row) {
      var show = k === 'more' ? !row.classList.contains('is-feat') : row.getAttribute('data-cats').split(' ').indexOf(k) > -1;
      row.classList.toggle('is-hidden', !show);
      if (show) { row.classList.remove('is-in'); void row.offsetWidth; row.classList.add('is-in'); }
    });
  });
})();
