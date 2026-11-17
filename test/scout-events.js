// The portal's events (B47): a scout's hunch, an agent's call, and a settled bet. None of them judges the player; all are the CEO's own calls.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const F = game(91); const G = () => F.G;
ok(['pl_hunch', 'pl_agent', 'pl_bet_settled'].every(id => F.EV[id]), 'the three events are defined');
// hunch
G().week = 5; const e = F.EV.pl_hunch; ok(e.cond(), 'a hunch can come while there is a scout, in season');
const c1 = e.setup(); ok(c1 && c1.key && ['Unlucky finisher', 'Late bloomer'].includes(c1.hyp), 'it names a real player and a reason: ' + (c1 && c1.name + ', ' + c1.hyp));
ok(!F.worldMeta(c1.key).fl, 'he is not flagged yet'); const o0 = e.opts[0].f(c1); ok(F.worldMeta(c1.key).fl && F.worldMeta(c1.key).hyp === c1.hyp && /flagged/.test(o0), 'flagging with the scout\'s reason makes it your bet');
const c2 = e.setup(); const o1 = e.opts[1].f(c2); ok(F.worldMeta(c2.key).fl && F.worldMeta(c2.key).confirmed >= 1, 'flag and check asks the scouts to confirm in the same step');
ok(e.opts[2].f(c2) && true, 'not interested is free');
// no endless flagging
for (let i = 0; i < 6; i++) { const c = e.setup(); if (c) F.worldFlag(c.key, c.hyp); } ok(!e.cond(), 'no hunches once five players are flagged');
// agent
const f0 = F.worldFlagged()[0]; const ag = F.EV.pl_agent; ok(ag.cond(), 'an agent can call about a flagged player'); const ca = ag.setup(); ok(ca && F.worldFlagged().some(f => f.key === ca.key), 'about a player you flagged');
const oa = ag.opts[0].f(ca); ok(F.worldTargetState(ca.key) && /DoF's list/.test(oa), 'making him a target puts him on the DoF\'s list'); ok(F.EV.pl_agent.setup() === null || F.EV.pl_agent.setup().key !== ca.key, 'the same player does not call twice');
// bet settled
const keys = F.worldFlagged().map(f => f.key), k = keys.find(x => !F.worldTargetState(x)) || keys[0]; G().world.flags[k].snap.s -= 1; G().world.flags[k].hyp = 'Late bloomer'; G().world.flags[k].snap.ca -= 1;
G().week = 3; const before = G().queue.length; F.HOOK.seasonWeekly(); ok(G().queue.some(q => q.id === 'pl_bet_settled') && G().queue.length === before + 1, 'at week 3 a settled bet is queued, one at a time');
const q = G().queue.find(x => x.id === 'pl_bet_settled'); ok(q.ctx.held === true && q.ctx.name, 'a late bloomer whose ability rose by a point held up');
ok(G().world.flags[k].told === G().season, 'a bet is only told once'); G().queue = []; F.HOOK.seasonWeekly(); ok(!G().queue.some(x => x.id === 'pl_bet_settled' && x.ctx.key === k), 'and not again');
const E = F.EV.pl_bet_settled, tgt = F.worldTargetState(k); const lab = typeof E.opts[0].l === 'function' ? E.opts[0].l(q.ctx) : E.opts[0].l; ok(/target|Note/.test(lab), 'the first option follows the result: ' + lab);
ok(E.opts[1].f(q.ctx) && E.opts[2].f(q.ctx), 'the other options work');
// the event engine accepts them (title/body render)
for (const id of ['pl_hunch', 'pl_agent']) { const c = F.EV[id].setup(); if (c) ok(typeof F.EV[id].title(c) === 'string' && typeof F.EV[id].body(c) === 'string', id + ' renders'); }
ok(typeof E.title(q.ctx) === 'string' && typeof E.body(q.ctx) === 'string', 'pl_bet_settled renders');
// they are the CEO's own calls: the desk does not settle them
const m = { ev: 'pl_hunch', ctx: c1 }; F.addMsg('pl_hunch', c1); const msg = G().inbox[0]; ok(msg && msg.ev === 'pl_hunch' && !msg.del, 'the desk leaves a hunch to the CEO');
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
