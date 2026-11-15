/* The Front Office · Commercial department
   The stadium as a system (three stands, demand, price, matchday experience), sponsor offers you
   accept, push or turn down, and merchandise that follows success. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { ri, pick, chance, clamp, money, M, staff, man } = F;
const STANDS = [
  { k: 'home', t: 'Home end', share: 0.35, el: 0.5, core: 0.5, cas: 0.1, def: 0.9 },
  { k: 'main', t: 'Main stand', share: 0.40, el: 0.8, core: 0.32, cas: 0.4, def: 1.15 },
  { k: 'family', t: 'Family stand', share: 0.25, el: 1.2, core: 0.18, cas: 0.5, def: 0.7 }
];
const EXP_L = ['Bare basics', 'Food van and a PA', 'Proper kiosks and a fanzone', 'Big screen and family zone', 'Full matchday show'];
const has = r => F.deptHas && F.deptHas('commercial', r);
function C() {
  const G = g(); if (!G.com) G.com = { pf: Object.fromEntries(STANDS.map(s => [s.k, s.def])), exp: 1, promo: null, promoAt: -99, offer: null, nextOffer: F.absWeek ? F.absWeek() + 3 : 3, hist: [], last: null, log: [] };
  return G.com;
}
function form() { return g().form.slice(-5).reduce((a, r) => a + (r === 'W' ? 1 : r === 'L' ? -1 : 0), 0); }
function demand() {
  const G = g(), c = G.club, X = C();
  const turnout = clamp(0.55 + (G.st.fans - 50) / 200 + form() * 0.03 + (G.club.seasonTix || 0) * 0, 0.3, 0.95);
  const stx = Math.min(c.seasonTix || 0, c.fanbase), core = ((c.fanbase - stx) * turnout + stx * 0.95) * (0.9 + F.eff('com', 1) / 100);
  const expM = 1 + 0.08 * (X.exp - 1);
  const casual = (150 + c.brand * 6) * (1 + form() * 0.06) * expM * (0.7 + F.eff('com', 2) / 30);
  const promo = X.promo === 'next';
  const base = F.ticketPrice(), out = {};
  for (const s of STANDS) {
    const cap = Math.round(c.cap * s.share), pf = X.pf[s.k] * (promo && s.k === 'family' ? 0.5 : 1);
    const el = s.el * (has('tk') ? 0.6 : 1);
    const camp = G.mk && G.mk.camp && G.mk.camp.k === 'family' && s.k === 'family' ? 1.2 : 1;
    let d = (core * s.core + casual * s.cas) * clamp(1 - el * (pf - 1), 0.2, 1.6) * (promo ? 1.3 : 1) * camp;
    const att = Math.round(Math.min(cap, Math.max(0, d)));
    out[s.k] = { t: s.t, cap, att, fill: cap ? att / cap : 0, price: Math.round(base * pf * 2) / 2, rev: Math.round(att * base * pf * 0.75) };
  }
  return out;
}
H.attendance = () => { const D = demand(); return Object.values(D).reduce((a, x) => a + x.att, 0); };
H.gate = () => {
  const X = C(), D = demand(), rev = Object.values(D).reduce((a, x) => a + x.rev, 0) * (F.perk && F.perk('ticket') ? 1.08 : 1);
  X.last = { w: g().week, s: g().season, D, rev: Math.round(rev) };
  X.hist.push(Math.round(Object.values(D).reduce((a, x) => a + x.att, 0) / Math.max(1, g().club.cap) * 100)); if (X.hist.length > 30) X.hist.shift();
  if (X.promo === 'next') { X.promo = null; g().st.fans = clamp(g().st.fans + 2, 0, 100); g().club.fanbase += ri(20, 60); }
  return Math.round(rev);
};
// home advantage grows with the crowd and the mood of the fans
H.homeEdge = home => { if (!home) return -0.3; const G = g(), c = G.club, att = c.lastAtt || 0, fill = c.cap ? Math.min(1, att / c.cap) : 0.3; return 0.15 + fill * 0.4 + (G.st.fans - 50) / 250; };
const prevMerch = H.merchMult;
H.merchMult = () => (prevMerch ? prevMerch() : 1) * (has('rt') ? 1.2 : 1) * (g().form.slice(-3).length === 3 && g().form.slice(-3).every(r => r === 'W') ? 1.3 : 1) * (1 + 0.04 * (C().exp - 1));
const prevCost = H.deptCost;
H.deptCost = () => { const o = prevCost ? prevCost() : {}; const X = C(); if (X.exp > 1) o.matchday = Math.round(M(70) * (X.exp - 1) / 10) * 10; return o; };

/* ---------- sponsor offers ---------- */
const SECT = [['Local trade', ['Hollis Builders', 'Marlow Dental', 'Fenwick Print', 'Riverside Garage', 'Copperfield Plumbing']], ['Brewery', ['Old Kiln Ales', 'Harbour Brewing', 'Three Bells Lager']], ['Car dealer', ['Northgate Motors', 'Ashby Autos', 'Bridgeway Cars']], ['Tech', ['Cloudloom', 'Brightpixel', 'Datafold']], ['Betting', ['QuickOdds', 'BetHarbour', 'LuckyLine']], ['Bank', ['Weald Building Society', 'Kingsmere Bank']]];
function newOffer() {
  const G = g(), [sect, names] = pick(SECT), long = chance(0.5), weeks = long ? 102 : 34;
  const base = M(ri(300, 800)) * F.S(G.club.tier) / F.S(8) * (0.8 + F.eff('com', 0) / 25) * (has('sm') ? 1.2 : 1) * (long ? 0.85 : 1.15) * (sect === 'Betting' ? 1.35 : 1) * (0.8 + G.club.brand / 250);
  return { name: pick(names), sect, wk: Math.round(base / 10) * 10, weeks, exp: F.absWeek() + 3, briefed: false };
}
function offerWeekly() {
  const X = C(), now = F.absWeek(), G = g();
  if (X.offer && now > X.offer.exp) { X.log.unshift({ w: G.week, t: `${X.offer.name} walked away.` }); X.offer = null; }
  if (!X.offer && now >= X.nextOffer && staff('com') && G.club.deals.length < 5) { X.offer = newOffer(); X.nextOffer = now + (has('sm') ? ri(4, 6) : ri(6, 9)); }
}
function offerAct(k) {
  const G = g(), X = C(), o = X.offer; if (!o) return { err: 'No offer on the table.' };
  const dna = G.club.dna || {};
  if (k === 'accept') {
    G.club.deals.push({ name: o.name, type: 'partner', wk: o.wk, weeks: o.weeks }); X.offer = null;
    if (o.sect === 'Betting' && (dna.style === 'community' || dna.identity === 'community' || dna.origin === 'fans')) { G.st.fans = clamp(G.st.fans - 4, 0, 100); }
    X.log.unshift({ w: G.week, t: `Signed ${o.name}: ${money(o.wk)}/wk for ${o.weeks} weeks.` });
    return { out: `${o.name} signed. ${money(o.wk)} a week.` };
  }
  if (k === 'push') {
    const p = 0.35 + F.eff('com', 0) / 40 + (has('sm') ? 0.15 : 0);
    if (chance(p)) { o.wk = Math.round(o.wk * 1.2 / 10) * 10; G.club.deals.push({ name: o.name, type: 'partner', wk: o.wk, weeks: o.weeks }); X.offer = null; X.log.unshift({ w: G.week, t: `Pushed ${o.name} up to ${money(o.wk)}/wk.` }); return { out: `Pushed it. ${o.name} sign at ${money(o.wk)} a week.` }; }
    X.offer = null; X.log.unshift({ w: G.week, t: `${o.name} walked away after the counter.` }); return { out: `${o.name} walked away.` };
  }
  X.offer = null; X.log.unshift({ w: G.week, t: `Turned down ${o.name}.` });
  if (o.sect === 'Betting') G.st.fans = clamp(G.st.fans + 1, 0, 100);
  return { out: `Turned down ${o.name}.` };
}

