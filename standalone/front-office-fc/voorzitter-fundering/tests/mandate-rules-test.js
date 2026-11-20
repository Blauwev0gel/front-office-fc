// Mandate pillars: deterministic constraint checks, not just snapshot comparisons.
// Run: node build.js && node tests/mandate-rules-test.js
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'../dist/artifact.html'),'utf8');
const js=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function boot(seed){
  const module={exports:{}},ctx={module,console,Math,Date,JSON,Object,Array,String,Number,Set,Map};
  vm.createContext(ctx);vm.runInContext(js+'\nmodule.exports.run=c=>eval(c);module.exports.act=act;',ctx);
  module.exports.act('new',seed);return module.exports;
}
function check(seed,override){
  const m=boot(seed);
  return m.run(`(function(){
    const id=Object.keys(S.clubs).find(i=>CL(i).tier===1&&i!=='pell'),c=CL(id);
    S.my=id;S.flags={};S.mods=[];S.youth=0;S.promises=[];
    cfInit(id,c.str,c.cast.td,c.cast.coach,c.rival);
    startMeeting();
    S.meeting.choice=Object.assign({ambition:'steady',risk:'balanced',identity:'local',wagehouse:'flat',sales:'price',kpi:'position'},${JSON.stringify(override.choice||{})});
    S.meeting.rules=${JSON.stringify(override.rules||[])};
    applyMandate();
    const f=S.cf.frames,prior=S.cf.sum.prios.length,priorReview=S.cf.sum.verdicts.length;
    const cash=C().cash,debt=C().debt;
    startSummer();
    const captain=S.cf.squad.find(p=>p.captain),local=S.cf.squad.find(p=>p.localKid);
    const out={
      f:JSON.parse(JSON.stringify(f)),cash,debt,
      budget:S.cf.budgetLeft,prios:S.cf.sum.prios.map(p=>({pos:p.pos,targets:p.targets.map(t=>({kind:t.kind,wage:t.wage,age:t.age}))})),
      provisionalPrior:prior,provisionalReview:priorReview,
      review:S.cf.sum.verdicts.map(v=>({pid:v.pid,v:v.v})),
      sales:S.cf.sum.sales.map(v=>v.pid),
      captainBlocked:captain?!!ruleBlocksSale(captain,null):null,
      localBlocked:local?!!ruleBlocksSale(local,null):null,
      rivalBlocked:!!ruleBlocksSale(S.cf.squad[0],S.cf.rivalId),
      step:S.cf.sum.step,contracts:S.cf.sum.contracts.length
    };
    return out;
  })()`);
}
for(let i=0;i<20;i++){
  const seed=700+i*37;
  const base=check(seed,{});
  const push=check(seed,{choice:{ambition:'push'}});
  const promotion=check(seed,{choice:{ambition:'promotion'}});
  assert(push.budget>=base.budget,'push cannot reduce mandate budget');
  assert(promotion.budget>=push.budget,'promotion cannot reduce mandate budget');
  const reserves=check(seed,{choice:{risk:'reserves'}});
  const borrow=check(seed,{choice:{risk:'borrow'}});
  assert(reserves.budget>=base.budget,'reserves should increase available transfer budget');
  assert(borrow.debt>=base.debt+80,'borrowing should increase debt');
  const own=check(seed,{choice:{identity:'own'}});
  const pros=check(seed,{choice:{identity:'pros'}});
  assert.strictEqual(own.f.profile,'youth');
  assert.strictEqual(pros.f.profile,'experience');
  const flat=check(seed,{choice:{wagehouse:'flat'}});
  const star=check(seed,{choice:{wagehouse:'oneStar'}});
  assert(flat.prios.every(x=>x.targets.every(t=>t.kind!=='buy'||t.wage<=flat.f.cap)),'flat salary cap');
  assert(star.prios.every(x=>x.targets.every(t=>t.kind!=='buy'||t.wage<=Math.round(star.f.cap*1.6))),'star salary ceiling');
  const noRival=check(seed,{rules:['noRival']});
  assert(noRival.rivalBlocked,'rival sale must be blocked');
  const captain=check(seed,{rules:['captainStays']});
  if(captain.captainBlocked!==null)assert(captain.captainBlocked,'captain sale must be blocked');
  const heroes=check(seed,{rules:['heroesStay']});
  if(heroes.localBlocked!==null)assert(heroes.localBlocked,'local player sale must be blocked');
  const youthKpi=check(seed,{choice:{kpi:'youth'}});
  assert.strictEqual(youthKpi.f.kpi,'youth','KPI must be recorded for end-of-season evaluation');
  const noMid=check(seed,{choice:{sales:'noMid'}});
  assert.strictEqual(noMid.f.sales,'noMid','mid-season sale rule must be recorded');
  assert.strictEqual(base.step,'brief');
}
console.log('PASS: 20 seeds × seven mandate pillars; budget, identity, wage, sales, KPI and rules invariants.');
