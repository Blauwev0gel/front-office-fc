/* ================= Club: the head coach and the director of football =================
   Owns the professional profile of coaches and directors (P(id).pro) and the pool of free ones (S.staffPool).
   Layer 2: they have quality, a speciality, a wage, a contract and a record, and they change the simulation.
   They have no will of their own yet (mandates and initiative are layer 3). Director skills echo
   voorzitter-fundering club/td.js (eye, deal), reduced to quality plus speciality. */
const STAFF_SPEC={
  coach:{development:'Develops young players',results:'Gets results now',attacking:'Attacking football',defensive:'Hard to beat'},
  td:{eye:'A sharp eye for a player',negotiator:'A hard bargainer',youth:'Builds on young players'}
};
const STAFF_Q=[[10,16],[7,13],[4,10],[3,8],[2,7]];
const POOL_SIZE={coach:9,td:7};
function staffWage(role,q){return Math.max(60,Math.round((role==='coach'?120:95)*Math.pow(1.27,q-8)/5)*5)}
function giveProfile(pid,role,tier,o={}){
  const p=P(pid),[a,b]=STAFF_Q[tier];const q=o.q??ri(a,b);
  p.pro={q,spec:o.spec||pick(Object.keys(STAFF_SPEC[role])),wage:staffWage(role,q),contract:o.contract??ri(1,3),since:S.season,record:[],off:ri(-3,3),caretaker:!!o.caretaker};
  return p;
}
function coachOf(id){return P(CL(id).cast.coach)}
function tdOf(id){return P(CL(id).cast.td)}
const pq=p=>p&&p.pro?p.pro.q:6;
/* ----- what they do in the simulation ----- */
function coachEdge(id){const c=coachOf(id);if(!c||!c.pro)return 0;return(c.pro.q-10)*.45*(c.pro.spec==='results'?1.35:1)}
function coachLambda(id){const s=coachOf(id)?.pro?.spec;return s==='attacking'?[1.07,1.03]:s==='defensive'?[.97,.91]:[1,1]}
function coachGrowth(id){const c=coachOf(id);if(!c||!c.pro)return 1;return 1+(c.pro.q-10)*.025+(c.pro.spec==='development'?.18:0)}
function tdNoise(id){const t=tdOf(id),eye=pq(t)+(t?.pro?.spec==='eye'?3:0);return clamp((20-eye)/7,.2,2.6)}
function tdBuyF(id){const t=tdOf(id),d=pq(t)+(t?.pro?.spec==='negotiator'?3:0);return clamp(1.18-d*.018,.82,1.15)}
function tdYouth(id){return tdOf(id)?.pro?.spec==='youth'}
/* what the player sees: an estimate, sharper for people at his own club */
function staffEstimate(pid){const p=P(pid);if(!p||!p.pro)return null;const off=p.club===S.my?Math.round(p.pro.off/2):p.pro.off;return clamp(p.pro.q+off,1,20)}
function staffStars(q){return Math.max(1,Math.min(5,Math.round(q/4)))}
function staffWeekK(id){return r2(((coachOf(id)?.pro?.wage)||0)/1000+((tdOf(id)?.pro?.wage)||0)/1000)}

