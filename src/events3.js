/* The Front Office · event library (module 1, part 3)
   Two kinds of event that make a long career feel different from a short one:
   - callbacks: they only exist because of something the CEO chose seasons ago (F.recall, see weekflow.js)
   - top flight: problems that only the top two divisions have, so success brings new questions instead of silence */
(function (F) {
'use strict';
const g = () => F.G;
const { ri, pick, chance, clamp, money, M, staff, man } = F;
const P = id => g().squad.find(p => p.id === id);
const sq = () => g().squad;
const fx = o => { const G = g(); for (const k in o) { const n = o[k]; if (k === 'board') G.board.conf = clamp(G.board.conf + n, 0, 100); else if (k === 'brand') G.club.brand = clamp(G.club.brand + n, 0, 100); else if (k === 'cash') G.club.cash += n; else G.st[k] = clamp(G.st[k] + n, 0, 100); } };
const rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const SEASON = 34, top = () => g().club.tier <= 2;
const E = F.defineEvent;

/* ---------- callbacks: the past comes back ---------- */
E('cb_raise_refused', { from: 'dof', dept: 'sporting', cd: 90, why: 'A raise you refused seasons ago has come back.',
  cond: () => { const r = F.recall('raise_demand:1', SEASON, SEASON * 4); return !!(r && P(r.c.pid)) && g().week > 3; },
  setup: () => { const r = F.recall('raise_demand:1', SEASON, SEASON * 4), p = r && P(r.c.pid); return p ? { pid: p.id, name: p.name } : null; },
  title: c => `${c.name} brings up the raise again`,
  body: c => { const p = P(c.pid); return p ? `You turned down his raise a while back. His agent now says a rival would pay him ${money(Math.round(p.wage * 1.5 / 5) * 5)}/wk, and that he has "a long memory".` : 'He has left.'; },
  opts: [
    { l: 'Match the offer', h: 'Wage ×1.4 · morale ↑', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.wage = Math.round(p.wage * 1.4 / 5) * 5; p.contract = Math.max(p.contract, 3); p.morale = clamp(p.morale + 18, 0, 100); return `${c.name} signs. His agent calls it "overdue".`; } },
    { l: 'Let him go at a fair price', h: 'A bid will come · fans ↓ a little', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; fx({ fans: -1 }); F.later('bid_star', { pid: p.id, fee: Math.round(p.value / 100) * 100, club: pick(g().divs[Math.max(1, g().club.tier - 1)].clubs.filter(x => x !== 0)) }, 1, 3); return 'The DoF lets it be known that he can talk to other clubs.'; } },
    { l: 'Point at his contract', h: 'Free · he sulks', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.morale = clamp(p.morale - 14, 0, 100); if (chance(0.5)) F.later('transfer_request', { pid: p.id, name: p.name }, 3, 7); return `${c.name} says nothing in the press. That is worse.`; } }],
  auto: () => 1 });

E('cb_betting', { from: 'com', dept: 'commercial', cd: 100, why: 'A sponsor you took on seasons ago is in the news.',
  cond: () => !!F.recall('bet_sponsor:0', SEASON, SEASON * 5) && g().week > 3,
  setup: () => ({}),
  title: () => 'The betting sponsor is in the paper',
  body: () => 'A newspaper has counted the betting adverts on the youth-team kit. The shirt deal pays well. The story costs more.',
  opts: [
    { l: 'Keep it and defend it', h: 'Press ↓ · fans ↓ a little', f: () => { fx({ press: -4, fans: -2 }); return 'The statement is read aloud at two supporters\' meetings. Both ask for it to be shorter.'; } },
    { l: 'Take it off the youth kits', h: () => `−${money(M(600))} · press ↑`, f: () => { fx({ cash: -M(600), press: 3 }); return 'The youth kits are reprinted. The sponsor sends a polite email about "visibility".'; } },
    { l: 'Drop the deal', h: () => `−${money(M(2500))} · fans ↑ · press ↑`, f: () => { fx({ cash: -M(2500), fans: 4, press: 5 }); return 'The finance director leaves the room without comment.'; } }],
  auto: () => 0 });

