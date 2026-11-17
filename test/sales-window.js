// B49: players only leave while a window is open. Outside it a deal is agreed and completes when the window opens.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(91);
const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress();
const G = () => F.G, keep = () => F.BACKERS.forEach(b => b.put(Math.max(b.get(), 50)));
const play = to => { while (G().week < to && G().phase === 'season') { for (const m of G().inbox.filter(m => !m.done)) F.respond(m.id, 0); F.endWeek(); keep(); } };
play(8); ok(G().week === 8 && !F.window_(), 'week 8 is outside any window');
const star = G().squad.slice().sort((a, b) => b.ca - a.ca)[0], club = G().divs[Math.max(1, G().club.tier - 1)].clubs.find(x => x !== 0);
const ctx = { pid: star.id, fee: 9000, club }; const out = F.EV.bid_star.opts[0].f(ctx);
ok(G().squad.includes(star) && star.sale && star.sale.fee === 9000, 'accepting a bid outside the window does not sell him: the deal is agreed'); ok(/window opens/.test(out) && /still ours/.test(out), 'and the answer says so: ' + out);
const cash0 = G().club.cash; play(15); ok(G().squad.includes(star), 'he is still here before the winter window (week ' + G().week + ')');
play(19); ok(!G().squad.includes(star), 'he leaves when the winter window opens'); ok(G().club.cash > cash0, 'and the money arrives then');
// in the window an accepted bid is immediate
const s2 = G().squad.slice().sort((a, b) => b.ca - a.ca)[0]; G().week = 17; ok(F.window_(), 'week 17 is inside the window'); const o2 = F.EV.bid_star.opts[0].f({ pid: s2.id, fee: 8000, club });
ok(!G().squad.includes(s2) && /sold/.test(o2), 'inside the window the sale is immediate');
// the other sale options follow the same rule
G().week = 8; const s3 = G().squad[0]; const o3 = F.EV.transfer_request ? F.EV.transfer_request.opts[0].f({ pid: s3.id, name: s3.name }) : null; if (o3 !== null) ok(G().squad.includes(s3) && s3.sale, 'a transfer request outside the window is also only agreed');
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
