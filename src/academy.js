/* The Front Office · youth academy, module 2 part 1
   Age groups, academy staff, development model, education and welfare, pathway. Plugs into engine hooks. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { ri, pick, chance, clamp, gauss, money, M, staff, man, tierAvg, absStars, upd, wageFor } = F;
const GROUPS = ['U14', 'U16', 'U18', 'U21'], CAP = { U14: 10, U16: 10, U18: 10, U21: 6 };
const grp = p => p.age <= 14 ? 'U14' : p.age <= 16 ? 'U16' : p.age <= 18 ? 'U18' : 'U21';
const YROLES = [
  { id: 'ycoach', t: 'Head of Coaching', at: ['Technique', 'Physical', 'Mentality'], bio: ['Former national youth team coach', 'Ran a famous Saturday-morning school', 'Ex-pro with a coaching badge collection', 'Sports scientist turned coach'] },
  { id: 'yrec', t: 'Head of Youth Recruitment', at: ['Judging potential', 'Network', 'Persuasion'], bio: ['Knows every grassroots club in the county', 'Former schools football organiser', 'Poached talent for a big academy for years', 'Ex-agent with a conscience'] },
  { id: 'ycare', t: 'Player Care & Education', at: ['Welfare', 'Education', 'Communication'], bio: ['Former head teacher', 'Youth worker from the estate', 'Sports psychologist', 'Ran a boarding school pastoral team'] },
];
const YR = Object.fromEntries(YROLES.map(r => [r.id, r]));
const A = () => g().acad;
const ys = id => A() && A().staff[id] || null;
const YB = { ycoach: [0, 'yc'], yrec: [1, 'yr'], ycare: [2, 'wo'] };
// the academy director and the department staff lift the youth staff: one academy, one chain of command
const ybonus = (id, i) => { const b = YB[id]; if (!b) return 0; const dh = F.deptHas ? F.deptHas : () => false; return (staff('acad') ? (F.eff('acad', b[0]) - 10) * 0.7 : -2) + (dh('academy', b[1]) ? 2.5 : 0) + (id === 'ycare' && i === 1 && dh('academy', 'ed') ? 3 : 0) + (id === 'ycoach' && dh('academy', 'ed') ? 0.8 : 0); };
const yv = (id, i) => { const s = ys(id); const base = !s ? 4 : i == null ? (s.at[0] + s.at[1] + s.at[2]) / 3 : s.at[i]; return clamp(base + ybonus(id, i), 1, 22); };
const bud = () => man('acad', 'budget') / 100;
const tierLvl = () => absStars(tierAvg(g().club.tier));

/* ---------- staff ---------- */
function hireY(id) {
  const q = (bud() - 0.45) * 3 + (F.eff('acad', 1) - 10) * 0.1, s = F.genStaff('acad', g().club.tier, q);
  s.role = id; s.bio = pick(YR[id].bio); s.wage = Math.round(s.wage * 0.55 / 5) * 5; s.rel = 60; A().staff[id] = s;
  return s;
}
/* ---------- players ---------- */
function band(p) {
  const sd = clamp(3.2 - (yv('ycoach', 2) + yv('yrec', 0)) / 14 - (p.age - 13) * 0.25, 0.5, 3);
  if (p.bias == null) p.bias = gauss();
  const mid = p.pa + p.bias * sd * 0.5;
  p.band = [absStars(Math.max(p.ca, mid - sd)), absStars(mid + sd)];
  return p.band;
}
function genYouth(age, src) {
  const c = g().club, a = A();
  const cat = a.cat || 4, intl = cat <= 2 || F.perk('boarding'), reg = src === 'local' ? 'dom' : chance(man('acad', 'local') / 100) ? 'dom' : intl ? pick(Object.keys(F.REGIONS)) : pick(['dom', 'dom', 'low']);
  const pa = clamp(5.2 + a.found.q * 0.055 + c.fac.youth * 0.22 + (yv('yrec', 0) - 10) * 0.09 + a.rep * 0.025 + (F.perk('partner') ? 0.6 : 0) + (g().push.academy > 0 ? 0.4 : 0) + ({ 1: 1.2, 2: 0.8, 3: 0.4, 4: 0 })[cat] + gauss() * 2.1, 3, 19);
  const ca = clamp(pa * (0.3 + (age - 13) * 0.09) + gauss() * 0.5, 1.2, pa);
  const tech = man('acad', 'technical');
  const p = F.genPlayer({ age, ca, region: reg, academy: true, tech: tech > 60, phys: tech < 40 });
  p.pa = Math.max(p.ca, pa); p.edu = ri(45, 75); p.wel = ri(55, 80); p.joinedAcad = g().season; p.hist = [{ s: g().season, ca: +p.ca.toFixed(2) }];
  p.wage = age >= 16 ? Math.round(M(35) / 5) * 5 : 0; p.contract = 2; upd(p); band(p);
  return p;
}
function ensure() {
  const G = g(); if (!G || !G.club) return;
  if (!G.acad) {
    G.acad = { found: { n: 40, q: 25 + G.club.fac.youth * 4 }, staff: {}, lv: { U14: 3, U16: 3, U18: 3, U21: 3 }, rep: 15 + (G.club.dna.talent === 'academy' ? 15 : 0) + G.club.fac.youth * 2, log: [], drop: [], cohorts: {}, notes: [] };
    for (const r of YROLES) hireY(r.id);
  }
  for (const p of G.academy) { if (p.edu == null) { p.edu = ri(50, 75); p.wel = ri(55, 80); p.hist = [{ s: G.season, ca: +p.ca.toFixed(2) }]; } band(p); }
}
H.acadMigrate = ensure;
H.acadInit = () => {
  ensure(); const G = g();
  for (let i = 0; i < 6; i++) G.academy.push(genYouth(ri(13, 14)));
  for (let i = 0; i < 5; i++) G.academy.push(genYouth(ri(15, 16)));
  for (let i = 0; i < 4; i++) G.academy.push(genYouth(ri(17, 18)));
};
H.acadCost = () => { ensure(); const a = A(); let w = 0; for (const r of YROLES) if (a.staff[r.id]) w += a.staff[r.id].wage; for (const p of g().academy) w += p.wage || 0; w += Math.round(M(20) * (GROUPS.reduce((x, k) => x + a.lv[k], 0) / 4)); return w; };

