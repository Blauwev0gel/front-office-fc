/* The Front Office · recruitment, module 3 part 1
   Player world, scouting department, reports with uncertainty, recruitment pipeline, negotiation. Plugs into engine hooks. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, RC = () => g().rec;
const { ri, pick, chance, clamp, gauss, money, M, staff, man, tierAvg, upd, wageFor } = F;
const REG = F.REGIONS, REGK = Object.keys(REG), POSK = F.POSW_KEYS();
const STAGES = ['identified', 'scouted', 'recommended', 'approach', 'negotiating', 'agreed', 'signed', 'lost'];
const SCOUT_BIO = ['Former lower-league striker with a notebook habit', 'Ex-video analyst who likes the stands', 'Spent years running youth trials', 'Freelance scout with contacts everywhere', 'Retired teacher who never misses a game'];
const sq = () => g().squad, N = r => F.staffName(r);
const inWin = () => F.window_();
const winKey = () => g().season + (g().phase === 'summer' || g().week <= 4 ? 'S' : 'W');
const winBuys = pos => ((RC().win || {})[winKey()] || {})[pos] || 0;
function slotOpen(p, k) {
  const n = winBuys(p.pos), have = sq().filter(q => q.pos === p.pos).length, need = F.squadNeeds().includes(p.pos);
  const upgrade = k && k.grade === 'A' && k.est >= posBest(p.pos) + 0.5;
  if (n >= 1 && !need) return upgrade && n < 2;
  if (!need && have >= (F.REQ[p.pos] || 2) + 1) return upgrade;
  return true;
}

/* ---------- player pool ---------- */
function aiClub(t) { const ids = g().divs[clamp(t, 1, 8)].clubs.filter(x => x !== 0); return pick(ids); }
function genPool(reg, t) {
  const pos = pick(POSK), age = ri(17, 33), ca = tierAvg(t) + gauss() * 1.4 + (age > 28 ? 0.3 : 0) - (age < 21 ? 0.8 : 0);
  const p = F.genPlayer({ pos, age, ca, region: reg });
  p.club = chance(0.06 + t * 0.035) ? null : aiClub(t); p.contract = p.club ? ri(0, 3) : 0;
  if (!p.club) { for (const k in F.POSW[pos]) p.a[k] = clamp(p.a[k] - 0.8, 1, 20); upd(p); }
  p.ask = p.club ? Math.round(p.value * REG[reg].cost * (0.9 + F.rnd() * 0.35) * (p.contract === 0 ? 0.35 : 1) / 100) * 100 : 0;
  p.wageAsk = Math.round(wageFor(p.ca) * (1 + (age > 28 ? 0.15 : 0)) * (0.95 + F.rnd() * 0.25) / 5) * 5;
  // hidden gems: a strong network finds players worth more than their price
  const net = (g().club.net && g().club.net[reg]) || 0, gemP = net / 220 + (F.deptHas && F.deptHas('recruit', 'sc') ? 0.04 : 0) + (staff('scout') ? (F.eff('scout', 2) - 10) * 0.006 : 0);
  if (chance(clamp(gemP, 0, 0.45))) { for (const k in F.POSW[pos]) p.a[k] = clamp(p.a[k] + 0.9 + F.rnd() * 0.5, 1, 20); upd(p); p.gem = true; }
  p.pool = true; p.inTier = t; p.loanable = !!p.club && t < g().club.tier && age <= 23 && chance(0.4);
  return p;
}
function topUpPool() {
  const r = RC(), t = g().club.tier, have = {};
  for (const id in r.pool) { const p = r.pool[id]; if (Math.abs(p.inTier - t) <= 1) have[p.region] = (have[p.region] || 0) + 1; }
  for (const k of REGK) { const want = k === 'dom' ? 34 : 22; for (let i = have[k] || 0; i < want; i++) { const p = genPool(k, clamp(t + ri(-1, 1), 1, 8)); r.pool[p.id] = p; } }
  const ids = Object.keys(r.pool); if (ids.length > 330) { for (const id of ids) { const p = r.pool[id]; if (Math.abs(p.inTier - t) >= 2 && !r.know[id] && chance(0.6)) delete r.pool[id]; } }
}

/* ---------- scouts ---------- */
function hireScout() {
  const s = F.genStaff('scout', g().club.tier, (man('scout', 'budget') / 100 - 0.5) * 2.5);
  s.role = 'xscout'; s.bio = pick(SCOUT_BIO); s.wage = Math.round(s.wage * 0.45 / 5) * 5;
  s.home = pick(REGK); s.bias = {}; for (const k of REGK) s.bias[k] = (k === s.home ? 0.15 : 0) + gauss() * 0.35;
  s.assign = null; s.hits = 0; s.misses = 0; s.reports = 0; s.err = 0;
  return s;
}
const nScouts = () => staff('scout') ? 2 + Math.floor(man('scout', 'budget') / 35) + (F.deptHas && F.deptHas('recruit', 'sc') ? 1 : 0) : 0;
function chiefAsScout() { const c = staff('scout'); if (!c) return null; if (!c.bias) { c.bias = {}; for (const k of REGK) c.bias[k] = gauss() * 0.25; c.home = 'dom'; c.hits = 0; c.misses = 0; c.reports = 0; c.err = 0; } return c; }
function scoutsAll() { const c = chiefAsScout(); return (c ? [c] : []).concat(RC().scouts); }

