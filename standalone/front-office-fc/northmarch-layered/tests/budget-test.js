// The budget meeting (MB-27): every summer the chairman divides the club's money into four pots, the four people ask for
// more than there is, and the pots bind the season: the director's spending, the wage limit, the building work, the AGM.
// Usage: node tests/budget-test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE,UI}=require('../build.js');
const js=ENGINE.concat(UI).map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ok=m=>console.log('ok  ',m);
const game=()=>vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,cmd,budOpen,budTotal,budSigned,budgetFor,budPlayersLeft,budBuildLeft,budReview,wageCapK,projectCatalog,summerMeeting,signBrief,preWeek,F,advanceWeek,seasonOver,budgetScreen:typeof budgetScreen!=="undefined"?budgetScreen:null})');

/* 1. scarcity: in every division the four people ask for more than there is */
{let tight=0,n=0;for(const seed of [21,22,23])for(let t=0;t<5;t++){const g=game();g.newWorld(seed);const S=g.getS();g.chooseClub(S.seats[t]);const B=g.budOpen(S.my);
   const asks=Object.values(B.asks).reduce((a,x)=>a+x.ask,0),money=g.budTotal()*B.unit;n++;if(asks>money)tight++;
   assert(g.budTotal()>=2&&g.budTotal()<=16,'between two and sixteen blocks');assert(Object.values(B.pots).every(v=>v>=0),'no negative pots')}
 assert(tight>=n*.8,`the asks exceed the money in most clubs (${tight}/${n})`);
 ok(`scarcity: the four people ask for more than there is in ${tight} of ${n} clubs`);}

/* 2. moving blocks, the loan and signing */
const g=game();g.newWorld(4242);const S=g.getS();g.chooseClub(S.seats[1]);const id=S.my;S.agmOff=true;
const B=g.budOpen(id),tot=g.budTotal();
while(B.pots.wages>0)g.cmd('BudgetMove',id,{pot:'wages',d:-1});while(B.pots.build>0)g.cmd('BudgetMove',id,{pot:'build',d:-1});
while(B.pots.bank>1)g.cmd('BudgetMove',id,{pot:'players',d:1});
assert.strictEqual(g.budTotal(),tot,'moving blocks keeps the total');
assert(g.cmd('BudgetMove',id,{pot:'wages',d:-1}).ok===false,'an empty pot cannot give');
const loan=g.cmd('BudgetLoan',id,{});if(loan.ok)assert.strictEqual(g.budTotal(),tot+3,'the loan adds three blocks');
assert(g.cmd('BudgetLoan',id,{}).ok===false,'one loan a summer');
const cap0=g.wageCapK(id);g.cmd('SignBudget',id,{});assert(g.budSigned(),'signed');
assert(g.cmd('BudgetMove',id,{pot:'players',d:1}).ok===false,'a signed budget is closed');
ok(`blocks move between pots and the bank; the loan adds three; signed is signed (${g.budTotal()} blocks of £${B.unit}k)`);

/* 3. the players pot binds the director */
const pot=S.bud.signedAt.players;assert.strictEqual(g.budgetFor(id),Math.min(pot,Math.round(S.fin[id].cash)),'the transfer budget is the players pot (as far as the cash goes)');
g.cmd('SealManifest',id,{});const mt=g.summerMeeting(id);g.signBrief(id,mt.plan.goals.slice(0,3),'allin');for(let i=0;i<4;i++)g.preWeek();
const P_=S.pre,spent=P_.deals.filter(d=>d.stage==='signed').reduce((a,d)=>a+d.fee,0),raised=P_.sold.reduce((a,s)=>a+s.fee,0);
assert(spent<=pot+raised+1,`the director spent £${spent}k with a pot of £${pot}k and £${raised}k raised`);
ok(`the director spends within the players pot (£${spent}k of £${pot}k + £${raised}k sales)`);

/* 4. no wages pot, no building pot: the limit and the builders say no */
assert(Math.abs(g.wageCapK(id)-cap0)<.01,'no wages pot: the wage limit is what the turnover carries');
const cheap=g.projectCatalog(id).filter(o=>!o.busy).sort((a,b)=>a.cost-b.cost)[0];
const r=g.cmd('StartProject',id,{key:cheap.key,offer:'standard'});assert(r.ok===false&&/building pot/.test(r.err),'an empty building pot blocks a project');
ok('without a wages or building pot the wage limit stays and no project starts');

/* 5. a second club: wages and building pots open doors */
{const h=game();h.newWorld(4243);const T=h.getS();h.chooseClub(T.seats[2]);const j=T.my,C=h.budOpen(j);
 while(C.pots.players>0)h.cmd('BudgetMove',j,{pot:'players',d:-1});while(C.pots.bank>0){h.cmd('BudgetMove',j,{pot:'build',d:1});if(C.pots.bank>0)h.cmd('BudgetMove',j,{pot:'wages',d:1})}
 const c0=h.wageCapK(j);h.cmd('SignBudget',j,{});assert(h.wageCapK(j)>c0,'a wages pot lifts the wage limit');
 const o=h.projectCatalog(j).filter(x=>!x.busy&&x.cost<=h.budBuildLeft(j)).sort((a,b)=>a.cost-b.cost)[0];
 if(o){const left=h.budBuildLeft(j);assert(h.cmd('StartProject',j,{key:o.key,offer:'standard'}).ok,'a project within the pot starts');assert(h.budBuildLeft(j)<left,'and is taken from the pot')}
 ok(`a wages pot lifts the wage limit (£${c0.toFixed(1)}k → £${h.wageCapK(j).toFixed(1)}k a week); a project comes out of the building pot`);}

/* 6. the AGM: every pot is answered for */
while(!g.seasonOver())g.advanceWeek();
const rv=g.budReview(id);assert(rv&&rv.length===4&&rv.every(x=>x.t&&x.pot!=null),'four lines in the annual report');
ok('the annual report answers for every pot: '+rv.map(x=>`${x.n} £${x.pot}k`).join(', '));
console.log('budget-test: all checks passed');
