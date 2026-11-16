// Memory and callbacks: the CEO's own choices are remembered, far echoes are scheduled, callback and top-flight events work.
const vm = require('vm'), fs = require('fs');
const files = require('./src.js').mods('matchday.js');
const src = files.map(f => require('./src.js')(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const answer = (F, id, opt, by, ctx) => { F.G.inbox = F.G.inbox.filter(x => x.ev !== id); F.G.ap = 5; if (!F.addMsg(id, ctx)) return null; const msg = F.G.inbox[0]; F.resolve(msg, opt, by); return msg; };

{ // 1. memory only for the CEO's own choices
  const F = game(11), p = F.G.squad[3]; answer(F, 'raise_demand', 1, 'staff', { pid: p.id, name: p.name, ask: 999 });
  ok(!(F.G.mem || {})['raise_demand:1'], 'a choice made by a head is not remembered as the CEO\'s');
  answer(F, 'raise_demand', 1, 'you', { pid: p.id, name: p.name, ask: 999 });
  const r = F.G.mem && F.G.mem['raise_demand:1']; ok(!!r && r.c.pid === p.id && r.s === F.G.season, 'the CEO\'s own choice is remembered with its context');
  // 2. windows
  r.at = F.absWeek() - 40;
  ok(!!F.recall('raise_demand:1', 34, 136), 'recall finds a choice made 40 weeks ago in a 34 to 136 week window');
  ok(!F.recall('raise_demand:1', 60, 100) && !F.recall('raise_demand:0', 0), 'recall is null outside the window and for a choice never made');
  // 6. save and load keep memory
  const s = F.save(); ok(F.load(s) && !!F.G.mem['raise_demand:1'], 'memory survives save and load');
}
{ // 3. far echoes
  const F = game(12); F.G.echo = []; answer(F, 'ticket_protest', 0, 'you');
  const near = F.G.echo.find(e => e.k === 'ticket_protest:0'), far = F.G.echo.find(e => e.k === 'far:ticket_protest:0');
  ok(!!near && !!far && far.at >= F.absWeek() + 34 && near.at < F.absWeek() + 9, `a decision echoes now and seasons later (near +${near && near.at - F.absWeek()}, far +${far && far.at - F.absWeek()} weeks)`);
}
{ // 4. callbacks: only with memory, and every option runs
  const cases = { cb_raise_refused: ['raise_demand:1', 'pid'], cb_star_kept: ['bid_star:1', 'pid'], cb_prospect_kept: ['clash_prospect:1', 'pid'], cb_betting: ['bet_sponsor:0'], cb_tickets: ['ticket_protest:1'] };
  for (const [id, [key, pid]] of Object.entries(cases)) {
    const F = game(13); F.G.week = 10; const e = F.EV[id], p = F.G.squad[2];
    ok(!e.cond(), `${id}: silent without the memory`);
    (F.G.mem = F.G.mem || {})[key] = { at: F.absWeek() - 45, s: F.G.season - 1, c: pid ? { pid: p.id, name: p.name } : {} };
    ok(!!e.cond(), `${id}: appears when the CEO once chose ${key}`);
    let good = true; for (let o = 0; o < e.opts.length; o++) { try { const f = game(13); f.G.week = 10; f.G.mem = { [key]: { at: f.absWeek() - 45, s: 1, c: pid ? { pid: f.G.squad[2].id, name: f.G.squad[2].name } : {} } }; const msg = answer(f, id, o, 'you'); if (!msg || !msg.done || !String(f.G.inbox[0].out || f.G.inbox[0].res || 'x')) good = false; } catch (err) { good = false; console.log('   ', id, o, err.message); } }
    ok(good, `${id}: all ${e.opts.length} options resolve without error`);
  }
}
{ // 5. top flight only
  for (const id of ['top_wage_spiral', 'top_takeover', 'top_complacency', 'top_poached']) {
    const hi = game(14); hi.G.week = 10; hi.G.club.tier = 2; hi.G.board.conf = 90; const lo = game(14); lo.G.week = 10; lo.G.club.tier = 6; lo.G.board.conf = 90;
    ok(hi.EV[id].cond() && !lo.EV[id].cond(), `${id}: top two divisions only`);
    let good = true; for (let o = 0; o < hi.EV[id].opts.length; o++) { try { const f = game(14); f.G.week = 10; f.G.club.tier = 2; f.G.board.conf = 90; const msg = answer(f, id, o, 'you'); if (!msg || !msg.done) good = false; } catch (err) { good = false; console.log('   ', id, o, err.message); } }
    ok(good, `${id}: all options resolve without error`);
  }
}
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
