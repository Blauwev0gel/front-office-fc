/* ================= The transfer summer (milestone M1, decisions D-G6 and D-L3-2b) =================
   A story over the pre-season, with the director as a person who carries it out and answers for it:
   1 summer meeting (squad, money, needs; the director proposes a plan in his own style) → 2 the signed summer brief
   (up to three goals, a budget level, a profile) → 3 the ticker: dated news each pre-season week (our bids, counters,
   hijacks, sales, rival clubs' real deals) → 4 deadline day → 5 the summer edition of the Echo → 6 the debrief in week 4,
   where every goal of the brief is judged with names. Two escalations come to the chairman: a bid for one of the three
   best players, and a fee above the club record. The interactive summer owns the human club's market; finalisation occurs before the Echo.
   Owns S.pre = {s, wk, brief, deals[], ticker[], offer, record, prio, top3[], sold[], debrief} for the player's club. No DOM. */
const PRE_WEEKS=4,DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun',,,,'09:00','15:00','22:00'],BUDGET_LV={cautious:{n:'Cautious',spend:.35,d:'Keep money back for the season'},normal:{n:'Normal',spend:.6,d:'A fair share of the cash'},allin:{n:'All-in',spend:.9,d:'Spend almost everything we have'}};
/* M4: the same machinery runs the winter window. Winter: meeting two weeks before WINTER_WEEK, a brief with ONE goal,
   two window weeks played inside the season (WINTER_WEEK-1 and WINTER_WEEK = deadline day), the winter edition, a debrief four weeks on. */
function inWinter(){return !!S.my&&S.week>=WINTER_WEEK-3&&S.week<=WINTER_WEEK+5}
function winWeeks(P_){return P_&&P_.kind==='winter'?2:PRE_WEEKS}
function PRE(){if(!S.my)return null;if(S.week===0||inWinter())return preState();return null}
function mkWin(kind){return{kind,s:S.season,wk:1,brief:null,deals:[],ticker:[],offer:null,record:null,prio:null,top3:[],sold:[],debrief:null,log:[]}}
function preState(){
  if(S.my&&S.week>0&&inWinter()){if(!S.win||S.win.s!==S.season)S.win=mkWin('winter');return S.win}
  if(!S.pre||S.pre.s!==S.season)S.pre=mkWin('summer');if(!S.pre.ticker)S.pre.ticker=[];if(!S.pre.sold)S.pre.sold=[];if(!S.pre.kind)S.pre.kind='summer';return S.pre}
function preTick(t,kind){const P_=preState(),wk=P_.after?Math.min(winWeeks(P_),P_.wk-1):P_.wk,d=P_.after?6:P_.round!=null?10+P_.round:ri(0,6);P_.ticker.push({wk,d,t,kind:kind||'news'});if(P_.ticker.length>80)P_.ticker.shift()}
function preLog(t){preTick(t,'us')}
function topThree(id){return S.squads[id].filter(p=>!p.loan).slice().sort((a,b)=>b.q-a.q).slice(0,3)}
function clubRecordFee(id){return Math.max(0,...(S.mb||[]).filter(r=>r.s!=null).map(r=>r.in))}
/* Persisted interactive summer lifecycle and actual movement ledger. */
function interactiveSummer(){return !!(S.my&&S.week===0&&S.pre&&S.pre.s===S.season&&S.pre.brief)}
function summerLedger(P_){
  if(!P_.movements)P_.movements={ins:P_.deals.filter(d=>d.stage==='signed').map(d=>({...d})),outs:P_.sold.map(d=>({...d})),other:[]};
  return P_.movements;
}
function noteSummerMovement(e){
  if(!interactiveSummer()||S.pre.finalized||!['Transfer','Signing','InternationalTransfer','Released','Loan'].includes(e.t))return;
  const id=S.my,from=e.t==='InternationalTransfer'?e.from:e.t==='Transfer'?e.c2:e.t==='Released'||e.t==='Loan'?e.c:null,to=e.t==='InternationalTransfer'?e.to:e.t==='Loan'?e.c2:e.t==='Released'?null:e.c;
  if(from!==id&&to!==id)return;
  const L=summerLedger(S.pre),f=findPlayer(e.pid),p=f&&f.p;
  const row={pid:e.pid,name:p?p.name:e.text,pos:p&&p.pos,age:p&&p.age,fee:e.fee||0,from,to,stage:'signed',event:e.n,text:e.text};
  if(e.t==='Loan'||e.t==='Released'){L.other.push(row);return}
  if(to===id)L.ins.push(row);else L.outs.push({...row,star:!!S._chairSale});
}
function finalizeSummer(){
  if(!interactiveSummer())return{ok:false,err:'No signed summer brief'};
  const P_=S.pre;
  if(P_.finalized)return{ok:true};
  if(P_.wk<=PRE_WEEKS)return{ok:false,err:'The market is still open'};
  if(P_.offer||P_.record)return{ok:false,err:'Resolve the outstanding decision first'};
  summerLedger(P_);
  for(const d of P_.deals)if(['bid','countered','record'].includes(d.stage)){d.stage='walked';preTick(`The window closes without a deal for ${d.name}.`,'off')}
  summerWindow(true);
  P_.finalized=true;
  preTick('The summer window is closed.','news');
  return{ok:true};
}
function preTargets(id){const P_=preState(),needs=openNeeds().slice().sort((a,b)=>(b.pos===P_.prio)-(a.pos===P_.prio)||b.prio-a.prio);const seen=new Set();return needs.filter(n=>!seen.has(n.pos)&&seen.add(n.pos)).slice(0,3)}
function preMinQ(id,n){const sq=squadQuality(S.squads[id]);return n.kind==='hole'?sq-2.5:sq-1}

