/* The Front Office · Business department
   A season budget per department (lean, normal, invest) against what the club can afford,
   a forecast whose accuracy depends on Finance, cost control, better contract terms and refinancing. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, money, M, staff, man, chance } = F;
const has = r => F.deptHas && F.deptHas('business', r);
const DK = ['first', 'recruit', 'academy', 'commercial', 'marketing'];
const LV = [['lean', 'Lean', 25], ['normal', 'Normal', 50], ['invest', 'Invest', 80]];
const lvOf = v => v <= 37 ? 'lean' : v >= 65 ? 'invest' : 'normal';
function B() { const G = g(); if (!G.biz) G.biz = { planS: null, prop: null, refiAt: -99, log: [] }; return G.biz; }

/* ---------- costs and terms ---------- */
const prevDisc = H.costDisc; H.costDisc = () => (prevDisc ? prevDisc() : 1) * (has('cc') ? 0.92 : 1);
const prevSign = F.sign;
F.sign = function (p, ...rest) { const r = prevSign.call(this, p, ...rest); if (p && p.wage && !p.termsDone && g().phase !== 'setup') { p.termsDone = 1; const f = clamp(1 - (F.eff('fin', 2) - 10) * 0.01, 0.85, 1.1) * (has('lw') ? 0.92 : 1); p.wage = Math.round(p.wage * f / 5) * 5; } return r; };

/* ---------- forecast and envelope ---------- */
function fixed() { const G = g(), f = F.weekForecast(); return { rev: f.rev, wages: F.playerWages(), cost: f.cost }; }
function deptCostAt(k, v) { const T = Math.max(1, (9 - g().club.tier) * 0.55), fct = 0.3 + v / 100 * 1.4; return k === 'first' ? Math.round(M(220) * fct * T) : k === 'commercial' ? Math.round(M(160) * fct * T) : k === 'recruit' ? (staff('scout') ? Math.round(M(300) * fct) : 0) : k === 'academy' ? Math.round(M(380) * fct) : k === 'marketing' ? (staff('mkt') ? Math.round(M(250) * fct) : 0) : 0; }
function cur(k) { const r = F.deptBudView().rows.find(x => x.k === k); return r ? r.v : 50; }
function plan() {
  const fx = fixed(), budNow = DK.reduce((a, k) => a + deptCostAt(k, cur(k)), 0);
  const other = fx.cost - budNow; // everything that is not a department budget
  const acc = clamp((F.eff('fin', 0) - 4) / 14, 0, 1) * (has('ac') ? 1 : 0.85), err = Math.round((1 - acc) * 25);
  const env = Math.max(0, Math.round(fx.rev * 0.97 - other));
  return { rev: Math.round(fx.rev), err, env, spend: budNow, rows: DK.map(k => ({ k, t: F.DEPT[k].t, v: cur(k), lv: lvOf(cur(k)), cost: deptCostAt(k, cur(k)), costs: LV.map(l => deptCostAt(k, l[2])) })) };
}
function setLevel(k, lv) { const L = LV.find(x => x[0] === lv); if (!L || !DK.includes(k)) return; const G = g(), d = F.DEPT[k]; if (d.bud === 'own') { (G.deptB = G.deptB || {})[k] = L[2]; } else { G.mand[d.bud] = Object.assign({}, G.mand[d.bud], { budget: L[2] }); } return { out: `${d.t}: ${L[1].toLowerCase()} budget.` }; }
// Finance proposes: start from normal, protect what the DNA cares about, cut until it fits
function propose() {
  const G = g(), P = plan(), dna = G.club.dna || {}, keep = new Set(['first']); if (dna.youth === 'academy' || dna.identity === 'academy') keep.add('academy');
  const acc = 1 - P.err / 100, guess = P.rev * (chance(0.5) ? acc : 2 - acc), other = fixed().cost - P.spend, env = Math.max(0, guess * 0.97 - other);
  const lv = Object.fromEntries(DK.map(k => [k, 'normal']));
  const total = () => DK.reduce((a, k) => a + deptCostAt(k, LV.find(l => l[0] === lv[k])[2]), 0);
  const order = DK.filter(k => !keep.has(k)).concat([...keep]);
  for (const k of order) { if (total() <= env) break; lv[k] = 'lean'; }
  if (total() < env * 0.8) for (const k of ['first', 'commercial', 'marketing']) { if (total() + 200 < env * 0.95) lv[k] = 'invest'; }
  return lv;
}
function applyProp(lv) { for (const k in lv) setLevel(k, lv[k]); }

