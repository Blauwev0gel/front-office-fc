/* The Front Office · the CEO's desk
   Departments decide routine matters themselves, inside the authority the CEO gives each head.
   Only escalations reach the CEO: over the limit, a top player, the club's name, a cold or weak head,
   a short leash. Plus the matters that are always the CEO's: conflicts between departments, the board,
   supporters, the press, and conversations with the heads themselves. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, chance, pick, staff, eff, money, M, ROLE, man } = F;

const AUTH = [
  { t: 'Short leash', s: 'Anything with money or a player in it comes to you. Few mistakes, a full inbox.' },
  { t: 'Normal', s: 'Decides routine matters. Escalates money, big names and risk.' },
  { t: 'Free hand', s: 'Decides almost everything. A bold head takes real gambles; mistakes weigh heavier.' }];
const HEADS = ['coach', 'dof', 'acad', 'com', 'mkt', 'fin'];
const DNAME = { coach: 'the first team', dof: 'recruitment', acad: 'the academy', com: 'commercial', mkt: 'marketing', fin: 'finance' };
const DSHORT = { coach: 'First team', dof: 'Recruitment', acad: 'Academy', com: 'Commercial', mkt: 'Marketing', fin: 'Finance' };
const headOf = r => r === 'scout' ? 'dof' : r;
const LIM = { coach: 900, dof: 1500, acad: 900, com: 2200, mkt: 900, fin: 1600 };
const LIMF = [0.4, 1, 2.5];

// always the CEO's call
const CORE = new Set(['pl_hunch', 'pl_bet_settled', 'pl_agent', 'squad_plan_policy', 'coach_authority', 'coach_poached', 'coach_dof_clash', 'com_mkt_clash', 'grad_minutes', 'style_drift', 'naming_rights', 'rebrand', 'documentary', 'cash_crisis', 'fin_alarm', 'wage_cap', 'stand_objection', 'exception_review', 'rec_exception', 'dof_rule', 'star_unrest', 'acad_welfare', 'clash_tour', 'clash_budget', 'clash_prospect', 'clash_event']);
const CLASH = new Set(['coach_dof_clash', 'com_mkt_clash', 'grad_minutes', 'clash_tour', 'clash_budget', 'clash_prospect', 'clash_event']);
// core, unless a strong head has a free hand: exceptions to his own rules
const SOFT = new Set(['wage_cap', 'star_unrest', 'exception_review', 'rec_exception', 'dof_rule', 'acad_welfare', 'style_drift']);
// could hurt the club's name
const REP = new Set(['bet_sponsor', 'doc_episode', 'transfer_request', 'wonderkid', 'acad_release', 'player_ego']);
// briefs that stay with the CEO; every other staff brief is routine
const CEO_B = new Set(['squad_plan_update', 'big_game', 'stake_match', 'pre_box', 'staff_distant', 'chairman_call', 'block_opening', 'block_autumn', 'block_winter', 'block_runin', 'block_finale', 'biz_budget', 'biz_review', 'biz_refi', 'winter_deadline', 'one_free', 'one_rein', 'one_leash', 'ac_trial']);

function auth(r) { const G = g(); G.auth = G.auth || {}; const h = headOf(r); return G.auth[h] == null ? 1 : G.auth[h]; }
function setAuth(r, v) { const G = g(); G.auth = G.auth || {}; if (!HEADS.includes(r)) return { err: 'Unknown department.' }; const old = auth(r); v = clamp(+v, 0, 2); if (old === v) return { out: '' }; G.auth[r] = v; const s = staff(r);
  if (s) { if (v > old) s.rel = clamp(s.rel + 2, 0, 100); else s.rel = clamp(s.rel - (s.p.ego > 12 ? 4 : 2), 0, 100); }
  return { out: s ? `${s.name}: ${AUTH[v].t.toLowerCase()}. ${v > old ? 'He takes it as a sign of trust.' : s.p.ego > 12 ? 'He does not like it.' : 'He accepts it.'}` : `${DSHORT[r]}: ${AUTH[v].t.toLowerCase()}.` }; }
function limit(h, a) { return M(LIM[h] || 1200) * LIMF[a]; }
function amtOf(c) { if (!c) return 0; const n = v => (typeof v === 'number' && isFinite(v) ? v : 0); return Math.max(n(c.wk), n(c.ask) - n(c.cur), n(c.cost) / 20, n(c.cash) / 20, n(c.fee) / 20, n(c.bid) / 20); }
function top3(pid) { const sq = g().squad.slice().sort((a, b) => b.ca - a.ca).slice(0, 3); return sq.some(p => p.id === pid); }
/* B54: how a head carries out a call. He always takes the option his mandate points to; what varies is how well it turns out.
   A risk-taker with a free hand goes for more and it can pay off or backfire; a weak head misjudges more often; a careful one rarely.
   Competence is measured against the division. All of it is seeded and every outcome names its cause. */
