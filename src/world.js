/* The Front Office · the seeded world (B38, B39, B42)
   Every league of the world is computed on demand from a seed: nothing is stored except what the CEO changes
   (G.world.moved: players he has taken away from a club). A player is a pure function of
   (seed, league, club, slot, cohort); his season statistics are a pure function of (player, season).
   Domestic leagues are the game's own clubs (names, divisions, strength); our own club shows the real squad.
   The module has its own random generator and never touches the game's RNG, so browsing cannot change a game. */
(function (F) {
'use strict';
const g = () => F.G;
const { clamp, tierAvg, money } = F;
const SW = F.SEASON_WEEKS || 34, REG = F.REGIONS;
const hstr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
const mk = s => { let a = hstr(s); const r = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  r.gauss = () => { let u = 0; for (let i = 0; i < 6; i++) u += r(); return (u - 3) / Math.sqrt(0.5); };
  r.pois = l => { if (l <= 0) return 0; if (l > 30) return Math.max(0, Math.round(l + Math.sqrt(l) * r.gauss())); const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= r(); } while (p > L); return k - 1; };
  r.ri = (x, y) => x + Math.floor(r() * (y - x + 1)); r.pick = arr => arr[Math.floor(r() * arr.length)]; return r; };
const ATTR = ['fin', 'pas', 'dri', 'cro', 'tac', 'mar', 'hea', 'pac', 'sta', 'str', 'vis', 'com', 'han', 'ref'];
const PLAN = ['GK', 'GK', 'CB', 'CB', 'CB', 'CB', 'FB', 'FB', 'FB', 'DM', 'DM', 'CM', 'CM', 'CM', 'AM', 'W', 'W', 'W', 'ST', 'ST'];
const STARTERS = { GK: 1, CB: 2, FB: 2, DM: 1, CM: 2, AM: 1, W: 2, ST: 1 };
const LGS = [...[1, 2, 3, 4, 5, 6, 7, 8].map(t => ({ id: 'd' + t, tier: t, group: 'Domestic', reg: 'dom' })), { id: 'low', group: 'Abroad', reg: 'low', avg: 9.6 }, { id: 'sca', group: 'Abroad', reg: 'sca', avg: 9.2 }, { id: 'ibe', group: 'Abroad', reg: 'ibe', avg: 11 }, { id: 'sam', group: 'Abroad', reg: 'sam', avg: 10.2 }, { id: 'waf', group: 'Abroad', reg: 'waf', avg: 8.2 }, { id: 'eeu', group: 'Abroad', reg: 'eeu', avg: 8.8 }];
const TOWNS = ['Brackley', 'Coldbridge', 'Draymouth', 'Elmbridge', 'Fromemoor', 'Glenmouth', 'Kelmoor', 'Lynfield', 'Oakwell', 'Queenspool', 'Ravenborough', 'Wilborough', 'Ashcombe', 'Barrowby', 'Calderby', 'Dunmere', 'Eastholme', 'Farnley', 'Gransmere', 'Hartwell', 'Kingsmoor', 'Larkfield', 'Marlow Vale', 'Nettlebed', 'Orford', 'Pennard'];
const SUFA = ['FC', 'Sporting', 'Racing', 'Union', 'Olympic', 'Dynamo', 'Atlético', 'Real'];
// per 90 at ability 7, measured on our own squads by test/stats.js (B42); quality scales scoring and creating, much less defending
const B = {
  ST: { xg: .29, xa: .06, sh: 2.9, sot: 1.16, kp: .40, prg: 1.19, dt: 7.2, dwr: .43, tk: .42, ic: .38, cl: .19 },
  W: { xg: .30, xa: .10, sh: 3.06, sot: 1.17, kp: .94, prg: 1.78, dt: 6.9, dwr: .42, tk: .57, ic: .36, cl: .24 },
  AM: { xg: .10, xa: .12, sh: .95, sot: .35, kp: 1.27, prg: 2.2, dt: 8.9, dwr: .39, tk: 1.88, ic: 1.07, cl: .82 },
  CM: { xg: .12, xa: .10, sh: 1.21, sot: .48, kp: .97, prg: 2.45, dt: 9.13, dwr: .47, tk: 1.85, ic: 1.15, cl: .75 },
  DM: { xg: .11, xa: .10, sh: 1.05, sot: .32, kp: .95, prg: 2.12, dt: 9.5, dwr: .50, tk: 1.93, ic: 1.34, cl: .70 },
  FB: { xg: .02, xa: .15, sh: .17, sot: .06, kp: 1.34, prg: 1.99, dt: 9.35, dwr: .44, tk: 2.03, ic: 1.28, cl: 3.52 },
  CB: { xg: .03, xa: .08, sh: .25, sot: .11, kp: .65, prg: 1.30, dt: 8.76, dwr: .49, tk: 1.96, ic: 1.42, cl: 3.62 },
  GK: { xg: 0, xa: 0, sh: 0, sot: 0, kp: .04, prg: .22, dt: .95, dwr: .36, tk: 0, ic: .15, cl: .44 }
};
const W = { GK: { han: 3, ref: 3, com: 2, hea: 1, pas: 1, str: 1 }, ST: { fin: 3, com: 2, hea: 2, pac: 1, str: 1 }, W: { pac: 3, dri: 3, cro: 2, fin: 1 }, AM: { pas: 2, vis: 3, dri: 2, fin: 1, com: 1 }, CM: { pas: 3, vis: 2, sta: 2, tac: 1 }, DM: { tac: 3, mar: 2, pas: 1, sta: 2 }, CB: { tac: 3, mar: 3, hea: 2, str: 2 }, FB: { tac: 2, pac: 2, cro: 2, sta: 2, mar: 1 } };
const cache = {};
function WS() { const G = g(); if (!G.world) G.world = { seed: (G.rs >>> 0) % 1000000007, moved: {} }; if (!G.world.moved) G.world.moved = {}; return G.world; }
const LGDEF = id => LGS.find(l => l.id === id);
function leagueName(id) { const d = LGDEF(id); return d.tier ? F.TIERS[d.tier] : REG[d.reg].name; }
/* ---------- clubs of a league ---------- */
function clubsOf(id) {
  const d = LGDEF(id), G = g();
  if (d.tier) return G.divs[d.tier].clubs.map(cid => { const c = cid === 0 ? null : G.clubs[cid]; return { id: cid, name: cid === 0 ? G.club.name : c.name, str: cid === 0 ? null : c.str - (c.coach ? c.coach.q : 1.2), me: cid === 0 }; });
  const r = mk(WS().seed + '|clubs|' + id), towns = TOWNS.slice().sort(() => r() - .5).slice(0, 18);
  return towns.map((t, i) => ({ id: 'f' + id + i, name: t + ' ' + r.pick(SUFA), str: d.avg + r.gauss() * .6 }));
}
/* ---------- a player: lineage, ability by age, attributes ---------- */
function lineage(r0, key) { const tenure = 3 + (hstr(key + '|T') % 4), off = hstr(key + '|O') % tenure; return { tenure, off }; }
function build(lg, club, slot, season) {
  const S0 = WS().seed, base = `${S0}|${lg}|${club.id}|${slot}`, { tenure, off } = lineage(null, base), cohort = Math.floor((season + off) / tenure), start = cohort * tenure - off, end = start + tenure - 1;
  let tag = cohort; const mv = WS().moved[`${lg}|${club.id}|${slot}|${cohort}`]; const replaced = mv != null && mv <= season; if (replaced) tag = cohort + 'r';
  const r = mk(`${base}|${tag}`), pos = PLAN[slot], w = W[pos], a0 = replaced ? r.ri(20, 27) : r.ri(18, 31), age = a0 + (season - (replaced ? mv : start));
  const dca = a => a <= 23 ? .35 : a <= 29 ? 0 : -.3;
  const caAt = (ag) => { let v = ca0; for (let y = a0; y < ag; y++) v += dca(y); return clamp(v, 1.5, 18); };
  const clubAvg = club.str == null ? tierAvg(g().club.tier) : club.str, isStart = (hstr(base + '|' + tag + '|st') % 100) < 55;
  const ca0 = clamp(clubAvg + (isStart ? .5 : -.5) + r.gauss() * 1.4, 2, 17), pa = clamp(ca0 + (a0 <= 19 ? 1.5 + r() * 5 : a0 <= 21 ? 1 + r() * 4 : a0 <= 24 ? r() * 2.5 : 0), 1, 20);
  const raw = {}; for (const k of ATTR) raw[k] = w[k] ? ca0 + r.gauss() * 1.1 + (w[k] - 1.5) * .5 : (pos === 'GK' && k !== 'han' && k !== 'ref' ? ca0 - 4 + r.gauss() * 1.5 : (k === 'han' || k === 'ref') ? r.ri(1, 4) : ca0 - 2.5 + r.gauss() * 2);
  const pers = { prof: r.ri(4, 19), loy: r.ri(3, 19), temp: r.ri(3, 19), amb: r.ri(3, 19) }, reg = LGDEF(lg).reg, REGN = REG[reg];
  const name = r.pick(REGN.first) + ' ' + r.pick(REGN.last), key = `${lg}|${club.id}|${slot}|${cohort}`;
  return { key, lg, club, slot, pos, name, a0, age, caAt, ca0, pa, raw, pers, reg, startSeason: replaced ? mv : start, endSeason: end, a_: w, cohort, tag, isStart, hs: base + '|' + tag };
}
function attrsAt(P, ca) { const a = {}, d = ca - P.ca0; for (const k of ATTR) a[k] = clamp(P.raw[k] + (P.a_[k] || (k === 'han' || k === 'ref') && P.pos === 'GK' ? d : d * .5), 1, 20); return a; }
/* ---------- a season of statistics: rates by position, scaled by ability, with luck ---------- */
function season(P, ca, age, seasonNo, frac) {
  const K = F.STATK;
  const r = mk(`${P.hs}|S${seasonNo}`), R = B[P.pos];
  const full = P.isStart ? r.ri(2200, SW * 90) : r.ri(200, 1800), mins = Math.round(full * frac), f = mins / 90, q = Math.pow(ca / 7, 1.5), qx = Math.pow(ca / 7, 1.2), qd = .6 + .4 * ca / 7;
  const xgT = R.xg * qx * f, xaT = R.xa * qx * f, xg = Math.max(0, xgT * (1 + r.gauss() * .15)), xa = Math.max(0, xaT * (1 + r.gauss() * .15)), g_ = r.pois(xg), a_ = r.pois(xa);
  const sh = g_ + r.pois(xg / (K.xgPerShot * Math.pow(ca / 7, .6))), sot = Math.min(sh, g_ + r.pois(Math.max(0, sh - g_) * K.sotShare)), kp = a_ + r.pois(xa / K.xaPerKeyPass);
  const dt = Math.round(R.dt * f * (.9 + r() * .2)), dw = Math.round(dt * clamp(R.dwr + (ca - 7) * .012 + r.gauss() * .02, .25, .75)), prg = Math.round(R.prg * (.6 + .4 * q) * f * (.9 + r() * .2));
  const tk = r.pois(R.tk * qd * f), ic = r.pois(R.ic * qd * f), cl = r.pois(R.cl * qd * f);
  let sv = 0, cs = 0, ga = 0; const defends = P.pos === 'GK' || P.pos === 'CB' || P.pos === 'FB';
  if (P.pos === 'GK') { const m = f; ga = r.pois(1.3 * m * (1.05 - (ca - 7) * .03)); sv = r.pois(3.3 * m * (1 + (ca - 7) * .02)); }
  if (defends && f > 0) cs = r.pois(.2 * f * (1 + (ca - 7) * .02) * (P.pos === 'GK' ? 1 : .9));
  const apps = Math.round(mins / 78), rat = apps ? apps * (6.3 + (ca - 7) * .09 + .05 * ((g_ - xgT) + (a_ - xaT)) + r.gauss() * .25 / Math.sqrt(Math.max(.2, mins / 2700))) : 0;
  const yc = r.pois(f * .11), rc = r.pois(f * .0045);
  return { st: { apps, mins, g: g_, a: a_, xg, xa, prg, dw, dt, rat, yc, rc, sh, sot, kp, tk, ic, cl, sv, cs, ga }, tr: { xgT, xaT } };
}
function market(P, ca, age, S) {
  const reg = REG[P.reg], head = S.tr, f = S.st.mins / 90;
  let H, E, sd; const pos = P.pos;
  if (pos === 'ST') { H = S.st.g; E = head.xgT; sd = Math.sqrt(Math.max(E, 1)); } else if (pos === 'W') { H = S.st.g + S.st.a; E = head.xgT + head.xaT; sd = Math.sqrt(Math.max(E, 1)); } else if (pos === 'CM' || pos === 'AM') { H = S.st.a; E = head.xaT; sd = Math.sqrt(Math.max(E, 1)); } else { const apps = Math.max(1, S.st.apps); H = S.st.rat / apps; E = 6.3 + (ca - 7) * .09; sd = .25 / Math.sqrt(Math.max(.2, S.st.mins / 2700)); }
  const z = clamp((H - E) / sd, -2.6, 2.6), perceived = ca + .7 * z, mins = Math.min(1, S.st.mins / 2000);
  const af = age <= 21 ? 1.4 : age <= 24 ? 1.2 : age <= 28 ? 1 : age <= 31 ? .6 : .3;
  return { z, perceived, ask: Math.round(F.wageFor(perceived) * 62 * af * (1 + Math.max(0, P.pa - perceived) * .08) * reg.cost / 100) * 100 * (.5 + .5 * mins) };
}
/* ---------- public: one record ---------- */
function record(P, seasonNo, week) {
  const G = g(), inSeason = G.phase === 'season', frac = inSeason ? Math.max(0, (week - 1) / SW) : 1, ageNow = P.age, ca = P.caAt(ageNow);
  const lastS = seasonNo - 1, last = lastS >= P.startSeason - 3 ? season(P, P.caAt(ageNow - 1), ageNow - 1, lastS, 1) : null;
  const cur = season(P, ca, ageNow, seasonNo, frac), full = season(P, ca, ageNow, seasonNo, 1), mk_ = market(P, ca, ageNow, last || full);
  const hist = []; for (let k = 2; k <= 3; k++) { const ag = ageNow - k; if (ag < 17) break; hist.push({ age: ag, ...season(P, P.caAt(ag), ag, seasonNo - k, 1).st }); }
  const left = P.endSeason - seasonNo, end = left <= 0, contract = end ? .5 : left + 1;
  const wage = Math.round(F.wageFor(ca) / 5) * 5, needy = (hstr(P.hs + '|needy|' + seasonNo) % 100) < 12;
  return { key: P.key, lg: P.lg, club: P.club.name, clubKey: P.club.id, pos: P.pos, name: P.name, age: ageNow, a: attrsAt(P, ca), pers: P.pers, ca, pa: Math.max(P.pa, ca), contract, end, needy, wage, st: last ? last.st : full.st, cur: cur.st, hist, ask: mk_.ask * (end ? .8 : 1) * (needy ? .92 : 1), perceived: mk_.perceived, z: mk_.z, truth: { xgT: (last || full).tr.xgT, xaT: (last || full).tr.xaT }, signed: false };
}
function ours() { const G = g(); return G.squad.map(p => ({ key: 'me|' + p.id, lg: 'd' + G.club.tier, club: G.club.name, clubKey: 0, pos: p.pos, name: p.name, age: p.age, a: p.a, pers: p.pers, ca: p.ca, pa: p.pa || p.ca, contract: p.contract, end: p.contract <= 0, needy: false, wage: p.wage, st: p.lastSeason || p.st, cur: p.st, hist: [], ask: 0, perceived: p.ca, z: 0, truth: {}, signed: true, ours: true, pid: p.id })); }
function leaguePlayers(id) {
  const G = g(), ck = `${WS().seed}|${id}|${G.season}|${G.phase === 'season' ? G.week : 0}|${Object.keys(WS().moved).length}|${G.club.tier}`;
  if (cache[id] && cache[id].ck === ck) return cache[id].v;
  const clubs = clubsOf(id), out = [];
  for (const c of clubs) { if (c.me) { out.push(...ours()); continue; } for (let s = 0; s < PLAN.length; s++) { const P = build(id, c, s, G.season); out.push(record(P, G.season, G.week)); } }
  cache[id] = { ck, v: out }; return out;
}
function worldLeagues() { return LGS.map(d => ({ id: d.id, name: leagueName(d.id), group: d.group, tier: d.tier || null, avg: d.tier ? tierAvg(d.tier) : d.avg })); }
function worldLeague(id) { return { id, name: leagueName(id), clubs: clubsOf(id).map(c => c.name), players: leaguePlayers(id) }; }
function worldPlayer(key) { if (key.startsWith('me|')) return ours().find(p => p.key === key) || null; const [lg, cid, slot] = key.split('|'); const c = clubsOf(lg).find(x => String(x.id) === cid); if (!c) return null; const P = build(lg, c, +slot, g().season); return P.key === key ? record(P, g().season, g().week) : null; }
function worldRemove(key) { const w = WS(); w.moved[key] = g().season; for (const id in cache) delete cache[id]; }
/* ---------- what the CEO does in the portal: flags with a reason, scouts who confirm (all saved in G.world) ---------- */
const WX = () => { const w = WS(); w.flags = w.flags || {}; w.know = w.know || {}; return w; };
const aw = () => F.absWeek();
// scout slots per week: a chief scout gives three, without one the DoF's own people manage one
function worldSlots() { const w = WX(); if (w.usedAt !== aw()) { w.usedAt = aw(); w.used = 0; } const total = F.staff('scout') ? 3 : 1; return { total, left: Math.max(0, total - w.used) }; }
function worldMeta(key) { const w = WX(), f = w.flags[key], k = w.know[key]; return { fl: !!f, hyp: f ? f.hyp || null : null, confirmed: k ? (aw() > k.at ? 2 : 1) : 0 }; }
// the flag keeps what he looked like when you flagged him, so the bet can be settled later (B46)
const snapOf = r => ({ s: g().season, w: g().week, name: r.name, club: r.club, lg: r.lg, pos: r.pos, age: r.age, ca: +r.ca.toFixed(2), pa: +r.pa.toFixed(2), ask: Math.round(r.ask), end: !!r.end, st: r.st, truth: r.truth || null });
function worldFlag(key, hyp) { const w = WX(); if (!w.flags[key]) { const r = worldPlayer(key); w.flags[key] = { at: aw(), snap: r && !r.ours ? snapOf(r) : null }; } if (hyp !== undefined) w.flags[key].hyp = hyp; }
function worldUnflag(key) { delete WX().flags[key]; }
// B45: a flagged player can become a target: he moves into the DoF's pipeline (recruit.js) with his own price and attributes
function worldTargetState(key) { const f = WX().flags[key]; if (!f || !f.target) return null; const r = g().rec, x = r && r.pipe.find(y => y.pid === f.target); return { pid: f.target, stage: x ? x.stage : 'gone', blocked: x && x.blocked ? x.blocked : null, note: x && x.note || null }; }
function worldTarget(key) {
  const f = WX().flags[key]; if (!f) return { err: 'Flag him first.' };
  const ts = worldTargetState(key); if (ts && !['lost', 'gone'].includes(ts.stage)) return { err: 'He is already on the DoF\'s list.' };
  const rec = worldPlayer(key); if (!rec || rec.ours) return { err: 'He is not available.' }; if (!F.recTarget) return { err: 'Recruitment is not available.' };
  const d = LGDEF(rec.lg), r = F.recTarget({ ...rec, reg: d.reg, domClub: typeof rec.clubKey === 'number' && rec.clubKey > 0 ? rec.clubKey : null, tier: d.tier || null }, key, f.hyp);
  if (r.err) return r; f.target = r.pid; return { ok: true };
}
// signed through the pipeline: he leaves the world, and the bet is kept
function worldSigned(key, p) { const f = WX().flags[key]; if (f) f.signed = { s: g().season, w: g().week, ca: +p.ca.toFixed(1), name: p.name, pid: p.id }; worldRemove(key); }
function worldConfirm(key) { const w = WX(), s = worldSlots(); if (w.know[key]) return { err: 'The scouts have already been asked.' }; if (s.left < 1) return { err: 'No scout is free this week.' }; w.know[key] = { at: aw() }; w.used = (w.used || 0) + 1; const t = w.flags[key] && w.flags[key].target; if (t && F.recMoreReport) F.recMoreReport(t); return { ok: true }; }
// the bets: every flag with its snapshot, and how he looks now (as our player if we signed him). A bet settles once a season has passed.
function worldBets() { const w = WX(); return Object.keys(w.flags).map(key => { const f = w.flags[key]; if (!f.snap) return null; const now = f.signed ? worldPlayer('me|' + f.signed.pid) : worldPlayer(key); return { key, hyp: f.hyp || null, snap: f.snap, signed: f.signed || null, target: f.target || null, now, ready: g().season > f.snap.s }; }).filter(Boolean); }
function worldFlagged() { return Object.keys(WX().flags).map(key => ({ key, ...WX().flags[key] })); }
Object.assign(F, { worldLeagues, worldLeague, worldPlayer, worldRemove, WORLD_PLAN: PLAN, worldSlots, worldMeta, worldFlag, worldUnflag, worldConfirm, worldFlagged, worldTarget, worldTargetState, worldSigned, worldBets });
})(FO);
