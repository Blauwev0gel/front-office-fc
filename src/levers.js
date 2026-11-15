/* The Front Office · levers
   Grip: a club drifts without a CEO steering it. Decisions you take yourself build grip; weeks
   without them let it slip. Grip lifts or drags every head of department.
   Also: DoF signings that fit the system, a finance alarm before it is too late, and staff picks
   that respect the money. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, money, M, staff, man, chance, gauss } = F;
const MAXW = 16, DECAY = 5;

function gripInit() { const G = g(); if (G.grip == null) { G.grip = 60; G.gripW = 0; G.gripLog = []; } return G.grip; }
function gain(v, why) {
  const G = g(); if (!G) return; gripInit();
  const room = Math.max(0, MAXW - G.gripW), add = Math.min(room, v); if (add <= 0) return;
  G.grip = clamp(G.grip + add, 0, 100); G.gripW += add;
}
// wrap the CEO's own actions
const wrap = (name, v, test) => { const f = F[name]; if (!f) return; F[name] = function (...a) { const r = f.apply(this, a); if (!(r && r.err) && (!test || test(r, a))) gain(v, name); return r; }; };
wrap('respond', 6); wrap('answerBrief', 3); wrap('ftTalkStart', 5, r => !r || r.fresh !== false); // only a fresh talk builds grip wrap('talk', 5); wrap('pressAnswer', 3);
wrap('decideProposal', 3); wrap('sum2Answer', 2); wrap('tkAnswer', 3); wrap('ddDecide', 2); wrap('deptHire', 3); wrap('deptBudSet', 1); wrap('setMandate', 2);

const GRIPK = 14; // grip 100 = +3.6 on every head's attributes, grip 0 = -3.6
const prevEff = H.effBonus;
const GW = { coach: 1, dof: 1, scout: 1, acad: 1, com: 0.4, mkt: 0.6, fin: 0.3 };
H.effBonus = (r, i) => (prevEff ? prevEff(r, i) : 0) + ((g().grip == null ? 60 : g().grip) - 50) / GRIPK * (GW[r] != null ? GW[r] : 1);

// a step up: the first season in a new division is harder, and fades as the squad adapts
const prevExtra = H.ftExtra; H.ftExtra = () => (prevExtra ? prevExtra() : 0) - (g().club.stepUp === g().season ? 0.45 * Math.max(0, 1 - g().week / 38) : 0);
/* ---------- weekly ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(); gripInit();
  G.gripLog.push(Math.round(G.grip)); if (G.gripLog.length > 40) G.gripLog.shift();
  G.grip = clamp(G.grip - DECAY, 0, 100); G.gripW = 0;
  if (G.grip < 25) { G.board.conf = clamp(G.board.conf - 0.35, 0, 100); for (const r in G.staff) if (G.staff[r]) G.staff[r].rel = clamp(G.staff[r].rel - 0.3, 0, 100); }
  if (G.grip < 25 && !G.flags.gripWarn) { G.flags.gripWarn = 1; if (G.paper) G.paper.stories.push({ h: 'Who runs this club?', t: 'Staff are making the calls without direction. The board has noticed.' }); }
  if (G.grip >= 40) G.flags.gripWarn = 0;
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