/* ----- 1. the summer meeting: what the director sees, and what he proposes ----- */
function dirStyle(id){const d=tdOf(id),t=d?d.traits:[],last=(d&&d.mem||[]).slice(-1)[0];if(last&&/warned/.test(last.t))return'careful';if(last&&/backed/.test(last.t)&&t.some(x=>['ambitious','impulsive','vain'].includes(x)))return'bold';return t.some(x=>['ambitious','impulsive','vain'].includes(x))?'bold':t.some(x=>['cautious','patient','principled'].includes(x))?'careful':'steady'}
const STYLE={bold:{open:.95,raise:.2,tries:3,word:'goes in high'},steady:{open:.85,raise:.15,tries:2,word:'opens sensibly'},careful:{open:.78,raise:.1,tries:1,word:'starts low'}};
function weakestAt(id,pos){const xi=pickXI(S.squads[id]).filter(x=>x.slot===pos||x.p.pos===pos).map(x=>x.p);const w=xi.sort((a,b)=>a.q-b.q)[0];return w?{name:w.name,q:r1(w.q)}:{name:null,q:0}}
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
function squadSaleValue(id){const keep=new Set(topThree(id).map(p=>p.id)),sq=S.squads[id],spare=sq.filter(p=>!p.loan&&!keep.has(p.id)&&sq.filter(x=>x.pos===p.pos&&!x.loan).length>REQ[p.pos]).map(p=>askingFee(p,id)).sort((a,b)=>b-a);return spare.slice(0,2).reduce((a,v)=>a+v,0)}
function briefOptions(id){
  const out=preTargets(id).map(n=>{const w=weakestAt(id,n.pos);return{k:'sign:'+n.pos,t:`Sign a starting ${POS_ONE[n.pos]}`,why:w.name?`Better than ${w.name} (${w.q}) · ${n.why}`:n.why}});
  out.push({k:'keep3',t:'Keep our three best players',why:topThree(id).map(p=>p.name).join(', ')});
  out.push({k:'young',t:'Sign players aged 23 or younger',why:'Buy for growth and a resale value'});
  out.push({k:'sales',t:`Raise £${Math.max(15,Math.round(squadSaleValue(id)*.8/5)*5)}k from sales`,why:'Sell what we do not need'});
  out.push({k:'cap',t:`Spend no more than £${Math.max(10,Math.round(budgetFor(id)*.6/5)*5)}k`,why:'Protect the cash for the season'});
  return out;
}
function signBrief(id,goals,budget,recruit){
  const P_=preState();if(P_.brief)return{ok:false,err:'The brief is already signed'};const maxG=P_.kind==='winter'?1:3;if(!goals.length||goals.length>maxG)return{ok:false,err:maxG===1?'Choose one goal':'Choose one to three goals'};if(!BUDGET_LV[budget])return{ok:false,err:'Choose a budget'};
  const opts=briefOptions(id);F(id).policy.spend=BUDGET_LV[budget].spend;if(recruit&&RECRUIT[recruit])F(id).policy.recruit=recruit;
  P_.top3=topThree(id).map(p=>({pid:p.id,name:p.name}));P_.base={};for(const n of preTargets(id))P_.base[n.pos]=weakestAt(id,n.pos);P_.style=dirStyle(id);P_.targets={};P_.list=P_.list||[];
  P_.brief={goals:goals.map(k=>{const o=opts.find(x=>x.k===k)||{t:k};const n=+(o.t.match(/£(\d+)k/)||[])[1]||0;return{k,t:o.t,n}}),budget,recruit:recruitStrategy(id),dir:tdOf(id)?.id||null,dirName:tdOf(id)?.name||'The director',startBudget:budgetFor(id)};
  if(P_.kind==='summer')summerLedger(P_);
  preTick(`${P_.brief.dirName} signs the ${P_.kind} brief: ${P_.brief.goals.map(g=>g.t.toLowerCase()).join('; ')}.`,'us');P_.ticker[P_.ticker.length-1].d=-1;return{ok:true};
}

