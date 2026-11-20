// Regression: the TD's provisional meeting plan must be replaced after a new mandate.
// Run: node build.js && node tests/mandate-causality-test.js
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'../dist/artifact.html'),'utf8');
const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function load(){
  const module={exports:{}};
  const ctx={module,console,Math,Date,JSON,Object,Array,String,Number,Set,Map};
  vm.createContext(ctx);
  vm.runInContext(src+'\n;module.exports.run=(c)=>eval(c);module.exports.act=act;',ctx);
  return module.exports;
}
const SEEDS=Array.from({length:20},(_,i)=>1000+i*37);
function scenario(seed,identity,wagehouse,risk='balanced'){
  const m=load();m.act('new',seed);
  return m.run(`(function(){
    const id=Object.keys(S.clubs).find(i=>CL(i).tier===1&&i!=='pell'),c=CL(id);
    S.my=id;S.flags={};S.mods=[];S.youth=0;S.promises=[];
    cfInit(id,c.str,c.cast.td,c.cast.coach,c.rival);
    S.cf.tdStrikes=2;S.cf.strikeS=S.season-1;
    startMeeting();
    const provisional=JSON.stringify(S.cf.sum.prios);
    S.meeting.choice={ambition:'steady',risk:'${risk}',identity:'${identity}',wagehouse:'${wagehouse}',sales:'price',kpi:'position'};
    applyMandate();
    const budget=S.cf.budgetLeft,cap=S.cf.frames.cap;
    startSummer();
    const s=S.cf.sum;
    const current=JSON.stringify(s.prios);
    const expectedProfile=S.cf.frames.profile;
    const ages=s.prios.flatMap(x=>x.targets.filter(t=>t.kind==='buy').map(t=>t.age));
    const maxWage=s.prios.flatMap(x=>x.targets.filter(t=>t.kind==='buy').map(t=>t.wage));
    const snapshot={provisional,current,budget,cap,expectedProfile,ages,maxWage,
      step:s.step,strikes:S.cf.tdStrikes,priorities:s.prios.length,
      emptyDeals:s.ins.length===0&&s.outs.length===0&&s.weeks.length===0,
      brief:s.brief.length,spendLimit:s.brief.find(k=>k.k==='net').v};
    return snapshot;
  })()`);
}
let differing=0;
for(const seed of SEEDS){
  const young=scenario(seed,'own','flat'),experienced=scenario(seed,'pros','oneStar');
  assert.strictEqual(young.step,'brief');
  assert.strictEqual(experienced.step,'brief');
  assert.strictEqual(young.strikes,1,'strike decay must occur once, not twice');
  assert.strictEqual(experienced.strikes,1);
  assert(young.emptyDeals&&experienced.emptyDeals,'replanning must not execute deals');
  assert(young.brief>=2&&experienced.brief>=2);
  assert.strictEqual(young.expectedProfile,'youth');
  assert.strictEqual(experienced.expectedProfile,'experience');
  assert(young.maxWage.every(w=>w<=young.cap),'flat mandate targets must respect wage cap');
  assert(experienced.maxWage.every(w=>w<=Math.round(experienced.cap*1.6)),
    'one-star targets must respect maximum permitted cap');
  if(young.current!==experienced.current)differing++;
  assert.deepStrictEqual(scenario(seed,'own','flat'),young,'same seed and mandate must reproduce plan');
}
assert(differing>0,'contrasting mandates must change at least one finalized transfer plan across 20 seeds');
console.log('PASS: 20 seeds; mandate replan, strike lifecycle, constraints, no early deals, determinism.');
console.log('Distinct final plans under contrasting mandates:',differing,'of',SEEDS.length);
