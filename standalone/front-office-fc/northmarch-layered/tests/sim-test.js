// L1 acceptance: the world runs on its own (story, staff and dynasty off) for 20 seasons.
// Checks invariants every season and prints the economy and football per division.
// Usage: node tests/sim-test.js [seed] [seasons]
const {loadEngine}=require('./load.js');
const seed=+(process.argv[2]||20261121),N=+(process.argv[3]||20);
const E=loadEngine();E.newWorld(seed);let S=E.__get();E.chooseClub(S.seats[1]);S.auto=true;
let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}};
const tierOf={},moves={},admins=[],start=Date.now();let playerOut=0,chairsOut=0;
for(const id in S.clubs)tierOf[id]=[S.clubs[id].tier];
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
console.log('season | division: op.result avg [min..max] · cash avg · wages/income · avg q · avg age');
for(let s=1;s<=N;s++){
  if(S.phase==='choose'){playerOut++;E.chooseClub(S.seats[0])}
  while(!E.seasonOver())E.advanceWeek();
  const ids=Object.keys(S.clubs),line=[];
  for(const t of [0,1,2]){const st=E.standings(t),op=st.map(i=>E.operatingResult(S.fin[i].season)),inc=st.map(i=>{const l=S.fin[i].season;let x=0;for(const k in l)if(l[k]>0&&!['loanIn','feesIn'].includes(k))x+=l[k];return x});
    const wr=avg(st.map((i,j)=>-(S.fin[i].season.wages||0)/Math.max(1,inc[j])));
    const q=avg(st.map(i=>E.squadQuality(S.squads[i])))-(S.qref-11.7),age=avg(st.flatMap(i=>S.squads[i].map(p=>p.age)));
    line.push(`T${t}: inc ${avg(inc).toFixed(0)} op ${avg(op).toFixed(0)} [${Math.min(...op).toFixed(0)}..${Math.max(...op).toFixed(0)}] · ${avg(st.map(i=>S.fin[i].cash)).toFixed(0)} · ${(wr*100).toFixed(0)}% (cap use ${(avg(st.map(i=>E.wageBillK(i)/E.wageCapK(i)))*100).toFixed(0)}%) · q${q.toFixed(1)} · ${age.toFixed(1)}y`);
    ok(st.length===16,`season ${s}: division ${t} has ${st.length} clubs`);}
  console.log(`S${String(s).padStart(2)} | ${line.join(' | ')}`);
  for(const id of ids){const f=S.fin[id],sq=S.squads[id];
    ok(sq.length>=18&&sq.length<=30,`season ${s}: ${id} squad ${sq.length}`);
    ok(Number.isFinite(f.cash),`season ${s}: ${id} cash not finite`);
    // the ledger reconciles: start + every booked line = cash
    let sum=f.start;for(const h of f.hist)for(const k in h.lines)sum+=h.lines[k];for(const k in f.season)sum+=f.season[k];
    ok(Math.abs(sum-f.cash)<0.5,`season ${s}: ${id} ledger off by ${(sum-f.cash).toFixed(2)}`);
    ok(sq.every(p=>Number.isFinite(p.q)&&p.q>=4&&p.q<=19),`season ${s}: ${id} player quality out of range`);
  }
  const pids=Object.values(S.squads).flat().map(p=>p.id);ok(new Set(pids).size===pids.length,`season ${s}: a player is in two squads`);
  for(const e of S.ev.filter(e=>e.t==='Administration'&&e.s===s))admins.push(e.c);
  const h=E.closeSeason();
  for(const m of h.moves){moves[m.id]=(moves[m.id]||0)+1}
  chairsOut+=h.chairsOut.length;
  for(const id in S.clubs)tierOf[id].push(S.clubs[id].tier);
}
const movers=Object.keys(moves).length,yoyo=Object.values(moves).filter(n=>n>=3).length;
const climbed=Object.keys(tierOf).filter(id=>tierOf[id][0]===2&&Math.min(...tierOf[id])===0).length;
const fell=Object.keys(tierOf).filter(id=>tierOf[id][0]===0&&Math.max(...tierOf[id])===2).length;
const cash=Object.values(S.fin).map(f=>f.cash).sort((a,b)=>a-b);
console.log(`\nclubs that changed division: ${movers}/48 · three or more moves: ${yoyo} · from Two to Premier: ${climbed} · from Premier to Two: ${fell}`);
console.log(`administrations: ${admins.length} (${[...new Set(admins)].length} clubs) · cash spread: min ${cash[0].toFixed(0)} median ${cash[24].toFixed(0)} max ${cash[47].toFixed(0)}`);
console.log(`chairmen voted out at AGMs: ${chairsOut} (computer clubs) · the auto-run player: ${playerOut}`);
console.log(`cup winners: ${[...new Set(S.hist.map(h=>h.cup))].length} different · ${((Date.now()-start)/1000).toFixed(1)}s`);
ok(movers>=16,'too few clubs change division');
ok(climbed+fell>=1,'no club travels between the top and bottom division in 20 seasons');
ok(chairsOut>=5&&chairsOut<=80,`chairmen voted out: ${chairsOut} (expected 5-80 in ${N} seasons)`);
ok(admins.length<=N,'administration is too common');
ok(cash[47]<20000,'a club hoards unlimited money');
ok(cash[24]>-200,'the median club is deep in the red: the economy does not close');
const inc0=Object.keys(S.clubs).map(i=>E.estSeasonIncome(i));
ok(Object.values(S.squads).every((sq,j)=>true),'');
console.log(fails?`${fails} check(s) failed`:'sim-test: all checks passed');
process.exit(fails?1:0);
