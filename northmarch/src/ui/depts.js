/* ---- ui/depts.js ---- */
/* ================= Screens: the club's departments =================
   The Club tab opens on the eight departments: people, money and a way of working, each with what it delivers
   against the division and the next investment within reach. All changes go through cmd(). */
function divAvg(fn){const ids=tierIds(C().tier).filter(i=>i!==S.my);return ids.reduce((a,i)=>a+fn(i),0)/Math.max(1,ids.length)}
function dots(n){return`<span class="dots" aria-label="staff level ${n} of 5">${'●'.repeat(n)}<span class="muted">${'○'.repeat(5-n)}</span></span>`}
/* what a department delivers this season, against the average of the division (better: true / false / null) */
function deptKpi(id,k){
  const st=i=>S.stats[i],sg=groundSignals,cmp=(v,a,hi,fmt)=>({text:`${fmt(v)} · division ${fmt(a)}`,good:Math.abs(v-a)<1e-9?null:hi?v>a:v<a});
  switch(k){
    case'training':{const yg=i=>{const n=S.squads[i].filter(p=>p.age<=23).length;return n?st(i).youthGrowth/n:0};return{label:'Growth per young player this season',...cmp(yg(id),divAvg(yg),true,v=>'+'+v.toFixed(2))}}
    case'medical':return{label:'Weeks lost to injury this season',...cmp(st(id).injWeeks,divAvg(i=>st(i).injWeeks),false,v=>Math.round(v))};
    case'academy':return{label:'Best graduate potential (last intake)',...cmp(st(id).intakeBest||0,divAvg(i=>st(i).intakeBest||0),true,v=>v?r1(v-(S.qref-11.7)).toFixed(1):'—')};
    case'scouting':{const r=i=>6+Math.round(2*sg(i).scouting);return{label:'Players the director sees per search',...cmp(r(id),divAvg(r),true,v=>Math.round(v))}}
    case'commercial':{const c=i=>{const l=F(i).season;return(l.sponsors||0)+(l.merch||0)+(l.events||0)};return{label:'Sponsors, merchandise and hire this season',...cmp(c(id),divAvg(c),true,v=>k1(v))}}
    case'community':{const d=i=>weekLines(i,false,{}).dues||0;return{label:'Membership dues per week',...cmp(d(id),divAvg(d),true,v=>'£'+n0(v*1000))}}
    case'matchday':return{label:'Atmosphere (home edge)',...cmp(sg(id).atmosphere,divAvg(i=>sg(i).atmosphere),true,v=>r1(v).toFixed(1))};
    case'grounds':{const c=i=>{const g=G(i),all=[...Object.values(g.sides),...Object.values(g.fac),...g.plots.filter(p=>p.kind),g.pitch];return all.reduce((a,o)=>a+o.cond,0)/all.length};return{label:'Average condition of the ground',...cmp(c(id),divAvg(c),true,v=>Math.round(v)+'%')}}
  }
}
/* the facility that belongs to a department, and the next building step for it */
function deptFacility(id,k){
  const f=DEPT[k].fac;if(!f)return null;const g=G(id),i=g.plots.findIndex(p=>p.kind===f),cat=projectCatalog(id);
  if(i>=0)return{have:g.plots[i],opt:cat.find(o=>o.key===`plot:${i}:up`),busy:!!building(id,'plot:'+i)};
  const free=g.plots.findIndex(p=>!p.kind&&!building(id,'plot:'+g.plots.indexOf(p)));
  const pend=g.projects.find(p=>p.phase!=='done'&&p.key.endsWith(':'+f));
  return{have:null,opt:free>=0?cat.find(o=>o.key===`plot:${free}:${f}`):null,busy:!!pend,noPlot:free<0};
}
function deptNext(id,k){
  const d=G(id).depts[k],fac=deptFacility(id,k),out=[];
  if(fac&&fac.busy)out.push('Building work under way');else if(fac&&fac.opt)out.push(`${fac.have?'Upgrade':'Build'} ${COMPLEX[DEPT[k].fac].n.toLowerCase()}: £${fac.opt.cost}k`);
  else if(fac&&fac.noPlot&&!fac.have)out.push('No free plot for a building');
  if(d.hiring)out.push(`Recruiting: ${d.hiring.left} wk`);else if(d.staff<5)out.push(`More staff: +£${n0((deptWeekCost(id,k,d.staff+1)-deptWeekCost(id,k))*1000)}/wk`);
  return out.join(' · ');
}
function deptsView(){
  const id=S.my,g=G(id),total=deptCost(id);
  return`<div class="panel"><div class="row"><span>Departments</span><b>£${n0(total*1000)} a week</b></div><p class="small muted">People, budget and a way of working. Each one changes something real on the pitch or in the books; tap one to manage it.</p></div>
  <div class="stack">${Object.keys(DEPT).map(k=>{const d=g.depts[k],kp=deptKpi(id,k);return`<button class="dept" data-act="dept" data-arg="${k}">
    <span class="dh"><b>${DEPT[k].n}</b>${dots(d.staff)}</span>
    <span class="small">${esc(kp.label)}: <b class="${kp.good===true?'up':kp.good===false?'down':''}">${esc(kp.text)}</b></span>
    <span class="small muted">${STAFF_WORD[d.staff]} · ${d.budget} budget · ${d.pending||d.course}${d.hiring?' · recruiting':''}</span>
    <span class="small next">${esc(deptNext(id,k))}</span></button>`}).join('')}</div>`;
}
/* Operational visibility uses only persisted game state; there is no invented shortlist or youth team. */
function departmentPipeline(k){
 const id=S.my,dept=G(id).depts[k],st=S.stats[id];
 if(k==='scouting'){
  const director=tdOf(id),recent=S.ev.filter(e=>e.c===id&&['Transfer','Signing'].includes(e.t)).slice(-6).reverse();
  const history=(st.scoutHistory||[]).slice(-4).reverse();
  const reach=Math.max(4,6+Math.round(2*groundSignals(id).scouting+(pq(director)-10)/2));
  return`<div class="panel"><p class="eyebrow">Scouting desk</p>
  <div class="row small"><span>Recruitment lead</span><b>${esc(director.name)} (director)</b></div>
  <div class="row small"><span>Scouting team</span><b>Level ${dept.staff}/5</b></div>
  <div class="row small"><span>Department focus</span><b>${esc(dept.pending||dept.course)}</b></div>
  <div class="row small"><span>Search reach</span><b>Up to ${reach} candidates per search</b></div>
  <p class="small muted">The director runs recruitment searches automatically during transfer windows. Department staffing, facilities and the director affect search reach. Individual scouts are not yet represented as people.</p>
  <p class="eyebrow">Players considered in recent searches</p>
  ${history.length?history.map(h=>`<div class="panel"><p class="small"><b>Season ${h.season} · week ${h.week} · ${esc(h.pos)}</b> · ${esc(h.director)}</p><p class="small muted">Target ${h.target??"—"} · budget £${h.budget??"—"}k</p>
  ${h.candidates.length?h.candidates.map(p=>`<div class="row small"><span>${esc(p.name)} · ${p.pos} · ${esc(p.from)}</span><b>${esc(p.reason||"Seen")} · ${p.estimate??p.quality??"—"}</b></div>`).join('') :'<p class="small muted">No candidates in this search.</p>'}<p class="small"><b>TD decision:</b> ${esc(h.decision?.name||h.decision?.reason||'Search only — no decision recorded')}</p></div>`).join(''):'<p class="small muted">No recorded searches yet. The next recruitment window will start a search when the director needs players. Older saves cannot reconstruct past candidate lists.</p>'}
  <p class="eyebrow">Completed signings</p>${recent.length?recent.map(e=>`<p class="small">${esc(e.text)}</p>`).join(''):'<p class="small muted">No completed signings recorded yet.</p>'}
  <button class="btn ghost" data-act="ctab" data-arg="football">Review the director</button></div>`;
 }
 if(k==='academy')return youthPanels();
 return'';
}
function deptSheet(k){
  const id=S.my,d=G(id).depts[k],D=DEPT[k],kp=deptKpi(id,k),fac=deptFacility(id,k);
  const staffSeg=`<div class="seg seg5">${[1,2,3,4,5].map(n=>`<button class="${(d.hiring?d.hiring.to:d.staff)===n?'on':''}" data-act="dstaff" data-arg="${k}:${n}" aria-pressed="${d.staff===n}" ${d.hiring?'disabled':''}>${n} · £${n0(deptWeekCost(id,k,n)*1000)}</button>`).join('')}</div>`;
  let facHtml='';
  if(fac){const opt=fac.opt;facHtml=`<div class="panel"><p class="eyebrow">${COMPLEX[D.fac].n}</p>${fac.have?`<div class="grow"><span><b>${LV_NAME[fac.have.lv]}</b><br><span class="small muted">${COMPLEX[D.fac].sig}</span></span><span></span>${condBar(fac.have.cond)}</div>`:`<p class="small muted">Not built yet. Staff alone can only do so much.</p>`}
    ${fac.busy?'<p class="small">Building work under way.</p>':opt?(UI.gsel===opt.key?`<div class="opt on"><b>${esc(opt.label)}</b><span class="small">${opt.weeks} weeks${opt.permit?' + permit':''} · paid week by week</span><div class="offers">${Object.entries(OFFER).map(([ok,of])=>`<button class="offer" data-act="gbuild" data-arg="${opt.key}|${ok}"><b>£${Math.round(opt.cost*of.p)}k</b><span>${of.n}</span><span class="muted">${Math.round(of.over*100)}% overrun risk</span></button>`).join('')}</div><button class="tbtn" data-act="gsel" data-arg="">Cancel</button></div>`:`<button class="opt" data-act="gsel" data-arg="${opt.key}"><b>${esc(opt.label)}</b><span class="small muted">£${opt.cost}k · ${opt.weeks} weeks</span></button>`):fac.noPlot?'<p class="small muted">All six plots are in use.</p>':''}</div>`}
  return overlayShell(D.n,`<p class="muted">${esc(D.does)}</p>${departmentPipeline(k)}
  <div class="panel"><p class="small">${esc(kp.label)}</p><b class="${kp.good===true?'up':kp.good===false?'down':''}">${esc(kp.text)}</b></div>
  ${facHtml}
  <div class="panel"><p class="eyebrow">Staff · ${STAFF_WORD[d.staff]}</p><p class="small muted">Hiring takes ${HIRE_WEEKS} weeks and a fee of two weeks' wages. Cutting costs four weeks' severance.</p>${staffSeg}${d.hiring?`<p class="small">Recruiting to ${STAFF_WORD[d.hiring.to].toLowerCase()}: ${d.hiring.left} week${d.hiring.left>1?'s':''} to go.</p>`:''}${deptStaffImpact(id,k)}</div>
  <div class="panel"><p class="eyebrow">Budget</p><p class="small muted">Equipment, travel and upkeep. It scales the whole department.</p><div class="seg">${Object.keys(BUDGET_F).map(b=>`<button class="${d.budget===b?'on':''}" data-act="gdept" data-arg="${k}:${b}" aria-pressed="${d.budget===b}">${b[0].toUpperCase()+b.slice(1)} · £${n0(deptWeekCost(id,k,null,b)*1000)}</button>`).join('')}</div>${deptBudgetImpact(id,k)}</div>
  <div class="panel"><p class="eyebrow">Way of working</p><p class="small muted">A new course takes a season to settle in.</p><div class="stack">${D.courses.map(c=>`<button class="opt ${(d.pending||d.course)===c?'on':''}" data-act="gcourse" data-arg="${k}:${c}" aria-pressed="${(d.pending||d.course)===c}"><b>${c[0].toUpperCase()+c.slice(1)}</b><span class="small muted">${esc(D.cd[c])}</span></button>`).join('')}</div>${d.pending?`<p class="small muted">Switching to ${d.pending}: ${d.settle} weeks to settle.</p>`:''}${deptCourseImpact()}</div>`);
}

