/* Linear Algebra — Persiapan UTS. Interaksi ringan: TOC, progres, panel mobile. */
window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']],
    processEscapes: true,
    tags: 'none'
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    ignoreHtmlClass: 'tex2jax_ignore'
  },
  chtml: { scale: 1.02, displayAlign: 'left', displayIndent: '1.2em' },
  startup: { typeset: true }
};

(function () {
  var KEY = 'la_uts_progress_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  function paintProgress() {
    var done = load();
    var ids = Array.prototype.slice.call(document.querySelectorAll('[data-topic]'));
    ids.forEach(function (el) {
      var id = el.getAttribute('data-topic');
      el.classList.toggle('is-done', !!done[id]);
      var btn = el.querySelector(':scope > .head .done-btn');
      if (btn) {
        btn.textContent = done[id] ? '\u2713 sudah' : 'tandai selesai';
        btn.classList.toggle('on', !!done[id]);
      }
    });
    var total = ids.length;
    var n = ids.filter(function (el) { return done[el.getAttribute('data-topic')]; }).length;
    document.querySelectorAll('[data-progress-total]').forEach(function (el) { el.textContent = total; });
    document.querySelectorAll('[data-progress-count]').forEach(function (el) { el.textContent = n; });
    document.querySelectorAll('[data-progress-bar]').forEach(function (el) {
      el.style.width = total ? Math.round(n / total * 100) + '%' : '0%';
    });
    document.querySelectorAll('.road li[data-topic-link]').forEach(function (li) {
      li.classList.toggle('is-done', !!done[li.getAttribute('data-topic-link')]);
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.done-btn');
    if (btn) {
      var host = btn.closest('[data-topic]');
      var done = load();
      var id = host.getAttribute('data-topic');
      done[id] = !done[id];
      save(done);
      paintProgress();
      return;
    }
    var t = e.target.closest('[data-toggle]');
    if (t) {
      var sel = t.getAttribute('data-toggle');
      document.querySelectorAll(sel).forEach(function (n) { n.classList.toggle('open'); });
    }
  });

  function markActiveToc() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.road a[href^="#"]'));
    if (!links.length) return;
    var secs = links.map(function (a) {
      var id = a.getAttribute('href').slice(1);
      return { a: a, el: document.getElementById(id) };
    }).filter(function (o) { return o.el; });
    function upd() {
      var y = window.scrollY + 140, cur = secs[0];
      secs.forEach(function (o) { if (o.el.offsetTop <= y) cur = o; });
      links.forEach(function (a) { a.parentNode.classList.remove('now'); });
      if (cur) cur.a.parentNode.classList.add('now');
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  document.addEventListener('DOMContentLoaded', function () {
    paintProgress();
    markActiveToc();
    if (window.MathJax && MathJax.startup) {
      MathJax.startup.promise.then(paintProgress);
    }
  });
})();