/* The Front Office · youth academy, module 2 part 2
   Category & audit, poaching and tribunals, youth competitions, ROI, academy desk content, pre-season plan, diagnosis. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, A = () => g().acad;
const { ri, pick, chance, clamp, gauss, money, M, staff, man, tierAvg, absStars } = F;
const sq = () => g().squad, N = r => F.staffName(r), yv = (id, i) => F.acadYv(id, i), tl = () => F.acadTierLvl();
const P = id => g().academy.find(p => p.id === id) || g().squad.find(p => p.id === id);
const rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const fx = (k, n) => { const G = g(); if (k === 'board') G.board.conf = clamp(G.board.conf + n, 0, 100); else if (k === 'cash') G.club.cash += n; else if (k === 'rep') A().rep = clamp(A().rep + n, 0, 100); else G.st[k] = clamp(G.st[k] + n, 0, 100); };
const grp = p => F.acadGrp(p), CATN = { 1: 'Category 1', 2: 'Category 2', 3: 'Category 3', 4: 'Category 4' };
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;

/* ---------- category ---------- */
function catScore() {
  const a = A(), G = g(), lv = avg(['U14', 'U16', 'U18', 'U21'].map(k => a.lv[k])), st = avg(F.YROLES.map(r => yv(r.id))), ed = avg(G.academy.map(p => p.edu)), wl = avg(G.academy.map(p => p.wel));
  const parts = [['Facilities', G.club.fac.youth * 4, 40], ['Coaching', lv * 3, 30], ['Academy staff', st, 20], ['Education', ed * 0.1, 10], ['Welfare', wl * 0.1, 10], ['Budget', man('acad', 'budget') * 0.1, 10]];
  const total = parts.reduce((x, p) => x + p[1], 0) + (a.planBonus || 0);
  return { parts, total, cat: total >= 95 ? 1 : total >= 75 ? 2 : total >= 55 ? 3 : 4 };
}
function ensure2() {
  F.acadEnsure(); const a = A(); if (!a) return;
  if (a.cat == null) { a.cat = catScore().cat; a.spent = 0; a.earned = 0; a.comp = 0; a.sat = 0; a.cups = []; a.titles = []; }
  if (!a.lg || a.lg.season !== g().season) newYouthSeason();
}

