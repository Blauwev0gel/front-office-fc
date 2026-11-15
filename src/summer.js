/* The Front Office · the transfer summer, module 4 part 1
   Five steps between seasons: clear-out, board and budget, market, pre-season, deadline day. Plugs into engine hooks. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, S = () => g().sum;
const { ri, pick, chance, clamp, gauss, money, M, staff, man, tierAvg, wageFor } = F;
const sq = () => g().squad, N = r => F.staffName(r);
const ROUNDS = ['Early summer', 'Midsummer', 'Late summer'];

/* ---------- start & finish ---------- */
H.summerStart = () => {
  if (g().phase === 'sacked') return;
  F.setupPreseason();
  const G = g(); G.phase = 'summer';
  G.sum = { step: 0, round: 0, feed: [], log: [], fr: null, dd: null, contracts: {} };
  for (const p of sq()) if (p.expiring) G.sum.contracts[p.id] = { advice: advise(p), demand: demand(p), choice: null };
  sellSuggest();
};
function finishSummer() {
  const G = g();
  for (const p of sq().filter(p => p.expiring)) decide(p.id, null);
  let filled = 0;
  while (G.squad.length < 18) { const need = F.squadNeeds(), pos = need.length ? need[0] : F.weakestPos(); const p = F.genTarget(pos, true); p.fee = 0; F.sign(p); filled++; }
  if (filled) G.paper.stories.push({ h: 'Emergency signings', t: `${filled} free agents signed at the last minute to make up the numbers.` });
  const msgs = G.inbox.filter(m => m.sum && !m.done); for (const m of msgs) F.resolve(m, F.autoIndex(m), F.staffName(F.EV[m.ev].from) || 'The club office');
  G.inbox = G.inbox.filter(m => !m.sum);
  const s = S(); G.lastSummer = { season: G.season, in: s.log.filter(l => l.k === 'in'), out: s.log.filter(l => l.k === 'out'), renewed: s.log.filter(l => l.k === 'renew').length, released: s.log.filter(l => l.k === 'release').length };
  G.paper.headline = `Summer verdict: ${G.lastSummer.in.length} in, ${G.lastSummer.out.length} out`;
  F.finishPreseason();
}

/* ---------- step 1: contracts & squad planner ---------- */
const median = () => { const a = sq().map(p => p.ca).sort((x, y) => x - y); return a[Math.floor(a.length / 2)] || 0; };
function advise(p) { const med = median(); return (p.ca >= med - 0.3 || (p.age <= 22 && p.pa > p.ca + 1.5)) && p.age <= 33 ? 'renew' : 'release'; }
function demand(p) { const med = median(), base = Math.max(p.wage, wageFor(p.ca)) * 1.1; const greedy = (p.pers.amb > 15 && p.ca > med + 1) || (p.talkLater && chance(0.5)); return { wage: Math.round(base * (greedy ? 1.35 : 1) * (0.95 + F.rnd() * 0.15) / 5) * 5, years: p.age >= 31 ? 1 : ri(2, 3), refuse: greedy && p.pers.loy < 8 && chance(0.5) }; }
function decide(id, choice) {
  const G = g(), p = sq().find(x => x.id === id), c = S().contracts[id]; if (!p || !c) return null;
  const ch = choice || c.choice || c.advice;
  if (ch === 'renew') {
    if (c.demand.refuse) { G.squad = G.squad.filter(x => x !== p); S().log.push({ k: 'out', name: p.name, t: `${p.name} turns down a new deal and leaves on a free.` }); delete p.expiring; return `${p.name} refuses to sign. He leaves on a free.`; }
    p.wage = c.demand.wage; p.contract = c.demand.years; delete p.expiring; S().log.push({ k: 'renew', name: p.name }); return `${p.name} signs for ${p.contract} year${p.contract > 1 ? 's' : ''} at ${money(p.wage)}/wk.`;
  }
  G.squad = G.squad.filter(x => x !== p); delete p.expiring; S().log.push({ k: 'release', name: p.name, t: `${p.name} is released.` }); G.paper.stories.push({ h: 'Released', t: `${p.name} leaves as his contract expires.` }); return `${p.name} is released.`;
}
F.sumContract = (id, ch) => { const c = S().contracts[id]; if (!c) return; c.choice = ch; c.out = decide(id, ch); };
function sellSuggest() {
  const s = S(), prot = F.protectedIds(), out = [];
  for (const pos in F.REQ) { const ps = sq().filter(p => p.pos === pos && !p.expiring).sort((a, b) => b.ca - a.ca); if (ps.length > F.REQ[pos] + 1) out.push(ps[ps.length - 1]); }
  for (const p of sq()) if (!p.expiring && p.age >= 31 && p.wage > F.playerWages() / sq().length * 1.4 && !out.includes(p)) out.push(p);
  s.sell = out.filter(p => !prot.has(p.id)).slice(0, 4).map(p => p.id);
}