/* ---------- briefs: budget moment, review, refinancing ---------- */
F.defineBrief('biz_budget', { role: 'fin', cd: 30,
  check: () => { const X = B(), G = g(); if (G.week > 3 || X.planS === G.season) return null; X.planS = G.season; X.prop = propose(); return { score: 4 }; },
  title: () => 'Budget proposal for the season',
  text: () => { const X = B(), P = plan(); return `Revenue expected around ${money(P.rev)} a week (give or take ${P.err}%). Proposal: ${DK.map(k => `${F.DEPT[k].t.toLowerCase()} ${X.prop ? X.prop[k] : 'normal'}`).join(', ')}.`; },
  opts: [
    { l: 'Accept the proposal', h: 'Budget set by Finance', f: () => { applyProp(B().prop || propose()); return 'Budgets set for the season.'; } },
    { l: 'Invest everywhere', h: 'Costs ↑ · Finance worried', f: () => { DK.forEach(k => setLevel(k, 'invest')); const s = staff('fin'); if (s) s.rel = clamp(s.rel - 4, 0, 100); return '"On your head be it." Every department gets more.'; } },
    { l: 'Keep last season\'s budgets', h: '', f: () => 'Budgets stay as they were.' }] });
F.defineBrief('biz_review', { role: 'fin', cd: 30,
  check: () => { const G = g(), X = B(); if (G.week < 18 || G.week > 21 || X.revS === G.season) return null; const P = plan(); if (P.spend <= P.env) return null; X.revS = G.season; X.prop = propose(); return { score: 3, over: P.spend - P.env }; },
  title: () => 'Halfway: we are over budget',
  text: c => `Department spending runs ${money(c.over)} a week above what revenue covers. Finance wants to cut back to the plan.`,
  opts: [
    { l: 'Cut back to the plan', h: 'Costs ↓', f: () => { applyProp(B().prop || propose()); return 'Budgets trimmed. The departments grumble.'; } },
    { l: 'Accept the overspend', h: 'Cash ↓ · board notices', f: () => { g().board.conf = clamp(g().board.conf - 2, 0, 100); return 'Spending stays. The board asks questions.'; } },
    { l: 'Cut only the academy and marketing', h: 'Protect the team', f: () => { setLevel('academy', 'lean'); setLevel('marketing', 'lean'); return 'Academy and marketing on lean budgets.'; } }] });
F.defineBrief('biz_refi', { role: 'fin', cd: 12,
  check: () => { const G = g(), X = B(); if (!(G.club.debt > 0) || F.absWeek() - X.refiAt < 12) return null; const nr = 0.0012 * clamp(1.25 - F.eff('fin', 2) / 25 - (has('ac') ? 0.08 : 0), 0.55, 1.2); if (nr >= (G.club.rate || 0.0012) * 0.95) return null; X.refiAt = F.absWeek(); return { score: 2, nr, fee: Math.round(M(1200) / 100) * 100 }; },
  title: () => 'The bank offers better terms',
  text: c => `Refinancing would cut interest from ${money(Math.round(g().club.debt * (g().club.rate || 0.0012)))} to ${money(Math.round(g().club.debt * c.nr))} a week. Arrangement fee ${money(c.fee)}.`,
  opts: [
    { l: 'Refinance', h: c => `−${money(c.fee)} now · interest ↓`, f: c => { g().club.cash -= c.fee; g().club.rate = c.nr; return 'New terms signed. Interest drops from next week.'; } },
    { l: 'Not now', h: '', f: () => 'The current loan stays.' }] });

function view() { const P = plan(), X = B(); return { ...P, levels: LV, prop: X.prop, ok: P.spend <= P.env, rate: g().club.rate || 0.0012, debt: g().club.debt || 0 }; }
Object.assign(F, { bizView: view, bizSetLevel: setLevel, bizPropose: () => { const p = propose(); B().prop = p; return p; }, bizApply: () => { applyProp(B().prop || propose()); return { out: 'Finance\'s proposal applied.' }; }, BIZ_DK: DK });
})(FO);