/* ---------- youth competitions ---------- */
const PLAY = w => w >= 2 && w <= 33 && w % 3 !== 1;
const CUPW = [9, 15, 21, 26, 30, 33], CUPN = ['first round', 'second round', 'third round', 'quarter-final', 'semi-final', 'final'];
function newYouthSeason() {
  const G = g(), a = A(), t = G.club.tier, used = new Set();
  const mk = k => { const teams = [{ id: 0, n: G.club.short + ' ' + k, str: 0 }]; const pool = []; for (let tt = Math.max(1, t - 1); tt <= Math.min(8, t + 1); tt++) pool.push(...G.divs[tt].clubs.filter(x => x !== 0)); while (teams.length < 12 && pool.length) { const id = pool.splice(Math.floor(F.rnd() * pool.length), 1)[0]; if (used.has(id + k)) continue; used.add(id + k); const c = G.clubs[id]; teams.push({ id, n: c.name.split(' ')[0] + ' ' + k, str: c.str - (k === 'U18' ? 4.2 : 2.6) + gauss() * 0.9 + (a.cat ? 0 : 0) }); } const tab = {}; teams.forEach(x => tab[x.id] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }); return { teams, tab, round: 0, last: null }; };
  a.lg = { season: G.season, U18: mk('U18'), U21: mk('U21') };
  a.cup = { alive: true, log: [] };
}
function ourStr(k) {
  const G = g(), a = A(), pool = G.academy.filter(p => !p.loanOut && (grp(p) === k || (k === 'U18' && p.playUp && grp(p) === 'U16') || (k === 'U21' && grp(p) === 'U18'))).sort((x, y) => y.ca - x.ca).slice(0, 11);
  if (!pool.length) return tierAvg(G.club.tier) - 6;
  return avg(pool.map(p => p.ca)) - (11 - pool.length) * 0.4 + a.lv[k] * 0.12 + man('acad', 'philosophy') / 100 * 0.6;
}
function playRound(k) {
  const L = A().lg[k], n = L.teams.length; const ids = L.teams.map(x => x.id), r = L.round % (n - 1);
  const arr = ids.slice(1); for (let i = 0; i < r; i++) arr.unshift(arr.pop()); const order = [ids[0], ...arr];
  for (let i = 0; i < n / 2; i++) {
    const h = order[i], w = order[n - 1 - i], sh = h === 0 ? ourStr(k) : L.teams.find(x => x.id === h).str, sw = w === 0 ? ourStr(k) : L.teams.find(x => x.id === w).str, d = sh - sw + 0.3;
    const hg = poisson(1.45 * Math.exp(0.16 * d)), ag = poisson(1.2 * Math.exp(-0.16 * d)), H2 = L.tab[h], W = L.tab[w];
    H2.p++; W.p++; H2.gf += hg; H2.ga += ag; W.gf += ag; W.ga += hg; if (hg > ag) { H2.w++; W.l++; H2.pts += 3; } else if (hg < ag) { W.w++; H2.l++; W.pts += 3; } else { H2.d++; W.d++; H2.pts++; W.pts++; }
    if (h === 0 || w === 0) { const us = h === 0 ? hg : ag, them = h === 0 ? ag : hg, opp = L.teams.find(x => x.id === (h === 0 ? w : h)).n; const pl = g().academy.filter(p => grp(p) === k && !p.loanOut); const star = pl.length ? pick(pl.slice().sort((x, y) => y.ca - x.ca).slice(0, 3)) : null; L.last = { us, them, opp, star: star ? star.name : null, home: h === 0 }; }
  }
  L.round++;
}
function poisson(l) { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= F.rnd(); } while (p > L); return k - 1; }
function ytable(k) { const L = A().lg[k]; return L.teams.map(t => ({ ...t, ...L.tab[t.id] })).sort((x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga)); }
function cupTie() {
  const G = g(), a = A(), rd = CUPW.indexOf(G.week); if (rd < 0 || !a.cup.alive) return;
  const opp = pick(G.divs[clamp(G.club.tier - Math.floor(rd / 1.5) - 1, 1, 8)].clubs.filter(x => x !== 0)), os = G.clubs[opp].str - 4 + rd * 0.15, d = ourStr('U18') - os;
  const win = F.rnd() < 1 / (1 + Math.exp(-0.9 * d)), name = G.clubs[opp].name.split(' ')[0] + ' U18';
  a.cup.log.push({ rd: CUPN[rd], opp: name, win });
  if (win) { fx('rep', 1 + rd); a.cup.run = rd + 1; if (rd === 5) { a.cup.alive = false; a.cups.push(G.season); fx('rep', 8); fx('fans', 4); G.trophies.push(`Youth Cup ${G.season}`); G.paper.stories.unshift({ h: 'Youth Cup winners', t: `Our under-18s win the Youth Cup, beating ${name} in the final. Scouts from the biggest clubs were in the stands.` }); } else G.paper.stories.push({ h: 'Youth Cup', t: `Our under-18s beat ${name} in the ${CUPN[rd]}.` }); }
  else { a.cup.alive = false; G.paper.stories.push({ h: 'Youth Cup', t: `Our under-18s go out in the ${CUPN[rd]} against ${name}.` }); }
}

