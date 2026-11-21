// Browser playtest at 390 px: a full season by tapping, every screen and overlay, light and dark, save and continue.
// Usage: node tests/playtest.js   (needs the pre-installed Playwright/Chromium)
const {chromium}=require('playwright'),path=require('path');
const url='file://'+path.join(__dirname,'..','dist','northmarch-layered.html');
(async()=>{
  const browser=await chromium.launch();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
  for(const scheme of ['light','dark']){
    const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,colorScheme:scheme});
    const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/fonts\.g|ERR_FAILED/.test(m.text()))errors.push(m.text())});
    await page.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
    await page.goto(url);
    const tap=async(sel)=>{await page.click(sel)};
    const wide=async(name)=>{const w=await page.evaluate(()=>document.documentElement.scrollWidth);ok(w<=390,`${scheme}: no horizontal scroll on ${name} (${w}px)`)};
    const shot=async(name)=>{if(scheme==='light'||['week','ground-build','money'].includes(name))await page.screenshot({path:path.join(__dirname,'shots',`${scheme}-${name}.png`),fullPage:false})};
    await tap('[data-act=new]');await shot('choose');await wide('choose');
    await tap('[data-act=choose] >> nth=1');
    for(let i=0;i<3;i++)await tap('[data-act=play]');
    await shot('week');await wide('week');
    ok(await page.locator('.echo').count()===1,`${scheme}: the week report is shown`);
    await tap('[data-act=tab][data-arg=table]');await shot('table');await wide('table');
    await tap('[data-act=tier][data-arg=cup]');await wide('cup');
    await tap('[data-act=tier][data-arg="0"]');await tap('.trow[data-act=club] >> nth=0');await shot('club-sheet');await wide('club sheet');await tap('.overlay [data-act=ov]');
    await tap('[data-act=tab][data-arg=squad]');await shot('squad');await wide('squad');
    await tap('[data-act=pol][data-arg=ambitious]');
    ok(await page.locator('[data-act=pol][data-arg=ambitious].on').count()===1,`${scheme}: the wage frame changes through a command`);
    await tap('.prow >> nth=0');await shot('player');await wide('player');await tap('.overlay [data-act=ov]');
    await tap('[data-act=tab][data-arg=club]');await shot('club');await wide('club');
    await tap('[data-act=ov][data-arg=ground]');await shot('ground');
    for(const t of ['complex','depts','build','repairs']){await tap(`[data-act=gtab][data-arg=${t}]`);await wide('ground '+t)}
    await tap('[data-act=gtab][data-arg=build]');
    const cash0=await page.evaluate(()=>S.fin[S.my].cash);
    await tap('[data-act=gsel] >> nth=0');await tap('[data-act=gbuild] >> nth=1');await shot('ground-build');
    ok(await page.evaluate(()=>S.grounds[S.my].projects.some(p=>p.phase!=='done')),`${scheme}: a building project starts from the Build tab`);
    await tap('.overlay [data-act=ov]');
    await tap('[data-act=ov][data-arg=money]');await shot('money');
    for(const t of ['ledger','prices','loans']){await tap(`[data-act=mtab][data-arg=${t}]`);await wide('money '+t)}
    await tap('[data-act=mtab][data-arg=prices]');await tap('[data-act=price][data-arg="terrace:1"]');
    ok(await page.evaluate(()=>S.fin[S.my].prices.terrace===PRICE_DEF[C().tier].terrace+1),`${scheme}: a ticket price changes`);
    await tap('[data-act=mtab][data-arg=loans]');const loans=await page.locator('[data-act=loan]').count();
    if(loans){await tap('[data-act=loan] >> nth=0');ok(await page.evaluate(()=>S.fin[S.my].loans.some(l=>/Bank loan/.test(l.label))),`${scheme}: a loan is drawn`)}
    await tap('.overlay [data-act=ov]');
    // play out the season by tapping, then close it
    await tap('[data-act=tab][data-arg=week]');
    for(let i=0;i<40;i++){if(await page.locator('[data-act=close]').count())break;await tap('[data-act=play]')}
    ok(await page.evaluate(()=>S.week===30),`${scheme}: thirty weeks played by tapping`);
    const paid=await page.evaluate(()=>S.fin[S.my].season.build||0);ok(paid<0,`${scheme}: the project was paid for in the ledger (${paid})`);
    await tap('[data-act=close]');await shot('review');await wide('review');
    ok(await page.locator('[data-act=startnext]').count()===1,`${scheme}: the season review appears`);
    await tap('[data-act=startnext]');
    ok(await page.evaluate(()=>S.season===2&&S.week===0),`${scheme}: season two begins`);
    // reload: continue from the save
    await page.reload();ok(await page.locator('[data-act=cont]').count()===1,`${scheme}: Continue is offered after a reload`);
    await tap('[data-act=cont]');ok(await page.evaluate(()=>S&&S.season===2),`${scheme}: the save continues in season two`);
    // tap targets: every button at least 44px high
    const small=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.getBoundingClientRect().height<43.5).map(b=>b.textContent.trim().slice(0,20)));
    ok(small.length===0,`${scheme}: all visible buttons are at least 44px (${small.join(', ')})`);
    ok(errors.length===0,`${scheme}: no script errors ${errors.slice(0,3).join(' | ')}`);
    await ctx.close();
  }
  await browser.close();
  console.log(fails?`${fails} check(s) failed`:'playtest: all checks passed');process.exit(fails?1:0);
})();
