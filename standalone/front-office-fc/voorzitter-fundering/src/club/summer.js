/* ================= Club foundation: the transfer window as a season of its own =================
   review -> plan (priorities with targets A/B/C, each with a scout grade) -> the brief (what the director is judged on)
   -> six weeks of deals (a deal tracker, moments, headlines, friendlies) -> deadline day -> the verdict (edition grade,
   five questions, a strike). The winter window runs on the same machine: one priority, three weeks, no review.
   This layer knows nothing about the chairman; without one tdSummerAuto() runs it all. */
const SUM_WEEKS=6,WIN_WEEKS=3;
const SUM_DATES=['Mon 7 Jul','Mon 14 Jul','Mon 21 Jul','Mon 28 Jul','Mon 4 Aug','Mon 11 Aug'],WIN_DATES=['Mon 5 Jan','Mon 12 Jan','Mon 19 Jan'];
function sumWin(){return S.cf.sum&&S.cf.sum.kind==='winter'}
// a scout grade: what the director SEES, against the player who would start there now
function sumXiAt(pos){const x=pickXI(S.cf.squad,0).find(e=>e.slot===pos);return x?x.p.q*fitFor(x.p,pos):8}
function sumGrade(seen,pos){const d=seen-sumXiAt(pos);return d>=.8?'A':d>=-.3?'B':d>=-1.5?'C':'D'}
function sumWages(){return S.cf.squad.reduce((a,p)=>a+(p.loan?0:p.wage),0)}
function sumCapOf(){const F=S.cf.frames,sq=S.cf.squad;return F.wagehouse==='oneStar'&&!sq.some(p=>p.wage>F.cap)?Math.round(F.cap*1.6):F.cap}
function sumP(id){return S.cf.squad.find(p=>p.id===id)}

/* ----- 1. the squad review ----- */
function tdReview(){
  const cf=S.cf,F=cf.frames,td=curTd(),sq=cf.squad.filter(p=>!p.loanIn&&!p.loan),xiQ=squadQuality(sq,0),out=[],seen=new Set();
  const add=(p,v,why)=>{if(!p||seen.has(p.id))return;seen.add(p.id);out.push({pid:p.id,v,why})};
  const byQ=sq.slice().sort((a,b)=>b.q-a.q),young=sq.filter(p=>p.age<=21).sort((a,b)=>b.pa-a.pa)[0];
  if(young&&young.pa>=xiQ)add(young,'keep','Not for sale at any price. He is the plan.');
  const sells=[];
  for(const p of sq){
    if(ruleBlocksSale(p,null))continue;
    if(p.wage>sumCapOf())sells.push([p,`£${p.wage} a week is over your wage cap.`,3]);
    else if(td.phil==='data'&&p.age>=30&&p.q>=xiQ-1)sells.push([p,`${p.age}, and his numbers are dropping. Sell while someone pays.`,2]);
    else if(td.phil==='eye'&&p.age>=28&&p.q>=xiQ)sells.push([p,'Sell high and buy young. That is the plan.',1]);
    else if((td.phil==='data'||td.phil==='bargain')&&p.contract===1&&p.age<=29&&p.q>=xiQ-.5)sells.push([p,'One year left. Sell now or lose him for nothing.',2]);
  }
  if(td.phil==='bargain'){const b=sq.filter(p=>p.age>=23&&p.age<=29&&!seen.has(p.id)).sort((a,b)=>playerValue(b)-playerValue(a))[0];if(b)sells.push([b,'One good sale a year keeps this club healthy.',1])}
  sells.sort((a,b)=>b[2]-a[2]);for(const [p,why] of sells.slice(0,2))add(p,'sell',why);
  for(const p of sq.filter(p=>p.age>=32&&p.q<xiQ-1.2).slice(0,2))add(p,'release',`He has given everything. Thank him and let him go.`);
  if(!(hasRule('ownFive')||F.identity==='own'))for(const p of sq.filter(p=>p.age<=19&&p.q<xiQ-2).slice(0,2))add(p,'loan','Needs thirty men\'s games, then he is ours.');
  const best=byQ.find(p=>!seen.has(p.id));if(best)add(best,'keep','The spine of the side.');
  return out;
}