/* ---------- weekly & season hooks ---------- */
const w1 = H.acadWeekly, s1 = H.acadSeason;
H.acadWeekly = () => {
  ensure2(); w1(); const G = g(), a = A();
  if (G.fin.last) a.spent += G.fin.last.o.academy || 0;
  if (PLAY(G.week)) { playRound('U18'); playRound('U21'); }
  cupTie();
  // poaching interest in our best prospects
  const catF = { 4: 1.6, 3: 1.2, 2: 0.7, 1: 0.35 }[a.cat], cupF = a.cup && a.cup.run >= 3 ? 1.5 : 1;
  for (const p of G.academy) if (p.age >= 14 && p.age <= 16 && p.band[1] >= Math.max(tl() + 1.5, 3) && !p.tied && chance(0.005 * catF * cupF)) { const comp = Math.round(M(1500) * (p.age - 11) * ({ 1: 2.5, 2: 1.8, 3: 1.2, 4: 0.8 })[a.cat] / 100) * 100; F.queueEvent('acad_poach', { pid: p.id, name: p.name, club: pick(G.divs[Math.max(1, G.club.tier - 3)].clubs.filter(x => x !== 0)), comp }); break; }
  if (G.week === 30) { const sc = catScore(); F.queueEvent('acad_audit', { score: Math.round(sc.total), prev: a.cat, next: clamp(sc.cat, a.cat - 1, a.cat + 1), parts: sc.parts.map(p => [p[0], Math.round(p[1]), p[2]]) }); }
};
H.acadSeason = rep => {
  ensure2(); const a = A();
  for (const k of ['U18', 'U21']) { const t = ytable(k); const pos = t.findIndex(x => x.id === 0) + 1; a.lg[k].final = pos; if (pos === 1) { a.titles.push(`${k} league ${g().season}`); fx('rep', 4); } }
  a.lastLg = { U18: a.lg.U18.final, U21: a.lg.U21.final, cup: a.cup.log.length ? a.cup.log[a.cup.log.length - 1] : null };
  a.planBonus = 0;
  s1(rep);
};
H.acadIncome = () => { ensure2(); const a = A(); if (!a || !a.cat) return 0; const v = M([0, 450, 280, 130, 0][a.cat]); a.earned += v; return v; };
H.acadSale = (p, fee) => { const a = A(); if (a) a.earned += fee; };
H.objMet = o => { const a = A(); if (!a) return false; if (o.k === 'acadcat') return a.cat <= o.target; if (o.k === 'u18title') { const t = ytable('U18'); return t[0].id === 0; } if (o.k === 'acadsale') return (a.earned - (o.base || 0)) >= o.target; return false; };

/* ---------- ROI & diagnosis ---------- */
function roi() { const a = A(), grads = sq().filter(p => p.academy), val = grads.reduce((x, p) => x + p.value, 0), n = a.log.length; return { spent: a.spent, earned: a.earned, val, n, perGrad: n ? a.spent / n : null, net: a.earned + val - a.spent }; }
function diag() {
  const G = g(), a = A(), c = [], lv = avg(['U14', 'U16', 'U18', 'U21'].map(k => a.lv[k])), wl = avg(G.academy.map(p => p.wel)), ed = avg(G.academy.map(p => p.edu));
  const grads = sq().filter(p => p.academy && p.age <= 22), minsShare = grads.length && G.week > 5 ? avg(grads.map(p => p.st.mins / Math.max(1, G.ss.lg * 90))) : null;
  const add = (t, act, x) => c.push({ t, a: act, x });
  if (man('acad', 'budget') < 40) add(`The academy budget is lean (${man('acad', 'budget')}/100). Coaching levels and recruitment suffer.`, 'mand', 'acad');
  if (lv < 4.5) add(`Coaching levels average ${lv.toFixed(1)} out of 10. Development is slow.`, 'mand', 'acad');
  if (G.club.fac.youth < 4) add(`Facilities are level ${G.club.fac.youth}. They cap your category and your intake.`, null);
  if (a.cat >= 3) add(`${CATN[a.cat]}: weaker intakes, ${a.cat === 4 ? 'no grant, ' : ''}cheap to poach from, and no international recruitment.`, null);
  if (wl < 55) add(`Average welfare is ${Math.round(wl)}. Expect drop-outs; consider protecting the kids more.`, 'mand', 'acad');
  if (ed < 50) add(`Average school results are ${Math.round(ed)}. Drop-out risk rises.`, null);
  if (minsShare != null && minsShare < 0.2) add(`Graduates get ${Math.round(minsShare * 100)}% of first-team minutes. Without a pathway, talent stalls or leaves.`, 'mand', 'coach');
  if (!F.staff('acad')) add('There is no Academy Director. Nobody replaces academy staff or makes pathway decisions.', 'tab', 'staff');
  return c;
}

/* ---------- views ---------- */
const v1 = F.acadView;
F.acadView = () => { ensure2(); const v = v1(); const a = A(); v.cat = a.cat; v.catScore = catScore(); v.lg = { U18: ytable('U18'), U21: ytable('U21'), lastU18: a.lg.U18.last, lastU21: a.lg.U21.last }; v.cup = a.cup; v.roi = roi(); v.diag = diag(); v.honours = [...(a.titles || []), ...(a.cups || []).map(s => 'Youth Cup ' + s)]; return v; };
F.acadCatName = c => CATN[c];
const sc0 = F.scorecard;
F.scorecard = () => { const cards = sc0(), c = cards.find(x => x.k === 'academy'); if (c && A()) { c.rows.unshift({ l: 'Category', v: CATN[A().cat], ref: `audit in week 30, score ${Math.round(catScore().total)}`, ok: A().cat <= 2 ? true : A().cat === 4 ? false : null }); c.rows.push({ l: 'Return on investment', v: (roi().net >= 0 ? '+' : '') + money(roi().net), ref: 'sales, fees and squad value minus costs', ok: roi().net >= 0 }); } return cards; };

