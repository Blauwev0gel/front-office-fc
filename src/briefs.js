/* The Front Office · weekly briefings (1.5)
   Short, state-driven updates and conversations. Quick responses are free unless marked as costing an action. */
(function (F) {
'use strict';
const g = () => F.G, B = F.defineBrief;
const { pick, chance, clamp, money, M, staff, man, staffName, gauss } = F;
const sq = () => g().squad, N = r => staffName(r), P = id => g().squad.find(p => p.id === id) || g().academy.find(p => p.id === id) || (g().shortlist || []).find(p => p.id === id);
const rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const boost = (r, n) => { const s = staff(r); if (s) { s.boost = clamp(s.boost + n, -10, 12); s.boostW = 4; } };
const fx = (k, n) => { const G = g(); if (k === 'board') G.board.conf = clamp(G.board.conf + n, 0, 100); else if (k === 'cash') G.club.cash += n; else G.st[k] = clamp(G.st[k] + n, 0, 100); };
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const inWindowSoon = () => { const w = g().week; return w <= 3 || (w >= 15 && w <= 18); };

/* ---------- scouting ---------- */
B('scout_find', { role: 'scout', cd: 2,
  check: () => { const sl = (g().shortlist || []).filter(p => p.found >= F.absWeek() - 1 && !p.prio); if (!sl.length) return null; const p = sl.sort((a, b) => F.scoreTarget(b) - F.scoreTarget(a))[0]; const worst = sq().filter(x => x.pos === p.pos).sort((a, b) => a.ca - b.ca)[0]; return { pid: p.id, name: p.name, age: p.age, pos: p.pos, reg: F.REGIONS[p.region].name, s: F.stars(p.pCA), ps: F.stars(p.pPA), fee: p.fee, better: worst ? p.pCA > worst.ca + 0.3 : true, score: 2 + (F.stars(p.pPA) >= 4 ? 1 : 0) }; },
  title: c => `Scouting: ${c.name} could be one for us`, text: c => `${c.name} (${c.age}, ${F.POS_L[c.pos]}, ${c.reg}). Rated ${c.s}★ now, ${c.ps}★ potential. ${c.fee ? 'Fee around ' + money(c.fee) + '.' : 'Available on a free.'} ${c.better ? 'He would improve our squad.' : 'More of a squad option.'}`,
  opts: [
    { l: 'Tell the DoF to prioritise him', h: 'He moves to the top of the list', f: c => { const p = P(c.pid); if (!p) return 'He has already gone elsewhere.'; p.prio = true; rel('scout', 2); return `${c.name} is now the DoF's priority ${F.window_ ? '' : ''}for the ${F.POS_L[c.pos].toLowerCase()} role.`; } },
    { l: 'Ask for a second look', h: 'Sharper estimate', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.pCA = p.ca + gauss() * 0.35; p.pPA = Math.max(p.pCA, p.pa + gauss() * 0.5); return `After another two games: ${F.stars(p.pCA)}★ now, ${F.stars(p.pPA)}★ potential.`; } },
    { l: 'Noted', h: '', f: () => 'Filed on the shortlist.' }] });
B('scout_dry', { role: 'scout', cd: 8,
  check: () => { const foc = ((g().club.net[man('scout', 'reg1')] || 0) + (g().club.net[man('scout', 'reg2')] || 0)) / 2; return foc < 20 && (g().shortlist || []).length < 3 ? { foc: Math.round(foc), score: 1.2 } : null; },
  title: () => 'Scouting: the network is too thin', text: c => `Our network in the focus regions is only ${c.foc} out of 100. "I am watching the same three leagues as everyone else."`,
  opts: [
    { l: 'Approve extra travel', h: () => `−${money(M(800))} · network +8`, f: () => { fx('cash', -M(800)); for (const k of [man('scout', 'reg1'), man('scout', 'reg2')]) g().club.net[k] = clamp(g().club.net[k] + 8, 0, 100); rel('scout', 3); return 'Two weeks on the road. Contacts made.'; } },
    { l: 'Be patient', h: '', f: () => { rel('scout', -1); return 'He will keep at it.'; } }] });

/* ---------- director of football ---------- */
B('dof_priority', { role: 'dof', cd: 10,
  check: () => inWindowSoon() && !((g().dofPrioAt || -99) > F.absWeek() - 10) ? { opts: [F.weakestPos(), ...F.squadNeeds()].filter((v, i, a) => v && a.indexOf(v) === i).concat(['ST', 'CB', 'CM']).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3), score: 3 } : null,
  title: () => 'Transfer window: where do we strengthen?', text: c => `${N('dof')} wants your steer before the window. He suggests ${c.opts.map(p => F.POS_L[p].toLowerCase()).join(', ')}. Weakest area right now: ${F.POS_L[c.opts[0]].toLowerCase()}.`,
  opts: [0, 1, 2].map(i => ({ l: c => c.opts[i] ? `Priority: ${F.POS_L[c.opts[i]].toLowerCase()}` : 'Your call', h: '', f: c => { g().dofPrio = c.opts[i] || null; g().dofPrioAt = F.absWeek(); return `The DoF will focus on ${c.opts[i] ? F.POS_L[c.opts[i]].toLowerCase() : 'whatever he sees fit'} this window.`; } })) });
