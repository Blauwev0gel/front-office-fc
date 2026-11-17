// B50: the winter window is its own phase, on the same machinery as the summer.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const keep = F => F.BACKERS.forEach(b => b.put(Math.max(b.get(), 50)));
const toWeek = (F, w) => { while (F.G.week < w && F.G.phase === 'season') { for (const m of F.G.inbox.filter(m => !m.done)) F.respond(m.id, 0); F.endWeek(); keep(F); } };
{
  const F = game(91), G = () => F.G;
  ok(G().club.winKitty > 0 && Math.abs(G().club.winKitty / (G().club.kitty + G().club.winKitty) - .25) < .05, 'a quarter of the kitty is held back for the winter (' + G().club.winKitty + ' of ' + (G().club.kitty + G().club.winKitty) + ')');
  toWeek(F, 8); ok(!F.winterDue(), 'no winter window in week 8');
  const star = G().squad.slice().sort((a, b) => b.ca - a.ca)[0], club = G().divs[Math.max(1, G().club.tier - 1)].clubs.find(x => x !== 0); F.EV.bid_star.opts[0].f({ pid: star.id, fee: 9000, club });
  toWeek(F, 17); ok(G().week === 17 && F.winterDue(), 'in week 17 the window is due'); const cash0 = G().club.cash;
  const wk0 = G().club.winKitty, kit0 = G().club.kitty;
  ok(F.winterOpen() && G().phase === 'summer' && G().sum.win && G().week === 17, 'it opens as its own phase, in week 17');
  ok(G().club.winKitty === 0 && G().club.kitty === kit0 + wk0, 'the money held back is released when it opens'); ok(!F.winterOpen() && G().winDone === G().season, 'and only once a season');
  ok(F.sum2Steps().length === 4 && F.sum2Steps()[0] === 'Winter meeting' && F.sum2Weeks().length === 3, 'with its own steps and three weeks'); ok(F.SUM2_ITEMS.brief === 'The winter brief', 'and its own words');
  ok(F.window_(), 'the window is open while the phase runs'); ok(F.sum2Responses().length > 0, 'the meeting has something to answer');
  const half = F.sum2Half(); ok(half && half.pos >= 1 && Number.isFinite(half.pts), 'the meeting starts from the first half of the season: ' + (half && `${half.pos}th, ${half.pts} pts`));
  const s0 = F.save(); ok(F.load(s0) && G().phase === 'summer' && G().sum.win && F.sum2Steps().length === 4, 'a save in the middle of the window loads as the winter window');
  F.sum2Auto(F.rnd, true);
  ok(G().phase === 'season' && G().week === 17 && G().sum.done, 'finishing returns to the season, still week 17'); ok(G().lastWinter && G().lastWinter.season === G().season, 'the result is kept'); ok(!F.window_(), 'the window is closed again, also in weeks 17 and 18'); ok(G().squad.length >= 18, 'the squad is at least eighteen');
  ok(!G().squad.includes(star) || !star.sale, 'the sale agreed in week 8 was settled inside the window (' + (G().squad.includes(star) ? 'still here' : 'gone') + ')');
  const ed = (() => { const F2 = game(92); toWeek(F2, 17); F2.winterOpen(); F2.G.sum.step = 2; return F2.sum2Edition(); })(); ok(ed.label === 'Winter' && /winter|window|Smart business|half measures|Questions/i.test(ed.head), 'the edition is the winter edition: ' + ed.head);
  toWeek(F, 24); ok(G().phase === 'season' && G().week >= 24 && !F.window_(), 'the season carries on after the window');
}
// headless runs that never open it keep the old weeks 17-18
{ const F = game(93); toWeek(F, 17); ok(F.window_(), 'without the phase, week 17 is still an open window for headless runs'); const w = F.G.club.winKitty; F.endWeek(); ok(w > 0 && F.G.club.winKitty === 0, 'and the winter money is released there too'); }
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
