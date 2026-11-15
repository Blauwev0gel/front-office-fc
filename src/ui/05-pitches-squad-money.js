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
  const deck = cur ? `<div class="deck">${open.length > 2 ? '<div class="pcard back2"></div>' : ''}${open.length > 1 ? '<div class="pcard back"></div>' : ''}${pitchCard(cur.it, cur.i, mt)}</div><div class="swipehint"><span>${ART.I.back} Reject</span><span>Approve ${ART.I.chev}</span></div>` : '';
  const v = cur ? F.proposalView(cur.it) : null;
  const btns = cur ? `<div class="row3"><button class="btn ghost no" data-a="prop" data-i="${cur.i}" data-c="reject">Reject</button>${!v.revised ? `<button class="btn ghost" data-a="prop" data-i="${cur.i}" data-c="revise">Cheaper</button>` : ''}<button class="btn" data-a="prop" data-i="${cur.i}" data-c="approve" ${cur.it.cost > pot ? 'disabled' : ''}>Approve</button></div>${!v.second ? `<button class="linkbtn" data-a="prop" data-i="${cur.i}" data-c="second" ${!mt.pre && g.ap < 1 ? 'disabled' : ''}>Ask for a second opinion${mt.pre ? '' : ' (1 action)'}</button>` : ''}` : '';
  const doneList = done.length ? `<div class="decided">${done.map(o => { const v2 = F.proposalView(o.it); return `<span class="${o.it.status === 'approved' ? 'good' : 'bad'}">${o.it.status === 'approved' ? '✓' : '✕'} ${esc(v2.title)}</span>`; }).join('')}</div>` : '';
  return `<section class="pitches"><div class="spread"><h2 class="itemh" style="margin:0">${esc(kick)}</h2><span class="chip">${cur ? `${done.length + 1} of ${items.length}` : 'Done'}</span></div>${meter}${deck}${doneList}${inTray ? '' : btns}</section>${inTray && cur ? (U.tray = trayHtml('', btns, ''), U.trayH = 130, '') : ''}`;
}
function meetingBlock(mt, kick) { return pitchDeck(mt, kick, false); }