B('unhappy_player', { role: 'dof', cd: 5,
  check: () => { const p = sq().filter(p => p.morale < 45 && p.pers.amb > 11 && p.st.apps < g().week / 2).sort((a, b) => a.morale - b.morale)[0]; return p && g().week > 5 ? { pid: p.id, name: p.name, apps: p.st.apps, score: 1.5 } : null; },
  title: c => `${c.name} is unhappy`, text: c => `${c.name} has started ${c.apps} games and wants to know where he stands. ${N('dof')} asks how you want to handle it.`,
  opts: [
    { l: 'Ask the coach to play him', h: 'Player happier · coach slightly annoyed', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.morale = clamp(p.morale + 15, 0, 100); rel('coach', -2); return 'The coach agrees, reluctantly.'; } },
    { l: 'Sell him in the window', h: 'DoF will look for a buyer', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.sellFlag = true; return 'He goes on the transfer list.'; } },
    { l: 'Leave it', h: 'Risk he sulks', f: () => 'Nothing changes.' }] });
B('form_player', { role: 'dof', cd: 6,
  check: () => { const p = sq().filter(p => (p.rats || []).length >= 3 && avg(p.rats) >= 7.4).sort((a, b) => avg(b.rats) - avg(a.rats))[0]; return p ? { pid: p.id, name: p.name, r: avg(p.rats).toFixed(2), score: 1.6 + (p.contract <= 1 ? 1 : 0), c: p.contract } : null; },
  title: c => `${c.name} is flying`, text: c => `Average rating ${c.r} over his last games. ${c.c <= 1 ? 'His contract expires this summer; other clubs will notice.' : `He has ${c.c} years left on his deal.`}`,
  opts: [
    { l: 'Open contract talks now', h: 'Wage +20% · contract +2 years', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.wage = Math.round(p.wage * 1.2 / 5) * 5; p.contract += 2; p.morale = clamp(p.morale + 10, 0, 100); return `${c.name} signs an extension.`; } },
    { l: 'Let him play', h: '', f: () => 'No distractions.' }] });

/* ---------- first team ---------- */
B('coach_slump', { role: 'coach', cd: 4,
  check: () => { const f = g().form.slice(-3); return f.length === 3 && f.filter(r => r === 'L').length >= 2 ? { score: 2.5 } : null; },
  title: () => `${N('coach')} comes to see you`, text: () => { const A = F.analysis(); return `"Two defeats in three. I want to change things: tighter at the back, fewer risks." The analysts' view: ${A.causes.length ? A.causes[0].t.split('.')[0] : 'mostly bad luck'}.`; },
  opts: [
    { l: 'Back his plan', h: 'Coach ↑ · attack slider −15', f: () => { g().mand.coach.attack = clamp(g().mand.coach.attack - 15, 0, 100); rel('coach', 4); boost('coach', 2); return 'He leaves with your backing.'; } },
    { l: 'Ask what the data says', h: 'Depends on the numbers', f: () => { const ss = g().ss, xgd = ss.lg ? (ss.xgf - ss.xga) / ss.lg : 0; if (xgd >= 0) { rel('coach', 3); return `xG difference is ${xgd >= 0 ? '+' : ''}${xgd.toFixed(2)} per game. You both agree: keep faith, the results will come.`; } boost('coach', 4); rel('coach', -2); return `xG difference is ${xgd.toFixed(2)} per game. Hard to argue with; he goes back to the drawing board.`; } },
    { l: 'Remind him of the target', h: 'Coach sharper · trust ↓', f: () => { boost('coach', 4); rel('coach', -5); return 'Message received.'; } }] });
