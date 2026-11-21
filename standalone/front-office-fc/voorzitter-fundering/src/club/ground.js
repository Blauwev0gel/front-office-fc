/* ================= Club foundation: the ground (layer 1, clubbeheer) =================
   Stadium (four sides, pitch, facilities), the club complex (6 plots), six departments and building projects.
   Owns only S.cf.ground. Money goes through finance.js (groundCosts). Design: standalone-research/LAAG1-CLUBBEHEER-VOORZITTER.md */
const LV_NAME=['—','Bare','Basic','Fair','Solid','Good','Strong','Elite','Landmark'];
const SIDE_NAME={N:'North End',E:'East Stand',S:'South End',W:'Main Stand'};
const RING={terrace:400,seated:300};
const FAC={ // stadium facilities: base cost £k for level 1→2, signal
  lights:{n:'Floodlights',c:10,w:3,sig:'Evening and TV games'},
  catering:{n:'Catering kiosks',c:8,w:4,sig:'Food and drink per fan'},
  business:{n:'Business club',c:20,w:8,sig:'Business seats'},
  media:{n:'Press and media',c:6,w:3,sig:'TV attention, licence'},
  safety:{n:'Safety and control room',c:10,w:4,sig:'Licensed capacity'},
  access:{n:'Turnstiles and access',c:8,w:4,sig:'Licensed capacity'},
  screen:{n:'Scoreboard and screens',c:6,w:3,sig:'Comfort, board revenue'}
};
const COMPLEX={ // club complex on the 6 plots
  training:{n:'Training ground',c:15,w:8,dept:'training',sig:'Training level'},
  medical:{n:'Medical centre',c:40,w:20,dept:'training',sig:'Fewer and shorter injuries'},
  academy:{n:'Academy',c:50,w:26,dept:'academy',sig:'Academy level'},
  scouting:{n:'Scouting office',c:20,w:10,dept:'scouting',sig:'Scouting reach'},
  commercial:{n:'Club shop and events hall',c:25,w:12,dept:'commercial',sig:'Merchandise and events'},
  clubhouse:{n:'Clubhouse',c:20,w:10,dept:'community',sig:'Members and community'},
  parking:{n:'Car park',c:12,w:6,dept:'matchday',sig:'More fans, but nuisance'}
};
const DEPT={
  matchday:{n:'Matchday',courses:['atmosphere','comfort']},
  training:{n:'Training & medical',courses:['fitness','development']},
  academy:{n:'Academy',courses:['local','broad']},
  scouting:{n:'Scouting',courses:['domestic','abroad']},
  commercial:{n:'Commercial',courses:['local','premium']},
  community:{n:'Community',courses:['members','events']}
};
const BUDGET_F={tight:.7,normal:1,generous:1.3};
const OFFER={cheap:{n:'Cheap builder',p:.85,over:.35,delay:.3},standard:{n:'Standard builder',p:1,over:.15,delay:.15},premium:{n:'Premium builder',p:1.2,over:.05,delay:.05}};
const gChance=p=>rnd()<p;
const lvCost=(base,lv)=>Math.round(base*Math.pow(1.6,lv-1));

function groundInit(){
  const c=S.clubs[S.cf.club],cap=c.capacity||3000,amateur=c.tier===1,h=hrng('ground'+c.id),ri=(a,b)=>a+Math.floor(h()*(b-a+1));
  const side=(type,share)=>({type,rings:Math.max(1,Math.round(cap*share/RING[type])),roof:type==='seated'?2:amateur?0:1,cond:ri(55,85)});
  const g={sides:{N:side('terrace',.3),E:side(amateur?'terrace':'seated',.25),S:side('terrace',.25),W:side('seated',.2)},
    pitch:{lv:amateur?2:3,cond:ri(60,85),drain:amateur?1:2,heat:false},
    fac:{},plots:[],depts:{},projects:[],log:[],next:1};
  for(const k in FAC)g.fac[k]={lv:k==='business'?(amateur?1:2):amateur?2:(k==='access'||k==='safety')?4:3,cond:ri(55,85)};
  const start=amateur?['training','clubhouse','parking']:['training','clubhouse','parking','commercial'];
  for(let i=0;i<6;i++)g.plots.push(start[i]?{kind:start[i],lv:start[i]==='training'?2:1,cond:ri(55,85)}:{kind:null});
  for(const k in DEPT)g.depts[k]={budget:'normal',course:DEPT[k].courses[0],pending:null,settle:0};
  return g;
}
function G(){if(!S.cf.ground)S.cf.ground=groundInit();return S.cf.ground}
function gLog(t){const g=G();g.log.unshift({s:S.season,w:S.week||0,t});g.log.length=Math.min(g.log.length,40);cfEv('ground',t)}