function p90(v, m) { return m ? (v / m * 90).toFixed(2) : '–'; }
const STG_L = { identified: 'Identified', scouted: 'Scouted', recommended: 'Recommended', approach: 'Awaiting approval', negotiating: 'In talks', agreed: 'Agreed', signed: 'Signed', lost: 'Dropped' };
function squadSeg() { return `${tourCard('squad')}<div class="seg" style="margin-bottom:14px"><button class="${!U.sqTable ? 'on' : ''}" data-a="sqtable" data-v="0">Pitch</button><button class="${U.sqTable ? 'on' : ''}" data-a="sqtable" data-v="1">Stats table</button></div>`; }
const RULE_OWN = { 'wage cap': 'the wage cap (Finance)', 'fee limit': 'the fee limit (DoF mandate)', 'wage limit': 'the wage limit (DoF mandate)', 'age limit': 'the age limit (DoF mandate)' };
function recRow(o) {
  const { x, p, k } = o, d = x.deal, note = x.blocked ? `Blocked by ${x.blocked.map(r => RULE_OWN[r] || r).join(', ')}` : x.stage === 'negotiating' && d && d.rounds.length ? d.rounds[d.rounds.length - 1] : (x.log || []).slice(-1)[0] || '';
  const was = k && /\(grade ([A-D])\)/.exec(note), note2 = was && was[1] !== k.grade ? note.replace(/\(grade [A-D]\)\.?/, `as a ${was[1]}; now graded ${k.grade}.`) : note;
  return `<button class="rrow" data-a="target" data-id="${x.pid}"><span class="gr g${k ? k.grade : 'D'}">${k ? k.grade : '?'}</span><span class="rmain"><b>${esc(p.name)}</b> <span class="pos">${p.pos}</span><span class="small rsub">${p.age}, ${F.REGIONS[p.region].name}${p.pool ? (p.club ? ', ' + money(p.ask) : ', free agent') : ''}${k ? `, ${F.recBand(k)}, ${k.conf} confidence` : ''}</span>${note2 ? `<span class="small rnote ${x.blocked ? 'warn' : ''}">${esc(note2)}</span>` : ''}</span></button>`;
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
  const g = G(), L = F.pickXI(false), used = {}, nm = n => esc(n.split(' ').slice(-1)[0]);
  const spots = L.xi.map(x => { const arr = PITCH[x.slot] || [[50, 50]], i = used[x.slot] = (used[x.slot] || 0) + 1, pt = arr[Math.min(i - 1, arr.length - 1)]; return `<button class="pspot" style="left:${pt[0]}%;top:${pt[1]}%" data-a="player" data-id="${x.p.id}" aria-label="${esc(x.p.name)}, ${F.POS_L[x.slot]}"><span class="pf">${ART.playerFace(x.p)}</span><b>${nm(x.p.name)}</b><small>${F.stars(x.p.ca)}★${x.p.inj > 0 ? ' · inj' : ''}</small></button>`; }).join('');
  const rest = g.squad.filter(p => !L.xi.some(x => x.p === p)).sort((a, b) => b.ca - a.ca);
  return `${squadSeg()}<div class="spread" style="margin:0 0 8px"><h2 style="font-size:22px;margin:0">First team</h2><button class="linkbtn" data-a="dept-go" data-k="recruit" data-v="data" style="margin:0">Recruitment</button></div>
  <div class="pitch"><div class="lines"></div>${spots}</div>
  <p class="small" style="margin:8px 0">The coach's likely eleven. Squad strength ranks ${F.ord(F.expectedRank())} in the division. Tap a player.</p>
  <div class="sec">Bench and squad (${rest.length})</div><div class="pcards">${rest.map(p => pcard(p, { meta: `${p.age}, ${F.POS_L[p.pos]}${p.inj > 0 ? ', injured' : ''}${p.loan ? ', on loan' : ''}` })).join('')}</div>`;
}
function vSquad() {
  if (!U.sqTable) return vPitch();
  const g = G(), sq = g.squad.slice().sort((a, b) => 'GK CB FB DM CM AM W ST'.indexOf(a.pos) - 'GK CB FB DM CM AM W ST'.indexOf(b.pos) || b.ca - a.ca);
  const avgW = F.playerWages() / Math.max(1, sq.length);
  const prof = `<table><thead><tr><th>Player</th><th>Age</th><th>Ability</th><th>Potential</th><th>Morale</th><th>Wage</th><th>Contract</th><th>Value</th></tr></thead><tbody>${sq.map(p => `<tr data-a="player" data-id="${p.id}"><td>${esc(p.name)}<span class="pos">${p.pos}</span>${p.inj > 0 ? ' <span class="bad small">inj ' + p.inj + 'w</span>' : ''}${p.susp > 0 ? ' <span class="warn small">susp</span>' : ''}${p.academy ? ' <span class="small">academy</span>' : ''}${p.loan ? ' <span class="small">loan</span>' : ''}</td><td>${p.age}</td><td>${stars(F.stars(p.ca))}</td><td>${stars(F.stars(p.pa))}</td><td>${r0(p.morale)}</td><td>${money(p.wage)}</td><td>${p.contract}y</td><td>${money(p.value)}</td></tr>`).join('')}</tbody></table>`;
  const mb = `<table><thead><tr><th>Player</th><th>Mins</th><th>G</th><th>A</th><th>xG</th><th>xA</th><th>xG/90</th><th>xA/90</th><th>PrgP/90</th><th>Duels</th><th>Rating</th><th>Wage value</th></tr></thead><tbody>${sq.map(p => { const s = p.st, rat = s.apps ? s.rat / s.apps : 0, wv = s.apps ? (F.stars(p.ca) / 2.5) / (p.wage / avgW) * 100 : 0; return `<tr data-a="player" data-id="${p.id}"><td>${esc(p.name)}<span class="pos">${p.pos}</span></td><td>${s.mins}</td><td>${s.g}</td><td>${s.a}</td><td>${s.xg.toFixed(1)}</td><td>${s.xa.toFixed(1)}</td><td>${p90(s.xg, s.mins)}</td><td>${p90(s.xa, s.mins)}</td><td>${p90(s.prg, s.mins)}</td><td>${s.dt ? r0(s.dw / s.dt * 100) + '%' : '–'}</td><td class="${rat >= 7 ? 'good' : rat && rat < 6.4 ? 'bad' : ''}">${rat ? rat.toFixed(2) : '–'}</td><td class="${wv >= 120 ? 'good' : wv && wv < 80 ? 'bad' : ''}">${wv ? r0(wv) : '–'}</td></tr>`; }).join('')}</tbody></table>`;
  return `${squadSeg()}<div class="spread" style="margin-bottom:10px"><div><h2 style="font-size:26px">First-team squad</h2><div class="small">${sq.length} players. Squad strength ranks ${F.ord(F.expectedRank())} in the division. Wage bill ${money(F.playerWages())}/wk.</div></div><div class="seg"><button class="${U.sq === 'profile' ? 'on' : ''}" data-a="sq" data-v="profile">Profile</button><button class="${U.sq === 'mb' ? 'on' : ''}" data-a="sq" data-v="mb">Moneyball</button></div></div>
  <div class="scroll">${U.sq === 'mb' ? mb : prof}</div>
  <p class="small">${U.sq === 'mb' ? 'Wage value: ability per pound of wages, 100 is squad average. PrgP: progressive passes. Duels: share won.' : 'Stars are relative to your current division. Tap a player for the full profile. You cannot buy, sell or pick players: that is the job of your Director of Football and Head Coach.'}</p>`;
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

