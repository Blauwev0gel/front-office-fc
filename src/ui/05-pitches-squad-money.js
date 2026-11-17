/* ---------- project pitches: one at a time, swipe or tap ---------- */
function pitchCard(it, i, mt) {
  const v = F.proposalView(it), pot = F.meetingPot(), tot = v.track.ok + v.track.fail, sp = splitSay(v.pitch);
  const imp = v.impact.slice(0, 2), why = v.impact.length && v.impact[0][1] !== '' ? `${v.impact[0][0]} is ${v.impact[0][1]} today.` : v.benefit;
  return `<div class="pcard swipe" data-i="${i}" tabindex="0" aria-label="Pitch: ${esc(v.title)}. Swipe right to approve, left to reject.">
    <span class="stampR">APPROVE</span><span class="stampL">REJECT</span>
    <div class="phd"><div class="portrait">${ART.staffFace(it.owner, v.pc > .7 ? 'happy' : null)}</div><div><b>${esc(v.owner)}</b><span class="small">${esc(v.ownerRole)}${tot ? `, delivered ${v.track.ok} of ${tot}` : ''}</span></div></div>
    <h3 class="ptitle">${esc(v.title)}</h3>
    <p class="ppitch">${esc(sp.say)}</p>
    ${why ? `<div class="why">${ART.I.bulb}<span><b>Why now:</b> ${esc(why)}</span></div>` : ''}
    ${imp.length ? `<div class="imp2">${imp.map(r => `<div><small>${esc(r[0])}</small><b>${esc(r[1])}${r[1] !== '' ? ' → ' : ''}<em>${esc(r[2])}</em></b></div>`).join('')}</div>` : ''}
    <div class="cost"><span class="${it.cost > pot ? 'bad' : ''}">${ART.I.money}${money(v.cost)}</span><span>${ART.I.wage}${v.wk ? money(v.wk) + '/wk' : 'none'}</span><span>${ART.I.time}${v.dur} wk</span><span>${ART.I.trust}${Math.round(v.pc * 100)}%</span></div>
    ${v.second ? `<p class="second2"><b>${esc(v.second.name)}:</b> ${esc(v.second.t)} (${Math.round(v.second.est * 100)}%)</p>` : ''}
  </div>`;
}
function pitchDeck(mt, kick, inTray) {
  const g = G(), pot = F.meetingPot(), items = mt.items.map((it, i) => ({ it, i })), open = items.filter(o => o.it.status === 'open'), done = items.filter(o => o.it.status !== 'open');
  const cur = open[0], cost = cur ? cur.it.cost : 0;
  const meter = `<div class="pmeter"><div class="row"><span>Available to invest</span><b>${money(pot)}</b></div><div class="bar"><u style="width:${pot ? Math.min(100, cost / pot * 100) : 0}%" class="${cost > pot ? 'over' : ''}"></u></div><small>${cur ? (cost > pot ? 'This pitch costs more than Finance can release.' : `This pitch uses ${money(cost)}. ${money(pot - cost)} left.`) : 'All pitches decided.'}</small></div>`;
  const deck = cur ? `<div class="deck">${open.length > 2 ? '<div class="pcard back2"></div>' : ''}${open.length > 1 ? '<div class="pcard back"></div>' : ''}${pitchCard(cur.it, cur.i, mt)}</div><p class="small">Review the proposal, request independent advice or decide. The department will carry out any approved work.</p>` : '';
  const v = cur ? F.proposalView(cur.it) : null;
  const dossier = cur && typeof F.caseView === 'function' ? F.caseView('p', cur.i) : null;
  const decisionContext = dossier ? `<div class="fo-proposal-context" aria-label="Project decision context">
    <b>Strategic proposal · ${esc(dossier.owner)}</b>
    <p>${esc(dossier.reason)}</p>
    <small>${esc(dossier.noResponse)}</small></div>` : '';
  const btns = cur ? `<div class="row3"><button class="btn ghost no" data-a="prop" data-i="${cur.i}" data-c="reject">Reject</button>${!v.revised ? `<button class="btn ghost" data-a="prop" data-i="${cur.i}" data-c="revise">Cheaper</button>` : ''}<button class="btn" data-a="prop" data-i="${cur.i}" data-c="approve" ${cur.it.cost > pot ? 'disabled' : ''}>Approve</button></div>${!v.second ? `<button class="linkbtn" data-a="prop" data-i="${cur.i}" data-c="second">Ask for a second opinion</button>` : ''}` : '';
  const doneList = done.length ? `<div class="decided">${done.map(o => { const v2 = F.proposalView(o.it); return `<span class="${o.it.status === 'approved' ? 'good' : 'bad'}">${o.it.status === 'approved' ? '✓' : '✕'} ${esc(v2.title)}</span>`; }).join('')}</div>` : '';
  return `<section class="pitches"><div class="spread"><h2 class="itemh" style="margin:0">${esc(kick)}</h2><span class="chip">${cur ? `${done.length + 1} of ${items.length}` : 'Done'}</span></div>${decisionContext}${meter}${deck}${doneList}${inTray ? '' : btns}</section>${inTray && cur ? (U.tray = trayHtml('', btns, ''), U.trayH = 130, '') : ''}`;
}
function meetingBlock(mt, kick) { return pitchDeck(mt, kick, false); }

