/* ---------- match simulation ---------- */
// How chances relate to shots and key passes. One set of numbers: the seeded world (world.js) reads them through F.STATK.
const STATK = { xgPerShot: 0.11, sotShare: 0.33, xaPerKeyPass: 0.13, gkXgPerShot: 0.2 };
function wxFor(s, w, o) { let h = (s * 73856093) ^ (w * 19349663) ^ (o * 83492791); h = (h ^ (h >>> 13)) * 1274126177 >>> 0; return { rain: h % 100 < 25, night: (h >>> 8) % 100 < 30 }; }
function expRand(m) { return -Math.log(1 - rnd()) * m; }
// calibration knobs for the match (B25): attacks per five minutes, base chance an attack becomes a shot, finishing
const MATCH_K = { attacks: 2.25, shot: 0.6, conv: 1 };
// B53: the match as attacks with real players. Nineteen blocks of five minutes (the last is stoppage time); in each the balance of play
// follows quality, the score, red cards, energy and the coach's settings. An attack is a chain: a builder, a maker, a defender who meets it,
// and if it becomes a shot a shooter, a kind of shot and the keeper. Fatigue, changes, injuries and red cards happen during the match.
// The result keeps the old shape (ev, ug, tg, uxg, txg, why, ...) for the paper, the stories and the stats; `feed` carries the richer events
// for the match screen, `poss` the possession per block, `referee` a fictional referee.
const OPP_FN = ['Owen', 'Callum', 'Rhys', 'Declan', 'Marcus', 'Ellis', 'Jonah', 'Kieran', 'Theo', 'Isaac', 'Ruben', 'Lewis', 'Nathan', 'Aaron', 'Harvey', 'Luca', 'Felix', 'Dylan', 'Ryan', 'Tobias', 'Oscar', 'Jamal', 'Sami', 'Piotr'];
const OPP_LN = ['Ashworth', 'Brennan', 'Carver', 'Dunmore', 'Ellery', 'Fairbank', 'Garside', 'Holloway', 'Ingram', 'Jessop', 'Kendrick', 'Lowther', 'Marsden', 'Nolan', 'Oakes', 'Pritchard', 'Quill', 'Radcliffe', 'Sefton', 'Thorne', 'Varley', 'Whitlock', 'Yardley', 'Brannigan', 'Coyle', 'Devlin', 'Eastwood', 'Gorman', 'Hesketh', 'Mulvey'];
const REF_FN = ['Martin', 'Graham', 'Paul', 'Stuart', 'Neil', 'Keith', 'Andrew', 'Darren', 'Simon', 'Gareth'], REF_LN = ['Oakley', 'Prescott', 'Hartigan', 'Wilmot', 'Coulter', 'Ransome', 'Thewlis', 'Bramall', 'Lacey', 'Fenwick'];
// the opponent's squad: stable names per club (seeded on the club, never on the game's RNG), ability around the club's strength
function oppSquad(oppId, level) {
  const c = G.clubs[oppId]; let cs = 0; for (const ch of c.name + oppId) cs = (cs * 31 + ch.charCodeAt(0)) >>> 0; const cr = () => { cs = (cs * 1103515245 + 12345) >>> 0; return cs / 4294967296; };
  const star = c.star || null, base = level != null ? level : c.str - (c.coach ? c.coach.q : 1.2), used = new Set(G.squad.map(p => p.name.split(' ').slice(-1)[0])); let starSet = false;
  const mk = (slot, i) => { const ca = clamp(base + (cr() - 0.5) * 2.2, 2, 18), a = {}; for (const k of ATTR) a[k] = clamp(ca + (cr() - 0.5) * 4, 1, 20);
    let name; do { name = OPP_FN[Math.floor(cr() * OPP_FN.length)] + ' ' + OPP_LN[Math.floor(cr() * OPP_LN.length)]; } while (used.has(name.split(' ')[1]) && used.size < OPP_LN.length + G.squad.length - 2); used.add(name.split(' ')[1]);
    let isStar = false; if (star && !starSet && slot === star.pos) { name = star.name; isStar = true; starSet = true; a.fin = clamp(a.fin + 3, 1, 20); a.com = clamp(a.com + 2, 1, 20); }
    return { id: 'o' + oppId + '_' + i, name, pos: slot, ca, a, pers: { temp: 6 + Math.floor(cr() * 12) }, side: 'them', en: 100, on: true, star: isStar }; };
  return { xi: SLOTS.map(mk), bench: ['CB', 'CM', 'W', 'ST', 'FB'].map((s, i) => mk(s, 20 + i)) };
}
function simOurMatch(oppId, home, comp) {
  const opp = G.clubs[oppId], L = pickXI(true), me = teamStrength(L), os = opp.str + gauss() * 0.3;
  const d0 = me - os + (HOOK.homeEdge ? HOOK.homeEdge(home) : (home ? 0.35 : -0.35));
  const att = cact('attack') / 100, intn = cact('intensity') / 100, wx = wxFor(G.season, G.week, oppId);
  const OS = HOOK.oppStyle ? HOOK.oppStyle(oppId) : { vol: 1, oxg: 1 }, fitCoach = FO.deptHas ? FO.deptHas('first', 'fit') : perk('sci');
  const fill = home && G.club.cap ? Math.min(1, attendance() / G.club.cap) : 0, opName = opp.name, my = G.club.short;
  const mkUs = (p, slot) => ({ id: p.id, name: p.name, pos: slot, ca: p.ca, a: p.a, pers: p.pers || {}, side: 'us', en: 100, on: true, p, start: 0 });
  const xiCa = L.xi.length ? L.xi.reduce((a, x) => a + x.p.ca, 0) / L.xi.length : me; /* their players sit as far from ours as the clubs do, so the duels never count the gap twice */
  const us = L.xi.map(x => mkUs(x.p, x.slot)), bench = L.bench.map(p => mkUs(p, p.pos)), O = oppSquad(oppId, xiCa + (os - me)), them = O.xi.slice(), obench = O.bench.slice();
  const st = new Map(), S = q => { if (!st.has(q.id)) st.set(q.id, { g: 0, a: 0, xg: 0, xa: 0, yc: 0, rc: 0, sh: 0, sot: 0, kp: 0, tk: 0, ic: 0, cl: 0, sv: 0 }); return st.get(q.id); };
  const live = side => (side === 'us' ? us : them).filter(q => q.on), energy = side => { const l = live(side).filter(q => q.pos !== 'GK'); return l.length ? l.reduce((a, q) => a + q.en, 0) / l.length : 100; };
  const sc = { us: 0, them: 0 }, xg = { us: 0, them: 0 }, red = { us: 0, them: 0 }, subs = { us: 0, them: 0 }, ev = [], feed = [], poss = [], injured = [];
  const referee = REF_FN[ri(0, REF_FN.length - 1)] + ' ' + REF_LN[ri(0, REF_LN.length - 1)];
  const scOld = () => [sc.us, sc.them], out = (m, k, o) => { const e = { m, k, ...o }; feed.push(e); return e; };
  ev.push({ m: 0, k: 'info', t: HOOK.say ? HOOK.say('ko', { home, opName, opp: oppId, comp }) : home ? `Kick-off at home against ${opName}.` : `Kick-off away at ${opName}.` }); out(0, 'ko', {});
  const swap = (side, tired, m, why) => { // a change: the bench player takes the same slot
    let inn; if (side === 'us') { const i = bench.findIndex(x => x.pos === tired.pos || LINE[x.pos] === LINE[tired.pos]); inn = bench.splice(i >= 0 ? i : 0, 1)[0]; } else { const i = obench.findIndex(x => LINE[x.pos] === LINE[tired.pos]); inn = obench.splice(i >= 0 ? i : 0, 1)[0]; }
    if (!inn) return null; inn.pos = tired.pos; inn.en = 100; inn.on = true; inn.start = m; tired.on = false; tired.off = m; subs[side]++; (side === 'us' ? us : them).push(inn);
    if (side === 'us') ev.push({ m, k: 'sub', us: 1, pid: inn.id, t: HOOK.say ? HOOK.say('sub', { inn: inn.p || inn, out: tired.p || tired, m, ug: sc.us, tg: sc.them }) : `Substitution: ${inn.name} replaces ${tired.name}.` });
    out(m, 'sub', { side, inn: inn.name, out: tired.name, tired: Math.round(tired.en), why }); return inn; };
  let htDone = false;
  for (let b = 0; b < 19; b++) {
    const m0 = b * 5, phase = m0 < 15 ? 'start' : m0 >= 75 ? 'end' : 'mid';
    if (b === 9 && !htDone) { htDone = true; ev.push({ m: 45, k: 'info', t: `Half-time: ${home ? sc.us + '–' + sc.them : sc.them + '–' + sc.us}.` }); out(45, 'ht', { score: { ...sc } }); }
    for (const q of [...live('us'), ...live('them')]) { if (q.pos === 'GK') continue; const burn = (1.9 + (q.side === 'us' ? intn : 0.5) * 1.4) * (1.25 - q.a.sta / 40) * (q.side === 'us' && fitCoach ? 0.8 : 1); q.en = clamp(q.en - burn, 25, 100); }
    if (m0 >= 60 && m0 <= 80) for (const side of ['us', 'them']) { if (subs[side] >= 3 || !chance(0.42)) continue; const tired = live(side).filter(q => q.pos !== 'GK').sort((x, y) => x.en - y.en)[0]; if (tired && tired.en <= 82) swap(side, tired, m0 + ri(1, 4), 'tired'); }
    const diff = sc.us - sc.them; let adj = -0.9 * red.us + 0.9 * red.them + (energy('us') - energy('them')) / 100 * 0.9;
    if (diff < 0) adj += (0.25 + att * 0.3) * (m0 >= 60 ? 1.3 : 1); else if (diff > 0) adj -= (0.25 + (m0 >= 65 ? (1 - att) * 0.25 : 0)) * (m0 >= 60 ? 1.3 : 1);
    if (phase === 'start') adj += (intn - 0.5) * 0.3; if (fill > 0.85 && phase === 'end') adj += 0.12;
    const share = 1 / (1 + Math.exp(-0.6 * (d0 + adj))); poss.push(Math.round(clamp(0.5 + (share - 0.5) * 0.7 + (rnd() - 0.5) * 0.08, 0.25, 0.75) * 100));
    const n = poisson(MATCH_K.attacks * (0.85 + 0.3 * att) * OS.vol * (wx.rain ? 0.92 : 1) * (b === 18 ? 0.8 : 1)), acts = [];
    for (let i = 0; i < n; i++) acts.push({ m: m0 + ri(1, 5), side: rnd() < share ? 'us' : 'them' }); acts.sort((x, y) => x.m - y.m);
    let shotsIn = 0;
    for (const A of acts) {
      const atk = live(A.side), def = live(A.side === 'us' ? 'them' : 'us'); if (atk.length < 8 || def.length < 7) continue;
      const gk = def.find(q => q.pos === 'GK') || def[0], fat = q => 0.75 + q.en / 400, field = atk.filter(q => q.pos !== 'GK');
      const builder = wpick(field, q => ({ DF: 1.2, MF: 2, FW: 0.6 }[LINE[q.pos]]) * (q.a.pas + 2)), wide = chance(0.42);
      const creator = wpick(field.filter(q => q !== builder), q => (wide ? (q.pos === 'W' || q.pos === 'FB' ? 3 : 0.6) * (q.a.cro + 2) : (q.pos === 'AM' || q.pos === 'CM' ? 2.5 : 1) * (q.a.pas + q.a.vis)) * fat(q)) || builder;
      const stopper = wpick(def.filter(q => q.pos !== 'GK'), q => ({ DF: 2.2, MF: 1.6, FW: 0.4 }[LINE[q.pos]]) * (q.a.tac + q.a.mar) * fat(q));
      const pShot = clamp(MATCH_K.shot + (creator.a.pas + creator.a.vis - stopper.a.tac - stopper.a.mar) * 0.003 + (att - 0.5) * 0.1 * (A.side === 'us' ? 1 : -0.5), 0.3, 0.8);
      if (!chance(pShot)) { S(stopper)[chance(0.55) ? 'tk' : 'ic']++;
        if (chance(0.085)) { const off = chance(0.6) ? stopper : creator, side = off.side, isRed = chance(0.055) || ((off.pers.temp || 10) > 16 && chance(0.12));
          if (isRed) { off.on = false; off.off = A.m; red[side]++; S(off).rc++; if (off.p) off.p.susp = 2; ev.push({ m: A.m, k: 'card', us: side === 'us' ? 1 : 0, red: 1, t: side === 'us' ? `Red card! ${off.name} is sent off.` : `Red card for ${opName}! ${off.name} is sent off.` }); out(A.m, 'red', { side, who: off.name }); }
          else { S(off).yc++; ev.push({ m: A.m, k: 'card', us: side === 'us' ? 1 : 0, t: side === 'us' ? `Yellow card for ${off.name}.` : `${off.name} (${opName}) is booked.` }); out(A.m, 'yellow', { side, who: off.name }); } }
        continue; }
      const header = wide && chance(0.35), close = !header && chance(0.16), far = !header && !close && chance(0.33);
      const shooter = (header ? wpick(field.filter(q => q !== creator), q => ({ DF: 0.8, MF: 1, FW: 2.6 }[LINE[q.pos]]) * (q.a.hea + 2)) : wpick(field.filter(q => q !== creator), q => ({ DF: 0.3, MF: 1.3, FW: 3 }[LINE[q.pos]]) * (q.a.fin + 2) * (q.star ? 2.2 : 1) * (HOOK.storyW && q.p ? HOOK.storyW(q.p) : 1))) || creator;
      let q = (header ? 0.09 : close ? 0.34 : far ? 0.045 : 0.115) * (0.6 + rnd() * 0.8) * (1 + 0.03 * ((header ? shooter.a.hea : shooter.a.fin) - stopper.a.tac) / 2) * (wx.rain ? 0.95 : 1) * (A.side === 'them' ? OS.oxg : 1) * fat(shooter) * (A.side === 'us' ? 1 + (att - 0.5) * 0.08 : 1 + (att - 0.5) * 0.2);
      q = clamp(q, 0.02, 0.8); xg[A.side] += q; shotsIn++; const ss = S(shooter); ss.sh++; ss.xg += q; if (creator !== shooter) { S(creator).kp++; S(creator).xa += q; }
      const onT = chance(clamp(0.3 + q * 0.9, 0.25, 0.85)), blocked = !onT && chance(0.28);
      const goal = onT && chance(clamp(q / (0.3 + q * 0.9) * (1 + (shooter.a.com - gk.a.ref) * 0.012) * MATCH_K.conv, 0.02, 0.95));
      if (blocked) S(stopper).cl++; if (onT) { ss.sot++; if (!goal) S(gk).sv++; }
      const kind = header ? 'header' : close ? 'close' : far ? 'distance' : 'box', flank = wide ? (chance(0.5) ? 'left' : 'right') : 'centre', before = { ...sc };
      const base = { side: A.side, who: shooter.name, whoId: shooter.id, star: !!shooter.star, by: creator !== shooter ? creator.name : null, from: builder !== creator && builder !== shooter ? builder.name : null, keeper: gk.name, stop: stopper.name, kind, wide, flank, xg: +q.toFixed(2), shotN: ss.sh };
      if (goal) { sc[A.side]++; ss.g++; if (creator !== shooter) S(creator).a++;
        const usG = A.side === 'us', t0 = usG ? (HOOK.say ? HOOK.say('goal_us', { sh: shooter.p, as: creator !== shooter ? creator.p : null, m: A.m, home, ug: sc.us, tg: sc.them, xg: q, my }) : `GOAL ${my}! ${shooter.name}.`) : (HOOK.say ? HOOK.say('goal_them', { opp: oppId, opName, m: A.m, xg: q, ug: sc.us, tg: sc.them, home }) : `Goal ${opName}.`);
        ev.push({ m: A.m, k: 'goal', us: usG ? 1 : 0, pid: usG ? shooter.id : null, aid: usG && creator !== shooter ? creator.id : null, t: t0 + ` (xG ${q.toFixed(2)})`, sc: scOld() });
        out(A.m, 'goal', { ...base, score: { ...sc }, before, goalsN: ss.g, w: 5 }); }
      else { const k = onT ? 'save' : blocked ? 'block' : 'miss';
        if (A.side === 'us') ev.push({ m: A.m, k: 'ch', us: 1, pid: shooter.id, t: (HOOK.say ? HOOK.say('ch_us', { sh: shooter.p, xg: q, m: A.m, big: q > 0.3, ug: sc.us, tg: sc.them }) : `${shooter.name} shoots.`) + ` (xG ${q.toFixed(2)})` });
        else if (q > 0.25 || onT) ev.push({ m: A.m, k: 'ch', us: 0, pid: onT && gk.p ? gk.id : null, t: (HOOK.say ? HOOK.say('ch_them', { kp: gk.p || null, opp: oppId, opName, m: A.m, xg: q }) : `${opName} go close.`) + ` (xG ${q.toFixed(2)})` });
        out(A.m, k, { ...base, big: q > 0.25, score: { ...sc }, w: q > 0.25 ? 2.2 : onT ? 0.9 : 0.4 }); }
    }
    for (const side of ['us', 'them']) for (const q of live(side)) { if (q.pos === 'GK') continue;
      const p0 = 0.0016 * (1.6 - q.en / 100) * (side === 'us' ? (0.6 + intn * 0.8) * (G.push.medical > 0 ? 0.6 : 1) * (HOOK.ftInj ? HOOK.ftInj() : 1) : 1);
      if (chance(p0)) { const m = m0 + ri(1, 5); q.on = false; q.off = m; if (q.p) { q.p.inj = ri(1, 7); injured.push(q.p); if (q.p.inj >= 4) { (q.p.ms = q.p.ms || []).push({ s: G.season, w: G.week, t: `Injured against ${opName}, out for ${q.p.inj} weeks.` }); (G.msNew = G.msNew || []).push({ pid: q.p.id, t: `Injured, out for ${q.p.inj} weeks.` }); } ev.push({ m, k: 'inj', us: 1, t: `${q.name} pulls up injured.` }); }
        const e = out(m, 'injury', { side, who: q.name }); if (subs[side] < 3) { const inn = swap(side, { ...q, on: true }, m, 'injury'); q.on = false; if (inn) e.inn = inn.name; } } }
    if (b === 16 && fitCoach && energy('us') - energy('them') > 6) out(82, 'trace', { side: 'us', t: 'fitness' });
    if (b === 3 && intn > 0.6 && share > 0.55) out(18, 'trace', { side: 'us', t: 'intensity' });
    if (!shotsIn && acts.length) out(m0 + 3, 'spell', { side: acts.filter(a => a.side === 'us').length >= acts.length / 2 ? 'us' : 'them' });
  }
  if (!htDone) ev.push({ m: 45, k: 'info', t: `Half-time: ${home ? sc.us + '–' + sc.them : sc.them + '–' + sc.us}.` });
  const ug = sc.us, tg = sc.them, uxg = xg.us, txg = xg.them, result = ug > tg ? 'W' : ug < tg ? 'L' : 'D';
  // minutes, ratings, stats: from what happened (the counters of B42 now come from the events)
  for (const q of us) { const s = S(q), p = q.p, mn = Math.max(0, (q.off != null ? q.off : 90) - (q.start || 0)); if (!p || mn <= 0 && q.start == null) continue; if (mn <= 0) continue;
    const f = mn / 90, ln = LINE[p.pos];
    { // the feed only carries dangerous attacks; the rest of the defending (balls won in midfield, crosses headed away) is drawn here, as before B53
      const shr = poss.reduce((a, v) => a + v, 0) / poss.length / 100, op = 1.3 - shr * 0.6;
      s.tk += poisson(f * (ln === 'DF' ? 1.8 : ln === 'MF' ? 1.7 : ln === 'FW' ? 0.55 : 0) * (0.55 + p.a.tac / 22) * op);
      s.ic += poisson(f * (ln === 'DF' ? 1.3 : ln === 'MF' ? 1.05 : ln === 'FW' ? 0.3 : 0.15) * (0.55 + (p.a.mar + p.a.vis) / 44) * op);
      s.cl += poisson(f * (ln === 'DF' ? 3.8 : ln === 'MF' ? 0.9 : ln === 'FW' ? 0.25 : 0.5) * (0.5 + p.a.hea / 20) * (1.35 - shr * 0.7)); }
    const prg = poisson(f * (p.a.pas + p.a.vis) / 6 * (ln === 'GK' ? 0.2 : 1) * (0.7 + (poss.reduce((a, v) => a + v, 0) / poss.length / 100) * 0.6));
    const dt = poisson(f * (ln === 'FW' ? 7 : ln === 'GK' ? 1 : 9)); let dw = 0; const pw = clamp(0.3 + (p.a.tac + p.a.str - 2 * os) / 60 + 0.18, 0.15, 0.85); for (let i = 0; i < dt; i++) if (rnd() < pw) dw++;
    let rat = 6.2 + s.g * 0.9 + s.a * 0.55 + (s.xg + s.xa) * 0.6 + (result === 'W' ? 0.35 : result === 'L' ? -0.35 : 0) + (dt ? (dw / dt - 0.5) * 0.8 : 0) + prg * 0.03 + (s.tk + s.ic) * 0.02 + s.sv * 0.12 - s.rc * 1.5 + gauss() * 0.35;
    if ((ln === 'DF' || ln === 'GK') && tg === 0 && mn > 60) rat += 0.5; if (ln === 'DF' || ln === 'GK') rat -= tg * 0.15; rat = clamp(rat, 4, 10);
    const cs = (ln === 'GK' || ln === 'DF') && tg === 0 && mn >= 60 ? 1 : 0, ga = ln === 'GK' && mn >= 45 ? tg : 0, ps = p.st;
    for (const [k, v] of [['sh', s.sh], ['sot', s.sot], ['kp', s.kp], ['tk', s.tk], ['ic', s.ic], ['cl', s.cl], ['sv', s.sv], ['cs', cs], ['ga', ga]]) ps[k] = (ps[k] || 0) + v;
    ps.apps++; ps.mins += mn; ps.g += s.g; ps.a += s.a; ps.xg += s.xg; ps.xa += s.xa; ps.prg += prg; ps.dw += dw; ps.dt += dt; ps.rat += rat; ps.yc += s.yc; ps.rc += s.rc;
    p.car.apps++; p.car.g += s.g; p.car.a += s.a; p.lastRat = rat; p.rats = (p.rats || []).concat(rat).slice(-4);
    { p.capps = (p.capps || 0) + 1; const ms = t => { (p.ms = p.ms || []).push({ s: G.season, w: G.week, t }); (G.msNew = G.msNew || []).push({ pid: p.id, t }); };
      if (p.capps === 1 && !p.academy) ms(`Debut for the club against ${opName}${s.g ? ', and scores' : ''}.`); else if (s.g && !p.fg) ms(`First goal for the club, against ${opName}.`);
      if (s.g) p.fg = true; if (s.g >= 3) ms(`Hat-trick against ${opName}.`); else if (rat >= 8.6) ms(`Man of the match against ${opName}, rated ${rat.toFixed(1)}.`); if (p.capps === 50 || p.capps === 100) ms(`${p.capps} games for the club.`); }
    if (p.academy && !p.debut) { p.debut = true; G.ss.grads++; G.paper.stories.push({ h: 'Academy debut', t: `${p.name} (${p.age}) becomes the latest academy graduate to play for the first team.` }); G.st.fans = clamp(G.st.fans + 2, 0, 100); }
    p.yc = (p.yc || 0) + s.yc; if (p.yc >= 5) { p.yc = 0; p.susp = Math.max(p.susp || 0, 1); } }
  ev.sort((a, b) => a.m - b.m); feed.sort((a, b) => a.m - b.m || (a.k === 'ht' ? -1 : 0));
  ev.push({ m: 90, k: 'ft', t: `Full time. ${home ? G.club.name + ' ' + ug + '–' + tg + ' ' + opName : opName + ' ' + tg + '–' + ug + ' ' + G.club.name}.` }); out(94, 'ft', { score: { ...sc } });
  const played = us.filter(q => q.p && ((q.off != null ? q.off : 90) - (q.start || 0)) > 0).map(q => q.p), motm = played.sort((a, b) => (b.lastRat || 0) - (a.lastRat || 0))[0];
  const why = whyLines({ me, os, home, ug, tg, uxg, txg, reds: [red.us, red.them], L, att, result });
  const shots = { us: 0, them: 0 }, sot = { us: 0, them: 0 }; for (const e of feed) if (['goal', 'save', 'miss', 'block'].includes(e.k)) { shots[e.side]++; if (e.k !== 'miss' && e.k !== 'block') sot[e.side]++; }
  return { why, wx, fill: home && G.club.cap ? Math.min(1, attendance() / G.club.cap) : null, comp, home, opp: oppId, oppName: opName, ug, tg, uxg, txg, ev, feed, poss, referee, shots, sot, result, dpre: +(me - os).toFixed(2), edge: +(d0 - (me - os)).toFixed(2), reds: [red.us, red.them], xi: L.xi.map(x => x.p.id), injured, motm: motm ? motm.name : '', att: home ? attendance() : 0, star: opp.star ? opp.star.name : null };
}

