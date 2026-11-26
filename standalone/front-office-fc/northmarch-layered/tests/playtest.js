// Browser playtest at 390 px for the default game: the opening and the transfer summer, a full season by tapping, light and dark, save and continue.
// Usage: node tests/playtest.js [light|dark]   (needs Playwright and Chromium; builds nothing: run node build.js first)
const {chromium}=require('playwright'),path=require('path');
const url='file://'+path.join(__dirname,'..','dist','northmarch-layered.html');
(async()=>{
  const browser=await chromium.launch();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
  const schemes=process.argv[2]?[process.argv[2]]:['light','dark'];
  for(const scheme of schemes){
    const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,colorScheme:scheme});
    const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/fonts\.g|ERR_FAILED/.test(m.text()))errors.push(m.text())});
    await page.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
    await page.goto(url);
    const tap=async sel=>{await page.click(sel)},count=async sel=>await page.locator(sel).count();
    const wide=async name=>{const w=await page.evaluate(()=>document.documentElement.scrollWidth),vw=await page.evaluate(()=>innerWidth);ok(w<=vw,`${scheme}: no horizontal scroll on ${name} (${w}px)`)};
    const small=async()=>await page.evaluate(()=>[...document.querySelectorAll('button')].filter(x=>x.offsetParent&&x.getBoundingClientRect().height>0&&x.getBoundingClientRect().height<44).length);
    /* the way back from any screen: close an open sheet, then return to the chairman's home */
    const home=async()=>{if(await count('.overlay [data-act=ov]'))await tap('.overlay [data-act=ov]');if(await count('[data-act=nm85home]'))await tap('[data-act=nm85home]')};
    /* the opening (MB-05): open chairs → a club's file → stand for election → welcome → manifest → the director's plan → four market weeks → the season ahead */
    await tap('[data-act=new]');await wide('choose');
    ok(await count('[data-act=seat]')>=3,`${scheme}: the open chairs are offered as files`);
    await tap('[data-act=seat] >> nth=1');await wide('club file');
    ok((await page.locator('body').innerText()).toUpperCase().includes('THREE NAMES TO KNOW'),`${scheme}: the file names three players`);
    await tap('[data-act=seatback]');ok(await count('[data-act=seat]')>=3,`${scheme}: back from a file to the open chairs`);
    await tap('[data-act=seat] >> nth=1');await tap('[data-act=choose]');
    await page.evaluate(()=>{S.agmOff=true;M(S.my).conf=90}); /* this run tests the screens, not the members' vote */
    const steps=[];
    for(let i=0;i<24&&!await count('[data-act=play]');i++){const b=page.locator('.g-play').first();if(!await b.count())break;steps.push((await b.innerText()).trim());
      const bb=await b.boundingBox();if(i===0)ok(bb&&bb.height>=44,`${scheme}: the main button is at least 44px tall (${bb?Math.round(bb.height):'-'}px)`);
      await b.click();await wide('pre-season step '+(i+1))}
    ok(steps.some(t=>/manifest/i.test(t))&&steps.findIndex(t=>/manifest/i.test(t))<steps.findIndex(t=>/plan/i.test(t)),`${scheme}: the manifest is signed before the director's plan (${steps.join(' → ')})`);
    ok(await page.evaluate(()=>S.pre&&S.pre.ticker.some(t=>t.d>=10)),`${scheme}: the summer has a deadline day`);
    ok(await page.evaluate(()=>M(S.my).sealed===S.season),`${scheme}: the manifest is signed`);
    ok(await count('[data-act=play]')>=1,`${scheme}: one clear way to start the season`);
    console.log(`info ${scheme}: ${await small()} visible buttons are under 44px before the season (reported, not a failure)`);
    /* a full season by tapping: play, read the result, continue */
    let weeks=0,newspaper=false;
    for(let i=0;i<120&&!await count('[data-act=close]');i++){
      if(await count('.overlay [data-act=ov]')){await tap('.overlay [data-act=ov]');continue} /* the match opens live after Play: close it */
      if(await count('[data-act=v183ready]')){
        if(!newspaper&&await count('[data-act=v183paper]')){await tap('[data-act=v183paper]');newspaper=(await page.locator('body').innerText()).toUpperCase().includes('THE NORTHMARCH ECHO');await wide('match newspaper')}
        await tap('[data-act=v183ready]');continue}
      if(await count('[data-act=play]')){await tap('[data-act=play]');weeks++;continue}
      /* the AGM in steps: the floor (a motion, if any), the speech, the vote */
      if(await count('[data-act=agmnext]')){if(await count('[data-act=agmmotion]'))await tap('[data-act=agmmotion] >> nth=0');if(await count('[data-act=agmspeech]'))await tap('[data-act=agmspeech] >> nth=0');await tap('[data-act=agmnext]');continue}
      break;
    }
    ok(newspaper,`${scheme}: the match newspaper opens`);
    ok(await page.evaluate(()=>S.week)===30,`${scheme}: thirty weeks played by tapping (${weeks} matches)`);
    await wide('end of season');
    ok(await count('[data-act=close]')>=1,`${scheme}: the season can be finished`);
    await tap('[data-act=close] >> nth=0');await wide('season review');
    ok(await count('[data-act=startnext]')>=1,`${scheme}: the season review appears`);
    await tap('[data-act=startnext] >> nth=0');
    ok(await page.evaluate(()=>S.season===2&&S.week===0),`${scheme}: season two starts in the pre-season`);
    await wide('second pre-season');
    /* save and continue */
    await page.reload();await page.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
    ok(await count('[data-act=cont]')===1,`${scheme}: Continue is offered after a reload`);
    await tap('[data-act=cont]');
    ok(await page.evaluate(()=>S.season===2&&S.week===0&&S.my!=null),`${scheme}: the save continues in season two`);
    /* known V19 behaviour, identical in the original build: a save made right after 'start season' is only written by the next action */
    await page.waitForFunction(()=>document.querySelector('#app')&&document.querySelector('#app').innerText.length>40,null,{timeout:8000}).catch(()=>{});
    ok(await page.evaluate(()=>!!S&&!UI.title&&document.querySelector('#app').innerText.length>40),`${scheme}: after continuing a game is drawn`);
    ok(errors.length===0,`${scheme}: no script errors ${errors.slice(0,2).join(' | ')}`);
    await ctx.close();
  }
  await browser.close();
  console.log(fails?`playtest: ${fails} failed`:'playtest: all checks passed');process.exit(fails?1:0);
})();
