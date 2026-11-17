// Specialist actions must execute through one real engine, leave an evidence
// trail, preserve saves and not claim a result when an effect fails.
const assert=require('node:assert/strict'), vm=require('node:vm'), read=require('./src.js');
const names=['engine.js','events.js','events2.js','briefs.js','academy.js','academy2.js',
'recruit.js','summer.js','season.js','summer2.js','faces.js','firstteam.js','depts.js',
'levers.js','commercial.js','marketing.js','business.js','academy3.js','recruitx.js',
'matchtalk.js','desk.js','loop.js','dossiers.js','pathway.js','matchday.js',
'ceocore.js','specialist-cases.js'];
const context={console};vm.createContext(context);
vm.runInContext(names.map(read).join('\n')+'\n;this.FO=FO;',context);
const F=context.FO;
F.newGame(81073);
const dna={};for(const choice of F.DNA)dna[choice.k]=choice.o[0].v;
F.setDNA(dna,'Specialist Town','SPC','Testford',['#123456','#ffffff']);
for(const role of F.ROLES) assert(F.hire(role.id,0),'head appointed: '+role.id);
F.G.phase='season';
const originalCash=F.G.club.cash;
const region=Object.keys(F.REGIONS).find(k=>k!==F.man('scout','reg1'));
assert(region,'different scouting region exists');
const focus=F.specialistAct('recruit.focus',{k:region});
assert(!focus.err,'recruitment focus should succeed: '+focus.err);
assert.equal(F.man('scout','reg1'),region);
assert(F.caseView('s',focus.caseId),'recruitment evidence exists');
const approval = F.specialistAct('recruit.approval',{v:'0'});
assert(!approval.err,'DoF contract approval policy can be changed');
assert.equal(F.man('dof','approve'),'0');
const marketing=F.specialistAct('marketing.campaign',{k:'family'});
assert(!marketing.err,'marketing launch succeeds: '+marketing.err);
assert.equal(F.mkView().camp.k,'family');
const beforeDuplicate=F.save();
const again=F.specialistAct('marketing.campaign',{k:'family'});
assert(again.err,'cannot launch two concurrent campaigns');
assert.equal(F.save(),beforeDuplicate,'failed campaign must restore full game state');
F.comView(); F.G.com.offer={name:'Test Local Partner',sect:'Automotive',wk:130,weeks:15};
const sponsor=F.specialistAct('commercial.offer',{k:'accept'});
assert(!sponsor.err,'sponsor offer can be accepted');
assert(F.G.club.deals.some(d=>d.name==='Test Local Partner'));
const beforeExpired=F.save();
assert(F.specialistAct('commercial.offer',{k:'accept'}).err,'expired offer rejected');
assert.equal(F.save(),beforeExpired,'duplicate sponsor cannot mutate game');
const finance=F.specialistAct('business.level',{k:'academy',v:'lean'});
assert(!finance.err,'finance sets academy budget: '+finance.err);
const community=F.specialistAct('marketing.community',{v:1});
assert(!community.err,'marketing community strategy applies');
assert.equal(F.mkView().comm,1);
// Several price adjustments during the same week form ONE direction.
const priceOne=F.specialistAct('commercial.price',{k:'home',v:-0.1});
const priceTwo=F.specialistAct('commercial.price',{k:'home',v:-0.1});
assert(!priceOne.err&&!priceTwo.err);
assert.equal(priceOne.caseId,priceTwo.caseId,'price changes coalesce into one policy case');
assert.equal(F.specialistCases('commercial').find(c=>c.id===priceOne.caseId).revisions.length,1);
// The existing Academy briefing is not replaced by a fake general-purpose vote.
// Its original youth player state changes once, and the common history tracks it.
const youth=F.G.academy[0];
assert(youth,'real academy player available');
F.G.briefs=F.G.briefs||[];
const acadBrief=911551;
F.G.briefs.push({id:acadBrief,t:'ac_ready',ctx:{pid:youth.id,name:youth.name},done:false});
const academyBefore=F.specialistCases('academy').length;
const academyReply=F.answerBrief(acadBrief,1);
assert(!academyReply.err,'academy director recommendation can be answered');
assert.equal(F.G.academy.find(p=>p.id===youth.id).keep,true,
 'the specialist Academy engine makes the real development decision');
assert(F.specialistCases('academy').length>academyBefore,
 'Academy response participates in same outcome ledger');
