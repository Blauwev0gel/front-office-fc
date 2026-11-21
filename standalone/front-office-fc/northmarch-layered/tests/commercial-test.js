// Package L2-3: the season budget, sponsor deals and members' financing.
const {loadEngine}=require('./load.js');
const N=+(process.argv[2]||16);
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
function world(seed){E.newWorld(seed);const S=E.__get();E.chooseClub('pell');S.agmOff=true;return E.serialize()}
function run(snap,decide,seasons,end){E.deserialize(snap);const S=E.__get();decide(S,S.my);for(let s=0;s<seasons;s++){while(!E.seasonOver())E.advanceWeek();if(s<seasons-1)E.closeSeason()}return end(E.__get(),E.__get().my)}

// 1. a tighter wage budget: the director keeps a smaller wage bill, and the squad is weaker for it
{const a=[],b=[],qa=[],qb=[];for(let k=0;k<N;k++){const snap=world(9000+k);const end=(S,id)=>({bill:E.wageBillK(id),q:E.squadQuality(S.squads[id])});
  const A=run(snap,(S,id)=>E.cmd('SetSquadPolicy',id,{wageR:.88}),2,end),B=run(snap,(S,id)=>E.cmd('SetSquadPolicy',id,{wageR:.5}),2,end);a.push(A.bill);b.push(B.bill);qa.push(A.q);qb.push(B.q)}
 console.log(`wage budget 88% vs 50% of income: wage bill £${(avg(a)*1000).toFixed(0)} vs £${(avg(b)*1000).toFixed(0)} a week · squad quality ${avg(qa).toFixed(2)} vs ${avg(qb).toFixed(2)}`);
 ok(avg(b)<avg(a)*.85,'a tighter wage budget means a smaller wage bill');ok(avg(qb)<avg(qa),'and a weaker squad');}

// 2. the budget is a plan with a running comparison and warnings
{E.deserialize(world(9100));const S=E.__get(),id=S.my;for(let i=0;i<10;i++)E.advanceWeek();
 const rows=E.budgetRows(id);ok(S.fin[id].budget.s===S.season&&rows.length===6&&rows.every(r=>Number.isFinite(r.plan)&&Number.isFinite(r.proj)),'every club has a season budget with plan, so far and projection');
 for(const p of S.squads[id])p.wage*=1.9;E.advanceWeek();ok(E.budgetWarnings(id).some(w=>/wage bill/.test(w)),'running over the wage budget raises a warning');}

// 3. sponsors: a results-based deal pays more in a good season than in a bad one, a fixed deal pays the same
{const fx=[],bn=[],pts=[];for(let k=0;k<N;k++){const snap=world(9200+k);E.deserialize(snap);const S0=E.__get(),id=S0.my;S0.fin[id].sponsor=null;S0.fin[id].offers=E.sponsorOffers(id);const s1=E.serialize();
  const idx=kind=>E.__get().fin[id].offers.findIndex(o=>o.kind===kind);
  const end=(S,id)=>({sp:S.fin[id].season.sponsors||0,pts:S.tbl[id].pts});
  const A=run(s1,(S,id)=>E.cmd('SignSponsor',id,{i:idx('fixed')}),1,end),B=run(s1,(S,id)=>E.cmd('SignSponsor',id,{i:idx('bonus')}),1,end);fx.push(A.sp);bn.push(B.sp);pts.push(B.pts)}
 const ord=pts.map((p,i)=>i).sort((x,y)=>pts[x]-pts[y]),lo=ord.slice(0,N/2),hi=ord.slice(N/2);
 const gain=ix=>avg(ix.map(i=>bn[i]-fx[i]));
 console.log(`sponsor: fixed £${avg(fx).toFixed(1)}k vs results-based £${avg(bn).toFixed(1)}k · results-based minus fixed: weaker half of seasons £${gain(lo).toFixed(1)}k, stronger half £${gain(hi).toFixed(1)}k`);
 ok(gain(hi)>gain(lo)+2,'a results-based sponsor pays off in good seasons and costs in bad ones');}

// 4. members' bond: cheaper than the bank, sized by members and their confidence
{E.deserialize(world(9300));const S=E.__get(),id=S.my;S.members[id].conf=80;const hi=E.bondCap(id),rHi=E.bondRate(id);S.members[id].conf=25;const lo=E.bondCap(id);S.members[id].conf=70;
 ok(hi>lo*2,`confident members lend more (£${hi}k at confidence 80, £${lo}k at 25)`);ok(rHi<E.loanRate(id,hi),'a members\' bond is cheaper than a bank loan');
 const c0=S.fin[id].cash;const r=E.cmd('IssueBond',id,{amount:Math.min(30,E.bondCap(id))});ok(r.ok&&S.fin[id].cash>c0&&S.fin[id].loans.some(l=>/bond/.test(l.label)),'issuing a bond brings in cash and a repayment schedule');
 ok(!E.cmd('IssueBond',id,{amount:5}).ok,'one bond a season');}

// 5. appeals: money now, less each time, and members tire of them
{E.deserialize(world(9400));const S=E.__get(),id=S.my;const r1=E.cmd('Fundraise',id,{});E.playSeason();const conf=S.members[id].conf;const r2=E.cmd('Fundraise',id,{});
 ok(r1.ok&&r2.ok&&r2.res<r1.res*.7,`a second appeal raises less (£${r1.res}k, then £${r2.res}k)`);ok(S.members[id].conf<conf,'and costs confidence');}

// 6. selling the ground: a lump sum, rent for ever after, and the members do not forgive it; the statute can forbid it
{E.deserialize(world(9500));const S=E.__get(),id=S.my;S.clubs[id].statute=['No outside owner above 25%'];const conf=S.members[id].conf,cash=S.fin[id].cash;
 const r=E.cmd('SellGround',id,{});E.advanceWeek();
 ok(r.ok&&S.fin[id].cash>cash+50&&(S.fin[id].season.rent||0)<0,'the sale brings cash now and rent every week');ok(S.members[id].conf<conf-10,'and the members lose confidence');
 E.deserialize(world(9500));const S2=E.__get();S2.clubs[S2.my].statute=['Members approve any sale above £50k'];S2.members[S2.my].conf=45;
 ok(!E.cmd('SellGround',S2.my,{}).ok,'a statute that needs members\' approval blocks the sale when confidence is low');}

// 7. the statute on ticket prices
{E.deserialize(world(9600));const S=E.__get(),id=S.my;S.clubs[id].statute=['Ticket prices are set by the members'];let refused=false;for(let i=0;i<6;i++)if(!E.cmd('SetPrice',id,{kind:'terrace',delta:1}).ok)refused=true;
 ok(refused,'when the members set ticket prices, a board cannot raise them far above the usual');}

// 8. fixtures: home and away alternate (no long runs), each club plays everyone home and away
{E.deserialize(world(9700));const S=E.__get();let worst=0;for(const t of [0,1,2])for(const id of E.tierIds(t)){let run=0,prev='',hn=0;for(const rd of S.fx[t]){const m=rd.find(([h,a])=>h===id||a===id),c=m[0]===id?'H':'A';if(c==='H')hn++;run=c===prev?run+1:1;prev=c;worst=Math.max(worst,run)}if(hn!==15)worst=99}
 ok(worst<=3,`fixtures alternate home and away (longest run ${worst}), 15 home games each`);}
console.log(fails?`${fails} check(s) failed`:'commercial-test: all checks passed');process.exit(fails?1:0);
