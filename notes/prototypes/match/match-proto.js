/* Prototype: a match as a chain of attacks with real players, and a text engine on top.
   Runs on a real game state (F = FO). Own seeded RNG, so it never touches the game's RNG. Not part of the game. */
module.exports = function protoMatch(F, opts = {}) {
  const G = F.G, P = F.mtPreview(); if (!P) return null;
  const oppId = P.id, home = P.home, opp = G.clubs[oppId];
  // ---------- seeded RNG ----------
  let s = ((G.rs >>> 0) ^ (G.season * 7919) ^ (G.week * 104729) ^ (opts.seed || 0)) >>> 0;
  const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1)), chance = p => rnd() < p, pick = a => a[Math.floor(rnd() * a.length)];
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const poisson = l => { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
  const wpick = (arr, w) => { const ws = arr.map(w), t = ws.reduce((a, b) => a + b, 0); let r = rnd() * t; for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1]; };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const LINE = { GK: 'GK', CB: 'DF', FB: 'DF', DM: 'MF', CM: 'MF', AM: 'MF', W: 'FW', ST: 'FW' };
  const SLOTS = ['GK', 'FB', 'CB', 'CB', 'FB', 'DM', 'CM', 'AM', 'W', 'ST', 'W'];
  // ---------- the two teams ----------
  const L = F.pickXI(false), me = F.teamStrength(L);
  const mk = (p, slot, side) => ({ id: p.id, name: p.name, short: p.name.split(' ').slice(-1)[0], pos: slot, ca: p.ca, a: p.a, pers: p.pers || {}, age: p.age, side, en: 100, on: true, src: p });
  const us = L.xi.map(x => mk(x.p, x.slot, 'us')), bench = L.bench.map(p => mk(p, p.pos, 'us'));
  // the opponent gets stable names and attributes from its club (seeded on the club, not the match)
  const FN = ['Owen', 'Callum', 'Rhys', 'Declan', 'Marcus', 'Ellis', 'Jonah', 'Kieran', 'Theo', 'Isaac', 'Ruben', 'Lewis', 'Nathan', 'Aaron', 'Harvey', 'Luca', 'Felix', 'Dylan', 'Ryan', 'Tobias'];
  const LN = ['Ashworth', 'Brennan', 'Carver', 'Dunmore', 'Ellery', 'Fairbank', 'Garside', 'Holloway', 'Ingram', 'Jessop', 'Kendrick', 'Lowther', 'Marsden', 'Nolan', 'Oakes', 'Pritchard', 'Quill', 'Radcliffe', 'Sefton', 'Thorne', 'Varley', 'Whitlock'];
  let cs = 0; for (const ch of opp.name + oppId) cs = (cs * 31 + ch.charCodeAt(0)) >>> 0; const cr = () => { cs = (cs * 1103515245 + 12345) >>> 0; return cs / 4294967296; };
  const os = opp.str + gauss() * 0.3, star = P.star || null, them_star_set = { v: false };
  const them = SLOTS.map((slot, i) => { const ca = clamp(opp.str - (opp.coach ? opp.coach.q : 1.2) + (cr() - 0.5) * 2.2, 2, 18); const a = {}; for (const k of ['fin', 'com', 'pas', 'vis', 'cro', 'tac', 'mar', 'hea', 'ref', 'han', 'pac', 'sta', 'str', 'dri']) a[k] = clamp(ca + (cr() - 0.5) * 4, 1, 20);
    let name = FN[Math.floor(cr() * FN.length)] + ' ' + LN[Math.floor(cr() * LN.length)]; if (star && slot === star.pos && !them_star_set.v) { name = star.name; them_star_set.v = true; a.fin += 3; a.com += 2; }
    return { id: 'o' + i, name, short: name.split(' ').slice(-1)[0], pos: slot, ca, a, pers: { temp: 6 + Math.floor(cr() * 12) }, side: 'them', en: 100, on: true, star: !!(star && name === star.name) }; });
  // ---------- the context the CEO created ----------
  const att = F.cact('attack') / 100, intn = F.cact('intensity') / 100, wx = F.wxFor(G.season, G.week, oppId);
  const edge = F.HOOK.homeEdge ? F.HOOK.homeEdge(home) : (home ? 0.35 : -0.35);
  const fitCoach = F.deptHas ? F.deptHas('first', 'fit') : false, fill = home && G.club.cap ? Math.min(1, F.attendance() / G.club.cap) : 0;
  const style = (F.HOOK.oppStyle ? F.HOOK.oppStyle(oppId) : { vol: 1, oxg: 1 });
  const d0 = me - os + edge;
  // ---------- state ----------
  const ev = [], sc = { us: 0, them: 0 }, xg = { us: 0, them: 0 }, shots = { us: 0, them: 0 }, sot = { us: 0, them: 0 }, red = { us: 0, them: 0 }, subs = { us: 0, them: 0 };
  const st = new Map(); const S = p => { if (!st.has(p.id)) st.set(p.id, { g: 0, a: 0, xg: 0, xa: 0, sh: 0, sot: 0, kp: 0, tk: 0, ic: 0, cl: 0, sv: 0 }); return st.get(p.id); };
  const live = side => (side === 'us' ? us : them).filter(p => p.on);
  const add = e => { ev.push(e); return e; };
  const energy = side => { const l = live(side).filter(p => p.pos !== 'GK'); return l.length ? l.reduce((a, p) => a + p.en, 0) / l.length : 100; };
  add({ m: 0, k: 'ko', w: 1 });
  // ---------- 19 blocks of five minutes (the last one is stoppage time) ----------
  const BLOCKS = 19;
  for (let b = 0; b < BLOCKS; b++) {
    const m0 = b * 5, phase = m0 < 15 ? 'start' : m0 >= 75 ? 'end' : 'mid';
    if (b === 9) add({ m: 45, k: 'ht', w: 2, score: { ...sc } });
    // fatigue: intensity burns energy, stamina and a fitness coach slow it
    for (const p of [...live('us'), ...live('them')]) { if (p.pos === 'GK') continue; const burn = (1.9 + (p.side === 'us' ? intn : 0.5) * 1.4) * (1.25 - p.a.sta / 40) * (p.side === 'us' && fitCoach ? 0.8 : 1); p.en = clamp(p.en - burn, 25, 100); }
    // substitutions between 60 and 80: the most tired outfield player makes way
    if (m0 >= 60 && m0 <= 80) for (const side of ['us', 'them']) { if (subs[side] >= 3 || !chance(0.42)) continue; const tired = live(side).filter(p => p.pos !== 'GK').sort((a, b2) => a.en - b2.en)[0]; if (!tired || tired.en > 82) continue;
      let inn; if (side === 'us') { const i = bench.findIndex(x => x.pos === tired.pos || LINE[x.pos] === LINE[tired.pos]); inn = bench.splice(i >= 0 ? i : 0, 1)[0]; } else { const nm = FN[ri(0, FN.length - 1)] + ' ' + LN[ri(0, LN.length - 1)]; inn = { id: 'o' + (20 + subs.them), name: nm, short: nm.split(' ').slice(-1)[0], pos: tired.pos, ca: tired.ca - 0.4, a: { ...tired.a }, pers: {}, side, en: 100, on: true }; them.push(inn); }
      if (!inn) continue; inn.pos = tired.pos; inn.en = 100; inn.on = true; tired.on = false; subs[side]++; if (side === 'us') us.push(inn);
      add({ m: m0 + ri(1, 4), k: 'sub', side, inn: inn.name, out: tired.name, tired: Math.round(tired.en), w: 0.6 }); }
    // the balance of play in this block: quality, score, red cards, energy, the coach's settings, the phase
    const diff = sc.us - sc.them; let adj = -0.9 * red.us + 0.9 * red.them + (energy('us') - energy('them')) / 100 * 0.9;
    if (diff < 0) adj += (0.25 + att * 0.3) * (m0 >= 60 ? 1.3 : 1); else if (diff > 0) adj -= (0.25 + (m0 >= 65 ? (1 - att) * 0.25 : 0)) * (m0 >= 60 ? 1.3 : 1);
    if (phase === 'start') adj += (intn - 0.5) * 0.3;
    if (home && fill > 0.85 && phase === 'end') adj += 0.12;
    const share = 1 / (1 + Math.exp(-0.6 * (d0 + adj)));
    // attacks in this block (both sides together): more with an attacking coach and an open opponent, fewer in rain
    const n = poisson(2.25 * (0.85 + 0.3 * att) * style.vol * (wx.rain ? 0.92 : 1) * (b === 18 ? 0.8 : 1)), acts = [];
    for (let i = 0; i < n; i++) acts.push({ m: m0 + ri(1, 5), side: chance(share) ? 'us' : 'them' });
    acts.sort((a, c) => a.m - c.m);
    let shotsInBlock = 0;
    for (const A of acts) {
      const atk = live(A.side), def = live(A.side === 'us' ? 'them' : 'us'); if (atk.length < 8) continue;
      const gk = def.find(p => p.pos === 'GK') || def[0], fat = q => 0.75 + q.en / 400;
      const builder = wpick(atk.filter(p => p.pos !== 'GK'), p => ({ DF: 1.2, MF: 2, FW: 0.6 }[LINE[p.pos]]) * (p.a.pas + 2));
      const wide = chance(0.42), creator = wpick(atk.filter(p => p !== builder && p.pos !== 'GK'), p => (wide ? (p.pos === 'W' || p.pos === 'FB' ? 3 : 0.6) * (p.a.cro + 2) : (p.pos === 'AM' || p.pos === 'CM' ? 2.5 : 1) * (p.a.pas + p.a.vis)) * fat(p));
      const stopper = wpick(def.filter(p => p.pos !== 'GK'), p => ({ DF: 2.2, MF: 1.6, FW: 0.4 }[LINE[p.pos]]) * (p.a.tac + p.a.mar) * fat(p));
      // does it become a shot? attacking quality against the defender who meets it
      const pShot = clamp(0.6 + (creator.a.pas + creator.a.vis - stopper.a.tac - stopper.a.mar) * 0.006 + (att - 0.5) * 0.1 * (A.side === 'us' ? 1 : -0.5), 0.35, 0.8);
      if (!chance(pShot)) { const how = chance(0.55) ? 'tk' : 'ic'; S(stopper)[how]++; if (chance(0.16)) { add({ m: A.m, k: 'corner', side: A.side, by: creator.name, w: 0.3 }); } else add({ m: A.m, k: 'lost', side: A.side, by: creator.name, stop: stopper.name, how, wide, w: 0.15 });
        // a foul in the duel: cards
        if (chance(0.085)) { const off = chance(0.6) ? stopper : creator, side = off.side, isRed = chance(0.055) || ((off.pers.temp || 10) > 16 && chance(0.12)); if (isRed) { off.on = false; red[side]++; add({ m: A.m, k: 'red', side, who: off.name, w: 3 }); } else add({ m: A.m, k: 'yellow', side, who: off.name, w: 0.4 }); }
        continue; }
      // the shot: who, from where, how good
      const header = wide && chance(0.35), close = !header && chance(0.16), edge2 = !header && !close && chance(0.33);
      const shooter = header ? wpick(atk.filter(p => p !== creator && p.pos !== 'GK'), p => ({ DF: 0.8, MF: 1, FW: 2.6 }[LINE[p.pos]]) * (p.a.hea + 2)) : wpick(atk.filter(p => p !== creator && p.pos !== 'GK'), p => ({ DF: 0.3, MF: 1.3, FW: 3 }[LINE[p.pos]]) * (p.a.fin + 2) * (p.star ? 2.2 : 1));
      let q = header ? 0.09 : close ? 0.34 : edge2 ? 0.045 : 0.115; q *= 0.6 + rnd() * 0.8; q *= 1 + 0.05 * ((header ? shooter.a.hea : shooter.a.fin) - stopper.a.tac) / 2; q *= (wx.rain ? 0.95 : 1) * (A.side === 'them' ? style.oxg : 1) * fat(shooter);
      q = clamp(q, 0.02, 0.8); xg[A.side] += q; shots[A.side]++; shotsInBlock++; const ss = S(shooter); ss.sh++; ss.xg += q; if (creator) { S(creator).kp++; S(creator).xa += q; }
      const onT = chance(clamp(0.3 + q * 0.9, 0.25, 0.85)); const blocked = !onT && chance(0.28);
      const goal = onT && chance(clamp(q / (0.3 + q * 0.9) * (1 + (shooter.a.com - 10) * 0.02) * (1 - (gk.a.ref - 10) * 0.025), 0.02, 0.95));
      if (blocked) S(stopper).cl++;
      if (onT) { sot[A.side]++; ss.sot++; if (!goal) S(gk).sv++; }
      const kind = header ? 'header' : close ? 'close' : edge2 ? 'distance' : 'box';
      if (goal) { sc[A.side]++; ss.g++; if (creator) S(creator).a++;
        add({ m: A.m, k: 'goal', side: A.side, who: shooter.name, whoId: shooter.id, star: !!shooter.star, by: creator.name, byId: creator.id, from: builder.name, kind, wide, xg: +q.toFixed(2), score: { ...sc }, w: 5 }); }
      else add({ m: A.m, k: onT ? 'save' : blocked ? 'block' : 'miss', side: A.side, who: shooter.name, whoId: shooter.id, by: creator.name, keeper: gk.name, stop: stopper.name, kind, xg: +q.toFixed(2), big: q > 0.25, w: q > 0.25 ? 2.2 : onT ? 0.9 : 0.4 });
    }
    // injuries: tired legs break more often; a forced change if there is one left
    for (const side of ['us', 'them']) for (const p of live(side)) { if (p.pos === 'GK') continue; if (chance(0.0016 * (1.6 - p.en / 100) * (side === 'us' && F.HOOK.ftInj ? F.HOOK.ftInj() : 1))) { p.on = false; const e = add({ m: m0 + ri(1, 5), k: 'injury', side, who: p.name, w: 1.6 });
      if (subs[side] < 3) { let inn; if (side === 'us') { const i = bench.findIndex(x => LINE[x.pos] === LINE[p.pos]); inn = bench.splice(i >= 0 ? i : 0, 1)[0]; } else { const nm = FN[ri(0, FN.length - 1)] + ' ' + LN[ri(0, LN.length - 1)]; inn = { id: 'o' + (30 + subs.them), name: nm, short: nm.split(' ').slice(-1)[0], pos: p.pos, ca: p.ca - 0.5, a: { ...p.a }, pers: {}, side, en: 100, on: true }; them.push(inn); }
        if (inn) { inn.pos = p.pos; inn.on = true; inn.en = 100; subs[side]++; if (side === 'us') us.push(inn); e.inn = inn.name; } } } }
    // the CEO's trace: only when the engine really shows it
    if (phase === 'end' && b === 16 && fitCoach && energy('us') - energy('them') > 6) add({ m: 82, k: 'trace', side: 'us', t: 'fitness', w: 1.2 });
    if (b === 3 && intn > 0.6 && share > 0.55) add({ m: 18, k: 'trace', side: 'us', t: 'intensity', w: 1 });
    if (shotsInBlock === 0 && acts.length) add({ m: m0 + 3, k: 'spell', side: acts.filter(a => a.side === 'us').length >= acts.length / 2 ? 'us' : 'them', w: 0.2 });
  }
  add({ m: 94, k: 'ft', w: 3, score: { ...sc } });
  ev.sort((a, b) => a.m - b.m || (a.k === 'ht' ? -1 : 0));
  return { opp: { id: oppId, name: P.name, short: opp.short || P.name.split(' ')[0].slice(0, 3).toUpperCase(), star: star && star.name }, home, rival: P.rival, wx, fill, att, intn, d0: +d0.toFixed(2), sc, xg: { us: +xg.us.toFixed(2), them: +xg.them.toFixed(2) }, shots, sot, red, ev, us: us.map(p => ({ id: p.id, name: p.name, pos: p.pos, en: Math.round(p.en), on: p.on, st: st.get(p.id) || null })), them: them.map(p => ({ id: p.id, name: p.name, pos: p.pos, star: !!p.star, st: st.get(p.id) || null })), club: { name: G.club.name, short: G.club.short, colors: G.club.colors } };
};
