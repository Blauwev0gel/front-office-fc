/* ================= Screens: the recruitment cycle (Club → Football) =================
   Responsible → aim → current work → results → the chairman's choices. Everything shown comes from S.ops and the squad. */
const NEED_WORD={hole:'Gap',contract:'Contract',leaving:'Leaving',ageing:'Succession',upgrade:'Upgrade'};
function needWhen(n){return n.kind==='contract'?`Renewal talks in week ${RENEW_WEEK}`:S.week<WINTER_WEEK&&n.kind==='hole'?`Winter window (week ${WINTER_WEEK}) only if injuries leave it bare; otherwise the summer`:'The summer window'}
function coursePanel(){
  const p=F(S.my).policy,cur=p.course&&COURSE[p.course];
  return`<div class="panel"><p class="eyebrow">Club course</p><p class="small muted">One choice sets the wage frame, transfer money, loans and recruitment together. The director follows it in every window.</p>
  <div class="stack">${Object.entries(COURSE).map(([k,c])=>`<button class="opt ${p.course===k?'on':''}" data-act="course" data-arg="${k}" aria-pressed="${p.course===k}"><b>${c.n}</b><span class="small muted">${esc(c.d)}</span></button>`).join('')}</div>
  ${cur?`<p class="small"><b>What to expect:</b> ${esc(cur.fx)}</p><p class="note">Wages: ${cur.wage} · transfer money: ${Math.round(cur.spend*100)}% · loans: ${cur.loans?'on':'off'} · recruitment: ${RECRUIT[cur.recruit].n}.</p>`:`<p class="small muted">Custom: you have set the choices one by one (wage frame, transfer money, recruitment). Pick a course to set them all at once.</p>`}</div>`;
}
function recruitPanels(){
  const id=S.my,ops=OPS(),pl=ops.plan,td=tdOf(id),st=recruitStrategy(id),open=pl.needs.filter(n=>n.status==='open'),done=pl.needs.filter(n=>n.status!=='open').slice(0,5);
  const watch=ops.shortlist.filter(e=>e.status==='watching').sort((a,b)=>b.est-a.est).slice(0,8),rev=signingReview(),noise=scoutNoise(id);
  return featurePanel('recruitment:beforePolicy')+coursePanel()+featurePanel('recruitment:afterPolicy')+`<div class="panel"><p class="eyebrow">Recruitment · ${esc(td.name)}</p><p class="small muted">The director plans the squad and signs within your frame; the scouting department watches players for him every week.</p>
  <p class="small"><b>Your strategy for him</b></p><div class="seg grid4">${Object.entries(RECRUIT).map(([k,r])=>`<button class="${st===k?'on':''}" data-act="recruit" data-arg="${k}" aria-pressed="${st===k}">${r.n}</button>`).join('')}</div>
  <p class="note">${esc(RECRUIT[st].d)}. It changes whom he picks in the next window, not who is already here.</p></div>
  <div class="panel"><p class="eyebrow">Squad plan · updated ${pl.s?`S${pl.s} W${pl.w}`:'—'}</p>${open.length?open.slice(0,5).map(n=>`<div class="row small"><span><b>${NEED_WORD[n.kind]}: ${POS_ONE[n.pos]}</b><br>${esc(n.why)}<br><span class="muted">${esc(needWhen(n))}</span></span><span class="pill ${n.prio>=3?'bad':''}">${n.prio>=3?'Urgent':n.prio===2?'Soon':'Later'}</span></div>`).join('')+(open.length>5?`<p class="small muted">And ${open.length-5} more, lower down the list.</p>`:''):'<p class="small muted">No open needs: the squad covers every position.</p>'}
  ${pl.ready.length?`<p class="small"><b>Ready to step up:</b> ${pl.ready.map(r=>`${esc(r.name)} (${r.pos}, ${r.q})`).join(', ')}</p>`:''}
  ${done.length?`<p class="small muted">Recently: ${done.map(n=>`${NEED_WORD[n.kind]} ${n.pos} ${n.status==='filled'?'filled by '+esc(n.by.name):n.status==='lapsed'?'player left':'solved'}`).join(' · ')}</p>`:''}</div>
  <div class="panel"><p class="eyebrow">Shortlist · ${scoutObservations(id)} look${scoutObservations(id)>1?'s':''} a week</p><p class="small muted">More scouting staff and a better scouting office mean more looks and sharper estimates. Each look narrows the range.</p>
  ${watch.length?watch.map(e=>{const rg=scoutRange(id,e.obs);return`<div class="row small"><span><b>${esc(e.name)}</b> <span class="muted">${e.pos}, ${e.age} · ${e.from?esc(marketClubName(e.from)):'free agent'}</span>${e.reason?`<br><span class="muted">Last window: ${esc(e.reason.toLowerCase())}</span>`:''}</span><b>${e.est} ±${rg}<br><span class="small muted">${e.obs} look${e.obs>1?'s':''}</span></b></div>`}).join(''):'<p class="small muted">The scouts start watching as soon as the plan has needs.</p>'}</div>
  <div class="panel"><p class="eyebrow">Signings: judged then, seen now</p>${rev.length?rev.map(x=>`<div class="row small"><span><b>${esc(x.name)}</b> <span class="muted">${x.pos}, S${x.s} · ${x.fee?'£'+x.fee+'k':'free'} · ${esc(x.need)}${x.scouted?` · watched ${x.obs}×`:' · not scouted'}</span></span><b class="${x.now!=null&&x.now<x.est-1?'down':''}">${x.est} → ${x.now??'—'}<br><span class="small muted">${x.apps!=null?x.apps+' apps · ':''}${esc(x.where)}</span></b></div>`).join('')+'<p class="note">Left: the director\'s estimate when he signed him. Right: the player\'s level now.</p>':'<p class="small muted">No signings since you took office.</p>'}</div>`;
}

