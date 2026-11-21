// Package L2-4: morale, cards and bans, fatigue, playing time and loans, contract demands, transfer requests, reputation.
const {loadEngine}=require('./load.js');
const N=+(process.argv[2]||24);
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
function world(seed){E.newWorld(seed);const S=E.__get();E.chooseClub('pell');S.agmOff=true;return E.serialize()}

// 1. morale: a squad that is down plays worse than one that is flying
{const a=[],b=[];let wins=0;for(let k=0;k<N;k++){const snap=world(10000+k);
  const pts=m=>{E.deserialize(snap);const S=E.__get();for(const p of S.squads[S.my])p.morale=m;for(let i=0;i<8;i++)E.advanceWeek();return S.tbl[S.my].pts};
  const A=pts(20),B=pts(90);a.push(A);b.push(B);if(B>A)wins++}
 console.log(`morale: points after 8 weeks, unhappy squad ${avg(a).toFixed(1)} vs flying squad ${avg(b).toFixed(1)} · better in ${wins}/${N}`);
 ok(avg(b)>avg(a)+.8,'morale changes results');}

// 2. bans: a suspended player does not play, and serves his ban
{E.deserialize(world(10100));const S=E.__get(),id=S.my;const star=E.pickXI(S.squads[id])[3].p;star.susp=2;
 const ev=E.advanceWeek();const m=S.matches.find(x=>x.h===id||x.a===id);const xi=m.h===id?m.xiH:m.xiA;
 ok(!xi.includes(star.id)&&star.susp===1,'a banned player sits out and his ban counts down');
 let bans=0;for(let s=0;s<2;s++){while(!E.seasonOver()){const e=E.advanceWeek();bans+=e.filter(x=>x.t==='Suspended').length}E.closeSeason()}
 ok(bans>=2,`the club picks up bans over two seasons (${bans})`);}

// 3. fatigue: in a cup week the cup side is rotated
{E.deserialize(world(10200));const S=E.__get();let ov=[];while(S.cup.round<4&&!E.seasonOver()){E.advanceWeek();const cup=S.matches.filter(m=>m.comp==='cup');
  for(const c of cup)for(const [side,club] of [['h',c.h],['a',c.a]]){const lg=S.matches.find(m=>m.comp==='league'&&(m.h===club||m.a===club));if(!lg)continue;const lx=lg.h===club?lg.xiH:lg.xiA,cx=side==='h'?c.xiH:c.xiA;ov.push(cx.filter(x=>lx.includes(x)).length)}}
 console.log(`fatigue: players who start both games in a cup week: ${avg(ov).toFixed(1)} of 11`);ok(avg(ov)<10,'clubs rotate in cup weeks');}

// 4. playing time and loans: the same young reserves, loaned out or kept on the bench
{const L=[],O=[],aL=[],aO=[];for(let k=0;k<N/2;k++){E.deserialize(world(10300+k));const snap=E.serialize();const res={};
  for(const loans of [true,false]){E.deserialize(snap);const S=E.__get(),id=S.my;E.cmd('SetSquadPolicy',id,{loans});while(!E.seasonOver())E.advanceWeek();const q0={};for(const p of S.squads[id])q0[p.id]=p.q;E.closeSeason();
    const loaned=Object.values(S.squads).flat().filter(p=>p.loan&&p.loan.from===id&&q0[p.id]!=null).map(p=>p.id);while(!E.seasonOver())E.advanceWeek();
    res[loans]={loaned,now:Object.fromEntries(Object.values(S.squads).flat().map(p=>[p.id,p])),q0}}
  for(const pid of res[true].loaned){const a=res[true].now[pid],b=res[false].now[pid];if(!a||!b)continue;L.push(a.q-res[true].q0[pid]);O.push(b.q-res[false].q0[pid]);aL.push(a.sApps);aO.push(b.sApps)}}
 console.log(`loans: ${L.length} young reserves · on loan ${avg(aL).toFixed(1)} apps, growth +${avg(L).toFixed(2)} · kept ${avg(aO).toFixed(1)} apps, growth +${avg(O).toFixed(2)}`);
 ok(L.length>=8&&avg(aL)>avg(aO)*2,'loaned reserves play far more');ok(avg(L)>avg(O)+.05,'and grow faster, even with a smaller club\'s training');}

// 5. contract demands: with no room in the wage limit, players refuse new terms and leave in the summer
{E.deserialize(world(10400));const S=E.__get(),id=S.my;while(S.week<23)E.advanceWeek();E.cmd('SetSquadPolicy',id,{wageR:.4});
 for(const p of S.squads[id])if(p.q>10)p.contract=1;let refused=[];while(!E.seasonOver()){refused.push(...E.advanceWeek().filter(e=>e.t==='RefusedContract'))}
 const leavers=refused.map(e=>e.pid);E.closeSeason();
 ok(refused.length>=2,`players turn down contracts the wage limit cannot pay (${refused.length})`);
 ok(leavers.every(pid=>!S.squads[id].some(p=>p.id===pid)),'and they leave in the summer');}

// 6. transfer requests: a player who is unhappy for weeks asks to leave and is sold in the window
{E.deserialize(world(10500));const S=E.__get(),id=S.my;const p=S.squads[id].slice().sort((a,b)=>a.q-b.q)[8];
 let asked=false;for(let w=0;w<6;w++){p.morale=5;const ev=E.advanceWeek();if(ev.some(e=>e.t==='WantsOut'&&e.pid===p.id))asked=true}
 ok(asked&&p.wantsOut,'an unhappy player asks to leave');
 while(!E.seasonOver())E.advanceWeek();E.closeSeason();ok(!S.squads[id].includes(p),'and is sold or leaves by the summer');}

// 7. reputation follows success and division, and sponsors pay for it
{E.deserialize(world(10600));const S=E.__get();for(let s=0;s<4;s++)E.playSeason();
 const r=t=>avg(E.tierIds(t).map(i=>S.clubs[i].rep));console.log(`reputation by division: ${r(0).toFixed(0)} / ${r(1).toFixed(0)} / ${r(2).toFixed(0)}`);
 ok(r(0)>r(1)&&r(1)>r(2),'bigger divisions carry bigger reputations');
 const id=S.my,base=E.sponsorBase(id);S.clubs[id].rep+=30;ok(E.sponsorBase(id)>base*1.05,'a bigger name earns bigger sponsor offers');}

console.log(fails?`${fails} check(s) failed`:'life-test: all checks passed');process.exit(fails?1:0);