/* ---------- knowledge & reports ---------- */
function report(sc, p) {
  const r = RC(), k = r.know[p.id] || (r.know[p.id] = { n: 0, by: null, est: 0, sd: 3, pest: 0, psd: 3, grade: 'D', first: F.absWeek() });
  const net = (g().club.net[p.region] || 0) / 100;
  const sd1 = clamp(2.1 - sc.at[0] / 12 - net * 0.6 - (F.perk('data') ? 0.35 : 0) - (man('scout', 'data') / 100) * 0.2, 0.5, 2.2) * (F.deptHas && F.deptHas('recruit', 'data') ? 0.75 : 1), sd = sd1 / Math.sqrt(k.n + 1);
  const psd1 = clamp(2.6 - sc.at[1] / 10 - net * 0.4, 0.6, 2.6), psd = psd1 / Math.sqrt(k.n + 1);
  const bias = (sc.bias && sc.bias[p.region]) || 0, est = p.ca + bias + gauss() * sd, pest = Math.max(est, p.pa + bias * 0.7 + gauss() * psd);
  k.est = k.n ? (k.est * k.n + est) / (k.n + 1) : est; k.pest = k.n ? (k.pest * k.n + pest) / (k.n + 1) : pest;
  k.sd = k.n ? Math.min(k.sd * 0.85, sd) : sd; k.psd = k.n ? Math.min(k.psd * 0.85, psd) : psd; k.n++; k.by = sc.name; k.byId = sc.id; k.last = F.absWeek();
  k.conf = k.sd < 0.6 ? 'high' : k.sd < 1.2 ? 'medium' : 'low';
  k.attr = {}; for (const a in F.POSW[p.pos]) { const e = p.a[a] + bias + gauss() * k.sd * 1.4, w = Math.max(0.5, k.sd * 1.6); k.attr[a] = [clamp(Math.round(e - w), 1, 20), clamp(Math.round(e + w), 1, 20)]; }
  k.grade = grade(p, k); sc.reports = (sc.reports || 0) + 1;
  return k;
}
function posBest(pos) { const ps = sq().filter(x => x.pos === pos).sort((a, b) => b.ca - a.ca); return ps.length ? ps[0].ca : 0; }
function posWorst(pos) { const ps = sq().filter(x => x.pos === pos).sort((a, b) => a.ca - b.ca); return ps.length && ps.length >= (F.REQ[pos] || 2) ? ps[0].ca : 0; }
function prioOf(p) { return (RC().plan.prios || []).find(x => x.pos === p.pos); }
function fitsProfile(p, k, pr) { if (!pr) return false; if (pr.kind === 'young') return p.age <= 23; if (pr.kind === 'proven') return p.age >= 25 && k.est >= posBest(p.pos) - 0.3; if (pr.kind === 'value') return p.ask <= p.value * 0.9 || !p.club; return true; }
function grade(p, k) {
  const ref = Math.max(posWorst(p.pos), posBest(p.pos) - 1), pr = prioOf(p);
  let d = k.est - ref + (k.pest - k.est) * (man('dof', 'youth') / 100) * 0.3 + (fitsProfile(p, k, pr) ? 0.5 : 0) + (F.squadNeeds().includes(p.pos) ? 0.6 : 0);
  const budget = F.transferBudget() + (RC().extra || 0); if (p.ask > budget * 1.3) d -= 1.5;
  return d >= 1 ? 'A' : d >= 0.3 ? 'B' : d >= -0.5 ? 'C' : 'D';
}
const rng = (a, b) => a === b ? `${a}★` : `${a}–${b}★`;
const bandTxt = k => rng(F.stars(k.est - k.sd * 0.75), F.stars(k.est + k.sd * 0.75));
const potTxt = k => rng(F.stars(Math.max(k.est, k.pest - k.psd * 0.75)), F.stars(k.pest + k.psd * 0.75));

/* ---------- pipeline ---------- */
const pipeOf = id => RC().pipe.find(x => x.pid === id);
function addPipe(id, stage) { let x = pipeOf(id); if (!x) { x = { pid: id, stage, since: F.absWeek(), log: [] }; RC().pipe.push(x); } else if (STAGES.indexOf(stage) > STAGES.indexOf(x.stage) && x.stage !== 'lost') { x.stage = stage; x.since = F.absWeek(); } return x; }
function setStage(x, st, why) { x.stage = st; x.since = F.absWeek(); if (why) x.log.push(why); }
function threshold() { const a = man('dof', 'approve'); return a === '999' ? Infinity : a === '0' ? 0 : F.transferBudget() * (+a) / 100; }
function wageLimit() { const mw = man('dof', 'maxWage'); if (mw === '999') return Infinity; const l = F.playerWages() / Math.max(1, sq().length) * (+mw) / 100; return sq().length < 17 ? Math.max(l, wageFor(tierAvg(g().club.tier)) * 1.3) : l; }
function capFor(p) { const b = F.transferBudget() + (RC().extra || 0), mf = man('dof', 'maxFee'); const lim = mf === '0' ? 0 : b * (+mf) / 100; return Math.round(Math.min(lim, b) / 100) * 100; }
function ruleIssues(p) { const out = []; if (p.age > +man('dof', 'maxAge')) out.push('age limit'); if (p.club && p.ask * 0.75 > capFor(p)) out.push('fee limit'); if (p.wageAsk > wageLimit() * 1.25) out.push('wage limit'); const leaving = sq().filter(q => q.sellFlag || q.expiring).reduce((a, q) => a + q.wage, 0); if ((F.playerWages() - leaving + p.wageAsk) / Math.max(1, F.revenueAvg()) > +man('fin', 'wageCap') / 100 + 0.05) out.push('wage cap'); return out; }

