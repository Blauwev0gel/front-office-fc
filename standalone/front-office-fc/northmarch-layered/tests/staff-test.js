// Package L2-2: head coach and director of football. Same seed, one different appointment, then measure.
const {loadEngine}=require('./load.js');
const N=+(process.argv[2]||20);
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
function world(seed){E.newWorld(seed);const S=E.__get();E.chooseClub('pell');S.agmOff=true;return E.serialize()}
/* put one known candidate in the free pool (the same in both branches), then let B appoint him */
function withCandidate(snap,role,q,spec){E.deserialize(snap);const S=E.__get();const pid=E.mkPerson(role,null,{age:45});E.giveProfile(pid,role,0,{q,spec,contract:0});S.staffPool.push(pid);
  const own=S.P[S.clubs[S.my].cast[role]].pro;own.q=7;own.spec=role==='coach'?'results':'eye';return{snap:E.serialize(),pid}}
function run(snap,decide,seasons,measure){E.deserialize(snap);const S=E.__get();decide(S,S.my);const m0=measure.start?measure.start(S,S.my):null;
  for(let s=0;s<seasons;s++){while(!E.seasonOver())E.advanceWeek();if(s<seasons-1)E.closeSeason()}return measure.end(E.__get(),E.__get().my,m0)}

// 1. a strong results coach against a weak one: more points
{const a=[],b=[];let wins=0;const NC=Math.max(N,32);for(let k=0;k<NC;k++){const {snap,pid}=withCandidate(world(8000+k),'coach',16,'results');
  const m={end:(S,id)=>S.tbl[id].pts};const A=run(snap,()=>{},1,m),B=run(snap,(S,id)=>{const r=E.cmd('HireStaff',id,{role:'coach',pid});if(!r.ok)console.log(r.err)},1,m);a.push(A);b.push(B);if(B>A)wins++}
 console.log(`coach (results, 16 vs 7): points A ${avg(a).toFixed(1)} vs B ${avg(b).toFixed(1)} · B more in ${wins}/${NC}`);
 ok(avg(b)>avg(a)+3&&wins>=NC*.6,'a better head coach wins more points');}

// 2. a development coach: young players grow faster
{const a=[],b=[];for(let k=0;k<N;k++){const {snap,pid}=withCandidate(world(8100+k),'coach',15,'development');
  const m={end:(S,id)=>{const ys=S.squads[id].filter(p=>p.age<=23);return S.stats[id].youthGrowth/Math.max(1,ys.length)}};
  a.push(run(snap,()=>{},1,m));b.push(run(snap,(S,id)=>E.cmd('HireStaff',id,{role:'coach',pid}),1,m))}
 console.log(`coach (development, 15 vs 7): growth per young player A +${avg(a).toFixed(2)} vs B +${avg(b).toFixed(2)}`);
 ok(avg(b)>avg(a)*1.15,'a development coach makes young players grow faster');}

// 3. a sharp director against a poor one: fewer signings that turn out weaker than he thought, less paid
{const ra=[],rb=[],fa=[],fb=[];for(let k=0;k<N;k++){const {snap,pid}=withCandidate(world(8200+k),'td',16,'eye');
  const m={end:(S,id)=>{const st=S.stats[id];return{mis:(st.misbuys||0)/Math.max(1,st.buys||0),fees:st.spent||0}}};
  const A=run(snap,()=>{},3,m),B=run(snap,(S,id)=>E.cmd('HireStaff',id,{role:'td',pid}),3,m);ra.push(A.mis);rb.push(B.mis);fa.push(A.fees);fb.push(B.fees)}
 console.log(`director (eye, 16 vs 7): signings weaker than judged A ${(avg(ra)*100).toFixed(0)}% vs B ${(avg(rb)*100).toFixed(0)}% · fees on those signings A £${avg(fa).toFixed(0)}k vs B £${avg(fb).toFixed(0)}k`);
 ok(avg(rb)<avg(ra)*.7,'a sharp director makes fewer misjudged signings');}

// 4. sacking: a settlement is paid, a caretaker steps in, the man goes to the pool; renewing extends the contract
{E.deserialize(world(8300));const S=E.__get(),id=S.my,old=S.clubs[id].cast.coach,cash=S.fin[id].cash;S.P[old].pro.contract=2;
 const r=E.cmd('SackStaff',id,{role:'coach'});const now=S.P[S.clubs[id].cast.coach];
 ok(r.ok&&now.pro.caretaker&&S.staffPool.includes(old)&&S.fin[id].cash<cash,'sacking pays a settlement, a caretaker takes over and the coach becomes free');
 ok(!E.cmd('SackStaff',id,{role:'coach'}).ok,'a caretaker cannot be sacked: you appoint someone');
 const td=S.P[S.clubs[id].cast.td];td.pro.contract=1;const w=td.pro.wage;E.cmd('RenewStaff',id,{role:'td'});ok(td.pro.contract===2&&td.pro.wage>w,'renewing extends the contract for a higher wage');}

// 5. an expiring contract that is not renewed: he leaves in the summer
{E.deserialize(world(8400));const S=E.__get(),id=S.my,c=S.P[S.clubs[id].cast.coach];c.pro.contract=1;E.playSeason();
 ok(S.P[S.clubs[id].cast.coach].pro.caretaker&&S.staffPool.includes(c.id),'a coach whose contract runs out leaves; a caretaker steps in');}

// 6. ambition: a coach far above the division will not come
{E.deserialize(world(8600));const S=E.__get(),id=S.my,pid=E.mkPerson('coach',null,{age:50});E.giveProfile(pid,'coach',0,{q:19,contract:0});S.staffPool.push(pid);
 ok(!E.staffCandidates(id,'coach').some(c=>c.pid===pid)&&!E.cmd('HireStaff',id,{role:'coach',pid}).ok,'an elite coach does not join a club in Northmarch One');}

// 7. the world: computer clubs sack coaches and hire from the pool and from each other
{E.deserialize(world(8500));const S=E.__get();let sacked=0,hired=0,poached=0;
 for(let s=0;s<6;s++){let mark=S.evn;while(!E.seasonOver()){const ev=E.advanceWeek();sacked+=ev.filter(e=>e.t==='StaffSacked').length;hired+=ev.filter(e=>e.t==='StaffHired').length;poached+=ev.filter(e=>e.t==='StaffPoached').length}
   mark=S.evn;E.closeSeason();const ev=E.eventsSince(mark);sacked+=ev.filter(e=>e.t==='StaffSacked').length;hired+=ev.filter(e=>e.t==='StaffHired').length;poached+=ev.filter(e=>e.t==='StaffPoached').length}
 console.log(`six seasons: ${sacked} sackings, ${hired} appointments, ${poached} poached from other clubs`);
 ok(sacked>=6&&hired>=sacked*.6,'coaches are sacked and replaced across the world');}

console.log(fails?`${fails} check(s) failed`:'staff-test: all checks passed');process.exit(fails?1:0);