/* ---------- prices, experience, promo ---------- */
function setPrice(k, d) { const X = C(); if (X.pf[k] == null) return; X.pf[k] = clamp(Math.round((X.pf[k] + d) * 10) / 10, 0.5, 1.8); return { v: X.pf[k] }; }
function expUp() {
  const G = g(), X = C(); if (X.exp >= 5) return { err: 'Already the full show.' };
  const fee = Math.round(M(3000) * X.exp / 100) * 100; if (G.club.cash < fee) return { err: `Needs ${money(fee)} in the bank.` };
  G.club.cash -= fee; X.exp++; X.log.unshift({ w: G.week, t: `Matchday upgraded: ${EXP_L[X.exp - 1]}.` });
  return { out: `Matchday upgraded to "${EXP_L[X.exp - 1]}". ${money(fee)} spent.` };
}
function expDown() { const X = C(); if (X.exp <= 1) return; X.exp--; return { out: `Matchday cut back to "${EXP_L[X.exp - 1]}".` }; }
function promo() {
  const G = g(), X = C(), now = F.absWeek(); if (now - X.promoAt < 6) return { err: `Next promo possible in ${6 - (now - X.promoAt)} weeks.` };
  const cost = Math.round(M(400) / 10) * 10; if (G.club.cash < cost) return { err: 'Not enough cash.' };
  G.club.cash -= cost; X.promo = 'next'; X.promoAt = now; return { out: 'Family day set for the next home game: half-price family stand, more fans through the gate.' };
}

