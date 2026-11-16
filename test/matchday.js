// Match day: stories before kick-off, outcomes and a turning point after, over several seasons.
const fs = require('fs'), vm = require('vm');
const src = ['engine.js', 'events.js', 'events2.js', 'events3.js', 'briefs.js', 'academy.js', 'academy2.js', 'recruit.js', 'summer.js', 'season.js', 'summer2.js', 'firstteam.js', 'depts.js', 'levers.js', 'commercial.js', 'marketing.js', 'business.js', 'academy3.js', 'recruitx.js', 'matchtalk.js', 'desk.js', 'loop.js', 'dossiers.js', 'pathway.js', 'matchday.js'].map(f => require('./src.js')(f)).join('\n');
function boot() { const ctx = { console, module: undefined }; vm.createContext(ctx); vm.runInContext(src + '\n;this.FO=FO;', ctx); return ctx.FO; }
let fails = 0, weeks = 0, stories = 0, tags = {}, outs = 0, tps = 0; const ok = (c, m) => { if (!c) { fails++; if (fails < 15) console.log('FAIL', m); } };
for (let r = 0; r < 4; r++) {
  const FO = boot(); FO.newGame(4242 + r * 977); const d = {}; for (const q of FO.DNA) d[q.k] = q.o[r % q.o.length].v;
  FO.setDNA(d, 'Test United', 'TST', 'Testford', ['#123', '#fff']); for (const role of FO.ROLES) FO.hire(role.id, 1); FO.finishStaff && FO.finishStaff();
  const pre = () => { if (FO.G.phase === 'summer') { FO.sumView(); FO.sumPlanner(); FO.sumAuto(FO.rnd, true); } if (FO.G.phase === 'preseason') { FO.preSetTarget('accept'); FO.G.meeting && FO.G.meeting.items.forEach((it, i) => FO.decideProposal(i, 'approve')); FO.finishPreseason(); } if (FO.G.phase === 'press') { for (const id of FO.G.press) FO.pressAnswer(id, 1); FO.finishPress(); } };
  if (FO.G.phase === 'mandates' && FO.finishMandates) FO.finishMandates();
  for (let s = 0; s < 2; s++) {
    let guard = 0; while (FO.G.phase !== 'season' && guard++ < 10) { pre(); if (FO.G.phase === 'review' && FO.startSeason) FO.startSeason(); }
    while (FO.G.phase === 'season') {
      const P = FO.mtPreview(), S = FO.mdStories();
      ok(Array.isArray(S) && S.length <= 3, 'at most three stories');
      if (P) ok(S.length >= 1, 'a match week has at least one story');
      for (const x of S) { stories++; tags[x.tag] = (tags[x.tag] || 0) + 1; ok(FO.G.squad.some(p => p.id === x.pid) || FO.G.academy.some(p => p.id === x.pid), 'story player exists'); ok(x.t && !/undefined|NaN/.test(x.t), 'story text: ' + x.t); }
      ok(FO.mdStories() === S, 'stories are stable within the week');
      const save = JSON.stringify(FO.G); ok(save.includes('"mdS"'), 'stories are saved');
      const res = FO.endWeek(); weeks++; if (!res) break;
      if (res.ours) { const O = FO.mdOutcomes(res.ours); ok(O.length === S.length, 'one outcome per story'); for (const o of O) { outs++; ok(o.t && !/undefined|NaN/.test(o.t), 'outcome text: ' + o.t); } const tp = FO.mdTurning(res.ours); if (tp) { tps++; ok(tp.m >= 0 && tp.t, 'turning point'); } }
      if (res.sacked) break;
    }
    if (FO.G.phase === 'sacked') break;
    if (FO.G.phase === 'review' && FO.startSeason) FO.startSeason();
  }
}
console.log(`weeks ${weeks}, stories ${stories}, outcomes ${outs}, turning points ${tps}`); console.log('tags', JSON.stringify(tags));
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