/* ----- signals (what other layers read) ----- */
function sideCap(s,closedFrac=0){return Math.round(s.rings*RING[s.type]*(s.cond<30?.5:1)*(1-closedFrac))}
function building(key){return G().projects.find(p=>p.target===key&&p.phase!=='done')}
function groundSignals(){
  const g=G(),eff=(o,dept)=>o.lv*(.5+.5*o.cond/100)*(dept?BUDGET_F[g.depts[dept].budget]:1);
  const cap={terrace:0,seated:0};
  for(const k in g.sides){const s=g.sides[k],pr=building('side:'+k);cap[s.type]+=sideCap(s,pr&&pr.phase==='build'&&!pr.summer?.3:0)}
  const business=Math.round(40*eff(g.fac.business)+(g.sides.W.type==='seated'?0:-40));
  const raw=cap.terrace+cap.seated,limit=1400+g.fac.access.lv*700+g.fac.safety.lv*500;
  const licensed=Math.min(raw,limit);
  const has=k=>g.plots.find(p=>p.kind===k);const lvOf=k=>{const p=has(k);return p?eff(p,COMPLEX[k].dept):0};
  const course=(d,c)=>g.depts[d].course===c&&!g.depts[d].pending?1.15:1;
  const roofs=Object.values(g.sides).reduce((a,s)=>a+s.roof,0);
  const sig={
    capacity:licensed,capTerrace:Math.round(cap.terrace*licensed/Math.max(1,raw)),capSeated:Math.round(cap.seated*licensed/Math.max(1,raw)),
    business:Math.max(0,business),limitedBy:raw>limit?(g.fac.access.lv<=g.fac.safety.lv?'access':'safety'):null,
    atmosphere:Math.round((cap.terrace/Math.max(1,raw)*6+roofs*.4+(has('clubhouse')&&has('commercial')&&cap.terrace>0?1:0))*course('matchday','atmosphere')*10)/10,
    comfort:Math.round((cap.seated/Math.max(1,raw)*4+roofs*.5+eff(g.fac.screen)*.3+eff(g.fac.catering)*.3)*course('matchday','comfort')*10)/10,
    pitch:Math.round(eff(g.pitch,'matchday')*10)/10,
    training:Math.round(lvOf('training')*course('training','development')*10)/10,
    medical:Math.round(lvOf('medical')*10)/10,
    injuryRisk:Math.round((1-(has('training')&&has('medical')?.15:0)-lvOf('medical')*.04-(course('training','fitness')>1?.05:0))*100)/100,
    academy:Math.round((lvOf('academy')+(has('academy')&&has('training')?1:0))*course('academy','local')*10)/10,
    scouting:Math.round(lvOf('scouting')*course('scouting','abroad')*10)/10,
    shop:Math.round(lvOf('commercial')*course('commercial','premium')*10)/10,
    community:Math.round(lvOf('clubhouse')*course('community','members')*10)/10,
    access:Math.round(lvOf('parking')*10)/10,nuisance:Math.round((lvOf('parking')+cap.terrace/1500)*10)/10,
    catering:eff(g.fac.catering),tvReady:g.fac.lights.lv>=4
  };
  return sig;
}

