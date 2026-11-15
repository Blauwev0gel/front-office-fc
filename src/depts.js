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
  if (G.phase === 'season' && G.week % 2 === 0) for (const d of DEPTS) headHire(d.k);
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
function hireStaff(dk, role, i, byHead) {
  const G = g(), X = ensure()[dk]; if (X.staff.length >= slots()) return { err: 'No open roles left in this department.' };
  if (X.staff.some(s => s.role === role)) return { err: 'That role is already filled.' };
  const c = cands(dk, role)[i]; if (!c) return; const fee = c.wage * 4; if (G.club.cash < fee) return { err: 'Not enough cash for the signing-on fee.' };
  G.club.cash -= fee; c.since = G.season; c.left = 2; X.staff.push(c); delete X.cands[role];
  const h = staff(DK[dk].head); if (h && !byHead) h.rel = clamp(h.rel + 2, 0, 100);
  X.log.unshift({ w: G.week, s: G.season, t: byHead ? `${h ? h.name.split(' ')[0] : 'The head'} hired ${c.name} as ${ROLES[dk][role][0].toLowerCase()}${byHead === true ? '' : ': ' + byHead}.` : `${c.name} hired as ${ROLES[dk][role][0].toLowerCase()}.` });
  return { out: `${c.name} joins as ${ROLES[dk][role][0].toLowerCase()}. Starts in 2 weeks.` };
}
function letGo(dk, id, why) {
  const G = g(), X = ensure()[dk], st = X.staff.find(s => s.id === id); if (!st) return;
  const pay = st.wage * 4; G.club.cash -= pay; X.staff = X.staff.filter(s => s !== st);
  const h = staff(DK[dk].head); if (h && !why) h.rel = clamp(h.rel - 3, 0, 100);
  X.log.unshift({ w: G.week, s: G.season, t: why ? `${h ? h.name.split(' ')[0] : 'The head'} let ${st.name} go: ${why}.` : `${st.name} let go.` });
  return { out: `${st.name} has left. Paid ${money(pay)} in notice.` };
}