/* ----- 2. the plan: priorities with targets A, B, C ----- */
function sumTargets(pos,busy){
  const cap=sumCapOf(),mk=tdSort(marketFor(pos,8).filter(p=>p.wage<=cap),false),A=mk[0];
  const fas=tdSort(faFor(pos).filter(p=>p.wage<=cap).map(p=>{const c=JSON.parse(JSON.stringify(p));c.price=0;return c}),false);
  const B=fas[0]||mk.filter(p=>A&&p!==A&&p.price<=A.price*.6).sort((a,b)=>a.price-b.price)[0]||mk[1];
  const ac=S.cf.squad.filter(p=>p.academy&&p.age<=20&&!p.loan&&!(busy&&busy.has(p.id))&&(p.pos===pos||NEAR[pos].includes(p.pos))).sort((a,b)=>b.pa-a.pa)[0];
  const C=ac?{kind:'academy',pid:ac.id,name:ac.name,age:ac.age}:{kind:'loan',name:'A loan from a bigger club'};
  if(A)A.kind='buy';if(B)B.kind=B.free?'free':'buy';
  for(const t of [A,B])if(t){if(t.seenQ==null)t.seenQ=tdSee(t);t.grade=sumGrade(t.seenQ,pos);t.base=Math.round(sumXiAt(pos)*10)/10}
  if(C.kind==='academy'){const p=sumP(C.pid);C.grade=p?sumGrade(tdSee(p),pos):'D'}else C.grade='C';
  return [A,B,C].filter(Boolean);
}
function tdPlanBuild(verdicts){
  const cf=S.cf,gone=new Set(verdicts.filter(v=>v.v!=='keep').map(v=>v.pid)),hs=cf.squad.filter(p=>!gone.has(p.id)&&!p.loanIn),pos=[],why={};
  const lim=sumWin()?1:3;const push=(p,goal,kind,reason)=>{if(!pos.includes(p)&&pos.length<lim){pos.push(p);why[p]={goal,kind,reason}}};
  for(const v of verdicts.filter(v=>v.v==='sell')){const p=sumP(v.pid);if(p)push(p.pos,`Replace ${p.name}`,'leaving',`${p.name} is for sale: ${v.why.charAt(0).toLowerCase()+v.why.slice(1)}`)}
  for(const g of squadGaps(hs).filter(g=>g.kind==='short'))push(g.pos,`Cover at ${POS_ONE[g.pos]}`,'depth',`${g.text}.`);
  const xi=pickXI(hs,0).slice().sort((a,b)=>a.p.q*fitFor(a.p,a.slot)-b.p.q*fitFor(b.p,b.slot));
  for(const x of xi){if(pos.length>=Math.min(2,lim))break;push(x.slot,`A better ${POS_ONE[x.slot]}`,'weak',`The weakest spot in our eleven: ${x.p.name}, ${qWord(x.p.q*fitFor(x.p,x.slot)).toLowerCase()}${x.p.pos!==x.slot?', out of position':''}.`)}
  const prios=pos.map((p,i)=>({id:'pr'+i,pos:p,goal:why[p].goal,kind:why[p].kind,reason:why[p].reason,targets:sumTargets(p,gone),t:0,stage:null,res:null,order:i,start:0}));
  return{prios,pool:sumBudgetRule(prios,verdicts)};
}
// budget rule: the A-targets together cost 1.2-1.5x what there is to spend, so not every priority gets its first choice
function sumBudgetRule(prios,verdicts){
  const cf=S.cf,est=verdicts.filter(v=>v.v==='sell').reduce((a,v)=>{const p=sumP(v.pid);return a+(p?playerValue(p):0)},0),pool=cf.budgetLeft+Math.round(est*.5);
  const As=prios.map(x=>x.targets[0]).filter(t=>t&&t.kind==='buy'),sumA=As.reduce((a,t)=>a+t.price,0);
  if(pool>0&&sumA>0){const k=pool*1.3*tdPayF()/sumA;for(const t of As)t.price=Math.max(2,Math.round(t.price*k))}
  for(const x of prios){const [A,B]=x.targets;if(A&&B&&B.kind==='buy'&&B.price>=A.price)B.price=Math.max(1,Math.round(A.price*.5))}
  return pool;
}
function tdSummerStart(kind){
  const cf=S.cf;kind=kind||'summer';if(kind==='summer'&&cf.tdStrikes>0&&cf.strikeS<S.season)cf.tdStrikes--;
  cf.sum={kind};const verdicts=kind==='winter'?[]:tdReview(),{prios,pool}=tdPlanBuild(verdicts);
  const F=cf.frames,contracts=cf.squad.filter(p=>p.contract===1&&!p.loanIn&&!p.loan&&!verdicts.some(v=>v.pid===p.id&&v.v!=='keep')).map(p=>{const want=p.age<=29&&p.q>=10.5||p.academy&&p.age<=21;return{pid:p.id,name:p.name,pos:p.pos,age:p.age,plan:want?'renew':'go',why:want?(p.age<=23?'Young and improving: a new deal this season.':'Part of the plan: a new deal this season.'):(p.age>=30?'Past thirty and fading: he leaves in June.':'Not good enough for the plan: he leaves in June.')}});
  cf.sum={step:'review',week:0,verdicts,prios,pool,contracts,before:JSON.parse(JSON.stringify(cf.squad.filter(p=>!p.loan))),sales:verdicts.filter(v=>v.v==='sell').map(v=>({pid:v.pid,ask:Math.max(2,playerValue(sumP(v.pid))),bid:0,buyer:null,state:'listed'})),
    weeks:[],wk:[],deadline:[],ins:[],outs:[],startWages:sumWages(),startBudget:cf.budgetLeft,spent:0,got:0,keySold:0,kind,hijacks:0,stalls:0,lostMoney:0};
  cf.sum.brief=sumBrief();return cf.sum;
}
function tdPlanRefresh(){const s=S.cf.sum;s.startBudget=S.cf.budgetLeft;s.pool=sumBudgetRule(s.prios,s.verdicts);s.brief=sumBrief()}
// the brief: what the director signs and is judged on
function sumBrief(){const s=S.cf.sum,ps=s.prios.slice().sort((a,b)=>a.order-b.order),k=[];
  if(ps.length)k.push({k:'prios',pos:ps.slice(0,2).map(x=>x.pos),t:`Sign a ${ps.slice(0,2).map(x=>POS_ONE[x.pos]).join(' and a ')}`});
  const cap=Math.max(5,Math.round((s.pool||S.cf.budgetLeft)*.9/5)*5);k.push({k:'net',v:cap,t:`Net spend under £${cap}k`});
  if(ps.some(x=>x.targets[0]&&x.targets[0].grade==='A'))k.push({k:'gradeA',t:'At least one grade-A signing'});else if(!sumWin())k.push({k:'count',v:2,t:'At least two signings'});
  return k}