E('cb_tickets', { from: 'fans', dept: 'commercial', cd: 100, why: 'A ticket-price decision from seasons ago is still being discussed.',
  cond: () => !!(F.recall('ticket_protest:0', SEASON, SEASON * 4) || F.recall('ticket_protest:1', SEASON, SEASON * 4)) && g().week > 3,
  setup: () => ({ cut: !!F.recall('ticket_protest:0', SEASON, SEASON * 4) }),
  title: c => c.cut ? 'The ground is full and the roof is not' : 'Season-ticket renewals are down',
  body: c => c.cut ? 'Since the price cut the crowds have come back. So have the leaks, the queues and the toilets nobody mentions.' : 'The supporters\' trust says the ticket prices are why renewals are slipping. They have brought a graph.',
  opts: [
    { l: 'Invest in the ground', h: () => `−${money(M(1500))} · fans ↑`, f: () => { fx({ cash: -M(1500), fans: 3 }); return 'The contractors are on site by Monday. The queue for the pies is not part of the scope.'; } },
    { l: 'Offer a loyalty discount', h: () => `−${money(M(500))} · fans ↑ · sponsors ↓ a little`, f: () => { fx({ cash: -M(500), fans: 3, spons: -1 }); return 'Season-ticket holders get a letter, and a discount that arrives as a voucher.'; } },
    { l: 'Hold and say nothing', h: 'Free · fans ↓', f: c => { fx({ fans: c.cut ? -1 : -3 }); return c.cut ? 'The crowd is happy enough to put up with it.' : 'The trust notes your silence in its minutes.'; } }],
  auto: () => 1 });

E('cb_star_kept', { from: 'dof', dept: 'sporting', cd: 90, why: 'A player you refused to sell wants it honoured.',
  cond: () => { const r = F.recall('bid_star:1', SEASON, SEASON * 3); return !!(r && P(r.c.pid)) && g().week > 3; },
  setup: () => { const r = F.recall('bid_star:1', SEASON, SEASON * 3), p = r && P(r.c.pid); return p ? { pid: p.id, name: p.name } : null; },
  title: c => `${c.name}: "You said we would build something"`,
  body: c => { const p = P(c.pid); return p ? `You refused to sell him once. He stayed. Now he is ${p.age}, has ${p.contract} season${p.contract === 1 ? '' : 's'} left, and wants to know what the plan is.` : 'He has left.'; },
  opts: [
    { l: 'Give him a new deal', h: 'Wage ×1.4 · contract to 4 seasons', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.wage = Math.round(p.wage * 1.4 / 5) * 5; p.contract = 4; p.morale = clamp(p.morale + 15, 0, 100); return `${c.name} signs. "I wanted to hear you say it."`; } },
    { l: 'Sell him now, at a good price', h: 'A big bid will come', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; F.later('bid_star', { pid: p.id, fee: Math.round(p.value * 1.2 / 100) * 100, club: pick(g().divs[Math.max(1, g().club.tier - 2)].clubs.filter(x => x !== 0)) }, 1, 3); return 'The DoF starts making calls. The player is told to expect good news.'; } },
    { l: 'Promise him a bigger role', h: 'Free · he will ask again', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.morale = clamp(p.morale + 8, 0, 100); if (chance(0.5)) F.later('transfer_request', { pid: p.id, name: p.name }, 6, 12); return `${c.name} nods slowly. You can tell he has heard this before.`; } }],
  auto: () => 0 });