F.sumPlanner = () => {
  const rows = [];
  for (const pos in F.REQ) {
    const ps = sq().filter(p => p.pos === pos && !(p.expiring && S().contracts[p.id] && (S().contracts[p.id].choice || S().contracts[p.id].advice) === 'release')).sort((a, b) => b.ca - a.ca);
    const best = ps[0], old = ps.filter(p => p.age >= 31).length, exp = ps.filter(p => p.expiring).length;
    const status = ps.length < F.REQ[pos] ? 'need' : best && F.stars(best.ca) <= 2 ? 'weak' : old && old >= Math.ceil(ps.length / 2) ? 'ageing' : ps.length === F.REQ[pos] ? 'thin' : 'ok';
    rows.push({ pos, n: ps.length, req: F.REQ[pos], best: best ? F.stars(best.ca) : 0, age: ps.length ? Math.round(ps.reduce((a, p) => a + p.age, 0) / ps.length) : 0, exp, status });
  }
  return rows;
};

/* ---------- step 3: market rounds ---------- */
function snap() { const r = g().rec; return { pipe: Object.fromEntries((r ? r.pipe : []).map(x => [x.pid, x.stage])), ids: new Map(sq().map(p => [p.id, p.name])), stories: g().paper.stories.length }; }
function diff(a) {
  const r = g().rec, out = [];
  for (const x of r.pipe) {
    const was = a.pipe[x.pid], p = r.pool[x.pid] || sq().find(q => q.id === x.pid); if (!p || was === x.stage) continue;
    const k = r.know[x.pid];
    if (x.stage === 'recommended') out.push({ k: 'rec', t: `Scouts rate ${p.name} (${p.pos}) grade ${k ? k.grade : '?'}`, pid: x.pid });
    else if (x.stage === 'negotiating') out.push({ k: 'talk', t: `Talks open for ${p.name}`, pid: x.pid });
    else if (x.stage === 'approach') out.push({ k: 'talk', t: `${p.name} needs your approval`, pid: x.pid });
    else if (x.stage === 'signed') { out.push({ k: 'in', t: `SIGNED: ${p.name}, ${x.deal && x.deal.fee ? money(x.deal.fee) : 'free'}`, pid: x.pid }); S().log.push({ k: 'in', name: p.name, pos: p.pos }); }
    else if (x.stage === 'lost' && was && was !== 'scouted') out.push({ k: 'lost', t: `Off: ${p.name}. ${(x.log.slice(-1)[0] || '').split('.')[0]}`, pid: x.pid });
  }
  for (const [id, name] of a.ids) if (!sq().some(p => p.id === id)) { const st = g().paper.stories.slice(a.stories).find(s => s.t.includes(name)); const t = st ? st.t : `${name} has left the club.`; if (!out.some(o => o.t === t)) { out.push({ k: 'out', t }); S().log.push({ k: 'out', t }); } }
  return out;
}
function drainQueue(dd) {
  const G = g(), q = G.queue.splice(0); const ids = [];
  for (const it of q) { if (F.addMsg(it.id, it.ctx)) { G.inbox[0].sum = true; ids.push(G.inbox[0].id); } }
  return ids;
}
F.sumDiff = diff;
F.sumPending = () => g().inbox.filter(m => m.sum && !m.done);
F.sumAnswer = (mid, idx) => { const m = g().inbox.find(x => x.id === mid); if (!m || m.done) return; m.out = F.resolve(m, idx, 'you'); };
F.sumRound = () => {
  const s = S(); if (s.round >= ROUNDS.length) return;
  for (const m of F.sumPending()) F.resolve(m, F.autoIndex(m), F.staffName(F.EV[m.ev].from) || 'The club office');
  const a = snap();
  for (let i = 0; i < 2; i++) { if (H.recWeekly) H.recWeekly(); F.dofWork(); }
  const lines = diff(a); drainQueue();
  s.feed.unshift({ round: s.round, lines: lines.length ? lines : [{ k: 'quiet', t: 'A quiet spell. The scouts keep watching.' }] });
  s.round++;
};

