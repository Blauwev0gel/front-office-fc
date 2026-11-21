/* ================= Club: the ground, the complex, departments and building projects =================
   From voorzitter-fundering club/ground.js (tested there: ground-test). Adapted from one club (S.cf.ground) to
   every club (S.grounds[id]). Owns only S.grounds. Payments are booked by finance.js; football reads the signals
   (training, medical, academy, scouting, atmosphere, pitch), so building here changes results on the pitch. */
const LV_NAME=['—','Bare','Basic','Fair','Solid','Good','Strong','Elite','Landmark'];
const SIDE_NAME={N:'North End',E:'East Stand',S:'South End',W:'Main Stand'};
const RING={terrace:400,seated:300};
const FAC={
  lights:{n:'Floodlights',c:10,w:3,sig:'Evening games and atmosphere'},
  catering:{n:'Catering kiosks',c:8,w:4,sig:'Food and drink per fan'},
  business:{n:'Business club',c:20,w:8,sig:'Business seats'},
  media:{n:'Press and media',c:6,w:3,sig:'Sponsor appeal'},
  safety:{n:'Safety and control room',c:10,w:4,sig:'Licensed capacity'},
  access:{n:'Turnstiles and access',c:8,w:4,sig:'Licensed capacity'},
  screen:{n:'Scoreboard and screens',c:6,w:3,sig:'Comfort'}
};
const COMPLEX={
  training:{n:'Training ground',c:15,w:8,dept:'training',sig:'Players develop faster and fade slower'},
  medical:{n:'Medical centre',c:40,w:20,dept:'training',sig:'Fewer and shorter injuries'},
  academy:{n:'Academy',c:50,w:26,dept:'academy',sig:'More and better academy graduates'},
  scouting:{n:'Scouting office',c:20,w:10,dept:'scouting',sig:'The director sees more players'},
  commercial:{n:'Club shop and events hall',c:25,w:12,dept:'commercial',sig:'Merchandise and events'},
  clubhouse:{n:'Clubhouse',c:20,w:10,dept:'community',sig:'Members, dues and a growing support'},
  parking:{n:'Car park',c:12,w:6,dept:'matchday',sig:'Easier access for fans'}
};
const DEPT={
  matchday:{n:'Matchday',courses:['atmosphere','comfort']},
  training:{n:'Training & medical',courses:['development','fitness']},
  academy:{n:'Academy',courses:['local','broad']},
  scouting:{n:'Scouting',courses:['domestic','abroad']},
  commercial:{n:'Commercial',courses:['local','premium']},
  community:{n:'Community',courses:['members','events']}
};
const BUDGET_F={tight:.7,normal:1,generous:1.3};
const DEPT_COST=[.35,.22,.12]; // £k per department per week at a normal budget, by division
const OFFER={cheap:{n:'Cheap builder',p:.85,over:.35,delay:.3},standard:{n:'Standard builder',p:1,over:.15,delay:.15},premium:{n:'Premium builder',p:1.2,over:.05,delay:.05}};
const lvCost=(base,lv)=>Math.round(base*Math.pow(1.6,lv-1));

function groundInit(id){
  const c=CL(id),cap=Math.round(c.support*(1.15+rnd()*.4)/100)*100,am=c.tier===2,pro=c.tier===0;
  const side=(type,share)=>({type,rings:Math.max(1,Math.round(cap*share/RING[type])),roof:type==='seated'?2:am?0:1,cond:ri(55,85)});
  const g={sides:{N:side('terrace',.3),E:side(am?'terrace':'seated',.25),S:side('terrace',.25),W:side('seated',.2)},
    pitch:{lv:am?2:pro?4:3,cond:ri(60,85),drain:am?1:2,heat:false},fac:{},plots:[],depts:{},projects:[],next:1,repairBill:0};
  for(const k in FAC)g.fac[k]={lv:k==='business'?(am?1:pro?3:2):am?2:(k==='access'||k==='safety')?(pro?5:4):pro?4:3,cond:ri(55,85)};
  const start=am?['training','clubhouse','parking']:pro?['training','clubhouse','parking','commercial','medical']:['training','clubhouse','parking','commercial'];
  for(let i=0;i<6;i++)g.plots.push(start[i]?{kind:start[i],lv:start[i]==='training'?(pro?3:2):1,cond:ri(55,85)}:{kind:null});
  for(const k in DEPT)g.depts[k]={budget:'normal',course:DEPT[k].courses[0],pending:null,settle:0};
  return g;
}
function G(id){return S.grounds[id]}
function gLog(id,t,type){emit(type||'Ground',id,t)}
function groundCourse(id,d){const x=G(id).depts[d];return x.pending?null:x.course}

