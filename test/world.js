// The seeded world (B38, B39, B42): deterministic, built from the game's own clubs, never touches the game's RNG, plausible statistics.
const vm = require('vm'), fs = require('fs');
const src = require('./src.js').mods('matchday.js').map(f => require('./src.js')(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const F = game(91), G = F.G;
const rs0 = G.rs, t0 = Date.now(); const L1 = F.worldLeague('d8'); const L2 = F.worldLeague('d8');
ok(G.rs === rs0, 'browsing the world does not touch the game\'s random generator');
ok(JSON.stringify(L1.players.slice(0, 12)) === JSON.stringify(L2.players.slice(0, 12)), 'the same league is identical on every call');
const mine = G.divs[G.club.tier].clubs.length; ok(L1.clubs.length === 18, 'a league has 18 clubs');
const names = new Set(Object.values(G.clubs).map(c => c.name).concat(G.club.name)); ok(L1.clubs.every(c => names.has(c)), 'domestic leagues are the game\'s own clubs');
ok(L1.players.filter(p => p.ours).length === G.squad.length, 'our own club shows the real squad');
ok(L1.players.length === 17 * 20 + G.squad.length, `17 world clubs x 20 players plus our squad (${L1.players.length})`);
const all = F.worldLeagues(); let total = 0, ms = Date.now(); for (const l of all) total += F.worldLeague(l.id).players.length; ms = Date.now() - ms;
ok(all.length === 14 && total > 4000, `14 leagues, ${total} players, built in ${ms} ms`); ok(ms < 4000, 'a whole world is built in well under four seconds');
// fields
const p0 = L1.players.find(p => !p.ours && p.pos === 'ST'), need = ['key', 'name', 'pos', 'age', 'a', 'pers', 'ca', 'pa', 'contract', 'wage', 'st', 'cur', 'hist', 'ask'];
ok(need.every(k => p0[k] !== undefined), 'a record has attributes, personality, ability, potential, contract, wage, last season, this season, history and an asking price');
ok(Object.keys(p0.a).length === 14 && Object.keys(p0.pers).length === 4, '14 attributes and 4 personality scores');
ok(['apps', 'mins', 'g', 'a', 'xg', 'xa', 'prg', 'dw', 'dt', 'rat', 'yc', 'rc', 'sh', 'sot', 'kp', 'tk', 'ic', 'cl', 'sv', 'cs', 'ga'].every(k => Number.isFinite(p0.st[k])), 'all 21 statistics are finite numbers');
ok(F.worldPlayer(p0.key) && F.worldPlayer(p0.key).name === p0.name, 'a single player can be fetched again by his key');
// statistics per position, against the rates measured on our own squads
const EXP = { ST: { sh: 2.9 }, CB: { cl: 3.6, tk: 1.96 }, GK: { sv: 3.3 }, W: { prg: 1.78 } }, agg = {};
for (const l of all) for (const p of F.worldLeague(l.id).players) { if (p.ours || p.st.mins < 900) continue; const a = agg[p.pos] = agg[p.pos] || { mins: 0, n: 0 }; a.mins += p.st.mins; a.n++; for (const k of ['sh', 'cl', 'tk', 'sv', 'prg', 'cs', 'ga', 'g']) a[k] = (a[k] || 0) + p.st[k]; }
const r90 = (pos, k) => agg[pos][k] / (agg[pos].mins / 90);
for (const [pos, o] of Object.entries(EXP)) for (const [k, v] of Object.entries(o)) { const x = r90(pos, k); ok(x > v * .65 && x < v * 1.6, `${pos} ${k} per 90 is ${x.toFixed(2)} (engine ${v})`); }
ok(r90('GK', 'cs') > .1 && r90('GK', 'cs') < .35, `keepers keep clean sheets in 10 to 35% of 90s (${r90('GK', 'cs').toFixed(2)})`);
// history
const old = L1.players.find(p => !p.ours && p.age >= 25); ok(old.hist.length === 2 && old.hist[0].age === old.age - 2, 'players have earlier seasons in their history');
// lineage across seasons
const keep = L1.players.find(p => !p.ours && p.contract >= 3), k0 = keep.key, a0 = keep.age; G.season += 1; const nxt = F.worldPlayer(k0);
ok(nxt && nxt.name === keep.name && nxt.age === a0 + 1, `the same player is there next season, one year older (${keep.name}, ${a0} to ${nxt && nxt.age})`); G.season -= 1;
// taking a player away
const gone = L1.players.find(p => !p.ours && p.contract >= 2); F.worldRemove(gone.key); const L3 = F.worldLeague('d8');
ok(L3.players.length === L1.players.length && !L3.players.some(p => p.name === gone.name && p.club === gone.club), 'a player taken away is replaced; the club keeps 20 players');
// save and load keep the changes
const s = F.save(); ok(F.load(s) && F.worldLeague('d8').players.every(p => !(p.name === gone.name && p.club === gone.club)), 'the world survives save and load, including what the CEO changed');
// foreign leagues
const Lf = F.worldLeague('ibe'); ok(Lf.clubs.length === 18 && Lf.players.length === 360, 'a foreign league has 18 clubs and 360 players');
// B45: a flagged player becomes a target and runs through the DoF's pipeline
{
  const dom = F.worldLeague('d' + F.G.club.tier).players.find(p => !p.ours && p.pos === 'CM' && p.contract >= 1), fo = F.worldLeague('ibe').players.find(p => !p.ours && p.pos === 'ST');
  ok(F.worldTarget(dom.key).err, 'an unflagged player cannot be made a target');
  F.worldFlag(dom.key, 'Hidden quality'); F.worldFlag(fo.key, 'Undervalued');
  const rs = G.rng || null, seedBefore = G.rs;
  const a = F.worldTarget(dom.key), b = F.worldTarget(fo.key); ok(a.ok && b.ok, 'flagged players can be made targets' + (a.err || b.err || ''));
  const ts = F.worldTargetState(dom.key), P = F.G.rec.pool[ts.pid], x = F.G.rec.pipe.find(y => y.pid === ts.pid);
  ok(P && P.wkey === dom.key && P.name === dom.name && P.ca > dom.ca - .5 && P.ca < dom.ca + .5, 'the pool player is the same person (name, ability)');
  ok(Object.keys(dom.a).every(k => P.a[k] === dom.a[k]), 'with the same fourteen attributes');
  ok(P.ask === Math.round(dom.ask / 100) * 100, 'and the same asking price as in the portal (' + P.ask + ' vs ' + dom.ask + ')');
  ok(x && x.stage === 'recommended' && x.ceo, 'he starts as recommended and marked as the CEO\'s target'); ok(F.G.rec.know[ts.pid] && F.G.rec.know[ts.pid].n >= 1, 'the DoF starts with one scout report');
  const PF = F.G.rec.pool[F.worldTargetState(fo.key).pid]; ok(PF.fclub === fo.club && F.G.clubs[PF.club], 'a player from abroad carries his club name and a stand-in club id');
  ok(F.worldTarget(dom.key).err, 'a second attempt is refused while he is on the list');
  x.stage = 'lost'; ok(F.worldTarget(dom.key).ok && Object.values(F.G.rec.pool).filter(p => p.wkey === dom.key).length === 1, 'after a failed attempt he can be a target again, with one pool entry');
  const live = F.save(); ok(F.load(live) && F.worldTargetState(dom.key).pid && F.G.rec.pool[F.worldTargetState(dom.key).pid], 'the link survives save and load');
  const t2 = F.worldTargetState(fo.key).pid, was = F.G.rec.pool[t2]; was.club = 1; const sq0 = F.G.squad.length;
  F.worldSigned(fo.key, { ca: 7.2, name: fo.name }); ok(F.worldLeague('ibe').players.every(p => p.key !== fo.key || p.name !== fo.name) && WXs(fo.key).signed.name === fo.name, 'once signed he leaves the world and the bet is kept');
  function WXs(k) { return F.G.world.flags[k]; }
}
console.log(fails ? `\n${fails} FAILED` : '\nall ok'); process.exit(fails ? 1 : 0);
