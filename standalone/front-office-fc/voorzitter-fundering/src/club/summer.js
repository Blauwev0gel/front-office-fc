/* ================= Club foundation: the transfer summer as a season of its own =================
   review (the director's verdict per player) -> plan (2-3 priorities, targets A/B/C) -> four weeks of deals
   (a ticker of 4-6 lines, one rumour, at most one talking point) -> deadline day -> the summer balance.
   The chairman only reorders the priorities and reacts to talking points; without him tdSummerAuto() runs it all.
   This layer knows nothing about the chairman. */
const SUM_WEEKS=4;
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
  if(A)A.kind='buy';if(B)B.kind=B.free?'free':'buy';return [A,B,C].filter(Boolean);
}
function tdPlanBuild(verdicts){
  const cf=S.cf,gone=new Set(verdicts.filter(v=>v.v!=='keep').map(v=>v.pid)),hs=cf.squad.filter(p=>!gone.has(p.id)&&!p.loanIn),pos=[],why={};
  const push=(p,goal,kind,reason)=>{if(!pos.includes(p)&&pos.length<3){pos.push(p);why[p]={goal,kind,reason}}};
  for(const v of verdicts.filter(v=>v.v==='sell')){const p=sumP(v.pid);if(p)push(p.pos,`Replace ${p.name}`,'leaving',`${p.name} is for sale: ${v.why.charAt(0).toLowerCase()+v.why.slice(1)}`)}
  for(const g of squadGaps(hs).filter(g=>g.kind==='short'))push(g.pos,`Cover at ${POS_ONE[g.pos]}`,'depth',`${g.text}.`);
  const xi=pickXI(hs,0).slice().sort((a,b)=>a.p.q*fitFor(a.p,a.slot)-b.p.q*fitFor(b.p,b.slot));
  for(const x of xi){if(pos.length>=2)break;push(x.slot,`A better ${POS_ONE[x.slot]}`,'weak',`The weakest spot in our eleven: ${x.p.name}, ${qWord(x.p.q*fitFor(x.p,x.slot)).toLowerCase()}${x.p.pos!==x.slot?', out of position':''}.`)}
  const prios=pos.map((p,i)=>({id:'pr'+i,pos:p,goal:why[p].goal,kind:why[p].kind,reason:why[p].reason,targets:sumTargets(p,gone),t:0,stage:null,res:null,order:i,start:0}));
  return{prios,pool:sumBudgetRule(prios,verdicts)};
}
// budget rule: the A-targets together cost 1.2-1.5x what there is to spend, so not every priority gets its first choice
function sumBudgetRule(prios,verdicts){
  const cf=S.cf,est=verdicts.filter(v=>v.v==='sell').reduce((a,v)=>{const p=sumP(v.pid);return a+(p?playerValue(p):0)},0),pool=cf.budgetLeft+Math.round(est*.5);
  const As=prios.map(x=>x.targets[0]).filter(t=>t&&t.kind==='buy'),sumA=As.reduce((a,t)=>a+t.price,0);
  if(pool>0&&sumA>0&&(sumA<pool*1.2||sumA>pool*1.5)){const k=pool*1.3/sumA;for(const t of As)t.price=Math.max(2,Math.round(t.price*k))}
  for(const x of prios){const [A,B]=x.targets;if(A&&B&&B.kind==='buy'&&B.price>=A.price)B.price=Math.max(1,Math.round(A.price*.5))}
  return pool;
}
function tdSummerStart(){
  const cf=S.cf,verdicts=tdReview(),{prios,pool}=tdPlanBuild(verdicts);
  const F=cf.frames,contracts=cf.squad.filter(p=>p.contract===1&&!p.loanIn&&!p.loan&&!verdicts.some(v=>v.pid===p.id&&v.v!=='keep')).map(p=>{const want=p.age<=29&&p.q>=10.5||p.academy&&p.age<=21;return{pid:p.id,name:p.name,pos:p.pos,age:p.age,plan:want?'renew':'go',why:want?(p.age<=23?'Young and improving: a new deal this season.':'Part of the plan: a new deal this season.'):(p.age>=30?'Past thirty and fading: he leaves in June.':'Not good enough for the plan: he leaves in June.')}});
  cf.sum={step:'review',week:0,verdicts,prios,pool,contracts,before:JSON.parse(JSON.stringify(cf.squad.filter(p=>!p.loan))),sales:verdicts.filter(v=>v.v==='sell').map(v=>({pid:v.pid,ask:Math.max(2,playerValue(sumP(v.pid))),bid:0,buyer:null,state:'listed'})),
    weeks:[],talks:[],deadline:[],ins:[],outs:[],startWages:sumWages(),startBudget:cf.budgetLeft,spent:0,got:0,keySold:0,follow:[]};
  return cf.sum;
}
function tdPlanRefresh(){const s=S.cf.sum,busy=new Set(s.verdicts.filter(v=>v.v!=='keep').map(v=>v.pid));for(const x of s.prios)x.targets=sumTargets(x.pos,busy);s.startBudget=S.cf.budgetLeft;s.pool=sumBudgetRule(s.prios,s.verdicts)}
function sumIn(p,x,from,fee,how){S.cf.sum.ins.push({pid:p.id,name:p.name,pos:p.pos,age:p.age,q:p.q,wage:p.wage,from:from||null,fee:fee||0,how,goal:x?x.goal:null})}
function sumOut(p,to,fee,how){S.cf.sum.outs.push({pid:p.id,name:p.name,pos:p.pos,age:p.age,q:p.q,wage:p.wage,to:to||null,fee:fee||0,how,goals:p.goals||0})}

