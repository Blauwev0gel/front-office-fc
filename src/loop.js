/* The Front Office · the weekly loop, phase 1
   Three accountable constituencies (board, supporters, dressing room). Press remains a narrative and event influence, not a dismissal vote.
   Near zero: one last chance, a vote of confidence. Every decision shows how the backers moved.
   Each week opens with "Coming up" and closes with what changed. Each block of the season has a goal. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, chance, staff, money, M, ord } = F;

/* ---------- backers ---------- */
// support 0..100 on a scale where the danger zone is reachable but rare
const room = () => { const sq = g().squad.slice().sort((a, b) => b.ca - a.ca).slice(0, 18); return sq.length ? sq.reduce((a, p) => a + p.morale, 0) / sq.length : 60; };
const BK = [
  { k: 'board', t: 'Board', ic: 'board', get: () => g().board.conf, put: v => { g().board.conf = clamp(v, 0, 100); } },
  { k: 'fans', t: 'Supporters', ic: 'fans', get: () => (g().st.fans - 25) * 1.33, put: v => { g().st.fans = clamp(v / 1.33 + 25, 0, 100); } },
  { k: 'room', t: 'Dressing room', ic: 'squad', get: () => (room() - 35) * 1.54, put: v => { const want = v / 1.54 + 35, d = want - room(); g().squad.forEach(p => p.morale = clamp(p.morale + d, 0, 100)); } }];
const pressLegacy = { k: 'press', t: 'Press', get: () => (g().st.press - 30) * 1.43, put: v => { g().st.press = clamp(v / 1.43 + 30, 0, 100); } };
const bkFor = k => BK.find(b => b.k === k) || (k === 'press' ? pressLegacy : null);
const sup = k => clamp(Math.round(bkFor(k).get()), 0, 100);
const VOICE = {
  board: ['Board members are counting votes.', 'The chairman has stopped returning calls.', 'The board is watching, quietly.', 'The board nods along in meetings.', 'The board toasts you at lunch.'],
  fans: ['A banner with your face on it. Not a kind one.', 'The phone-in shows have a new favourite target.', 'Supporters are waiting to be convinced.', 'Your name gets the odd cheer.', 'Your name is sung. Occasionally in tune.'],
  press: ['The Gazette has a nickname for you. It is not flattering.', 'Every story now has a "but" in it.', 'The press is neither friend nor foe. This week.', 'The Gazette calls you "measured".', 'The Gazette calls you "shrewd". Enjoy it while it lasts.'],
  room: ['Senior players have a group chat about you.', 'The dressing room goes quiet when you walk in.', 'The players get on with it.', 'The squad believes in the plan.', 'The dressing room would run through walls.'] };
const voice = k => { const v = sup(k); return VOICE[k][v < 8 ? 0 : v < 25 ? 1 : v < 55 ? 2 : v < 78 ? 3 : 4]; };
const VOTE_AT = 5, DANGER = 20;
function backers() { const G = g(), d = G.wkDelta || {}; return BK.map(b => ({ k: b.k, t: b.t, ic: b.ic, v: sup(b.k), d: d[b.k] || 0, voice: voice(b.k), danger: sup(b.k) <= DANGER })); }
const snap = () => { const o = {}; for (const b of BK) o[b.k] = sup(b.k); return o; };

/* ---------- debrief: how every decision moved the backers ---------- */
const diff = (a, b) => { const o = {}; let any = 0; for (const k in a) { const d = b[k] - a[k]; if (Math.abs(d) >= 1) { o[k] = d; any = 1; } } return any ? o : null; };
const wrapR = F.respond; F.respond = (id, i) => { const a = snap(), r = wrapR(id, i), m = g().inbox.find(x => x.id === id); if (m && m.done) m.fd = diff(a, snap()); return r; };
const wrapB = F.answerBrief; F.answerBrief = (id, i) => { const a = snap(), r = wrapB(id, i), b = (g().briefs || []).find(x => x.id === id); if (b && b.done) b.fd = diff(a, snap()); return r; };

/* ---------- vote of confidence: one last chance ---------- */
const VT = {
  board: { from: 'board', title: 'Emergency board meeting', who: 'The board', body: 'Board confidence has collapsed. An emergency meeting on Friday decides whether you stay.', lose: 'The board voted you out at an emergency meeting.' },
  fans: { from: 'fans', title: 'Supporters call a vote of no confidence', who: 'The supporters\' trust', body: 'The trust has called an open vote on your future. The board says it will listen to the result.', lose: 'The supporters voted against you and the board followed them.' },
  press: { from: 'press', title: 'The press wants your head', who: 'The board', body: 'Every paper in town wants you gone. The board will decide on Friday whether you are worth the headlines.', lose: 'The board could not stand another week of headlines and let you go.' },
  room: { from: 'coach', title: 'Dressing room revolt', who: 'The senior players', body: 'The senior players have gone to the board. They say they will not play for this club as long as you run it.', lose: 'The players won. The board dismissed you to save the season.' } };