function carry(h) {
  const s = staff(h), a = auth(h), c = lvl(h), P = s.p || {}, n = first(s);
  if (a === 2 && P.risk >= 13) return chance(clamp(0.45 + c * 0.06, 0.2, 0.85)) ? { k: 'win', why: `${n} went for more than the safe option: he likes a gamble, and it paid off.` } : { k: 'err', why: `${n} gambled with the free hand you gave him, and it backfired.` };
  const p = clamp((4 - c) * 0.035, 0, 0.18) * [0.6, 1, 1.3][a] * (P.risk <= 7 ? 0.6 : 1);
  return chance(p) ? { k: 'err', why: c < 1 ? `${n} misjudged it: he is short of the level this division asks.` : `${n} misjudged it.` } : { k: 'ok', why: '' };
}
const lvl = (h, i) => eff(h, i) - F.tierAvg(g().club.tier); // strength relative to the division
const first = s => s ? s.name.split(' ')[0] : 'Nobody';

// why does this reach the CEO? 'core' = always; a sentence = escalated; null = the department decides
function reason(e, c) {
  const r = e.from; if (!ROLE[r]) return 'core';
  const h = headOf(r), s = staff(h), a = auth(h);
  if (SOFT.has(e.id) && s && a === 2 && lvl(h) >= 5) { /* trusted to handle it */ }
  else if (CORE.has(e.id) || e.ceo) return 'core';
  if (!s) return `Nobody runs ${DNAME[h] || 'that department'}, so it lands on your desk.`;
  const amt = amtOf(c), lim = limit(h, a);
  if (amt > lim) return `${money(amt)} a week is above what ${first(s)} may sign off alone (${money(lim)} at ${AUTH[a].t.toLowerCase()}).`;
  if (c && c.pid && top3(c.pid) && a < 2) return `It involves one of our three best players. ${first(s)} wants your view first.`;
  if (REP.has(e.id) && (a === 0 || (a === 1 && lvl(h) < 4))) return `It could hurt the club's name. ${first(s)} will not take that risk without you.`;
  // B54: no escalations on a coin flip; each has a reason the CEO can change
  if (a === 0 && (amt > 0 || (c && c.pid))) return `${first(s)} is on a short leash: anything with money or a player in it comes to you.`;
  if (s.rel < 35 && amt > lim * 0.4) return `${first(s)} wants your cover on money like this. Your relationship is cold (${Math.round(s.rel)}).`;
  if (lvl(h) < 1 && a < 2 && amt > lim * 0.5) return `${first(s)} is out of his depth with this much money and passes it up.`;
  return null;
}
function coreWhy(e) {
  if (e.why) return null;
  if (CLASH.has(e.id)) return 'Two departments want different things. Only the CEO can settle it.';
  if (e.from === 'board') return 'The board wants the CEO\'s answer, not a department\'s.';
  if (e.from === 'fans') return 'Supporters want to hear it from the CEO.';
  if (e.from === 'press') return 'The press want the CEO, not a spokesman.';
  return 'Strategy, big money or the club\'s name. This is a CEO call.';
}
function log(h, err, t, c) { const G = g(); G.desk = G.desk || { n: 0, err: 0, by: {} }; G.desk.n++; if (err) G.desk.err++; const b = G.desk.by[h] = G.desk.by[h] || { n: 0, err: 0, errW: [] }; b.n++; if (err) { b.err++; b.errW.push(F.absWeek()); b.errW = b.errW.slice(-6); }
  if (t && !/^(noted|nothing to add|ok|fine)\b/i.test(c || '')) { b.hist = (b.hist || []).concat([{ w: G.week, s: G.season, t, c: c || '', err: err ? 1 : 0 }]).slice(-8); } } // the last calls, for the department's Record
