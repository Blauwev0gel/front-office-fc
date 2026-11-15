// Academy metrics over many seasons with a passive CEO (staff defaults).
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = ['engine.js', 'events.js', 'events2.js', 'briefs.js', 'academy.js', 'academy2.js', 'recruit.js', 'summer.js', 'season.js', 'summer2.js'].map(f => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8')).join('\n');
const seasons = +process.argv[2] || 10, runs = +process.argv[3] || 8;
const rows = [];
for (let r = 0; r < runs; r++) {
  const ctx = { console }; vm.createContext(ctx); vm.runInContext(src + ';this.FO=FO;', ctx); const FO = ctx.FO;
  FO.newGame(500 + r * 131); const pick = a => a[Math.floor(FO.rnd() * a.length)];
  const d = {}; for (const q of FO.DNA) d[q.k] = pick(q.o).v; if (r % 2 === 0) d.talent = 'academy';
  FO.setDNA(d, 'T', 'T', 'T', []); for (const x of FO.ROLES) FO.hire(x.id, 1); FO.finishStaff(); FO.finishMandates();
  const pre = () => { FO.preSetTarget('accept'); const fo = FO.FOCUS.filter(f => !FO.G.board.obj.some(o => o.k === f.k)); FO.preToggleFocus(fo[0].k); FO.preToggleFocus(fo[1].k); FO.finishPreseason(); for (const id of FO.G.press) FO.pressAnswer(id, 1); FO.finishPress(); };
  pre(); let grads = 0, debuts = 0, revSum = 0, acadCost = 0, best = 0, intake = 0, dropped = 0, s = 0, bestList = [];
  for (; s < seasons; s++) {
    while (FO.G.phase === 'season') { for (const x of FO.ROLES) if (!FO.G.staff[x.id] && FO.G.cands[x.id]) FO.hire(x.id, 1); FO.endWeek(); if (FO.G.fin.last) acadCost += FO.G.fin.last.o.academy || 0; }
    if (FO.G.phase !== 'review') break;
    const rep = FO.G.lastReport; grads += rep.promoted.length; debuts += FO.G.ss.grads; revSum += FO.G.ss.rev;
    const top = FO.G.academy.reduce((m, p) => Math.max(m, FO.absStars(p.pa)), 0); best = Math.max(best, top);
    FO.G.acad.log.filter(l => l.season === FO.G.season).forEach(l => bestList.push(l.pot));
    FO.startSeason(); pre();
  }
  const a = FO.G.acad, cohortN = Object.values(a.cohorts).reduce((x, c) => x + c.length, 0);
  rows.push({ run: r, talent: d.talent, seasons: s, tier: FO.G.club.tier, gradsPerSeason: (grads / Math.max(1, s)).toFixed(2), debuts, grad4: bestList.filter(x => x >= 4).length, gradAvgPot: bestList.length ? (bestList.reduce((x, y) => x + y, 0) / bestList.length).toFixed(1) : '-', dropRate: cohortN ? (a.drop.filter(x => /burnt|school|interest/.test(x.why)).length / cohortN * 100).toFixed(0) + '%' : '-', attrition: (a.drop.length / Math.max(1, a.drop.length + a.log.length) * 100).toFixed(0) + '%', costPct: (acadCost / Math.max(1, revSum) * 100).toFixed(1) + '%', pipeline: ['U14', 'U16', 'U18', 'U21'].map(k => FO.G.academy.filter(p => FO.acadGrp(p) === k).length).join('/'), fac: FO.G.club.fac.youth, rep: Math.round(a.rep), cat: a.cat, honours: (a.titles || []).length + (a.cups || []).length, roi: FO.money(FO.acadView().roi.net) });
}
console.table(rows);