/* ---------- negotiation ---------- */
function openDeal(x, capOverride) {
  const p = RC().pool[x.pid]; if (!p) return setStage(x, 'lost', 'He is no longer available.');
  if (!inWin()) { x.apAsked = false; return setStage(x, 'recommended', 'The window is closed. He stays on the list for the next one.'); }
  const neg = F.eff('dof', 1), hard = man('dof', 'hard') / 100;
  const floor = p.club ? Math.round(p.ask * (0.72 + F.rnd() * 0.18 - (neg - 10) * 0.012) * (g().phase === 'season' && g().week >= 17 ? 1.15 : 1) * (F.deptHas && F.deptHas('recruit', 'neg') ? 0.9 : 1) / 100) * 100 : 0;
  x.deal = { club: p.club, ask: p.ask, floor, cap: capOverride != null ? capOverride : Math.max(capFor(p), 0), offer: 0, round: 0, wageAsk: p.wageAsk, sellon: false, inst: false, rounds: [], rivalAsked: false };
  setStage(x, 'negotiating', p.club ? `Opening talks with ${F.cname(p.club)}.` : 'Talks with the player\'s agent.');
}
function negRound(x) {
  const p = RC().pool[x.pid], d = x.deal; if (!p) return setStage(x, 'lost', 'He signed elsewhere.');
  d.round++; const hard = man('dof', 'hard') / 100, cl = man('dof', 'clauses');
  if (p.club) {
    d.offer = d.round === 1 ? Math.round(Math.min(d.cap, d.ask * (0.85 - hard * 0.2)) / 100) * 100 : Math.round(Math.min(d.cap, d.offer + (Math.min(d.cap, d.ask) - d.offer) * 0.6) / 100) * 100;
    if (cl !== 'none' && !d.sellon && d.offer < d.floor) { d.sellon = true; d.floor = Math.round(d.floor * 0.9 / 100) * 100; d.rounds.push(`Adds a 15% sell-on clause; ${F.cname(p.club)} lower their price.`); }
    if (cl === 'all' && !d.inst && d.offer < d.floor) { d.inst = true; d.floor = Math.round(d.floor * 0.95 / 100) * 100; d.rounds.push('Offers to pay in two instalments.'); }
    if (d.offer >= d.floor * (1 + gauss() * 0.04)) { d.rounds.push(`Round ${d.round}: ${money(d.offer)} accepted by ${F.cname(p.club)}.`); d.fee = d.offer; return wagePhase(x); }
    const counter = Math.round(Math.max(d.floor, (d.ask + d.offer) / 2) / 100) * 100; d.rounds.push(`Round ${d.round}: ${money(d.offer)} rejected. ${F.cname(p.club)} want ${money(counter)}.`);
    if (d.round >= 3 || (d.offer >= d.cap && counter > d.cap)) { if (counter <= d.cap * 1.35 && !d.capAsked) { d.capAsked = true; F.queueEvent('rec_raise', { pid: x.pid, counter }); return; } return setStage(x, 'lost', `Talks collapse: ${F.cname(p.club)} will not go below ${money(counter)}.`); }
    // rivals
    if (!d.rivalAsked && chance(0.07 + (RC().know[x.pid] && RC().know[x.pid].grade === 'A' ? 0.07 : 0))) { d.rivalAsked = true; F.queueEvent('rec_rival', { pid: x.pid, rival: aiClub(Math.max(1, g().club.tier - 1)), bid: Math.round(d.offer * 1.15 / 100) * 100 }); }
  } else { d.fee = 0; return wagePhase(x); }
}
function wagePhase(x) {
  const p = RC().pool[x.pid], d = x.deal, lim = wageLimit();
  d.wage = Math.round(Math.min(d.wageAsk, lim * 1.05) / 5) * 5;
  if (d.wage >= d.wageAsk * 0.97 || chance(Math.pow(d.wage / d.wageAsk, 4))) { d.rounds.push(`Personal terms agreed at ${money(d.wage)}/wk.`); setStage(x, 'agreed'); return complete(x); }
  d.rounds.push(`He wants ${money(d.wageAsk)}/wk; we can offer ${money(d.wage)}.`); setStage(x, 'lost', `${p.name} rejects our wage offer.`);
}
function complete(x) {
  const r = RC(), p = r.pool[x.pid], d = x.deal; if (!p) return;
  const agent = Math.round(d.fee * 0.08 / 100) * 100, now = d.inst ? Math.round(d.fee * 0.6 / 100) * 100 : d.fee;
  if (d.inst) r.owed.push({ amt: d.fee - now, season: g().season + 1, name: p.name });
  p.fee = now + agent; p.wage = d.wage; delete p.pool; delete p.ask; delete p.wageAsk; delete r.pool[p.id];
  const k = r.know[p.id]; p.pCA = k ? k.est : p.ca; p.pPA = k ? k.pest : p.pa; if (d.sellon) p.sellOn = 0.15;
  { const w = (r.win = r.win || {}), kk = winKey(); w[kk] = w[kk] || {}; w[kk][p.pos] = (w[kk][p.pos] || 0) + 1; }
  F.sign(p); setStage(x, 'signed', d.fee ? `Signed for ${money(d.fee)}${d.inst ? ' (instalments)' : ''}${d.sellon ? ' with a sell-on clause' : ''}. Agent fee ${money(agent)}.` : `Signed on a free, ${money(d.wage)}/wk.`);
  r.log.unshift({ s: g().season, w: g().week, name: p.name, fee: d.fee, wage: d.wage, est: k ? +k.est.toFixed(2) : null, by: k ? k.byId : null, pos: p.pos, pid: p.id, surplus: winBuys(p.pos) > 1 });
  for (const y of r.pipe) { const q = r.pool[y.pid]; if (!q || q.pos !== p.pos || y === x || !['negotiating', 'approach', 'recommended'].includes(y.stage)) continue; if (!slotOpen(q, r.know[y.pid])) { if (y.stage !== 'recommended') setStage(y, 'recommended', 'On hold: position covered.'); y.apAsked = false; y.hold = true; } }
  if (d.fee > 0) g().paper.stories.push({ h: 'Deal done', t: `${N('dof')} completes the signing of ${p.name} after ${d.round} round${d.round === 1 ? '' : 's'} of talks.` });
  r.extra = 0;
}

