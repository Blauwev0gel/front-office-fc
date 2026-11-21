/* ================= Club foundation: the week, the director of football, the API =================
   The club runs on its own. The chairman layer only reads it through cfApi functions at the bottom
   and changes it through setFrame() and signFreeAgent(). A season without a chairman must run cleanly. */
const FRAME_OPTS={budget:[0,20,40,60,100],cap:[600,750,900,1200],profile:['youth','experience','value']};
const FRAME_WORD={youth:'Youth: develop young players',experience:'Experience: ready-made quality',value:'Value: buy cheap, sell well',none:'No house rule',noRival:'Never sell to our rival',ownFive:'Always five academy players in the squad',heroesStay:'Local heroes are never sold'};
function cfInit(clubId,clubStr,tdId,coachId,rivalId){
  S.cf={club:clubId,squad:genSquad(clubStr),frames:{budget:40,cap:900,profile:'value',rules:[],ambition:'steady',sales:'price',wagehouse:'flat',kpi:'position',identity:'value',risk:'balanced'},budgetLeft:40,tdId,coachId,rivalId,events:[],oopWeeks:0,keySold:null,history:[]};
  return S.cf;
}
function cfEv(kind,text,o={}){S.cf.events.push({w:S.week||0,s:S.season,kind,text,...o})}
function tdTraits(){const p=P(S.cf.tdId);return p?{tr:p.traits,val:p.value,name:p.name}:{tr:[],val:'money',name:'The director'}}
function profileAges(pr){return pr==='youth'?[19,23]:pr==='experience'?[26,31]:[20,32]}
function marketFor(pos,n){const out=[],cf=S.cf,[a0,a1]=tdAges(cf.frames.profile);
  const base=11.5+((typeof myBaseStr==='function'?myBaseStr():50)-50)/4;
  for(let i=0;i<n;i++){const age=ri(a0,a1),q=Math.round((base-1.6+rnd()*3.4)*10)/10;const p=newPlayer(pos,{age,q,contract:ri(2,3)});
    p.price=Math.max(2,Math.round(playerValue(p)*(cf.frames.profile==='value'?0.55+rnd()*.6:cf.frames.profile==='youth'?0.6+rnd()*.5:0.8+rnd()*.6)*tdPayF()));p.from=pick(Object.keys(S.clubs).filter(i=>i!==cf.club));out.push(p)}
  return out}
function hasRule(r){const f=S.cf.frames;return (f.rules||[]).includes(r)||f.rule===r}
function ruleBlocksSale(p,buyer){if(hasRule('noRival')&&buyer===S.cf.rivalId)return'Never sell to our rival';if(hasRule('captainStays')&&p.captain)return'The captain stays';if(hasRule('heroesStay')&&p.localKid)return'Our own lads are never sold';
  if((hasRule('ownFive')||S.cf.frames.identity==='own')&&p.academy&&S.cf.squad.filter(x=>x.academy).length<=5)return'Five academy players must stay';return null}