const txt = (x, c) => { try { return typeof x === 'function' ? x(c) : (x || ''); } catch (er) { return ''; } };
function gain(h) { const G = g(), s = staff(h); G.board.conf = Math.min(100, G.board.conf + 0.5); if (s) s.perf = clamp((s.perf || 50) + 1, 0, 100); }
function slip(h) { const a = auth(h), k = a === 2 ? 1.5 : 1; const G = g(); G.club.drift += Math.round(2 * k); if (a === 2) { G.board.conf = clamp(G.board.conf - 1, 0, 100); G.st.fans = clamp(G.st.fans - 1, 0, 100); } }

/* ---------- messages ---------- */
H.desk = (e, m) => {
  const why = reason(e, m.ctx);
  if (why === 'core') { const w = coreWhy(e); if (w) m.why = w; return; }
  if (why) { m.why = why; m.esc = 1; return; }
  const h = headOf(e.from), s = staff(h);
  const idx = F.autoIndex(m), how = carry(h), err = how.k === 'err' ? 1 : 0;
  m.del = 1; m.err = err; m.authAt = auth(h);
  const n0 = g().paper.stories.length;
  F.resolve(m, idx, s.name);
  const st = g().paper.stories[n0]; if (st) { st.auto = 1; st.h = `${DSHORT[h]} handled it${err ? ', badly' : how.k === 'win' ? ', boldly' : ''}`; if (how.why) st.t = `${st.t} ${how.why}`; }
  if (err) slip(h); else if (how.k === 'win') gain(h);
  if (how.why) m.outcome = `${m.outcome || ''} ${how.why}`.trim();
  const ev = F.EV[m.ev] || {}; log(h, err, txt(ev.title, m.ctx), txt((ev.opts || [])[idx] && ev.opts[idx].l, m.ctx) + (how.why ? ` (${how.why})` : ''));
};

/* ---------- briefs ---------- */
const BAUTO = {
  scout_dry: 1, coach_slump: 0, coach_flying: 0, injury_blow: () => F.finTight && F.finTight() ? 1 : 0, form_player: 1,
  fin_wage: () => man('fin', 'risk') < 40 ? 0 : 1, fin_runway: 0, sellout: 1, project_check: 1,
  youth_cup: () => man('acad', 'philosophy') > 50 ? 0 : 1, school_report: () => man('acad', 'welfare') > 55 ? 0 : 1, scouts_watching: 1,
  rec_blocked: 1, mk_viral: () => man('mkt', 'tone') > 50 ? 0 : 1, mk_fans: 1, ac_ready: () => man('acad', 'pace') > 55 ? 0 : 1, ac_trial: 0,
  com_offer: () => { const o = F.comView && F.comView().X.offer; if (!o) return 2; if (/bet/i.test(o.sect || '') && man('com', 'betting') === 'ban') return 2; return lvl('com', 2) >= 6 ? 1 : 0; },
};
function briefAmt(b) { if (b.t === 'com_offer') { const o = F.comView && F.comView().X.offer; return o ? o.wk : 0; } return amtOf(b.ctx); }
H.deskBriefs = list => {
  if (F.squadPlanDelivered) for (const b of list) if (b.t === 'squad_plan_update') F.squadPlanDelivered(b.ctx.revision);
  for (const b of list) {
    const d = F.BR[b.t]; if (!d || CEO_B.has(b.t) || !d.role || !ROLE[d.role]) continue;
    const h = headOf(d.role), s = staff(h); if (!s) continue; const a = auth(h);
    const amt = briefAmt(b), lim = limit(h, a);
    if (amt > lim) { b.why = `${money(amt)} a week is above what ${first(s)} may sign off alone (${money(lim)} at ${AUTH[a].t.toLowerCase()}).`; continue; }
    if (a === 0 && amt > 0) { b.why = `${first(s)} is on a short leash: anything with money in it comes to you.`; continue; }
    const x = BAUTO[b.t]; let idx = x == null ? d.opts.length - 1 : typeof x === 'function' ? (() => { try { return x(); } catch (er) { return d.opts.length - 1; } })() : x;
    idx = clamp(idx, 0, d.opts.length - 1);
    let r = ''; try { r = d.opts[idx].f(b.ctx) || 'Noted.'; } catch (er) { r = 'Noted.'; }
    b.done = true; b.choice = idx; b.out = r; b.del = 1; b.by = s.name; log(h, 0, txt(d.title, b.ctx), txt(d.opts[idx].l, b.ctx));
  }
};

