/* Wiring the Moon: shared behaviour. Theme only. */
(function () {
  window.__reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  /* Theme: dark by default, remembered; ?theme=light|dark overrides. */
  try {
    let t = localStorage.getItem('moonbase-theme');
    const p = new URLSearchParams(location.search).get('theme');
    if (p === 'light' || p === 'dark') { t = p; localStorage.setItem('moonbase-theme', p); }
    if (t === 'light') body.classList.add('light');
  } catch (e) {}
  const tb = document.getElementById('theme-toggle');
  const isLight = () => body.classList.contains('light');
  function sync() {
    if (!tb) return;
    tb.textContent = isLight() ? '☾' : '☀';
    tb.setAttribute('aria-label', isLight() ? 'Switch to dark theme' : 'Switch to light theme');
  }
  sync();
  if (tb) tb.addEventListener('click', () => {
    body.classList.toggle('light');
    try { localStorage.setItem('moonbase-theme', isLight() ? 'light' : 'dark'); } catch (e) {}
    sync();
  });
})();

/* Source tags (T2, UG 4, SRD 27 ...) become links to their entry on the Sources
   page. Runs once the page's own scripts have rendered, and again for anything
   they render later, so tags inside dynamic content are covered too. */
(function () {
  const css = document.querySelector('link[href$="assets/site.css"]');
  const base = css ? css.getAttribute('href').replace('assets/site.css', '') : '';
  const NAMES = { T: 'SCaN demand signal', UG: "Moon Base User's Guide", LN: 'LunaNet Interoperability Specification',
    AFS: 'AFS signal standard', SRD: 'Lunar Relay Services Requirements', ADD: 'Architecture Definition Document',
    FS: 'Ignition fact sheet', WEB: 'NASA web pages' };
  function keyOf(text) {
    const t = text.trim();
    if (/^T\d/.test(t) || t.startsWith('§')) return 'T';
    const m = t.match(/^(UG|LN|AFS|SRD|ADD|FS|WEB)/); return m ? m[1] : null;
  }
  function link(root) {
    root.querySelectorAll('span.ref, span.src-chip').forEach(el => {
      const k = keyOf(el.textContent); if (!k) return;
      const a = document.createElement('a');
      a.className = el.className + ' reflink'; a.textContent = el.textContent;
      a.href = base + 'sources/#src-' + k;
      const where = el.getAttribute('title');
      a.title = 'Source: ' + NAMES[k] + (where ? ', ' + where : '') + '. Opens the Sources page.';
      el.replaceWith(a);
    });
  }
  function start() {
    link(document);
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) link(n); })))
      .observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