/* ----- the pool of free coaches and directors ----- */
function staffPoolInit(){S.staffPool=[];staffPoolTopUp()}
function staffPoolTopUp(){
  for(const role of ['coach','td']){let n=S.staffPool.filter(i=>P(i).role===role).length;
    while(n++<POOL_SIZE[role]){const id=mkPerson(role,null,{age:ri(36,60)});giveProfile(id,role,pick([0,1,1,2,2]),{contract:0});S.staffPool.push(id)}}
}
function toPool(pid){const p=P(pid);if(!p)return;p.club=null;p.pro.contract=0;if(!p.pro.caretaker&&!S.staffPool.includes(pid))S.staffPool.push(pid)}
function caretaker(id,role){const pid=mkPerson(role,id,{age:ri(40,58)});giveProfile(pid,role,2,{q:ri(4,7),contract:0,caretaker:true,spec:role==='coach'?'results':'eye'});P(pid).pro.wage=60;return pid}
/* compensation to the club that loses its man; settlement for the man who is sacked */
function compensation(pid){const p=P(pid);if(!p||!p.club||p.pro.caretaker)return 0;return r1(p.pro.wage*SEASON_WEEKS*Math.max(1,p.pro.contract)/1000*.5)}
function settlement(pid){const p=P(pid);if(!p||p.pro.caretaker)return 0;return r1(p.pro.wage*SEASON_WEEKS*Math.max(0,p.pro.contract)/1000*.5)}
function appoint(id,role,pid,why){
  const c=CL(id),old=c.cast[role],p=P(pid),from=p.club&&p.club!==id?p.club:null;
  const comp=from?compensation(pid):0;if(comp){book(id,'staffpay',-comp);book(from,'staffpay',comp)}
  if(old&&old!==pid){const set=settlement(old);if(set)book(id,'staffpay',-set);toPool(old);P(old).career.push(id)}
  S.staffPool=S.staffPool.filter(x=>x!==pid);
  if(from){CL(from).cast[role]=caretaker(from,role);emit('StaffPoached',from,`${p.name} leaves ${CL(from).name} for ${c.name}. A caretaker steps in.`,{c2:id});if(aiRuns(from))aiHire(from,role,true)}
  p.club=id;p.role=role;p.career.push(id);p.pro.since=S.season;p.pro.caretaker=false;if(!p.pro.contract)p.pro.contract=2;p.pro.wage=Math.max(p.pro.wage,staffWage(role,p.pro.q));
  c.cast[role]=pid;
  emit('StaffHired',id,`${c.name} appoint ${p.name} as ${role==='coach'?'head coach':'director of football'}${why?` (${why})`:''}.`,{pid,role,comp});
}
function sackStaff(id,role,why){
  const c=CL(id),old=c.cast[role],p=P(old),set=settlement(old);if(set)book(id,'staffpay',-set);
  emit('StaffSacked',id,`${c.name} sack ${role==='coach'?'head coach':'director'} ${p.name}${why?` ${why}`:''}${set?` (£${set}k settlement)`:''}.`,{pid:old,role});
  toPool(old);c.cast[role]=caretaker(id,role);
}
/* candidates for a club: the free pool, plus people at clubs in the same or a lower division */
/* ambitious people do not join a club below their level: the ceiling is the division's best plus three */
function willJoin(id,pid){return P(pid).pro.q<=STAFF_Q[CL(id).tier][1]+3}
function staffCandidates(id,role){
  const out=S.staffPool.filter(i=>P(i).role===role&&willJoin(id,i)).map(pid=>({pid,from:null,comp:0}));
  for(const o of Object.keys(S.clubs)){if(o===id||CL(o).tier<CL(id).tier)continue;const pid=CL(o).cast[role];const p=P(pid);if(p&&p.pro&&!p.pro.caretaker&&willJoin(id,pid)&&p.pro.q>=pq(P(CL(id).cast[role]))-1)out.push({pid,from:o,comp:compensation(pid)})}
  return out.sort((a,b)=>staffEstimate(b.pid)-staffEstimate(a.pid)).slice(0,12);
}
/* ----- computer boards: sack after failure, hire the best they can pay ----- */
function aiStaffWeek(id){
  const w=S.week;if(w!==10&&w!==20)return;const c=CL(id),gap=posOf(id)-(c.expect||8);
  if(gap>=4&&chance(.3)){sackStaff(id,'coach','after a poor run');aiHire(id,'coach',true)} // mid-season: from the free pool only; poaching waits for the summer
}
/* computer boards prefer the free pool; they only poach from a lower division when that man is clearly better */
function aiHire(id,role,poolOnly){
  const inc=estSeasonIncome(id),cap=inc*.03/SEASON_WEEKS*1000*(role==='coach'?1:.8),f=F(id);
  const ok=x=>P(x.pid).pro.wage<=cap&&x.comp<=Math.max(0,f.cash-reserveK(id))*.3;
  const all=staffCandidates(id,role).filter(ok),pool=all.filter(x=>!x.from),best=pool[0];
  const poach=poolOnly?null:all.find(x=>x.from&&CL(x.from).tier>CL(id).tier&&(!best||staffEstimate(x.pid)>=staffEstimate(best.pid)+3));
  const pickC=poach||best;if(pickC)appoint(id,role,pickC.pid,null);
}
function staffSeasonEnd(){
  for(const id in S.clubs){const c=CL(id),pos=posOf(id);
    for(const role of ['coach','td']){const p=P(c.cast[role]);if(!p||!p.pro)continue;
      p.pro.record.push({club:id,s:S.season,tier:c.tier,pos});if(p.pro.record.length>12)p.pro.record.shift();p.pro.contract--;
      if(id===S.my&&!S.auto){if(p.pro.contract<=0&&!p.pro.caretaker){emit('StaffLeft',id,`${p.name} leaves at the end of his contract.`,{pid:p.id,role});toPool(p.id);c.cast[role]=caretaker(id,role)}continue}
      const gap=pos-(c.expect||8);
      if(p.pro.caretaker||(role==='coach'&&gap>=3&&chance(.45))||(role==='td'&&gap>=5&&chance(.3))){if(!p.pro.caretaker)sackStaff(id,role,'in the summer');aiHire(id,role)}
      else if(p.pro.contract<=0){p.pro.contract=ri(1,3);p.pro.wage=Math.round(p.pro.wage*1.08/5)*5}
    }}
  for(const pid of S.staffPool.slice()){const p=P(pid);p.age++;if(p.age>68){S.staffPool=S.staffPool.filter(x=>x!==pid)}}
  staffPoolTopUp();
  // people who no longer play any part (out of football, past 68, not in the pool or a club) leave the save
  const used=new Set(S.staffPool);for(const id in S.clubs)for(const r in CL(id).cast)used.add(CL(id).cast[r]);
  for(const pid in S.P){const p=S.P[pid];if(!used.has(pid)&&!p.club&&p.age>68){delete S.P[pid]}}
  for(const pid in S.P){const p=S.P[pid];p.rel=p.rel.filter(r=>S.P[r.id])}
}
function staffAfterLoad(){
  if(!S.staffPool||!S.staffPool.length){S.staffPool=S.staffPool||[];staffPoolTopUp()}
  for(const id in S.clubs)for(const role of ['coach','td']){const pid=CL(id).cast[role];if(pid&&P(pid)&&!P(pid).pro)giveProfile(pid,role,CL(id).tier)}
}

