/* The Front Office · Recruitment as a department you run
   The scouting network per region (focus and investment), the DoF's track record of hits and
   misses, and staff with concrete effects (extra scout, sharper reports, lower fees: see recruit.js). */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, money, M, staff, man } = F;
function R() { const G = g(); if (!G.recX) G.recX = { investAt: -99, log: [], rec: [] }; return G.recX; }
function regions() { const c = g().club, f1 = man('scout', 'reg1'), f2 = man('scout', 'reg2'); return Object.keys(F.REGIONS).map(k => ({ k, t: F.REGIONS[k].name, net: Math.round(c.net[k] || 0), focus: k === f1 ? 1 : k === f2 ? 2 : 0 })); }
function setFocus(k) {
  const G = g(), f1 = man('scout', 'reg1'), f2 = man('scout', 'reg2'); if (!F.REGIONS[k]) return;
  const m = Object.assign({}, G.mand.scout);
  if (k === f1) return { out: `${F.REGIONS[k].name} is already the main focus.` };
  if (k === f2) { m.reg1 = k; m.reg2 = f1; } else { m.reg2 = f1; m.reg1 = k; }
  G.mand.scout = m; return { out: `Scouts now focus on ${F.REGIONS[m.reg1].name}, then ${F.REGIONS[m.reg2].name}.` };
}
function invest(k) {
  const G = g(), X = R(), now = F.absWeek(); if (!staff('scout')) return { err: 'You need a chief scout first.' };
  if (now - X.investAt < 8) return { err: `Next trip possible in ${8 - (now - X.investAt)} weeks.` };
  const cost = Math.round(M(1500) / 100) * 100; if (G.club.cash < cost) return { err: `Needs ${money(cost)}.` };
  G.club.cash -= cost; X.investAt = now; G.club.net[k] = clamp((G.club.net[k] || 0) + 12 + F.eff('scout', 2) * 0.4, 0, 100);
  X.log.unshift({ w: G.week, t: `Scouting trip to ${F.REGIONS[k].name} (${money(cost)}).` });
  return { out: `Scouting trip booked: the ${F.REGIONS[k].name} network grows.` };
}
// the DoF's record over every season he has signed for
function record() {
  const G = g(), out = []; for (let s = 1; s <= G.season; s++) { let ev = []; try { ev = F.recEval ? F.recEval(s) : []; } catch (e) { ev = []; } for (const e of ev) if (e.verdict === 'Hit' || e.verdict === 'Miss') out.push({ s, name: e.name, v: e.verdict, pos: e.pos, pid: e.p ? e.p.id : null }); }
  return out;
}
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(); if (G.week !== 30) return;
  const rec = record().filter(x => x.s === G.season), hit = rec.filter(x => x.v === 'Hit').length, miss = rec.length - hit, d = staff('dof');
  if (d && rec.length >= 2) { const delta = clamp((hit - miss) * 2, -6, 6); d.rel = clamp(d.rel + delta, 0, 100); d.perf = clamp(d.perf + delta, 0, 100); R().log.unshift({ w: G.week, t: `Signings this season: ${hit} hits, ${miss} misses.` }); }
};
function view() { const X = R(), rec = record(); return { regions: regions(), investIn: Math.max(0, 8 - (F.absWeek() - X.investAt)), cost: Math.round(M(1500) / 100) * 100, rec, hits: rec.filter(x => x.v === 'Hit').length, misses: rec.filter(x => x.v === 'Miss').length, log: X.log.slice(0, 6) }; }
Object.assign(F, { rxView: view, rxFocus: setFocus, rxInvest: invest });
})(FO);
