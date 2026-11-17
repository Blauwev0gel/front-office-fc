/* The Front Office · the pathway question
   One governance storyline, built to show the core loop: you notice a problem, talk to the people
   responsible, weigh it up, agree a direction, and find out later what it caused.

   The club wants a youngster to come through. The coach fears dropped points. The DoF sees an
   experienced signing. It only starts when the squad, the table and the money make it a real dilemma.

   Week 0  signal: the academy reports the boy is close; the DoF has a veteran in mind.
   Week 1  meeting: three standpoints from the actual state and personalities; ask follow-ups for free;
           agree one of three routes. Leave it and the staff follow the mandates.
   Weeks 2-5 the staff carry it out on their own (selection, signing, mentoring), with a weekly log.
   Week ~6 evaluation through four lenses: was the policy right, was it carried out,
           did circumstances change, how much was luck. Then keep, adjust openly, or drop.
   Every effect on the club's credibility is logged with its cause. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, chance, staff, money, M, man, tierAvg, POS_L } = F;
const nm = r => { const s = staff(r); return s ? s.name : 'Nobody'; };
const first = r => nm(r).split(' ')[0];
const bk = (k, d) => { if (F.backerAdd) F.backerAdd(k, d); }; /* shown scale, see loop.js */
const rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const sq = () => g().squad;
const P = () => g().pw;
const findP = id => sq().find(p => p.id === id) || g().academy.find(p => p.id === id) || null;

/* ---------- youth credibility: behaviour, not intention ---------- */
function cred() { const G = g(); G.cred = G.cred || { youth: 50, log: [] }; return G.cred; }
function credAdd(d, t, key) { const C = cred(); if (key && C.log.some(l => l.key === key)) return; C.youth = clamp(C.youth + d, 0, 100); C.log.unshift({ s: g().season, w: g().week, d, t, key: key || null }); C.log = C.log.slice(0, 20); }

/* ---------- start conditions ---------- */
function blocker(t) { // the weakest regular starter in his position: the one he would replace
  const xi = (g().ft && g().ft.xiPrev) || [];
  const starters = sq().filter(p => p.pos === t.pos && p.id !== t.id && !p.inj && xi.includes(p.id)).sort((a, b) => a.ca - b.ca);
  return starters[0] || sq().filter(p => p.pos === t.pos && p.id !== t.id && !p.inj).sort((a, b) => b.ca - a.ca)[0] || null;
}
// a youngster who does not play yet, behind a starter who is better today: that is the question
function subject() {
  const G = g(), ta = tierAvg(G.club.tier), xi = (G.ft && G.ft.xiPrev) || [];
  const pool = sq().filter(p => p.age <= 20 && p.academy && !p.loan).concat(G.academy.filter(p => p.age >= 17));
  const ok = pool.filter(p => p.pa >= ta + 1.2 && p.ca >= ta - 2.2 && !p.inj && !xi.includes(p.id)).sort((a, b) => (b.pa + b.ca) - (a.pa + a.ca));
  for (const t of ok) { const b = blocker(t); if (b && b.ca >= t.ca + 0.3) return { t, b }; }
  return null;
}
function dilemma() {
  const G = g(); if (G.phase !== 'season' || G.week < 4 || G.week > 24) return null;
  if (!staff('coach') || !staff('dof') || !staff('acad')) return null;
  if (P() && P().stage !== 'closed') return null;
  if ((G.pwLog || []).some(x => x.s === G.season)) return null;
  const pair = subject(); if (!pair) return null; const { t, b } = pair;
  const tgt = (G.board.obj.find(o => o.k === 'league') || {}).target || 10, pos = F.myPos();
  const race = pos <= tgt + 2; // points matter now
  const room = (G.club.kitty || 0) + Math.max(0, G.club.cash) * 0.2 >= M(2500); // a signing is possible
  if (!race && !room) return null;
  return { t, b, race, room };
}