/* ---------- weekly ---------- */
function assignScouts() {
  const r = RC(), prios = r.plan.prios || [], foc = [man('scout', 'reg1'), man('scout', 'reg2')];
  const needMore = r.pipe.filter(x => (x.stage === 'scouted' || x.stage === 'recommended' || x.stage === 'identified') && r.know[x.pid] && r.know[x.pid].conf !== 'high' && r.pool[x.pid] && !scoutsAll().some(s => s.assign && s.assign.pid === x.pid));
  for (const s of scoutsAll()) {
    if (s.assign && s.assign.left > 0) continue;
    if (needMore.length && chance(0.5)) { const x = needMore.shift(); s.assign = { type: 'player', pid: x.pid, reg: r.pool[x.pid].region, left: 1 + (s === staff('scout') ? 0 : ri(0, 1)), label: `Watch ${r.pool[x.pid].name}` }; continue; }
    const pr = prios.length ? pick(prios) : null, reg = chance(0.7) ? pick(foc) : (s.home || pick(REGK));
    s.assign = { type: pr ? 'profile' : 'region', pos: pr ? pr.pos : null, kind: pr ? pr.kind : null, reg, left: ri(2, 4), label: pr ? `${F.POS_L[pr.pos]}, ${pr.kind}, in ${REG[reg].name}` : `Sweep ${REG[reg].name}` };
  }
}
function scoutWeek() {
  const r = RC(), t = g().club.tier, found = [];
  // A department audit uses real scout capacity, not a free accuracy bonus.
  // Audit work is done instead of fresh coverage; the report() function
  // supplies the same uncertainty, network and competency rules as fieldwork.
  const audits = Object.entries(g().deptIssues || {}).filter(([key, rec]) =>
    key.startsWith('recruit:') && rec && rec.choice === 'plan' &&
    rec.approach === 'audit' && rec.last !== 'blocked' &&
    F.absWeek() > rec.started && F.absWeek() <= rec.due);
  const audit = audits.length ? audits[0][1] : null;
  let auditDone = 0;
  for (const s of scoutsAll()) {
    const a = s.assign; if (!a) continue; a.left--;
    if (audit && auditDone < 2) {
      const entries = Object.entries(r.know || {}).filter(([pid, k]) =>
        r.pool[pid] && k && Number.isFinite(k.sd) && (!a.reg || r.pool[pid].region === a.reg));
      if (entries.length) {
        entries.sort((x,y) => y[1].sd - x[1].sd || String(x[0]).localeCompare(String(y[0])));
        const [pid] = entries[auditDone % entries.length];
        report(s, r.pool[pid]);
        auditDone++;
        continue; // Explicit opportunity cost: no new discovery by this scout.
      }
    }
    if (a.type === 'player') { const p = r.pool[a.pid]; if (p) { const k = report(s, p); const x = pipeOf(p.id); if (x && x.stage === 'identified') setStage(x, 'scouted'); found.push({ s, p, k, again: true }); } continue; }
    if (!chance(0.45 + s.at[2] / 50 + (g().push.scouting > 0 || g().push.sporting > 0 ? 0.2 : 0))) continue;
    const fit = chance(0.85), wl = wageLimit(), ma = +man('dof', 'maxAge');
    const cands = Object.values(r.pool).filter(p => p.region === a.reg && Math.abs(p.inTier - t) <= 1 && !pipeOf(p.id) && (!a.pos || p.pos === a.pos) && (a.kind !== 'young' || p.age <= 23) && (a.kind !== 'proven' || p.age >= 25) && (!fit || (p.age <= ma && p.wageAsk <= wl * 1.15 && (!p.club || p.ask * 0.8 <= capFor(p)))));
    if (!cands.length) continue;
    const p = cands.sort((x, y) => (y.ca + gauss() * 1.5) - (x.ca + gauss() * 1.5))[0], k = report(s, p);
    if (k.grade === 'D' && chance(0.7)) continue;
    addPipe(p.id, 'scouted'); found.push({ s, p, k });
  }
  r.lastFound = found.map(f => ({ sid: f.s.id, sname: f.s.name, pid: f.p.id, again: !!f.again }));
}
function dofPipeline() {
  const r = RC(), d = staff('dof'); if (!d) return;
  const need = F.squadNeeds(), depth = 20 + Math.round(man('dof', 'depth') / 100 * 6);
  for (const x of r.pipe) {
    const p = r.pool[x.pid], k = r.know[x.pid]; if (!p && !['signed', 'lost'].includes(x.stage)) { setStage(x, 'lost', 'He moved elsewhere.'); continue; }
    if (!p || !k) continue;
    k.grade = grade(p, k);
    if (x.stage === 'scouted' && (k.grade === 'A' || k.grade === 'B') && (k.conf !== 'low' || (F.squadNeeds().includes(p.pos) && F.window_()))) setStage(x, 'recommended', `${k.by} recommends him (grade ${k.grade}).`);
    if (x.stage === 'scouted' && k.grade === 'D' && k.n >= 2) setStage(x, 'lost', 'Scouts advise against.');
  }
  for (const x of r.pipe.filter(x => x.planB && x.stage === 'scouted' && r.pool[x.pid])) { const p = r.pool[x.pid], live = r.pipe.some(y => y !== x && r.pool[y.pid] && r.pool[y.pid].pos === p.pos && ['recommended', 'approach', 'negotiating'].includes(y.stage) && !y.hold); if (!live && slotOpen(p, r.know[x.pid]) && winBuys(p.pos) === 0) { setStage(x, 'recommended', 'Plan A fell through. Plan B is up.'); x.planA = true; x.boost = true; x.wasB = true; } }
  if (!inWin()) return;
  const active = r.pipe.filter(x => ['approach', 'negotiating'].includes(x.stage)).length;
  const recs = r.pipe.filter(x => x.stage === 'recommended' && r.pool[x.pid] && !x.apAsked && slotOpen(r.pool[x.pid], r.know[x.pid])).sort((a, b) => scoreRec(b) - scoreRec(a));
  const upgrade = recs.some(x => r.know[x.pid].grade === 'A' && r.know[x.pid].est > posWorst(r.pool[x.pid].pos) + 0.4);
  const wanted = sq().length < depth + 1 || need.length || (upgrade && sq().length < depth + 4);
  let slots = wanted ? 2 - active : 0;
  if (F.finTight && F.finTight() && (!need.length || F.wageRatio() * 100 > +man('fin', 'wageCap') + 10)) slots = 0; // money first
  // Finance's operating forecast constrains discretionary recruitment. An
  // urgent squad gap can still be addressed under the existing wage/fee rules.
  // No new budget meter: this uses the actual Finance plan and club cash.
  if (F.bizPlan) {
    const fp = F.bizPlan();
    const reserve = Math.max(0, (fp.spend - fp.env) * 4);
    if (fp.spend > fp.env && g().club.cash < reserve && !need.length) slots = 0;
  }
  for (const x of recs) {
    if (slots <= 0) break;
    const p = r.pool[x.pid]; if (!slotOpen(p, r.know[x.pid]) || r.pipe.some(y => y !== x && ['approach', 'negotiating'].includes(y.stage) && r.pool[y.pid] && r.pool[y.pid].pos === p.pos)) { x.hold = true; continue; } x.hold = false; const iss = ruleIssues(p); x.blocked = null;
    { const W = F.playerWages(), wr = F.wageRatio(), proj = W > 0 ? wr * (W + (p.wageAsk || 0)) / W : 0; if (proj * 100 > +man('fin', 'wageCap') + 3 && sq().length >= 16) { x.hold = true; x.note = 'Over the wage cap'; continue; } }
    if (iss.length && p.loanable && iss.every(i => i === 'fee limit' || i === 'wage limit') && F.recLoan) { slots--; F.recLoan(x); continue; }
    if (iss.length) { if ((d.p.risk >= 11 || d.p.ego >= 13) && r.know[x.pid].grade === 'A' && !x.exAsked && F.absWeek() - (r.exAt || -99) > 6) { r.exAt = F.absWeek(); x.exAsked = true; F.queueEvent('rec_exception', { pid: x.pid, why: iss }); slots--; } else x.blocked = iss; continue; }
    slots--;
    if (p.ask > threshold()) { x.apAsked = true; setStage(x, 'approach', 'Needs your approval.'); F.queueEvent('rec_approve', { pid: x.pid }); }
    else { setStage(x, 'approach'); openDeal(x); }
  }
  for (const x of r.pipe.filter(x => x.stage === 'negotiating')) negRound(x);
}
function scoreRec(x) { const k = RC().know[x.pid], p = RC().pool[x.pid]; return (k.grade === 'A' ? 3 : 2) + (prioOf(p) ? 1 : 0) + (k.conf === 'high' ? 0.5 : 0) + (F.squadNeeds().includes(p.pos) ? 1.5 : 0) + (g().dofPrio === p.pos ? 1 : 0); }
function worldWeek() {
  const r = RC();
  if (inWin()) for (const id in r.pool) { const p = r.pool[id]; if (chance(0.012)) { const x = pipeOf(+id); if (x && ['negotiating', 'agreed'].includes(x.stage)) continue; if (x && !['signed', 'lost'].includes(x.stage)) { setStage(x, 'lost', `${p.name} joins another club.`); g().paper.stories.push({ h: 'Target lost', t: `${p.name}, on our list, has joined another club.` }); } p.club = aiClub(p.inTier); p.contract = ri(1, 3); p.ask = Math.round(p.value * REG[p.region].cost * (1 + F.rnd() * 0.3) / 100) * 100; } }
  r.pipe = r.pipe.filter(x => !(['signed', 'lost'].includes(x.stage) && F.absWeek() - x.since > 12));
}
H.recWeekly = () => { ensure(); topUpPool(); while (RC().scouts.length < nScouts() - 1) RC().scouts.push(hireScout()); while (RC().scouts.length > Math.max(0, nScouts() - 1)) RC().scouts.pop(); assignScouts(); scoutWeek(); dofPipeline(); worldWeek(); G_shortlistMirror(); };
H.recCost = () => { const r = RC(); return r ? r.scouts.reduce((a, s) => a + s.wage, 0) + Math.round(M(60) * r.scouts.length) : 0; };
H.recSeason = rep => {
  ensure(); const r = RC();
  for (const id in r.pool) { const p = r.pool[id]; p.age++; if (p.age < 24 && p.pa > p.ca) { const w = F.POSW[p.pos]; for (const a in w) p.a[a] = clamp(p.a[a] + (p.pa - p.ca) * 0.18, 1, 20); } if (p.age >= 31) for (const a of ['pac', 'sta', 'str']) p.a[a] = clamp(p.a[a] - 0.4, 1, 20); upd(p); p.contract = Math.max(0, p.contract - 1); if (p.contract === 0 && p.club && chance(0.5)) p.club = null; if (!p.club) p.ask = 0; else if (p.contract === 0) p.ask = Math.round(p.value * REG[p.region].cost * 0.35 / 100) * 100; else p.ask = Math.round(p.value * REG[p.region].cost * (0.9 + F.rnd() * 0.35) / 100) * 100; if (p.age > 35) delete r.pool[id]; }
  for (const k in r.know) { const kk = r.know[k]; kk.sd = Math.min(2.5, kk.sd + 0.4); kk.psd = Math.min(3, kk.psd + 0.3); kk.conf = kk.sd < 0.6 ? 'high' : kk.sd < 1.2 ? 'medium' : 'low'; if (!r.pool[k]) delete r.know[k]; }
  const due = r.owed.filter(o => o.season <= g().season + 1); for (const o of due) g().club.cash -= o.amt; r.owed = r.owed.filter(o => !due.includes(o)); if (due.length) rep.instalments = due.reduce((a, o) => a + o.amt, 0);
  r.plan.set = false;
  if (g().wageFreezePrev) { g().mand.dof.maxWage = g().wageFreezePrev; delete g().wageFreezePrev; }
};
function G_shortlistMirror() { g().shortlist = []; }

