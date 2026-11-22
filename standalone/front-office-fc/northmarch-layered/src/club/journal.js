/* ================= Club: the decision journal =================
   Every command the player gives is noted with one measure that the decision is meant to move, taken at that moment.
   Later the chairman sees "then → now". It is a pointer, not proof: other things change too, and the screen says so.
   Owns S.journal (last 30 entries). */
const JOURNAL_MAX=30;
const jn0=v=>Math.round(v).toLocaleString('en-GB'),jk1=v=>(v<0?'−':'')+'£'+Math.abs(r1(v)).toLocaleString('en-GB')+'k'; // engine-side formatting (no UI dependency)
function metric(key,id){
  const st=S.stats[id],f=F(id),g=G(id),sg=groundSignals(id),wk=Math.max(1,S.week);
  switch(key){
    case'dept:training':{const n=S.squads[id].filter(p=>p.age<=23).length;return{label:'Growth per young player per 10 weeks',v:st.youthGrowth/Math.max(1,n)/wk*10,fmt:v=>'+'+v.toFixed(2),hi:true}}
    case'dept:medical':return{label:'Weeks lost to injury per 10 weeks',v:st.injWeeks/wk*10,fmt:v=>v.toFixed(1),hi:false};
    case'dept:academy':return{label:'Academy level',v:sg.academy,fmt:v=>v.toFixed(1),hi:true};
    case'dept:scouting':return{label:'Players seen per search',v:6+2*sg.scouting,fmt:v=>v.toFixed(0),hi:true};
    case'dept:commercial':return{label:'Local partners per week',v:partnersWeekK(id,1)*1000,fmt:v=>'£'+jn0(v),hi:true};
    case'dept:community':return{label:'Members',v:M(id).count,fmt:jn0,hi:true};
    case'dept:matchday':return{label:'Atmosphere',v:sg.atmosphere,fmt:v=>v.toFixed(1),hi:true};
    case'dept:grounds':{const all=[...Object.values(g.sides),...Object.values(g.fac),...g.plots.filter(p=>p.kind),g.pitch];return{label:'Average condition of the ground',v:all.reduce((a,o)=>a+o.cond,0)/all.length,fmt:v=>Math.round(v)+'%',hi:true}}
    case'capacity':return{label:'Capacity',v:sg.capacity,fmt:jn0,hi:true};
    case'ppg':return{label:'Points per game this season',v:ppg(id),fmt:v=>v.toFixed(2),hi:true};
    case'strength':return{label:'Squad strength',v:teamStrength(id),fmt:v=>v.toFixed(1),hi:true};
    case'att':return{label:'Last home crowd',v:f.lastGate?f.lastGate.total:attendance(id,null,{}).total,fmt:jn0,hi:true};
    case'members':return{label:'Members',v:M(id).count,fmt:jn0,hi:true};
    case'conf':return{label:"Members' confidence",v:M(id).conf,fmt:v=>Math.round(v)+'',hi:true};
    case'sponsorwk':return{label:'Main sponsor per week',v:sponsorWeekK(id)*1000+namingWeekK(id)*1000,fmt:v=>'£'+jn0(v),hi:true};
    case'debt':return{label:'Debt',v:debt(id),fmt:v=>jk1(v),hi:false};
    case'wagebill':return{label:'Wage bill per week',v:wageBillK(id)*1000,fmt:v=>'£'+jn0(v),hi:null};
    case'cash':return{label:'Cash',v:f.cash,fmt:v=>jk1(v),hi:true};
  }
  return null;
}
/* the club's development log: one line per season for the player's club, taken when the season is over.
   It lets the chairman see what his choices changed over the years. S.dev is optional and stays small (12 seasons). */
