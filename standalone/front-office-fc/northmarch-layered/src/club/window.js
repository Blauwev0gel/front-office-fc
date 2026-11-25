/* ================= The playable summer window: four pre-season weeks and deadline day =================
   Decision D-L3-2 (amended 2026-11-25): the director does every deal himself, with two exceptions that come to the chairman
   as a moment: a bid for one of the club's three best players, and a signing above the club's record fee.
   Each pre-season week the director works the transfer board: he picks a target per need (shopFor dry run), opens low,
   the selling club accepts, counters or refuses, rivals can hijack. Deadline day settles what is left; the season's
   start then runs the normal summer window, which fills any gap that remains.
   Owns S.pre = {s, wk, deals[], offer, record, prio, log[]} (player's club, pre-season only). No DOM. */
const PRE_WEEKS=4;
function PRE(){if(!S.my||S.week!==0)return null;if(!S.pre||S.pre.s!==S.season)S.pre={s:S.season,wk:1,deals:[],offer:null,record:null,prio:null,log:[]};return S.pre}
function preLog(t){const P_=PRE();P_.log.push({wk:P_.wk,t});if(P_.log.length>30)P_.log.shift()}
function topThree(id){return S.squads[id].filter(p=>!p.loan).slice().sort((a,b)=>b.q-a.q).slice(0,3)}
function clubRecordFee(id){return Math.max(0,...(S.mb||[]).filter(r=>r.s!=null).map(r=>r.in))}
function preTargets(id){const P_=PRE(),needs=openNeeds().slice().sort((a,b)=>(b.pos===P_.prio)-(a.pos===P_.prio)||b.prio-a.prio);const seen=new Set();return needs.filter(n=>!seen.has(n.pos)&&seen.add(n.pos)).slice(0,3)}
function preMinQ(id,n){const sq=squadQuality(S.squads[id]);return n.kind==='hole'?sq-2.5:sq-1}
function preFinish(id,d){
  const f=findPlayer(d.pid);if(!f||f.club!==d.from){d.stage='gone';return false}
  if(d.from&&foreignSeller(d.from)){if(!foreignMove(f.p,d.from,id,d.fee,'director scouting'))return false}else if(d.from)transfer(f.p,d.from,id,d.fee,'buy',d.premium);else signFree(f.p,id);
  recordDecision(id,d.pos,{p:f.p,from:d.from,fee:d.fee,seen:d.est},[],false);d.stage='signed';preLog(d.fee?`${d.name} signs for £${d.fee}k.`:`${d.name} joins on a free transfer.`);return true;
}
function preHijack(d){
  const f=findPlayer(d.pid);if(!f)return false;const rivals=allIds().filter(c=>c!==S.my&&c!==f.club&&F(c).cash>d.fee*1.5&&Math.abs(CL(c).tier-CL(S.my).tier)<=1);if(!rivals.length)return false;
  const r=pick(rivals),fee=Math.round(d.fee*1.1);
  if(f.club&&foreignSeller(f.club)){if(!foreignMove(f.p,f.club,r,fee,'rival bid'))return false}else if(f.club)transfer(f.p,f.club,r,fee,'buy');else signFree(f.p,r);
  d.stage='hijacked';d.rival=r;preLog(`${CL(r).name} hijack the deal for ${d.name} (£${fee}k).`);emit('Club',S.my,`${CL(r).name} beat us to ${d.name}.`);return true;
}
/* one pre-season week (or deadline day) of the director's work */
function preWeek(){
  const id=S.my,P_=PRE();if(!P_||P_.wk>PRE_WEEKS)return{ok:false,err:'The window is closed'};const deadline=P_.wk===PRE_WEEKS;
  if(P_.offer){preLog(`You let the bid for ${P_.offer.name} lapse.`);P_.offer=null}
  if(P_.record){preLog(`The record deal for ${P_.record.name} falls through.`);const d=P_.deals.find(x=>x.pid===P_.record.pid);if(d)d.stage='walked';P_.record=null}
  /* 1. live deals move on */
  for(const d of P_.deals.filter(x=>['bid','countered'].includes(x.stage))){
    if(rnd()<(deadline?.25:.15)&&preHijack(d))continue;
    const ask=d.from?askingFee(findPlayer(d.pid)?.p||{q:0,age:30,sApps:0},d.from):0,accept=d.fee>=ask*.95||rnd()<(d.stage==='countered'?.55:.3);
    if(accept){const rec=clubRecordFee(id);if(d.fee>rec&&d.fee>=Math.max(20,budgetFor(id)*.5)&&!d.approved){P_.record={pid:d.pid,name:d.name,fee:d.fee,from:d.from,rec};d.stage='record';continue}preFinish(id,d);continue}
    const next=Math.round(d.fee*1.15);
    if(next<=budgetFor(id)&&d.tries<(deadline?3:2)){d.fee=next;d.tries++;d.stage='countered';preLog(`${d.from?marketClubName(d.from):'His agent'} want more for ${d.name}: the director raises to £${next}k.`)}
    else{d.stage='walked';preLog(`The director walks away from ${d.name}: too expensive.`)}
  }
  /* 2. new targets for needs without a live deal */
  if(!deadline)for(const n of preTargets(id)){
    if(P_.deals.some(d=>d.pos===n.pos&&['bid','countered','record','signed'].includes(d.stage)))continue;
    const best=shopFor(id,n.pos,preMinQ(id,n),{dry:true});if(!best)continue;
    const open=best.from?Math.max(1,Math.round(best.fee*.85)):0;
    const d={pid:best.p.id,name:best.p.name,pos:n.pos,age:best.p.age,from:best.from,est:r1(best.seen??best.p.q),fee:open,premium:best.premium,tries:0,stage:'bid',why:n.why,chair:!!(S.ops.shortlist.find(e=>e.pid===best.p.id&&e.chair))};
    P_.deals.push(d);preLog(`The director ${best.from?`bids £${open}k for`:'offers terms to'} ${d.name} (${POS_ONE[n.pos]}).`);
    if(!best.from&&preFinish(id,d))continue;
  }
  /* 3. a bid for one of your best players (chairman's moment) */
  if(!P_.offer&&rnd()<(deadline?.4:.25)){const p=pick(topThree(id)),rich=allIds().filter(c=>c!==id&&CL(c).tier<=CL(id).tier&&F(c).cash>askingFee(p,id)*1.6);
    if(p&&rich.length){const by=pick(rich);P_.offer={pid:p.id,name:p.name,pos:p.pos,age:p.age,by,fee:Math.round(askingFee(p,id)*(1.1+rnd()*.35)),asked:false};preLog(`${CL(by).name} bid for ${p.name}.`)}}
  P_.wk++;return{ok:true};
}
/* the chairman's two decisions */
function preOffer(choice){
  const id=S.my,P_=PRE(),o=P_&&P_.offer;if(!o)return{ok:false,err:'No bid on the table'};const f=findPlayer(o.pid);
  if(!f||f.club!==id){P_.offer=null;return{ok:false,err:'He is no longer here'}}
  if(choice==='more'&&!o.asked){o.asked=true;if(rnd()<.5){o.fee=Math.round(o.fee*1.2);preLog(`${CL(o.by).name} raise their bid for ${o.name} to £${o.fee}k.`);return{ok:true,text:`They raised it to £${o.fee}k. Now decide.`}}P_.offer=null;preLog(`${CL(o.by).name} walk away from ${o.name}.`);return{ok:true,text:'They walked away.'}}
  if(choice==='accept'){S._chairSale=true;transfer(f.p,id,o.by,o.fee,'sold by the chairman');S._chairSale=false;P_.offer=null;preLog(`You sell ${o.name} to ${CL(o.by).name} for £${o.fee}k.`);confLog(id,o.fee>playerValue(f.p)*1.3?1:-3,o.fee>playerValue(f.p)*1.3?'A big fee for a star':'A star sold');return{ok:true,text:`${o.name} is sold for £${o.fee}k. The director will look for a replacement.`}}
  P_.offer=null;if(rnd()<.35){f.p.wantsOut=true;preLog(`You turn down the bid. ${o.name} is unhappy and wants to talk.`);return{ok:true,text:`Bid rejected. ${o.name} is unhappy.`}}
  preLog(`You turn down the bid for ${o.name}.`);return{ok:true,text:'Bid rejected. He stays.'};
}
function preRecord(yes){const id=S.my,P_=PRE(),r=P_&&P_.record;if(!r)return{ok:false,err:'Nothing to approve'};const d=P_.deals.find(x=>x.pid===r.pid);P_.record=null;
  if(!d)return{ok:false,err:'The deal has gone'};if(yes){d.approved=true;const ok=preFinish(id,d);return{ok:true,text:ok?`${d.name} signs for a club record £${d.fee}k.`:'The deal fell through at the last moment.'}}
  d.stage='walked';preLog(`You say no to a record fee for ${d.name}.`);return{ok:true,text:'No record fee. The director looks elsewhere.'}}
function prePrio(pos){const P_=PRE();if(!P_)return{ok:false,err:'The window is closed'};P_.prio=P_.prio===pos?null:pos;return{ok:true}}
function preBudget(){const f=F(S.my),cur=f.policy.spend??.5;if(cur>=1)return{ok:false,err:'The whole budget is already free'};return cmd('SetSquadPolicy',S.my,{spend:r2(Math.min(1,cur+.1))})}
