// Package L2-5: major projects (land, a new stadium), history and records, signals.
const {loadEngine}=require('./load.js');
const N=+(process.argv[2]||12);
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
function world(seed){E.newWorld(seed);const S=E.__get();E.chooseClub('pell');S.agmOff=true;return E.serialize()}

// 1. buying land: an extra plot to build on
{E.deserialize(world(11000));const S=E.__get(),id=S.my,n=S.grounds[id].plots.length,cash=S.fin[id].cash;const r=E.cmd('BuyPlot',id,{});
 ok(r.ok&&S.grounds[id].plots.length===n+1&&S.fin[id].cash<cash,`a plot of land is bought (£${r.res}k)`);
 ok(E.projectCatalog(id).some(o=>o.key.startsWith(`plot:${n}:`)),'and can be built on');}

// 2. a new stadium: deposit, two seasons of building, then a bigger ground, bigger crowds and more debt
{const capA=[],capB=[],gateA=[],gateB=[],debtA=[],debtB=[];let opened=0;
 for(let k=0;k<N;k++){const snap=world(11100+k);
  const run=build=>{E.deserialize(snap);const S=E.__get(),id=S.my;if(build){E.cmd('TakeLoan',id,{amount:E.maxNewLoan(id),years:10});const r=E.cmd('StartStadium',id,{size:'standard'});if(!r.ok)console.log(r.err)}
    for(let s=0;s<3;s++)E.playSeason();while(!E.seasonOver())E.advanceWeek();
    if(build&&S.ev.some(e=>e.t==='StadiumOpened'&&e.c===id)||build&&S.grounds[id].projects.some(p=>p.key.startsWith('stadium:')&&p.phase==='done'))opened++;
    return{cap:E.groundSignals(id).capacity,gate:(S.fin[id].season.gate||0)+(S.fin[id].season.seasontix||0),debt:E.debt(id)}};
  const A=run(false),B=run(true);capA.push(A.cap);capB.push(B.cap);gateA.push(A.gate);gateB.push(B.gate);debtA.push(A.debt);debtB.push(B.debt)}
 console.log(`stadium after 3 seasons: capacity ${avg(capA).toFixed(0)} vs ${avg(capB).toFixed(0)} · season 4 ticket income £${avg(gateA).toFixed(0)}k vs £${avg(gateB).toFixed(0)}k · debt £${avg(debtA).toFixed(0)}k vs £${avg(debtB).toFixed(0)}k · opened in ${opened}/${N}`);
 ok(opened>=N*.8,'the new stadium opens within three seasons');ok(avg(capB)>avg(capA)*1.4,'with a much bigger capacity');ok(avg(gateB)>avg(gateA),'more ticket income');ok(avg(debtB)>avg(debtA),'and more debt to carry');}

// 3. the statute: no new stadium (and no sale of the old ground) without the members when confidence is low
{E.deserialize(world(11200));const S=E.__get(),id=S.my;S.clubs[id].statute=['Members approve any sale above £50k'];S.members[id].conf=40;
 ok(!E.cmd('StartStadium',id,{size:'compact'}).ok,'the statute blocks a new stadium when members would refuse');}

// 4. history and records: every season leaves a line, with the top scorer and the cup run; records are kept
{E.deserialize(world(11300));const S=E.__get(),id=S.my;for(let s=0;s<3;s++)E.playSeason();const h=S.clubs[id].hist;
 ok(h.length===3&&h.every(x=>'top' in x&&'cup' in x&&x.you),'each season is recorded with top scorer and cup run');
 const r=S.records[id];ok(r.bigWin&&r.crowd&&r.crowd.n>0,`records: biggest win ${r.bigWin.gf}-${r.bigWin.ga}, record crowd ${r.crowd.n}`);
 ok(S.hist.length===3&&S.hist.every(x=>x.tables[0].length===16&&x.cup),'the world archive keeps champions and cup winners');}

// 5. signals point at the screen where the chairman acts
{E.deserialize(world(11400));const S=E.__get(),id=S.my;S.members[id].conf=30;S.grounds[id].sides.N.cond=20;E.cmd('SackStaff',id,{role:'coach'});
 const sg=E.signals(id),has=a=>sg.some(x=>x.act===a.act&&(a.arg==null||x.arg===a.arg));
 ok(has({act:'tab',arg:'club'})&&has({act:'ov',arg:'ground'})&&has({act:'staff',arg:'coach'}),'signals cover low confidence, a failing stand and a caretaker coach');
 ok(sg[0].lv===3,'the most urgent signal comes first');}

console.log(fails?`${fails} check(s) failed`:'projects-test: all checks passed');process.exit(fails?1:0);
