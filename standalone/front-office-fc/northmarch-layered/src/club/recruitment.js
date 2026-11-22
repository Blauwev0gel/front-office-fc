/* ================= L2.5: the recruitment cycle =================
   SQUAD NEED → SCOUTING → CANDIDATE ASSESSMENT → DIRECTOR'S DECISION → SIGNING → REVIEW.
   Owns S.ops (the player's club only: squad plan, shortlist, signings review) and F(id).policy.recruit (every club).
   The plan is derived from the real squad; scouting observes real players week by week; the director's existing
   window logic (football/market.js shopFor) uses the shortlist's refined estimates. No individual scouts (that is L3). */
const RECRUIT={balanced:{n:'Balanced',d:'The best player the money buys'},youth:{n:'Youth',d:'Young players who will grow'},experience:{n:'Experience',d:'Proven players in their prime'},value:{n:'Value',d:'Cheap deals and free agents'}};
const SHORTLIST_MAX=12;
/* ----- L3 (slice 1): the director's mandate on deals, and what he proposes beyond it -----
   Deals up to the limit he signs himself; a better player above the limit he leaves alone, and the chairman sees that afterwards.
   Only the player's club has a mandate; a missing mandate (old save) means no limit, as before. */
const MANDATE_DEALS={small:{n:'Small',share:.4,d:'He signs himself up to 40% of the transfer budget a deal.'},medium:{n:'Medium',share:.75,d:'He signs himself up to 75% of the transfer budget a deal.'},large:{n:'Large',share:1,d:'He signs anyone within the transfer budget, no questions asked.'}};
function mandateOf(id){return(F(id).policy&&F(id).policy.mandate)||{deals:'large'}}
function dealCap(id){if(id!==S.my||S.auto)return Infinity;const m=MANDATE_DEALS[mandateOf(id).deals]||MANDATE_DEALS.large;return m.share>=1?Infinity:Math.max(5,Math.round(budgetFor(id)*m.share))}
function opsInit(){return{plan:{s:0,w:0,needs:[],ready:[],next:1},shortlist:[],signings:[],missed:[],pnext:1}}
function OPS(){if(!S.ops)S.ops=opsInit();return S.ops}
function recruitStrategy(id){return F(id).policy.recruit||'balanced'}
/* how a strategy colours the director's choice (used for every club in shopFor) */
function recruitBias(id,p,fee){
  const st=recruitStrategy(id);
  // A strategy should change the director's ranking of comparable affordable players,
  // not bypass budget, minimum quality or the selling club's consent.
  if(st==='youth')return p.age<=21?1.6:p.age<=24?1.0:p.age>=30?-1.0:p.age>=27?-.4:0;
  if(st==='experience')return p.age>=26&&p.age<=31?1.1:p.age<=21?-1.1:p.age<=23?-.5:0;
  return st==='value'?(-fee/60+(fee===0?.3:0)):0;
}

