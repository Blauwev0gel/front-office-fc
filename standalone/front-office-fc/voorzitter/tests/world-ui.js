const {chromium}=require('playwright');const path=require('path');
(async()=>{
 const f='file://'+path.resolve(__dirname,'../northmarch.html');const errs=[];
 for(const [scheme,pick] of [['light',0],['dark',1]]){
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},colorScheme:scheme});
  p.on('pageerror',e=>errs.push(scheme+': '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console '+m.text())});
  await p.goto(f);await p.click('[data-act=new]');
  let steps=0,shotSeats=false,shotScene=false,agms=0,maxW=0;
  while(steps<600){steps++;
   const w=await p.evaluate(()=>document.documentElement.scrollWidth);maxW=Math.max(maxW,w);
   const acts=await p.$$eval('main [data-act]',els=>els.map(e=>e.dataset.act+'|'+(e.dataset.arg||'')));
   const has=a=>acts.find(x=>x.startsWith(a+'|'));
   if(pick===0&&!shotSeats&&has('seat')){await p.screenshot({path:path.join(__dirname,'w-seats.png'),fullPage:true});shotSeats=true}
   if(pick===0&&!shotScene&&has('card')&&await p.$('.hit')){await p.screenshot({path:path.join(__dirname,'w-scene.png'),fullPage:true});shotScene=true}
   if(has('toEnd')){await p.waitForTimeout(3700);await p.click('main [data-act=toEnd]');continue}
   if(has('nextSeason')){agms++;if(agms>=2)break}
   let a=null;
   for(const k of ['toSeats','seat','electCard','pick','electNext','echoNext','place','listen','card','hire','reviewNext','blockNext','alvLobby','lobbyDone','defend','nextSeason','summerNext']){const m=acts.filter(x=>x.startsWith(k+'|'));if(m.length){a=m[Math.min(pick,m.length-1)];break}}
   if(!a){errs.push('stuck '+acts.join(','));break}
   const [act,arg]=a.split('|');await p.click(`main [data-act="${act}"]${arg?`[data-arg="${arg}"]`:''}`);
  }
  await p.click('[data-act=ov][data-arg=region]');await p.click('[data-act=tab][data-arg=people]');
  if(pick===0)await p.screenshot({path:path.join(__dirname,'w-region.png'),fullPage:false});
  const st=await p.evaluate(()=>({season:S.season,my:S.my,screen:S.screen,history:S.history.map(h=>h.txt)}));
  console.log(scheme,'steps',steps,'agms',agms,'maxWidth',maxW,JSON.stringify(st));
  await b.close();
 }
 console.log('ERRORS',JSON.stringify(errs));
})();
