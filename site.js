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