/* ----- 3. the ticker: one pre-season week of the market ----- */
function preFinish(id,d){
  const f=findPlayer(d.pid);if(!f||f.club!==d.from){d.stage='gone';preTick(`${d.name} is no longer available.`,'bad');return false}
  const cap=(preState().brief.goals.find(g=>g.k==='cap')||{}).n||Infinity;
  if(d.fee>budgetFor(id)||spentThisSummer()+d.fee>cap){d.stage='walked';preTick(`The fee for ${d.name} no longer fits the budget.`,'off');return false}
  if(d.from&&foreignSeller(d.from)){if(!foreignMove(f.p,d.from,id,d.fee,'director scouting')){d.stage='walked';return false}}else if(d.from)transfer(f.p,d.from,id,d.fee,'buy',d.premium);else signFree(f.p,id);
  recordDecision(id,d.pos,{p:f.p,from:d.from,fee:d.fee,seen:d.est},[],false);d.stage='signed';d.age=f.p.age;buildPlan(id);
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
  const mark=S.evn||0,winter=preState().kind==='winter',others=shuffle(allIds().filter(c=>c!==id)).slice(0,Math.ceil(allIds().length*(winter?.15:.2)));
  for(const c of others)squadManager(c,winter?'winter':'summer');
  const deals=eventsSince(mark).filter(e=>e.t==='Transfer'&&e.c!==id&&e.c2!==id&&e.fee).sort((a,b)=>b.fee-a.fee),tier=CL(id).tier;
  const near=deals.filter(e=>Math.abs(CL(e.c).tier-tier)<=1).slice(0,3);for(const e of near)preTick(e.text,'world');
  if(!near.length&&deals[0])preTick(deals[0].text,'world');
}
/* the director's candidates for a need: up to three, with what they would mean for the squad */
function preCandidates(id,n){
  const P_=preState(),base=weakestAt(id,n.pos).q,minQ=preMinQ(id,n),budget=budgetFor(id),fav=P_.fav&&P_.fav[n.pos];
  const seen=new Set(),pool=[...shortlistCandidates(id,n.pos),...scoutPool(id,n.pos,undefined,true)].filter(c=>c&&c.p&&!seen.has(c.p.id)&&seen.add(c.p.id));
  const out=[];for(const c of pool){const p=c.p;if(P_.tried&&P_.tried.includes(p.id))continue;const fee=c.from?askingFee(p,c.from):0;if(fee>Math.max(3,budget*1.3))continue;
    if(c.from&&!foreignSeller(c.from)&&!sellerAgrees(p,c.from,fee,id))continue;if(c.from&&foreignSeller(c.from)&&!playerAcceptsMove(p,c.from,id))continue;
    const sl=shortlistEntry(p.id),est=r1(sl&&sl.obs?sl.est:p.q+(rnd()+rnd()-1)*1.2*scoutNoise(id)),doubt=sl&&sl.obs?scoutRange(id,sl.obs):r1(1.2*scoutNoise(id));if(est<minQ-(p.age<=23&&p.pa>=base?1.5:0))continue;
    const starter=est>=base+.2,ceil=r1(Math.max(est,p.pa+(rnd()+rnd()-1)*1.5*scoutNoise(id)));
    out.push({pid:p.id,name:p.name,age:p.age,pos:n.pos,from:c.from,fee,wage:Math.round(wageFor(p.q)),est,doubt,ceil,starter,base,chair:!!(sl&&sl.chair),premium:c.premium})}
  /* three profiles, so the choice means something: ready now, for the future, a bargain */
  const now=out.slice().sort((a,b)=>b.est-a.est)[0],fut=out.filter(x=>x.age<=23&&x!==now).sort((a,b)=>b.ceil-a.ceil)[0],bar=out.filter(x=>x!==now&&x!==fut).sort((a,b)=>(b.est-base+3)/(b.fee+5)-(a.est-base+3)/(a.fee+5))[0];
  const picks=[now&&{...now,type:'Ready now'},fut&&{...fut,type:'For the future'},bar&&{...bar,type:'Bargain'}].filter(Boolean);
  const first=fav&&picks.find(x=>x.pid===fav)||(briefWants('young')&&picks.find(x=>x.type==='For the future'))||((briefWants('cap')||briefWants('sales'))&&picks.find(x=>x.type==='Bargain'))||picks.find(x=>x.chair)||picks[0];
  return first?[first,...picks.filter(x=>x!==first)]:picks;
}
function preFavour(pid){const P_=PRE();if(!P_)return{ok:false,err:'The window is closed'};for(const pos in P_.targets){const c=P_.targets[pos].find(x=>x.pid===pid);if(c){P_.fav=P_.fav||{};P_.fav[pos]=pid;if(typeof chairRecommend==='function'&&S.scout)try{SC().gems.some(g=>g.pid===pid)&&chairRecommend(S.my,pid)}catch(e){}preTick(`You tell the director you rate ${c.name}.`,'us');return{ok:true,text:`The director will go for ${c.name} first if the money allows.`}}}return{ok:false,err:'Not on the board'}}
/* the transfer list: players the chairman makes available; the director sells them for a fair bid */
function preListToggle(pid){const P_=PRE();if(!P_)return{ok:false,err:'The window is closed'};P_.list=P_.list||[];if(topThree(S.my).some(p=>p.id===pid))return{ok:false,err:'One of the three best: bids for him come to you'};const i=P_.list.indexOf(pid);if(i>=0)P_.list.splice(i,1);else P_.list.push(pid);return{ok:true,on:i<0}}
function preListWeek(id){const P_=preState();P_.list=P_.list||[];
  for(const pid of P_.list.slice()){const p=S.squads[id].find(x=>x.id===pid);if(!p){P_.list.splice(P_.list.indexOf(pid),1);continue}if(rnd()>.5)continue;
    const ask=askingFee(p,id),bid=Math.max(1,Math.round(ask*(.75+rnd()*.4))),buyers=allIds().filter(c=>c!==id&&F(c).cash>bid*2);if(!buyers.length)continue;const b=pick(buyers);
    if(bid>=ask*.85){transfer(p,id,b,bid,'sold by the director');P_.sold.push({pid,name:p.name,fee:bid,to:b});P_.list.splice(P_.list.indexOf(pid),1);preTick(`→ ${p.name} is sold to ${CL(b).name} for £${bid}k.`,'us')}
    else preTick(`${CL(b).name} offer £${bid}k for ${p.name}; the director wants at least £${Math.round(ask*.85)}k.`,'off')}
  /* interest in a player who is not on the list */
  if(rnd()<.35){const keep=new Set(topThree(id).map(p=>p.id)),c=S.squads[id].filter(p=>!p.loan&&!keep.has(p.id)&&!P_.list.includes(p.id)&&p.q>=squadQuality(S.squads[id])-1.2);if(c.length){const p=pick(c),b=pick(allIds().filter(x=>x!==id));P_.interest={pid:p.id,name:p.name,by:b,fee:Math.round(askingFee(p,id))};preTick(`${CL(b).name} are asking about ${p.name} (around £${P_.interest.fee}k). Make him available?`,'warn')}}
}
/* pre-season football: a friendly a week, where new faces show themselves */
function preFriendly(id){const P_=preState();if(P_.kind!=='summer')return;const opp=pick(allIds().filter(c=>c!==id&&CL(c).tier>=CL(id).tier));const d=teamStrength(id)-teamStrength(opp)+3,gf=Math.min(5,Math.max(0,Math.round(1.3+d/12+rnd()*2-1))),ga=Math.min(5,Math.max(0,Math.round(1+(-d)/12+rnd()*2-1)));
  const nu=P_.deals.filter(x=>x.stage==='signed'),star=nu.length&&gf?pick(nu).name:null;preTick(`Friendly: ${CL(id).name} ${gf}–${ga} ${CL(opp).name}.${star?` ${star} scores on his first outing.`:''}`,'news')}
