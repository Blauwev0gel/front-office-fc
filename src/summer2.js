/* The Front Office · the transfer summer, version 2
   A summer meeting with the DoF and staff that ends in a signed summer brief, a ticker in which the DoF executes it,
   a summer edition of the paper and a debrief in which the CEO holds the DoF to account. Builds on the shared parts in summer.js. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, S = () => g().sum;
const { ri, pick, chance, clamp, money, M, staff, man, tierAvg } = F;
const sq = () => g().squad, N = r => F.staffName(r), ord = F.ord;
const POSL = p => F.POS_L[p].toLowerCase();
const STEPS2 = ['Summer meeting', 'The summer', 'Summer edition', 'Debrief', 'Season goals'], STEPS_W = ['Winter meeting', 'The window', 'Winter edition', 'Debrief'];
// the winter window (B50) runs on the same machinery: S().win switches the steps, the weeks and the words
const win = () => !!(S() && S().win), SW = () => win() ? 'winter' : 'summer';
F.SUM2_STEPS = STEPS2; F.sum2Steps = () => win() ? STEPS_W : STEPS2;
const dof = () => staff('dof');
const trait = () => { const d = dof(); return d ? { ego: d.p.ego, risk: d.p.risk, loy: d.p.loy, rel: d.rel } : { ego: 8, risk: 8, loy: 10, rel: 50 }; };
const say = (who, t, k) => S().mt.log.push({ who, t, k: k || '', i: S().mt.item });
const relD = (r, v) => { const s = staff(r); if (s) s.rel = clamp(s.rel + v, 0, 100); if (r === 'dof' && v && S() && S().mt) S().mt.fx = { t: `Trust ${v > 0 ? '+' : '−'}${Math.abs(v)}`, bad: v < 0, n: (S().mt.fx ? S().mt.fx.n : 0) + 1 }; };
const mood = (w, e) => { const mt = S().mt; (mt.moods = mt.moods || {})[w] = e; };

/* ---------- start ---------- */
const prevStart = H.summerStart;
H.summerStart = () => { prevStart(); init2(); };
function init2() {
  const s = S(); s.v2 = true; s.step = 0;
  s.before = F.sumPlanner().map(r => ({ pos: r.pos, n: r.n, best: r.best })); s.xiBefore = F.teamStrength(); s.cashBefore = g().club.cash; s.ssB = { spent: g().ss.spent || 0, earned: g().ss.earned || 0 }; /* the summer's own money, not the whole last season's */
  if (!s.win && (g().dofStrikes || 0) > 0) g().dofStrikes--; /* a warning fades after a season */
  s.mt = { item: 0, log: [], q: 0, turns: {}, plan: null, brief: null };
  s.tk = null;
  openItem(0);
}
F.sum2Ensure = () => { const s = S(); if (s && !s.v2) init2(); };

