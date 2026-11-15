/* The Front Office · Marketing department
   A supporter funnel (reach, fans, season-ticket holders), loyalty that cushions bad results,
   campaigns with a cost and a target, a community programme, and the risk of an edgy tone. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { ri, pick, chance, clamp, money, M, staff, man } = F;
const has = r => F.deptHas && F.deptHas('marketing', r);
const CAMPS = {
  family: { t: 'Local families', d: 'Schools and estates. Fills the family stand.', cost: 1500, wk: 6, reach: 0.020, conv: 0.04 },
  young: { t: 'Students and young fans', d: 'Cheap, loud, online. Turns reach into fans.', cost: 1200, wk: 5, reach: 0.015, conv: 0.07 },
  region: { t: 'Regional push', d: 'Radio and billboards. Big reach, slow to convert.', cost: 2600, wk: 8, reach: 0.045, conv: 0.02, brand: 0.4 },
  online: { t: 'Online content', d: 'Videos and behind the scenes. Builds the brand.', cost: 900, wk: 6, reach: 0.018, conv: 0.03, brand: 0.6 }
};
const COMM_L = ['None', 'School visits', 'Clinics and charity days', 'Full community trust'];
function K() {
  const G = g(), c = G.club;
  if (!G.mk) G.mk = { reach: Math.round(c.fanbase * 3.2), loyalty: 45, comm: 0, camp: null, hist: [], log: [], stSeason: null };
  if (c.seasonTix == null) c.seasonTix = Math.round(c.fanbase * 0.12);
  return G.mk;
}
const form = () => g().form.slice(-5).reduce((a, r) => a + (r === 'W' ? 1 : r === 'L' ? -1 : 0), 0);
function campMult() { return (0.6 + F.eff('mkt', 0) / 25) * (has('cr') ? 1.3 : 1); }
H.fanWeekly = fanTarget => {
  const G = g(), c = G.club, X = K();
  // reach: awareness in the area, pulled by brand, media savvy and the social lead
  const reachT = fanTarget * 3.2 * (0.8 + (F.eff('mkt', 1) - 10) / 40) * (has('so') ? 1.25 : 1) * (0.9 + (+man('mkt', 'reach') || 40) / 400);
  X.reach = Math.round(X.reach + (reachT - X.reach) * 0.03);
  const cp = X.camp && CAMPS[X.camp.k];
  if (cp) { X.reach = Math.round(X.reach + reachT * cp.reach * campMult() * clamp(1.8 - X.reach / reachT, 0, 1)); if (cp.brand) c.brand = clamp(c.brand + cp.brand * campMult(), 0, 100); }
  // loyalty: community work, the head's community skill, the community officer
  const loyT = 38 + X.comm * 12 + (F.eff('mkt', 2) - 10) * 1.5 + (has('cm') ? 8 : 0) + (c.dna.identity === 'community' ? 6 : 0);
  X.loyalty = clamp(X.loyalty + (loyT - X.loyalty) * 0.04, 0, 100);
  // conversion: reach to fans, helped by form, the matchday and campaigns
  const exp = G.com ? G.com.exp : 1;
  const share = 0.34 * (0.8 + form() * 0.04 + X.loyalty / 200 + (exp - 1) * 0.03 + (cp ? cp.conv * campMult() * 1.5 : 0));
  const target = X.reach * share;
  let nf = c.fanbase + (target - c.fanbase) * 0.04;
  if (form() <= -3) nf -= c.fanbase * 0.006 * (1 - X.loyalty / 100) * 2;
  c.fanbase = Math.max(200, Math.round(nf));
  if (X.camp && --X.camp.left <= 0) { X.log.unshift({ w: G.week, t: `${CAMPS[X.camp.k].t} campaign finished.` }); X.camp = null; }
  X.hist.push(c.fanbase); if (X.hist.length > 40) X.hist.shift();
  // season tickets sold once a season, before the opening home game
  if (G.week <= 2 && X.stSeason !== G.season) {
    X.stSeason = G.season;
    const pf = G.com ? G.com.pf.main : 1.15;
    c.seasonTix = Math.round(Math.min(c.cap * 0.6, c.fanbase * clamp(0.06 + X.loyalty / 250 - (pf - 1.15) * 0.15, 0.04, 0.45)));
    X.log.unshift({ w: G.week, t: `${c.seasonTix.toLocaleString('en-GB')} season tickets sold.` });
  }
};
const prevCost = H.deptCost;
H.deptCost = () => { const o = prevCost ? prevCost() : {}; const X = K(); if (X.comm) o.community = Math.round(M(60) * X.comm / 10) * 10; return o; };

function campStart(k) {
  const G = g(), X = K(), cp = CAMPS[k]; if (!cp) return; if (X.camp) return { err: 'A campaign is already running.' };
  if (!staff('mkt')) return { err: 'You need a head of marketing to run a campaign.' };
  const cost = Math.round(M(cp.cost) / 100) * 100; if (G.club.cash < cost) return { err: `Needs ${money(cost)}.` };
  G.club.cash -= cost; X.camp = { k, left: cp.wk, start: G.week }; X.log.unshift({ w: G.week, t: `${cp.t} campaign launched for ${money(cost)}.` });
  if (k === 'online' && +man('mkt', 'tone') > 60 && chance(0.25)) { G.st.press = clamp(G.st.press - 3, 0, 100); X.log.unshift({ w: G.week, t: 'An edgy clip drew complaints.' }); }
  return { out: `${cp.t} campaign is live for ${cp.wk} weeks.` };
}
function commSet(d) { const X = K(); X.comm = clamp(X.comm + d, 0, 3); return { out: `Community programme: ${COMM_L[X.comm]}.` }; }

/* ---------- briefs ---------- */
F.defineBrief('mk_viral', { role: 'mkt', cd: 8,
  check: () => { const t = +man('mkt', 'tone'); return (t > 55 || has('so')) && chance(0.12 + (has('so') ? 0.08 : 0)) ? { score: 1.6 } : null; },
  title: () => 'A clip of ours is going viral',
  text: () => `A post from the club has taken off. ${staff('mkt') ? staff('mkt').name.split(' ')[0] : 'Marketing'} can pour fuel on it or keep it tidy.`,
  opts: [
    { l: 'Lean into it', h: 'Reach ↑ · could backfire', f: () => { const X = K(); X.reach = Math.round(X.reach * 1.08); g().club.brand = clamp(g().club.brand + 3, 0, 100); if (chance(0.25)) { g().st.fans = clamp(g().st.fans - 3, 0, 100); g().st.press = clamp(g().st.press - 3, 0, 100); return 'It went too far. Some fans and the press are not amused.'; } return 'It keeps spreading. New faces at the next home game.'; } },
    { l: 'Keep it low-key', h: 'Small reach ↑', f: () => { K().reach = Math.round(K().reach * 1.03); return 'A nice moment, no drama.'; } },
    { l: 'Take it down', h: '', f: () => { g().club.brand = clamp(g().club.brand - 1, 0, 100); return 'Gone. A few people ask why.'; } }] });