/* ----- signals (what football and finance read) ----- */
function sideCap(s,closedFrac=0){return Math.round(s.rings*RING[s.type]*(s.cond<30?.5:1)*(1-closedFrac))}
function building(id,key){return G(id).projects.find(p=>p.target===key&&p.phase!=='done')}
function groundSignals(id){
  const g=G(id),eff=(o,dept)=>o.lv*(.5+.5*o.cond/100)*(dept?BUDGET_F[g.depts[dept].budget]:1);
  const cap={terrace:0,seated:0};
  for(const k in g.sides){const s=g.sides[k],pr=building(id,'side:'+k);cap[s.type]+=sideCap(s,pr&&pr.phase==='build'?.3:0)}
  const business=Math.round(40*eff(g.fac.business)+(g.sides.W.type==='seated'?0:-40));
  const raw=cap.terrace+cap.seated,limit=1400+g.fac.access.lv*700+g.fac.safety.lv*500;
  const licensed=Math.min(raw,limit);
  const has=k=>g.plots.find(p=>p.kind===k);const lvOf=k=>{const p=has(k);return p?eff(p,COMPLEX[k].dept):0};
  const course=(d,c)=>g.depts[d].course===c&&!g.depts[d].pending?1.15:1;
  const roofs=Object.values(g.sides).reduce((a,s)=>a+s.roof,0);
  return{
    capacity:licensed,capTerrace:Math.round(cap.terrace*licensed/Math.max(1,raw)),capSeated:Math.round(cap.seated*licensed/Math.max(1,raw)),
    business:Math.max(0,business),limitedBy:raw>limit?(g.fac.access.lv<=g.fac.safety.lv?'access':'safety'):null,
    atmosphere:r1((cap.terrace/Math.max(1,raw)*6+roofs*.4+eff(g.fac.lights)*.15+(has('clubhouse')&&has('commercial')&&cap.terrace>0?1:0))*course('matchday','atmosphere')),
    comfort:r1((cap.seated/Math.max(1,raw)*4+roofs*.5+eff(g.fac.screen)*.3+eff(g.fac.catering)*.3)*course('matchday','comfort')),
    pitch:r1(eff(g.pitch,'matchday')),
    training:r1(lvOf('training')*course('training','development')),
    medical:r1(lvOf('medical')*course('training','fitness')),
    hasTM:!!(has('training')&&has('medical')),
    academy:r1((lvOf('academy')+(has('academy')&&has('training')?1:0))*course('academy','local')),
    scouting:r1(lvOf('scouting')*course('scouting','abroad')),
    shop:r1(lvOf('commercial')*course('commercial','premium')),
    community:r1(lvOf('clubhouse')*course('community','members')),
    access:r1(lvOf('parking')),media:r1(eff(g.fac.media)),
    catering:eff(g.fac.catering)
  };
}

