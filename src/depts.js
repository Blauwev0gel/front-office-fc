/* The Front Office · departments
   Every department is a real unit: a head, staff underneath, a budget share, facilities, KPI history
   and a log. Staff lift the head's attributes, so they matter everywhere the engine reads them. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { ri, pick, chance, clamp, money, M, staff, man } = F;

const DEPTS = [
  { k: 'first', t: 'First team', head: 'coach', face: 'coach', fac: 'train', facL: 'Training ground', bud: 'own' },
  { k: 'recruit', t: 'Recruitment', head: 'dof', also: 'scout', face: 'scout', bud: 'scout' },
  { k: 'academy', t: 'Academy', head: 'acad', face: 'acad', fac: 'youth', facL: 'Youth facilities', bud: 'acad' },
  { k: 'commercial', t: 'Commercial', head: 'com', face: 'com', bud: 'own' },
  { k: 'marketing', t: 'Marketing', head: 'mkt', face: 'mkt', bud: 'mkt' },
  { k: 'business', t: 'Business', head: 'fin', face: 'fin', bud: null }
];
const DK = Object.fromEntries(DEPTS.map(d => [d.k, d]));
// staff roles: [title, what it does, base wage, [[role, attrIndex, bonus], ...]]
const ROLES = {
  first: { asst: ['Assistant coach', 'Sharper tactics and better development', 260, [['coach', 0, 1.2], ['coach', 2, 0.8]]], fit: ['Fitness coach', 'Fewer injuries, safer hard training', 220, []], ana: ['Match analyst', 'A small edge in every match', 240, [['coach', 0, 0.6]]], psy: ['Sports psychologist', 'Steadier morale, happier squad', 200, [['coach', 1, 1.2]]], gk: ['Goalkeeping coach', 'Better keepers, better development', 180, [['coach', 2, 0.8]]] },
  recruit: { sc: ['Scout', 'More players watched, better reports', 200, [['scout', 0, 1.2], ['scout', 2, 1]]], neg: ['Contract negotiator', 'Lower fees and wages', 240, [['dof', 1, 1.6]]], data: ['Data analyst', 'Fewer bad signings', 220, [['dof', 0, 1.1], ['scout', 1, 0.8]]], loan: ['Loans manager', 'Better loan deals in and out', 180, [['dof', 2, 1.3]]] },
  academy: { yc: ['Youth coach', 'Faster development of the kids', 180, [['acad', 0, 1.5]]], yr: ['Youth recruiter', 'Better intakes', 170, [['acad', 1, 1.5]]], wo: ['Welfare officer', 'Fewer dropouts, happier kids', 150, [['acad', 2, 1.5]]], ed: ['Education officer', 'Rounded players, steady progress', 140, [['acad', 0, 0.7], ['acad', 2, 0.7]]] },
  commercial: { sm: ['Sponsorship manager', 'Better sponsor deals', 240, [['com', 0, 1.5]]], tk: ['Ticketing officer', 'Fuller stands, smarter pricing', 180, [['com', 1, 1.3]]], rt: ['Retail manager', 'More shirts and scarves sold', 200, [['com', 2, 1.5]]] },
  marketing: { so: ['Social media lead', 'Brand grows faster', 190, [['mkt', 1, 1.5]]], cm: ['Community officer', 'Closer ties with the town', 160, [['mkt', 2, 1.5]]], cr: ['Content creator', 'Campaigns that land', 170, [['mkt', 0, 1.5]]] },
  business: { ac: ['Accountant', 'Tighter books, fewer surprises', 220, [['fin', 0, 1.5]]], cc: ['Cost controller', 'Lower running costs', 200, [['fin', 1, 1.5]]], lw: ['Contracts lawyer', 'Better terms on every deal', 240, [['fin', 2, 1.5]]] }
};
const TRAITS = {
  'Experienced': { m: 1.25, w: 1.25, d: 'Knows the job inside out' },
  'Steady': { m: 1, w: 1, d: 'Does what is asked' },
  'Hard-working': { m: 1.15, w: 1.05, d: 'First in, last out' },
  'Well-connected': { m: 1.1, w: 1.15, d: 'Knows everyone in the game' },
  'Young talent': { m: 0.8, w: 0.75, d: 'Raw, improves every season' },
  'Ambitious': { m: 1.2, w: 1.1, d: 'Good, and knows it. May move on' }
};
const FIRSTN = ['Sam', 'Alex', 'Jo', 'Chris', 'Nia', 'Ola', 'Ravi', 'Lena', 'Tom', 'Mia', 'Dev', 'Kai', 'Ines', 'Theo', 'Ruth', 'Amir', 'Faye', 'Luca', 'Hana', 'Owen', 'Zara', 'Ben', 'Elif', 'Marco'];
const LASTN = ['Hale', 'Okoro', 'Brandt', 'Price', 'Mensah', 'Doyle', 'Varga', 'Lund', 'Shah', 'Costa', 'Reyes', 'Finch', 'Abara', 'Kerr', 'Moss', 'Navarro', 'Booth', 'Sato', 'Quinn', 'Dahl', 'Byrne', 'Achebe', 'Pike', 'Nowak'];

function slots() { const t = g().club.tier; return t >= 7 ? 2 : t >= 5 ? 3 : 4; }
const tierK = () => Math.max(1, (9 - g().club.tier) * 0.55);
function ensure() {
  const G = g(); if (G.dept) return G.dept;
  G.dept = {}; for (const d of DEPTS) G.dept[d.k] = { staff: [], cands: {}, kpi: [], log: [] };
  G.deptB = { first: 50, commercial: 50 };
  // move first-team support staff from the old module
  if (G.ft && G.ft.res) { for (const r in G.ft.res) if (ROLES.first[r]) G.dept.first.staff.push(mkStaff('first', r, 'Steady', G.ft.res[r].left)); G.ft.res = {}; }
  return G.dept;
}
function mkStaff(dk, role, trait, left) {
  const G = g(), T = TRAITS[trait || pick(Object.keys(TRAITS))], tr = trait || Object.keys(TRAITS).find(k => TRAITS[k] === T);
  const base = ROLES[dk][role][2];
  return { id: F.uid(), dk, role, name: pick(FIRSTN) + ' ' + pick(LASTN), trait: tr, age: tr === 'Young talent' ? ri(23, 28) : tr === 'Experienced' ? ri(45, 62) : ri(29, 50), wage: Math.round(M(base) * 0.5 * tierK() * T.w / 10) * 10, since: G.season, grow: 0, left: left || 2 };
}
function mult(st) { const T = TRAITS[st.trait] || TRAITS.Steady; return T.m + (st.trait === 'Young talent' ? Math.min(0.5, st.grow * 0.12) : 0); }
const active = st => st.left <= 0;
function has(dk, role) { const D = ensure()[dk]; return D && D.staff.some(s => s.role === role && active(s)); }
F.deptHas = has;

/* ---------- engine hooks ---------- */
H.effBonus = (r, i) => {
  const D = g().dept; if (!D) return 0; let b = 0;
  for (const dk in D) for (const st of D[dk].staff) { if (!active(st)) continue; const R = ROLES[dk][st.role]; if (!R) continue; for (const [rr, ii, v] of R[3]) if (rr === r && (i == null ? true : ii === i)) b += v * 1.6 * mult(st) * (i == null ? 1 / 3 : 1); }
  return b;
};
H.deptCost = () => {
  const G = g(), D = ensure(); let w = 0; for (const dk in D) for (const st of D[dk].staff) w += st.wage;
  const B = G.deptB || {}, bf = k => 0.3 + (B[k] != null ? B[k] : 50) / 100 * 1.4;
  return { deptStaff: w, firstBudget: Math.round(M(220) * bf('first') * tierK() / 10) * 10, comBudget: staff('com') ? Math.round(M(160) * bf('commercial') * tierK() / 10) * 10 : 0 };
};
H.merchMult = () => 0.92 + ((g().deptB || {}).commercial || 50) / 100 * 0.16;
const prevExtra = H.ftExtra; H.ftExtra = () => (prevExtra ? prevExtra() : 0) + (((g().deptB || {}).first || 50) - 50) / 300;
const prevDev = H.ftDev; H.ftDev = () => (prevDev ? prevDev() : 0) + (((g().deptB || {}).first || 50) - 50) / 600;
const prevInj = H.ftInj; H.ftInj = () => (prevInj ? prevInj() : 1) * (1.08 - ((g().deptB || {}).first || 50) / 100 * 0.16);

