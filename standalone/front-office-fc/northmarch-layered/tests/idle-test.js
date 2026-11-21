// A chairman who never acts: the club keeps running on its director (squad) and its standing budgets.
// It must not crash or freeze, and it should fall behind the clubs whose boards do invest.
const {loadEngine}=require('./load.js');const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const rows=[];
for(const seed of [11,12,13,14,15,16]){E.newWorld(seed);let S=E.__get();E.chooseClub('pell');S.agmOff=true;
  for(let s=0;s<10;s++)E.playSeason()
  S=E.__get();const id='pell',g=S.grounds[id],worst=E.groundCondWorst(id).c,trainOthers=Object.keys(S.clubs).filter(i=>i!==id).map(i=>E.groundSignals(i).training);
  rows.push({seed,tier:S.clubs[id].tier,cash:S.fin[id].cash,squad:S.squads[id].length,worst,train:E.groundSignals(id).training,others:trainOthers.reduce((a,b)=>a+b,0)/trainOthers.length});}
for(const r of rows)console.log(`seed ${r.seed}: division ${r.tier} · cash £${r.cash.toFixed(0)}k · squad ${r.squad} · worst condition ${r.worst.toFixed(0)}% · training ${r.train} vs others ${r.others.toFixed(1)}`);
ok(rows.every(r=>r.squad>=18),'the director keeps a full squad without the chairman');
ok(rows.every(r=>Number.isFinite(r.cash)),'the books keep running');
ok(rows.filter(r=>r.train<r.others).length>=4,'a club that never invests falls behind the others in facilities');
console.log(fails?`${fails} check(s) failed`:'idle-test: all checks passed');process.exit(fails?1:0);
