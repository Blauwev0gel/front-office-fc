// CEO season integration: real league progression, dedicated winter and summer tickers, cross-season agreements.
// No fabricated signings. Isolated migration/accounting edge cases may construct explicit test state.
'use strict';
const assert = require('node:assert/strict'), vm = require('node:vm'), R = require('./src.js');
const code = R.mods('matchday.js').map(f => R(f)).join('\n');
let checks = 0;
const ok = (truth, label) => { assert.ok(truth, label); console.log('PASS', label); checks++; };
function game(seed) {
  const c = { console }; vm.createContext(c); vm.runInContext(code + ';this.FO=FO;', c);
  const F = c.FO; F.newGame(seed); const dna = {}; for (const q of F.DNA) dna[q.k] = q.o[0].v;
  F.setDNA(dna, 'Season FC', 'SFC', 'Seasonton', ['#123456', '#ffffff']);
  for (const r of F.ROLES) F.hire(r.id, 1);
  F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason();
  for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress();
  F.G.club.cash = 2000000; // controlled financial buffer, no artificially completed transfers
  return F;
}
function keep(F) { F.G.board.conf = Math.max(F.G.board.conf, 75); for (const b of F.BACKERS) b.put(Math.max(b.get(), 60)); }
function week(F) { keep(F); for (const m of F.G.inbox.filter(m => !m.done)) F.respond(m.id, 0); F.endWeek(); keep(F); }
function until(F, target) { let n = 0; while (F.G.phase === 'season' && F.G.week < target && n++ < 40) week(F); ok(F.G.phase === 'season' && F.G.week === target, 'reached week ' + target + ' with real matches'); }
function toReview(F) { let n = 0; while (F.G.phase === 'season' && n++ < 37) week(F); ok(F.G.phase === 'review', 'completed competitive season ' + F.G.season); }
function promise(F) {
  const opened = F.convoOpen('dof'); ok(!opened || !opened.err, 'DoF conversation opens');
  const v = F.convoView('dof'); ok(v && v.opts.some(o => o.id === 't_squad'), 'the CEO can raise a real squad need');
  F.convoAnswer('t_squad'); const options = F.convoView('dof').opts;
  ok(options.some(o => o.id === 'a_prio'), 'DoF offers an accountable priority');
  F.convoAnswer('a_prio'); F.convoClose(); const a = (F.G.agr || []).filter(x => x.k === 'pos' && !x.res).slice(-1)[0];
  ok(!!a, 'the CEO and DoF sign a persistent recruitment agreement'); return a;
}
function press(F) { for (const id of F.G.press || []) F.pressAnswer(id, 1); if (F.G.phase === 'press') F.finishPress(); }
const F = game(192);
until(F, 12);
let winterDeal = promise(F);
until(F, 17);
ok(F.winterDue() && F.winterOpen(), 'the dedicated winter transfer phase opens');
ok(F.G.phase === 'summer' && F.G.sum.win && F.sum2Weeks().length === 3, 'the dedicated three-tick winter route is active');
const saveW = F.save(); ok(F.load(saveW) && F.G.sum.win, 'save/load preserves a winter in progress');
winterDeal = F.G.agr.find(x => x.id === winterDeal.id); // JSON save/load creates new state objects
F.sum2Auto(F.rnd, true);
ok(F.G.phase === 'season' && F.G.lastWinter, 'the winter meeting, ticker, deadline and debrief complete');
ok(F.G.sum.mt.brief.prios.includes(winterDeal.pos), 'signed winter brief preserves the earlier CEO agreement on ' + winterDeal.pos);
ok(F.G.rec.plan.prios.some(x => x.pos === winterDeal.pos) || winterDeal.done, 'the winter recruitment pipeline honours the agreement or delivered it');
until(F, 21);
ok(!!winterDeal.res, 'winter agreement receives a post-window verdict');
let summerDeal = promise(F);
ok(summerDeal.by > F.SEASON_WEEKS, 'agreement after winter is reviewed after the next summer, not outside a window');
toReview(F); F.startSeason();
ok(F.G.season === 2 && F.G.phase === 'summer', 'season rollover enters the separate summer phase');
ok(!summerDeal.res, 'existing agreement survives season rollover before the summer brief');
const saveS = F.save(); ok(F.load(saveS) && F.G.phase === 'summer', 'save/load preserves summer and open agreement');
summerDeal = F.G.agr.find(x => x.id === summerDeal.id); // refresh reference after JSON load
F.sum2Auto(F.rnd, true);
ok(F.G.sum.mt.brief.prios.includes(summerDeal.pos), 'summer brief preserves the earlier recruitment agreement');
ok(!!F.G.lastSummer, 'summer ticker, deadline and debrief complete');
press(F); ok(F.G.phase === 'season', 'season 2 begins after summer and press');
until(F, 4);
ok(!!summerDeal.res, 'carried-over recruitment agreement is eventually reviewed in season 2');
toReview(F);
ok(F.G.season === 2, 'two complete competitive seasons were played');