function sumIn(p,x,from,fee,how){S.cf.sum.ins.push({pid:p.id,name:p.name,pos:p.pos,age:p.age,q:p.q,wage:p.wage,from:from||null,fee:fee||0,how,goal:x?x.goal:null})}
function sumOut(p,to,fee,how){S.cf.sum.outs.push({pid:p.id,name:p.name,pos:p.pos,age:p.age,q:p.q,wage:p.wage,to:to||null,fee:fee||0,how,goals:p.goals||0})}

/* ----- 3. a week of deals ----- */
// structured output for the transfer centre: moments (cards), headlines (crawl) and the deal tracker
function sumMoment(m){const s=S.cf.sum;(s._m=s._m||[]).push(m)}
function sumHead(t){const s=S.cf.sum;(s._h=s._h||[]).push(t)}
// one row per priority: the current target with its stage, and the targets already lost
function sumTracker(){const s=S.cf.sum,out=[];
  for(const x of s.prios.slice().sort((a,b)=>a.order-b.order)){const i=Math.min(x.t,x.targets.length-1),t=x.targets[i];if(!t)continue;
    const failed=x.res==='fail',done=x.res&&!failed,st=done?5:failed?-1:x.stage?({talks:0,bid:1,agreed:2,medical:3,signed:5})[x.stage]:-2;
    out.push({name:t.name,grade:t.grade||'C',plan:'ABC'[i],pos:x.pos,goal:x.goal,st,kind:t.kind,lost:x.targets.slice(0,i).map((y,j)=>({name:y.name,plan:'ABC'[j]}))})}
  return out}
function sumClubName(id){return CL(id)?CL(id).name:'abroad'}
function sumFriendly(w){const me=S.cf.club,opp=pick(sumClubs().filter(i=>CL(i).tier===CL(me).tier)),mine=qualityToStr(squadQuality(S.cf.squad,0)),th=CL(opp).str;
  const g=x=>{let n=0;for(let i=0;i<5;i++)if(rnd()<x)n++;return n};const a=g(clamp(.24+(mine-th)*.012,.08,.5)),b=g(clamp(.24+(th-mine)*.012,.08,.5));
  const star=pick(S.cf.squad.filter(p=>!p.loan&&['ST','W','AM'].includes(p.pos)))||S.cf.squad[0];
  const line=a>b?(a>=2?`${star.name.split(' ').pop()} scores twice.`:`A late winner from ${star.name.split(' ').pop()}.`):a<b?(b>=3?'A heavy defeat. The gaps showed.':'A narrow defeat. Plenty to work on.'):'A draw, and a few answers.';
  sumMoment({type:'fr',when:'Sat',sc:`${a}–${b}`,opp,s:line});sumHead(`Friendly: ${CL(me).name} ${a}–${b} ${CL(opp).name}`)}