/* ----- 3. a week of deals ----- */
function sumClubs(){return Object.keys(S.clubs).filter(i=>i!==S.cf.club)}
function sumBuyer(){const me=CL(S.cf.club),strong=sumClubs().filter(i=>CL(i).str>=me.str-2);return pick(strong.length?strong:sumClubs())}
function sumSign(x,t,lines){
  const cf=S.cf;
  if(t.kind==='academy'){const p=sumP(t.pid);if(p){p.contract=Math.max(p.contract,2);p.firstPro=S.season;sumIn(p,x,null,0,'academy');lines.push({k:'good',t:`Promoted: ${p.name} (${p.age}) from the academy signs his first pro contract.`});cfEv('promote',`${p.name} gets his first professional contract.`,{pid:p.id})}x.res='C';x.name=t.name;return}
  if(t.kind==='loan'){const p=marketFor(x.pos,1)[0];delete p.price;delete p.from;p.loanIn=true;p.contract=0;cf.squad.push(p);lines.push({k:'good',t:`On loan: ${p.name} (${POS_ONE[x.pos]}, ${p.age}) arrives for the season.`});cfEv('loanIn',`${p.name} arrives on loan.`,{pid:p.id});x.res='C';x.name=p.name;sumIn(p,x,null,0,'loan');return}
  if(t.kind==='free'){const f=(S.fa||[]).find(p=>p.id===t.id);if(!f){lines.push({k:'bad',t:`${t.name} signed for somebody else before we could.`});return false}
    faSign(f,ri(1,2));tdMarkSigning(f);f.seenQ=t.seenQ;lines.push({k:'good',t:`Signed: ${f.name} (${POS_ONE[x.pos]}, ${f.age}) on a free transfer.`});cfEv('buy',`${f.name} signed on a free.`,{pid:f.id,pos:x.pos,age:f.age,price:0,free:true});sumIn(f,x,null,0,'free');return true}
  const p=t;p.joined=S.season;tdMarkSigning(p);const from=p.from;delete p.from;const price=p.price;delete p.price;delete p.kind;cf.squad.push(p);
  lines.push({k:'good',t:`Signed: ${p.name} (${POS_ONE[x.pos]}, ${p.age}) from ${CL(from)?CL(from).name:'abroad'} for £${price}k.`});cfEv('buy',`${p.name} signed for £${price}k.`,{pid:p.id,pos:x.pos,age:p.age,price});sumIn(p,x,from,price,'buy');return true;
}
const SUM_STAGE={buy:['talks','bid','agreed','medical','signed'],free:['talks','agreed','signed']};
function sumAdvance(x,lines,stall){
  const cf=S.cf,s=cf.sum,td=curTd(),t=x.targets[x.t];if(!t||x.res)return;
  const tag=['A','B','C'][x.t];
  if(t.kind==='academy'||t.kind==='loan'){if(t.kind==='academy')sumSign(x,t,lines);return}
  if(stall){lines.push({k:'wait',t:`${t.name}: no progress this week.`});return}
  const st=SUM_STAGE[t.kind],i=x.stage?st.indexOf(x.stage):-1,next=st[i+1];
  if(!x.stage){x.stage='talks';lines.push({k:'wait',t:`Talks: ${t.name} (${POS_ONE[x.pos]}, ${t.age})${t.kind==='buy'?`, ${CL(t.from)?CL(t.from).name:'abroad'} want £${t.price}k`:', a free agent'}.`});return}
  // hijack: another club gets there first; a weak negotiator loses more targets
  if((x.stage==='talks'||x.stage==='bid')&&rnd()<.06+(5-td.deal)*.025){const by=t.kind==='buy'?sumBuyer():pick(sumClubs());x.hijack=by;
    lines.push({k:'bad',t:`Hijacked: ${CL(by).name} beat us to ${t.name}.${x.targets[x.t+1]?` Moving to target ${['A','B','C'][x.t+1]}.`:''}`});if(by===cf.rivalId)s.rivalHit={by,name:t.name};x.t++;x.stage=null;return}
  if(next==='bid'||(t.kind==='free'&&next==='agreed')){
    if(t.kind==='buy'&&t.price>cf.budgetLeft){lines.push({k:'bad',t:`Too expensive: ${t.name} costs £${t.price}k and £${cf.budgetLeft}k is left.${x.targets[x.t+1]?` Moving to target ${['A','B','C'][x.t+1]}.`:''}`});x.t++;x.stage=null;return}
  }
  if(next==='agreed'&&t.kind==='buy'){if(t.price>cf.budgetLeft){lines.push({k:'bad',t:`${t.name}: the money ran out. Moving to target ${['A','B','C'][x.t+1]||'C'}.`});x.t++;x.stage=null;return}
    cf.budgetLeft-=t.price;S.clubs[cf.club].cash-=t.price;s.spent+=t.price}
  x.stage=next;
  if(next==='signed'){if(sumSign(x,t,lines)===false){x.t++;x.stage=null;return}x.res=tag;x.name=t.name;return}
  const word={bid:`Bid: £${t.price}k for ${t.name}.`,agreed:`Agreed: ${t.name}${t.kind==='buy'?` for £${t.price}k`:''}. ${t.kind==='buy'?'Medical next.':'Signing next week.'}`,medical:`Medical: ${t.name}, on ${pick(['Tuesday','Wednesday','Thursday'])}.`}[next];
  lines.push({k:next==='bid'?'wait':'good',t:word});
}
function sumSaleStep(sale,lines,final){
  const cf=S.cf,s=cf.sum,p=sumP(sale.pid);if(!p||sale.state==='done'||sale.state==='off')return;
  const key=p.q>=12;if(key&&s.keySold>=1){sale.state='off';lines.push({k:'wait',t:`${p.name} stays: one big sale is enough this summer.`});return}
  if(sale.state==='listed'){sale.buyer=sumBuyer();if(ruleBlocksSale(p,sale.buyer))sale.buyer=pick(sumClubs().filter(i=>i!==cf.rivalId));sale.bid=Math.round(playerValue(p)*(.75+rnd()*.4)*tdSellF());sale.state='bid';
    lines.push({k:'wait',t:`Bid: ${CL(sale.buyer).name} offer £${sale.bid}k for ${p.name}. The director wants £${sale.ask}k.`});return}
  if(sale.state==='bid'){if(sale.bid<sale.ask*.95&&!final){sale.bid=Math.round(sale.bid+sale.ask*(.08+rnd()*.12));lines.push({k:'wait',t:`${CL(sale.buyer).name} come back: £${sale.bid}k for ${p.name}.`});if(sale.bid<sale.ask*.85)return}
    if(sale.bid<sale.ask*.7){sale.state='off';lines.push({k:'wait',t:`No buyer at the right price: ${p.name} stays.`});return}
    sale.state='done';cf.squad.splice(cf.squad.indexOf(p),1);S.clubs[cf.club].cash+=sale.bid;cf.budgetLeft+=Math.round(sale.bid*.5);s.got+=sale.bid;if(key){s.keySold++;cf.keySold={name:p.name,w:0,s:S.season}}
    sumOut(p,sale.buyer,sale.bid,'sold');s.lastSold={pid:p.id,name:p.name,goals:p.goals||0,local:!!p.localKid,key,club:sale.buyer};
    lines.push({k:'good',t:`Sold: ${p.name} to ${CL(sale.buyer).name} for £${sale.bid}k. Half goes back into the budget.`});cfEv(key?'keySale':'sale',`${p.name} sold to ${CL(sale.buyer).name} for £${sale.bid}k.`,{pid:p.id,name:p.name,buyer:sale.buyer,bid:sale.bid})}
}
const SUM_RUMOUR=[
  (s,sq)=>{const p=sq.slice().sort((a,b)=>b.pa-a.pa)[0];return p&&{t:`A Premiership club is watching ${p.name}.`,pid:p.id}},
  (s,sq)=>{const p=pick(sq.filter(p=>p.q>=11));return p&&{t:`${p.name} is unhappy with his role.`,pid:p.id}},
  (s)=>{const x=s.prios.find(x=>!x.res&&x.targets[x.t]);return x&&{t:`${x.targets[x.t].name} has failed a medical before.`,prio:x.id}}];
