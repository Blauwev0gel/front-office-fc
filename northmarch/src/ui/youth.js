/* ---- ui/youth.js ---- */
/* ================= Screens: the youth development cycle (Club → Departments → Academy) =================
   Responsible → current young players and their pathway → what each cohort became → the chairman's choices.
   Everything shown comes from S.youth, p.dev and the squad. */
function fateText(g){
  const f=g.fate,now=findPlayer(g.pid),at=now&&now.club?CL(now.club).name:null;
  if(!f)return g.status==='loan'?`On loan${at?' at '+esc(at):''}`:g.status==='academy'?'In the academy':'In the first team';
  const then=`S${f.s}`;
  if(f.how==='sold')return`Sold to ${esc(f.to?CL(f.to).name:'another club')}${f.fee?` for £${f.fee}k`:''} (${then})`;
  if(f.how==='released')return`Released (${then})${at?`, now at ${esc(at)}`:''}`;
  return`Retired or left football (${then})`;
}
function youthPanels(){
  const id=S.my,Y=YOUTH(),d=G(id).depts.academy,sq=S.squads[id];
  const young=[...sq.filter(p=>p.age<=21),...Object.values(S.squads).flat().filter(p=>p.loan&&p.loan.from===id)].sort((a,b)=>a.age-b.age||b.q-a.q);
  const ay=academyYield(5),last=Y.cohorts[Y.cohorts.length-1],loans=F(id).policy.loans!==false;
  return`<div class="panel"><p class="eyebrow">Academy pathway</p>
  <p class="small muted">Each summer the academy sends its graduates into the senior squad. Young players grow fastest when they play.</p>
  <div class="row small"><span>Academy staff</span><b>${STAFF_WORD[d.staff]} · sees potential ${d.staff>=4?'clearly':d.staff>=2?'roughly':'vaguely'}</b></div>
  <div class="row small"><span>Last intake</span><b>${last?`${last.ids.length} in season ${last.s}`:'First intake this summer'}</b></div>
  <p class="small"><b>Young reserves who would not play</b></p>
  <div class="seg"><button class="${loans?'on':''}" data-act="loans" data-arg="true" aria-pressed="${loans}">Go on loan</button><button class="${!loans?'on':''}" data-act="loans" data-arg="false" aria-pressed="${!loans}">Stay here</button></div></div>
  <div class="panel"><p class="eyebrow">Young players now · 21 and under</p>
  ${young.length?young.map(p=>{const pw=pathwayOf(id,p),here=p.club===id&&!(p.loan&&p.loan.from===id);
    const body=`<span><b>${esc(p.name)}</b><small>${p.age} · ${p.pos} · quality ${r1(p.q)} · ${esc(potentialBand(id,p))} · ${p.sApps} apps</small></span><span class="pill ${pw.k==='ready'||pw.k==='starter'?'good':pw.k==='games'?'bad':''}">${pw.t}</span>`;
    return here?`<button class="dept-player" data-act="player" data-arg="${p.id}">${body}</button>`:`<div class="dept-player">${body}</div>`}).join(''):'<p class="small muted">No players of 21 or under at the club.</p>'}
  <p class="note">Potential is the academy's judgement, not a fact. "Needs games": he plays too little to grow.</p></div>
  <div class="panel"><p class="eyebrow">Academy yield · last ${ay.cohorts.length||5} intakes</p>
  ${ay.cohorts.length?`<div class="row small"><span>Became first-team regulars</span><b>${ay.regulars} of ${ay.n}</b></div><div class="row small"><span>First-team appearances</span><b>${ay.apps}</b></div><div class="row small"><span>Transfer fees earned</span><b>£${n0(ay.fees)}k</b></div>
  ${ay.cohorts.slice().reverse().map(c=>`<p class="small" style="margin-top:10px"><b>Intake of season ${c.s}</b> · ${c.n} graduate${c.n===1?'':'s'}</p>${c.gs.map(g=>`<div class="row small"><span>${esc(g.name)} · ${g.pos}${g.regular?' · regular':''}</span><b>${fateText(g)}</b></div>`).join('')}`).join('')}`
  :'<p class="small muted">The first cohort arrives this summer. From then on every graduate is followed, also after he leaves.</p>'}
  <p class="note">A regular played ten or more games in a season for the first team.</p></div>`;
}
function devLines(p){return(p.dev||[]).slice(-5).map(d=>`<div class="row small"><span>Season ${d.s} · age ${d.age}${d.where?` · on loan at ${esc(d.where)}`:''}</span><b>${d.q} · ${d.apps} apps</b></div>`).join('')}

