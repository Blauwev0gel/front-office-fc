/* ---------- world ---------- */
function townName(used) { for (let i = 0; i < 200; i++) { const n = pick(TOWN_A) + pick(TOWN_B); if (!used.has(n)) { used.add(n); return n; } } return 'Newtown' + uid(); }
function roundRobin(ids) {
  const a = shuffle(ids.slice()), n = a.length, rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const pr = []; for (let i = 0; i < n / 2; i++) { const h = a[i], w = a[n - 1 - i]; pr.push(r % 2 === 0 ? [h, w] : [w, h]); }
    rounds.push(pr); a.splice(1, 0, a.pop());
  }
  return rounds.concat(rounds.map(pr => pr.map(([h, w]) => [w, h])));
}
const blankRow = () => ({ p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
function buildFixtures() {
  for (let t = 1; t <= 8; t++) { const dv = G.divs[t]; dv.fix = roundRobin(dv.clubs); dv.tab = {}; for (const id of dv.clubs) dv.tab[id] = blankRow(); }
  if (G.club.deduct) { G.divs[G.club.tier].tab[0].pts = -G.club.deduct; G.club.deduct = 0; }
}
function genWorld() {
  const used = new Set([G.club.city]); G.clubs = {}; G.divs = {};
  for (let t = 1; t <= 8; t++) {
    const ids = [];
    for (let i = 0; i < 18; i++) {
      if (t === 8 && i === 0) { G.clubs[0] = { id: 0, name: G.club.name, short: G.club.short, tier: 8, me: true }; ids.push(0); continue; }
      const id = uid(); const town = townName(used);
      G.clubs[id] = { id, name: town + ' ' + pick(SUFFIX), short: town.slice(0, 3).toUpperCase(), tier: t, str: tierAvg(t) + gauss() * 1.1 };
      ids.push(id);
    }
    G.divs[t] = { clubs: ids };
  }
  buildFixtures();
}
function sortTable(t) { const dv = G.divs[t]; return dv.clubs.slice().sort((a, b) => { const x = dv.tab[a], y = dv.tab[b]; return y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || cname(a).localeCompare(cname(b)); }); }
const cname = id => id === 0 ? G.club.name : G.clubs[id].name;
const myPos = () => sortTable(G.club.tier).indexOf(0) + 1;
function expectedRank() { const t = G.club.tier, me = teamStrength(); const xs = G.divs[t].clubs.filter(i => i !== 0).map(i => G.clubs[i].str); return 1 + xs.filter(s => s > me).length; }

/* ---------- squad & selection ---------- */
const squadAvail = () => G.squad.filter(p => p.inj <= 0 && p.susp <= 0);
function fit(p, slot) { return p.pos === slot ? 1 : NEAR[p.pos].includes(slot) ? 0.85 : slot === 'GK' || p.pos === 'GK' ? 0.3 : 0.6; }
const ordWord = n => ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'][n] || n + 'th';
const cact = k => HOOK.coachAct ? HOOK.coachAct(k) : man('coach', k);
function pickXI(noise) {
  const av = squadAvail().slice(), xi = [], ym = cact('youthMins') / 100, rot = cact('rotation') / 100;
  const sel = p => p.ca + (p.age <= 21 ? ym * 1.6 - 0.4 : 0) + (noise ? rot * rnd() * 1.8 : 0) + (p.settle ? 0 : -0.8) + (HOOK.selBonus ? HOOK.selBonus(p) : 0);
  for (const slot of SLOTS) {
    let best = null, bv = -99;
    for (const p of av) { if (xi.some(x => x.p === p)) continue; const v = sel(p) * fit(p, slot); if (v > bv) { bv = v; best = p; } }
    if (best) xi.push({ p: best, slot });
  }
  const bench = av.filter(p => !xi.some(x => x.p === p)).sort((a, b) => b.ca - a.ca).slice(0, 5);
  return { xi, bench };
}
function strengthParts(lineup) {
  const L = lineup || pickXI(false), P = { squad: tierAvg(G.club.tier) - 4, coach: 0, style: 0, morale: 0, extra: 0 };
  if (!L.xi.length) return P;
  let q = 0; for (const x of L.xi) q += x.p.ca * fit(x.p, x.slot) * (x.p.settle ? 1 : 0.94) * (x.p.age <= 21 ? 0.95 : 1); /* inexperience */
  P.squad = q / 11 - (11 - L.xi.length) * 0.6;
  const co = staff('coach'); P.coach = (eff('coach', 0) - tierAvg(G.club.tier)) * 0.18; // B37: a weaker coach than the division's is a weaker team
  if (co) { const st = man('coach', 'style') === 'dna' ? G.club.dna.style : co.style; P.style = st === co.style ? (co.style === G.club.dna.style ? 0.3 : 0.2) : -0.1; } else P.style = -0.2;
  const mor = G.squad.reduce((a, p) => a + p.morale, 0) / Math.max(1, G.squad.length);
  P.morale = (mor - 60) / 40 * 0.35 + (eff('coach', 1) - 10) * 0.02; P.moraleAvg = mor;
  P.extra = (G.push.sporting > 0 ? 0.1 : 0) + (perk('analyst') ? 0.15 : 0) + (G.week <= 4 && G.phase === 'season' ? (G.preEdge || 0) : 0) + (G.matchEdge && G.matchEdge.w === G.week ? G.matchEdge.v : 0) + (HOOK.ftExtra ? HOOK.ftExtra() : 0);
  return P;
}
function teamStrength(lineup) { const P = strengthParts(lineup); return P.squad + P.coach + P.style + P.morale + P.extra; }