/* ----- the squad plan: what the squad needs, built from the real squad before each window and after renewals ----- */
function buildPlan(id){
  const ops=OPS(),pl=ops.plan,sq=S.squads[id].filter(p=>!p.loan),xi=pickXI(S.squads[id]),xiP=xi.map(x=>x.p),qs=sq.map(p=>p.q).sort((a,b)=>a-b),med=qs[Math.floor(qs.length/2)]||10,sqQ=squadQuality(S.squads[id]);
  const want=[];
  for(const pos of POS){const n=sq.filter(p=>p.pos===pos).length;if(n<REQ[pos])want.push({key:'hole:'+pos,pos,kind:'hole',prio:3,why:`${n?'Only '+n:'No'} ${POS_ONE[pos]}${n===1?'':'s'}; the squad needs ${REQ[pos]}`})}
  for(const p of sq.filter(p=>p.contract===1&&p.q>=med))want.push({key:'contract:'+p.id,pos:p.pos,kind:'contract',prio:2,pid:p.id,why:`${p.name}'s contract ends this season`});
  for(const p of sq.filter(p=>p.wantsOut))want.push({key:'leaving:'+p.id,pos:p.pos,kind:'leaving',prio:2,pid:p.id,why:`${p.name} wants to leave`});
  for(const x of xi.filter(x=>x.p.age>=32))want.push({key:'ageing:'+x.p.id,pos:x.p.pos,kind:'ageing',prio:1,pid:x.p.id,why:`${x.p.name} is ${x.p.age}: a successor will be needed`});
  const weak=xi.slice().sort((a,b)=>a.p.q-b.p.q)[0];if(weak&&weak.p.q<sqQ-.8)want.push({key:'upgrade:'+weak.slot,pos:weak.slot,kind:'upgrade',prio:1,pid:weak.p.id,why:`${weak.p.name} (${r1(weak.p.q)}) is the weakest starter`});
  // merge: keep status and history of needs that still exist; close what has been solved
  const old=Object.fromEntries(pl.needs.map(n=>[n.key,n])),keys=new Set(want.map(w=>w.key));
  /* a need that disappears is not always a success: say whether it was solved, or the player simply left */
  for(const n of pl.needs)if(!keys.has(n.key)&&n.status==='open'){
    const player=n.pid&&sq.find(p=>p.id===n.pid);
    const gone=n.pid&&!player;
    const covered=n.kind==='hole'&&sq.filter(p=>p.pos===n.pos).length>=REQ[n.pos];
    const renewed=n.kind==='contract'&&player&&player.contract>1;
    n.status=covered||renewed?'solved':gone?'lapsed':'no-longer-needed';
    n.closed=[S.season,S.week];
  }
  pl.needs=pl.needs.filter(n=>n.status!=='open'||keys.has(n.key)).filter(n=>!(n.closed&&n.closed[0]<S.season-1));
  for(const w of want){if(!old[w.key])pl.needs.push({...w,id:pl.next++,status:'open',since:[S.season,S.week]});else Object.assign(old[w.key],{why:w.why,prio:w.prio})}
  pl.needs.sort((a,b)=>(a.status==='open'?0:1)-(b.status==='open'?0:1)||b.prio-a.prio);
  pl.ready=sq.filter(p=>p.age<=21&&!xiP.includes(p)).filter(p=>{const s=xi.find(x=>x.slot===p.pos||NEAR[p.pos].includes(x.slot));return s&&p.q>=s.p.q-.3}).map(p=>({pid:p.id,name:p.name,pos:p.pos,q:r1(p.q)}));
  pl.s=S.season;pl.w=S.week;
  return pl;
}
function openNeeds(){return OPS().plan.needs.filter(n=>n.status==='open')}