/* ---------- standpoints from state and personality ---------- */
function stances(c) {
  const t = findP(c.tid), b = findP(c.bid), co = staff('coach'), ac = staff('acad'), df = staff('dof');
  const gap = t && b ? b.ca - t.ca : 1, pref = co && co.pref ? co.pref.youthMins : 50;
  const coachRisk = gap > 1.2 ? 'large' : gap > 0.5 ? 'moderate' : 'small';
  return {
    acad: ac ? (ac.p.amb > 13 ? `"${t ? t.name.split(' ')[0] : 'He'} is the best we have produced. If he does not play now, he will want to leave."` : `"He is ready for minutes. Not every week, but regular minutes, with someone looking after him."`) : null,
    coach: co ? (pref < 45 || co.p.ego > 14 ? `"I am judged on points. ${b ? b.name.split(' ')[0] : 'My regular'} is better today. The gap is ${coachRisk}."` : `"I like the boy. But we are ${F.ord(F.myPos())}; a mistake from a youngster costs points. The gap is ${coachRisk}."`) : null,
    dof: df ? (df.p.risk > 13 ? `"I have an experienced ${POS_L[t ? t.pos : 'CM'].toLowerCase()} lined up. Proven, available, and the boy can wait a season."` : `"There is a solid veteran available. It is an option, not a must. It depends on what the club wants to be."`) : null,
    coachRisk };
}
// follow-up questions: free, and the answer depends on the person's openness (relationship) and the facts
const QUESTIONS = {
  coach: { q: 'How many points could it cost?', a: c => { const co = staff('coach'), t = findP(c.tid), b = findP(c.bid); if (!co || !t || !b) return 'He is not in a position to say.'; const gap = b.ca - t.ca, open = co.rel >= 45; const est = gap > 1.2 ? 'a few points over six weeks' : gap > 0.5 ? 'maybe a point or two' : 'hardly any'; return open ? `"Honestly? ${est}. Youngsters make mistakes, but they also run more."` : `"Enough to matter." He does not want to put a number on it.`; } },
  acad: { q: 'Is he ready, physically and mentally?', a: c => { const t = findP(c.tid), ac = staff('acad'); if (!t || !ac) return 'Nobody can say.'; const prof = t.pers ? t.pers.prof : 10, phys = t.a ? (t.a.str + t.a.sta) / 2 : 10; return `"His attitude is ${prof >= 13 ? 'excellent' : prof >= 9 ? 'good' : 'still a work in progress'}. Physically he is ${phys >= 11 ? 'ready for men\'s football' : 'still a bit light'}."${ac.p.amb > 13 ? ' He clearly wants this to happen.' : ''}`; } },
  dof: { q: 'What would the veteran cost, and for how long?', a: c => { const df = staff('dof'); if (!df) return 'There is no one to ask.'; return `"Around ${money(c.vFee)} plus ${money(c.vWage)} a week, on a ${c.vYears}-year deal. ${(g().club.kitty || 0) >= c.vFee ? 'It fits the kitty.' : 'It would stretch the budget; a loan is the fallback.'}"`; } } };

/* ---------- routes ---------- */
const ROUTES = {
  youth: { t: 'Youth first, accept the sporting risk', s: 'The youngster gets regular minutes. No veteran. The academy mentors him.', owner: 'coach', ind: [['mins', 'He starts at least half of the league games'], ['ppg', 'Points per game stay within half a point of before']], obj: c => (stances(c).coachRisk !== 'small' || (staff('coach') && staff('coach').pref && staff('coach').pref.youthMins < 45)) ? [`${first('coach')} fears the points this costs.`] : [] },
  exp: { t: 'Sign experience, agree another pathway', s: 'The DoF signs the veteran within budget. The youngster trains with the first team and plays cup games; a loan is considered in the summer.', owner: 'dof', ind: [['sign', 'The veteran is signed within the agreed limit'], ['dev', 'The youngster keeps developing']], obj: c => [`${first('acad')} thinks the boy will feel passed over.`] },
  phase: { t: 'Phase it in, evaluate after five weeks', s: 'Cup games and part of the league games now; the veteran is on hold. A clear evaluation decides the next step.', owner: 'coach', ind: [['mins', 'He plays in at least a third of the games'], ['ppg', 'Points per game stay within half a point of before']], obj: c => staff('dof') && staff('dof').p.risk > 13 ? [`${first('dof')} warns the veteran may not wait.`] : [] } };
