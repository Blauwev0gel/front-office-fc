/* ---------- weekly systems ---------- */
function develop(p, mult) {
  if (p.age < 24 && p.ca < p.pa) {
    const minsF = p.academy && !G.squad.includes(p) ? 0.5 : clamp(p.st.mins / Math.max(1, G.week * 90), 0, 1);
    const devF = 0.55 + eff('coach', 2) / 20 * 0.5 + G.club.fac.train * 0.03 + minsF * 0.4 + cact('intensity') / 100 * 0.2 + (p.pers.prof - 10) * 0.02 + (HOOK.ftDev ? HOOK.ftDev() : 0);
    const g = (p.pa - p.ca) * 0.0055 * devF * mult;
    const w = POSW[p.pos]; for (const k in w) p.a[k] = clamp(p.a[k] + g * (0.6 + rnd() * 0.8), 1, 20);
  } else if (p.age >= 30) { for (const k of ['pac', 'sta', 'str']) p.a[k] = clamp(p.a[k] - 0.012 * (p.age - 29) * rnd() * 2, 1, 20); }
  upd(p);
}
function staffWeekly() {
  const form = G.form.slice(-6), ppg = form.length ? form.reduce((a, r) => a + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0) / form.length : 1.3;
  const sqAvg = G.squad.slice().sort((a, b) => b.ca - a.ca).slice(0, 14).reduce((a, p) => a + p.ca, 0) / 14;
  const netAvg = Object.values(G.club.net).reduce((a, b) => a + b, 0) / 7;
  const acadPA = G.academy.length ? G.academy.reduce((a, p) => a + stars(p.pa), 0) / G.academy.length : 2;
  const cashTrend = G.fin.hist.length > 4 ? G.fin.hist[G.fin.hist.length - 1] - G.fin.hist[G.fin.hist.length - 5] : 0;
  const tgt = { dof: 50 + (sqAvg - tierAvg(G.club.tier)) * 12, coach: 20 + ppg * 25 + (expectedRank() - myPos()) * 1.5, scout: 25 + netAvg * 0.9, acad: 20 + acadPA * 15 + G.club.fac.youth * 2, com: G.st.spons, mkt: (G.st.fans + G.club.brand) / 2, fin: 50 + clamp(cashTrend / Math.max(1, M(800)), -30, 30) };
  for (const r of ROLES) {
    const s = staff(r.id); if (!s) continue;
    s.perf = clamp(s.perf + ((tgt[r.id] || 50) + s.boost - s.perf) * 0.3, 0, 100);
    if (s.boostW > 0 && --s.boostW === 0) s.boost = 0;
    const lk = LEAN[r.id][0], dist = Math.abs(man(r.id, lk) - s.lean);
    if (dist > 40) s.rel -= 0.25 * (1 + (s.p.ego - 10) / 15);
    s.rel += (55 - s.rel) * 0.02;
    if (r.id === 'coach' && man('coach', 'style') === 'dna' && s.style !== G.club.dna.style && s.p.ego > 12) s.rel -= 0.3;
    s.rel = clamp(s.rel, 0, 100); s.tenure++;
    if (s.rel < 22 && s.p.ego > 11 && chance(0.12)) queueEvent('staff_leak', { role: r.id });
    if (s.rel < 15 && chance(0.15)) queueEvent('staff_quit', { role: r.id });
    if (s.perf > 72 && s.p.amb > 12 && chance(0.03)) queueEvent('staff_poach', { role: r.id });
  }
}
function kpiWeekly(res) {
  const c = G.club, st = G.st;
  // fans
  const fanTarget = 900 * Math.pow(sc(), 1.1) * (0.7 + c.brand / 100 * 0.6) * (c.dna.identity === 'community' ? 1.1 : 1);
  if (HOOK.fanWeekly) HOOK.fanWeekly(fanTarget); else c.fanbase = Math.round(c.fanbase + (fanTarget - c.fanbase) * 0.025 + (G.push.marketing > 0 ? fanTarget * 0.004 : 0));
  let df = (55 - st.fans) * 0.07;
  if (res) df += res === 'W' ? 1.8 : res === 'L' ? -2.4 : -0.3;
  if (man('com', 'tickets') > 65) df -= 0.5;
  if (c.dna.identity === 'community' && man('com', 'tickets') > 55) df -= 0.4;
  const al = alignment(); if (al < 60) df -= 0.5;
  st.fans = clamp(st.fans + df, 0, 100);
  st.spons = clamp(st.spons + (50 + c.brand * 0.2 - st.spons) * 0.04 + (res === 'W' ? 0.5 : 0) + (G.push.commercial > 0 ? 1.5 : 0), 0, 100);
  st.press = clamp(st.press + (50 - st.press) * 0.05 + (res === 'W' ? 0.6 : res === 'L' ? -0.6 : 0), 0, 100);
  const brandT = 25 + eff('mkt', 0) * 1.6 + eff('mkt', 1) * 0.8 + man('mkt', 'budget') * 0.15 + man('mkt', 'reach') * 0.08 + (8 - c.tier) * 3;
  c.brand = clamp(c.brand + (brandT - c.brand) * 0.03 + (G.push.marketing > 0 ? 1 : 0), 0, 100);
  // scouting network
  if (staff('scout')) { for (const k in c.net) { const focus = k === man('scout', 'reg1') ? 1 : k === man('scout', 'reg2') ? 0.6 : 0; const g = focus * (0.25 + eff('scout', 2) / 40 + man('scout', 'budget') / 200 + (G.push.scouting > 0 ? 1.2 : 0)); c.net[k] = clamp(c.net[k] + g - 0.08, 0, 100); } }
  else for (const k in c.net) c.net[k] = clamp(c.net[k] - 0.2, 0, 100);
  c.drift = Math.max(0, c.drift - 0.4);
  // deals
  for (const d of c.deals) d.weeks--; const ended = c.deals.filter(d => d.weeks <= 0); c.deals = c.deals.filter(d => d.weeks > 0);
  for (const d of ended) G.paper.stories.push({ h: 'Sponsorship', t: `The ${d.name} deal has run out.` });
  for (const k in G.push) if (G.push[k] > 0) G.push[k]--;
}
function boardWeekly(res) {
  const b = G.board; let d = 0;
  const exp = expectedRank(), pos = myPos();
  if (res) d += res === 'W' ? 0.8 : res === 'L' ? -1.3 * (exp <= 6 ? 1.2 : 0.9) : 0;
  d += (55 - b.conf) * 0.04;
  if (b.promiseWeek && absWeek() >= b.promiseWeek) { b.promiseWeek = 0; if (myPos() >= (G.flags.turnaround || 99)) { d -= 12; G.paper.stories.push({ h: 'Boardroom', t: 'The promised turnaround has not come. The board is furious.' }); } else { d += 4; G.paper.stories.push({ h: 'Boardroom', t: 'The board acknowledges the turnaround you promised.' }); } }
  const obj = b.obj.find(o => o.k === 'league');
  if (G.week > 8 && obj) d += pos > obj.target + 3 ? -0.7 : pos <= obj.target ? 0.35 : -0.1;
  if (G.club.cash < 0) d -= G.club.dna.money === 'owner' ? 0.6 : 1.4;
  if (G.st.fans < 30) d -= 0.5;
  if (alignment() < 50) d -= 0.4;
  if (G.club.dna.ambition === 'patient') d = d > 0 ? d : d * 0.75; if (G.club.dna.ambition === 'rocket' || G.club.dna.origin === 'investor') d = d < 0 ? d * 1.25 : d;
  b.conf = clamp(b.conf + d, 0, 100);
  if (b.conf <= 22 && !b.warned) { b.warned = true; queueEvent('board_warning', {}); }
  if (b.conf > 40) b.warned = false;
}