/* ---------- pre-season academy plan ---------- */
F.ACAD_PLANS = [
  { k: 'acadcat', t: () => A().cat > 1 ? `Reach ${CATN[A().cat - 1]} at the audit` : 'Keep Category 1 status', d: 'Facilities, coaching, staff and welfare all count.', target: () => Math.max(1, A().cat - 1) },
  { k: 'u18title', t: () => 'Win the under-18 league', d: 'Pushes the academy towards winning; development may suffer.', target: () => 1 },
  { k: 'acadsale', t: () => `Earn ${money(M(8000))} from academy sales, fees and grants`, d: 'Treat the academy as a business.', target: () => M(8000) },
];
const fp0 = F.finishPreseason;
F.finishPreseason = () => { const G = g(); ensure2(); if (G.pre && G.pre.acad) { const pl = F.ACAD_PLANS.find(x => x.k === G.pre.acad); G.board.obj.push({ k: pl.k, target: pl.target(), t: pl.t(), soft: true, base: A().earned }); } return fp0(); };

/* ---------- escalations ---------- */
const E = F.defineEvent;
const tfee = c => (c.fee = c.fee || Math.max(100, Math.round(c.comp * (0.6 + F.rnd() * 1.0 + (A().cat <= 2 ? 0.3 : 0) + (yv('yrec', 2) - 10) * 0.03) / 100) * 100));
E('acad_audit', { forced: 1, from: 'acad', dept: 'academy', cd: 4, why: 'The annual academy audit is reported to the CEO.',
  title: c => c.next < c.prev ? `Audit: promoted to ${CATN[c.next]}` : c.next > c.prev ? `Audit: downgraded to ${CATN[c.next]}` : `Audit: ${CATN[c.next]} confirmed`,
  body: c => `Score ${c.score}. ${c.parts.map(p => `${p[0]} ${p[1]}/${p[2]}`).join(', ')}. ${c.next === 1 ? '' : `Next category needs ${[0, 95, 75, 55][c.next - 1] || 95}.`}`,
  opts: [
    { l: 'Accept the result', h: '', f: c => { A().cat = c.next; if (c.next < c.prev) { fx('rep', 6); fx('board', 2); } if (c.next > c.prev) fx('rep', -5); return `${CATN[c.next]} it is.`; } },
    { l: 'Appeal the decision', h: 'Chance of one category better', f: c => { const ok = chance(0.3 + (yv('ycare', 2) - 10) * 0.02); A().cat = ok ? Math.max(1, c.next - (c.next >= c.prev ? 1 : 0)) : c.next; return ok ? `The appeal succeeds: ${CATN[A().cat]}.` : `Appeal rejected: ${CATN[c.next]}.`; } },
    { l: 'Commit to an improvement plan', h: 'Academy budget +15 · bonus at next audit', f: c => { A().cat = c.next; F.G.mand.acad.budget = clamp(F.G.mand.acad.budget + 15, 0, 100); A().planBonus = 6; rel('acad', 4); return 'The auditors note the plan. Budget raised.'; } }],
  auto: () => 0 });