/* ---------- authority over time ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  for (const h of HEADS) { const s = staff(h); if (!s) continue; const a = auth(h);
    if (a === 2 && s.p.ego >= 10) s.rel = clamp(s.rel + 0.2, 0, 100);
    if (a === 0 && s.p.ego >= 12) s.rel = clamp(s.rel - 0.35, 0, 100); }
};
const prevEff = H.effBonus;
H.effBonus = (r, i) => { let b = prevEff ? prevEff(r, i) : 0; const h = headOf(r), s = staff(h); if (!s || !HEADS.includes(h)) return b; const a = auth(h);
  if (a === 2 && s.rel >= 50) b += 0.8; if (a === 0 && s.p.ego >= 12) b -= 0.8; return b; }; // B54: the right freedom for the right head

/* ---------- conflicts between departments ---------- */
const E = F.defineEvent, rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const both = (a, b) => staff(a) && staff(b);
E('clash_tour', { from: 'com', dept: 'commercial', cd: 40, ceo: 1, w: () => 0.8,
  cond: () => both('com', 'coach') && g().week >= 14 && g().week <= 22,
  setup: () => ({ cash: M(4000) }),
  title: 'A winter tour: money or rest?',
  body: c => `"A ${money(c.cash)} invitation to play two friendlies abroad," says ${first(staff('com'))}. "${first(staff('coach'))} says the squad needs rest, not airports."`,
  opts: [
    { l: 'Back Commercial: we go', h: c => `+${money(c.cash)} · brand ↑ · coach ↓ · tired legs`, f: c => { const G = g(); G.club.cash += c.cash; G.club.brand = clamp(G.club.brand + 3, 0, 100); rel('coach', -6); rel('com', 4); G.squad.forEach(p => p.morale = clamp(p.morale - 3, 0, 100)); return 'The squad flies out. The coach does not hide his mood.'; } },
    { l: 'Back the coach: we rest', h: 'Commercial ↓ · squad fresh', f: () => { rel('com', -5); rel('coach', 3); g().squad.forEach(p => p.morale = clamp(p.morale + 2, 0, 100)); return 'The invitation is declined. Commercial grumbles about money left on the table.'; } },
    { l: 'One game, short trip', h: c => `+${money(Math.round(c.cash * 0.4))} · both a little unhappy`, f: c => { g().club.cash += Math.round(c.cash * 0.4); rel('com', -1); rel('coach', -1); return 'A compromise neither of them likes, which may mean it is fair.'; } }],
  auto: () => 1 });