function sumClubs(){return Object.keys(S.clubs).filter(i=>i!==S.cf.club)}
function sumBuyer(){const me=CL(S.cf.club),strong=sumClubs().filter(i=>CL(i).str>=me.str-2);return pick(strong.length?strong:sumClubs())}
function sumSign(x,t,lines){
  const cf=S.cf;
  if(t.kind==='academy'){const p=sumP(t.pid);if(p){p.contract=Math.max(p.contract,2);p.firstPro=S.season;sumIn(p,x,null,0,'academy');lines.push({k:'good',t:`Promoted: ${p.name} (${p.age}) from the academy signs his first pro contract.`});sumMoment({type:'in',pid:p.id,name:p.name,pos:p.pos,age:p.age,from:null,how:'academy',fee:'Academy',grade:t.grade});sumHead(`${p.name} promoted from the academy`);cfEv('promote',`${p.name} gets his first professional contract.`,{pid:p.id})}x.res='C';x.name=t.name;return}
  if(t.kind==='loan'){if(rnd()<.5){lines.push({k:'bad',t:`No club will loan us a ${POS_ONE[x.pos]}.`});sumMoment({type:'hj',title:`No ${POS_ONE[x.pos]} on loan`,s:`${x.goal}: missed.`,lost:'market'});sumHead(`No loan ${POS_ONE[x.pos]} for ${S.clubs[cf.club].name}`);x.res='fail';return false}const p=marketFor(x.pos,1)[0];delete p.price;delete p.from;p.loanIn=true;p.contract=0;cf.squad.push(p);lines.push({k:'good',t:`On loan: ${p.name} (${POS_ONE[x.pos]}, ${p.age}) arrives for the season.`});cfEv('loanIn',`${p.name} arrives on loan.`,{pid:p.id});x.res='C';x.name=p.name;sumIn(p,x,null,0,'loan');p.seenQ=p.q;p.signedBy=cf.tdId;p.signedS=S.season;p.scoutGrade='C';sumMoment({type:'in',pid:p.id,name:p.name,pos:p.pos,age:p.age,from:null,how:'loan',fee:'Loan',grade:'C'});sumHead(`${p.name} arrives on loan`);return}
  if(t.kind==='free'){const f=(S.fa||[]).find(p=>p.id===t.id);if(!f){lines.push({k:'bad',t:`${t.name} signed for somebody else before we could.`});return false}
    faSign(f,ri(1,2));tdMarkSigning(f);f.seenQ=t.seenQ;f.scoutGrade=t.grade;f.scoutBase=t.base;sumMoment({type:'in',pid:f.id,name:f.name,pos:f.pos,age:f.age,from:null,how:'free',fee:'Free',grade:t.grade});sumHead(`DONE DEAL: ${f.name} joins on a free`);lines.push({k:'good',t:`Signed: ${f.name} (${POS_ONE[x.pos]}, ${f.age}) on a free transfer.`});cfEv('buy',`${f.name} signed on a free.`,{pid:f.id,pos:x.pos,age:f.age,price:0,free:true});sumIn(f,x,null,0,'free');return true}
  const p=t;p.joined=S.season;tdMarkSigning(p);p.scoutGrade=t.grade;p.scoutBase=t.base;const from=p.from;delete p.from;const price=p.price;delete p.price;delete p.kind;cf.squad.push(p);
  lines.push({k:'good',t:`Signed: ${p.name} (${POS_ONE[x.pos]}, ${p.age}) from ${CL(from)?CL(from).name:'abroad'} for £${price}k.`});cfEv('buy',`${p.name} signed for £${price}k.`,{pid:p.id,pos:x.pos,age:p.age,price});sumIn(p,x,from,price,'buy');sumMoment({type:'in',pid:p.id,name:p.name,pos:p.pos,age:p.age,from,how:'buy',fee:`£${price}k`,grade:t.grade});sumHead(`DONE DEAL: ${p.name} joins from ${sumClubName(from)} for £${price}k`);return true;
}
const SUM_STAGE={buy:['talks','bid','agreed','medical','signed'],free:['talks','agreed','signed']};
function sumAdvance(x,lines,stall){
  const cf=S.cf,s=cf.sum,td=curTd(),t=x.targets[x.t];if(!t||x.res)return;
  const tag=['A','B','C'][x.t];
  if(t.kind==='academy'||t.kind==='loan'){if(t.kind==='academy')sumSign(x,t,lines);return}
  if(stall){lines.push({k:'wait',t:`${t.name}: no progress this week.`});return}
  if(x.stage&&rnd()>.62+td.deal*.06){lines.push({k:'wait',t:`${t.name}: talks drag on.`});return}
  const st=SUM_STAGE[t.kind],i=x.stage?st.indexOf(x.stage):-1,next=st[i+1];
  if(!x.stage){x.stage='talks';lines.push({k:'wait',t:`Talks: ${t.name} (${POS_ONE[x.pos]}, ${t.age})${t.kind==='buy'?`, ${CL(t.from)?CL(t.from).name:'abroad'} want £${t.price}k`:', a free agent'}.`});sumHead(`${S.clubs[cf.club].name} open talks for ${t.name}`);return}
  // hijack: another club gets there first; a weak negotiator loses more targets
  if((x.stage==='talks'||x.stage==='bid')&&rnd()<.06+(5-td.deal)*.025){const by=t.kind==='buy'?sumBuyer():pick(sumClubs());x.hijack=by;
    lines.push({k:'bad',t:`Hijacked: ${CL(by).name} beat us to ${t.name}.${x.targets[x.t+1]?` Moving to target ${['A','B','C'][x.t+1]}.`:''}`});if(by===cf.rivalId)s.rivalHit={by,name:t.name};s.hijacks++;const nx=x.targets[x.t+1];sumMoment({type:'hj',title:`${CL(by).name} steal ${t.name}`,s:nx?`Plan ${'ABC'[x.t+1]} for ${POS_ONE[x.pos]}: ${nx.name}.`:'Back to the reports.',lost:'market'});sumHead(`HIJACKED: ${CL(by).name} beat ${S.clubs[cf.club].name} to ${t.name}`);x.t++;x.stage=null;return}
  if(x.stage==='talks'&&rnd()<.16){const why=pick(['he wants a bigger club','his wife will not move north','he has an offer from abroad','his agent wants a signing-on fee we will not pay']);lines.push({k:'bad',t:`${t.name} turns us down: ${why}.`});s.refused=(s.refused||0)+1;const nx=x.targets[x.t+1];sumMoment({type:'hj',title:`${t.name} says no`,s:`${why.charAt(0).toUpperCase()+why.slice(1)}.${nx?` Plan ${'ABC'[x.t+1]}: ${nx.name}.`:''}`,lost:'market'});sumHead(`${t.name} turns down ${S.clubs[cf.club].name}`);x.t++;x.stage=null;return}
  if(next==='bid'||(t.kind==='free'&&next==='agreed')){
    if(t.kind==='buy'&&t.price>cf.budgetLeft){lines.push({k:'bad',t:`Too expensive: ${t.name} costs £${t.price}k and £${cf.budgetLeft}k is left.${x.targets[x.t+1]?` Moving to target ${['A','B','C'][x.t+1]}.`:''}`});s.lostMoney++;const nx=x.targets[x.t+1];sumMoment({type:'off',title:`Plan ${'ABC'[x.t]} is off: ${t.name}`,s:`£${t.price}k, and £${cf.budgetLeft}k is left.${nx?` Next: ${nx.name}.`:''}`,lost:'own'});sumHead(`${t.name} too expensive for ${S.clubs[cf.club].name}`);x.t++;x.stage=null;return}
  }
  if(next==='agreed'&&t.kind==='buy'){if(t.price>cf.budgetLeft){lines.push({k:'bad',t:`${t.name}: the money ran out. Moving to target ${['A','B','C'][x.t+1]||'C'}.`});s.lostMoney++;sumMoment({type:'off',title:`The money ran out for ${t.name}`,s:`Plan ${'ABC'[x.t+1]||'C'} next.`,lost:'own'});x.t++;x.stage=null;return}
    cf.budgetLeft-=t.price;S.clubs[cf.club].cash-=t.price;s.spent+=t.price}
  x.stage=next;
  if(next==='signed'){if(sumSign(x,t,lines)===false){x.t++;x.stage=null;return}x.res=tag;x.name=t.name;return}
  const word={bid:`Bid: £${t.price}k for ${t.name}.`,agreed:`Agreed: ${t.name}${t.kind==='buy'?` for £${t.price}k`:''}. ${t.kind==='buy'?'Medical next.':'Signing next week.'}`,medical:`Medical: ${t.name}, on ${pick(['Tuesday','Wednesday','Thursday'])}.`}[next];
  lines.push({k:next==='bid'?'wait':'good',t:word});if(next==='agreed')sumHead(`${t.name} agrees terms with ${S.clubs[cf.club].name}`);if(next==='medical')sumHead(`${t.name} booked in for a medical`);
}
function sumSaleStep(sale,lines,final){
  const cf=S.cf,s=cf.sum,p=sumP(sale.pid);if(!p||sale.state==='done'||sale.state==='off')return;
  const key=p.q>=12;if(key&&s.keySold>=1){sale.state='off';lines.push({k:'wait',t:`${p.name} stays: one big sale is enough this summer.`});return}
  if(sale.state==='listed'){sale.buyer=sumBuyer();if(ruleBlocksSale(p,sale.buyer))sale.buyer=pick(sumClubs().filter(i=>i!==cf.rivalId));sale.bid=Math.round(playerValue(p)*(.75+rnd()*.4)*tdSellF());sale.state='bid';
    lines.push({k:'wait',t:`Bid: ${CL(sale.buyer).name} offer £${sale.bid}k for ${p.name}. The director wants £${sale.ask}k.`});sumHead(`${CL(sale.buyer).name} bid £${sale.bid}k for ${p.name}`);return}
  if(sale.state==='bid'){if(sale.bid<sale.ask*.95&&!final){sale.bid=Math.round(sale.bid+sale.ask*(.08+rnd()*.12));lines.push({k:'wait',t:`${CL(sale.buyer).name} come back: £${sale.bid}k for ${p.name}.`});if(sale.bid<sale.ask*.85)return}
    if(sale.bid<sale.ask*.7){sale.state='off';lines.push({k:'wait',t:`No buyer at the right price: ${p.name} stays.`});return}
    sale.state='done';cf.squad.splice(cf.squad.indexOf(p),1);S.clubs[cf.club].cash+=sale.bid;cf.budgetLeft+=Math.round(sale.bid*.5);s.got+=sale.bid;if(key){s.keySold++;cf.keySold={name:p.name,w:0,s:S.season}}
    sumOut(p,sale.buyer,sale.bid,'sold');sumMoment({type:'out',pid:p.id,name:p.name,pos:p.pos,age:p.age,to:sale.buyer,fee:`£${sale.bid}k`});sumHead(`${p.name} joins ${CL(sale.buyer).name} for £${sale.bid}k`);s.lastSold={pid:p.id,name:p.name,goals:p.goals||0,local:!!p.localKid,key,club:sale.buyer};
    lines.push({k:'good',t:`Sold: ${p.name} to ${CL(sale.buyer).name} for £${sale.bid}k. Half goes back into the budget.`});cfEv(key?'keySale':'sale',`${p.name} sold to ${CL(sale.buyer).name} for £${sale.bid}k.`,{pid:p.id,name:p.name,buyer:sale.buyer,bid:sale.bid})}
}
const SUM_RUMOUR=[
  (s,sq)=>{const p=sq.slice().sort((a,b)=>b.pa-a.pa)[0];return p&&{t:`A Premiership club is watching ${p.name}.`,pid:p.id}},
  (s,sq)=>{const p=pick(sq.filter(p=>p.q>=11));return p&&{t:`${p.name} is unhappy with his role.`,pid:p.id}},
  (s)=>{const x=s.prios.find(x=>!x.res&&x.targets[x.t]);return x&&{t:`${x.targets[x.t].name} has failed a medical before.`,prio:x.id}}];
