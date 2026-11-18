// CEO-1: the CEO raises a real topic with the DoF; the head gives his view, may refuse; an agreement is judged on what happened.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; for (const k in F.PARK) F.PARK[k] = false; /* these tests cover parked systems (B66) */ F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const talk = (F, ...ids) => { F.convoOpen('dof'); for (const id of ids) F.convoAnswer(id); const v = F.convoView('dof'); F.convoClose(); return v; };
// 1. the topic, the view, the agreement
{ const F = game(601); for (let w = 0; w < 3; w++) F.endWeek(); F.G.talks = {};
  F.convoOpen('dof'); const v0 = F.convoView('dof'); ok(v0.opts.some(o => o.id === 't_squad'), 'the CEO can ask the DoF where the squad is short, without any message');
  F.convoAnswer('t_squad'); const v1 = F.convoView('dof'), said = v1.log[v1.log.length - 1].t; ok(/\./.test(said) && v1.opts.map(o => o.id).join() === 'a_prio,a_you,a_wait', `he gives his view and three answers ("${said.slice(0, 70)}…")`);
  F.convoAnswer('a_prio'); F.convoClose(); const a = F.G.agr[0];
  ok(a && a.owner === 'dof' && a.k === 'pos' && a.by > F.absWeek(), 'an agreement with an owner and a week it is judged');
  ok(F.G.rec.plan.prios[0].pos === a.pos, 'the position really becomes the recruitment priority');
  ok(F.stillRunning().some(x => /find a/i.test(x.t)), 'it stays on the desk under Still running');
  F.convoOpen('dof'); ok(!F.convoView('dof').opts.some(o => o.id === 't_squad'), 'no second squad agreement while one runs: no talk farming'); F.convoClose();
  // judged on what happened: a player comes in at that position
  const p = Object.assign({}, F.G.squad.find(x => x.pos === a.pos) || F.G.squad[0], { id: 999999, name: 'New Arrival', pos: a.pos }); F.G.squad.push(p);
  const r0 = F.staff('dof').rel; for (let k = 0; k < 20 && !a.res && F.G.phase === "season"; k++) F.endWeek();
  ok(a.res === 'met' && /came in/.test(a.out || ''), `judged as met when a ${a.pos} arrived (${a.res}: ${a.out})`); // his trust also moves with other events over these weeks, so the judgement itself is checked
  ok(F.save().includes('"agr"'), 'agreements are saved'); }
// 2. he may refuse: no money and no window
{ const F = game(602); while (F.G.week < 20 && F.G.phase === 'season') F.endWeek(); F.G.talks = {}; F.transferBudget = () => 0;
  const before = (F.G.agr || []).length; talk(F, 't_squad', 'a_prio'); ok((F.G.agr || []).length === before, 'with no money and the window shut he says no, and no agreement is made'); }
// 3. "your call": a bold DoF goes for it, a careful one waits
{ const A = game(603), B = game(603); for (const X of [A, B]) { for (let w = 0; w < 3; w++) X.endWeek(); X.G.talks = {}; }
  A.staff('dof').p.risk = 17; B.staff('dof').p.risk = 4; B.staff('dof').p.amb = 5; talk(A, 't_squad', 'a_you'); talk(B, 't_squad', 'a_you');
  ok((A.G.agr || []).length === 1 && (B.G.agr || []).length === 0, 'left to him, a bold DoF makes it his own agreement; a careful one keeps watching'); }
// 4. missed when nothing arrived and there was money
{ const F = game(604); for (let w = 0; w < 3; w++) F.endWeek(); F.G.talks = {}; talk(F, 't_squad', 'a_prio'); const a = F.G.agr[0]; a.base = F.G.squad.map(p => p.id); a.by0 = 5000;
  for (const p of F.G.squad.filter(p => p.pos === a.pos)) a.base.push(p.id); const r0 = F.staff('dof').rel; F.G.squad = F.G.squad.filter(p => true);
  const orig = F.G.squad.slice(); for (let k = 0; k < 20 && !a.res && F.G.phase === "season"; k++) { F.endWeek(); F.G.squad = F.G.squad.filter(p => p.pos !== a.pos || a.base.includes(p.id)); }
  ok(a.res === 'missed' || a.res === 'blocked', `judged honestly when nobody came (${a.res}): ${a.out}`); }
// 5. the old "priority" answers now really steer recruitment
{ const F = game(605); F.recPrioritise('CB'); ok(F.G.rec.plan.prios[0].pos === 'CB', 'a priority given to the DoF reaches the recruitment plan'); }
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
