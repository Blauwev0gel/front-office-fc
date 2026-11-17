// CEO-2: the executive initiative loop (observe → initiate → discuss → agree → delegate → execute → review), over many weeks.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const answerAll = F => { for (const m of F.G.inbox.filter(m => !m.done && !/^ini_/.test(m.ev))) F.respond(m.id, 0); };
function weakDefence(F) { for (let w = 0; w < 5; w++) { answerAll(F); F.endWeek(); } const gs = F.G.ft.games; for (let i = 0; i < 4; i++) gs.push({ r: 'L', ug: 0, tg: 3, ux: 0.8, tx: 2.1, o: 'X', h: 1 }); F.G.talks = {}; }
const talk = (F, ...ids) => { F.convoOpen('dof'); for (const id of ids) F.convoAnswer(id); const v = F.convoView('dof'); F.convoClose(); return v; };
const ini = F => (F.G.agr || []).filter(a => a.k === 'ini');

// A. weak defence: the CEO starts it, three views, an agreement executed and reviewed over weeks
{ const F = game(701); weakDefence(F);
  ok(F.iniSignal() && F.iniSignal().k === 'defence', `the game sees the problem from the results (${F.iniSignal() && F.iniSignal().t})`);
  F.convoOpen('dof'); ok(F.convoView('dof').opts.some(o => o.id === 't_form'), 'the CEO can raise it himself, no message needed');
  F.convoAnswer('t_form'); const v = F.convoView('dof'), who = v.log.map(l => l.who);
  ok(['coach', 'dof', 'fin'].every(r => who.includes(r)), 'the coach, the DoF and Finance each give a view');
  ok(v.opts.map(o => o.id).join() === 'i_back,i_plan,i_joint,i_wait', 'four executive answers: back the coach, a DoF plan, a joint review, wait');
  const dofSaid = v.log.filter(l => l.who === 'dof').map(l => l.t).join(' '), coSaid = v.log.find(l => l.who === 'coach').t;
  ok(dofSaid !== coSaid, 'the coach and the DoF do not say the same thing');
  F.convoAnswer('i_plan'); if (F.convoView('dof') && F.convoView('dof').opts.some(o => o.id === 'i_order')) F.convoAnswer('i_order'); F.convoClose();
  const a = ini(F)[0]; ok(a && a.owner === 'dof' && a.kind === 'plan' && a.by > F.absWeek(), 'an agreement: owner DoF, objective, review week');
  ok(F.G.rec.plan.prios[0].pos === a.pos, 'the DoF really works on it: the position leads the recruitment plan');
  let weeks = 0; while (!a.res && weeks++ < 20 && F.G.phase === 'season') { answerAll(F); F.endWeek(); }
  ok(a.log.length >= 2, `the agreement ran for several weeks with a log of what happened (${a.log.length} entries)`);
  ok(['worked', 'unlucky', 'failed', 'overtaken', 'blocked'].includes(a.res), `it was reviewed: ${a.res}. ${a.out}`);
  const m = F.G.inbox.find(x => x.ev === 'ini_review' && !x.done) || F.G.inbox.find(x => x.ev === 'ini_review');
  ok(!!m, 'the CEO gets the review to judge'); if (m && !m.done && F.staff('dof')) { const r0 = F.staff('dof').rel; F.respond(m.id, 1); ok(F.staff('dof').rel < r0, 'holding him responsible has a real effect on him'); } else console.log('     (no DoF left to judge: ' + (F.staff('dof') ? 'review answered' : 'he left the club') + ')'); }

// two different decisions, same seed: different state
{ const A = game(702), B = game(702); weakDefence(A); weakDefence(B);
  talk(A, 't_form', 'i_back'); talk(B, 't_form', 'i_plan'); if (B.convoView('dof')) talk(B, 'i_order');
  const ca = A.staff('coach'), cb = B.staff('coach');
  ok(ca.boost > cb.boost, 'backing the coach lifts him; the DoF plan does not');
  ok((B.G.rec.extra || 0) >= (A.G.rec.extra || 0) && B.G.rec.plan.prios[0].pos === ini(B)[0].pos && ini(A)[0].kind === 'back', 'the DoF plan changes recruitment (priority and money); backing the coach does not');
  ok(ini(A)[0].by - A.absWeek() === 5 && ini(B)[0].by > B.absWeek(), 'they are judged at different times, on different things'); }

// B. the CEO does nothing: no agreement, no penalty, the game goes on
{ const F = game(703); weakDefence(F); const r = ['coach', 'dof'].map(x => F.staff(x).rel); answerAll(F); F.endWeek(); answerAll(F); F.endWeek();
  ok(ini(F).length === 0 && F.G.phase === 'season', 'ignoring it is allowed: no agreement, the season goes on');
  ok(['coach', 'dof'].every((x, i) => Math.abs(F.staff(x).rel - r[i]) < 6), 'and nobody is punished for it'); }