E('acad_poach', { forced: 1, from: 'acad', dept: 'academy', cd: 3, why: 'Protecting our best prospects is a CEO matter.',
  second: { r: 'acad', t: c => { const p = P(c.pid); if (!p) return 'He has gone.'; return p.pa - p.ca > 6 ? '"He is special. Fight for him."' : '"Good, not exceptional. The compensation is fair money."'; } },
  title: c => `${F.cname(c.club)} want ${c.name}`, body: c => { const p = P(c.pid); return p ? `A bigger academy has approached the family of ${c.name} (${p.age}, potential ${p.band[0]}–${p.band[1]}★). Training compensation would be about ${money(c.comp)}. ${p.edu > 65 && p.wel > 65 ? 'He is settled and doing well at school.' : p.wel < 50 ? 'He has not been happy lately.' : ''}` : 'He has already gone.'; },
  opts: [
    { l: 'Let him go for the compensation', h: c => `+${money(c.comp)}`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; g().academy = g().academy.filter(x => x !== p); fx('cash', c.comp); A().earned += c.comp; A().drop.push({ name: p.name, season: g().season, why: 'joined a bigger academy' }); return `${c.name} leaves. ${money(c.comp)} in compensation.`; } },
    { l: 'Offer the family a better package', h: () => `−${money(M(1500))} · he probably stays`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; fx('cash', -M(1500)); const stay = 0.45 + (p.wel - 50) / 120 + (p.edu - 50) / 200 + (p.pers.loy - 10) * 0.03 + (yv('ycare', 2) - 10) * 0.02; if (chance(clamp(stay, 0.1, 0.92))) { p.tied = true; p.wel = clamp(p.wel + 5, 0, 100); return `${c.name}'s family commits to the club.`; } g().academy = g().academy.filter(x => x !== p); F.later('tribunal', { name: c.name, comp: c.comp }, 3, 6); return 'They take the package and leave anyway. The fee goes to a tribunal.'; } },
    { l: 'Refuse: go to tribunal', h: 'He leaves; the tribunal sets the fee', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; g().academy = g().academy.filter(x => x !== p); F.later('tribunal', { name: c.name, comp: c.comp }, 3, 6); return 'He goes. Now the lawyers.'; } }],
  auto: c => man('acad', 'budget') > 50 ? 1 : 0 });
E('tribunal', { forced: 1, from: 'acad', dept: 'academy', cd: 2, why: 'A follow-up to a contested move.',
  title: c => `Tribunal ruling on ${c.name}`, body: c => { tfee(c); return `The tribunal awards us ${money(c.fee)} (the original offer was ${money(c.comp)}). A sell-on clause can be requested.`; },
  opts: [
    { l: 'Accept the fee', h: c => `+${money(tfee(c))}`, f: c => { tfee(c); fx('cash', c.fee); A().earned += c.fee; return `${money(c.fee)} received.`; } },
    { l: 'Ask for a sell-on clause', h: 'Less now, possible windfall later', f: c => { tfee(c); const now = Math.round(c.fee * 0.6); fx('cash', now); A().earned += now; if (chance(0.25)) F.later('sell_on', { name: c.name, amt: Math.round(c.fee * 3) }, 40, 80); return `${money(now)} now, plus 20% of any future sale.`; } }],
  auto: () => 0 });
E('sell_on', { forced: 1, from: 'fin', dept: 'academy', cd: 2, why: 'A sell-on clause has paid out.', title: c => `Sell-on windfall: ${c.name}`, body: c => `${c.name}, who left our academy, has been sold on. Our 20% share: ${money(c.amt)}.`, opts: [{ l: 'Bank it', h: c => `+${money(c.amt)}`, f: c => { fx('cash', c.amt); A().earned += c.amt; fx('rep', 3); return 'Money in, and proof that our academy produces players.'; } }], auto: () => 0 });
E('acad_release', { from: 'acad', dept: 'academy', cd: 34, why: 'A borderline decision on a local player at 18.',
  cond: () => g().week >= 24 && g().week <= 32 && g().academy.some(p => p.age === 18 && p.region === 'dom' && p.band[1] >= tl() - 0.5 && p.band[1] <= tl() + 0.5),
  setup: () => { const p = g().academy.find(p => p.age === 18 && p.region === 'dom' && p.band[1] >= tl() - 0.5 && p.band[1] <= tl() + 0.5); return p ? { pid: p.id, name: p.name } : null; },
  title: c => `Keep or release ${c.name}?`, body: c => { const p = P(c.pid); return p ? `${c.name} (18, potential ${p.band[0]}–${p.band[1]}★) is a local lad, loyal, ${p.pers.prof >= 13 ? 'hard-working' : 'inconsistent'}. ${N('acad')} wants to ${man('acad', 'pace') > 55 ? 'keep him as an under-21' : 'release him'}.` : 'Gone.'; },
  opts: [
    { l: 'Keep him as an under-21', h: () => `Wage ${money(M(90))}/wk`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.keep = true; p.wage = M(90); fx('fans', 1); return 'He stays. The town notices.'; } },
    { l: 'Release him', h: 'Saves a wage', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; g().academy = g().academy.filter(x => x !== p); A().drop.push({ name: p.name, season: g().season, why: 'released at 18' }); return 'Released with thanks.'; } },
    { l: 'Find him a loan club', h: 'Games at a lower level', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.keep = true; p.loanOut = true; return 'He joins a non-league side on loan.'; } }],
  auto: () => man('acad', 'pace') > 55 ? 0 : 1 });