/* ---------- weekly ---------- */
function kpiOf(dk) {
  const G = g();
  if (dk === 'first') return F.myPos();
  if (dk === 'recruit') return +(G.squad.reduce((a, p) => a + p.ca, 0) / Math.max(1, G.squad.length)).toFixed(2);
  if (dk === 'academy') return G.academy.length ? +(G.academy.reduce((a, p) => a + p.pa, 0) / G.academy.length).toFixed(2) : 0;
  if (dk === 'commercial') return F.sponsorIncome();
  if (dk === 'marketing') return Math.round(G.club.brand);
  if (dk === 'business') return Math.round(G.club.cash);
}
const KPI_L = { first: ['League position', 1], recruit: ['Average squad rating', 0], academy: ['Average academy potential', 0], commercial: ['Sponsorship per week', 0], marketing: ['Brand', 0], business: ['Cash', 0] };
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(), D = ensure();
  for (const d of DEPTS) {
    const X = D[d.k]; const v = kpiOf(d.k); if (Number.isFinite(v)) { X.kpi.push(v); if (X.kpi.length > 40) X.kpi.shift(); }
    for (const st of X.staff) if (st.left > 0 && --st.left === 0) X.log.unshift({ w: G.week, s: G.season, t: `${st.name} is up and running as ${ROLES[d.k][st.role][0].toLowerCase()}.` });
    if (X.log.length > 12) X.log.length = 12;
  }
  if (G.week === 1 && G.deptSeason !== G.season) {
    G.deptSeason = G.season;
    for (const d of DEPTS) { const X = D[d.k]; for (const st of X.staff.slice()) {
      if (st.trait === 'Young talent') st.grow++;
      if (st.trait === 'Ambitious' && G.season - st.since >= 2 && chance(0.35)) { X.staff = X.staff.filter(x => x !== st); X.log.unshift({ w: 1, s: G.season, t: `${st.name} has left for a bigger club.` }); G.paper.stories.push({ h: 'Staff departure', t: `${st.name} leaves the ${d.t.toLowerCase()} department for a bigger club.` }); }
    } }
  }
};