function vAcademy() {
  const g = G(), v = F.acadView(), a = v.a, c = g.club, sel = U.ag || 'U18', grpD = v.groups.find(x => x.k === sel), last = a.lastSeason;
  const maxN = Math.max(10, a.found.n / 4);
  const funnel = [{ l: 'Foundation', n: a.found.n, t: `${a.found.n} kids, quality ${Math.round(a.found.q)}`, w: a.found.n / 4 }, ...v.groups.map(x => ({ l: x.k, n: x.players.length, t: `${x.players.length} players${x.players[0] ? ', best ' + x.players[0].band[0] + '–' + x.players[0].band[1] + '★' : ''}. Coaching ${x.lv.toFixed(1)}`, w: x.players.length })), { l: 'First team', n: v.grads.length, t: `${v.grads.length} graduates in the squad`, w: v.grads.length }];
  const flag = p => [p.playUp ? 'plays up' : '', p.loanOut ? 'on loan' : '', p.mentor ? 'mentor' : '', p.lateJoin ? 'late join' : ''].filter(Boolean).join(', ');
  return `<button class="linkish" data-a="acad-close">Back to the club</button>
  <div class="spread" style="margin:6px 0 4px"><div><div class="kick">Youth academy</div><h2 style="font-size:32px">${esc(c.name)} Academy</h2></div><div class="row"><button class="btn small" data-a="sheet" data-s="mand" data-r="acad" ${F.staff('acad') ? '' : 'disabled'}>Academy mandate</button></div></div>
  <p class="small">Run by ${esc(F.staffName('acad'))}. Facilities level ${c.fac.youth}, reputation ${Math.round(a.rep)}, costs ${money(v.cost + (g.fin.last ? 0 : 0))}/wk on top of the academy budget. Our division plays at about ${v.tierLvl}★ on the absolute scale.</p>
  <div class="grid2"><section class="panel"><h2>${esc(F.acadCatName(v.cat))}</h2>${v.catScore.parts.map(p => `<div class="meter" style="grid-template-columns:110px minmax(0,1fr) 54px"><span>${p[0]}</span>${bar(p[1], p[2])}<span class="num">${Math.round(p[1])}/${p[2]}</span></div>`).join('')}
    <p class="small">Score ${Math.round(v.catScore.total)}. Category 3 from 55, category 2 from 75, category 1 from 95. Audit in week 30. A better category means better intakes, a grant, international recruitment and higher fees when rivals poach.</p></section>
  <section class="panel"><h2>${v.diag.length ? 'Why the academy is held back' : 'Academy health'}</h2>${v.diag.length ? v.diag.map(d => `<div class="lever"><p>${esc(d.t)}</p>${d.a === 'mand' ? `<button class="btn ghost small" data-a="sheet" data-s="mand" data-r="${d.x}" ${F.staff(d.x) ? '' : 'disabled'}>Open ${esc(F.ROLE[d.x].t)} mandate</button>` : d.a === 'tab' ? `<button class="btn ghost small" data-a="tab" data-t="${d.x}">Go to ${esc(d.x)}</button>` : ''}</div>`).join('') : '<p>No structural problems. Budget, coaching, welfare and the pathway are all in decent shape.</p>'}
    <h3>Return on investment</h3><dl class="kv"><dt>Spent since founding</dt><dd>${money(v.roi.spent)}</dd><dt>Earned (sales, fees, grants)</dt><dd>${money(v.roi.earned)}</dd><dt>Value of graduates in squad</dt><dd>${money(v.roi.val)}</dd><dt>Net</dt><dd class="${v.roi.net >= 0 ? 'good' : 'bad'}">${v.roi.net >= 0 ? '+' : ''}${money(v.roi.net)}</dd><dt>Cost per graduate</dt><dd>${v.roi.perGrad ? money(v.roi.perGrad) : '–'}</dd></dl></section></div>
  <section class="panel" style="margin-top:18px"><h2>Pipeline</h2>${funnel.map(f => `<div class="fun"><span>${f.l}</span><div class="bar"><i style="width:${Math.min(100, f.w / maxN * 100)}%"></i></div><span class="small">${esc(f.t)}</span></div>`).join('')}
  <p class="small">Potential is shown on the absolute scale, as a range: the better your coaches and recruiters, and the older the player, the narrower the range.</p></section>
  <section class="panel" style="margin-top:18px"><div class="spread"><h2>Players</h2><div class="seg">${['U14', 'U16', 'U18', 'U21'].map(k => `<button class="${sel === k ? 'on' : ''}" data-a="ag" data-v="${k}">${k}</button>`).join('')}</div></div>
  <div class="scroll"><table><thead><tr><th>Player</th><th>Age</th><th>Now</th><th>Potential</th><th>School</th><th>Welfare</th><th>Notes</th></tr></thead><tbody>${grpD.players.map(p => `<tr data-a="player" data-id="${p.id}"><td>${esc(p.name)}<span class="pos">${p.pos}</span></td><td>${p.age}</td><td>${stars(F.absStars(p.ca))}</td><td class="num">${p.band[0]}–${p.band[1]}★</td><td class="${p.edu < 40 ? 'bad' : ''}">${Math.round(p.edu)}</td><td class="${p.wel < 45 ? 'bad' : ''}">${Math.round(p.wel)}</td><td class="small">${esc(flag(p))}</td></tr>`).join('') || `<tr><td colspan="7" class="small">No players in the ${sel} group.</td></tr>`}</tbody></table></div>
  <p class="small">Coaching level ${grpD.lv.toFixed(1)} out of 10. School and welfare drive drop-outs: below 40 to 45 is a warning sign.</p></section>
  <div class="grid2" style="margin-top:18px">${['U18', 'U21'].map(k => { const t = v.lg[k], me = t.findIndex(x => x.id === 0); const last = k === 'U18' ? v.lg.lastU18 : v.lg.lastU21; return `<section class="panel"><h2>${k} league</h2>${last ? `<p class="small">Last: ${last.us > last.them ? 'won' : last.us < last.them ? 'lost' : 'drew'} ${last.us}–${last.them} against ${esc(last.opp)}${last.star ? '. ' + esc(last.star) + ' stood out' : ''}.</p>` : ''}<table><thead><tr><th>Team</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>${t.map((x, i) => i < 4 || Math.abs(i - me) <= 1 ? `<tr class="${x.id === 0 ? 'me' : ''}"><td>${i + 1}. ${esc(x.n)}</td><td>${x.p}</td><td>${sign(x.gf - x.ga)}</td><td>${x.pts}</td></tr>` : '').join('')}</tbody></table></section>`; }).join('')}</div>
  <section class="panel" style="margin-top:18px"><h2>Youth Cup</h2>${v.cup && v.cup.log.length ? `<ul class="list">${v.cup.log.map(l => `<li><span>${cap(l.rd)}: ${esc(l.opp)}</span><b class="${l.win ? 'good' : 'bad'}">${l.win ? 'Won' : 'Lost'}</b></li>`).join('')}</ul>` : '<p class="small">First round in week 9.</p>'}${v.honours.length ? `<p class="small">Honours: ${esc(v.honours.join(', '))}.</p>` : ''}</section>
  <div class="grid2" style="margin-top:18px"><section class="panel"><h2>Academy staff</h2>${v.staff.map(({ r, s }) => s ? `<div class="ystaff"><div class="spread"><div><div class="role">${esc(r.t)}</div><b>${esc(s.name)}</b></div><span class="small">${money(s.wage)}/wk</span></div><div class="small">${esc(s.bio)}.</div>${r.at.map((l, i) => `<div class="attr"><span>${l}</span>${bar(s.at[i], 20, 'ink')}<span class="num">${s.at[i]}</span></div>`).join('')}<button class="linkish" data-a="ysack" data-r="${r.id}">Ask the Director to replace him (${money(s.wage * 10)})</button></div>` : `<div class="ystaff"><div class="role">${esc(r.t)}</div><p class="small">Vacant. The Academy Director fills it at season end${F.staff('acad') ? '' : ', once there is a Director'}.</p></div>`).join('')}</section>
  <section class="panel"><h2>Last season</h2>${last ? `<div class="kvs">${[['Promoted to first team', last.promoted], ['New scholars', last.scholars], ['Kept as under-21s', last.u21], ['On loan', last.loans], ['Growth spurts', last.spurts], ['Late bloomers', last.bloom], ['Released', last.released], ['Dropped out', last.dropped]].map(([l, a]) => `<p><b>${l}</b> ${esc(a.join(', ') || 'none')}</p>`).join('')}</div>` : '<p class="small">The first review comes at the end of this season.</p>'}
  <h3>Graduates</h3>${a.log.length ? `<ul class="list">${a.log.slice().reverse().slice(0, 10).map(l => `<li><span>${esc(l.name)} <span class="small">${l.pos}, season ${l.season}</span></span><span class="num">${l.pot}★ potential</span></li>`).join('')}</ul>` : '<p class="small">No graduates yet.</p>'}</section></div>`;
}
function p90(v, m) { return m ? (v / m * 90).toFixed(2) : '–'; }
const STG_L = { identified: 'Identified', scouted: 'Scouted', recommended: 'Recommended', approach: 'Awaiting approval', negotiating: 'In talks', agreed: 'Agreed', signed: 'Signed', lost: 'Dropped' };
function squadSeg() {
  const mode = !U.sqTable ? 'xi' : U.sq === 'mb' ? 'stats' : 'players';
  return `<nav class="fo-squadnav" aria-label="Squad views">
    ${[['xi','Likely XI'],['players','All players'],['stats','Advanced stats']].map(([k,l]) =>
      `<button data-a="fo-squad" data-v="${k}" class="${mode === k ? 'on' : ''}" aria-current="${mode === k ? 'page' : 'false'}">${l}</button>`).join('')}
  </nav>`;
}
function recRow(o) {
  const { x, p, k } = o, d = x.deal, note = x.blocked ? `Blocked by ${x.blocked.join(', ')}` : x.stage === 'negotiating' && d && d.rounds.length ? d.rounds[d.rounds.length - 1] : (x.log || []).slice(-1)[0] || '';
  return `<button class="rrow" data-a="target" data-id="${x.pid}"><span class="gr g${k ? k.grade : 'D'}">${k ? k.grade : '?'}</span><span class="rmain"><b>${esc(p.name)}</b> <span class="pos">${p.pos}</span><span class="small rsub">${p.age}, ${F.REGIONS[p.region].name}${p.pool ? (p.club ? ', ' + money(p.ask) : ', free agent') : ''}${k ? `, ${F.recBand(k)}, ${k.conf} confidence` : ''}</span>${note ? `<span class="small rnote ${x.blocked ? 'warn' : ''}">${esc(note)}</span>` : ''}</span></button>`;
}
function vRecruit2() {
  const g = G(), V = F.recView(), R = V.r, groups = ['identified', 'scouted', 'recommended', 'approach', 'negotiating'];
  const thr = V.threshold === Infinity ? 'Never' : V.threshold === 0 ? 'Every deal' : 'Over ' + money(Math.round(V.threshold));
  const live = V.rows.filter(o => groups.includes(o.x.stage)), done = V.rows.filter(o => !groups.includes(o.x.stage)).slice(-6).reverse();
  const cnt = st => live.filter(o => o.x.stage === st).length, mx = Math.max(1, ...groups.map(cnt));
  const funnel = `<div class="funnel">${groups.map(st => `<div class="fstep"><b>${cnt(st)}</b><i style="height:${8 + cnt(st) / mx * 40}px"></i><small>${esc(STG_L[st])}</small></div>`).join('')}</div>`;
  const sect = st => { const rs = live.filter(o => o.x.stage === st).sort((a, b) => (a.k ? a.k.grade : 'Z').localeCompare(b.k ? b.k.grade : 'Z')), lim = st === 'scouted' || st === 'identified' ? 5 : 8; return rs.length ? `<div class="sub2">${esc(STG_L[st])} <span>${rs.length}</span></div>${rs.slice(0, lim).map(recRow).join('')}${rs.length > lim ? `<p class="small" style="margin:4px 0">And ${rs.length - lim} more.</p>` : ''}` : ''; };
  const pr = V.plan.prios.length ? `<div class="traits">${V.plan.prios.map(x => `<span>${F.POS_L[x.pos]}: ${esc(F.REC_KINDS[x.kind].toLowerCase())}</span>`).join('')}</div>` : '<p class="small" style="margin:0">No priorities set. The DoF follows squad needs.</p>';
  const scouts = V.scouts.map(sc => { const acc = F.recScoutAcc(sc), chief = sc === F.staff('scout'); return `<div class="pcard2 ${chief ? 'senior' : ''}"><span class="pf">${ART.face(sc.id * 31 + 3, { role: 'scout', age: sc.age || 40, bg: '#fff' })}</span><span class="pm"><b>${esc(sc.name)}</b><small>${chief ? 'Chief scout. ' : ''}${sc.assign ? esc(sc.assign.label) : 'Between assignments'}</small><small class="pw">Knows ${esc(F.REGIONS[sc.home || 'dom'].name)} best. ${sc.reports || 0} reports${acc ? `, off by ${acc.err.toFixed(1)}★ on average` : ''}</small></span><span></span></div>`; }).join('');
  const ev = F.recEval ? F.recEval(g.season) : [];
  const evs = ev.map(e => `<div class="scr2"><span>${esc(e.name)} <small>${e.pos}${e.loan ? ', loan' : ''}, ${e.fee ? money(e.fee) : 'free'}. Scouted ${e.est != null ? e.est + '★' : '–'}, now ${e.now != null ? e.now + '★' : '–'}, ${e.apps != null ? e.apps : 0} apps</small></span><b class="vchip ${e.cls}">${esc(e.verdict)}</b></div>`).join('');
  return `<div class="kgrid"><div class="kt"><small>Transfer budget</small><b>${money(V.budget)}</b></div><div class="kt ${V.inWin ? 'good' : ''}"><small>Window</small><b>${V.inWin ? 'Open' : 'Closed'}</b><span>${V.inWin ? (g.phase === 'summer' ? 'Summer' : `Shuts after week ${g.week <= 2 ? 2 : 18}`) : g.week < 17 ? 'Opens week 17' : 'Opens in summer'}</span></div><div class="kt"><small>You approve</small><b>${thr}</b></div><div class="kt"><small>Wage limit</small><b>${V.wageLimit === Infinity ? 'None' : money(Math.round(V.wageLimit))}</b>${V.wageLimit === Infinity ? '' : '<span>per week</span>'}</div></div>
  <div class="sec">Plan <button class="linkbtn" data-a="recplan" style="margin:0 0 0 auto">Edit plan</button></div><div class="panel2">${pr}</div>
  <div class="sec">The list</div><div class="panel2">${funnel}${live.length ? groups.slice().reverse().map(sect).join('') : `<p class="small">${V.scouts.length ? 'Nobody on the list right now. The scouts file new reports every week.' : 'Nobody on the list, and no chief scout to find anyone.'}</p>`}</div>
  ${done.length ? `<div class="sec">Recent outcomes</div><div class="panel2">${done.map(recRow).join('')}</div>` : ''}
  ${evs ? `<div class="sec">This season's signings</div><div class="panel2">${evs}<p class="small" style="margin:6px 0 0">Hit: a regular with good ratings. Miss: rarely plays or rates poorly.</p></div>` : ''}
  ${R.log.length ? `<div class="sec">Signed by the department</div><div class="panel2">${R.log.slice(0, 8).map(l => `<div class="scr2"><span>${esc(l.name)} <small>${l.pos}, season ${l.s}, week ${l.w}</small></span><b>${l.fee ? money(l.fee) : 'Free'}</b></div>`).join('')}</div>` : ''}
  <div class="sec">Scouts</div>${scouts || '<p class="small">No chief scout. Nobody is watching players.</p>'}
  <p class="small">Grades: A clear upgrade, B good addition, C squad level, D not for us. More reports and better scouts make the ranges narrower.</p>`;
}
function vMoney2() {
  const g = G(), c = g.club, L = g.fin.last, cap0 = +F.man('fin', 'wageCap'), wr = F.wageRatio() * 100, run = F.finRunway ? F.finRunway() : null;
  const LBL = { gate: 'Matchday tickets', tv: 'TV and prize pool', sponsors: 'Sponsorship', merch: 'Merchandise', owner: 'Owner top-up', playerWages: 'Player wages', staffWages: 'Staff wages', scouting: 'Scouting', academy: 'Academy', marketing: 'Marketing', ground: 'Stadium and running costs', facilities: 'Facility investment', interest: 'Loan interest', firstTeam: 'First-team support', projects: 'Projects', deptStaff: 'Department staff', firstBudget: 'First-team budget', comBudget: 'Commercial budget' };
  const mx = L ? Math.max(...Object.values(L.i), ...Object.values(L.o), 1) : 1;
  const rows = (o, cls) => Object.entries(o).filter(([, v]) => v).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="frow"><span>${esc(LBL[k] || k)}</span><i class="${cls}"><b style="width:${v / mx * 100}%"></b></i><em>${money(v)}</em></div>`).join('');
  const lw = L ? L.tin - L.tout : 0;
  return `<div class="kgrid"><div class="kt ${c.cash < 0 ? 'bad' : ''}"><small>Cash</small><b>${money(c.cash)}</b>${lw < 0 && c.cash > 0 ? `<span class="bad">${Math.floor(c.cash / -lw)} weeks at last week's rate</span>` : run != null ? `<span class="bad">${run} weeks left on forecast</span>` : '<span>Not burning cash</span>'}</div><div class="kt ${lw < 0 ? 'bad' : 'good'}"><small>Last week</small><b>${lw >= 0 ? '+' : ''}${money(lw)}</b></div><div class="kt ${wr > cap0 ? 'bad' : 'good'}"><small>Wages vs revenue</small><b>${r0(wr)}%</b><span>cap ${cap0}%</span></div><div class="kt ${(c.debt || 0) > 0 ? '' : 'good'}"><small>Debt</small><b>${money(c.debt || 0)}</b></div></div>
  <div class="sec">Cash over time</div><div class="panel2">${spark(g.fin.hist)}</div>
  <div class="sec">Last week</div><div class="panel2">${L ? `<div class="sub2" style="margin-top:0">Income <span>${money(L.tin)}</span></div>${rows(L.i, 'in')}<div class="sub2">Costs <span>${money(L.tout)}</span></div>${rows(L.o, 'out')}` : '<p class="small">Play a week to see the breakdown.</p>'}</div>
  <div class="sec">This season</div><div class="panel2"><div class="scr2"><span>Revenue</span><b>${money(g.ss.rev)}</b></div><div class="scr2"><span>Costs</span><b>${money(g.ss.exp)}</b></div><div class="scr2"><span>Transfers in / out</span><b>${money(g.ss.spent)} / ${money(g.ss.earned)}</b></div><div class="scr2"><span>Transfer budget, set by Finance</span><b>${money(F.transferBudget())}</b></div></div>`;
}
const PITCH = { GK: [[50, 90]], FB: [[14, 70], [86, 70]], CB: [[36, 74], [64, 74]], DM: [[50, 56]], CM: [[30, 44]], AM: [[70, 44]], W: [[16, 22], [84, 22]], ST: [[50, 14]] };
function vPitch() {
  const g = G(), L = F.pickXI(false);
  const xi = L.xi || [], players = new Set(xi.map(x=>x.p.id));
  const groups = [
    ['Goalkeeper', ['GK']],
    ['Defence', ['CB','FB']],
    ['Midfield', ['DM','CM','AM','W']],
    ['Attack', ['ST']]
  ];
  const line = (p,slot) => `<button class="fo-xi-row" data-a="player" data-id="${p.id}" aria-label="Open ${esc(p.name)}">
    <span class="fo-xi-pos">${esc(slot || p.pos)}</span><strong>${esc(p.name)}</strong>
    <span class="fo-xi-ability">${F.stars(p.ca)}★</span></button>`;
  const starters = groups.map(([label,roles]) => {
    const arr = xi.filter(x=>roles.includes(x.slot));
    return arr.length ? `<div class="fo-xi-group"><h3>${label}</h3>${arr.map(x=>line(x.p,x.slot)).join('')}</div>` : '';
  }).join('');
  const bench = (L.bench || []).filter(p=>!players.has(p.id));
  const benchIds = new Set(bench.map(p=>p.id));
  const others = g.squad.filter(p=>!players.has(p.id)&&!benchIds.has(p.id))
    .sort((a,b)=>b.ca-a.ca);
  return `${squadSeg()}
    <section class="fo-team-sheet"><div class="fo-sectionline"><h2>Manager's likely XI</h2><span>RECOMMENDED, NOT CONTROLLED</span></div>
      <p class="small">This is the coach's current selection. The CEO cannot change the line-up directly.</p>
      ${starters}
    </section>
    <details class="fo-squad-reserves"><summary>Bench · ${bench.length} players</summary>
      ${bench.map(p=>line(p,p.pos)).join('') || '<p>No bench available.</p>'}</details>
    <details class="fo-squad-reserves"><summary>Other squad members · ${others.length}</summary>
      ${others.map(p=>line(p,p.pos)).join('') || '<p>No other players.</p>'}</details>
    <button class="fo-textlink" data-a="dept-go" data-k="first" data-v="over">Discuss the squad with the manager</button>`;
}
function vSquad() {
  const g = G(), sq = g.squad.slice().sort((a, b) => 'GK CB FB DM CM AM W ST'.indexOf(a.pos) - 'GK CB FB DM CM AM W ST'.indexOf(b.pos) || b.ca - a.ca);
  const injured = sq.filter(p => p.inj > 0).length, suspended = sq.filter(p => p.susp > 0).length;
  const unhappy = sq.filter(p => p.morale < 40).length, expiring = sq.filter(p => p.contract <= 1).length;
  const pulse = `<section class="ceo-squad-pulse" aria-label="Squad at a glance"><h2>First-team squad</h2>
    <p class="small">${sq.length} players · ${money(F.playerWages())}/wk wages · expected ${F.ord(F.expectedRank())} in the division</p>
    <div class="ceo-metrics"><span><b>${injured}</b> injured</span><span><b>${suspended}</b> suspended</span><span><b>${unhappy}</b> low morale</span><span><b>${expiring}</b> contracts ≤1y</span></div>
    <p class="small">The coach picks the team. The Director of Football handles transfers; you set their direction in Departments.</p></section>`;
  if (!U.sqTable) return `${tourCard('squad')}${pulse}${vPitch()}`;
  const avgW = F.playerWages() / Math.max(1, sq.length);
  const rows = sq.map(p => {
    const stats = p.st || {}, rat = stats.apps ? stats.rat / stats.apps : null;
    return `<button class="ceo-player-row" data-a="player" data-id="${p.id}" aria-label="Open ${esc(p.name)}">
      <span class="ceo-player-main"><b>${esc(p.name)}</b><small>${esc(p.pos)} · ${p.age}y${p.inj > 0 ? ' · Injured ' + p.inj + 'w' : ''}${p.susp > 0 ? ' · Suspended' : ''}</small></span>
      <span class="ceo-player-number"><b>${F.stars(p.ca)}★</b><small>ability</small></span>
      <span class="ceo-player-number"><b>${stats.apps || 0}</b><small>apps</small></span>
      <span class="ceo-player-number"><b>${rat == null ? '–' : rat.toFixed(1)}</b><small>rating</small></span>
    </button>`;
  }).join('');
  const moneyball = `<div class="scroll"><table><thead><tr><th>Player</th><th>Mins</th><th>G</th><th>A</th><th>xG</th><th>xA</th><th>PrgP/90</th><th>Duels</th><th>Wage value</th></tr></thead><tbody>${sq.map(p => {
    const st = p.st || {}, mins = st.mins || 0, wv = st.apps ? (F.stars(p.ca) / 2.5) / (p.wage / avgW) * 100 : 0;
    return `<tr data-a="player" data-id="${p.id}"><td>${esc(p.name)} <span class="pos">${p.pos}</span></td><td>${mins}</td><td>${st.g || 0}</td><td>${st.a || 0}</td><td>${(st.xg || 0).toFixed(1)}</td><td>${(st.xa || 0).toFixed(1)}</td><td>${p90(st.prg || 0, mins)}</td><td>${st.dt ? r0(st.dw / st.dt * 100) + '%' : '–'}</td><td>${wv ? r0(wv) : '–'}</td></tr>`;
  }).join('')}</tbody></table></div>`;
  return `${tourCard('squad')}${pulse}${squadSeg()}
    
    ${U.sq === 'mb' ? moneyball : `<div class="ceo-player-list" aria-label="Players">${rows}</div>`}
    <p class="small">Tap a player for ability, potential, contract, morale, attributes and career detail.${U.sq === 'mb' ? ' Advanced stats scroll horizontally only in this view.' : ''}</p>`;
}
function spark(h) {
  if (h.length < 2) return '';
  const W = 600, H = 110, mn = Math.min(0, ...h), mx = Math.max(...h, 1), x = i => i / (h.length - 1) * W, y = v => H - 8 - (v - mn) / (mx - mn || 1) * (H - 16);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:110px;display:block" aria-label="Cash over time"><line x1="0" x2="${W}" y1="${y(0)}" y2="${y(0)}" stroke="currentColor" stroke-opacity=".3" stroke-dasharray="4 4"/><polyline fill="none" stroke="var(--acc)" stroke-width="2.5" vector-effect="non-scaling-stroke" points="${h.map((v, i) => x(i) + ',' + y(v)).join(' ')}"/></svg>`;
}
function vMoney() {
  const g = G(), c = g.club, L = g.fin.last, cap0 = +F.man('fin', 'wageCap'), wr = F.wageRatio() * 100;
  const LBL = { gate: 'Matchday tickets', tv: 'TV and prize pool', sponsors: 'Sponsorship', merch: 'Merchandise', owner: 'Owner top-up', playerWages: 'Player wages', staffWages: 'Staff wages', scouting: 'Scouting', academy: 'Academy', marketing: 'Marketing', ground: 'Stadium and running costs', facilities: 'Facility investment', interest: 'Loan interest', firstTeam: 'First-team support', projects: 'Projects', deptStaff: 'Department staff', firstBudget: 'First-team budget', comBudget: 'Commercial budget' };
  const rows = (o, mx, cls) => Object.entries(o).filter(([, v]) => v).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="meter" style="grid-template-columns:150px minmax(0,1fr) 70px"><span>${LBL[k] || k}</span><div class="bar ${cls}"><i style="width:${v / mx * 100}%"></i></div><span class="num" style="text-align:right">${money(v)}</span></div>`).join('');
  const mx = L ? Math.max(...Object.values(L.i), ...Object.values(L.o), 1) : 1;
  return `<div class="grid2"><section class="panel"><h2>Cash ${money(c.cash)}</h2>${spark(g.fin.hist)}
    <dl class="kv"><dt>Transfer budget (set by Finance)</dt><dd>${money(F.transferBudget())}</dd><dt>Player wage-to-revenue</dt><dd class="${wr > cap0 ? 'bad' : ''}">${r0(wr)}% (cap ${cap0}%)</dd><dt>Debt</dt><dd>${money(c.debt)}</dd><dt>Season revenue</dt><dd>${money(g.ss.rev)}</dd><dt>Season costs</dt><dd>${money(g.ss.exp)}</dd><dt>Transfers in / out</dt><dd>${money(g.ss.spent)} / ${money(g.ss.earned)}</dd></dl></section>
  <section class="panel"><h2>Last week ${L ? `<span class="${L.tin - L.tout < 0 ? 'bad' : 'good'}">${L.tin - L.tout < 0 ? '' : '+'}${money(L.tin - L.tout)}</span>` : ''}</h2>${L ? `<h3>Income ${money(L.tin)}</h3>${rows(L.i, mx, '')}<h3>Costs ${money(L.tout)}</h3>${rows(L.o, mx, 'ink')}` : '<p class="small">Play a week to see the breakdown.</p>'}</section></div>`;
}