/* ---------- meeting: items ---------- */
const ITEMS = ['club', 'money', 'needs', 'brief'];
F.SUM2_ITEMS = { club: 'The state of the club', money: 'The money', needs: 'What we need', get brief() { return win() ? 'The winter brief' : 'The summer brief'; } };
function lastSeason() {
  const r = g().lastReport; if (!r || !r.table) return null; const row = r.table.find(x => x.id === 0);
  const players = sq().map(p => ({ p, st: p.lastSeason || p.st })).filter(o => o.st && o.st.apps);
  const top = players.slice().sort((a, b) => b.st.g - a.st.g)[0];
  const byPos = {}; for (const o of players) { (byPos[o.p.pos] = byPos[o.p.pos] || []).push(o.st.apps ? o.st.rat / o.st.apps : 0); }
  const posRat = Object.entries(byPos).map(([pos, a]) => ({ pos, r: a.reduce((x, y) => x + y, 0) / a.length })).sort((a, b) => a.r - b.r);
  return { pos: r.pos, tier: r.tier, gf: row.gf, ga: row.ga, pts: row.pts, top: top ? { name: top.p.name, g: top.st.g, share: row.gf ? top.st.g / row.gf : 0 } : null, worstPos: posRat[0], bestPos: posRat[posRat.length - 1] };
}
// the first half of the season, for the winter meeting (same shape as lastSeason)
function halfSeason() {
  const G = g(), t = G.divs[G.club.tier], row = t && t.tab && t.tab[0]; if (!row) return null;
  const players = sq().map(p => ({ p, st: p.st })).filter(o => o.st && o.st.apps), top = players.slice().sort((a, b) => b.st.g - a.st.g)[0];
  const byPos = {}; for (const o of players) (byPos[o.p.pos] = byPos[o.p.pos] || []).push(o.st.rat / o.st.apps);
  const posRat = Object.entries(byPos).map(([pos, a]) => ({ pos, r: a.reduce((x, y) => x + y, 0) / a.length })).sort((a, b) => a.r - b.r);
  return { pos: F.myPos(), tier: G.club.tier, gf: row.gf, ga: row.ga, pts: row.pts, top: top ? { name: top.p.name, g: top.st.g, share: row.gf ? top.st.g / row.gf : 0 } : null, worstPos: posRat[0], bestPos: posRat[posRat.length - 1] };
}
F.sum2Half = halfSeason;
function diagnosis() {
  const L = win() ? halfSeason() : lastSeason(), pl = F.sumPlanner(), lines = [], probs = [];
  const old = sq().filter(p => !p.expiring && p.age >= 31).sort((a, b) => b.ca - a.ca).slice(0, 4);
  if (!L) lines.push(`A new club, a squad put together in a hurry. Before we spend anything, here is where we stand.`);
  else if (win()) lines.push(`${ord(L.pos)} in the ${F.TIERS[L.tier]} at the halfway mark, ${L.pts} points, ${L.gf} scored and ${L.ga} conceded. ${L.pos <= g().pre.base ? 'We are where the board wanted us. The task is to stay there.' : L.pos >= g().pre.base + 4 ? 'Well short of the target, and January is the time to do something about it.' : 'Not far off the target. The window can tip it either way.'}`);
  else lines.push(`${ord(L.pos)} in the ${F.TIERS[L.tier]}, ${L.pts} points, ${L.gf} scored and ${L.ga} conceded. ${L.pos <= 3 ? 'A good season. The task is to stay ahead of the clubs that will spend to catch us.' : L.pos >= 15 ? 'Not good enough, and I will not pretend otherwise.' : 'Mid-table. Nothing broken, nothing special.'}`);
  if (L && L.worstPos) { probs.push(L.worstPos.pos); lines.push(`Our weakest line was ${POSL(L.worstPos.pos)}: average rating ${L.worstPos.r.toFixed(2)}.`); }
  if (L && L.top && L.top.share >= 0.3) lines.push(`We lean too hard on ${L.top.name}: ${L.top.g} of our ${L.gf} goals.`);
  const need = pl.filter(r => r.status === 'need' || r.status === 'weak'); need.forEach(r => { if (!probs.includes(r.pos)) probs.push(r.pos); });
  if (need.length) lines.push(`We are short at ${need.map(r => POSL(r.pos)).join(' and ')}.`);
  if (old.length >= 3) lines.push(`${old.length} of our better players are over 30. That bill comes due soon.`);
  const exp = F.sumView().contracts;
  if (exp.length) { const keep = exp.filter(o => o.c.advice === 'renew').length; lines.push(`${exp.length} contracts have run out. I would keep ${keep} and let ${exp.length - keep} go. The package is on the card.`); }
  return { lines, probs };
}
function openItem(i) {
  const s = S(), mt = s.mt, it = ITEMS[i]; mt.item = i; mt.q = 0;
  if (it === 'club') { const d = diagnosis(); mt.probs = d.probs; say('dof', `"${d.lines.join(' ')}"`); }
  if (it === 'money') {
    const wr = Math.round(F.wageRatio() * 100), cap = +man('fin', 'wageCap'), room = Math.max(0, Math.round((cap / 100 * F.revenueAvg() - F.playerWages()) / 5) * 5);
    say('fin', `"Finance can release ${money(F.transferBudget())} for transfers${!win() && g().club.winKitty > 0 ? `, with ${money(g().club.winKitty)} of the kitty held back for the winter window` : win() ? ', including what we held back in the summer' : ''}. Wages are ${wr}% of revenue against a cap of ${cap}%, which leaves about ${money(room)} a week for new salaries. Cash: ${money(g().club.cash)}."`);
    say('board', `"The board expects us to finish ${ord(g().pre.base)}. Promise more and we will put more in the kitty. Promise less and we will hold some back."`);
  }
  if (it === 'needs') buildPlan();
  if (it === 'brief') makeBrief();
}