/* ---------- weekly ---------- */
H.acadWeekly = () => {
  ensure(); const G = g(), a = A(), c = G.club, b = bud(), wf = man('acad', 'welfare'), ph = man('acad', 'philosophy'), tech = man('acad', 'technical') / 100;
  for (const k of GROUPS) { const t = 2 + b * 5 + c.fac.youth * 0.3 + yv('ycoach', 0) / 6 + (k === 'U21' ? -0.5 : 0) + (F.perk('indoor') ? 1 : 0); a.lv[k] = clamp(a.lv[k] + (t - a.lv[k]) * 0.02, 1, 10); }
  a.found.q = clamp(a.found.q + ((20 + c.fac.youth * 4 + b * 25 + yv('yrec', 1) * 1.2 + a.rep * 0.2 + (a.sat || 0) * 8) - a.found.q) * 0.01, 0, 100);
  a.found.n = Math.round(clamp(30 + a.rep * 0.4 + (man('acad', 'local') > 60 ? 10 : 0) + (a.sat || 0) * 15, 20, 150));
  a.rep = clamp(a.rep + ((10 + c.fac.youth * 4 + G.squad.filter(p => p.academy).length * 4 + a.log.length * 1.5 + b * 10) - a.rep) * 0.006, 0, 100);
  const TECH = ['pas', 'dri', 'vis', 'com', 'fin', 'cro'], PHYS = ['pac', 'sta', 'str', 'hea', 'tac', 'mar'];
  for (const p of G.academy) {
    const k = grp(p), mult = 0.45 + a.lv[k] / 10 * 0.5 + yv('ycoach') / 20 * 0.35 + c.fac.youth * 0.04 + (p.playUp ? 0.15 : 0) + (p.loanOut ? 0.25 : 0) + (p.mentor ? 0.08 : 0) + (p.pers.prof - 10) * 0.03 + (p.wel - 60) / 200 + (ph < 40 ? 0.05 : -0.03) + (G.push.academy > 0 ? 0.3 : 0) + (F.perk('ysci') ? 0.1 : 0);
    const ga = Math.max(0, p.pa - p.ca) * (k === 'U21' ? 0.0025 : 0.0033) * mult, w = F.POSW[p.pos];
    for (const at in w) { const wt = TECH.includes(at) ? 0.6 + tech * 0.8 : PHYS.includes(at) ? 0.6 + (1 - tech) * 0.8 : 1; p.a[at] = clamp(p.a[at] + ga * wt * (0.6 + F.rnd() * 0.8), 1, 20); }
    upd(p); if (p.ca > p.pa) p.pa = p.ca;
    const eT = clamp(40 + yv('ycare', 1) * 2 + wf * 0.2 + b * 10 + (F.perk('edu') ? 15 : 0), 0, 100), wT = clamp(48 + yv('ycare', 0) * 1.8 + wf * 0.25 - ph * 0.15 - (p.playUp ? 8 : 0) - (p.loanOut ? 5 : 0) + (F.perk('boarding') ? 8 : 0) + (F.perk('ysci') ? 5 : 0), 0, 100);
    p.edu = clamp(p.edu + (eT - p.edu) * 0.03, 0, 100); p.wel = clamp(p.wel + (wT - p.wel) * 0.04, 0, 100);
    p.morale = clamp((p.morale || 65) + (p.wel - p.morale) * 0.05, 0, 100);
  }
  if (G.week % 4 === 0) G.academy.forEach(band);
};

