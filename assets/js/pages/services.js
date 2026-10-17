/* Services: vertical tabs (hover, click, arrow keys, #t0..#t5 deep links) and the FAQ. */
(function () {
  // Accessible vertical tabs: hover (desktop), click, arrow keys, and #t0..#t5 deep links
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.svc'));
  var select = function (tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      panel.classList.toggle('is-on', on); panel.hidden = !on;
    });
    if (focus) tab.focus();
  };
  var fine = window.matchMedia('(hover: hover)').matches;
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    if (fine) t.addEventListener('mouseenter', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var n = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (e.key === 'Home') n = -i; if (e.key === 'End') n = tabs.length - 1 - i;
      if (n === undefined) return;
      e.preventDefault(); select(tabs[(i + n + tabs.length) % tabs.length], true);
    });
  });
  var hash = document.getElementById(location.hash.slice(1));
  if (hash && tabs.indexOf(hash) > -1) select(hash);
  if (!fine) document.querySelector('.hover-word').textContent = 'tap';

  // FAQ: all collapsed. Hover opens smoothly (desktop); click, tap or Enter pins it open/closed.
  Array.prototype.forEach.call(document.querySelectorAll('.faq-item'), function (item) {
    var btn = item.querySelector('.faq-q'), t = null, pinned = false;
    var set = function (open) { item.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', function () { pinned = !item.classList.contains('is-open') || !pinned; set(pinned); });
    if (fine) {
      item.addEventListener('mouseenter', function () { clearTimeout(t); t = setTimeout(function () { set(true); }, 90); });
      item.addEventListener('mouseleave', function () { clearTimeout(t); if (!pinned) t = setTimeout(function () { set(false); }, 160); });
    }
  });
})();
