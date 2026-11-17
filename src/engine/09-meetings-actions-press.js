/* ---------- management meeting & projects (1.2) ---------- */
const PROP = {};
function defineProposal(id, d) { d.id = id; PROP[id] = d; }
const isMeeting = w => w === 17;
function nextMeeting() { for (let x = G.week; x <= SEASON_WEEKS; x++) if (isMeeting(x)) return x; return null; }
function genMeeting(nForce) {
  const active = G.projects || [], done = G.projDone || [];
  G.propCd = G.propCd || {}; const pool = Object.values(PROP).filter(d => (G.propCd[d.id] || 0) <= absWeek() && (d.repeat || !done.includes(d.id)) && !active.some(p => p.id === d.id) && (!d.cond || safe(d.cond)));
  const items = [];
  const nItems = nForce || 2;
  while (items.length < nItems && pool.length) {
    const d = wpick(pool, d => d.w ? safe(d.w) || 0.3 : 1); pool.splice(pool.indexOf(d), 1);
    const own = typeof d.owner === 'function' ? d.owner() : d.owner, st = staff(own); if (!st) continue;
    let c; try { c = d.setup ? d.setup() : {}; } catch (err) { continue; } if (c === null) continue; c.scale = 1;
    const p = clamp(d.p(c) + (eff(own, 0) - 10) * 0.015, 0.1, 0.95), bias = (st.p.ego - 10) * 0.018 + (st.p.risk - 10) * 0.01;
    const pc = clamp(p + bias + gauss() * clamp(0.22 - eff(own, 0) / 100, 0.04, 0.2), 0.08, 0.97);
    items.push({ id: d.id, ctx: c, owner: own, cost: Math.round(d.cost(c) / 100) * 100, wk: d.wk ? Math.round(d.wk(c)) : 0, dur: d.dur, p, pc, status: 'open', second: null, revised: false });
  }
  G.meeting = { week: G.week, season: G.season, items };
}
function proposalView(it) {
  const d = PROP[it.id], c = it.ctx, val = v => { try { return typeof v === 'function' ? v(c) : v; } catch (e) { return ''; } };
  const s = staff(it.owner);
  return { title: val(d.title), pitch: val(d.pitch), benefit: val(d.benefit), owner: staffName(it.owner), ownerRole: ROLE[it.owner].t, track: s && s.track ? s.track : { ok: 0, fail: 0 }, impact: d.impact ? (() => { try { return d.impact(c); } catch (e) { return []; } })() : [], cost: it.cost, wk: it.wk, dur: it.dur, pc: it.pc, status: it.status, second: it.second, revised: it.revised, secondRole: (d.second && d.second !== it.owner) ? d.second : (it.owner === 'fin' ? 'dof' : 'fin') };
}
function meetingPot() { const wk = playerWages() + staffWages(); return Math.max(0, Math.round((G.club.cash - (3 - man('fin', 'risk') / 100 * 3) * wk) / 100) * 100); }
function decideProposalInternal(i, choice) {
  const it = G.meeting && G.meeting.items[i]; if (!it || it.status !== 'open') return { err: 'Already decided.' };
  const d = PROP[it.id], s = staff(it.owner);
  if (choice === 'second') {
    const r = proposalView(it).secondRole; if (!staff(r)) return { err: `There is no ${ROLE[r].t} to ask.` }; if (it.second) return { err: 'Already asked.' }; 
    const est = clamp(it.p + gauss() * clamp(0.18 - eff(r, 0) / 120, 0.03, 0.15), 0.05, 0.97);
    it.second = { name: staff(r).name, role: ROLE[r].t, est, t: est < it.pc - 0.12 ? 'thinks the pitch is optimistic' : est > it.pc + 0.08 ? 'is more positive than the pitch' : 'broadly agrees with the pitch' };
    return { out: `${staff(r).name} gives it ${Math.round(est * 100)}% and ${it.second.t}.` };
  }
  if (choice === 'revise') { if (it.revised) return { err: 'Already revised once.' }; it.revised = true; it.cost = Math.round(it.cost * 0.6 / 100) * 100; it.wk = Math.round(it.wk * 0.6); it.ctx.scale = 0.6; it.p = clamp(it.p + 0.08, 0, 0.97); it.pc = clamp(it.pc + 0.05, 0, 0.97); if (s) s.rel = clamp(s.rel - 1, 0, 100); return { out: 'Sent back for a slimmed-down version: cheaper and safer, with a smaller payoff.' }; }
  if (choice === 'reject') { it.status = 'rejected'; (G.propCd = G.propCd || {})[it.id] = absWeek() + 10; if (s) s.rel = clamp(s.rel - (s.p.ego > 13 ? 5 : 2), 0, 100); return { out: `${staffName(it.owner)} takes the rejection ${s && s.p.ego > 13 ? 'badly' : 'in his stride'}.` }; }
  if (choice === 'approve') {
    if (it.cost > meetingPot()) return { err: 'Finance cannot release this amount under the current reserve policy.' };
    it.status = 'approved'; G.club.cash -= it.cost;
    (G.projects = G.projects || []).push({ id: it.id, ctx: it.ctx, owner: it.owner, ownerId: s ? s.id : null, start: absWeek(), due: absWeek() + it.dur, wk: it.wk, p: it.p, cost: it.cost });
    if (s) s.rel = clamp(s.rel + 3, 0, 100); if (d.onStart) d.onStart(it.ctx);
    return { out: `Approved. ${money(it.cost)} committed. ${staffName(it.owner)} expects to deliver in ${it.dur} weeks.` };
  }
}
// Consult, revise, reject and approve are distinct commands. They all use the
// same atomic effect boundary so an exception cannot charge cash while leaving
// the proposal in an ambiguous state.
function decideProposal(i, choice) {
  if (!['second', 'revise', 'reject', 'approve'].includes(choice))
    return { err: 'This proposal response is not available.' };
  const result = runChoiceEffect(() => decideProposalInternal(i, choice));
  return result.err ? result : result.result;
}
function lapseMeeting() { if (!G.meeting || G.meeting.pre || G.meeting.week !== G.week || G.meeting.season !== G.season) return; for (const it of G.meeting.items) if (it.status === 'open') { it.status = 'lapsed'; (G.propCd = G.propCd || {})[it.id] = absWeek() + 8; const s = staff(it.owner); if (s) s.rel = clamp(s.rel - 2, 0, 100); } }
function projectsWeekly() {
  G.projDone = G.projDone || []; G.projLog = G.projLog || [];
  for (const pr of (G.projects || []).slice()) {
    if (absWeek() < pr.due) continue; const d = PROP[pr.id], ok = rnd() < pr.p; let t = ''; try { t = d.done(pr.ctx, ok); } catch (e) { t = ''; }
    G.projects = G.projects.filter(x => x !== pr); if (!d.repeat) G.projDone.push(pr.id); else (G.propCd = G.propCd || {})[pr.id] = absWeek() + 12;
    const s = staff(pr.owner); if (s && s.id === pr.ownerId) { s.track = s.track || { ok: 0, fail: 0 }; s.track[ok ? 'ok' : 'fail']++; s.rel = clamp(s.rel + (ok ? 4 : -3), 0, 100); }
    if (!ok) G.board.conf = clamp(G.board.conf - (pr.cost > M(8000) ? 3 : 1), 0, 100);
    let title = ''; try { title = typeof d.title === 'function' ? d.title(pr.ctx) : d.title; } catch (e) { }
    G.projLog.unshift({ title, ok, season: G.season, week: G.week, t }); G.projLog = G.projLog.slice(0, 20);
    G.paper.stories.unshift({ h: ok ? 'Project delivered' : 'Project fails', t: `${title}: ${t}` });
  }
}
const projWeekly = () => (G.projects || []).reduce((a, p) => a + (p.wk || 0), 0);
const perk = k => !!(G.club.perks && G.club.perks[k]);