function devSnap(id){
  const sg=groundSignals(id),st=S.stats[id],sq=S.squads[id],m=M(id);
  return{s:S.season,tier:CL(id).tier,pos:posOf(id),str:r1(teamStrength(id)),age:r1(sq.reduce((a,p)=>a+p.age,0)/Math.max(1,sq.length)),wages:Math.round(wageBillK(id)*1000),
    members:m.count,conf:Math.round(m.conf),cap:sg.capacity,rep:CL(id).rep,cash:Math.round(F(id).cash),inj:st.injWeeks,growth:r1(st.youthGrowth),
    staff:Object.fromEntries(Object.keys(DEPT).map(k=>[k,G(id).depts[k].staff]))};
}
function devRecord(){if(!S.my)return;S.dev=S.dev||[];S.dev.push(devSnap(S.my));if(S.dev.length>12)S.dev.shift()}
function journalKey(name,a){
  if(['SetDeptStaff','SetDeptBudget','SetDeptCourse'].includes(name))return'dept:'+a.dept;
  if(name==='StartProject'){const k=(a.key||'').split(':');if(k[0]==='plot'){const kind=k[2]==='up'?(G(S.my).plots[+k[1]]||{}).kind:k[2];const map={training:'dept:training',medical:'dept:medical',academy:'dept:academy',scouting:'dept:scouting',commercial:'dept:commercial',clubhouse:'dept:community'};return map[kind]||'capacity'}return'capacity'}
  return{StartStadium:'capacity',BuyPlot:null,HireStaff:a.role==='coach'?'ppg':'strength',SackStaff:a.role==='coach'?'ppg':'strength',RenewStaff:null,SetPrice:'att',SetDues:'members',SignSponsor:'sponsorwk',
    TakeLoan:'debt',RepayLoan:'debt',IssueBond:'debt',Fundraise:'cash',SellGround:'cash',BuyBackGround:'cash',SetSquadPolicy:a.course?'strength':a.loans!=null?null:'wagebill',ReleasePlayer:'wagebill',Repair:'dept:grounds'}[name]??null;
}
function journalText(name,a,id){
  const D=a.dept&&DEPT[a.dept]?DEPT[a.dept].n:'';
  switch(name){
    case'SetDeptStaff':return`${D}: staff to ${STAFF_WORD[a.level].toLowerCase()}`;case'SetDeptBudget':return`${D}: ${a.level} budget`;case'SetDeptCourse':return`${D}: new way of working, ${a.course}`;
    case'StartProject':{const o=G(id).projects.slice(-1)[0];return`Building: ${o?o.label:a.key}`}case'StartStadium':return`New stadium started (${a.size})`;case'BuyPlot':return'Land bought for the complex';case'Repair':return'Repair ordered';
    case'HireStaff':return`New ${a.role==='coach'?'head coach':'director'}: ${P(CL(id).cast[a.role]).name}`;case'SackStaff':return`${a.role==='coach'?'Head coach':'Director'} sacked`;case'RenewStaff':return`${a.role==='coach'?'Head coach':'Director'} renewed`;
    case'SetPrice':return`${a.kind==='season'?'Season ticket':a.kind[0].toUpperCase()+a.kind.slice(1)} price ${a.delta>0?'up':'down'} to £${F(id).prices[a.kind]}`;case'SetDues':return`Dues ${a.delta>0?'up':'down'} to £${M(id).dues}`;
    case'SignSponsor':{const s=F(id).sponsor;return`Sponsor deal signed${s?': '+s.name:''}`}case'TakeLoan':return`Loan of £${a.amount}k over ${a.years} years`;case'RepayLoan':return'Loan repaid';case'IssueBond':return`Members' bond of £${a.amount}k`;
    case'Fundraise':return"Members' appeal";case'SellGround':return'The ground sold and leased back';case'BuyBackGround':return'The ground bought back';case'ReleasePlayer':return'Player released';

    case'SetSquadPolicy':return a.course?`Club course: ${COURSE[a.course].n}`:a.wageR!=null?`Wage limit set to ${Math.round(a.wageR*100)}% of income`:a.spend!=null?`Transfer money: ${Math.round(a.spend*100)}% of spare cash`:a.loans!=null?(a.loans?'Young reserves may go on loan':'Young reserves stay at the club'):a.recruit?`Recruitment strategy: ${RECRUIT[a.recruit].n}`:a.wage?`Wage frame: ${a.wage}`:'Frame changed';
  }
  return featureRule('journalDescription',{name,a,id},name);
}
function journalBefore(name,a,id){const key=journalKey(name,a);const m=key&&metric(key,id);return m?{key,v:m.v}:null}
function journalAdd(name,a,id,pre){
  S.journal=S.journal||[];const last=S.journal[S.journal.length-1],text=journalText(name,a,id);
  if(last&&last.cmd===name&&last.s===S.season&&last.w===S.week&&(last.key===(pre&&pre.key))&&['SetPrice','SetDues','SetSquadPolicy'].includes(name)){last.text=text;return} // repeated steps of one decision merge
  S.journal.push({s:S.season,w:S.week,cmd:name,text,club:id,key:pre?pre.key:null,before:pre?pre.v:null});if(S.journal.length>JOURNAL_MAX)S.journal.shift();
}
function journalRows(n){return(S.journal||[]).filter(j=>j.club===S.my).slice(-n).reverse().map(j=>{const m=j.key?metric(j.key,S.my):null;return{...j,m}})}
