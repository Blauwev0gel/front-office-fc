/* ---------- departments ---------- */
// Plot values are shown as numbers in text mode; no SVG is generated.
function spark(arr) {
  if (!arr || !arr.length) return '<p class="small">No figures yet.</p>';
  const first = +arr[0], last = +arr[arr.length - 1], change = last - first;
  const fmt = n => Number.isFinite(n) ? (Math.round(n * 10) / 10).toLocaleString('en-GB') : '–';
  return '<p class="text-trend">Trend: ' + fmt(first) + ' → ' + fmt(last) +
    ' (' + (change > 0 ? '+' : '') + fmt(change) + ') over ' + arr.length + ' readings.</p>';
}
const kfmt = (k, v) => k === 'commercial' || k === 'business' ? money(v) : k === 'first' ? F.ord(v) : String(v);
function vDepts() {
  const O = F.deptOverview();
  const priority = O.filter(o => !o.s || o.status.st === 'bad');
  const pending = inboxItems().filter(i => isBox(i) && O.some(o => o.head === i.role || o.also === i.role));
  const pendingHtml = pending.length ? `<section class="fo-staff-pending"><h3>Waiting for your decision</h3>
    ${pending.map(i => `<button class="fo-task-link" data-a="dinbox" data-key="${i.key}">
      <span><b>${esc(i.subj)}</b><small>${esc(i.from)} · opens at your desk</small></span><strong>Open</strong></button>`).join('')}</section>` : '';

  const card = o => {
    const title = o.s ? o.s.name : 'Vacant — appointment needed';
    const staffed = o.s ? `${o.staffOn} of ${o.slots} supporting staff active` : 'No responsible head';
    const status = o.s ? o.status.l + (o.status.extra ? ' +' + o.status.extra : '') : 'Head needed';
    const issues = o.status.issues || [];
    return `<button class="ceo-dept-row ${priority.includes(o) ? 'needs-attention' : ''}" data-a="dept" data-k="${o.k}" aria-label="Open ${esc(o.t)} department">
      <span class="ceo-dept-main"><small>${esc(o.t)}</small><b>${esc(title)}</b><span>${esc(staffed)}</span>${issues.length ? `<em>${issues.length} matter${issues.length===1?'':'s'} to review</em>` : ''}</span>
      <span class="ceo-dept-status ${o.s ? o.status.st : 'bad'}">${esc(status)}</span>
    </button>`;
  };
  return `${tourCard('staff')}<section class="ceo-dept-intro"><h2>Your departments</h2>
    <p>The heads run their departments. You set mandates, hold conversations and decide exceptions.</p>
    <p class="small">${O.length} departments · ${priority.length ? priority.length + ' need attention' : 'No urgent concerns'}</p></section>
    ${pendingHtml}
    ${priority.length ? `<section class="ceo-dept-group"><h3>Needs attention</h3><div class="ceo-dept-list">${priority.map(card).join('')}</div></section>` : ''}
    <section class="ceo-dept-group"><h3>${priority.length ? 'Other departments' : 'Department overview'}</h3>
      <div class="ceo-dept-list">${O.filter(o=>!priority.includes(o)).map(card).join('')}</div></section>
    <details class="ceo-dept-secondary"><summary>Department budgets and resource plan</summary>${planCard()}</details>`;
}
function headLine(role, s) {
  const rc = F.record(role), P = s.p, v = rc.verdict;
  if (rc.early) return P.ego > 14 ? 'Give it time. You will see what I can do.' : 'Early days. We are setting things up the right way.';
  if (v === 'Strong') return P.ego > 14 ? 'The numbers speak for themselves.' : 'Things are going well. Credit to the team.';
  if (v === 'Poor') return P.risk < 7 ? 'Not good enough, I know. I am fixing it step by step.' : 'A rough patch. I have a plan.';
  return P.amb > 14 ? 'Decent, but I want more.' : 'Steady progress. No complaints.';
}
function headCard(k, v) {
  const d = v.d, s = v.head, role = d.head;
  if (!s) return `<section class="fthero vacant"><div class="fth1"><div class="ftface empty">${ART.I.staff}</div><div class="fthm"><b>No ${esc(F.ROLE[role].t.toLowerCase())}</b><span class="small">The department runs on chance until you appoint someone.</span></div></div><button class="btn wide" data-a="sheet" data-s="cands" data-r="${role}">Hire a ${esc(F.ROLE[role].t.toLowerCase())}</button></section>`;
  if (role === 'coach') { const P = vFirst(true); if (typeof P === 'object') return P.hero + headBtns(role, s); }
  const line = headLine(role, s), tic = ticOf(role, line), rc = F.record(role);
  return `<section class="fthero"><div class="fth1"><div class="ftface">${ART.staffFace(role)}</div><div class="fthm"><b>${esc(s.name)}</b><span class="small">${esc(F.ROLE[role].t)}, ${s.age}. ${s.contract} season${s.contract === 1 ? '' : 's'} left</span>${starsTxt(F.stars(F.ovr(s)))}</div></div>
    ${mrow('trust', 'Relationship', s.rel, 100, r0(s.rel), s.rel < 35 ? 'lo' : '')}${mrow('star', 'Form', s.perf, 100, rc.verdict, s.perf < 35 ? 'lo' : '')}
    <div class="bubble">${esc(line)}${tic ? `<span class="tic">${esc(tic)}</span>` : ''}</div></section>${headBtns(role, s)}`;
}
function authHtml(role) {
  if (!F.authView || !F.DESK_HEADS.includes(role)) return ''; const A = F.authView(role), s = A.head; if (!s) return '';
  return `<div class="authb"><div class="authh"><span>${ART.I.trust}</span><b>Authority</b><small>${A.rec.n ? `${A.rec.n} staff calls, ${A.rec.err} against your mandate` : 'No calls yet'}</small></div>
    <div class="seg wide" role="radiogroup" aria-label="Authority for ${esc(s.name)}">${A.opts.map((t, i) => `<button role="radio" aria-checked="${A.a === i}" class="${A.a === i ? 'on' : ''}" data-a="auth" data-r="${role}" data-v="${i}">${esc(t)}</button>`).join('')}</div>
    <p class="small">${esc(A.s)} Signs off alone up to ${money(A.lim)} a week. Wrong calls: ${A.err >= 18 ? 'frequent' : A.err >= 8 ? 'occasional' : 'rare'}.</p></div>`;
}
function agreementHtml(role) {
  if (!F.agreementView) return '';
  const v = F.agreementView(role), a = v.active;
  if (!a) return '';
  const due = Math.max(0, a.due - F.absWeek());
  const isReview = a.state === 'review';
  const baseline = a.baseline && a.baseline.score != null ? a.baseline.score + '/100' : 'Insufficient data';
  const current = a.check ? a.check.score + '/100' : 'Review not due';
  return `<section class="fo-working-agreement">
    <div class="fo-agreement-title"><span>LEADERSHIP AGREEMENT</span>
      <b>${isReview ? 'Evidence review due' : 'In execution'}</b></div>
    <h3>${esc(a.head)} · ${esc(F.ROLE[role].t)}</h3>
    <p>The department head executes your agreed mandate independently.
      The next conversation is based on results, not an arbitrary trust bonus.</p>
    <div class="fo-agreement-evidence">
      <div><small>When agreed</small><b>${baseline}</b></div>
      <div><small>${isReview ? 'At review' : 'Next review'}</small><b>${isReview ? current : 'In ' + due + ' wk'}</b></div>
    </div>
    ${isReview ? `<p><b>Assessment:</b> ${esc(a.outcome)}</p>
      ${a.check && a.check.lines && a.check.lines.length ?
        '<details class="fo-agreement-lines"><summary>Review the evidence</summary>' +
          a.check.lines.map(line => '<div><span>' + esc(line[0]) + '</span><b>' + esc(line[1]) + '</b></div>').join('') +
        '</details>' : ''}
      <div class="fo-agreement-actions">
        <button data-a="agr-review" data-id="${esc(a.id)}" data-v="continue">Renew direction · 6 weeks</button>
        <button data-a="sheet" data-s="mand" data-r="${role}">Change the agreement</button>
        <button data-a="agr-review" data-id="${esc(a.id)}" data-v="close">Acknowledge review</button>
      </div>` : '<p class="small">Your employee continues working. No CEO action is needed before the review.</p>'}
  </section>`;
}
function specialistConflictHtml(dk) {
  const conflicts=F.specialistConflicts?.(dk)||[];
  if(!conflicts.length)return '';
  return '<section class="fo-specialist-conflicts" aria-label="Interdepartmental decisions">'+
    '<div class="sec">Cross-department decisions <small>'+conflicts.length+' needs you</small></div>'+
    conflicts.map(c=>'<article class="fo-specialist-conflict"><span>STRATEGIC CONFLICT</span>'+
      '<h3>'+esc(c.title)+'</h3><p>'+esc(c.explanation)+'</p>'+
      '<small>'+esc(c.evidence)+'</small>'+
      '<p><b>Involved:</b> '+esc(c.first)+' / '+esc(c.second)+'</p>'+
      c.options.map(o=>'<button data-a="sp-conflict" data-id="'+esc(c.id)+
        '" data-v="'+esc(o.k)+'">'+esc(o.label)+'</button>').join('')+
      '</article>').join('')+'</section>';
}
function specialistRecordsHtml(dk) {
  if (!F.specialistCases) return '';
  const cases=F.specialistCases(dk).slice(0,8);
  if (!cases.length) return '';
  const open=cases.filter(c=>c.status==='executing'||c.status==='review');
  const render=c=>'<div class="fo-specialist-case">'+
    '<span class="fo-specialist-state">'+(c.status==='review'?'REVIEW READY':
      c.status==='interrupted'?'INTERRUPTED':'IN EXECUTION')+'</span>'+
    '<b>'+esc(c.title)+'</b>'+
    '<small>Responsible: '+esc(c.head)+' · season '+c.season+', week '+c.week+'</small>'+
    '<p>'+esc(c.result)+'</p>'+
    (c.financeConcern?'<p class="fo-specialist-conflict">'+esc(c.financeConcern)+'</p>':'')+
    (c.review?'<p><b>Follow-up:</b> '+esc(c.review.text)+'</p>':
      '<small>Evaluation after four game weeks. Staff continue their own work.</small>')+
    (c.status==='review'||c.status==='interrupted'?
      '<button class="fo-specialist-ack" data-a="sp-ack" data-id="'+esc(c.id)+'">Acknowledge the review</button>':'')+
    '<details><summary>Evidence and actual changes</summary>'+
    '<pre>'+esc(JSON.stringify({before:c.before,after:c.review?.evidence||c.after},null,2))+'</pre>'+
    '</details></div>';
  return '<section class="fo-specialist-records" aria-label="Department decision follow-up">'+
    '<div class="sec">Decisions & execution <small>'+open.length+' active or reviewing</small></div>'+
    open.slice(0,4).map(render).join('')+
    (cases.length>open.length?'<details class="fo-specialist-archive"><summary>Decision history ('+
      (cases.length-open.length)+')</summary>'+
      cases.filter(c=>!open.includes(c)).map(render).join('')+'</details>':'')+
    '</section>';
}
function headBtns(role, s) {
  const g = G(), sur = s.name.split(' ').slice(-1)[0];
  const PV = F.pwView ? F.pwView() : null, agChip = PV && PV.ag && PV.stage !== 'closed' && ['coach', 'dof', 'acad'].includes(role) ? `<button class="agchip" data-a="pw-open"><span>${ART.I.info}</span><b>Agreement: the ${esc(PV.tname)} question</b><small>${role === PV.ag.owner || (role === 'coach' && PV.ag.owner === PV.ag.owner && PV.ag.ownerName === s.name) ? 'Responsible' : 'Involved'} · evaluation week ${PV.ag.evalWeek}</small></button>` : '';
  return agChip + authHtml(role) + agreementHtml(role) + `<div class="hbtns"><button class="btn small" ${role === 'coach' ? 'data-a="ft-talk"' : `data-a="sheet" data-s="talk" data-r="${role}"`} >${ART.I.phone} Talk</button><button class="btn ghost small" data-a="sheet" data-s="mand" data-r="${role}">Mandate</button><button class="btn ghost small danger" ${role === 'coach' ? 'data-a="ft-sackq"' : `data-a="sheet" data-s="fire" data-r="${role}"`} >Sack</button></div>`;
}
function instinctRow(role) {
  const s = F.staff(role); if (!s) return ''; const L = F.LEAN[role], k = L[0], m = F.man(role, k), MD = F.MAND[role].sl.find(x => x[0] === k); if (!MD) return '';
  const d = Math.abs(m - s.lean);
  return `<div class="mvr"><div class="mvl"><span>${esc(MD[1])}</span><span>${esc(MD[2])}</span></div><div class="mvt"><i class="you" style="left:${m}%"></i><i class="him ${d > 40 ? 'off' : ''}" style="left:${s.lean}%">${ART.staffFace(role)}</i></div><div class="mvf"><span>Your mandate vs ${esc(s.name.split(' ')[0])}'s instinct</span><b class="${d > 40 ? 'bad' : d < 20 ? 'good' : ''}">${d > 40 ? 'Friction' : d < 20 ? 'Aligned' : 'Some distance'}</b></div></div>`;
}
function fillCol(f) { return f >= 0.85 ? '#2a6b46' : f >= 0.6 ? '#5f9a4f' : f >= 0.4 ? '#d9a21b' : '#c8102e'; }
function stadiumSvg(V) {
  const D = V.D, h = D.home, m = D.main, fa = D.family;
  const st = (x, y, w, hh, d, lab) => `<g><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6" fill="${fillCol(d.fill)}" stroke="#16201b" stroke-width="3"/><text x="${x + w / 2}" y="${y + hh / 2 - 2}" text-anchor="middle" font-size="15" font-weight="900" fill="#fff" font-family="var(--head)">${Math.round(d.fill * 100)}%</text><text x="${x + w / 2}" y="${y + hh / 2 + 14}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="var(--head)">${lab}</text></g>`;
  return `<svg class="stadsvg" viewBox="0 0 340 220" role="img" aria-label="Stadium: home end ${Math.round(h.fill * 100)}%, main stand ${Math.round(m.fill * 100)}%, family stand ${Math.round(fa.fill * 100)}% full">
    <rect x="70" y="40" width="200" height="120" fill="#4f8d5c" stroke="#16201b" stroke-width="3"/><path d="M170 40v120" stroke="#fff" stroke-width="2" opacity=".7"/><circle cx="170" cy="100" r="18" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>
    <rect x="70" y="8" width="200" height="26" rx="6" fill="light-dark(#cfd4cf,#3a423d)" stroke="#16201b" stroke-width="2" stroke-dasharray="5 4"/><text x="170" y="25" text-anchor="middle" font-size="10" font-weight="800" fill="light-dark(#5a625d,#aab3ad)" font-family="var(--head)">AWAY END</text>
    ${st(8, 40, 56, 120, h, 'HOME END')}${st(70, 166, 200, 46, m, 'MAIN STAND')}${st(276, 40, 56, 120, fa, 'FAMILY')}</svg>`;
}
function comOverview(V) {
  const tot = Object.values(V.D).reduce((a, x) => a + x.att, 0), cap = Object.values(V.D).reduce((a, x) => a + x.cap, 0), rev = Object.values(V.D).reduce((a, x) => a + x.rev, 0);
  return `<div class="sec">Matchday</div><div class="panel2">${stadiumSvg(V)}<div class="stadleg"><span><i style="background:#c8102e"></i>Under 40%</span><span><i style="background:#d9a21b"></i>40 to 60</span><span><i style="background:#5f9a4f"></i>60 to 85</span><span><i style="background:#2a6b46"></i>Full</span></div>
  <div class="kgrid" style="margin-top:8px"><div class="kt"><small>Expected crowd</small><b>${tot.toLocaleString('en-GB')}</b><span>of ${cap.toLocaleString('en-GB')}</span></div><div class="kt"><small>Gate per home game</small><b>${money(rev)}</b><span>after concessions</span></div></div>
  <p class="small" style="margin:8px 0 0">Crowds follow your fans, recent form, prices and the matchday experience.</p></div>`;
}
function comDecisions(V) {
  const g = G(), o = V.offer;
  const offer = o ? `<div class="offer"><div class="ofh"><span class="ofs">${esc(o.sect)}</span><b>${esc(o.name)}</b><em>${money(o.wk)}/wk</em><small>${o.weeks} weeks. Offer ends in ${Math.max(0, o.exp - F.absWeek())} wk</small></div><div class="bopts"><button class="bopt" data-a="com-offer" data-k="accept"><b>Accept</b><span class="fx">+${money(o.wk)}/wk</span></button><button class="bopt" data-a="com-offer" data-k="push"><b>Push for 20% more</b><span class="fx">or they walk</span></button><button class="bopt" data-a="com-offer" data-k="reject"><b>Turn it down</b></button></div></div>` : `<p class="small" style="margin:0">No offer on the table. ${g.club.deals.length >= 5 ? 'All five sponsor slots are filled.' : 'Your commercial team is talking to local firms.'}</p>`;
  const prices = V.stands.map(st => { const d = V.D[st.k]; return `<div class="budrow"><span><b>${esc(st.t)}</b><small>${money(d.price)} a ticket, ${Math.round(d.fill * 100)}% full</small></span><button class="iconbtn sm" data-a="com-price" data-k="${st.k}" data-v="-0.1" aria-label="Cheaper ${esc(st.t)}">−</button><em>${Math.round(V.X.pf[st.k] * 100)}</em><button class="iconbtn sm" data-a="com-price" data-k="${st.k}" data-v="0.1" aria-label="Dearer ${esc(st.t)}">+</button></div>`; }).join('');
  return `<div class="sec">Sponsor offer</div><div class="panel2">${offer}</div>
  <div class="sec">Ticket prices <span class="small">100 is the standard price</span></div><div class="budcard">${prices}<p class="small" style="margin:6px 0 0">The home end barely reacts to price, the family stand does. Effect from the next home game.</p></div>
  <div class="sec">Matchday experience</div><div class="panel2"><div class="expl">${V.expL.map((l, i) => `<i class="${i < V.exp ? 'on' : ''}" title="${esc(l)}"></i>`).join('')}</div><div class="scr2"><span>${esc(V.expL[V.exp - 1])}</span><b>${V.expCost ? money(V.expCost) + '/wk' : 'No running cost'}</b></div>${V.exp < 5 ? `<button class="btn ghost wide" data-a="com-exp" data-v="up" ${g.club.cash < V.expFee ? 'disabled' : ''}>Upgrade to "${esc(V.expL[V.exp])}" for ${money(V.expFee)}</button>` : ''}${V.exp > 1 ? '<button class="linkbtn" data-a="com-exp" data-v="down">Cut back a level</button>' : ''}<p class="small" style="margin:6px 0 0">Each level draws more casual fans and sells more merchandise.</p></div>
  <div class="sec">Family day</div><div class="panel2"><p class="small" style="margin:0 0 8px">Half-price family stand for the next home game. Bigger crowd, a few new fans.</p>${V.X.promo === 'next' ? '<p class="small good" style="margin:0">Set for the next home game.</p>' : `<button class="btn ghost wide" data-a="com-promo" ${V.promoIn ? 'disabled' : ''}>${V.promoIn ? `Possible again in ${V.promoIn} wk` : `Run a family day (${money(Math.round(F.M(400) / 10) * 10)})`}</button>`}</div>`;
}
function mkOverview(V) {
  const rows = [['Reach', V.reach, 'People in the area who know the club'], ['Fans', V.fans, 'Turn up at least now and then'], ['Season tickets', V.stx, 'Come every home game, win or lose']], mx = Math.max(1, V.reach);
  return `<div class="sec">Supporters</div><div class="panel2"><div class="funnel2">${rows.map(([l, v, d], i) => `<div class="f2r"><div class="f2b" style="width:${Math.max(18, Math.sqrt(v / mx) * 100)}%"><b>${v.toLocaleString('en-GB')}</b></div><span><b>${l}</b><small>${d}</small></span></div>`).join('')}</div>
  ${mrow('trust', 'Loyalty', V.loyalty, 100, V.loyalty + '', V.loyalty < 35 ? 'lo' : '')}<p class="small" style="margin:4px 0 0">Loyal fans stay through a bad run and buy season tickets. Community work builds it.</p>
  ${V.camp ? `<div class="campon"><b>${esc(V.camp.t)}</b><span>${V.camp.left} week${V.camp.left === 1 ? '' : 's'} left</span></div>` : ''}</div>`;
}
function mkDecisions(V) {
  const g = G();
  return `<div class="sec">Campaign ${V.camp ? '<span class="small">one at a time</span>' : ''}</div><div class="camps">${V.camps.map(c => `<button class="camp ${V.camp && V.camp.k === c.k ? 'on' : ''}" data-a="mk-camp" data-k="${c.k}" ${V.camp || g.club.cash < c.price ? 'disabled' : ''}><b>${esc(c.t)}</b><small>${esc(c.d)}</small><em>${money(c.price)}, ${c.wk} wk</em></button>`).join('')}</div>
  <p class="small">Campaign strength ${Math.round(V.mult * 100)}%. A stronger head of marketing and a content creator raise it.</p>
  <div class="sec">Community programme</div><div class="budcard"><div class="budrow"><span><b>${esc(V.commL[V.comm])}</b><small>${V.commCost ? money(V.commCost) + '/wk' : 'No cost'}</small></span><button class="iconbtn sm" data-a="mk-comm" data-v="-1" aria-label="Less community work">−</button><em>${V.comm}</em><button class="iconbtn sm" data-a="mk-comm" data-v="1" aria-label="More community work">+</button></div><p class="small" style="margin:6px 0 0">Raises loyalty slowly, week by week.</p></div>`;
}
function planCard(only) {
  const V = F.bizView(), rows = V.rows.filter(r => !only || r.k === only);
  return `<div class="plan2">${!only ? `<div class="spread"><b>Season budget</b><span class="small ${V.ok ? 'good' : 'bad'}">${money(V.spend)} of ${money(V.env)}/wk</span></div><div class="budbar"><b class="${V.ok ? '' : 'over'}" style="width:${Math.min(100, V.env ? V.spend / V.env * 100 : 100)}%"></b></div><p class="small" style="margin:4px 0 8px">${V.ok ? 'Within what revenue covers.' : 'Above what revenue covers: cash goes down.'} Forecast ±${V.err}%.</p>` : ''}
  ${rows.map(r => `<div class="plrow"><span><b>${esc(r.t)}</b><small>${money(r.cost)}/wk</small></span><div class="seg3" role="group" aria-label="${esc(r.t)} budget">${V.levels.map(([k, l], i) => `<button class="${r.lv === k ? 'on' : ''}" data-a="biz-lv" data-k="${r.k}" data-v="${k}" aria-pressed="${r.lv === k}">${l}<small>${money(r.costs[i])}</small></button>`).join('')}</div></div>`).join('')}
  ${!only ? `<button class="linkbtn" data-a="biz-prop">Use Finance's proposal</button>` : '<p class="small" style="margin:6px 0 0">Finance checks every department against one season budget.</p>'}</div>`;
}
function bizOverview() {
  const V = F.bizView(), g = G(), L = g.fin.last, run = F.finRunway ? F.finRunway() : null;
  const inc = L ? L.tin : V.rev, out = L ? L.tout : 0, mx = Math.max(inc, out, 1);
  const seg = (o, cls) => Object.entries(o || {}).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([k, v], i) => `<i class="${cls}${i % 2 ? ' alt' : ''}" style="width:${v / mx * 100}%" title="${k}"></i>`).join('');
  const gauge = run == null ? 100 : Math.min(100, run / 26 * 100);
  return `<div class="sec">Money flow last week</div><div class="panel2"><div class="flow"><span>In</span><div class="fbar">${L ? seg(L.i, 'in') : ''}</div><b>${money(inc)}</b></div><div class="flow"><span>Out</span><div class="fbar">${L ? seg(L.o, 'out') : ''}</div><b>${money(out)}</b></div><div class="spread" style="margin-top:6px"><span class="small">Result</span><b class="${inc - out >= 0 ? 'good' : 'bad'}">${inc - out >= 0 ? '+' : ''}${money(inc - out)}</b></div></div>
  <div class="sec">Runway</div><div class="panel2"><div class="gauge"><i style="width:${gauge}%" class="${run != null && run <= 8 ? 'bad' : ''}"></i></div><p class="small" style="margin:6px 0 0">${run == null ? 'On the forecast, the club is not burning cash.' : `On the forecast, about ${run} weeks of cash.`}${L && L.tin - L.tout < 0 && g.club.cash > 0 ? ` At last week's loss alone: ${Math.floor(g.club.cash / (L.tout - L.tin))} weeks.` : ''} ${V.debt ? `Debt ${money(V.debt)} at ${(V.rate * 52 * 100).toFixed(1)}% a year.` : 'No debt.'}</p></div>
  <div class="sec">Budget</div><div class="budcard">${planCard()}</div>`;
}
function acPyramid(V) {
  const rows = [{ k: 'First team', ps: V.grads, w: 34 }].concat(V.groups.slice().reverse().map((x, i) => ({ k: x.k, ps: x.ps, w: 48 + i * 14 })));
  const col = p => { const b = p.band ? p.band[1] : F.absStars(p.pa); return b >= V.lvl + 0.5 ? '#2a6b46' : b >= V.lvl - 0.5 ? '#d9a21b' : 'light-dark(#b9beba,#5a625d)'; };
  return `<div class="pyr">${rows.map(r => `<div class="pyrow"><small>${esc(r.k)}</small><div class="pyb" style="width:${r.w}%">${r.ps.length ? r.ps.slice(0, 12).map(p => `<button class="pyd" style="background:${col(p)}" data-a="player" data-id="${p.id}" aria-label="${esc(p.name)}"></button>`).join('') : '<span class="small">empty</span>'}</div><em>${r.ps.length}</em></div>`).join('')}</div>
  <div class="stadleg"><span><i style="background:#2a6b46"></i>Can make it here</span><span><i style="background:#d9a21b"></i>Maybe</span><span><i style="background:#b9beba"></i>Unlikely</span></div>`;
}
function acOverview(V) {
  const best = V.groups.flatMap(x => x.ps).sort((a, b) => (b.band ? b.band[1] : 0) - (a.band ? a.band[1] : 0))[0];
  return `<div class="sec">The pathway</div><div class="panel2">${acPyramid(V)}${best ? `<button class="pchip" data-a="player" data-id="${best.id}" style="margin-top:8px"><span>${ART.playerFace(best, 'happy')}</span>${esc(best.name)}<small>best prospect, ${best.age}</small></button>` : ''}<p class="small" style="margin:8px 0 0">The director and the academy staff decide how good the intake is and how fast the kids grow.</p></div>`;
}
function acDecisions(V) {
  const X = V.trial; if (!X) return `<div class="sec">Trial day</div><div class="panel2"><p class="small" style="margin:0">Next trial day in week 28. The academy picks who joins.</p></div>`;
  return `<div class="sec">Trial day <span class="small">${X.chosen.length} of ${X.picks} picked</span></div><div class="trials">${X.list.map(p => { const on = X.chosen.includes(p.id), rec = X.staffPick.includes(p.id); return `<div class="trial ${on ? 'on' : ''}" role="listitem"><span class="tf">${ART.playerFace(p, on ? 'happy' : null)}</span><b>${esc(p.name.split(' ').slice(-1)[0])}</b><small>${p.age}, ${esc(F.POS_L[p.pos])}</small><em>${p.band ? p.band[0].toFixed(1) + '–' + p.band[1].toFixed(1) : '?'}★</em>${rec ? '<i class="rec">Recruiters\' pick</i>' : ''}</div>`; }).join('')}</div><p class="small">The academy chooses the intake. You set its objectives, budget and protection in the academy mandate. Potential is a range: better recruiters make it narrower.</p>`;
}
function squadPlanHtml(){
  const p=F.squadPlanView();
  const horizon=(h,title)=>`<section class="panel2"><h3>${title}</h3>${h.rows.length?h.rows.map(r=>`<div style="border-top:1px solid var(--rule);padding:12px 0"><b>${esc(F.POS_L[r.pos])}</b><p>${esc(r.reason)}</p><p class="small"><b>The TD's next step:</b> ${esc(r.action)}</p><p class="small">${r.targets} candidates under observation, ${r.reliable} with more than low confidence${r.scouts.length?'; '+esc(r.scouts.join(', '))+' assigned':''}.</p></div>`).join(''):`<p>${h.status==='closed'?'The window is closed. Unresolved needs feed summer preparation.':'No specific recruitment need justifies a purchase; scouting continues without inventing a target.'}</p>`}</section>`;
  return `<section aria-label="Rolling squad plan"><div class="sec">The living squad plan <span class="small">Season ${p.season} · week ${p.week}</span></div><div class="panel2"><b>${esc(p.owner)} · ${p.vacant?'responsible post vacant':'Director of Football'}</b><p>${esc(p.summary)}</p><p class="small">Current fee room ${money(p.finance.fees)}; weekly player-wage headroom ${money(p.finance.weeklyRoom)}. These are current limits, not a guaranteed budget for next summer.</p><div class="row" style="flex-wrap:wrap;gap:8px"><button class="btn ghost small" data-a="squad-plan-ask" data-q="winter">Why this winter plan?</button><button class="btn ghost small" data-a="squad-plan-ask" data-q="summer">Talk through summer succession</button><button class="btn ghost small" data-a="squad-plan-ask" data-q="help">What do you need from me?</button></div>${p.discussion?`<div class="bubble" style="margin-top:12px"><div class="who">${esc(p.owner)} · week ${p.discussion.week}</div><p>${esc(p.discussion.answer)}</p></div>`:''}</div>
    ${horizon(p.winter,`Winter · season ${p.winter.season}${p.winter.status==='closed'?' · closed':''}`)}${horizon(p.summer,`Summer · season ${p.summer.season}`)}
    <div class="sec">What the scouts are doing</div><div class="panel2">${p.assignments.length?`<ul class="list">${p.assignments.map(a=>`<li style="display:block"><b>${esc(a.name)}</b><p class="small">${esc(a.label)}</p></li>`).join('')}</ul>`:'<p>No scouting staff are available. Appoint a Chief Scout to restore coverage.</p>'}</div>
    ${p.history.length?`<div class="sec">Why the plan changed</div><div class="panel2">${p.history.map(e=>`<p class="small"><b>S${e.season} · week ${e.week} · ${esc(e.kind)}:</b> ${esc(e.text)}</p>`).join('')}</div>`:''}</section>`;
}

function rxOverview(V) {
  const mx = Math.max(30, ...V.regions.map(r => r.net));
  return `<div class="sec">Scouting network</div><div class="panel2"><div class="netgrid">${V.regions.map(r => `<div class="netc ${r.focus ? 'f' + r.focus : ''}"><span class="nb" style="--s:${18 + r.net / mx * 34}px"></span><b>${esc(r.t)}</b><small>${r.net}${r.focus === 1 ? ', main focus' : r.focus === 2 ? ', second focus' : ''}</small></div>`).join('')}</div><p class="small" style="margin:6px 0 0">A stronger network finds better players and sharper reports. Focus and trips grow it.</p></div>
  <div class="sec">The DoF's record <span class="small">${V.hits} hit${V.hits === 1 ? '' : 's'}, ${V.misses} miss${V.misses === 1 ? '' : 'es'}</span></div><div class="panel2">${V.rec.length ? `<div class="hmstrip">${V.rec.slice(-16).map(x => `<button class="hm ${x.v === 'Hit' ? 'h' : 'm'}" ${x.pid ? `data-a="player" data-id="${x.pid}"` : ''} aria-label="${esc(x.name)}: ${x.v}">${x.v === 'Hit' ? '✓' : '✗'}</button>`).join('')}</div><p class="small" style="margin:6px 0 0">Each signing after half a season: a regular with good ratings is a hit. His record moves your trust in him.</p>` : '<p class="small" style="margin:0">No verdicts yet. Signings are judged once they have played.</p>'}</div>`;
}
function rxDecisions(V) {
  return `<div class="sec">Where the scouts look</div><div class="panel2"><div class="regchips">${V.regions.map(r => `<button class="${r.focus ? 'on f' + r.focus : ''}" data-a="rx-focus" data-k="${r.k}">${esc(r.t)}${r.focus ? `<small>${r.focus === 1 ? 'main' : 'second'}</small>` : ''}</button>`).join('')}</div><p class="small" style="margin:6px 0 0">Tap a region to make it the main focus. The old main focus becomes the second.</p></div>
  <div class="sec">Scouting trip</div><div class="panel2"><p class="small" style="margin:0 0 8px">A trip of the scouting team grows one network fast. ${money(V.cost)}, once every 8 weeks.</p><div class="regchips">${V.regions.map(r => `<button data-a="rx-invest" data-k="${r.k}" ${V.investIn ? 'disabled' : ''}>${esc(r.t)}<small>${r.net}</small></button>`).join('')}</div>${V.investIn ? `<p class="small" style="margin:6px 0 0">Next trip in ${V.investIn} wk.</p>` : ''}</div>`;
}
function vDept(k) {
  const g = G(), v = F.deptView(k), d = v.d, tab = U.dtab || 'over';
  const purpose = {
    first:'The head coach is accountable for the first team. You lead through goals, support and evaluation — not team selection.',
    recruit:'The Director of Football owns squad planning and negotiations; the Chief Scout owns player evidence.',
    academy:'The Academy Director leads youth recruitment, player welfare and the route into senior football.',
    commercial:'Commercial leadership owns sponsorship, ticketing and retail income within your club principles.',
    marketing:'Marketing leadership develops the club identity, community relationships and supporter engagement.',
    business:'Finance leadership controls cost, contracts and risk; you authorize exceptions and set financial direction.'
  };
  const nIssues = (v.status.issues || []).length;
  const overview = `<section class="fo-dept-purpose" aria-label="${esc(d.t)} responsibilities">
    <span>DEPARTMENT ACCOUNTABILITY</span>
    <p>${esc(purpose[k] || '')}</p>
    <div class="fo-dept-facts">
      <span><b>${v.head ? esc(v.head.name) : 'Vacant'}</b><small>Responsible head</small></span>
      <span><b>${v.used}/${v.slots}</b><small>Staff positions</small></span>
      <span><b>${nIssues}</b><small>Concerns</small></span>
      <span><b>${v.projects.length}</b><small>Active projects</small></span>
    </div>
  </section>`;
  const head = `<div class="ohead"><button class="iconbtn" data-a="dept" data-k="" aria-label="Back to departments">${ART.I.back}</button><span class="pos">${esc(d.t)}</span><span class="dstat ${v.status.st}">${v.status.l}</span></div>`;
  if (k === 'first' && v.head) { const T = F.ftView(); if (T.talk) return head + ftTalkHtml(T); }
  const FP = k === 'first' && v.head ? vFirst(true) : null;
  const tabs = `<nav class="fo-dept-sections" aria-label="${esc(d.t)} views">
    ${[['over', 'Briefing'], ['people', 'Staff'], ['data', 'Evidence'], ['dec', 'Mandates & work']].map(([t, l]) =>
    `<button class="${tab === t ? 'on' : ''}" aria-current="${tab === t ? 'page' : 'false'}"
        data-a="dtab" data-v="${t}">${l}</button>`).join('')}
  </nav>`;
  let body = '';
  if (tab === 'over') {
    const kpis = `<div class="kgrid">${v.status.rows.slice(0, 4).map(r => `<div class="kt ${r.ok === true ? 'good' : r.ok === false ? 'bad' : ''}"><small>${esc(r.l)}</small><b>${esc(r.v)}</b>${r.ref ? `<span>${esc(r.ref)}</span>` : ''}</div>`).join('')}</div>`;
    const vis = k === 'recruit' && F.rxView ? rxOverview(F.rxView()) : k === 'academy' && F.acView ? acOverview(F.acView()) : k === 'business' && F.bizView ? bizOverview() : k === 'commercial' && F.comView ? comOverview(F.comView()) : k === 'marketing' && F.mkView ? mkOverview(F.mkView()) : FP ? `<div class="sec">Form</div><div class="panel2">${FP.form}${FP.trend}</div>` : `<div class="sec">${esc(v.kpiL[0])}</div><div class="panel2"><div class="kbig">${v.kpi.length ? kfmt(k, v.kpi[v.kpi.length - 1]) : '–'}</div>${spark(v.kpi, v.kpiL[1])}</div>`;
    const mand = FP ? `<div class="sec">Your mandate vs what he does</div><div class="panel2">${FP.rows}${FP.gapBig ? `<button class="btn ghost wide" data-a="ft-talk" style="margin-top:8px">Raise it with ${esc(FP.sur)}</button>` : ''}</div>` : v.head ? `<div class="sec">Direction</div><div class="panel2">${instinctRow(d.head)}</div>` : '';
    const signals = v.status.issues || [];
    const issuesHtml = signals.length ? '<div class="sec">Needs attention</div>' + signals.map(i => {
      const owner = F.staff(i.owner), follow = i.followUp;
      const active = follow && follow.state === 'Plan underway';
      const action = owner
        ? '<button class="btn small" data-a="dept-meeting" data-k="' + esc(k) + '" data-v="' + esc(i.key) + '">' + (active ? 'View assignment' : 'Discuss this issue') + '</button>'
        : '<button class="btn small" data-a="sheet" data-s="cands" data-r="' + esc(i.owner) + '">Appoint responsible head</button>';
      return '<div class="panel2"><b>' + esc(i.title) + '</b><p class="small">' + esc(i.evidence) + '</p><p class="small">' + esc(i.why) + '</p><p class="small">Responsible: ' + esc(owner ? owner.name : F.ROLE[i.owner].t + ' (vacant)') + '</p>' +
        (follow ? '<p class="small"><b>' + esc(follow.state) + '</b> · ' + esc(follow.note) + '</p><p class="small">Original evidence: ' + esc(follow.baseline) + '</p>' : '') +
        action + '</div>';
    }).join('') : '<div class="sec">Assessment</div><div class="panel2"><p class="small">No urgent concerns identified. Scorecard figures remain available under Data; not every weak number calls for a CEO decision.</p></div>';
    const resolvedHtml = (v.status.resolved || []).length
      ? '<div class="sec">Reviews completed</div>' + v.status.resolved.map(i =>
        '<div class="panel2"><b>' + esc(i.title) + ' · Improved</b><p class="small">' + esc(i.followUp.note) + '</p><p class="small">Original evidence: ' + esc(i.followUp.baseline) + '</p></div>'
      ).join('') : '';
    body = (k === 'recruit' && F.squadPlanView ? squadPlanHtml() : '') + issuesHtml + resolvedHtml + kpis + vis + mand;
  }
  if (tab === 'people') {
    const scoutC = d.also ? (() => { const sc = v.also; return sc ? `<div class="pcard2 senior"><span class="pf">${ART.staffFace(d.also)}</span><span class="pm"><b>${esc(sc.name)}</b><small>Chief scout, ${starsTxt(F.stars(F.ovr(sc)))}</small></span><span class="pb"><button class="linkbtn" data-a="sheet" data-s="mand" data-r="scout">Mandate</button><button class="linkbtn" data-a="sheet" data-s="talk" data-r="scout" >Talk</button></span></div>${agreementHtml('scout')}` : `<div class="pcard2 senior"><span class="pf empty">${ART.I.staff}</span><span class="pm"><b>No chief scout</b><small>Scouting runs on luck</small></span><button class="btn small" data-a="sheet" data-s="cands" data-r="scout">Hire</button></div>`; })() : '';
    const cards = v.staff.map(st => `<div class="pcard2 ${st.on ? '' : 'pending'}"><span class="pf">${ART.face(st.id * 17 + 5, { role: d.face, age: st.age, bg: '#fff' })}</span><span class="pm"><b>${esc(st.name)}</b><small>${esc(st.title)}</small><span class="traits"><span title="${esc(st.tdesc)}">${esc(st.trait)}</span></span><small class="pw">${esc(st.what)}. ${money(st.wage)}/wk</small>${st.on ? '' : `<small class="pw">Starts in ${st.left} wk</small>`}</span><button class="linkbtn" data-a="dletgo" data-k="${k}" data-id="${st.id}">Let go</button></div>`).join('');
    const open = v.used < v.slots ? `<div class="sec">Open roles <span class="small">${v.slots - v.used} free</span></div><div class="oroles">${v.open.map(o => `<button class="orole" data-a="dcand" data-k="${k}" data-r="${o.role}"><b>${esc(o.title)}</b><small>${esc(o.what)}</small><em>from ${money(o.wage)}/wk</em></button>`).join('')}</div>` : `<p class="small">All ${v.slots} staff roles are filled. More room comes with a higher division.</p>`;
    body = `${scoutC}<div class="sec">Staff <span class="small">${v.used} of ${v.slots}</span></div>${cards || '<p class="small">Nobody yet. The head does everything alone.</p>'}${open}`;
  }
  if (tab === 'data') {
    if (k === 'academy') body = g.academy ? vAcademy2().replace(/<div class="ohead">[\s\S]*?<\/div>/, '') : '';
    else if (FP) body = `<div class="sec">The squad, through his eyes</div><div class="panel2">${FP.squad || '<p class="small">Nothing yet.</p>'}</div><div class="sec">Fitness</div>${FP.fit}`;
    else if (k === 'recruit') body = vRecruit2();
    else if (k === 'commercial') body = secCommercial() + `<div class="sec">${esc(v.kpiL[0])}</div><div class="panel2">${spark(v.kpi)}</div>`;
    else if (k === 'marketing') body = secMarketing() + `<div class="sec">Fans over time</div><div class="panel2">${spark(F.mkView ? F.mkView().hist : v.kpi)}</div>` + (F.mkView && F.mkView().log.length ? `<div class="sec">Recently</div><div class="panel2">${F.mkView().log.map(l => `<p class="small" style="margin:3px 0">Wk ${l.w}: ${esc(l.t)}</p>`).join('')}</div>` : '');
    else if (k === 'business') body = vMoney2();
    else body = `<div class="sec">${esc(v.kpiL[0])}</div><div class="panel2">${spark(v.kpi, v.kpiL[1])}</div>`;
    if (k !== 'academy') body += `<div class="sec">All numbers</div><div class="panel2">${v.status.rows.map(r => `<div class="scr2"><span>${esc(r.l)}${r.ref ? `<small>${esc(r.ref)}</small>` : ''}</span><b class="${r.ok === true ? 'good' : r.ok === false ? 'bad' : ''}">${esc(r.v)}</b></div>`).join('')}</div>`;
  }
  if (tab === 'dec') {
    const items = inboxItems().filter(i => i.kind === 'need' && (i.role === d.head || (d.also && i.role === d.also)));
    const inbox = items.length ? `<div class="sec">Waiting for you</div>${items.map(i => `<button class="dinb" data-a="dinbox" data-key="${i.key}"><b>${esc(i.subj)}</b><small>${esc(i.label)}</small>${ART.I.chev}</button>`).join('')}` : '';
    const bud = v.bud ? `<div class="sec">Budget</div><div class="budcard">${planCard(k)}</div>` : `<div class="sec">Budget</div><div class="budcard">${planCard()}</div>`;
    const fac = v.fac ? `<div class="sec">Facilities</div><div class="panel2">${mrow('stadium', esc(v.fac.l), v.fac.lv, 10, 'Level ' + v.fac.lv)}<p class="small" style="margin:6px 0 0">Upgrades come through projects in the board meeting.</p></div>` : '';
    const proj = v.projects.length ? `<div class="sec">Projects</div><div class="panel2">${v.projects.map(pr => { const P = F.PROP[pr.id]; let t = ''; try { t = typeof P.title === 'function' ? P.title(pr.ctx) : P.title; } catch (e) { } const left = pr.due - F.absWeek(); return `<div class="proj"><span>${esc(t)}</span><em>${Math.max(0, left)} wk</em></div>`; }).join('')}</div>` : '';
    const log = v.log.length ? `<div class="sec">Recently</div><div class="panel2">${v.log.map(l => `<p class="small" style="margin:3px 0">Wk ${l.w}: ${esc(l.t)}</p>`).join('')}</div>` : '';
    body = inbox + (k === 'recruit' && F.rxView ? rxDecisions(F.rxView()) : '') + (k === 'academy' && F.acView ? acDecisions(F.acView()) : '') + (k === 'commercial' && F.comView ? comDecisions(F.comView()) : '') + (k === 'marketing' && F.mkView ? mkDecisions(F.mkView()) : '') + (FP ? `<div class="sec">Target</div>${FP.deal}` : '') + bud + fac + proj + log;
  }
  const mini = v.head ? `<div class="hmini"><span class="dface">${ART.staffFace(d.head)}</span><span class="dt"><b>${esc(v.head.name)}</b><small>${esc(F.ROLE[d.head].t)}</small></span>${headBtns(d.head, v.head).replace('class="hbtns"', 'class="hbtns in"')}</div>` : headCard(k, v);
  return `${head}${overview}${tab === 'over' ? headCard(k, v) : mini}${tabs}${body}${(tab==='over'||tab==='dec')?specialistConflictHtml(k)+specialistRecordsHtml(k):''}`;
}