E('grad_minutes', { from: 'acad', dept: 'academy', cd: 12, why: 'The academy and the head coach disagree about the pathway.',
  cond: () => g().week >= 10 && staff('coach') && sq().some(p => p.academy && p.age <= 21 && p.st.mins < g().ss.lg * 90 * 0.15),
  setup: () => { const p = sq().filter(p => p.academy && p.age <= 21).sort((a, b) => a.st.mins - b.st.mins)[0]; return p ? { pid: p.id, name: p.name } : null; },
  title: c => `${N('acad')}: "${c.name} needs minutes"`, body: c => { const p = P(c.pid); return p ? `${c.name} (${p.age}) has played ${p.st.mins} league minutes. "If he does not play, he stalls, or he leaves." ${N('coach')} says he is not ready.` : 'Gone.'; },
  opts: [
    { l: 'Tell the coach to play him', h: 'Coach youth minutes +20 · coach ↓', f: () => { F.G.mand.coach.youthMins = clamp(F.G.mand.coach.youthMins + 20, 0, 100); rel('coach', -5); rel('acad', 5); return 'The coach complies.'; } },
    { l: 'Loan him out for games', h: 'He leaves the squad for now', f: c => { const p = P(c.pid); if (!p || !sq().includes(p)) return 'Gone.'; g().squad = g().squad.filter(x => x !== p); p.loanOut = true; p.loanCEO = true; g().academy.push(p); F.acadBand(p); return `${c.name} goes out on loan.`; } },
    { l: 'Back the coach', h: 'Academy ↓ · player morale ↓', f: c => { const p = P(c.pid); if (p) p.morale = clamp(p.morale - 10, 0, 100); rel('acad', -6); rel('coach', 3); return 'The coach decides.'; } }],
  auto: () => man('coach', 'youthMins') > 55 ? 0 : 2 });
E('agent_youth', { from: 'acad', dept: 'academy', cd: 20, why: 'An agent wants a contract for a minor. Contracts are yours.',
  cond: () => g().academy.some(p => p.age === 16 && p.band[1] >= tl() + 1 && !p.tied),
  setup: () => { const p = g().academy.filter(p => p.age === 16 && p.band[1] >= tl() + 1 && !p.tied).sort((a, b) => b.pa - a.pa)[0]; return p ? { pid: p.id, name: p.name } : null; },
  title: c => `Agent demands pro deal for ${c.name}`, body: c => { const p = P(c.pid); return p ? `${c.name} (16, potential ${p.band[0]}–${p.band[1]}★) has new representation. The agent wants a professional contract the day he turns 17, at ${money(M(150))}/wk, "or other clubs are interested".` : 'Gone.'; },
  opts: [
    { l: 'Agree to the pro deal', h: () => `${money(M(150))}/wk · he is tied to us`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.tied = true; p.wage = M(150); return 'Agreed. He stays.'; } },
    { l: 'Refuse: scholarship terms only', h: 'He may leave', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; if (chance(0.45 - (p.pers.loy - 10) * 0.03)) { g().academy = g().academy.filter(x => x !== p); F.later('tribunal', { name: c.name, comp: Math.round(M(1500) * 5) }, 3, 6); return `${c.name} leaves for another academy.`; } return 'The agent backs down.'; } },
    { l: 'Talk to the parents directly', h: 'Depends on Player Care', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; if (chance(0.35 + (yv('ycare', 2) - 10) * 0.04)) { p.tied = true; return 'The parents trust the club over the agent.'; } fx('press', -2); return 'The agent calls it "going behind his back". It sours things.'; } }],
  auto: () => man('acad', 'budget') > 55 ? 0 : 1 });
