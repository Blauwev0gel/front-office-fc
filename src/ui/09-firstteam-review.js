/* ---------- first team department ---------- */
function vFirst(parts) {
  const g = G(), v = F.ftView(), s = v.s;
  const head = `<div class="ohead"><button class="iconbtn" data-a="dept" data-k="" aria-label="Back to departments">${ART.I.back}</button><span class="pos">First team</span><button class="iconbtn" data-a="sheet" data-s="mand" data-r="coach" ${s ? '' : 'disabled'} aria-label="Coach mandate">${ART.I.staff}</button></div>`;
  if (!s) return `${head}<div class="empty2"><p>There is no head coach. The team picks itself, badly.</p><button class="btn" data-a="tab" data-t="staff">Hire a coach</button></div>`;
  if (v.talk) return head + ftTalkHtml(v);
  const sur = s.name.split(' ').slice(-1)[0], hero = `<section class="fthero"><div class="fth1"><div class="ftface">${ART.staffFace('coach')}</div><div class="fthm"><b>${esc(s.name)}</b><span class="small">Head coach, ${s.age}. ${s.contract} season${s.contract === 1 ? '' : 's'} left</span>${starsTxt(F.stars(F.ovr(s)))}</div></div>
    ${mrow('trust', 'Relationship', s.rel, 100, r0(s.rel), s.rel < 35 ? 'lo' : '')}${mrow('board', 'Follows mandate', v.comp * 100, 100, Math.round(v.comp * 100) + '%', v.comp < 0.65 ? 'lo' : '')}${s.boostW > 0 ? `<p class="small ${s.boost >= 0 ? 'good' : 'bad'}" style="margin:4px 0 0">${s.boost >= 0 ? 'Fired up after your last talk.' : 'Deflated after your last talk.'} ${s.boostW} wk left</p>` : ''}
    <div class="bubble">${esc(v.line)}${ticOf('coach', v.line) ? `<span class="tic">${esc(ticOf('coach', v.line))}</span>` : ''}</div></section>`;
  // form
  const G6 = v.games, mx = Math.max(1.5, ...G6.map(x => Math.max(x.ux, x.tx)));
  const form = G6.length ? `<div class="ftform">${G6.map(x => `<div class="fg"><span class="res ${x.r}">${x.r}</span><b>${x.ug}–${x.tg}</b><span class="xgs"><i class="u" style="height:${x.ux / mx * 100}%"></i><i class="t" style="height:${x.tx / mx * 100}%"></i></span><small>${esc(x.o.split(' ')[0])}</small></div>`).join('')}</div><p class="small" style="margin:4px 0 0">Bars: expected goals for (green) and against (red).</p>` : '<p class="small">No matches yet.</p>';
  const P = v.pos, n = g.divs[g.club.tier].clubs.length;
  const trend = P.length > 1 ? (() => { const W = 320, H = 80, x = i => 8 + i / (P.length - 1) * (W - 16), y = r => 6 + (r - 1) / (n - 1) * (H - 12); return `<svg class="ftrend" viewBox="0 0 ${W} ${H}" role="img" aria-label="League position by week"><line x1="8" x2="${W - 8}" y1="${y(v.exp)}" y2="${y(v.exp)}" class="exp"/><text x="${W - 8}" y="${y(v.exp) - 3}" text-anchor="end">expected ${F.ord(v.exp)}</text><polyline points="${P.map((r, i) => x(i) + ',' + y(r)).join(' ')}"/><circle cx="${x(P.length - 1)}" cy="${y(P[P.length - 1])}" r="4"/></svg>`; })() : '';
  // mandate vs reality
  const rows = v.rows.map(r => `<div class="mvr"><div class="mvl"><span>${esc(r.l[0])}</span><span>${esc(r.l[1])}</span></div><div class="mvt"><i class="you" style="left:${r.you}%" title="You"></i><i class="him ${Math.abs(r.d) >= 15 ? 'off' : ''}" style="left:${r.him}%">${ART.staffFace('coach')}</i></div><div class="mvf"><span>${esc(r.fact)}</span>${Math.abs(r.d) >= 8 ? `<b class="${Math.abs(r.d) >= 15 ? 'bad' : ''}">${r.d > 0 ? '+' : '−'}${Math.abs(r.d)} vs your mandate</b>` : '<b class="good">As agreed</b>'}</div>${r.why ? `<p class="mvq">"${esc(r.why)}"</p>` : ''}</div>`).join('');
  const gapBig = v.rows.some(r => Math.abs(r.d) >= 12);
  // squad
  const E = v.eyes, chip = (p, extra) => `<button class="pchip" data-a="player" data-id="${p.id}"><span>${ART.playerFace(p)}</span>${esc(p.name.split(' ').slice(-1)[0])}<small>${p.pos}${extra ? ', ' + extra : ''}</small></button>`;
  const grp = (t, arr, ex) => arr.length ? `<div class="pgrp"><div class="pgl">${t}</div><div class="pchips">${arr.map(p => chip(p, ex ? ex(p) : '')).join('')}</div></div>` : '';
  const squad = grp('Picks every week', E.core, p => p.st ? p.st.apps + ' apps' : '') + grp('Left out', E.out, p => p.ca.toFixed(1) + ' rating') + grp('Injured', E.inj, p => p.inj + ' wk') + grp('Unhappy', E.sad, p => 'morale ' + Math.round(p.morale));
  // deal
  const deal = v.deal ? `<div class="ftdeal"><span class="ic2">${ART.I.trust}</span><div><b>${esc(v.deal.t)}</b><span class="small">Agreed in week ${v.deal.w0}. Deadline: week ${v.deal.by}</span></div></div>` : `<div class="ftdeal none"><div><b>No target agreed</b><span class="small">${v.last ? `Last one: ${esc(v.last.t)}. ${v.last.met ? 'Met.' : 'Missed.'}` : 'Agree one in a talk. Met targets lift trust, missed ones cost it.'}</span></div></div>`;
  // fitness
  const fit = `<div class="panel2">${mrow('risk', 'Injury risk', v.injRisk, 100, v.injRisk < 45 ? 'Low' : v.injRisk < 62 ? 'Normal' : 'High', v.injRisk >= 62 ? 'lo' : '')}<p class="small" style="margin:6px 0 0">${v.injS} injur${v.injS === 1 ? 'y' : 'ies'} this season. Training intensity drives this; a fitness coach cuts it.</p></div>`;
  // resources
  const res = `<div class="ftres">${v.res.map(r => `<div class="rcard ${r.on ? (r.left > 0 ? 'setup' : 'on') : ''}"><span class="ric">${ART.I[r.ic] || ''}</span><b>${esc(r.t)}</b><span class="small">${esc(r.d)}</span><span class="rcost">${money(r.wk)}/wk${r.on ? '' : `, ${money(r.fee)} to set up`}</span>${r.on ? (r.left > 0 ? `<span class="rstat">Starts in ${r.left} wk</span>` : `<span class="rstat good">Active</span>`) + `<button class="linkbtn" data-a="ft-cancel" data-k="${r.k}">Let go</button>` : `<button class="btn small" data-a="ft-buy" data-k="${r.k}" ${g.club.cash < r.fee ? 'disabled' : ''}>Hire</button>`}</div>`).join('')}</div>`;
  if (parts) return { hero, form, trend, rows, gapBig, squad, deal, fit, sur };
  return `${head}${hero}
  <div class="sec">Form</div><div class="panel2">${form}${trend}</div>
  <div class="sec">Your mandate vs what he does</div><div class="panel2">${rows}${gapBig ? `<button class="btn ghost wide" data-a="ft-talk" style="margin-top:8px">Raise it with ${esc(sur)}</button>` : ''}</div>
  <div class="sec">The squad, through his eyes</div><div class="panel2">${squad || '<p class="small">Nothing to show yet.</p>'}</div>
  <div class="sec">Target</div>${deal}
  <div class="sec">Fitness</div>${fit}
  <div class="sec">Support staff</div>${res}
  <div class="ftacts"><button class="btn" data-a="ft-talk" ${g.ap < 1 ? 'disabled' : ''}>${ART.I.phone} Talk to ${esc(sur)}</button><button class="btn ghost danger" data-a="ft-sackq">Sack</button></div><p class="small" style="text-align:center">A talk costs one action. ${g.ap} left this week.</p>`;
}
function ftTalkHtml(v) {
  const T = v.talk, s = v.s, last = T.log.slice(-3);
  const emo = T.done ? (T.fx.some(x => /down|deflated|−/i.test(x)) ? 'worried' : 'happy') : null;
  U.tray = T.done ? trayHtml('', `<button class="btn" data-a="ft-talk-close">Back to the first team</button>`, '') : trayHtml(`<span>You say</span>${apPips(G().ap)}`, T.opts.map((o, j) => choiceHtml({ l: o.t, h: o.fx }, j, `data-a="ft-ans" data-id="${o.id}"`, false, false)).join(''), '');
  U.trayH = T.done ? 90 : 60 + T.opts.length * 66;
  return `<div class="ftalk">${sceneHtml('coach', s.name, 'talk', 'In his office', '', emo)}${last.map((l, i) => l.who === 'you' ? `<p class="you-said">You: ${esc(l.t)}</p>` : `<div class="bubble ${i < last.length - 1 ? 'old' : ''}">${esc(l.t)}${ticOf('coach', l.t) ? `<span class="tic">${esc(ticOf('coach', l.t))}</span>` : ''}</div>`).join('')}${T.done && T.fx.length ? `<div class="fxrow">${T.fx.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>` : ''}</div><div class="trayspace" style="--tray:${U.trayH}px"></div>`;
}
function vAcademy2() {
  const g = G(), v = F.acadView(), a = v.a, c = g.club, sel = U.ag || 'U18', grpD = v.groups.find(x => x.k === sel);
  const sc = Math.round(v.catScore.total), ring = Math.min(100, sc);
  return `<div class="ohead"><button class="iconbtn" data-a="acad-close" aria-label="Back to the club">${ART.I.back}</button><span class="pos">Youth academy</span><button class="iconbtn" data-a="sheet" data-s="mand" data-r="acad" ${F.staff('acad') ? '' : 'disabled'} aria-label="Academy mandate">${ART.I.staff}</button></div>
  <section class="clubhero"><div class="ch1"><div class="ring" style="--p:${ring}"><b>${v.cat}</b><small>CAT</small></div><div><h2>${esc(c.name)} Academy</h2><span class="small">Run by ${esc(F.staffName('acad'))}. Score ${sc}, next category at ${sc < 55 ? 55 : sc < 75 ? 75 : 95}. Audit week 30.</span></div></div></section>
  ${v.diag.length ? `<div class="sec">Holding it back</div><div class="planboard">${v.diag.slice(0, 3).map(d => `<${d.a === 'mand' ? `button data-a="sheet" data-s="mand" data-r="${d.x}"` : 'div'} class="pl open"><i class="dot"></i>${esc(clip2(d.t)[0])}<span>${d.a === 'mand' ? 'Fix' : ''}</span></${d.a === 'mand' ? 'button' : 'div'}>`).join('')}</div>` : ''}
  <div class="sec">Pipeline</div><div class="panel2">${mrow('youth', 'Foundation', Math.min(40, a.found.n), 40, a.found.n)}${v.groups.map(x => mrow('academy', x.k, x.players.length, 14, x.players.length)).join('')}</div>
  <div class="sec">Players</div><div class="seg wide" style="margin-bottom:8px">${['U14', 'U16', 'U18', 'U21'].map(k => `<button class="${sel === k ? 'on' : ''}" data-a="ag" data-v="${k}">${k}</button>`).join('')}</div>
  <div class="pcards">${grpD.players.map(p => `<button class="pcd" data-a="player" data-id="${p.id}"><span class="pf">${ART.face(p.id * 17 + 11, { role: 'youth', age: p.age, region: p.region, c1: c.colors[0], c2: c.colors[1], bg: '#fff', emo: p.wel < 40 ? 'worried' : null })}</span><span class="pm"><b>${esc(p.name)}</b><small>${p.age}, ${F.POS_L[p.pos]}${p.playUp ? ', plays up' : ''}${p.loanOut ? ', on loan' : ''}</small><span class="strengths">${strengths(p)}</span></span><span class="pr"><span class="stx">${F.absStars(p.ca)}★</span><small class="small">pot ${p.band[0]}–${p.band[1]}★</small>${p.wel < 40 || p.edu < 40 ? '<small class="bad">at risk</small>' : ''}</span></button>`).join('') || '<p class="small">No players in this group.</p>'}</div>
  <div class="sec">Return on investment</div><div class="money1 panel2"><div><small>Spent</small><b>${money(v.roi.spent)}</b></div><div><small>Earned</small><b>${money(v.roi.earned)}</b></div><div><small>Net</small><b class="${v.roi.net >= 0 ? 'good' : 'bad'}">${v.roi.net >= 0 ? '+' : ''}${money(v.roi.net)}</b></div></div>
  <details class="more" style="margin-top:14px"><summary>Full academy report ${ART.I.chev}</summary>${vAcademy().replace(/<button class="linkish" data-a="acad-close">Back to the club<\/button>/, '')}</details>`;
}
function vReview2() {
  const g = G(), r = g.lastReport, up = r.moves.includes('promoted'), down = r.moves.includes('relegated');
  const head = up ? `${g.club.name} are going up` : down ? `Relegation for ${g.club.name}` : r.pos <= 3 && r.tier === 1 ? 'Champions' : `${F.ord(r.pos)} place`;
  const me = r.table.find(x => x.id === 0) || {};
  return `<div class="setup"><article class="paper"><div class="mast">THE ${esc(g.club.city.toUpperCase())} GAZETTE <small>Season ${r.season} review</small></div>
    ${up || down ? `<div class="gstamp ${up ? '' : 'gE'}">${up ? '↑' : '↓'}<small>${up ? 'PROMOTED' : 'RELEGATED'}</small></div>` : `<div class="gstamp gC">${r.pos}<small>FINISH</small></div>`}
    <h1 class="ehead2">${esc(head)}</h1><p class="esub2">${F.ord(r.pos)} in the ${esc(r.tierName)}${up || down ? `. Next: the ${F.TIERS[r.newTier]}` : ''}.</p>
    ${r.second ? `<p class="quote" style="margin:8px 0">The board gives you one more season. Bounce back, or the next relegation is your last.</p>` : ''}
    <div class="statrow"><div><small>Points</small><b>${me.pts || 0}</b></div><div><small>Goals</small><b>${me.gf || 0}–${me.ga || 0}</b></div><div><small>Prize</small><b>${money(r.prize)}</b></div><div><small>Board</small><b>${r0(g.board.conf)}%</b></div></div>
    <div class="sec2">Objectives</div><div class="planboard">${r.objectives.map(o => `<div class="pl ${o.met ? 'done' : 'open'}"><i class="dot"></i>${esc(o.t)}<span>${o.met ? 'Met' : 'Missed'}</span></div>`).join('')}${r.promises.map(o => `<div class="pl ${o.kept ? 'done' : 'open'}"><i class="dot"></i>Promise: ${esc(o.t)}<span>${o.kept ? 'Kept' : 'Broken'}</span></div>`).join('')}</div>
    ${r.signings && r.signings.length ? `<div class="sec2">Signings rated</div><div class="ins">${r.signings.filter(e => e.p).map(e => `<button class="inc ${e.verdict === 'Miss' ? 'flag' : ''}" data-a="player" data-id="${e.p.id}"><span class="pf">${ART.playerFace(e.p, e.verdict === 'Hit' ? 'happy' : e.verdict === 'Miss' ? 'worried' : null)}</span><span><b>${esc(e.name.split(' ').slice(-1)[0])}</b><small>${e.verdict}${e.rat ? ', ' + e.rat.toFixed(2) : ''}</small></span></button>`).join('')}</div>` : ''}
    ${r.promoted && r.promoted.length ? `<div class="sec2">From the academy</div><p class="outs">${esc(r.promoted.join(', '))}</p>` : ''}
    ${r.licence ? `<p class="note">${esc(r.licence)}</p>` : ''}${r.deduct ? `<p class="note bad">In the red: a ${r.deduct}-point deduction next season.</p>` : ''}
    <details class="more"><summary>Final table ${ART.I.chev}</summary><div class="ltab">${r.table.map((x, i) => `<div class="lr ${x.id === 0 ? 'me' : ''} ${i < 3 && r.tier > 1 ? 'up' : ''} ${i >= 15 && r.tier < 8 ? 'dn' : ''}"><span>${i + 1}</span><span class="cn">${esc(x.n)}</span><span>${x.p}</span><span>${x.gf - x.ga > 0 ? '+' : ''}${x.gf - x.ga}</span><b>${x.pts}</b></div>`).join('')}</div></details></article>
  ${trayHtml('', `<button class="btn" data-a="next-season">Start the summer</button>`, '')}<div class="trayspace" style="--tray:100px"></div></div>`;
}
function vReview() {
  const g = G(), r = g.lastReport;
  const head = r.moves.includes('promoted') ? `${g.club.name} are going up` : r.moves.includes('relegated') ? `Relegation for ${g.club.name}` : r.pos <= 3 && r.tier === 1 ? 'Champions of the Premiership' : `Season ${r.season}: ${F.ord(r.pos)} place`;
  return `<div class="setup"><div class="kick">Season review</div><div class="hero" style="padding:20px 0"><h1 style="font-size:clamp(40px,9vw,80px)">${esc(head)}</h1><p>${F.ord(r.pos)} in the ${r.tierName}. ${r.moves.includes('promoted') ? 'Next season: the ' + F.TIERS[r.newTier] + '.' : r.moves.includes('relegated') ? 'Next season: the ' + F.TIERS[r.newTier] + '.' : ''} Prize money ${money(r.prize)}. Board confidence ${sign(r.boardDelta)} on objectives and promises, now ${r0(g.board.conf)}%.</p></div>
  <div class="grid2" style="margin-top:16px"><section class="panel"><h2>Board objectives</h2><ul class="list">${r.objectives.map(o => `<li><span>${esc(o.t)}</span><b class="${o.met ? 'good' : 'bad'}">${o.met ? 'Met' : 'Missed'}</b></li>`).join('')}</ul>
  <h3>Promises</h3>${r.promises.length ? `<ul class="list">${r.promises.map(o => `<li><span>${esc(o.t)}</span><b class="${o.kept ? 'good' : 'bad'}">${o.kept ? 'Kept' : 'Broken'}</b></li>`).join('')}</ul>` : '<p class="small">None made.</p>'}
  ${r.licence ? `<p class="note">${esc(r.licence)}</p>` : ''}${r.deduct ? `<p class="note bad">You ended the season in the red: a ${r.deduct}-point deduction applies next season.</p>` : ''}</section>
  <section class="panel"><h2>Comings and goings</h2>${r.renewed.length ? `<h3>Contracts renewed by the DoF</h3><p>${esc(r.renewed.join(', '))}</p>` : '<p class="small">Expiring contracts are decided in the summer clear-out.</p>'}<h3>Leaving</h3><p>${esc(r.leavers.join(', ') || 'Nobody.')}</p>${r.signings && r.signings.length ? `<h3>Signings rated</h3><ul class="list">${r.signings.map(e => `<li><span>${esc(e.name)} <span class="pos">${e.pos}</span></span><b class="${e.cls}">${e.verdict}</b></li>`).join('')}</ul>` : ''}<h3>Promoted from the academy</h3><p>${esc(r.promoted.join(', ') || 'Nobody this year.')}</p><h3>Staff</h3><p>${esc(r.staff.join(' ') || 'No contract changes.')}</p></section>
  <section class="panel"><h2>Final table</h2><div class="scroll"><table><thead><tr><th>Club</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>${r.table.map((x, i) => `<tr class="${x.id === 0 ? 'me' : ''} ${i < 3 && r.tier > 1 ? 'zone-up' : ''} ${i >= 15 && r.tier < 8 ? 'zone-down' : ''}"><td>${i + 1}. ${esc(x.n)}</td><td>${x.p}</td><td>${sign(x.gf - x.ga)}</td><td>${x.pts}</td></tr>`).join('')}</tbody></table></div></section></div>
  <div class="row" style="margin:26px 0"><button class="btn" data-a="next-season">Start season ${g.season + 1}</button></div></div>`;
}
function vSacked() {
  const g = G();
  const o = g.over || {}, CAUSE = { board: 'Board confidence ran out', season: 'Season review by the board', admin: 'Second administration', 'vote:board': 'Lost a vote of confidence: the board', 'vote:fans': 'Lost a vote of confidence: the supporters', 'vote:press': 'Lost a vote of confidence: the press storm', 'vote:room': 'Lost a vote of confidence: the dressing room' };
  const facts = [['Cause', CAUSE[o.cause] || 'Dismissed'], ['When', o.season ? `Season ${o.season}, week ${o.week}` : `Season ${g.season}`], ['League position', o.pos ? `${F.ord(o.pos)} in the ${F.TIERS[o.tier || g.club.tier]}` : F.TIERS[g.club.tier]], ...(F.backers ? F.backers().map(b => [b.t, String(b.v)]) : [])];
  return `<div class="setup"><div class="hero"><div class="kick">Final edition</div><h1>CEO dismissed</h1><p>${esc(g.sackReason)} You leave ${esc(g.club.name)} after ${g.season} season${g.season > 1 ? 's' : ''}.</p>
  <dl class="figs endfig">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>${g.trophies.length ? `<p>Honours: ${esc(g.trophies.join(', '))}.</p>` : ''}
  <div class="row" style="margin-top:18px"><button class="btn" data-a="restart">Found a new club</button><button class="btn ghost" data-a="sheet" data-s="quick">Base club</button></div></div></div>`;
}

