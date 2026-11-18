// B58 first slice: "A base of our own". Parties with their own aims, research, routes, talks in rounds, the board,
// building with setbacks, an asset with obligations, and a world that moves on when the CEO does nothing.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; for (const k in F.PARK) F.PARK[k] = false; /* these tests cover parked systems (B66) */ F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const answerAll = F => { for (const m of F.G.inbox.filter(m => !m.done && m.ev !== 'base_board')) F.respond(m.id, 0); };
const talk = (F, ...ids) => { F.convoOpen('fin'); for (const id of ids) { const v = F.convoView('fin'); if (v && v.opts.some(o => o.id === id)) F.convoAnswer(id); } const v = F.convoView('fin'); const log = v ? v.log.slice() : []; F.convoClose(); return { v, log }; };
const traj = F => (F.G.agr || []).filter(a => a.k === 'traj').slice(-1)[0];
function withSite(seed, trait) { const F = game(seed); answerAll(F); F.endWeek(); F.parties().council.trait = trait || F.parties().council.trait; F.parties().council.trust = 60; F.G.talks = {}; const r = talk(F, 't_meet'); return { F, r }; }
function toRoute(F) { F.G.talks = {}; talk(F, 't_base'); answerAll(F); F.endWeek(); F.G.talks = {}; }

// 1. the opportunity comes from the council's own situation, or because the CEO asks
{ const F = game(1001); let seen = false; for (let w = 0; w < 30 && !seen && F.G.phase === 'season'; w++) { answerAll(F); F.endWeek(); seen = !!F.councilSite(); }
  ok(seen, 'the council puts land on the market by itself during a season');
  const { F: F2, r } = withSite(1002, 'growth'); ok(!!F2.councilSite() && r.log.some(l => l.who === 'council'), 'or the CEO asks the council and it answers in its own voice'); }

// 2. research, then routes with different parties; each route gives a different state
function routeRun(seed, route, cards) { const { F } = withSite(seed, 'community'); F.G.club.cash = 60000; toRoute(F); const A = traj(F); if (route === 'inv') { F.parties().investor.active = true; A.find.inv = F.parties().investor.name; }
  const v = talk(F, 't_base', 'b_' + route, ...(cards || []), 'b_deal').log; if (A.stage === 'board') { answerAll(F); F.endWeek(); const m = F.G.inbox.find(x => x.ev === 'base_board' && !x.done); if (m) { F.G.board.conf = 80; F.respond(m.id, 0); } }
  for (let w = 0; w < 18 && A.stage === 'build'; w++) { answerAll(F); F.endWeek(); } return { F, A, v }; }
{ const { F: Fr } = withSite(1003, 'community'); toRoute(Fr); const A = traj(Fr); ok(A && A.stage === 'route' && A.find && A.find.price > 0, `Finance researched it for a week: land ${A && A.find.price}, building ${A && A.find.build}`);
  const r0 = talk(Fr, 't_base'); ok(r0.v.opts.some(o => o.id === 'b_buy') && r0.v.opts.some(o => o.id === 'b_lease') && r0.log.some(l => l.who === 'council'), 'the options come with Finance, the council and the coach in the room'); }
const buy = routeRun(1004, 'buy'), lease = routeRun(1004, 'lease'), inv = routeRun(1004, 'inv');
ok(buy.A.res === 'done' && buy.F.G.club.assets.base.held === 'own' && buy.F.G.club.assets.base.rent === 0, `buy: the club owns the base (${buy.A.out})`);
ok(lease.A.res === 'done' && lease.F.G.club.assets.base.held === 'lease' && lease.F.G.club.assets.base.rent > 0 && lease.F.G.club.assets.base.community > 0, `lease: rent and community hours (${lease.A.out})`);
ok(inv.A.res === 'done' && inv.F.parties().investor.seat && /Training Centre/.test(inv.F.G.club.assets.base.namedBy || ''), `with the investor: his name and a board seat (${inv.A.out})`);
ok(lease.F.G.club.rent > buy.F.G.club.rent, 'the lease rent becomes a real weekly cost in the club accounts');