E('cb_prospect_kept', { from: 'coach', dept: 'first team', cd: 90, why: 'A youngster you refused to sell now wants his chance.',
  cond: () => { const r = F.recall('clash_prospect:1', SEASON, SEASON * 3); return !!(r && P(r.c.pid)) && g().week > 3; },
  setup: () => { const r = F.recall('clash_prospect:1', SEASON, SEASON * 3), p = r && P(r.c.pid); return p ? { pid: p.id, name: p.name } : null; },
  title: c => `${c.name} wants to know why he is not playing`,
  body: c => `You refused to sell him as a boy. He is in the squad now and asks, politely, what that was for.`,
  opts: [
    { l: 'Tell the coach to play him', h: 'Morale ↑ · coach trust ↓', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.morale = clamp(p.morale + 15, 0, 100); rel('coach', -3); return `${c.name} is on the team sheet on Saturday. The coach is polite about it, in the way coaches are.`; } },
    { l: 'Ask him to wait his turn', h: 'Free · morale ↓', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.morale = clamp(p.morale - 10, 0, 100); return `${c.name} says he understands. His face says something else.`; } },
    { l: 'Loan him out to play', h: 'He leaves for a while · morale ↑', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.morale = clamp(p.morale + 8, 0, 100); return `${c.name} goes out on loan with a handshake and a long list of conditions.`; } }],
  auto: () => 1 });

/* ---------- top flight: the problems of the successful ---------- */
E('top_wage_spiral', { from: 'dof', dept: 'sporting', cd: 60, why: 'Agents have noticed which division you are in.',
  cond: () => top() && g().week > 6 && sq().length > 12, setup: () => ({}),
  title: () => 'Agents want top-flight money',
  body: () => 'Three of the squad have been told by their agents that they are "playing in the top flight on lower-division wages". The agents mean it as a compliment and a threat.',
  opts: [
    { l: 'Raise the wage scale', h: 'Wages +8% · morale ↑', f: () => { sq().forEach(p => { p.wage = Math.round(p.wage * 1.08 / 5) * 5; p.morale = clamp(p.morale + 4, 0, 100); }); return 'The new scale goes round the dressing room before the finance director has finished printing it.'; } },
    { l: 'Hold the line', h: 'Free · two will sulk', f: () => { const a = pick(sq()), b = pick(sq()); [a, b].forEach(p => { p.morale = clamp(p.morale - 10, 0, 100); }); fx({ board: 1 }); return 'The board approves. Two players read the Gazette very carefully.'; } },
    { l: 'Pay the best, tell the rest to earn it', h: 'Best player ×1.3 · others ↓ a little', f: () => { const b = F.bestPlayer(); if (b) b.wage = Math.round(b.wage * 1.3 / 5) * 5; sq().forEach(p => { if (p !== b) p.morale = clamp(p.morale - 3, 0, 100); }); return 'There are now two classes in the dressing room. They already knew.'; } }],
  auto: () => 1 });

E('top_takeover', { from: 'board', dept: 'business', cd: 120, why: 'Someone wants a piece of a successful club.',
  cond: () => top() && g().week > 6 && !g().club.investor, setup: () => ({}),
  title: () => 'A fund wants a minority stake',
  body: () => 'A fund has noticed the club. They want a 20% stake, a seat on the board and, they say, "no involvement in football decisions". The last part is underlined.',
  opts: [
    { l: 'Accept the money', h: () => `+${money(M(6000))} · board ↓ · fans ↓`, f: () => { fx({ cash: M(6000), board: -3, fans: -3 }); g().club.investor = true; return 'The cheque clears. The first email from the fund arrives the same afternoon.'; } },
    { l: 'Keep control', h: 'Free · press ↑', f: () => { fx({ press: 2 }); return 'The chairman says the club is not for sale. It is, at the right price, but not today.'; } },
    { l: 'Ask for time to think', h: 'Free · they may not wait', f: () => { fx({ board: -1 }); return 'The fund says it is a patient investor. Patient investors are the ones who ring on Fridays.'; } }],
  auto: () => 1 });

