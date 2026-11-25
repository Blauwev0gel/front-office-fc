/* ================= The transfer summer (milestone M1, decisions D-G6 and D-L3-2b) =================
   A story over the pre-season, with the director as a person who carries it out and answers for it:
   1 summer meeting (squad, money, needs; the director proposes a plan in his own style) → 2 the signed summer brief
   (up to three goals, a budget level, a profile) → 3 the ticker: dated news each pre-season week (our bids, counters,
   hijacks, sales, rival clubs' real deals) → 4 deadline day → 5 the summer edition of the Echo → 6 the debrief in week 4,
   where every goal of the brief is judged with names. Two escalations come to the chairman: a bid for one of the three
   best players, and a fee above the club record. The season start still runs the normal window, which fills any gap left.
   Owns S.pre = {s, wk, brief, deals[], ticker[], offer, record, prio, top3[], sold[], debrief} for the player's club. No DOM. */
const PRE_WEEKS=4,DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],BUDGET_LV={cautious:{n:'Cautious',spend:.35,d:'Keep money back for the season'},normal:{n:'Normal',spend:.6,d:'A fair share of the cash'},allin:{n:'All-in',spend:.9,d:'Spend almost everything we have'}};
function PRE(){if(!S.my||S.week!==0)return null;return preState()}
function preState(){if(!S.pre||S.pre.s!==S.season)S.pre={s:S.season,wk:1,brief:null,deals:[],ticker:[],offer:null,record:null,prio:null,top3:[],sold:[],debrief:null,log:[]};if(!S.pre.ticker)S.pre.ticker=[];if(!S.pre.sold)S.pre.sold=[];return S.pre}
function preTick(t,kind){const P_=preState(),wk=P_.after?Math.min(PRE_WEEKS,P_.wk-1):P_.wk,d=P_.after?6:ri(0,6);P_.ticker.push({wk,d,t,kind:kind||'news'});if(P_.ticker.length>80)P_.ticker.shift()}
function preLog(t){preTick(t,'us')}
function topThree(id){return S.squads[id].filter(p=>!p.loan).slice().sort((a,b)=>b.q-a.q).slice(0,3)}
function clubRecordFee(id){return Math.max(0,...(S.mb||[]).filter(r=>r.s!=null).map(r=>r.in))}
function preTargets(id){const P_=preState(),needs=openNeeds().slice().sort((a,b)=>(b.pos===P_.prio)-(a.pos===P_.prio)||b.prio-a.prio);const seen=new Set();return needs.filter(n=>!seen.has(n.pos)&&seen.add(n.pos)).slice(0,3)}
function preMinQ(id,n){const sq=squadQuality(S.squads[id]);return n.kind==='hole'?sq-2.5:sq-1}

