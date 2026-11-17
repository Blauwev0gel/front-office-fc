// "Your team at work": people doing real things, in their own voice; nothing invented; at most three lines.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const sur = n => n.split(' ').slice(-1)[0];
let weeks = 0, max = 0, real = true, names = true, long = 0, seen = {}, repeats = 0, quiet = 0;
for (const seed of [401, 402, 403]) { const F = game(seed);
  for (let w = 0; w < 14 && F.G.phase === 'season'; w++) { F.endWeek(); const L = F.teamWork(), G = F.G; weeks++; max = Math.max(max, L.length);
    for (const l of L) {
      if (/^m\d/.test(l.k) && !G.inbox.some(m => 'm' + m.id === l.k && m.del && m.done)) { real = false; console.log('  not real:', l.k, l.t.slice(0, 80)); }
      if (l.k[0] === 'b' && !(G.briefs || []).some(b => 'b' + b.id === l.k && b.del)) { real = false; console.log('  not real:', l.k, l.t.slice(0, 80)); }
      if (l.r !== 'player') names = names && l.t.includes(sur(l.n));
      if (l.t.length > 200) long++; if (l.quiet) quiet++;
      const key = seed + l.t.replace(/[\d.£%k]+/g, '#'); if (seen[key] != null && F.absWeek() - seen[key] < 2 && !/#/.test(key)) repeats++; seen[key] = F.absWeek(); }
    ok(JSON.stringify(F.teamWork()) === JSON.stringify(L), `seed ${seed} week ${G.week}: the same lines when the desk is drawn again`) || 0; } }
ok(max <= 3, `never more than three lines (${max})`);
ok(real, 'every decision or brief line points at something that really happened this week');
ok(names, 'every staff line names the head who did it');
ok(long === 0, 'lines stay short');
ok(repeats === 0, 'the same sentence does not come back the next week');
// the voice follows the character
{ const A = game(410), B = game(410); A.G.staff.fin.p.risk = 18; B.G.staff.fin.p.risk = 4; for (const X of [A, B]) { X.G.reports = [{ role: 'fin', t: 'Week result +£1k. Player wages at 31% of revenue (cap 50%). Transfer budget £3k.' }]; X.G.twPrev = { fin: 'Week result +£1k. Player wages at 31% of revenue (cap 50%). Transfer budget £3k.' }; X.HOOK.seasonAfterMatch(null); X.G.reports = [{ role: 'fin', t: 'Week result −£2k. Player wages at 55% of revenue (cap 50%), over the cap. Transfer budget £3k.' }]; X.G.form = ['W']; X.G.inbox.forEach(m => { m.del = 0; }); X.G.briefs = []; X.G.msNew = []; X.G.tw = null; }
  const a = A.teamWork().find(l => l.r === 'fin'), b = B.teamWork().find(l => l.r === 'fin');
  ok(a && b && a.t !== b.t && a.lab === 'Over cap' && b.lab === 'Over cap', `a bold and a careful finance head say the same fact differently ("${a && a.t}" / "${b && b.t}")`); }
// an unchanged report does not come back
{ const F = game(411), t = 'Window closed. 8 contracts expire this summer.'; F.G.twPrev = { dof: t }; F.G.reports = [{ role: 'dof', t }]; F.G.inbox.forEach(m => { m.del = 0; }); F.G.briefs = []; F.G.msNew = []; F.G.tw = null; F.G.form = ['W'];
  ok(!F.teamWork().some(l => l.r === 'dof'), 'a report that did not change since last week stays off the desk');
  F.G.reports = []; F.G.tw = null; const q = F.teamWork(); ok(q.length === 1 && q[0].quiet && /Quiet week|Nothing to report/.test(q[0].t), 'a week without anything gives one quiet line in a head\'s voice'); }
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
