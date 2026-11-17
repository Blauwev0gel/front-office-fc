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
const before = F.save();
const bad = F.respond(msgId,0);
assert(bad && bad.err, 'failing event must report an error');
assert.equal(F.save(),before,'failed event must restore entire JSON game state');
assert.equal(F.G.inbox.find(m=>m.id===msgId).done,false);
F.EV[eventId].opts[0].f = working;
const good = F.respond(msgId,0);
assert.equal(good.out,'Deal completed');
assert.equal(F.G.inbox.find(m=>m.id===msgId).done,true);
assert.equal(F.G.club.cash,cash0+17);
assert.equal(F.respond(msgId,0),null,'double-tap must not commit twice');
assert.equal(F.G.club.cash,cash0+17);
F.BR[briefType] = { opts: [{ l:'Approve', f: throwing }] };
F.G.briefs.push({ id:briefId, t:briefType, ctx:{}, done:false });
const beforeBrief = F.save();
const badBrief = F.answerBrief(briefId,0);
assert(badBrief && badBrief.err);
assert.equal(F.save(),beforeBrief,'briefing rollback must restore partial mutations');
assert.equal(F.G.briefs.find(b=>b.id===briefId).done,false);
F.BR[briefType].opts[0].f = working;
const goodBrief = F.answerBrief(briefId,0);
assert.equal(goodBrief.out,'Deal completed');
assert.equal(F.G.briefs.find(b=>b.id===briefId).done,true);
assert.equal(F.G.club.cash,cash0+34);
assert.equal(F.answerBrief(briefId,0),null,'briefing cannot be committed twice');
assert.equal(F.G.club.cash,cash0+34);
assert(F.respond(msgId,17)===null,'resolved event cannot be reopened');
console.log('PASS: failed decisions rollback; successful choices commit once; events and briefings remain compatible');
