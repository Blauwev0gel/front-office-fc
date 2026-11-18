/* The Front Office · talks with the heads
   One conversation engine for every head (B19). A head asks for a word when something needs the CEO
   ("wants a word"), or the CEO opens a talk. Short scenes: he says his piece, you answer, the answer
   has a consequence. Leave a request for two weeks and he decides himself, within his mandate.
   The head coach keeps his own scenes (firstteam.js); this engine opens them for him. Talks are free. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, chance, money, staff, man } = F;
const HEADS = ['coach', 'dof', 'scout', 'acad', 'com', 'mkt', 'fin'];
const DEPT = { coach: 'first', dof: 'recruit', scout: 'recruit', acad: 'academy', com: 'commercial', mkt: 'marketing', fin: 'business' };
const WAIT = 2; // weeks a request waits before the head decides himself
const first = r => { const s = staff(r); return s ? s.name.split(' ')[0] : 'He'; };
const HEAD = { first: 'coach', recruit: 'dof', academy: 'acad', commercial: 'com', marketing: 'mkt', business: 'fin' };
// what the head proposes when things go badly, from the department's real state
function fixFor(dk) {
  const it = (F.deptAttention ? F.deptAttention(dk) : [])[0], G = g(); if (!it) return { cause: '' };
  const cause = it.t, lv = F.deptBudView ? (F.deptBudView().rows.find(r => r.k === dk) || {}).v : 50;
  if (it.a === 'dept' && it.x === 'recruit') return { cause, kind: 'squad', l: 'I will talk to the DoF' };
  if (it.a === 'plan' && F.rxView) { const m = F.rxView().regions.find(r => r.focus === 1); return m && !F.rxView().investIn ? { cause, kind: 'trip', rk: m.k, reg: m.t, l: `Send the scouts to ${m.t}` } : { cause }; }
  if (it.a === 'people' && lv != null && lv < 50) return { cause, kind: 'budget', dk, l: 'Raise the budget so he can add staff' };
  if (it.a === 'mand' && it.x === 'acad' && +man('acad', 'budget') < 40) return { cause, kind: 'budget', dk: 'academy', l: 'Back to a normal academy budget' };
  if (it.a === 'mand' && it.x === 'fin') return { cause, kind: 'cap', l: 'Raise the wage cap one step' };
  if (it.a === 'mand' && it.x === 'dof' && G.rec) { const cnt = {}; G.rec.pipe.filter(x => x.blocked && G.rec.pool[x.pid]).forEach(x => x.blocked.filter(b => b !== 'wage cap').forEach(b => cnt[b] = (cnt[b] || 0) + 1)); const rule = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; return rule ? { cause, kind: 'loosen', rule, l: `Loosen the ${rule} one step` } : { cause }; }
  return { cause };
}

function C() { const G = g(); G.convo = G.convo || { cur: null, req: {}, last: {} }; return G.convo; }
const rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const boost = (r, b, w) => { const s = staff(r); if (s) { s.boost = clamp(s.boost + b, -10, 12); s.boostW = Math.max(s.boostW || 0, w || 4); } };

/* ---------- requests: the head asks for a word ---------- */
// k: what it is about; t: what he says; ctx: what the answers need
function ask(role, ctx) {
  if (!staff(role)) return; const X = C(); if (X.req[role]) return;
  X.req[role] = Object.assign({ at: F.absWeek(), t: reqText(role, ctx) }, ctx);
}
function reqText(role, c) {
  if (c.k === 'staff') return `I want to bring in ${c.name} as ${c.title.toLowerCase()}, ${c.why}. ${money(c.wage)} a week is above what I may sign off alone.`;
  if (c.k === 'rules') return `Your rules block ${c.n} of the players I want. The ${c.rule} is the problem.`;
  if (c.k === 'cap') return `The wage cap blocks ${c.n} target${c.n === 1 ? '' : 's'} the DoF wants. He has been on the phone to me.`;
  if (c.k === 'trip') return `Our network in ${c.reg} is thin. My reports are guesswork until we go and look.`;
  if (c.k === 'budget') return `The academy budget is down to almost nothing. The coaching levels are dropping.`;
  if (c.k === 'welfare') return `The kids are struggling. Welfare is at ${c.v}, and that is when they drop out.`;
  if (c.k === 'minutes') return `Our graduates hardly play: ${c.v}% of the first-team minutes. Without a pathway they stall or leave.`;
  if (c.k === 'squad') return `This squad is below the division average. I can only do so much with it.`;
  if (c.k === 'mandate') return `About the ${c.name}: I am doing it my way. I would rather we talked it through.`;
  if (c.k === 'ultimatum') return 'Two warnings. Either you back me, or you tell me to go. I would rather know where I stand.';
  if (c.k === 'cold') return `I do not feel backed. We should talk.`;
  if (c.k === 'verdict') return `${c.vt} ${c.cause || 'I know it is not good enough.'}${c.fix ? ' This is what I need from you.' : ''}`;
  return 'Have you got a minute?';
}
// what the head does if you never answer
function lapse(role, r) {
  const n = first(role);
  if (r.k === 'staff') { const G = g(); if (G.staffAsk) delete G.staffAsk[r.dk]; return `${n} shelved the idea of a ${r.title.toLowerCase()}.`; }
  if (r.k === 'cold') { rel(role, -3); return `${n} stopped asking. The silence says enough.`; }
  rel(role, -1); return `${n} waited for an answer and carried on as before.`;
}
function weekly() {
  const G = g(), X = C(), now = F.absWeek();
  for (const role of Object.keys(X.req)) {
    const r = X.req[role]; if (!staff(role)) { delete X.req[role]; continue; }
    if (now - r.at >= WAIT) { const out = lapse(role, r); if (F.deskNote) F.deskNote(role, `${first(role)} wanted a word`, out, 0); delete X.req[role]; X.last[role] = now; }
  }
  if (G.phase !== 'season') return;
  const att = k => (F.deptAttention ? F.deptAttention(k) : []);
  const fresh = role => staff(role) && !X.req[role] && now - (X.last[role] || -99) >= 3;
  // coach: mandate gap, a cold relationship, a squad below par
  if (fresh('coach') && F.ftView) { const v = F.ftView(), gap = v.rows.slice().sort((a, b) => Math.abs(b.d) - Math.abs(a.d))[0];
    if (gap && Math.abs(gap.d) >= 15) ask('coach', { k: 'mandate', name: gap.name });
    else if (staff('coach').rel < 35) ask('coach', { k: 'cold' });
    else if (att('first').some(x => x.a === 'dept')) ask('coach', { k: 'squad' }); }
  // recruitment: rules in the DoF's mandate, the wage cap (Finance), a thin network (scout)
  const rc = G.rec, blk = rc ? rc.pipe.filter(x => x.blocked && rc.pool[x.pid]) : [];
  const own = blk.filter(x => x.blocked.some(b => b !== 'wage cap')), cap = blk.filter(x => x.blocked.includes('wage cap'));
  if (fresh('dof') && own.length) { const cnt = {}; own.forEach(x => x.blocked.filter(b => b !== 'wage cap').forEach(b => cnt[b] = (cnt[b] || 0) + 1)); const rule = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; ask('dof', { k: 'rules', n: own.length, rule }); }
  else if (fresh('dof') && staff('dof').rel < 35) ask('dof', { k: 'cold' });
  if (fresh('fin') && cap.length) ask('fin', { k: 'cap', n: cap.length });
  if (fresh('scout') && F.rxView) { const R = F.rxView(), m = R.regions.find(r => r.focus === 1); if (m && m.net < 30 && !R.investIn) ask('scout', { k: 'trip', reg: m.t, rk: m.k }); }
  // academy: budget, welfare, minutes for graduates
  if (fresh('acad') && G.acad) { const b = +man('acad', 'budget'), wl = G.academy.length ? G.academy.reduce((a, p) => a + p.wel, 0) / G.academy.length : 70;
    const grads = G.squad.filter(p => p.academy && p.age <= 22), share = grads.length && G.week > 8 ? grads.reduce((a, p) => a + p.st.mins, 0) / grads.length / Math.max(1, (G.ss.lg || 1) * 90) : null;
    if (b < 25) ask('acad', { k: 'budget' }); else if (wl < 55) ask('acad', { k: 'welfare', v: Math.round(wl) }); else if (share != null && share < 0.2) ask('acad', { k: 'minutes', v: Math.round(share * 100) });
    else if (staff('acad').rel < 35) ask('acad', { k: 'cold' }); }
  for (const role of ['com', 'mkt', 'fin']) if (fresh(role) && staff(role).rel < 35) ask(role, { k: 'cold' });
  if (fresh('dof') && (G.dofStrikes || 0) >= 2) ask('dof', { k: 'ultimatum' });
  // a bad verdict is never silent: the head comes to explain it and says what he needs
  if (F.deptVerdict) for (const dk in HEAD) { const role = HEAD[dk]; if (!fresh(role)) continue; const V = F.deptVerdict(dk); if (V.st !== 'bad' || V.w === 'Vacant') continue; const fx = fixFor(dk); ask(role, { k: 'verdict', v: V.w, vt: V.t, cause: fx.cause, fix: fx.kind ? fx : null }); }
}
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => { if (prevAfter) prevAfter(ours); weekly(); };