/* ----- 1. the summer meeting: what the director sees, and what he proposes ----- */
function dirStyle(id){const d=tdOf(id),t=d?d.traits:[];return t.some(x=>['ambitious','impulsive','vain'].includes(x))?'bold':t.some(x=>['cautious','patient','principled'].includes(x))?'careful':'steady'}
function summerMeeting(id){
  const sq=S.squads[id].filter(p=>!p.loan),lines={},q=squadQuality(S.squads[id]);
  for(const p of pickXI(S.squads[id]).map(x=>x.p)){const k=['GK','CB','FB'].includes(p.pos)?'defence':['DM','CM','AM'].includes(p.pos)?'midfield':'attack';(lines[k]=lines[k]||[]).push(p.q)}
  const avg=k=>lines[k]?r1(lines[k].reduce((a,v)=>a+v,0)/lines[k].length):0,order=['defence','midfield','attack'].sort((a,b)=>avg(b)-avg(a));
  const expiring=sq.filter(p=>p.contract<=1&&p.q>=q-.5).map(p=>p.name),surplus=sq.filter(p=>sq.filter(x=>x.pos===p.pos).length>REQ[p.pos]&&!topThree(id).includes(p)).sort((a,b)=>a.q-b.q).slice(0,3);
  const style=dirStyle(id),d=tdOf(id),needs=preTargets(id);
  const plan=style==='bold'?{budget:'allin',goals:needs.slice(0,2).map(n=>'sign:'+n.pos).concat(['keep3'])}:style==='careful'?{budget:'cautious',goals:['keep3',needs[0]?'sign:'+needs[0].pos:'young'].concat(['sales'])}:{budget:'normal',goals:needs.slice(0,1).map(n=>'sign:'+n.pos).concat(['keep3','young'])};
  return{strong:order[0],weak:order[2],avg:{defence:avg('defence'),midfield:avg('midfield'),attack:avg('attack')},expiring,surplus:surplus.map(p=>({name:p.name,pos:p.pos,value:Math.round(playerValue(p))})),
    cash:Math.round(F(id).cash),room:r1(wageCapK(id)-wageBillK(id)),needs,style,dir:d?d.name:'The director',plan};
}
/* the goals the chairman can put in the brief */
function briefOptions(id){
  const out=preTargets(id).map(n=>({k:'sign:'+n.pos,t:`Sign a ${POS_ONE[n.pos]}`,why:n.why}));
  out.push({k:'keep3',t:'Keep our three best players',why:topThree(id).map(p=>p.name).join(', ')});
  out.push({k:'young',t:'Sign players aged 23 or younger',why:'Buy for growth and a resale value'});
  out.push({k:'sales',t:`Raise £${Math.max(10,Math.round(budgetFor(id)*.4/5)*5)}k from sales`,why:'Sell what we do not need'});
  out.push({k:'cap',t:`Spend no more than £${Math.max(10,Math.round(budgetFor(id)*.6/5)*5)}k`,why:'Protect the cash for the season'});
  return out;
}
function signBrief(id,goals,budget,recruit){
  const P_=preState();if(P_.brief)return{ok:false,err:'The brief is already signed'};if(!goals.length||goals.length>3)return{ok:false,err:'Choose one to three goals'};if(!BUDGET_LV[budget])return{ok:false,err:'Choose a budget'};
  const opts=briefOptions(id);F(id).policy.spend=BUDGET_LV[budget].spend;if(recruit&&RECRUIT[recruit])F(id).policy.recruit=recruit;
  P_.top3=topThree(id).map(p=>({pid:p.id,name:p.name}));
  P_.brief={goals:goals.map(k=>{const o=opts.find(x=>x.k===k)||{t:k};const n=+(o.t.match(/£(\d+)k/)||[])[1]||0;return{k,t:o.t,n}}),budget,recruit:recruitStrategy(id),dir:tdOf(id)?.id||null,dirName:tdOf(id)?.name||'The director',startBudget:budgetFor(id)};
  preTick(`${P_.brief.dirName} signs the summer brief: ${P_.brief.goals.map(g=>g.t.toLowerCase()).join('; ')}.`,'us');return{ok:true};
}