function msgView(m) {
  const e = EV[m.ev], c = m.ctx; const val = v => { try { return typeof v === 'function' ? v(c) : v; } catch (err) { return ''; } };
  const from = e.from === 'board' ? 'The board' : e.from === 'fans' ? 'Supporters\' trust' : e.from === 'press' ? 'The press' : staff(e.from) ? staff(e.from).name + ', ' + ROLE[e.from].t : ROLE[e.from] ? ROLE[e.from].t + ' (vacant)' : e.from;
  const ai = autoIndex(m);
  return { from, role: e.from, dept: e.dept, title: val(e.title) || 'A matter for your desk', body: val(e.body) || 'The people involved have moved on. Any choice will close the file.', opts: e.opts.map(o => ({ l: val(o.l) || 'Close the file', h: val(o.h) })), auto: ai, autoWho: e.from === 'board' ? 'the board' : ROLE[e.from] ? (staff(e.from) ? staff(e.from).name : 'nobody, the role is vacant, so it falls to chance and') : 'the club office', done: m.done, choice: m.choice, outcome: m.outcome, by: m.by, del: !!m.del, err: !!m.err, esc: !!m.esc, why: m.why || val(e.why) || (e.forced ? 'A consequence of an earlier decision, or something your staff cannot settle alone.' : 'It falls outside what your mandates let staff decide alone.'), second: e.second ? { role: ROLE[e.second.r].t, avail: !!staff(e.second.r), name: staffName(e.second.r), text: m.second || null } : null };
}
function autoIndex(m) { const e = EV[m.ev]; if (!ROLE[e.from] || staff(e.from)) return e.auto ? clamp(e.auto(m.ctx), 0, e.opts.length - 1) : 0; return e.vacant != null ? e.vacant : e.opts.length - 1; }
// One authoritative, recoverable effect boundary for inbox and briefing choices.
// G is JSON-saveable; restore its complete snapshot if a handler throws midway.
// Do not mark a decision handled until its actual effect succeeds.
function runChoiceEffect(effect) {
  const before = JSON.stringify(G);
  try { return { ok: true, result: effect() }; }
  catch (err) {
    G = JSON.parse(before);
    return { err: 'That decision could not be completed. Nothing was committed; please try again.' };
  }
}
function resolve(m, idx, by) {
  const e = EV[m.ev];
  if (!e || !Array.isArray(e.opts) || !Number.isInteger(idx) || idx < 0 || idx >= e.opts.length)
    return { err: 'This decision is no longer available.' };
  if (m.done) return { err: 'This decision was already handled.' };
  const result = runChoiceEffect(() => e.opts[idx].f(m.ctx));
  if (result.err) return result;
  // A handler might use direct access to the same object. Re-read the current case.
  const current = G.inbox.find(x => x.id === m.id);
  if (!current) return { err: 'The decision could not be found after processing.' };
  current.done = true; current.choice = idx; current.by = by;
  current.outcome = result.result || 'Done.';
  if (by !== 'you') {
    let label = '';
    try { label = typeof e.opts[idx].l === 'function' ? e.opts[idx].l(current.ctx) : e.opts[idx].l; } catch (ignore) {}
    G.paper.stories.push({
      h: by === 'The board' ? 'Board decision' : by === 'The club office' ? 'Club decision' : 'Staff decision',
      t: `${by}: ${label}. ${current.outcome}`
    });
  }
  return current.outcome;
}
// CEO authority is controlled by mandates, consequences and staff trust, not a weekly action-point currency.
function respond(msgId, idx) {
  if (over()) return { err: 'You no longer run the club.' };
  const m = G.inbox.find(x => x.id === msgId);
  if (!m || m.done) return null;
  const result = resolve(m, idx, 'you');
  return result && result.err ? result : { out: result };
}