/* ---------- intake (week 28) ---------- */
H.acadIntake = () => {
  ensure(); const G = g(), a = A();
  const n = clamp(Math.round(3 + yv('yrec', 1) / 6 + a.rep / 35 + G.club.fac.youth / 4 + (4 - (a.cat || 4)) * 0.5 + (F.perk('boarding') ? 1 : 0)), 3, 9), got = [];
  for (let i = 0; i < n; i++) { const p = genYouth(ri(12, 13), chance(man('acad', 'local') / 100) ? 'local' : null); G.academy.push(p); got.push(p); }
  const late = yv('yrec', 2) >= 11 ? (chance(0.5) ? 2 : 1) : chance(0.4) ? 1 : 0;
  for (let i = 0; i < late; i++) { const p = genYouth(ri(14, 15)); p.lateJoin = true; G.academy.push(p); got.push(p); }
  a.cohorts[G.season] = got.map(p => p.id);
  const best = got.slice().sort((x, y) => y.pa - x.pa)[0];
  G.paper.stories.push({ h: 'Academy intake', t: `${got.length} youngsters join the academy (${late ? late + ' scouted late into the under-16s' : 'all into the under-14s'}). ${A().staff.yrec ? A().staff.yrec.name : 'The recruiters'} rate ${best.name} highest: potential ${best.band[0]}–${best.band[1]}★.` });
  if (best.band[1] >= 4) F.queueEvent('wonderkid', { pid: best.id });
  trim();
};
function trim() {
  const G = g();
  for (const k of GROUPS) { const ps = G.academy.filter(p => grp(p) === k).sort((a, b) => b.pa + b.bias * 0.5 - (a.pa + a.bias * 0.5)); for (const p of ps.slice(CAP[k])) { G.academy = G.academy.filter(x => x !== p); A().drop.push({ name: p.name, season: G.season, why: `released from a full ${k} group` }); } }
}

/* ---------- season end ---------- */
H.acadSeason = rep => {
  ensure(); const G = g(), a = A(), out = { promoted: [], scholars: [], released: [], dropped: [], u21: [], loans: [], spurts: [], bloom: [] };
  const thr = tierAvg(G.club.tier) - 0.7 - man('acad', 'pace') / 100 * 0.7, pace = man('acad', 'pace') / 100;
  for (const p of G.academy.slice()) {
    p.age++;
    if (p.age <= 17 && chance(0.15)) { for (const at in F.POSW[p.pos]) p.a[at] = clamp(p.a[at] + 0.6 + F.rnd() * 0.8, 1, 20); out.spurts.push(p.name); }
    if (p.age >= 16 && p.age <= 18 && chance(0.08)) { p.pa = clamp(p.pa + 1 + F.rnd(), 1, 20); out.bloom.push(p.name + ' (late bloomer)'); }
    else if (p.age >= 15 && chance(0.06)) { p.pa = Math.max(p.ca, p.pa - 1 - F.rnd()); }
    if (man('acad', 'mentors') === 'yes' && p.age >= 17 && G.squad.some(x => x.age >= 27 && x.pers.prof >= 15)) { p.pers.prof = Math.min(20, p.pers.prof + 1); p.mentor = true; } else p.mentor = false;
    upd(p); band(p); (p.hist = p.hist || []).push({ s: G.season + 1, ca: +p.ca.toFixed(2) });
    // dropout
    const dp = 0.07 + Math.max(0, 55 - p.wel) / 250 + Math.max(0, 50 - p.edu) / 400 + (p.band[1] < tierLvl() - 0.5 ? 0.06 : 0);
    if (p.age <= 18 && chance(dp)) { G.academy = G.academy.filter(x => x !== p); const why = p.wel < 45 ? 'burnt out' : p.edu < 40 ? 'chose school over football' : 'lost interest'; a.drop.push({ name: p.name, season: G.season, why }); out.dropped.push(`${p.name} (${why})`); continue; }
    // pathway
    if (p.age === 17) { const keep = p.band[1] >= tierLvl() - 0.5 - (1 - pace) * 0.5 || p.lateJoin; if (keep) { p.wage = Math.round(M(60) / 5) * 5; p.contract = 2; out.scholars.push(p.name); } else { G.academy = G.academy.filter(x => x !== p); a.drop.push({ name: p.name, season: G.season, why: 'no scholarship' }); out.released.push(p.name); } continue; }
    if (p.age >= 19) {
      if ((p.ca >= thr || (p.age >= 20 && absStars(p.pa) >= tierLvl() + 0.5)) && G.squad.length < 27) { promote(p); out.promoted.push(p.name); continue; }
      const u21 = G.academy.filter(x => grp(x) === 'U21' && x !== p).length;
      if (p.age <= 21 && (p.keep || (p.band[1] >= tierLvl() - 0.5 && u21 < CAP.U21))) { p.wage = Math.round(M(90) / 5) * 5; out.u21.push(p.name); }
      else { G.academy = G.academy.filter(x => x !== p); a.drop.push({ name: p.name, season: G.season, why: 'released at ' + p.age }); out.released.push(p.name); }
    }
  }
  // play-up, loans
  const pu = man('acad', 'playUp'); for (const p of G.academy) p.playUp = false;
  if (pu !== 'none') for (const k of ['U14', 'U16', 'U18']) G.academy.filter(p => grp(p) === k).sort((x, y) => y.ca - x.ca).slice(0, pu === 'many' ? 3 : 1).forEach(p => { if (p.ca >= tierAvg(G.club.tier) * 0.5) p.playUp = true; });
  const ln = man('acad', 'loans'); for (const p of G.academy) p.loanOut = !!p.loanCEO; // a loan the CEO ordered stands
  if (ln !== 'never') G.academy.filter(p => grp(p) === 'U21' && !p.loanCEO).sort((x, y) => x.ca - y.ca).forEach((p, i, arr) => { if (ln === 'all' || i < Math.ceil(arr.length / 2)) { p.loanOut = true; out.loans.push(p.name); } });
  if (!staff('acad')) { /* no director: sub-staff not replaced */ } else for (const r of YROLES) if (!a.staff[r.id]) hireY(r.id);
  trim();
  rep.promoted = out.promoted; rep.acad = out; a.lastSeason = out;
};
function promote(p) {
  const G = g(); G.academy = G.academy.filter(x => x !== p); p.contract = 3; p.wage = Math.round(wageFor(p.ca) * 0.6 / 5) * 5; p.st = F.newStats(); p.loanOut = false; delete p.loanCEO; p.playUp = false; G.squad.push(p);
  A().log.push({ name: p.name, season: G.season, pos: p.pos, pot: absStars(p.pa) });
}

