/* The Front Office — integrated specialist execution and follow-through.
   Specialist engines remain authoritative. This is a single transactional
   command entry point and evidence ledger, not a second economy/game engine. */
(function(F) {
'use strict';
const AREA = {
  'recruit.focus':'recruit', 'recruit.invest':'recruit', 'recruit.approval':'recruit',
  'academy.pathway':'academy', 'academy.issue':'academy',
  'commercial.offer':'commercial', 'commercial.price':'commercial',
  'commercial.experience':'commercial', 'commercial.promo':'commercial',
  'marketing.campaign':'marketing', 'marketing.community':'marketing',
  'business.level':'business', 'business.plan':'business',
  'firstteam.response':'first', 'firstteam.support':'first',
  'department.plan':'department', 'department.issue':'department'
};
const HEAD = { recruit:'dof', academy:'acad', commercial:'com',
  marketing:'mkt', business:'fin', first:'coach' };
const LABEL = {
  'recruit.focus':'Scouting focus', 'recruit.invest':'Recruitment network investment',
  'recruit.approval':'Transfer approval mandate', 'academy.pathway':'Youth pathway direction',
  'commercial.offer':'Sponsorship negotiation','commercial.price':'Ticket pricing',
  'commercial.experience':'Matchday facilities','commercial.promo':'Supporter promotion',
  'marketing.campaign':'Marketing campaign','marketing.community':'Community programme',
  'business.level':'Department budget','business.plan':'Finance budget proposal',
  'firstteam.response':'Head coach conversation','firstteam.support':'First-team support',
  'department.plan':'Department response plan','department.issue':'Department risk review'
};
const copy = x => JSON.parse(JSON.stringify(x));
const now = () => F.absWeek();
const store = () => {
  if (!Array.isArray(F.G.specialistCases)) F.G.specialistCases = [];
  return F.G.specialistCases;
};
function area(kind, p) {
  if (kind.startsWith('department.')) return p.k;
  return AREA[kind];
}
function owner(kind, p) {
  const d = area(kind,p);
  const role = ['recruit.invest','recruit.focus'].includes(kind) ? 'scout' : HEAD[d] || F.DEPT?.[d]?.head;
  return { role, name:F.staff(role)?.name || 'Vacant' };
}
function evidence(d) {
  const g=F.G;
  const base = {
    cash:g.club?.cash, fans:g.st?.fans, board:g.board?.conf,
    season:g.season, week:g.week
  };
  // Capture actual state; never invent projected returns or success rates.
  try {
    if(d==='commercial' && F.comView) {
      const v=F.comView();
      return {...base, offers:v.offer?.name || null,
        signed:g.club.deals?.length || 0, exp:v.exp,
        ticketPrices:copy(v.X?.pf || {}), revenue:F.sponsorIncome?.()};
    }
    if(d==='marketing' && F.mkView) {
      const v=F.mkView();
      return {...base, campaign:v.camp?.k || null, reach:v.reach,
        loyalty:v.loyalty, community:v.comm, brand:g.club.brand};
    }
    if(d==='business' && F.bizView) {
      const v=F.bizView();
      return {...base, weeklySpend:v.spend, affordable:v.ok,
        risk:F.man?.('fin','risk'), debt:v.debt};
    }
    if(d==='recruit') {
      return {...base, transferBudget:F.transferBudget?.(),
        squad:g.squad?.length, deals:g.signLog?.length||0,
        policy:copy(g.mand?.dof||{}), plan:copy(g.rec?.squadPlan?.notice||null)};
    }
    if(d==='academy') {
      return {...base, academy:g.academy?.length, graduates:g.squad?.filter(p=>p.academy).length,
        pathway:F.pwView?.()?.ag?.route || null};
    }
    if(d==='first') {
      return {...base, form:g.form?.slice(-5)||[], points:F.myPos?.(),
        coach:F.staff('coach')?.name||null, support:copy(g.ft?.res||{})};
    }
  } catch(e) { /* Use basic real figures when a specialist view is not ready. */ }
  return base;
}
function execute(kind,p) {
  switch(kind) {
    case 'commercial.offer': return F.comOffer(p.k);
    case 'commercial.price': return F.comSetPrice(p.k,+p.v);
    case 'commercial.experience': return p.v==='up'?F.comExpUp():F.comExpDown();
    case 'commercial.promo': return F.comPromo();
    case 'marketing.campaign': return F.mkCamp(p.k);
    case 'marketing.community': return F.mkComm(+p.v);
    case 'business.level': return F.bizSetLevel(p.k,p.v);
    case 'business.plan': F.bizPropose();return F.bizApply();
    case 'recruit.focus': return F.rxFocus(p.k);
    case 'recruit.invest': return F.rxInvest(p.k);
    case 'recruit.approval': {
      const m=F.G.mand?.dof;
      if(!m)return {err:'No Director of Football mandate exists.'};
      const updated={...m,approve:p.v};
      return F.setMandate('dof',updated);
    }
    case 'academy.pathway': return F.pwChange(p.k);
    case 'firstteam.response': return F.ftTalkAnswer(p.id);
    case 'firstteam.support': return p.v==='buy'?F.ftResBuy(p.k):F.ftResCancel(p.k);
    case 'department.plan': return F.deptIssuePlan(p.k,p.v,p.c);
    case 'department.issue': return F.deptIssueDecision(p.k,p.v,p.c);
    default: return {err:'Unknown specialist decision.'};
  }
}
/* Real cross-department disagreement: commercial revenue vs club identity.
   The sponsor remains the original commercial engine's offer; no duplicate
   bargaining simulation or invented offer outcome is created here. */
const SPEND_ACTIONS=new Set(['recruit.invest','marketing.campaign','commercial.experience']);
function financeObjection(kind,p) {
  if(!SPEND_ACTIONS.has(kind)||F.G.phase!=='season'||!F.bizView)return false;
  const dept=area(kind,p);
  return !!(F.staff('fin')&&F.staff(HEAD[dept])&&F.bizView().ok===false);
}
function financeAllowed(kind,p) {
  const override=F.G.specialistFinancePermission;
  return override?.kind===kind && JSON.stringify(override.params)===JSON.stringify(p);
}
function sponsorConflict(offer) {
  const g=F.G,dna=g.club?.dna||{};
  const identity=dna.identity==='community'||dna.origin==='fans'||
    dna.style==='community';
  return offer?.sect==='Betting' && identity && F.staff('mkt')&&F.staff('com');
}
function specialistSponsorRequiresReview(offer) {
  if(!sponsorConflict(offer))return false;
  const allowed=F.G.specialistSponsorPermission;
  return !allowed || allowed.name!==offer.name || allowed.wk!==offer.wk;
}
function specialistConflicts(d) {
  const out=[];
  if(!d||d==='commercial'||d==='marketing') {
    const offer=F.comView?.()?.offer;
    if(specialistSponsorRequiresReview(offer))out.push({
      id:'sponsor',department:'commercial',
      title:'Sponsorship versus club identity',
      first:F.staff('com').name,second:F.staff('mkt').name,
      explanation:'Commercial recommends considering the sponsor revenue. Marketing warns that a betting partner conflicts with the club\'s community identity.',
      evidence:'Offer: '+offer.name+' · '+F.money(offer.wk)+'/week for '+offer.weeks+' weeks.',
      options:[{k:'approve',label:'Authorize this exception'},
        {k:'counter',label:'Ask Commercial to negotiate harder'},
        {k:'reject',label:'Protect the identity; decline'}]
    });
  }
  const pending=F.G.specialistFinanceRequest;
  if(pending && (!d||d===area(pending.kind,pending.params)||d==='business') &&
      financeObjection(pending.kind,pending.params)) {
    const rd=area(pending.kind,pending.params),head=F.staff(owner(pending.kind,pending.params).role);
    out.push({id:'finance',department:rd,title:'Finance challenges the spending plan',
      first:head?.name||'Department head',second:F.staff('fin')?.name||'Finance Director',
      explanation:'The responsible head wants to proceed, but Finance reports that departmental spending exceeds the sustainable budget envelope.',
      evidence:LABEL[pending.kind]+' · requested in game week '+pending.week,
      options:[{k:'authorize',label:'Authorize this exception, accept the financial risk'},
        {k:'defer',label:'Defer the expense and protect the cash plan'}]});
  }
  return out;
}
function specialistResolveConflict(id,stance) {
  if(id==='finance') {
    if(!['authorize','defer'].includes(stance))
      return {err:'Unknown finance response.'};
    const g=F.G,pending=g.specialistFinanceRequest;
    if(!pending||!financeObjection(pending.kind,pending.params))
      return {err:'The finance concern is no longer current.'};
    const before=F.save(),d=area(pending.kind,pending.params),head=F.staff(owner(pending.kind,pending.params).role);
    const finance=F.staff('fin');
    if(stance==='defer') {
      g.specialistFinanceRequest=null;
      if(!g.specialistConflictLog)g.specialistConflictLog=[];
      g.specialistConflictLog.push({kind:'finance',choice:'defer',dept:d,season:g.season,
        week:g.week,action:pending.kind,outcome:'Expense deferred by the CEO.'});
      return {out:'You have deferred the expense. No money was spent.'};
    }
    try {
      g.specialistFinancePermission={kind:pending.kind,params:pending.params};
      const result=specialistAct(pending.kind,pending.params);
      if(result.err){F.load(before);return result;}
      if(finance)finance.rel=F.clamp(finance.rel-3,0,100);
      if(head)head.rel=F.clamp(head.rel+2,0,100);
      delete g.specialistFinancePermission;
      g.specialistFinanceRequest=null;
      if(!g.specialistConflictLog)g.specialistConflictLog=[];
      g.specialistConflictLog.push({kind:'finance',choice:'authorize',dept:d,
        season:g.season,week:g.week,action:pending.kind,caseId:result.caseId,
        outcome:result.out});
      return result;
    } catch(err){F.load(before);return {err:'The finance decision failed; the game was restored.'};}
  }
  if(id!=='sponsor'||!['approve','counter','reject'].includes(stance))
    return {err:'Unknown cross-department decision.'};
  const offer=F.comView?.()?.offer;
  if(!sponsorConflict(offer))return {err:'The sponsor conflict is no longer active.'};
  const before=F.save();
  try {
    // Scoped permission only, no lasting bypass of the sponsor policy.
    F.G.specialistSponsorPermission={name:offer.name,wk:offer.wk};
    const kind=stance==='approve'?'accept':stance==='counter'?'push':'reject';
    const result=specialistAct('commercial.offer',{k:kind});
    if(!result||result.err) {
      F.load(before);
      return result||{err:'The sponsor decision could not be completed.'};
    }
    const g=F.G,com=F.staff('com'),mkt=F.staff('mkt');
    // Distinct employee reactions to the CEO's real choice; sponsor financial
    // and fan consequences remain owned by the commercial engine.
    if(com)com.rel=F.clamp(com.rel+(stance==='reject'?-2:2),0,100);
    if(mkt)mkt.rel=F.clamp(mkt.rel+(stance==='reject'?3:-3),0,100);
    delete g.specialistSponsorPermission;
    if(!g.specialistConflictLog)g.specialistConflictLog=[];
    g.specialistConflictLog.push({kind:'sponsor',season:g.season,week:g.week,
      sponsor:offer.name,choice:stance,commercial:com?.name,
      marketing:mkt?.name,outcome:result.out,caseId:result.caseId});
    return result;
  } catch(err) {
    F.load(before);
    return {err:'The decision failed and was rolled back.'};
  }
}
function specialistAct(kind,p={}) {
  if(!AREA[kind])return {err:'Unknown specialist decision.'};
  if(financeObjection(kind,p) && !financeAllowed(kind,p)) {
    F.G.specialistFinanceRequest={kind,params:copy(p),week:F.G.week,season:F.G.season};
    return {err:'Finance objects to the new expense. Review the departmental disagreement before proceeding.'};
  }
  const d=area(kind,p), o=owner(kind,p);
  const before=F.save(), start=evidence(d);
  let result;
  try {
    result=execute(kind,p);
    if(result && result.err) { F.load(before); return result; }
    if(F.save()===before) return {err:'Nothing changed; the request may already be resolved.'};
    const g=F.G, items=store();
    const conflict = d!=='business' && F.bizView && F.bizView().ok===false
      ? 'Finance reports that planned spending exceeds its current envelope.'
      : null;
    const rec={
      id:'sp-'+(g.nid++), kind, dept:d, role:o.role, head:o.name,
      title:LABEL[kind], action:copy(p), season:g.season, week:g.week,
      start:now(), due:now()+4, status:'executing', origin:'CEO',
      before:start, after:evidence(d), result:result?.out || 'Direction recorded.',
      financeConcern:conflict, review:null
    };
    items.push(rec);
    if(items.length>120)items.splice(0,items.length-120);
    return {out:rec.result,caseId:rec.id};
  } catch(err) {
    F.load(before);
    return {err:'This decision failed. The game was restored; nothing was committed.'};
  }
}
function evidenceComparison(before,after,dept) {
  const keys={
    recruit:[['squad','Squad size'],['transferBudget','Transfer budget'],['deals','Completed signings']],
    academy:[['academy','Academy players'],['graduates','Academy graduates']],
    commercial:[['signed','Sponsor contracts'],['revenue','Sponsor income']],
    marketing:[['reach','Marketing reach'],['loyalty','Supporter loyalty'],
      ['brand','Club brand']],
    business:[['weeklySpend','Department spending'],['debt','Outstanding debt']],
    first:[['points','League position']]
  };
  const notes=[];
  for(const [k,label] of (keys[dept]||[])) {
    if(before[k]==null||after[k]==null||before[k]===after[k])continue;
    notes.push(label+': '+before[k]+' → '+after[k]);
  }
  if(before.cash!=null&&after.cash!=null&&before.cash!==after.cash)
    notes.push('Cash: '+F.money(before.cash)+' → '+F.money(after.cash));
  return notes.slice(0,5);
}
function specialistWeekly() {
  const g=F.G;
  if(!Array.isArray(g.specialistCases))return;
  for(const c of g.specialistCases) {
    if(c.status!=='executing')continue;
    if(c.head!=='Vacant' && c.role && F.staff(c.role)?.name!==c.head) {
      c.status='interrupted';
      c.review={at:now(), evidence:evidence(c.dept),
        text:'The responsible employee has left. The prior decision remains in the record.'};
      continue;
    }
    if(now()<c.due)continue;
    const latest=evidence(c.dept);
    c.status='review';
    const observations=evidenceComparison(c.after||c.before,latest,c.dept);
    c.review={at:now(), evidence:latest, observations,
      text:observations.length?'Observed after four weeks: '+observations.join('; ')+
        '. These changes may also reflect matches and other club activity.':
        'Four weeks have passed. The recorded indicators have not changed materially.'};
    g.paper?.stories?.push({h:'Department decision review',
      t:c.title+' — '+(F.staff(c.role)?.name||'the club')+
        ' reports that the follow-up evidence is available in People.'});
  }
}
function specialistCases(d) {
  return store().filter(c=>!d||c.dept===d).slice(-20).reverse();
}
function specialistCaseView(id) {
  const c=store().find(x=>x.id===id);
  if(!c)return null;
  return {id:'specialist:'+c.id,source:'specialist',sourceId:c.id,
    type:'department-decision',role:c.role,owner:c.head,title:c.title,
    context:c.result,status:c.status,options:[],recommended:-1,
    noResponse:'The responsible head continues working under the current mandate.',
    outcome:c.review?.text||c.result,before:c.before,after:c.after,
    review:c.review,conflict:c.financeConcern};
}
/* Legacy event and briefing replies still own their specialist effects.
   Record their outcomes in the SAME case history without invoking the
   underlying action twice. This covers Academy trial and promotion choices,
   Finance reviews, recruitment exceptions, sponsorship and campaign briefs. */
const ROLE_DEPT={dof:'recruit',scout:'recruit',acad:'academy',coach:'first',
  com:'commercial',mkt:'marketing',fin:'business'};
function recordLegacy(source,key,role,choice,before,result) {
  const d=ROLE_DEPT[role];
  if(!d||!result||result.err)return;
  const items=store(),o=owner(d==='recruit'?'recruit.focus':d==='academy'?'academy.pathway':
    d==='first'?'firstteam.response':d+'.plan',{});
  const g=F.G;
  items.push({id:'sp-'+(g.nid++),kind:source+':'+key,dept:d,
    role,head:F.staff(role)?.name||o.name,title:key.replaceAll('_',' '),
    action:{choice},season:g.season,week:g.week,start:now(),due:now()+4,
    status:'executing',origin:'CEO',before,after:evidence(d),
    result:typeof result.out==='string'?result.out:'Response recorded',
    financeConcern:d!=='business'&&F.bizView&&!F.bizView().ok?
      'Finance is concerned that department costs exceed the available budget.':null,
    review:null});
  if(items.length>120)items.splice(0,items.length-120);
}
const oldBrief=F.answerBrief;
F.answerBrief=function(id,i) {
  const msg=(F.G.briefs||[]).find(b=>b.id===id);
  const def=msg&&F.BR[msg.t],role=def?.role;
  const d=ROLE_DEPT[role],before=d?evidence(d):null;
  const had=F.G.specialistCases?.length||0;
  const out=oldBrief(id,i);
  // Existing read-only reports should not become new CEO commands.
  if(msg&&out&&!out.err&&F.G.briefs?.find(b=>b.id===id)?.done &&
      (F.G.specialistCases?.length||0)===had)
    recordLegacy('brief',msg.t,role,i,before,out);
  return out;
};
const oldRespond=F.respond;
F.respond=function(id,i) {
  const msg=(F.G.inbox||[]).find(m=>m.id===id);
  const def=msg&&F.EV[msg.ev],role=def?.from;
  const d=ROLE_DEPT[role],before=d?evidence(d):null;
  const had=F.G.specialistCases?.length||0;
  const out=oldRespond(id,i);
  if(msg&&out&&!out.err&&F.G.inbox?.find(m=>m.id===id)?.done &&
      (F.G.specialistCases?.length||0)===had)
    recordLegacy('event',msg.ev,role,i,before,out);
  return out;
};
const oldCase=F.caseView;
F.caseView=function(kind,id) {
  return kind==='s'?specialistCaseView(id):oldCase?.(kind,id);
};
const oldEnd=F.endWeek;
F.endWeek=function() {
  const result=oldEnd();
  if(result)specialistWeekly();
  return result;
};
Object.assign(F,{specialistAct,specialistCases,specialistWeekly, specialistSponsorRequiresReview, specialistConflicts, specialistResolveConflict});
})(FO);