// A coach agreement made just before rollover must retain actual match evidence after first-team history resets.
const C = game(193); until(C, 31);
for (let i = 0; i < 4; i++) C.G.ft.games.push({ r: 'L', ug: 0, tg: 3, ux: 0.8, tx: 2.1 }); // controlled signal fixture only, NOT a transfer
C.convoOpen('dof'); C.convoAnswer('t_form');
ok(C.convoView('dof').opts.some(o => o.id === 'i_back'), 'a late-season CEO initiative can be accepted');
C.convoAnswer('i_back'); C.convoClose();
const a = C.G.agr.find(x => x.k === 'ini' && x.kind === 'back' && !x.res);
ok(!!a && a.by > C.SEASON_WEEKS && Array.isArray(a.matches), 'late-season coach agreement has a future season-aware deadline');
toReview(C); ok(a.matches.some(m => m.season === 1), 'actual prior-season match evidence persists in the agreement');
C.startSeason(); C.sum2Auto(C.rnd, true); press(C);
until(C, 4);
ok(a.matches.some(m => m.season === 2), 'match evidence also records actual games in the new season');
ok(a.S1 && a.S1.n >= 4 && a.res, 'the review evaluates matches across both seasons despite first-team history reset');

// Edge case: the same position has multiple historical approvals. One signing consumes each only once and closes both.
const E = game(194), pos = 'CB';
const old = [2000, 2000].map((funds, i) => ({ id: 99001 + i, k: 'ini', kind: 'plan', owner: 'dof', pos, funds, used: 0, by: E.absWeek() + 8, mw: E.G.week, log: [] }));
E.G.agr = old;
ok(E.agrAuthFor(pos) === 4000, 'overlapping historical approvals are independently accounted');
E.agrUse(pos, 3500, 'Signed player');
ok(old[0].used + old[1].used === 3500 && old.every(x => x.done) && E.agrAuthFor(pos) === 0, 'real signing settlement distributes the reserve draw without leaving stale authority');

// Legacy generic exception: preserve only when attributable to a single live negotiation, otherwise revoke safely.
const L = game(195), oldSave = JSON.parse(L.save()); oldSave.rec.extra = 2000; delete oldSave.rec.extraPid;
ok(L.load(JSON.stringify(oldSave)) && L.G.rec.extra === 0, 'unattributed old generic exception is safely expired');
const midSave = JSON.parse(L.save()), pid = Number(Object.keys(midSave.rec.pool)[0]);
midSave.rec.extra = 1800; delete midSave.rec.extraPid;
midSave.rec.pipe.push({ pid, stage: 'negotiating', exAsked: true, deal: { offer: 300, cap: 2000, rounds: [], round: 1 }, log: [] });
ok(L.load(JSON.stringify(midSave)) && L.G.rec.extraPid === pid, 'provable historical exception is bound to its single existing target');
const stable = L.save(); ok(L.load(stable) && L.save() === stable, 'legacy migration is idempotent');
console.log('ALL ' + checks + ' CEO-SEASON CHECKS PASSED');