/* ----- scouting: every week the department observes real players for the open needs; estimates sharpen with each look ----- */
function scoutObservations(id){return 1+Math.floor(groundSignals(id).scouting/1.5)}
function scoutNoise(id){return 1.4*clamp(.9-.08*groundSignals(id).scouting,.35,.9)} /* specialist scouts: sharper than one glance from the director, sharper still with a better department */
function findPlayer(pid){for(const c in S.squads){const p=S.squads[c].find(x=>x.id===pid);if(p)return{p,club:c}}for(const c in S.foreign?.squads||{}){const p=S.foreign.squads[c].find(x=>x.id===pid);if(p)return{p,club:c}}const f=S.fa.find(x=>x.id===pid);return f?{p:f,club:null}:null}
function scoutWeek(id,salt=0){
  const ops=OPS(),needs=openNeeds(),sl=ops.shortlist;ops.looks={s:S.season,w:S.week,list:[]}; /* this week's looks, for the weekly club report */
  // keep the shortlist true to the world: moves, signings, retirements
  for(const e of sl){if(e.status!=='watching')continue;const f=findPlayer(e.pid);if(!f){e.status='gone';e.reason='No longer in football';continue}
    if(f.club===id){e.status='signed';continue}e.from=f.club;e.age=f.p.age}
  // urgent needs get more looks; the scouts rotate through the plan week by week
  const SCOUT_W={hole:3,upgrade:2,leaving:2,ageing:1,contract:1}; /* scouts follow where the director will search: gaps first, then upgrades and departures */
  const positions=needs.length?needs.flatMap(n=>Array(SCOUT_W[n.kind]||1).fill(n.pos)):[pick(POS)],n=scoutObservations(id);
  const others=Object.keys(S.clubs).filter(i=>i!==id&&Math.abs(CL(i).tier-CL(id).tier)<=1);
  const overseas=Object.keys(S.foreign?.squads||{});
  for(let k=0;k<n;k++){const pos=positions[(S.week*n+k+salt)%positions.length];
    let cand=null;
    // half the looks go back to players already on the list, the least-watched first: that is how estimates firm up
    const again=sl.filter(e=>e.status==='watching'&&e.pos===pos).sort((a,b)=>a.obs-b.obs)[0];
    if(again&&(S.week+k+salt)%2===1){const f=findPlayer(again.pid);if(f&&f.club!==id)cand={p:f.p,club:f.club}}
    if(!cand&&rnd()<.35){const fa=S.fa.filter(p=>p.pos===pos);if(fa.length)cand={p:pick(fa),club:null}}
    /* scouts watch players who can be had: surplus at their club, a club in need of cash, or a player who wants out; and within reach of the budget.
       They try up to four clubs before the look is lost, so the department's effort turns into real observations */
    for(let t=0;!cand&&t<4&&others.length;t++){const o=pick(others),sq=S.squads[o],spare=sq.filter(p=>p.pos===pos).length>REQ[pos]||F(o).cash<0,bud=budgetFor(id);
      const c=sq.filter(p=>p.pos===pos&&!p.loan&&(spare||p.wantsOut)&&playerValue(p)<=Math.max(5,bud*1.2));if(c.length)cand={p:pick(c),club:o}}
    if(!cand&&overseas.length&&rnd()<.4){
      const from=pick(overseas),sq=S.foreign.squads[from];
      const candidates=sq.filter(p=>p.pos===pos&&p.inj<=0&&p.contract>0&&sq.filter(x=>x.pos===pos).length>REQ[pos]&&playerAcceptsMove(p,from,id)&&askingFee(p,from)<=Math.max(5,budgetFor(id)*1.2));
      if(candidates.length)cand={p:pick(candidates),club:from};
    }
    if(!cand)continue;
    const look=cand.p.q+(rnd()+rnd()-1)*2.5*scoutNoise(id);let e=sl.find(x=>x.pid===cand.p.id);
    const isNew=!e;if(!e){e={pid:cand.p.id,name:cand.p.name,pos,age:cand.p.age,from:cand.club,est:look,obs:0,status:'watching',first:[S.season,S.week],need:(needs.find(x=>x.pos===pos)||{}).id||null};sl.push(e)}
    e.est=r1((e.est*e.obs+look)/(e.obs+1));e.obs++;e.last=[S.season,S.week];ops.looks.list.push({pid:e.pid,name:e.name,pos:e.pos,est:e.est,obs:e.obs,isNew,club:cand.club});if(e.status!=='watching'&&e.status!=='signed')e.status='watching';
  }
  // a full list drops the weakest prospect still being watched
  const watching=sl.filter(e=>e.status==='watching');if(watching.length>SHORTLIST_MAX){const drop=watching.sort((a,b)=>(a.est-scoutRange(id,a.obs))-(b.est-scoutRange(id,b.obs))).slice(0,watching.length-SHORTLIST_MAX); /* keep the best cautious estimates */for(const d of drop)sl.splice(sl.indexOf(d),1)}
  if(sl.length>30)sl.splice(0,sl.length-30);
}
/* how far off an estimate can be: one look with the director's own eye, or the scouts' refined average */
function scoutRange(id,obs){return r1(2.5*scoutNoise(id)*.41*2/Math.sqrt(Math.max(1,obs)))}
/* the scouting department's reports sharpen the director's judgement of every candidate, listed or not: a better department means fewer misjudged signings */
function reportNoise(id){return clamp(1.3-.1*groundSignals(id).scouting,.55,1.3)}
function eyeRange(id){return r1(2.5*tdNoise(id)*reportNoise(id)*.41*2)}
function shortlistEntry(pid){return S.ops&&S.ops.shortlist.find(e=>e.pid===pid&&e.status==='watching')}
/* in a window: watched players join the director's options, judged by the refined estimate */
function shortlistCandidates(id,pos){
  if(id!==S.my||!S.ops)return[];const out=[];
  for(const e of S.ops.shortlist){if(e.status!=='watching'||(pos&&e.pos!==pos))continue;const f=findPlayer(e.pid);if(!f||f.club===id)continue;out.push({p:f.p,from:f.club,premium:f.club&&!foreignSeller(f.club)?CL(f.club).rep>CL(id).rep+15&&!f.p.wantsOut:false,listed:true})}
  return out;
}
/* after the director decides: the need is filled, the shortlist and the review remember why */
function recordDecision(id,pos,best,evaluated,mustHave){
  if(id!==S.my||!S.ops)return;const ops=S.ops;
  for(const c of evaluated){const e=ops.shortlist.find(x=>x.pid===c.pid);if(e&&e.status==='watching'&&c.reason!=='Considered'&&c.reason!=='Selected')e.reason=c.reason}
  if(!best)return;
  const e=ops.shortlist.find(x=>x.pid===best.p.id);if(e){e.status='signed';e.reason='Signed'}
  const need=ops.plan.needs.find(n=>n.status==='open'&&n.pos===pos)||ops.plan.needs.find(n=>n.status==='open'&&NEAR[best.p.pos].includes(n.pos));
  if(need){
    // A signing only resolves a shortage when the required positional cover actually exists.
    // Contracts, departures and succession risks are not automatically solved by any arrival.
    const sq=S.squads[id],count=sq.filter(p=>!p.loan&&p.pos===need.pos).length;
    const resolved=need.kind==='hole'&&count>=REQ[need.pos];
    if(resolved){need.status='filled';need.closed=[S.season,S.week];need.by={pid:best.p.id,name:best.p.name}}
    else{need.lastSigning={pid:best.p.id,name:best.p.name,s:S.season,w:S.week};}
  }
  ops.signings.push({pid:best.p.id,name:best.p.name,pos:best.p.pos,age:best.p.age,fee:best.fee,est:r1(best.seen??best.p.q),q0:r1(best.p.q),s:S.season,w:S.week,need:need?need.why:(mustHave?'Emergency cover':'Squad strengthening'),scouted:!!e,obs:e?e.obs:0,strategy:recruitStrategy(id)});
  if(ops.signings.length>20)ops.signings.shift();
}
function signingReview(){return(S.ops?S.ops.signings:[]).slice(-6).reverse().map(x=>{const f=findPlayer(x.pid);return{...x,now:f?r1(f.p.q):null,apps:f?f.p.apps:null,where:f?(f.club===S.my?'at the club':f.club?marketClubName(f.club):'released'):'gone'}})}
/* the transfer windows, made visible: what is coming, what the director is working on, what was done */
function windowInfo(){
  const id=S.my,ev=S.ev.filter(e=>(e.c===id&&(e.t==='Transfer'||e.t==='Signing'))||(e.c2===id&&e.t==='Transfer')||(e.t==='InternationalTransfer'&&(e.from===id||e.to===id)));
  const open=openNeeds().filter(n=>n.kind==='hole'||n.prio>=2),summerDone=S.week>=1&&S.week<=5,winterDone=S.week>=WINTER_WEEK&&S.week<=WINTER_WEEK+5;
  const report=(s,w)=>{const x=ev.filter(e=>e.s===s&&e.w===w);return{ins:x.filter(e=>e.t==='InternationalTransfer'?e.to===id:e.c===id),outs:x.filter(e=>e.t==='InternationalTransfer'?e.from===id:e.c2===id)}};
  if(S.week===0)return{k:'open',name:'Summer window',when:'Open through the pre-season. The scouts watch players for the director while it runs. Set your strategy and your money frame now: the director signs and sells when you start the season.',open};
  if(seasonOver())return{k:'summer-next',name:'Summer window',when:'Opens after the season is closed, with the new pre-season: contracts end and the academy brings in new players.',open};
  if(summerDone)return{k:'done',name:'Summer window',when:'Closed when the season started.',...report(S.season,0),open};
  if(winterDone)return{k:'done',name:'Winter window',when:`Closed in week ${WINTER_WEEK}.`,...report(S.season,WINTER_WEEK),open};
  if(S.week===WINTER_WEEK-1)return{k:'next',name:'Winter window',when:`Opens next week (week ${WINTER_WEEK}). The director acts on this plan.`,open};
  if(S.week<WINTER_WEEK-1)return{k:'upcoming',name:'Winter window',when:`Week ${WINTER_WEEK}, in ${WINTER_WEEK-1-S.week} week${WINTER_WEEK-1-S.week===1?'':'s'}. The scouts are preparing the list.`,open};
  return{k:'none',name:'Next window',when:'The summer window follows the season; no more transfers until then.',open};
}
/* when a window opens (pre-season, the week before the winter window) the director looks, without signing, for the best player for his main needs.
   What he would go for but may not (above the mandate) is noted: the chairman sees what his limit leaves on the table and can widen it.
   There is nothing to approve: the director decides everything within the mandate, and nothing outside it. */