/* ---------- step 4: pre-season friendlies ---------- */
function oppOf(t) { const ids = g().divs[clamp(t, 1, 8)].clubs.filter(x => x !== 0); return pick(ids); }
F.sumFriendlies = () => {
  const s = S(); if (s.fr) return s.fr; const t = g().club.tier, me = F.teamStrength();
  const opps = [oppOf(t + 1), oppOf(t), oppOf(t - 1)].map(id => id == null ? oppOf(t) : id);
  const newIds = new Set(sq().filter(p => p.joined === g().season).map(p => p.id));
  s.fr = opps.map((id, i) => {
    const them = g().clubs[id].str + (i === 2 ? 0.3 : 0), d = (me - them) * 0.35;
    const ug = Math.max(0, Math.round(1.3 + d + gauss() * 1.1)), tg = Math.max(0, Math.round(1.1 - d + gauss() * 1.1));
    const res = ug > tg ? 'W' : ug < tg ? 'L' : 'D';
    const star = pick(sq().filter(p => p.pos !== 'GK' && (newIds.has(p.id) || chance(0.4))) || sq());
    for (const p of sq()) { if (!p.settle && chance(0.35)) { p.settle = true; p.morale = 62; } p.morale = clamp(p.morale + (res === 'W' ? 2 : res === 'L' ? -1 : 0), 0, 100); }
    return { opp: F.cname(id), tier: g().clubs[id].tier, ug, tg, res, note: star ? (ug > 0 ? `${star.name}${newIds.has(star.id) ? ', a new signing,' : ''} catches the eye.` : `${star.name} works hard in a quiet game.`) : '' };
  });
  const w = s.fr.filter(f => f.res === 'W').length; g().preEdge = w * 0.04;
  return s.fr;
};

