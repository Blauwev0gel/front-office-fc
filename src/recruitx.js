/* The Front Office · Recruitment as a department you run
   The scouting network per region (focus and investment), the DoF's track record of hits and
   misses, and staff with concrete effects (extra scout, sharper reports, lower fees: see recruit.js). */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, money, M, staff, man } = F;
function R() { const G = g(); if (!G.recX) G.recX = { investAt: -99, log: [], rec: [] }; return G.recX; }
function regions() { const c = g().club, f1 = man('scout', 'reg1'), f2 = man('scout', 'reg2'); return Object.keys(F.REGIONS).map(k => ({ k, t: F.REGIONS[k].name, net: Math.round(c.net[k] || 0), focus: k === f1 ? 1 : k === f2 ? 2 : 0 })); }
function setFocus(k) {
  const G = g(), f1 = man('scout', 'reg1'), f2 = man('scout', 'reg2'); if (!F.REGIONS[k]) return;
  const m = Object.assign({}, G.mand.scout);
  if (k === f1) return { out: `${F.REGIONS[k].name} is already the main focus.` };
  if (k === f2) { m.reg1 = k; m.reg2 = f1; } else { m.reg2 = f1; m.reg1 = k; }
  G.mand.scout = m; return { out: `Scouts now focus on ${F.REGIONS[m.reg1].name}, then ${F.REGIONS[m.reg2].name}.` };
}
function invest(k) {
  const G = g(), X = R(), now = F.absWeek(); if (!staff('scout')) return { err: 'You need a chief scout first.' };
  if (now - X.investAt < 8) return { err: `Next trip possible in ${8 - (now - X.investAt)} weeks.` };
  const cost = Math.round(M(1500) / 100) * 100; if (G.club.cash < cost) return { err: `Needs ${money(cost)}.` };
  G.club.cash -= cost; X.investAt = now; G.club.net[k] = clamp((G.club.net[k] || 0) + 12 + F.eff('scout', 2) * 0.4, 0, 100);
  X.log.unshift({ w: G.week, t: `Scouting trip to ${F.REGIONS[k].name} (${money(cost)}).` });
  return { out: `Scouting trip booked: the ${F.REGIONS[k].name} network grows.` };
}
// the DoF's record over every season he has signed for
function record() {
  const G = g(), out = []; for (let s = 1; s <= G.season; s++) { let ev = []; try { ev = F.recEval ? F.recEval(s) : []; } catch (e) { ev = []; } for (const e of ev) if (e.verdict === 'Hit' || e.verdict === 'Miss') out.push({ s, name: e.name, v: e.verdict, pos: e.pos, pid: e.p ? e.p.id : null }); }
  return out;
}
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(); if (G.week !== 30) return;
  const rec = record().filter(x => x.s === G.season), hit = rec.filter(x => x.v === 'Hit').length, miss = rec.length - hit, d = staff('dof');
  if (d && rec.length >= 2) { const delta = clamp((hit - miss) * 2, -6, 6); d.rel = clamp(d.rel + delta, 0, 100); d.perf = clamp(d.perf + delta, 0, 100); R().log.unshift({ w: G.week, t: `Signings this season: ${hit} hits, ${miss} misses.` }); }
};
function view() { const X = R(), rec = record(); return { regions: regions(), investIn: Math.max(0, 8 - (F.absWeek() - X.investAt)), cost: Math.round(M(1500) / 100) * 100, rec, hits: rec.filter(x => x.v === 'Hit').length, misses: rec.filter(x => x.v === 'Miss').length, log: X.log.slice(0, 6) }; }
Object.assign(F, { rxView: view, rxFocus: setFocus, rxInvest: invest });
})(FO);

