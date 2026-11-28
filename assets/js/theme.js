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

    // homepage only: the name opens the kolam dialog instead of reloading
    var kolam = document.getElementById('kolam');
    var name = document.querySelector('.site-name');
    if (kolam && name && kolam.showModal) {
      name.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        kolam.showModal();
      });
      kolam.addEventListener('click', function (e) {
        if (e.target === kolam || e.target.classList.contains('close')) kolam.close();
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
