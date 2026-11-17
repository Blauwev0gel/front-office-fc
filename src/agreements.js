/* The Front Office · agreements the CEO makes with a head (CEO-1)
   The CEO raises a real problem; the head gives his view and may refuse; what they agree has an owner, a week it is judged,
   and a result from what actually happened. One store (G.agr) for agreements made in conversation.
   First topic: the DoF and the squad's weakest position. The coach's targets keep their own scene (firstteam.js). */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, { clamp, staff, money } = F;
const sur = n => String(n || '').split(' ').slice(-1)[0], posL = p => (F.POS_L[p] || p).toLowerCase();
const list = () => { const G = g(); G.agr = G.agr || []; return G.agr; };
const open = () => list().filter(a => !a.res);
const winOpen = () => !!(F.window_ && F.window_());
const nextWindowEnd = () => { const G = g(); return G.week <= 18 ? F.absWeek() + (18 - G.week) + 1 : F.absWeek() + 8; }; // judged after the winter window, or eight weeks on

// make a position the DoF's priority for real: it feeds the recruitment plan the scouts and the pipeline use
F.recPrioritise = pos => { const G = g(); if (!G.rec || !pos) return; const pl = G.rec.plan; pl.prios = (pl.prios || []).filter(x => x.pos !== pos); pl.prios.unshift({ pos, kind: (pl.prios[0] || {}).kind || 'proven' }); pl.prios = pl.prios.slice(0, 3); pl.set = true; G.dofPrio = pos; };

/* ---------- the topic: where is the squad short? (only when there is a real answer) ---------- */
function dofTopic() {
  const G = g(), s = staff('dof'); if (!s || G.phase !== 'season' || !F.recPlanSuggest) return null;
  const sug = (F.recPlanSuggest() || [])[0]; if (!sug) return null;
  if (open().some(a => a.owner === 'dof' && a.k === 'pos')) return null; // one squad agreement at a time
  return { pos: sug.pos, why: String(sug.why || '').split(';')[0].replace(/\.$/, '') };
}
// what the DoF says, from his character and the money
function dofView(t) {
  const s = staff('dof'), P = s.p, tb = F.transferBudget ? F.transferBudget() : 0, w = winOpen(), G = g();
  const money_ = tb > 0 ? `I have ${money(tb)} to work with.` : 'There is no transfer money right now.';
  const timing = w ? 'The window is open.' : G.week < 17 ? `The window opens in ${17 - G.week} week${17 - G.week === 1 ? '' : 's'}.` : 'The window is shut until the summer.';
  const lean = P.risk >= 14 ? 'I would move now and fix it properly.' : P.risk <= 8 ? 'I would rather wait for the right one than rush.' : 'It needs fixing, but not at any price.';
  return `${posL(t.pos)[0].toUpperCase() + posL(t.pos).slice(1)}. ${t.why}. ${money_} ${timing} ${lean}`;
}
function agree(owner, k, data) { const a = Object.assign({ id: F.uid(), owner, k, made: F.absWeek(), mw: g().week, ms: g().season, by: nextWindowEnd() }, data); list().push(a); return a; }