/* ---------- player actions ---------- */
function talk(role, tone) {
  // An unknown response must not consume the employee's conversation cooldown.
  if (!['review', 'praise', 'challenge', 'reassure', 'warn'].includes(tone))
    return { err: 'This conversation response is not available.' };
  const s = staff(role); if (!s) return { err: 'That position is vacant.' };
  if (tone === 'review' && record(role).early) return { err: 'Too early in the season: there are not enough numbers to review yet.' };
  const priorRelation = s.rel, priorBoost = s.boost;
  const last = G.talks[role] ?? -99, gap = absWeek() - last, recent = gap < 3;
  G.talks[role] = absWeek(); const k = gap < 1 ? 0 : recent ? 0.5 : 1;
  const { ego, amb, loy } = s.p; let rel = 0, boost = 0, t = '';
  if (tone === 'review') { const rc = record(role); if (rc.score >= 62) { rel = 6; boost = 5; t = `The numbers back him up (${rc.verdict.toLowerCase()}). ${s.name} appreciates that you have done your homework.`; } else if (rc.score <= 40) { rel = ego > 15 ? -6 : -2; boost = 6; t = ego > 15 ? `${s.name} disputes every figure, but he knows they are bad. Expect a reaction.` : `Hard to argue with the data. ${s.name} accepts the review and commits to fixing it.`; } else { rel = 1; boost = 2; t = `A useful, unspectacular review. The numbers are mixed and ${s.name} knows it.`; } }
  if (tone === 'praise') { if (s.perf >= 55) { rel = 6; boost = 4; t = `${s.name} appreciates the recognition and pushes on.`; } else if (ego > 13) { rel = 3; boost = -3; t = `${s.name} takes the praise as licence to coast.`; } else { rel = 4; boost = 1; t = `${s.name} is grateful, if a little surprised.`; } }
  if (tone === 'challenge') { if (amb >= 12) { rel = -1; boost = 7; t = `${s.name} relishes the challenge and raises his standards.`; } else if (ego >= 13) { rel = -8; boost = -2; t = `${s.name} bristles. He does not like being told how to do his job.`; } else { rel = -3; boost = 3; t = `${s.name} nods and gets to work, a little stung.`; } }
  if (tone === 'reassure') { if (s.perf < 45) { rel = 5; boost = 3; t = `${s.name} looks relieved. Your backing steadies him.`; } else { rel = 1; boost = 0; t = `${s.name} wonders why you seem worried.`; } }
  if (tone === 'warn') { if (s.perf < 40) { rel = -6; boost = 6; t = `${s.name} gets the message. Results had better improve.`; if (loy < 8 && s.rel < 40 && chance(0.4)) queueEvent('staff_quit', { role }); } else { rel = -10; boost = -1; t = `${s.name} feels the warning is unfair. Trust has taken a hit.`; } }
  s.rel = clamp(s.rel + rel * k, 0, 100); s.boost = clamp(s.boost + boost * k, -10, 12); s.boostW = 4;
  if (recent) t += ' (A second talk so soon has less effect.)';
  if (!Array.isArray(G.conversations)) G.conversations = [];
  const active = Array.isArray(G.agreements) ?
    G.agreements.findLast(a => a.role === role && a.head === s.name &&
      (a.state === 'running' || a.state === 'review')) : null;
  G.conversations.push({
    id:'talk-' + (G.nid++), role, head:s.name, approach:tone, at:absWeek(),
    season:G.season, week:G.week, text:t,
    before:{ relationship:priorRelation, motivation:priorBoost },
    after:{ relationship:s.rel, motivation:s.boost },
    agreementId:active ? active.id : null
  });
  return { out: t };
}
function conversationView(role) {
  return (G.conversations || []).filter(x => !role || x.role === role).slice(-8).reverse();
}
const PUSH = { sporting: ['First team', 'coach', 'dof'], scouting: ['Scouting', 'scout', null], academy: ['Academy', 'acad', 'dof'], commercial: ['Commercial', 'com', 'mkt'], marketing: ['Marketing', 'mkt', 'com'], business: ['Business', 'fin', null], medical: ['Medical', 'coach', null] };
function push(dept) {
  if (G.push[dept] > 0) return { out: 'This department already has your backing for ' + G.push[dept] + ' more week(s).' };
  G.push[dept] = 3;
  const [l, own, rival] = PUSH[dept]; if (staff(own)) staff(own).rel = clamp(staff(own).rel + 3, 0, 100); if (rival && staff(rival)) staff(rival).rel = clamp(staff(rival).rel - 2, 0, 100);
  return { out: `${l} has your full backing for three weeks.${rival && staff(rival) ? ' ' + staff(rival).name + ' notices where your attention is going.' : ''}` };
}
/* Persistent leadership agreements. A mandate is a binding instruction:
   staff continue executing it autonomously; evaluation uses actual department
   scorecard evidence instead of generated boosts or fake success rates. */