/* ----- 3. the ticker: one pre-season week of the market ----- */
function preFinish(id,d){
  const f=findPlayer(d.pid);if(!f||f.club!==d.from){d.stage='gone';preTick(`${d.name} is no longer available.`,'bad');return false}
  if(d.from&&foreignSeller(d.from)){if(!foreignMove(f.p,d.from,id,d.fee,'director scouting')){d.stage='walked';return false}}else if(d.from)transfer(f.p,d.from,id,d.fee,'buy',d.premium);else signFree(f.p,id);
  recordDecision(id,d.pos,{p:f.p,from:d.from,fee:d.fee,seen:d.est},[],false);d.stage='signed';d.age=f.p.age;
  preTick(d.fee?`✍ ${d.name} signs from ${marketClubName(d.from)} for £${d.fee}k.`:`✍ ${d.name} joins on a free transfer.`,'good');return true;
}
function preHijack(d){
  const f=findPlayer(d.pid);if(!f)return false;const rivals=allIds().filter(c=>c!==S.my&&c!==f.club&&F(c).cash>d.fee*1.5&&Math.abs(CL(c).tier-CL(S.my).tier)<=1);if(!rivals.length)return false;
  const r=pick(rivals),fee=Math.max(1,Math.round(d.fee*1.1));
  if(f.club&&foreignSeller(f.club)){if(!foreignMove(f.p,f.club,r,fee,'rival bid'))return false}else if(f.club)transfer(f.p,f.club,r,fee,'buy');else signFree(f.p,r);
  d.stage='hijacked';d.rival=r;preTick(`✗ ${CL(r).name} hijack the deal for ${d.name} (£${fee}k).`,'bad');return true;
}
/* when money is short (or the brief asks for sales), the director sells a surplus player to a club that needs one */
function preSell(id){
  const P_=preState(),sq=S.squads[id],keep=new Set(topThree(id).map(p=>p.id)),cand=sq.filter(p=>!p.loan&&!keep.has(p.id)&&sq.filter(x=>x.pos===p.pos&&!x.loan).length>REQ[p.pos]).sort((a,b)=>a.q-b.q);
  for(const p of cand){const fee=Math.max(1,Math.round(askingFee(p,id)*.9)),buyers=allIds().filter(c=>c!==id&&F(c).cash>fee*2&&S.squads[c].filter(x=>x.pos===p.pos).length<=REQ[p.pos]);
    if(buyers.length){const b=pick(buyers);transfer(p,id,b,fee,'sold by the director');P_.sold.push({pid:p.id,name:p.name,fee,to:b});preTick(`→ ${p.name} is sold to ${CL(b).name} for £${fee}k.`,'us');return true}}
  return false;
}
/* the wider market: a share of the other clubs does its business this week, and the ticker shows the biggest deals */
function preRivals(id){
  const mark=S.evn||0,others=shuffle(allIds().filter(c=>c!==id)).slice(0,Math.ceil(allIds().length*.2));
  for(const c of others)squadManager(c,'summer');
  const deals=eventsSince(mark).filter(e=>e.t==='Transfer'&&e.c!==id&&e.c2!==id&&e.fee).sort((a,b)=>b.fee-a.fee),tier=CL(id).tier;
  const near=deals.filter(e=>Math.abs(CL(e.c).tier-tier)<=1).slice(0,3);for(const e of near)preTick(e.text,'world');
  if(!near.length&&deals[0])preTick(deals[0].text,'world');
}
function briefWants(goal){const P_=preState();return !!(P_.brief&&P_.brief.goals.some(g=>g.k===goal))}
function spentThisSummer(){return preState().deals.filter(d=>d.stage==='signed').reduce((a,d)=>a+d.fee,0)}
function preWeek(){
  const id=S.my,P_=PRE();if(!P_||P_.wk>PRE_WEEKS)return{ok:false,err:'The window is closed'};if(!P_.brief)return{ok:false,err:'Sign the summer brief first'};P_.after=false;const deadline=P_.wk===PRE_WEEKS;
  if(P_.offer){preTick(`You let the bid for ${P_.offer.name} lapse.`,'us');P_.offer=null}
  if(P_.record){const d=P_.deals.find(x=>x.pid===P_.record.pid);if(d)d.stage='walked';preTick(`The record deal for ${P_.record.name} falls through.`,'bad');P_.record=null}
  if(deadline)preTick('⏰ Deadline day: the window shuts tonight.','news');
  preRivals(id);
  const cap=(P_.brief.goals.find(g=>g.k==='cap')||{}).n||Infinity;
  /* live deals move on */
  for(const d of P_.deals.filter(x=>['bid','countered'].includes(x.stage))){
    if(rnd()<(deadline?.25:.15)&&preHijack(d))continue;
    const f=findPlayer(d.pid);if(!f){d.stage='gone';continue}
    const ask=d.from?askingFee(f.p,d.from):0,accept=d.fee>=ask*.95||rnd()<(d.stage==='countered'?.55:.3);
    if(accept){const rec=clubRecordFee(id);if(d.fee>rec&&d.fee>=Math.max(20,P_.brief.startBudget*.5)&&!d.approved){P_.record={pid:d.pid,name:d.name,fee:d.fee,from:d.from,rec};d.stage='record';preTick(`${marketClubName(d.from)} accept £${d.fee}k for ${d.name}: a club record, the director needs your word.`,'warn');continue}preFinish(id,d);continue}
    const next=Math.round(d.fee*1.15);
    if(next<=budgetFor(id)&&spentThisSummer()+next<=cap&&d.tries<(deadline?3:2)){d.fee=next;d.tries++;d.stage='countered';preTick(`${d.from?marketClubName(d.from):'His agent'} want more for ${d.name}: the director raises to £${next}k.`,'us')}
    else{d.stage='walked';preTick(`The director walks away from ${d.name}: too expensive.`,'off')}
  }
  /* new targets: needs first, the brief's sign-goals on top */
  const budget=budgetFor(id);
  if(!deadline||P_.deals.every(d=>d.stage!=='bid'&&d.stage!=='countered'))for(const n of preTargets(id).sort((a,b)=>briefWants('sign:'+b.pos)-briefWants('sign:'+a.pos))){
    if(P_.deals.some(d=>d.pos===n.pos&&['bid','countered','record','signed'].includes(d.stage)))continue;
    let best=shopFor(id,n.pos,preMinQ(id,n),{dry:true});
    if(best&&briefWants('young')&&best.p.age>23){const alt=shopFor(id,n.pos,preMinQ(id,n)-.5,{dry:true});if(alt&&alt.p.age<=23)best=alt}
    if(!best){preTick(budget<3?`No money for a ${POS_ONE[n.pos]}: the director looks at free agents only.`:`The director finds no ${POS_ONE[n.pos]} worth the money yet.`,'off');continue}
    if(spentThisSummer()+best.fee>cap){preTick(`A ${POS_ONE[n.pos]} would break the spending cap in the brief: the director holds back.`,'off');continue}
    const open=best.from?Math.max(1,Math.round(best.fee*.85)):0;
    const d={pid:best.p.id,name:best.p.name,pos:n.pos,age:best.p.age,from:best.from,est:r1(best.seen??best.p.q),fee:open,premium:best.premium,tries:0,stage:'bid',why:n.why,chair:!!(S.ops.shortlist.find(e=>e.pid===best.p.id&&e.chair))};
    P_.deals.push(d);preTick(best.from?`The director bids £${open}k for ${d.name} (${POS_ONE[n.pos]}, ${d.age}) at ${marketClubName(best.from)}.`:`The director offers terms to ${d.name} (${POS_ONE[n.pos]}, ${d.age}).`,'us');
    if(!best.from)preFinish(id,d);
  }
  /* sales: when money is short, or the brief asks for them */
  const salesGoal=(P_.brief.goals.find(g=>g.k==='sales')||{}).n||0,raised=P_.sold.reduce((a,s)=>a+s.fee,0);
  if((budget<5&&!P_.sold.length)||(salesGoal&&raised<salesGoal&&rnd()<.6))preSell(id);
  /* a bid for one of our best players: the chairman decides */
  if(!P_.offer&&rnd()<(deadline?.4:.25)){const p=pick(topThree(id)),rich=p?allIds().filter(c=>c!==id&&CL(c).tier<=CL(id).tier&&F(c).cash>askingFee(p,id)*1.6):[];
    if(p&&rich.length){const by=pick(rich);P_.offer={pid:p.id,name:p.name,pos:p.pos,age:p.age,by,fee:Math.round(askingFee(p,id)*(1.1+rnd()*.35)),asked:false};preTick(`❗ ${CL(by).name} bid £${P_.offer.fee}k for ${p.name}.`,'warn')}}
  P_.wk++;P_.after=true;return{ok:true};
}
/* the chairman's two decisions */
function preOffer(choice){
  const id=S.my,P_=PRE(),o=P_&&P_.offer;if(!o)return{ok:false,err:'No bid on the table'};const f=findPlayer(o.pid);
  if(!f||f.club!==id){P_.offer=null;return{ok:false,err:'He is no longer here'}}
  if(choice==='more'&&!o.asked){o.asked=true;if(rnd()<.5){o.fee=Math.round(o.fee*1.2);preTick(`${CL(o.by).name} raise their bid for ${o.name} to £${o.fee}k.`,'warn');return{ok:true,text:`They raised it to £${o.fee}k. Now decide.`}}P_.offer=null;preTick(`${CL(o.by).name} walk away from ${o.name}.`,'off');return{ok:true,text:'They walked away.'}}
  if(choice==='accept'){S._chairSale=true;transfer(f.p,id,o.by,o.fee,'sold by the chairman');S._chairSale=false;P_.sold.push({pid:o.pid,name:o.name,fee:o.fee,to:o.by,star:true});P_.offer=null;preTick(`→ You sell ${o.name} to ${CL(o.by).name} for £${o.fee}k.`,'us');confLog(id,o.fee>playerValue(f.p)*1.3?1:-3,o.fee>playerValue(f.p)*1.3?'A big fee for a star':'A star sold');return{ok:true,text:`${o.name} is sold for £${o.fee}k. The director will look for a replacement.`}}
  P_.offer=null;if(rnd()<.35){f.p.wantsOut=true;preTick(`You turn down the bid. ${o.name} is unhappy and wants to talk.`,'bad');return{ok:true,text:`Bid rejected. ${o.name} is unhappy.`}}
  preTick(`You turn down the bid for ${o.name}. He stays.`,'us');return{ok:true,text:'Bid rejected. He stays.'};
}
function preRecord(yes){const id=S.my,P_=PRE(),r=P_&&P_.record;if(!r)return{ok:false,err:'Nothing to approve'};const d=P_.deals.find(x=>x.pid===r.pid);P_.record=null;
  if(!d)return{ok:false,err:'The deal has gone'};if(yes){d.approved=true;const ok=preFinish(id,d);return{ok:true,text:ok?`${d.name} signs for a club record £${d.fee}k.`:'The deal fell through at the last moment.'}}
  d.stage='walked';preTick(`You say no to a record fee for ${d.name}.`,'off');return{ok:true,text:'No record fee. The director looks elsewhere.'}}
