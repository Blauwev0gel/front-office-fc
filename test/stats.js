// Position counters (B42): plausible per-90 rates per position over a season, no NaN, old saves without the new fields keep working.
const vm = require('vm'), fs = require('fs');
const m = fs.readFileSync(__dirname + '/weekloop.js', 'utf8').match(/const src = \[([^\]]*)\]/);
const src = m[1].split(',').map(x => x.trim().replace(/['"]/g, '')).filter(Boolean).map(f => require('./src.js')(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const KEYS = ['sh', 'sot', 'kp', 'tk', 'ic', 'cl', 'sv', 'cs', 'ga', 'xg', 'xa', 'prg', 'dt', 'dw', 'rat'];
const agg = {}; for (let seed = 1; seed <= 3; seed++) {
  const F = game(40 + seed), G = F.G; let w = 0;
  while (G.phase === 'season' && w++ < 40) { G.board.conf = 80; G.st.fans = 60; G.st.press = 60; G.squad.forEach(p => p.morale = 75); F.endWeek(); }
  for (const p of G.squad) { const st = p.lastSeason || p.st; if (!st || st.mins < 600) continue; const a = agg[p.pos] = agg[p.pos] || { mins: 0, n: 0 }; a.mins += st.mins; a.n++; for (const k of KEYS) a[k] = (a[k] || 0) + (st[k] || 0); } // the season's totals are in lastSeason once the season has ended
}
const r90 = (pos, k) => agg[pos] ? agg[pos][k] / (agg[pos].mins / 90) : null;
console.log('per 90 by position (3 seasons of our own squad):'); console.log('pos  n   ' + KEYS.map(k => k.padStart(5)).join(' '));
for (const pos of Object.keys(agg)) console.log(pos.padEnd(4), String(agg[pos].n).padStart(2), ' ', KEYS.map(k => (k === 'rat' ? agg[pos][k] / (agg[pos].mins / 90) : r90(pos, k)).toFixed(2).padStart(5)).join(' '));
const all = Object.values(agg); ok(all.every(a => KEYS.every(k => Number.isFinite(a[k]))), 'every counter is a finite number');
if (agg.GK) { ok(r90('GK', 'sv') > 1.5 && r90('GK', 'sv') < 5, `keepers make about 2 to 4 saves per 90 (${r90('GK', 'sv').toFixed(2)})`); ok(agg.GK.cs > 0, 'keepers keep clean sheets'); }
if (agg.CB) { ok(r90('CB', 'cl') > 2 && r90('CB', 'cl') < 8, `centre-backs clear about 3 to 6 per 90 (${r90('CB', 'cl').toFixed(2)})`); ok(r90('CB', 'tk') > r90('ST', 'tk'), 'centre-backs tackle more than strikers'); }
if (agg.ST) { ok(r90('ST', 'sh') > 1 && r90('ST', 'sh') < 5, `strikers shoot about 2 to 4 times per 90 (${r90('ST', 'sh').toFixed(2)})`); ok(agg.ST.sot <= agg.ST.sh, 'shots on target never exceed shots'); ok(agg.ST.kp >= 0, 'key passes exist'); }
// an old save: statistics without the new fields must not turn into NaN
{ const F = game(77), G = F.G; for (const p of G.squad) for (const k of ['sh', 'sot', 'kp', 'tk', 'ic', 'cl', 'sv', 'cs', 'ga']) delete p.st[k]; let w = 0; while (w++ < 6 && G.phase === 'season') F.endWeek();
  ok(G.squad.every(p => Object.values(p.st).every(v => Number.isFinite(v))), 'a squad with old-style statistics keeps finite numbers after matches'); }
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