const ROUTE_K = ['youth', 'exp', 'phase'];

/* ---------- stage: start ---------- */
function start(force) {
  const G = g(); const D = force ? (() => { const x = subject(); return x ? { ...x, race: true, room: true } : null; })() : dilemma(); if (!D) return false;
  const { t, b } = D, ageV = 29 + Math.floor(F.rnd() * 4);
  const v = F.genPlayer({ pos: t.pos, age: ageV, ca: Math.max(b.ca, t.ca) + 0.3, region: 'dom' });
  v.fee = Math.round(Math.max(M(1500), v.value * 0.8) / 100) * 100; v.wage = Math.round(F.wageFor(v.ca) * 1.1 / 5) * 5;
  G.pw = { stage: 'signal', s: G.season, w0: F.absWeek(), tid: t.id, tname: t.name, tpos: t.pos, bid: b.id, bname: b.name, race: D.race, room: D.room,
    vet: v, vFee: v.fee, vWage: v.wage, vYears: 2, asked: {}, log: [], ppg0: ppgNow(), ca0: t.ca, coachId: staff('coach').id, dofId: staff('dof').id, acadId: staff('acad').id };
  F.queueEvent('pw_signal', { pw: 1 });
  return true;
}
function ppgNow() { const f = (g().form || []).slice(-6); if (!f.length) return 1.3; return f.reduce((a, r) => a + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0) / f.length; }

/* ---------- messages ---------- */
F.defineEvent('pw_signal', { forced: 1, ceo: 1, from: 'acad', dept: 'academy', cd: 1, w: () => 0,
  why: () => 'Three departments see the same player differently. A policy question, not a selection question.',
  setup: () => null,
  title: () => { const p = P(); return p ? `${p.tname} is knocking on the door` : 'A youngster is knocking on the door'; },
  body: () => { const p = P(); if (!p) return 'The moment has passed.'; const t = findP(p.tid); return `${first('acad')}: "${p.tname} (${t ? t.age : 18}, ${POS_L[p.tpos].toLowerCase()}) is close to first-team level." ${first('coach')} is wary in a ${p.race ? 'tight league position' : 'season that still matters'}, and ${first('dof')} has an experienced ${POS_L[p.tpos].toLowerCase()} in mind.`; },
  opts: [
    { l: 'Call a meeting with all three', h: 'Next week · free to talk', f: () => { const p = P(); if (!p) return 'The moment has passed.'; p.stage = 'meet'; F.queueEvent('pw_meet', { pw: 1 }); return 'The meeting is in the diary for next week.'; } },
    { l: 'Ask for more data first', h: 'Meeting in two weeks', f: () => { const p = P(); if (!p) return 'The moment has passed.'; p.stage = 'data'; p.meetAt = F.absWeek() + 2; return 'The academy will send match data and a development report.'; } },
    { l: 'Let the staff sort it out', h: 'They follow your mandates', f: () => { const p = P(); if (!p) return ''; agree(mandateRoute(), true); return 'The staff will settle it within the mandates you gave them.'; } }],
  auto: () => 0, vacant: 0 });

F.defineEvent('pw_meet', { forced: 1, ceo: 1, from: 'coach', dept: 'sporting', cd: 1, w: () => 0,
  why: () => 'The academy, the coach and the DoF disagree. Agree a direction; the staff decide the details.',
  setup: () => null,
  title: () => { const p = P(); return p ? `The ${p.tname} meeting` : 'The pathway meeting'; },
  body: () => 'Three people, one table. Ask what you need to know, then agree a direction.',
  opts: ROUTE_K.map(k => ({ l: ROUTES[k].t, h: () => routeHint(k), f: () => agree(k, false) })),
  auto: () => ROUTE_K.indexOf(mandateRoute()), vacant: 2 });