/* ----- what can be built ----- */
function projectCatalog(id){
  const g=G(id),out=[],sg=groundSignals(id),raw=Object.values(g.sides).reduce((a,s)=>a+sideCap(s),0),capped=raw>=1400+g.fac.access.lv*700+g.fac.safety.lv*500;
  for(const k in g.sides){const s=g.sides[k];
    out.push({key:'side:'+k+':ring',target:'side:'+k,group:'Stadium',label:`${SIDE_NAME[k]}: add a ring`,cost:s.type==='terrace'?45:60,weeks:s.type==='terrace'?14:16,permit:true,effect:`+${RING[s.type]} ${s.type==='terrace'?'standing places':'seats'}`+(capped?` · licence stays at ${sg.capacity} until turnstiles or safety improve`:'')});
    if(s.roof<2)out.push({key:'side:'+k+':roof',target:'side:'+k,group:'Stadium',label:`${SIDE_NAME[k]}: ${s.roof?'full':'part'} roof`,cost:30,weeks:10,permit:true,effect:'More comfort and atmosphere'});
    out.push({key:'side:'+k+':convert',target:'side:'+k,group:'Stadium',label:`${SIDE_NAME[k]}: convert to ${s.type==='terrace'?'seats':'terrace'}`,cost:Math.round(s.rings*(s.type==='terrace'?60:45)*.6),weeks:12,permit:true,effect:s.type==='terrace'?`${s.rings*RING.seated} seats instead of ${s.rings*RING.terrace} standing; more comfort, less noise`:`${s.rings*RING.terrace} standing instead of ${s.rings*RING.seated} seats; more noise`});
  }
  if(g.pitch.lv<8)out.push({key:'pitch:lv',target:'pitch',group:'Pitch',label:`Relay the pitch (to ${LV_NAME[g.pitch.lv+1]})`,cost:lvCost(8,g.pitch.lv),weeks:4,effect:'A better surface for the home side'});
  if(g.pitch.drain<8)out.push({key:'pitch:drain',target:'pitch',group:'Pitch',label:`Drainage (to ${LV_NAME[g.pitch.drain+1]})`,cost:lvCost(6,g.pitch.drain),weeks:3,effect:'The pitch wears less after home games'});
  for(const k in FAC){const f=g.fac[k];if(f.lv<8)out.push({key:'fac:'+k,target:'fac:'+k,group:'Facilities',label:`${FAC[k].n} (to ${LV_NAME[f.lv+1]})`,cost:lvCost(FAC[k].c,f.lv),weeks:FAC[k].w,effect:FAC[k].sig})}
  g.plots.forEach((p,i)=>{
    if(!p.kind){for(const k in COMPLEX)if(!g.plots.some(q=>q.kind===k))out.push({key:'plot:'+i+':'+k,target:'plot:'+i,group:`Plot ${i+1} (empty)`,label:`Build: ${COMPLEX[k].n}`,cost:COMPLEX[k].c,weeks:COMPLEX[k].w,permit:true,effect:COMPLEX[k].sig})}
    else if(p.lv<8)out.push({key:'plot:'+i+':up',target:'plot:'+i,group:'Club complex',label:`${COMPLEX[p.kind].n} (to ${LV_NAME[p.lv+1]})`,cost:lvCost(COMPLEX[p.kind].c,p.lv+1),weeks:Math.round(COMPLEX[p.kind].w*.7),effect:COMPLEX[p.kind].sig});
  });
  for(const o of out)o.busy=!!building(id,o.target);
  return out;
}
function startProject(id,key,offer){
  const o=projectCatalog(id).find(x=>x.key===key),of=OFFER[offer||'standard'];if(!o||o.busy)return null;
  const g=G(id),over=chance(of.over)?ri(10,30):0,delay=chance(of.delay)?ri(2,6):0;
  const p={id:g.next++,key,target:o.target,label:o.label,offer:offer||'standard',cost:Math.round(o.cost*of.p),over,delay,
    phase:o.permit?'permit':'build',left:o.permit?ri(2,5):o.weeks,weeks:o.weeks,paid:0,started:[S.season,S.week]};
  g.projects.push(p);gLog(id,`Started: ${o.label} with the ${of.n.toLowerCase()} (£${p.cost}k, ${o.weeks} weeks${o.permit?' after the permit':''}).`,'ProjectStarted');
  return p;
}
function finishProject(id,p){
  const g=G(id),[kind,a,b]=p.key.split(':');
  if(kind==='side'){const s=g.sides[a];if(b==='ring')s.rings++;else if(b==='roof')s.roof++;else{s.type=s.type==='terrace'?'seated':'terrace';s.rings=Math.max(1,Math.round(s.rings*(s.type==='seated'?RING.terrace/RING.seated:RING.seated/RING.terrace)*.75))}s.cond=100}
  else if(kind==='pitch'){if(a==='lv'){g.pitch.lv++;g.pitch.cond=100}else if(a==='drain')g.pitch.drain++}
  else if(kind==='fac'){g.fac[a].lv++;g.fac[a].cond=100}
  else if(kind==='plot'){const pl=g.plots[+a];if(b==='up')pl.lv++;else{pl.kind=b;pl.lv=1}pl.cond=100}
  p.phase='done';p.done=[S.season,S.week];
  gLog(id,`Finished: ${p.label}.${p.over?` It ran ${p.over}% over budget.`:''}${p.delay?` ${p.delay} weeks late.`:''}`,'ProjectCompleted');
  g.projects=g.projects.filter(x=>x.phase!=='done'||x===p).slice(-12);
}
/* weekly: building progress (returns this week's construction bill) and wear against the department budget */
function groundWeek(id,home){
  const g=G(id);let construction=0;
  for(const p of g.projects.filter(x=>x.phase!=='done')){
    if(p.phase==='permit'){if(--p.left<=0){if(chance(.12)){p.left=ri(2,4);gLog(id,`Neighbours object to ${p.label.toLowerCase()}. The permit takes longer.`)}else{p.phase='build';p.left=p.weeks+p.delay;gLog(id,`Permit granted: ${p.label}. Building starts.`)}}continue}
    const total=Math.round(p.cost*(1+p.over/100)),pay=r1(Math.min(total-p.paid,total/(p.weeks+p.delay)));
    construction+=pay;p.paid=r1(p.paid+pay);
    if(p.over&&p.left===Math.ceil((p.weeks+p.delay)/2))gLog(id,`${p.label}: the builder reports an overrun of ${p.over}%.`);
    if(--p.left<=0){if(p.paid<total){construction+=r1(total-p.paid);p.paid=total}finishProject(id,p)}
  }
  const rec=d=>({tight:.15,normal:.42,generous:.7})[g.depts[d].budget];
  for(const k in g.sides){const s=g.sides[k];s.cond=clamp(s.cond-.45+rec('matchday'),0,100)}
  for(const k in g.fac){const f=g.fac[k];f.cond=clamp(f.cond-.42+rec('matchday'),0,100)}
  for(const p of g.plots)if(p.kind)p.cond=clamp(p.cond-.42+rec(COMPLEX[p.kind].dept),0,100);
  g.pitch.cond=clamp(g.pitch.cond+(home?-(4-g.pitch.drain*.3):0)+1.2+rec('matchday'),0,100);
  for(const k in g.depts){const d=g.depts[k];if(d.pending&&--d.settle<=0){d.course=d.pending;d.pending=null;gLog(id,`${DEPT[k].n} now works the new way: ${d.course}.`)}}
  return r1(construction);
}
function groundSeasonEnd(id){
  const g=G(id);
  for(const k in g.sides){const s=g.sides[k];if(s.cond<30)gLog(id,`Safety inspection: the ${SIDE_NAME[k]} is in poor shape (${Math.round(s.cond)}%). Half of it stays closed until repaired.`,'SafetyClosure')}
}
function repairCost(o,base){return Math.max(1,Math.round(base*(100-o.cond)/100*.6))}
function repairList(id){
  const g=G(id),out=[];
  for(const k in g.sides){const s=g.sides[k];if(s.cond<90)out.push({key:'side:'+k,label:SIDE_NAME[k],cond:s.cond,cost:repairCost(s,s.rings*(s.type==='terrace'?45:60))})}
  for(const k in g.fac){const f=g.fac[k];if(f.cond<90)out.push({key:'fac:'+k,label:FAC[k].n,cond:f.cond,cost:repairCost(f,lvCost(FAC[k].c,f.lv)*2)})}
  g.plots.forEach((p,i)=>{if(p.kind&&p.cond<90)out.push({key:'plot:'+i,label:COMPLEX[p.kind].n,cond:p.cond,cost:repairCost(p,lvCost(COMPLEX[p.kind].c,p.lv)*2)})});
  return out.sort((a,b)=>a.cond-b.cond);
}
function repair(id,key){
  const r=repairList(id).find(x=>x.key===key);if(!r)return null;const g=G(id),[kind,a]=key.split(':');
  const o=kind==='side'?g.sides[a]:kind==='fac'?g.fac[a]:g.plots[+a];o.cond=100;
  g.repairBill=r1((g.repairBill||0)+r.cost);gLog(id,`Repaired: ${r.label} (£${r.cost}k).`);return r;
}
function deptCost(id){const g=G(id),base=DEPT_COST[CL(id).tier];let t=0;for(const k in g.depts)t+=base*BUDGET_F[g.depts[k].budget];return r2(t)}
function groundCondWorst(id){const g=G(id);const all=[...Object.entries(g.sides).map(([k,s])=>({n:SIDE_NAME[k],c:s.cond})),...Object.entries(g.fac).map(([k,f])=>({n:FAC[k].n,c:f.cond})),{n:'The pitch',c:g.pitch.cond},...g.plots.filter(p=>p.kind).map(p=>({n:COMPLEX[p.kind].n,c:p.cond}))];return all.sort((a,b)=>a.c-b.c)[0]}

