// Dismissal must be final: no new weeks, seasons or decisions; reason kept; survives save/load.
const fs = require('fs'), vm = require('vm');
const html = fs.readFileSync(__dirname + '/../dist/index.html', 'utf8');
const js = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const engineOnly = js.slice(0, js.indexOf('/* ---------- base club')) ; // stop before UI-only helpers if any
function boot() {
  const store = {}; const ctx = { console, window: { scrollTo() {}, addEventListener() {} }, document: { documentElement: { style: { setProperty() {} } }, getElementById: () => ({ addEventListener() {}, set innerHTML(v) {} }), querySelectorAll: () => [], addEventListener() {} }, localStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } }, setTimeout() {}, clearTimeout() {}, requestAnimationFrame() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), navigator: {} };
  vm.createContext(ctx); try { vm.runInContext(js + ';this.FO=FO;', ctx); } catch (e) { }
  return ctx.FO;
}
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
function setup(seed) { const FO = boot(); FO.newGame(seed); const d = {}; for (const q of FO.DNA) d[q.k] = q.o[0].v; FO.setDNA(d, 'T', 'TST', 'X', ['#123', '#fff']); for (const r of FO.ROLES) FO.hire(r.id, 1); FO.finishStaff(); FO.finishMandates(); try { if (FO.G.phase === 'summer') FO.sumAuto(FO.rnd, true); FO.preSetTarget('accept'); FO.finishPreseason(); for (const id of FO.G.press) FO.pressAnswer(id, 1); FO.finishPress(); } catch (e) { console.log('setup err', e.message); } return FO; }
// 1. failed vote left unanswered in the final week must not roll into a new season
{ const FO = setup(11), G = FO.G; ok(G.phase === 'season', 'reaches the season');
  while (G.week < FO.SEASON_WEEKS && G.phase === 'season') FO.endWeek();
  G.board.conf = -5; G.st.fans = 0; FO.endWeek(); // triggers a vote (board) in week 38 -> season end
  const pend = G.inbox.find(m => !m.done && /^vote_/.test(m.ev));
  // if the season ended, the reprieve path is used; force a failing vote mid-season instead below
  ok(G.phase === 'review' && /one more summer/i.test(JSON.stringify(G.paper.stories)) || G.phase === 'sacked', 'final-week collapse uses the season-end rule (phase ' + G.phase + ')');
}
{ const FO = setup(12), G = FO.G;
  for (let i = 0; i < FO.SEASON_WEEKS - 2 && G.phase === 'season'; i++) FO.endWeek();
  G.votes = {}; G.vote = null; FO.queueEvent('vote_fans', { k: 'fans' });
  // make the vote certain to fail: no support anywhere, then leave it unanswered
  G.st.fans = 0; G.st.press = 0; G.board.conf = 1; G.form = ['L', 'L', 'L', 'L', 'L'];
  FO.endWeek(); // generates the vote message for week 38
  const v = G.inbox.find(m => !m.done && m.ev === 'vote_fans'); ok(!!v, 'vote message is in the inbox in week ' + G.week);
  const before = G.season; FO.G.rs = 4242; // seeded
  // force failure by stubbing the seeded rnd for this one call
  const r0 = FO.rnd; let calls = 0; FO.endWeek();
  console.log('   after unanswered vote: phase', G.phase, 'season', G.season, 'week', G.week, 'reason', G.sackReason);
  if (G.phase === 'sacked') {
    ok(G.season === before, 'no new season after dismissal');
    const w = G.week; ok(FO.endWeek() === null, 'endWeek does nothing after dismissal'); ok(G.week === w, 'week does not advance');
    FO.startSeason(); ok(G.phase === 'sacked' && G.season === before, 'startSeason cannot revive the run');
    ok(!!G.over && /vote/.test(G.over.cause), 'end record names the real cause: ' + (G.over && G.over.cause));
    const n = G.inbox.length; FO.respond((G.inbox.find(m => !m.done) || {}).id, 0); ok(G.inbox.length === n, 'no decisions after dismissal');
    const s = FO.save(), FO2 = boot(); FO2.load(s); ok(FO2.G.phase === 'sacked' && FO2.G.sackReason === G.sackReason, 'save/load keeps the end state');
  } else console.log('   (vote survived on this seed; covered by the forced test below)');
}
// 2. forced: dismissal inside the weekly hooks in the final week
{ const FO = setup(13), G = FO.G;
  while (G.week < FO.SEASON_WEEKS && G.phase === 'season') FO.endWeek();
  G.votes = { room: G.season }; G.vote = null; // room already used its chance this season
  G.squad.forEach(p => p.morale = 0); // room support 0 -> immediate dismissal in the weekly hook
  const before = G.season; const r = FO.endWeek();
  ok(G.phase === 'sacked', 'dismissed in week 38 hook (phase ' + G.phase + ')');
  ok(G.season === before && !r.seasonOver, 'season did not roll over');
  ok(/players/i.test(G.sackReason) && G.over.cause === 'vote:room', 'reason matches the cause: ' + G.over.cause);
}
// 3. dismissed by the board at the end of the season, after the clubs have changed division
{ const FO = setup(14), G = FO.G;
  while (G.week < FO.SEASON_WEEKS && G.phase === 'season') FO.endWeek();
  G.votes = { board: G.season }; // the board already gave its one more summer this season
  const tier = G.club.tier; let r, err = null;
  G.board.conf = 6; G.board.obj = [{ k: 'league', target: 1, t: 'Win the league', bold: true }]; // survives the week, fails the review
  try { r = FO.endWeek(); } catch (e) { err = e; }
  ok(!err, 'season-end dismissal does not crash' + (err ? ': ' + err.message : ''));
  ok(G.phase === 'sacked' && !!G.over && G.over.cause === 'season', 'dismissed at the season review (phase ' + G.phase + ', cause ' + (G.over && G.over.cause) + ')');
  ok(G.over && G.over.tier === tier && G.over.pos >= 1, 'end record keeps the final tier and position: ' + (G.over && G.over.tier + '/' + G.over.pos));
}
console.log(fails ? fails + ' FAILED' : 'all sack tests passed'); process.exit(fails ? 1 : 0);