F.defineEvent('pw_eval', { forced: 1, ceo: 1, from: 'coach', dept: 'sporting', cd: 1, w: () => 0,
  why: () => 'The agreed evaluation date. Judge the decision, the execution and the circumstances separately.',
  setup: () => null,
  title: () => { const p = P(); return p ? `Evaluation: ${p.tname}` : 'Evaluation'; },
  body: () => { const p = P(); return p && p.ev ? p.ev.summary : 'The evaluation is ready.'; },
  opts: [
    { l: () => { const p = P(); return p && p.kept ? 'Conclude the agreement' : 'Keep the agreement'; }, h: () => { const p = P(); return p && p.kept ? 'It becomes how the club works' : 'Six more weeks, same direction'; }, f: () => close('keep') },
    { l: 'Adjust it openly', h: 'Explain the change; no broken promise', f: () => close('adjust') },
    { l: 'Drop the agreement', h: () => { const p = P(); return p && p.ag && p.ag.route !== 'exp' && !(p.ev && p.ev.changed) ? 'Counts as a broken promise to the academy' : 'Fine if circumstances changed'; }, f: () => close('drop') }],
  auto: () => 0, vacant: 0 });

function routeHint(k) {
  const p = P(); if (!p) return '';
  const st = stances({ tid: p.tid, bid: p.bid });
  if (k === 'youth') return `Expect: ${st.coachRisk} sporting risk · faster development · academy ↑`;
  if (k === 'exp') return `Expect: ${money(p.vFee)} + ${money(p.vWage)}/wk · steadier results · academy ↓`;
  return 'Expect: some risk · a decision point in five weeks';
}
function mandateRoute() { const ym = man('coach', 'youthMins'), ph = man('acad', 'philosophy'); if (ym >= 60 || ph >= 65) return 'youth'; if (ym <= 35 && (g().club.kitty || 0) >= (P() ? P().vFee : 0)) return 'exp'; return 'phase'; }

/* ---------- the agreement ---------- */
function agree(k, delegated) {
  const p = P(); if (!p) return 'The moment has passed.'; const R = ROUTES[k], c = { tid: p.tid, bid: p.bid };
  if (p.ag) (p.hist = p.hist || []).push({ route: p.ag.route, made: p.ag.made, until: F.absWeek() });
  p.posAt = F.myPos(); p.stage = 'run'; p.ag = { route: k, title: R.t, what: R.s, cause: `${p.tname} close to first-team level while ${p.race ? 'points matter' : 'the season still matters'} and a signing is possible.`,
    owner: R.owner, ownerName: nm(R.owner), support: k === 'exp' ? ['acad'] : ['acad', 'dof'], means: k === 'exp' ? `Up to ${money(Math.round(p.vFee * 1.15 / 100) * 100)} fee and ${money(Math.round(p.vWage * 1.1 / 5) * 5)}/wk for the veteran.` : k === 'youth' ? 'Academy mentoring; no new signing in his position.' : 'Cup games and part of the league games; veteran on hold.',
    limit: k === 'exp' ? Math.round(p.vFee * 1.15 / 100) * 100 : 0, evalAt: F.absWeek() + 5, evalWeek: g().week + 5, ind: R.ind.map(([key, t]) => ({ key, t })),
    obj: R.obj(c), delegated, made: F.absWeek(), coachName: nm('coach'), games: 0, started: 0, ptsSince: 0, xpSince: 0 };
  // objections cost a little goodwill now; executing against one's own view is weaker
  for (const o of p.ag.obj) { if (/fears|warns/.test(o)) rel(k === 'exp' ? 'acad' : 'coach', -2); }
  if (k === 'youth' || k === 'phase') { const t = findP(p.tid); if (t) t.mentor = true; if (g().academy.includes(t) && sq().length < 30) { g().academy = g().academy.filter(x => x !== t); t.academy = true; sq().push(t); p.log.push({ w: g().week, t: `${p.tname} moves up from the academy to train with the first team.` }); } }
  if (k === 'exp') p.signAt = F.absWeek() + 1;
  credAdd(k === 'youth' ? 4 : k === 'phase' ? 2 : -2, k === 'youth' ? `Agreed to give ${p.tname} regular minutes.` : k === 'phase' ? `Agreed a phased pathway for ${p.tname}.` : `Chose experience over ${p.tname}, with another pathway.`, 'agree' + p.w0);
  return `${delegated ? 'The staff settle it themselves: ' : 'Agreed: '}${R.t.toLowerCase()}. ${nm(R.owner)} is responsible. Evaluation in five weeks.`;
}

