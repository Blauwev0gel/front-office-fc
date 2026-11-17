/* ---------- staff work, records & chains (1.1) ---------- */
function later(id, ctx, a, b) { (G.later = G.later || []).push({ at: absWeek() + ri(a, b), id, ctx: ctx || {}, of: G.resOf || '' }); } /* 'of' names the decision this follows */
function kittyFor(rev) { const d = G.club.dna; let k = Math.max(M(7000), (rev || 0) * 0.1); k *= { self: 0.7, owner: 1.4, debt: 1.2 }[d.money] || 1; if (d.origin === 'investor') k *= 1.4; return Math.round(k / 100) * 100; }
function snapStart() { G.ss.start = { spons: sponsorIncome(), fanbase: G.club.fanbase, cash: G.club.cash, brand: G.club.brand }; }
function buildReports(o) {
  const R = [], add = (role, t) => R.push({ role, t }), dn = G.dofNote, sn = G.scoutNote;
  for (const r of ROLES) if (!staff(r.id)) add(r.id, `Nobody is running ${r.dept}. Decisions there fall to chance.`);
  if (staff('dof')) add('dof', dn ? (dn.signed ? `Weighed ${dn.n} options for ${POS_L[dn.pos].toLowerCase()} (${dn.listed} from the scouts' shortlist) and signed ${dn.signed}.` : dn.blocked.length ? `Weighed ${dn.n} options for ${POS_L[dn.pos].toLowerCase()}. The best ones broke your rules: ${dn.blocked.join(', ')}.` : `Weighed ${dn.n} options for ${POS_L[dn.pos].toLowerCase()}; nobody good enough at the right price.`) : window_() ? 'Happy with the squad; no business this week.' : `Window closed. ${G.squad.filter(p => p.contract <= 1).length} contracts expire this summer.`);
  if (staff('scout') && sn) add('scout', `Watched ${sn.games} matches. ${sn.added.length ? 'Added ' + sn.added.map(p => `${p.name} (${p.age}, ${p.pos}, ${REGIONS[p.reg].name}, rated ${p.s}★ now, ${p.ps}★ potential)`).join(' and ') + ' to the shortlist.' : 'Nobody new worth a shortlist place.'} Shortlist: ${G.shortlist.length}.`);
  if (staff('coach') && o) { const best = G.squad.filter(p => p.lastRat).sort((a, b) => b.lastRat - a.lastRat)[0], inj = G.squad.filter(p => p.inj > 0).length; add('coach', `${o.result === 'W' ? 'Pleased' : o.result === 'L' ? 'Frustrated' : 'Mixed feelings'}: we created ${o.uxg.toFixed(1)} xG and allowed ${o.txg.toFixed(1)}.${best ? ' ' + best.name + ' stood out.' : ''} ${inj ? inj + ' injured.' : 'Fully fit squad.'}`); }
  if (staff('acad')) { const top = G.academy.slice().sort((a, b) => b.pa - a.pa)[0]; add('acad', top ? `${G.academy.length} in the academy. ${top.name} (${top.age}) is the standout: ${stars(top.ca)}★ now, ${stars(top.pa)}★ potential.` : 'The academy is empty until the intake in week 28.'); }
  if (staff('com')) add('com', `Sponsorship at ${money(sponsorIncome())}/wk.${o && o.home ? ` Crowd ${o.att.toLocaleString('en-GB')} of ${G.club.cap.toLocaleString('en-GB')} at ${money(ticketPrice())} a ticket.` : ''}`);
  if (staff('mkt')) { const d = G.club.fanbase - (G.prevFan || G.club.fanbase); add('mkt', `Supporter base ${G.club.fanbase.toLocaleString('en-GB')} (${d >= 0 ? '+' : ''}${d} this week), brand strength ${Math.round(G.club.brand)}.`); }
  if (staff('fin')) { const L = G.fin.last, wr = Math.round(wageRatio() * 100), cp = +man('fin', 'wageCap'); add('fin', `Week result ${L.tin - L.tout >= 0 ? '+' : ''}${money(L.tin - L.tout)}. Player wages at ${wr}% of revenue (cap ${cp}%)${wr > cp ? ', over the cap' : wr > cp - 5 ? ', close to the cap' : ''}. Transfer budget ${money(transferBudget())}.`); }
  G.reports = R;
}
const avgRat = p => p.st.apps ? p.st.rat / p.st.apps : null;
function squadAvgRat() { const r = G.squad.map(avgRat).filter(x => x != null); return r.length ? r.reduce((a, b) => a + b, 0) / r.length : 6.5; }
function record(role) {
  const L = [], ss = G.ss, s0 = ss.start || {}, add = (l, v, g) => L.push([l, v, g]); let sc = 50;
  const early = ss.lg < 4;
  if (role === 'dof') {
    const sig = (G.signLog || []).filter(x => x.season === G.season).map(x => ({ x, p: G.squad.find(p => p.id === x.pid) }));
    const rated = sig.filter(o => o.p && o.p.st.apps >= 3), sa = squadAvgRat(), ar = rated.length ? rated.reduce((a, o) => a + avgRat(o.p), 0) / rated.length : null, flops = rated.filter(o => avgRat(o.p) < 6.4).length;
    add('Signings this season', sig.length, null);
    add('Average rating of signings', ar ? `${ar.toFixed(2)} (squad ${sa.toFixed(2)})` : 'Too early', ar ? ar >= sa : null);
    add('Flops, rating under 6.4', rated.length ? `${flops} of ${rated.length}` : '–', rated.length ? flops === 0 : null);
    add('Spent / recouped', `${money(ss.spent)} / ${money(ss.earned)}`, ss.spent || ss.earned ? ss.earned >= ss.spent : null);
    sc = 50 + (ar ? (ar - sa) * 60 : 0) - flops * 8 + (ss.earned > ss.spent ? 6 : 0);
  } else if (role === 'coach') {
    const g = ss.lg, t = G.divs[G.club.tier].tab[0], ppg = g ? (t.w * 3 + t.d) / g : 0, xgd = g ? (ss.xgf - ss.xga) / g : 0, over = (t.gf - t.ga) - (ss.xgf - ss.xga);
    const tm = G.squad.reduce((a, p) => a + p.st.mins, 0), ym = G.squad.filter(p => p.age <= 21).reduce((a, p) => a + p.st.mins, 0);
    add('Points per game', g ? ppg.toFixed(2) : '–', g ? (ppg >= 1.6 ? true : ppg < 1.1 ? false : null) : null);
    add('xG difference per game', g ? (xgd >= 0 ? '+' : '') + xgd.toFixed(2) : '–', g ? (xgd > 0.2 ? true : xgd < -0.2 ? false : null) : null);
    add('Results vs performances', !g ? '–' : over > 2.5 ? `Running hot: ${over.toFixed(1)} goals better than xG` : over < -2.5 ? `Unlucky: ${(-over).toFixed(1)} goals worse than xG` : 'In line with xG', null);
    add('Under-21 minutes', tm ? Math.round(ym / tm * 100) + '%' : '–', null);
    sc = 50 + (g ? (ppg - 1.35) * 30 + xgd * 35 : 0);
  } else if (role === 'scout') {
    const sl = G.shortlist || [], foc = ((G.club.net[man('scout', 'reg1')] || 0) + (G.club.net[man('scout', 'reg2')] || 0)) / 2;
    const ch = (G.signLog || []).map(x => ({ x, p: G.squad.find(p => p.id === x.pid) })).filter(o => o.p && o.x.est != null), acc = ch.length ? ch.reduce((a, o) => a + Math.abs(o.x.est - stars(o.p.ca)), 0) / ch.length : null;
    add('Shortlist', `${sl.length} players`, null);
    add('Average potential on shortlist', sl.length ? (sl.reduce((a, p) => a + stars(p.pPA), 0) / sl.length).toFixed(1) + '★' : '–', null);
    add('Network in focus regions', Math.round(foc) + ' / 100', foc >= 40 ? true : foc < 15 ? false : null);
    add('Rating accuracy on signings', acc == null ? '–' : acc <= 0.5 ? `Sharp (off by ${acc.toFixed(1)}★)` : `Off by ${acc.toFixed(1)}★`, acc == null ? null : acc <= 0.5);
    sc = 35 + foc * 0.45 + (acc != null ? (1 - acc) * 20 : 5);
  } else if (role === 'acad') {
    const pot = G.academy.length ? G.academy.reduce((a, p) => a + stars(p.pa), 0) / G.academy.length : 0, gr = G.squad.filter(p => p.academy).length;
    add('Prospects', G.academy.length, null); add('Average potential', pot ? pot.toFixed(1) + '★' : '–', pot ? pot >= 3 : null); add('Debuts this season', ss.grads, ss.grads >= 2 ? true : null); add('Graduates in first-team squad', gr, null);
    sc = 30 + pot * 10 + ss.grads * 6 + gr * 2;
  } else if (role === 'com') {
    const sp = sponsorIncome(), d = s0.spons ? sp / s0.spons - 1 : 0, att = ss.attN ? ss.attSum / ss.attN : null;
    add('Sponsorship per week', `${money(sp)} (${d >= 0 ? '+' : ''}${Math.round(d * 100)}% this season)`, d > 0.05 ? true : d < -0.05 ? false : null);
    add('Average stadium fill', att == null ? '–' : Math.round(att * 100) + '%', att == null ? null : att >= 0.7 ? true : att < 0.4 ? false : null);
    add('Ticket price', money(ticketPrice()), null);
    sc = 50 + d * 120 + (att != null ? (att - 0.55) * 50 : 0);
  } else if (role === 'mkt') {
    const fd = s0.fanbase ? (G.club.fanbase / s0.fanbase - 1) * 100 : 0, bd = G.club.brand - (s0.brand || G.club.brand);
    add('Supporter base', `${G.club.fanbase.toLocaleString('en-GB')} (${fd >= 0 ? '+' : ''}${fd.toFixed(1)}%)`, fd > 2 ? true : fd < -2 ? false : null);
    add('Brand strength', `${Math.round(G.club.brand)} (${bd >= 0 ? '+' : ''}${Math.round(bd)})`, bd > 2 ? true : bd < -2 ? false : null);
    add('Supporter mood', Math.round(G.st.fans), G.st.fans >= 60 ? true : G.st.fans < 35 ? false : null);
    sc = 50 + fd * 2 + bd * 2 + (G.st.fans - 50) * 0.3;
  } else if (role === 'fin') {
    const wr = wageRatio() * 100, cp = +man('fin', 'wageCap'), cd = G.club.cash - (s0.cash || 0);
    add('Player wages vs revenue', `${Math.round(wr)}% (cap ${cp}%)`, wr <= cp);
    add('Cash this season', (cd >= 0 ? '+' : '') + money(cd), cd >= 0);
    add('Revenue / costs', `${money(ss.rev)} / ${money(ss.exp)}`, ss.rev ? ss.rev >= ss.exp : null);
    sc = 50 + (cp - wr) * 1.2 + clamp(cd / Math.max(1, M(600)), -20, 20);
  }
  sc = clamp(Math.round(sc), 0, 100);
  return { lines: L, score: sc, verdict: early ? 'Too early' : sc >= 62 ? 'Strong' : sc <= 40 ? 'Poor' : 'Mixed', early };
}

