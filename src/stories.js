/* THE FRONT OFFICE · CLUB STORY ENGINE V1
   Three state-driven, 8–12-week stories on existing staff, players and finance.
   Uses existing event decisions, weekly hooks, and seeded game RNG.
   No CEO team selection; no fixed outcome or artificial weekly event quota. */
(function (F) {
'use strict';
const H=F.HOOK, clamp=F.clamp, money=F.money, M=F.M, NOW=()=>F.absWeek();
const TYPE={conflict:{t:'Coach and DoF',role:'coach'},youth:{t:'Academy prospect',role:'acad'},finance:{t:'Cash and credibility',role:'fin'}};
const S=()=>{
  const G=F.G;
  if (!G.storybook || typeof G.storybook!=='object') G.storybook={seq:0,active:{},history:[],last:{},lastStart:-99};
  const s=G.storybook;
  if (!s.active || typeof s.active!=='object') s.active={};
  if (!Array.isArray(s.history)) s.history=[];
  if (!s.last || typeof s.last!=='object') s.last={};
  return s;
};
const at=(kind,c)=>{const a=S().active[kind];return a&&a.id===c.sid?a:null};
const player=id=>F.G.squad.find(p=>p.id===id)||F.G.academy.find(p=>p.id===id);
const inClub=(id)=>F.G.squad.some(p=>p.id===id);
const staff=r=>F.staff(r);
const tune=(r,n)=>{const s=staff(r);if(s)s.rel=clamp(s.rel+n,0,100);};
const story=(s,t)=>{s.log.push({w:NOW(),t});s.log=s.log.slice(-10);};
const note=(s,t)=>{story(s,t);F.G.paper.stories.push({h:TYPE[s.kind].t,t});};
const hasPathway=()=>F.G.pw && F.G.pw.stage!=='closed';
function eligible(kind) {
  const G=F.G;
  if (!G || G.phase!=='season'||G.week<5||G.week>20)return false;
  if(kind==='conflict') {
    if(!staff('coach')||!staff('dof'))return false;
    return Math.abs(+F.man('coach','youthMins')-+F.man('dof','youth'))>=22||
      staff('coach').rel<45||staff('dof').rel<45||
      G.form.slice(-4).filter(x=>x==='L').length>=2;
  }
  if(kind==='youth') {
    if(!staff('acad')||!staff('coach')||hasPathway())return false;
    return G.academy.some(p=>p.age>=17&&p.pa>=F.tierAvg(G.club.tier)+0.6&&
      p.pa-p.ca>=1&&!p.loanOut);
  }
  if(kind==='finance') {
    if(!staff('fin')||!staff('com'))return false;
    const f=G.fin&&G.fin.last;
    return G.club.cash<0||
      (G.club.cash<M(15000)&&F.wageRatio()>0.55)||
      !!(f&&f.tout>f.tin&&G.club.cash<(f.tout-f.tin)*8);
  }
  return false;
}
function start(kind,forced) {
  const G=F.G,book=S(),now=NOW();
  if(!TYPE[kind]||!eligible(kind)||book.active[kind]||Object.keys(book.active).length>=2)return false;
  if(book.last[kind]!=null&&now-book.last[kind]<55)return false;
  if(!forced&&(now-book.lastStart<5||F.rnd()>0.38))return false;
  const s={id:++book.seq,kind,started:now,stage:0,phase:'opening',
    route:null,due:null,log:[],decision:[],baseline:{cash:G.club.cash,board:G.board.conf,
    xgf:G.ss.xgf,xga:G.ss.xga,played:G.ss.lg},meta:{}};
  if(kind==='conflict')s.meta={coachId:staff('coach').id,dofId:staff('dof').id,
    coach:staff('coach').name,dof:staff('dof').name};
  if(kind==='finance')s.meta={finId:staff('fin').id,comId:staff('com').id,
    fin:staff('fin').name,com:staff('com').name};
  if(kind==='youth') {
    const p=G.academy.filter(p=>p.age>=17&&p.pa>=F.tierAvg(G.club.tier)+0.6&&p.pa-p.ca>=1&&!p.loanOut)
      .sort((a,b)=>(b.pa-b.ca)-(a.pa-a.ca))[0];
    if(!p)return false;
    s.meta={pid:p.id,name:p.name,ca:p.ca,welfare:p.wel||65,acadId:staff('acad').id,coachId:staff('coach').id};
  }
  book.active[kind]=s;book.last[kind]=now;book.lastStart=now;
  story(s,'The club situation has become important enough to discuss.');
  F.queueEvent('story_'+kind+'_opening',{sid:s.id});
  return true;
}
function intro(kind,c,choice) {
  const s=at(kind,c),G=F.G;if(!s||s.phase!=='opening')return 'The discussion is no longer open.';
  const routes={conflict:['dof','joint','coach'],youth:['fast','phase','care'],
    finance:['cut','sponsor','hold']};
  s.route=routes[kind][choice];s.stage=1;s.phase='running';s.due=NOW()+3;
  s.decision.push({week:NOW(),choice:s.route});
  let outcome='';
  if(kind==='conflict') {
    if(s.route==='dof') {
      G.mand.dof.youth=clamp(+F.man('dof','youth')+15,0,100);
      tune('dof',3);tune('coach',-3);
      outcome='The DoF has a stronger youth recruitment mandate. The coach keeps control of selection.';
    } else if(s.route==='coach') {
      G.mand.dof.youth=clamp(+F.man('dof','youth')-15,0,100);
      tune('coach',3);tune('dof',-3);
      outcome='Recruitment must seek more first-team-ready players. The DoF remains responsible for finding them.';
    } else outcome='You ask both men for a joint plan. They will attempt to agree it themselves.';
  }
  if(kind==='youth') {
    const p=player(s.meta.pid);
    if(!p){outcome='The player has left; the academy will report on what happened.';}
    else if(s.route==='fast'){
      p.playUp=true;G.mand.acad.pace=clamp(+F.man('acad','pace')+12,0,100);
      G.mand.coach.youthMins=clamp(+F.man('coach','youthMins')+10,0,100);
      outcome='The Academy Director accelerates development. The coach retains control over first-team minutes.';
    }else if(s.route==='care'){
      p.keep=true;p.playUp=false;G.mand.acad.welfare=clamp(+F.man('acad','welfare')+10,0,100);
      outcome='Education and welfare come first. No first-team appearance has been promised.';
    }else {p.mentor=true;outcome='The academy assigns a mentor and monitors his readiness. No promotion is guaranteed.';}
  }
  if(kind==='finance') {
    if(s.route==='cut'){
      G.mand.fin.risk=clamp(+F.man('fin','risk')-12,0,100);
      outcome='Finance receives a cost-control mandate. The head will review departmental budgets next week.';
    }else if(s.route==='sponsor')outcome='Commercial has three weeks to find credible additional income. No money has been booked yet.';
    else {tune('fin',-3);outcome='Investment continues. The cash position and board confidence remain exposed.';}
  }
  story(s,'CEO instruction: '+outcome);return outcome;
}
function autonomous(s) {
  const G=F.G,kind=s.kind;
  if(kind==='conflict') {
    const coach=staff('coach'),dof=staff('dof');
    if(!coach||!dof||coach.id!==s.meta.coachId||dof.id!==s.meta.dofId)
      return 'One of the original heads has left. His replacement inherits the mandates, not the disagreement.';
    const trust=(coach.rel+dof.rel)/200;
    if(s.route==='joint') {
      const agree=F.rnd()<clamp(.17+trust*.50+(F.eff('coach',1)+F.eff('dof',0))/120,.25,.85);
      if(agree){
        const target=Math.round((+F.man('coach','youthMins') + +F.man('dof','youth'))/2);
        G.mand.coach.youthMins=clamp(Math.round((+F.man('coach','youthMins')+target)/2),0,100);
        G.mand.dof.youth=clamp(Math.round((+F.man('dof','youth')+target)/2),0,100);
        tune('coach',4);tune('dof',4);
        s.meta.agreed=true;
        return 'The coach and DoF have moved their plans closer together. Both accepted a revised youth brief.';
      }
      tune('coach',-2);tune('dof',-2);
      return 'They failed to agree a joint brief. Their differing instructions remain in force.';
    }
    const backed=s.route==='dof'?'dof':'coach',other=backed==='dof'?'coach':'dof';
    const accepted=F.rnd()<clamp(.3+staff(other).rel/180-staff(other).p.ego/100,.12,.78);
    if(accepted){tune(backed,2);tune(other,1);s.meta.agreed=true;
      return 'The two heads are working within the brief, though their football opinions still differ.';}
    tune(other,-4);s.meta.agreed=false;
    return staff(other).name+' disputes the new instructions. The relationship has deteriorated.';
  }
  if(kind==='youth'){
    const p=player(s.meta.pid);
    if(!p)return s.meta.name+' is no longer at the club. The academy cannot continue this plan.';
    if(inClub(p.id))return p.name+' is in the first-team squad. Selection and playing time remain the coach’s responsibility.';
    if(s.route==='fast'||s.route==='phase'){
      const coach=staff('coach'),acad=staff('acad');
      const threshold=F.tierAvg(G.club.tier)-(s.route==='fast'?1.3:0.45);
      const willing=coach&&acad&&coach.id===s.meta.coachId&&acad.id===s.meta.acadId &&
        F.rnd()<clamp(.15+F.man('coach','youthMins')/220+(coach.rel-50)/250,.12,.82);
      if(p.ca>=threshold&&willing&&G.squad.length<27&&F.acadPromote){
        F.acadPromote(p);s.meta.promoted=true;
        return p.name+' has joined the senior squad after the staff review. The coach will decide if he plays.';
      }
      return p.name+' is not yet in the senior squad ('+F.absStars(p.ca).toFixed(1)+'★ current level). The staff will keep assessing him.';
    }
    return p.name+' remains in the academy. Welfare '+Math.round(p.wel||0)+'/100; education '+Math.round(p.edu||0)+'/100.';
  }
  if(kind==='finance'){
    const fin=staff('fin'),com=staff('com');
    if(s.route==='cut'){
      if(!fin||fin.id!==s.meta.finId)return 'The Finance Director has left before implementing the cost plan.';
      const followed=F.rnd()<clamp(.38+F.eff('fin',1)/42+(fin.rel-50)/180,.25,.93);
      if(followed&&F.bizSetLevel){
        const a=F.bizSetLevel('marketing','lean'),b=F.bizSetLevel('commercial','lean');
        s.meta.cut=true;
        return 'Finance reduced marketing and commercial departmental budgets after its own cost review.';
      }
      tune('fin',-2);return 'Finance has not delivered the proposed cuts. The existing budgets remain in place.';
    }
    if(s.route==='sponsor'){
      if(!com||com.id!==s.meta.comId)return 'Commercial lost its department head before a deal was agreed.';
      const success=F.rnd()<clamp(.19+F.eff('com',0)/52+G.club.brand/400,.25,.78);
      if(success){
        const wk=Math.round(M(140+F.eff('com',0)*18)/100)*100;
        G.club.deals.push({name:'Local business partnership',type:'story-partner',wk,weeks:30});
        s.meta.sponsor=wk;
        return 'Commercial secured a 30-week local partnership worth '+money(wk)+'/week. The income now enters the existing finance engine.';
      }
      return 'Commercial made approaches, but nobody offered acceptable terms. No income was added.';
    }
    return 'Finance made no new budget commitments. Cash is now '+money(G.club.cash)+'.';
  }
  return '';
}
function shouldReopen(s) {
  if(s.kind==='conflict'){
    const coach=staff('coach'),dof=staff('dof');
    return !!(coach&&dof&&(!s.meta.agreed||Math.abs(+F.man('dof','youth')-+F.man('coach','youthMins'))>=22||
      Math.min(coach.rel,dof.rel)<45));
  }
  if(s.kind==='youth'){const p=player(s.meta.pid);return !!(p&&!inClub(p.id)&&(s.route!=='care'||(p.wel||60)<65));}
  if(s.kind==='finance')return F.G.club.cash<Math.max(M(12000),s.baseline.cash*.8);
  return false;
}
function follow(kind,c,i) {
  const s=at(kind,c),G=F.G;if(!s||s.phase!=='followup')return 'The issue has already moved on.';
  s.decision.push({week:NOW(),followup:i});s.phase='running';s.stage=3;s.due=Math.max(s.started+11,NOW()+3);
  let out='';
  if(kind==='conflict'){
    if(i===0){G.mand.coach.youthMins=clamp(Math.round((+F.man('coach','youthMins') + +F.man('dof','youth'))/2),0,100);
      tune('coach',-2);tune('dof',-2);out='A written compromise is issued. Both heads must work under the same youth direction.';}
    else if(i===1){tune('coach',2);tune('dof',2);out='You give them more time to resolve the matter without another order.';}
    else {tune('coach',-4);tune('dof',-4);out='You warn both heads that continued friction will affect their reviews.';}
  }else if(kind==='youth'){
    const p=player(s.meta.pid);
    if(!p)out=s.meta.name+' is no longer at the club.';
    else if(i===0){p.playUp=false;p.keep=true;out='The Academy Director protects the player’s education and workload.';}
    else if(i===1){p.mentor=true;G.mand.acad.pace=clamp(+F.man('acad','pace')+5,0,100);
      out='The staff continue a measured development plan. No senior place is promised.';}
    else {p.playUp=true;G.mand.coach.youthMins=clamp(+F.man('coach','youthMins')+6,0,100);
      out='The coach has been asked to consider the player more seriously, while retaining selection control.';}
  }else {
    if(i===0){G.mand.fin.risk=clamp(+F.man('fin','risk')-15,0,100);
      if(F.bizSetLevel)F.bizSetLevel('academy','lean');out='Finance tightened the risk mandate and reduced academy expenditure.';}
    else if(i===1){G.mand.fin.transfer=clamp(+F.man('fin','transfer')-15,0,100);
      out='Recruitment has less of the transfer pot available until finances improve.';}
    else {G.board.conf=clamp(G.board.conf-3,0,100);
      out='You hold spending steady. The board records its concern.';}
  }
  story(s,'Second instruction: '+out);return out;
}
function close(s) {
  const G=F.G;let verdict='';
  if(s.kind==='conflict'){
    const a=staff('coach'),b=staff('dof');
    verdict='Coach '+(a?Math.round(a.rel)+'/100 relationship':'departed')+
      '; DoF '+(b?Math.round(b.rel)+'/100 relationship':'departed')+
      '. Youth mandate gap '+Math.abs(+F.man('coach','youthMins')-+F.man('dof','youth'))+' points.';
  } else if(s.kind==='youth'){
    const p=player(s.meta.pid);
    verdict=p ? s.meta.name+': '+(inClub(p.id)?'senior squad, '+(p.st?.mins||0)+' first-team minutes':'still in academy')+
      '; welfare '+Math.round(p.wel||0)+'/100; development '+(p.ca-s.meta.ca>=0?'+':'')+
      (p.ca-s.meta.ca).toFixed(2)+' current ability.' :
      s.meta.name+' is no longer at the club.';
  } else {
    verdict='Cash '+money(G.club.cash)+' ('+(G.club.cash-s.baseline.cash>=0?'+':'')+
      money(G.club.cash-s.baseline.cash)+' since opening). Board confidence '+
      Math.round(G.board.conf)+'/100. '+(s.meta.cut?'Budgets were reduced. ':s.meta.sponsor?'New partner signed. ':'')+
      'Other club activity also affects this outcome.';
  }
  s.phase='closed';s.stage=4;s.ended=NOW();s.verdict=verdict;
  note(s,'Outcome after '+(NOW()-s.started)+' weeks: '+verdict);
  const B=S();B.history.unshift({id:s.id,kind:s.kind,started:s.started,ended:s.ended,
    route:s.route,verdict:s.verdict,log:s.log.slice(-7),decision:s.decision});
  B.history=B.history.slice(0,20);delete B.active[s.kind];
}
const prev=H.seasonAfterMatch;
H.seasonAfterMatch=ours=>{
  if(prev)prev(ours);
  const G=F.G;if(!G||G.phase!=='season')return;
  const B=S(),now=NOW();
  for(const s of Object.values(B.active)){
    if(s.phase!=='running'||s.due>now)continue;
    if(s.stage===1){
      note(s,autonomous(s));s.stage=2;s.due=Math.max(now+1,s.started+7);
    }else if(s.stage===2){
      if(shouldReopen(s)){
        s.phase='followup';s.due=null;
        F.queueEvent('story_'+s.kind+'_followup',{sid:s.id});
        note(s,'The question is still unresolved. A follow-up discussion has been requested.');
      }else{s.stage=3;s.due=Math.max(now+1,s.started+11);
        note(s,'The immediate disagreement has eased. The staff will continue without another CEO meeting.');}
    }else if(s.stage===3)close(s);
  }
  // Start only if the club's ACTUAL state qualifies. No event quotas or random drama.
  if(G.week>=5&&G.week<=20&&Object.keys(B.active).length<2&&now-B.lastStart>=5){
    const eligibleKinds=['conflict','youth','finance'].filter(k=>eligible(k)&&!B.active[k]&&
      (B.last[k]==null||now-B.last[k]>=55));
    if(eligibleKinds.length&&F.rnd()<.35)start(eligibleKinds[Math.floor(F.rnd()*eligibleKinds.length)],true);
  }
};
const openings={
conflict:{
  from:'coach',dept:'sporting',
  title:c=>{const s=at('conflict',c);return s?'The coach and DoF disagree about the squad':'A recruitment disagreement';},
  body:c=>{const s=at('conflict',c);return s?
    s.meta.coach+' wants a squad capable of winning now. '+s.meta.dof+
    ' sees a different path through recruitment. Their youth instructions differ by '+
    Math.abs(+F.man('coach','youthMins')-+F.man('dof','youth'))+
    ' points. Neither can choose the other’s players. You can clarify the club policy.':
    'The club is no longer discussing this issue.';},
  choices:[
    ['Back the DoF’s longer-term plan','More youth recruitment · coach may resist'],
    ['Ask for a joint plan','Staff negotiate · compromise not guaranteed'],
    ['Back the coach’s immediate needs','More experienced targets · DoF may resist']]
},
youth:{
  from:'acad',dept:'academy',
  title:c=>{const s=at('youth',c);return s?s.meta.name+' is reaching a crossroads':'A youth pathway';},
  body:c=>{const s=at('youth',c),p=s&&player(s.meta.pid);return s?
    s.meta.name+' ('+(p?p.age:'former')+') has potential beyond his current level. '+(p?'Current ability '+F.absStars(p.ca).toFixed(1)+'★, potential '+F.absStars(p.pa).toFixed(1)+'★. ':'')+
    'The Academy Director wants a development plan. The head coach retains every selection decision.':
    'The player is no longer part of this discussion.';},
  choices:[
    ['Ask for an accelerated pathway','Faster development · extra workload · coach considers him'],
    ['Give the academy time and a mentor','Gradual progress · no promised first-team place'],
    ['Protect education and welfare','Lower pressure · slower path']]
},
finance:{
  from:'fin',dept:'business',
  title:()=>'Finance calls an emergency meeting',
  body:()=>'The cash runway is under pressure. Finance needs a decision on what risks the club should accept. Commercial may find income, but no sponsor is guaranteed.',
  choices:[
    ['Authorize a cost-control plan','Finance proposes leaner department budgets'],
    ['Ask Commercial to find new income','Negotiation may fail · no income booked yet'],
    ['Keep investing for now','Costs continue · board exposed']]
}};
for(const [kind,d] of Object.entries(openings)){
  F.defineEvent('story_'+kind+'_opening',{forced:1,ceo:1,from:d.from,dept:d.dept,cd:1,w:()=>0,
    why:()=>TYPE[kind].t+' — an ongoing club situation, with consequences over several weeks.',
    setup:()=>null,title:d.title,body:d.body,
    opts:d.choices.map(([l,h],i)=>({l,h,f:c=>intro(kind,c,i)})),auto:()=>1});
  const followOpts=kind==='conflict'?
    [['Issue a written compromise','Both heads must work toward one brief'],['Let them work it out','No new directive'],['Warn both heads','Strained relationships · accountability']]:
    kind==='youth'?
    [['Protect the player’s workload','Welfare over speed'],['Continue the measured plan','Development with a mentor'],['Ask the coach to reconsider','Coach retains selection']]:
    [['Cut more spending','Lower risk · academy budget down'],['Restrict transfer funds','Lower transfer allocation'],['Maintain investment','Board confidence at risk']];
  F.defineEvent('story_'+kind+'_followup',{forced:1,ceo:1,from:d.from,dept:d.dept,cd:1,w:()=>0,
    why:()=>TYPE[kind].t+' — a follow-up to an earlier club decision.',
    setup:()=>null,
    title:c=>{const s=at(kind,c);return s?TYPE[kind].t+': the issue returns':'A closed story';},
    body:c=>{const s=at(kind,c);return s?
      'You previously chose '+s.route+'. '+(s.log.length?s.log[s.log.length-1].t:'The situation continues.')+
      ' What instructions do you give now?':'The issue has moved on.';},
    opts:followOpts.map(([l,h],i)=>({l,h,f:c=>follow(kind,c,i)})),auto:()=>1});
}
F.storyStart=start;
F.storyView=()=>{
  if(!F.G||!F.G.club)return {active:[],history:[]};
  const B=S(),now=NOW();
  return {active:Object.values(B.active).map(s=>({id:s.id,kind:s.kind,title:TYPE[s.kind].t,
    week:s.started,age:now-s.started,phase:s.phase,route:s.route,
    next:s.due==null?null:Math.max(0,s.due-now),
    latest:s.log.length?s.log[s.log.length-1].t:'',
    log:s.log.slice(-5)})),history:B.history.slice(0,5)};
};
})(FO);
