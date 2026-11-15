/* ---------- season ---------- */
function setObjectives() {
  const d = G.club.dna, exp = expectedRank(); let target;
  if (d.ambition === 'rocket') target = 3; else if (d.ambition === 'steady') target = clamp(exp - 1, 2, 14); else target = clamp(exp + 2, 3, 15);
  if (G.club.tier === 1) target = Math.min(target, 10);
  const o = [{ k: 'league', target, t: `Finish ${ord(target)} or higher` }];
  o.push(d.money === 'debt' ? { k: 'cashmin', target: -M(20000), t: `Keep cash above ${money(-M(20000))}` } : { k: 'cash', target: 0, t: 'Finish the season with cash in the bank' });
  if (d.talent === 'academy') o.push({ k: 'grads', target: 3, t: 'Give three academy players a debut' });
  else if (d.identity === 'community') o.push({ k: 'fans', target: 55, t: 'Keep supporter mood at 55 or higher' });
  else if (d.identity === 'brand') o.push({ k: 'brand', target: Math.min(90, Math.round(G.club.brand + 8)), t: `Grow brand strength to ${Math.min(90, Math.round(G.club.brand + 8))}` });
  else o.push({ k: 'align', target: 70, t: 'Keep DNA alignment at 70 or higher' });
  G.board.obj = o;
}
function objMet(o) { const pos = myPos(); switch (o.k) { case 'league': return pos <= o.target; case 'cash': return G.club.cash >= 0; case 'cashmin': return G.club.cash >= o.target; case 'grads': return G.ss.grads >= o.target; case 'fans': return G.st.fans >= o.target; case 'brand': return G.club.brand >= o.target; case 'align': return alignment() >= o.target; case 'fanbase': return G.club.fanbase >= o.target; case 'wagecap': return wageRatio() * 100 <= +man('fin', 'wageCap'); case 'profit': return G.ss.earned >= G.ss.spent; case 'fill': return (G.ss.attN ? G.ss.attSum / G.ss.attN : 0) >= o.target; case 'topxg': return G.ss.xgf >= G.ss.xga; } if (HOOK.objMet) return HOOK.objMet(o); return false; }
function promiseMet(p) { const pos = myPos(); switch (p.k) { case 'promo': return pos <= 3 && G.club.tier > 1; case 'tophalf': return pos <= 9; case 'youth': return G.ss.grads >= 3; case 'keep': return G.squad.some(x => x.id === p.pid); case 'tickets': return G.ss.maxTicket <= 50; case 'attack': return G.divs[G.club.tier].tab[0].gf >= 50; case 'nodebt': return G.club.cash >= 0; } return false; }

