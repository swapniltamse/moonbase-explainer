// Builds assets/moonbase-data.json and assets/moonbase-data.csv from the same
// data files the site renders (assets/data.js and assets/refs.js), so the
// download can never disagree with the page. Run: node tools/export-data.mjs
// CI runs it with --check, which fails if the committed files are stale.
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['assets/data.js', 'assets/refs.js']) vm.runInContext(readFileSync(new URL(f, root), 'utf8'), ctx);
const { DEMAND: D, GUIDE: G, SOURCES, CHECKED } = ctx.window;

const rows = [];
const add = (phase, area, metric, value, unit, source) => rows.push({ phase, area, metric, value, unit, source });
for (const p of D.phases) {
  const n = p.n, c = p.comms, t = p.pnt, o = p.obs, g = G.traffic[n - 1];
  add(n, 'Region', 'Service altitude', p.region.alt, 'km', 'T1');
  add(n, 'Region', 'Surface sites', p.region.sitesLabel, '', 'T1');
  add(n, 'Region', 'Assets per site', p.region.assets, '', 'T1');
  add(n, 'Communications', 'Relay coverage and availability', c.relayAvailLabel, 'of each Earth day', 'T2');
  add(n, 'Communications', 'Ground station availability', c.groundAvail, 'of each Earth day', 'T2');
  for (const m of c.relayReturn) add(n, 'Communications', `Relay return throughput${m.y ? ' (' + m.y + ')' : ''}`, `${m.v}${m.plus ? '+' : ''}`, 'Mbps', 'T2');
  for (const m of c.dwe) add(n, 'Communications', `Direct-with-Earth return throughput${m.y ? ' (' + m.y + ')' : ''}`, m.v, 'Mbps', 'T2');
  add(n, 'Communications', 'Aggregate forward throughput', c.forward, 'Mbps', 'T2');
  for (const u of c.users) {
    const y = u.year ? ` (${u.year})` : '';
    add(n, 'Communications', `Concurrent high-rate relay users, no aggregation${y}`, `${u.noAgg.high}+`, 'users', 'T2');
    add(n, 'Communications', `Concurrent high-rate relay users, with aggregation${y}`, u.agg ? `${u.agg.high}+` : 'Limited / demonstration', 'users', 'T2');
  }
  add(n, 'Communications', 'Large mission data volume', c.large, 'GB per day', 'T2');
  add(n, 'Navigation', 'Surface position knowledge (3-sigma)', t.surface, 'm', 'T3');
  add(n, 'Navigation', 'Ascent and descent position knowledge, per axis', t.ascent, 'm', 'T3');
  add(n, 'Navigation', 'Velocity knowledge', t.velocity, '', 'T3');
  add(n, 'Navigation', 'Service availability', t.avail, '', 'T3');
  add(n, 'Navigation', 'Time knowledge', t.time, '', 'T3');
  add(n, 'Navigation', 'Lunar time traced to UTC', t.ltc, '', 'T3');
  add(n, 'Observation', 'Surface sample distance', o.ssdLabel, '', 'T4');
  add(n, 'Observation', 'Revisit, Moon Base region', o.revisitBase, '', 'T4');
  add(n, 'Observation', 'Revisit, South Pole region', o.revisitPole, '', 'T4');
  add(n, 'Traffic', 'Launches', g.launches, '', 'UG 4');
  add(n, 'Traffic', 'Landings', g.landings, '', 'UG 4');
  add(n, 'Traffic', 'Payload to the surface (approx.)', g.kg, 'kg', 'UG 4');
}

const json = JSON.stringify({
  title: 'Wiring the Moon: every figure, by phase',
  site: 'https://moonbase.swapniltamse.com',
  checked: CHECKED,
  note: 'Independent project, not affiliated with NASA. Source tags match the site: T1-T4 are tables in the SCaN demand signal, UG is the Moon Base User\'s Guide page.',
  sources: SOURCES.map(({ tag, title, org, date, url }) => ({ tag, title, org, date, url })),
  figures: rows
}, null, 2) + '\n';
const esc = v => { const s = String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const csv = ['phase,area,metric,value,unit,source', ...rows.map(r => [r.phase, r.area, r.metric, r.value, r.unit, r.source].map(esc).join(','))].join('\n') + '\n';

const out = { 'assets/moonbase-data.json': json, 'assets/moonbase-data.csv': csv };
if (process.argv.includes('--check')) {
  const stale = Object.entries(out).filter(([f, body]) => { try { return readFileSync(new URL(f, root), 'utf8') !== body; } catch { return true; } });
  if (stale.length) { console.error('Stale exports, run node tools/export-data.mjs:', stale.map(([f]) => f).join(', ')); process.exit(1); }
  console.log(`exports up to date (${rows.length} figures)`);
} else {
  for (const [f, body] of Object.entries(out)) writeFileSync(new URL(f, root), body);
  console.log(`wrote ${rows.length} figures to ${Object.keys(out).join(' and ')}`);
}