function briefWants(goal){const P_=preState();return !!(P_.brief&&P_.brief.goals.some(g=>g.k===goal))}
function spentThisSummer(){const P_=preState();return (P_.movements?P_.movements.ins:P_.deals.filter(d=>d.stage==='signed')).reduce((a,d)=>a+d.fee,0)}
function preWeek(){
  const id=S.my,P_=PRE();if(!P_||P_.wk>winWeeks(P_))return{ok:false,err:'The window is closed'};if(!P_.brief)return{ok:false,err:'Sign the brief first'};P_.after=false;const deadline=P_.wk===winWeeks(P_);
  P_.targets=P_.targets||{};P_.tried=P_.tried||[];P_.list=P_.list||[];const ST=STYLE[P_.style||dirStyle(id)];
  if(P_.offer){preTick(`You let the bid for ${P_.offer.name} lapse.`,'us');P_.offer=null}
  if(P_.record){const d=P_.deals.find(x=>x.pid===P_.record.pid);if(d)d.stage='walked';preTick(`The record deal for ${P_.record.name} falls through.`,'bad');P_.record=null}
  P_.interest=null;
  preRivals(id);preFriendly(id);preListWeek(id);buildPlan(id);
  const cap=(P_.brief.goals.find(g=>g.k==='cap')||{}).n||Infinity;
  /* deadline day is three rounds: 09:00, 15:00, 22:00 */
  const rounds=deadline?3:1;
  for(let r=0;r<rounds;r++){P_.round=deadline?r:null;if(deadline)preTick(['⏰ 09:00 · Deadline day: the window shuts at 23:00.','⏰ 15:00 · Eight hours left.','⏰ 22:00 · The last hour.'][r],'news');
  /* live deals move on, in the director's own style */
  for(const d of P_.deals.filter(x=>['bid','countered'].includes(x.stage))){
    if(rnd()<(deadline?.12:.12)&&preHijack(d)){P_.tried.push(d.pid);continue}
    const f=findPlayer(d.pid);if(!f){d.stage='gone';P_.tried.push(d.pid);continue}
    const ask=d.from?askingFee(f.p,d.from):0,accept=d.fee>=ask*.95||rnd()<(d.stage==='countered'?.5:.25);
    if(accept){const rec=clubRecordFee(id);if(d.fee>rec&&d.fee>=Math.max(20,P_.brief.startBudget*.5)&&!d.approved){if(P_.record)continue;P_.record={pid:d.pid,name:d.name,fee:d.fee,from:d.from,rec};d.stage='record';preTick(`${marketClubName(d.from)} accept £${d.fee}k for ${d.name}: a club record, the director needs your word.`,'warn');continue}preFinish(id,d);continue}
    const next=Math.round(d.fee*(1+ST.raise));
    if(next<=budgetFor(id)&&spentThisSummer()+next<=cap&&d.tries<ST.tries+(deadline?1:0)){d.fee=next;d.tries++;d.stage='countered';preTick(`${d.from?marketClubName(d.from):'His agent'} want more for ${d.name}: the director raises to £${next}k.`,'us')}
    else{d.stage='walked';P_.tried.push(d.pid);preTick(`The director walks away from ${d.name}: ${next>budgetFor(id)?'the money is not there':'not at that price'}.`,'off')}
  }
  /* each open need: a board of candidates; the director goes for the best (or the one you rate), Plan B after a failure */
  const budget=budgetFor(id);
  for(const n of preTargets(id).sort((a,b)=>briefWants('sign:'+b.pos)-briefWants('sign:'+a.pos))){
    if(P_.deals.some(d=>d.pos===n.pos&&(['bid','countered','record'].includes(d.stage)||(d.stage==='signed'&&n.kind!=='hole'))))continue;
    const cands=preCandidates(id,n);P_.targets[n.pos]=cands;
    const c=cands[0];
    if(!c){if(!deadline||r===0)preTick(budget<3?`No money for a ${POS_ONE[n.pos]}: the director looks at free agents only.`:`The director finds no ${POS_ONE[n.pos]} worth the money yet.`,'off');continue}
    if(spentThisSummer()+c.fee>cap){preTick(`A ${POS_ONE[n.pos]} would break the spending cap in the brief: the director holds back.`,'off');continue}
    const planB=P_.deals.some(d=>d.pos===n.pos);
    const open=c.from?Math.max(1,Math.round(c.fee*ST.open)):0;
    const d={pid:c.pid,name:c.name,pos:n.pos,age:c.age,from:c.from,est:c.est,fee:open,premium:c.premium,tries:0,stage:'bid',why:n.why,chair:c.chair,starter:c.starter,base:c.base};
    P_.deals.push(d);
    const what=c.starter?`would start ahead of ${weakestAt(id,n.pos).name||'the current man'}`:'cover for the squad';
    preTick(`${planB?'Plan B: ':''}The director ${c.from?`${ST.word}: £${open}k for`:'offers terms to'} ${d.name} (${POS_ONE[n.pos]}, ${d.age}, ~${c.est}) — ${what}.`,'us');
    if(!c.from)preFinish(id,d);
  }}
  P_.round=null;
  /* sales: when money is short, or the brief asks for them */
  const salesGoal=(P_.brief.goals.find(g=>g.k==='sales')||{}).n||0,raised=P_.sold.reduce((a,s)=>a+s.fee,0);
  if((budgetFor(id)<5&&!P_.sold.length&&!P_.list.length)||(salesGoal&&raised<salesGoal&&!P_.list.length&&rnd()<.5))preSell(id);
  /* a bid for one of our best players: the chairman decides */
  const promised=typeof pactReleasePid==='function'?pactReleasePid():null,promisedP=promised&&S.squads[id].find(x=>x.id===promised);
  if(!P_.offer&&(promisedP||rnd()<(deadline?.45:.3))){const p=promisedP||pick(topThree(id)),rich=p?allIds().filter(c=>c!==id&&CL(c).tier<=CL(id).tier&&F(c).cash>askingFee(p,id)*1.6):[];
    if(p&&rich.length){const by=pick(rich);P_.offer={pid:p.id,name:p.name,pos:p.pos,age:p.age,by,fee:Math.round(askingFee(p,id)*(1.1+rnd()*.35)),asked:false};preTick(`❗ ${CL(by).name} bid £${P_.offer.fee}k for ${p.name}.`,'warn')}}
  buildPlan(id);P_.wk++;P_.after=true;return{ok:true};
}
/* deadline money: a short loan the chairman can release on deadline day */
function preDeadlineLoan(){const P_=PRE();if(!P_||P_.wk!==winWeeks(P_))return{ok:false,err:'Only on deadline day'};if(P_.loan)return{ok:false,err:'Already released'};const amt=Math.max(10,Math.min(maxNewLoan(S.my),Math.round(estSeasonIncome(S.my)*.15/5)*5));if(amt<5)return{ok:false,err:'The bank will not lend more'};const r=cmd('TakeLoan',S.my,{amount:amt,years:3});if(r.ok===false)return r;P_.loan=amt;F(S.my).policy.spend=Math.min(1,(F(S.my).policy.spend||.5)+.15);preTick(`The chairman releases £${amt}k of deadline money (a three-year loan).`,'us');return{ok:true,text:`£${amt}k released for deadline day.`}}
/* the chairman's two decisions */
function preOffer(choice){
  const id=S.my,P_=PRE(),o=P_&&P_.offer;if(!o)return{ok:false,err:'No bid on the table'};const f=findPlayer(o.pid);
  if(!f||f.club!==id){P_.offer=null;return{ok:false,err:'He is no longer here'}}
  if(choice==='more'&&!o.asked){o.asked=true;if(rnd()<.5){o.fee=Math.round(o.fee*1.2);preTick(`${CL(o.by).name} raise their bid for ${o.name} to £${o.fee}k.`,'warn');return{ok:true,text:`They raised it to £${o.fee}k. Now decide.`}}P_.offer=null;preTick(`${CL(o.by).name} walk away from ${o.name}.`,'off');return{ok:true,text:'They walked away.'}}
  if(typeof pactRelease==='function'&&choice!=='more')pactRelease(o.pid,choice==='accept');
  if(choice==='accept'){S._chairSale=true;transfer(f.p,id,o.by,o.fee,'sold by the chairman');S._chairSale=false;buildPlan(id);P_.sold.push({pid:o.pid,name:o.name,fee:o.fee,to:o.by,star:true});P_.offer=null;preTick(`→ You sell ${o.name} to ${CL(o.by).name} for £${o.fee}k.`,'us');confLog(id,o.fee>playerValue(f.p)*1.3?1:-3,o.fee>playerValue(f.p)*1.3?'A big fee for a star':'A star sold');return{ok:true,text:`${o.name} is sold for £${o.fee}k. The director will look for a replacement.`}}
  P_.offer=null;if(rnd()<.35){f.p.wantsOut=true;preTick(`You turn down the bid. ${o.name} is unhappy and wants to talk.`,'bad');return{ok:true,text:`Bid rejected. ${o.name} is unhappy.`}}
  preTick(`You turn down the bid for ${o.name}. He stays.`,'us');return{ok:true,text:'Bid rejected. He stays.'};
}
function preRecord(yes){const id=S.my,P_=PRE(),r=P_&&P_.record;if(!r)return{ok:false,err:'Nothing to approve'};const d=P_.deals.find(x=>x.pid===r.pid);P_.record=null;
  if(!d)return{ok:false,err:'The deal has gone'};if(yes){d.approved=true;const ok=preFinish(id,d);return{ok:true,text:ok?`${d.name} signs for a club record £${d.fee}k.`:'The deal fell through at the last moment.'}}
  d.stage='walked';preTick(`You say no to a record fee for ${d.name}.`,'off');return{ok:true,text:'No record fee. The director looks elsewhere.'}}
