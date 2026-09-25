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

/* Glossary: the first use of each term on a page gets a hover definition.
   Plain text only; links, headings' tags, buttons, SVG and code are skipped. */
(function () {
  const TERMS = [
    ['LANS', 'Lunar Augmented Navigation Service: relays broadcast signals so users on and around the Moon can work out position, velocity and time, much like GPS.'],
    ['AFS', 'Augmented Forward Signal: the navigation signal each relay broadcasts, at 2492.028 MHz in S-band.'],
    ['DTN', 'Delay/Disruption Tolerant Networking: data is stored and passed on hop by hop when the next link is available, so gaps in coverage do not lose it.'],
    ['Coordinated Lunar Time', 'A time scale for the Moon, traced back to Coordinated Universal Time (UTC) on Earth.'],
    ['LunaNet', 'The shared standard, written by NASA, ESA and JAXA, that lets relays, ground stations and radios from many providers work as one lunar network.'],
    ['3GPP', 'The standards body behind 4G and 5G cellular networks.'],
    ['Direct-with-Earth', 'A link straight from the Moon to an antenna on Earth, with no relay in between.'],
    ['CLPS', 'Commercial Lunar Payload Services: NASA buying delivery of payloads to the Moon on commercial landers.'],
    ['SCaN', "Space Communications and Navigation, the NASA program responsible for NASA's space communication networks."],
    ['Ka-band', 'A high-frequency radio band, around 22 to 27.5 GHz for lunar links, used for high data rates.'],
    ['S-band', 'A lower-frequency radio band, around 2 to 2.5 GHz, used for reliable lower-rate links and the navigation signal.']
  ];
  const SKIP = 'A,ABBR,BUTTON,SCRIPT,STYLE,SVG,TEXT,CODE,H1,TITLE,TEXTAREA,INPUT,SELECT,OPTION,NAV,.ref,.src-chip';
  function scan(root, done) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement && !n.parentElement.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      for (const [term, def] of TERMS) {
        if (done.has(term)) continue;
        const re = new RegExp('(^|[^A-Za-z-])(' + term.replace(/[-]/g, '\\-') + ')(?![A-Za-z])');
        const m = node.nodeValue.match(re); if (!m) continue;
        const at = m.index + m[1].length;
        const after = node.splitText(at); after.nodeValue = after.nodeValue.slice(term.length);
        const ab = document.createElement('abbr'); ab.className = 'gl'; ab.title = def; ab.textContent = m[2];
        node.parentNode.insertBefore(ab, after); done.add(term);
        break;
      }
    }
  }
  function start() {
    const main = document.querySelector('main'); if (!main) return;
    const done = new Set(); scan(main, done);
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n, done); })))
      .observe(main, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/* Fold: secondary figures (.card.fold) get a "Show more" button. It only has an
   effect on small screens, where CSS hides everything but the heading. */
(function () {
  function start() {
    document.querySelectorAll('.card.fold').forEach((card, i) => {
      const h = card.querySelector('h3'); if (!h) return;
      card.classList.add('folded');
      const b = document.createElement('button'); b.type = 'button'; b.className = 'fold-btn';
      b.setAttribute('aria-expanded', 'false'); b.textContent = 'Show more';
      b.addEventListener('click', () => {
        const open = card.classList.toggle('folded') === false;
        b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Show less' : 'Show more';
      });
      h.insertAdjacentElement('afterend', b);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
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
