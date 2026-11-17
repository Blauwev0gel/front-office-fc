/* The Front Office · staff, financial safeguards and transfer levers.
   Legacy Grip is inert; CEO actions do not generate a parallel activity score. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, money, M, staff, man, chance, gauss } = F;
// Legacy Grip values remain in old saves, but no gameplay action may farm them.
// CEO quality is evaluated through staff, mandates and real stakeholder outcomes.
const gain = () => {};

const prevEff = H.effBonus;
H.effBonus = (r, i) => (prevEff ? prevEff(r, i) : 0);

// a step up: the first season in a new division is harder, and fades as the squad adapts
const prevExtra = H.ftExtra; H.ftExtra = () => (prevExtra ? prevExtra() : 0) - (g().club.stepUp === g().season ? 0.45 * Math.max(0, 1 - g().week / 38) : 0);
/* ---------- weekly ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g();
  // No Grip maintenance: responsible delegation is an ordinary CEO playstyle.
  // over the wage cap: Finance and the DoF move a high earner on while the window is open
  const cap = +man('fin', 'wageCap');
  if (staff('fin') && F.window_() && F.wageRatio() * 100 > cap + 12 && F.absWeek() - (G.flags.trimAt || -99) >= 2 && G.squad.length > 18) {
    const prot = new Set(F.protectedIds ? F.protectedIds() : []), xi = new Set(G.lastMatch && G.lastMatch.xi || []);
    const p = G.squad.filter(x => !prot.has(x.id) && !xi.has(x.id)).sort((a, b) => b.wage - a.wage)[0];
    if (p) { G.flags.trimAt = F.absWeek(); const fee = Math.round(p.value * 0.7 / 100) * 100; F.sellPlayer(p, fee, null); if (G.paper) G.paper.stories.push({ h: 'Wage bill trimmed', t: `${p.name} leaves for ${money(fee)}. Finance: wages were ${Math.round(F.wageRatio() * 100)}% of revenue against a cap of ${cap}%.` }); }
  }
  // finance alarm: projected to run dry within 6 weeks
  const run = runway();
  if (run != null && run <= (F.deptHas && F.deptHas('business', 'ac') ? 9 : 6) + Math.max(0, Math.round((F.eff('fin', 0) - 10) / 3)) && G.club.cash > 0 && F.absWeek() - (G.flags.alarmAt || -99) >= 10) { G.flags.alarmAt = F.absWeek(); F.queueEvent('fin_alarm', { run }); }
};

/* ---------- money ---------- */
function net() { const f = F.weekForecast(), dc = H.deptCost ? Object.values(H.deptCost()).reduce((a, b) => a + b, 0) : 0; return f.rev - f.cost - dc; }
function runway() { const n = net(); return n < 0 ? Math.floor(g().club.cash / -n) : null; }
function tight() { const r = runway(); return (r != null && r < 14) || g().club.cash < 0 || F.wageRatio() * 100 > +man('fin', 'wageCap') + 5; }
F.defineEvent('fin_alarm', { forced: 1, from: 'fin', dept: 'business', cd: 10,
  title: () => 'The money runs out soon',
  body: c => `At this rate the cash runs out in about ${c.run} week${c.run === 1 ? '' : 's'}. We lose ${money(Math.abs(net()))} a week. Debt stands at ${money(g().club.debt || 0)}.`,
  why: 'Finance projects the bank balance below zero within six weeks.',
  opts: [
    { l: 'Cut every department budget', h: 'Costs ↓ · staff and results ↓', f: () => { for (const k of ['first', 'recruit', 'academy', 'commercial', 'marketing']) { const B = F.deptBudView().rows.find(x => x.k === k); if (B) F.deptBudSet(k, B.v - 20); } return 'Budgets cut across the club. Nobody is happy, but the bleeding slows.'; } },
    { l: 'Sell a player now', h: 'Cash ↑ · a starter leaves', f: () => { const prot = new Set(F.protectedIds ? F.protectedIds() : []); const p = g().squad.filter(x => !prot.has(x.id)).sort((a, b) => b.value - a.value)[0]; if (!p) return 'Nobody we can sell.'; const fee = Math.round(p.value * 0.8 / 100) * 100; F.sellPlayer(p, fee, null); return `${p.name} sold for ${money(fee)}. The DoF is not pleased.`; } },
    { l: 'Take a bank loan', h: () => `+${money(M(25000))} now · debt ↑`, f: () => { g().club.cash += M(25000); g().club.debt = (g().club.debt || 0) + M(27500); return 'The bank lends, at a price. Interest is due every week.'; } },
    { l: 'Ride it out', h: 'Hope results bring money', f: () => 'Finance logs your decision. Nervously.' }],
  auto: () => man('fin', 'risk') > 60 && (g().club.debt || 0) < M(80000) ? 2 : 0, vacant: 3 });

// staff picks respect the money
const wrapAuto = (id, safe) => { const E = F.EV && F.EV[id]; if (!E || !E.auto) return; const a = E.auto; E.auto = c => tight() ? safe : a(c); };
function patchAutos() {
  wrapAuto('rec_approve', 3); wrapAuto('rec_raise', 2); wrapAuto('rec_rival', 2);
  const cc = F.EV && F.EV.cash_crisis; if (cc) cc.auto = () => (g().club.debt || 0) > M(60000) ? 2 : man('fin', 'risk') > 50 ? 1 : 2;
}

/* ---------- DoF: signings that fit ---------- */
const prevSign = F.sign;
F.sign = function (p, ...rest) {
  const r = prevSign.call(this, p, ...rest);
  if (p && p.fit == null && g().phase !== 'setup') {
    const fit = (F.eff('dof', 0) - 10) * 0.13 + (F.eff('coach', 0) - 10) * 0.02 + gauss() * 0.3;
    p.fit = +fit.toFixed(2);
    for (const k in F.POSW[p.pos]) p.a[k] = clamp(p.a[k] + fit, 1, 20);
    F.upd(p);
  }
  return r;
};

Object.assign(F, { gripGain: gain, finRunway: runway, finTight: tight });
patchAutos();
})(FO);