assert(F.specialistCases('academy').some(c=>c.kind==='brief:ac_ready'));
const once=F.save();
assert.equal(F.answerBrief(acadBrief,1),null,'same youth response cannot be repeated');
assert.equal(F.save(),once);
// A specialist hire and dismissal use the original hiring market, salary and
// compensation, but share the same accountable case and history.
const openRole=F.deptView('commercial').open[0].role;
const candidate=F.deptCands('commercial',openRole)[0];
const staffingBefore=F.G.club.cash;
const appointed=F.specialistAct('department.hire',{k:'commercial',r:openRole,i:0});
assert(!appointed.err,'department specialist appointment should complete');
assert(F.deptView('commercial').staff.some(x=>x.id===candidate.id));
assert(F.G.club.cash<staffingBefore,'signing-on fee charged once');
const departure=F.specialistAct('department.dismiss',{k:'commercial',id:candidate.id});
assert(!departure.err,'employee dismissal applies real notice costs');
assert(!F.deptView('commercial').staff.some(x=>x.id===candidate.id));
assert(F.specialistCases('commercial').some(c=>c.kind==='department.hire'));
assert(F.specialistCases('commercial').some(c=>c.kind==='department.dismiss'));
const initialPathway=F.save();
const noPath=F.specialistAct('academy.pathway',{k:'youth'});
assert(noPath.err,'no invented pathway without an existing player agreement');
assert.equal(F.save(),initialPathway);
const talk=F.ftTalkStart();assert(!talk.err);
const coach=F.specialistAct('firstteam.response',{id:'back'});
assert(!coach.err,'coach conversation route commits');
assert(F.specialistCases('first').some(c=>c.kind==='firstteam.response'));
const kinds=['recruit.focus','recruit.approval','marketing.campaign','commercial.offer',
'business.level','marketing.community','firstteam.response'];
for(const kind of kinds)assert(F.specialistCases().some(c=>c.kind===kind),kind+' in history');
const saved=F.save();
assert(F.load(saved),'legacy-compatible save roundtrip');
assert(F.specialistCases().some(c=>c.id===focus.caseId));
F.G.week+=4;F.specialistWeekly();
const review=F.specialistCases('recruit').find(c=>c.id===focus.caseId);
assert.equal(review.status,'review','review after four game weeks');
assert(review.review?.evidence,'review has current source evidence');
assert(F.specialistAcknowledge(focus.caseId).out,'CEO can acknowledge a real review');
assert.equal(F.caseView('s',focus.caseId).status,'closed');
assert(F.specialistAcknowledge(focus.caseId).err,'review cannot be acknowledged twice');
// Real commercial/marketing disagreement: the existing commercial engine may
// not bypass a values conflict from its direct route or a legacy briefing.
F.G.club.dna.identity='community';
F.G.com.offer={name:'Controversial Betting Co',sect:'Betting',wk:200,weeks:12};
const conflicts=F.specialistConflicts('commercial');
assert.equal(conflicts.length,1,'community-club betting sponsor raises interdepartmental issue');
const blockedState=F.save();
const blocked=F.specialistAct('commercial.offer',{k:'accept'});
assert(blocked.err,'direct sponsor accept must be blocked pending CEO settlement');
assert.equal(F.save(),blockedState,'rejected direct route cannot silently mutate the offer');
// The older briefing handler must not sidestep the same authority boundary.
const sponsorBriefId=911552;
F.G.briefs.push({id:sponsorBriefId,t:'com_offer',
  ctx:{score:3,name:F.G.com.offer.name},done:false});
const beforeBriefBypass=F.save();
const bypass=F.answerBrief(sponsorBriefId,0);
assert(bypass&&bypass.err,'briefing cannot approve a restricted sponsor');
assert.equal(F.save(),beforeBriefBypass,'failed briefing leaves the full game unchanged');
assert.equal(F.G.briefs.find(b=>b.id===sponsorBriefId).done,false);
const marketingRel=F.staff('mkt').rel,comRel=F.staff('com').rel;
const settled=F.specialistResolveConflict('sponsor','reject');
assert(!settled.err,'conflict can be resolved through authoritative commercial engine');
assert(!F.G.com.offer,'rejected offer removed by commercial engine');
assert.equal(F.staff('mkt').rel,marketingRel+3);
assert.equal(F.staff('com').rel,comRel-2);
assert(F.G.specialistConflictLog.some(c=>c.choice==='reject'));
assert.equal(F.specialistConflicts('commercial').length,0,'conflict closed after sponsor rejected');
const beforeRepeat=F.save();
assert(F.specialistResolveConflict('sponsor','reject').err,'cannot resolve stale offer again');
assert.equal(F.save(),beforeRepeat);
// Finance and Recruitment have different priorities: a real budget objection
// cannot be bypassed through the old scouting investment button.
const originalBizView=F.bizView;
F.bizView=()=>({...originalBizView(),ok:false});
const financeRole=F.staff('fin'),scoutRole=F.staff('scout');
const financeBefore=financeRole.rel,scoutBefore=scoutRole.rel;
const riskStart=F.G.club.cash;
const veto=F.specialistAct('recruit.invest',{k:region});
assert(veto.err,'budget concern raises a cross-department conflict');
assert(F.specialistConflicts('recruit').some(c=>c.id==='finance'));
const noSpend=F.specialistResolveConflict('finance','defer');
assert(!noSpend.err);
assert.equal(F.G.club.cash,riskStart,'deferral creates no scouting costs');
assert(!F.G.specialistFinanceRequest);
const retry=F.specialistAct('recruit.invest',{k:region});
assert(retry.err);
const authorized=F.specialistResolveConflict('finance','authorize');
assert(!authorized.err,'CEO can explicitly authorize investment within the actual cash constraints: '+authorized.err);
assert(F.G.club.cash<riskStart,'existing recruitment engine charges the scouting trip');
assert.equal(F.staff('fin').rel,financeBefore-3);
assert.equal(F.staff('scout').rel,scoutBefore+2);
assert(F.G.specialistConflictLog.some(c=>c.kind==='finance'&&c.choice==='authorize'));
assert(!F.G.specialistFinanceRequest);
F.bizView=originalBizView;
const final=F.save();F.specialistWeekly();assert.equal(F.save(),final,'same-week follow-up idempotent');
assert.equal(F.G.club.deals.filter(d=>d.name==='Test Local Partner').length,1);
assert(F.G.club.cash<originalCash,'actual costs from campaign have taken effect');
console.log('PASS: recruitment, marketing, commercial, business, First Team and academy rejection, transactional rollback, save/load and four-week follow-up');
