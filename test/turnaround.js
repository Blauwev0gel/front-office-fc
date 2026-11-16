// The turnaround (B44): it starts when it is properly wrong, never in a review week, each strategy has its price and effect, the check after six weeks judges the result.
const vm = require('vm'), fs = require('fs');
const src = require('./src.js').mods('matchday.js').map(f => require('./src.js')(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const answer = (F, id, opt, ctx) => { F.G.inbox = F.G.inbox.filter(x => x.ev !== id); F.G.ap = 5; if (!F.addMsg(id, ctx)) return null; const msg = F.G.inbox[0]; F.resolve(msg, opt, 'you'); return msg; };
const bad = F => { const G = F.G; G.week = 12; G.phase = 'season'; G.form = ['L', 'L', 'L', 'L', 'D']; G.board.conf = 38; };
{ const F = game(5), G = F.G; ok(!F.turnTrouble(), 'a fresh season is not a crisis');
  bad(F); ok(F.turnTrouble(), 'four defeats and low board confidence is a crisis');
  G.queue = []; F.HOOK.seasonWeekly(); ok(G.queue.some(q => q.id === 'turn_call'), 'the weekly hook puts the board\'s question in the queue');
  for (const w of [10, 11, 19, 20, 29, 30]) { G.week = w; ok(!F.turnTrouble(), `never in board review week ${w}`); } G.week = 12;
  G.turn = { plan: 'wait', at: F.absWeek(), until: F.absWeek() + 8 }; ok(!F.turnTrouble(), 'not again while a plan is running'); G.turn = null; }
for (const [i, plan] of ['back', 'replace', 'invest', 'young', 'wait'].entries()) {
  const F = game(6), G = F.G; bad(F); const ctx = { pos: F.myPos(), exp: F.expectedRank(), L: 4, ppg: .6, conf: 38 }, cash0 = G.club.cash, base = F.teamStrength(); const coach0 = F.staff('coach');
  const msg = answer(F, 'turn_call', i, ctx);
  ok(msg && msg.done && G.turn && G.turn.plan === plan, `${plan}: the choice is made and the plan is set`);
  ok(G.later.some(l => l.id === 'turn_check'), `${plan}: the board's check is planned`);
  ok(G.mem && G.mem['turn_call:' + i], `${plan}: the choice is remembered (so it can echo later)`);
  if (plan === 'invest') { ok(G.club.cash < cash0, 'invest costs cash'); ok(F.teamStrength() > base + .2, `invest lifts the team (${base.toFixed(2)} to ${F.teamStrength().toFixed(2)})`); }
  if (plan === 'replace') ok(!F.staff('coach') && coach0, 'replace sacks the coach');
  if (plan === 'young') ok(G.push.academy > 0, 'go young puts weight on the academy');
  if (plan === 'wait') { const b0 = G.board.conf, f0 = G.st.fans; F.HOOK.seasonWeekly(); ok(G.board.conf < b0 && G.st.fans < f0, 'waiting costs board confidence and fans every week'); }
}
// the check after six weeks
const verdictOf = (F, pos0, form) => { const G = F.G; bad(F); G.form = form; const ctx = { plan: 'back', pos0, ppg0: .6, exp: 5 }; G.turn = { plan: 'back', at: F.absWeek() - 6, until: F.absWeek() + 2, pos0, ppg0: .6, grace: 0 }; const b0 = G.board.conf, msg = answer(F, 'turn_check', 0, ctx); return { b: G.board.conf - b0, t: F.EV.turn_check.title(ctx) }; };
{ const F = game(7), pos = F.myPos(); const good = verdictOf(F, pos + 4, ['W', 'W', 'D', 'W', 'W', 'W']), F2 = game(8), worse = verdictOf(F2, F2.myPos() - 3, ['L', 'L', 'L', 'D', 'L', 'L']);
  ok(/working/.test(good.t) && good.b > 0, `a working plan is recognised and rewarded (${good.t}, board ${good.b >= 0 ? '+' : ''}${good.b})`); ok(/not working/.test(worse.t) && worse.b < 0, `a failing plan is punished (${worse.t}, board ${worse.b})`); }
{ const F = game(9), G = F.G; bad(F); G.turn = { plan: 'young', at: F.absWeek() - 6, until: F.absWeek() + 2, pos0: 8, ppg0: .6, grace: 0 }; answer(F, 'turn_check', 1, { plan: 'young', pos0: 8, ppg0: .6, exp: 5 }); ok(G.later.some(l => l.id === 'turn_call') && !G.turn.plan, 'changing direction clears the plan and asks again soon');
  const F2 = game(10); bad(F2); F2.G.turn = { plan: 'wait', at: F2.absWeek() - 6, until: F2.absWeek() + 2, pos0: 8, ppg0: .6, grace: 0 }; const u0 = F2.G.turn.until; answer(F2, 'turn_check', 2, { plan: 'wait', pos0: 8, ppg0: .6, exp: 5 }); ok(F2.G.turn.until === u0 + 4 && F2.G.turn.grace > F2.absWeek(), 'asking for time extends the plan and pauses the erosion'); }
// old saves and save/load
{ const F = game(11), G = F.G; ok(F.turnEdge() === 0, 'no plan means no effect (an old save without G.turn)'); bad(F); answer(F, 'turn_call', 2, { pos: 8, exp: 5, L: 4, ppg: .6, conf: 38 }); const s = F.save(); ok(F.load(s) && F.G.turn && F.G.turn.plan === 'invest', 'the plan survives save and load'); }
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
