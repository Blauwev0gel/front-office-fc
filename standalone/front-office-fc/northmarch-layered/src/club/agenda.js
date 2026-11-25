/* ================= The weekly agenda: your people bring you what matters =================
   Each week up to three items from the club's staff, drawn from the real state of the club.
   Every option is an existing command; "leave it" is always allowed and never punished.
   A few weeks after a choice, the agenda reports what changed (a measured before/after, never an invented verdict).
   Owns S.agenda (the player's club only): {log:[{theme,s,w,choice,label,before,metric}], seen:{theme:weekIndex}}.
   No DOM. Old saves start with an empty agenda. */
const AGENDA_COOLDOWN=6,AGENDA_FOLLOWUP=4;
function AG(){if(!S.agenda)S.agenda={log:[],seen:{}};return S.agenda}
const agWeek=()=>S.season*100+S.week;
function agInjured(id){return S.squads[id].filter(p=>p.inj>0).length}
function agFill(id){return Math.round(attendance(id,null,{}).fill*100)}
function agWorst(id){return repairList(id).sort((a,b)=>a.cond-b.cond)[0]||null}
function agWeekCost(id,d,staff){const k=deptWeekCost(id,d,staff)-deptWeekCost(id,d);return k<1?'£'+Math.round(k*1000).toLocaleString('en-GB'):'£'+r1(k)+'k'}

/* the metric each theme is judged on afterwards */
const AG_METRIC={
  medical:{label:'players injured',get:id=>agInjured(id),better:-1},
  repair:{label:'condition (%)',get:(id,ref)=>{const r=ref&&repairList(id).find(x=>x.key===ref);if(ref)return r?Math.round(r.cond):100;const w=agWorst(id);return w?Math.round(w.cond):100},better:1},
  prices:{label:'expected crowd (% full)',get:id=>agFill(id),better:0},
  sponsor:{label:'sponsor income per week (£k)',get:id=>r1(sponsorWeekK(id)),better:1},
  training:{label:'average quality of the young players',get:id=>{const k=S.squads[id].filter(p=>p.age<=21);return k.length?r1(k.reduce((a,p)=>a+p.q,0)/k.length):0},better:1},
  wages:{label:'players in the squad',get:id=>S.squads[id].filter(p=>!p.loan).length,better:1}
};