/* ---------- setup & migration ---------- */
function ensure() {
  const G = g(); if (!G || !G.club) return;
  if (!G.rec) { G.rec = { pool: {}, know: {}, scouts: [], pipe: [], log: [], owed: [], plan: { prios: [], set: false }, extra: 0 }; topUpPool();
    for (const p of G.shortlist || []) { p.pool = true; p.inTier = G.club.tier; p.club = p.fee ? aiClub(G.club.tier) : null; p.ask = p.fee || 0; p.wageAsk = p.wage; G.rec.pool[p.id] = p; G.rec.know[p.id] = { n: 1, est: p.pCA || p.ca, sd: 1.2, pest: p.pPA || p.pa, psd: 1.5, conf: 'medium', grade: 'B', by: N('scout'), first: F.absWeek() }; addPipe(p.id, 'scouted'); }
    G.shortlist = []; }
}
H.recMigrate = ensure;
if (F.BR.scout_find) F.BR.scout_find.check = () => null;
if (F.BR.scout_dry) F.BR.scout_dry.check = () => null;

/* ---------- pre-season recruitment plan ---------- */
const KINDS = { young: 'Young, with potential', proven: 'Proven, ready now', value: 'Value for money' };
F.recPlanSuggest = () => {
  ensure(); const out = [], seen = new Set(), dna = g().club.dna;
  const kind = dna.talent === 'academy' ? 'young' : dna.talent === 'smart' ? 'value' : 'proven';
  for (const pos of F.squadNeeds()) if (!seen.has(pos)) { seen.add(pos); out.push({ pos, kind, why: 'Not enough players' }); }
  const weak = POSK.map(pos => ({ pos, v: posBest(pos) })).sort((a, b) => a.v - b.v);
  for (const w of weak) if (out.length < 5 && !seen.has(w.pos)) { seen.add(w.pos); out.push({ pos: w.pos, kind, why: `Weakest starter: ${F.stars(w.v)}★` }); }
  const aging = POSK.find(pos => !seen.has(pos) && sq().filter(p => p.pos === pos && p.age >= 31).length >= 1);
  if (aging && out.length < 6) out.push({ pos: aging, kind: 'young', why: 'Ageing starter' });
  return out.slice(0, 6);
};
F.recTogglePrio = (pos, kind) => { const pl = RC().plan; const i = pl.prios.findIndex(x => x.pos === pos); if (i >= 0) pl.prios.splice(i, 1); else if (pl.prios.length < 3) pl.prios.push({ pos, kind }); };
F.recSetKind = (pos, kind) => { const x = RC().plan.prios.find(x => x.pos === pos); if (x) x.kind = kind; };
F.REC_KINDS = KINDS;