function prePrio(pos){const P_=PRE();if(!P_)return{ok:false,err:'The window is closed'};P_.prio=P_.prio===pos?null:pos;return{ok:true}}
function preBudget(){const f=F(S.my),cur=f.policy.spend??.5;if(cur>=1)return{ok:false,err:'The whole budget is already free'};return cmd('SetSquadPolicy',S.my,{spend:r2(Math.min(1,cur+.1))})}

/* ----- 5. the summer edition: the headline of the window ----- */
function summerEdition(P_){
  P_=P_||S.pre;if(!P_||P_.s!==S.season)return null;const L=P_.movements,ins=L?L.ins:P_.deals.filter(d=>d.stage==='signed'),outs=L?L.outs:P_.sold,big=ins.slice().sort((a,b)=>b.fee-a.fee)[0],star=outs.find(s=>s.star);
  const head=star?`${star.name} leaves for £${star.fee}k`:big&&big.fee?`${big.name} arrives for £${big.fee}k`:ins.length?`${ins.length} new face${ins.length>1?'s':''}, little money spent`:outs.length?`A ${P_.kind||'summer'} of selling`:`A quiet ${P_.kind||'summer'} at the club`;
  return{head,ins,outs,other:P_.movements?.other||[],spent:ins.reduce((a,d)=>a+d.fee,0),raised:outs.reduce((a,s)=>a+s.fee,0),world:P_.ticker.filter(t=>t.kind==='world').slice(-3)};
}
/* ----- 6. the debrief: four weeks in, the brief is judged with names ----- */
function briefJudge(id,P_){
  P_=P_||debriefTarget()||S.pre;if(!P_||!P_.brief)return[];const ins=P_.movements?P_.movements.ins:P_.deals.filter(d=>d.stage==='signed'),spent=ins.reduce((a,d)=>a+d.fee,0),raised=(P_.movements?P_.movements.outs:P_.sold).reduce((a,s)=>a+s.fee,0);
  return P_.brief.goals.map(g=>{
    if(g.k.startsWith('sign:')){const pos=g.k.slice(5),base=(P_.base&&P_.base[pos]||{q:0}).q,at=ins.filter(d=>d.pos===pos||NEAR[pos]?.includes(d.pos)).map(d=>({d,f:findPlayer(d.pid)})),best=at.filter(x=>x.f).sort((a,b)=>b.f.p.q-a.f.p.q)[0],ok=best&&best.f.p.q>=base+.2;return{t:g.t,met:!!ok,how:best?`${best.d.name} (${r1(best.f.p.q)}) ${ok?'is better than':'is not better than'} the old starter (${base})`:'Nobody signed'}}
    if(g.k==='keep3'){const gone=P_.top3.filter(x=>{const f=findPlayer(x.pid);return!f||f.club!==id});return{t:g.t,met:!gone.length,how:gone.length?`${gone.map(x=>x.name).join(', ')} left`:P_.top3.map(x=>x.name).join(', ')+' stayed'}}
    if(g.k==='young'){const old=ins.filter(d=>d.age>23);return{t:g.t,met:ins.length>0&&!old.length,how:ins.length?ins.map(d=>`${d.name} (${d.age})`).join(', '):'No signings'}}
    if(g.k==='sales')return{t:g.t,met:raised>=g.n,how:`£${raised}k raised`};
    if(g.k==='cap')return{t:g.t,met:spent<=g.n,how:`£${spent}k spent`};
    return{t:g.t,met:false,how:''};
  });
}
function debriefTarget(){if(!S.my)return null;const w=S.win,p=S.pre;if(w&&w.s===S.season&&w.brief&&!w.debrief&&S.week>=WINTER_WEEK+4)return w;if(p&&p.s===S.season&&p.brief&&!p.debrief&&S.week>=4)return p;return null}
function debriefDue(){return !!debriefTarget()}
function debriefChoose(back){
  const id=S.my,P_=debriefTarget();if(!P_)return{ok:false,err:'Nothing to judge'};const res=briefJudge(id,P_),met=res.filter(r=>r.met).length,d=tdOf(id);
  P_.debrief={met,total:res.length,back:!!back,s:S.season};
  if(d){d.loy=clamp((d.loy??50)+(back?6:-8)+(met-res.length/2)*4,0,100);d.mem=d.mem||[];d.mem.push({s:S.season,t:back?'backed after the window':'warned after the window',met})}
  const warnings=(d&&d.mem||[]).filter(m=>m.t==='warned after the summer'||m.t==='warned after the window').length;
  emit('Club',id,`${P_.kind==='winter'?'Winter':'Summer'} debrief: ${met} of ${res.length} goals met. You ${back?'back':'warn'} ${P_.brief.dirName}.`);
  return{ok:true,text:back?`You back ${P_.brief.dirName}. ${met} of ${res.length} goals met.`:`You warn ${P_.brief.dirName}.${warnings>=2?' A second warning: you can replace him under Club → Football.':''}`};
}

/* the winter window runs inside the season: the director acts in the two window weeks, after the matches.
   If the chairman has not signed a winter brief by then, the director works to his own proposal. */
function winterWeek(){
  if(!S.my||S.phase!=='season')return;if(S.week!==WINTER_WEEK-1&&S.week!==WINTER_WEEK)return;const P_=preState();if(P_.kind!=='winter')return;
  if(!P_.brief){const m=summerMeeting(S.my),ok=briefOptions(S.my).map(o=>o.k),g=m.plan.goals.find(k=>ok.includes(k))||ok[0];signBrief(S.my,[g],m.plan.budget);preTick('You did not meet the director: he works to his own winter plan.','off')}
  if(P_.wk<=winWeeks(P_))preWeek();
}
onWeek(winterWeek);
