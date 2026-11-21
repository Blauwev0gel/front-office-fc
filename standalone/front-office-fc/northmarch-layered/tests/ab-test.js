// Counterfactual tests: same seed and state, one different decision, then measure what really changes.
// Story, staff and dynasty are off. Each lever runs on many seeds; the effect must show in most of them and on average.
// Usage: node tests/ab-test.js [seeds]
const {loadEngine}=require('./load.js');
const N=+(process.argv[2]||16);
const E=loadEngine();
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
function world(seed){E.newWorld(seed);const S=E.__get();E.chooseClub('pell');return E.serialize()}
function branch(snap,decide,seasons,measure){
  E.deserialize(snap);const S=E.__get(),id=S.my;decide(S,id);
  const m0=measure.start?measure.start(S,id):null;
  for(let s=0;s<seasons;s++){while(!E.seasonOver()){E.advanceWeek()}if(s<seasons-1||measure.afterClose)E.closeSeason()}
  return measure.end(E.__get(),id,m0);
}
const plotOf=(S,id,k)=>S.grounds[id].plots.findIndex(p=>p.kind===k);
const free=(S,id)=>S.grounds[id].plots.findIndex(p=>!p.kind);
function money(S,id,amt){E.cmd('TakeLoan',id,{amount:Math.min(amt,E.maxNewLoan(id)),years:10},'player')}

// 1. Training ground: upgrade twice and fund it generously → young players develop faster
{const dA=[],dB=[],cashA=[],cashB=[];let wins=0;
 const measure={start:(S,id)=>Object.fromEntries(S.squads[id].filter(p=>p.age<=21).map(p=>[p.id,p.q])),
   end:(S,id,m0)=>{const g=[];for(const p of S.squads[id])if(m0[p.id]!=null)g.push(p.q-m0[p.id]);return{g:avg(g),cash:S.fin[id].cash}}};
 for(let k=0;k<N;k++){const snap=world(1000+k);
  const A=branch(snap,()=>{},2,measure);
  const B=branch(snap,(S,id)=>{money(S,id,120);const i=plotOf(S,id,'training');E.cmd('StartProject',id,{key:`plot:${i}:up`,offer:'premium'});E.cmd('SetDeptBudget',id,{dept:'training',level:'generous'});
    const hook=()=>{const S2=E.__get();if(S2.week===12)E.cmd('StartProject',S2.my,{key:`plot:${i}:up`,offer:'premium'})};E.onWeek(hook)},2,measure);
  E.clearHooks();
  dA.push(A.g);dB.push(B.g);cashA.push(A.cash);cashB.push(B.cash);if(B.g>A.g)wins++}
 console.log(`training: young players' growth over two seasons A ${avg(dA).toFixed(2)} vs B ${avg(dB).toFixed(2)} · B better in ${wins}/${N} · cash A ${avg(cashA).toFixed(0)} vs B ${avg(cashB).toFixed(0)}`);
 ok(avg(dB)>avg(dA)+.1&&wins>=N*.65,'a better training ground makes young players develop faster');
 ok(avg(cashB)<avg(cashA),'and it costs money (no free lunch)');}

// 2. Medical centre on a free plot → fewer weeks lost to injury
{const iA=[],iB=[];let wins=0;
 const measure={end:(S,id)=>S.ev.filter(e=>e.t==='Injury'&&e.c===id&&e.s===S.season).reduce((a,e)=>a+e.weeks,0)}; // season two: the centre is built
 for(let k=0;k<N;k++){const snap=world(2000+k);
  const A=branch(snap,()=>{},2,measure);
  const B=branch(snap,(S,id)=>{money(S,id,80);const f=free(S,id);E.cmd('StartProject',id,{key:`plot:${f}:medical`,offer:'premium'});E.cmd('SetDeptCourse',id,{dept:'training',course:'fitness'})},2,measure);
  iA.push(A);iB.push(B);if(B<A)wins++}
 console.log(`medical: injury weeks in season two A ${avg(iA).toFixed(1)} vs B ${avg(iB).toFixed(1)} · B fewer in ${wins}/${N}`);
 ok(avg(iB)<avg(iA)*.9,'a medical centre cuts the weeks lost to injury');}

// 3. Academy → more and better graduates at the end of the season
{const nA=[],nB=[],pA=[],pB=[];
 const measure={afterClose:true,end:(S,id)=>{const e=S.ev.filter(x=>x.t==='YouthIntake'&&x.c===id).pop();return{n:e.n,best:e.best}}};
 for(let k=0;k<N;k++){const snap=world(3000+k);
  const A=branch(snap,()=>{},1,measure);
  const B=branch(snap,(S,id)=>{money(S,id,90);const f=free(S,id);E.cmd('StartProject',id,{key:`plot:${f}:academy`,offer:'premium'})},1,measure);
  nA.push(A.n);nB.push(B.n);pA.push(A.best);pB.push(B.best)}
 console.log(`academy: graduates A ${avg(nA).toFixed(1)} vs B ${avg(nB).toFixed(1)} · best potential A ${avg(pA).toFixed(1)} vs B ${avg(pB).toFixed(1)}`);
 ok(avg(nB)>avg(nA)&&avg(pB)>avg(pA),'an academy delivers more and better graduates');}

// 4. Ticket prices: +4 on the terrace → fewer fans, and the gate moves
{const aA=[],aB=[],gA=[],gB=[];
 const measure={end:(S,id)=>{const f=S.fin[id];return{att:f.lastGate.total,gate:f.season.gate||0}}};
 for(let k=0;k<N;k++){const snap=world(4000+k);
  const A=branch(snap,()=>{},1,measure);
  const B=branch(snap,(S,id)=>{for(let i=0;i<4;i++)E.cmd('SetPrice',id,{kind:'terrace',delta:1})},1,measure);
  aA.push(A.att);aB.push(B.att);gA.push(A.gate);gB.push(B.gate)}
 console.log(`prices: last crowd A ${avg(aA).toFixed(0)} vs B ${avg(aB).toFixed(0)} · season gate A £${avg(gA).toFixed(0)}k vs B £${avg(gB).toFixed(0)}k`);
 ok(avg(aB)<avg(aA)*.95,'higher prices keep fans away');}

// 5. Determinism: same seed, same decisions → identical world
{const a=branch(world(5000),()=>{},1,{afterClose:true,end:S=>E.serialize()}),b=branch(world(5000),()=>{},1,{afterClose:true,end:S=>E.serialize()});
 ok(a===b,'the same seed and decisions give exactly the same world');}

console.log(fails?`${fails} check(s) failed`:'ab-test: all checks passed');
process.exit(fails?1:0);
