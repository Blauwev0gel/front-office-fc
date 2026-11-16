/* The Front Office · the CEO's week
   Every week has a subject (B22): a derby, a window, a board review, or a quiet week.
   Quiet weeks bring opportunities that find the CEO (B23): short choices with a trade-off,
   sometimes two that exclude each other. Big games give the CEO a moment around the match,
   and some decisions come back weeks later in the Gazette (B24). No action points (B21). */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, chance, pick, ri, money, M, staff, man } = F;
const sq = () => g().squad;
const fx = (k, n) => { const G = g(); if (k === 'fans') G.st.fans = clamp(G.st.fans + n, 0, 100); else if (k === 'press') G.st.press = clamp(G.st.press + n, 0, 100); else if (k === 'board') G.board.conf = clamp(G.board.conf + n, 0, 100); else if (k === 'spons') G.st.spons = clamp(G.st.spons + n, 0, 100); else if (k === 'brand') G.club.brand = clamp(G.club.brand + n, 0, 100); else if (k === 'cash') G.club.cash += n; else if (k === 'rep' && G.acad) G.acad.rep = clamp(G.acad.rep + n, 0, 100); };
const rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const first = r => { const s = staff(r); return s ? s.name.split(' ')[0] : 'he'; };

/* ---------- the subject of the week ---------- */
const BLOCK_T = { 1: 'The season starts', 7: 'Autumn: the long middle', 16: 'Winter', 20: 'The run-in starts', 30: 'The final five' };
function topic() {
  const G = g(); if (G.phase !== 'season') return null; const w = G.week, s = G.stake;
  const nx = F.mtPreview ? F.mtPreview() : null, opp = nx ? `${nx.home ? 'at home to' : 'away at'} ${nx.name}` : '';
  const open = G.inbox.filter(m => !m.done);
  if (open.some(m => /^vote_/.test(m.ev))) return { k: 'crisis', t: 'A vote of confidence', s: 'Your future at the club is on the line this week.' };
  if (open.some(m => m.ev === 'cash_crisis' || m.ev === 'fin_alarm')) return { k: 'crisis', t: 'Money trouble', s: 'Finance needs an answer from you this week.' };
  if (s && s.week === w) { const K = { derby: 'Derby week', top: 'Top-of-the-table week', bottom: 'A survival week', late: 'A big week' }; return { k: 'stake', t: K[s.kind] || 'A big week', s: `${opp ? opp[0].toUpperCase() + opp.slice(1) : 'A big game'}. You have a say before kick-off.` }; }
  if (w === 18) return { k: 'window', t: 'The window shuts this week', s: 'Deals not done by Sunday die. The DoF is on the phone all week.' };
  if (w === 17) return { k: 'window', t: 'The winter window opens', s: 'Two weeks to strengthen. Prices go up in winter.' };
  if ([10, 19, 29].includes(w)) return { k: 'board', t: 'Board review week', s: 'The board looks at where we stand against the target.' };
  if (G.cup.alive && G.cup.weeks.includes(w)) return { k: 'cup', t: 'Cup week', s: `The ${G.cup.names[G.cup.weeks.indexOf(w)]} of the National Cup.` };
  if (w === 28) return { k: 'acad', t: 'Trial day at the academy', s: 'The recruiters pick this year\'s intake. You tell them what to look for.' };
  if (w === 30) return { k: 'acad', t: 'The academy audit', s: 'The academy\'s category is decided this week.' };
  if (BLOCK_T[w]) return { k: 'block', t: BLOCK_T[w], s: opp ? `Next: ${opp}.` : '' };
  const op = (G.briefs || []).find(b => OPP.has(b.t) && !b.done);
  return { k: 'quiet', t: 'A quiet week', s: op ? 'Nothing burning. Something has come your way.' : opp ? `Next: ${opp}.` : 'Nothing burning this week.' };
}

/* ---------- opportunities in quiet weeks ---------- */
const OPP = new Set();
// a week is quiet when little needs the CEO; opportunities only come then
function quiet() { const G = g(); if (G.phase !== 'season' || G.week < 3) return false; const open = G.inbox.filter(m => !m.done); if (open.some(m => /^vote_|crisis|alarm/.test(m.ev))) return false; const n = open.length + (G.convo ? Object.keys(G.convo.req).length : 0); return n <= 1; }
// one opportunity a week at most: more would turn a quiet week into a busy one
const prevDesk = H.deskBriefs; H.deskBriefs = list => { let seen = false; for (let i = 0; i < list.length; i++) if (OPP.has(list[i].t) && list[i].t !== 'after_big') { if (seen) { list.splice(i, 1); i--; } else seen = true; } /* keep the best-scored one */ if (prevDesk) prevDesk(list); };
const B = (id, d) => { OPP.add(id); F.defineBrief(id, Object.assign({ role: null, cd: 14 }, d, { check: () => (quiet() ? d.check() : null) })); };