function tdScan(id){
  if(id!==S.my||S.auto)return;const ops=OPS();ops.missed=(ops.missed||[]).filter(p=>p.status!=='above').slice(-9);
  const cap=dealCap(id);if(cap===Infinity)return;
  const sqQ=squadQuality(S.squads[id]),seen=new Set(),out=[];
  for(const n of openNeeds().filter(n=>n.prio>=1).slice(0,5)){
    if(seen.has(n.pos))continue;seen.add(n.pos);
    const own=n.pid&&S.squads[id].find(p=>p.id===n.pid),minQ=n.kind==='upgrade'&&own?own.q+.8:sqQ-2.5;
    const best=shopFor(id,n.pos,minQ,{dry:true,ignoreMandate:true});if(!best||best.fee<=cap)continue;
    const sl=shortlistEntry(best.p.id);
    out.push({pid:best.p.id,name:best.p.name,pos:best.p.pos,age:best.p.age,from:best.from||null,fee:best.fee,est:r1(best.seen??best.p.q),range:sl&&sl.obs?scoutRange(id,sl.obs):eyeRange(id),need:n.why,kind:n.kind});
  }
  out.sort((a,b)=>b.est-a.est);
  for(const o of out.slice(0,3))ops.missed.push({id:ops.pnext++,s:S.season,w:S.week,status:'above',cap,...o});
}
function aboveLimit(){return(S.ops&&S.ops.missed||[]).filter(p=>p.status==='above')}
/* the window closes: what stayed above the limit is now history (shown as "left alone") */
function tdClose(){if(!S.ops)return;for(const p of S.ops.missed||[])if(p.status==='above'){p.status='missed';p.closed=[S.season,S.week]}}
/* the window opens for the chairman: the pre-season scouting rounds, a fresh plan, and the director's scan */
function openWindow(){
  if(!S.my)return;for(let k=0;k<4;k++)scoutWeek(S.my,k*3+1);buildPlan(S.my);tdScan(S.my);
}
defCommand('SetMandate',{check:(id,a)=>!MANDATE_DEALS[a.deals]?'Unknown mandate':null,run:(id,a)=>{F(id).policy.mandate={...mandateOf(id),deals:a.deals};
  const w=S.week===0||S.week===WINTER_WEEK-1;if(w&&S.ops){S.ops.missed=(S.ops.missed||[]).filter(p=>p.status!=='above');tdScan(id)} /* the list follows the new limit */}});
function opsAfterLoad(){if(S.my&&!S.ops){S.ops=opsInit();buildPlan(S.my)}if(S.ops){delete S.ops.proposals;if(!S.ops.missed){S.ops.missed=[];S.ops.pnext=S.ops.pnext||1}}}