function sumRumour(lines){
  const s=S.cf.sum,td=curTd(),r=pick(SUM_RUMOUR)(s,S.cf.squad);if(!r)return null;lines.push({k:'rumour',t:`Rumour: ${r.t}`});
  const fooled=td.eye<=2||(td.eye===3&&rnd()<.5);
  if(!fooled){const d=pick(['The director: "Agent noise." Nothing changes.','Checked and dismissed by the director.','The director made one phone call. Nothing in it.']);lines.push({k:'rumour',t:d});sumMoment({type:'rm',title:`"${r.t}"`,s:d});return null}
  const open=s.prios.filter(x=>!x.res&&x.stage).sort((a,b)=>a.order-b.order);const hit=r.prio?s.prios.find(x=>x.id===r.prio):open[open.length-1]||open[0];
  if(hit){lines.push({k:'bad',t:`The director spent the week chasing the rumour. ${hit.targets[hit.t]?hit.targets[hit.t].name:'The deal'}: no progress.`});s.stalls++;sumMoment({type:'rm',title:`"${r.t}"`,s:`The director spends the week on it. ${hit.targets[hit.t]?hit.targets[hit.t].name:'The deal'}: no progress.`,own:true})}else sumMoment({type:'rm',title:`"${r.t}"`,s:'The director spends the week on it.'});
  return hit?hit.id:null;
}
function sumFill(lines){
  const cl=sumClubs(),pool=[()=>`Scouts watched ${CL(pick(cl)).name} against ${CL(pick(cl)).name}.`,()=>`${CL(pick(cl)).name} sign a ${POS_ONE[pick(POS)]} from abroad.`,
    ()=>{const p=pick(S.cf.squad);return`Pre-season: ${p.name} back in training${p.inj?', still nursing a knock':' and looking sharp'}.`},()=>`${CL(pick(cl)).name} sell their captain. The market is moving.`];
  const tried=new Set();while(lines.length<4&&tried.size<pool.length){const i=ri(0,pool.length-1);if(tried.has(i))continue;tried.add(i);lines.push({k:'world',t:pool[i]()})}
}
function tdSumWeek(){
  const cf=S.cf,s=cf.sum;s.week++;const w=s.week,lines=[];s._m=[];s._h=[];
  if(w===1&&!sumWin()){for(const v of s.verdicts){const p=sumP(v.pid);if(!p)continue;
    if(v.v==='release'){cf.squad.splice(cf.squad.indexOf(p),1);faRelease(p);sumOut(p,null,0,'released');sumMoment({type:'out',pid:p.id,name:p.name,pos:p.pos,age:p.age,to:null,fee:'Released'});sumHead(`${p.name} released after ${S.season>1?'years of service':'his last season'}`);lines.push({k:'good',t:`Released: ${p.name}, with a standing ovation at the open day.`});cfEv('leave',`${p.name} released.`,{pid:p.id});if(p.localKid||p.q>=12)s.lastSold={pid:p.id,name:p.name,goals:p.goals||0,local:!!p.localKid,key:false}}
    if(v.v==='loan'){p.loan=true;sumOut(p,null,0,'loan out');sumMoment({type:'out',pid:p.id,name:p.name,pos:p.pos,age:p.age,to:null,fee:'Loan'});lines.push({k:'good',t:`Loaned out: ${p.name} (${p.age}) to play men's football.`});cfEv('loanOut',`${p.name} loaned out.`,{pid:p.id})}}}
  const stall=w>=2?sumRumour(lines):null;
  for(const sale of s.sales)sumSaleStep(sale,lines,false);
  for(const x of s.prios.slice().sort((a,b)=>a.order-b.order))if(w>=x.order+1)sumAdvance(x,lines,stall===x.id);
  if(!sumWin()&&(w===4||w===5))sumFriendly(w);
  sumFill(lines);for(const l of lines)if(l.k==='world')sumHead(l.t);
  const keep=lines.filter(l=>l.k!=='world').slice(0,6);for(const l of lines)if(l.k==='world'&&keep.length<4)keep.push(l);
  if(!s._m.length){const open=sumTracker().filter(t=>t.st>=-1&&t.st<5&&t.st!==-1);sumMoment({type:'q',t:open.length?`Quiet week. The director: "${open[0].name} is ${open[0].st>=2?'close':'in talks'}."`:'Quiet week. The squad trains, the phones are silent.'})}
  s.weeks.push(keep);s.wk.push({w,date:(sumWin()?WIN_DATES:SUM_DATES)[w-1]||`Week ${w}`,label:`Week ${w}`,moments:s._m,heads:s._h,trk:sumTracker()});
  return keep;
}

