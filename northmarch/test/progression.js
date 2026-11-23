// Northmarch progression experiment. Local only: node northmarch/test/progression.js
// No GitHub Actions workflow is added or triggered by this file.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const paths=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const js=paths.map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
const g=vm.runInNewContext(js+';({newWorld,chooseClub,advanceWeek,closeSeason,getS:()=>S,SEASON_WEEKS,projectCatalog,cmd,groundSignals,teamStrength,F,CL,G})');
const strategies={
  control:[],
  sporting:['training','medical'],
  commercial:['commercial','clubhouse'],
  youth:['academy','scouting']
};
const seeds=[1804,1805,1806,1807,1808];
function run(seed,strategy){
 g.newWorld(seed);g.chooseClub(g.getS().seats[0]);
 let investments=0,attempts=0,denied=0;const annual=[];
 for(let season=0;season<20;season++){
  if(g.getS().phase==='choose')g.chooseClub(g.getS().seats[0]);
  const id=g.getS().my;
  if(!id)throw Error('No playable club in season '+season);
  if(strategy.length){
   const options=g.projectCatalog(id);
   // One strategic investment per season, never bypass command validation.
   // Existing projects can run for multiple weeks; prices and permits are simulated.
   const plots=g.G(id).plots;
   const candidate=options.find(o=>{if(o.busy)return false;const match=o.key.match(/^plot:(\\d+):/);if(!match)return false;const kind=plots[+match[1]]?.kind;return strategy.some(k=>kind===k||(kind==null&&o.key.endsWith(':'+k)));});
   if(candidate){
    attempts++;
    const result=g.cmd('StartProject',id,{key:candidate.key,offer:'standard'});
    if(result&&result.ok)investments++;else denied++;
   }
  }
  for(let week=0;week<g.SEASON_WEEKS;week++)g.advanceWeek();
  const c=g.CL(id),f=g.F(id),sg=g.groundSignals(id);
  annual.push({season:season+1,tier:c.tier,cash:f.cash,squad:g.teamStrength(id),training:sg.training,academy:sg.academy,scouting:sg.scouting,capacity:sg.capacity,projects:g.G(id).projects.length});
  g.closeSeason();
 }
 const last=annual[annual.length-1];
 return {seed,strategy:strategy.join('+')||'control',investments,attempts,denied,final:last,annual};
}
const output=[];
const wanted=process.argv[3]||'all';
for(const [name,focus] of Object.entries(strategies)){
 if(wanted!=='all'&&wanted!==name)continue;
 for(const seed of seeds)output.push({...run(seed,focus),strategy:name});
}
const summary=Object.keys(strategies).filter(name=>wanted==='all'||wanted===name).map(name=>{
 const runs=output.filter(x=>x.strategy===name),avg=k=>+(runs.reduce((a,x)=>a+x.final[k],0)/runs.length).toFixed(2);
 return {strategy:name,seeds:runs.length,investments:runs.reduce((a,x)=>a+x.investments,0),denied:runs.reduce((a,x)=>a+x.denied,0),avgTier:avg('tier'),avgCashK:avg('cash'),avgSquad:avg('squad'),avgTraining:avg('training'),avgAcademy:avg('academy'),avgScouting:avg('scouting'),avgCapacity:avg('capacity')};
});
console.table(summary);
const outfile=process.argv[2];
if(outfile)fs.writeFileSync(outfile,JSON.stringify({summary,runs:output},null,2));
console.log('20 seasons x 5 seeds x 4 strategies completed; results are descriptive, not a controlled causal estimate.');