/* ----- commands (player, AI clubs, later staff and story) ----- */
defCommand('StartProject',{check:(id,a)=>{const o=projectCatalog(id).find(x=>x.key===a.key);if(!o)return'Nothing to build there';if(o.busy)return'Work is already under way there';if(!OFFER[a.offer||'standard'])return'Unknown builder';
  const cost=Math.round(o.cost*OFFER[a.offer||'standard'].p);if(F(id).cash-cost<-creditLimit(id))return'The bank will not cover this';return null},run:(id,a)=>startProject(id,a.key,a.offer)});
defCommand('Repair',{check:(id,a)=>{const r=repairList(id).find(x=>x.key===a.key);if(!r)return'Nothing to repair';if(F(id).cash-r.cost<-creditLimit(id))return'The bank will not cover this';return null},run:(id,a)=>repair(id,a.key)});
defCommand('SetDeptBudget',{check:(id,a)=>!G(id).depts[a.dept]||!BUDGET_F[a.level]?'Unknown department or level':null,run:(id,a)=>{G(id).depts[a.dept].budget=a.level;if(id===S.my)gLog(id,`${DEPT[a.dept].n} budget set to ${a.level}.`)}});
defCommand('SetDeptCourse',{check:(id,a)=>!G(id).depts[a.dept]||!DEPT[a.dept].courses.includes(a.course)?'Unknown course':null,run:(id,a)=>{const x=G(id).depts[a.dept];
  if(a.course===x.course){x.pending=null;x.settle=0;return}x.pending=a.course;x.settle=SEASON_WEEKS;gLog(id,`${DEPT[a.dept].n} switches to ${a.course}. It takes a season to settle in.`)}});
