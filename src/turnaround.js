/* The Front Office · the turnaround (B37, B44)
   When it goes properly wrong, the board asks what the CEO intends to do. He picks a strategy, each with its own price,
   and six weeks later the board looks at whether it works. A crisis becomes a storyline with a choice, not a lower table position.
   It stays out of the board review weeks (10, 19, 29), where a promise-style "recovery plan" already exists. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, { clamp, money, M, staff } = F;
const abs = () => F.absWeek();
const fx = o => { const G = g(); for (const k in o) { const n = o[k]; if (k === 'board') G.board.conf = clamp(G.board.conf + n, 0, 100); else if (k === 'cash') G.club.cash += n; else G.st[k] = clamp(G.st[k] + n, 0, 100); } };
const ord = n => F.ord(n);
const LABEL = { back: 'Back the coach', replace: 'A new head coach', invest: 'Invest in the squad', young: 'Go young', wait: 'Wait it out' };
const REVIEW = [10, 11, 19, 20, 29, 30];
const lossesLast5 = () => g().form.slice(-5).filter(r => r === 'L').length;
const ppg = n => { const f = g().form.slice(-n); return f.length ? f.reduce((a, r) => a + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0) / f.length : 1.3; };
const snap = () => ({ pos: F.myPos(), exp: F.expectedRank(), L: lossesLast5(), ppg: +ppg(6).toFixed(2), conf: Math.round(g().board.conf) });
// is it properly wrong? one at a time, with air in between, never in a review week, never without a coach
function trouble() {
  const G = g(); if (G.phase !== 'season' || G.week < 6 || G.week > 30 || REVIEW.includes(G.week) || !staff('coach')) return false;
  if (G.turn && G.turn.plan && abs() <= G.turn.until + 4) return false; if (G.turnLast != null && abs() - G.turnLast < 40) return false;
  const pos = F.myPos(), exp = F.expectedRank(); return G.board.conf < 45 || (lossesLast5() >= 3 && pos > exp + 2) || pos > exp + 5;
}
function start(plan, c) { const G = g(); G.turn = { plan, at: abs(), until: abs() + 8, pos0: c.pos, ppg0: c.ppg, grace: 0 }; G.turnLast = abs(); F.later('turn_check', { plan, pos0: c.pos, ppg0: c.ppg, exp: c.exp }, 6, 7); }
// what the strategy does to the team while it runs (added to the team's strength, like the step-up penalty)
function edge() {
  const G = g(), T = G.turn; if (!T || !T.plan || abs() > T.until) return 0; const w = abs() - T.at, co = staff('coach'), rel = co ? F.eff('coach', 0) - F.tierAvg(G.club.tier) : 0;
  switch (T.plan) { case 'back': return co ? (rel >= 0 ? .2 : -.1) : 0; case 'replace': return w < 2 ? -.2 : .3 * Math.max(0, 1 - w / 8); case 'invest': return .35 * Math.max(.3, 1 - w / 10); case 'young': return w < 4 ? -.2 : .2; default: return 0; }
}
const pe = H.ftExtra; H.ftExtra = () => (pe ? pe() : 0) + edge();
// every week: ask the CEO when it is properly wrong; waiting costs patience
const sw = H.seasonWeekly; H.seasonWeekly = () => { if (sw) sw(); const G = g(); if (trouble()) { G.turnAsk = abs(); F.queueEvent('turn_call', snap()); }
  const T = G.turn; if (T && T.plan === 'wait' && abs() <= T.until && abs() > (T.grace || 0)) fx({ fans: -.8, board: -1 }); };
const E = F.defineEvent;
E('turn_call', { forced: 1, from: 'board', dept: 'board', cd: 2, why: 'The board wants to know what you are going to do about the results.',
  title: c => `We are ${ord(c.pos)}. The board wants a plan.`,
  body: c => `${c.L} defeat${c.L === 1 ? '' : 's'} in the last five, and we were expected to be ${ord(c.exp)}. Board confidence is ${c.conf}. The chairman has asked, politely, what you intend to do. It was not a polite question.`,
  opts: [
    { l: 'Back the coach', h: 'Trust ↑ · board −3 · it only works if he is up to it', f: c => { const s = staff('coach'); if (s) { s.rel = clamp(s.rel + 8, 0, 100); s.boost = clamp(s.boost + 2, -10, 12); s.boostW = 6; } fx({ board: -3 }); start('back', c); return `You tell the press that ${s ? s.name : 'the coach'} has your full support. The chairman looks at the ceiling.`; } },
    { l: 'Replace the coach', h: 'His compensation · fans ↑ · the squad is shaken', f: c => { const r = F.ftSack(); if (r && r.err) return r.err; start('replace', c); return (r && r.out ? r.out + ' ' : '') + 'An interim holds the clipboard. Appoint a new head coach in the staff tab.'; } },
    { l: 'Invest in the squad', h: () => `−${money(M(3000))} · a lift for eight weeks · less cash later`, f: c => { fx({ cash: -M(3000) }); start('invest', c); return 'Three signings are on the way. The finance director has gone for a walk.'; } },
    { l: 'Go young', h: 'Fans ↑ · press ↓ · results may dip first', f: c => { fx({ fans: 2, press: -2 }); g().push.academy = 6; for (const p of g().squad) if (p.age <= 21) p.morale = clamp(p.morale + 10, 0, 100); start('young', c); return 'The academy lads are told to bring boots. The fans like it. The table is less sure.'; } },
    { l: 'Wait it out', h: 'Free · patience wears thin every week', f: c => { start('wait', c); return 'You say you will look at it next week. The chairman writes that down.'; } }],
  auto: () => 4 });
const STATE = c => { const pos = F.myPos(), p6 = ppg(6), dp = c.pos0 - pos; return dp >= 2 || p6 >= 1.7 ? 'working' : dp >= 0 || p6 >= 1.2 ? 'stalled' : 'worse'; };
E('turn_check', { forced: 1, from: 'board', dept: 'board', cd: 1, why: 'Six weeks into your plan, the board looks at the table.',
  title: c => { const s = STATE(c); return `${LABEL[c.plan]}: ${s === 'working' ? 'it is working' : s === 'stalled' ? 'it has stalled' : 'it is not working'}`; },
  body: c => { const s = STATE(c), pos = F.myPos(), pts = Math.round(ppg(6) * 6); return `Six weeks on we are ${ord(pos)}, were ${ord(c.pos0)}, with ${pts} points from the last six games. ${s === 'working' ? 'The board is willing to say so out loud.' : s === 'stalled' ? 'Nothing has changed, which the board regards as a decision too.' : 'The chairman has stopped using adjectives.'}`; },
  opts: [
    { l: 'Keep faith', h: 'Board ↑ if it works, ↓ if it does not', f: c => { const s = STATE(c), G = g(); if (G.turn) G.turn.until += 4; if (s === 'working') { fx({ board: 4, fans: 2 }); return 'The board nods. In this building a nod is a standing ovation.'; } if (s === 'stalled') { fx({ board: -2 }); return 'You hold your line. So does the table.'; } fx({ board: -5, fans: -3 }); return 'You say it needs more time. The chairman says time is the one thing the club does not have.'; } },
    { l: 'Change direction', h: 'Board −2 · you pick a new plan', f: c => { fx({ board: -2 }); const G = g(); G.turnLast = null; if (G.turn) G.turn.plan = null; F.later('turn_call', snap(), 2, 3); return 'You tell the board the first plan was the wrong plan. They agree, which is not the same as being pleased.'; } },
    { l: 'Ask for time', h: 'Board −2 · four weeks of patience', f: c => { fx({ board: -2 }); const G = g(); if (G.turn) { G.turn.until += 4; G.turn.grace = abs() + 4; } return 'The board gives you a month. It is delivered in the tone of a final warning.'; } }],
  auto: () => 0 });
Object.assign(F, { turnTrouble: trouble, turnEdge: edge, TURN_LABEL: LABEL });
})(FO);