const form5 = () => (g().form || []).slice(-5).reduce((a, r) => a + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0) / 15;
// an expectation, not a promise: the vote has real uncertainty, so we name it in words
const band = p => p >= 0.7 ? 'Likely to work' : p >= 0.45 ? 'Could go either way' : p >= 0.25 ? 'Risky' : 'A long shot';
const OPTS = {
  board: [
    { l: 'Present a recovery plan', p: () => 0.3 + form5() * 0.5, f: () => 'You walk them through the plan, slide by slide.' },
    { l: 'Let the supporters speak for you', p: () => sup('fans') / 100 * 1.1, after: () => bump('fans', -8), f: () => 'Supporters fill the car park with flags.' },
    { l: 'Offer cuts in your own office', p: () => 0.68, after: () => { const m = g().mand; for (const r of ['scout', 'mkt']) if (m[r] && m[r].budget != null) m[r].budget = clamp(m[r].budget - 20, 0, 100); F.DESK_HEADS.forEach(h => { const s = staff(h); if (s) s.rel = clamp(s.rel - 4, 0, 100); }); }, h: 'Scouting and marketing budgets down · staff ↓', f: () => 'You offer to tighten every belt, starting with yours.' }],
  fans: [
    { l: 'Face them at an open forum', p: () => 0.25 + sup('press') / 220 + (g().form.slice(-1)[0] === 'W' ? 0.2 : 0), f: () => 'Two hours, one microphone, no script.' },
    { l: 'Cut ticket prices for the season', p: () => 0.78, after: () => { const X = F.comView && F.comView().X; if (X) for (const k in X.pf) X.pf[k] = Math.min(X.pf[k], 0.85); }, h: 'All stands cheaper · gate income ↓', f: () => 'Cheaper seats in every stand, from the next home game.' },
    { l: 'Ask the board to back you publicly', p: () => sup('board') / 100, after: () => bump('board', -10), h: 'Board ↓', f: () => 'The chairman reads a short statement of support.' }],
  press: [
    { l: 'Give one big exclusive interview', p: () => 0.4 + sup('fans') / 300, f: () => 'An hour with the Gazette\'s chief writer.' },
    { l: 'Go silent and let results talk', p: () => 0.2 + form5() * 0.6, f: () => 'No comment. Not one.' },
    { l: 'Feed them a better story', p: () => 0.6, after: () => bump('board', -5), h: 'Board ↓ (they know what you did)', f: () => 'A juicy transfer rumour lands on every back page.' }],
  room: [
    { l: 'Back the coach in public', p: () => 0.1 + (staff('coach') ? staff('coach').rel / 100 * 0.8 : 0.2), f: () => 'You stand next to the coach at the press conference.' },
    { l: 'Meet the senior players alone', p: () => 0.55, after: () => { const s = staff('coach'); if (s) s.rel = clamp(s.rel - 5, 0, 100); }, h: 'Coach ↓', f: () => 'A long evening in the players\' lounge.' },
    { l: 'A bonus for the whole squad', p: () => 0.76, after: () => { g().club.cash -= M(3000); }, h: () => `−${money(M(3000))}`, f: () => 'Money talks. The squad listens.' }] };