/* ---------- meeting: the plan ---------- */
function shortlist(pos, kind) {
  const r = g().rec, sc = (F.recScouts && F.recScouts()[0]) || dof(); if (!r || !sc) return [];
  const b = F.transferBudget(), t = g().club.tier, ma = +man('dof', 'maxAge');
  let ps = Object.values(r.pool).filter(p => p.pos === pos && Math.abs(p.inTier - t) <= 1 && p.age <= Math.max(ma, 24) && (!p.club || p.ask <= b * 1.1));
  if (kind === 'young') ps = ps.filter(p => p.age <= 24);
  const ok = ps.filter(p => !F.recRules(p).filter(i => i !== 'fee limit').length);
  S().mt.capped = S().mt.capped || (ps.length > 0 && ok.length === 0);
  ps = (ok.length ? ok : ps).sort((a, x) => (x.ca + F.gauss() * 0.8) - (a.ca + F.gauss() * 0.8)).slice(0, 6);
  for (const p of ps) { if (!r.know[p.id] || r.know[p.id].n < 2) F.recReport(sc, p); }
  return ps.map(p => ({ p, k: r.know[p.id] })).filter(o => o.k.grade !== 'D').sort((a, x) => (a.k.grade.localeCompare(x.k.grade)) || (x.k.est - a.k.est)).slice(0, 3).map(o => o.p.id);
}
function coachWish() {
  const pl = F.sumPlanner(), s = S(); const order = pl.slice().sort((a, b) => (a.status === 'need' ? -2 : a.status === 'weak' ? -1 : 0) - (b.status === 'need' ? -2 : b.status === 'weak' ? -1 : 0) || a.best - b.best);
  const st = g().mand.coach && g().mand.coach.attack > 60 ? ['ST', 'W', 'AM'] : ['CB', 'DM', 'FB'];
  const w = [order[0].pos]; const second = order.find(r => st.includes(r.pos) && !w.includes(r.pos)) || order[1]; w.push(second.pos); return w;
}
function buildPlan() {
  const s = S(), mt = s.mt, T = trait(), dna = g().club.dna;
  const kind = dna.talent === 'academy' ? 'young' : dna.talent === 'smart' ? 'value' : 'proven';
  const wish = coachWish(), probs = (mt.probs || []).concat(F.recPlanSuggest().map(x => x.pos));
  const prios = []; for (const p of probs.concat(wish)) if (!prios.includes(p) && prios.length < 3) prios.push(p);
  const approach = T.risk >= 12 ? 'star' : T.risk <= 7 ? 'depth' : (F.transferBudget() > M(60000) ? 'star' : 'depth');
  const lists = {}; for (const pos of prios) lists[pos] = shortlist(pos, kind);
  const sellIds = (s.sell || []).slice(0, 2);
  mt.plan = { prios, kind, approach, lists, sell: sellIds, keep: [], approve: man('dof', 'approve'), wish };
  const R = g().rec;
  say('coach', `"Give me ${wish.map(p => `a ${POSL(p)}`).join(' and ')}. ${wish.length > 1 ? 'Those two first, the rest can wait.' : ''}"`);
  const sl = prios.filter(p => lists[p].length).map(p => `${POSL(p)}: ${lists[p].map(id => { const p2 = R.pool[id], k = R.know[id]; return `${p2.name} (${p2.age}, grade ${k.grade}, ${p2.club ? money(p2.ask) : 'free'})`; }).join(', ')}`);
  say('scout', sl.length ? `"From our reports. ${sl.join('. ')}."` : `"Honestly, our reports are thin. I have nobody I would put my name to yet."`);
  say('dof', planText(), 'plan');
}
function planText() {
  const p = S().mt.plan, R = g().rec, A = id => R.pool[id] ? R.pool[id].name : '?';
  const main = p.prios.map((pos, i) => { const l = p.lists[pos]; return l.length ? `${POSL(pos)}: ${A(l[0])}${l[1] ? `, with ${A(l[1])} as plan B` : ''}` : `${POSL(pos)}: I will find someone`; }).join('; ');
  const how = p.approach === 'star' ? `"I want one signing that changes our level, and I will put most of the budget behind it.` : `"I would rather spread the money and fix several positions at once.`;
  const sell = p.sell.length ? ` To fund it, ${p.sell.map(id => (sq().find(x => x.id === id) || {}).name).filter(Boolean).join(' and ')} can go.` : '';
  const cap = S().mt.capped ? ` One problem: our wage bill is at the cap. Some of these only work if someone leaves first.` : '';
  return `${how} Priorities, ${main}.${sell}${cap}"`;
}
function responses() {
  const s = S(), mt = s.mt, it = ITEMS[mt.item], T = trait(), out = [];
  if (it === 'club') {
    const cs = F.sumView().contracts.filter(o => !o.c.out), rel = cs.filter(o => o.c.advice === 'release').sort((a, b) => b.p.ca - a.p.ca)[0], keep = cs.filter(o => o.c.advice === 'renew').sort((a, b) => b.p.age - a.p.age)[0];
    out.push({ k: 'pkg', l: cs.length ? 'Agree to the contract package' : 'Agreed. Move on' });
    if (rel && rel.p.age <= 32) out.push({ k: 'keepx', l: `Keep ${rel.p.name} as well`, id: rel.p.id });
    if (keep && keep.p.age >= 29) out.push({ k: 'relx', l: `Let ${keep.p.name} go instead`, id: keep.p.id });
  }
  if (it === 'money') {
    if (!g().pre.deal) return F.preTargets().map(o => ({ k: 'tgt', v: o.k, l: `${o.t}: finish ${ord(o.target)}`, h: o.fx }));
    const capO = ['50', '60', '70', '85'], ci = capO.indexOf(man('fin', 'wageCap')), wr = F.wageRatio() * 100;
    if (!S().mt.capDone && ci >= 0 && ci < 3 && wr > +capO[ci] - 6) out.push({ k: 'wcap', v: capO[ci + 1], l: `Raise the wage cap to ${capO[ci + 1]}%`, h: 'Room for new salaries, more risk if revenue drops' });
    out.push({ k: 'cash', v: 'more', l: 'Release more cash for transfers', h: `+${money(M(4000))} from cash, Finance uneasy` });
    out.push({ k: 'cash', v: 'keep', l: 'Stick with Finance\'s number' });
    out.push({ k: 'cash', v: 'less', l: 'Hold some back', h: `−25% transfer budget, cash safer` });
  }
  if (it === 'needs') {
    const p = mt.plan; if (mt.pending) return mt.pending;
    out.push({ k: 'agree', l: 'Agree with the plan' });
    if (mt.q < 3) {
      out.push(p.approach === 'star' ? { k: 'appr', v: 'depth', l: 'Too much on one player. Spread it' } : { k: 'appr', v: 'star', l: 'Go bigger: one player who makes a difference' });
      const sellP = p.sell.map(id => sq().find(x => x.id === id)).find(Boolean); if (sellP) out.push({ k: 'keep', id: sellP.id, l: `${sellP.name} stays` });
      const missing = p.wish.find(w => !p.prios.includes(w)); if (missing) out.push({ k: 'prio', v: missing, l: `The coach wants a ${POSL(missing)}. Make it a priority` });
      if (mt.capped && !mt.capFix) { const capO = ['50', '60', '70', '85'], ci = capO.indexOf(man('fin', 'wageCap')); if (ci >= 0 && ci < 3) out.push({ k: 'wcap2', v: capO[ci + 1], l: `Raise the wage cap to ${capO[ci + 1]}% so he can sign`, h: 'Finance will not like it' }); out.push({ k: 'sellmore', l: 'Sell first to make wage room', h: 'Two more high earners go on the list' }); }
      if (p.approve !== '25' && p.approve !== '0') out.push({ k: 'approve', l: `I approve every bid above ${money(Math.round(F.transferBudget() * 0.25))}` });
    }
  }
  if (it === 'brief') out.push({ k: 'sign', l: `Sign off the ${SW()} brief` });
  return out;
}
F.sum2Responses = responses;
function stance(cost) { const T = trait(); const p = clamp(0.25 + (T.ego - 10) * 0.05 + (T.risk - 10) * 0.02 - (T.rel - 50) * 0.006 + cost, 0.05, 0.85); return chance(p) ? 'hold' : 'give'; }
F.sum2Answer = idx => {
  const s = S(), mt = s.mt, it = ITEMS[mt.item], o = responses()[idx]; if (!o) return; const T = trait();
  say('you', `"${o.l}."`);
  if (it === 'club') {
    if (o.k === 'keepx') { F.sumContract(o.id, 'renew'); say('dof', T.ego >= 13 ? `"Your call. I would not have, but fine."` : `"Fair enough. He knows the club."`); relD('dof', T.ego >= 13 ? -2 : 0); }
    if (o.k === 'relx') { F.sumContract(o.id, 'release'); say('dof', `"Then I need another body in that position. Noted."`); }
    for (const c of F.sumView().contracts) if (!c.c.out) F.sumContract(c.p.id, c.c.advice);
    return next();
  }
  if (it === 'money') {
    if (o.k === 'tgt') { mood('board', o.v === 'bold' ? 'happy' : o.v === 'safe' ? 'worried' : 'neutral'); F.preSetTarget(o.v); say('board', o.v === 'bold' ? `"Ambitious. We will back that with money, and we will remember it in May."` : o.v === 'safe' ? `"Cautious. We expected more, frankly."` : `"Good. That is what we hoped to hear."`); return; }
    if (o.k === 'wcap') { mood('fin', 'worried'); g().mand.fin.wageCap = o.v; S().mt.capDone = true; relD('fin', -3); say('fin', `"${o.v}% it is. If gates drop, we will feel it first in the wage bill."`); return; }
    if (o.k === 'cash') { if (o.v === 'more') { g().club.kitty = (g().club.kitty || 0) + M(4000); g().club.cash -= M(4000); relD('fin', -3); say('fin', `"It can be done. I would not make a habit of it."`); } else if (o.v === 'less') { g().club.kitty = Math.round((g().club.kitty || 0) * 0.75); relD('fin', 2); relD('dof', -2); say('dof', `"Then we do less. Do not expect miracles."`); } else say('fin', `"Thank you. That number is safe."`); say('dof', `"So I have ${money(F.transferBudget())}. Good, let me show you what I want to do with it."`); return next(); }
  }
  if (it === 'needs') {
    const p = mt.plan;
    if (o.k === 'agree') { mood('dof', 'happy'); relD('dof', 2); say('dof', `"Good. I will get to work."`); return next(); }
    if (o.k === 'wcap2') { mood('fin', 'worried'); g().mand.fin.wageCap = o.v; mt.capFix = true; mt.capped = false; relD('fin', -3); say('fin', `"Against my advice. ${o.v}% it is."`); for (const pos of p.prios) p.lists[pos] = shortlist(pos, p.kind); say('dof', planText(), 'plan'); return; }
    if (o.k === 'sellmore') { mt.capFix = true; const prot = F.protectedIds(), top = sq().slice().sort((a, b) => b.ca - a.ca).slice(0, 11).map(x => x.id); const extra = sq().filter(x => !prot.has(x.id) && !top.includes(x.id) && !p.sell.includes(x.id) && !x.expiring).sort((a, b) => b.wage - a.wage).slice(0, 2); extra.forEach(x => { p.sell.push(x.id); x.sellFlag = true; }); say('dof', extra.length ? `"Then ${extra.map(x => x.name).join(' and ')} go first. Their wages pay for the new players."` : `"There is nobody I can sell without weakening the team."`); say('dof', planText(), 'plan'); return; }
    if (o.k === 'insist') { mt.pending = null; mood('dof', 'angry'); applyChange(o.change); relD('dof', -4); say('dof', `"You are the CEO. I will do it your way, and I want that on record."`); mt.q++; say('dof', planText(), 'plan'); return; }
    if (o.k === 'accept') { mt.pending = null; mood('dof', 'happy'); say('dof', `"Thank you. We keep the plan."`); mt.q++; return; }
    mt.q++;
    const cost = o.k === 'keep' ? -0.1 : o.k === 'approve' ? 0.1 : o.k === 'appr' ? 0.15 : 0;
    if (stance(cost) === 'hold') {
      mood('dof', 'angry'); say('dof', holdLine(o)); mt.pending = [{ k: 'insist', l: 'I hear you, but do it my way', change: o }, { k: 'accept', l: 'Fine, keep your plan' }]; return;
    }
    applyChange(o); mood('dof', o.k === 'appr' && o.v === 'star' ? 'happy' : 'neutral'); say('dof', giveLine(o)); say('dof', planText(), 'plan');
  }
  if (it === 'brief') { applyBrief(); s.step = 1; startTicker(); }
};
function holdLine(o) {
  const p = S().mt.plan, R = g().rec;
  if (o.k === 'appr') return o.v === 'depth' ? `"Two average players will not change our level. If we go cheap, we finish where we did."` : `"One big name is a big risk. If he gets injured, the summer is gone."`;
  if (o.k === 'keep') { const pl = sq().find(x => x.id === o.id); return `"${pl ? pl.name : 'He'} is ${pl ? pl.age : ''} and on ${pl ? money(pl.wage) : ''} a week. Keeping him means less for the players we need."`; }
  if (o.k === 'prio') return `"I hear the coach, but the numbers say ${POSL(p.prios[0])} first. He always wants more players."`;
  if (o.k === 'approve') return `"If I have to call you for every bid, we will lose players to quicker clubs."`;
  return `"I would rather not."`;
}
function giveLine(o) {
  if (o.k === 'appr') return o.v === 'depth' ? `"Fine. Wider, not higher."` : `"Now you are talking. I know exactly who."`;
  if (o.k === 'keep') return `"Understood. He stays."`;
  if (o.k === 'prio') return `"All right, the coach gets his ${POSL(o.v)}."`;
  if (o.k === 'approve') return `"Understood. You will get a call before I go above it."`;
  return `"Okay."`;
}
function applyChange(o) {
  const p = S().mt.plan;
  if (o.k === 'appr') p.approach = o.v;
  if (o.k === 'keep') { p.sell = p.sell.filter(id => id !== o.id); p.keep.push(o.id); }
  if (o.k === 'prio') { p.prios = [o.v].concat(p.prios.filter(x => x !== o.v)).slice(0, 3); p.lists[o.v] = p.lists[o.v] || shortlist(o.v, p.kind); }
  if (o.k === 'approve') p.approve = '25';
}
function next() { const mt = S().mt; if (mt.item < ITEMS.length - 1) openItem(mt.item + 1); }

