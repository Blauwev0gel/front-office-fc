/* ================= The handover (MB-40): the first morning, and the first real decision =================
   Bible §7.1: "the first real choice comes early". The new chairman inherits a live matter from the club's own state:
   a bid for one of the best players, a bank that wants a plan, or a head coach whose contract is running out.
   One decision, with a price, before the mandate is signed. Owns S.handover = {club, type, done, text}. No DOM. */
function handoverMatter(id){const H=S.handover;if(H&&H.club===id&&H.matter)return H.matter;const m=handoverCompute(id);S.handover={club:id,matter:m,done:false,text:null};return m}
/* the live matter a club hands its new chairman, computed without changing anything (the open chairs show it) */
function handoverCompute(id){
  const r=ARNG(id+':handover'),top=topThree(id)[0],sq=S.squads[id],b=books(id),co=coachOf(id);let m;
  const rich=top?allIds().filter(c=>c!==id&&CL(c).tier<=CL(id).tier&&F(c).cash>askingFee(top,id)*1.4):[];
  if(b.tight||debt(id)>estSeasonIncome(id)*.2){const sell=sq.filter(p=>!p.loan&&!topThree(id).includes(p)).sort((a,b)=>playerValue(b)-playerValue(a))[0],amt=Math.max(10,Math.min(maxNewLoan(id),Math.round(estSeasonIncome(id)*.12/5)*5));
    m={type:'bank',who:deptHeadName(id,'finance'),role:'Treasurer',title:'The bank wants a plan',line:`Cash ${k1v(F(id).cash)}${debt(id)?`, debt ${k1v(debt(id))}`:''}. They want to see one decision by Friday.`,opts:[
      sell&&{k:'sell',t:`Sell ${sell.name}`,fx:`About £${Math.round(askingFee(sell,id)*.9)}k in · a squad player less`,pid:sell.id},
      {k:'loan',t:`A five-year loan of £${amt}k`,fx:'Cash now · interest every season',amt},
      {k:'cut',t:'Cut every department to a tight budget',fx:'Saves money every week · the club works worse'}].filter(Boolean)}}
  else if(top&&rich.length){const by=apick(r,rich),fee=Math.round(askingFee(top,id)*(1.15+r()*.25));
    m={type:'bid',who:tdOf(id)?.name||'The director',role:'Director of football',title:`${CL(by).name} bid £${fee}k for ${top.name}`,line:`Our best player (${POS_ONE[top.pos]}, ${top.age}). It came in the day you arrived.`,pid:top.id,by,fee,opts:[
      {k:'accept',t:`Accept £${fee}k`,fx:'Money for the summer · the best player gone · members −3'},
      {k:'more',t:'Ask for more',fx:'Half the time +20%, else they walk'},
      {k:'refuse',t:'Not for sale',fx:'He stays · he may sulk'}]}}
  else if(co){m={type:'coach',who:co.name,role:'Head coach',title:`${co.name}'s future`,line:`${co.pro&&co.pro.contract<=1?'One year left on the contract.':'Settled in the job.'} The dressing room wants to know if you back him.`,opts:[
      {k:'extend',t:'A new two-year deal',fx:'Coach loyalty +10 · wages +10%'},
      {k:'prove',t:'Let him prove himself',fx:'Judged on your league promise from day one'}]}}
  return m}
defCommand('Handover',{check:(id,a)=>{const m=handoverMatter(id);if(!m)return'Nothing to hand over';if(S.handover.text)return'Already decided';if(!m.opts.some(o=>o.k===a.opt))return'Not an option';return null},run:(id,a)=>{
  const m=handoverMatter(id),H=S.handover,f=m.pid&&findPlayer(m.pid);let t='';
  if(m.type==='bid'){if(a.opt==='more'){if(ARNG(id+':hm')()<.5){m.fee=Math.round(m.fee*1.2);a.opt='accept';t=`They raised it to £${m.fee}k. `}else{H.text=`${CL(m.by).name} walked away. ${f.p.name} stays.`;return H}}
    if(a.opt==='accept'&&f){transfer(f.p,id,m.by,m.fee,'sold by the chairman');confLog(id,-3,'The best player sold on day one');t+=`${f.p.name} is sold to ${CL(m.by).name} for £${m.fee}k. The director has money to replace him.`}
    if(a.opt==='refuse'&&f){if(ARNG(id+':hr')()<.35){f.p.wantsOut=true;f.p.morale=clamp((f.p.morale??60)-12,0,100);t=`You turned it down. ${f.p.name} is not happy.`}else t=`You turned it down. ${f.p.name} stays and says he is glad.`}}
  if(m.type==='bank'){if(a.opt==='sell'&&f){const fee=Math.round(askingFee(f.p,id)*.9),b=allIds().filter(c=>c!==id&&F(c).cash>fee*1.5);if(b.length){const to=apick(ARNG(id+':hs'),b);transfer(f.p,id,to,fee,'sold to satisfy the bank');t=`${f.p.name} is sold to ${CL(to).name} for £${fee}k. The bank is satisfied.`}else t='Nobody could pay. The bank waits, unhappy.'}
    if(a.opt==='loan'){const o=m.opts.find(x=>x.k==='loan'),x=cmd('TakeLoan',id,{amount:o.amt,years:5});t=x.ok===false?x.err:`A £${o.amt}k loan over five years. The bank is satisfied, for now.`}
    if(a.opt==='cut'){for(const k in G(id).depts)cmd('SetDeptBudget',id,{dept:k,level:'tight'});t='Every department is on a tight budget. The staff grumble; the bank nods.'}}
  if(m.type==='coach'){const co=coachOf(id);if(a.opt==='extend'&&co&&co.pro){co.pro.contract=Math.max(co.pro.contract,1)+2;co.pro.wage=Math.round(co.pro.wage*1.1/5)*5;co.loy=clamp((co.loy??50)+10,0,100);t=`${co.name} signs for two more years. The dressing room settles.`}
    if(a.opt==='prove')t=`${co.name} knows where he stands: your league promise is his target.`}
  H.text=t;emit('Club',id,t);return H}});
/* how hard the job is: one star each for a weak squad for the target, money trouble and debt */
function jobStars(id){const ids=tierIds(CL(id).tier),r=ids.slice().sort((a,b)=>teamStrength(b)-teamStrength(a)).indexOf(id)+1,b=books(id);return 1+(r>ids.length*.6?1:0)+((b.tight||debt(id)>estSeasonIncome(id)*.2)?1:0)}