B('op_door', { face: 'player', who: c => `${c.name}, ${c.pos}`,
  check: () => { const G = g(), xi = new Set((G.lastMatch && G.lastMatch.xi) || []); const p = sq().filter(p => !xi.has(p.id) && p.inj <= 0 && (p.morale < 50 || p.ca >= F.tierAvg(G.club.tier))).sort((a, b) => a.morale - b.morale)[0]; return p ? { pid: p.id, name: p.name, pos: F.POS_L[p.pos], score: 3 } : null; },
  title: c => `${c.name} knocks on your door`, text: () => '"I train well and I never play. Could you have a word with the coach?"',
  opts: [
    { l: 'I will raise it with the coach', h: 'Player ↑ · coach ↓', f: c => { const p = sq().find(x => x.id === c.pid); if (p) p.morale = clamp(p.morale + 10, 0, 100); rel('coach', -3); return `He leaves happier. ${first('coach')} hears about it before lunch.`; } },
    { l: 'The coach picks the team', h: 'Player ↓ · coach ↑', f: c => { const p = sq().find(x => x.id === c.pid); if (p) p.morale = clamp(p.morale - 6, 0, 100); rel('coach', 2); return 'He nods, but he does not like it.'; } },
    { l: 'Keep working. Your chance will come', h: 'Player ↑ a little', f: c => { const p = sq().find(x => x.id === c.pid); if (p) p.morale = clamp(p.morale + 3, 0, 100); return 'He goes back to training.'; } }] });

B('op_journo', { face: 'press', who: () => 'Chief writer, The Gazette',
  check: () => ({ score: 2.6 }),
  title: () => 'The Gazette wants a long interview', text: () => '"A full page, your words. The town wants to know where this club is going."',
  opts: [
    { l: 'Talk about our plans', h: 'Press ↑ · board ↑ · the DoF dislikes leaks', f: () => { fx('press', 5); fx('board', 1); if (staff('dof') && staff('dof').p.ego > 13) rel('dof', -3); return 'A good read. The DoF wishes you had said less about targets.'; } },
    { l: 'Talk about the town and the fans', h: 'Fans ↑ · press ↑', f: () => { fx('fans', 3); fx('press', 2); return 'Warm, local, quoted in the pubs.'; } },
    { l: 'Decline politely', h: 'Press ↓ a little', f: () => { fx('press', -2); return 'The page goes to someone else.'; } }] });

B('op_chairman', { face: 'board', who: c => `Chairman of ${c.club}`,
  check: () => { const G = g(), ids = G.divs[G.club.tier].clubs.filter(x => x !== 0); const id = pick(ids); return { id, club: F.cname(id), riv: G.rival === id, score: 2.4 }; },
  title: c => `${c.club}'s chairman calls`, text: c => `"A friendly in the spring, the gate split down the middle. Good for both clubs."${c.riv ? ' Our supporters will not love it: they are our rivals.' : ''}`,
  opts: [
    { l: 'Shake on it', h: c => `+${money(M(1500))}${c.riv ? ' · fans ↓' : ''}`, f: c => { fx('cash', M(1500)); if (c.riv) fx('fans', -3); return c.riv ? 'The money is welcome. The supporters\' forum is not.' : 'A handshake and a date in April.'; } },
    { l: 'Keep your distance', h: c => c.riv ? 'Fans ↑ a little' : '', f: c => { if (c.riv) fx('fans', 1); return 'Polite, but no.'; } }] });

B('op_local', { face: 'club', who: () => 'A local car dealer',
  check: () => (g().club.deals.length < 5 ? { score: 2.5 } : null),
  title: () => 'A local business wants to help', text: () => `"We would put ${money(Math.round(M(150) / 10) * 10)} a week into the club. Our name on the training kit."`,
  opts: [
    { l: 'Sign it', h: c => `+${money(Math.round(M(150) / 10) * 10)}/wk for 20 weeks`, f: () => { g().club.deals.push({ name: 'Local car dealer', type: 'partner', wk: Math.round(M(150) / 10) * 10, weeks: 20 }); return 'A small deal, a big photo in the local paper.'; } },
    { l: 'Ask them to sponsor the academy kit', h: 'Less money · academy ↑', f: () => { g().club.deals.push({ name: 'Local car dealer (academy)', type: 'partner', wk: Math.round(M(80) / 10) * 10, weeks: 20 }); fx('rep', 3); return 'The under-14s get new kit. Parents notice.'; } },
    { l: 'Not now', h: '', f: () => 'They will try again next year.' }] });

