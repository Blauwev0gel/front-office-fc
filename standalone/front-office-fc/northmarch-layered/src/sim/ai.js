/* ================= Simulation: rule-based club boards =================
   Every computer-run club decides through the same commands as the player (cmd(..., 'ai')): repairs, building,
   ticket prices and department budgets. The chairman's value colours the choices (money: careful, glory: bold).
   With S.auto the player's club is run by these rules too (used by the long simulation tests). */
function aiRuns(id){return id!==S.my||S.auto}
function reserveK(id){return wageBillK(id)*6+10}
function aiBoardWeek(id){
  const f=F(id),g=G(id),w=S.week,v=chairValue(id),res=reserveK(id);
  // the squad policy follows the money: rich boards spend, poor boards cut
  if(w===1||w===WINTER_WEEK){const inc=estSeasonIncome(id),base=v==='glory'?'ambitious':v==='money'?'tight':'normal';
    const pol=f.cash<res?'tight':f.cash>inc*1.1?'allin':f.cash>inc*.5?(base==='tight'?'normal':'ambitious'):base;
    cmd('SetSquadPolicy',id,{wage:pol,spend:f.cash>inc*.5?.8:v==='money'?.3:.5},'ai')}
  // department budgets follow the cash
  const want=f.cash<0?'tight':f.cash>res*3?'normal':f.cash<res*.5?'tight':'normal';
  for(const d in g.depts)if(g.depts[d].budget!==want)cmd('SetDeptBudget',id,{dept:d,level:want},'ai');
  // ticket prices: raise when full, lower when half empty
  if(w===2||w===12||w===22){const a=f.lastGate;if(a){const pr=f.prices,ref=PRICE_DEF[CL(id).tier];
    if(a.fill>.95&&pr.terrace<ref.terrace*1.6){cmd('SetPrice',id,{kind:'terrace',delta:1},'ai');cmd('SetPrice',id,{kind:'seated',delta:1},'ai')}
    else if(a.fill<.55&&pr.terrace>ref.terrace*.7){cmd('SetPrice',id,{kind:'terrace',delta:-1},'ai');cmd('SetPrice',id,{kind:'seated',delta:-1},'ai')}}}
  // repairs before anything falls apart
  if(w%5===3){for(const r of repairList(id).filter(x=>x.cond<45))if(f.cash-r.cost>res)cmd('Repair',id,{key:r.key},'ai')}
  // one building project at a time, only with money to spare
  const running=g.projects.filter(p=>p.phase!=='done').length;
  if((w===4||w===14||w===24)&&(running===0||(running<3&&f.cash>estSeasonIncome(id)*.6))){
    const o=aiPickProject(id);
    if(o){const offer=v==='money'?'cheap':v==='glory'?'premium':'standard',cost=o.cost*OFFER[offer].p;
      if(f.cash-cost>res*(v==='glory'?.8:1.3))cmd('StartProject',id,{key:o.key,offer},'ai')}}
}
function aiPickProject(id){
  const cat=projectCatalog(id).filter(o=>!o.busy),f=F(id),sg=groundSignals(id),g=G(id),has=k=>g.plots.some(p=>p.kind===k);
  const by=k=>cat.find(o=>o.key===k)||cat.find(o=>o.key.startsWith(k));
  const lvl=k=>{const p=g.plots.find(x=>x.kind===k);return p?p.lv:0};
  const free=g.plots.findIndex(p=>!p.kind);
  if(f.lastGate&&f.lastGate.fill>.9){if(sg.limitedBy)return by('fac:'+sg.limitedBy);const s=Object.keys(g.sides).find(k=>g.sides[k].type==='terrace')||'N';return by('side:'+s+':ring')}
  if(sg.limitedBy&&f.lastGate&&f.lastGate.total>sg.capacity*.85)return by('fac:'+sg.limitedBy);
  if(lvl('training')<(CL(id).tier===0?3:2)){const i=g.plots.findIndex(p=>p.kind==='training');return i>=0?by('plot:'+i+':up'):free>=0?by('plot:'+free+':training'):null}
  if(!has('medical')&&free>=0&&CL(id).tier<=1)return by('plot:'+free+':medical');
  if(!has('academy')&&free>=0)return by('plot:'+free+':academy');
  if(!has('commercial')&&free>=0)return by('plot:'+free+':commercial');
  if(!has('scouting')&&free>=0)return by('plot:'+free+':scouting');
  const ups=['training','medical','academy'].map(k=>{const i=g.plots.findIndex(p=>p.kind===k);return i>=0?by('plot:'+i+':up'):null}).filter(Boolean).sort((a,b)=>a.cost-b.cost);
  return ups[0]||null;
}