/* ---------- analysis & scorecards (1.3) ---------- */
function xPts(a, b) { const pmf = (l, k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return Math.exp(-l) * Math.pow(l, k) / f; }; let w = 0, d = 0; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) { const pr = pmf(a, i) * pmf(b, j); if (i > j) w += pr; else if (i === j) d += pr; } return 3 * w + d; }
function forecast() {
  const t = G.club.tier, dv = G.divs[t], left = SEASON_WEEKS - (G.week - 1);
  const proj = dv.clubs.map(id => { const r = dv.tab[id]; const ppg = r.p ? r.pts / r.p : (id === 0 ? 1.3 : 1.3); return { id, pts: r.pts + ppg * Math.max(0, SEASON_WEEKS - r.p) }; }).sort((a, b) => b.pts - a.pts);
  return proj.findIndex(x => x.id === 0) + 1;
}
function analysis() {
  const t = G.club.tier, pos = myPos(), obj = G.board.obj.find(o => o.k === 'league'), target = obj ? obj.target : 9, tab = sortTable(t), dv = G.divs[t];
  const me = dv.tab[0] || { pts: 0, gf: 0, ga: 0 }, tgtPts = (dv.tab[tab[Math.min(tab.length, target) - 1]] || me).pts, gap = tgtPts - me.pts, g = G.ss.lg || 0;
  const P = strengthParts(), ours = P.squad, others = dv.clubs.filter(i => i !== 0).map(i => G.clubs[i].str).sort((a, b) => b - a);
  const divAvg = others.reduce((a, b) => a + b, 0) / others.length, topT = others.slice(0, Math.max(1, target)).reduce((a, b) => a + b, 0) / Math.max(1, target);
  const qRank = 1 + others.filter(x => x > ours + P.coach + P.style + P.morale + P.extra).length;
  const luck = g ? me.pts - (G.ss.xpts || 0) : 0, xgd = g ? (G.ss.xgf - G.ss.xga) / g : 0, expXgd = (ours + P.coach + P.style - divAvg) * 0.55;
  const inj = G.squad.filter(p => p.inj > 0).length, co = staff('coach');
  const causes = [], levers = [], add = (k, sev, t) => causes.push({ k, sev, t }), lv = (t, a, x) => levers.push({ t, a, x });
  const bars = [
    { l: 'Squad quality', v: ours - divAvg, note: `Starting XI rated ${ours.toFixed(1)} against a division average of ${divAvg.toFixed(1)}.` },
    { l: 'Coaching', v: P.coach + P.style, note: co ? `Tactics ${co.at[0]}/20. ${P.style >= 0.2 ? 'Style fits.' : P.style < 0 ? 'Forced to play a style that is not his.' : 'Playing his own style.'}` : 'No head coach.' },
    { l: 'Morale', v: P.morale, note: `Average morale ${Math.round(P.moraleAvg)}.` },
    { l: 'Luck', v: g ? luck / Math.max(1, g) * 2 : 0, note: g ? `${me.pts} points from chances worth ${(G.ss.xpts || 0).toFixed(1)}.` : 'No games yet.' },
  ];
  if (qRank > target) { add('quality', qRank - target, `The squad is not good enough for the target. Squad and coaching together rank about ${ord(qRank)} in the division; finishing ${ord(target)} needs roughly a top-${target} squad, which is ${(topT - ours).toFixed(1)} points better per player.`);
    lv(`Loosen the Director of Football's fee and wage limits so he can buy better players.`, 'mand', 'dof'); lv('Raise the share of cash Finance releases for transfers.', 'mand', 'fin'); if (!(G.week <= 4 || (G.week >= 17 && G.week <= 19))) lv(`The next transfer window opens in week ${G.week < 17 ? 17 : 1}. Until then, only free agents.`, null); lv('Back scouting so the shortlist improves before the window.', 'push', 'scouting'); }
  if (co && man('coach', 'style') === 'dna' && co.style !== G.club.dna.style) { add('style', 2, `${co.name} is forced to play ${STYLES[G.club.dna.style].toLowerCase()} football, but his own style is ${STYLES[co.style].toLowerCase()}. That costs performance.`); lv('Let the coach play his own style (costs DNA alignment), or appoint a coach who fits the club style.', 'mand', 'coach'); }
  if (g >= 6 && xgd < expXgd - 0.3) { add('coach', 2, `The team underperforms its squad: xG difference ${xgd >= 0 ? '+' : ''}${xgd.toFixed(2)} per game where this squad should manage about ${expXgd >= 0 ? '+' : ''}${expXgd.toFixed(2)}. That points at the coaching.`); lv('Review the numbers with the coach (one-to-one).', 'talk', 'coach'); lv('Replace the coach if it does not improve.', 'tab', 'staff'); }
  if (P.moraleAvg < 55) { add('morale', 1, `Morale is low (${Math.round(P.moraleAvg)}). Results and unhappy players feed each other.`); lv('Back the first team for three weeks.', 'push', 'sporting'); lv('Praise or reassure the coach.', 'talk', 'coach'); }
  if (inj >= 3) { add('injuries', 1, `${inj} players injured.`); lv('Back the medical department.', 'push', 'medical'); if (!perk('sci')) lv('Approve a sports science unit at the next management meeting.', null); }
  if (g >= 5 && luck <= -4) add('luck', -1, `Bad luck: ${(-luck).toFixed(0)} points fewer than the chances created deserve. Performances are better than the table.`);
  if (g >= 5 && luck >= 4) add('luck+', 1, `Good fortune: ${luck.toFixed(0)} points more than the chances deserve. Expect results to drop unless performances improve.`);
  if (g >= 5 && luck <= -4) lv('Hold your nerve. Performances deserve more; drastic changes now are likely a mistake.', null);
  causes.sort((a, b) => b.sev - a.sev);
  return { pos, target, gap, g, fc: g ? forecast() : null, qRank, causes, levers, bars, behind: pos > target, xpts: G.ss.xpts || 0, pts: me.pts };
}
function scorecard() {
  const c = G.club, ss = G.ss, s0 = ss.start || {}, P = strengthParts(), g = ss.lg || 0;
  const others = G.divs[c.tier].clubs.filter(i => i !== 0).map(i => G.clubs[i].str), divAvg = others.reduce((a, b) => a + b, 0) / others.length;
  const inj = G.squad.filter(p => p.inj > 0).length, att = ss.attN ? ss.attSum / ss.attN : null, wr = wageRatio() * 100, cp = +man('fin', 'wageCap');
  const L = G.fin.last, runway = L && L.tin < L.tout ? Math.floor(c.cash / (L.tout - L.tin)) : null;
  const sig = (G.signLog || []).filter(x => x.season === G.season).map(x => G.squad.find(p => p.id === x.pid)).filter(p => p && p.st.apps >= 3), sa = squadAvgRat(), ar = sig.length ? sig.reduce((a, p) => a + avgRat(p), 0) / sig.length : null;
  const foc = ((c.net[man('scout', 'reg1')] || 0) + (c.net[man('scout', 'reg2')] || 0)) / 2;
  const ch = (G.signLog || []).map(x => ({ x, p: G.squad.find(p => p.id === x.pid) })).filter(o => o.p && o.x.est != null), acc = ch.length ? ch.reduce((a, o) => a + Math.abs(o.x.est - stars(o.p.ca)), 0) / ch.length : null;
  const pot = G.academy.length ? G.academy.reduce((a, p) => a + stars(p.pa), 0) / G.academy.length : 0;
  const S = (l, v, ref, ok) => ({ l, v, ref, ok });
  return [
    { k: 'first', t: 'First team', head: 'coach', rows: [S('Squad quality', P.squad.toFixed(1), `division average ${divAvg.toFixed(1)}`, P.squad >= divAvg + 0.3 ? true : P.squad < divAvg - 0.3 ? false : null), S('Points per game', g ? ((G.divs[c.tier].tab[0].w * 3 + G.divs[c.tier].tab[0].d) / g).toFixed(2) : '–', 'promotion pace about 2.0', null), S('xG difference per game', g ? ((ss.xgf - ss.xga) / g >= 0 ? '+' : '') + ((ss.xgf - ss.xga) / g).toFixed(2) : '–', 'above 0 is good', g ? (ss.xgf > ss.xga) : null), S('Injured', inj, perk('sci') ? 'sports science active' : 'no sports science unit', inj >= 3 ? false : null), S('Training ground', `level ${c.fac.train}`, 'out of 10', null)] },
    { k: 'recruit', t: 'Recruitment', head: 'dof', rows: [S('Transfer budget', money(transferBudget()), 'set by Finance', null), S('Signings rated vs squad', ar ? `${ar.toFixed(2)} vs ${sa.toFixed(2)}` : '–', 'higher is better', ar ? ar >= sa : null), S('Scouting network, focus', `${Math.round(foc)} / 100`, `${REGIONS[man('scout', 'reg1')].name}, ${REGIONS[man('scout', 'reg2')].name}`, foc >= 40 ? true : foc < 15 ? false : null), S('Scouting accuracy', acc == null ? '–' : `±${acc.toFixed(1)}★`, perk('data') ? 'data department active' : 'no data department', acc == null ? null : acc <= 0.5), S('Shortlist', `${(G.shortlist || []).length} players`, '', null)] },
    { k: 'academy', t: 'Academy', head: 'acad', rows: [S('Facilities', `level ${c.fac.youth}`, 'out of 10', null), S('Prospects', G.academy.length, `next intake week 28`, null), S('Average potential', pot ? pot.toFixed(1) + '★' : '–', 'relative to your division', null), S('Debuts this season', ss.grads, '', null)] },
    { k: 'commercial', t: 'Commercial', head: 'com', rows: [S('Sponsorship', money(sponsorIncome()) + '/wk', s0.spons ? `${money(s0.spons)}/wk at season start` : '', s0.spons ? sponsorIncome() >= s0.spons : null), S('Stadium fill', att == null ? '–' : Math.round(att * 100) + '%', `${c.cap.toLocaleString('en-GB')} seats`, att == null ? null : att >= 0.85 ? true : att < 0.45 ? false : null), S('Ticket price', money(ticketPrice()), perk('ticket') ? 'dynamic pricing' : '', null), S('Merchandise', L ? money(L.i.merch || 0) + '/wk' : '–', perk('store') ? 'megastore open' : '', null)] },
    { k: 'marketing', t: 'Marketing', head: 'mkt', rows: [S('Supporter base', c.fanbase.toLocaleString('en-GB'), s0.fanbase ? `${s0.fanbase.toLocaleString('en-GB')} at season start` : '', s0.fanbase ? c.fanbase >= s0.fanbase : null), S('Brand strength', Math.round(c.brand), s0.brand != null ? `${Math.round(s0.brand)} at season start` : '', s0.brand != null ? c.brand >= s0.brand : null), S('Supporter mood', Math.round(G.st.fans), 'below 35 means protests', G.st.fans >= 60 ? true : G.st.fans < 35 ? false : null)] },
    { k: 'business', t: 'Business', head: 'fin', rows: [S('Player wages vs revenue', Math.round(wr) + '%', `cap ${cp}%`, wr <= cp), S('Last week', L ? (L.tin - L.tout >= 0 ? '+' : '') + money(L.tin - L.tout) : '–', '', L ? L.tin >= L.tout : null), S('Cash runway', runway == null ? 'Not burning cash' : `${runway} weeks`, 'at last week\'s burn', runway == null ? true : runway < 10 ? false : null), S('Debt', money(c.debt), c.debt ? `interest ${money(Math.round(c.debt * 0.0012))}/wk` : '', null)] },
  ];
}