function bump(k, d) { const b = bkFor(k); b.put(clamp(b.get() + d, 0, 100)); }
function lift(k) { const b = BK.find(x => x.k === k); b.put(Math.max(b.get(), 35)); }
for (const k in VT) {
  const v = VT[k];
  F.defineEvent('vote_' + k, { forced: 1, ceo: 1, from: v.from, dept: 'board', cd: 1, why: () => `${(BK.find(b => b.k === k) || {t:'Press'}).t} support fell below ${VOTE_AT}. This is your last chance.`, 
    setup: () => ({ k }),
    title: v.title, body: () => `${v.body} ${voice(k)}`,
    opts: OPTS[k].map(o => ({ l: o.l, h: c => `${band(o.p())}${o.h ? ' · ' + (typeof o.h === 'function' ? o.h() : o.h) : ''}`, f: () => {
      const p = clamp(o.p(), 0.05, 0.95), ok = F.rnd() < p, G = g(); if (o.after) o.after();
      G.votes = G.votes || {}; G.votes[k] = G.season; G.vote = null;
      if (ok) { lift(k); G.paper.stories.unshift({ h: 'Survives the vote', t: `${G.club.name}'s CEO survives: ${o.f()}` }); return `${o.f()} It works. You survive, for now.`; }
      F.sack(v.lose, 'vote:' + k); return `${o.f()} It is not enough.`;
    } })),
    auto: () => 0, vacant: 0 });
}
function lastChance(k) {
  const G = g(); if (G.vote) return true; // already pending
  G.votes = G.votes || {};
  if (G.votes[k] === G.season) return false; // already used this season: no second chance
  G.vote = { k, at: F.absWeek() }; F.queueEvent('vote_' + k, { k }); if (k === 'board') G.board.conf = Math.max(G.board.conf, 1);
  return true;
}
H.lastChance = () => lastChance('board');
H.seasonReprieve = () => { const G = g(); G.votes = G.votes || {}; if (G.votes.board === G.season) return false; G.votes.board = G.season + 1; G.board.conf = 12; G.vote = null; G.paper.stories.unshift({ h: 'One more summer', t: 'The board met for four hours. The CEO stays, by a single vote. There will be no second chance next season.' }); return true; };

/* ---------- block goals ---------- */
const tgt = () => { const o = g().board.obj.find(o => o.k === 'league'); return o ? o.target : 10; };
function needFor(n) {
  const G = g(), er = F.expectedRank ? F.expectedRank() : tgt(), exp = 2.25 - (er - 1) * 0.075;
  const r = G.divs[G.club.tier].tab[0], cur = r && r.p >= 5 ? r.pts / r.p : exp; // our row is id 0
  return Math.max(1, Math.round(n * clamp(0.5 * exp + 0.5 * cur - 0.02, 0.9, 2.5)));
}
function blockTick(ours) {
  const G = g(); if (G.phase !== 'season' || !F.BLOCKS) return; const w = G.week, b = F.blockOf(w);
  if (!G.bgoal || G.bgoal.k !== b.k || G.bgoal.s !== G.season) { const n = b.b - b.a + 1; G.bgoal = { k: b.k, t: b.t, s: G.season, a: b.a, b: b.b, n, need: needFor(n), got: 0, pl: 0, done: null }; }
  const B = G.bgoal;
  if (ours && B.done == null) { B.pl++; B.got += ours.result === 'W' ? 3 : ours.result === 'D' ? 1 : 0; }
  if (B.done == null && (B.got >= B.need || w >= B.b)) {
    B.done = B.got >= B.need;
    if (B.done) { bump('board', 4); bump('fans', 3); G.paper.stories.unshift({ h: `${B.t} goal reached`, t: `${B.got} points from ${B.pl} games. The target was ${B.need}.` }); }
    else { bump('board', -4); G.paper.stories.unshift({ h: `${B.t} goal missed`, t: `${B.got} points from ${B.n} games. The target was ${B.need}. The board takes note.` }); }
    (G.bgLog = G.bgLog || []).push({ s: G.season, k: B.k, t: B.t, got: B.got, need: B.need, ok: B.done });
  }
}
function goalView() { const B = g().bgoal; if (!B || B.s !== g().season) return null; const left = Math.max(0, B.n - B.pl), still = Math.max(0, B.need - B.got); return { ...B, left, still, possible: still <= left * 3 }; }