/* ----- 4. deadline day and the balance ----- */
function tdSumDeadline(){
  const cf=S.cf,s=cf.sum,td=curTd(),tl=[];let hour=9;s._m=[];s._h=[];const at=(t,k)=>{hour=Math.min(22,hour+ri(1,3));tl.push({time:`${String(hour).padStart(2,'0')}:${pick(['05','12','20','35','40','50'])}`,k,t})};
  for(const sale of s.sales){const l=[];sumSaleStep(sale,l,true);if(sale.state==='bid')sumSaleStep(sale,l,true);for(const x of l)at(x.t,x.k)}
  for(const x of s.prios.slice().sort((a,b)=>a.order-b.order)){
    let guard=0;while(!x.res&&guard++<8){const l=[];const t=x.targets[x.t];
      if(!t){x.res='fail';at(`No ${POS_ONE[x.pos]} found. The position stays open.`,'bad');break}
      if(t.kind==='academy'&&rnd()<.3){at(`The coach: ${t.name} is not ready. ${x.goal}: missed.`,'bad');sumMoment({type:'hj',title:`${t.name} is not ready`,s:`${x.goal}: missed.`,lost:'own'});x.res='fail';break}
      if(t.kind==='loan'||t.kind==='academy'){if(sumSign(x,t,l)===false)x.res='fail';l.forEach(y=>at(y.t,y.k));break}
      const close=x.stage==='agreed'||x.stage==='medical'||(x.stage&&rnd()<.35+td.deal*.08)||(t.kind==='free'&&rnd()<.6);
      if(close){if(t.kind==='buy'&&x.stage!=='agreed'&&x.stage!=='medical'){if(t.price>cf.budgetLeft){x.t++;x.stage=null;continue}cf.budgetLeft-=t.price;S.clubs[cf.club].cash-=t.price;s.spent+=t.price}
        if(sumSign(x,t,l)===false){x.t++;x.stage=null;l.forEach(y=>at(y.t,y.k));continue}x.res=['A','B','C'][x.t];x.name=t.name;l.forEach(y=>at(y.t.replace('Signed:','Done deal:'),y.k));break}
      at(`${t.name}: the deal collapses before the deadline.`,'bad');x.t++;x.stage=null}
  }
  const yp=cf.squad.filter(p=>p.age<=21&&!p.loan).sort((a,b)=>b.pa-a.pa)[0];
  if(yp&&yp.pa>=squadQuality(cf.squad,0)){const big=pick(Object.keys(S.clubs).filter(i=>CL(i).tier===0&&i!==cf.club))||sumBuyer(),bid=Math.min(Math.round(playerValue(yp)*2),Math.round(60+S.cf.frames.budget*.8));
    if(td.plan>=3||s.keySold>=1||ruleBlocksSale(yp,big))at(`${CL(big).name} bid £${bid}k for ${yp.name}. The director: "He's the plan. Ask me in two years."`,'wait');
    else{cf.squad.splice(cf.squad.indexOf(yp),1);S.clubs[cf.club].cash+=bid;cf.budgetLeft+=Math.round(bid*.5);s.got+=bid;s.keySold++;sumOut(yp,big,bid,'sold');at(`Late bid: ${yp.name} sold to ${CL(big).name} for £${bid}k.`,'bad');cfEv('keySale',`${yp.name} sold late to ${CL(big).name}.`,{pid:yp.id,bid})}}
  // an empty position after the sales: one emergency loan (not a stubborn director)
  if(!(P(cf.tdId)&&P(cf.tdId).traits.includes('stubborn')))for(const g of squadGaps(cf.squad).filter(g=>g.kind==='short'&&available(cf.squad).filter(p=>p.pos===g.pos).length===0).slice(0,1)){const p=marketFor(g.pos,1)[0];delete p.price;delete p.from;p.loanIn=true;p.contract=0;cf.squad.push(p);sumIn(p,null,null,0,'loan');at(`Emergency loan: ${p.name} covers ${POS_ONE[g.pos]}.`,'good')}
  while(cf.squad.length>28){const o=cf.squad.filter(p=>p.age>=30).sort((a,b)=>a.q-b.q)[0]||cf.squad.slice().sort((a,b)=>a.q-b.q)[0];cf.squad.splice(cf.squad.indexOf(o),1);sumOut(o,null,0,'released');at(`${o.name} released to make room.`,'wait')}
  tl.push({time:'23:00',k:'world',t:'The window shuts.'});s.deadline=tl;sumHead('The window is shut');
  s.wk.push({w:s.week+1,date:sumWin()?'Fri 30 Jan':'Fri 15 Aug',label:'Deadline day',moments:tl.filter(x=>x.k!=='world'&&x.k!=='good').slice(-3).map(x=>({type:'q',t:`${x.time}. ${x.t}`})).concat(s._m),heads:s._h,trk:sumTracker()});
  s.balance={ins:s.ins.slice(),outs:s.outs.slice(),spent:s.spent,got:s.got,left:cf.budgetLeft,wages:sumWages()-s.startWages,prios:s.prios.slice().sort((a,b)=>a.order-b.order).map(x=>({goal:x.goal,pos:x.pos,res:x.res||'fail',name:x.name||null}))};
  return tl;
}
// without a chairman: the whole summer in one go (the foundation, the AI, the tests)
function tdSummerAuto(kind){tdSummerStart(kind);const all=[];for(let i=0;i<(kind==='winter'?WIN_WEEKS:SUM_WEEKS);i++)all.push(...tdSumWeek().map(l=>l.t));all.push(...tdSumDeadline().map(l=>l.t));S.cf.sum.step='done';S.cf.sum.verdict=sumVerdict(true);return all}
function sumWeeks(){return sumWin()?WIN_WEEKS:SUM_WEEKS}

