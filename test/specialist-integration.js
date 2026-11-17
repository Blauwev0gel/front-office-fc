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
const final=F.save();F.specialistWeekly();assert.equal(F.save(),final,'same-week follow-up idempotent');
assert.equal(F.G.club.deals.filter(d=>d.name==='Test Local Partner').length,1);
assert(F.G.club.cash<originalCash,'actual costs from campaign have taken effect');
console.log('PASS: recruitment, marketing, commercial, business, First Team and academy rejection, transactional rollback, save/load and four-week follow-up');