/* ----- the weekly club report and the transfer window, on the Week screen ----- */
function windowPanel(){
  const w=windowInfo(),active=w.k==='next'||w.k==='done';
  return`<div class="panel"><div class="row"><p class="eyebrow">${esc(w.name)}</p><span class="pill ${w.k==='next'||w.k==='open'?'bad':w.k==='done'?'good':''}">${w.k==='open'?'Open now':w.k==='next'?'Next week':w.k==='done'?'Closed':w.k==='summer-next'?'After the season':'Upcoming'}</span></div>
  <p class="small">${esc(w.when)}</p>
  ${w.open.length&&w.k!=='done'&&w.k!=='none'?`<p class="small muted">The director's plan: ${w.open.slice(0,3).map(n=>esc(NEED_WORD[n.kind]+' · '+POS_ONE[n.pos])).join(', ')}.</p>`:''}
  ${w.k==='done'?(w.ins.length||w.outs.length?`${w.ins.map(e=>`<p class="small"><b>In:</b> ${esc(e.text)}</p>`).join('')}${w.outs.map(e=>`<p class="small"><b>Out:</b> ${esc(e.text)}</p>`).join('')}`:'<p class="small muted">The director did no business: nobody came in or went out.</p>')+(w.open.length?`<p class="small muted">Still open: ${w.open.slice(0,3).map(n=>esc(n.why)).join('; ')}.</p>`:''):''}
  <button class="tbtn" data-act="tab" data-arg="club">Recruitment, shortlist and strategy ›</button></div>`;
}
function clubWeekPanel(){
  if(!S.week||!S.ops)return'';const o=S.ops,lk=o.looks&&o.looks.s===S.season&&o.looks.w===S.week?o.looks.list:[],need=openNeeds()[0];
  const rows=[];
  if(lk.length)rows.push(['Scouting',`${lk.length} look${lk.length===1?'':'s'} this week: ${lk.slice(0,3).map(x=>`${esc(x.name)} (${x.pos}${x.club?', '+nm(x.club):', free'}, ${x.isNew?'new on the list':x.obs+' looks'}, ${r1(x.est)})`).join('; ')}.`]);
  if(need)rows.push(['Squad plan',esc(need.why)+'.']);
  return rows.length?`<div class="panel"><p class="eyebrow">Behind the scenes · week ${S.week}</p>${rows.map(([k,t])=>`<div class="row small"><b>${k}</b><span style="text-align:right;max-width:75%">${t}</span></div>`).join('')}</div>`:'';
}