// why we won or lost, in two or three plain lines from the real factors (B26)
function whyLines(o) {
  const out = [], P = strengthParts(o.L), q = P.squad - (o.os - (P.coach + P.style + P.morale + P.extra)), gap = o.me - o.os;
  if (o.ug - o.uxg >= 0.9) out.push([2, `We were clinical: ${o.ug} goal${o.ug === 1 ? '' : 's'} from ${o.uxg.toFixed(1)} expected.`]);
  else if (o.uxg - o.ug >= 0.9) out.push([2, `We were wasteful in front: ${o.uxg.toFixed(1)} expected goals, ${o.ug} scored.`]);
  if (o.tg - o.txg >= 0.9) out.push([1.8, `They scored more than their chances deserved.`]);
  else if (o.txg - o.tg >= 0.9) out.push([1.4, `Our keeper and defence kept them out: ${o.txg.toFixed(1)} expected, ${o.tg} conceded.`]);
  if (gap > 0.5) out.push([1.2, 'We had the better players on the pitch.']); else if (gap < -0.5) out.push([1.5, 'They simply had better players.']);
  if (o.reds[0]) out.push([2.5, 'Our red card changed the game.']); if (o.reds[1]) out.push([2.2, 'Their red card opened the game up.']);
  if (o.home && G.club.cap && attendance() / G.club.cap > 0.85 && o.result !== 'L') out.push([1.3, 'A full house pushed us on.']);
  if (P.moraleAvg < 50) out.push([1.4, 'Morale is low, and it showed.']);
  const kids = o.L.xi.filter(x => x.p.age <= 21).length; if (kids >= 5 && o.result === 'L') out.push([1.6, `Five or more under-21s started: they learned the hard way.`]);
  if (o.att > 0.65 && o.tg >= 3) out.push([1.6, 'Going for goals left gaps at the back.']); if (o.att < 0.35 && o.result !== 'L' && o.tg === 0) out.push([1.3, 'Compact and patient: the defensive plan worked.']);
  const dx = o.uxg - o.txg; /* always at least one line: who made the chances */
  out.push([0.5, dx > 0.6 ? `We made the chances: ${o.uxg.toFixed(1)} expected goals to ${o.txg.toFixed(1)}.` : dx < -0.6 ? `They made the chances: ${o.txg.toFixed(1)} expected goals to our ${o.uxg.toFixed(1)}.` : `An even game on chances (${o.uxg.toFixed(1)} to ${o.txg.toFixed(1)}), settled by the finishing.`]);
  return out.sort((a, b) => b[0] - a[0]).slice(0, 3).map(x => x[1]);
}
function quickSim(h, a) { const d = G.clubs[h].str - G.clubs[a].str + 0.3; return [poisson(1.48 * Math.exp(0.22 * d)), poisson(1.17 * Math.exp(-0.22 * d))]; }
function applyResult(t, h, a, hg, ag) { if (G.clubs[h]) G.clubs[h].fm = (G.clubs[h].fm || []).concat(hg > ag ? 'W' : hg < ag ? 'L' : 'D').slice(-5); if (G.clubs[a]) G.clubs[a].fm = (G.clubs[a].fm || []).concat(ag > hg ? 'W' : ag < hg ? 'L' : 'D').slice(-5); const tab = G.divs[t].tab, H = tab[h], A = tab[a]; H.p++; A.p++; H.gf += hg; H.ga += ag; A.gf += ag; A.ga += hg; if (hg > ag) { H.w++; A.l++; H.pts += 3; } else if (hg < ag) { A.w++; H.l++; A.pts += 3; } else { H.d++; A.d++; H.pts++; A.pts++; } }