/* ---------- autonomous execution ---------- */
// how faithfully the coach carries it out: relationship, loyalty, his own view, plus seeded noise
function compliance() { const co = staff('coach'), p = P(); if (!co || !p || !p.ag) return 0.5; const pref = co.pref ? co.pref.youthMins : 50, own = p.ag.route === 'youth' ? (pref - 50) / 100 : 0; return clamp(0.45 + (co.rel - 50) / 120 + (co.p.loy - 10) / 40 + own - (p.ag.obj.length ? 0.08 : 0), 0.1, 0.95); }
const prevSel = H.selBonus;
H.selBonus = pl => {
  let b = prevSel ? prevSel(pl) : 0; const p = P(); if (!p || p.stage !== 'run' || pl.id !== p.tid || !p.ag) return b;
  const cp = p.comp == null ? compliance() : p.comp, wk = g().week;
  // youth: a willing coach picks him most weeks; a reluctant one finds reasons not to
  if (p.ag.route === 'youth') b += 2.0 * cp - 0.5;
  // phased: part of the games, on the coach's own rhythm
  else if (p.ag.route === 'phase') b += (wk % 3 !== 1 ? -1.2 : 1.6 * cp);
  else b -= 0.8;
  return b;
};
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(); if (G.phase !== 'season') return;
  const p = P();
  if (!p || p.stage === 'closed') { if (chance(0.22)) start(false); youthDrift(ours); return; }
  if (p.stage === 'data' && F.absWeek() >= p.meetAt) { p.stage = 'meet'; F.queueEvent('pw_meet', { pw: 1 }); }
  if (p.stage === 'run' && p.ag) {
    if (p.ag.delegated == null || p.ag.delegated === false) { const mm = G.inbox.find(m => m.ev === 'pw_meet' && m.done && m.by && m.by !== 'you' && m.week >= G.week - 1); if (mm && !p.ag.delChecked) p.ag.delegated = true; p.ag.delChecked = true; }
    const A = p.ag; p.comp = p.comp == null ? compliance() + (F.rnd() - 0.5) * 0.2 : p.comp;
    const t = findP(p.tid);
    if (!t) { p.log.push({ w: G.week, t: `${p.tname} is no longer at the club.` }); p.gone = true; }
    if (ours) { A.games++; const started = ours.xi && ours.xi.includes(p.tid); if (started) A.started++; A.ptsSince += ours.result === 'W' ? 3 : ours.result === 'D' ? 1 : 0; A.xpSince += F.xPts ? F.xPts(ours.uxg, ours.txg) : 1.3;
      p.log.push({ w: G.week, t: started ? `${p.tname} starts against ${ours.oppName} (${ours.result}).` : `${p.tname} is not in the starting XI against ${ours.oppName} (${ours.result}).` }); }
    if (A.route === 'exp' && p.signAt && F.absWeek() >= p.signAt && !A.signed) {
      const v = p.vet, kitty = G.club.kitty || 0; let note;
      if (v.fee <= A.limit && v.fee <= Math.max(kitty, G.club.cash * 0.3)) { const n0 = sq().length; try { F.sign(v); } catch (e) { } A.signed = sq().length > n0; note = A.signed ? `${first('dof')} signs ${v.name} (${v.age}) for ${money(v.fee)}, inside the agreed limit.` : `${first('dof')} tried to sign ${v.name}, but the club's financial rules blocked it.`; }
      else { v.fee = 0; v.wage = Math.round(v.wage * 1.2 / 5) * 5; v.loan = true; const n0 = sq().length; try { F.sign(v); } catch (e) { } A.signed = sq().length > n0; note = A.signed ? `The fee was out of reach, so ${first('dof')} takes ${v.name} on loan instead.` : `${first('dof')} could not afford ${v.name}; the position stays as it is.`; A.loanAlt = true; }
      p.log.push({ w: G.week, t: note }); p.signAt = null;
    }
    if (t && (A.route === 'youth' || A.route === 'phase') && staff('acad')) t.mentor = true;
    if (F.absWeek() >= A.evalAt && !p.evalQ) { p.ev = evaluate(); p.evalQ = 1; p.stage = 'eval'; F.queueEvent('pw_eval', { pw: 1 }); }
  }
  youthDrift(ours);
};
function youthDrift(ours) { // credibility follows real chances for youngsters, slowly, with a visible reason
  const G = g(); if (!ours || !ours.xi) return; const n = ours.xi.filter(id => { const q = sq().find(x => x.id === id); return q && q.academy; }).length; // our own academy products, not just any young player
  G._yw = (G._yw || []).concat([n]).slice(-8); if (G.week % 8 !== 0) return; const avg = G._yw.reduce((a, b) => a + b, 0) / G._yw.length;
  const ph = man('acad', 'philosophy'), want = 0.3 + ph / 100 * 1.4; // what the club says it wants, in starts per match for academy products
  const d = avg >= want ? 2 : avg < want - 1 ? -2 : 0; if (d) credAdd(d, d > 0 ? `Academy products averaged ${avg.toFixed(1)} starters per match over eight weeks, in line with the academy mandate.` : `Only ${avg.toFixed(1)} academy products per match in the starting XI over eight weeks, below what the academy mandate promises.`, null);
}