B('coach_flying', { role: 'coach', cd: 6,
  check: () => { const f = g().form.slice(-3); return f.length === 3 && f.every(r => r === 'W') ? { score: 2 } : null; },
  title: () => 'Three wins on the bounce', text: () => `${N('coach')}: "The group is flying. I would like to keep the same eleven for a while."`,
  opts: [
    { l: 'Agree: settled team', h: 'Rotation −15', f: () => { g().mand.coach.rotation = clamp(g().mand.coach.rotation - 15, 0, 100); rel('coach', 3); return 'Same team, same rhythm.'; } },
    { l: 'Praise the whole squad', h: 'Squad morale ↑', f: () => { sq().forEach(p => p.morale = clamp(p.morale + 4, 0, 100)); return 'A note from the CEO on every locker.'; } },
    { l: 'Keep rotating', h: 'Fringe players stay sharp', f: () => { rel('coach', -1); return 'He accepts, without enthusiasm.'; } }] });
B('injury_blow', { role: 'coach', cd: 4,
  check: () => { const best = sq().slice().sort((a, b) => b.ca - a.ca).slice(0, 6); const p = best.find(p => p.inj >= 4 && !p.injNoted); return p ? (p.injNoted = true, { pid: p.id, name: p.name, w: p.inj, score: 2.2 }) : null; },
  title: c => `Medical: ${c.name} out for ${c.w} weeks`, text: c => `One of our best players. The physio says specialist treatment abroad could speed things up.`,
  opts: [
    { l: 'Pay for specialist treatment', h: () => `−${money(M(1200))} · two weeks sooner`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; fx('cash', -M(1200)); p.inj = Math.max(1, p.inj - 2); return `${c.name} flies out on Monday.`; } },
    { l: 'Normal rehab', h: '', f: () => 'He will be back when he is back.' }] });

/* ---------- academy ---------- */
B('acad_flying', { role: 'acad', cd: 4,
  check: () => { const p = g().academy.filter(p => p.age >= 15 && !p.loanOut && ((p.noted != null && p.ca - p.noted >= 0.5) || (p.noted == null && p.band && p.band[1] >= 3.5))).sort((a, b) => b.pa - a.pa)[0]; if (!p) return null; const was = p.noted; p.noted = p.ca; return { pid: p.id, name: p.name, age: p.age, pos: p.pos, s: F.absStars(p.ca), ps: p.band ? p.band[0] + '–' + p.band[1] : F.absStars(p.pa), grew: was != null, score: 1.8 }; },
  title: c => `Academy: ${c.name} is ${c.grew ? 'improving fast' : 'one to watch'}`, text: c => `${c.name} (${c.age}, ${F.POS_L[c.pos]}): level ${c.s}★ now, potential ${c.ps}★ on the absolute scale. ${N('acad')} thinks he is ahead of schedule.`,
  opts: [
    { l: 'Train with the first team', h: 'Faster development · coach must fit him in', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.pa = Math.min(20, p.pa + 0.2); p.a.com = clamp(p.a.com + 0.5, 1, 20); rel('acad', 3); return `${c.name} joins first-team training twice a week.`; } },
    { l: 'Visit the academy yourself', h: 'Academy staff ↑', f: c => { rel('acad', 5); g().academy.forEach(p => p.morale = clamp(p.morale + 5, 0, 100)); return 'The kids will talk about it for weeks.'; } },
    { l: 'Keep him with the under-18s', h: '', f: () => 'No rush.' }] });
