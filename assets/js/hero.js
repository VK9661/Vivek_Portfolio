/* Home hero interactions: letter hover, cursor colour, confetti trail,
   depth drift (doodles and role stickers), smiley eyes, magnetic CTAs,
   giant-name letters that lift near the cursor.
   Loaded after main.js on index.html only. */
(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 1. The headline: every letter is its own hover target (spaces stay plain text) */
  Array.prototype.forEach.call(hero.querySelectorAll('.hp-word'), function (w) {
    w.innerHTML = w.textContent.split('').map(function (ch, i) { return ch === ' ' ? ' ' : '<b style="--i:' + i + '">' + (ch === '&' ? '&amp;' : ch) + '</b>'; }).join('');
  });

  /* 1b. The giant name: one span per letter, so each can react to the cursor (5) */
  var big = hero.querySelector('.hp-big');
  var bigLetters = [];
  if (big) {
    var TINTS = ['var(--pink)', 'var(--sun)', 'var(--sky)', 'var(--mint)', 'var(--pink)'];
    big.innerHTML = big.textContent.split('').map(function (ch, i) {
      return '<span style="--c:' + TINTS[i % TINTS.length] + ';--tw:' + (i % 2 ? 7 : -7) + 'deg">' + ch + '</span>';
    }).join('');
    bigLetters = Array.prototype.slice.call(big.children);
  }

  if (reduce || !fine) return;

  /* 2. Cursor colour: a colour-shifting glow and a lit dot grid follow the cursor,
        and small palette confetti spills off it as it moves */
  var fx = hero.querySelector('.hp-fx');
  var COLORS = ['#FF5A8C', '#FFCF33', '#7FD8F5', '#6FE3B2', '#9DB0FF', '#3350FF'];
  var SHAPES = ['dot', 'sq', 'star', 'ring'];
  var bx = 0, by = 0, tx = 0, ty = 0, raf = null, lastSpawn = 0, alive = 0, lastX = 0, lastY = 0;
  var follow = function () {
    bx += (tx - bx) * 0.12; by += (ty - by) * 0.12;
    fx.style.setProperty('--bx', bx.toFixed(1) + 'px');
    fx.style.setProperty('--by', by.toFixed(1) + 'px');
    raf = (Math.abs(tx - bx) + Math.abs(ty - by) > 0.5) ? requestAnimationFrame(follow) : null;
  };
  var spawn = function (x, y, vx, vy) {
    if (alive > 22) return;
    var bit = document.createElement('i');
    bit.className = 'hp-bit hp-bit--' + SHAPES[(Math.random() * SHAPES.length) | 0];
    bit.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--c:' + COLORS[(Math.random() * COLORS.length) | 0] +
      ';--dx:' + (vx * -6 + (Math.random() - 0.5) * 60).toFixed(0) + 'px' +
      ';--dy:' + (vy * -6 + 20 + Math.random() * 50).toFixed(0) + 'px' +
      ';--rot:' + ((Math.random() - 0.5) * 360).toFixed(0) + 'deg' +
      ';--s:' + (0.6 + Math.random() * 0.7).toFixed(2);
    fx.appendChild(bit); alive++;
    bit.addEventListener('animationend', function () { fx.removeChild(bit); alive--; }, { once: true });
  };
  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    tx = x; ty = y;
    hero.style.setProperty('--mx', x + 'px');
    hero.style.setProperty('--my', y + 'px');
    hero.classList.add('is-lit');
    if (!raf) raf = requestAnimationFrame(follow);
    var now = performance.now(), dist = Math.hypot(x - lastX, y - lastY);
    if (now - lastSpawn > 45 && dist > 14) { spawn(x, y, (x - lastX) / 10, (y - lastY) / 10); lastSpawn = now; lastX = x; lastY = y; }
  });
  hero.addEventListener('pointerleave', function () { hero.classList.remove('is-lit'); });

  /* 3. Doodles and stickers drift with the cursor at different depths; the smiley's eyes look at it */
  var items = Array.prototype.slice.call(hero.querySelectorAll('[data-depth]'));
  var eyes = hero.querySelector('.hp-eyes'), smile = hero.querySelector('.hp-smile');
  var px = 0, py = 0, cx = 0, cy = 0, praf = null;
  var drift = function () {
    cx += (px - cx) * 0.08; cy += (py - cy) * 0.08;
    items.forEach(function (el) { var d = +el.getAttribute('data-depth'); el.style.translate = (cx * d).toFixed(2) + 'px ' + (cy * d).toFixed(2) + 'px'; });
    praf = (Math.abs(px - cx) + Math.abs(py - cy) > 0.002) ? requestAnimationFrame(drift) : null;
  };
  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5; py = (e.clientY - r.top) / r.height - 0.5;
    if (!praf) praf = requestAnimationFrame(drift);
    if (eyes && smile) {
      var s = smile.getBoundingClientRect(), dx = e.clientX - (s.left + s.width / 2), dy = e.clientY - (s.top + s.height / 2), d = Math.hypot(dx, dy) || 1;
      eyes.style.transform = 'translate(' + (dx / d * 4).toFixed(1) + 'px,' + (dy / d * 4).toFixed(1) + 'px)';
    }
  });
  hero.addEventListener('pointerleave', function () { px = 0; py = 0; if (!praf) praf = requestAnimationFrame(drift); });

  /* 5. The giant name: letters near the cursor lift, tilt and take a palette colour, like a sticker peeled up */
  if (big && bigLetters.length) {
    big.classList.add('is-live');
    var bigRaf = null, bigX = 0, bigY = 0;
    var lift = function () {
      bigRaf = null;
      bigLetters.forEach(function (el) {
        var r = el.getBoundingClientRect(), reach = r.width * 1.1;
        var d = Math.hypot(bigX - (r.left + r.width / 2), bigY - (r.top + r.height / 2));
        el.style.setProperty('--p', Math.max(0, 1 - d / reach).toFixed(3));
      });
    };
    hero.addEventListener('pointermove', function (e) {
      bigX = e.clientX; bigY = e.clientY;
      if (!bigRaf) bigRaf = requestAnimationFrame(lift);
    });
    hero.addEventListener('pointerleave', function () { bigLetters.forEach(function (el) { el.style.setProperty('--p', 0); }); });
  }

  /* 4. Magnetic CTAs */
  Array.prototype.forEach.call(hero.querySelectorAll('.hp-ctas .btn, .hp-ctas .hp-link'), function (el) {
    el.classList.add('is-magnetic');
    var zone = el.parentElement;
    zone.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) > Math.max(r.width, r.height) * 0.9) { el.style.translate = ''; return; }
      el.style.translate = (dx * 0.28).toFixed(1) + 'px ' + (dy * 0.38).toFixed(1) + 'px';
    });
    zone.addEventListener('pointerleave', function () { el.style.translate = ''; });
  });
})();
