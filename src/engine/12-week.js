/* ---------- the week ---------- */
// dismissal is final: one place sets it, nothing after it can undo it
function sack(reason, cause, at) {
  // at: { pos, tier } when the table has already moved on (end of season: clubs have changed division).
  if (G.phase === 'sacked') return false;
  G.phase = 'sacked'; G.sackReason = reason; G.queue = []; G.briefs = [];
  G.over = { reason, cause: cause || 'board', season: G.season, week: G.week, pos: at ? at.pos : (G.divs && G.divs[G.club.tier]) ? safe(myPos) || null : null, tier: at ? at.tier : G.club.tier, conf: Math.round(G.board.conf) };
  return true;
}
const over = () => G.phase === 'sacked';
function endWeek() {
  if (G.phase !== 'season') return null;
  G.paper = { headline: '', sub: '', stories: [] }; G.msNew = [];
  G.prev = { cash: G.club.cash, conf: G.board.conf, fans: G.st.fans, pos: myPos() }; G.prevFan = G.club.fanbase;
  for (const m of G.inbox.filter(m => !m.done)) { const e = EV[m.ev]; const who = e.from === 'board' ? 'The board' : ROLE[e.from] ? (staff(e.from) ? staff(e.from).name : 'Nobody in charge') : 'The club office'; resolve(m, autoIndex(m), who); }
  if (over()) return { sacked: true };
  lapseMeeting();
  if (FO.deptIssueWorkWeekly) FO.deptIssueWorkWeekly();
  if (FO.squadPlanPrepare) FO.squadPlanPrepare();
  if (HOOK.recWeekly) { dofWork(); HOOK.recWeekly(); } else { scoutWork(); dofWork(); }
  // matches
  const t = G.club.tier, round = G.divs[t] && G.divs[t].fix[G.week - 1];
  let ours = null;
  for (let tt = 1; tt <= 8; tt++) { const r = G.divs[tt].fix[G.week - 1]; if (!r) continue; for (const [h, a] of r) { if (h === 0 || a === 0) { const home = h === 0; G.club.lastAtt = home ? attendance() : G.club.lastAtt; ours = simOurMatch(home ? a : h, home, 'League'); applyResult(tt, h, a, home ? ours.ug : ours.tg, home ? ours.tg : ours.ug); } else { const [hg, ag] = quickSim(h, a); applyResult(tt, h, a, hg, ag); } } }
  let cup = null;
  if (G.cup.alive && G.cup.weeks.includes(G.week)) {
    const rd = G.cup.weeks.indexOf(G.week), oppTier = clamp(G.club.tier - Math.floor(rd / 2) + ri(-1, 1), 1, 8), opp = pick(G.divs[oppTier].clubs.filter(x => x !== 0));
    cup = simOurMatch(opp, chance(0.5), 'Cup'); let win = cup.ug > cup.tg; if (cup.ug === cup.tg) { const dd = teamStrength() - G.clubs[opp].str;
      cup.ev = cup.ev.filter(e => e.k !== 'ft');
      cup.ev.push({ m: 90, k: 'info', t: `Full time ${cup.ug}–${cup.tg}. Extra time.` });
      if (chance(0.45)) { const us = chance(1 / (1 + Math.exp(-0.6 * dd))); if (us) cup.ug++; else cup.tg++; win = us; cup.pens = 'after extra time'; cup.ev.push({ m: ri(95, 120), k: 'goal', us: us ? 1 : 0, t: us ? `GOAL ${G.club.short} in extra time!` : `${cup.oppName} score in extra time.`, sc: [cup.ug, cup.tg] }); }
      else { win = chance(0.5 + dd * 0.05); const a = ri(3, 5), b = win ? a - ri(1, 2) : a + 1; cup.pens = win ? `won ${a}–${Math.max(0, b)} on penalties` : `lost ${Math.max(0, a - 1)}–${a} on penalties`; cup.ev.push({ m: 120, k: 'info', t: `Penalties... ${win ? `${G.club.short} win the shoot-out!` : `${cup.oppName} win the shoot-out.`}` }); }
      cup.ev.push({ m: 120, k: 'ft', t: `Final whistle. ${win ? 'Through to the next round.' : 'Out of the cup.'}` }); }
    cup.rd = G.cup.names[rd];
    if (win) { const prize = M(1500 * (rd + 1)); G.club.cash += prize; G.st.fans = clamp(G.st.fans + 2 + rd, 0, 100); cup.prize = prize; if (rd === G.cup.weeks.length - 1) { G.cup.alive = false; G.cup.won = G.season; G.board.conf = clamp(G.board.conf + 10, 0, 100); G.st.fans = clamp(G.st.fans + 10, 0, 100); G.trophies.push(`National Cup ${G.season}`); } }
    else G.cup.alive = false;
    G.cup.log.push({ rd: cup.rd, opp: cup.oppName, s: `${cup.ug}–${cup.tg}${cup.pens ? ' (' + cup.pens + ')' : ''}`, win });
  }
  if (ours) { G.form.push(ours.result); G.lastMatch = ours; G.ss.xpts = (G.ss.xpts || 0) + xPts(ours.uxg, ours.txg); G.ss.lg++; G.ss.xgf += ours.uxg; G.ss.xga += ours.txg; if (ours.home) { G.ss.attSum += ours.att / G.club.cap; G.ss.attN++; } }
  G.lastCup = cup;
  G.ss.maxTicket = Math.max(G.ss.maxTicket, man('com', 'tickets'));
  weeklyFinance(ours && ours.home); projectsWeekly();
  for (const p of G.squad) { develop(p, 1); if (p.inj > 0) p.inj -= G.push.medical > 0 ? 2 : 1; if (p.susp > 0 && !(ours && ours.ev.some(e => e.red && e.t.includes(p.name)))) p.susp--; p.morale = clamp(p.morale + (ours ? (ours.result === 'W' ? 3 : ours.result === 'L' ? -3 : 0) : 0) + (65 - p.morale) * 0.05 + (G.push.sporting > 0 ? 1.5 : 0) - (p.st.apps < G.week / 3 && p.pers.amb > 14 && G.week > 6 ? 1 : 0), 0, 100); }
  if (HOOK.acadWeekly) HOOK.acadWeekly(); else for (const p of G.academy) develop(p, (0.7 + eff('acad', 0) / 25 + G.club.fac.youth * 0.05) * (G.push.academy > 0 ? 1.5 : 1));
  if (G.week === 28) { if (HOOK.acadIntake) HOOK.acadIntake(); else academyIntake(); }
  kpiWeekly(ours && ours.result); staffWeekly(); boardWeekly(ours && ours.result);
  if (HOOK.seasonAfterMatch) HOOK.seasonAfterMatch(ours);
  if (over()) { buildPaper(ours, cup); if (HOOK.edition) HOOK.edition(ours, cup); return { ours, cup, sacked: true }; }
  if (G.club.cash < -M(4000) && !G.flags.crisisWeek) { queueEvent('cash_crisis', {}); G.flags.crisisWeek = true; } if (G.club.cash > 0) G.flags.crisisWeek = false;
  if (G.club.cash < -M(60000)) G.flags.insolvent = (G.flags.insolvent || 0) + 1; else G.flags.insolvent = 0;
  // paper
  buildPaper(ours, cup); buildReports(ours); if (FO.deptIssueWeekly) FO.deptIssueWeekly(); if (HOOK.edition) HOOK.edition(ours, cup);
  if (G.board.conf <= 0) { sack('The board has run out of patience and relieved you of your duties.', 'board'); return { ours, cup, sacked: true }; }
  if (G.flags.insolvent >= 4) {
    if (G.flags.adminAt != null && G.season - G.flags.adminAt < 3) { sack('The club has entered administration for the second time. The administrators have dismissed you.', 'admin'); return { ours, cup, sacked: true }; }
    administration();
  }
  G.week++;
  if (G.week > SEASON_WEEKS) { endSeason(); return { ours, cup, seasonOver: true }; }
  if (G.week === 9) { const p = G.promises.find(x => x.k === 'tickets' && x.status === 'open'); if (p && man('com', 'tickets') > 50) G.paper.stories.push({ h: 'Promise watch', t: 'Supporters note that ticket prices have crept above what was promised.' }); }
  if (G.later) { const due = G.later.filter(l => l.at <= absWeek()); G.later = G.later.filter(l => l.at > absWeek()); for (const l of due) queueEvent(l.id, l.ctx); }
  if (HOOK.seasonWeekly) HOOK.seasonWeekly();
  genMessages(); genBriefs();
  G.inbox = G.inbox.filter((m, i) => !m.done || i < 40);
  return { ours, cup };
}
function buildPaper(o, cup) {
  const P = G.paper, me = G.club.name;
  if (o) {
    const gd = o.ug - o.tg, opp = o.oppName.split(' ')[0];
    const H = o.result === 'W' ? (gd >= 3 ? [`${G.club.short} run riot against ${opp}`, `${opp} swept aside`, `Statement win for ${me}`] : [`${me} edge past ${opp}`, `Narrow win keeps ${G.club.short} rolling`, `${opp} beaten`]) : o.result === 'D' ? [`Honours even with ${opp}`, `${me} held by ${opp}`, `Stalemate against ${opp}`] : (gd <= -3 ? [`Humbled by ${opp}`, `${opp} hand ${me} a hiding`, `Night to forget for ${G.club.short}`] : [`${me} fall to ${opp}`, `${opp} sting ${G.club.short}`, `Defeat at ${opp}`]);
    P.headline = pick(H);
    P.sub = `${o.home ? me + ' ' + o.ug + '–' + o.tg + ' ' + o.oppName : o.oppName + ' ' + o.tg + '–' + o.ug + ' ' + me}. xG ${o.uxg.toFixed(1)}–${o.txg.toFixed(1)}. ${o.motm ? 'Player of the match: ' + o.motm + '.' : ''}${o.att ? ' Crowd: ' + o.att.toLocaleString('en-GB') + '.' : ''} ${G.club.name} sit ${ord(myPos())} in the ${TIERS[G.club.tier]}.`;
  }
  if (cup) P.stories.unshift({ h: `Cup ${cup.rd}`, t: `${cup.ug}–${cup.tg} against ${cup.oppName}${cup.pens ? ', ' + cup.pens : ''}. ${G.cup.alive || G.cup.won === G.season ? (G.cup.won === G.season ? 'The National Cup is ours!' : 'Into the next round' + (cup.prize ? ', worth ' + money(cup.prize) : '') + '.') : 'Out of the cup.'}` });
  if (o && o.injured.length) P.stories.push({ h: 'Injury', t: o.injured.map(p => `${p.name} (${p.inj} wk)`).join(', ') + ' added to the treatment room.' });
  if (G.board.conf < 30) P.stories.push({ h: 'Boardroom', t: 'Sources close to the board describe the mood as "deeply concerned".' });
}

