// The executive-to-transfer lifecycle on the real recruitment pipeline: authority (budget + purpose-bound exceptions),
// commitments (bids on the table) and settlement (cash at signing, checked again then). No faked signings.
const vm = require('vm'), R = require('./src.js');
const src = R.mods('matchday.js').map(f => R(f)).join('\n');
let fails = 0; const ok = (c, msg) => { console.log((c ? 'ok   ' : 'FAIL ') + msg); if (!c) fails++; };
function game(seed) { const c = { console }; vm.createContext(c); vm.runInContext(src + ';this.FO=FO;', c); const F = c.FO; for (const k in F.PARK) F.PARK[k] = false; /* these tests cover parked systems (B66) */ F.newGame(seed); const d = {}; for (const q of F.DNA) d[q.k] = q.o[0].v; F.setDNA(d, 'T', 'T', 'T', ['#123', '#fff']); for (const r of F.ROLES) F.hire(r.id, 1); F.finishStaff(); F.finishMandates(); F.preSetTarget('accept'); F.finishPreseason(); for (const id of F.G.press) F.pressAnswer(id, 1); F.finishPress(); return F; }
const answerOthers = F => { for (const m of F.G.inbox.filter(m => !m.done && !/^(ini_|rec_)/.test(m.ev))) F.respond(m.id, 0); };
const answerRec = (F, idx = 0) => { for (const m of F.G.inbox.filter(m => !m.done && /^rec_(approve|raise)/.test(m.ev))) F.respond(m.id, idx); };
// to the winter window (week 16), with money in the bank and an open mandate, so a deal is possible
function toWindow(seed, cash = 400000) { const F = game(seed); /* the opening weeks of the season: the summer window is still open */ F.G.club.cash = cash; const m = F.G.mand.dof; m.maxFee = '100'; m.approve = '999'; m.maxAge = '35'; m.maxWage = '999'; F.G.mand.fin.wageCap = '85'; F.G.rec.pipe = []; return F; }
// a real candidate in the market, scouted and recommended by the DoF's own pipeline stages
function candidate(F, pos, ask) { const G = F.G, best = Math.max(...G.squad.filter(p => p.pos === pos).map(p => p.ca), 5), p = F.genPlayer({ pos, age: 26, ca: best + 1.5, region: 'dom' });
  p.id = F.uid(); p.club = G.divs[G.club.tier].clubs.find(x => x !== 0); p.ask = ask; p.value = ask; p.wageAsk = 60; p.inTier = G.club.tier; p.region = 'dom';
  G.rec.pool[p.id] = p; G.rec.know[p.id] = { grade: 'A', conf: 'high', est: p.ca, pest: p.pa, sd: 0.3, psd: 0.3, n: 3, by: 'Scout', byId: 0, attr: {} }; G.rec.pipe.push({ pid: p.id, stage: 'recommended', since: F.absWeek(), log: [] }); return p; }
const pipe = (F, p) => F.G.rec.pipe.find(x => x.pid === p.id);
function weak(F) { for (let i = 0; i < 4; i++) F.G.ft.games.push({ r: 'L', ug: 0, tg: 3, ux: 0.8, tx: 2.1, o: 'X', h: 1 }); F.G.talks = {}; }
function planWithReserve(F) { weak(F); F.convoOpen('dof'); F.convoAnswer('t_form'); const v = F.convoView('dof'); const id = v.opts.some(o => o.id === 'i_plan_r') ? 'i_plan_r' : 'i_plan'; F.convoAnswer(id); if (F.convoView('dof') && F.convoView('dof').opts.some(o => o.id === 'i_order')) F.convoAnswer('i_order'); F.convoClose(); return (F.G.agr || []).find(a => a.kind === 'plan' && !a.res); }
function runWeeks(F, n, stop) { for (let w = 0; w < n && F.G.phase === 'season'; w++) { answerOthers(F); answerRec(F); F.endWeek(); answerRec(F); if (stop && stop()) return; } }