/* ---------- people ---------- */
function cands(dk, role) {
  const X = ensure()[dk]; if (!X.cands[role] || X.cands[role].s !== g().season) X.cands[role] = { s: g().season, c: [mkStaff(dk, role), mkStaff(dk, role)] };
  return X.cands[role].c;
}
function hireStaff(dk, role, i) {
  const G = g(), X = ensure()[dk]; if (X.staff.length >= slots()) return { err: 'No open roles left in this department.' };
  if (X.staff.some(s => s.role === role)) return { err: 'That role is already filled.' };
  const c = cands(dk, role)[i]; if (!c) return; const fee = c.wage * 4; if (G.club.cash < fee) return { err: 'Not enough cash for the signing-on fee.' };
  G.club.cash -= fee; c.since = G.season; c.left = 2; X.staff.push(c); delete X.cands[role];
  const h = staff(DK[dk].head); if (h) h.rel = clamp(h.rel + 2, 0, 100);
  X.log.unshift({ w: G.week, s: G.season, t: `${c.name} hired as ${ROLES[dk][role][0].toLowerCase()}.` });
  return { out: `${c.name} joins as ${ROLES[dk][role][0].toLowerCase()}. Starts in 2 weeks.` };
}
function letGo(dk, id) {
  const G = g(), X = ensure()[dk], st = X.staff.find(s => s.id === id); if (!st) return;
  const pay = st.wage * 4; G.club.cash -= pay; X.staff = X.staff.filter(s => s !== st);
  const h = staff(DK[dk].head); if (h) h.rel = clamp(h.rel - 3, 0, 100);
  X.log.unshift({ w: G.week, s: G.season, t: `${st.name} let go.` });
  return { out: `${st.name} has left. Paid ${money(pay)} in notice.` };
}

