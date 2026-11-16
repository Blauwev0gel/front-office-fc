// CEO Core Quality — deterministic ten-week gameplay and counterfactual regression.
// Run: node test/ceocore.js  (after build.py; Node 22)
const assert = require('node:assert/strict');
const vm = require('node:vm');
const read = require('./src.js');
const modules = ['engine.js','events.js','events2.js','briefs.js','academy.js',
  'academy2.js','recruit.js','summer.js','season.js','summer2.js','faces.js',
  'firstteam.js','depts.js','levers.js','commercial.js','marketing.js',
  'business.js','academy3.js','recruitx.js','matchtalk.js','desk.js',
  'loop.js','dossiers.js','pathway.js','matchday.js','ceocore.js'];
const source = modules.map(read).join('\n');
new vm.Script(source);
function boot() {
  const ctx = { console, module:undefined };
  vm.createContext(ctx);
  vm.runInContext(source + '\n;this.FO=FO;',ctx);
  return ctx.FO;
}
function start(seed) {
  const F = boot(); F.newGame(seed);
  const dna = {};
  for (const choice of F.DNA) dna[choice.k]=choice.o[0].v;
  F.setDNA(dna,'Test United','TST','Testford',['#123','#fff']);
  for (const role of F.ROLES) F.hire(role.id,1);
  F.finishStaff(); F.finishMandates();
  if (F.G.phase==='summer') F.sumAuto(F.rnd,true);
  F.preSetTarget('accept'); F.finishPreseason();
  for (const id of F.G.press) F.pressAnswer(id,1);
  F.finishPress();
  assert.equal(F.G.phase,'season');
  return F;
}
function clearInbox(F) {
  for (const m of F.G.inbox.filter(x=>!x.done)) {
    const v=F.msgView(m);
    F.respond(m.id,v.auto);
  }
}
const F = start(913);
assert(F.ceoCoreView().decisions.some(x=>x.type==='hire' && x.role==='coach'));
assert(F.ceoCoreView().decisions.some(x=>x.type==='hire' && x.role==='dof'));
assert(!F.setMandate('coach',{...F.G.mand.coach,attack:90}).err);
assert(!F.setMandate('dof',{...F.G.mand.dof,data:90}).err);
assert(!F.setAuth('dof',2).err);
assert.equal(F.ceoCoreView().decisions.filter(x=>x.type==='mandate').length,2);
assert(F.ceoCoreView().decisions.some(x=>x.type==='authority'));
// Exercise a normal desk-routed staff call with an explicit, harmless fixture.
F.defineEvent('ceocore_fixture',{from:'dof',dept:'recruit',
  title:'Routine evidence check',body:'The scouting plan is stable.',
  cd:1,opts:[{l:'Keep scouting',f:()=>'Recruitment maintained the plan.'}]});
assert(F.addMsg('ceocore_fixture',{}));
const delegated=F.G.ceoCore.delegated.find(x=>x.title==='ceocore_fixture');
assert(delegated && delegated.choice==='Keep scouting');
assert.match(delegated.reason,/authority/);
assert.match(delegated.outcome,/maintained the plan/);
// Genuine ten-week loop: departments, inbox, fixtures, full-time Gazette, save.
let followups=0;
for (let i=0;i<10;i++) {
  assert.equal(F.G.phase,'season');
  assert.equal(F.deptOverview().length,6);
  const preview=F.mtPreview();
  assert(preview && preview.name,'match preview should be available');
  clearInbox(F);
  const result=F.endWeek();
  assert(result && result.ours,'real league fixture was simulated');
  assert(F.G.paper.headline,'week Gazette has a headline');
  const edition=F.edView(0);
  assert(edition && edition.head,'match Gazette edition exists');
  followups+=F.G.paper.stories.filter(s=>s.h==='Decision follow-up').length;
  if(i===4)assert(F.load(F.save()),'midseason save/load');
}
assert.equal(F.G.week,11);
for (const type of ['hire','mandate','authority']) {
  assert(F.G.ceoCore.decisions.some(x=>x.type===type && x.review),
    type+' lacks a later evidence-based review');
}
assert(followups>=3,'the Gazette did not revisit enough original instructions');
const clone=boot();assert(clone.load(F.save()));
assert(clone.ceoCoreView().decisions.some(x=>x.review));
assert(clone.G.ceoCore.delegated.some(x=>x.title==='ceocore_fixture'));
// Older saves have no ceoCore object; the ledger must migrate lazily.
const old=JSON.parse(F.save());delete old.ceoCore;
const migrated=boot();assert(migrated.load(JSON.stringify(old)));
assert.deepEqual(Array.from(migrated.ceoCoreView().decisions),[]);
// Same seeded club: evidence policy should alter the real recommendation state.
const D=start(914);D.G.phase='season';D.G.week=10;
const target={...D.G.squad[0],id:999,pos:'CB',age:25,
  inTier:D.G.club.tier,region:'dom',ask:0,wageAsk:100,club:null};
D.G.rec.pool[999]=target;
D.G.rec.know[999]={n:1,by:'Scout',est:30,pest:30,
  sd:1.8,psd:2,conf:'low',grade:'A'};
const pipeline=D.recAddPipe(999,'scouted');
D.G.mand.dof.data=95; D.recDeal();
assert.equal(pipeline.stage,'scouted','high-data DoF requires verified reports');
pipeline.stage='scouted'; D.G.mand.dof.data=10; D.recDeal();
assert.equal(pipeline.stage,'recommended','scout-eye DoF accepts uncertain upside');
// Matched seeds: attack should now change BOTH the chance creation
// and the defensive exposure. This is not an assertion that it wins more.
function style(seed,attack) {
  const g=start(seed);g.G.mand.coach.attack=attack;
  let gf=0,ga=0;
  for(let i=0;i<10;i++) {
    g.G.board.conf=Math.max(80,g.G.board.conf);
    g.G.club.cash=Math.max(150000,g.G.club.cash);
    clearInbox(g);const r=g.endWeek();
    assert(r.ours);
    gf+=r.ours.uxg;ga+=r.ours.txg;
  }
  return {gf,ga};
}
let diffFor=0,diffAgainst=0;
for(let i=0;i<8;i++) {
  const seed=420+i*71;
  const low=style(seed,10),high=style(seed,90);
  diffFor+=high.gf-low.gf;diffAgainst+=high.ga-low.ga;
}
assert(diffFor>0 && diffAgainst>0,
  'coach attack must produce a measurable offence-versus-risk trade-off');
// Season transition, summer regression and reload during actual summer v2.
const S=start(1617);
for(let i=0;i<34;i++) {
  assert.equal(S.G.phase,'season');
  S.G.board.conf=80;S.G.club.cash=Math.max(S.G.club.cash,100000);
  clearInbox(S);S.endWeek();
}
assert.equal(S.G.phase,'review');
S.startSeason();
assert.equal(S.G.phase,'summer');
assert(S.load(S.save()),'summer save/load');
S.sumAuto(S.rnd,true);
assert.notEqual(S.G.phase,'summer','actual summer v2 should complete');
assert(S.G.lastSummer,'summer accounting should exist');
console.log('PASS: 10-week CEO core, delayed consequences, delegation, coach/DoF counterfactual, save migration and next summer');
