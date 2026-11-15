const fs = require('fs'), path = require('path'), vm = require('vm');
const src = ['engine.js', 'events.js', 'events2.js', 'briefs.js', 'academy.js', 'academy2.js', 'recruit.js', 'summer.js', 'season.js', 'summer2.js'].map(f => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8')).join('\n');
const ctx = { console }; vm.createContext(ctx); vm.runInContext(src + '\n;this.FO=FO;', ctx); const FO = ctx.FO;
FO.newGame(+process.argv[2] || 8926); const pick = a => a[Math.floor(FO.rnd() * a.length)];
const d = {}; for (const q of FO.DNA) d[q.k] = pick(q.o).v; FO.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']);
for (const role of FO.ROLES) FO.hire(role.id, 1); FO.finishStaff(); FO.finishMandates();
FO.preSetTarget('accept'); FO.finishPreseason();
for (const id of FO.G.press) FO.pressAnswer(id, 0); FO.finishPress();
for (let w = 0; w < 22; w++) { const g = FO.G;
  for (const m of g.inbox.filter(m => !m.done && m.t && m.t.startsWith('rec_'))) { console.log('  ESC', m.t, FO.msgView(m).title); FO.respond(m.id, 0); }
  FO.endWeek(); const R = g.rec;
  const blocked = R.pipe.filter(x => x.blocked).map(x => x.blocked.join('/'));
  console.log('w', g.week, 'win', FO.recView().inWin, 'squad', g.squad.length, 'needs', FO.squadNeeds().join(','), 'budget', FO.money(FO.transferBudget()), 'thr', FO.money(FO.recView().threshold), 'wl', FO.recView().wageLimit|0, 'stages', JSON.stringify(R.pipe.reduce((a,x)=>(a[x.stage]=(a[x.stage]||0)+1,a),{})), 'blocked', blocked.slice(0,4).join(' '), 'log', R.log.length);
  R.pipe.filter(x => x.deal).forEach(x => console.log('   deal', x.stage, x.deal.rounds.join(' | ')));
}
const R = FO.G.rec; R.pipe.filter(x => x.stage === 'recommended').forEach(x => { const p = R.pool[x.pid]; console.log('REC', p && p.name, p && FO.money(p.ask), p && p.wageAsk, x.blocked, x.apAsked, R.know[x.pid].grade); });
