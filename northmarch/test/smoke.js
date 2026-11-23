const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..'),paths=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const js=paths.map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('');
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
assert.equal(html.match(/<script>([\s\S]*?)<\/script>/)[1],js);
new vm.Script(js);
const g=vm.runInNewContext(js+';({newWorld,chooseClub,advanceWeek,closeSeason,getS:()=>S,SEASON_WEEKS,projectCatalog,cmd})');
g.newWorld(1804);g.chooseClub(g.getS().seats[0]);let orders=0;
for(let y=1;y<=20;y++){for(let w=0;w<g.SEASON_WEEKS;w++){if(y===1&&w===0){const id=g.getS().my,opt=g.projectCatalog(id).find(x=>x.key.includes(':scouting')&&!x.busy);if(opt){assert.equal(g.cmd('StartProject',id,{key:opt.key,offer:'standard'}).ok,true);orders++;}}g.advanceWeek()}assert.equal(g.getS().season,y);g.closeSeason();if(g.getS().phase==='choose')g.chooseClub(g.getS().seats[0])}
assert.equal(g.getS().season,21);console.log('PASS: 20 seasons; '+orders+' upgrades; no exceptions');
