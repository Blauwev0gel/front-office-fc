// Ported from Northmarch V19 (northmarch/test/smoke.js): 20 seasons through the real UI layers, with an upgrade ordered in season 1. Slow (about a minute): run by hand, not in the fast suite.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE_BASE,UI_BASE}=require('../build.js');
const root=path.resolve(__dirname,'..');
/* the default (L1/L2) game: engine and UI modules in the order of the build */
const js=ENGINE_BASE.concat(UI_BASE).map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
new vm.Script(js);
const g=vm.runInNewContext(js+';({newWorld,chooseClub,advanceWeek,closeSeason,getS:()=>S,SEASON_WEEKS,projectCatalog,cmd})');
g.newWorld(1804);g.chooseClub(g.getS().seats[0]);let orders=0;
for(let y=1;y<=20;y++){for(let w=0;w<g.SEASON_WEEKS;w++){if(y===1&&w===0){const id=g.getS().my,opt=g.projectCatalog(id).find(x=>x.key.includes(':scouting')&&!x.busy);if(opt){assert.equal(g.cmd('StartProject',id,{key:opt.key,offer:'standard'}).ok,true);orders++;}}g.advanceWeek()}assert.equal(g.getS().season,y);g.closeSeason();if(g.getS().phase==='choose')g.chooseClub(g.getS().seats[0])}
assert.equal(g.getS().season,21);console.log('PASS: 20 seasons; '+orders+' upgrades; no exceptions');
