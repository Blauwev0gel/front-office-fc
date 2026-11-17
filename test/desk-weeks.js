// UX-1 / CEO-first sprint: three weeks that must play differently, from real game state (no demo text).
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const open = F => F.G.inbox.filter(m => !m.done);

// A. a quiet week: nothing to sign, the staff still visibly at work, the next match there
{ const F = game(501); for (let w = 0; w < 5; w++) { for (const m of open(F)) F.respond(m.id, 0); F.endWeek(); } for (const m of open(F)) F.respond(m.id, 0);
  const T = F.weekTopic(), L = F.teamWork();
  ok(open(F).length === 0, 'A: nothing waits for the CEO'); ok(T && T.k !== 'crisis', `A: the week is not dressed up as a crisis (${T && T.t})`);
  ok(L.length >= 1 && L.length <= 3, `A: the staff are visibly at work (${L.length} line${L.length === 1 ? '' : 's'}: ${L.map(l => l.role).join(', ')})`);
  ok(!!F.mtPreview(), 'A: the next match is there'); }

// B. a sporting crisis: one board matter where coach, DoF and Finance want different things; the answer moves them
{ const F = game(502);
  for (let w = 0; w < 14 && !open(F).some(m => m.ev === 'turn_call'); w++) { for (const m of open(F)) F.respond(m.id, 0); if (F.G.week >= 5) { F.G.form = F.G.form.concat(['L', 'L', 'L', 'L', 'L']).slice(-12); F.G.board.conf = 30; } F.endWeek(); }
  const m = open(F).find(m => m.ev === 'turn_call'); ok(!!m, 'B: the board asks for a plan');
  if (m) { const v = F.msgView(m), sur = r => F.staff(r).name.split(' ').slice(-1)[0];
    ok(['coach', 'dof', 'fin'].every(r => v.body.includes(sur(r) + ': "')), 'B: the coach, the DoF and Finance each say what they want, by name');
    ok(F.weekTopic().t === 'The board wants a plan', 'B: the week is about that one decision');
    ok(!(F.G.briefs || []).some(b => ['coach_slump', 'form_player', 'coach_debrief'].includes(b.t)), 'B: no loose briefs about the same results');
    const d0 = F.staff('dof').rel, f0 = F.staff('fin').rel, idx = v.opts.findIndex(o => /Invest/.test(o.l)); F.respond(m.id, idx);
    ok(F.staff('dof').rel > d0 && F.staff('fin').rel < f0, 'B: investing pleases the DoF and costs trust with Finance');
    const S = F.stillRunning(); ok(S.some(x => /Your plan: Invest/.test(x.t)), 'B: the plan stays on the desk with the week it is judged'); } }

// C. a big football week: the desk, the CEO moment and the paper tell the same story
{ const F = game(503); for (let w = 0; w < 9; w++) { for (const m of open(F)) F.respond(m.id, 0); F.endWeek(); }
  const pv = F.mtPreview(); F.G.stake = { week: F.G.week, kind: 'top', opp: pv.id }; const T = F.weekTopic();
  ok(T.k === 'stake' && /Top-of-the-table/.test(T.t), `C: the week is the big game (${T.t})`);
  for (const x of open(F)) F.respond(x.id, 0); F.endWeek();
  ok(JSON.stringify(F.G.paper.stories).includes('Top-of-table clash'), 'C: the Gazette carries the same game'); }

// D. a brief the CEO leaves: it ends the way the red box said (a matter sent up to him lapses; the head does not overstep)
{ const F = game(504); let found = false;
  for (let w = 0; w < 14 && !found; w++) { const b = (F.G.briefs || []).find(b => !b.done && F.briefFate(b)); if (b) { const fate = F.briefFate(b); for (const m of open(F)) F.respond(m.id, 0); F.endWeek(); const late = (F.G.lateBriefs || []).find(x => x.t === b.t);
      found = true; ok(late && (fate.lapse ? late.lapsed === 1 : late.opt === fate.opt), `D: the brief you left ended as the red box said (${fate.lapse ? 'lapsed' : fate.opt})`); }
    else { for (const m of open(F)) F.respond(m.id, 0); F.endWeek(); } }
  ok(found, 'D: a brief came up to leave'); }

console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