// A + F: a CEO exception for one position is used for a real signing at that position; then it is released
{ const F = toWindow(901); const seenA = watch(F); const a = planWithReserve(F); ok(a && a.funds > 0, `the CEO exposes ${a && a.funds} of the reserve for the ${a && a.pos}`);
  const tb = F.transferBudget(), p = candidate(F, a.pos, Math.round((tb + a.funds * 0.7) / 100) * 100), cash0 = F.G.club.cash, n0 = F.G.squad.length;
  ok(F.recExtraAuth(p) > 0, 'the DoF may use it for a player in that position');
  runWeeks(F, 3, () => pipe(F, p).stage === 'signed' || pipe(F, p).stage === 'lost');
  const x = pipe(F, p), signed = F.G.squad.find(q => q.id === p.id);
  ok(x.stage === 'signed' && !!signed, `the DoF signs him through the real pipeline (${x.stage}: ${x.log.slice(-1)[0]})`);
  if (signed) { ok(signed.fee > 0 && F.G.club.cash <= cash0 - signed.fee + 1, `settlement: the fee leaves the bank once (${signed.fee})`);
    ok((a.used || 0) > 0 || signed.fee <= tb, `the part above the ordinary budget is drawn from the exception (${a.used || 0} of ${a.funds})`);
    ok(seenA.every(x => x.fee <= x.tb + x.ex + 100), `at signing: ${seenA.map(x => `fee ${x.fee} ≤ budget ${x.tb} + exception ${x.ex}`).join('; ')}`);
    runWeeks(F, 1); ok(a.done && F.agrAuthFor(a.pos) === 0, 'once he has signed, the unused exception is released'); } }

// B: an unrelated transfer cannot touch the money released for another position
{ const F = toWindow(902); const a = planWithReserve(F); const other = ['ST', 'W', 'AM', 'CM'].find(x => x !== a.pos), tb = F.transferBudget();
  const s = candidate(F, other, Math.round((tb + a.funds * 0.7) / 100) * 100);
  ok(F.recExtraAuth(s) === 0, `a ${other} gets none of the ${a.pos} exception`);
  runWeeks(F, 3, () => ['signed', 'lost'].includes(pipe(F, s).stage)); const x = pipe(F, s), signed = F.G.squad.find(q => q.id === s.id);
  ok(!signed || signed.fee <= tb, `the ${other} is not bought with that money (${x.stage}${x.blocked ? ': ' + x.blocked.join(', ') : ''})`);
  ok(F.agrAuthFor(a.pos) === a.funds - (a.used || 0) && !(a.used > 0), 'and the exception is still intact for its purpose'); }

// C: an investigation grants nothing; the recommendation asks the money question with today's figures
{ const F = toWindow(903); weak(F); F.convoOpen('dof'); F.convoAnswer('t_form'); F.convoAnswer('i_joint'); F.convoClose();
  ok(F.agrAuth() === 0 && !F.agrPrios().length, 'commissioning a joint review authorises no money and no priority');
  let m = null; for (let w = 0; w < 4 && !m; w++) { answerOthers(F); F.endWeek(); m = F.G.inbox.find(x => x.ev === 'ini_joint' && !x.done); }
  ok(!!m && !('funds' in m.ctx), 'the recommendation returns without a money offer locked in');
  if (m) { const v = F.msgView(m); ok(v.opts.length === 4 && /budget/.test(v.opts[1].l) && /reserve/.test(v.opts[2].l), 'within budget and reserve exposure are separate, explicit choices');
    F.respond(m.id, 1); const a = (F.G.agr || []).find(x => x.kind === 'plan' && !x.res); ok(a && !a.funds && F.agrAuth() === 0, 'accepting it within budget exposes no reserve'); } }
// C2: finances worsen during the investigation: the offer is priced on the day of the decision
{ const F = toWindow(904); weak(F); F.convoOpen('dof'); F.convoAnswer('t_form'); const early = (F.convoView('dof').opts.find(o => o.id === 'i_plan_r') || {}).t; F.convoAnswer('i_joint'); F.convoClose();
  let m = null; for (let w = 0; w < 4 && !m; w++) { answerOthers(F); F.endWeek(); m = F.G.inbox.find(x => x.ev === 'ini_joint' && !x.done); }
  F.G.club.cash = Math.round(F.G.club.cash * 0.35); const head = F.G.club.cash - F.transferBudget(); if (m) { F.respond(m.id, 2); const a = (F.G.agr || []).find(x => x.kind === 'plan' && !x.res);
    ok(a && (a.funds || 0) <= Math.max(0, head) * 0.4 + 100, `the reserve offer is recomputed from today's cash, not the old offer (${early ? early + ' earlier, ' : ''}now ${a && a.funds}, cash above budget ${head})`); } }
// C3: ignoring the recommendation changes nothing
{ const F = toWindow(905); weak(F); F.convoOpen('dof'); F.convoAnswer('t_form'); F.convoAnswer('i_joint'); F.convoClose(); let m = null;
  for (let w = 0; w < 4 && !m; w++) { answerOthers(F); F.endWeek(); m = F.G.inbox.find(x => x.ev === 'ini_joint' && !x.done); } answerOthers(F); F.endWeek();
  ok(!(F.G.agr || []).some(a => a.kind !== 'joint' && !a.res) && F.agrAuth() === 0, 'left unanswered: no plan, no money'); }

