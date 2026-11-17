/* ---------- finance ---------- */
const playerWages = () => G.squad.reduce((a, p) => a + p.wage, 0);
const staffWages = () => ROLES.reduce((a, r) => a + (G.staff[r.id] ? G.staff[r.id].wage : 0), 0);
const ticketPrice = () => Math.round(14 * (0.6 + man('com', 'tickets') / 100) * (1 + (8 - G.club.tier) * 0.12) * 2) / 2;
function attendance() {
  if (HOOK.attendance) return HOOK.attendance();
  const pf = 0.6 + man('com', 'tickets') / 100, form = G.form.slice(-5).reduce((a, r) => a + (r === 'W' ? 1 : r === 'L' ? -1 : 0), 0);
  const turn = clamp(0.58 + (G.st.fans - 50) / 180 + form * 0.025 - (pf - 1.05) * 0.35, 0.25, 1);
  return Math.round(Math.min(G.club.cap, G.club.fanbase * turn));
}
function revenueAvg() { const f = G.fin; return f.revW >= 4 ? f.revSum / f.revW : f.lastRev ? f.lastRev / SEASON_WEEKS : estRevenue(); }
function estRevenue() { const c = G.club; return (950 * sc() + sponsorIncome() + attendance() * ticketPrice() / 2 + c.fanbase * 0.25 * (0.5 + man('com', 'merch') / 100) * (0.6 + c.brand / 100 * 0.8)) * 1.3; }
function sponsorIncome() { const c = G.club; const deals = c.deals.reduce((a, d) => a + d.wk, 0); return Math.round(deals + 620 * sc() * (0.5 + G.st.spons / 100) * (0.8 + eff('com', 1) / 50)); }
function wageRatio() { return playerWages() / Math.max(1, revenueAvg()); }
function transferBudget() {
  const wk = playerWages() + staffWages(); const reserveW = 8 - man('fin', 'risk') / 100 * 10;
  const avail = G.club.cash - reserveW * wk; const share = staff('fin') ? 0.25 + 0.6 * man('fin', 'transfer') / 100 : 0.4;
  const kit = (G.club.kitty || 0) * (staff('fin') ? 0.6 + 0.8 * man('fin', 'transfer') / 100 : 0.8);
  return Math.max(0, Math.round(Math.min(Math.max(0, G.club.cash), kit + Math.max(0, avail * share)) / 100) * 100);
}
function weeklyFinance(home) {
  const c = G.club, i = {}, o = {};
  if (home) i.gate = HOOK.gate ? HOOK.gate() : Math.round(c.lastAtt * ticketPrice() * (perk('ticket') ? 1.08 : 1));
  i.tv = Math.round(950 * sc());
  i.sponsors = sponsorIncome();
  i.merch = Math.round((perk('store') ? 1.3 : 1) * c.fanbase * 0.25 * (0.5 + man('com', 'merch') / 100) * (0.6 + c.brand / 100 * 0.8) * (0.85 + eff('com', 2) / 70));
  if (c.dna.money === 'owner' && c.ownerOn) i.owner = M(1200);
  if (HOOK.acadIncome) { const ai = HOOK.acadIncome(); if (ai) i.academy = ai; }
  o.playerWages = playerWages(); o.staffWages = staffWages();
  const bud = k => (0.3 + man(k, 'budget') / 100 * 1.4);
  o.scouting = (staff('scout') ? M(300) * bud('scout') : 0) + (HOOK.recCost ? HOOK.recCost() : 0);
  o.academy = Math.round(M(380) * (staff('acad') ? bud('acad') : 0.5) * (1 + c.fac.youth * 0.08)) + (HOOK.acadCost ? HOOK.acadCost() : 0);
  o.marketing = staff('mkt') ? M(250) * bud('mkt') : 0;
  o.ground = Math.round(c.cap * 0.12 + c.rent + c.fac.train * M(40));
  o.facilities = Math.round(M(320) * man('fin', 'invest') / 100);
  if (c.debt > 0) o.interest = Math.round(c.debt * (c.rate || 0.0012));
  const pw = projWeekly(); if (pw) o.projects = pw;
  if (HOOK.ftCost) { const fc = HOOK.ftCost(); if (fc) o.firstTeam = fc; }
  if (HOOK.deptCost) { const dc = HOOK.deptCost(); for (const k in dc) if (dc[k]) o[k] = dc[k]; }
  if (HOOK.merchMult) i.merch = Math.round(i.merch * HOOK.merchMult());
  let disc = (1 - (eff('fin', 1) - 10) * 0.015 - (G.push.business > 0 ? 0.05 : 0)) * (HOOK.costDisc ? HOOK.costDisc() : 1); if (!staff('fin')) disc = 1.08;
  for (const k of ['scouting', 'academy', 'marketing', 'ground', 'staffWages', 'deptStaff', 'firstBudget', 'comBudget', 'matchday', 'community', 'facilities']) if (o[k]) o[k] = Math.round(o[k] * disc);
  const tin = Object.values(i).reduce((a, b) => a + b, 0), tout = Object.values(o).reduce((a, b) => a + b, 0);
  c.cash += tin - tout;
  G.fin.last = { i, o, tin, tout }; G.fin.revSum += tin - (i.owner || 0); G.fin.revW++;
  G.ss.rev += tin; G.ss.exp += tout;
  c.facProg += o.facilities / M(320) * 0.06;
  if (c.facProg >= 1) { c.facProg -= 1; if (c.fac.train < 10) { c.fac.train++; G.paper.stories.push({ h: 'Training ground', t: `Facility investment pays off: the training ground is upgraded to level ${c.fac.train}.` }); } }
  G.fin.hist.push(Math.round(c.cash)); if (G.fin.hist.length > 120) G.fin.hist.shift();
}