/* ---------- evaluation: four lenses ---------- */
function evaluate() {
  const G = g(), p = P(), A = p.ag, t = findP(p.tid), lens = [];
  const share = A.games ? A.started / A.games : 0, ppg = A.games ? A.ptsSince / A.games : 0, xppg = A.games ? A.xpSince / A.games : 0;
  // 1. policy fit: was the direction consistent with the club and the situation?
  const dnaYouth = G.club.dna.talent === 'academy' || man('acad', 'philosophy') >= 60;
  const fit = A.route === 'exp' ? (dnaYouth ? 'It runs against the academy identity the club claims, though it was defensible in a tight race.' : 'It fits a club that values proven players.') : (dnaYouth ? 'It fits the club\'s stated academy identity.' : p.race ? 'Brave for a club in a tight race that does not lean on its academy.' : 'Reasonable with less at stake in the table.');
  lens.push({ k: 'Was the policy right?', t: fit });
  // 2. execution: did the responsible people do what was agreed?
  let exec, execOk;
  if (A.route === 'exp') { execOk = !!A.signed; exec = A.signed ? (A.loanAlt ? `${first('dof')} could not afford the fee and found a loan instead: within the spirit of the agreement.` : `${first('dof')} signed the veteran within the agreed limit.`) : 'The signing did not happen; the agreement was not carried out.'; }
  else { const need = A.route === 'youth' ? 0.5 : 0.33; execOk = share >= need; const coachNow = staff('coach') ? nm('coach') : null; const changed = coachNow !== A.coachName;
    exec = `${p.tname} started ${A.started} of ${A.games} league games (${Math.round(share * 100)}%; agreed: ${A.route === 'youth' ? 'at least half' : 'at least a third'}). ${execOk ? 'The agreement was carried out.' : changed ? `${A.coachName} agreed it, but ${coachNow ? coachNow + ' now picks the team' : 'the coaching post is vacant'}.` : `${A.coachName} did not carry it out in full.`}`; }
  lens.push({ k: 'Was it carried out?', t: exec, ok: execOk });
  // 3. circumstances
  const circ = []; if (!t) circ.push(`${p.tname} has left the club.`); else if (t.inj > 0) circ.push(`${p.tname} is injured.`);
  const b = findP(p.bid); if (!b) circ.push(`${p.bname} has left.`); else if (b.inj > 0) circ.push(`${p.bname} got injured, which opened a place.`);
  if (!staff('coach')) circ.push('The coach who agreed it has gone; the post is vacant.'); else if (staff('coach').id !== p.coachId) circ.push('The coach who agreed it has gone; a new coach picks the team.');
  if (staff('dof') && staff('dof').id !== p.dofId) circ.push('There is a new DoF.');
  const posNow = F.myPos(); if (p.posAt && Math.abs(posNow - p.posAt) >= 4) circ.push(`The table changed: from ${F.ord(p.posAt)} to ${F.ord(posNow)}.`);
  lens.push({ k: 'Did circumstances change?', t: circ.length ? circ.join(' ') : 'Nothing major changed.' , changed: circ.length > 0 });
  // 4. luck: points against what the chances deserved
  const luck = ppg - xppg; lens.push({ k: 'How much was luck?', t: A.games ? `${ppg.toFixed(2)} points per game, against ${xppg.toFixed(2)} that the chances deserved. ${luck > 0.35 ? 'Results flattered the team.' : luck < -0.35 ? 'Results were unkind; the performances were better.' : 'Results matched the performances.'}` : 'Too few games to say.' });
  // development
  const dca = t ? t.ca - p.ca0 : 0; const dev = t ? `${p.tname} ${dca > 0.25 ? 'has clearly improved' : dca > 0.05 ? 'has improved a little' : 'has not moved on yet'}.` : '';
  const verdict = !execOk && !circ.length ? 'The decision was not carried out. Judge the people, not the policy.' : execOk && ppg < p.ppg0 - 0.5 && luck < -0.35 ? 'Carried out as agreed; the results fell short mostly through bad luck.' : execOk && ppg < p.ppg0 - 0.5 ? 'Carried out as agreed, and it cost points. The policy itself is the question.' : execOk ? 'Carried out as agreed, without a big cost.' : 'Circumstances changed the picture; adjusting is defensible.';
  return { lens, verdict, share, ppg, xppg, execOk, changed: circ.length > 0, dev, summary: `${verdict} ${dev}`.trim() };
}