/* ---------- weekly briefings (1.5) ---------- */
const BR = {};
function defineBrief(id, d) { d.id = id; BR[id] = d; }
function genBriefs() {
  if (HOOK.briefsEnd && G.briefs) HOOK.briefsEnd(G.briefs); // what happens to the briefs the CEO left (desk.js)
  G.bcd = G.bcd || {}; const cand = [];
  for (const d of Object.values(BR)) {
    if ((G.bcd[d.id] || 0) > absWeek()) continue; if (d.role && ROLE[d.role] && !staff(d.role)) continue;
    let c; try { c = d.check(); } catch (e) { c = null; } if (!c) continue;
    cand.push({ d, c, sc: (c.score || 1) + rnd() * 0.5 });
  }
  cand.sort((a, b) => b.sc - a.sc); const used = new Set(), out = [];
  for (const x of cand) { if (out.length >= 3) break; const key = x.d.role || x.d.id; if (used.has(key)) continue; used.add(key); out.push(x); }
  G.briefs = out.map(x => { G.bcd[x.d.id] = absWeek() + (x.d.cd || 4); return { id: uid(), t: x.d.id, ctx: x.c, done: false, out: null }; });
  if (HOOK.deskBriefs) HOOK.deskBriefs(G.briefs);
}
function briefView(b) {
  const d = BR[b.t], c = b.ctx, val = v => { try { return typeof v === 'function' ? v(c) : v; } catch (e) { return ''; } };
  const role = d.role || (c && ROLE[c.role] ? c.role : null) || (d.face ? val(d.face) : null); return { role, who: d.who ? val(d.who) : ROLE[role] ? staffName(role) + ', ' + ROLE[role].s : 'Office of the CEO', why: b.why || null, del: !!b.del, by: b.by || null, title: val(d.title), text: val(d.text), opts: d.opts.map(o => ({ l: val(o.l), h: val(o.h) })), done: b.done, out: b.out, choice: b.choice };
}
function answerBrief(id, i) {
  if (over()) return { err: 'You no longer run the club.' };
  const b = (G.briefs || []).find(x => x.id === id); if (!b || b.done) return null; const o = BR[b.t].opts[i];
  if (o.ap && G.ap < 1) return { err: 'No action points left this week.' }; if (o.ap) G.ap--;
  let r = ''; try { r = o.f(b.ctx) || 'Noted.'; } catch (e) { r = 'Noted.'; } b.done = true; b.choice = i; b.out = r; return { out: r };
}