/* ---------- views ---------- */
F.recView = () => {
  ensure(); const r = RC();
  if (!r.plan.set) { r.plan.set = true; if (!r.plan.prios.length) r.plan.prios = F.recPlanSuggest().slice(0, 2).map(x => ({ pos: x.pos, kind: x.kind })); }
  const rows = r.pipe.map(x => { const p = r.pool[x.pid] || sq().find(s => s.id === x.pid), k = r.know[x.pid]; return { x, p, k }; }).filter(o => o.p);
  return { r, rows, scouts: scoutsAll(), plan: r.plan, budget: F.transferBudget() + (r.extra || 0), threshold: threshold(), wageLimit: wageLimit(), STAGES, inWin: inWin() };
};

F.recScoutAcc = s => { const errs = RC().log.filter(l => l.by === s.id && l.est != null).map(l => { const p = sq().find(q => q.name === l.name && q.pos === l.pos); return p ? Math.abs(F.stars(l.est) - F.stars(p.ca)) : null; }).filter(v => v != null); return errs.length ? { n: errs.length, err: errs.reduce((a, b) => a + b, 0) / errs.length } : null; };
F.recReport = report; F.recScouts = scoutsAll; F.recRules = ruleIssues; F.recSetStage = setStage; F.recAddPipe = addPipe;
F.recPlanBoard = () => { ensure(); const r = RC(); return (r.plan.prios || []).map(pr => { const pos = pr.pos, rows = r.pipe.filter(x => r.pool[x.pid] && r.pool[x.pid].pos === pos), busy = rows.find(x => ['negotiating', 'approach'].includes(x.stage)), next = rows.filter(x => x.stage === 'recommended' && !x.hold)[0], signed = r.log.find(l => l.s === g().season && l.pos === pos && winBuys(pos) > 0); const st = winBuys(pos) > 0 ? 'done' : busy ? 'busy' : 'open'; return { pos, st, who: st === 'done' ? (signed ? signed.name + ' signed' : 'Signed') : busy ? r.pool[busy.pid].name + (busy.stage === 'approach' ? ', your call' : ', talks') : next ? r.pool[next.pid].name + ' next' : `${rows.filter(x => x.stage === 'scouted').length} on the list`, pid: busy ? busy.pid : next ? next.pid : null }; }); };
F.recSlotOpen = slotOpen;
F.recDeal = () => { ensure(); dofPipeline(); };
F.recLate = () => { ensure(); const r = RC(), b = F.transferBudget() + (r.extra || 0); return Object.values(r.pool).filter(p => { const k = r.know[p.id], x = pipeOf(p.id); return k && (k.grade === 'A' || k.grade === 'B') && k.conf !== 'low' && (!x || ['scouted', 'recommended'].includes(x.stage)) && slotOpen(p, k) && p.ask * 1.2 <= b && !ruleIssues(p).filter(i => i !== 'fee limit').length; }).sort((a, b2) => (r.know[b2.id].est - r.know[a.id].est))[0] || null; };
F.recForceSign = (pid, fee, wage, note) => { const r = RC(), p = r.pool[pid]; if (!p) return false; const x = addPipe(pid, 'approach'); x.deal = { club: p.club, ask: p.ask, floor: fee, cap: fee, offer: fee, fee, round: 1, wageAsk: p.wageAsk, wage, sellon: false, inst: false, rounds: [note || `Deadline-day deal: ${money(fee)}.`] }; setStage(x, 'agreed'); complete(x); return true; };
F.recWageLimit = wageLimit;
F.recPlayer = id => { const r = RC(); return { p: r.pool[id], k: r.know[id], x: pipeOf(id) }; };
F.recBand = bandTxt; F.recPot = potTxt; 

const sc0 = F.scorecard;
F.scorecard = () => { const cards = sc0(), c = cards.find(x => x.k === 'recruit'); if (c && RC()) { const r = RC(), live = r.pipe.filter(x => !['signed', 'lost'].includes(x.stage)), rec = live.filter(x => x.stage === 'recommended').length, bl = live.filter(x => x.blocked).length; c.rows = c.rows.filter(x => x.l !== 'Shortlist'); c.rows.push({ l: 'Recruitment list', v: `${live.length} players`, ref: `${rec} recommended${bl ? `, ${bl} blocked by your rules` : ''}`, ok: rec >= 2 ? true : live.length < 3 ? false : null }); c.rows.push({ l: 'Scouts', v: `${scoutsAll().length}`, ref: 'Chief Scout plus staff scouts, set by the scouting budget', ok: null }); } return cards; };