E('acad_welfare', { from: 'acad', dept: 'academy', cd: 8, why: 'Player Care has flagged a welfare concern.',
  cond: () => g().academy.some(p => p.wel < 35),
  setup: () => { const p = g().academy.filter(p => p.wel < 35).sort((a, b) => a.wel - b.wel)[0]; return p ? { pid: p.id, name: p.name } : null; },
  title: c => `Welfare concern: ${c.name}`, body: c => { const p = P(c.pid); return p ? `Player Care reports that ${c.name} (${p.age}) is exhausted and struggling${p.playUp ? ', partly from playing up an age group' : ''}. Welfare ${Math.round(p.wel)}.` : 'Gone.'; },
  opts: [
    { l: 'Rest and support him', h: 'Welfare up · development pauses', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.wel = clamp(p.wel + 20, 0, 100); p.playUp = false; return 'He gets time off and support.'; } },
    { l: 'Review the whole programme', h: 'Welfare slider +15 · philosophy −10', f: c => { const m = F.G.mand.acad; m.welfare = clamp(m.welfare + 15, 0, 100); m.philosophy = clamp(m.philosophy - 10, 0, 100); const p = P(c.pid); if (p) p.wel = clamp(p.wel + 10, 0, 100); return 'The academy shifts towards protecting the kids.'; } },
    { l: 'Keep the programme as it is', h: 'Drop-out risk', f: c => { const p = P(c.pid); if (p) p.wel = clamp(p.wel - 5, 0, 100); return 'Nothing changes.'; } }],
  auto: () => man('acad', 'welfare') > 50 ? 0 : 2 });

/* ---------- briefings ---------- */
const B = F.defineBrief;
B('u18_report', { role: 'acad', cd: 3,
  check: () => { const a = A(); if (!a || !a.lg) return null; const L = a.lg.U18.last; if (!L || !PLAY(g().week - 1)) return null; const pos = ytable('U18').findIndex(x => x.id === 0) + 1; return { ...L, pos, score: 0.8 }; },
  title: c => `Under-18s: ${c.us > c.them ? 'won' : c.us < c.them ? 'lost' : 'drew'} ${c.us}–${c.them} against ${c.opp}`, text: c => `${c.star ? c.star + ' caught the eye. ' : ''}We are ${F.ord(c.pos)} in the under-18 league.`,
  opts: [
    { l: 'Watch the next game yourself', h: 'Academy staff ↑ · kids ↑', f: () => { rel('acad', 2); g().academy.forEach(p => p.wel = clamp(p.wel + 2, 0, 100)); return 'The kids notice the CEO in the stand.'; } },
    { l: 'Push for the youth title', h: 'Philosophy +10', f: () => { F.G.mand.acad.philosophy = clamp(F.G.mand.acad.philosophy + 10, 0, 100); return 'The academy will chase results harder.'; } },
    { l: 'Noted', h: '', f: () => 'Filed.' }] });
B('youth_cup', { role: 'acad', cd: 2,
  check: () => { const a = A(); return a && a.cup && a.cup.alive && CUPW.includes(g().week) ? { rd: CUPN[CUPW.indexOf(g().week)], score: 2 } : null; },
  title: c => `Youth Cup ${c.rd} this week`, text: () => 'A good run puts our academy on the map, and our best kids in the shop window.',
  opts: [
    { l: 'Field the strongest side', h: 'Better chance · less rest', f: () => { F.G.mand.acad.philosophy = clamp(F.G.mand.acad.philosophy + 5, 0, 100); return 'Best eleven named.'; } },
    { l: 'Give the younger lads a chance', h: 'Experience for the U16s', f: () => { g().academy.filter(p => grp(p) === 'U16').forEach(p => p.pa = Math.min(20, p.pa + 0.05)); return 'A young side takes the field.'; } }] });
B('school_report', { role: 'acad', cd: 30,
  check: () => [12, 26].includes(g().week) && g().academy.length ? { avg: Math.round(avg(g().academy.map(p => p.edu))), low: g().academy.filter(p => p.edu < 45).length, score: 1.6 } : null,
  title: () => 'School reports are in', text: c => `Average ${c.avg}. ${c.low ? c.low + ' players are at risk of failing.' : 'Nobody is falling behind.'}`,
  opts: [
    { l: 'Fund extra tutoring', h: () => `−${money(M(600))} · school results up`, f: () => { fx('cash', -M(600)); g().academy.filter(p => p.edu < 60).forEach(p => p.edu = clamp(p.edu + 12, 0, 100)); return 'Tutors start next week.'; } },
    { l: 'Fine as it is', h: '', f: () => 'Noted.' }] });