/* ---------- close: keep, adjust openly, drop ---------- */
function close(how) {
  const G = g(), p = P(); if (!p || !p.ag) return 'Done.'; const A = p.ag, E = p.ev || evaluate();
  let out;
  if (how === 'keep' && (p.kept || 0) >= 1) { // a second keep concludes it: the pathway is now simply how the club works
    if (E.execOk) { rel(A.owner, 3); credAdd(A.route === 'exp' ? 0 : 3, `Completed the agreed pathway for ${p.tname}.`, 'done' + p.w0); }
    else credAdd(A.route === 'exp' ? 0 : -2, `Let the ${p.tname} agreement run out without it being carried out.`, 'done' + p.w0);
    p.stage = 'closed'; out = E.execOk ? 'The agreement has done its job and is closed.' : 'The agreement is closed. It was never really carried out.'; }
  else if (how === 'keep') { p.kept = (p.kept || 0) + 1; A.evalAt = F.absWeek() + 6; A.evalWeek = G.week + 6; A.games = 0; A.started = 0; A.ptsSince = 0; A.xpSince = 0; p.evalQ = 0; p.stage = 'run'; p.ppg0 = ppgNow(); p.posAt = F.myPos();
    if (E.execOk) { rel(A.owner, 3); credAdd(A.route === 'exp' ? 0 : 1, `Kept the agreement on ${p.tname} after a fair evaluation.`, 'keep' + p.w0); }
    out = E.execOk ? 'Same direction, six more weeks. Then it is concluded.' : `Same direction, six more weeks, but ${first(A.owner)} knows it has to be carried out this time.`; }
  else if (how === 'adjust') { const next = A.route === 'youth' ? 'phase' : A.route === 'exp' ? 'phase' : (E.share >= 0.33 ? 'youth' : 'exp');
    credAdd(0, `Adjusted the ${p.tname} agreement openly after the evaluation: no promise broken.`, 'adj' + G.season + G.week); rel(A.owner, 1);
    p.stage = 'meet'; p.evalQ = 0; const r = agree(next, false); out = `Adjusted openly to "${ROUTES[next].t.toLowerCase()}". ${r}`; }
  else { const broken = A.route !== 'exp' && !E.changed;
    if (broken) { credAdd(-6, `Dropped the promised pathway for ${p.tname} without a change in circumstances.`, 'drop' + p.w0); rel('acad', -6); bk('fans', -2); }
    else credAdd(0, `Ended the ${p.tname} agreement because circumstances changed.`, 'drop' + p.w0);
    p.stage = 'closed'; out = broken ? 'Agreement dropped. The academy sees it as a broken promise.' : 'Agreement ended; the reasons are understood.'; }
  if (p.stage === 'closed' || how === 'drop') { (G.pwLog = G.pwLog || []).push({ s: G.season, w: G.week, t: p.tname, route: A.route, how, verdict: E.verdict }); const t = findP(p.tid); if (t) t.mentor = false; }
  return out;
}
// change course between evaluations: explain it first, and it is not a broken promise
function changeCourse(k) {
  const p = P(); if (!p || p.stage !== 'run' || !p.ag || p.ag.route === k) return { err: 'Nothing to change.' };
  if (g().ap < 1) return { err: 'No action points left this week.' }; g().ap--;
  credAdd(0, `Explained a change of course on ${p.tname} before the evaluation.`, 'chg' + p.w0 + k); rel(p.ag.owner, -1);
  p.log.push({ w: g().week, t: `You change course and explain why: ${ROUTES[k].t.toLowerCase()}.` }); p.comp = null;
  return { out: agree(k, false) };
}
function ask(role) { const p = P(); if (!p || !QUESTIONS[role]) return null; if (!p.asked[role]) p.asked[role] = QUESTIONS[role].a({ tid: p.tid, bid: p.bid, vFee: p.vFee, vWage: p.vWage, vYears: p.vYears }); return p.asked[role]; }

