// Club Story Engine: three 8–12-week causal narratives, actual staff/football state.
// Run after build.py: node test/stories.js
const assert=require('node:assert/strict'),vm=require('node:vm'),read=require('./src.js');
const files=['engine.js','events.js','events2.js','briefs.js','academy.js','academy2.js',
'recruit.js','summer.js','season.js','summer2.js','firstteam.js','depts.js','levers.js',
'commercial.js','marketing.js','business.js','academy3.js','recruitx.js','matchtalk.js',
'desk.js','loop.js','dossiers.js','pathway.js','matchday.js','ceocore.js','stories.js'];
const code=files.map(read).join('\n');
new vm.Script(code);
function boot(){const ctx={console};vm.createContext(ctx);vm.runInContext(code+'\nthis.FO=FO;',ctx);return ctx.FO;}
function init(seed){
  const F=boot();F.newGame(seed);const dna={};for(const q of F.DNA)dna[q.k]=q.o[0].v;
  F.setDNA(dna,'Stories United','STY','Storyville',['#123','#fff']);
  for(const r of F.ROLES)F.hire(r.id,1);
  F.finishStaff();F.finishMandates();
  if(F.G.phase==='summer')F.sumAuto(F.rnd,true);
  F.preSetTarget('accept');F.finishPreseason();
  for(const id of F.G.press)F.pressAnswer(id,1);
  F.finishPress();
  assert.equal(F.G.phase,'season');
  return F;
}
function trial(kind,choice,seed=1415){
  const F=init(seed);F.G.week=6;F.G.board.conf=95;
  if(kind==='conflict'){F.G.mand.coach.youthMins=8;F.G.mand.dof.youth=91;}
  if(kind==='finance')F.G.club.cash=-F.M(7000);
  assert(F.storyStart(kind,true),'real club state should qualify for '+kind);
  assert.equal(F.G.storybook.active[kind].stage,0);
  assert.equal(F.storyStart(kind,true),false,'duplicate story cannot start');
  const seedState={cash:F.G.club.cash,coach:F.G.mand.coach.youthMins,
    dof:F.G.mand.dof.youth,fin:F.G.mand.fin.risk,squad:F.G.squad.length};
  let seenOpening=false,seenFollowup=false,storyNews=0,autoDecisions=0;
  for(let i=0;i<15&&F.G.phase==='season';i++){
    assert(Object.keys(F.G.storybook.active).length<=2,'more than two stories running');
    for(const m of F.G.inbox.filter(x=>!x.done)){
      const v=F.msgView(m);
      const opening=m.ev==='story_'+kind+'_opening';
      const later=m.ev==='story_'+kind+'_followup';
      if(opening)seenOpening=true;
      if(later)seenFollowup=true;
      F.respond(m.id,opening?choice:later?1:v.auto);
    }
    const preview=F.mtPreview();assert(preview&&preview.name);
    assert.equal(F.deptOverview().length,6);
    // Prevent unrelated dismissal from ending the test early; not a gameplay rule.
    F.G.board.conf=Math.max(30,F.G.board.conf);
    const week=F.endWeek();
    assert(week&&week.ours,'the real match engine must produce a fixture');
    assert(F.G.paper.headline,'the Gazette must be produced');
    assert(F.edView(0).head,'the latest Gazette edition must exist');
    storyNews+=F.G.paper.stories.filter(x=>/^(Coach and DoF|Academy prospect|Cash and credibility)$/.test(x.h)).length;
    if(i===4)assert(F.load(F.save()),'reload during active story');
    if(F.G.storybook.history.some(x=>x.kind===kind))break;
  }
  const row=F.G.storybook.history.find(x=>x.kind===kind);
  assert(row,'story must conclude within the 15-week boundary');
  assert(seenOpening,'real opening message must arrive through inbox');
  assert(row.ended-row.started>=8&&row.ended-row.started<=15,'story outside requested duration');
  assert(storyNews>=2,'autonomous follow-ups should appear in Gazette');
  assert.equal(row.decision[0].choice,['conflict','youth','finance'].includes(kind)?
    ({conflict:['dof','joint','coach'],youth:['fast','phase','care'],
    finance:['cut','sponsor','hold']}[kind][choice]):null);
  assert(row.verdict&&row.verdict.length>20);
  const saved=F.save(),other=boot();assert(other.load(saved));
  assert(other.storyView().history.some(x=>x.kind===kind),'story history survives reload');
  return {F,row,seedState,seenFollowup,storyNews};
}
for(const kind of ['conflict','youth','finance']){
  const a=trial(kind,0),b=trial(kind,2);
  assert.notEqual(a.row.route,b.row.route,'CEO decision must change route');
  assert.notEqual(a.row.verdict,b.row.verdict,
    'same seed, opposite decisions must lead to different club outcome: '+kind);
  if(kind==='conflict')assert.notEqual(a.F.G.mand.dof.youth,b.F.G.mand.dof.youth);
  if(kind==='youth'){
    assert(!a.F.G.storybook.active.youth);
    const original=a.row.log.find(x=>/Academy Director|coach/.test(x.t));
    assert(original,'academy development must be carried out through existing staff');
    // The player cannot be directly selected by the CEO.
    assert(!/pickXI\(|G\.xi\s*=/.test(read('stories.js')),'new story does not set the XI');
  }
  if(kind==='finance')assert.notEqual(a.F.G.club.cash,b.F.G.club.cash);
}
// At most two active storylines, and no repeated opening for a live thread.
{
  const F=init(1415);F.G.week=6;F.G.mand.coach.youthMins=5;F.G.mand.dof.youth=95;
  F.G.club.cash=-F.M(7000);
  assert(F.storyStart('conflict',true));
  assert(F.storyStart('finance',true));
  assert.equal(F.storyStart('youth',true),false,'capacity limit');
  assert.equal(F.storyStart('finance',true),false,'no duplicate finance opening');
}
// Never launch the youth story while the established academy pathway is running.
{
  const F=init(1415);F.G.week=6;
  F.G.pw={stage:'run'};
  assert.equal(F.storyStart('youth',true),false);
}
// An old save without story state must load safely.
{
  const F=init(1415);const raw=JSON.parse(F.save());delete raw.storybook;
  const old=boot();assert(old.load(JSON.stringify(raw)));
  assert.equal(old.storyView().active.length,0);
  assert.equal(old.storyView().history.length,0);
}
// No replies: the established endWeek auto-resolution must still progress stories.
{
  const F=init(1415);F.G.week=6;F.G.mand.coach.youthMins=8;F.G.mand.dof.youth=91;
  assert(F.storyStart('conflict',true));
  for(let i=0;i<15;i++){
    F.G.board.conf=Math.max(30,F.G.board.conf);
    F.endWeek(); // do NOT answer the story or any other Red Box message
    if(F.G.storybook.history.some(x=>x.kind==='conflict'))break;
  }
  assert(F.G.storybook.history.some(x=>x.kind==='conflict'),
    'unanswered story must not deadlock gameplay');
}
// Normal games must not need a fixture to force a narrative. Every story
// started by the actual week engine must close before end-of-season review.
{
  let triggered=0;
  for(let i=0;i<6;i++){
    const F=init(1000+i*157);let weeks=0,maxOpen=0;
    while(F.G.phase==='season'&&weeks<34){
      F.G.board.conf=Math.max(F.G.board.conf,55);
      F.G.club.cash=Math.max(F.G.club.cash,F.M(3000));
      for(const m of F.G.inbox.filter(x=>!x.done))F.respond(m.id,F.msgView(m).auto);
      const r=F.endWeek();
      assert(r&&r.ours,'normal season must have a match');
      weeks++;maxOpen=Math.max(maxOpen,Object.keys(F.G.storybook?.active||{}).length);
    }
    assert.equal(weeks,34);assert.equal(F.G.phase,'review');
    assert(maxOpen<=2,'no more than two concurrent storylines');
    const B=F.G.storybook||{seq:0,active:{},history:[]};
    triggered+=B.seq||0;
    assert.equal(Object.keys(B.active).length,0,'all stories must close before season review');
    assert.equal(B.seq||0,B.history.length,'story started but not archived');
    F.startSeason();
    assert.equal(F.G.phase,'summer','recovery to next season must preserve summer route');
    assert(F.load(F.save()),'save/load in next summer');
    F.sumAuto(F.rnd,true);
    assert.notEqual(F.G.phase,'summer');
  }
  assert(triggered>0,'normal play should sometimes produce club stories');
}
console.log('PASS: 3 club stories, 6 opposite-choice careers, real week+Gazette, no duplication, 8–15-week closure, save/load and legacy saves');