/* ---------- escalations ---------- */
const E = F.defineEvent, P = id => RC().pool[id];
const dossier = c => { const p = P(c.pid), k = RC().know[c.pid]; if (!p || !k) return 'He is no longer available.'; return `${p.name} (${p.age}, ${F.POS_L[p.pos]}, ${REG[p.region].name}${p.club ? ', ' + F.cname(p.club) : ', free agent'}). ${k.by} rates him ${bandTxt(k)} now, ${potTxt(k)} potential, confidence ${k.conf}, ${k.n} report${k.n === 1 ? '' : 's'}, grade ${k.grade}. Asking ${p.club ? money(p.ask) : 'no fee'}, wages around ${money(p.wageAsk)}/wk.`; };
E('rec_approve', { forced: 1, from: 'dof', dept: 'sporting', cd: 1, why: () => `The deal is above the approval line in the DoF mandate (${threshold() === 0 ? 'every deal' : money(Math.round(threshold()))}).`,
  second: { r: 'coach', t: c => { const p = P(c.pid); if (!p) return 'Gone.'; const best = posBest(p.pos), k = RC().know[c.pid]; return k.est > best + 0.3 ? '"He would walk into my team."' : k.est > best - 0.5 ? '"Useful competition for the starter."' : '"A squad player at best."'; } },
  title: c => `Approve the move for ${P(c.pid) ? P(c.pid).name : 'the target'}?`, body: c => dossier(c),
  opts: [
    { l: 'Approve: negotiate within the budget', h: 'DoF opens talks', f: c => { const x = pipeOf(c.pid); if (!x || !P(c.pid)) return 'He is gone.'; openDeal(x); return 'Talks open this week.'; } },
    { l: 'Approve, capped at asking price', h: 'DoF may not go above the ask', f: c => { const x = pipeOf(c.pid), p = P(c.pid); if (!x || !p) return 'Gone.'; openDeal(x, Math.min(capFor(p), p.ask)); return 'Talks open, with a firm ceiling.'; } },
    { l: 'Ask for another report first', h: 'One more week of scouting', f: c => { const x = pipeOf(c.pid); if (x) { setStage(x, 'scouted', 'Back to the scouts for another look.'); x.apAsked = false; } return 'The scouts go back for another look.'; } },
    { l: 'Reject', h: 'Drop him', f: c => { const x = pipeOf(c.pid); if (x) setStage(x, 'lost', 'Rejected by the CEO.'); return 'The DoF moves on.'; } }],
  auto: c => { const k = RC().know[c.pid]; return k && k.grade === 'A' ? 0 : 2; } });
E('rec_exception', { forced: 1, from: 'dof', dept: 'sporting', cd: 1, why: c => `He breaks your rules: ${c.why.join(', ')}.`,
  second: { r: 'scout', t: c => { const p = P(c.pid); if (!p) return 'Gone.'; const est = p.ca + gauss() * 0.4; return `"I have him at ${F.stars(est)}★. ${est >= posBest(p.pos) ? 'Better than what we have.' : 'Not clearly better than what we have.'}"`; } },
  title: c => `DoF wants an exception for ${P(c.pid) ? P(c.pid).name : 'a target'}`, body: c => dossier(c),
  opts: [
    { l: 'Allow the exception', h: 'Rules bend for this deal · DoF trust ↑', f: c => { const x = pipeOf(c.pid), p = P(c.pid); if (!x || !p) return 'Gone.'; RC().extra = Math.max(0, Math.round(p.ask - capFor(p))); setStage(x, 'approach'); openDeal(x, Math.round(p.ask * 1.05 / 100) * 100); if (staff('dof')) staff('dof').rel = clamp(staff('dof').rel + 5, 0, 100); return 'Talks open outside the usual limits.'; } },
    { l: 'Hold the line', h: 'DoF trust ↓', f: c => { const x = pipeOf(c.pid); if (x) setStage(x, 'lost', 'Blocked by the rules.'); if (staff('dof')) staff('dof').rel = clamp(staff('dof').rel - 4, 0, 100); return 'He drops it.'; } }],
  auto: () => 1 });
E('rec_raise', { forced: 1, from: 'dof', dept: 'sporting', cd: 1, why: 'The seller wants more than the DoF may pay.',
  title: c => `Talks stuck on ${P(c.pid) ? P(c.pid).name : 'a target'}`, body: c => { const x = pipeOf(c.pid), p = P(c.pid); if (!x || !p) return 'Gone.'; return `${x.deal.rounds.slice(-2).join(' ')} Our ceiling is ${money(x.deal.cap)}. ${F.cname(p.club)} want ${money(c.counter)}.`; },
  opts: [
    { l: c => `Go to ${money(c.counter)}`, h: 'Deal likely', f: c => { const x = pipeOf(c.pid); if (!x || !P(c.pid)) return 'Gone.'; x.deal.cap = c.counter; x.deal.offer = c.counter; x.deal.fee = c.counter; x.deal.rounds.push(`We meet the price: ${money(c.counter)}.`); wagePhase(x); return x.stage === 'signed' ? 'Deal done.' : 'Fee agreed; personal terms next.'; } },
    { l: 'Split the difference', h: 'Maybe', f: c => { const x = pipeOf(c.pid); if (!x || !P(c.pid)) return 'Gone.'; const mid = Math.round((x.deal.cap + c.counter) / 2 / 100) * 100; if (chance(0.55)) { x.deal.fee = mid; x.deal.rounds.push(`Met halfway at ${money(mid)}.`); wagePhase(x); return 'They accept the compromise.'; } setStage(x, 'lost', 'They refuse to budge.'); return 'They walk away.'; } },
    { l: 'Walk away', h: '', f: c => { const x = pipeOf(c.pid); if (x) setStage(x, 'lost', 'We walked away.'); return 'The DoF moves on.'; } }],
  auto: c => man('dof', 'hard') > 60 ? 2 : 1 });
E('rec_rival', { forced: 1, from: 'dof', dept: 'sporting', cd: 1, why: 'A rival has entered the race for our target.',
  title: c => `${F.cname(c.rival)} bid for ${P(c.pid) ? P(c.pid).name : 'our target'}`, body: c => { const p = P(c.pid), x = pipeOf(c.pid); return p && x ? `They have offered about ${money(c.bid)}. Our last offer was ${money(x.deal.offer)}. ${p.name} likes the idea of a bigger club.` : 'Gone.'; },
  opts: [
    { l: 'Beat their offer', h: c => `Offer ${money(Math.round(c.bid * 1.05 / 100) * 100)}`, f: c => { const x = pipeOf(c.pid); if (!x || !P(c.pid)) return 'Gone.'; const o = Math.round(c.bid * 1.05 / 100) * 100; x.deal.cap = Math.max(x.deal.cap, o); x.deal.offer = o; if (o >= x.deal.floor) { x.deal.fee = o; x.deal.rounds.push(`We beat ${F.cname(c.rival)}: ${money(o)}.`); wagePhase(x); return 'We win the race.'; } return 'Still short of their price.'; } },
    { l: 'Sell him the project instead', h: 'Depends on the DoF and the player', f: c => { const x = pipeOf(c.pid), p = P(c.pid); if (!x || !p) return 'Gone.'; if (chance(0.35 + (F.eff('dof', 2) - 10) * 0.03 + (p.pers.loy - 10) * 0.02)) return 'He wants to come to us. Talks continue.'; setStage(x, 'lost', `He chose ${F.cname(c.rival)}.`); delete RC().pool[c.pid]; return `He joins ${F.cname(c.rival)}.`; } },
    { l: 'Let him go', h: '', f: c => { const x = pipeOf(c.pid); if (x) setStage(x, 'lost', `Lost to ${F.cname(c.rival)}.`); delete RC().pool[c.pid]; return 'We move on.'; } }],
  auto: c => { const x = pipeOf(c.pid); return x && x.deal && Math.round(c.bid * 1.05) <= x.deal.cap ? 0 : 2; } });