/* ---------- step 5: deadline day ---------- */
const HOURS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00', '22:30', '23:00'];
F.DD_HOURS = HOURS;
F.ddStart = () => { const s = S(); if (!s.dd) s.dd = { t: -1, feed: [{ h: '08:00', t: `The window shuts at 23:00. ${N('dof')} is at his desk with ${F.transferBudget() ? money(F.transferBudget()) : 'no money'} to spend.` }], dec: null, bids: 0, late: 0, run: true, done: false, n: 0 }; else s.dd.run = true; };
const ddLine = (t, k) => S().dd.feed.unshift({ h: HOURS[Math.max(0, S().dd.t)], t, k });
F.ddTick = () => {
  const s = S(), d = s.dd; if (!d || d.done || d.dec) return;
  d.t++;
  if (d.t >= HOURS.length - 1) return ddClose();
  const a = snap(); F.recDeal(); const lines = diff(a); lines.forEach(l => ddLine(l.t, l.k));
  const q = drainQueue(); if (q.length) { d.dec = { type: 'msg', mid: q[0], id: ++d.n }; for (const mid of q.slice(1)) { const m = g().inbox.find(x => x.id === mid); if (m) F.resolve(m, F.autoIndex(m), N(F.EV[m.ev].from)); } return; }
  const prot = F.protectedIds(), top = sq().slice().sort((x, y) => y.ca - x.ca).slice(0, 8).filter(p => !prot.has(p.id) && !p.expiring && p.joined < g().season);
  if (d.bids < 2 && top.length && chance(0.24) && sq().length > 17) { const p = pick(top), fee = Math.round(p.value * (1.0 + F.rnd() * 0.5) / 100) * 100, club = oppOf(Math.max(1, g().club.tier - ri(0, 2))); d.bids++; d.dec = { type: 'bid', pid: p.id, fee, club, id: ++d.n }; if (!ddCase(d.dec)) { d.dec.del = 1; F.ddDecide(-1); } return; }
  const need = F.squadNeeds().length || sq().length < 19 || s.log.some(l => l.k === 'out' && d.feed.some(f => f.t === l.t));
  if (d.late < 1 && (need || chance(0.25)) && d.t >= 3) { const p = F.recLate(); if (p) { d.late++; const fee = p.club ? Math.round(p.ask * 1.15 / 100) * 100 : 0; d.dec = { type: 'late', pid: p.id, fee, wage: Math.round(p.wageAsk * 1.05 / 5) * 5, id: ++d.n }; if (!ddCase(d.dec)) { d.dec.del = 1; F.ddDecide(-1); } return; } }
  if (chance(0.55)) { const r = g().rec, ps = r ? Object.values(r.pool).filter(p => p.club && Math.abs(p.inTier - g().club.tier) <= 1 && !r.pipe.some(x => x.pid === p.id && !['lost', 'signed'].includes(x.stage))) : []; if (ps.length) { const p = pick(ps), to = oppOf(Math.max(1, p.inTier - ri(0, 1))); if (to && to !== p.club) { ddLine(`Elsewhere: ${p.name} moves from ${F.cname(p.club)} to ${F.cname(to)}.`, 'else'); p.club = to; p.ask = Math.round(p.ask * 1.1 / 100) * 100; } } }
  else ddLine(pick(['Phones ringing at the training ground. Nothing concrete yet.', 'An agent calls about a player we never asked for. Ignored.', 'Reporters gather outside the club offices.', `${N('dof')} grabs a sandwich between calls.`]), 'quiet');
};
const ddDesc = dec => {
  if (!dec) return null; const r = g().rec;
  if (dec.type === 'bid') { const p = sq().find(x => x.id === dec.pid); if (!p) return null; return { title: `${F.cname(dec.club)} bid ${money(dec.fee)} for ${p.name}`, body: `${p.name} (${p.age}, ${F.POS_L[p.pos]}) is one of our better players, valued around ${money(p.value)}. There are hours left to replace him.`, opts: [{ l: 'Accept', h: `+${money(dec.fee)}` }, { l: 'Reject', h: 'He stays' }, { l: 'Ask for 20% more', h: 'They may walk away' }] }; }
  if (dec.type === 'late') { const p = r.pool[dec.pid], k = r.know[dec.pid]; if (!p) return null; return { title: `${N('dof')} wants a late move for ${p.name}`, body: `${p.name} (${p.age}, ${F.POS_L[p.pos]}, ${F.REGIONS[p.region].name}): ${F.recBand(k)} now, grade ${k.grade}, confidence ${k.conf}. ${p.club ? `${F.cname(p.club)} want ${money(dec.fee)}, a deadline premium.` : 'Free agent.'} Wages ${money(dec.wage)}/wk.`, opts: [{ l: 'Approve the deal', h: dec.fee ? `−${money(dec.fee)}` : 'No fee' }, { l: 'Not today', h: '' }] }; }
  if (dec.type === 'msg') { const m = g().inbox.find(x => x.id === dec.mid); if (!m) return null; const v = F.msgView(m); return { title: v.title, body: v.body, opts: v.opts }; }
};
// the CEO only sees an exception: a limit is touched. The case says which limit, why, what else was tried, and what each answer likely means.
function ddCase(dec) {
  const G = g(), r = G.rec;
  if (dec.type === 'bid') {
    const p = sq().find(x => x.id === dec.pid); if (!p) return null;
    const top3 = sq().slice().sort((x, y) => y.ca - x.ca).slice(0, 3).some(x => x.id === p.id);
    if (!top3) return null;
    const cover = sq().filter(x => x.pos === p.pos && x.id !== p.id).length;
    return { limit: 'Our three best players are only sold with your approval.', why: dec.fee >= p.value * 1.3 ? `${N('dof')} wants to sell: the fee is well above his valuation.` : `${N('dof')} would rather keep him: the fee is not much above his valuation.`, alt: cover >= 2 ? `There are ${cover} other ${F.POS_L[p.pos].toLowerCase()}s in the squad.` : `There is little cover in his position, and few hours left to replace him.`, effect: 'Selling brings money and a gap in the team. Refusing keeps the team intact; an ambitious player may sulk.' };
  }
  if (dec.type === 'late') {
    const p = r.pool[dec.pid]; if (!p) return null; const budget = F.transferBudget(), mf = man('dof', 'maxFee'), lim = mf === '0' ? 0 : budget * (+mf) / 100;
    const over = dec.fee > lim || dec.fee > budget; if (!over) return null;
    return { limit: mf === '0' ? 'Your mandate allows free agents only.' : `The fee is above his limit of ${money(lim)} per signing.`, why: `${N('dof')} thinks ${p.name} fills a real need at the last minute.`, alt: 'He checked free agents and loans first; nothing comparable is left this late.', effect: 'Approving spends beyond the mandate this once. Refusing keeps the limit and the gap.' };
  }
  return null;
}
F.ddCase = dec => ddCase(dec || (S().dd && S().dd.dec));
F.ddDecision = () => { const d = S().dd; return d && d.dec ? { ...ddDesc(d.dec), id: d.dec.id, type: d.dec.type } : null; };
F.ddDecide = idx => {
  const d = S().dd, dec = d && d.dec; if (!dec) return; const auto = idx < 0; let out = '';
  if (!ddDesc(dec)) { d.dec = null; return; }
  if (dec.type === 'bid') {
    const p = sq().find(x => x.id === dec.pid);
    if (auto) idx = dec.fee >= p.value * 1.45 && man('dof', 'sell') >= 40 ? 0 : 1;
    if (idx === 2) { if (chance(0.5)) { dec.fee = Math.round(dec.fee * 1.2 / 100) * 100; idx = 0; out = 'They agree to the higher fee. '; } else { out = `${F.cname(dec.club)} walk away.`; idx = -9; } }
    if (idx === 0) { F.sellPlayer(p, dec.fee, `${p.name} leaves for ${F.cname(dec.club)} on deadline day for ${money(dec.fee)}.`); S().log.push({ k: 'out', t: `${p.name} sold to ${F.cname(dec.club)} for ${money(dec.fee)}.` }); out += `${p.name} is sold for ${money(dec.fee)}.`; }
    else if (idx === 1) { out = `Bid rejected. ${p.name} stays.`; if (p.pers.amb > 15) p.morale = clamp(p.morale - 10, 0, 100); }
  } else if (dec.type === 'late') {
    const r = g().rec, k = r.know[dec.pid]; if (auto) idx = k && k.grade === 'A' ? 0 : 1;
    if (idx === 0) { const p = r.pool[dec.pid]; if (F.recForceSign(dec.pid, dec.fee, dec.wage)) { S().log.push({ k: 'in', name: p.name, pos: p.pos }); out = `${p.name} signs on deadline day${dec.fee ? ' for ' + money(dec.fee) : ''}.`; } }
    else out = 'The DoF lets it go.';
  } else { const m = g().inbox.find(x => x.id === dec.mid); if (m && !m.done) out = F.resolve(m, auto ? F.autoIndex(m) : idx, auto ? N(F.EV[m.ev].from) : 'you'); }
  ddLine((auto ? (dec.del ? `Within his mandate, ${N('dof')} decides: ` : `No answer from the CEO. ${N('dof')} decides: `) : '') + out, 'dec'); d.dec = null;
};
function ddClose() {
  const d = S().dd, r = g().rec; d.t = HOURS.length - 1; d.done = true; d.run = false;
  for (const x of (r ? r.pipe : []).filter(x => x.stage === 'negotiating' || x.stage === 'approach')) { const p = r.pool[x.pid]; if (p && x.deal && x.deal.offer >= x.deal.floor * 0.92 && x.deal.offer <= x.deal.cap && F.recSlotOpen(p, g().rec.know[x.pid])) { F.recForceSign(x.pid, x.deal.offer, Math.min(x.deal.wageAsk, Math.round(F.recWageLimit() * 1.05)), `Done minutes before the deadline at ${money(x.deal.offer)}.`); S().log.push({ k: 'in', name: p.name, pos: p.pos }); ddLine(`${p.name} signs with minutes to spare.`, 'in'); } else { x.stage = 'lost'; x.log.push('Ran out of time at the deadline.'); if (p) ddLine(`Out of time: no deal for ${p.name}.`, 'lost'); } }
  const s = S(), ins = s.log.filter(l => l.k === 'in').length, outs = s.log.filter(l => l.k === 'out').length;
  ddLine(`The window is shut. Summer business: ${ins} in, ${outs} out. Squad: ${sq().length} players.`, 'end');
}
F.ddSkip = () => { const d = S().dd; if (!d) F.ddStart(); let guard = 0; while (!S().dd.done && guard++ < 60) { if (S().dd.dec) F.ddDecide(-1); else F.ddTick(); } };