B('acad_intake_soon', { role: 'acad', cd: 30,
  check: () => g().week === 24 ? { score: 2 } : null,
  title: () => 'Academy intake in four weeks', text: () => `${N('acad')} asks where to look this year. Current focus: ${man('acad', 'local') > 60 ? 'local kids' : man('acad', 'local') < 40 ? 'recruiting widely' : 'a mix'}, ${man('acad', 'technical') > 60 ? 'technical' : man('acad', 'technical') < 40 ? 'physical' : 'all-round'} profiles.`,
  opts: [
    { l: 'Local kids, technical', h: 'Fans like it', f: () => { const m = g().mand.acad; m.local = 75; m.technical = 70; return 'Scouts head to the local schools.'; } },
    { l: 'Recruit widely, best potential', h: 'Higher ceiling, less local', f: () => { const m = g().mand.acad; m.local = 25; return 'The net goes wide.'; } },
    { l: 'Leave it to him', h: '', f: () => { rel('acad', 2); return 'He appreciates the trust.'; } }] });

/* ---------- business ---------- */
B('fin_wage', { role: 'fin', cd: 6,
  check: () => { const wr = F.wageRatio() * 100, cp = +man('fin', 'wageCap'); return g().fin.revW >= 4 && wr > cp - 6 && wr <= cp ? { wr: Math.round(wr), cp, score: 1.4 } : null; },
  title: () => 'Finance: wages are close to the cap', text: c => `Player wages are at ${c.wr}% of revenue against your cap of ${c.cp}%. One more signing could tip it over.`,
  opts: [
    { l: 'Freeze wage increases until the summer', h: 'DoF wage limit to squad average', f: () => { if (g().mand.dof.maxWage !== '100') g().wageFreezePrev = g().mand.dof.maxWage || '200'; g().mand.dof.maxWage = '100'; rel('dof', -2); return 'The DoF is told: no new high earners.'; } },
    { l: 'Fine, we are investing', h: '', f: () => 'Finance notes your decision.' }] });
B('fin_runway', { role: 'fin', cd: 5,
  check: () => { const L = g().fin.last; if (!L || L.tin >= L.tout || g().club.cash <= 0) return null; const wks = Math.floor(g().club.cash / (L.tout - L.tin)); return wks < 12 ? { wks, score: 2.5 } : null; },
  title: c => `Finance: cash runs out in about ${c.wks} weeks`, text: () => `${N('fin')} wants to act before it becomes a crisis.`,
  opts: [
    { l: 'Trim the department budgets', h: 'Scouting, academy and marketing −20', f: () => { for (const r of ['scout', 'acad', 'mkt']) g().mand[r].budget = clamp(g().mand[r].budget - 20, 0, 100); return 'Budgets trimmed across three departments.'; } },
    { l: 'Arrange a bridging loan', h: () => `+${money(M(15000))} · debt ↑`, f: () => { fx('cash', M(15000)); g().club.debt += M(16500); return 'The bank provides a bridge.'; } },
    { l: 'Wait for the next sale', h: 'Risky', f: () => 'Finance is nervous.' }] });

/* ---------- commercial & marketing ---------- */
B('crowd_low', { role: 'com', cd: 4,
  check: () => { const lm = g().lastMatch; if (!lm || !lm.home) return null; const fill = lm.att / g().club.cap; return fill < 0.55 ? { fill: Math.round(fill * 100), att: lm.att, score: 1.5 } : null; },
  title: c => `Commercial: only ${c.fill}% full on Saturday`, text: c => `${c.att.toLocaleString('en-GB')} fans at ${money(F.ticketPrice())} a ticket. ${N('com')} has two ideas.`,
  opts: [
    { l: 'Cut ticket prices', h: 'Ticket slider −10', f: () => { g().mand.com.tickets = clamp(g().mand.com.tickets - 10, 0, 100); fx('fans', 2); return 'Prices come down from the next home game.'; } },
    { l: 'Run a two-for-one promotion', h: () => `−${money(M(500))} · bigger crowd, fans ↑`, f: () => { fx('cash', -M(500)); fx('fans', 3); g().club.fanbase = Math.round(g().club.fanbase * 1.02); return 'A busy ground next week.'; } },
    { l: 'Hold prices', h: '', f: () => 'Prices stay.' }] });