/* ---------- weekly + briefs ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => { if (prevAfter) prevAfter(ours); C(); offerWeekly(); };
if (F.BR && F.BR.crowd_low) F.BR.crowd_low.check = () => null;
F.defineBrief('com_offer', { role: 'com', cd: 1,
  check: () => { const o = C().offer; return o && !o.briefed ? (o.briefed = true, { score: 3, name: o.name }) : null; },
  title: c => `Sponsor: ${c.name} want in`,
  text: () => { const o = C().offer; return o ? `${o.name} (${o.sect.toLowerCase()}) offer ${money(o.wk)} a week for ${o.weeks} weeks. ${staff('com') ? staff('com').name.split(' ')[0] : 'Commercial'} can try to push for more.` : 'The offer has gone.'; },
  opts: [
    { l: 'Accept', h: () => C().offer ? `+${money(C().offer.wk)}/wk` : '', f: () => (offerAct('accept') || {}).out || 'Gone.' },
    { l: 'Push for 20% more', h: 'More money, or they walk', f: () => (offerAct('push') || {}).out || 'Gone.' },
    { l: 'Turn it down', h: () => C().offer && C().offer.sect === 'Betting' ? 'Fans approve' : '', f: () => (offerAct('reject') || {}).out || 'Gone.' }] });
F.defineBrief('com_prices', { role: 'com', cd: 6,
  check: () => { const L = C().last; if (!L || L.s !== g().season || g().week - L.w > 2) return null; const arr = Object.entries(L.D); const lo = arr.sort((a, b) => a[1].fill - b[1].fill)[0], hi = arr.sort((a, b) => b[1].fill - a[1].fill)[0]; if (lo[1].fill < 0.35) return { score: 1.4, k: lo[0], t: lo[1].t, fill: Math.round(lo[1].fill * 100), dir: -1 }; if (hi[1].fill > 0.97) return { score: 1.4, k: hi[0], t: hi[1].t, fill: 100, dir: 1 }; return null; },
  title: c => c.dir < 0 ? `${c.t} only ${c.fill}% full` : `${c.t} sold out`,
  text: c => c.dir < 0 ? `Empty seats in the ${c.t.toLowerCase()}. A lower price would fill it, at a lower yield.` : `The ${c.t.toLowerCase()} is full. People are turned away; we could charge more.`,
  opts: [
    { l: c => c.dir < 0 ? `Cut ${c.t.toLowerCase()} prices` : `Raise ${c.t.toLowerCase()} prices`, h: c => c.dir < 0 ? 'Fuller, less per seat' : 'More per seat, a few fewer fans', f: c => { setPrice(c.k, c.dir * 0.2); return 'New prices from the next home game.'; } },
    { l: 'Run a family day', h: 'Next home game busier', f: () => (promo() || {}).out || 'Not possible yet.' },
    { l: 'Leave it', h: '', f: () => 'Prices stay.' }] });

function view() { const X = C(), D = demand(); return { D, X, exp: X.exp, expL: EXP_L, expFee: Math.round(M(3000) * X.exp / 100) * 100, expCost: X.exp > 1 ? Math.round(M(70) * (X.exp - 1) / 10) * 10 : 0, promoIn: Math.max(0, 6 - (F.absWeek() - X.promoAt)), offer: X.offer, log: X.log.slice(0, 6), stands: STANDS }; }
Object.assign(F, { comView: view, comSetPrice: setPrice, comExpUp: expUp, comExpDown: expDown, comPromo: promo, comOffer: offerAct, COM_STANDS: STANDS });
})(FO);