/* ----- 5. the summer analysis: where did we gain, where did we lose? ----- */
const SUM_LINES=[['Goalkeeper',['GK']],['Defence',['CB','FB']],['Midfield',['DM','CM','AM']],['Attack',['W','ST']]];
function sumLineStats(sq){const xi=pickXI(sq,0),out={};
  for(const [name,ps] of SUM_LINES){const sl=xi.filter(x=>ps.includes(x.slot)),pl=sq.filter(p=>ps.includes(p.pos)&&!p.loan);
    out[name]={q:sl.length?Math.round(sl.reduce((a,x)=>a+x.p.q*fitFor(x.p,x.slot),0)/sl.length*10)/10:0,depth:pl.length,age:pl.length?Math.round(pl.reduce((a,p)=>a+p.age,0)/pl.length*10)/10:0}}
  return out}
function sumAnalysis(){
  const s=S.cf.sum,before=s.before,after=S.cf.squad.filter(p=>!p.loan),b=sumLineStats(before),a=sumLineStats(after);
  const lines=SUM_LINES.map(([name])=>{const dq=Math.round((a[name].q-b[name].q)*10)/10,dd=a[name].depth-b[name].depth;return{name,qb:b[name].q,qa:a[name].q,dq,db:b[name].depth,da:a[name].depth,dd,ageb:b[name].age,agea:a[name].age,verdict:dq>=.3?'stronger':dq<=-.3?'weaker':dd>=2?'deeper':dd<=-2?'thinner':'same'}});
  const sb=squadQuality(before,0),sa=squadQuality(after,0),age=sq=>Math.round(sq.reduce((x,p)=>x+p.age,0)/Math.max(1,sq.length)*10)/10;
  const gain=lines.slice().sort((x,y)=>y.dq-x.dq)[0],loss=lines.slice().sort((x,y)=>x.dq-y.dq)[0];
  return{lines,strB:Math.round(sb*10)/10,strA:Math.round(sa*10)/10,ageB:age(before),ageA:age(after),sizeB:before.length,sizeA:after.length,gain:gain.dq>0?gain:null,loss:loss.dq<0?loss:null,thin:lines.filter(l=>l.dd<=-2)}}