B('scouts_watching', { role: 'acad', cd: 6,
  check: () => { const a = A(); if (!a || a.cat <= 2) return null; const p = g().academy.find(p => p.band[1] >= Math.max(tl() + 1.5, 3) && !p.tied && p.age >= 14 && p.age <= 16); return p && chance(0.25) ? { pid: p.id, name: p.name, score: 1.7 } : null; },
  title: c => `Scouts from bigger clubs watched ${c.name}`, text: c => `Our academy is ${CATN[A().cat]}, which makes poaching cheap. ${N('acad')} suggests tying him down early.`,
  opts: [
    { l: 'Offer an early scholarship', h: () => `−${money(M(800))} · much harder to poach`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; fx('cash', -M(800)); p.tied = true; return `${c.name}'s family signs.`; } },
    { l: 'Let them look', h: 'Risk of an approach', f: () => 'Noted.' }] });

/* ---------- projects ---------- */
const D = F.defineProposal, perks = () => g().club.perks;
D('boarding', { owner: 'acad', dur: 12, cost: () => M(12000), wk: () => M(150), p: () => 0.75, second: 'fin', cond: () => !perks().boarding,
  title: 'Build a boarding house for scholars', pitch: '"We lose kids who live too far away. A boarding house lets us recruit nationally, and look after them properly."', benefit: 'National recruitment at any category, welfare up, bigger intakes.',
  impact: () => [['Recruitment reach', A().cat <= 2 ? 'national' : 'regional', 'national'], ['Welfare target', '', '+8'], ['Intake size', '', '+1']],
  done: (c, ok) => { if (ok) { perks().boarding = true; return 'The boarding house opens.'; } return 'Planning permission refused.'; } });
D('edu_centre', { owner: 'acad', dur: 8, cost: () => M(6000), p: () => 0.8, cond: () => !perks().edu,
  title: 'Open an education centre at the academy', pitch: '"Parents choose academies that take school seriously. So do auditors."', benefit: 'School results up; fewer drop-outs; helps the category audit.',
  impact: () => [['Average school results', Math.round(avg(g().academy.map(p => p.edu))), Math.min(100, Math.round(avg(g().academy.map(p => p.edu)) + 12))], ['Drop-out risk', '', 'lower']],
  done: (c, ok) => { if (ok) { perks().edu = true; return 'Classrooms and tutors in place.'; } return 'The partner college pulls out.'; } });
D('satellite', { owner: 'acad', dur: 6, repeat: 1, cost: () => M(5000), wk: () => M(150), p: () => 0.75, cond: () => (A().sat || 0) < 2,
  title: () => (A().sat ? 'Open a second satellite academy' : 'Open a satellite academy in a nearby town'), pitch: '"Twice a week, a pitch and two coaches. We see hundreds more kids before anyone else does."', benefit: 'More and better kids in the foundation phase.',
  impact: () => [['Foundation kids', A().found.n, A().found.n + 15], ['Foundation quality', Math.round(A().found.q), Math.round(A().found.q + 8) + ' over time']],
  done: (c, ok) => { if (ok) { A().sat = (A().sat || 0) + 1; return 'The satellite centre opens.'; } return 'Too few kids sign up. It closes after a month.'; } });
D('youth_sci', { owner: 'acad', dur: 6, cost: () => M(4000), wk: () => M(120), p: () => 0.8, cond: () => !perks().ysci,
  title: 'Sports science for the academy', pitch: '"Growth-spurt monitoring, load management, nutrition. We stop breaking teenagers."', benefit: 'Faster, safer development and better welfare.',
  impact: () => [['Development speed', '', '+10%'], ['Welfare target', '', '+5']],
  done: (c, ok) => { if (ok) { perks().ysci = true; return 'The youth sports science unit is running.'; } return 'We cannot recruit the specialists.'; } });
D('indoor', { owner: 'acad', dur: 10, cost: () => M(9000), p: () => 0.75, second: 'fin', cond: () => !perks().indoor,
  title: 'Build an indoor training hall', pitch: '"Half our winter sessions get cancelled. Rivals train every day."', benefit: 'Coaching levels up by one in every age group.',
  impact: () => [['Coaching level, average', avg(['U14', 'U16', 'U18', 'U21'].map(k => A().lv[k])).toFixed(1), (avg(['U14', 'U16', 'U18', 'U21'].map(k => A().lv[k])) + 1).toFixed(1) + ' over time']],
  done: (c, ok) => { if (ok) { perks().indoor = true; return 'The hall opens in time for winter.'; } return 'The roof contractor goes bust.'; } });
})(FO);