B('op_fans', { face: 'fans', who: () => 'Supporters\' club secretary',
  check: () => ({ score: 2.4 }),
  title: () => 'The supporters\' club invites you', text: c => `"Our annual meeting is on Thursday. The members have questions."${g().st.fans < 40 ? ' The mood is not great.' : ''}`,
  opts: [
    { l: 'Go and take questions', h: 'Fans ↑, unless it goes wrong', f: () => { if (g().st.fans < 40 && chance(0.35)) { fx('fans', -2); return 'A hard evening. Someone films you being heckled.'; } fx('fans', 4); fx('press', 1); return 'Two hours, honest answers, a standing ovation at the end.'; } },
    { l: 'Send the Head of Marketing', h: 'Fans ↑ a little', f: () => { fx('fans', 1); rel('mkt', 2); return 'Well handled, but they wanted you.'; } },
    { l: 'Decline', h: 'Fans ↓', f: () => { fx('fans', -2); return 'The secretary reads out your apology to a quiet room.'; } }] });

B('op_agent', { face: 'agent', who: () => 'A players\' agent',
  check: () => { const G = g(), r = G.rec; if (!r || !staff('dof')) return null; const t = G.club.tier; const p = Object.values(r.pool).filter(p => !p.club && Math.abs(p.inTier - t) <= 1 && !r.pipe.some(x => x.pid === p.id)).sort((a, b) => b.ca - a.ca)[0]; return p ? { pid: p.id, name: p.name, pos: F.POS_L[p.pos], age: p.age, score: 2.3 } : null; },
  title: c => `An agent tips you off: ${c.name}`, text: c => `"${c.name}, ${c.age}, ${c.pos.toLowerCase()}, is a free agent. Nobody has called him yet."`,
  opts: [
    { l: 'Pass it to the DoF', h: 'On his list · he may not like the interference', f: c => { if (F.recAddPipe) F.recAddPipe(c.pid, 'scouted'); const d = staff('dof'); if (d && d.p.ego > 13) { rel('dof', -2); return `${first('dof')} adds him to the list, without enthusiasm.`; } rel('dof', 1); return `${first('dof')} will have him watched.`; } },
    { l: 'Ignore it', h: '', f: () => 'Agents always have a tip.' }] });

B('op_council', { face: 'board', who: () => 'The town council',
  check: () => (g().club.cash > M(4000) ? { score: 2.2 } : null),
  title: () => 'The council offers a community pitch', text: () => '"We provide the land next to the training ground. You build the pitch, the town uses it at weekends."',
  opts: [
    { l: 'Build it', h: () => `−${money(M(3000))} · fans ↑ · academy ↑ · brand ↑`, f: () => { fx('cash', -M(3000)); fx('fans', 3); fx('rep', 3); fx('brand', 2); return 'Turf goes down in a month. Kids are on it by the weekend.'; } },
    { l: 'Ask them to share the costs', h: () => `−${money(M(1200))} · smaller effect`, f: () => { fx('cash', -M(1200)); fx('fans', 1); fx('rep', 1); return 'A smaller pitch, a joint ribbon-cutting.'; } },
    { l: 'Not now', h: '', f: () => 'The council finds another partner.' }] });

B('op_legend', { face: 'club', who: () => 'A club legend',
  check: () => ({ score: 2.1 }),
  title: () => 'A club legend offers his help', text: () => '"I scored a hundred goals for this club. Let me give something back."',
  opts: [
    { l: 'Make him club ambassador', h: () => `−${money(M(1500))} · fans ↑ · brand ↑`, f: () => { fx('cash', -M(1500)); fx('fans', 4); fx('brand', 2); return 'He is at every home game, shaking every hand.'; } },
    { l: 'A testimonial match instead', h: () => `+${money(M(2000))} · fans ↑ a little`, f: () => { fx('cash', M(2000)); fx('fans', 2); return 'A full house for one evening.'; } },
    { l: 'Thank him, no', h: 'Fans ↓ a little', f: () => { fx('fans', -1); return 'He tells the radio he is disappointed.'; } }] });

