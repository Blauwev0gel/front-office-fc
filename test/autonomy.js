// B54: Grip is gone. A quiet CEO is not punished, clicking is not rewarded, heads act from their profile and escalate for a reason.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const HEADS = ['coach', 'dof', 'acad', 'com', 'mkt', 'fin'];
// what the system adds to a head beyond the people in his department (staff hired are a concrete cause and are left out)
const bonus = F => { const D = F.G.dept, keep = {}; if (D) for (const k in D) { keep[k] = D[k].staff; D[k].staff = []; } const v = HEADS.map(h => F.HOOK.effBonus(h).toFixed(3)).join(','); if (D) for (const k in D) D[k].staff = keep[k]; return v; };

// 1 and 2: a quiet CEO and a clicking CEO get the same help from the system
{ const Q = game(301), C = game(301), b0 = bonus(Q);
  for (let w = 0; w < 8; w++) {
    Q.endWeek();
    for (const m of C.G.inbox.filter(m => !m.done)) C.respond(m.id, 0);
    for (const b of (C.G.briefs || []).filter(b => !b.done)) C.answerBrief(b.id, 0);
    for (const h of ['dof', 'com']) { C.convoOpen(h); C.convoAnswer('back'); C.convoClose && C.convoClose(); }
    C.endWeek(); }
  ok(Q.G.grip === undefined && C.G.grip === undefined, 'there is no grip in the state any more');
  ok(bonus(Q) === b0, `eight quiet weeks change nothing in what the system adds to the heads (${bonus(Q)})`);
  ok(bonus(C) === b0, `answering everything and talking every week adds nothing either (${bonus(C)})`);
  ok(typeof Q.gripGain === 'undefined', 'no function builds grip'); }

// backing a head only moves him when there is a reason
{ const F = game(302), s = F.staff('com'); s.perf = 60; s.rel = 55; F.G.desk = { n: 0, err: 0, by: {} };
  F.convoOpen('com'); F.convoAnswer('back'); ok(Math.abs(F.staff('com').rel - 55) < 0.01, 'backing a head who is doing fine moves nothing');
  F.convoClose && F.convoClose(); F.G.talks = {}; s.perf = 35; F.convoOpen('com'); F.convoAnswer('back'); ok(F.staff('com').rel > 55, 'backing him through a poor run does'); }

// 3: a weak head misjudges more often than a strong one; how he fails is named
{ const F = game(303), s = F.staff('dof'), run = (at, risk, a, n = 1500) => { s.at = [at, at, at]; s.p.risk = risk; F.G.auth = { dof: a }; const o = { ok: 0, err: 0, win: 0, why: new Set() }; for (let i = 0; i < n; i++) { const r = F.deskCarry('dof'); o[r.k]++; if (r.why) o.why.add(r.why.replace(/^\S+ /, '')); } return o; };
  const avg = F.tierAvg(F.G.club.tier), weak = run(Math.max(1, Math.round(avg - 2)), 10, 1), strong = run(Math.round(avg + 6), 10, 1), careful = run(Math.max(1, Math.round(avg - 2)), 5, 1);
  ok(weak.err > strong.err * 3 && strong.err <= 15, `a weak head misjudges far more often than a strong one (${weak.err} vs ${strong.err} in 1500)`);
  ok(careful.err < weak.err, `a careful weak head misjudges less than a normal weak head (${careful.err} vs ${weak.err})`);
  ok([...weak.why].every(t => /misjudged/.test(t)), 'his mistakes say what went wrong');
  // 4 (from step 3, already true here): a risk-taker with a free hand gambles; a good one wins more often than a weak one
  const bold = run(Math.round(avg + 4), 16, 2), boldWeak = run(Math.max(1, Math.round(avg - 2)), 16, 2), boldNormal = run(Math.round(avg + 4), 16, 1);
  ok(bold.win > 0 && bold.err > 0, `a risk-taker with a free hand takes gambles that go both ways (${bold.win} won, ${bold.err} lost)`);
  ok(bold.win / (bold.win + bold.err) > boldWeak.win / (boldWeak.win + boldWeak.err) + 0.15, 'a good gambler wins more often than a weak one');
  ok(boldNormal.win === 0, 'without a free hand the same man does not gamble'); }

// short leash: escalations follow rules, not dice, and always give a reason
{ const F = game(304), e = Object.values(F.EV).find(e => e.from === 'com' && !e.ceo && !F.HOOK.desk.core), ctx = { wk: F.M(100) };
  const ev = { id: 'test_x', from: 'com', opts: [{}, {}] };
  F.G.auth = { com: 0 }; const a = F.deskReason(ev, ctx), b = F.deskReason(ev, ctx);
  ok(typeof a === 'string' && a === b && /short leash/.test(a), 'on a short leash a money matter always comes to the CEO, with the reason');
  F.G.auth = { com: 1 }; F.staff('com').rel = 60; F.staff('com').at = [16, 16, 16]; ok(F.deskReason(ev, ctx) === null, 'with a normal mandate a strong head decides it himself');
  F.G.auth = { com: 0 }; ok(F.deskReason(ev, {}) === null, 'a short leash does not send up matters without money or a player'); }

// 7: an old save with grip loads cleanly
{ const F = game(305), G = JSON.parse(F.save()); G.v = 3; G.grip = 12; G.gripW = 4; G.gripLog = [60, 55]; G.flags.gripWarn = 1;
  ok(F.load(JSON.stringify(G)) && F.G.v === F.VERSION && F.G.grip === undefined && F.G.gripLog === undefined && !('gripWarn' in F.G.flags), 'an old save loads and its grip is cleared');
  F.endWeek(); ok(F.G.grip === undefined && F.G.phase === 'season', 'and the season plays on'); }

// 8: same seed, same actions, same club
{ const A = game(306), B = game(306); for (let w = 0; w < 6; w++) for (const X of [A, B]) { for (const m of X.G.inbox.filter(m => !m.done)) X.respond(m.id, 0); X.endWeek(); }
  ok(A.save() === B.save(), 'the same seed and the same choices give the same club'); }

console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
