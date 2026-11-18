/* The Front Office · parties outside football (B58)
   The town council and a local investor: each with its own aims, an alternative, trust and a memory. They act every week
   from their own situation, whether or not the CEO does anything. First use: the training base (projects.js). */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, { clamp, pick, chance, money, M, rnd } = F;
const SITES = ['the old playing fields on Mill Lane', 'the former works ground by the canal', 'the rugby club\'s back pitches', 'the school fields at Ashgrove'];
const TRAITS = { community: 'wants the town\'s children on the grass', money: 'needs money for the budget', growth: 'wants jobs and new building' };
const INV_N = ['Harlan Voss', 'Celia Marsh', 'Dev Kapoor', 'Ruth Okafor', 'Tom Prescott'];
function P() {
  const G = g(); if (!G) return null;
  if (!G.parties) G.parties = { council: { trust: 50, trait: pick(Object.keys(TRAITS)), site: null, memory: [], nextAt: F.absWeek() + 3, elected: G.season },
    investor: { name: pick(INV_N), interest: 0, seat: false, active: false, memory: [] } };
  return G.parties;
}
const site = () => (P() || {}).council && P().council.site;
// the council offers land when it has a reason: no base of our own, and a site it wants to see used
function councilWeek() {
  const G = g(), C = P().council, now = F.absWeek(), base = G.club.assets && G.club.assets.base;
  if (C.site) { const S = C.site; if (S.taken) return;
    S.dev = clamp(S.dev + (0.06 + rnd() * 0.08) * (C.trait === 'money' ? 1.3 : 1), 0, 1); // the other bidder moves on, week by week
    if (S.dev >= 1 && !(S.hold > now)) { S.taken = 1; S.by = S.rival != null && chance(0.45) ? 'rival' : 'developer'; const R = S.rival != null ? G.clubs[S.rival] : null;
      if (S.by === 'rival' && R) { R.str = +(R.str + 0.15).toFixed(2); R.base = 1; }
      C.memory.push({ w: now, t: S.engaged ? 'sold elsewhere while we talked' : 'sold elsewhere' });
      if (G.paper) G.paper.stories.push({ h: 'Playing fields sold', t: `${S.name[0].toUpperCase() + S.name.slice(1)} ${S.by === 'rival' && R ? `go to ${R.name}, who will train there` : 'go to a housing developer'}.${S.engaged ? '' : ' The club never made an offer.'}` });
      if (F.trajLost) F.trajLost(S); C.site = null; C.nextAt = now + 26; }
    return; }
  if (base || G.phase !== 'season' || now < C.nextAt || G.week < 4) return;
  if (!chance(C.trait === 'growth' ? 0.35 : 0.2)) return;
  const sameTier = G.divs[G.club.tier].clubs.filter(x => x !== 0);
  C.site = { name: pick(SITES), price: Math.round(M(9000 + rnd() * 6000) / 100) * 100, build: Math.round(M(7000 + rnd() * 4000) / 100) * 100, dev: 0.1 + rnd() * 0.2, rival: chance(0.5) ? pick(sameTier) : null, at: now };
  if (G.paper) G.paper.stories.push({ h: 'Council puts land on the market', t: `The town council is selling ${C.site.name}. ${C.site.rival != null ? `${G.clubs[C.site.rival].name} are said to be interested,` : 'A housing developer is interested,'} and the council ${TRAITS[C.trait]}.` });
}
// an investor watches the club: success, crowds and a good name raise his interest; a slump cools it
function investorWeek() { const G = g(), I = P().investor, f = (G.form || []).slice(-6), pts = f.reduce((a, r) => a + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
  I.interest = clamp(I.interest * 0.92 + (pts / 18) * 0.06 + (G.club.brand || 25) / 1000, 0, 1); I.active = I.interest >= 0.25 || I.seat; }
// every two seasons a new council leader, with other aims
function election() { const G = g(), C = P().council; if (G.season - C.elected < 2) return; C.elected = G.season; const old = C.trait; C.trait = pick(Object.keys(TRAITS).filter(k => k !== old));
  if (G.paper) G.paper.stories.push({ h: 'A new council leader', t: `The new leader ${TRAITS[C.trait]}. Agreements with the club are being looked at again.` }); if (F.trajElection) F.trajElection(C.trait); }
const prev = H.seasonAfterMatch;
H.seasonAfterMatch = o => { if (prev) prev(o); if (!P()) return; councilWeek(); investorWeek(); if (g().week === 1) election(); };
// the CEO can call on the council himself: if it has land and a reason, it puts a site forward now
F.councilAsk = () => { const G = g(), C = P().council; if (C.site) return { t: 'We already have a site on the table for you.' }; if (G.club.assets && G.club.assets.base) return { t: 'You have your base. Come back when you need more.' };
  if (C.trait === 'growth' || C.trust >= 55 || chance(0.4)) { C.nextAt = 0; const before = G.paper.stories.length; councilWeek(); if (!C.site) { const sameTier = G.divs[G.club.tier].clubs.filter(x => x !== 0); C.site = { name: pick(SITES), price: Math.round(M(9000 + rnd() * 6000) / 100) * 100, build: Math.round(M(7000 + rnd() * 4000) / 100) * 100, dev: 0.05, rival: chance(0.5) ? pick(sameTier) : null, at: F.absWeek() }; } C.site.asked = 1; return { t: `There is ${C.site.name}. Others are looking at it too.`, ok: 1 }; }
  C.nextAt = F.absWeek() + 8; return { t: 'Nothing we can offer right now. We will remember you asked.' }; };
Object.assign(F, { parties: P, councilSite: site, COUNCIL_TRAITS: TRAITS });
})(FO);