/* ---------- the conversation ---------- */
const say = (who, t) => C().cur.log.push({ who, t });
const note = t => C().cur.fx.push(t);
function hasCause(role) { const G = g(), s = staff(role), errW = ((G.desk && G.desk.by[role === 'scout' ? 'dof' : role]) || {}).errW || []; return !!s && (s.perf < 45 || errW.some(w => w >= F.absWeek() - 4)); }
function common(role) {
  const c = hasCause(role), o = [{ id: 'back', t: 'You have my backing', fx: c ? 'Trust up' : 'Little effect while things go well' }, { id: 'push', t: 'I need more from you', fx: c ? 'Sharper, risk on trust' : 'Irritates him while things go well' }];
  if (!F.record(role).early) o.push({ id: 'review', t: 'Let us go through the numbers', fx: 'Depends on the numbers' });
  if ((staff(role) || {}).perf < 40) o.push({ id: 'warn', t: 'Results have to improve', fx: 'A warning' });
  const dk = DEPT[role]; if (F.deptVerdict && dk && HEAD[dk] === role && F.deptVerdict(dk).st === 'bad') o.unshift({ id: 'why', t: 'What is going wrong?', fx: 'He explains' });
  const tp = F.agrTopics ? F.agrTopics(role) : []; // CEO-1: a real topic first, when there is one
  return tp.concat(o).slice(0, 4);
}
function reqOpts(r) {
  if (r.k === 'staff') return [{ id: 'r_yes', t: `Hire ${r.name.split(' ')[0]}`, fx: `${money(r.fee)} now, ${money(r.wage)}/wk` }, { id: 'r_no', t: 'Not now', fx: 'He may be disappointed' }];
  if (r.k === 'rules') return [{ id: 'r_yes', t: `Loosen the ${r.rule} one step`, fx: 'More targets possible' }, { id: 'r_no', t: 'The rules stay', fx: 'Trust down a little' }];
  if (r.k === 'cap') return [{ id: 'r_yes', t: 'Raise the wage cap one step', fx: 'DoF ↑ · Finance ↓ · more risk' }, { id: 'r_no', t: 'Hold the line', fx: 'Finance ↑ · DoF ↓' }];
  if (r.k === 'trip') return [{ id: 'r_yes', t: `Send the scouts to ${r.reg}`, fx: `${money(Math.round(F.M(1500) / 100) * 100)}, network grows fast` }, { id: 'r_no', t: 'Not now', fx: '' }];
  if (r.k === 'budget') return [{ id: 'r_yes', t: 'Back to a normal budget', fx: 'Costs more each week' }, { id: 'r_no', t: 'We cannot afford it', fx: 'Trust down a little' }];
  if (r.k === 'welfare') return [{ id: 'r_yes', t: 'Protect the kids more', fx: 'Welfare up, development a little slower' }, { id: 'r_no', t: 'They have to be tough', fx: 'Trust down a little' }];
  if (r.k === 'minutes') return [{ id: 'r_yes', t: 'I will raise it with the coach', fx: 'Coach youth minutes +10 · coach ↓' }, { id: 'r_no', t: 'The coach picks the team', fx: 'Academy ↓' }];
  if (r.k === 'squad') return [{ id: 'r_yes', t: 'I will talk to the DoF', fx: 'Coach ↑ · DoF ↓' }, { id: 'r_no', t: 'Work with what you have', fx: 'Coach ↓' }];
  if (r.k === 'ultimatum') return [{ id: 'r_yes', t: 'I back you. Start again', fx: 'Trust up · warnings cleared' }, { id: 'r_no', t: 'Final warning', fx: 'He is sharper · trust down' }, { id: 'r_go', t: 'Part ways', fx: 'He leaves with his contract paid' }];
  if (r.k === 'verdict') return (r.fix ? [{ id: 'r_fix', t: r.fix.l, fx: 'What he asks for' }] : []).concat([{ id: 'back', t: 'You have my backing', fx: 'Trust up' }, { id: 'push', t: 'It has to improve, fast', fx: 'Sharper, risk on trust' }]);
  return [];
}
function open(role, fromReq) {
  const G = g(), s = staff(role); if (!s) return { err: 'That position is vacant.' };
  const X = C(), r = fromReq ? X.req[role] : null;
  if (role === 'coach') { const out = F.ftTalkStart(); if (r) { delete X.req.coach; X.last.coach = F.absWeek(); } return out; }
  if (X.cur && !X.cur.done) return {};
  G.talks = G.talks || {}; const recent = (G.talks[role] || -99) > F.absWeek() - 3; G.talks[role] = F.absWeek();
  X.cur = { role, log: [], opts: [], fx: [], done: false, k: recent ? 0.5 : 1, req: r ? Object.assign({}, r) : null };
  if (r) { delete X.req[role]; X.last[role] = F.absWeek(); say(role, r.t); X.cur.opts = reqOpts(r); if (!X.cur.opts.length) X.cur.opts = common(role); }
  else { say(role, s.p.ego > 14 ? 'Make it quick. I have a department to run.' : 'Come in. What is on your mind?'); X.cur.opts = common(role); }
  return { fresh: !recent };
}
function answer(id) {
  const X = C(), T = X.cur; if (!T || T.done) return;
  if (T.role === 'coach') return;
  const role = T.role, s = staff(role); if (!s) { T.done = true; return; }
  const opt = T.opts.find(o => o.id === id); if (!opt) return; say('you', opt.t);
  const P = s.p, k = T.k, G = g(), n = first(role), r = T.req;
  // B54: backing or pushing only moves a head when there is a reason: a request, a poor run, or a recent mistake by his department
  const cause = !!r || hasCause(role);
  const R = v => { rel(role, v * k); if (v) note(`Trust ${v > 0 ? '+' : '−'}${Math.abs(Math.round(v * k))}`); }, B = (v, w) => { boost(role, v * k, w); if (v) note(v > 0 ? `${n} fired up` : `${n} deflated`); };
  const end = (t, c) => { T.done = true; T.opts = []; if (F.deskNote) F.deskNote(role, r ? `${n} wanted a word` : `Talk with ${n}`, `You: ${opt.t}.`, 0); };
  if (F.agrAnswer && /^(t_|a_|i_|b_)/.test(id) && F.agrAnswer(id, T, say, note)) { if (!T.opts.length) end(); return; } // CEO-1 topics (agreements.js)
  switch (id) {
    case 'back': if (!cause) { say(role, P.ego > 13 ? 'I know. Was there something else?' : 'Thanks. Nothing has changed, then.'); break; } if (s.perf < 45) { say(role, 'That means a lot right now.'); R(5); B(3); } else if (P.ego > 13) { say(role, 'Good. Then let me get on with it.'); R(3); B(-1); } else { say(role, 'Appreciated. We keep building.'); R(4); B(1); } break;
    case 'push': if (!cause) { say(role, P.ego >= 13 ? 'More? Things are going well. Look at the numbers.' : 'I will try, but I am not sure what you want changed.'); R(P.ego >= 13 ? -3 : -1); break; } if (P.amb >= 12) { say(role, 'Good. So do I. Watch this space.'); R(-1); B(7, 5); } else if (P.ego >= 13) { say(role, 'With respect, I know my job.'); R(-8); B(-2); } else { say(role, 'Understood. I will push harder.'); R(-3); B(3); } break;
    case 'review': { const rc = F.record(role); if (rc.score >= 62) { say(role, `The numbers back me up. ${rc.verdict}.`); R(6); B(5); } else if (rc.score <= 40) { say(role, P.ego > 15 ? 'I dispute half of those figures. But fine, I will react.' : 'Hard to argue with that. I will fix it.'); R(P.ego > 15 ? -6 : -2); B(6); } else { say(role, 'Mixed. I know.'); R(1); B(2); } break; }
    case 'warn': if (s.perf < 40) { say(role, 'Message received.'); R(-6); B(6); if (P.loy < 8 && s.rel < 40 && chance(0.4)) F.queueEvent('staff_quit', { role }); } else { say(role, 'That is not fair, and you know it.'); R(-10); B(-1); } break;
    case 'why': { const dk = DEPT[role], V = F.deptVerdict(dk), fx = fixFor(dk); say(role, `${V.t} ${fx.cause || 'Honestly, a bit of everything.'}`); T.req = { k: 'verdict', fix: fx.kind ? fx : null };
      T.opts = (fx.kind ? [{ id: 'r_fix', t: fx.l, fx: 'What he asks for' }] : []).concat([{ id: 'back', t: 'You have my backing', fx: 'Trust up' }, { id: 'push', t: 'It has to improve, fast', fx: 'Sharper, risk on trust' }]); return; }
    case 'r_fix': { const fx = r.fix; if (!fx) break;
      if (fx.kind === 'squad') { say(role, 'Good. Tell him what I need.'); R(3); rel('dof', -2); if (F.recPlanSuggest) { const pos = (F.recPlanSuggest()[0] || {}).pos; if (pos) F.recPrioritise(pos); } note('DoF told to find a player'); }
      if (fx.kind === 'trip') { const out = F.rxInvest ? F.rxInvest(fx.rk) : null; if (out && out.err) say(role, out.err); else { say(role, 'We leave on Monday.'); R(2); note(`Trip to ${fx.reg}`); } }
      if (fx.kind === 'budget') { if (F.bizSetLevel) F.bizSetLevel(fx.dk, 'normal'); say(role, 'Thank you. You will see the difference.'); R(3); note('Budget: normal'); }
      if (fx.kind === 'cap') { const f = G.mand.fin, o = ['50', '60', '70', '85']; f.wageCap = o[Math.min(3, Math.max(0, o.indexOf(String(f.wageCap))) + 1)]; say(role, `${f.wageCap}% it is.`); R(2); note(`Wage cap ${f.wageCap}%`); }
      if (fx.kind === 'loosen') { const m = G.mand.dof, step = (key, o) => { m[key] = o[Math.min(o.length - 1, Math.max(0, o.indexOf(String(m[key]))) + 1)]; }; if (fx.rule === 'wage limit') step('maxWage', ['100', '150', '200', '999']); else if (fx.rule === 'fee limit') step('maxFee', ['0', '25', '50', '100']); else step('maxAge', ['21', '24', '28', '32', '99']); say(role, 'Good. I will look at them again.'); R(3); note(`${fx.rule} loosened`); }
      break; }
    case 'r_go': { const out = F.fire(role); G.dofStrikes = 0; say(role, 'Then I will clear my desk.'); note('DoF let go'); break; }
    case 'r_yes':
      if (r.k === 'ultimatum') { G.dofStrikes = 0; say(role, 'Thank you. You will not regret it.'); R(6); B(4); note('Warnings cleared'); }
      if (r.k === 'staff') { const out = F.deptHire(r.dk, r.role, r.i, r.why); if (G.staffAsk) delete G.staffAsk[r.dk]; if (out && out.err) { say(role, `Then we cannot do it: ${out.err.toLowerCase()}`); } else { say(role, 'Thank you. You will see the difference.'); R(3); note(`${r.title} hired`); } }
      if (r.k === 'rules') { const m = G.mand.dof, step = (key, o) => { m[key] = o[Math.min(o.length - 1, Math.max(0, o.indexOf(String(m[key]))) + 1)]; }; if (r.rule === 'wage limit') step('maxWage', ['100', '150', '200', '999']); else if (r.rule === 'fee limit') step('maxFee', ['0', '25', '50', '100']); else step('maxAge', ['21', '24', '28', '32', '99']); say(role, 'Good. I will look at them again.'); R(3); note(`DoF ${r.rule} loosened`); }
      if (r.k === 'cap') { const f = G.mand.fin, o = ['50', '60', '70', '85']; f.wageCap = o[Math.min(3, Math.max(0, o.indexOf(String(f.wageCap))) + 1)]; say(role, `${f.wageCap}% it is. If the gates drop, we feel it first.`); R(-2); rel('dof', 2); note(`Wage cap ${f.wageCap}%`); }
      if (r.k === 'trip') { const out = F.rxInvest ? F.rxInvest(r.rk) : null; if (out && out.err) say(role, out.err); else { say(role, 'We leave on Monday.'); R(2); note(`Trip to ${r.reg}`); } }
      if (r.k === 'budget') { if (F.bizSetLevel) F.bizSetLevel('academy', 'normal'); say(role, 'Thank you. The coaches will feel it straight away.'); R(4); note('Academy budget: normal'); }
      if (r.k === 'welfare') { G.mand.acad = Object.assign({}, G.mand.acad, { welfare: clamp((+man('acad', 'welfare')) + 15, 0, 100) }); say(role, 'Thank you. The parents will notice.'); R(3); note('Protect the kids +15'); }
      if (r.k === 'minutes') { G.mand.coach = Object.assign({}, G.mand.coach, { youthMins: clamp((+man('coach', 'youthMins')) + 10, 0, 100) }); say(role, 'That is all I ask.'); R(4); rel('coach', -2); note('Coach youth minutes +10 · coach −2'); }
      if (r.k === 'squad') { say(role, 'Good. Tell him what I need.'); R(3); rel('dof', -2); if (F.recPlanSuggest) { const pos = (F.recPlanSuggest()[0] || {}).pos; if (pos) F.recPrioritise(pos); } note('Coach +3 · DoF −2'); }
      break;
    case 'r_no':
      if (r.k === 'ultimatum') { say(role, 'Understood. I know what is at stake.'); R(-5); B(5); G.dofStrikes = 1; note('One warning left'); break; }
      if (r.k === 'staff') { if (G.staffAsk) delete G.staffAsk[r.dk]; say(role, P.amb > 12 ? 'Then do not expect miracles.' : 'Understood.'); R(P.amb > 12 ? -3 : -1); }
      else if (r.k === 'cap') { say(role, 'Thank you. That is the responsible call.'); R(2); rel('dof', -2); note('Finance +2 · DoF −2'); }
      else if (r.k === 'trip') { say(role, 'Then we keep guessing.'); }
      else if (r.k === 'minutes') { say(role, 'Then do not be surprised when they leave.'); R(-3); }
      else if (r.k === 'squad') { say(role, 'Then judge me on what I have.'); R(-3); }
      else { say(role, P.ego > 13 ? 'Noted. I do not agree.' : 'I understand.'); R(-2); }
      break;
    default: return;
  }
  end();
}
function close() { const X = C(); if (X.cur && X.cur.done) X.cur = null; }
function view(role) {
  const X = C(); if (role === 'coach' || role === 'first') { const T = F.ftView ? F.ftView().talk : null; return T ? { role: 'coach', ...T } : null; }
  const roles = DEPT[role] ? [role] : Object.keys(DEPT).filter(r => DEPT[r] === role);
  return X.cur && roles.includes(X.cur.role) ? X.cur : null;
}
const reqOf = role => C().req[role] || null;
// the department asks: the heads behind a department (Recruitment: DoF and scout)
const reqsFor = dk => Object.keys(DEPT).filter(r => DEPT[r] === dk && C().req[r]).map(r => ({ role: r, ...C().req[r], left: Math.max(0, WAIT - (F.absWeek() - C().req[r].at)) }));

Object.assign(F, { convoAsk: ask, convoOpen: open, convoAnswer: answer, convoClose: close, convoView: view, convoReq: reqOf, convoReqs: reqsFor, CONVO_DEPT: DEPT });
})(FO);