/* ---------- budget split ---------- */
const BUD = ['first', 'recruit', 'academy', 'commercial', 'marketing'];
function budGet(k) { const d = DK[k]; if (d.bud === 'own') return (g().deptB || {})[k] != null ? g().deptB[k] : 50; return man(d.bud, 'budget'); }
function budCap() { const G = g(); if (G.deptCap0 == null) G.deptCap0 = Math.ceil(budUsed() / 10) * 10 + 20; return Math.max(G.deptCap0, Math.round(clamp(260 + (man('fin', 'risk') - 35) * 1.5 + (F.eff('fin', 1) - 10) * 4 + (staff('fin') ? 0 : -30), 200, 380) / 10) * 10); }
function budUsed() { return BUD.reduce((a, k) => a + budGet(k), 0); }
function budSet(k, v) {
  const G = g(), d = DK[k]; if (!d || !d.bud) return; v = clamp(Math.round(v / 5) * 5, 0, 100);
  const cur = budGet(k), others = budUsed() - cur; if (v > cur && others + v > budCap()) v = Math.max(cur, Math.floor((budCap() - others) / 5) * 5); if (v === cur) return { v, capped: true };
  if (d.bud === 'own') { (G.deptB = G.deptB || {})[k] = v; }
  else { G.mand[d.bud] = Object.assign({}, G.mand[d.bud], { budget: v }); }
  return { v };
}
function budCost(k) {
  const v = budGet(k), f = 0.3 + v / 100 * 1.4, T = tierK();
  if (k === 'first') return Math.round(M(220) * f * T / 10) * 10;
  if (k === 'commercial') return Math.round(M(160) * f * T / 10) * 10;
  if (k === 'recruit') return staff('scout') ? Math.round(M(300) * f) : 0;
  if (k === 'academy') return Math.round(M(380) * f);
  if (k === 'marketing') return staff('mkt') ? Math.round(M(250) * f) : 0;
  return 0;
}
const BUD_D = { first: 'Training, kit and travel', recruit: 'Scouting trips and data', academy: 'Coaching, pitches and food', commercial: 'Sales and activation', marketing: 'Campaigns and content' };

