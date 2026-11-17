// Regression tests for the CEO-2 review: agreed priorities survive the squad plan, money is real, an investigation
// authorises nothing, and a head is judged on his own part. Plus a ten-week career on real results (no injected scores).
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const answerAll = F => { for (const m of F.G.inbox.filter(m => !m.done && !/^ini_/.test(m.ev))) F.respond(m.id, 0); };
const talk = (F, ...ids) => { F.convoOpen('dof'); for (const id of ids) { const v = F.convoView('dof'); if (v && v.opts.some(o => o.id === id)) F.convoAnswer(id); } const v = F.convoView('dof'); F.convoClose(); return v; };
const ini = F => (F.G.agr || []).filter(a => a.k === 'ini');
function weak(F, weeks = 5) { for (let w = 0; w < weeks; w++) { answerAll(F); F.endWeek(); } for (let i = 0; i < 4; i++) F.G.ft.games.push({ r: 'L', ug: 0, tg: 3, ux: 0.8, tx: 2.1, o: 'X', h: 1 }); F.G.talks = {}; }
const plan = (F, reserve) => { talk(F, 't_form', reserve ? 'i_plan_r' : 'i_plan', 'i_plan', 'i_order'); return ini(F).find(a => a.kind === 'plan'); };

// 1. an agreed priority survives the rolling squad plan, reaches the scouts, and is released afterwards
{ const F = game(801); weak(F, 9); const a = plan(F); ok(!!a, 'a DoF plan is agreed in week ' + F.G.week);
  let held = true, scouted = false; for (let w = 0; w < 6 && !a.res; w++) { answerAll(F); F.endWeek(); if (a.res || a.done) break;
    held = held && F.G.rec.plan.prios.some(x => x.pos === a.pos); const SP = F.squadPlanView(); if (SP.winter.status !== 'closed') held = held && SP.winter.rows.some(r => r.pos === a.pos && r.agreed);
    scouted = scouted || [F.staff('scout')].concat(F.G.rec.scouts || []).some(s => s && s.assign && s.assign.pos === a.pos); }
  ok(held, `week after week the ${a.pos} stays in the priorities and in the DoF's written plan`); ok(scouted, 'scouts are sent to look at that position');
  a.res = 'test'; F.endWeek(); ok(!F.agrPrios().some(x => x.pos === a.pos) || F.G.dofPrio === a.pos, 'once the agreement ends it no longer forces the priority');
  const s2 = F.save(); F.load(s2); ok(F.G.agr.some(x => x.id === a.id), 'and survives save and load'); }

// 2. money: never created, never counted twice, capped by cash, released after use
{ const F = game(802); weak(F); const tb = F.transferBudget(), cash = F.G.club.cash;
  const a = plan(F, false); ok(a && !a.funds && F.recExtraAuth() === 0, 'a plan within budget adds no spending authority');
  ok(F.transferBudget() + F.recExtraAuth() <= Math.max(cash, tb), 'authority never exceeds the cash the club has'); }
{ const F = game(803); weak(F); const a = plan(F, true), head = F.G.club.cash - F.transferBudget();
  ok(!a || !a.funds || a.funds <= Math.max(0, head), `reserve money comes from cash above the budget (${a && a.funds} of ${Math.round(head)})`);
  if (a && a.funds) { ok(F.recExtraAuth() <= Math.max(0, F.G.club.cash - F.transferBudget()), 'live authority is capped by cash'); const c0 = F.G.club.cash; F.G.club.cash = F.transferBudget() + 100; ok(F.recExtraAuth() <= 100, 'if cash falls, the authority falls with it'); F.G.club.cash = c0;
    a.done = 1; ok(F.agrAuth() === 0, 'once the signing is made, the authority is released');
    a.done = 0; F.G.agr.push(Object.assign({}, a, { id: 'twin' })); ok(F.agrAuth() === a.funds, 'two agreements cannot each claim the same money'); F.G.agr = F.G.agr.filter(x => x.id !== 'twin'); } }
{ const F = game(804); weak(F); F.G.club.cash = F.transferBudget(); const v = talk(F, 't_form'); ok(!v || !v.opts || !v.opts.some(o => o.id === 'i_plan_r'), 'no reserve to expose: no reserve option'); }

// 3. a joint review authorises nothing until the CEO decides; left unanswered, nothing changes
{ const F = game(805); weak(F); const before = JSON.stringify(F.G.rec.plan.prios), auth0 = F.recExtraAuth(); talk(F, 't_form', 'i_joint');
  ok(JSON.stringify(F.G.rec.plan.prios) === before && F.recExtraAuth() === auth0 && !F.agrPrios().length, 'starting a joint review changes no priority and grants no money');
  let m = null; for (let w = 0; w < 4 && !m; w++) { answerAll(F); F.endWeek(); m = F.G.inbox.find(x => x.ev === 'ini_joint'); }
  ok(!!m, 'the recommendation comes back'); const n0 = ini(F).filter(a => !a.res).length; answerAll(F); F.endWeek();
  ok(ini(F).filter(a => !a.res && a.kind !== 'joint').length === n0 && !F.agrPrios().length, 'left unanswered, the default is: nothing changes'); }

