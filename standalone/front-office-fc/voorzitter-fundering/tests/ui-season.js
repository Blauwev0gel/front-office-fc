// Playwright: een volledig seizoen in licht en donker op 390 px, met screenshots. Gebruik: node build.js && node tests/ui-season.js
const {chromium}=require('playwright');const path=require('path');
(async()=>{
 const f='file://'+path.resolve(__dirname,'../dist/index.html');const errs=[];const shots=path.join(__dirname,'shots');require('fs').mkdirSync(shots,{recursive:true});
 for(const [scheme,pick] of [['light',0],['dark',1]]){
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},colorScheme:scheme});
  p.on('pageerror',e=>errs.push(scheme+': '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console '+m.text())});
  await p.goto(f);await p.click('[data-act=new]');
  let steps=0,maxW=0,done=false;const shot={};
  while(steps<900&&!done){steps++;
   {const sw=await p.evaluate(()=>[document.documentElement.scrollWidth,S.screen+(S.cf&&S.cf.sum?':'+S.cf.sum.step:''),UI.t]);if(sw[0]>390&&!shot['w'+sw[1]]){shot['w'+sw[1]]=1;console.log('wide',sw.join(' '))}maxW=Math.max(maxW,sw[0])}
   const acts=await p.$$eval('main [data-act]',els=>els.map(e=>e.dataset.act+'|'+(e.dataset.arg||'')));const has=a=>acts.find(x=>x.startsWith(a+'|'));
   if(pick===0){
     if(!shot.meeting&&has('mchoose')){await p.screenshot({path:path.join(shots,'meeting.png'),fullPage:true});shot.meeting=1}
     if(!shot.voices&&has('meetNext')&&!has('mchoose')&&!shot.meeting){await p.screenshot({path:path.join(shots,'voices.png'),fullPage:true});shot.voices=1}
     if(!shot.feed&&has('react')){await p.screenshot({path:path.join(shots,'feed.png'),fullPage:true});shot.feed=1}
     if(!shot.week&&has('play')&&has('sit')){await p.screenshot({path:path.join(shots,'week.png'),fullPage:true});shot.week=1;
       await p.click('[data-act=ov][data-arg=squad]');await p.screenshot({path:path.join(shots,'squad.png'),fullPage:false});await p.click('.overlay [data-act=player]');await p.screenshot({path:path.join(shots,'player.png'),fullPage:false});await p.click('.overlay [data-act=ov]')}
     if(!shot.sit&&has('card')&&has('back')){await p.screenshot({path:path.join(shots,'situation.png'),fullPage:true});shot.sit=1}
     if(!shot.result&&has('next')){await p.screenshot({path:path.join(shots,'result.png'),fullPage:true});shot.result=1}
   }
   if(has('toEnd')){await p.waitForTimeout(3800);await p.click('main [data-act=toEnd]');continue}
   if(has('nextSeason')){done=true;break}
   let a=null;
   for(const k of ['call','seat','sign','toEnvelope','openEnv','toSeats','arrive','crisisDone','crisis','pick','tdhire','react','meetNext','mchoose','mdone','sumNext','windowDone','sit','card','play','next','hire','alvLobby','lobbyDone','defend']){const m=acts.filter(x=>x.startsWith(k+'|'));if(m.length){a=m[Math.min(pick,m.length-1)];break}}
   if(!a){errs.push('stuck '+acts.join(','));break}
   const act=a.slice(0,a.indexOf('|')),arg=a.slice(a.indexOf('|')+1);if(act==='sign'){await p.focus('main [data-hold]');await p.keyboard.press('Enter');continue}await p.click(`main [data-act="${act}"]${arg?`[data-arg="${arg}"]`:''}`);
  }
  const st=await p.evaluate(()=>({season:S.season,week:S.week,screen:S.screen,squad:S.cf&&S.cf.squad.length,history:S.history.slice(-2).map(h=>h.txt)}));
  console.log(scheme,'steps',steps,'maxWidth',maxW,JSON.stringify(st));
  await b.close();
 }
 console.log('ERRORS',JSON.stringify(errs));
})();
