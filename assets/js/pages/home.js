/* Home: tape marquee, "Selected work" grid and the "Also in the drawer" list with category filters. */
(function () {
  // Tape marquee words (duplicated so the loop is seamless)
  var words = ['UI/UX design', 'Brand systems', 'Motion studies', 'Video editing', 'Interaction design', 'Prototyping', 'Visual hierarchy', 'Social creatives'];
  var html = '';
  for (var k = 0; k < 4; k++) words.forEach(function (w) { html += '<span>' + w + '</span><i>✳</i>'; });
  Array.prototype.forEach.call(document.querySelectorAll('.tape .track'), function (t) { t.innerHTML = html; });

  var P = window.PROJECTS;
  document.getElementById('featured').innerHTML = P.filter(function (p) { return p.featured; }).map(function (p, i) { return window.workCard(p, i, true); }).join('');

  // "All" lists only the projects not featured above; a category lists every
  // project in it, featured ones included
  var drawerItems = P.filter(function (p) { return !p.featured; });
  var drawer = document.getElementById('drawer'), df = document.getElementById('drawer-filters');
  drawer.innerHTML = P.map(window.rowItem).join('');
  var renumber = function () {
    var n = 0;
    Array.prototype.forEach.call(drawer.children, function (row) { if (!row.classList.contains('is-hidden')) row.querySelector('.n').textContent = String(++n).padStart(2, '0'); });
  };
  Array.prototype.forEach.call(drawer.children, function (row, i) { if (P[i].featured) { row.classList.add('is-feat', 'is-hidden'); } });
  renumber();

  // Category buttons for the drawer (only categories that have something in it)
  var CATS = [['all', 'All'], ['ux', 'UI/UX'], ['brand', 'Brand'], ['graphic', 'Graphic'], ['motion', 'Motion']];
  var count = function (k) { return k === 'all' ? drawerItems.length : P.filter(function (p) { return p.cats.indexOf(k) > -1; }).length; };
  df.innerHTML = CATS.filter(function (c) { return count(c[0]) > 0; }).map(function (c, i) {
    return '<button type="button" data-f="' + c[0] + '" aria-pressed="' + (i === 0) + '">' + c[1] + '<span class="count">' + count(c[0]) + '</span></button>';
  }).join('');
  df.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    var k = b.getAttribute('data-f');
    Array.prototype.forEach.call(df.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    Array.prototype.forEach.call(drawer.children, function (row) {
      var show = k === 'all' ? !row.classList.contains('is-feat') : row.getAttribute('data-cats').split(' ').indexOf(k) > -1;
      row.classList.toggle('is-hidden', !show);
      if (show) { row.classList.remove('is-in'); void row.offsetWidth; row.classList.add('is-in'); }
    });
    renumber();
  });
})();