/* ---------- the head runs his own staff (B18) ---------- */
// How many people he wants follows the budget level you set, nudged by his character.
function staffWant(dk) {
  const d = DK[dk], h = staff(d.head); if (!h) return 0;
  const lv = d.bud ? budGet(dk) : 50; let n = lv < 25 ? 0 : lv <= 37 ? 1 : lv >= 65 ? slots() : Math.min(2, slots());
  if (h.p.amb >= 14) n++; if (h.p.risk <= 6) n--; return clamp(n, 0, slots());
}
// He fills the role that shores up his weakest side; a strong head picks the better candidate.
function headHire(dk) {
  const G = g(), d = DK[dk], X = ensure()[dk], h = staff(d.head); if (!h || G.phase !== 'season') return;
  const want = staffWant(dk);
  if (X.staff.length > want) { const st = X.staff.slice().sort((a, b) => mult(a) - mult(b))[0]; return letGo(dk, st.id, 'the budget no longer covers the role'); }
  if (X.staff.length >= want || (G.staffAsk || {})[dk] || !chance(0.5)) return;
  const R = ROLES[dk], filled = new Set(X.staff.map(x => x.role)), open = Object.keys(R).filter(r => !filled.has(r)); if (!open.length) return;
  const weak = h.at.indexOf(Math.min(...h.at)), AT = (F.ROLE[d.head] || { at: [] }).at;
  const score = r => R[r][3].reduce((a, [rr, ii, v]) => a + (rr === d.head ? v * (ii === weak ? 2 : 1) : v * 0.5), 0) + (dk === 'first' && r === 'fit' && G.squad.filter(p => p.inj > 0).length >= 3 ? 3 : 0) + F.rnd() * 0.6;
  const role = open.sort((a, b) => score(b) - score(a))[0], cs = cands(dk, role);
  const strong = F.eff(d.head) - F.tierAvg(G.club.tier) >= 2, i = strong ? (mult(cs[0]) >= mult(cs[1]) ? 0 : 1) : (F.rnd() < 0.5 ? 0 : 1), c = cs[i];
  const why = R[role][3].some(x => x[0] === d.head && x[1] === weak) && AT[weak] ? `to shore up his ${AT[weak].toLowerCase()}` : R[role][1].toLowerCase();
  const lim = F.deskLimit ? F.deskLimit(d.head) : Infinity;
  if (c.wage > lim && F.convoAsk) { (G.staffAsk = G.staffAsk || {})[dk] = { role, i, why }; return F.convoAsk(d.head, { k: 'staff', dk, role, i, why, wage: c.wage, fee: c.wage * 4, title: R[role][0], name: c.name }); }
  if (G.club.cash < c.wage * 4 * 3) return; // not while money is tight
  return hireStaff(dk, role, i, why);
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
/* ---------- verdict and attention: what the CEO should look at ---------- */
// One word and one sentence on how the department is doing, judged on its own course.
function verdict(dk) {
  const G = g(), d = DK[dk], head = staff(d.head); if (!head) return { w: 'Vacant', st: 'bad', t: `Nobody runs ${d.t.toLowerCase()}.` };
  if (dk === 'first') {
    if ((G.ss.lg || 0) < 3 || G.phase !== 'season') return { w: 'Early days', st: 'mid', t: 'Too few games to judge.' };
    const pos = F.myPos(), exp = F.expectedRank(), dd = pos - exp, t = `${F.ord(pos)}, expected ${F.ord(exp)}.`;
    return dd <= -2 ? { w: 'Ahead', st: 'good', t } : dd <= 1 ? { w: 'On course', st: 'good', t } : dd <= 3 ? { w: 'Behind', st: 'mid', t } : { w: 'Well behind', st: 'bad', t };
  }
  if (dk === 'recruit') {
    const ev = (F.recEval ? F.recEval(G.season) : []).filter(e => e.verdict === 'Hit' || e.verdict === 'Miss'), hit = ev.filter(e => e.verdict === 'Hit').length, miss = ev.length - hit;
    if (ev.length < 2) { const win = F.window_(); return { w: win ? 'Window open' : 'Between windows', st: 'mid', t: win ? 'The DoF is working the market.' : 'Signings are judged once they have played.' }; }
    const t = `${hit} hit${hit === 1 ? '' : 's'}, ${miss} miss${miss === 1 ? '' : 'es'} this season.`;
    return hit > miss ? { w: 'Strong', st: 'good', t } : hit === miss ? { w: 'Mixed', st: 'mid', t } : { w: 'Struggling', st: 'bad', t };
  }
  if (dk === 'academy' && G.acad && G.acad.cat) {
    const cat = G.acad.cat, sc = F.acadView ? Math.round(F.acadView().catScore.total) : 0, nx = sc < 55 ? 55 : sc < 75 ? 75 : 95, t = `Category ${cat}. Score ${sc}${cat > 1 ? `, next category at ${nx}` : ''}.`;
    return cat <= 2 ? { w: 'Strong', st: 'good', t } : cat === 3 ? { w: 'Steady', st: 'mid', t } : { w: 'Weak', st: 'bad', t };
  }
  const rc = F.record(d.head), v = rc.verdict;
  return { w: v === 'Too early' ? 'Early days' : v, st: v === 'Strong' ? 'good' : v === 'Poor' ? 'bad' : 'mid', t: v === 'Too early' ? 'Too few weeks to judge.' : `The numbers say: ${v.toLowerCase()}.` };
}
// At most three things that need the CEO, each with its cause and one action.
// action: { a: 'talk' | 'mand' | 'plan' | 'people' | 'record' | 'dept', x: role or department, l: button label }
function attention(dk) {
  const G = g(), d = DK[dk], head = staff(d.head), out = [], add = (t, a, x, l, pr) => out.push({ t, a, x, l, pr: pr || 1 });
  if (!head) { add(`Nobody runs ${d.t.toLowerCase()}. It runs on chance.`, 'people', d.head, 'Hire', 9); return out; }
  const sc = (F.scorecard().find(x => x.k === dk) || { rows: [] }).rows, row = l => sc.find(r => r.l === l), red = l => { const r = row(l); return r && r.ok === false ? r : null; };
  const used = new Set();
  if (dk === 'first' && F.ftView) {
    const v = F.ftView(), gap = v.rows.slice().sort((a, b) => Math.abs(b.d) - Math.abs(a.d))[0];
    if (gap && Math.abs(gap.d) >= 15) add(`He goes his own way on ${gap.name} (${gap.d > 0 ? '+' : '−'}${Math.abs(gap.d)} against your mandate). It costs his trust each week.`, 'talk', 'coach', 'Raise it', 3);
    if (head.rel < 35) add(`Your relationship with ${head.name.split(' ')[0]} is cold. He follows your mandate less.`, 'talk', 'coach', 'Talk', 4);
    if (v.refused) add(`He refused to give ${v.refused.name} more minutes. "I pick the team."`, 'talk', 'coach', 'Talk', 2);
    if (!v.deal && G.phase === 'season' && G.week <= SW - 5) add('No target agreed. A met target lifts his trust and the board\'s.', 'talk', 'coach', 'Agree one', 1);
    let r = red('Squad quality'); if (r) { used.add(r.l); add(`The squad is below the division average (${r.v}, ${r.ref}).`, 'dept', 'recruit', 'Recruitment', 2); }
    r = red('Injured'); if (r) { used.add(r.l); add(`${r.v} players injured. A fitness coach and lighter training cut injuries.`, 'people', 'first', 'Staff', 2); }
  }
  if (dk === 'recruit') {
    if (!staff('scout')) add('There is no chief scout. Nobody is watching players.', 'people', 'scout', 'Hire', 8);
    let r = red('Signings rated vs squad'); if (r) { used.add(r.l); add(`This season's signings rate below the squad (${r.v}).`, 'record', '', 'See signings', 3); }
    r = red('Scouting network, focus'); if (r) { used.add(r.l); add(`The network in the focus regions is thin (${r.v.replace(' / ', ' of ')}). A scouting trip grows it fast.`, 'plan', '', 'Plan a trip', 2); }
    r = red('Scouting accuracy'); if (r) { used.add(r.l); add(`Scout reports are off by about ${r.v}. A data analyst or a stronger network sharpens them.`, 'people', 'recruit', 'Staff', 2); }
    const rc = G.rec, blk = rc ? rc.pipe.filter(x => x.blocked && rc.pool[x.pid]) : [], cap = blk.filter(x => x.blocked.includes('wage cap')).length, own = blk.length - cap;
    if (own) add(`${own} target${own === 1 ? ' is' : 's are'} blocked by limits in the DoF's mandate.`, 'mand', 'dof', 'DoF mandate', 2);
    if (cap) add(`${cap} target${cap === 1 ? ' is' : 's are'} blocked by the wage cap, which Finance sets.`, 'mand', 'fin', 'Finance mandate', 2);
  }
  if (dk === 'academy' && F.acadView) {
    for (const x of F.acadView().diag) add(x.t, x.a === 'mand' ? 'mand' : x.a === 'tab' ? 'people' : 'record', x.a === 'mand' ? x.x : 'acad', x.a === 'mand' ? 'Mandate' : x.a === 'tab' ? 'Hire' : 'See record', x.a === 'mand' ? 2 : 1);
    used.add('Category');
  }
  for (const r of sc) if (r.ok === false && !used.has(r.l)) add(`${r.l}: ${r.v}${r.ref ? ` (${r.ref})` : ''}.`, 'record', '', 'See record', 0.5);
  return out.sort((a, b) => b.pr - a.pr).slice(0, 3);
}
const SW = F.SEASON_WEEKS || 34;
function status(dk) {
  const sc = F.scorecard().find(x => x.k === dk), V = verdict(dk), A = attention(dk);
  return { st: V.st, l: V.w, verdict: V, att: A, rows: sc ? sc.rows : [] }; // the chip is the verdict; what needs the CEO comes as a request to talk (B19)
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

Object.assign(F, { deptHeadHire: headHire, deptStaffWant: staffWant, deptVerdict: verdict, deptAttention: attention, DEPTS, DEPT: DK, DEPT_ROLES: ROLES, deptEnsure: ensure, deptView: view, deptOverview: overview, deptCands: cands, deptHire: hireStaff, deptLetGo: letGo, deptBudView: budView, deptBudSet: budSet });
})(FO);