// C. a successful team: no fabricated crisis, but still something to plan
{ const F = game(704); for (let w = 0; w < 5; w++) { answerAll(F); F.endWeek(); } const gs = F.G.ft.games; for (let i = 0; i < 4; i++) gs.push({ r: 'W', ug: 2, tg: 0, ux: 1.9, tx: 0.6, o: 'X', h: 1 }); F.G.talks = {};
  ok(!F.iniSignal(), 'no problem is invented when the team is winning');
  const v = talk(F, 't_form'); ok(v.opts.length === 0 && /flying|worries/.test(v.log.map(l => l.t).join(' ')), 'asked anyway, the coach says so, and nothing is forced');
  F.G.talks = {}; F.convoOpen('dof'); ok(F.convoView('dof').opts.some(o => o.id === 't_squad'), 'planning ahead (where are we short?) is still on offer'); F.convoClose(); }

// D. a DoF who does not deliver: he had money, nobody came
{ const F = game(705); weakDefence(F); talk(F, 't_form', 'i_plan'); if (F.convoView('dof')) talk(F, 'i_order'); const a = ini(F)[0]; a.funds = 5000;
  let k = 0; while (!a.res && k++ < 20 && F.G.phase === 'season') { answerAll(F); F.endWeek(); F.G.squad = F.G.squad.filter(p => p.pos !== a.pos || a.base.includes(p.id)); a.done = 0; if (!a.res) for (let i = a.n0; i < F.G.ft.games.length; i++) F.G.ft.games[i] = { r: 'L', ug: 0, tg: 3, ux: 0.7, tx: 2.2, o: 'X', h: 1 }; }
  ok(a.res === 'failed', `with money and no signing, it is a failure of execution (${a.res})`); ok(/No .* arrived/.test(a.out), 'and the review says why'); }

// E. circumstances change: the team recovers before anyone arrives
{ const F = game(706); weakDefence(F); talk(F, 't_form', 'i_plan'); if (F.convoView('dof')) talk(F, 'i_order'); const a = ini(F)[0];
  let k = 0; while (!a.res && k++ < 20 && F.G.phase === 'season') { answerAll(F); F.endWeek(); F.G.squad = F.G.squad.filter(p => p.pos !== a.pos || a.base.includes(p.id)); a.done = 0; if (!a.res) for (let i = a.n0; i < F.G.ft.games.length; i++) F.G.ft.games[i] = { r: 'W', ug: 2, tg: 0, ux: 1.8, tx: 0.7, o: 'X', h: 1 }; }
  ok(a.res === 'overtaken', `the plan can be overtaken by events, not blamed on the DoF (${a.res})`); }

// luck and judgement apart: backing the coach, results bad but chances against fell
{ const F = game(707); weakDefence(F); talk(F, 't_form', 'i_back'); const a = ini(F)[0];
  for (let k = 0; k < 4; k++) { answerAll(F); F.endWeek(); } for (let i = a.n0; i < F.G.ft.games.length; i++) F.G.ft.games[i] = { r: 'L', ug: 0, tg: 3, ux: 1.2, tx: 0.9, o: 'X', h: 1 };
  a.by = F.absWeek(); F.HOOK.seasonAfterMatch(null); // the review runs on these games
  ok(a.res === 'unlucky', `good numbers, bad results: unlucky, not failed (${a.res})`);
  F.endWeek(); const m = F.G.inbox.find(x => x.ev === 'ini_review' && !x.done); ok(!!m, 'the CEO is asked for his verdict');
  if (m) { const r0 = F.staff('coach').rel; const out = F.respond(m.id, 1); ok(F.staff('coach').rel < r0 && /unfair/.test(JSON.stringify(F.G.inbox.find(x => x.id === m.id))), 'blaming him for bad luck costs trust, and he says it is unfair'); } }

// F. save and reload, and the same seed with the same choices gives the same club
{ const F = game(708); weakDefence(F); talk(F, 't_form', 'i_back'); const a = ini(F)[0], s = F.save(); F.load(s); const b = ini(F)[0];
  ok(b && b.owner === a.owner && b.t === a.t && b.by === a.by && b.log.length === a.log.length, 'an active agreement survives save and load intact');
  const X = game(709), Y = game(709); for (const Z of [X, Y]) { weakDefence(Z); talk(Z, 't_form', 'i_back'); for (let w = 0; w < 4; w++) { answerAll(Z); Z.endWeek(); } }
  ok(X.save() === Y.save(), 'same seed, same choices, same outcome'); }

// joint review: back to the CEO with one recommendation
{ const F = game(710); weakDefence(F); talk(F, 't_form', 'i_joint'); const a = ini(F)[0]; ok(a && a.joint, 'a joint review is set up');
  for (let w = 0; w < 3 && !F.G.inbox.some(m => m.ev === 'ini_joint'); w++) { answerAll(F); F.endWeek(); }
  const m = F.G.inbox.find(m => m.ev === 'ini_joint'); ok(!!m && a.res === 'merged', 'two weeks later the coach and the DoF come back with one recommendation');
  if (m && !m.done) { F.respond(m.id, 0); ok(ini(F).some(x => x.kind === 'back' && !x.res), 'adopting it starts the agreement'); } }

console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