/* ---------- transfers ---------- */
const window_ = () => G.phase === 'summer' || (HOOK.summerStart ? G.week <= 2 : G.week <= 4) || (G.week >= 17 && G.week <= (HOOK.seasonWeekly ? 18 : 19));
function squadNeeds() { const need = []; for (const pos in REQ) { const n = G.squad.filter(p => p.pos === pos).length; if (n < REQ[pos]) need.push(pos); } return need; }
function weakestPos() { let wp = null, wv = 99; for (const pos in REQ) { const ps = G.squad.filter(p => p.pos === pos).sort((a, b) => b.ca - a.ca); const v = ps.length ? ps[0].ca : 0; if (v < wv) { wv = v; wp = pos; } } return wp; }
function genTarget(pos, free) {
  const reg = staff('scout') ? (chance(0.62) ? man('scout', 'reg1') : man('scout', 'reg2')) : 'dom';
  const pot = man('scout', 'potential') / 100;
  const age = clamp(Math.round(pot > 0.6 ? ri(17, 24) : pot < 0.35 ? ri(24, 33) : ri(19, 30)), 16, 35);
  const net = (G.club.net[reg] || 0) / 100;
  const ca = tierAvg(G.club.tier) + gauss() * 1.5 + (eff('scout', 0) - 10) * 0.07 + net * 0.8 + man('scout', 'budget') / 100 * 0.4 - (free ? 1.3 : 0) + (age > 29 ? 0.4 : 0) - (age < 21 ? 1 : 0);
  const p = genPlayer({ pos, age, ca, region: reg, paBonus: (eff('scout', 1) - 10) * 0.05 + (pot - 0.5) });
  p.fee = free ? 0 : Math.round(p.value * REGIONS[reg].cost * (1 - (eff('dof', 1) - tierAvg(G.club.tier)) * 0.04) * (0.85 + rnd() * 0.35) / 100) * 100;
  p.wage = Math.round(wageFor(p.ca) * (1 + (age > 28 ? 0.15 : 0)) * (0.95 + rnd() * 0.2) / 5) * 5;
  const dataW = clamp((man('dof', 'data') + man('scout', 'data')) / 200 + (perk('data') ? 0.35 : 0), 0, 1.2);
  const nCA = clamp(2.6 - (eff('scout', 0) + eff('dof', 0)) / 20 - dataW * 0.7, 0.35, 3), nPA = clamp(3 - eff('scout', 1) / 10 - (1 - dataW) * 0.8, 0.5, 3.5);
  p.pCA = p.ca + gauss() * nCA; p.pPA = Math.max(p.pCA, p.pa + gauss() * nPA);
  return p;
}
function sign(p, viaRule) {
  G.club.cash -= p.fee; p.contract = ri(2, 4); p.morale = 72; p.joined = G.season; p.st = newStats();
  if (chance(REGIONS[p.region].adapt * (staff('acad') ? 1 : 1))) { p.settle = false; p.morale = 45; }
  p.scoutStars = p.pCA != null ? stars(p.pCA) : null; (G.signLog = G.signLog || []).push({ pid: p.id, name: p.name, fee: p.fee, wage: p.wage, season: G.season, est: p.scoutStars, rule: !!viaRule });
  G.club.kitty = Math.max(0, (G.club.kitty || 0) - p.fee); G.shortlist = (G.shortlist || []).filter(x => x !== p);
  delete p.pCA; delete p.pPA; G.squad.push(p); G.ss.signings++; G.ss.spent += p.fee; G.dofSigned = p.name;
  G.paper.stories.push({ h: 'Signing', t: `${staffName('dof')} ${viaRule ? 'gets his exception and signs' : 'signs'} ${p.name} (${p.age}, ${POS_L[p.pos]}) from ${REGIONS[p.region].name} ${p.fee ? 'for ' + money(p.fee) : 'on a free'}. Wage ${money(p.wage)}/wk.` });
}
function staffName(r) { const s = staff(r); return s ? s.name : 'Nobody'; }
function protectedIds() {
  const ids = new Set(G.promises.filter(x => x.k === 'keep' && x.status === 'open').map(x => x.pid));
  G.squad.forEach(p => { if (p.noSell) ids.add(p.id); });
  const n = +man('acad', 'minGrads'); G.squad.filter(p => p.academy).sort((a, b) => b.pa - a.pa).slice(0, n).forEach(p => ids.add(p.id));
  return ids;
}
function administration() {
  const t = G.club.tier, tab = G.divs[t] && G.divs[t].tab && G.divs[t].tab[0]; if (tab) tab.pts -= 10;
  const prot = new Set(protectedIds()), sold = [];
  for (const p of G.squad.filter(x => !prot.has(x.id)).sort((a, b) => b.value - a.value).slice(0, 2)) { const fee = Math.round(p.value * 0.6 / 100) * 100; sellPlayer(p, fee, null); sold.push(p.name); }
  if (G.club.cash < M(5000)) { G.club.debt = (G.club.debt || 0) + (M(5000) - G.club.cash); G.club.cash = M(5000); }
  G.board.conf = clamp(Math.min(G.board.conf, 40) - 10, 12, 100); G.st.fans = clamp(G.st.fans - 12, 0, 100);
  G.flags.adminAt = G.season; G.flags.insolvent = 0; G.ss.admin = true;
  for (const r of ['scout', 'acad', 'mkt']) if (G.mand[r]) G.mand[r] = Object.assign({}, G.mand[r], { budget: 10 });
  if (G.paper) G.paper.stories.unshift({ h: 'Club enters administration', t: `Ten points deducted. ${sold.length ? sold.join(' and ') + ' sold to raise cash.' : ''} The administrators keep you on, for now. A second time and you are gone.` });
}
/* Sales only happen while a window is open (B49). Outside it a deal is agreed and completes when the next window opens. */
function agreeSale(p, fee, how, doneMsg) {
  if (window_()) { sellPlayer(p, fee, how); return doneMsg; }
  p.sale = { fee, how, s: G.season }; const next = G.phase === 'season' && G.week < 17 ? 'the winter window opens' : 'the summer window opens';
  return `Agreed. ${p.name} leaves when ${next}. Until then he is still ours.`;
}
function settleSales() { if (!window_()) return; for (const p of G.squad.slice()) { if (!p.sale) continue; const s = p.sale; delete p.sale; sellPlayer(p, s.fee, s.how); } }
function sellPlayer(p, fee, how) {
  if (p.academy && HOOK.acadSale) HOOK.acadSale(p, fee);
  G.squad = G.squad.filter(x => x !== p); G.club.cash += fee; G.ss.sales++; G.ss.earned += fee;
  for (const pr of G.promises) if (pr.k === 'keep' && pr.pid === p.id && pr.status === 'open') { pr.status = 'broken'; G.st.fans = clamp(G.st.fans - 12, 0, 100); G.st.press = clamp(G.st.press - 8, 0, 100); G.board.conf = clamp(G.board.conf - 4, 0, 100); G.paper.stories.push({ h: 'Promise broken', t: `You promised ${p.name} was not for sale. Supporters have not forgotten.` }); }
  G.paper.stories.push({ h: fee ? 'Sale' : 'Release', t: how || `${p.name} leaves ${fee ? 'for ' + money(fee) : 'on a free'}.` });
}
function dofWork() {
  G.dofNote = null; settleSales(); const d = staff('dof'); if (!d || !window_()) return;
  const depth = 20 + Math.round(man('dof', 'depth') / 100 * 6), prot = protectedIds();
  // flagged for sale by the CEO
  const flag = G.squad.find(p => p.sellFlag && !prot.has(p.id)); if (flag && chance(0.6)) { const fee = Math.round(flag.value * (0.55 + rnd() * 0.3) / 100) * 100; flag.sellFlag = false; sellPlayer(flag, fee, `${d.name} sells ${flag.name} for ${money(fee)}, as you asked.`); }
  // trim
  if (G.squad.length > depth + 2) {
    const over = Object.keys(REQ).filter(pos => G.squad.filter(p => p.pos === pos).length > REQ[pos] + 1);
    const cand = G.squad.filter(p => !prot.has(p.id) && over.includes(p.pos) && p.joined < G.season).sort((a, b) => a.ca - b.ca)[0];
    if (cand && chance(0.5)) { const n = G.squad.filter(p => p.pos === cand.pos).length, fee = Math.round(cand.value * (0.45 + rnd() * 0.25) / 100) * 100; sellPlayer(cand, fee, `${d.name} sells ${cand.name} for ${money(fee)}: our ${ordWord(n)} ${POS_L[cand.pos].toLowerCase()}, surplus to needs.`); }
  }
  // incoming bids for our players
  const sellable = G.squad.filter(p => !p.sale && (p.joined < G.season || G.phase !== 'summer' && p.joined < G.season + 1 && G.week > 19));
  if (chance(0.2) && G.squad.length > 16 && sellable.length) {
    const p = pick(sellable); const fee = Math.round(p.value * (0.85 + rnd() * 0.45) / 100) * 100; const top = G.squad.slice().sort((a, b) => b.ca - a.ca).slice(0, 3).includes(p);
    if (top || prot.has(p.id)) queueEvent('bid_star', { pid: p.id, fee, club: pick(G.divs[Math.max(1, G.club.tier - ri(0, 2))].clubs.filter(x => x !== 0)) });
    else if (rnd() < man('dof', 'sell') / 100 * 0.7 + (fee / p.value - 1)) sellPlayer(p, fee, `${d.name} accepts a ${money(fee)} bid for ${p.name}.`);
  }
}