B('sellout', { role: 'com', cd: 6,
  check: () => { const lm = g().lastMatch; return lm && lm.home && lm.att >= g().club.cap * 0.97 ? { score: 1.4 } : null; },
  title: () => 'Commercial: sold out again', text: () => `Every seat gone at ${money(F.ticketPrice())}. ${N('com')} sees room to charge more.`,
  opts: [
    { l: 'Raise prices', h: 'Ticket slider +10 · fans ↓', f: () => { g().mand.com.tickets = clamp(g().mand.com.tickets + 10, 0, 100); fx('fans', -2); return 'Prices up from next month.'; } },
    { l: 'Keep prices, reward loyalty', h: 'Fans ↑', f: () => { fx('fans', 2); return 'The supporters notice.'; } }] });
B('mood_drop', { role: 'mkt', cd: 6,
  check: () => g().prev && g().st.fans < 50 && g().prev.fans - g().st.fans >= 3 ? { m: Math.round(g().st.fans), score: 1.6 } : null,
  title: () => 'Marketing: the mood is turning', text: c => `Supporter mood is down to ${c.m}. Social channels are getting louder. ${N('mkt')} wants to get ahead of it.`,
  opts: [
    { l: 'Write an open letter', h: 'Fans ↑', f: () => { fx('fans', 3); return 'Honest and well received.'; } },
    { l: 'Host a fan forum', h: () => `−${money(M(400))} · fans +5, some heat`, f: () => { fx('cash', -M(400)); fx('fans', 5); fx('press', -1); return 'Two hours of hard questions. People respect that you came.'; } },
    { l: 'Let results do the talking', h: '', f: () => 'Silence.' }] });
B('project_check', { role: 'fin', cd: 4,
  check: () => { const pr = (g().projects || []).find(p => !p.checked && F.absWeek() >= p.start + (p.due - p.start) / 2); if (!pr) return null; pr.checked = true; const d = F.PROP[pr.id]; let t = ''; try { t = typeof d.title === 'function' ? d.title(pr.ctx) : d.title; } catch (e) { } return { pid: pr.id, t, owner: pr.owner, ok: pr.p >= 0.6, score: 1.7 }; },
  title: c => `Project update: ${c.t}`, text: c => `${N(c.owner)} reports ${c.ok ? 'that it is on schedule.' : 'problems: suppliers are late and costs are creeping up.'}`,
  opts: [
    { l: 'Add resources', h: () => `−${money(M(1500))} · better odds`, f: c => { const pr = (g().projects || []).find(p => p.id === c.pid); if (!pr) return 'Already finished.'; fx('cash', -M(1500)); pr.p = clamp(pr.p + 0.12, 0, 0.97); return 'Extra people on it.'; } },
    { l: 'Keep going as planned', h: '', f: () => 'Noted.' }] });

/* ---------- recurring conversations ---------- */
B('coach_debrief', { role: 'coach', cd: 2,
  check: () => { const lm = g().lastMatch; if (!lm || lm.comp !== 'League') return null; const played = sq().filter(p => p.lastRat && (p.rats || []).length); const top = played.slice().sort((a, b) => b.lastRat - a.lastRat)[0], low = played.slice().sort((a, b) => avg(a.rats) - avg(b.rats))[0]; return top && low && top !== low ? { top: top.id, tn: top.name, low: low.id, ln: low.name, lr: avg(low.rats).toFixed(2), xg: lm.uxg.toFixed(1), xga: lm.txg.toFixed(1), res: lm.result, score: 0.9 } : null; },
  title: () => `Debrief with ${N('coach')}`, text: c => `"${c.res === 'W' ? 'A good day.' : c.res === 'L' ? 'Not good enough.' : 'A point is a point.'} We made ${c.xg} xG, gave away ${c.xga}. ${c.tn} was excellent. I am worried about ${c.ln}: ${c.lr} average lately."`,
  opts: [
    { l: c => `Praise ${c.tn} publicly`, h: 'His morale up', f: c => { const p = P(c.top); if (p) p.morale = clamp(p.morale + 10, 0, 100); return `${c.tn} reads it in the paper and grows another inch.`; } },
    { l: c => `Ask about ${c.ln}`, h: 'Coach drops or backs him', f: c => { const p = P(c.low); if (!p) return 'Gone.'; if (staff('coach') && staff('coach').p.ego > 12) { rel('coach', -1); return '"Leave the team to me." He bristles a little.'; } p.morale = clamp(p.morale - 5, 0, 100); boost('coach', 1); return `${c.ln} will start on the bench next week.`; } },
    { l: 'Nothing to add', h: '', f: () => 'On to the next one.' }] });
