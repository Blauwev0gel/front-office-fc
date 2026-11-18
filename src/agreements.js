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
// Agreements made after the winter phase carry through the next summer instead of expiring outside a window.
const nextWindowEnd = () => { const G = g(); return G.week <= 18 && G.winDone !== G.season ? F.absWeek() + (18 - G.week) + 1 : F.absWeek() + F.SEASON_WEEKS - G.week + 3; };
const reviewDate = by => { const year = Math.floor((by - 1) / F.SEASON_WEEKS) + 1, week = (by - 1) % F.SEASON_WEEKS + 1; return `week ${week}${year === g().season ? '' : `, season ${year}`}`; };

// make a position the DoF's priority for real: it feeds the recruitment plan the scouts and the pipeline use
F.recPrioritise = pos => { const G = g(); if (!G.rec || !pos) return; G.dofPrioAt = F.absWeek(); const pl = G.rec.plan; pl.prios = (pl.prios || []).filter(x => x.pos !== pos); pl.prios.unshift({ pos, kind: (pl.prios[0] || {}).kind || 'proven' }); pl.prios = pl.prios.slice(0, 3); pl.set = true; G.dofPrio = pos; };

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
    T.opts = [{ id: 'a_prio', t: `Make the ${posL(t.pos)} your priority`, fx: `Judged in ${reviewDate(nextWindowEnd())}` }, { id: 'a_you', t: 'Your call', fx: 'He decides, in his own way' }, { id: 'a_wait', t: 'It can wait', fx: 'No agreement' }];
    return true; }
  const t = T.topic; if (!t) return false;
  const ids = () => G.squad.filter(p => p.pos === t.pos).map(p => p.id), tb = F.transferBudget ? F.transferBudget() : 0;
  if (id === 'a_prio') {
    if (tb <= 0 && !winOpen() && G.week >= 17) { say('dof', P.ego >= 14 ? 'With what? There is no money and no window. Ask me in the summer.' : 'I would love to, but there is no money and the window is shut. I will look at loans in the summer.'); note('He says no: no money, no window'); T.opts = []; return true; }
    F.recPrioritise(t.pos); const a = agree('dof', 'pos', { pos: t.pos, base: ids(), why: t.why, t: `Find a ${posL(t.pos)}`, by0: tb });
    say('dof', P.risk >= 14 ? 'Good. I already have names.' : 'Fine. I will do it properly, not quickly.'); note(`Agreement: ${N} finds a ${posL(t.pos)} · judged in ${reviewDate(a.by)}`); T.opts = []; return true; }
  if (id === 'a_you') {
    if (P.risk >= 12 || P.amb >= 14) { F.recPrioritise(t.pos); const a = agree('dof', 'pos', { pos: t.pos, base: ids(), why: t.why, t: `Find a ${posL(t.pos)}`, own: 1, by0: tb }); say('dof', 'Then I will go after it.'); note(`His own call: ${N} goes for a ${posL(t.pos)} · judged in ${reviewDate(a.by)}`); }
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
H.seasonAfterMatch = o => { if (prevAfter) prevAfter(o); for (const a of open()) if (a.k === 'pos' && F.absWeek() >= a.by) judge(a); };

/* ================= THE EXECUTIVE INITIATIVE: the team is underperforming (CEO-2) =================
   OBSERVE (a signal from the real results) → INITIATE (the CEO calls the coach, the DoF and Finance in) → DISCUSS (three views
   from their expertise, character, the numbers and their track record) → AGREE (back the coach / a DoF plan with money / a joint
   review / wait) → EXECUTE (the head works through the real systems: coach confidence, recruitment priority and funds, scouts)
   → REVIEW (results AND the underlying numbers: worked, unlucky, lucky, failed, overtaken by events) → the CEO's verdict. */
const games = () => ((g().ft || {}).games || []);
// First-team history resets at season rollover; keep the actual match evidence on each CEO agreement.
const agreementGames = a => Array.isArray(a.matches) && a.matches.length ? a.matches : a.ms === g().season ? games().slice(a.n0 || 0) : [];
const agreementStats = a => stats(agreementGames(a));
function captureAgreementMatch(a, o) {
  if (!o || !o.result || a.lastObserved === F.absWeek()) return;
  if (!Array.isArray(a.matches)) {
    a.matches = a.ms === g().season ? games().slice(a.n0 || 0).map(x => ({ ...x })) : [];
    if (a.ms !== g().season) a.evidenceIncomplete = 1; // old cross-season save: prior-season results unavailable
  } else a.matches.push({ r: o.result, ug: o.ug, tg: o.tg, ux: +o.uxg.toFixed(2), tx: +o.txg.toFixed(2), season: g().season, week: g().week });
  a.lastObserved = F.absWeek();
}
function stats(arr) { const n = arr.length || 1, sum = k => arr.reduce((a, x) => a + (x[k] || 0), 0); return { n: arr.length, gf: sum('ug'), ga: sum('tg'), xgf: +(sum('ux') / n).toFixed(2), xga: +(sum('tx') / n).toFixed(2), ppg: +(arr.reduce((a, x) => a + (x.r === 'W' ? 3 : x.r === 'D' ? 1 : 0), 0) / n).toFixed(2) }; }
// OBSERVE: is there a real sporting problem? (last four league games)
function signal() {
  const G = g(); if (G.phase !== 'season' || !staff('coach')) return null; const L = games().slice(-4); if (L.length < 4) return null;
  const S = stats(L), exp = F.expectedRank ? F.expectedRank() : 10, pos = F.myPos();
  if (S.ga >= 7) return { k: 'defence', S, t: `${S.ga} goals conceded in four games`, area: ['CB', 'FB'] };
  if (S.gf <= 2) return { k: 'attack', S, t: `${S.gf} goal${S.gf === 1 ? '' : 's'} scored in four games`, area: ['ST', 'W', 'AM'] };
  if (S.ppg < 0.9 && pos > exp + 2) return { k: 'results', S, t: `${Math.round(S.ppg * 4)} points from four games`, area: ['CB', 'CM', 'ST'] };
  return null;
}
const iniOpen = () => open().find(a => a.k === 'ini');
// the weakest starter in the area, measured against the side's own level
function weakSpot(area) { const G = g(), xi = F.pickXI ? F.pickXI(false).xi.map(x => x.p) : G.squad, avg = xi.reduce((a, p) => a + p.ca, 0) / Math.max(1, xi.length);
  const best = pos => { const ps = G.squad.filter(p => p.pos === pos && !(p.inj > 0)).sort((a, b) => b.ca - a.ca); return ps[0] || null; };
  const rows = area.map(pos => ({ pos, p: best(pos) })).map(r => ({ ...r, gap: r.p ? r.p.ca - avg : -2 })).sort((a, b) => a.gap - b.gap); return rows[0]; }
function evidence(pos) { const R = g().rec; if (!R) return 0; return R.pipe.filter(x => R.pool[x.pid] && R.pool[x.pid].pos === pos && R.know[x.pid] && R.know[x.pid].conf !== 'low' && !['lost', 'signed'].includes(x.stage)).length; }
function record(owner) { const last = list().filter(a => a.k === 'ini' && a.owner === owner && a.res).slice(-1)[0]; return last ? last.res : null; }
// DISCUSS: three professional views, each from its own expertise
function views(sig) {
  const co = staff('coach'), dof = staff('dof'), fin = staff('fin'), S = sig.S, ws = weakSpot(sig.area), out = {};
  const structural = sig.k === 'defence' ? S.xga >= 1.5 : sig.k === 'attack' ? S.xgf <= 1.0 : S.xga - S.xgf >= 0.3, luck = sig.k === 'defence' ? S.ga - S.xga * S.n : S.xgf * S.n - S.gf;
  if (co) { const N = sur(co.name), prev = record('coach');
    out.coach = structural ? (co.p.ego >= 14 ? { rec: 'plan', t: `We lack quality ${sig.k === 'attack' ? 'up front' : 'at the back'}. I can only work with what I am given.` } : { rec: 'back', t: `The chances we give away are on me. Give me time to organise us properly.` })
      : { rec: 'back', t: luck >= 2 ? `We are ${sig.k === 'attack' ? 'missing chances we usually take' : 'conceding from almost nothing'}. That turns. Do not panic.` : 'The performances are better than the results. Keep faith.' };
    if (prev === 'worked' || prev === 'unlucky') out.coach.t += ' Last time you backed me, the numbers went the right way.'; if (prev === 'failed') out.coach.t += ' I know last time did not go well.'; out.coach.n = N; }
  if (dof) { const N = sur(dof.name), ev = evidence(ws.pos), weak = ws.gap < -0.3, prev = record('dof');
    out.dof = weak ? { rec: ev >= 1 || dof.p.risk >= 14 ? 'plan' : 'review', t: `Our ${posL(ws.pos)} is the weak link. ${ev >= 1 ? `I have ${ev} reliable option${ev === 1 ? '' : 's'} already.` : 'I have not seen enough to name anyone yet.'}` }
      : { rec: 'back', t: `The ${sig.k === 'attack' ? 'forwards' : 'defenders'} are good enough. The plan should not change after four bad games.` };
    if (prev === 'failed') out.dof.t += ' And I know I owe you one.'; out.dof.n = N; out.dof.pos = ws.pos; out.dof.weak = weak; }
  if (fin) { const tb = F.transferBudget ? F.transferBudget() : 0, run = F.finRunway ? F.finRunway() : null, N = sur(fin.name);
    out.fin = { n: N, tb, ok: tb > 0 && !(run != null && run <= 8), t: run != null && run <= 8 ? `We have about ${run} weeks of cash. Nothing new.` : tb > 0 ? `There is ${money(tb)} in the transfer budget. ${fin.p.risk >= 14 ? 'Use it if it fixes something.' : 'I would rather we kept some of it.'}` : 'There is no transfer money without savings elsewhere.' }; }
  return out;
}
// what Finance can expose from the protected reserve: real cash above the transfer budget, half of it at most, none when cash is short
function reserveOffer(V) { return V && V.fin && V.dof ? liveOffer() : 0; }
// THE one place an exposure of the protected reserve is priced, for every route, always from current figures:
// cash above the transfer budget, minus exceptions already granted and bids already on the table; 40% of that at most; none when cash is short
function liveOffer() { if (!staff('fin') || !staff('dof')) return 0; const run = F.finRunway ? F.finRunway() : null; if (run != null && run <= 10) return 0;
  const head = g().club.cash - (F.transferBudget ? F.transferBudget() : 0) - authLeft() - (F.recCommitted ? F.recCommitted() : 0); return head > 0 ? Math.round(head * 0.4 / 100) * 100 : 0; }
const authLeft = () => open().filter(a => a.kind === 'plan' && a.funds && !a.done).reduce((t, a) => t + Math.max(0, a.funds - (a.used || 0)), 0);
// why the scouts come back empty: the price (budget) or the rules (age, wage); read from the real market
function marketWhy(pos) { const G = g(), R = G.rec; if (!R) return 'nobody available'; const t = G.club.tier, ma = +F.man('dof', 'maxAge'), wl = F.recView ? F.recView().wageLimit : Infinity, budget = (F.transferBudget ? F.transferBudget() : 0) + (F.recExtraAuth ? F.recExtraAuth({ pos }) : 0);
  const near = Object.values(R.pool).filter(p => p.pos === pos && Math.abs(p.inTier - t) <= 1), rules = near.filter(p => p.age <= ma && p.wageAsk <= wl * 1.15), cheap = rules.filter(p => !p.club || p.ask * 0.8 <= budget);
  return !rules.length ? 'nobody within the age and wage limits' : !cheap.length ? `nobody we can afford with ${money(budget)}` : 'nobody good enough at a price we can pay'; }
function iniAgree(kind, sig, V, extra) {
  const G = g(), now = F.absWeek(), base = { S0: sig.S, sk: sig.k, st: sig.t, mw: G.week, ms: G.season, made: now, k: 'ini', kind, log: [], n0: games().length, matches: [] };
  if (kind === 'back') return Object.assign(base, { id: F.uid(), owner: 'coach', t: `Turn it round with this squad`, by: now + 5, agreedBy: V.coach && V.coach.rec === 'back' });
  if (kind === 'plan') return Object.assign(base, { id: F.uid(), owner: 'dof', pos: V.dof.pos, base: G.squad.map(p => p.id), t: `Fix the ${posL(V.dof.pos)} position`, by: nextWindowEnd(), funds: extra || 0, agreedBy: V.dof.rec !== 'back', ordered: !!(V.dof && V.dof.rec === 'back') });
  return Object.assign(base, { id: F.uid(), owner: 'dof', with: 'coach', t: 'Coach and DoF: one plan', by: now + 2, joint: 1 });
}
function startIni(a, V) {
  const G = g(), co = staff('coach'); list().push(a);
  if (a.kind === 'back' && co) { co.boost = clamp(co.boost + 2, -10, 12); co.boostW = Math.max(co.boostW || 0, 4); co.rel = clamp(co.rel + 2, 0, 100); }
  if (a.kind === 'plan') { a.ev = { gap: V.dof ? +(weakSpot([a.pos]).gap).toFixed(2) : 0, rep: evidence(a.pos), dofRec: V.dof ? V.dof.rec : null, coRec: V.coach ? V.coach.rec : null, tb: V.fin ? V.fin.tb : 0 }; a.work = { reports: 0, tries: 0, window: 0 }; if (a.funds) { const f = staff('fin'); if (f && V.fin && f.p.risk < 14) f.rel = clamp(f.rel - 2, 0, 100); } if (co && V.coach && V.coach.rec === 'back') co.rel = clamp(co.rel - 1, 0, 100); }
  if (a.kind === 'back') a.ev = { coRec: V.coach ? V.coach.rec : null, dofRec: V.dof ? V.dof.rec : null };
  // a joint review is an investigation: no priority, no money, no change of policy until the CEO decides
  G.iniSeen = F.absWeek();
}

/* the conversation: called from talks.js on the DoF's desk; the coach and Finance are in the room */
const prevTopics = F.agrTopics;
F.agrTopics = role => { if (F.PARK.agr) return []; const t = prevTopics ? prevTopics(role) : []; if (role !== 'dof' || iniOpen() || !staff('coach') || games().length < 4) return t; return [{ id: 't_form', t: signal() ? 'The team: what is going wrong?' : 'How is the team really doing?', fx: 'Coach, DoF and Finance' }].concat(t); };
const prevAnswer = F.agrAnswer;
F.agrAnswer = (id, T, say, note) => {
  if (!/^(t_form|i_)/.test(id)) return prevAnswer ? prevAnswer(id, T, say, note) : false;
  const G = g();
  if (id === 't_form') { const sig = signal();
    if (!sig) { const S = stats(games().slice(-4)), co = staff('coach'); say('coach', `${S.gf} scored, ${S.ga} conceded in four. ${S.ppg >= 1.8 ? 'We are flying. I would not change a thing.' : 'Nothing that worries me.'}`); say('dof', 'Nothing in the numbers that needs a decision. If you want to plan ahead, ask me where we are short.'); T.opts = []; return true; }
    const V = views(sig); T.ini = { sig, V };
    say('dof', `${sig.t[0].toUpperCase() + sig.t.slice(1)}. I asked ${V.coach ? V.coach.n : 'the coach'}${V.fin ? ' and ' + V.fin.n : ''} to join us.`);
    if (V.coach) say('coach', V.coach.t); if (V.dof) say('dof', V.dof.t); if (V.fin) say('fin', V.fin.t);
    const funds = reserveOffer(V);
    T.opts = [{ id: 'i_back', t: `Back ${V.coach ? V.coach.n : 'the coach'} with this squad`, fx: 'Judged after five games' },
      V.dof ? { id: 'i_plan', t: `${V.dof.n} fixes the ${posL(V.dof.pos)} position`, fx: `Within his ${money(V.fin ? V.fin.tb : 0)} budget · judged after the window` } : null,
      V.dof && funds ? { id: 'i_plan_r', t: `…and allow up to ${money(funds)} from the reserve`, fx: `Less cash cover · ${V.fin && staff('fin').p.risk < 14 ? 'Finance ↓' : 'Finance agrees'}` } : null,
      V.dof && V.coach ? { id: 'i_joint', t: 'Both of you: one plan in two weeks', fx: 'An investigation: nothing changes until you decide' } : null,
      { id: 'i_wait', t: 'Wait for more evidence', fx: 'No change' }].filter(Boolean);
    T.funds = funds; return true; }
  const I = T.ini; if (!I) return false; const { sig, V } = I;
  if (id === 'i_plan' && V.dof && V.dof.rec === 'back' && !T.pushed && staff('dof').p.ego >= 14) { T.pushed = 1; say('dof', 'I will not sign a player I do not believe we need. If you want it, it is your call, not mine.'); T.opts = [{ id: 'i_order', t: 'It is my call. Do it.', fx: 'He carries it out; the decision is yours' }, { id: 'i_back', t: `Then we back ${V.coach ? V.coach.n : 'the coach'}`, fx: 'Judged after five games' }, { id: 'i_wait', t: 'Wait for more evidence', fx: 'No change' }]; return true; }
  if (id === 'i_plan_r') { T.useFunds = 1; id = 'i_plan'; }
  if (id === 'i_plan' || id === 'i_order') { const a = iniAgree('plan', sig, V, T.useFunds ? T.funds : 0); if (id === 'i_order') a.ordered = 1; startIni(a, V); say('dof', id === 'i_order' ? 'Understood. It goes on the record as your decision.' : staff('dof').p.risk >= 14 ? 'Good. I will move quickly.' : 'I will do it properly. Expect a recommendation before the window.'); note(`Agreement: ${a.t} · ${a.funds ? money(a.funds) + ' extra · ' : ''}judged in ${reviewDate(a.by)}`); T.opts = []; return true; }
  if (id === 'i_back') { const a = iniAgree('back', sig, V); startIni(a, V); say('coach', staff('coach').p.ego >= 14 ? 'Good. Now let me work.' : 'Thank you. I will not waste it.'); if (V.dof && V.dof.rec === 'plan') say('dof', 'For the record, I would have strengthened.'); note(`Agreement: ${a.t} · judged in ${reviewDate(a.by)}`); T.opts = []; return true; }
  if (id === 'i_joint') { const a = iniAgree('joint', sig, V); startIni(a, V); say('dof', 'We will sit down this week. You will have one recommendation from both of us.'); note(`Joint review · back to you in week ${G.week + 2}`); T.opts = []; return true; }
  if (id === 'i_wait') { G.iniSeen = F.absWeek(); say('coach', 'Fine by me.'); if (V.dof && V.dof.rec === 'plan') say('dof', 'Then we lose time. Your decision.'); note('No change. You keep watching.'); T.opts = []; return true; }
  return false;
};

/* EXECUTE: every week the owner works through the real systems; the log is what actually happened */
function execute(a) {
  const G = g(), S = agreementStats(a), wk = G.week;
  if (a.kind === 'back') a.log.push({ w: wk, t: `${S.n} game${S.n === 1 ? '' : 's'}: ${Math.round(S.ppg * S.n)} pts, ${S.ga} conceded, xG against ${S.xga} a game (was ${a.S0.xga}).` });
  if (a.kind === 'plan') { const R = G.rec || { pipe: [], pool: {} }, ev = evidence(a.pos), inn = G.squad.filter(p => p.pos === a.pos && !a.base.includes(p.id)); a.work = a.work || { reports: 0, tries: 0, window: 0 }; a.work.reports = Math.max(a.work.reports, ev); a.work.tries = Math.max(a.work.tries, R.pipe.filter(x => R.pool[x.pid] && R.pool[x.pid].pos === a.pos && ['approach', 'negotiating'].includes(x.stage) || (x.stage === 'lost' && x.since >= a.made && (R.pool[x.pid] || {}).pos === a.pos)).length); if (winOpen()) a.work.window = 1; if ([staff('scout')].concat(R.scouts || []).some(x => x && x.assign && x.assign.pos === a.pos)) a.work.scoutW = (a.work.scoutW || 0) + 1; a.log.push({ w: wk, t: inn.length ? `${inn[0].name} signed as ${posL(a.pos)}.` : `Scouts on it ${a.work.scoutW || 0} week${a.work.scoutW === 1 ? '' : 's'}; ${ev} reliable report${ev === 1 ? '' : 's'} on a ${posL(a.pos)}${!ev && (a.work.scoutW || 0) >= 3 ? ', ' + (a.work.why = marketWhy(a.pos)) : ''}. ${winOpen() ? 'The window is open.' : 'Waiting for the window.'}` }); if (inn.length && !a.done) { a.done = 1; a.inn = inn[0].name; } }
  if (a.kind === 'joint' && F.absWeek() >= a.by) { // the joint recommendation follows the strongest evidence now
    const sig = signal(), now = sig || { S: stats(games().slice(-4)), k: a.sk, area: a.sk === 'attack' ? ['ST', 'W', 'AM'] : ['CB', 'FB'] }, V = views(Object.assign({}, now, { t: a.st }));
    const recP = V.dof && V.dof.weak && V.coach && V.coach.rec === 'plan', recB = !sig || (V.coach && V.coach.rec === 'back' && !(V.dof && V.dof.weak));
    a.res = 'merged'; a.out = recP ? 'They agree: strengthen.' : recB ? 'They agree: the squad is good enough.' : 'They still disagree.';
    F.queueEvent('ini_joint', { rec: recP ? 'plan' : recB ? 'back' : 'split', pos: V.dof ? V.dof.pos : null, sk: a.sk, st: a.st, cv: V.coach ? V.coach.t : '', dv: V.dof ? V.dof.t : '', cn: V.coach ? V.coach.n : '', dn: V.dof ? V.dof.n : '' });
  }
}
/* REVIEW: three questions kept apart, so a head is judged on his own part.
   Decision: was the approach reasonable on what was known at the start (recorded then, not judged with hindsight)?
   Execution: did the owner do the work in his control (DoF: reports, attempts, a signing; coach: the chances made and allowed)?
   Outcome: did results improve, and did the numbers underneath agree (or was it luck)? Plus who decided, and what blocked it. */
function assess(a) {
  const G = g(), S = agreementStats(a), b = a.S0, att = a.sk === 'attack', ev = a.ev || {};
  const better = !!S.n && (S.ppg >= b.ppg + 0.4 || (att ? S.gf / S.n >= b.gf / b.n + 0.5 : S.ga / S.n <= b.ga / b.n - 0.5));
  const under = !!S.n && (att ? S.xgf >= b.xgf + 0.25 : S.xga <= b.xga - 0.25), worse = !!S.n && (att ? S.xgf <= b.xgf - 0.25 : S.xga >= b.xga + 0.25);
  const outcome = better && under ? 'better' : better ? 'better, but the numbers underneath did not move: it may be luck' : under ? 'results no better, though the numbers underneath improved' : 'no improvement';
  let decision, exec, execK, who;
  if (a.kind === 'plan') {
    decision = a.ordered ? `Your decision, against ${sur((staff('dof') || {}).name || 'his')}'s advice.` : ev.gap < -0.3 ? `Sound: the ${posL(a.pos)} was the weakest starter when it was agreed${ev.rep ? `, with ${ev.rep} reliable report${ev.rep === 1 ? '' : 's'}` : ''}.` : `Debatable: the ${posL(a.pos)} was not clearly the weak link when it was agreed.`;
    const w = a.work || {}, auth = (F.transferBudget ? F.transferBudget() : 0) + (F.recExtraAuth ? F.recExtraAuth({ pos: a.pos }) : 0);
    if (a.done) { execK = 'delivered'; exec = `Delivered: ${a.inn} signed.`; }
    else if (!w.window) { execK = 'blocked'; exec = 'Blocked: the window never opened in time.'; }
    else if (auth <= 0 && !(ev.tb > 0) && !a.funds) { execK = 'blocked'; exec = 'Blocked: there was no money to spend.'; }
    else if (!w.reports && !w.tries && (w.scoutW || 0) >= 3) { execK = 'tried'; exec = `Searched, found nobody: scouts on it ${w.scoutW} weeks, ${w.why || 'nobody who fits'}. ${/afford/.test(w.why || '') ? 'The money' : 'The mandate'}, not the effort, held it back.`; }
    else if (w.tries > 0 || w.reports > 0) { execK = 'tried'; exec = `Worked on it: ${w.reports} reliable report${w.reports === 1 ? '' : 's'}, ${w.tries} approach${w.tries === 1 ? '' : 'es'}, no signing.`; }
    else { execK = 'idle'; exec = 'Not delivered: no reliable reports, no approaches.'; }
    who = a.ordered ? 'you' : 'dof';
  } else {
    decision = ev.coRec === 'back' ? 'Sound: the coach asked for time and his reading of the numbers supported it.' : `Your call: ${ev.dofRec === 'plan' ? 'the DoF wanted to strengthen instead' : 'the coach himself wanted reinforcements'}.`;
    execK = under ? 'improved' : worse ? 'worse' : 'flat'; exec = under ? `The coach improved what he controls: xG ${att ? 'for' : 'against'} ${att ? S.xgf : S.xga} a game, from ${att ? b.xgf : b.xga}.` : worse ? 'The chances made and allowed got worse under him.' : 'The chances made and allowed hardly changed.';
    who = ev.coRec === 'back' ? 'coach' : 'you';
  }
  const k = a.kind === 'plan' ? (execK === 'delivered' ? (better ? 'worked' : 'delivered') : execK === 'blocked' ? 'blocked' : better ? 'overtaken' : execK === 'tried' ? 'not delivered' : 'failed')
    : (execK === 'improved' ? (better ? 'worked' : 'unlucky') : better ? 'lucky' : 'failed');
  return { S, k, execK, decision, exec, outcome: `Outcome: ${outcome} (${S.n} games, ${Math.round(S.ppg * S.n)} pts, ${S.gf}–${S.ga}; xG ${S.xgf} for and ${S.xga} against a game, before ${b.xgf} and ${b.xga}).`, who };
}
const KT = { worked: 'Worked', delivered: 'Delivered, results did not follow', unlucky: 'Unlucky', lucky: 'Lucky', failed: 'Failed', 'not delivered': 'Not delivered', blocked: 'Blocked', overtaken: 'Overtaken by events' };
function review(a) {
  const G = g(), v = assess(a), s = staff(a.owner), N = s ? sur(s.name) : 'He'; a.res = v.k; a.S1 = v.S; a.ex = { decision: v.decision, exec: v.exec, outcome: v.outcome, who: v.who, execK: v.execK };
  a.out = `${v.decision} ${v.exec} ${v.outcome}`;
  // the head answers for his own part: execution, not the scoreline; a decision the CEO ordered is the CEO's
  if (s) { const d = { delivered: [3, 4], improved: [2, 3], tried: [0, 0], flat: [0, -1], blocked: [0, 0], idle: [-2, -4], worse: [-2, -3] }[v.execK] || [0, 0]; s.rel = clamp(s.rel + d[0], 0, 100); s.perf = clamp((s.perf || 50) + d[1], 0, 100); }
  if (G.paper) G.paper.stories.push({ h: `${N}'s plan: ${KT[v.k].toLowerCase()}`, t: `${a.t}, agreed in week ${a.mw}. ${v.exec}` });
  if (F.deskNote) F.deskNote(a.owner, `Agreement: ${a.t.toLowerCase()}`, `${KT[v.k]}. ${v.exec}`, ['idle', 'worse'].includes(v.execK) ? 1 : 0);
  F.queueEvent('ini_review', { id: a.id, owner: a.owner, t: a.t, k: v.k, execK: v.execK, out: a.out, ordered: a.ordered ? 1 : 0, mw: a.mw });
}
const prevAfter2 = H.seasonAfterMatch;
H.seasonAfterMatch = o => { if (prevAfter2) prevAfter2(o); for (const a of list().filter(a => a.k === 'ini' && !a.res)) { captureAgreementMatch(a, o); execute(a); if (!a.res && F.absWeek() >= a.by) review(a); } };

/* the two follow-ups the CEO answers: the joint recommendation, and the review of the agreement */
const E = F.defineEvent;
// accepting the joint recommendation: the same rules as the direct route; reserve money only if the CEO says so, priced now
function jointPlan(c, reserve) { const sig = signal() || { S: stats(games().slice(-4)), k: c.sk, t: c.st, area: ['CB', 'FB'] }, V = views(sig); if (!V.dof) return 'There is no DoF.'; V.dof.pos = c.pos || V.dof.pos;
  const offer = reserve ? liveOffer() : 0, a = iniAgree('plan', sig, V, offer); startIni(a, V); return reserve && !offer ? `Finance has nothing to expose now. ${c.dn} works within the budget.` : `${c.dn} has the job${offer ? `, with up to ${money(offer)} from the reserve for this position` : ''}.`; }
E('ini_joint', { forced: 1, from: 'dof', dept: 'sporting', ceo: 1, cd: 1, why: 'You asked the coach and the DoF for one plan.',
  title: c => c.rec === 'split' ? 'Coach and DoF still disagree' : `Coach and DoF: ${c.rec === 'plan' ? 'strengthen' : 'stay the course'}`,
  body: c => `${c.cn}: "${c.cv}" ${c.dn}: "${c.dv}"`,
  opts: [{ l: c => `Back ${c.cn} with this squad`, h: 'Judged after five games', f: c => { const sig = signal() || { S: stats(games().slice(-4)), k: c.sk, t: c.st, area: ['CB', 'FB'] }, V = views(sig); startIni(iniAgree('back', sig, V), V); return `${c.cn} gets his five games.`; } },
    { l: c => `${c.dn} fixes the ${posL(c.pos || 'CB')} position, within budget`, h: () => `Ordinary budget ${money(F.transferBudget ? F.transferBudget() : 0)} · judged after the window`, f: c => jointPlan(c, false) },
    { l: () => liveOffer() ? `…and allow up to ${money(liveOffer())} from the reserve` : '…and expose part of the reserve', h: () => liveOffer() ? 'Less cash cover · only for this position · Finance ↓' : 'Finance: there is no reserve to expose right now', f: c => jointPlan(c, true) },
    { l: 'Leave it as it is', h: 'No change', f: () => { g().iniSeen = F.absWeek(); return 'Nothing changes. You keep watching.'; } }],
  auto: () => 3 }); // unanswered, nothing changes: an investigation never authorises itself
E('ini_review', { forced: 1, from: 'board', dept: 'board', ceo: 1, cd: 1, why: 'An agreement you made has reached its review week.',
  title: c => `Review: ${c.t.toLowerCase()}`, body: c => c.out,
  opts: [{ l: 'Credit him', h: 'Trust ↑ · he remembers', f: c => { const s = staff(c.owner); if (s) { s.rel = clamp(s.rel + (['idle', 'worse'].includes(c.execK) ? 0 : 3), 0, 100); } const a = list().find(x => x.id === c.id); if (a) a.ceo = 'credit'; return ['idle', 'worse'].includes(c.execK) ? 'You credit him anyway. He knows he did not deliver.' : 'You make a point of it in the staff meeting.'; } },
    { l: 'Hold him responsible', h: 'Trust ↓ · performance noted', f: c => { const s = staff(c.owner); if (s) { const fair = ['idle', 'worse'].includes(c.execK); s.rel = clamp(s.rel - (c.ordered ? 6 : fair ? 2 : 5), 0, 100); s.perf = clamp((s.perf || 50) - (fair ? 3 : 0), 0, 100); } const a = list().find(x => x.id === c.id); if (a) a.ceo = 'blame'; return c.ordered ? 'He reminds you it was your decision. He is not wrong.' : ['delivered', 'improved', 'blocked'].includes(c.execK) ? 'He thinks that is unfair. He did his part.' : 'He takes it.'; } },
    { l: 'Circumstances. Move on', h: 'No judgement', f: c => { const a = list().find(x => x.id === c.id); if (a) a.ceo = 'none'; return 'Filed. The season moves on.'; } }],
  auto: () => 2 });

// the positions the DoF is working on for the CEO: active agreements (and a recent priority note); read by the rolling squad plan
F.agrPrios = () => { const G = g(), out = []; for (const a of open()) if ((a.k === 'pos' || a.kind === 'plan') && !a.done && a.pos && !out.some(x => x.pos === a.pos)) out.push({ pos: a.pos, why: `${a.ordered ? 'Ordered by' : 'Agreed with'} the CEO in week ${a.mw}` });
  if (G.dofPrio && G.dofPrioAt != null && F.absWeek() - G.dofPrioAt < 8 && !out.some(x => x.pos === G.dofPrio)) out.push({ pos: G.dofPrio, why: `The CEO's priority since week ${G.week - (F.absWeek() - G.dofPrioAt)}` }); return out.slice(0, 2); };
// exceptional spending authority from the reserve, while the agreement runs and nobody has been signed for it
F.agrAuth = () => authLeft(); // total still authorised (each agreement its own remainder; never summed into one pot for any deal)
F.agrAuthFor = pos => open().filter(a => a.kind === 'plan' && a.funds && !a.done && a.pos === pos).reduce((t, a) => t + Math.max(0, a.funds - (a.used || 0)), 0);
F.agrAuthList = () => open().filter(a => a.kind === 'plan' && a.funds && !a.done).map(a => ({ pos: a.pos, amt: Math.max(0, a.funds - (a.used || 0)), t: a.t, mw: a.mw }));
// a signing at that position draws on its exception only for the part above the ordinary budget; the rest is released when the agreement ends
F.agrUse = (pos, over, name) => { let remaining = Math.max(0, over); for (const a of open().filter(a => a.kind === 'plan' && !a.done && a.pos === pos)) { const u = Math.min(remaining, Math.max(0, (a.funds || 0) - (a.used || 0))); a.used = (a.used || 0) + u; remaining -= u; a.done = 1; a.inn = name; (a.log = a.log || []).push({ w: g().week, t: `${name} signed${u ? `, using ${money(u)} of the ${money(a.funds)} from the reserve` : ' within the ordinary budget; the reserve was not touched'}.` }); } };
F.iniSignal = () => F.PARK.ini ? null : (iniOpen() || (g().iniSeen != null && F.absWeek() - g().iniSeen < 3)) ? null : signal();
F.iniActive = iniOpen;

// what is still running and what was decided lately (for the desk and the department Record)
F.agrRunning = () => open().filter(a => a.k !== 'traj').map(a => { const s = staff(a.owner), last = (a.log || []).slice(-1)[0]; return { ic: a.k === 'ini' ? (a.owner === 'coach' ? 'trust' : 'scout') : 'scout', t: `${s ? sur(s.name) : 'The DoF'}: ${a.t.toLowerCase()}`, s: `${last ? last.t + ' ' : ''}${a.own ? 'His own call' : a.ordered ? 'Your decision' : 'Agreed with you'} in week ${a.mw}. ${a.joint ? 'Back to you' : 'Judged'} in ${reviewDate(a.by)}.`, role: a.owner }; });
F.agrRecent = () => list().filter(a => a.res && F.absWeek() - a.by <= 1);
F.agrList = list;
})(FO);
