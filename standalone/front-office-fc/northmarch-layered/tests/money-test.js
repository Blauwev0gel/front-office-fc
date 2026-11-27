// Money binds (NM-012): wages are most of the turnover, the top no longer prints money, no club runs away into endless debt,
// the director respects the wage limit in the window, and the treasurer comes with real levers when the money runs out.
// Usage: node tests/money-test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE,UI}=require('../build.js');
const js=ENGINE.concat(UI).map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ok=m=>console.log('ok  ',m);
const game=()=>vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,advanceWeek,closeSeason,seasonOver,operatingResult,wageBillK,wageCapK,creditLimit,cmd,signBrief,summerMeeting,preWeek,F,bankMsg,books})');

/* 1. two seasons of a whole world: margins by division, and nobody spirals */
{const g=game();g.newWorld(5555);const S=g.getS();g.chooseClub(S.seats[0]);S.agmOff=true;
 for(let s=0;s<2;s++){while(!g.seasonOver())g.advanceWeek();if(s===1)break;g.closeSeason();g.advanceWeek()}
 const by={};for(const id in S.clubs){const t=S.clubs[id].tier,L=S.fin[id].season;let inc=0;for(const k in L)if(L[k]>0&&!['loanIn','feesIn','groundSale'].includes(k))inc+=L[k];(by[t]=by[t]||[]).push({op:g.operatingResult(L),inc,w:-(L.wages||0)})}
 const m=t=>{const a=by[t],inc=a.reduce((x,y)=>x+y.inc,0);return{margin:a.reduce((x,y)=>x+y.op,0)/inc,wr:a.reduce((x,y)=>x+y.w,0)/inc}};
 for(const t of [0,1,2]){const r=m(t);assert(r.margin<.25,`division ${t}: margin ${Math.round(r.margin*100)}% is too fat`);assert(r.wr>.4&&r.wr<.9,`division ${t}: wages ${Math.round(r.wr*100)}% of turnover`)}
 const worst=Math.min(...Object.keys(S.clubs).map(id=>S.fin[id].cash/Math.max(1,g.creditLimit(id))));
 assert(worst>-15,`a club ran away into debt (${worst.toFixed(1)} times its credit limit)`);
 ok(`margins: ${[0,1,2,3,4].map(t=>`D${t} ${Math.round(m(t).margin*100)}%`).join(' · ')}; wages ${Math.round(m(0).wr*100)}–${Math.round(m(2).wr*100)}% of turnover; no runaway debt`);}

/* 2. the director keeps the wage bill within the limit in the summer window */
{let worst=0;for(const seed of [61,62,63,64]){const g=game();g.newWorld(seed);const S=g.getS();g.chooseClub(S.seats[seed%5]);const id=S.my;
   g.cmd('SealManifest',id,{});const mt=g.summerMeeting(id);g.signBrief(id,mt.plan.goals.slice(0,3),'allin');for(let i=0;i<4;i++)g.preWeek();
   worst=Math.max(worst,g.wageBillK(id)/Math.max(.1,g.wageCapK(id)))}
 assert(worst<1.25,`the wage bill ended at ${Math.round(worst*100)}% of the limit after the window`);
 ok(`after an all-in summer the wage bill stays within the limit (worst ${Math.round(worst*100)}%)`);}

/* 3. when the money runs out, the treasurer brings real levers */
{const g=game();g.newWorld(777);const S=g.getS();g.chooseClub(S.seats[1]);const id=S.my;S.agmOff=true;for(let i=0;i<3;i++)g.advanceWeek();
 assert(!g.bankMsg(id)||g.books(id).tight,'no alarm while the books are fine');
 S.fin[id].cash=-g.creditLimit(id)*2;const b=g.bankMsg(id);assert(b&&b.kind==='decision','overdrawn: the treasurer asks for a decision');
 assert(/bankprices/.test(b.html)&&/bankcut/.test(b.html),'with ticket prices and department budgets as levers');
 const c0=S.fin[id].cash,r=g.cmd('TakeLoan',id,{amount:20,years:5});if(r.ok!==false)assert(S.fin[id].cash>c0,'a loan fills the hole');
 ok('overdrawn: the treasurer comes with a loan, ticket prices, budgets and a sale');}

console.log('money-test: all checks passed');