E('clash_budget', { from: 'fin', dept: 'business', cd: 40, ceo: 1, w: () => 0.9,
  cond: () => both('fin', 'dof') && g().week >= 13 && g().week <= 17,
  setup: () => ({}),
  title: 'Recruitment wants more, Finance says no',
  body: () => `${first(staff('dof'))} wants a bigger share of cash for the winter window. ${first(staff('fin'))} says the runway cannot take it.`,
  opts: [
    { l: 'Back Recruitment', h: 'Transfer share ↑ · Finance ↓', f: () => { const m = g().mand.fin; m.transfer = clamp((m.transfer == null ? 50 : m.transfer) + 25, 0, 100); rel('fin', -6); rel('dof', 5); return 'Finance releases more money for transfers, under protest.'; } },
    { l: 'Back Finance', h: 'Cash protected · Recruitment ↓', f: () => { rel('dof', -6); rel('fin', 4); return 'No extra money. The DoF works with what he has.'; } },
    { l: 'Loans and free agents only', h: 'Both a little unhappy', f: () => { const m = g().mand.dof; m.maxFee = '0'; rel('dof', -2); rel('fin', 1); return 'The DoF can add players this winter, but only without fees.'; } }],
  auto: () => 1 });
E('clash_prospect', { from: 'dof', dept: 'sporting', cd: 50, ceo: 1, w: () => 0.7,
  cond: () => both('dof', 'acad') && g().week >= 6 && g().academy.some(p => p.age >= 17 && p.pa >= F.tierAvg(g().club.tier) + 2),
  setup: () => { const p = g().academy.filter(p => p.age >= 17).sort((a, b) => b.pa - a.pa)[0]; return p ? { pid: p.id, name: p.name, fee: Math.round(M(9000) * (1 + (p.pa - F.tierAvg(g().club.tier)) * 0.25) / 500) * 500 } : null; },
  title: c => `Sell ${c.name}?`,
  body: c => `A bigger club bids ${money(c.fee)} for ${c.name}. ${first(staff('dof'))}: "Take it." ${first(staff('acad'))}: "He is the future of this club."`,
  opts: [
    { l: 'Sell him', h: c => `+${money(c.fee)} · academy ↓`, f: c => { const G = g(), i = G.academy.findIndex(p => p.id === c.pid); if (i < 0) return 'He has already moved on.'; G.academy.splice(i, 1); G.club.cash += c.fee; rel('acad', -8); rel('dof', 3); G.st.fans = clamp(G.st.fans - 2, 0, 100); return `${c.name} leaves. The academy staff take it personally.`; } },
    { l: 'Keep him', h: 'Recruitment ↓ · academy ↑', f: c => { rel('dof', -4); rel('acad', 5); const p = g().academy.find(p => p.id === c.pid); if (p) p.morale = clamp((p.morale || 60) + 10, 0, 100); return `${c.name} stays. The academy feels backed.`; } }],
  auto: () => 1 });
E('clash_event', { from: 'mkt', dept: 'marketing', cd: 40, ceo: 1, w: () => 0.7,
  cond: () => both('mkt', 'coach') && g().week >= 4,
  setup: () => ({}),
  title: 'Players at a fan event, or training?',
  body: () => `${first(staff('mkt'))} has promised supporters a community day with the players. ${first(staff('coach'))} wants that afternoon on the training pitch.`,
  opts: [
    { l: 'Back Marketing', h: 'Fans ↑ · coach ↓', f: () => { const G = g(); G.st.fans = clamp(G.st.fans + 4, 0, 100); G.club.fanbase = Math.round(G.club.fanbase * 1.01); rel('coach', -4); rel('mkt', 3); return 'The players sign shirts all afternoon. The coach trains in the dark.'; } },
    { l: 'Back the coach', h: 'Marketing ↓ · fans ↓', f: () => { g().st.fans = clamp(g().st.fans - 1, 0, 100); rel('mkt', -4); rel('coach', 2); return 'The event goes ahead without players. Some supporters are disappointed.'; } },
    { l: 'Send two players', h: 'Fans ↑ a little', f: () => { g().st.fans = clamp(g().st.fans + 2, 0, 100); return 'Two players go. Everyone gets something.'; } }],
  auto: () => 1 });

