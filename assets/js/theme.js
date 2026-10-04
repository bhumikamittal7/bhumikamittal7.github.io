(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved === 'light' || saved === 'dark' ? saved : (dark ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', function () {
    var menu = document.getElementById('menu-toggle');
    if (menu) {
      menu.addEventListener('click', function () {
        var open = menu.parentNode.classList.toggle('nav-open');
        menu.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });
})();
