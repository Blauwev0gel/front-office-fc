// The pathway storyline: routes, free questions, agreements, autonomous execution, evaluation, edge cases.
const fs = require('fs'), vm = require('vm');
const html = fs.readFileSync(__dirname + '/../dist/index.html', 'utf8');
const js = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
function boot() { const store = {}; const ctx = { console, window: { scrollTo() {}, addEventListener() {} }, document: { documentElement: { style: { setProperty() {} } }, getElementById: () => ({ addEventListener() {}, set innerHTML(v) {} }), querySelectorAll: () => [], addEventListener() {} }, localStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } }, setTimeout() {}, clearTimeout() {}, requestAnimationFrame() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), navigator: {} }; vm.createContext(ctx); try { vm.runInContext(js + ';this.FO=FO;', ctx); } catch (e) { } return ctx.FO; }
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
function setup(seed, talent) { const FO = boot(); FO.newGame(seed); const d = {}; for (const q of FO.DNA) d[q.k] = q.o[0].v; if (talent) d.talent = talent; FO.setDNA(d, 'T', 'TST', 'X', ['#123', '#fff']); for (const r of FO.ROLES) FO.hire(r.id, 1); FO.finishStaff(); FO.finishMandates(); if (FO.G.phase === 'summer') FO.sumAuto(FO.rnd, true); FO.preSetTarget('accept'); FO.finishPreseason(); for (const id of FO.G.press) FO.pressAnswer(id, 1); FO.finishPress(); return FO; }
const msg = (FO, ev) => FO.G.inbox.find(m => !m.done && m.ev === ev);
function toMeeting(FO) {
  FO.G.pwLog = [{ s: FO.G.season }]; // keep the natural trigger out of this scripted test
  for (let i = 0; i < 5; i++) FO.endWeek();
  // give the academy a clear talent so the storyline has a subject
  const G = FO.G, ta = FO.tierAvg(G.club.tier), xi = (G.ft && G.ft.xiPrev) || [];
  // a realistic subject: an 18-year-old academy player just below the weakest starter in an outfield position
  const reg = G.squad.filter(p => p.pos !== 'GK' && xi.includes(p.id)).sort((a, b) => a.ca - b.ca)[0];
  const t = FO.genPlayer({ pos: reg.pos, age: 18, ca: reg.ca - 0.8, region: 'dom' }); t.academy = true; t.pa = Math.max(t.pa, ta + 2.5); G.academy.push(t);
  G.club.kitty = Math.max(G.club.kitty || 0, 1e5);
  G.pw = null; const started = FO.pwStart(true); if (!started) console.log('     start failed', !!t, G.pw); FO.endWeek();
  return started;
}
function run(route, opts = {}) {
  const FO = setup(opts.seed || 21, opts.talent); const G = FO.G;
  ok(toMeeting(FO), `[${route}] storyline starts when the dilemma exists`);
  let sig = msg(FO, 'pw_signal'); for (let i = 0; i < 3 && !sig; i++) { FO.endWeek(); sig = msg(FO, 'pw_signal'); } if (!sig) console.log('     debug', JSON.stringify({ pw: G.pw && G.pw.stage, q: G.queue, inbox: G.inbox.filter(m => /^pw/.test(m.ev)).map(m => [m.ev, m.done, m.by]) })); ok(!!sig, `[${route}] signal message arrives`);
  if (opts.ignore) { FO.endWeek(); FO.endWeek(); } else { G.ap = 3; FO.respond(sig.id, 0); FO.endWeek(); }
  let meet = msg(FO, 'pw_meet');
  if (!opts.ignore) { ok(!!meet, `[${route}] meeting message arrives`); const ap = G.ap; ['coach', 'acad', 'dof'].forEach(r => FO.pwAsk(r)); ok(G.ap === ap, `[${route}] follow-up questions cost no actions`); ok(Object.keys(G.pw.asked).length === 3 && Object.values(G.pw.asked).every(a => a && a.length > 10), `[${route}] every question gets an answer`);
    const idx = ['youth', 'exp', 'phase'].indexOf(route); FO.respond(meet.id, idx); }
  else { if (meet) FO.endWeek(); }
  const A = G.pw && G.pw.ag; ok(!!A, `[${route}] agreement is stored`);
  if (!A) return FO;
  ok(['cause', 'owner', 'route', 'means', 'evalAt', 'ind', 'obj'].every(k => A[k] != null), `[${route}] agreement has cause, owner, direction, means, evaluation date, indicators, objections`);
  if (opts.ignore) ok(A.delegated === true || /staff/i.test(JSON.stringify(G.inbox.filter(m => /^pw_/.test(m.ev)).map(m => m.by))), `[${route}] ignored messages: staff decided (${A.route})`);
  if (opts.fireCoach) { FO.endWeek(); G.ap = 3; FO.fire('coach'); }
  const save = opts.save ? FO.save() : null;
  for (let i = 0; i < 7 && !msg(FO, 'pw_eval') && G.phase === 'season'; i++) FO.endWeek();
  const ev = msg(FO, 'pw_eval'); ok(!!ev, `[${route}] evaluation arrives on the agreed date`);
  if (ev) { const E = G.pw.ev; ok(E && E.lens.length === 4, `[${route}] evaluation has four lenses`); console.log('     verdict:', E.verdict); console.log('     executed:', E.lens[1].t);
    if (route === 'exp' && !opts.fireCoach) ok(A.signed || /blocked|could not/.test(JSON.stringify(G.pw.log)), `[${route}] DoF acted on his own (signed or explained why not)`);
    if (route !== 'exp' && !opts.fireCoach) ok(A.games > 0, `[${route}] coach selections were logged (${A.started}/${A.games} starts)`);
    if (opts.fireCoach) ok(/gone|picks the team|new/i.test(JSON.stringify(E.lens)), `[${route}] coach departure is named, no broken references`);
    G.ap = 3; FO.respond(ev.id, opts.close || 0); ok(G.pw.stage === 'run' || G.pw.stage === 'closed', `[${route}] closing works (${G.pw.stage})`); }
  if (save) { const FO2 = boot(); FO2.load(save); ok(FO2.G.pw && FO2.G.pw.ag && FO2.G.pw.ag.route === A.route, `[${route}] save/load mid-agreement keeps it`); for (let i = 0; i < 3; i++) FO2.endWeek(); ok(FO2.G.phase === 'season' || FO2.G.phase === 'sacked', `[${route}] loaded game keeps running`); }
  return FO;
}
run('youth'); run('exp'); run('phase', { save: true });
run('ignored', { ignore: true });
run('youth', { fireCoach: true, seed: 22 });
const F3 = run('youth', { seed: 23, close: 2 }); ok(F3.G.cred.log.length > 0, 'credibility log names its causes: ' + (F3.G.cred.log[0] || {}).t);
// determinism: same seed, same actions -> same outcome
const a = run('phase', { seed: 31 }), b = run('phase', { seed: 31 });
ok(JSON.stringify(a.G.pw.ev) === JSON.stringify(b.G.pw.ev) && a.G.club.cash === b.G.club.cash, 'same seed + same actions = same outcome');
console.log(fails ? fails + ' FAILED' : 'all pathway tests passed'); process.exit(fails ? 1 : 0);