E('top_complacency', { from: 'board', dept: 'first team', cd: 80, why: 'Success has made the building comfortable.',
  cond: () => top() && g().board.conf >= 80 && g().week > 8, setup: () => ({}),
  title: () => 'Everyone is very comfortable',
  body: () => 'Results are good, the board is happy and the canteen has a new coffee machine. The coach has mentioned, twice, that "we are doing fine".',
  opts: [
    { l: 'Raise the bar publicly', h: 'Board ↑ a little · coach and DoF trust ↓', f: () => { fx({ board: 2 }); rel('coach', -4); rel('dof', -3); const s = staff('coach'); if (s) { s.boost = clamp(s.boost + 2, -10, 12); s.boostW = 6; } return 'The new targets go up on the wall. Nobody looks at them directly.'; } },
    { l: 'Celebrate the run', h: 'Fans ↑ · focus ↓ a little', f: () => { fx({ fans: 3 }); const s = staff('coach'); if (s) { s.boost = clamp(s.boost - 2, -10, 12); s.boostW = 5; } return 'A dinner, a speech and a great many photographs. Monday is a bit slow.'; } },
    { l: 'Say nothing', h: 'Free', f: () => 'The coffee machine remains the biggest change of the season.' }],
  auto: () => 2 });

E('top_poached', { from: 'board', dept: 'first team', cd: 100, why: 'A bigger club has noticed your head coach.',
  cond: () => top() && !!staff('coach') && g().week > 6, setup: () => ({}),
  title: () => 'A foreign club wants your head coach',
  body: () => { const s = staff('coach'); return `${s ? s.name : 'Your coach'} has been approached by a club abroad. "I have not said yes," he says, in the way people do before saying yes.`; },
  opts: [
    { l: 'Counter with a better deal', h: 'Wage +25% · contract to 3 · trust ↑', f: () => { const s = staff('coach'); if (!s) return 'There is no coach.'; s.wage = Math.round(s.wage * 1.25 / 5) * 5; s.contract = Math.max(s.contract, 3); rel('coach', 6); return `${s.name} signs. He says it was never about the money. It was a bit about the money.`; } },
    { l: 'Let him talk to them', h: 'Free · trust ↓ · focus ↓ for a while', f: () => { const s = staff('coach'); if (!s) return 'There is no coach.'; rel('coach', -8); s.boost = clamp(s.boost - 3, -10, 12); s.boostW = 6; return `${s.name} takes the call in the car park, where everyone can see him.`; } },
    { l: 'Refuse permission', h: 'Free · trust ↓ a lot', f: () => { const s = staff('coach'); if (!s) return 'There is no coach.'; rel('coach', -12); return `${s.name} accepts the decision. He also accepts that it has been noted.`; } }],
  auto: () => 0 });

/* ---------- the scouting portal talks back (B47) ---------- */
// Three moments around the portal: a scout's hunch about a player you have not flagged, an agent who calls about a player you did,
// and the day a bet is settled. They only exist when the portal has been used or there is a scout, and none of them judges the player.
const flagsN = () => F.worldFlagged ? F.worldFlagged().length : 0;
const tg = key => { const ts = F.worldTargetState && F.worldTargetState(key); return ts && !['lost', 'gone'].includes(ts.stage); };
E('pl_hunch', { from: 'scout', dept: 'scouting', cd: 16, why: 'A scout has seen something in the numbers.',
  cond: () => !!F.worldLeague && !!staff('scout') && g().phase === 'season' && g().week >= 3 && g().week <= 30 && flagsN() < 5,
  w: () => 1.1,
  setup: () => { const t = g().club.tier, L = F.worldLeague('d' + t).players.filter(p => !p.ours && p.age <= 30 && p.st.mins >= 1500 && !F.worldMeta(p.key).fl && (p.z <= -1.2 || (p.age <= 22 && p.pa - p.ca >= 2))); if (!L.length) return null;
    const p = pick(L), late = p.z > -1.2; return { key: p.key, name: p.name, pos: p.pos, age: p.age, club: p.club, ask: p.ask, hyp: late ? 'Late bloomer' : 'Unlucky finisher' }; },
  title: c => `${staff('scout') ? staff('scout').name.split(' ')[0] : 'The scout'} has a hunch about ${c.name}`,
  body: c => c.hyp === 'Late bloomer' ? `"${c.name}, ${c.age}, ${c.pos} at ${c.club}. Young, and the ceiling looks higher than the price. I would not wait a year." He does not say it is a certainty. He never does.` : `"${c.name}, ${c.pos} at ${c.club}. The chances are there, the numbers are not. I think the season has been unkind to him." He leaves the printout on your desk.`,
  opts: [
    { l: 'Flag him with that reason', h: 'Your bet · see it in Bets after the season', f: c => { F.worldFlag(c.key, c.hyp); rel('scout', 3); return `${c.name} is flagged as "${c.hyp}". It is your bet now.`; } },
    { l: 'Flag him and have the scouts check', h: 'Uses a scout slot this week', f: c => { F.worldFlag(c.key, c.hyp); rel('scout', 4); const r = F.worldConfirm(c.key); return r.err ? `${c.name} is flagged. ${r.err}` : `${c.name} is flagged and the scouts are on it. A report next week.`; } },
    { l: 'Not interested', h: 'Free · the scout notes it', f: () => { rel('scout', -2); return 'He nods and takes the printout back.'; } }],
  auto: () => 2 });
