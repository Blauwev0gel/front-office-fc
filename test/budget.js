// The season budget line must be honest: env 0 is flagged, fixed costs are exposed, and the numbers are finite.
const fs = require('fs'), vm = require('vm');
const src = require('./src.js').mods('desk.js', ['academy3.js']);
const files = require('./src.js').mods('pathway.js');
const code = files.map(f => require('./src.js')(f)).join('\n');
let bad = 0, none = 0, est = 0, n = 0;
for (let r = 0; r < 4; r++) {
  const ctx = { console, module: undefined }; vm.createContext(ctx); vm.runInContext(code + '\n;this.FO=FO;', ctx); const FO = ctx.FO;
  FO.newGame(500 + r * 31);
  const d = {}; for (const q of FO.DNA) d[q.k] = q.o[r % q.o.length].v;
  FO.setDNA(d, 'Test United', 'TST', 'Testford', ['#123', '#fff']);
  for (const role of FO.ROLES) FO.hire(role.id, 1);
  FO.finishStaff(); FO.finishMandates();
  if (FO.G.phase === 'summer') { FO.sumView(); FO.sumPlanner(); FO.sumAuto(FO.rnd, false); }
  FO.preSetTarget('accept'); FO.finishPreseason && FO.finishPreseason();
  for (const id of FO.G.press || []) { const q = FO.PRESS.find(p => p.id === id); FO.pressAnswer(id, 0); } FO.finishPress && FO.finishPress();
  for (let w = 0; w < 12 && FO.G.phase === 'season'; w++) {
    const V = FO.bizView(); n++;
    const ok = Number.isFinite(V.env) && Number.isFinite(V.rev) && Number.isFinite(V.other) && V.none === (V.env <= 0) && V.ok === (V.spend <= V.env);
    if (!ok) { bad++; console.log('BAD', r, w, JSON.stringify({ env: V.env, rev: V.rev, other: V.other, none: V.none, ok: V.ok })); }
    if (V.none) { none++; if (!(V.other >= V.rev * 0.97 - 1)) { bad++; console.log('none but fixed costs do not pass revenue', V.other, V.rev); } }
    if (V.est) est++;
    FO.endWeek();
  }
}
console.log(`checked ${n} weeks, ${none} with no room, ${est} early estimates, ${bad} bad`);
process.exit(bad ? 1 : 0);