function agreementStore() {
  if (!Array.isArray(G.agreements)) G.agreements = [];
  return G.agreements;
}
function agreementView(role) {
  const history = agreementStore().filter(a => !role || a.role === role);
  const active = history.findLast(a => a.state === 'running' || a.state === 'review');
  return { active: active || null, history: history.slice(-8).reverse() };
}
function beginAgreement(role, reason) {
  const s = staff(role);
  if (!s || !G.mand[role] || !MAND[role]) return null;
  const records = agreementStore();
  const week = absWeek(), identity = s.name;
  for (const a of records) if (a.role === role && (a.state === 'running' || a.state === 'review')) {
    a.state = 'superseded'; a.closedWeek = week;
    a.outcome = 'Replaced by a new leadership direction before the scheduled review.';
  }
  const snapshot = record(role);
  const a = {
    id: 'mand-' + (G.nid++), role, head: identity, reason: reason || 'CEO direction',
    start: week, due: week + 6, state: 'running',
    mandate: Object.assign({}, G.mand[role]),
    baseline: { score: snapshot.early ? null : snapshot.score, verdict: snapshot.verdict,
      lines: snapshot.lines.slice(0, 3).map(line => line.slice()) },
    check: null, outcome: null, closedWeek: null
  };
  records.push(a);
  return a;
}
function agreementWeekly() {
  // Existing saves and newly founded clubs enter this system without migration
  // steps; active departmental mandates become the first six-week agreements.
  const agreements = agreementStore();
  // Covers partial old saves and new hires without overriding an acknowledged
  // completed review for the same head.
  for (const r of ROLES) {
    const head = staff(r.id);
    if (head && !agreements.some(a => a.role === r.id && a.head === head.name))
      beginAgreement(r.id, 'Season operating mandate');
  }
  for (const a of agreements) {
    if (a.state !== 'running') continue;
    if (staff(a.role)?.name !== a.head) {
      a.state = 'closed'; a.closedWeek = absWeek();
      a.outcome = 'The responsible head left the role. This agreement is no longer in force.';
      continue;
    }
    if (absWeek() < a.due) continue;
    const current = record(a.role), delta = a.baseline.score == null ? null : current.score - a.baseline.score;
    a.check = { score: current.score, verdict: current.verdict, delta,
      lines: current.lines.slice(0, 3).map(line => line.slice()), at: absWeek() };
    a.state = 'review';
    a.outcome = delta == null ?
      'The first six weeks are complete. Performance evidence is now available for a review.' :
      delta >= 5 ? 'Performance has improved since the agreement.' :
      delta <= -5 ? 'Performance has declined since the agreement.' :
      'The measured performance has been broadly stable.';
    G.paper.stories.push({ h: 'Leadership review due',
      t: staff(a.role).name + ': ' + a.outcome + ' The CEO can review the mandate with the department head.' });
  }
}
function agreementRespond(id, option) {
  const a = agreementStore().find(x => x.id === id);
  if (!a || a.state !== 'review') return { err: 'This review is not awaiting a decision.' };
  if (!['continue', 'close'].includes(option)) return { err: 'Unknown review response.' };
  if (staff(a.role)?.name !== a.head) return { err: 'The head has changed. This agreement is no longer current.' };
  a.state = 'closed'; a.closedWeek = absWeek();
  a.response = option;
  if (option === 'continue') {
    const next = beginAgreement(a.role, 'Renewed after evidence review');
    return { out: 'You have renewed the existing direction with ' + a.head +
      '. A new review is due in six weeks.', next: next.id };
  }
  return { out: 'The six-week evaluation with ' + a.head +
    ' has been acknowledged. The existing mandate stays in force until changed.' };
}
function setMandate(role, m, free) {
  const old = G.mand[role];
  if (!old || !m) return { err: 'No mandate available.' };
  if (!free && Object.keys(m).every(k => String(m[k]) === String(old[k])) &&
      Object.keys(old).every(k => String(old[k]) === String(m[k])))
    return { out: 'Mandate unchanged.' };
  G.mand[role] = Object.assign({}, m); const s = staff(role); let t = 'New mandate issued.';
  if (!free && G.phase === 'season') beginAgreement(role, 'Updated strategic mandate');
  if (s && !free) { let dist = 0; for (const x of MAND[role].sl) dist += Math.abs((m[x[0]] || 0) - (old[x[0]] || 0)); for (const x of MAND[role].ru) if (m[x[0]] !== old[x[0]]) dist += 25;
    if (dist > 90) { s.rel = clamp(s.rel - 4 - (s.p.ego - 10) * 0.4, 0, 100); t = `${s.name} accepts the new mandate but finds the change of course hard to explain to his department.`; }
    const lk = LEAN[role][0]; if (Math.abs(m[lk] - s.lean) < 20) { s.rel = clamp(s.rel + 3, 0, 100); t += ` ${s.name} likes this direction.`; } }
  return { out: t };
}
function fire(role) {
  const s = staff(role); if (!s) return { err: 'Vacant.' };
  const cost = Math.round(s.wage * Math.max(8, s.contract * 20)); G.club.cash -= cost; G.staff[role] = null; G.cands[role] = genCands(role);
  G.st.press = clamp(G.st.press - 2, 0, 100); for (const r of ROLES) if (G.staff[r.id]) G.staff[r.id].rel = clamp(G.staff[r.id].rel - 2, 0, 100);
  if (role === 'coach' && G.week > 2) G.board.conf = clamp(G.board.conf + (myPos() > expectedRank() ? 3 : -4), 0, 100);
  G.paper.stories.push({ h: 'Dismissal', t: `${s.name} has left the club as ${ROLE[role].t}. Compensation: ${money(cost)}.` });
  return { out: `${s.name} is gone. Compensation paid: ${money(cost)}.` };
}
function genCands(role) { const t = G.club.tier; return [genStaff(role, t, 1.2), genStaff(role, t, 0), genStaff(role, t, -1)].sort((a, b) => b.wage - a.wage); }
function hire(role, idx) { const s = G.cands[role][idx]; if (!s) return; G.staff[role] = s; s.rel = 60; G.cands[role] = null; if (G.phase === 'season') { beginAgreement(role, 'Newly appointed department head'); G.paper.stories.push({ h: 'Appointment', t: `${s.name} is appointed ${ROLE[role].t}.` }); } return s; }

