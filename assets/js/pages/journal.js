/* Journal: illustrated reading-list cards and their category filters. */
(function () {
  var reads = document.getElementById('reads'), rf = document.getElementById('read-filters');
  var CATS = [['all', 'All'], ['ux', 'UX'], ['ui', 'UI'], ['brand', 'Brand'], ['type', 'Type'], ['motion', 'Motion']];
  var items = Array.prototype.slice.call(reads.children);

  // Illustrated header for each card, in the order of the list above
  var I = '#1C1747', S = 'stroke="' + I + '" stroke-width="3"', ARR = '<path d="M150 76h22m-8-8 8 8-8 8" stroke="' + I + '" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  var ART = [
    // 1 heuristics: checklist + magnifier
    '<g class="m1"><rect x="105" y="22" width="96" height="112" rx="10" fill="#fff" ' + S + '/><rect x="133" y="14" width="40" height="16" rx="5" fill="#FFCF33" ' + S + '/><path d="M120 54l6 6 10-12M146 55h40M120 82l6 6 10-12M146 83h40M120 110l6 6 10-12M146 111h28" ' + S + ' fill="none" stroke-linecap="round" stroke-linejoin="round"/></g><g class="m2"><circle cx="222" cy="98" r="22" fill="#fff" fill-opacity=".7" stroke="' + I + '" stroke-width="4"/><path d="M238 114l20 20" stroke="' + I + '" stroke-width="7" stroke-linecap="round"/></g>',
    // 2 laws of UX: cursor travelling to a target
    '<g class="m2"><circle cx="196" cy="74" r="44" fill="#fff" ' + S + '/><circle cx="196" cy="74" r="28" fill="#FF5A8C" ' + S + '/><circle cx="196" cy="74" r="11" fill="#fff" ' + S + '/></g><path d="M100 112C124 116 140 100 158 88" stroke="' + I + '" stroke-width="3" stroke-dasharray="6 7" fill="none"/><g class="m1"><path d="M78 96l34 12-14 5-5 14z" fill="#FFCF33" ' + S + ' stroke-linejoin="round"/></g>',
    // 3 refactoring UI: messy card -> clean card
    '<g class="m1"><rect x="56" y="34" width="88" height="84" rx="8" fill="#fff" ' + S + '/><path d="M68 52h50M68 66h64M68 80h40M68 94h58M68 106h30" ' + S + ' stroke-linecap="round" opacity=".4"/></g>' + ARR + '<g class="m2"><rect x="182" y="28" width="92" height="96" rx="10" fill="#fff" ' + S + '/><rect x="194" y="40" width="68" height="30" rx="6" fill="#9DB0FF" stroke="' + I + '" stroke-width="2.5"/><path d="M194 84h52" stroke="' + I + '" stroke-width="5" stroke-linecap="round"/><path d="M194 96h36" ' + S + ' stroke-linecap="round" opacity=".5"/><rect x="194" y="104" width="34" height="12" rx="6" fill="#3350FF"/></g>',
    // 4 HIG: phone with app icons
    '<g class="m1"><rect x="124" y="14" width="72" height="128" rx="14" fill="#fff" ' + S + '/><rect x="148" y="20" width="24" height="6" rx="3" fill="' + I + '"/><g stroke="' + I + '" stroke-width="2.5"><rect x="136" y="38" width="20" height="20" rx="6" fill="#FF5A8C"/><rect x="164" y="38" width="20" height="20" rx="6" fill="#FFCF33"/><rect x="136" y="66" width="20" height="20" rx="6" fill="#6FE3B2"/><rect x="164" y="66" width="20" height="20" rx="6" fill="#3350FF"/><rect x="136" y="94" width="20" height="20" rx="6" fill="#9DB0FF"/><rect x="164" y="94" width="20" height="20" rx="6" fill="#fff"/></g></g><g class="m3"><circle cx="234" cy="46" r="12" fill="#FFCF33" ' + S + '/></g><g class="m2"><path d="M80 108l12-28 12 28z" fill="#FF5A8C" ' + S + ' stroke-linejoin="round"/></g>',
    // 5 Material: layered sheets + floating action button
    '<g class="m1"><rect x="92" y="42" width="120" height="80" rx="8" fill="#9DB0FF" ' + S + ' transform="rotate(-8 152 82)"/></g><g class="m2"><rect x="104" y="30" width="120" height="80" rx="8" fill="#fff" ' + S + '/><path d="M118 48h60M118 62h90M118 76h70" ' + S + ' stroke-linecap="round" opacity=".45"/></g><g class="m3"><circle cx="224" cy="112" r="20" fill="#3350FF" ' + S + '/><path d="M224 103v18M215 112h18" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g>',
    // 6 Smashing: browser window with code
    '<g class="m1"><rect x="70" y="24" width="180" height="106" rx="10" fill="#fff" ' + S + '/><path d="M70 44h180" ' + S + '/><circle cx="84" cy="34" r="4" fill="#FF5A8C"/><circle cx="98" cy="34" r="4" fill="#FFCF33"/><circle cx="112" cy="34" r="4" fill="#6FE3B2"/></g><g class="m3"><path d="M136 70l-18 16 18 16M184 70l18 16-18 16M168 64l-16 46" stroke="' + I + '" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>',
    // 7 Figma blog: vector path with anchors and a handle
    '<g class="m1"><path d="M68 112C108 30 168 30 196 78S250 120 262 52" stroke="' + I + '" stroke-width="3.5" fill="none"/></g><path d="M160 58L232 98" stroke="' + I + '" stroke-width="2"/><g stroke="' + I + '" stroke-width="2.5"><circle cx="160" cy="58" r="5" fill="#fff"/><circle cx="232" cy="98" r="5" fill="#fff"/><rect class="m3" x="62" y="106" width="12" height="12" fill="#fff"/><rect class="m3" x="190" y="72" width="12" height="12" fill="#3350FF"/><rect class="m3" x="256" y="46" width="12" height="12" fill="#fff"/></g><g class="m2"><path d="M110 132l10-30 16 8z" fill="#FFCF33" ' + S + ' stroke-linejoin="round"/></g>',
    // 8 Brand New: old mark -> new mark
    '<g class="m1"><rect x="62" y="38" width="76" height="76" rx="10" fill="#fff" ' + S + '/><circle cx="100" cy="76" r="20" fill="none" ' + S + ' opacity=".35"/><path d="M88 76h24" ' + S + ' opacity=".35"/></g>' + ARR + '<g class="m2"><rect x="182" y="34" width="84" height="84" rx="12" fill="' + I + '" ' + S + '/><path d="M204 98l20-42 20 42z" fill="#FFCF33"/><circle cx="224" cy="86" r="8" fill="#FF5A8C"/></g><g class="m3"><path d="M276 26l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fff" stroke="' + I + '" stroke-width="2"/></g>',
    // 9 Fonts Knowledge: type specimen with guides
    '<path d="M50 112h220M50 62h220M50 40h220" stroke="' + I + '" stroke-width="2" stroke-dasharray="5 6" opacity=".45"/><g class="m3"><text x="160" y="112" text-anchor="middle" font-family="Bricolage Grotesque, Arial Black, sans-serif" font-weight="800" font-size="96" fill="' + I + '">Aa</text></g><g class="m2"><circle cx="252" cy="36" r="10" fill="#FF5A8C" ' + S + '/></g><g class="m1"><rect x="56" y="24" width="18" height="18" rx="4" fill="#fff" ' + S + '/></g>',
    // 10 Motion: bouncing ball with keyframes
    '<path d="M60 108Q110 16 160 108Q200 46 240 108" stroke="' + I + '" stroke-width="2.5" stroke-dasharray="5 6" fill="none"/><g stroke="' + I + '" stroke-width="2.5"><circle cx="84" cy="64" r="9" fill="#FF5A8C" opacity=".35"/><circle cx="108" cy="46" r="10" fill="#FF5A8C" opacity=".6"/><circle class="m3" cx="200" cy="76" r="13" fill="#FFCF33"/></g><path d="M56 132h208" ' + S + '/><g fill="#fff" stroke="' + I + '" stroke-width="2.5"><path class="m1" d="M80 126l6 6-6 6-6-6z"/><path d="M160 126l6 6-6 6-6-6z"/><path class="m2" d="M240 126l6 6-6 6-6-6z"/></g>'
  ];
  items.forEach(function (r, i) {
    if (ART[i]) r.insertAdjacentHTML('afterbegin', '<span class="read-art" aria-hidden="true"><svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid meet">' + ART[i] + '</svg></span>');
  });
  var count = function (k) { return k === 'all' ? items.length : items.filter(function (r) { return r.getAttribute('data-cat') === k; }).length; };
  var balance = window.balanceGrid(reads);
  var num = document.querySelector('[data-count="reads"]'); if (num) num.textContent = items.length;
  rf.innerHTML = CATS.map(function (c, i) { return '<button type="button" data-f="' + c[0] + '" aria-pressed="' + (i === 0) + '">' + c[1] + '<span class="count">' + count(c[0]) + '</span></button>'; }).join('');
  rf.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    var k = b.getAttribute('data-f');
    Array.prototype.forEach.call(rf.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    items.forEach(function (r) { var show = k === 'all' || r.getAttribute('data-cat') === k; r.classList.toggle('is-hidden', !show); if (show) r.classList.add('is-in'); });
    balance();
  });
})();