function endSeason() {
  if (G.phase === 'sacked') return G.lastReport || null;
  const t = G.club.tier, pos = myPos(), rep = { season: G.season, tier: t, pos, tierName: TIERS[t], objectives: [], promises: [], moves: [], prize: 0 };
  rep.prize = Math.round((19 - pos) * 900 * sc() / 100) * 100; G.club.cash += rep.prize;
  let bd = 0;
  for (const o of G.board.obj) { const met = objMet(o); rep.objectives.push({ t: o.t, met }); bd += met ? (o.bold ? 7 : 4) : o.k === 'league' ? -(8 + Math.max(0, pos - o.target) * 1.5) * (o.bold ? 1.3 : 1) : o.soft ? -3 : -7; }
  for (const p of G.promises.filter(p => p.season === G.season)) { if (p.status === 'open') p.status = promiseMet(p) ? 'kept' : 'broken'; rep.promises.push({ t: p.t, kept: p.status === 'kept' }); if (p.status === 'kept') { G.st.fans = clamp(G.st.fans + 5, 0, 100); G.st.press = clamp(G.st.press + 4, 0, 100); } else { G.st.fans = clamp(G.st.fans - 8, 0, 100); G.st.press = clamp(G.st.press - 6, 0, 100); bd -= 3; } }
  G.board.conf = clamp(G.board.conf + bd, 0, 100); rep.boardDelta = Math.round(bd);
  if (G.club.cash < 0 && G.club.dna.money !== 'debt') { G.club.deduct = 6; rep.deduct = 6; G.board.conf = clamp(G.board.conf - 6, 0, 100); }
  // promotion/relegation across pyramid
  const up = {}, down = {};
  for (let tt = 1; tt <= 8; tt++) { const tab = sortTable(tt); up[tt] = tt > 1 ? tab.slice(0, 3) : []; down[tt] = tt < 8 ? tab.slice(-3) : []; if (tt === t) rep.table = tab.map(id => ({ id, n: cname(id), ...G.divs[tt].tab[id] })); rep.champions = rep.champions || {}; rep.champions[tt] = cname(tab[0]); }
  for (let tt = 1; tt <= 8; tt++) { for (const id of up[tt]) move(id, tt, tt - 1); for (const id of down[tt]) move(id, tt, tt + 1); }
  function move(id, from, to) { const a = G.divs[from].clubs; a.splice(a.indexOf(id), 1); G.divs[to].clubs.push(id); if (id === 0) { G.club.tier = to; G.clubs[0].tier = to; rep.moves.push(to < from ? 'promoted' : 'relegated'); } else G.clubs[id].tier = to; }
  rep.newTier = G.club.tier;
  if (G.club.tier < t) { G.board.conf = clamp(G.board.conf + 12, 0, 100); G.st.fans = clamp(G.st.fans + 12, 0, 100); G.club.stepUp = G.season + 1; }
  if (G.club.tier > t) { G.board.conf = clamp(G.board.conf - 15, 0, 100); G.st.fans = clamp(G.st.fans - 10, 0, 100); if (G.board.conf < 30 && G.season - (G.board.second || -99) >= 4) { G.board.second = G.season; G.board.conf = 32; rep.second = true; } }
  if (CAPREQ[G.club.tier] && G.club.cap < CAPREQ[G.club.tier]) { const cost = Math.round((CAPREQ[G.club.tier] - G.club.cap) * 12 * sc() / 100) * 100; G.club.cash -= cost; G.club.cap = CAPREQ[G.club.tier]; rep.licence = `Licensing: temporary stands to reach ${CAPREQ[G.club.tier].toLocaleString('en-GB')} seats cost ${money(cost)}.`; }
  for (const id in G.clubs) { const c = G.clubs[id]; if (c.me) continue; c.str += (tierAvg(c.tier) - c.str) * 0.3 + gauss() * 0.45; }
  // players
  rep.leavers = []; rep.renewed = [];
  const med = G.squad.map(p => p.ca).sort((a, b) => a - b)[Math.floor(G.squad.length / 2)] || 0;
  for (const p of G.squad.slice()) {
    p.age++; p.contract--; p.lastSeason = { ...p.st }; p.st = newStats(); p.yc = 0; if (!p.settle && chance(0.7)) { p.settle = true; p.morale = 60; }
    if (p.contract <= 0 && HOOK.summerStart) { p.contract = 0; p.expiring = true; }
    else if (p.contract <= 0) {
      const want = p.ca >= med - 0.3 || (p.age <= 22 && p.pa > p.ca + 1.5);
      const newW = Math.round(Math.max(p.wage, wageFor(p.ca)) * 1.1 / 5) * 5, avgW = playerWages() / G.squad.length;
      if (want && staff('dof') && newW <= avgW * (+man('dof', 'maxWage')) / 100 * 1.1 && !(p.pers.amb > 16 && p.ca > med + 1.5 && chance(0.4))) { p.wage = newW; p.contract = ri(2, 3); rep.renewed.push(p.name); }
      else { G.squad = G.squad.filter(x => x !== p); rep.leavers.push(p.name); }
    }
    if (p.age >= 36 || (p.age >= 33 && chance(0.25))) { if (G.squad.includes(p)) { G.squad = G.squad.filter(x => x !== p); rep.leavers.push(p.name + ' (retires)'); } }
    upd(p);
  }
  // academy
  rep.promoted = [];
  if (HOOK.acadSeason) HOOK.acadSeason(rep); else {
  const thr = tierAvg(G.club.tier) - 1.6 - man('acad', 'pace') / 100 * 1.2;
  for (const p of G.academy.slice()) { p.age++; upd(p); if (p.age >= 17 && (p.ca >= thr || (p.age >= 18 && stars(p.pa) >= 3.5)) && G.squad.length < 28) { G.academy = G.academy.filter(x => x !== p); p.contract = 2; p.wage = Math.round(wageFor(p.ca) * 0.6 / 5) * 5; p.st = newStats(); G.squad.push(p); rep.promoted.push(p.name); } else if (p.age >= 19) G.academy = G.academy.filter(x => x !== p); }
  }
  // staff contracts
  rep.staff = [];
  for (const r of ROLES) { const s = staff(r.id); if (!s) continue; s.contract--; if (s.contract <= 0) { if (s.rel >= 38) { s.contract = ri(1, 3); s.wage = Math.round(s.wage * 1.08 / 5) * 5; rep.staff.push(`${s.name} signs a new contract.`); } else { G.staff[r.id] = null; G.cands[r.id] = genCands(r.id); rep.staff.push(`${s.name} (${r.t}) leaves as his contract expires.`); } } }
  if (HOOK.recSeason) HOOK.recSeason(rep);
  G.lastReport = rep; G.history.push({ season: G.season, tier: t, pos, pts: G.divs[G.club.tier] && rep.table ? rep.table.find(x => x.id === 0).pts : 0 });
  if (G.board.conf <= 0 && HOOK.seasonReprieve && HOOK.seasonReprieve()) { /* one last chance */ }
  else if (G.board.conf <= 0) { sack('The board has lost all confidence after a dismal season.', 'season'); return rep; }
  if (over()) return rep;
  G.phase = 'review';
  return rep;
}
function startSeason() {
  if (over()) return;
  G.season++; G.week = 1; G.ap = 3; G.form = []; G.inbox = G.inbox.filter(m => !m.done).slice(0, 5); G.queue = [];
  G.fin.lastRev = G.ss.rev; G.ss = newSeasonStats(); G.fin.revSum = 0; G.fin.revW = 0; G.club.kitty = kittyFor(G.fin.lastRev);
  if (G.club.dna.money === 'owner' && G.club.ownerOn) G.club.cash += M(15000);
  G.paper = { stories: [] }; let filled = 0;
  while (!HOOK.summerStart && G.squad.length < 18) { const need = squadNeeds(), pos = need.length ? need[0] : weakestPos(); const p = genTarget(pos, true); p.fee = 0; sign(p); filled++; }
  const fillStories = G.paper.stories;
  buildFixtures(); setObjectives(); snapStart(); G.pressDone = false; if (HOOK.summerStart) HOOK.summerStart(); else setupPreseason();
  G.paper = { headline: `Season ${G.season} begins`, sub: `${G.club.name} start life in the ${TIERS[G.club.tier]}.${filled ? ` ${filled} free agents were signed over the summer to fill a threadbare squad.` : ''}`, stories: fillStories };
}
const newSeasonStats = () => ({ grads: 0, signings: 0, sales: 0, spent: 0, earned: 0, rev: 0, exp: 0, maxTicket: 0, lg: 0, xgf: 0, xga: 0, attSum: 0, attN: 0, start: null });