E('pl_agent', { from: 'dof', dept: 'sporting', cd: 22, why: 'An agent has heard you are interested.',
  cond: () => !!staff('dof') && g().phase === 'season' && g().week >= 2 && g().week <= 30 && F.worldFlagged && F.worldFlagged().some(f => !tg(f.key) && !f.signed),
  setup: () => { const f = F.worldFlagged().filter(f => !tg(f.key) && !f.signed && F.worldPlayer(f.key)); if (!f.length) return null; const x = pick(f), p = F.worldPlayer(x.key); return { key: x.key, name: p.name, pos: p.pos, age: p.age, club: p.club, ask: p.ask }; },
  title: c => `An agent calls about ${c.name}`,
  body: c => `${staff('dof') ? staff('dof').name.split(' ')[0] : 'The DoF'}: "Word travels. ${c.name}'s agent knows we looked. He says the player would listen, and that two other clubs are asking too." The asking price is ${money(c.ask)}.`,
  opts: [
    { l: 'Make him a target', h: 'He goes on the DoF\'s list · mandates apply', f: c => { const r = F.worldTarget(c.key); return r.err ? r.err : `${c.name} is on the DoF's list. The agent says he will tell the other clubs nothing. He will tell them everything.`; } },
    { l: 'Tell the agent to wait', h: 'Free · the interest may cool', f: () => { rel('dof', 1); return 'The DoF says "we will be in touch". The agent hears "no".'; } },
    { l: 'Drop him from the flags', h: 'Your read is closed', f: c => { F.worldUnflag(c.key); return `${c.name} is off the flag list.`; } }],
  auto: () => 1 });
E('pl_bet_settled', { forced: 1, from: 'scout', dept: 'scouting', cd: 6, why: 'A bet you made has been settled by a season of play.',
  setup: () => null,
  title: c => `Your read on ${c.name}: ${c.held ? 'it held up' : 'it did not hold up'}`,
  body: c => `${staff('scout') ? staff('scout').name.split(' ')[0] : 'The scout'} went back over ${c.name}. You flagged him as "${c.hyp}". ${c.held ? 'A season later the numbers moved the way you said.' : 'A season later the numbers moved the other way.'}${c.signed ? ' He is one of ours now.' : ''}`,
  opts: [
    { l: c => c.held && !c.signed ? 'Make him a target' : 'Note it', h: c => c.held && !c.signed ? 'He goes on the DoF\'s list' : 'Free', f: c => { rel('scout', 2); if (c.held && !c.signed && F.worldTarget) { const r = F.worldTarget(c.key); if (!r.err) return `${c.name} is on the DoF's list.`; } return 'Noted.'; } },
    { l: c => c.held ? 'Credit the scouts' : 'Ask what we missed', h: c => c.held ? 'Scout trust ↑' : 'A short sample, probably', f: c => { rel('scout', c.held ? 4 : 1); return c.held ? 'The scout says it was your read. It was a bit of both.' : 'He admits the sample was short. You both write it down.'; } },
    { l: 'Move on', h: 'Free', f: () => 'The file is closed.' }],
  auto: () => 2 });
})(FO);