/* ---------- views for the UI ---------- */
F.acadView = () => {
  ensure(); const G = g(), a = A();
  const groups = GROUPS.map(k => ({ k, players: G.academy.filter(p => grp(p) === k).sort((x, y) => y.band[1] - x.band[1] || y.ca - x.ca), lv: a.lv[k] }));
  const grads = G.squad.filter(p => p.academy);
  return { a, groups, grads, staff: YROLES.map(r => ({ r, s: a.staff[r.id] })), cost: H.acadCost(), tierLvl: tierLvl() };
};
F.acadPromote = promote; F.acadGrp = grp; F.YROLES = YROLES; F.acadEnsure = ensure; F.acadBand = band; F.acadGenYouth = genYouth; F.acadYv = yv; F.acadTierLvl = tierLvl;
F.acadSack = id => { const a = A(); if (!a.staff[id]) return; const s = a.staff[id]; g().club.cash -= s.wage * 10; a.staff[id] = null; if (staff('acad')) hireY(id); return a.staff[id]; };

/* ---------- scorecard: replace the academy card ---------- */
const baseCard = F.scorecard;
F.scorecard = () => {
  const cards = baseCard(), v = F.acadView(), all = g().academy, top = all.slice().sort((x, y) => y.band[1] - x.band[1])[0];
  const i = cards.findIndex(c => c.k === 'academy');
  if (i >= 0) cards[i].rows = [
    { l: 'Facilities', v: `level ${g().club.fac.youth}`, ref: 'out of 10', ok: null },
    { l: 'Coaching level', v: (GROUPS.reduce((s, k) => s + v.a.lv[k], 0) / 4).toFixed(1), ref: 'average over age groups, out of 10', ok: null },
    { l: 'Pipeline', v: GROUPS.map(k => v.groups.find(x => x.k === k).players.length).join(' / '), ref: 'U14 / U16 / U18 / U21', ok: null },
    { l: 'Best prospect', v: top ? `${top.band[0]}–${top.band[1]}★` : '–', ref: `our division is about ${v.tierLvl}★`, ok: top ? top.band[1] >= v.tierLvl + 0.5 : null },
    { l: 'Graduates in first team', v: v.grads.length, ref: `debuts this season: ${g().ss.grads}`, ok: null },
    { l: 'Reputation', v: Math.round(v.a.rep), ref: 'drives intake quality', ok: null }];
  return cards;
};
})(FO);
