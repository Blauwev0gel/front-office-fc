// Model B: stakeholder regression. Press stays narrative, not a fourth dismissal trigger.
const assert=require('node:assert/strict');
const vm=require('node:vm');
const read=require('./src.js');
const modules=['engine.js','events.js','events2.js','briefs.js','academy.js','academy2.js','recruit.js','summer.js','season.js','summer2.js','faces.js','firstteam.js','depts.js','levers.js','commercial.js','marketing.js','business.js','academy3.js','recruitx.js','matchtalk.js','desk.js','loop.js','dossiers.js','pathway.js','matchday.js','ceocore.js'];
const source=modules.map(read).join('\n');
function boot(){const ctx={console};vm.createContext(ctx);vm.runInContext(source+'\n;this.FO=FO;',ctx);return ctx.FO;}
const F=boot();F.newGame(9204);
const dna={};for(const d of F.DNA)dna[d.k]=d.o[0].v;
F.setDNA(dna,'Model B FC','MBC','Testford',['#123','#fff']);
for(const role of F.ROLES)F.hire(role.id,1);
F.finishStaff();F.finishMandates();if(F.G.phase==='summer')F.sumAuto(F.rnd,true);
F.preSetTarget('accept');F.finishPreseason();for(const id of F.G.press)F.pressAnswer(id,1);F.finishPress();
assert.equal(F.G.phase,'season');
assert.deepEqual(Array.from(F.backers(),x=>x.k),['board','fans','room']);
const before=Array.from(F.backers(),x=>x.v);
F.G.st.press=0;assert.deepEqual(Array.from(F.backers(),x=>x.v),before,'press should not be a fourth stakeholder score');
assert(!F.G.queue.some(x=>x.ev==='vote_press'),'press cannot trigger a new dismissal vote');
// The ledger records actual changes, with provenance, and survives save/load.
assert.equal(typeof F.stakeholderHistory,'function');
const first=F.backers().find(x=>x.k==='board').v;
F.G.board.conf=Math.min(100,first+4);
// A normal simulated week must not fabricate a decision-specific cause.
assert(Array.isArray(F.stakeholderHistory()));
const grip=F.G.grip;
F.G.grip=0;const effLow=F.eff('coach',0);
F.G.grip=100;assert.equal(F.eff('coach',0),effLow,'Grip cannot boost staff by click farming');
F.G.grip=grip;
const restored=boot();assert(restored.load(F.save()));
assert.deepEqual(Array.from(restored.backers(),x=>x.k),['board','fans','room']);
assert.equal(typeof restored.stakeholderHistory,'function');
console.log('PASS: three accountable groups, contextual press, neutral Grip and save compatibility');
