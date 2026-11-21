/* ================= Screens: members, confidence, season targets and the AGM ================= */
function confBar(v){const c=v<40?'lo':v<55?'mid':'';return`<span class="conf ${c}" role="img" aria-label="members' confidence ${Math.round(v)} of 100"><i style="width:${Math.round(v)}%"></i><b style="left:40%"></b></span>`}
function agmForecast(id){return clamp(Math.round(20+.75*M(id).conf),3,97)}
function reasonRows(list){return list.map(([why,d])=>`<div class="row small"><span>${esc(why)}</span><b class="${d<0?'down':'up'}">${d>0?'+':''}${r1(d)}</b></div>`).join('')}
function targetsPanel(){
  const id=S.my,m=M(id),f=agmForecast(id);
  return`<div class="panel"><p class="eyebrow">Season targets</p>${m.goals.map(g=>{const p=goalProgress(id,g);return`<div class="row small"><span>${esc(g.text)}<br><span class="muted">${S.week?esc(p.text):'The season has not started'}</span></span>${S.week?`<span class="pill ${p.met?'good':'bad'}">${p.met?'On track':'Behind'}</span>`:'<span class="pill">To play</span>'}</div>`}).join('')}
  <div class="row small"><span>Members' confidence</span><b>${Math.round(m.conf)}</b></div>${confBar(m.conf)}
  <p class="small ${f<50?'down':'muted'}">An AGM today: about ${f}% for you. Below 50% you are out.</p></div>`;
}
function membersPanel(){
  const id=S.my,m=M(id),ref=DUES_REF[C().tier],recent=seasonReasons(id);
  return`<div class="panel"><p class="eyebrow">Members</p><div class="row"><span>Members</span><b>${n0(m.count)}</b></div>
  <div class="row small"><span>Confidence in the board</span><b>${Math.round(m.conf)} / 100</b></div>${confBar(m.conf)}
  <div class="grow"><span><b>Membership dues</b><br><span class="small muted">A year · usual £${ref} · £${n0(m.count*m.dues)} a year in total</span></span><span></span><span class="stepper"><button data-act="dues" data-arg="-1" aria-label="Lower dues">−</button><b>£${m.dues}</b><button data-act="dues" data-arg="1" aria-label="Raise dues">+</button></span></div>
  ${recent.length?`<p class="small muted">What moved the members this season</p>${reasonRows(recent)}`:''}
  <p class="note">Every club holds its AGM after week 30. Lose the vote and you are out.</p></div>`;
}
function agmPanel(a,club){
  return`<div class="panel"><p class="eyebrow">The AGM · ${esc(CL(club).name)}</p><p class="small">Motion: confidence in the chairman.</p>
  <div class="vote" role="img" aria-label="${a.for}% for, ${a.against}% against"><i style="width:${a.for}%"></i></div>
  <div class="row"><b class="up">${a.for}% for</b><b class="down">${a.against}% against</b></div>
  <p class="voice">${a.out?'The members have voted you out.':a.for>=70?'A clear mandate.':a.for>=55?'Carried, not loved.':'Carried, by a whisker.'}</p>
  ${a.reasons&&a.reasons.length?`<p class="small muted">What the members weighed</p>${reasonRows(a.reasons)}`:''}</div>`;
}