function agendaItems(id){
  if(!S||id!==S.my||S.phase!=='season')return[];const A=AG(),now=agWeek(),out=[],cool=t=>A.seen[t]&&now-A.seen[t]<AGENDA_COOLDOWN;
  const g=G(id),f=F(id);
  /* 1. medical: an injury crisis */
  const inj=agInjured(id),med=g.depts.medical;
  if(!cool('medical')&&inj>=2&&!med.hiring){const o=[];
    if(med.staff<5)o.push({label:'Hire another physio',sub:`+${agWeekCost(id,'medical',med.staff+1)} a week · ready in ${HIRE_WEEKS} weeks`,cmd:'SetDeptStaff',args:{dept:'medical',level:med.staff+1}});
    if(med.budget!=='generous')o.push({label:'Give medical a generous budget',sub:'Works at once; costs about 30% more for the department',cmd:'SetDeptBudget',args:{dept:'medical',level:'generous'}});
    if(o.length)out.push({theme:'medical',lv:inj>=4?3:2,from:'Head of medical',text:`${inj} players are injured. We can treat them faster with more hands or more money.`,opts:o});}
  /* 2. repair: part of the ground is wearing out */
  const w=agWorst(id);
  if(!cool('repair')&&w&&w.cond<60)out.push({theme:'repair',ref:w.key,lv:w.cond<30?3:w.cond<45?2:1,from:'Grounds manager',text:`${w.label} is down to ${Math.round(w.cond)}%. Repairs cost more the longer we wait, and below 30% the inspectors can close part of it.`,
    opts:[{label:`Repair it now`,sub:`£${w.cost}k, done straight away`,cmd:'Repair',args:{key:w.key}}]});
  /* 3. prices: an empty or a full ground */
  if(!cool('prices')&&S.week>=2){const fill=agFill(id),pr=f.prices;
    if(fill<65)out.push({theme:'prices',lv:1,from:'Ticket office',text:`The ground is only ${fill}% full. A cheaper ticket would bring more people in.`,opts:[{label:'Cut terrace and seat prices by £1',sub:`Terrace £${pr.terrace-1}, seats £${pr.seated-1}`,multi:[['SetPrice',{kind:'terrace',delta:-1}],['SetPrice',{kind:'seated',delta:-1}]]}]});
    else if(fill>=92)out.push({theme:'prices',lv:1,from:'Ticket office',text:`The ground is ${fill}% full. Fans would still come at a higher price.`,opts:[{label:'Raise terrace and seat prices by £1',sub:`Terrace £${pr.terrace+1}, seats £${pr.seated+1}`,multi:[['SetPrice',{kind:'terrace',delta:1}],['SetPrice',{kind:'seated',delta:1}]]}]});}
  /* 4. sponsor: offers on the table and no main sponsor */
  const offers=(f.offers||[]).map((o,i)=>({o,i})).filter(x=>x.o.kind!=='naming');
  if(!cool('sponsor')&&offers.length&&!f.sponsor)out.push({theme:'sponsor',lv:2,from:'Commercial manager',text:`We have no main sponsor. ${offers.length} companies want the shirt.`,
    opts:offers.slice(0,2).map(({o,i})=>({label:`Sign ${o.name}`,sub:`£${r2(o.perWeek)}k a week · ${o.years} season${o.years>1?'s':''}${o.kind==='bonus'?' · plus a bonus per point':''}`,cmd:'SignSponsor',args:{i}}))});
  /* 5. coach: young players with room to grow and a thin coaching staff */
  const kids=S.squads[id].filter(p=>p.age<=21&&!p.loan&&p.pa>p.q+1),tr=g.depts.training;
  if(!cool('training')&&S.week>=3&&kids.length>=3&&tr.staff<5&&!tr.hiring)out.push({theme:'training',lv:1,from:'Head coach',text:`${kids.length} young players could still grow a lot. More coaches would speed that up.`,
    opts:[{label:'Hire another coach',sub:`+${agWeekCost(id,'training',tr.staff+1)} a week · ready in ${HIRE_WEEKS} weeks`,cmd:'SetDeptStaff',args:{dept:'training',level:tr.staff+1}}]});
  /* 6. director: a gap in the squad and no room in the wage limit */
  const holes=typeof openNeeds==='function'&&S.ops?openNeeds().filter(n=>n.kind==='hole'||n.kind==='leaving').length:0,room=wageCapK(id)-wageBillK(id),wr=wageRatio(id);
  if(!cool('wages')&&holes&&room<1&&wr<1.05)out.push({theme:'wages',lv:2,from:'Director of football',text:`The squad has ${holes} gap${holes>1?'s':''}, but the wage limit is full. I cannot add a player without more room.`,
    opts:[{label:'Raise the wage limit by 5% of income',sub:`From ${Math.round(wr*100)}% to ${Math.round(Math.min(1.05,wr+.05)*100)}% of expected income`,cmd:'SetSquadPolicy',args:{wageR:r2(Math.min(1.05,wr+.05))}}]});
  return out.sort((a,b)=>b.lv-a.lv).slice(0,3);
}
/* the player answers: i = option index, or -1 to leave it */
function agendaChoose(id,theme,i){
  const it=agendaItems(id).find(x=>x.theme===theme);if(!it)return{ok:false,err:'That has already been dealt with'};
  const A=AG(),m=AG_METRIC[theme];A.seen[theme]=agWeek();
  if(i<0){const ref=it.ref||null;A.log.push({theme,s:S.season,w:S.week,choice:'left',label:'Left it',ref,before:m.get(id,ref)});A.log=A.log.slice(-20);return{ok:true,left:true}}
  const o=it.opts[i];if(!o)return{ok:false,err:'Unknown option'};const before=m.get(id,it.ref||null);
  for(const [c,a] of o.multi||[[o.cmd,o.args]]){const r=cmd(c,id,a);if(r&&r.ok===false)return r}
  const ref=it.ref||null;A.log.push({theme,s:S.season,w:S.week,choice:'acted',label:o.label,ref,before});A.log=A.log.slice(-20);
  return{ok:true,label:o.label};
}
/* reports on choices made AGENDA_FOLLOWUP weeks ago (or more, within the season) */
function agendaFollowups(id){
  if(!S||!S.agenda||id!==S.my)return[];
  return S.agenda.log.filter(e=>!e.reported&&e.s===S.season&&S.week-e.w>=AGENDA_FOLLOWUP).map(e=>{const m=AG_METRIC[e.theme],now=m.get(id,e.ref);return{e,now,label:(e.ref&&e.theme==='repair'?(repairList(id).find(x=>x.key===e.ref)||{label:'The repaired part'}).label+': ':'')+m.label,good:m.better===0?null:(now-e.before)*m.better>0}});
}
function agendaMarkReported(id){for(const x of agendaFollowups(id))x.e.reported=true}