/* Living squad plan: one recruitment pipeline, two planning horizons. */
(function(F){
'use strict';
const g=()=>F.G, sq=()=>g().squad, POS=F.POS_L;
const copy=x=>JSON.parse(JSON.stringify(x));
const at=()=>F.absWeek(), has=r=>!!F.staff(r);
function state(){
  const G=g();if(!G.rec){if(F.HOOK.recMigrate)F.HOOK.recMigrate();}
  const r=G.rec;
  if(!r.squadPlan)r.squadPlan={v:1,revision:0,season:G.season,rows:[],history:[],decisions:[],attempts:{},asked:{},seen:0,lastWork:-1,scoutTurn:0};
  return r.squadPlan;
}
function note(kind,text,extra={}){const p=state();p.history.unshift({kind,text,season:g().season,week:g().week,at:at(),...extra});p.history=p.history.slice(0,80);}
function corePlayers(players){return players.slice().sort((a,b)=>(b.ca||0)-(a.ca||0)).slice(0,2);}
function rows(){
  const G=g(), avgW=F.playerWages()/Math.max(1,sq().length);
  return Object.keys(F.REQ).map(pos=>{
    const ps=sq().filter(p=>p.pos===pos),req=F.REQ[pos],core=corePlayers(ps);
    const available=ps.filter(p=>(p.inj||0)<=4&&!p.loanOut).length;
    const long=ps.filter(p=>(p.inj||0)>4), exp=core.filter(p=>p.contract<=1&&!p.loan), ageing=core.filter(p=>p.age>=31),loans=ps.filter(p=>p.loan);
    const youth=ps.filter(p=>p.academy&&p.age<=21&&!p.loanOut), old=core[0];
    const successor=youth.find(p=>p!==old&&F.stars(p.ca)>=Math.max(1,F.stars(old?.ca||0)-.5));
    const under=ps.filter(p=>(p.st?.apps||0)>=5&&(p.st.rat/p.st.apps)<6.4);
    const fragile=core.filter(p=>(state().health?.[p.id]?.episodes||0)>=3);
    let winterScore=0,summerScore=0;const reasons=[],future=[];
    if(ps.length<req){winterScore=100+(req-ps.length)*5;reasons.push(`${ps.length} players for ${req} planned squad places`);}
    if(long.length&&available<req){winterScore=Math.max(winterScore,90);reasons.push(`${long.map(p=>p.name+' ('+p.inj+' weeks)').join(', ')} unavailable long term; ${available} fit or short-term cover`);}
    if(under.length&&ps.length<=req){winterScore=Math.max(winterScore,55);reasons.push(`${under.map(p=>p.name).join(', ')} averaging below 6.4 over at least five appearances`);}
    if(exp.length){summerScore=90;future.push(`${exp.map(p=>p.name).join(', ')} in the final contract year`);}
    if(loans.length){summerScore=Math.max(summerScore,85);future.push(`${loans.map(p=>p.name).join(', ')} on temporary contracts`);}
    if(ageing.length&&!successor){summerScore=Math.max(summerScore,75);future.push(`${ageing.map(p=>p.name+' ('+p.age+')').join(', ')} need succession cover`);}
    if(winterScore){summerScore=Math.max(summerScore,80);future.push('Review whether a short-term gap needs a permanent solution');}
    if(under.length){summerScore=Math.max(summerScore,65);future.push('Reassess performance before replacing players');}
    if(fragile.length){summerScore=Math.max(summerScore,70);future.push(`${fragile.map(p=>p.name).join(', ')} have at least three injury spells recorded by the rolling plan`);}
    const expensive=ps.filter(p=>p.wage>avgW*1.5&&(p.st?.apps||0)>=3&&p.st.rat/p.st.apps<6.4);
    if(expensive.length){summerScore=Math.max(summerScore,60);future.push(`${expensive.map(p=>p.name).join(', ')} offer weak recent returns for their wages`);}
    if(successor)future.push(`${successor.name} offers an internal pathway; assess before buying a replacement`);
    if(successor&&ageing.length)summerScore=Math.max(summerScore,50);
    return {pos,n:ps.length,req,available,long:long.map(p=>({id:p.id,name:p.name,weeks:p.inj})),exp:exp.map(p=>({id:p.id,name:p.name})),ageing:ageing.map(p=>p.name),loans:loans.map(p=>p.name),successor:successor?{id:successor.id,name:successor.name}:null,winterScore,summerScore,reasons,future,kind:successor?'value':G.club.dna.talent==='academy'?'young':G.club.dna.talent==='smart'?'value':'proven'};
  });
}
function action(row,horizon){
  if(!has('dof'))return 'Appoint a Director of Football to own this plan.';
  if(!has('scout'))return 'Recruitment coverage is limited until a Chief Scout is appointed.';
  if(horizon==='winter')return row.long.length&&row.n>=row.req?'Compare loans and short-term cover; drop the move if the injured player recovers.':'Scout available cover within the existing mandate; no signing is promised.';
  if(row.exp.length)return `Seek affordable renewals for key players and scout alternatives in parallel${row.successor?'; assess '+row.successor.name+' with the coach':''}.`;
  if(row.successor)return `Monitor ${row.successor.name} with the coach before committing to an external successor.`;
  if(row.loans.length)return 'Scout permanent alternatives before the loan players return to their clubs.';
  if(row.ageing.length)return 'Watch younger successors now; retain current experience while reports improve.';
  return 'Build reports and compare the squad again before committing money.';
}
function refresh(log=true){
  const p=state(),G=g(),previous=p.rows||[],newSeason=p.season!==G.season;
  p.health=p.health||{};for(const q of sq()){const old=p.health[q.id];const injured=(q.inj||0)>0;p.health[q.id]={injured,episodes:(old?.episodes||0)+(injured&&!old?.injured?1:0)};}
  const fresh=rows();
  const changes=[];
  for(const r of fresh){const old=previous.find(x=>x.pos===r.pos);if(!old)continue;
    if(r.winterScore>=90&&old.winterScore<90)changes.push(`${POS[r.pos]} now needs near-term cover: ${r.reasons.join('; ')}.`);
    if(old.winterScore>=90&&r.winterScore<90)changes.push(`${POS[r.pos]} cover has recovered; the emergency recruitment priority is withdrawn.`);
    if(r.exp.length!==old.exp.length)changes.push(`${POS[r.pos]} contract outlook changed: ${r.exp.length} key contract${r.exp.length===1?'':'s'} entering the next summer unresolved.`);
    if(r.successor?.id!==old.successor?.id)changes.push(r.successor?`${r.successor.name} is now an internal succession option at ${POS[r.pos]}.`:`The internal succession option at ${POS[r.pos]} needs reassessment.`);
    if(r.winterScore===55&&old.winterScore!==55)changes.push(`${POS[r.pos]} performance is now a scouting concern, not an automatic instruction to buy.`);
  }
  const signature=JSON.stringify(fresh.map(r=>[r.pos,r.n,r.available,r.winterScore,r.summerScore,r.exp.map(x=>x.id),r.successor?.id,r.ageing,r.loans]));
  if(signature!==p.signature||newSeason){p.revision++;p.signature=signature;}
  p.season=G.season;p.week=G.week;p.rows=fresh;
  const winterOpen=(G.phase==='season'&&G.week<=18&&G.winDone!==G.season)||(G.phase==='summer'&&!!G.sum&&!!G.sum.win);
  p.winter={season:G.season,status:winterOpen?(G.week<17?'preparing':'open'):'closed',rows:winterOpen?fresh.filter(r=>r.winterScore>0).sort((a,b)=>b.winterScore-a.winterScore||a.pos.localeCompare(b.pos)).slice(0,3):[]};
  p.summer={season:G.phase==='summer'?G.season:G.season+1,rows:fresh.filter(r=>r.summerScore>0).sort((a,b)=>b.summerScore-a.summerScore||a.pos.localeCompare(b.pos)).slice(0,4)};
  const cap=+F.man('fin','wageCap');
  p.finance={cash:G.club.cash,fees:F.transferBudget(),weeklyRoom:Math.floor(F.revenueAvg()*cap/100-F.playerWages()),cap};
  p.summary=!has('dof')?'The DoF post is vacant; scouting can continue, but nobody owns renewal decisions or the recruitment plan.':p.winter.rows.some(r=>r.winterScore>=90)?'I am balancing immediate cover against the next summer. Short-term problems get short-term options first.':p.summer.rows.length?'No emergency purchase is justified. We are preparing succession and contract alternatives before the next summer.':'The squad is covered. Scouts maintain market coverage and test the weakest areas; there is no need to invent a purchase.';
  if(log&&G.phase==='season'&&changes.length){changes.slice(0,3).forEach(text=>note('change',text));p.notice={revision:p.revision,text:changes.slice(0,2).join(' '),at:at()};}
  if(log&&!previous.length&&G.phase==='season'){note('plan','The DoF opened a rolling squad plan for winter and the next summer.');p.notice={revision:p.revision,text:p.summary,at:at()};}
  p.checkpoints=p.checkpoints||{};
  const checkpoint=G.season+':'+G.week;
  if(log&&G.phase==='season'&&[14,19,26].includes(G.week)&&!p.checkpoints[checkpoint]){p.checkpoints[checkpoint]=true;p.revision++;const text=G.week===19?'Winter business is closed. Outstanding needs now feed summer preparation.':G.week===14?(p.winter.rows.length?'Winter preparation: '+p.winter.rows.map(r=>POS[r.pos]).join(', ')+'. '+p.summary:'Winter preparation: the TD advises against buying; current cover is adequate.'):'Summer preparation: '+p.summary;p.notice={revision:p.revision,text,at:at()};note('review',text);}
  return p;
}
function priorities(){
  const p=state();if(!p.rows.length)refresh(false);
  const near=p.winter.rows.map(r=>({pos:r.pos,kind:'proven',horizon:'winter',why:r.reasons.join('; '),urgent:r.winterScore>=90}));
  const future=p.summer.rows.filter(r=>r.summerScore>50).map(r=>({pos:r.pos,kind:r.ageing.length?'young':r.kind,horizon:'summer',why:r.future.join('; ')}));
  return {near,future};
}
F.squadPlanScoutJob=()=>{
  if(g().phase!=='season')return null;
  const {near,future}=priorities();
  const jobs=[];if(near.length&&future.length){const n=near.slice(0,2),f=future.slice(0,2);for(let i=0;i<Math.max(n.length,f.length);i++){if(n[i])jobs.push(n[i]);if(f[i])jobs.push(f[i]);}}
  else jobs.push(...near,...future);
  const scouts=[F.staff('scout'),...(g().rec.scouts||[])].filter(Boolean);
  const uncovered=near.find(j=>j.urgent&&!scouts.some(s=>s.assign?.pos===j.pos&&s.assign?.horizon==='winter'));
  if(uncovered)return uncovered;
  const p=state();return jobs.length?jobs[p.scoutTurn++%jobs.length]:null;
};
F.squadPlanAllows=(player)=>{
  if(g().phase!=='season')return true;
  const p=state();if(!p.rows.length)refresh(false);
  // Winter spending serves the live near-term plan; future-only targets remain on the list.
  if(g().week>=15&&g().week<=18)return p.winter.rows.some(r=>r.pos===player.pos);
  return true;
};
function renewals(){
  const G=g(),p=state();if(!has('dof')||!has('coach')||G.week<6||G.week>29||G.week%4!==2)return;
  const ids=new Set(p.rows.flatMap(r=>r.exp.map(x=>x.id)));
  const player=sq().filter(q=>ids.has(q.id)&&q.age<33&&!p.attempts[G.season+':'+q.id]).sort((a,b)=>b.ca-a.ca)[0];if(!player)return;
  const key=G.season+':'+player.id;
  const wage=Math.round(Math.max(player.wage,F.wageFor(player.ca))*(1.02+(player.pers?.amb||10)/200)/5)*5;
  const wageRoom=F.revenueAvg()*(+F.man('fin','wageCap'))/100-F.playerWages()+player.wage;
  p.attempts[key]={season:G.season,pid:player.id,name:player.name,wage,week:G.week,status:'assessed'};
  if(wage>F.recWageLimit()||wage>wageRoom){p.attempts[key].status='blocked';p.attempts[key].individual=wage>F.recWageLimit();note('contract',`${F.staffName('dof')} cannot renew ${player.name} within the current wage rules; alternatives remain under observation.`,{pid:player.id});return;}
  if(F.chance(.2+(player.pers?.amb||10)/100-(player.pers?.loy||10)/150)){p.attempts[key].status='refused';note('contract',`${player.name} declines the DoF's contract proposal. The club retains its limits and scouts succession options.`,{pid:player.id});return;}
  player.wage=wage;player.contract=player.age>=30?2:3;p.attempts[key].status='renewed';note('contract',`${F.staffName('dof')} renews ${player.name} for ${player.contract} years at ${F.money(wage)}/week, within the mandate.`,{pid:player.id});
}
function requestPolicy(){
  const G=g(),p=state();if(!has('dof')||G.phase!=='season')return;
  const winter=G.week>=14&&G.week<=18&&p.winter.rows.some(r=>r.winterScore>=90);
  const blocked=Object.values(p.attempts).filter(x=>x.season===G.season&&x.status==='blocked'&&sq().some(q=>q.id===x.pid&&q.contract<=1));
  const wageProblem=p.finance.weeklyRoom<=0||blocked.length>0;
  const type=blocked.some(x=>x.individual)?'individual':wageProblem&&(winter||blocked.length)?'wages':winter&&p.finance.fees<=0?'fees':null;
  if(!type)return;
  const key=G.season+':'+type;if(p.asked[key])return;
  const live=G.inbox.some(m=>m.ev==='squad_plan_policy'&&!m.done)||G.queue.some(q=>q.id==='squad_plan_policy');if(live)return;
  const cap=+F.man('fin','wageCap'), release=+F.man('fin','transfer'),risk=+F.man('fin','risk'),nextRisk=Math.min(60,risk+20);
  const wk=F.playerWages()+F.staffWages(),share=has('fin')?.25+.6*release/100:.4,kit=(G.club.kitty||0)*(has('fin')?.6+.8*release/100:.8);
  const proposedFees=Math.max(0,Math.round(Math.min(Math.max(0,G.club.cash),kit+Math.max(0,(G.club.cash-(8-nextRisk/10)*wk)*share))/100)*100);
  if(type==='wages'&&cap>=85||type==='fees'&&(!has('fin')||nextRisk<=risk||proposedFees<=p.finance.fees)||type==='individual'&&String(F.man('dof','maxWage'))==='999')return;
  p.asked[key]=true;
  F.queueEvent('squad_plan_policy',{type,key,season:G.season,positions:p.winter.rows.map(r=>r.pos),contracts:blocked.map(x=>x.pid),wageCap:cap,nextRisk,why:type==='individual'?`${blocked.map(x=>x.name).join(', ')} cannot be renewed under the individual salary limit in the DoF mandate.`:type==='wages'?`${blocked.length?blocked.map(x=>x.name).join(', ')+' cannot be renewed within the existing wage rules. ':''}Weekly player-wage headroom is ${F.money(p.finance.weeklyRoom)}.`:`Finance can release about ${F.money(proposedFees-p.finance.fees)} of existing cash by reducing the wage reserve from ${(8-risk/10).toFixed(1)} to ${(8-nextRisk/10).toFixed(1)} weeks. That weakens the cash cushion; it creates no income.`});
}
F.squadPlanPrepare=()=>{
  if(g().phase!=='season')return;
  const p=refresh(true);if(p.lastWork===at())return;p.lastWork=at();
  renewals();refresh(true);requestPolicy();
  const scouts=[F.staff('scout'),...(g().rec.scouts||[])].filter(Boolean);
  for(const s of scouts)if(s.assign?.horizon==='winter'&&!p.winter.rows.some(r=>r.pos===s.assign.pos))s.assign=null;
  const urgent=p.winter.rows.find(r=>r.winterScore>=90&&!scouts.some(s=>s.assign?.pos===r.pos&&s.assign?.horizon==='winter'));
  if(urgent&&scouts.length&&scouts.every(s=>s.assign&&s.assign.left>0)){
    const free=scouts.find(s=>s.assign.horizon!=='winter');if(free){free.assign=null;note('scouting',`The TD redirects ${free.name} from longer-term work to the new ${POS[urgent.pos]} cover need.`);}
  }
  // Stale summer priorities no longer drive winter negotiation; the written summer brief is preserved.
  if(g().week>=3){g().rec.plan.prios=p.winter.rows.map(r=>({pos:r.pos,kind:'proven'}));g().rec.plan.set=true;}
};
F.squadPlanView=()=>{
  const p=refresh(true),R=g().rec,scouts=[F.staff('scout'),...(R.scouts||[])].filter(Boolean);
  const enrich=(r,horizon)=>{
    const targets=R.pipe.filter(x=>R.pool[x.pid]?.pos===r.pos&&R.know[x.pid]&&!['lost','signed'].includes(x.stage));
    const reliable=targets.filter(x=>R.know[x.pid].conf!=='low');
    const workers=scouts.filter(s=>s.assign?.pos===r.pos&&s.assign?.horizon===horizon);
    return {...r,reason:(horizon==='winter'?r.reasons:r.future).join('; '),action:action(r,horizon),targets:targets.length,reliable:reliable.length,scouts:workers.map(s=>s.name)};
  };
  return {season:p.season,week:p.week,revision:p.revision,summary:p.summary,owner:F.staffName('dof'),vacant:!has('dof'),winter:{...p.winter,rows:p.winter.rows.map(r=>enrich(r,'winter'))},summer:{...p.summer,rows:p.summer.rows.map(r=>enrich(r,'summer'))},finance:copy(p.finance),history:copy(p.history.slice(0,8)),decisions:copy(p.decisions.slice(-4)),assignments:scouts.map(s=>({name:s.name,label:s.assign?.label||'Between assignments',horizon:s.assign?.horizon||'coverage'})),discussion:p.discussion||null};
};
F.squadPlanAsk=q=>{
  const p=refresh(false),v=F.squadPlanView();let answer='';
  if(q==='winter')answer=v.winter.status==='closed'?'The winter window is closed. I am carrying unresolved needs into summer preparation, not pursuing out-of-window deals.':v.winter.rows.length?v.winter.rows.map(r=>`${POS[r.pos]}: ${r.reason}. ${r.action}`).join(' '):'The current squad does not justify a winter purchase. Scouts keep building summer options; a new sustained shortage will change that recommendation.';
  if(q==='summer')answer=v.summer.rows.length?v.summer.rows.map(r=>`${POS[r.pos]}: ${r.reason}. ${r.action}`).join(' '):'No specific succession gap is currently identified. Scouts continue regional coverage and I will revise the plan when contracts, performances or availability change.';
  if(q==='help')answer=`You set the financial limits and resolve policy conflicts. Current fee room is ${F.money(v.finance.fees)} and weekly player-wage headroom is ${F.money(v.finance.weeklyRoom)}; neither is a promise of next summer's budget. ${!has('scout')?'Appoint a Chief Scout to restore coordinated scouting.':p.winter.rows.some(r=>r.winterScore>=90)?'I am looking for cover within the mandate; any requested change to club limits comes to your red box.':'No intervention is needed now; let the staff continue and judge progress when the facts change.'}`;
  if(!answer)return;p.discussion={q,answer,week:g().week,season:g().season};return answer;
};
function policyLive(c){
  if(c.season!==g().season||!has('dof')||g().phase!=='season')return false;
  const p=refresh(false),contracts=(c.contracts||[]).some(id=>sq().some(q=>q.id===id&&q.contract<=1));
  return contracts||g().week<=18&&p.winter.rows.some(r=>r.winterScore>=90);
}
function policyAnswer(c,change){
  const p=state();if(!policyLive(c))return 'The underlying need has changed; the TD withdraws the request and keeps the current limits.';
  let text='The CEO kept the existing limits. The TD will seek affordable alternatives and retain the unresolved risk in the plan.';
  if(change){
    if(c.type==='individual'){
      const choices=['100','150','200','999'],now=String(F.man('dof','maxWage')),next=choices[Math.min(choices.length-1,choices.indexOf(now)+1)];
      g().mand.dof.maxWage=next;
      for(const id of c.contracts||[]){const key=g().season+':'+id;if(p.attempts[key]?.status==='blocked')delete p.attempts[key];}
      text=`The CEO relaxed the DoF's individual wage limit from ${now==='999'?'unlimited':now+'% of squad average'} to ${next==='999'?'unlimited':next+'% of squad average'}. The club-wide wage cap remains in force.`;
    }else if(c.type==='wages'){
      const choices=[50,60,70,85],now=+F.man('fin','wageCap'),next=choices.find(n=>n>now);
      if(!next)return 'The wage policy is already at its highest setting; no extra authority was granted.';
      g().mand.fin.wageCap=String(next);
      // Individual wage limits remain in force. Reassess previously blocked renewals under the new club cap.
      for(const id of c.contracts||[]){const key=g().season+':'+id;if(p.attempts[key]?.status==='blocked')delete p.attempts[key];}
      text=`The CEO changed the club wage cap from ${now}% to ${next}% of revenue. Individual wage limits still apply; more recurring wages reduce future flexibility.`;
    }else{
      const now=+F.man('fin','risk'),next=Math.min(60,c.nextRisk);
      if(!has('fin')||next<=now)return 'Finance no longer has the proposed reserve release available; the TD retains the current policy.';
      g().mand.fin.risk=next;
      text=`The CEO reduced the wage reserve from ${(8-now/10).toFixed(1)} to ${(8-next/10).toFixed(1)} weeks, releasing existing cash through Finance. No money was created; the available fee budget is now ${F.money(F.transferBudget())}.`;
    }
  }
  p.decisions.push({season:g().season,week:g().week,type:c.type,changed:change,text});note('CEO decision',text);refresh(true);return text;
}
F.defineEvent('squad_plan_policy',{forced:1,from:'dof',dept:'sporting',cd:8,why:'The rolling squad plan needs a change to club financial policy; the TD cannot change that authority alone.',
  title:c=>c.type==='fees'?'Squad plan: cover needs a financial decision':'Squad plan: the wage policy is binding',
  body:c=>policyLive(c)?`${c.why} The TD has assessed the mandate and is scouting alternatives. Recommendation: retain the limits unless you accept reduced financial protection; without a change, the gap or contract risk remains.`:'The underlying need has changed. The TD withdraws the request; either response closes the file without changing policy.',
  opts:[{l:'Change the club financial policy one step',h:'More room for the TD, less financial protection',f:c=>policyAnswer(c,true)},{l:'Keep the limits; continue with alternatives',h:'Protect finances; accept the recorded squad risk',f:c=>policyAnswer(c,false)}],auto:()=>1});
// Keep strategic choices with the CEO, even if the DoF has a free hand.
const previousWeekly=F.HOOK.recWeekly;
F.HOOK.recWeekly=()=>{
  if(g().phase==='season')F.squadPlanPrepare();
  if(previousWeekly)previousWeekly();
  if(g().phase==='season')refresh(true);
};
const previousSeason=F.HOOK.seasonWeekly;
F.HOOK.seasonWeekly=()=>{if(previousSeason)previousSeason();if(g().phase==='season')refresh(true);};
const previousSummer=F.HOOK.summerStart;
F.HOOK.summerStart=()=>{const prior=g().rec?.squadPlan;if(prior)prior.handover=copy(prior.summer);if(previousSummer)previousSummer();if(g().rec)refresh(false);};
const suggest=F.recPlanSuggest;
F.recPlanSuggest=()=>{
  const original=suggest();if(!g().rec?.squadPlan)return original;
  const p=refresh(false),future=p.summer.rows.filter(r=>r.summerScore>50).map(r=>({pos:r.pos,kind:r.ageing.length?'young':r.kind,why:r.future.join('; ')}));
  return [...future,...original.filter(x=>!future.some(y=>y.pos===x.pos))].slice(0,6);
};
if(F.BR.dof_priority)F.BR.dof_priority.check=()=>null;
if(F.BR.block_runin)F.BR.block_runin.check=()=>null; // Routine renewals now belong to the DoF.
if(F.BR.block_winter)F.BR.block_winter.check=()=>null; // The rolling plan supplies a recommendation, not an arbitrary budget prompt.
F.defineBrief('squad_plan_update',{role:'dof',cd:4,
  check:()=>{const p=state();return g().phase==='season'&&p.notice&&p.notice.revision>(p.delivered||0)?{revision:p.notice.revision,text:p.notice.text,score:3.8}:null;},
  title:()=> 'The squad plan has changed',text:c=>`${F.staffName('dof')}: ${c.text} The rolling plan and current scouting work are available in Recruitment.`,
  opts:[{l:'Noted; keep working within the mandate',h:'The TD continues; no new spending authority',f:c=>{state().seen=Math.max(state().seen,c.revision);return 'The TD continues with the recorded plan.';}}]});
F.squadPlanDelivered=revision=>{state().delivered=Math.max(state().delivered||0,revision);};
})(FO);
