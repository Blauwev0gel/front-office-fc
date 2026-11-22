// Slimline gate G2: autonomous play over several seeds. No decisions by the player; the world must stay valid for 10 seasons.
// usage: node tests/slimline-test.js [seasons] [seed seed ...]
const {loadEngine}=require('./load.js');
const N=+process.argv[2]||10,SEEDS=process.argv.length>3?process.argv.slice(3).map(Number):[101,202,303];
let fails=0;const ok=(c,m)=>{if(!c){fails++;if(fails<=14)console.log('FAIL '+m)}};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
for(const seed of SEEDS){
  const E=loadEngine();E.newWorld(seed);const S=E.__get();E.chooseClub(S.seats[0]);S.agmOff=true;
  const stat={moves:[],squadMin:99,squadMax:0,admin:0,short:0,holes:0,newcomers:[]};let t0=Date.now();
  for(let s=1;s<=N;s++){
    if(S.phase==='choose')E.chooseClub(S.seats[0]);
    const mark=S.evn||0;E.advanceWeek();
    /* after the summer window closed: every squad is complete */
    for(const id in S.squads){const sq=S.squads[id];stat.squadMin=Math.min(stat.squadMin,sq.length);stat.squadMax=Math.max(stat.squadMax,sq.length);
      ok(sq.length>=18&&sq.length<=30,`seed ${seed} season ${s} ${id}: squad of ${sq.length} after the window`);
      for(const pos of ['GK','CB','FB','DM','CM','AM','W','ST']){const n=sq.filter(p=>p.pos===pos).length;if(n<(pos==='GK'?2:1)){stat.holes++;ok(false,`seed ${seed} season ${s} ${id}: no ${pos}`)}}}
    const ev=E.eventsSince(mark);const mv=ev.filter(e=>e.t==='Transfer'||e.t==='Signing');stat.moves.push(mv.length);
    while(!E.seasonOver())E.advanceWeek();
    const ids=Object.keys(S.clubs),all=Object.values(S.squads).flat();
    ok(new Set(all.map(p=>p.id)).size===all.length,`seed ${seed} season ${s}: duplicate player`);
    ok(!S.fa.some(p=>all.includes(p)),`seed ${seed} season ${s}: a free agent is also in a squad`);
    for(const p of all){if(![p.q,p.pa,p.wage,p.age].every(Number.isFinite)){ok(false,`seed ${seed} season ${s}: NaN on ${p.id}`);break}}
    for(const id of ids){const f=S.fin[id];let sum=f.start;for(const h of f.hist)for(const k in h.lines)sum+=h.lines[k];for(const k in f.season)sum+=f.season[k];
      ok(Number.isFinite(f.cash)&&Math.abs(sum-f.cash)<=.5,`seed ${seed} season ${s} ${id}: ledger`);
      if(S.squads[id].length<20-8)ok(false,`seed ${seed} ${id}: squad collapsed`);}
    for(const t of [0,1,2,3,4])ok(E.standings(t).length===16,`seed ${seed} season ${s}: division ${t} size`);
    E.closeSeason();
    stat.admin=ids.filter(i=>S.fin[i].adminCount).length;
  }
  const per=avg(stat.moves)/80;
  console.log(`seed ${seed}: ${N} seasons in ${((Date.now()-t0)/1000).toFixed(1)}s · squads ${stat.squadMin}–${stat.squadMax} · summer moves per club ${per.toFixed(2)} · position holes ${stat.holes}`);
}
console.log(fails?`slimline-test: ${fails} failed`:'slimline-test: all checks passed');process.exit(fails?1:0);
