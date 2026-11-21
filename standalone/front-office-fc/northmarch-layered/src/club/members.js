/* ================= Club: members, confidence, season targets and the AGM =================
   Owns S.members[id] (members, dues, confidence, its log, the season's targets) and the chairman's career
   (S.career, S.rep). Decisions D6 and D7: confidence moves with real causes, every club holds an AGM after week 30,
   and a chairman who loses the vote is out. The player then picks one of three open chairs in the same world. */
const DUES_REF=[50,40,30]; // £ a year per member, by division
const CONF_BASE=55;
function M(id){return S.members[id]}
function membersInit(id,o={}){
  const c=CL(id);return{count:Math.round(c.support*.4),dues:DUES_REF[c.tier],conf:o.conf??ri(48,62),log:[],goals:[],goalsSeason:0,agm:null};
}
function confLog(id,d,why){
  const m=M(id);if(!d)return;const before=m.conf;m.conf=r1(clamp(m.conf+d,0,100));
  const last=m.log[m.log.length-1];
  if(last&&last.why===why&&last.s===S.season){last.d=r1(last.d+(m.conf-before));last.w=S.week}else m.log.push({s:S.season,w:S.week,d:r1(m.conf-before),why});
  if(m.log.length>40)m.log.shift();
}
function priceIndex(id){const pr=F(id).prices,ref=PRICE_DEF[CL(id).tier];return(pr.terrace/ref.terrace*.6+pr.seated/ref.seated*.4)}
/* weekly: members follow support, dues and the clubhouse; confidence follows results, prices and the club's state */
function membersWeek(id,matches){
  const m=M(id),c=CL(id),g=groundSignals(id),ref=DUES_REF[c.tier];
  const target=c.support*.4*(1+g.community*.05)*Math.pow(ref/m.dues,.5);
  m.count=Math.max(50,Math.round(m.count+(target-m.count)*.04));
  for(const x of matches){
    const home=x.h===id,gf=home?x.gh:x.ga,ga=home?x.ga:x.gh,pts=gf>ga?3:gf===ga?1:0;
    if(x.comp==='league'){const xp=home?x.xh:x.xa,derby=CL(x.h).rival===x.a;confLog(id,(pts-xp)*(derby?1.6:.9),derby?'Derby results':'Results against expectation')}
    else if(x.winner===id&&x.round>=3)confLog(id,1.5,'A cup run');
  }
  if(namingWeekK(id))confLog(id,-.12,'The ground renamed after a sponsor');
  const pi=priceIndex(id);if(pi>1.2)confLog(id,-(pi-1.2)*2.5,'Ticket prices');else if(pi<.9)confLog(id,.15,'Ticket prices');
  if(m.dues>ref*1.3)confLog(id,-(m.dues/ref-1.3)*1.5,'Membership dues');else if(m.dues<ref*.8)confLog(id,.1,'Membership dues');
}
/* events that members react to (called once per event from the clock) */
const CONF_EVENT={Administration:[-20,'Administration'],CashCrisis:[-6,'Money trouble'],ForcedSale:[-3,'Forced player sales'],SafetyClosure:[-4,'A stand closed for safety'],ProjectCompleted:[2,'New facilities'],CupWon:[8,'Winning the cup']};
function membersOnEvents(evs){for(const e of evs){const r=CONF_EVENT[e.t];if(r&&e.c&&S.members[e.c])confLog(e.c,r[0],r[1])}}

