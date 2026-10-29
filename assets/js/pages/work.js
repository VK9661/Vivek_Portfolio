/* Work index: all project cards with category filters (#ux, #brand, ... deep links). */
(function () {
  var P = window.PROJECTS;
  var cases = document.getElementById('cases'), filters = document.getElementById('filters');
  cases.innerHTML = P.map(function (p, i) { return window.workCard(p, i, false); }).join('');
  // Even 3-column grid: leftover cards on the last row sit in the middle (style.css)
  var balance = function () {
    var shown = Array.prototype.filter.call(cases.children, function (c) { return !c.classList.contains('is-hidden'); });
    Array.prototype.forEach.call(cases.children, function (c) { c.classList.remove('is-centre-1', 'is-centre-2'); });
    var left = shown.length % 3;
    if (left) shown[shown.length - left].classList.add('is-centre-' + left);
  };
  balance();
  var num = document.querySelector('[data-count="projects"]'); if (num) num.textContent = P.length;

  var CATS = [['all', 'All'], ['ux', 'UI/UX'], ['brand', 'Brand'], ['graphic', 'Graphic'], ['motion', 'Motion']];
  var count = function (k) { return k === 'all' ? P.length : P.filter(function (p) { return (p.cats || []).indexOf(k) > -1; }).length; };
  filters.innerHTML = CATS.map(function (c, i) {
    return '<button type="button" data-f="' + c[0] + '" aria-pressed="' + (i === 0) + '">' + c[1] + '<span class="count">' + count(c[0]) + '</span></button>';
  }).join('');

  var apply = function (k) {
    Array.prototype.forEach.call(filters.children, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === k)); });
    Array.prototype.forEach.call(cases.children, function (card) {
      var show = k === 'all' || card.getAttribute('data-cats').split(' ').indexOf(k) > -1;
      card.classList.toggle('is-hidden', !show);
      if (show) card.classList.add('is-in');
    });
    balance();
    try { history.replaceState(null, '', k === 'all' ? location.pathname : '#' + k); } catch (e) {}
  };
  filters.addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (b) apply(b.getAttribute('data-f')); });
  var initial = location.hash.slice(1);
  if (CATS.some(function (c) { return c[0] === initial; })) apply(initial);
})();
