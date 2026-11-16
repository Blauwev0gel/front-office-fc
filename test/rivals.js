// Rival organisations: every club has its own coach, better ones work higher up, old saves get coaches lazily, coaches change over time.
const vm = require('vm'), fs = require('fs');
const src = require('./src.js').mods('matchday.js').map(f => require('./src.js')(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const rivals = F => Object.values(F.G.clubs).filter(c => !c.me);
const F = game(21), R = rivals(F);
ok(R.every(c => c.coach && c.coach.name && c.coach.q >= 0 && c.coach.q <= 2.6), `every rival has a coach with a quality in range (${R.length} clubs)`);
const avgQ = t => { const a = R.filter(c => c.tier === t).map(c => c.coach.q); return a.reduce((x, y) => x + y, 0) / a.length; };
ok(avgQ(1) > avgQ(8) + 0.3, `better coaches work higher up (tier 1 ${avgQ(1).toFixed(2)}, tier 8 ${avgQ(8).toFixed(2)})`);
const qs = R.map(c => c.coach.q); ok(Math.max(...qs) - Math.min(...qs) > 1.2, `coaches differ a lot between clubs (spread ${(Math.max(...qs) - Math.min(...qs)).toFixed(2)})`);
// old saves: no coaches at all, a full season must still run and the clubs get coaches
R.forEach(c => delete c.coach);
while (F.G.phase === 'season') F.endWeek();
ok(rivals(F).every(c => c.coach && c.coach.q >= 0), 'clubs without coaches (old save) get one when the season is played');
ok(rivals(F).every(c => Number.isFinite(c.str)), 'rival strengths stay finite');
// coaches change over the years
const before = new Map(rivals(F).map(c => [c.id, c.coach.name])); let changed = 0, seasons = 0;
while (seasons < 4 && F.G.phase !== 'sacked') { if (F.G.phase === 'review') { F.startSeason(); } if (F.G.phase === 'summer') { F.sumView(); F.sumPlanner(); F.sumAuto(F.rnd, false); } if (F.G.phase === 'preseason') { F.preSetTarget('accept'); F.finishPreseason(); } if (F.G.phase === 'press') { for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); } let n = 0; while (F.G.phase === 'season' && n++ < 60) { F.G.board.conf = 80; F.G.st.fans = 60; F.G.st.press = 60; F.G.squad.forEach(p => p.morale = 75); F.endWeek(); } seasons++; }
changed = rivals(F).filter(c => before.get(c.id) && before.get(c.id) !== c.coach.name).length;
ok(changed > 3, `coaches get replaced over a few seasons (${changed} of ${rivals(F).length} changed)`);
{ // a coach change in our division reaches the Gazette
  const F2 = game(22), mine = F2.G.divs[F2.G.club.tier].clubs.filter(i => i !== 0), other = Object.values(F2.G.clubs).find(c => !c.me && !mine.includes(c.id));
  F2.G.coachNews = [{ id: mine[0], old: 'Old Coach', name: 'New Coach', q: 2.2, s: F2.G.season }, { id: other.id, old: 'A B', name: 'C D', q: 1, s: F2.G.season }];
  F2.endWeek(); const st = (F2.G.paper && F2.G.paper.stories || []).filter(x => x.h === 'On the touchline');
  ok(st.length === 1 && /New Coach/.test(st[0].t) && /unhelpful/.test(st[0].t), 'a rival coach change in our division becomes a Gazette story (very good coach gets the dry line)');
  ok(!(F2.G.coachNews || []).length, 'news is used up or dropped, a club in another division is not reported');
}
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