// 3. talks: the same card lands differently depending on the council
{ const a = withSite(1005, 'community').F, b = withSite(1005, 'money').F; for (const X of [a, b]) { X.parties().council.trust = 55; toRoute(X); X.parties().council.site.dev = 0.2; }
  talk(a, 't_base', 'b_lease', 'b_comm'); talk(b, 't_base', 'b_lease', 'b_comm'); const ra = traj(a).deal.rent, rb = traj(b).deal.rent;
  ok(ra < rb, `offering pitch time moves a community-minded council (rent ${ra}) more than a council that needs money (rent ${rb})`); }

// 4. the CEO does nothing: the other bidder wins, the chance is gone, no penalty, the council remembers
{ const { F } = withSite(1006, 'money'); const t0 = F.parties().council.trust, conf0 = F.G.board.conf; let k = 0; while (F.councilSite() && k++ < 25) { answerAll(F); F.endWeek(); }
  ok(!F.councilSite() && F.parties().council.memory.some(m => /sold elsewhere/.test(m.t)), 'left alone, the land goes to someone else and the council remembers');
  ok(F.parties().council.trust === t0, 'no penalty for not acting'); }

// 5. someone else takes it while the CEO hesitates in the talks
{ const { F } = withSite(1007, 'growth'); toRoute(F); talk(F, 't_base', 'b_buy'); const A = traj(F); F.parties().council.site.dev = 0.99; let k = 0; while (!A.res && k++ < 4) { answerAll(F); F.endWeek(); }
  ok(A.res === 'lost' && /went to/.test(A.out), `waiting too long in the talks: ${A.out}`); }

// 6. the board decides on debt or a seat; a refusal closes that route
{ const { F } = withSite(1008, 'community'); F.G.club.cash = 2000; toRoute(F); talk(F, 't_base', 'b_buy', 'b_deal'); const A = traj(F); answerAll(F); F.endWeek(); const m = F.G.inbox.find(x => x.ev === 'base_board' && !x.done);
  ok(A.stage === 'board' && !!m && A.loan > 0, `a loan of ${A.loan} goes to the board`); if (m) { F.G.board.conf = 5; F.staff('fin').at = [1, 1, 1]; F.respond(m.id, 0); }
  ok(A.stage === 'route' && /board said no/.test(A.log.slice(-1)[0].t), 'with low confidence the board says no, and the CEO is back at the routes'); }

// 7. building: setbacks explained, obligations and the effect on player development
{ const r = routeRun(1009, 'buy'); const B = r.F.G.club.assets.base; ok(r.F.G.club.fac.train === B.quality - (B.community >= 8 ? 1 : 0), `the base sets the training level the development model already uses (${r.F.G.club.fac.train})`);
  ok(r.A.log.length >= 3, `the build log shows what happened (${r.A.log.map(l => l.t).join(' | ').slice(0, 160)}…)`); }

// 8. old saves: an existing training level becomes an owned base; the old project is gone
{ const F = game(1010); const G = JSON.parse(F.save()); G.v = 4; G.club.fac.train = 6; delete G.club.assets; ok(F.load(JSON.stringify(G)) && F.G.club.assets.base && F.G.club.assets.base.quality === 6 && F.G.club.assets.base.held === 'own', 'an old save with a level-6 ground gets an owned base of quality 6');
  F.endWeek(); ok(F.G.phase === 'season', 'and plays on'); }
{ const F = game(1011); for (let w = 0; w < 20; w++) { answerAll(F); F.endWeek(); } const props = JSON.stringify(F.G.meeting || {}) + JSON.stringify(F.G.projects || []); ok(!/train_ground/.test(props), 'the old pay-and-wait training ground project no longer appears'); }

// 9. determinism and save/load mid-trajectory
{ const a = routeRun(1012, 'lease'), b = routeRun(1012, 'lease'); ok(a.F.save() === b.F.save(), 'same seed, same choices, same club');
  const { F } = withSite(1013, 'community'); toRoute(F); talk(F, 't_base', 'b_lease'); const s = F.save(); F.load(s); const A = traj(F); ok(A && A.stage === 'talks' && A.deal && A.deal.rent > 0, 'save and load during the talks keeps the terms'); }

console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