function prePrio(pos){const P_=PRE();if(!P_)return{ok:false,err:'The window is closed'};P_.prio=P_.prio===pos?null:pos;return{ok:true}}
function preBudget(){const f=F(S.my),cur=f.policy.spend??.5;if(cur>=1)return{ok:false,err:'The whole budget is already free'};return cmd('SetSquadPolicy',S.my,{spend:r2(Math.min(1,cur+.1))})}

/* ----- 5. the summer edition: the headline of the window ----- */
function summerEdition(){
  const P_=S.pre;if(!P_||P_.s!==S.season)return null;const ins=P_.deals.filter(d=>d.stage==='signed'),outs=P_.sold,big=ins.slice().sort((a,b)=>b.fee-a.fee)[0],star=outs.find(s=>s.star);
  const head=star?`${star.name} leaves for £${star.fee}k`:big&&big.fee?`${big.name} arrives for £${big.fee}k`:ins.length?`${ins.length} new face${ins.length>1?'s':''}, little money spent`:outs.length?'A summer of selling':'A quiet summer at the club';
  return{head,ins,outs,spent:ins.reduce((a,d)=>a+d.fee,0),raised:outs.reduce((a,s)=>a+s.fee,0),world:P_.ticker.filter(t=>t.kind==='world').slice(-3)};
}
/* ----- 6. the debrief: four weeks in, the brief is judged with names ----- */
function briefJudge(id){
  const P_=S.pre;if(!P_||!P_.brief)return[];const ins=P_.deals.filter(d=>d.stage==='signed'),spent=ins.reduce((a,d)=>a+d.fee,0),raised=P_.sold.reduce((a,s)=>a+s.fee,0);
  return P_.brief.goals.map(g=>{
    if(g.k.startsWith('sign:')){const pos=g.k.slice(5),who=ins.find(d=>d.pos===pos||NEAR[pos]?.includes(d.pos));return{t:g.t,met:!!who,how:who?`${who.name} signed`:'Nobody signed'}}
    if(g.k==='keep3'){const gone=P_.top3.filter(x=>{const f=findPlayer(x.pid);return!f||f.club!==id});return{t:g.t,met:!gone.length,how:gone.length?`${gone.map(x=>x.name).join(', ')} left`:P_.top3.map(x=>x.name).join(', ')+' stayed'}}
    if(g.k==='young'){const old=ins.filter(d=>d.age>23);return{t:g.t,met:ins.length>0&&!old.length,how:ins.length?ins.map(d=>`${d.name} (${d.age})`).join(', '):'No signings'}}
    if(g.k==='sales')return{t:g.t,met:raised>=g.n,how:`£${raised}k raised`};
    if(g.k==='cap')return{t:g.t,met:spent<=g.n,how:`£${spent}k spent`};
    return{t:g.t,met:false,how:''};
  });
}
function debriefDue(){const P_=S.pre;return !!(S.my&&P_&&P_.s===S.season&&P_.brief&&!P_.debrief&&S.week>=4)}
function debriefChoose(back){
  const id=S.my,P_=S.pre;if(!debriefDue())return{ok:false,err:'Nothing to judge'};const res=briefJudge(id),met=res.filter(r=>r.met).length,d=tdOf(id);
  P_.debrief={met,total:res.length,back:!!back,s:S.season};
  if(d){d.loy=clamp((d.loy??50)+(back?6:-8)+(met-res.length/2)*4,0,100);d.mem=d.mem||[];d.mem.push({s:S.season,t:back?'backed after the summer':'warned after the summer',met})}
  const warnings=(d&&d.mem||[]).filter(m=>m.t==='warned after the summer').length;
  emit('Club',id,`Summer debrief: ${met} of ${res.length} goals met. You ${back?'back':'warn'} ${P_.brief.dirName}.`);
  return{ok:true,text:back?`You back ${P_.brief.dirName}. ${met} of ${res.length} goals met.`:`You warn ${P_.brief.dirName}.${warnings>=2?' A second warning: you can replace him under Club → Football.':''}`};
}