/* ---------- the conversation (called from talks.js) ---------- */
F.agrTopics = role => role === 'dof' && dofTopic() ? [{ id: 't_squad', t: 'Where are we short?', fx: 'He gives you his view' }] : [];
F.agrAnswer = (id, T, say, note) => {
  const G = g(), s = staff('dof'); if (!s) return false; const P = s.p, N = sur(s.name);
  if (id === 't_squad') { const t = dofTopic(); if (!t) { say('dof', 'Honestly? Nothing I would change this week.'); T.opts = []; return true; }
    T.topic = t; say('dof', dofView(t));
    T.opts = [{ id: 'a_prio', t: `Make the ${posL(t.pos)} your priority`, fx: `Judged in week ${((nextWindowEnd() - F.absWeek()) + G.week)}` }, { id: 'a_you', t: 'Your call', fx: 'He decides, in his own way' }, { id: 'a_wait', t: 'It can wait', fx: 'No agreement' }];
    return true; }
  const t = T.topic; if (!t) return false;
  const ids = () => G.squad.filter(p => p.pos === t.pos).map(p => p.id), tb = F.transferBudget ? F.transferBudget() : 0;
  if (id === 'a_prio') {
    if (tb <= 0 && !winOpen() && G.week >= 17) { say('dof', P.ego >= 14 ? 'With what? There is no money and no window. Ask me in the summer.' : 'I would love to, but there is no money and the window is shut. I will look at loans in the summer.'); note('He says no: no money, no window'); T.opts = []; return true; }
    F.recPrioritise(t.pos); const a = agree('dof', 'pos', { pos: t.pos, base: ids(), why: t.why, t: `Find a ${posL(t.pos)}`, by0: tb });
    say('dof', P.risk >= 14 ? 'Good. I already have names.' : 'Fine. I will do it properly, not quickly.'); note(`Agreement: ${N} finds a ${posL(t.pos)} · judged in week ${a.by - F.absWeek() + G.week}`); T.opts = []; return true; }
  if (id === 'a_you') {
    if (P.risk >= 12 || P.amb >= 14) { F.recPrioritise(t.pos); const a = agree('dof', 'pos', { pos: t.pos, base: ids(), why: t.why, t: `Find a ${posL(t.pos)}`, own: 1, by0: tb }); say('dof', 'Then I will go after it.'); note(`His own call: ${N} goes for a ${posL(t.pos)} · judged in week ${a.by - F.absWeek() + G.week}`); }
    else { say('dof', 'Then I keep watching. If the right one comes up, I will tell you.'); note('His call: no move yet'); }
    T.opts = []; return true; }
  if (id === 'a_wait') { say('dof', P.ego >= 14 ? 'Your decision. Remember it was yours.' : 'Fine by me.'); T.opts = []; return true; }
  return false;
};

/* ---------- judging an agreement on what happened ---------- */
function judge(a) {
  const G = g(), s = staff(a.owner); a.res = 'done'; if (!s) { a.res = 'gone'; a.out = 'The head who made it has left.'; return; }
  if (a.k === 'pos') {
    const now = G.squad.filter(p => p.pos === a.pos && !a.base.includes(p.id)), N = sur(s.name);
    if (now.length) { a.res = 'met'; s.rel = clamp(s.rel + 4, 0, 100); s.perf = clamp((s.perf || 50) + 5, 0, 100); a.out = `${now[0].name} came in as ${posL(a.pos)}.`; }
    else if (!a.by0 && !(F.transferBudget && F.transferBudget() > 0)) { a.res = 'blocked'; a.out = 'There was never money to do it.'; }
    else { a.res = 'missed'; s.rel = clamp(s.rel - 2, 0, 100); s.perf = clamp((s.perf || 50) - 4, 0, 100); a.out = `No ${posL(a.pos)} arrived.`; }
    if (G.paper) G.paper.stories.push({ h: a.res === 'met' ? `${N} delivers` : a.res === 'blocked' ? `${N}: "No money, no player"` : `${N} falls short`, t: `${a.own ? 'He set himself' : 'You asked him'} to find a ${posL(a.pos)} in week ${a.mw}. ${a.out}` });
    if (F.deskNote) F.deskNote('dof', `Agreement: find a ${posL(a.pos)}`, a.res === 'met' ? `Met. ${a.out}` : a.res === 'blocked' ? `Not his fault. ${a.out}` : `Missed. ${a.out}`, a.res === 'missed' ? 1 : 0);
  }
}
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = o => { if (prevAfter) prevAfter(o); for (const a of open()) if (F.absWeek() >= a.by) judge(a); };

// what is still running and what was decided lately (for the desk and the department Record)
F.agrRunning = () => open().map(a => { const s = staff(a.owner); return { ic: 'scout', t: `${s ? sur(s.name) : 'The DoF'}: ${a.t.toLowerCase()}`, s: `${a.own ? 'His own call' : 'Agreed with you'} in week ${a.mw}. Judged in week ${a.by - F.absWeek() + g().week}.`, role: a.owner }; });
F.agrRecent = () => list().filter(a => a.res && F.absWeek() - a.by <= 1);
F.agrList = list;
})(FO);