B('op_charity', { face: 'press', who: () => 'A local charity',
  check: () => ({ score: 2 }),
  title: () => 'A charity match for the hospital', text: () => '"Two or three first-team players would make the day."',
  opts: [
    { l: 'Send first-team players', h: 'Brand ↑ · fans ↑ · coach ↓ · a small injury risk', f: () => { fx('brand', 3); fx('fans', 2); rel('coach', -3); if (chance(0.2)) { const p = pick(sq().filter(p => p.inj <= 0)); if (p) { p.inj = 1; return `A great day, until ${p.name} turns an ankle. One week out.`; } } return 'Photos, smiles, a cheque for the hospital.'; } },
    { l: 'Send academy players', h: 'Brand ↑ · academy ↑', f: () => { fx('brand', 1); fx('rep', 2); rel('acad', 2); return 'The kids love it. So does the hospital.'; } },
    { l: 'Decline', h: '', f: () => 'The charity finds another club.' }] });

B('op_coach', { face: 'fans', who: () => 'The away supporters',
  check: () => { const nx = F.mtPreview ? F.mtPreview() : null; return nx && !nx.home ? { opp: nx.name, score: 2.2 } : null; },
  title: c => `Travel with the fans to ${c.opp}?`, text: () => '"There is a seat on our coach if you want it."',
  opts: [
    { l: 'Take the supporters\' coach', h: 'Fans ↑ · press ↑', f: () => { fx('fans', 4); fx('press', 1); return 'Four hours, a thousand selfies, one sing-song.'; } },
    { l: 'Travel with the team', h: 'Coach ↑ a little', f: () => { rel('coach', 1); return 'A quiet trip with the staff.'; } }] });

B('op_pair', { face: 'club', who: () => 'Your diary for Saturday',
  check: () => (staff('com') && staff('acad') ? { score: 2.3 } : null),
  title: () => 'Two invitations, one Saturday', text: () => 'The main sponsor\'s golf day and the academy parents\' evening fall on the same day. You can only be at one.',
  opts: [
    { l: 'The sponsor\'s golf day', h: 'Sponsors ↑ · Commercial ↑ · the academy notices', f: () => { fx('spons', 4); rel('com', 3); rel('acad', -2); return 'Eighteen holes and a renewal hinted at the nineteenth.'; } },
    { l: 'The parents\' evening', h: 'Academy ↑ · Commercial notices', f: () => { fx('rep', 3); rel('acad', 3); rel('com', -2); return 'The parents talk about it for weeks.'; } }] });

/* ---------- big games: a moment before and after (B23) ---------- */
if (F.BR.stake_match) { const o = F.BR.stake_match.opts; const keep = o.pop(); o.push({ l: 'Host a sponsor in the box', h: 'Sponsors ↑ · board ↑ a little', f: () => { fx('spons', 3); fx('board', 1); return 'A good lunch and a better view.'; } }, keep); }
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(); if (ours && G.stake && G.stake.week === G.week) G.bigDone = { kind: G.stake.kind, res: ours.result, opp: ours.oppName, s: `${ours.ug}–${ours.tg}`, at: F.absWeek() };
  // echoes that are due appear in this week's Gazette
  const now = F.absWeek(), due = (G.echo || []).filter(e => e.at <= now); G.echo = (G.echo || []).filter(e => e.at > now);
  for (const e of due) { const E = ECHO[e.k]; let t = ''; try { t = E ? E(e.ctx) : ''; } catch (er) { t = ''; } if (t && G.paper) G.paper.stories.push({ h: 'Looking back', t }); }
};
F.defineBrief('after_big', { role: null, cd: 1, face: 'press', who: () => 'The press officer',
  check: () => { const b = g().bigDone; if (!b || F.absWeek() - b.at > 1) return null; g().bigDone = null; return { ...b, score: 3.4 }; },
  title: c => c.res === 'W' ? `After the win: ${c.s} against ${c.opp}` : c.res === 'L' ? `After the defeat: ${c.s} against ${c.opp}` : `After the draw: ${c.s} against ${c.opp}`,
  text: c => c.res === 'W' ? 'The town is buzzing. The press want the CEO.' : c.res === 'L' ? 'The dressing room is quiet and the phones are not.' : 'Not what we wanted, not a disaster. The press want a line.',
  opts: [
    { l: c => c.res === 'W' ? 'Celebrate with the fans' : 'Back the players in public', h: c => c.res === 'W' ? 'Fans ↑ · board ↓ a little if we slip' : 'Players ↑ · press ↓ a little', f: c => { if (c.res === 'W') { fx('fans', 4); return 'You join the celebrations. The pictures are everywhere.'; } sq().forEach(p => p.morale = clamp(p.morale + 3, 0, 100)); fx('press', -1); return 'The players read it. The press call it soft.'; } },
    { l: c => c.res === 'W' ? 'Feet on the ground' : 'Demand a reaction', h: c => c.res === 'W' ? 'Board ↑' : 'Coach sharper · coach trust ↓', f: c => { if (c.res === 'W') { fx('board', 2); return '"One game, three points." The board likes it.'; } const s = staff('coach'); if (s) { s.boost = clamp(s.boost + 4, -10, 12); s.boostW = 4; } rel('coach', -3); return 'The message is clear. The coach is not smiling.'; } },
    { l: 'Say nothing', h: '', f: () => 'The press officer reads a short statement.' }] });