/* ---------- the brief ---------- */
function makeBrief() {
  const s = S(), p = s.mt.plan, b = F.transferBudget(), R = g().rec;
  const kpis = [];
  kpis.push({ k: 'prios', t: `Sign a player for ${p.prios.slice(0, 2).map(POSL).join(' and ')}`, pos: p.prios.slice(0, 2) });
  kpis.push({ k: 'net', t: `Net spend under ${money(Math.round(b * 0.9 / 100) * 100)}`, v: Math.round(b * 0.9) });
  if (p.approach === 'star') kpis.push({ k: 'star', t: `Land a clear upgrade (grade A)` });
  else kpis.push({ k: 'count', t: `At least three signings`, v: 3 });
  s.mt.brief = { kpis, prios: p.prios, approach: p.approach, sell: p.sell.slice(), keep: p.keep.slice(), approve: p.approve, budget: b, lists: p.lists };
  say('dof', `"Then this is what I will be judged on." He slides the ${SW()} brief across the table.`);
}
function applyBrief() {
  const s = S(), B = s.mt.brief, R = g().rec, G = g();
  // A newly signed winter/summer brief must not silently overwrite an earlier CEO agreement.
  const pending = F.agrList ? F.agrList().filter(a => !a.res && !a.done && a.pos && (a.k === 'pos' || a.kind === 'plan')) : [];
  const carried = [...new Set(pending.map(a => a.pos))], merged = carried.concat(B.prios.filter(pos => !carried.includes(pos))).slice(0, 3);
  if (carried.length) { say('dof', `Our existing agreement on ${carried.map(POSL).join(' and ')} remains part of this ${SW()} brief. If circumstances change, I will report it before dropping the priority.`);
    B.prios = merged; const goal = B.kpis.find(k => k.k === 'prios'); if (goal) { goal.pos = merged.slice(0, 2); goal.t = `Sign a player for ${goal.pos.map(POSL).join(' and ')}`; } }
  R.plan.prios = B.prios.map(pos => ({ pos, kind: s.mt.plan.kind, agreed: carried.includes(pos) })); R.plan.set = true;
  G.mand.dof.approve = B.approve;
  s.feeBefore = G.mand.dof.maxFee; G.mand.dof.maxFee = B.approach === 'star' ? '100' : '50';
  for (const id of B.sell) { const p = sq().find(x => x.id === id); if (p) p.sellFlag = true; }
  for (const id of B.keep) { const p = sq().find(x => x.id === id); if (p) p.noSell = G.season; }
  B.prios.forEach((pos, i) => (B.lists[pos] || []).forEach((id, j) => { const x = F.recAddPipe(id, j === 0 ? 'recommended' : 'scouted'); if (j > 0 && x.stage === 'recommended') x.stage = 'scouted'; x.boost = j === 0; x.planA = j === 0; x.planB = j >= 1; x.apAsked = false; x.blocked = null; }));
}