/* ----- season targets: league position, money and the academy ----- */
function academyApps(id){return S.squads[id].filter(p=>p.academy).reduce((a,p)=>a+p.sApps,0)}
function setGoals(id){
  const c=CL(id),m=M(id),exp=c.expect||8,f=F(id),inc=estSeasonIncome(id);
  const pos=c.tier>0&&exp<=3?2:clamp(exp+2,1,14);
  m.goals=[
    {k:'league',target:pos,text:c.tier>0&&pos<=2?`Promotion: finish in the top two of ${TIER_NAME[c.tier]}`:`Finish ${ord(pos)} or higher in ${TIER_NAME[c.tier]}`,w:10},
    f.cash<inc*.3?{k:'money',target:0,text:'No operating loss this season',w:6}:{k:'money',target:-Math.round(inc*.1),text:`Keep any operating loss under £${Math.round(inc*.1)}k`,w:6},
    {k:'youth',target:[30,45,60][c.tier],text:`Academy players make ${[30,45,60][c.tier]} appearances between them`,w:5}
  ];m.goalsSeason=S.season;
}
function setGoalsAll(){for(const id in S.clubs)if(S.members[id])setGoals(id)}
function goalProgress(id,gl){
  if(gl.k==='league'){const p=posOf(id);return{now:p,met:p<=gl.target,text:`${ord(p)} now`}}
  if(gl.k==='money'){const r=operatingResult(F(id).season);return{now:r,met:r>=gl.target,text:`${k1v(r)} so far`}}
  const a=academyApps(id);return{now:a,met:a>=gl.target,text:`${a} so far`};
}
function k1v(v){return(v<0?'−':'')+'£'+Math.abs(Math.round(v))+'k'}
/* ----- the AGM: held for every club after week 30, before the season closes ----- */
function holdAGMs(){
  const out=[];
  for(const id in S.clubs){const m=M(id),c=CL(id);
    const goals=[];for(const gl of m.goals){const pr=goalProgress(id,gl);goals.push({text:gl.text,met:pr.met,now:pr.text});confLog(id,pr.met?gl.w*.8:-gl.w*.8,pr.met?'Season targets met':'Season targets missed')}
    const pos=posOf(id);if(c.tier>0&&pos<=2)confLog(id,12,'Promotion');if(c.tier<2&&pos>=15)confLog(id,-15,'Relegation');
    const fresh=id===S.my&&S.career.length&&S.career[S.career.length-1].from===S.season?6:0; // a first season earns some patience
    const forPct=clamp(Math.round(24+.75*m.conf+fresh+(rnd()-.5)*10),3,97);
    m.agm={s:S.season,goals,for:forPct,against:100-forPct,out:forPct<50&&!(S.agmOff&&id===S.my),conf:m.conf,reasons:seasonReasons(id)};
    if(m.agm.out)out.push(id);
  }
  return out;
}
function seasonReasons(id){const by={};for(const l of M(id).log.filter(x=>x.s===S.season))by[l.why]=r1((by[l.why]||0)+l.d);return Object.entries(by).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,5)}
/* after the vote: computer chairmen who lost are replaced (a new chairman has his own values); the player is out */
function afterAGMs(outIds){
  for(const id of outIds){const c=CL(id),m=M(id);
    if(id===S.my){const st=S.career[S.career.length-1];if(st){st.to=S.season;st.why=`Voted out at the AGM (${m.agm.for}% for)`}
      S.rep=r1(S.rep-1);emit('ChairmanOut',id,`You are voted out as chairman of ${c.name}: ${m.agm.for}% for, ${m.agm.against}% against.`,{player:true});S.votedOut=id;continue}
    const old=P(c.cast.chair),nu=c.cast.opp;c.cast.chair=nu;P(nu).role='chair';c.cast.opp=mkPerson('opp',id,{infl:weakest(c)});if(old)old.club=null;
    emit('ChairmanOut',id,`${c.name}: chairman ${old?old.name:''} is voted out at the AGM. ${P(nu).name} takes the chair.`);
    m.conf=58;
    const v=chairValue(id),f=F(id);f.policy.wage=v==='glory'?'ambitious':v==='money'?'tight':'normal';
  }
  for(const id in S.clubs)M(id).conf=r1(M(id).conf+(CONF_BASE-M(id).conf)*.15);
}
/* the player's seats after being voted out: one per division, better clubs for a better reputation */
function seatsAfterOut(){
  const ex=new Set([S.votedOut,...S.career.map(x=>x.club)]),out=[];
  for(const t of TIERS){const ids=tierIds(t).filter(i=>!ex.has(i)).sort((a,b)=>teamStrength(a)-teamStrength(b));
    const k=clamp(Math.round(ids.length*(.35+.06*S.rep))+ri(-2,2),0,ids.length-1);out.push(ids[k])}
  return out;
}
function membersAfterLoad(){if(S.members&&Object.values(S.members).some(m=>m.goalsSeason!==S.season))setGoalsAll()}

defCommand('SetDues',{check:(id,a)=>!(a.delta===1||a.delta===-1)?'Change dues one step at a time':null,run:(id,a)=>{const m=M(id),ref=DUES_REF[CL(id).tier];
  m.dues=clamp(m.dues+a.delta*5,Math.round(ref*.4/5)*5,Math.round(ref*2.5/5)*5);if(id===S.my)emit('Members',id,`Membership dues set to £${m.dues} a year.`)}});