/* ---------- events & inbox ---------- */
const EV = {}; // filled by events.js
function defineEvent(id, def) { def.id = id; EV[id] = def; }
function queueEvent(id, ctx) { if (!EV[id]) return; if (G.queue.some(q => q.id === id) || pendingOf(id)) return; G.queue.push({ id, ctx: ctx || {} }); }
function pendingOf(id) { return G.inbox.some(m => m.ev === id && !m.done); }
function addMsg(id, ctx) { const e = EV[id]; const c = ctx || (e.setup ? e.setup() : {}); if (c === null) return false; const m = { id: uid(), ev: id, ctx: c, season: G.season, week: G.week, done: false }; G.inbox.unshift(m); G.cd[id] = absWeek() + (e.cd || 8); if (HOOK.desk) { try { HOOK.desk(e, m); } catch (err) { } } return true; }
const safe = f => { try { return f(); } catch (e) { return false; } };
// Prioritise live club pressures and unresolved follow-ups before optional colour.
// Keep the existing event registry, cooldowns, seeded RNG and delegation hook.
function eventPriority(e) {
  const w = e.w ? safe(e.w) : 1;
  if (typeof w !== 'number' || !isFinite(w) || w <= 0) return 0;
  let factor = 1;
  const dept = e.dept || e.from;
  const pressure = {
    sporting: G.form.slice(-5).filter(x => x === 'L').length >= 3,
    finance: G.club.cash < 0 || G.board.conf < 35,
    business: G.club.cash < 0,
    commercial: G.st.spons < 35,
    marketing: G.st.fans < 35,
    academy: G.academy.length < 3
  };
  if (pressure[dept]) factor *= 1.7;
  if (dept === 'sporting' && G.board.conf < 35) factor *= 1.25;
  if (G.push && G.push[dept] > 0) factor *= 1.3;
  // Repeated subject matter should not dominate the next few weeks.
  const recent = (G.inbox || []).some(m => m.ev === e.id && m.done &&
    (G.season - m.season) * SEASON_WEEKS + G.week - m.week <= 3);
  if (recent) factor *= 0.5;
  return w * factor;
}
function genMessages() {
  // Never discard queued follow-ups when more than four become due together.
  const forced = G.queue.splice(0, 4);
  for (const q of forced) if (!addMsg(q.id, q.ctx)) G.queue.push(q);
  const ok = e => !e.forced && e.mode !== 'off' &&
    (G.cd[e.id] || 0) <= absWeek() && !pendingOf(e.id) &&
    (!e.cond || safe(e.cond));
  const live = G.inbox.filter(m => !m.done).length;
  // Quiet weeks are valid. Do not manufacture decisions to fill slots.
  let slots = live >= 3 ? 0 : live >= 1 ? (chance(0.4) ? 1 : 0) :
    (chance(0.25) ? 0 : chance(0.65) ? 1 : 2);
  // The first weeks establish the club and its staff before optional drama.
  // Forced escalations, deadlines and scheduled board meetings still arrive.
  // Staff continue their own autonomous work below, even in a quiet week.
  if (G.season === 1 && G.week <= 3) {
    slots = G.week === 1 ? 0 : Math.min(slots, 1);
  }
  let tries = 0;
  while (slots > 0 && tries++ < 10) {
    const el = Object.values(EV).filter(e => ok(e) && e.mode !== 'auto' && eventPriority(e) > 0);
    if (!el.length) break;
    const e = wpick(el, eventPriority);
    if (addMsg(e.id)) slots--;
  }
  // Staff still act independently even in weeks with no CEO decisions.
  let n = ri(1, 2); tries = 0;
  while (n > 0 && tries++ < 10) {
    const el = Object.values(EV).filter(e => ok(e) && e.mode === 'auto' && eventPriority(e) > 0);
    if (!el.length) break;
    const e = wpick(el, eventPriority);
    autoEvent(e); n--;
  }
  if (isMeeting(G.week)) genMeeting();
}
function autoEvent(e) {
  let c;
  try { c = e.setup ? e.setup() : {}; } catch (err) { return; }
  if (c === null) return;
  const m = { ev: e.id, ctx: c };
  const idx = autoIndex(m);
  if (!e.opts || !e.opts[idx]) return;
  const who = e.from === 'board' ? 'The board' : ROLE[e.from] ?
    (staff(e.from) ? staff(e.from).name : 'Nobody in charge') : 'The club office';
  const effect = runChoiceEffect(() => e.opts[idx].f(c));
  if (effect.err) return; // failed work must not create a false Gazette success
  G.cd[e.id] = absWeek() + (e.cd || 8);
  let lab = '', title = '';
  try {
    lab = typeof e.opts[idx].l === 'function' ? e.opts[idx].l(c) : e.opts[idx].l;
    title = typeof e.title === 'function' ? e.title(c) : e.title;
  } catch (ignore) { title = e.id; }
  G.paper.stories.push({
    h: `${ROLE[e.from] ? ROLE[e.from].s : 'Club'} handled it`,
    t: `${title}. ${who}: ${lab}. ${effect.result || ''}`, auto: 1
  });
}
function secondOpinion(msgId) {
  const m = G.inbox.find(x => x.id === msgId); if (!m || m.done) return null; const e = EV[m.ev]; if (!e.second) return { err: 'No second opinion available.' };
  const r = e.second.r; if (!staff(r)) return { err: `There is no ${ROLE[r].t} to ask.` }; if (m.second) return { err: 'Already asked.' }; 
  let t = ''; try { t = e.second.t(m.ctx); } catch (err) { t = 'He has nothing useful to add.'; } m.second = `${staff(r).name} (${ROLE[r].t}): ${t}`; return { out: m.second };
}