/* ---------- the summer ticker ---------- */
const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'], WEEKS_W = ['Week 1', 'Week 2', 'Week 3'], weeks = () => win() ? WEEKS_W : WEEKS;
F.SUM2_WEEKS = WEEKS; F.sum2Weeks = weeks;
function startTicker() { S().tk = { wk: -1, lines: [], shown: 0, call: null, calls: [], done: false, run: true }; }
const tl = (t, k, h, pid) => S().tk.lines.push({ t, k: k || '', h: h || weeks()[Math.max(0, S().tk.wk)], pid: pid || null });
function explain(lines) {
  const R = g().rec, B = S().mt.brief, out = [];
  for (const l of lines) {
    out.push(l);
  }
  for (const x of R.pipe) {
    if (x.lastTold === x.stage + (x.deal ? x.deal.round : 0)) continue; const p = R.pool[x.pid]; if (!p) continue;
    if ((x.planA || x.planB) && x.stage === 'negotiating' && x.deal && x.deal.rounds.length) { out.push({ k: 'talk', t: x.deal.rounds[x.deal.rounds.length - 1].replace(/^Round \d+: /, ''), pid: x.pid }); }
    if (x.planA && x.stage === 'lost') { const pos = p.pos, alt = (B.lists[pos] || [])[1], ap = alt && R.pool[alt]; out.push({ k: 'lost', t: `Plan A for ${POSL(pos)} is off. ${ap ? `Plan B: ${ap.name}.` : 'Back to the reports.'}`, pid: ap ? ap.id : null }); }
    if (x.blocked && (x.planA || x.planB) && !x.toldBlocked) { x.toldBlocked = true; out.push({ k: 'lost', t: `${p.name} breaks our ${x.blocked.join(' and ')}. Dropped.`, pid: x.pid }); }
    if (x.stage === 'signed' && !x.toldFill) { x.toldFill = true; const B2 = S().mt.brief, pos = (sq().find(q => q.id === x.pid) || {}).pos; if (pos && B2 && B2.prios.includes(pos)) { const nxt = F.recPlanBoard().find(r => r.st !== 'done'); out.push({ k: 'dec', t: `${F.POS_L[pos]} sorted. ${nxt ? 'Next: the ' + POSL(nxt.pos) + '.' : 'All priorities done.'}`, pid: x.pid }); } }
        x.lastTold = x.stage + (x.deal ? x.deal.round : 0);
  }
  return out;
}
function planStatus() {
  const B = F.recPlanBoard ? F.recPlanBoard() : []; if (!B.length) return '';
  return B.slice(0, 3).map(r => `${POSL(r.pos)[0].toUpperCase() + POSL(r.pos).slice(1)}: ${r.who}`).join('. ') + '.';
}
// the five questions the debrief answers (B28): was the plan followed, how well was it carried out, was the market unkind, did the team improve, what did it cost
function five() {
  const s = S(), B = s.mt.brief, R = g().rec, ins = s.log.filter(l => l.k === 'in'); if (!B || !R) return null;
  const inPlan = ins.filter(l => B.prios.includes(l.pos)).length, off = ins.length - inPlan;
  const known = ins.map(l => R.log.find(x => x.s === g().season && x.name === l.name)).filter(Boolean), good = known.filter(x => R.know[x.pid] && /^[AB]$/.test(R.know[x.pid].grade)).length;
  const lostMarket = R.pipe.filter(x => x.stage === 'lost' && (x.log || []).some(t => /joins another|moved elsewhere|chose|rival|no longer available/i.test(t)) && F.absWeek() - x.since < 12).length;
  const lostOwn = R.pipe.filter(x => x.stage === 'lost' && (x.log || []).some(t => /rejects our wage|break|collapse|rules/i.test(t)) && F.absWeek() - x.since < 12).length;
  const xi = F.teamStrength() - (s.xiBefore || 0), B0 = s.ssB || { spent: 0, earned: 0 }, net = (g().ss.spent || 0) - B0.spent - ((g().ss.earned || 0) - B0.earned), cap = (B.kpis.find(k => k.k === 'net') || {}).v;
  const L = [
    { k: 'plan', ok: inPlan > 0 && off <= inPlan, t: inPlan ? `Plan followed: ${inPlan} of ${ins.length} signing${ins.length === 1 ? '' : 's'} in the agreed positions${off ? `, ${off} outside the brief` : ''}.` : ins.length ? 'Plan not followed: nobody signed in the agreed positions.' : 'Plan not carried out: nobody signed.' },
    { k: 'exec', ok: known.length ? good >= known.length / 2 : null, t: known.length ? `Execution: ${good} of ${known.length} signing${known.length === 1 ? '' : 's'} were rated a clear upgrade or a good addition when he chose them.` : 'Execution: nothing to judge yet.' },
    { k: 'market', ok: null, t: lostMarket ? `Market: ${lostMarket} target${lostMarket === 1 ? '' : 's'} went elsewhere or became unavailable. That is not on him.` : lostOwn ? `Market: ${lostOwn} deal${lostOwn === 1 ? '' : 's'} fell through on our own terms (wage or rules).` : 'Market: no targets lost.' },
    { k: 'team', ok: xi > 0.1 ? true : xi < -0.1 ? false : null, t: xi > 0.1 ? `The team is stronger than ${win() ? 'before the window' : 'in May'} (+${xi.toFixed(1)}).` : xi < -0.1 ? `The team is weaker than ${win() ? 'before the window' : 'in May'} (${xi.toFixed(1)}).` : `The team is about as strong as ${win() ? 'before the window' : 'in May'}.` },
    { k: 'money', ok: cap != null ? net <= cap : null, t: `Money: net spend ${money(net)}${cap != null ? `, against ${money(cap)} agreed` : ''}.` }];
  return { L, excuse: lostMarket > 0 && lostOwn === 0 && inPlan === 0, bad: L.filter(x => x.ok === false).length };
}
function weekTick() {
  const s = S(), tk = s.tk, G = g(); tk.wk++;
  if (tk.wk >= weeks().length) { tk.phase = 'dd'; F.ddStart(); return; }
  const before = { pipe: Object.fromEntries(G.rec.pipe.map(x => [x.pid, x.stage])), ids: new Map(sq().map(p => [p.id, p.name])), stories: G.paper.stories.length };
  if (H.recWeekly) H.recWeekly(); F.dofWork();
  if (tk.wk === 0) tl(`${N('dof')}: "The brief is signed. First calls this morning."`, 'dec');
  const ls = F.sumDiff(before), ex = explain(ls);
  ex.forEach(l => tl(l.t, l.k, null, l.pid));
  if (!win() && (tk.wk === 3 || tk.wk === 4)) { const fr = F.sumFriendlies(); const f = fr[tk.wk - 3]; if (f) tl(`Friendly: ${g().club.name} ${f.ug}–${f.tg} ${f.opp}. ${f.note}`, f.res === 'W' ? 'in' : f.res === 'L' ? 'out' : 'quiet'); }
  if (!ex.length) { const st = planStatus(); if (st && st !== tk.lastStatus) { tl(st, 'quiet'); tk.lastStatus = st; } } /* a quiet week shows where the plan stands, or nothing */
  const q = F.sumDrain(); if (q.length) { tk.calls.push(...q); }
}
F.tkStep = () => {
  const s = S(), tk = s.tk; if (!tk || tk.done || tk.phase === 'dd') return;
  if (tk.call) return;
  if (tk.shown < tk.lines.length) { tk.shown++; return; }
  if (tk.calls.length) { tk.call = tk.calls.shift(); const m = g().inbox.find(x => x.id === tk.call); if (!m || m.done) tk.call = null; return; }
  weekTick();
};
const ADV = { rec_exception: 0, rec_approve: 0, rec_raise: 1 };
F.tkCall = () => { const tk = S().tk; if (!tk || !tk.call) return null; const m = g().inbox.find(x => x.id === tk.call); if (!m) return null; const v = F.msgView(m); const ai = ADV[m.ev] != null ? ADV[m.ev] : v.auto; return { m, v, ai, advice: v.opts[ai] ? v.opts[ai].l : '' }; };
F.tkAnswer = idx => { const tk = S().tk, c = F.tkCall(); if (!c) { tk.call = null; return; } const out = F.resolve(c.m, idx, 'you'); tl(`You: ${c.v.opts[idx].l}. ${out}`, 'dec'); tk.shown = tk.lines.length; tk.call = null; };
F.tkSkip = () => { const tk = S().tk; let guard = 0; while (tk.phase !== 'dd' && guard++ < 200) { if (tk.call) { const c = F.tkCall(); if (c) { const out = F.resolve(c.m, c.v.auto, N(F.EV[c.m.ev].from)); tl(`${N('dof')} decides: ${c.v.opts[c.v.auto].l}. ${out}`, 'dec'); } tk.call = null; } else F.tkStep(); } tk.shown = tk.lines.length; };