/* ---------- briefings ---------- */
const B = F.defineBrief;
B('rec_report', { role: 'scout', cd: 1,
  check: () => { const r = RC(); if (!r || !r.lastFound) return null; const f = r.lastFound.map(f => ({ ...f, k: r.know[f.pid], p: r.pool[f.pid] })).filter(f => f.k && f.p && !f.again && (f.k.grade === 'A' || f.k.grade === 'B')).sort((a, b) => (a.k.grade > b.k.grade ? 1 : -1))[0]; return f ? { pid: f.pid, sname: f.sname, score: f.k.grade === 'A' ? 2.4 : 1.6 } : null; },
  title: c => { const p = P(c.pid), k = RC().know[c.pid]; return p ? `Report: ${p.name}, grade ${k.grade}` : 'Report'; },
  text: c => { const p = P(c.pid), k = RC().know[c.pid]; return p ? `${c.sname}: ${p.age}, ${F.POS_L[p.pos]}, ${REG[p.region].name}. ${bandTxt(k)} now, ${potTxt(k)} potential, confidence ${k.conf}. ${p.club ? 'Around ' + money(p.ask) + '.' : 'Free agent.'}` : 'Gone.'; },
  opts: [
    { l: 'Push him up the list', h: 'DoF prioritises him', f: c => { const x = pipeOf(c.pid); if (!x) return 'Gone.'; x.boost = true; if (x.stage === 'scouted' && RC().know[c.pid].conf !== 'low') setStage(x, 'recommended', 'Prioritised by the CEO.'); return 'He moves up the DoF\'s list.'; } },
    { l: 'Get a second scout on him', h: 'Sharper picture next week', f: c => { const p = P(c.pid), s = RC().scouts.find(s => !s.assign || s.assign.type !== 'player') || staff('scout'); if (!p || !s) return 'Nobody free.'; s.assign = { type: 'player', pid: p.id, reg: p.region, left: 1, label: `Watch ${p.name}` }; return `${s.name} will watch him next.`; } },
    { l: 'Not for us', h: '', f: c => { const x = pipeOf(c.pid); if (x) setStage(x, 'lost', 'Dropped by the CEO.'); return 'Dropped.'; } }] });
B('rec_talks', { role: 'dof', cd: 1,
  check: () => { const r = RC(); if (!r) return null; const x = r.pipe.find(x => x.stage === 'negotiating' && x.deal && x.deal.rounds.length && !x.briefed); if (!x) return null; x.briefed = F.absWeek(); return { pid: x.pid, score: 2 }; },
  title: c => `Talks: ${P(c.pid) ? P(c.pid).name : ''}`, text: c => { const x = pipeOf(c.pid); return x && x.deal ? x.deal.rounds.slice(-1)[0] + ` Our ceiling: ${money(x.deal.cap)}.` : 'Talks over.'; },
  opts: [
    { l: 'Give him more room', h: 'Ceiling +15%', f: c => { const x = pipeOf(c.pid); if (!x || !x.deal) return 'Over.'; x.deal.cap = Math.round(x.deal.cap * 1.15 / 100) * 100; return `Ceiling raised to ${money(x.deal.cap)}.`; } },
    { l: 'Tell him to play hardball', h: 'Slower, cheaper, riskier', f: c => { const x = pipeOf(c.pid); if (!x || !x.deal) return 'Over.'; x.deal.floor = Math.round(x.deal.floor * 0.95 / 100) * 100; if (chance(0.2)) { setStage(x, 'lost', 'They took offence and ended talks.'); return 'They end the talks.'; } return 'He digs in.'; } },
    { l: 'Leave it to him', h: '', f: () => 'Noted.' }] });
B('rec_blocked', { role: 'dof', cd: 4,
  check: () => { const r = RC(); if (!r || !inWin()) return null; const bl = r.pipe.filter(x => x.blocked && r.pool[x.pid] && x.stage === 'recommended'); if (bl.length < 2) return null; const cnt = {}; bl.forEach(x => x.blocked.forEach(b => cnt[b] = (cnt[b] || 0) + 1)); const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; return { n: bl.length, rule: top, score: 2.2 }; },
  title: c => `Your ${c.rule} is blocking ${c.n} targets`, text: c => `${N('dof')}: "I have ${c.n} players my scouts recommend, and the ${c.rule} rules them out. Loosen it, or I keep looking in a smaller pond."`,
  opts: [
    { l: 'Loosen that rule one step', h: 'More targets become possible', f: c => { const m = g().mand.dof, step = (k, o) => { m[k] = o[Math.min(o.length - 1, o.indexOf(m[k] || o[1]) + 1)]; }; if (c.rule === 'wage limit') step('maxWage', ['100', '150', '200', '999']); else if (c.rule === 'fee limit') step('maxFee', ['0', '25', '50', '100']); else if (c.rule === 'age limit') step('maxAge', ['21', '24', '28', '32', '99']); else { const o = ['50', '60', '70', '85'], f = g().mand.fin; f.wageCap = o[Math.min(3, o.indexOf(f.wageCap || '70') + 1)]; } return 'Rule loosened. He will look at them again.'; } },
    { l: 'Keep the rules', h: 'He looks for cheaper options', f: () => 'The rules stay. He keeps looking.' }] });
})(FO);