/* ---------- views ---------- */
function pwView() {
  const p = P(); if (!p) return null; const t = findP(p.tid), st = stances({ tid: p.tid, bid: p.bid });
  const A = p.ag ? { ...p.ag, routeT: ROUTES[p.ag.route].t, owner: nm(p.ag.owner), share: p.ag.games ? p.ag.started / p.ag.games : null, weeksLeft: Math.max(0, p.ag.evalAt - F.absWeek()) } : null;
  return { stage: p.stage, tname: p.tname, tpos: POS_L[p.tpos], tage: t ? t.age : null, bname: p.bname, stances: [['acad', 'Academy', st.acad], ['coach', 'Coach', st.coach], ['dof', 'Director of Football', st.dof]].filter(x => x[2]), questions: Object.entries(QUESTIONS).map(([r, q]) => ({ r, q: q.q, a: p.asked[r] || null })), routes: ROUTE_K.map(k => ({ k, t: ROUTES[k].t, s: ROUTES[k].s, hint: routeHint(k) })), ag: A, log: p.log.slice(-8).reverse(), ev: p.ev || null };
}
Object.assign(F, { pwView, pwAsk: ask, pwChange: changeCourse, pwStart: start, credView: () => cred(), PW_ROUTES: ROUTES });
})(FO);