/* ---------- the edition ---------- */
function evalBrief() {
  const s = S(), B = s.mt.brief, ins = s.log.filter(l => l.k === 'in'), R = g().rec; if (!B) return [];
  const B0 = s.ssB || { spent: 0, earned: 0 }, spent = (g().ss.spent || 0) - B0.spent, earned = (g().ss.earned || 0) - B0.earned, net = spent - earned;
  return B.kpis.map(k => {
    if (k.k === 'prios') { const got = k.pos.filter(p => ins.some(l => l.pos === p)); return { ...k, met: got.length === k.pos.length, note: got.length ? `Signed for ${got.map(POSL).join(' and ')}` : 'Nobody signed in those positions' }; }
    if (k.k === 'net') return { ...k, met: net <= k.v, note: `Net spend ${money(net)}` };
    if (k.k === 'star') { const a = R.log.filter(l => l.s === g().season && ins.some(i => i.name === l.name)).find(l => { return l.est != null && l.est >= Math.max(...sq().filter(p => p.pos === l.pos && p.name !== l.name).map(p => p.ca), 0) + 0.3; }); return { ...k, met: !!a, note: a ? `${a.name} looks like an upgrade` : 'No clear upgrade arrived' }; }
    if (k.k === 'count') { const R2 = g().rec, sur = R2.log.filter(l => l.s === g().season && l.surplus).length, useful = ins.length - sur; return { ...k, met: useful >= k.v, note: `${useful} useful signing${useful === 1 ? '' : 's'}${sur ? `, ${sur} surplus` : ''}` }; }
    return { ...k, met: false, note: '' };
  });
}
F.sum2Edition = () => {
  const s = S(), ev = evalBrief(), met = ev.filter(e => e.met).length, after = F.sumPlanner(), xi = F.teamStrength() - (s.xiBefore || 0);
  const ins = s.log.filter(l => l.k === 'in'), outs = s.log.filter(l => l.k === 'out'), B0 = s.ssB || { spent: 0, earned: 0 }, spent = (g().ss.spent || 0) - B0.spent, earned = (g().ss.earned || 0) - B0.earned;
  const score = met * 1.2 + clamp(xi * 3, -2, 2.5) + (ins.length ? 0.5 : -1);
  const grade = score >= 4 ? 'A' : score >= 2.8 ? 'B' : score >= 1.5 ? 'C' : score >= 0.5 ? 'D' : 'E';
  const W = SW(), head = grade === 'A' ? `A ${W} to remember` : grade === 'B' ? 'Smart business at ' + g().club.short : grade === 'C' ? `A ${W} of half measures` : grade === 'D' ? `Questions over ${W} business` : `${win() ? 'Winter' : 'Summer'} of failure`;
  const rows = after.map(r => { const b = (s.before || []).find(x => x.pos === r.pos) || {}; return { pos: r.pos, b: b.best || 0, a: r.best, nb: b.n || 0, na: r.n }; });
  const coach = xi > 0.15 ? `"I have a better squad than ${win() ? 'a month ago' : 'in May'}. Now it is up to me."` : xi < -0.1 ? `"We are weaker than ${win() ? 'before the window' : 'last season'}. I will say that to anyone who asks."` : `"About the same squad. We will have to work harder."`;
  const fans = grade <= 'B' ? 'Supporters\' forums are buzzing about the new arrivals.' : 'Supporters are asking where the money went.';
  const board = met >= 2 ? '"The DoF did what we agreed."' : `"We expected more from this ${SW()}."`;
  s.ed = s.ed || { grade, met, n: ev.length }; return { label: win() ? 'Winter' : 'Summer', ev, grade, head, ins, outs, spent, earned, net: spent - earned, rows, xi, coach, fans, board };
};