/* ---------- press ---------- */
const PRESS = [
  { id: 'goal', q: () => 'What is the target this season?', a: [['We are going up. Promotion, nothing less.', 'promo', { fans: 8, press: 4, board: 3 }], ['Top half and steady growth.', 'tophalf', { fans: 2 }], ['No targets. We build quietly.', null, { press: -4, fans: -2 }]] },
  { id: 'youth', q: () => 'Will local kids get a chance at this club?', a: [['Three academy debuts this season. I guarantee it.', 'youth', { fans: 6 }], ['If they are good enough, yes.', null, {}], ['We need results, not projects.', null, { fans: -3, press: 2 }]] },
  { id: 'star', q: () => `Is ${bestPlayer().name} for sale?`, a: [() => [`${bestPlayer().name} is not for sale. Full stop.`, 'keep', { fans: 5 }], ['Every player has a price.', null, { fans: -4, press: 3 }], ['That is a question for our Director of Football.', null, { press: -2 }]] },
  { id: 'tickets', q: () => 'Supporters worry about ticket prices. Your view?', a: [['Prices stay affordable. That is a promise.', 'tickets', { fans: 6, spons: -2 }], ['Prices follow the market.', null, { fans: -4, spons: 3 }], ['We will consult the supporters.', null, { fans: 2 }]] },
  { id: 'style', q: () => 'What will supporters see on the pitch?', a: [['Attacking football. We will score goals.', 'attack', { fans: 5, press: 3 }], ['A team that is hard to beat.', null, {}], ['Whatever wins.', null, { fans: -2, press: 2 }]] },
  { id: 'money', q: () => 'Is the club financially sound?', a: [['We will not spend money we do not have.', 'nodebt', { spons: 3, board: 4 }], ['Ambition costs money. We will invest.', null, { fans: 3, board: -2 }], ['I will not discuss finances.', null, { press: -4 }]] },
  { id: 'coach', q: () => `Why ${staffName('coach')} as head coach?`, a: [['He has my full trust. He is the right man.', null, { rel: ['coach', 6] }], ['He knows what is expected of him.', null, { board: 2, rel: ['coach', -2] }], ['Results will decide his future.', null, { press: 3, rel: ['coach', -7] }]] },
];
const PROMISE_T = { promo: 'Win promotion this season', tophalf: 'Finish in the top half', youth: 'Give three academy players a debut', keep: p => `Keep ${p} at the club`, tickets: 'Keep ticket prices affordable', attack: 'Score 50+ league goals', nodebt: 'Finish the season with cash in the bank' };
function bestPlayer() { return G.squad.slice().sort((a, b) => b.ca - a.ca)[0]; }
function pressQuestions() { const ids = G.season === 1 && G.week === 1 && !G.pressDone ? ['goal', 'youth', 'tickets', 'coach'] : shuffle(['goal', 'youth', 'star', 'tickets', 'style', 'money', 'coach'].filter(i => i !== 'coach' || staff('coach'))).slice(0, 3); return ids.map(id => PRESS.find(p => p.id === id)).filter(p => p.id !== 'coach' || staff('coach')); }
function pressView(q) { return { id: q.id, q: q.q(), a: q.a.map(a => typeof a === 'function' ? a() : a).map(a => ({ t: a[0], promise: !!a[1], fx: a[2] || {} })) }; }
function pressAnswer(qid, i) {
  const q = PRESS.find(p => p.id === qid); let a = q.a[i]; if (typeof a === 'function') a = a(); const [t, pk, fx] = a;
  if (fx.fans) G.st.fans = clamp(G.st.fans + fx.fans, 0, 100); if (fx.press) G.st.press = clamp(G.st.press + fx.press, 0, 100); if (fx.spons) G.st.spons = clamp(G.st.spons + fx.spons, 0, 100); if (fx.board) G.board.conf = clamp(G.board.conf + fx.board, 0, 100);
  if (fx.rel && staff(fx.rel[0])) staff(fx.rel[0]).rel = clamp(staff(fx.rel[0]).rel + fx.rel[1], 0, 100);
  if (pk) { const pr = { k: pk, season: G.season, status: 'open' }; if (pk === 'keep') { const b = bestPlayer(); pr.pid = b.id; pr.t = PROMISE_T.keep(b.name); } else pr.t = PROMISE_T[pk]; G.promises.push(pr); }
  return t;
}