/* ---------- weekly: votes, deltas, goals ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(); if (G.phase !== 'season') return;
  blockTick(ours);
  if (G.vote && G.board.conf < 1) G.board.conf = 1; // a pending vote decides, not the weekly drift
  if (G.week >= F.SEASON_WEEKS) { // final week: no time for a vote, the summer decides
    for (const b of BK) if (sup(b.k) <= VOTE_AT) { G.votes = G.votes || {};
      if (b.k === 'board') { G.board.conf = Math.min(G.board.conf, 0); G.vote = null; break; } // the season-end reprieve rule applies
      if (G.votes[b.k] === G.season) { F.sack(VT[b.k].lose + ' There was no second chance this season.', 'vote:' + b.k); break; }
      G.votes[b.k] = G.season; G.votes.board = G.votes.board; lift(b.k); G.paper.stories.unshift({ h: 'Saved by the summer', t: `${b.t} support hit rock bottom in the last week. The board gives you the summer to win them back. No second chance.` }); break; }
    G.vote = null;
  } else
  for (const b of BK) if (sup(b.k) <= VOTE_AT && !G.vote) { if (!lastChance(b.k) && b.k !== 'board') F.sack(VT[b.k].lose + ' There was no second chance this season.', 'vote:' + b.k); break; }
  const now = snap(); G.wkDelta = G.wkPrev ? diff(G.wkPrev, now) || {} : {}; G.wkPrev = now;
  G.wkLog = (G.wkLog || []).concat([{ s: G.season, w: G.week, r: ours ? ours.result : null, ...now }]).slice(-40);
};

/* ---------- coming up ---------- */
function comingUp() {
  const G = g(), out = [], w = G.week; if (G.phase !== 'season') return out;
  const fx = G.divs[G.club.tier].fix[w - 1], f = fx && fx.find(x => x[0] === 0 || x[1] === 0);
  if (f) { const opp = f[0] === 0 ? f[1] : f[0], home = f[0] === 0, pos = F.sortTable(G.club.tier).indexOf(opp) + 1, st = G.stake && G.stake.week === w ? G.stake.kind : null;
    out.push({ ic: 'league', t: `${home ? 'Home to' : 'Away at'} ${F.cname(opp)}`, s: `${st === 'derby' ? 'Derby day. ' : st === 'top' ? 'Top-of-table clash. ' : st === 'bottom' ? 'Survival clash. ' : ''}They are ${ord(pos)}, you are ${ord(F.myPos())}.`, hot: !!st }); }
  const B = goalView(); if (B && B.done == null) out.push({ ic: 'star', t: `${B.t} goal: ${B.need} points`, s: B.possible ? `${B.got} so far, ${B.still} more from ${B.left} game${B.left === 1 ? '' : 's'}.` : `Out of reach: ${B.got} of ${B.need} with ${B.left} left.`, hot: B.possible && B.left <= 2 });
  const rev = [10, 19, 29].find(x => x >= w); if (rev && rev - w <= 3) out.push({ ic: 'board', t: rev === w ? 'Board review this week' : `Board review in ${rev - w} week${rev - w === 1 ? '' : 's'}`, s: `You are ${ord(F.myPos())}, the target is ${ord(tgt())}.`, hot: F.myPos() > tgt() });
  if (w >= 14 && w <= 18) out.push({ ic: 'scout', t: w >= 17 ? 'The winter window is open' : `Winter window opens in ${17 - w} week${17 - w === 1 ? '' : 's'}`, s: 'Two weeks only. Prices go up in winter.' });
  if (w >= 25 && w <= 28) out.push({ ic: 'academy', t: w === 28 ? 'Academy intake this week' : `Academy intake in ${28 - w} week${28 - w === 1 ? '' : 's'}`, s: 'A new group of youngsters arrives.' });
  for (const pr of (G.projects || [])) { const left = pr.due - F.absWeek(); if (left >= 0 && left <= 2) { const v = F.PROP[pr.id]; let t = ''; try { t = typeof v.title === 'function' ? v.title(pr.ctx) : v.title; } catch (e) { } out.push({ ic: 'trust', t: `${t}: ${left ? 'due in ' + left + ' week' + (left === 1 ? '' : 's') : 'due this week'}`, s: 'Delivered or failed, you will know soon.' }); } }
  if (F.dosView) { const DV = F.dosView(); for (const d of DV.open) if (!d.pending && d.inW <= 2) out.push({ ic: 'info', t: `Dossier: ${d.t}`, s: `Part ${d.part + 1} of ${d.n} ${d.inW ? 'in ' + d.inW + ' week' + (d.inW === 1 ? '' : 's') : 'next week'}. ${d.heatT}.`, hot: d.heat >= 2 }); if (DV.signal) out.push({ ic: 'risk', t: 'The mood around the club', s: DV.signal, hot: DV.pressure >= 60, bad: DV.pressure >= 80 }); }
  for (const b of BK) { const v = sup(b.k); if (v <= DANGER) out.push({ ic: b.ic, t: `${b.t} support is ${v}`, s: `Below ${VOTE_AT} means a vote of confidence. ${voice(b.k)}`, hot: true, bad: true }); }
  if (G.vote) out.unshift({ ic: 'board', t: 'Your future is on the line', s: 'A vote of confidence is waiting in your inbox.', hot: true, bad: true });
  return out.slice(0, 6);
}

Object.assign(F, { backers, comingUp, goalView, BACKERS: BK, VOTE_AT });
})(FO);