/* ---------- the debrief ---------- */
F.sum2Debrief = () => {
  const s = S(), ev = evalBrief(), T = trait(), met = ev.filter(e => e.met).length;
  let ex = false; const lines = ['"' + ev.map(e => { if (e.met) return `${e.t}: done. ${e.note}.`; const extra = ex ? '' : T.ego >= 13 ? ' With the budget I had, that was always going to be hard.' : ' That one is on me.'; ex = true; return `${e.t}: not done. ${e.note}.${extra}`; }).join(' ') + '"'];
  const fv = five(); return { five: fv ? fv.L : [], ev, met, lines, intro: met === ev.length ? `"Everything we agreed is done."` : met === 0 ? `"I know how this looks."` : `"Most of it went to plan. Not all."`, done: s.db };
};
F.sum2Talk = k => {
  const s = S(), d = dof(), ev = evalBrief(), met = ev.filter(e => e.met).length, miss = ev.length - met; if (!d || s.db) return;
  let t = '';
  if (k === 'praise') { relD('dof', met >= 2 ? 6 : 1); d.boost = clamp(d.boost + (met >= 2 ? 4 : 0), -10, 12); d.boostW = 6; t = met >= 2 ? `"Thank you. The scouts deserve that as much as I do."` : `"Kind of you. We both know it was not my best ${SW()}."`; }
  if (k === 'probe') { const miss1 = ev.find(e => !e.met); relD('dof', -1); t = miss1 ? (miss1.k === 'prios' ? `"The targets we wanted were either too expensive or broke our rules. I could have pushed harder for an exception."` : miss1.k === 'net' ? `"I spent more than we agreed because the right player came up late. I would do it again."` : `"The market did not give me what I wanted at our price."`) : `"Ask me anything. I am happy to go through every deal."`; }
  if (k === 'warn') { relD('dof', miss ? -6 : -12); d.boost = clamp(d.boost + (miss ? 5 : -2), -10, 12); d.boostW = 6; t = miss ? `"Understood. The ${win() ? 'summer' : 'winter'} window will look different."` : `"A warning? After this summer? I will remember that."`; if (miss) { const fv = five(); if (fv && fv.excuse) { relD('dof', 3); t = `"A warning? The market took the players I wanted. But I hear you."`; } else g().dofStrikes = (g().dofStrikes || 0) + 1; } }
  if (k === 'tighten') { g().mand.dof.approve = '0'; relD('dof', -5); t = `"Every deal through you, then. It will slow us down."`; }
  if (k === 'loosen') { g().mand.dof.approve = '50'; relD('dof', 4); t = `"Thank you for the trust."`; }
  s.db = { k, t };
};

