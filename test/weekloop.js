// Week loop: reproducible and situation-driven selection, follow-ups, season transition, save/load (headless, small)
const vm = require('vm');
const src = require('./src.js').mods('matchday.js').map(f => require('./src.js')(f)).join('\n');
let fails = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
function weeks(F, n, pre) { const seq = []; for (let i = 0; i < n && F.G.phase === 'season'; i++) { if (pre) pre(F, i); for (const m of F.G.inbox.filter(m => !m.done)) seq.push(m.ev); F.endWeek(); for (const r of F.ROLES) if (!F.G.staff[r.id] && F.G.cands[r.id]) F.hire(r.id, 1); } for (const m of F.G.inbox.filter(m => !m.done)) seq.push(m.ev); return seq; }
// 1. reproducible
const a = weeks(game(4242), 20), b = weeks(game(4242), 20); ok(JSON.stringify(a) === JSON.stringify(b) && a.length > 5, `same seed, same club: identical selection (${a.length} messages over 20 weeks)`);
// 2. situation shifts selection: finance pressure raises finance-related events and weights
{ const F = game(7), E = Object.values(F.EV).find(e => (e.from === 'fin') && !e.forced && e.mode !== 'auto'); const calm = F.HOOK.evWeight(E); F.G.club.cash = -90000; F.G.club.debt = 90000; const hot = F.HOOK.evWeight(E); ok(hot > calm, `finance event weight rises under money trouble (${calm.toFixed(2)} → ${hot.toFixed(2)})`);
  const G = game(7); G.G.form = ['L', 'L', 'L', 'D', 'L']; const co = Object.values(G.EV).find(e => e.from === 'coach' && !e.forced); ok(G.HOOK.evWeight(co) > 1, 'coach event weight rises after a run of defeats'); }
// 2b. stable vs pressured: messages from the pressured departments over 20 weeks, 24 seeds
{ const cnt = (press) => { let n = 0, t = 0; for (let s = 0; s < 24; s++) { const F = game(100 + s * 17); const seq = weeks(F, 20, press ? (F, i) => { F.G.club.cash = Math.min(F.G.club.cash, -50000); F.G.form = ['L', 'L', 'D', 'L', 'L']; F.G.board.conf = Math.min(F.G.board.conf, 38); } : null); t += seq.length; n += seq.filter(id => { const e = F.EV[id] || {}; return ['fin', 'board', 'coach', 'fans', 'press'].includes(e.from); }).length; } return { n, t }; };
  const calm = cnt(false), hard = cnt(true); ok(hard.n / hard.t > calm.n / calm.t, `pressured club: more finance/board/coach/fans/press subjects (${(calm.n / calm.t * 100).toFixed(0)}% → ${(hard.n / hard.t * 100).toFixed(0)}%); inbox stays usable (${(hard.t / 480).toFixed(1)} messages a week)`); ok(hard.t / 480 < 5, 'pressured inbox under 5 messages a week'); ok(calm.t / 480 < 3.5, `stable club inbox light (${(calm.t / 480).toFixed(1)} a week)`); }
// 3. follow-ups: decision → later message carrying what it follows
for (const [id, opt, next] of [['star_unrest', 0, 'bid_star'], ['dressing_room', 0, 'coach_authority'], ['documentary', 0, 'doc_episode']]) {
  const F = game(31); for (let i = 0; i < 6; i++) { F.endWeek(); for (const r of F.ROLES) if (!F.G.staff[r.id] && F.G.cands[r.id]) F.hire(r.id, 1); }
  F.G.inbox.forEach(m => { if (!m.done) F.resolve(m, 0, 'x'); }); F.G.later = [];
  const E = F.EV[id]; let ctx = null; try { ctx = E.setup ? E.setup() : {}; } catch (e) { } if (ctx === null) { ok(false, `${id}: could not set up a context`); continue; }
  let L = null; for (let o = 0; o < E.opts.length && !L; o++) { for (let t = 0; t < 8 && !L; t++) { F.G.later = []; F.G.inbox = F.G.inbox.filter(x => x.ev !== id); F.addMsg(id, ctx); F.resolve(F.G.inbox[0], o, 'you'); L = F.G.later.find(l => l.id === next); } }
  if (!L) { ok(false, `${id} → ${next}: no follow-up planned`); continue; }
  ok(!!L.of, `${id} → ${next}: follow-up planned, remembers "${L.of}"`);
  let seen = null; for (let i = 0; i < 12 && !seen; i++) { F.G.ap = 99; for (const x of F.G.inbox.filter(x => !x.done && x.ev !== next)) F.resolve(x, 0, 'x'); F.endWeek(); seen = F.G.inbox.find(x => x.ev === next); }
  ok(seen && seen.fu, `${id} → ${next}: arrives as a follow-up${seen ? ` in week ${seen.week}` : ''}`);
  if (seen) { const dup = F.G.inbox.filter(x => x.ev === next && !x.done).length; ok(dup <= 1, `${next}: no duplicate active messages`); } }
// 4. season transition + save/load
{ const F = game(55); for (let s = 0; s < 2; s++) { while (F.G.phase === 'season') { for (const x of F.G.inbox.filter(x => !x.done)) F.resolve(x, 0, 'x'); F.endWeek(); for (const r of F.ROLES) if (!F.G.staff[r.id] && F.G.cands[r.id]) F.hire(r.id, 1); } if (F.G.phase !== 'review') break; F.startSeason(); if (F.G.phase === 'summer') F.sumAuto(F.rnd, true); else { F.preSetTarget('accept'); F.finishPreseason(); } for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); }
  ok(F.G.season === 3 || F.G.phase === 'sacked', `two seasons played (season ${F.G.season}, phase ${F.G.phase})`); ok(Array.isArray(F.G.later) && Array.isArray(F.G.queue), 'later and queue stay valid across seasons');
  const s = F.save(); const G0 = JSON.parse(s); delete G0.later; ok(F.load(JSON.stringify(G0)) && Array.isArray(F.G.later), 'old save without "later" loads with a safe default'); ok(F.load(s), 'save round-trips'); }
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
