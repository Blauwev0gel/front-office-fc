/* ================= The summer meeting: the owner's mandate =================
   Three voices (director of football, coach, finance director) say what they want.
   The owner decides seven pillars. Each pillar changes how the club runs, and the staff react. */
const PILLARS=[
 {k:'ambition',q:'What do you want from this season?',opts:[
   {v:'survive',t:'Stay up, whatever it takes',d:'The director buys cheap and safe. Nobody expects much.',like:['finance'],dis:['coach']},
   {v:'steady',t:'Steady progress',d:'A sensible season. The director buys where it hurts most.',like:['finance','td'],dis:[]},
   {v:'push',t:'Push for the top half',d:'The director spends to the edge of the budget on quality now.',like:['coach'],dis:['finance']},
   {v:'promotion',t:'Promotion or bust',d:'Everything on this season. Key players are not for sale.',like:['coach'],dis:['finance','td']}]},
 {k:'risk',q:'How much money do you put at risk?',opts:[
   {v:'balanced',t:'Balanced books',d:'A small budget. The club stays healthy.',like:['finance'],dis:['coach']},
   {v:'reserves',t:'Spend the reserves',d:'Most of the cash goes into the squad.',like:['td','coach'],dis:['finance']},
   {v:'borrow',t:'Borrow against the future',d:'£80k from the bank, on top of the reserves. Interest every week.',like:['coach'],dis:['finance']}]},
 {k:'identity',q:'What kind of club are we?',opts:[
   {v:'own',t:'A club for our own',d:'Five academy players always in the squad. The director develops, not buys.',like:[],dis:[]},
   {v:'local',t:'Local lads first',d:'The director looks in the region before anywhere else.',like:[],dis:[]},
   {v:'pros',t:'Proven professionals',d:'Ready-made quality, mostly over 26.',like:['coach'],dis:[]},
   {v:'trade',t:'Buy low, sell high',d:'Find talent cheap, sell it on at the right price.',like:['finance'],dis:['coach']}]},
 {k:'wagehouse',q:'How do we pay people?',opts:[
   {v:'flat',t:'Nobody earns more than the cap',d:'Peace in the dressing room. Stars will not come.',like:['finance'],dis:[]},
   {v:'oneStar',t:'One star allowed',d:'One player may earn well above the cap.',like:['coach','td'],dis:[]},
   {v:'performance',t:'Pay for performance',d:'Players out of form do not get new deals.',like:['finance'],dis:['coach']}]},
 {k:'sales',q:'When do we sell?',opts:[
   {v:'core',t:'Keep the core',d:'Our five best players are close to untouchable.',like:['coach'],dis:['finance']},
   {v:'price',t:'Everyone has a price',d:'A good bid is a good bid.',like:['finance','td'],dis:['coach']},
   {v:'noMid',t:'Never sell mid-season',d:'Sales only in the summer.',like:['coach'],dis:[]}]},
 {k:'kpi',q:'How will you judge the director next June?',opts:[
   {v:'position',t:'Where we finish',d:'He is judged on the table.',like:[],dis:[]},
   {v:'value',t:'What the squad is worth',d:'He is judged on squad value.',like:[],dis:[]},
   {v:'youth',t:'Minutes for our own',d:'He is judged on academy players in the side.',like:[],dis:[]},
   {v:'wages',t:'The wage bill',d:'He is judged on keeping wages in line with income.',like:['finance'],dis:[]}]},
 {k:'rules',multi:true,q:'Any red lines?',opts:[
   {v:'noRival',t:'Never sell to our rival',d:'A higher bid from the rival is refused.'},
   {v:'captainStays',t:'The captain stays',d:'Not sold, and always renewed.'},
   {v:'heroesStay',t:'Our own lads are never sold',d:'Local and academy players stay.'},
   {v:'noOldLong',t:'No long deals over thirty',d:'Players over thirty get one-year contracts only.'}]}
];
const AMB_F={survive:.6,steady:.8,push:1,promotion:1.2};
function staffPid(role){return role==='finance'?cast('finance'):role==='td'?cast('td'):cast('coach')}
function valueLikes(role,pillar,v){
  // the staff member's own value adds a like or dislike on top of their role
  const p=P(staffPid(role));if(!p)return 0;const val=p.value;
  if(val==='money'&&(v==='balanced'||v==='trade'||v==='price'||v==='performance'))return 1;
  if(val==='glory'&&(v==='push'||v==='promotion'||v==='oneStar'))return 1;
  if(val==='control'&&role==='td'&&(v==='price'||v==='trade'))return 1;
  if(val==='community'&&(v==='own'||v==='local'||v==='heroesStay'))return 1;
  if(val==='loyalty'&&(v==='core'||v==='captainStays'))return 1;
  if(val==='recognition'&&role==='coach'&&(v==='push'||v==='pros'))return 1;
  if(val==='money'&&v==='borrow')return -1;
  return 0;
}
function staffVoices(){
  const c=C(),sm=S.cf.sum,td=P(cast('td')),co=P(cast('coach')),fi=P(cast('finance')),plan=cfPlan(),fin=S.cf.fin||{inc:weeklyIncome(false),wb:wageBill()},fc=seasonForecast();
  const gaps=cfNeeds().filter(g=>g.kind==='short'||g.kind==='oop').length,ask=Math.max(20,gaps*30);
  const coPos=(cfNeeds().find(g=>g.kind==='oop'||g.kind==='short')||{pos:'CM'}).pos;
  return[
   {pid:td.id,line:sm&&sm.prios.length?`"My list: ${sm.prios.map(x=>x.goal.toLowerCase()).join(', ')}. My first choices cost about £${sumAsk()}k."`:`"The squad is in decent shape. Give me £${ask}k and I'll make it better."`},
   {pid:co.id,line:`"${co.traits.includes('ambitious')?'I want to go for it this year.':'I want us hard to beat.'} ${sm&&sm.prios.some(x=>x.pos===coPos)?`Good that a ${POS_ONE[coPos]} is on the list.`:`I'd have put a ${POS_ONE[coPos]} on that list.`}"`},
   {pid:fi.id,line:`"We have £${Math.round(c.cash)}k in the bank${c.debt?` and £${c.debt}k of debt`:''}. Wages are £${fin.wb}k a week against £${fin.inc}k coming in. ${fc<0?`On this course we lose about £${-fc}k by May.`:`We should end the season about £${fc}k up.`}"`}];
}
function startMeeting(){S.meeting={step:0,choice:{},rules:[]};S.phase='summer';S.screen='meeting';if(S.cf)tdSummerStart()}
function meetingChoose(v){
  const M=S.meeting,pl=PILLARS[M.step-1];
  if(pl.multi){const i=M.rules.indexOf(v);if(i>=0)M.rules.splice(i,1);else M.rules.push(v);return}
  M.choice[pl.k]=v;const o=pl.opts.find(x=>x.v===v);
  for(const role of ['td','coach','finance']){const pid=staffPid(role);if(!pid)continue;let s=(o.like||[]).includes(role)?1:(o.dis||[]).includes(role)?-1:0;s+=valueLikes(role,pl.k,v);
    if(s>0)loy(pid,null,`${P(pid).name} likes it: ${o.t.toLowerCase()}`,{raw:.5*s,noRipple:true});if(s<0)loy(pid,null,`${P(pid).name} disagrees: ${o.t.toLowerCase()}`,{raw:.5*s,noRipple:true})}
  M.step++;
}
function applyMandate(){
  const M=S.meeting,c=C(),F=S.cf.frames,ch=M.choice;
  Object.assign(F,{ambition:ch.ambition,risk:ch.risk,identity:ch.identity,wagehouse:ch.wagehouse,sales:ch.sales,kpi:ch.kpi,rules:M.rules.slice()});
  if(ch.risk==='borrow'){c.debt+=80;c.cash+=80;log('£80k borrowed from the bank','Your mandate: borrow against the future',null)}
  const pot=ch.risk==='balanced'?Math.max(10,c.cash*.25):Math.max(15,c.cash*.65);
  F.budget=Math.max(0,Math.round(pot*AMB_F[ch.ambition]/5)*5);S.cf.budgetLeft=F.budget;
  F.cap=ch.risk==='balanced'?750:ch.risk==='reserves'?900:1000;if(ch.wagehouse==='performance')F.cap+=100;
  F.profile=ch.identity==='own'?'youth':ch.identity==='pros'?'experience':'value';
  if(ch.identity==='trade')F.sales=F.sales||'price';
  S.cf.kpiStart={value:S.cf.squad.reduce((a,p)=>a+playerValue(p),0),wages:wageBill()};
  cfEv('frame',`New mandate: ${PILLARS[0].opts.find(o=>o.v===ch.ambition).t.toLowerCase()}, ${PILLARS[2].opts.find(o=>o.v===ch.identity).t.toLowerCase()}. Budget £${F.budget}k.`);
}
function judgeDirector(){
  // at the AGM: the owner's verdict on the director, against the measure chosen in the summer
  const F=S.cf.frames,td=cast('td');if(!F.kpi||!td)return null;let ok,txt;
  if(F.kpi==='position'){ok=myPos()<=(C().expect||8);txt=`Finished ${ord(myPos())} against an expected ${ord(C().expect||8)}`}
  else if(F.kpi==='value'){const v=S.cf.squad.reduce((a,p)=>a+playerValue(p),0);ok=v>=(S.cf.kpiStart?.value||0);txt=`Squad value ${ok?'up':'down'}`}
  else if(F.kpi==='youth'){const n=S.cf.squad.filter(p=>p.academy&&p.sApps>=5).length;ok=n>=3;txt=`${n} academy players with five or more games`}
  else{ok=wageBill()<=weeklyIncome(false)+2;txt=`Wages £${wageBill()}k a week`}
  loy(td,ok?'wish':'against',`Your verdict on the director: ${txt}`,{raw:ok?1:-1});
  return{ok,txt};
}