/* ---------- finish ---------- */
F.sum2Finish = () => {
  const s = S(), G = g(); if (s.feeBefore != null) { G.mand.dof.maxFee = s.feeBefore; }
  for (const p of sq()) if (p.noSell && p.noSell < G.season) delete p.noSell;
  if (s.win) F.winterFinish(); else F.sumFinish();
};
F.sum2Step = i => { const s = S(); if (i <= s.step + 1) s.step = i; };

/* small exports from summer.js internals, recreated */
F.sumDrain = () => { const G = g(), q = G.queue.splice(0), ids = []; for (const it of q) if (F.addMsg(it.id, it.ctx)) { G.inbox[0].sum = true; ids.push(G.inbox[0].id); } return ids; };

/* test helper */
F.sum2Auto = (rand, lazy) => {
  const r = rand || F.rnd, s = S(); let guard = 0;
  while (s.step === 0 && guard++ < 30) { const o = responses(); if (!o.length) break; F.sum2Answer(lazy ? Math.max(0, o.findIndex(x => !/wcap/.test(x.k || ''))) : Math.floor(r() * o.length)); }
  guard = 0; while (s.tk && s.tk.phase !== 'dd' && guard++ < 300) { if (s.tk.call) { const c = F.tkCall(); if (c) F.tkAnswer(lazy ? c.v.auto : Math.floor(r() * c.v.opts.length)); else s.tk.call = null; } else F.tkStep(); }
  guard = 0; while (!s.dd.done && guard++ < 80) { if (s.dd.dec) F.ddDecide(lazy ? -1 : Math.floor(r() * (F.ddDecision() || { opts: [1] }).opts.length)); else F.ddTick(); }
  s.step = 2; F.sum2Edition(); s.step = 3; if (!lazy) F.sum2Talk(pick(['praise', 'probe', 'warn'])); if (s.win) { F.sum2Finish(); return; } s.step = 4;
  const fo = F.FOCUS.filter(f => !g().board.obj.some(o => o.k === f.k)); while (g().pre.focus.length < 2 && fo.length) F.preToggleFocus(fo.splice(Math.floor(r() * fo.length), 1)[0].k);
  if (g().meeting) g().meeting.items.forEach((it, i) => F.decideProposal(i, r() < 0.5 ? 'approve' : 'reject'));
  F.sum2Finish();
};
F.sumAuto = F.sum2Auto;
})(FO);