/* ---------- views ---------- */
// Scorecard rows are observations, not a task list. Only evidence-backed concerns
// become departmental signals; supporting staff vacancies are never mandatory.
const SIGNALS = {
  first: {
    'Squad quality': ['Squad below league standard', 'The current squad compares poorly with the division. Recruitment and coaching may both matter.', 'dof', 'mand', 'recruit'],
    'xG difference per game': ['Chances going against us', 'Results alone do not explain performance. Review the trend with the head coach.', 'coach', 'talk', 'first'],
    'Injured': ['Injury list growing', 'Three or more players are unavailable. Ask the coach about workload and medical support.', 'coach', 'talk', 'first']
  },
  recruit: {
    'Scouting network, focus': ['Scouting reach is limited', 'The network is thin in the chosen regions. Revisit scouting priorities and resources.', 'scout', 'mand', 'recruit'],
    'Scouting accuracy': ['Reports need scrutiny', 'Past estimates differ from the players eventually observed. Review scouting methods before committing more funds.', 'scout', 'talk', 'recruit']
  },
  commercial: {
    'Sponsorship': ['Sponsorship below season start', 'Weekly sponsorship income is below its opening level. Review the commercial offers and commitments.', 'com', 'talk', 'commercial'],
    'Stadium fill': ['Seats going unsold', 'Average attendance is below 45% of capacity. Price and matchday experience are possible levers, not guaranteed cures.', 'com', 'talk', 'commercial']
  },
  marketing: {
    'Supporter base': ['Supporter base slipping', 'The supporter base has fallen since the season began. Discuss audience and campaign priorities.', 'mkt', 'talk', 'marketing'],
    'Brand strength': ['Brand losing ground', 'Brand strength is below its starting point. Campaign impact takes time to assess.', 'mkt', 'talk', 'marketing'],
    'Supporter mood': ['Supporters close to protest', 'Supporter mood is below 35. Results and club decisions may be contributing.', 'mkt', 'talk', 'marketing']
  },
  business: {
    'Player wages vs revenue': ['Wages exceed policy limit', 'The wage-to-revenue ratio exceeds the agreed cap. Finance must weigh savings against sporting ambition.', 'fin', 'mand', 'business'],
    'Last week': ['Weekly operating deficit', 'Last week cost more than it brought in. A single week does not establish a structural shortfall.', 'fin', 'talk', 'business'],
    'Cash runway': ['Cash reserves under pressure', 'At the latest weekly burn rate, cash may run out within ten weeks. This is an estimate, not a forecast.', 'fin', 'talk', 'business']
  }
};
function status(dk) {
  const sc = F.scorecard().find(x => x.k === dk);
  if (!sc) return { st: 'mid', l: 'Steady', rows: [], issues: [] };
  const G = g(), played = (G.ss && G.ss.lg) || 0;
  const issues = [];
  for (const row of sc.rows) {
    if (row.ok !== false) continue;
    const spec = (SIGNALS[dk] || {})[row.l];
    if (!spec) continue;
    // Early outcomes are evidence to watch, not failures to assign to a new head.
    if (played < 4 && (dk === 'commercial' || dk === 'marketing' || row.l === 'xG difference per game')) continue;
    if (row.l === 'Last week' && played < 4) continue;
    if (row.l === 'Cash runway' && issues.some(x => x.key === 'Last week')) {
      const i = issues.findIndex(x => x.key === 'Last week'); issues.splice(i, 1);
    }
    if (row.l === 'Last week' && issues.some(x => x.key === 'Cash runway')) continue;
    issues.push({ key: row.l, title: spec[0], why: spec[1], owner: spec[2], action: spec[3], department: spec[4], evidence: row.l + ': ' + row.v + (row.ref ? ' (' + row.ref + ')' : '') });
  }
  const good = sc.rows.some(r => r.ok === true);
  return { st: issues.length ? 'bad' : good ? 'good' : 'mid',
    l: issues.length ? issues[0].title : 'No urgent concerns',
    extra: Math.max(0, issues.length - 1), issues, rows: sc.rows };
}
function view(dk) {
  const G = g(), d = DK[dk], X = ensure()[dk], used = X.staff.length, S = status(dk);
  const filled = new Set(X.staff.map(s => s.role));
  return {
    d, head: staff(d.head), also: d.also ? staff(d.also) : null, status: S,
    staff: X.staff.map(s => ({ ...s, title: ROLES[dk][s.role][0], what: ROLES[dk][s.role][1], tdesc: (TRAITS[s.trait] || {}).d, on: active(s), mult: mult(s) })),
    open: Object.keys(ROLES[dk]).filter(r => !filled.has(r)).map(r => ({ role: r, title: ROLES[dk][r][0], what: ROLES[dk][r][1], wage: Math.round(M(ROLES[dk][r][2]) * 0.5 * tierK() / 10) * 10 })),
    slots: slots(), used, kpi: X.kpi.slice(), kpiL: KPI_L[dk], log: X.log.slice(0, 6),
    bud: d.bud ? { v: budGet(dk), cost: budCost(dk), d: BUD_D[dk] } : null,
    fac: d.fac ? { l: d.facL, lv: G.club.fac[d.fac] } : null,
    projects: (G.projects || []).filter(p => p.owner === d.head || (d.also && p.owner === d.also))
  };
}
function overview() { return DEPTS.map(d => { const X = ensure()[d.k]; return { k: d.k, t: d.t, head: d.head, s: staff(d.head), status: status(d.k), used: X.staff.length, slots: slots(), staffOn: X.staff.filter(active).length }; }); }
function budView() { return { cap: budCap(), used: budUsed(), rows: BUD.map(k => ({ k, t: DK[k].t, v: budGet(k), cost: budCost(k), d: BUD_D[k], vacant: !staff(DK[k].head) })) }; }

Object.assign(F, { DEPTS, DEPT: DK, DEPT_ROLES: ROLES, deptEnsure: ensure, deptView: view, deptOverview: overview, deptCands: cands, deptHire: hireStaff, deptLetGo: letGo, deptBudView: budView, deptBudSet: budSet });
})(FO);
