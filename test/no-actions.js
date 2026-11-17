// Action-free CEO model and single-tap reply contract (ChatGPT branch only).
// Execute after python3 build.py: node test/no-actions.js
const assert=require('node:assert/strict');
const vm=require('node:vm');
const read=require('./src.js');
const modules=['engine.js','events.js','events2.js','briefs.js','academy.js','academy2.js',
  'recruit.js','summer.js','season.js','summer2.js','firstteam.js','depts.js',
  'levers.js','commercial.js','marketing.js','business.js','academy3.js',
  'recruitx.js','matchtalk.js','desk.js','loop.js','dossiers.js','pathway.js',
  'matchday.js','ceocore.js','stories.js'];
const source=modules.map(read).join('\n');
new vm.Script(source,{filename:'game-engine'});
function boot(){const ctx={console};vm.createContext(ctx);vm.runInContext(source+'\nthis.FO=FO;',ctx);return ctx.FO;}
function start(seed=1415){
  const F=boot();F.newGame(seed);
  const dna={};for(const d of F.DNA)dna[d.k]=d.o[0].v;
  F.setDNA(dna,'No Actions FC','NAF','Haven',['#123','#fff']);
  for(const role of F.ROLES)F.hire(role.id,1);
  F.finishStaff();F.finishMandates();
  if(F.G.phase==='summer')F.sumAuto(F.rnd,true);
  F.preSetTarget('accept');F.finishPreseason();
  for(const id of F.G.press)F.pressAnswer(id,1);
  F.finishPress();assert.equal(F.G.phase,'season');
  return F;
}
const F=start();
assert.equal(Object.hasOwn(F.G,'ap'),false,'no weekly action currency on new games');
const legacy=JSON.parse(F.save());legacy.ap=0;
const restored=boot();assert(restored.load(JSON.stringify(legacy)));
assert.equal(Object.hasOwn(restored.G,'ap'),false,'old AP=0 save is upgraded');
const role='dof',staff=F.staff(role);
const response=F.talk(role,'praise');assert(response.out);
const trust=staff.rel;F.talk(role,'praise');
assert.equal(staff.rel,trust,'repeating a conversation this week cannot farm trust');
const oldMand={...F.G.mand.dof},next={...oldMand,youth:oldMand.youth===91?70:91};
assert(F.setMandate(role,next).out);
const rel=staff.rel,again=F.setMandate(role,{...F.G.mand.dof});
assert.equal(again.out,'Mandate unchanged.');
assert.equal(staff.rel,rel,'repeated identical mandate must not farm trust');
const first=F.push('scouting'),scoutRel=F.staff('scout').rel;
const second=F.push('scouting');
assert(first.out&&second.out.includes('already'));
assert.equal(F.staff('scout').rel,scoutRel,'repeated backing does not stack');
assert(F.ftTalkStart(),'head-coach conversation must not require actions');
F.defineEvent('qa_no_actions_second',{from:'dof',dept:'sporting',forced:1,ceo:1,
  title:'Policy check',body:'A genuine board-level question.',
  second:{r:'fin',t:()=>'Finance recommends patience.'},
  opts:[{l:'Approve',f:()=>'Approved'},{l:'Wait',f:()=>'Noted'}]});
assert(F.addMsg('qa_no_actions_second',{}));
const msg=F.G.inbox.find(x=>x.ev==='qa_no_actions_second');
assert(F.secondOpinion(msg.id).out);
assert.match(msg.second,/Finance recommends patience/);
assert.equal(F.respond(msg.id,0).out,'Approved');
assert.equal(F.respond(msg.id,0),null,'cannot commit twice');
F.defineBrief('qa_ap_deprecated',{role:'fin',cd:1,check:()=>null,
  title:'Budget note',text:'Testing a legacy AP-marked briefing.',
  opts:[{l:'Approve',ap:true,f:()=>'Confirmed'}]});
const b={id:F.uid(),t:'qa_ap_deprecated',ctx:{},done:false};
F.G.briefs=[b];
assert.equal(F.answerBrief(b.id,0).out,'Confirmed','legacy optional AP flags do not gate choices');
assert.equal(b.done,true);
const other=start(1416);
assert(other.fire('mkt').out,'dismissal cannot be gated on AP');
let weeks=0;
for(let i=0;i<10;i++){
  assert.equal(F.G.phase,'season');
  for(const m of F.G.inbox.filter(x=>!x.done))F.respond(m.id,F.msgView(m).auto);
  const r=F.endWeek();assert(r&&r.ours);
  assert(F.G.paper.headline);
  assert.equal(Object.hasOwn(F.G,'ap'),false);
  if(i===4)assert(F.load(F.save()),'save/load in week five');
  weeks++;
}
assert.equal(weeks,10);
const raw=JSON.parse(F.save());raw.ap=0;
const resumed=boot();assert(resumed.load(JSON.stringify(raw)));
assert.equal(resumed.G.week,11);
assert.equal(Object.hasOwn(resumed.G,'ap'),false);
// Test the actual mailSend guard without a browser: one option tap commits once.
const ui=read('ui.js');
const begin=ui.indexOf('function mailSend('),end=ui.indexOf('const MAIL_RM',begin);
assert(begin>0&&end>begin);
let committed=0;
const item={id:17,done:false};
const mailSend=new Function('G','F','mailCommit',
  ui.slice(begin,end)+'\nreturn mailSend;')(
  ()=>({inbox:[item],briefs:[]}),
  {msgView:()=>({opts:[{l:'Back the director'},{l:'Hold'}]})},
  p=>{assert.equal(p.id,17);assert.equal(p.i,1);committed++;item.done=true;});
mailSend({k:'m',id:'17',i:'1'});
mailSend({k:'m',id:'17',i:'1'});
assert.equal(committed,1,'double-tapping cannot double-commit');
const rows=ui.slice(ui.indexOf('function mailRows('),ui.indexOf('function mailBanner('));
assert(rows.includes('data-a="mchoose"'));
assert(!ui.includes('data-a="msend"')&&!ui.includes('data-a="mpick"'));
assert(ui.includes("case 'mchoose': mailSend(d);"));
assert(!ui.includes('data-s="actions"'));
assert(!/\bG\.ap\s*(?:<|>|=|\+\+|--)/.test(source),
  'no action-point checks or refills in engine');
console.log('PASS: no action currency, legacy saves, consequences, repeated-action protection, one-tap choices and 10-week gameplay');