function tdWindow(kind){
  if(kind==='summer')return tdSummerAuto();
  if(kind==='winter'){const out=tdSummerAuto('winter');const v=S.cf.sum.verdict;cfEv('window',`The winter window closes: ${S.cf.sum.prios.filter(x=>x.res&&x.res!=='fail').length} of ${S.cf.sum.prios.length} done. The Echo gives it a ${v.grade}.`);return out}
  const cf=S.cf,sq=cf.squad,td=tdTraits(),F=cf.frames,greedy=td.tr.includes('greedy')||td.val==='money',amb=td.tr.includes('ambitious')||F.ambition==='push'||F.ambition==='promotion',cautious=td.tr.includes('cautious'),stubborn=td.tr.includes('stubborn');
  const evs=[];const say=(k,t,o)=>{cfEv(k,t,o);evs.push(t)};
  // 1. Sales: bids on the most valuable players. At most one key sale per window ("te heftig").
  let keySales=0;
  const byVal=sq.filter(p=>!p.loan).sort((a,b)=>playerValue(b)-playerValue(a)).slice(0,3);
  for(const p of byVal){
    if(rnd()>(kind==='summer'?.35:.2))continue;if(F.sales==='noMid'&&kind==='winter')continue;
    const strong=Object.keys(S.clubs).filter(i=>i!==cf.club&&CL(i).str>=CL(cf.club).str-2);const buyer=pick(strong.length?strong:Object.keys(S.clubs).filter(i=>i!==cf.club)),v=playerValue(p),bid=Math.round(v*(0.9+rnd()*.7)*tdSellF());
    let need=F.profile==='value'?1.3:F.profile==='experience'?1.6:2.0;if(greedy)need-=.15;const young=p.age<=21&&p.q>=12;if(young)need+=.4;if(F.sales==='core'&&sq.slice().sort((a,b)=>b.q-a.q).indexOf(p)<5)need+=.6;if(F.sales==='price')need-=.1;if(F.ambition==='promotion')need+=.3;need+=tdSellNeed(p);
    const block=ruleBlocksSale(p,buyer);
    if(block){say('refused',`${CL(buyer).name} bid £${bid}k for ${p.name}. Refused: ${block.toLowerCase()}.`,{pid:p.id,buyer,bid});continue}
    if(bid>=v*need&&keySales<1){keySales++;sq.splice(sq.indexOf(p),1);S.clubs[cf.club].cash+=bid;cf.budgetLeft+=Math.round(bid*.5);CL(buyer).str=clamp(CL(buyer).str+.5,40,60);
      say(p.q>=12?'keySale':'sale',`${td.name} sold ${p.name} to ${CL(buyer).name} for £${bid}k. Half goes back into the transfer budget.`,{pid:p.id,name:p.name,buyer,bid});if(p.q>=12)cf.keySold={name:p.name,w:S.week||0,s:S.season}}
    else say('refused',`${CL(buyer).name} bid £${bid}k for ${p.name}. ${td.name} said no.`,{pid:p.id,buyer,bid});
  }
  // 2. Loans out: youngsters who will not play
  for(const p of sq.filter(p=>p.age<=19&&p.q<squadQuality(sq,0)-2&&!p.loan&&kind==='summer')){if((hasRule('ownFive')||F.identity==='own')&&sq.filter(x=>x.academy&&!x.loan).length<=5)break;p.loan=true;say('loanOut',`${p.name} (${p.age}) loaned out to play senior football.`,{pid:p.id})}
  // 3. Buys: shortages first, then the weakest slot in the eleven; an ambitious director spends to the edge
  const targets=[];for(const g of squadGaps(sq))if(g.kind==='short')targets.push(g.pos);
  const xi=pickXI(sq,0);const weakest=xi.slice().sort((a,b)=>a.p.q*fitFor(a.p,a.slot)-b.p.q*fitFor(b.p,b.slot))[0];if(weakest&&!targets.includes(weakest.slot))targets.push(weakest.slot);
  let buys=0;
  for(const pos of targets){if(buys>=3)break;
    const [fa0,fa1]=tdAges(F.profile);const mk=marketFor(pos,8).concat(faFor(pos).filter(p=>p.age>=fa0&&p.age<=fa1).map(p=>Object.assign(p,{price:0})));let ok=mk.filter(p=>p.price<=cf.budgetLeft);const over=mk.filter(p=>p.price>cf.budgetLeft).sort((a,b)=>b.q-a.q)[0];
    const starAllowed=F.wagehouse==='oneStar'&&!sq.some(p=>p.wage>F.cap);const capOf=starAllowed?Math.round(F.cap*1.6):F.cap;const capped=ok.filter(p=>p.wage>capOf).sort((a,b)=>b.q-a.q)[0];ok=ok.filter(p=>p.wage<=capOf);if(F.identity==='local')ok.sort((a,b)=>(b.localKid?1:0)-(a.localKid?1:0));
    const cur=xi.find(x=>x.slot===pos);const curQ=cur?cur.p.q*fitFor(cur.p,pos):0;ok=ok.filter(p=>p.q>curQ-(F.profile==='youth'?1.2:.3)||(F.profile==='youth'&&p.pa>curQ+.5)||targets.indexOf(pos)<squadGaps(sq).filter(g=>g.kind==='short').length);
    if(cautious)ok=ok.filter(p=>p.age>=25);
    if(!ok.length){if(capped)say('pass',`${td.name} passed on ${capped.name} (${POS_ONE[pos]}): £${capped.wage}/wk is over your wage cap.`,{pos});else if(over)say('pass',`${td.name} wanted ${over.name} (${POS_ONE[pos]}) but £${over.price}k is over budget.`,{pos});else say('pass',`No ${POS_ONE[pos]} on the market good enough for ${td.name}.`,{pos});continue}
    tdSort(ok,amb);
    let p=ok[0];tdMarkSigning(p);if(p.free){faSign(p,F.profile==='youth'?2:ri(1,2));p.mandateSigning=S.season;p.from=null;say('buy',`${td.name} signed ${p.name} (${POS_ONE[pos]}, ${p.age}, ${qWord(p.q).toLowerCase()}) on a free transfer: ${p.why}.`,{pid:p.id,pos,age:p.age,price:0,free:true});delete p.price;buys++;continue}
    cf.budgetLeft-=p.price;S.clubs[cf.club].cash-=p.price;p.joined=S.season;p.mandateSigning=S.season;sq.push(p);buys++;
    say('buy',`${td.name} signed ${p.name} (${POS_ONE[pos]}, ${p.age}, ${qWord(p.q).toLowerCase()}) from ${CL(p.from).name}.`,{pid:p.id,pos,age:p.age,price:p.price});delete p.from;delete p.price;
  }
  // 4. Loan in for an empty position (not a stubborn director)
  if(!stubborn)for(const g of squadGaps(sq).filter(g=>g.kind==='short'&&available(sq).filter(p=>p.pos===g.pos).length===0)){const p=marketFor(g.pos,1)[0];delete p.price;p.loan=false;p.loanIn=true;p.contract=0;sq.push(p);say('loanIn',`${p.name} arrives on loan to cover ${POS_ONE[g.pos]}.`,{pid:p.id})}
  // 5. Too many players: release the weakest veteran
  while(sq.length>28){const o=sq.filter(p=>p.age>=30).sort((a,b)=>a.q-b.q)[0]||sq.slice().sort((a,b)=>a.q-b.q)[0];sq.splice(sq.indexOf(o),1);say('leave',`${o.name} released to make room.`,{pid:o.id})}
  if(!evs.length)say('plan',`A quiet window for ${td.name}.`);
  return evs;
}
function tdFreeAgents(w){
  // outside the windows the director can still sign a free agent when a position is empty or in crisis
  const cf=S.cf,td=tdTraits(),F=cf.frames;if(w>=15&&w<=17)return;if(cf.squad.length>=28)return;if((cf.faLast||-9)>w-4)return;
  const crisis=POS.filter(pos=>available(cf.squad).filter(p=>p.pos===pos).length<Math.min(REQ[pos],pos==='GK'?1:2));if(!crisis.length)return;
  const pos=crisis[0],best=faFor(pos).filter(p=>p.wage<=F.cap).sort((a,b)=>b.q-a.q)[0];
  if(!best){cfEv('pass',`${td.name} looked for a free ${POS_ONE[pos]} but found nobody under your wage cap.`,{pos});cf.faLast=w;return}
  faSign(best,1);tdMarkSigning(best);cf.faLast=w;cfEv('buy',`${td.name} signed ${best.name} (${POS_ONE[pos]}, ${best.age}) on a free: ${best.why}. Cover for the injuries.`,{pid:best.id,pos,age:best.age,price:0,free:true});
}
function tdRenewals(){
  const cf=S.cf,F=cf.frames,td=tdTraits();
  for(const p of cf.squad.filter(p=>p.contract===1&&!p.loanIn&&!p.renewDone)){
    p.renewDone=true;const ask=Math.round(p.wage*1.15/10)*10;
    let want=F.profile==='youth'?p.age<=27:F.profile==='experience'?p.q>=11:(p.age<=29&&p.q>=10.5);
    if(hasRule('heroesStay')&&p.localKid)want=true;if(p.academy&&(hasRule('ownFive')||F.identity==='own'))want=true;if(hasRule('captainStays')&&p.captain)want=true;if(F.wagehouse==='performance'&&p.form<50)want=false;
    if(!want){cfEv('leave',`${td.name} will let ${p.name} go in the summer.`,{pid:p.id});p.leaving=true;continue}
    if(ask>F.cap){cfEv('pass',`${p.name} wants £${ask}/wk, over your wage cap. He will leave in the summer.`,{pid:p.id});p.leaving=true;continue}
    p.contract=hasRule('noOldLong')&&p.age>=30?1:ri(2,3);p.wage=ask;cfEv('renew',`${td.name} renewed ${p.name} for ${p.contract} years.`,{pid:p.id});
  }
}
function clubWeek(w){
  const cf=S.cf;
  for(const p of cf.squad){
    if(p.inj>0){p.inj--;if(p.inj===0){cfEv('return',`${p.name} is fit again.`,{pid:p.id});if(p.injFor>=3)p.backFromInj=true}}
    else if(!p.loan&&rnd()<(p.trait==='injury-prone'?.05:.022)){p.inj=ri(1,5);p.injFor=p.inj;cfEv('injury',`${p.name} injured: out for ${p.inj} week${p.inj>1?'s':''}.`,{pid:p.id,key:p.q>=12})}
    p.form=clamp(p.form+ri(-6,6),35,90);
  }
  storiesWeekly(w);
  {const tier=S.clubs[cf.club].tier,fx=S.fx&&S.fx[tier]&&S.fx[tier][w-1];const home=fx?fx.some(([h])=>h===cf.club):false;financeWeek(home)}
  if(w===15){cfEv('window','The winter window opens.');tdWindow('winter')}
  if(w>=20&&w<=26&&w%2===0)tdRenewals();
  tdFreeAgents(w);
  const oop=pickXI(cf.squad,0).filter(x=>x.p.pos!==x.slot).length;
  cf.oopWeeks=oop>=1?cf.oopWeeks+1:0;
  return cf.events.filter(e=>e.w===w&&e.s===S.season);
}
function clubSeasonEnd(){
  const cf=S.cf;
  for(const p of cf.squad.slice()){
    if(p.loanIn){cf.squad.splice(cf.squad.indexOf(p),1);continue}
    p.loan=false;p.renewDone=false;p.contract--;p.age++;p.sApps=0;p.sGoals=0;p.storySeen={};p.career.push(`${S.clubs[cf.club].name} ${S.season}`);
    if(p.age<=23)p.q=Math.round(clamp(p.q+(p.pa-p.q)*(.25+rnd()*.3),1,19)*10)/10;else if(p.age>=31)p.q=Math.round(clamp(p.q-(.3+rnd()*.6),1,19)*10)/10;
    if(p.contract<=0||p.leaving){cf.squad.splice(cf.squad.indexOf(p),1);faRelease(p);cfEv('leave',`${p.name} leaves at the end of his contract.`,{pid:p.id})}
    else if(p.age>=35&&rnd()<.6){cf.squad.splice(cf.squad.indexOf(p),1);cfEv('leave',`${p.name} retires.`,{pid:p.id})}
  }
  // two academy graduates every summer
  for(let i=0;i<2;i++)cf.squad.push(newPlayer(pick(POS.slice(1)),{age:17,q:Math.round((squadQuality(cf.squad,0)-3+rnd()*1.2)*10)/10,academy:true,contract:2}));
  groundSeasonEnd();cf.budgetLeft=cf.frames.budget;cf.keySold=null;faSummer();
}
/* ----- API for the chairman layer ----- */
function myBaseStr(){return S.cf?qualityToStr(squadQuality(S.cf.squad,0)):50}
function cfStrength(youthBias){return qualityToStr(squadQuality(S.cf.squad,youthBias))}
function cfNeeds(){return squadGaps(S.cf.squad)}
function cfPlan(){const g=cfNeeds();const out=[];for(const k of ['short','oop','contract'])for(const x of g.filter(y=>y.kind===k))if(out.length<3)out.push(x.text);return out}
function cfEvents(w){return S.cf.events.filter(e=>e.w===w&&e.s===S.season)}
function setFrame(k,v){const cf=S.cf,old=cf.frames[k];cf.frames[k]=v;if(k==='budget'){cf.budgetLeft=Math.max(0,cf.budgetLeft+(v-old))}cfEv('frame',`New frame: ${k==='budget'?'£'+v+'k transfer budget':k==='cap'?'£'+v+'/wk wage cap':FRAME_WORD[v]}.`)}
function signFreeAgent(pos){const best=faFor(pos).filter(x=>x.wage<=S.cf.frames.cap*1.2).sort((a,b)=>b.q-a.q)[0];if(best){faSign(best,1);cfEv('buy',`${best.name} (${POS_ONE[pos]}, ${best.age}) signs as a free agent: ${best.why}.`,{pid:best.id,free:true});return best}const p=newPlayer(pos,{age:ri(25,31),q:Math.round((squadQuality(S.cf.squad,0)-.6+rnd()*1.2)*10)/10,contract:1});S.cf.squad.push(p);cfEv('buy',`${p.name} (${POS_ONE[pos]}, ${p.age}) signs as a free agent.`,{pid:p.id});return p}