function sumRumour(lines){
  const s=S.cf.sum,td=curTd(),r=pick(SUM_RUMOUR)(s,S.cf.squad);if(!r)return null;lines.push({k:'rumour',t:`Rumour: ${r.t}`});
  const fooled=td.eye<=2||(td.eye===3&&rnd()<.5);
  if(!fooled){lines.push({k:'rumour',t:pick(['The director: "Agent noise." Nothing changes.','Checked and dismissed by the director.','The director made one phone call. Nothing in it.'])});return null}
  const open=s.prios.filter(x=>!x.res&&x.stage).sort((a,b)=>a.order-b.order);const hit=r.prio?s.prios.find(x=>x.id===r.prio):open[open.length-1]||open[0];
  if(hit)lines.push({k:'bad',t:`The director spent the week chasing the rumour. ${hit.targets[hit.t]?hit.targets[hit.t].name:'The deal'}: no progress.`});
  return hit?hit.id:null;
}
function sumFill(lines){
  const cl=sumClubs(),pool=[()=>`Scouts watched ${CL(pick(cl)).name} against ${CL(pick(cl)).name}.`,()=>`${CL(pick(cl)).name} sign a ${POS_ONE[pick(POS)]} from abroad.`,
    ()=>{const p=pick(S.cf.squad);return`Pre-season: ${p.name} back in training${p.inj?', still nursing a knock':' and looking sharp'}.`},()=>`${CL(pick(cl)).name} sell their captain. The market is moving.`];
  const tried=new Set();while(lines.length<4&&tried.size<pool.length){const i=ri(0,pool.length-1);if(tried.has(i))continue;tried.add(i);lines.push({k:'world',t:pool[i]()})}
}
function tdSumWeek(){
  const cf=S.cf,s=cf.sum;s.week++;const w=s.week,lines=[];
  if(w===1){for(const v of s.verdicts){const p=sumP(v.pid);if(!p)continue;
    if(v.v==='release'){cf.squad.splice(cf.squad.indexOf(p),1);faRelease(p);sumOut(p,null,0,'released');lines.push({k:'good',t:`Released: ${p.name}, with a standing ovation at the open day.`});cfEv('leave',`${p.name} released.`,{pid:p.id});if(p.localKid||p.q>=12)s.lastSold={pid:p.id,name:p.name,goals:p.goals||0,local:!!p.localKid,key:false}}
    if(v.v==='loan'){p.loan=true;sumOut(p,null,0,'loan out');lines.push({k:'good',t:`Loaned out: ${p.name} (${p.age}) to play men's football.`});cfEv('loanOut',`${p.name} loaned out.`,{pid:p.id})}}}
  const stall=w>=2?sumRumour(lines):null;
  for(const sale of s.sales)sumSaleStep(sale,lines,false);
  for(const x of s.prios.slice().sort((a,b)=>a.order-b.order))if(w>=x.order+1)sumAdvance(x,lines,stall===x.id);
  sumFill(lines);
  const keep=lines.filter(l=>l.k!=='world').slice(0,6);for(const l of lines)if(l.k==='world'&&keep.length<4)keep.push(l);
  s.weeks.push(keep);
  return keep;
}