/* ----- what can be built (layer 1 actions), with a forecast ----- */
function projectCatalog(){
  const g=G(),out=[],sg=groundSignals(),raw=Object.values(g.sides).reduce((a,s)=>a+sideCap(s),0),capped=raw>=1400+g.fac.access.lv*700+g.fac.safety.lv*500;
  for(const k in g.sides){const s=g.sides[k];
    out.push({key:'side:'+k+':ring',target:'side:'+k,group:'Stadium',label:`${SIDE_NAME[k]}: add a ring`,cost:s.type==='terrace'?45:60,weeks:s.type==='terrace'?14:16,permit:true,effect:`+${RING[s.type]} ${s.type==='terrace'?'standing places':'seats'}`+(capped?` · ⚠ licence stays at ${sg.capacity} until turnstiles or safety improve`:'')});
    if(s.roof<2)out.push({key:'side:'+k+':roof',target:'side:'+k,group:'Stadium',label:`${SIDE_NAME[k]}: ${s.roof?'full':'part'} roof`,cost:30,weeks:10,permit:true,effect:'More comfort and noise; rain hurts less'});
    out.push({key:'side:'+k+':convert',target:'side:'+k,group:'Stadium',label:`${SIDE_NAME[k]}: convert to ${s.type==='terrace'?'seats':'terrace'}`,cost:Math.round(s.rings*(s.type==='terrace'?60:45)*.6),weeks:12,permit:true,effect:s.type==='terrace'?`${s.rings*RING.seated} seats instead of ${s.rings*RING.terrace} standing; more comfort, less noise`:`${s.rings*RING.terrace} standing instead of ${s.rings*RING.seated} seats; more noise`});
  }
  if(g.pitch.lv<8)out.push({key:'pitch:lv',target:'pitch',group:'Pitch',label:`Relay the pitch (to ${LV_NAME[g.pitch.lv+1]})`,cost:lvCost(8,g.pitch.lv),weeks:4,effect:'Better pitch quality'});
  if(g.pitch.drain<8)out.push({key:'pitch:drain',target:'pitch',group:'Pitch',label:`Drainage (to ${LV_NAME[g.pitch.drain+1]})`,cost:lvCost(6,g.pitch.drain),weeks:3,effect:'Fewer postponed games in heavy rain'});
  if(!g.pitch.heat)out.push({key:'pitch:heat',target:'pitch',group:'Pitch',label:'Undersoil heating',cost:25,weeks:4,effect:'No more frost postponements'});
  for(const k in FAC){const f=g.fac[k];if(f.lv<8)out.push({key:'fac:'+k,target:'fac:'+k,group:'Facilities',label:`${FAC[k].n} (to ${LV_NAME[f.lv+1]})`,cost:lvCost(FAC[k].c,f.lv),weeks:FAC[k].w,effect:FAC[k].sig})}
  g.plots.forEach((p,i)=>{
    if(!p.kind){for(const k in COMPLEX)if(!g.plots.some(q=>q.kind===k))out.push({key:'plot:'+i+':'+k,target:'plot:'+i,group:`Plot ${i+1} (empty)`,label:`Build: ${COMPLEX[k].n}`,cost:COMPLEX[k].c,weeks:COMPLEX[k].w,permit:true,effect:COMPLEX[k].sig})}
    else if(p.lv<8)out.push({key:'plot:'+i+':up',target:'plot:'+i,group:'Club complex',label:`${COMPLEX[p.kind].n} (to ${LV_NAME[p.lv+1]})`,cost:lvCost(COMPLEX[p.kind].c,p.lv+1),weeks:Math.round(COMPLEX[p.kind].w*.7),effect:COMPLEX[p.kind].sig});
  });
  for(const o of out)o.busy=!!building(o.target);
  return out;
}
function startProject(key,offer){
  const o=projectCatalog().find(x=>x.key===key),of=OFFER[offer||'standard'];if(!o||o.busy)return null;
  const g=G(),over=gChance(of.over)?ri(10,30):0,delay=gChance(of.delay)?ri(2,6):0;
  const p={id:g.next++,key,target:o.target,label:o.label,offer:offer||'standard',cost:Math.round(o.cost*of.p),over,delay,
    phase:o.permit?'permit':'build',left:o.permit?ri(2,5):o.weeks,weeks:o.weeks,paid:0,summer:!S.week||S.week<=1};
  g.projects.push(p);gLog(`Started: ${o.label} with the ${of.n.toLowerCase()} (£${p.cost}k, ${o.weeks} weeks${o.permit?' after the permit':''}).`);
  return p;
}
function finishProject(p){
  const g=G(),[kind,a,b]=p.key.split(':');
  if(kind==='side'){const s=g.sides[a];if(b==='ring')s.rings++;else if(b==='roof')s.roof++;else{s.type=s.type==='terrace'?'seated':'terrace';s.rings=Math.max(1,Math.round(s.rings*(s.type==='seated'?RING.terrace/RING.seated:RING.seated/RING.terrace)*.75))}s.cond=100}
  else if(kind==='pitch'){if(a==='lv'){g.pitch.lv++;g.pitch.cond=100}else if(a==='drain')g.pitch.drain++;else g.pitch.heat=true}
  else if(kind==='fac'){g.fac[a].lv++;g.fac[a].cond=100}
  else if(kind==='plot'){const pl=g.plots[+a];if(b==='up')pl.lv++;else{pl.kind=b;pl.lv=1}pl.cond=100}
  p.phase='done';gLog(`Finished: ${p.label}.${p.over?` It ran ${p.over}% over budget.`:''}${p.delay?` ${p.delay} weeks late.`:''}`);
}
/* payments this week (read by finance) */
function groundWeek(home){
  const g=G();let construction=0;
  for(const p of g.projects.filter(x=>x.phase!=='done')){
    if(p.phase==='permit'){if(--p.left<=0){if(gChance(.12)){p.left=ri(2,4);gLog(`Neighbours object to ${p.label.toLowerCase()}. The permit takes longer.`)}else{p.phase='build';p.left=p.weeks+p.delay;gLog(`Permit granted: ${p.label}. Building starts.`)}}continue}
    const total=Math.round(p.cost*(1+p.over/100)),pay=Math.round(total/(p.weeks+p.delay)*10)/10;
    construction+=pay;p.paid+=pay;
    if(p.over&&p.left===Math.ceil((p.weeks+p.delay)/2))gLog(`${p.label}: the builder reports an overrun of ${p.over}%.`);
    if(--p.left<=0)finishProject(p);
  }
  // wear, decay and recovery from the department budget (per week; a season is 30 weeks)
  const rec=d=>({tight:.15,normal:.4,generous:.7})[g.depts[d].budget];
  for(const k in g.sides){const s=g.sides[k];s.cond=clamp(s.cond-.45+rec('matchday'),0,100)}
  for(const k in g.fac){const f=g.fac[k];f.cond=clamp(f.cond-.4+rec('matchday'),0,100)}
  for(const p of g.plots)if(p.kind)p.cond=clamp(p.cond-.4+rec(COMPLEX[p.kind].dept),0,100);
  g.pitch.cond=clamp(g.pitch.cond+(home?-(4-g.pitch.drain*.3):0)+1.2+rec('matchday'),0,100);
  for(const k in g.depts){const d=g.depts[k];if(d.pending&&--d.settle<=0){d.course=d.pending;d.pending=null;gLog(`${DEPT[k].n} now works the new way: ${d.course}.`)}}
  g.lastConstruction=Math.round(construction*10)/10;
  return g.lastConstruction;
}
function groundSeasonEnd(){
  const g=G();
  for(const k in g.sides){const s=g.sides[k];if(s.cond<30)gLog(`Safety inspection: the ${SIDE_NAME[k]} is in poor shape (${Math.round(s.cond)}%). Half of it stays closed until repaired.`)}
}
function repairCost(o,base){return Math.max(1,Math.round(base*(100-o.cond)/100*.6))}
function repairList(){
  const g=G(),out=[];
  for(const k in g.sides){const s=g.sides[k];if(s.cond<90)out.push({key:'side:'+k,label:SIDE_NAME[k],cond:s.cond,cost:repairCost(s,s.rings*(s.type==='terrace'?45:60))})}
  for(const k in g.fac){const f=g.fac[k];if(f.cond<90)out.push({key:'fac:'+k,label:FAC[k].n,cond:f.cond,cost:repairCost(f,lvCost(FAC[k].c,f.lv)*2)})}
  g.plots.forEach((p,i)=>{if(p.kind&&p.cond<90)out.push({key:'plot:'+i,label:COMPLEX[p.kind].n,cond:p.cond,cost:repairCost(p,lvCost(COMPLEX[p.kind].c,p.lv)*2)})});
  return out.sort((a,b)=>a.cond-b.cond);
}
function repair(key){
  const r=repairList().find(x=>x.key===key);if(!r)return null;const g=G(),[kind,a]=key.split(':');
  const o=kind==='side'?g.sides[a]:kind==='fac'?g.fac[a]:g.plots[+a];o.cond=100;
  g.repairBill=(g.repairBill||0)+r.cost;gLog(`Repaired: ${r.label} (£${r.cost}k).`);return r;
}
function setDeptBudget(d,lv){const g=G();if(!g.depts[d]||!BUDGET_F[lv])return;g.depts[d].budget=lv;gLog(`${DEPT[d].n} budget set to ${lv}.`)}
function setDeptCourse(d,c){const g=G(),x=g.depts[d];if(!x||!DEPT[d].courses.includes(c))return;
  if(c===x.course){x.pending=null;x.settle=0;return}x.pending=c;x.settle=30;gLog(`${DEPT[d].n} switches to ${c}. It takes a season to settle in.`)}
function deptCost(){const g=G();let t=0;for(const k in g.depts)t+=.25*BUDGET_F[g.depts[k].budget];return Math.round(t*100)/100}
function groundCondWorst(){const g=G();const all=[...Object.entries(g.sides).map(([k,s])=>({n:SIDE_NAME[k],c:s.cond})),...Object.entries(g.fac).map(([k,f])=>({n:FAC[k].n,c:f.cond})),{n:'The pitch',c:g.pitch.cond},...g.plots.filter(p=>p.kind).map(p=>({n:COMPLEX[p.kind].n,c:p.cond}))];return all.sort((a,b)=>a.c-b.c)[0]}
