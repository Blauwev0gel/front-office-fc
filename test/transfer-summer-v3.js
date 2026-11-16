// Transfer Summer V3 regression harness. Run: node test/transfer-summer-v3.js
// Uses the same source-module order as test/audit.js, including the player-facing summer2.js.
const assert = require('assert');
const vm = require('vm');
const read = require('./src.js');
const modules = ['engine.js', 'events.js', 'events2.js', 'briefs.js', 'academy.js',
  'academy2.js', 'recruit.js', 'summer.js', 'season.js', 'summer2.js', 'firstteam.js',
  'depts.js', 'levers.js', 'commercial.js', 'marketing.js', 'business.js',
  'academy3.js', 'recruitx.js', 'matchtalk.js', 'desk.js'];
const src = modules.map(read).join('\n');
function boot() {
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(src + '\n;this.FO=FO;', ctx);
  return ctx.FO;
}
function setup(seed) {
  const F = boot();
  F.newGame(seed);
  const dna = {};
  for (const q of F.DNA) dna[q.k] = q.o[0].v;
  F.setDNA(dna, 'Test United', 'TST', 'Testford', ['#123456', '#ffffff']);
  for (const r of F.ROLES) F.hire(r.id, 1);
  F.finishStaff();
  F.finishMandates();
  F.preSetTarget('accept');
  F.finishPreseason();
  for (const id of F.G.press) F.pressAnswer(id, 1);
  F.finishPress();
  return F;
}
function reachSummer(F) {
  let guard = 0;
  while (F.G.phase === 'season' && guard++ < 40) {
    F.G.board.conf = Math.max(F.G.board.conf, 80);
    F.G.club.cash = Math.max(F.G.club.cash, 300000);
    F.endWeek();
  }
  assert(guard <= 40, 'season did not finish');
  assert.strictEqual(F.G.phase, 'review', 'end-of-season review expected');
  F.startSeason();
  assert.strictEqual(F.G.phase, 'summer', 'player summer opens');
  assert(F.G.sum && F.G.sum.v2, 'player-facing summer v2 active');
}
function completeSummer(F) {
  assert.strictEqual(F.G.phase, 'summer');
  const snapshot = F.save();
  assert(F.load(snapshot), 'save/load survives the summer');
  F.sum2Auto(F.rnd, true);
  assert.notStrictEqual(F.G.phase, 'summer', 'summer must complete');
  assert(F.G.lastSummer, 'summer transfer record exists');
}
for (const seed of [42, 84, 126]) {
  const F = setup(seed);
  reachSummer(F);
  const season = F.G.season;
  completeSummer(F);
  assert.strictEqual(F.G.season, season, 'summer stays in the correct season');
  assert(F.G.squad.length >= 18, 'season starts with a playable squad');
  assert(F.G.club.cash === F.G.club.cash, 'cash remains a number');
  console.log('ok summer seed', seed, 'season', season, 'transfers', F.G.lastSummer.in.length);
}
console.log('Transfer Summer V3 regression tests passed.');
