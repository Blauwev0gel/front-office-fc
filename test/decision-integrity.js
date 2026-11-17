// Decision integrity regression: a failed choice must never be marked handled.
// Node 22: node test/decision-integrity.js
const assert = require('node:assert/strict');
const vm = require('node:vm');
const read = require('./src.js');
const modules = ['engine.js','events.js','events2.js','briefs.js','academy.js',
  'academy2.js','recruit.js','summer.js','season.js','summer2.js','faces.js',
  'firstteam.js','depts.js','levers.js','commercial.js','marketing.js',
  'business.js','academy3.js','recruitx.js','matchtalk.js','desk.js',
  'loop.js','dossiers.js','pathway.js','matchday.js','ceocore.js'];
const script = modules.map(read).join('\n');
new vm.Script(script);
const context = { console };
vm.createContext(context);
vm.runInContext(script+'\n;this.FO=FO;', context);
const F = context.FO;
F.newGame(7931);
const dna = {};
for (const choice of F.DNA) dna[choice.k] = choice.o[0].v;
F.setDNA(dna,'Audit United','AUD','Auditford',['#123456','#ffffff']);
F.G.briefs = F.G.briefs || [];
assert(F.G.club && F.G.inbox && F.G.briefs);
const eventId = '__integrity_event__';
const briefType = '__integrity_brief__';
const msgId = 9000001, briefId = 9000002;
const cash0 = F.G.club.cash;
const working = () => { F.G.club.cash += 17; return 'Deal completed'; };
const throwing = () => { F.G.club.cash += 17; throw Error('deliberate failed effect'); };
F.EV[eventId] = {
  id: eventId, from: 'board', cd: 8,
  opts: [{ l:'Proceed', f: throwing }]
};
F.G.inbox.push({ id: msgId, ev:eventId, ctx:{}, done:false, season:F.G.season, week:F.G.week });
const docket = F.caseView('m', msgId);
assert.equal(docket.type,'governance');
assert.equal(docket.status,'open');
assert.equal(docket.source,'event');
assert.equal(docket.options.length,1);
const before = F.save();
const bad = F.respond(msgId,0);
assert(bad && bad.err, 'failing event must report an error');
assert.equal(F.save(),before,'failed event must restore entire JSON game state');
assert.equal(F.G.inbox.find(m=>m.id===msgId).done,false);
F.EV[eventId].opts[0].f = working;
const good = F.respond(msgId,0);
assert.equal(good.out,'Deal completed');
assert.equal(F.G.inbox.find(m=>m.id===msgId).done,true);
assert.equal(F.caseView('m',msgId).status,'resolved');
assert.equal(F.caseView('m',msgId).outcome,'Deal completed');
assert.equal(F.G.club.cash,cash0+17);
assert.equal(F.respond(msgId,0),null,'double-tap must not commit twice');
assert.equal(F.G.club.cash,cash0+17);
F.BR[briefType] = { opts: [{ l:'Approve', f: throwing }] };
F.G.briefs.push({ id:briefId, t:briefType, ctx:{}, done:false });
const briefingDocket = F.caseView('b',briefId);
assert.equal(briefingDocket.type,'consultation');
assert.equal(briefingDocket.status,'open');
assert.equal(briefingDocket.recommended,-1);
const beforeBrief = F.save();
const badBrief = F.answerBrief(briefId,0);
assert(badBrief && badBrief.err);
assert.equal(F.save(),beforeBrief,'briefing rollback must restore partial mutations');
assert.equal(F.G.briefs.find(b=>b.id===briefId).done,false);
F.BR[briefType].opts[0].f = working;
const goodBrief = F.answerBrief(briefId,0);
assert.equal(goodBrief.out,'Deal completed');
assert.equal(F.G.briefs.find(b=>b.id===briefId).done,true);
assert.equal(F.caseView('b',briefId).status,'resolved');
assert.equal(F.G.club.cash,cash0+34);
assert.equal(F.answerBrief(briefId,0),null,'briefing cannot be committed twice');
assert.equal(F.G.club.cash,cash0+34);
assert(F.respond(msgId,17)===null,'resolved event cannot be reopened');
const proposalId = '__integrity_project__';
F.PROP[proposalId] = { onStart: () => { F.G.club.cash -= 99; throw Error('project startup failure'); } };
F.G.meeting = { items: [{ id:proposalId, status:'open', owner:'dof', cost:100,
  dur:3, wk:12, p:0.5, pc:0.5, ctx:{} }] };
