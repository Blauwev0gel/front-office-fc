/* The Front Office · situation-driven week
   Chance serves the club's situation: an event is likelier when its department is under pressure,
   a little less likely when a related one was just in the inbox, and a calm department is bothered less.
   Pure weights on top of the existing conditions, weights and cooldowns; nothing is made unreachable. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, { staff } = F;
const DEPT = { coach: 'first', 'first team': 'first', sporting: 'recruit', dof: 'recruit', scout: 'recruit', acad: 'academy', academy: 'academy', com: 'commercial', commercial: 'commercial', mkt: 'marketing', marketing: 'marketing', fin: 'business', business: 'business', board: 'board', fans: 'fans', press: 'press' };
const HEAD = { first: 'coach', recruit: 'dof', academy: 'acad', commercial: 'com', marketing: 'mkt', business: 'fin' };
// how much trouble is a department in, 0 (calm) to 2 (under pressure)
function heat(d) {
  const G = g(), f5 = G.form.slice(-5), L = f5.filter(r => r === 'L').length; let h = 0;
  if (d === 'first') h = (L >= 2 ? 1 : 0) + (F.myPos() > F.expectedRank() + 2 ? 1 : 0);
  else if (d === 'recruit') h = (F.window_() && F.squadNeeds().length ? 1 : 0) + (F.squadNeeds().length >= 2 ? 1 : 0);
  else if (d === 'business') h = F.finTight && F.finTight() ? 2 : 0;
  else if (d === 'board') h = G.board.conf < 40 ? 2 : G.board.conf < 55 ? 1 : 0;
  else if (d === 'fans') h = G.st.fans < 35 ? 2 : G.st.fans < 50 ? 1 : 0;
  else if (d === 'press') h = G.st.press < 30 ? 2 : G.st.press < 45 ? 1 : 0;
  else if (d === 'commercial') h = G.st.spons < 40 ? 1 : 0;
  else if (d === 'marketing') h = G.st.fans < 40 ? 1 : 0;
  const s = staff(HEAD[d]); if (s && s.rel < 40) h++; return Math.min(2, h);
}
function weight(e) {
  const d = DEPT[e.from] || DEPT[e.dept]; if (!d) return 1; const G = g(), h = heat(d);
  let w = h === 2 ? 2 : h === 1 ? 1.4 : (d === 'board' || d === 'fans' || d === 'press' ? 0.85 : 0.8); // a calm department is left alone
  const recent = G.inbox.some(m => m.week >= G.week - 2 && m.season === G.season && m.ev !== e.id && (DEPT[(F.EV[m.ev] || {}).from] === d)); if (recent) w *= 0.6; // no run of near-identical subjects
  return w;
}
H.evWeight = weight;
F.weekHeat = heat;
})(FO);
