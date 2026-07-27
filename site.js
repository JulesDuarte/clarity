// Mobile navigation toggle
(function () {
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.nav-toggle');
  if (!header || !btn) return;

  function close() {
    header.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function () {
    var open = header.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // close when a link is chosen, on Escape, or when resizing back to desktop
  header.querySelectorAll('.nav-left a').forEach(function (a) {
    a.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) close();
  });
})();

// Carousels — a row becomes swipeable, with arrows that appear only when
// there is actually something to scroll to.
(function () {
  var CHEV_L = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';

  function carousel(track, existing) {
    if (!track || !track.firstElementChild) return;
    track.classList.add('crsl');

    var prev, next, nav;
    if (existing && existing.length === 2) {
      prev = existing[0];
      next = existing[1];
      nav = prev.parentElement;
    } else {
      nav = document.createElement('div');
      nav.className = 'crsl-nav';
      prev = document.createElement('button');
      next = document.createElement('button');
      prev.type = next.type = 'button';
      prev.className = next.className = 'cbtn';
      prev.setAttribute('aria-label', 'Anterior');
      next.setAttribute('aria-label', 'Următor');
      prev.innerHTML = CHEV_L;
      next.innerHTML = CHEV_R;
      nav.appendChild(prev);
      nav.appendChild(next);
      track.parentNode.insertBefore(nav, track);
    }

    function step() {
      var first = track.firstElementChild;
      var styles = getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 24;
      return first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    }

    // Animate scrollLeft ourselves: mandatory snapping cancels a native smooth
    // scroll, and `behavior:'smooth'` is unreliable in embedded webviews. Lift
    // the snapping while animating, then hand control back.
    var raf, settle;
    function go(dir) {
      var max = track.scrollWidth - track.clientWidth;
      var start = track.scrollLeft;
      var target = Math.max(0, Math.min(start + dir * step(), max));
      if (Math.abs(target - start) < 1) return;

      cancelAnimationFrame(raf);
      clearTimeout(settle);
      track.style.scrollSnapType = 'none';
      var t0 = null, dur = 420, done = false;

      function finish() {
        if (done) return;
        done = true;
        cancelAnimationFrame(raf);
        track.scrollLeft = target;
        track.style.scrollSnapType = '';
        update();
      }

      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
        track.scrollLeft = start + (target - start) * e;
        if (p < 1) raf = requestAnimationFrame(frame);
        else finish();
      }
      raf = requestAnimationFrame(frame);
      // rAF is throttled in some embedded webviews — make sure we still land
      settle = setTimeout(finish, dur + 120);
    }

    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      // hide the controls entirely when everything already fits
      nav.classList.toggle('is-hidden', max <= 4);
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(update);
      ro.observe(track);
      if (track.firstElementChild) ro.observe(track.firstElementChild);
    }
    // images settling changes the track width, so re-check when they arrive
    track.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', update, { once: true });
    });
    update();
    setTimeout(update, 400);
    setTimeout(update, 1500);
  }

  // pharmacist reviews already ship with arrows in the design — wire those
  var revBtns = document.querySelectorAll('.carousel-btns .cbtn');
  carousel(document.querySelector('.pharma-reviews'), revBtns.length === 2 ? revBtns : null);

  // product rows and the lifestyle row get their own controls
  carousel(document.querySelector('.prod-grid'));
  carousel(document.querySelector('.vid-grid'));

  // the product gallery's existing "next" chevron
  var thumbs = document.querySelector('.gallery-thumbs');
  var thumbNext = document.querySelector('.thumb-next');
  if (thumbs && thumbNext) {
    // only offer the chevron when the strip actually overflows
    var syncThumbNext = function () {
      thumbNext.classList.toggle('is-hidden', thumbs.scrollWidth <= thumbs.clientWidth + 4);
    };
    syncThumbNext();
    window.addEventListener('resize', syncThumbNext);
    if (window.ResizeObserver) new ResizeObserver(syncThumbNext).observe(thumbs);

    thumbNext.addEventListener('click', function () {
      var t = thumbs.querySelector('.thumb');
      var gap = parseFloat(getComputedStyle(thumbs).columnGap || getComputedStyle(thumbs).gap) || 12;
      var d = t ? (t.getBoundingClientRect().width + gap) * 2 : 160;
      var atEnd = thumbs.scrollLeft >= thumbs.scrollWidth - thumbs.clientWidth - 2;
      thumbs.scrollBy({ left: atEnd ? -thumbs.scrollWidth : d, behavior: 'smooth' });
    });
  }

  // let the gallery thumbnails swap the main image
  var main = document.querySelector('.gallery-main img');
  if (main && thumbs) {
    thumbs.querySelectorAll('.thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        var img = t.querySelector('img');
        if (!img) return;
        var src = main.getAttribute('src');
        main.setAttribute('src', img.getAttribute('src'));
        img.setAttribute('src', src);
        thumbs.querySelectorAll('.thumb').forEach(function (o) { o.classList.remove('is-active'); });
        t.classList.add('is-active');
      });
    });
  }
})();
