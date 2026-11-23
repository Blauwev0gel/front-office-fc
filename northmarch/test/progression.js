// Northmarch Layer-1 balance audit. Local execution only; no CI workflow.
// Usage: node northmarch/test/progression.js /tmp/balance.json [control|sporting|commercial|youth|all] [seed-count]
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const files=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const code=files.map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
const g=vm.runInNewContext(code+';({newWorld,chooseClub,advanceWeek,closeSeason,getS:()=>S,SEASON_WEEKS,projectCatalog,cmd,groundSignals,teamStrength,F,CL,G,academyYield,debt,operatingResult})');
const strategies={control:[],sporting:['training','medical'],commercial:['commercial','clubhouse'],youth:['academy','scouting']};
const wanted=process.argv[3]||'all',seedCount=Math.min(30,Math.max(1,Number(process.argv[4]||5)));
if(wanted!=='all'&&!strategies[wanted])throw Error('Unknown strategy '+wanted);
function category(o,plots){
 const m=o.key.match(/^plot:(\d+):(.+)$/);
 if(!m)return null;
 const kind=plots[Number(m[1])]?.kind;
 return m[2]==='up'?kind:(kind==null?m[2]:null);
}
function chooseProject(id,focus){
 const plots=g.G(id).plots;
 return g.projectCatalog(id).find(o=>!o.busy&&focus.includes(category(o,plots)))||null;
}
function run(seed,strategy){
 g.newWorld(seed);g.chooseClub(g.getS().seats[0]);
 const firstClub=g.getS().my,annual=[],orders=[];
 let previousClub=firstClub;
 for(let season=1;season<=10;season++){
  if(g.getS().phase==='choose')g.chooseClub(g.getS().seats[0]);
  const id=g.getS().my;if(!id)throw Error('No club at season '+season);
  const f0=g.F(id),cash0=f0.cash,sg0=g.groundSignals(id),quality0=g.teamStrength(id);
  const focus=strategies[strategy],candidate=focus.length?chooseProject(id,focus):null;
  if(candidate){
   const r=g.cmd('StartProject',id,{key:candidate.key,offer:'standard'});
   orders.push({season,club:id,key:candidate.key,kind:category(candidate,g.G(id).plots),quotedCostK:candidate.cost,accepted:!!r?.ok,reason:r?.error||r?.reason||(!r?.ok?'Command rejected':null)});
  }
  for(let w=0;w<g.SEASON_WEEKS;w++)g.advanceWeek();
  const f=g.F(id),c=g.CL(id),sg=g.groundSignals(id),lines=f.season||{},y=g.academyYield(5);
  const completed=g.G(id).projects.filter(p=>p.phase==='done').length;
  annual.push({season,club:id,clubChanged:id!==previousClub,tier:c.tier,position:g.getS().tbl[id]?.pos??null,cashStartK:cash0,cashEndK:f.cash,deltaCashK:+(f.cash-cash0).toFixed(2),debtK:g.debt(id),operatingK:g.operatingResult(lines),buildSpendK:-(lines.build||0),wagesK:-(lines.wages||0),squadStart:quality0,squadEnd:g.teamStrength(id),trainingStart:sg0.training,trainingEnd:sg.training,academy:sg.academy,scouting:sg.scouting,shop:sg.shop,capacity:sg.capacity,academyGraduates5y:y.n,academyRegulars5y:y.regulars,academyFees5y:y.fees,completedProjects:completed});
  previousClub=id;g.closeSeason();
 }
 return {seed,strategy,firstClub,orders,annual,final:annual.at(-1)};
}
const seeds=Array.from({length:seedCount},(_,i)=>1804+i),runs=[];
for(const strategy of Object.keys(strategies)){
 if(wanted!=='all'&&wanted!==strategy)continue;
 for(const seed of seeds){const r=run(seed,strategy);runs.push(r);console.log(strategy,seed,'cash',r.final.cashEndK,'squad',r.final.squadEnd,'orders',r.orders.filter(o=>o.accepted).length);}
}
const summary=Object.keys(strategies).filter(s=>wanted==='all'||s===wanted).map(strategy=>{
 const r=runs.filter(x=>x.strategy===strategy),avg=k=>+(r.reduce((a,x)=>a+x.final[k],0)/r.length).toFixed(2);
 return {strategy,seeds:r.length,accepted:r.reduce((a,x)=>a+x.orders.filter(o=>o.accepted).length,0),rejected:r.reduce((a,x)=>a+x.orders.filter(o=>!o.accepted).length,0),cashK:avg('cashEndK'),squad:avg('squadEnd'),training:avg('trainingEnd'),academy:avg('academy'),scouting:avg('scouting'),youthRegulars5y:avg('academyRegulars5y')};
});
console.table(summary);
const output={source:'northmarch modular manifest',seasons:10,seeds,summary,runs,limitations:['Paired seeds do not guarantee identical random draws after different decisions','One attempted investment per season is not an optimized strategy','Season-level club changes must be inspected','This is a model balance diagnostic, not a causal estimate']};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(output,null,2));