// 4. judged on his own part
{ const F = game(806); weak(F); const a = plan(F); const co = F.staff('coach'), cr = co.rel, dr = F.staff('dof').rel;
  a.done = 1; a.inn = 'New Defender'; a.work = { reports: 2, tries: 1, window: 1 }; for (let i = a.n0; i < F.G.ft.games.length; i++); F.G.ft.games.push({ r: 'L', ug: 0, tg: 3, ux: 0.7, tx: 2.3, o: 'X', h: 1 });
  a.by = F.absWeek(); F.HOOK.seasonAfterMatch(null);
  ok(a.res === 'delivered' && F.staff('dof').rel >= dr, `a signing made, results poor: "delivered", and the DoF is not punished (${a.res})`);
  ok(/Delivered/.test(a.ex.exec) && /Outcome:/.test(a.ex.outcome) && a.ex.decision.length > 10, 'the review shows decision, execution and outcome separately'); }
{ const F = game(807); weak(F); const a = plan(F); const dr = F.staff('dof').rel; a.work = { reports: 0, tries: 0, window: 1 };
  for (let i = 0; i < 4; i++) F.G.ft.games.push({ r: 'W', ug: 3, tg: 0, ux: 2.2, tx: 0.5, o: 'X', h: 1 });
  a.by = F.absWeek(); F.HOOK.seasonAfterMatch(null);
  ok(a.ex.execK === 'idle' && F.staff('dof').rel < dr, `results good, no work done: no credit for the DoF (${a.res}, ${a.ex.execK})`); }
{ const F = game(808); weak(F); const a = plan(F); const cr = F.staff('coach').rel; a.work = { reports: 0, tries: 0, window: 0 }; a.by = F.absWeek(); F.HOOK.seasonAfterMatch(null);
  ok(a.res === 'blocked' && Math.abs(F.staff('coach').rel - cr) < 0.01, 'a blocked recruitment plan does not land on the coach'); }
{ const F = game(809); weak(F); F.staff('dof').p.ego = 18; let v = talk(F, 't_form', 'i_plan'); const a0 = ini(F).find(a => a.kind === 'plan');
  if (!a0) { talk(F, 't_form', 'i_plan', 'i_order'); }
  const a = ini(F).find(a => a.kind === 'plan'); if (a && a.ordered) { a.work = { reports: 0, tries: 0, window: 1 }; a.by = F.absWeek(); F.HOOK.seasonAfterMatch(null); ok(/Your decision/.test(a.ex.decision) && a.ex.who === 'you', 'an order against his advice stays the CEO\'s decision in the review'); } else ok(true, '(this DoF agreed, no order needed)'); }
// no repeated review events
{ const F = game(810); weak(F); talk(F, 't_form', 'i_back'); const a = ini(F)[0]; for (let w = 0; w < 9; w++) { answerAll(F); F.endWeek(); }
  ok(F.G.inbox.filter(m => m.ev === 'ini_review' && m.ctx.id === a.id).length <= 1, 'one review per agreement, never repeated'); }
// old saves without the new fields
{ const F = game(811); const G = JSON.parse(F.save()); delete G.agr; delete G.iniSeen; G.ft && (G.ft.games = []); ok(F.load(JSON.stringify(G)) && F.agrPrios().length === 0 && F.agrAuth() === 0, 'an old save without agreements loads and plays'); F.endWeek(); ok(F.G.phase === 'season', 'and the week runs'); }

// a ten-week career on real results: find a natural signal, then four careers with the same seed and different decisions
{ let seed = null, wk = 0; for (let sd = 850; sd < 900 && seed == null; sd++) { const F = game(sd); for (let w = 0; w < 14; w++) { answerAll(F); F.endWeek(); if (F.iniSignal()) { seed = sd; wk = w; break; } } }
  ok(seed != null, `a real sporting problem arises in normal play (seed ${seed}, after ${wk + 1} weeks)`);
  if (seed != null) { const run = choice => { const F = game(seed); for (let w = 0; w <= wk; w++) { answerAll(F); F.endWeek(); } const sig = F.iniSignal(); F.G.talks = {};
      if (choice) talk(F, 't_form', choice, 'i_order'); const log = [`week ${F.G.week}: ${sig.t}; CEO: ${choice || 'does nothing'}`];
      for (let w = 0; w < 10 && F.G.phase === 'season'; w++) { answerAll(F); F.endWeek(); const a = ini(F).slice(-1)[0]; if (a && a.log.length) log.push(`week ${F.G.week}: ${a.log[a.log.length - 1].t}${a.res ? ' → ' + a.res : ''}`); }
      return { F, log, a: ini(F).slice(-1)[0] }; };
    const A = run('i_back'), B = run('i_plan'), C = run('i_joint'), D = run(null);
    console.log('  A (back the coach):\n    ' + A.log.join('\n    ')); console.log('  B (DoF acts):\n    ' + B.log.join('\n    '));
    ok(A.a && A.a.kind === 'back' && A.a.res, `A: the coach was judged after his games (${A.a && A.a.res}: ${A.a && A.a.ex && A.a.ex.exec})`);
    ok(B.a && B.a.kind === 'plan' && B.a.log.length >= 5, `B: the DoF's plan ran for weeks with a log (${B.a && B.a.log.length} entries${B.a && B.a.res ? ', ' + B.a.res : ', still running'})`);
    ok(C.F.G.inbox.some(m => m.ev === 'ini_joint'), 'C: the joint review came back as a recommendation before anything changed');
    ok(!ini(D.F).length && D.F.G.phase !== 'sacked', 'D: doing nothing leaves no agreement and the club carries on');
    ok(JSON.stringify(A.F.G.rec.plan.prios) !== JSON.stringify(B.F.G.rec.plan.prios) || A.F.staff('coach').rel !== B.F.staff('coach').rel, 'A and B end in a different club state'); } }

console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