OPP.add('after_big');

/* ---------- echoes: decisions come back (B24) ---------- */
// each entry: text for the Gazette 3 to 8 weeks later; empty text = nothing to report
const P = id => sq().find(p => p.id === id) || g().academy.find(p => p.id === id);
const ECHO = {
  'bet_sponsor:0': () => 'Supporters still hand out leaflets about the betting sponsor at home games.',
  'bet_sponsor:1': () => { const G = g(), r = pick(G.divs[G.club.tier].clubs.filter(x => x !== 0)); return `The betting firm we turned down now sponsors ${F.cname(r)}. Our supporters remember who said no.`; },
  'raise_demand:1': c => { const p = P(c.pid); return !p ? 'The player whose raise you refused has since left the club.' : p.morale < 50 ? `${p.name} has not been the same since his raise was refused.` : `${p.name} got over the refused raise. His form says so.`; },
  'raise_demand:0': c => { const p = P(c.pid); return p ? `${p.name}, given his raise, has ${p.st.g || 0} goal${p.st.g === 1 ? '' : 's'} and ${p.st.apps || 0} apps this season.` : ''; },
  'bid_star:0': c => `The player we sold has settled in at ${c.club ? F.cname(c.club) : 'his new club'}.`,
  'bid_star:1': c => { const p = P(c.pid); return p ? `${p.name}, the player you would not sell, has ${p.st.apps || 0} appearances this season.` : ''; },
  'clash_prospect:0': c => `${c.name}, sold as a teenager, is now training with a bigger club's first team.`,
  'clash_prospect:1': c => { const p = P(c.pid); return p ? `${c.name}, the boy you refused to sell, ${sq().includes(p) ? 'is now in the first-team squad' : 'is still with the academy'}.` : ''; },
  'wonderkid:0': () => 'The wonderkid we sold is tipped for big things at his new club.',
  'acad_poach:0': c => `${c.name || 'The boy'} who left for ${c.club ? F.cname(c.club) : 'a bigger club'} is in their youth side now.`,
  'clash_tour:0': () => 'Since the winter tour, the coach has mentioned tired legs in three interviews.',
  'coach_dof_clash:0': () => 'Coach and DoF still sit at opposite ends of the table in meetings.',
  'coach_dof_clash:1': () => 'The coach has stopped talking about signings in his press conferences.',
  'naming_rights:0': () => 'The new stadium name has yet to make it into a single supporters\' song.',
  'naming_rights:1': () => 'A banner at the last home game thanked the board for keeping the name.',
  'ticket_protest:0': () => 'Crowds are up since the price cut.',
  'ticket_protest:1': () => 'There are more empty seats than last season, the Gazette notes.',
  'dof_rule:0': c => { const p = c.player && sq().find(x => x.name === c.player.name); return p ? `${p.name}, signed as an exception to the rules, has ${p.st.apps || 0} appearances so far.` : ''; },
  'staff_raise:2': () => 'An agent says one of our heads of department has been looking at other jobs.',
  // far echoes: the same decision, seasons later (keys start with far:, they are scheduled together with the near echo)
  'far:bet_sponsor:0': () => 'The betting logo is still on the shirt. Nobody can remember why it was ever a big decision.',
  'far:bet_sponsor:1': () => 'The new stand roof has been costed. The betting money we turned down would have covered it.',
  'far:raise_demand:1': c => { const p = P(c.pid); return p ? `${p.name}, whose raise you refused, is still here. His agent still brings it up.` : 'The player whose raise you refused has long gone. His agent has not.'; },
  'far:bid_star:0': () => 'The fee we took for our star would no longer buy a decent full-back.',
  'far:bid_star:1': c => { const p = P(c.pid); return p ? `${p.name}, the player you would not sell, is ${p.age} now with ${p.contract} season${p.contract === 1 ? '' : 's'} left on his deal.` : 'The player you would not sell has since moved on, and the fee was never mentioned again.'; },
  'far:clash_prospect:0': c => `${c.name}, sold as a teenager, has signed his first professional contract elsewhere.`,
  'far:clash_prospect:1': c => { const p = P(c.pid); return p ? `${c.name}, the boy you would not sell, ${sq().includes(p) ? 'is a first-team regular now' : 'is still in the academy and still asks about the first team'}.` : ''; },
  'far:ticket_protest:0': () => 'The ground has been full for two seasons. The queue for the pies has not improved.',
  'far:ticket_protest:1': () => 'The supporters\' trust still raises the ticket prices at every annual meeting.',
  'far:naming_rights:0': () => 'Supporters now use the sponsored stadium name without irony. A small defeat for irony.',
};
/* ---------- memory: what the CEO chose is remembered, so later events can answer it ---------- */
// G.mem['event_id:option'] = { at: absolute week, s: season, c: the plain values of the event's context (pid, name, ...) }
const keepCtx = c => { const o = {}; if (c) for (const k in c) { const v = c[k]; if (v == null || ['number', 'string', 'boolean'].includes(typeof v)) o[k] = v; } return o; };
for (const id in F.EV) { const e = F.EV[id]; if (!Array.isArray(e.opts)) continue; e.opts.forEach((o, i) => { if (typeof o.f !== 'function') return; const f0 = o.f; o.f = c => { const out = f0(c), G = g(); if (G.resBy === 'you') (G.mem = G.mem || {})[id + ':' + i] = { at: F.absWeek(), s: G.season, c: keepCtx(c) }; return out; }; }); }
// recall('raise_demand:1', 34, 150): the record if that choice was made between 34 and 150 weeks ago, else null
function recall(key, minAgo, maxAgo) { const r = (g().mem || {})[key]; if (!r) return null; const ago = F.absWeek() - r.at; return ago >= (minAgo || 0) && ago <= (maxAgo == null ? Infinity : maxAgo) ? r : null; }
for (const k in ECHO) { if (k.startsWith('far:')) continue; const [id, i] = k.split(':'); const e = F.EV[id]; if (!e || !e.opts[+i]) continue; const f0 = e.opts[+i].f; e.opts[+i].f = c => { const out = f0(c); const G = g(); if (G.resBy === 'you') { (G.echo = G.echo || []).push({ at: F.absWeek() + ri(3, 8), k, ctx: c }); if (ECHO['far:' + k]) G.echo.push({ at: F.absWeek() + 34 * ri(1, 3) + ri(0, 10), k: 'far:' + k, ctx: keepCtx(c) }); } return out; }; }

