// The Gazette: one edition per week, kept for the archive; old saves without editions still load.
const fs = require('fs'), vm = require('vm');
const src = ['engine.js', 'events.js', 'events2.js', 'briefs.js', 'academy.js', 'academy2.js', 'recruit.js', 'summer.js', 'season.js', 'summer2.js', 'firstteam.js', 'depts.js', 'levers.js', 'commercial.js', 'marketing.js', 'business.js', 'academy3.js', 'recruitx.js', 'matchtalk.js', 'desk.js', 'loop.js', 'dossiers.js', 'pathway.js', 'matchday.js'].map(f => fs.readFileSync(__dirname + '/../src/' + f, 'utf8')).join('\n');
function boot() { const ctx = { console, module: undefined }; vm.createContext(ctx); vm.runInContext(src + '\n;this.FO=FO;', ctx); return ctx.FO; }
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else if (process.argv[2]) console.log('ok', m); };
const FO = boot(); FO.newGame(777); const d = {}; for (const q of FO.DNA) d[q.k] = q.o[0].v; FO.setDNA(d, 'Test United', 'TST', 'Testford', ['#123', '#fff']); for (const r of FO.ROLES) FO.hire(r.id, 1);
FO.finishStaff && FO.finishStaff(); if (FO.G.phase === 'mandates' && FO.finishMandates) FO.finishMandates();
const pre = () => { if (FO.G.phase === 'summer') { FO.sumView(); FO.sumPlanner(); FO.sumAuto(FO.rnd, true); } if (FO.G.phase === 'preseason') { FO.preSetTarget('accept'); FO.G.meeting && FO.G.meeting.items.forEach((it, i) => FO.decideProposal(i, 'approve')); FO.finishPreseason(); } if (FO.G.phase === 'press') { for (const id of FO.G.press) FO.pressAnswer(id, 1); FO.finishPress(); } };
let guard = 0; while (FO.G.phase !== 'season' && guard++ < 10) { pre(); if (FO.G.phase === 'review' && FO.startSeason) FO.startSeason(); }
ok(FO.G.phase === 'season', 'season starts');
ok(FO.edView(0) === null || FO.edView(0).legacy, 'before the first match: no stored edition');
let cupWeek = false;
for (let w = 0; w < 30 && FO.G.phase === 'season'; w++) {
  FO.mdStories(); const before = FO.edCount(), wk = FO.G.week; const res = FO.endWeek(); if (!res) break;
  const ed = FO.edView(0);
  ok(FO.edCount() === Math.min(8, before + 1), `week ${wk}: one new edition`);
  ok(ed && ed.w === wk && ed.s === FO.G.season, `week ${wk}: edition carries its week`);
  ok(ed.head && !/undefined|NaN/.test(JSON.stringify(ed)), `week ${wk}: edition is complete`);
  if (res.ours) { ok(ed.match && ed.match.ug === res.ours.ug && ed.match.rat.length >= 11, `week ${wk}: match, score and ratings`); ok(ed.outs.length === (FO.G.mdS ? FO.G.mdS.list.length : 0), `week ${wk}: story outcomes`); ok(ed.table.length === 5 && ed.table.some(r => r.me), `week ${wk}: table with us`); ok(ed.bk.length === 4, `week ${wk}: backers`); }
  if (res.cup) { cupWeek = true; ok(ed.cup && ed.cup.oppName === res.cup.oppName, `week ${wk}: cup tie in the edition`); }
  // a story added during the week shows up as late news in the latest edition only
  FO.G.paper.stories.push({ h: 'Late', t: 'Something happened midweek.' });
  ok(FO.edView(0).late.some(x => x.h === 'Late'), 'late news on the latest edition'); ok(!FO.edView(0).stories.some(x => x.h === 'Late'), 'the stored edition is not changed');
  if (FO.edCount() > 1) ok(!FO.edView(1).late, 'older editions have no late news');
}
ok(FO.edCount() <= 8, 'the archive keeps at most eight editions');
const s = FO.save(), FO2 = boot(); FO2.load(s); ok(FO2.edCount() === FO.edCount(), 'editions survive save and load');
const old = JSON.parse(s); delete old.eds; const FO3 = boot(); FO3.load(JSON.stringify(old)); const v = FO3.edView(0); ok(v && v.legacy && v.head, 'an old save without editions still shows the paper');
console.log('cup week seen:', cupWeek); console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