B('big_game', { role: 'coach', cd: 3,
  check: () => { const G = g(), r = G.divs[G.club.tier].fix[G.week - 1]; if (!r) return null; const f = r.find(x => x[0] === 0 || x[1] === 0); const opp = f[0] === 0 ? f[1] : f[0], tab = F.sortTable(G.club.tier), pos = tab.indexOf(opp) + 1; return pos <= 3 || Math.abs(pos - F.myPos()) <= 1 ? { opp: F.cname(opp), pos, home: f[0] === 0, score: 1.3 } : null; },
  title: c => `Big game: ${c.opp} (${F.ord(c.pos)}) ${c.home ? 'at home' : 'away'}`, text: c => `${c.pos <= 3 ? 'One of the best sides in the division.' : 'A direct rival in the table.'} ${N('coach')} asks if you want to say anything to the players.`,
  opts: [
    { l: 'Visit the dressing room', h: 'Squad morale ↑', f: () => { sq().forEach(p => p.morale = clamp(p.morale + 3, 0, 100)); return 'A short speech. The room listens.'; } },
    { l: 'Tell the coach to be brave', h: 'Attack +10', f: () => { g().mand.coach.attack = clamp(g().mand.coach.attack + 10, 0, 100); return 'Go and win it.'; } },
    { l: 'Leave it to him', h: '', f: () => { rel('coach', 1); return 'He appreciates the trust.'; } }] });
B('staff_distant', { role: null, cd: 6,
  check: () => { const r = F.ROLES.find(r => staff(r.id) && staff(r.id).rel < 40); return r ? { role: r.id, name: staff(r.id).name, t: r.t, score: 1.5 } : null; },
  title: c => `${c.name} seems distant`, text: c => `Your ${c.t.toLowerCase()} has been short in meetings and quiet in the corridors. Relationship: ${Math.round(staff(c.role) ? staff(c.role).rel : 0)}.`,
  opts: [
    { l: 'Take him to lunch', h: 'Relationship +6', f: c => { rel(c.role, 6); return 'An honest conversation over lunch. It helps.'; } },
    { l: 'Ask him straight what is wrong', h: 'Could clear the air, or not', f: c => { const s = staff(c.role); if (!s) return 'Gone.'; if (s.p.ego < 13) { rel(c.role, 9); return 'He tells you, and you can fix some of it.'; } rel(c.role, -3); return 'He takes it as an accusation.'; } },
    { l: 'Give him space', h: '', f: () => 'You leave it.' }] });
B('chairman_call', { role: null, cd: 5,
  check: () => { const G = g(); return G.prev && G.prev.conf - G.board.conf >= 2 && G.board.conf < 55 ? { c: Math.round(G.board.conf), score: 2 } : null; },
  title: () => 'The chairman calls', text: c => `Board confidence is ${c.c}%. "I just want to understand what is happening."`,
  opts: [
    { l: 'Walk him through the numbers', h: 'Works if performances back you', f: () => { const A = F.analysis(); if (A.xpts - A.pts >= 2 || A.pos <= A.target) { fx('board', 4); return 'He is reassured by the underlying numbers.'; } fx('board', -1); return 'The numbers do not help your case.'; } },
    { l: 'Promise improvement', h: 'Board ↑ now', f: () => { fx('board', 2); return 'He will hold you to it.'; } },
    { l: 'Keep it short', h: '', f: () => { fx('board', -1); return 'A brief, cool call.'; } }] });
})(FO);