/* ---------- conversations with the heads ---------- */
const B = F.defineBrief;
const pickHead = f => { const c = HEADS.filter(h => staff(h) && f(h, staff(h))); return c.length ? pick(c) : null; };
B('one_free', { role: null, cd: 8,
  check: () => { const h = pickHead((h, s) => auth(h) < 2 && lvl(h) >= 4 && s.rel >= 50 && s.p.amb >= 9 && g().week >= 5); return h ? { role: h, name: staff(h).name, score: 1.6 } : null; },
  title: c => `${c.name} wants a free hand`,
  text: c => `"I know ${DNAME[c.role]}. Let me decide more without checking with you first." Strong heads make fewer mistakes, but they want room.`,
  opts: [
    { l: 'Give him a free hand', h: 'Fewer questions · relationship ↑', f: c => { setAuth(c.role, 2); rel(c.role, 5); return 'He leaves the room taller.'; } },
    { l: 'Not yet', h: 'Relationship ↓', f: c => { const s = staff(c.role); rel(c.role, s && s.p.amb > 14 ? -6 : -3); return '"Fine." He does not hide the disappointment.'; } },
    { l: 'Prove it for a season first', h: '', f: c => { rel(c.role, 1); return 'He accepts the challenge.'; } }] });
B('one_rein', { role: null, cd: 6,
  check: () => { const D = (g().desk || {}).by || {}, now = F.absWeek(); const h = pickHead(h => auth(h) === 2 && D[h] && D[h].errW.filter(w => now - w <= 6).length >= 2); return h ? { role: h, name: staff(h).name, score: 2 } : null; },
  title: c => `${c.name} keeps getting it wrong`,
  text: c => `Two calls in six weeks went against your mandate. He has a free hand over ${DNAME[c.role]}.`,
  opts: [
    { l: 'Rein him in', h: 'Back to normal · relationship ↓', f: c => { setAuth(c.role, 1); return 'He takes the step back without a word.'; } },
    { l: 'Back him in public', h: 'Relationship ↑ · board ↓', f: c => { rel(c.role, 5); g().board.conf = clamp(g().board.conf - 1, 0, 100); return 'He is grateful. The board raises an eyebrow.'; } },
    { l: 'A sharp warning', h: 'Sharper for a month · relationship ↓', f: c => { const s = staff(c.role); if (s) { s.boost = clamp(s.boost + 3, -10, 12); s.boostW = 4; } rel(c.role, -3); return 'Message received.'; } }] });
B('one_leash', { role: null, cd: 8,
  check: () => { const h = pickHead((h, s) => auth(h) === 0 && s.p.ego >= 12 && g().week >= 4); return h ? { role: h, name: staff(h).name, score: 1.8 } : null; },
  title: c => `${c.name} feels watched`,
  text: c => `"You hired me to run ${DNAME[c.role]}. Let me run it." He is on a short leash and his ego is bruised.`,
  opts: [
    { l: 'Loosen the leash', h: 'Normal authority · relationship ↑', f: c => { setAuth(c.role, 1); rel(c.role, 3); return 'He relaxes visibly.'; } },
    { l: 'My club, my rules', h: 'Relationship ↓', f: c => { rel(c.role, -5); return 'A cold silence.'; } },
    { l: 'Explain why', h: 'Relationship ↑ a little', f: c => { rel(c.role, 2); return 'He does not agree, but he understands.'; } }] });

function deskView() {
  const G = g(), wk = G.week, se = G.season;
  const msgs = G.inbox.filter(m => m.del && m.season === se && m.week === wk), br = (G.briefs || []).filter(b => b.del);
  return { n: msgs.length + br.length, err: msgs.filter(m => m.err).length, total: (G.desk || {}).n || 0 };
}
function authView(h) { const s = staff(h), a = auth(h); return { a, t: AUTH[a].t, s: AUTH[a].s, opts: AUTH.map(x => x.t), lim: limit(h, a), err: Math.round(errChance(h) * 100), rec: ((G => G.desk && G.desk.by[h])(g())) || { n: 0, err: 0 }, head: s }; }

Object.assign(F, { AUTH, setAuth, authView, deskView, deskCarry: carry, deskReason: reason, DESK_HEADS: HEADS, deskLimit: r => limit(headOf(r), auth(r)), deskNote: (r, t, c, err) => log(headOf(r), err ? 1 : 0, t, c) });
})(FO);