/* ----- 4. deadline day and the balance ----- */
function tdSumDeadline(){
  const cf=S.cf,s=cf.sum,td=curTd(),tl=[];let hour=9;const at=(t,k)=>{hour=Math.min(22,hour+ri(1,3));tl.push({time:`${String(hour).padStart(2,'0')}:${pick(['05','12','20','35','40','50'])}`,k,t})};
  for(const sale of s.sales){const l=[];sumSaleStep(sale,l,true);if(sale.state==='bid')sumSaleStep(sale,l,true);for(const x of l)at(x.t,x.k)}
  for(const x of s.prios.slice().sort((a,b)=>a.order-b.order)){
    let guard=0;while(!x.res&&guard++<8){const l=[];const t=x.targets[x.t];
      if(!t){x.res='fail';at(`No ${POS_ONE[x.pos]} found. The position stays open.`,'bad');break}
      if(t.kind==='loan'||t.kind==='academy'){sumSign(x,t,l);l.forEach(y=>at(y.t,y.k));break}
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
  tl.push({time:'23:00',k:'world',t:'The window shuts.'});s.deadline=tl;
  s.balance={ins:s.ins.slice(),outs:s.outs.slice(),spent:s.spent,got:s.got,left:cf.budgetLeft,wages:sumWages()-s.startWages,prios:s.prios.slice().sort((a,b)=>a.order-b.order).map(x=>({goal:x.goal,pos:x.pos,res:x.res||'fail',name:x.name||null}))};
  return tl;
}
// without a chairman: the whole summer in one go (the foundation, the AI, the tests)
function tdSummerAuto(){tdSummerStart();const all=[];for(let i=0;i<SUM_WEEKS;i++)all.push(...tdSumWeek().map(l=>l.t));all.push(...tdSumDeadline().map(l=>l.t));S.cf.sum.step='done';return all}

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