const proposalDocket = F.caseView('p',0);
assert.equal(proposalDocket.type,'project-proposal');
assert.equal(proposalDocket.status,'open');
assert(proposalDocket.options.some(o=>o.id==='approve'));
const beforeProposal = F.save();
const failedProposal = F.decideProposal(0,'approve');
assert(failedProposal && failedProposal.err,'a failed project must report failure');
assert.equal(F.save(), beforeProposal,'failed approval must roll back cost and project');
assert.equal(F.G.meeting.items[0].status,'open');
F.PROP[proposalId].onStart = () => { F.G.club.cash += 2; };
const proposalCash = F.G.club.cash;
const completedProposal = F.decideProposal(0,'approve');
assert(completedProposal && completedProposal.out);
assert.equal(F.G.meeting.items[0].status,'approved');
assert.equal(F.caseView('p',0).status,'approved');
assert.equal(F.G.club.cash,proposalCash-98);
assert.equal(F.G.projects.filter(p=>p.id===proposalId).length,1);
assert(F.decideProposal(0,'approve').err,'completed proposal cannot be approved twice');
const limitedProposal = '__over_budget__';
F.PROP[limitedProposal] = {};
F.G.meeting.items.push({ id:limitedProposal, status:'open', owner:'dof',
  cost:F.meetingPot()+1, dur:3, wk:12, p:0.5, pc:0.5, ctx:{} });
const beforeOverBudget = F.save();
assert(F.decideProposal(1,'approve').err,'Finance must block overspend at engine level');
assert.equal(F.save(),beforeOverBudget,'rejected over-budget proposal has no side effects');
assert(!F.caseView('p',1).options.some(o=>o.id==='approve'),'case view hides unavailable approval');
const beforeInvalidTalk = F.save();
assert(F.talk('dof','not-a-real-tone').err);
assert.equal(F.save(),beforeInvalidTalk,'invalid conversation option cannot consume cooldown or change state');

// Full leadership agreement lifecycle: staff appointed, mandate committed,
// autonomous weeks pass, performance evidence appears, CEO reviews and renews.
F.G.phase = 'season';
for (const role of F.ROLES) {
  const hired = F.hire(role.id,0);
  assert(hired, 'all seven heads including Chief Scout can be hired');
  const active = F.agreementView(role.id).active;
  assert(active && active.state === 'running', role.id + ' must receive an agreement');
  assert(active.head === hired.name);
}
const firstTalk = F.talk('fin','praise');
assert(firstTalk && firstTalk.out,'staff conversation should resolve');
const transcript = F.conversationView('fin')[0];
assert(transcript && transcript.head === F.staff('fin').name);
assert.equal(transcript.agreementId,F.agreementView('fin').active.id,
  'conversation must be causally linked to a real active commitment');
assert.equal(F.caseView('c',transcript.id).type,'conversation');
assert.equal(F.caseView('c',transcript.id).status,'resolved');
assert.equal(F.caseView('a',transcript.agreementId).status,'running');
assert.equal(F.caseView('a',transcript.agreementId).options.length,0);
const original = F.agreementView('fin').active;
assert.equal(original.due - original.start,6);
assert.equal(F.agreementView().history.length,7);
const financeMandate = Object.assign({},F.G.mand.fin,{ risk: Math.min(100,F.G.mand.fin.risk+10) });
const changed = F.setMandate('fin',financeMandate);
assert(changed && changed.out);
assert.equal(F.G.agreements.find(a=>a.id===original.id).state,'superseded',
  'replacing finance policy closes old agreement without destroying history');
const active = F.agreementView('fin').active;
assert(active && active.id !== original.id && active.state==='running');
F.G.week += 6;
F.agreementWeekly();
const due = F.agreementView('fin').active;
assert(due && due.state==='review' && due.check,'six game weeks create genuine evidence review');
assert.equal(F.caseView('a',due.id).status,'review');
assert(F.caseView('a',due.id).options.some(o=>o.id==='continue'));
assert(due.check.lines.length>0,'review has actual departmental evidence');
assert(F.G.paper.stories.some(e=>e.h==='Leadership review due'));
const recorded = F.save();
assert(F.load(recorded),'agreements survive regular saves');
assert.equal(F.agreementView('fin').active.id,due.id);
const next = F.agreementRespond(due.id,'continue');
assert(next && next.next);
assert.equal(F.agreementView('fin').active.state,'running');
assert.equal(F.agreementView('fin').active.start,F.absWeek());
assert(F.agreementRespond(due.id,'continue').err,'evidence review cannot renew twice');
const afterReview = F.save();
F.agreementWeekly();
assert.equal(F.save(),afterReview,'same-week evaluation is idempotent');

console.log('PASS: failed decisions rollback; successful choices commit once; events, briefings, proposals, conversations and leadership review remain compatible');
