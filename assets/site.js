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