/* ---------- steps ---------- */
F.sumView = () => { const s = S(); return { s, step: s.step, contracts: sq().filter(p => p.expiring || s.contracts[p.id]).map(p => ({ p, c: s.contracts[p.id] })).filter(o => o.c), sell: (s.sell || []).map(id => sq().find(p => p.id === id)).filter(Boolean) }; };
F.sumStep = i => { const s = S(); if (i > s.step + 1) return; s.step = i; if (i === 3) F.sumFriendlies(); };
F.sumFinish = finishSummer;

/* test helper: plays a whole summer with random choices */
F.sumAuto = (rand, lazy) => {
  const r = rand || F.rnd, s = S(); const p = a => a[Math.floor(r() * a.length)];
  for (const o of F.sumView().contracts) if (!lazy) F.sumContract(o.p.id, r() < 0.5 ? 'renew' : o.c.advice);
  F.sumStep(1); if (!g().pre.deal) F.preSetTarget(p(['safe', 'accept', 'bold']));
  F.sumStep(2); while (s.round < ROUNDS.length) { for (const m of F.sumPending()) if (!lazy && r() < 0.7) F.sumAnswer(m.id, Math.floor(r() * F.msgView(m).opts.length)); F.sumRound(); }
  F.sumStep(3); const fo = F.FOCUS.filter(f => !g().board.obj.some(o => o.k === f.k)); while (g().pre.focus.length < 2 && fo.length) F.preToggleFocus(fo.splice(Math.floor(r() * fo.length), 1)[0].k);
  if (g().meeting) g().meeting.items.forEach((it, i) => F.decideProposal(i, r() < 0.5 ? 'approve' : 'reject'));
  F.sumStep(4); F.ddStart(); let guard = 0; while (!s.dd.done && guard++ < 80) { if (s.dd.dec) F.ddDecide(lazy ? -1 : Math.floor(r() * (F.ddDecision() || { opts: [1] }).opts.length)); else F.ddTick(); }
  finishSummer();
};

/* migrate: a save sitting in the old pre-season keeps working */
H.sumMigrate = () => {};
})(FO);