// D: talks open when the money is there; cash falls before he signs: the next round and the final check follow today's money
{ const F = toWindow(906); F.G.mand.dof.hard = 100; const seen = watch(F); const a0 = planWithReserve(F), tb = F.transferBudget(), p = candidate(F, a0.pos, Math.round(tb * 0.9 / 100) * 100);
  F.recDeal(); const x = pipe(F, p); ok(x.stage === 'negotiating' && x.deal && x.deal.cap >= p.ask * 0.9, `talks open with a ceiling of ${x.deal && x.deal.cap} (stage ${x.stage})`);
  if (x.stage === 'negotiating') { const cap0 = x.deal.cap; F.G.club.cash = Math.round(p.ask * 0.3); F.recDeal(); F.recDeal();
    const signed = F.G.squad.find(q => q.id === p.id); ok(!signed && (x.stage === 'lost' || x.deal.cap < cap0), `cash falls to ${F.G.club.cash}: the old ceiling of ${cap0} no longer counts (${x.stage}: ${x.log.slice(-1)[0]}; ${x.deal.rounds.slice(-1)[0] || ''})`);
    ok(F.G.club.cash >= 0 && seen.every(y => y.fee <= y.cash), 'nothing is signed beyond the money in the bank'); } }

// every settlement is checked at the moment it happens: fee within the budget Finance sets then, plus the exception for that player or position
function watch(F) { const seen = []; const orig = F.sign; F.sign = p => { seen.push({ name: p.name, pos: p.pos, fee: p.fee, tb: F.transferBudget(), ex: F.recExtraAuth(p), cash: F.G.club.cash }); return orig(p); }; return seen; }
// E: two negotiations cannot both spend money that exists once
{ const F = toWindow(907, 120000); const seen = watch(F); const a0 = planWithReserve(F), own = (F.squadPlanView().winter.rows.find(r => r.pos !== a0.pos) || {}).pos || 'CM', tb = F.transferBudget(), ask = Math.round(tb * 0.75 / 100) * 100, p1 = candidate(F, a0.pos, ask), p2 = candidate(F, own, ask), cash0 = F.G.club.cash;
  runWeeks(F, 4, () => [p1, p2].every(p => ['signed', 'lost'].includes(pipe(F, p).stage))); const fees = [p1, p2].map(p => (F.G.squad.find(q => q.id === p.id) || {}).fee || 0);
  ok(seen.length >= 1 && seen.every(x => x.fee <= x.tb + x.ex + 100 && x.fee <= x.cash), `each signing fits the money at that moment: ${seen.map(x => `${x.pos} ${x.fee} ≤ ${x.tb} budget + ${x.ex} exception (cash ${Math.round(x.cash)})`).join('; ')}`);
  ok(F.G.club.cash >= 0 && (a0.used || 0) <= (a0.funds || 0), `the bank stays positive and the exception is not overdrawn (${a0.used || 0} of ${a0.funds})`);
  ok(!fees[1] || F.recExtraAuth(p2) === 0, `the second deal (${own}) never had access to the ${a0.pos} exception`); }

// G: save during a negotiation with an exception, reload, carry on: the same rules apply
{ const F = toWindow(908); const a = planWithReserve(F); const tb = F.transferBudget(), p = candidate(F, a.pos, Math.round((tb + a.funds * 0.6) / 100) * 100); runWeeks(F, 1);
  const s = F.save(); F.load(s); const a2 = F.G.agr.find(x => x.id === a.id);
  ok(a2 && a2.funds === a.funds && a2.owner === 'dof' && F.agrAuthFor(a.pos) === F.agrAuthFor(a2.pos), 'after reloading: the same owner, purpose and remaining exception');
  runWeeks(F, 3, () => ['signed', 'lost'].includes(pipe(F, p).stage)); ok(F.G.club.cash >= 0, `and the deal continues within the money (${pipe(F, p).stage})`); }

// H: ordinary recruitment without any CEO initiative still works (a position from the DoF's own winter plan)
{ const F = toWindow(909); const own = F.squadNeeds()[0] || 'CB', tb = F.transferBudget(), p = candidate(F, own, Math.round(tb * 0.6 / 100) * 100), cash0 = F.G.club.cash;
  runWeeks(F, 3, () => ['signed', 'lost'].includes(pipe(F, p).stage)); const signed = F.G.squad.find(q => q.id === p.id);
  ok(!!signed && F.recExtraAuth(p) === 0 && signed.fee <= tb, `a normal signing within budget (${pipe(F, p).stage}, fee ${signed && signed.fee} of ${tb})`); }

console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
