// The weekly U18 match brief (B48): a short word as the mentor. Opt-in, every choice has a price, nothing is tactics.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(91);
const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress();
const weeks = []; let done = false;
function check(brief) {
  ok(!brief.done && !brief.del, 'it waits for the CEO: the academy does not settle it');
  const v = F.briefView(brief); ok(/U18: (won|lost|drew) \d+–\d+/.test(v.title) && v.opts.length === 3, 'it states the result and offers three ways to respond: ' + v.title);
  ok(v.opts.every(o => !/tactic|formation|line-?up|substitut/i.test(o.l + ' ' + (o.h || ''))), 'none of the options is tactics (B38)');
  const pid = brief.ctx.pid, p = () => F.G.academy.find(x => x.id === pid), w0 = p().wel, m0 = p().morale || 65, BRd = F.BR.ac_match, lab = BRd.opts[0].l(brief.ctx);
  ok(/Praise|rest/i.test(lab), 'the first option follows how he is doing: ' + lab);
  const r1 = F.answerBrief(brief.id, 0); ok(r1 && r1.out && (p().wel > w0 || p().morale > m0), 'the first answer lifts welfare or morale');
  const b2 = { pid, name: p().name, age: p().age, us: 2, them: 1, opp: 'X', home: true }; p().playUp = false; const w1 = p().wel, out2 = BRd.opts[1].f(b2);
  ok(p().playUp === true && p().wel === w1 - 3 && /older/.test(out2), 'pushing him sets play-up for the season and costs welfare');
  const out3 = BRd.opts[2].f(b2); ok(out3 && p().wel === w1 - 3, 'leaving him be costs nothing');
}
for (let w = 0; w < 16 && F.G.phase === 'season'; w++) {
  for (const m of F.G.inbox.filter(m => !m.done)) F.respond(m.id, 0);
  F.endWeek(); const b = (F.G.briefs || []).find(x => x.t === 'ac_match'); if (b) { weeks.push(F.G.week); if (!done) { done = true; check(b); } }
}
ok(done, 'a U18 match brief appears within a few weeks (weeks ' + weeks.join(',') + ')'); ok(weeks.every((w, i) => i === 0 || w - weeks[i - 1] >= 2), 'never two weeks in a row');
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