/* ---------- half-time: the dressing room (B27) ---------- */
// The match is already decided by the engine: this choice is about the people, never the score.
function htOffer(m) { const G = g(); if (!m || !staff('coach')) return null; const ht = m.ev.find(e => e.k === 'info' && /^Half-time/.test(e.t)); if (!ht) return null;
  const [a, b] = ht.t.replace(/^Half-time:\s*/, '').replace(/\.$/, '').split('–').map(Number), us = m.home ? a : b, th = m.home ? b : a; const big = G.stake && G.stake.week === G.week;
  return us < th || big || (us === th && chance(0.35)) ? { us, th } : null; }
function htChoice(k) { const s = staff('coach'); if (!s) return ''; const n = s.name.split(' ')[0];
  if (k === 'in') { sq().forEach(p => p.morale = clamp(p.morale + 3, 0, 100)); rel('coach', s.p.ego > 13 ? -5 : -2); return s.p.ego > 13 ? `The players listen. ${n} stands by the door, arms folded.` : `A few calm words. ${n} nods as you leave.`; }
  rel('coach', 2); return `You stay in the box. ${n} appreciates the trust.`; }
Object.assign(F, { weekTopic: topic, OPP_IDS: OPP, mdHtOffer: htOffer, mdHtChoice: htChoice, recall });
})(FO);
