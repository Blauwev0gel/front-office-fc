// Match lab: runs only the match function between fixed teams, no season. Measures the calibration targets of B25 and the design note.
// Usage: node tools/matchlab.js [n=2000] [--proto]   (--proto runs notes/prototypes/match/match-proto.js instead of simOurMatch)
// Cost: one game boot plus n matches; the game state is restored from a snapshot every 25 matches so injuries and bans do not pile up.
const vm = require('vm'), path = require('path'), R = require('../test/src.js');
const n = +process.argv.find(a => /^\d+$/.test(a)) || 2000, PROTO = process.argv.includes('--proto');
const src = R.mods('matchday.js').map(f => R(f)).join('\n'); const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO;
F.newGame(91); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'Lab', 'LAB', 'Lab', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress();
const proto = PROTO ? require(path.join(__dirname, '../notes/prototypes/match/match-proto.js')) : null;
const snap = F.save(), P0 = F.mtPreview(); const t0 = Date.now();
const acc = { g: 0, g80: 0, nil: 0, hw: 0, dr: 0, aw: 0, sh: 0, sot: 0, xg: 0, red: 0, n: 0 }, dist = {};
for (let i = 0; i < n; i++) {
  if (i % 25 === 0) F.load(snap); F.G.rs = (F.G.rs + i * 7919) >>> 0;
  let ug, tg, ev, home = P0.home, sh = 0, sot = 0, xg = 0, red = 0;
  if (PROTO) { const M = proto(F, { seed: i }); ug = M.sc.us; tg = M.sc.them; ev = M.ev; sh = M.shots.us + M.shots.them; sot = M.sot.us + M.sot.them; xg = M.xg.us + M.xg.them; red = M.red.us + M.red.them; }
  else { const m = F.simOurMatch ? F.simOurMatch(P0.id, home, 'League') : null; if (!m) { console.log('simOurMatch is not exported; add it to the API first.'); process.exit(1); } ug = m.ug; tg = m.tg; ev = m.ev; xg = m.uxg + m.txg; red = m.reds[0] + m.reds[1]; sh = ev.filter(e => e.k === 'ch' || e.k === 'goal').length; }
  const hg = home ? ug : tg, ag = home ? tg : ug; acc.g += ug + tg; acc.g80 += ev.filter(e => e.k === 'goal' && e.m > 80).length; acc.nil += ug + tg === 0; acc.hw += hg > ag; acc.dr += hg === ag; acc.aw += hg < ag; acc.sh += sh; acc.sot += sot; acc.xg += xg; acc.red += red; acc.n++;
  const k = `${hg}-${ag}`; dist[k] = (dist[k] || 0) + 1;
}
const N = acc.n, pc = x => (x / N * 100).toFixed(1) + '%';
console.log(`${PROTO ? 'prototype' : 'simOurMatch'} · ${N} matches · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
console.log(`goals ${(acc.g / N).toFixed(2)} (target 2.6–2.8) · 0-0 ${pc(acc.nil)} (target ~8%) · home/draw/away ${pc(acc.hw)} / ${pc(acc.dr)} / ${pc(acc.aw)}`);
console.log(`xG ${(acc.xg / N).toFixed(2)} · shots ${(acc.sh / N).toFixed(1)}${PROTO ? ` · on target ${(acc.sot / N).toFixed(1)}` : ' (visible chances only)'} · reds ${(acc.red / N).toFixed(2)} · goals after 80' ${(acc.g80 / Math.max(1, acc.g) * 100).toFixed(1)}%`);
console.log('most common scores:', Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ${pc(v)}`).join(', '));