/* ----- 6. the verdict: the brief, the edition grade, five questions, a strike ----- */
function sumVerdict(apply){
  const cf=S.cf,s=cf.sum;if(s.verdict&&!apply)return s.verdict;const a=s.analysis||sumAnalysis();s.analysis=a;
  const ins=s.ins.filter(x=>x.how!=='loan'||x.goal),inPrio=ins.filter(x=>x.goal).length,net=s.spent-s.got,xi=Math.round((a.strA-a.strB)*10)/10;
  const signedGrades=s.ins.map(x=>{const p=sumP(x.pid);return p&&p.scoutGrade}).filter(Boolean);
  const kpis=(s.brief||[]).map(k=>{
    if(k.k==='prios'){const got=k.pos.filter(pos=>s.prios.some(x=>x.pos===pos&&x.res&&x.res!=='fail'));return{...k,met:got.length===k.pos.length,note:`${got.length} of ${k.pos.length} signed`}}
    if(k.k==='net')return{...k,met:net<=k.v,note:net<0?`Net income £${-net}k`:`Net spend £${net}k`};
    if(k.k==='gradeA'){const n=signedGrades.filter(g=>g==='A').length;return{...k,met:n>0,note:n?`${n} grade-A signing${n>1?'s':''}`:'No grade-A signing'}}
    if(k.k==='count')return{...k,met:inPrio>=k.v,note:`${inPrio} signing${inPrio===1?'':'s'}`};return{...k,met:false,note:''}});
  const met=kpis.filter(k=>k.met).length,score=met*1.2+clamp(xi*1.5,-2,2.5)+(ins.length?.5:-1);
  const grade=score>=4?'A':score>=2.8?'B':score>=1.5?'C':score>=.5?'D':'E';
  const missed=s.prios.filter(x=>x.res==='fail').length,own=s.stalls+s.lostMoney+s.prios.filter(x=>x.res==='fail'&&!x.hijack).length;
  const good=signedGrades.filter(g=>g==='A'||g==='B').length;
  const Q=[
    {k:'plan',ok:s.prios.length?missed===0:null,t:'Plan followed',x:s.prios.length?`${s.prios.length-missed} of ${s.prios.length} priorities done${missed?`, ${missed} missed`:''}.`:'There was no plan to follow.'},
    {k:'exec',ok:s.stalls+s.lostMoney>0?false:signedGrades.length?good>=signedGrades.length/2:null,t:'Execution',x:`${signedGrades.length?`${good} of ${signedGrades.length} signings scouted as A or B.`:'No signings to judge.'}${s.stalls?` Lost ${s.stalls} week${s.stalls>1?'s':''} to rumours.`:''}${s.lostMoney?` ${s.lostMoney} target${s.lostMoney>1?'s':''} lost on money.`:''}`},
    {k:'market',ok:null,t:'Market',x:s.hijacks?`${s.hijacks} target${s.hijacks>1?'s':''} taken by other clubs. That is not on him.`:'No targets lost to other clubs.'},
    {k:'team',ok:xi>=.2?true:xi<=-.2?false:null,t:'Team',x:xi>=.2?`Stronger than ${sumWin()?'before the window':'in May'} (rating ${Math.round(qualityToStr(a.strB))} → ${Math.round(qualityToStr(a.strA))}).`:xi<=-.2?`Weaker than ${sumWin()?'before the window':'in May'} (rating ${Math.round(qualityToStr(a.strB))} → ${Math.round(qualityToStr(a.strA))}).`:'About as strong as before.'},
    {k:'money',ok:(()=>{const k=(s.brief||[]).find(k=>k.k==='net');return k?net<=k.v:null})(),t:'Money',x:`${net<0?`Net income £${-net}k`:`Net spend £${net}k`}${(s.brief||[]).find(k=>k.k==='net')?` against £${s.brief.find(k=>k.k==='net').v}k agreed`:''}.`}];
  const bad=Q.filter(q=>q.ok===false).length,excuse=s.hijacks>0&&own===0;
  let strike=false;if(apply&&!s.struck&&bad>=2&&!excuse){cf.tdStrikes=(cf.tdStrikes||0)+1;cf.strikeS=S.season;strike=true;s.struck=1}
  const v={kpis,met,grade,xi,net,Q,strike:strike||!!s.struck,strikes:cf.tdStrikes||0,excuse};s.verdict=v;
  if(apply&&s.kind==='summer')cf.lastBrief={s:S.season,kpis,grade};
  return v;
}
// after half a season: did the director's signings work out? (Hit / Miss / Unlucky / Too early)
function sigVerdict(p){if(!p||p.signedS!==S.season&&p.signedS!==S.season-1)return null;const w=S.week||0;if(p.signedS===S.season&&w<15)return'Too early';
  if((p.injFor||0)>=6||p.inj>=4)return'Unlucky';const apps=p.sApps||0;return apps>=7&&p.form>=55?'Hit':apps>=4&&p.form>=62?'Hit':'Miss'}
