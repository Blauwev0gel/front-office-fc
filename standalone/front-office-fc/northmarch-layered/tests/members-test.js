// Package L2-1: members, dues, confidence, season targets and the AGM (decisions D6, D7).
const {loadEngine}=require('./load.js');
const N=+(process.argv[2]||16);
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
function world(seed){E.newWorld(seed);E.chooseClub('pell');return E.serialize()}
function season(snap,decide){E.deserialize(snap);const S=E.__get(),id=S.my;decide(S,id);while(!E.seasonOver())E.advanceWeek();
  const m=S.members[id];return{conf:m.conf,count:m.count,dues:S.fin[id].season.dues||0}}

// 1. ticket prices far above the norm cost confidence
{const a=[],b=[];for(let k=0;k<N;k++){const snap=world(7000+k);
  a.push(season(snap,()=>{}).conf);b.push(season(snap,(S,id)=>{for(let i=0;i<5;i++){E.cmd('SetPrice',id,{kind:'terrace',delta:1});E.cmd('SetPrice',id,{kind:'seated',delta:1})}}).conf)}
 console.log(`prices: confidence after 30 weeks A ${avg(a).toFixed(1)} vs B (+£5) ${avg(b).toFixed(1)}`);
 ok(avg(b)<avg(a)-4,'members lose confidence when tickets cost far more than the norm');}

// 2. higher dues: more money per member, fewer members, less confidence
{const a=[],b=[];for(let k=0;k<N;k++){const snap=world(7100+k);a.push(season(snap,()=>{}));b.push(season(snap,(S,id)=>{for(let i=0;i<5;i++)E.cmd('SetDues',id,{delta:1})}))}
 console.log(`dues: members A ${avg(a.map(x=>x.count)).toFixed(0)} vs B ${avg(b.map(x=>x.count)).toFixed(0)} · dues income A £${avg(a.map(x=>x.dues)).toFixed(1)}k vs B £${avg(b.map(x=>x.dues)).toFixed(1)}k · confidence A ${avg(a.map(x=>x.conf)).toFixed(1)} vs B ${avg(b.map(x=>x.conf)).toFixed(1)}`);
 ok(avg(b.map(x=>x.count))<avg(a.map(x=>x.count)),'higher dues mean fewer members');
 ok(avg(b.map(x=>x.dues))>avg(a.map(x=>x.dues)),'but more dues income this season');
 ok(avg(b.map(x=>x.conf))<avg(a.map(x=>x.conf)),'and less confidence');}

// 3. every club has three season targets, judged at the AGM; every club holds an AGM
{E.deserialize(world(7200));const S=E.__get();
 ok(Object.values(S.members).every(m=>m.goals.length===3&&m.goals.every(g=>g.text)),'every club starts the season with three targets');
 while(!E.seasonOver())E.advanceWeek();const h=E.closeSeason();
 ok(Object.values(S.members).every(m=>m.agm&&m.agm.for+m.agm.against===100),'every club holds an AGM after week 30');
 ok(h.agm&&h.agm.club==='pell'&&Array.isArray(h.agm.reasons),'the season history keeps the player\'s AGM with its reasons');
 ok(Object.values(S.members).every(m=>m.goalsSeason===S.season),'new targets are set for the new season');}

// 4. voted out: the player chooses one of three open chairs; the old club plays on without him
{E.deserialize(world(7300));const S=E.__get(),old=S.my;
 for(let i=0;i<29;i++)E.advanceWeek();S.members[old].conf=3;E.advanceWeek();
 const chairBefore=S.clubs[old].cast.chair;E.closeSeason();
 ok(S.phase==='choose'&&S.my===null,'a lost vote ends the chairmanship');
 ok(S.seats.length===3&&!S.seats.includes(old)&&new Set(S.seats.map(i=>S.clubs[i].tier)).size===3,'three open chairs, one per division, not the old club');
 ok(S.career[0].club===old&&/Voted out/.test(S.career[0].why),'the career records why it ended');
 E.chooseClub(S.seats[1]);ok(S.phase==='season'&&S.career.length===2,'the player takes a new chair in the same world');
 let err=null;try{while(!E.seasonOver())E.advanceWeek();E.closeSeason()}catch(e){err=e.message}
 ok(!err&&S.clubs[old].hist.length===2,'the old club plays on under a computer board '+(err||''));}

// 5. computer chairmen who lose the vote are replaced by someone with their own values
{E.deserialize(world(7400));const S=E.__get();let replaced=0,seen=0;
 for(let s=0;s<4;s++){const before=Object.fromEntries(Object.keys(S.clubs).map(i=>[i,S.clubs[i].cast.chair]));const h=E.playSeason();
   for(const id of h.chairsOut){seen++;if(S.clubs[id].cast.chair!==before[id])replaced++}}
 console.log(`computer chairmen voted out in 4 seasons: ${seen}`);
 ok(seen>0&&replaced===seen,'a computer chairman who loses the vote is replaced');}

console.log(fails?`${fails} check(s) failed`:'members-test: all checks passed');process.exit(fails?1:0);