defCommand('HireStaff',{check:(id,a)=>{if(!['coach','td'].includes(a.role))return'Unknown role';const c=staffCandidates(id,a.role).find(x=>x.pid===a.pid);if(!c)return'Not available';
  const cost=c.comp+settlement(CL(id).cast[a.role]);if(F(id).cash-cost<-creditLimit(id))return'The bank will not cover this';return null},
  run:(id,a)=>appoint(id,a.role,a.pid)});
defCommand('SackStaff',{check:(id,a)=>{const p=P(CL(id).cast[a.role]);if(!p)return'Nobody to sack';if(p.pro.caretaker)return'A caretaker cannot be sacked; appoint someone';return null},run:(id,a)=>sackStaff(id,a.role)});
defCommand('RenewStaff',{check:(id,a)=>{const p=P(CL(id).cast[a.role]);if(!p||p.pro.caretaker)return'Nobody to renew';if(p.pro.contract>1)return'The contract runs for more than a season';return null},
  run:(id,a)=>{const p=P(CL(id).cast[a.role]);p.pro.contract=2;p.pro.wage=Math.round(p.pro.wage*1.1/5)*5;emit('StaffRenewed',id,`${p.name} signs for two more seasons (£${p.pro.wage} a week).`,{pid:p.id})}});