F.defineBrief('mk_fans', { role: 'mkt', cd: 10,
  check: () => { const X = K(); return X.loyalty < 55 && chance(0.18) ? { score: 1.3, cost: Math.round(M(350) / 10) * 10 } : null; },
  title: () => 'The supporters\' club want a word',
  text: c => `They ask for help with away travel. ${money(c.cost)} keeps the coaches running this season.`,
  opts: [
    { l: 'Fund the coaches', h: c => `−${money(c.cost)} · loyalty ↑`, f: c => { g().club.cash -= c.cost; K().loyalty = clamp(K().loyalty + 7, 0, 100); return 'Two coaches, full every away day. The supporters\' club say thanks.'; } },
    { l: 'Meet them, no money', h: 'Small loyalty ↑', f: () => { K().loyalty = clamp(K().loyalty + 2, 0, 100); return 'A good evening. They hoped for more.'; } },
    { l: 'Not now', h: 'Loyalty ↓', f: () => { K().loyalty = clamp(K().loyalty - 4, 0, 100); return 'They leave unhappy. It ends up on the forum.'; } }] });

function view() { const G = g(), X = K(), c = G.club; return { X, fans: c.fanbase, reach: X.reach, stx: c.seasonTix || 0, loyalty: Math.round(X.loyalty), camp: X.camp ? { ...X.camp, ...CAMPS[X.camp.k] } : null, camps: Object.entries(CAMPS).map(([k, v]) => ({ k, ...v, price: Math.round(M(v.cost) / 100) * 100 })), comm: X.comm, commL: COMM_L, commCost: X.comm ? Math.round(M(60) * X.comm / 10) * 10 : 0, hist: X.hist.slice(), log: X.log.slice(0, 6), mult: campMult() }; }
Object.assign(F, { mkView: view, mkCamp: campStart, mkComm: commSet, MK_CAMPS: CAMPS });
})(FO);
