// B51: the backers are felt, not read (moods and a direction on screen), and the press now matters for sponsors and the brand.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const F = game(91), B = F.backers();
ok(B.length === 4 && B.every(b => typeof b.mood === 'string' && b.mood.length && Number.isFinite(b.v)), 'every backer has a mood word, and the number is still there for the detail sheet');
ok([0, 7, 8, 24, 25, 54, 55, 77, 78, 100].map(F.backerMood).join(',') === 'Revolt,Revolt,Angry,Angry,Wary,Wary,Content,Content,Thrilled,Thrilled', 'the moods follow the same bands as the voices');
ok(F.backerMood(F.VOTE_AT) === 'Revolt', 'a vote of confidence (at ' + F.VOTE_AT + ') reads as revolt');
// the press matters: same club, same week, hostile press vs friendly press
const A = game(91), Z = game(91); A.G.st.press = 20; Z.G.st.press = 80; const s0 = A.G.st.spons, b0 = A.G.club.brand;
for (let i = 0; i < 6; i++) { A.G.st.press = 20; Z.G.st.press = 80; for (const X of [A, Z]) { for (const m of X.G.inbox.filter(m => !m.done)) X.respond(m.id, 0); X.endWeek(); } }
ok(Z.G.st.spons > A.G.st.spons + 1, `a friendly press lifts sponsor interest (${Z.G.st.spons.toFixed(1)} vs ${A.G.st.spons.toFixed(1)})`);
ok(Z.G.club.brand > A.G.club.brand, `and the brand (${Z.G.club.brand.toFixed(1)} vs ${A.G.club.brand.toFixed(1)})`);
// an old edition without moods still renders a mood
const ed = { bk: [{ t: 'Board', v: 30, d: -2 }] }; ok(F.backerMood(ed.bk[0].v) === 'Wary', 'old editions without a mood get one from the number');
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
