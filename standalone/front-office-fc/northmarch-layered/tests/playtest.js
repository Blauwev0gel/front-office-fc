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
    const shot=async(name)=>{if(scheme==='light'||['week','ground-build','money','club','dept'].includes(name))await page.screenshot({path:path.join(__dirname,'shots',`${scheme}-${name}.png`),fullPage:false})};
    await tap('[data-act=new]');await shot('choose');await wide('choose');
    await tap('[data-act=choose] >> nth=1');
    for(let i=0;i<3;i++)await tap('[data-act=play]');
    await shot('week');await wide('week');
    ok(await page.locator('.echo').count()===1,`${scheme}: the week report is shown`);
    await tap('[data-act=tab][data-arg=table]');await shot('table');await wide('table');
    await tap('[data-act=tier][data-arg=cup]');await wide('cup');
    await tap('[data-act=tier][data-arg="0"]');await tap('.trow[data-act=club] >> nth=0');await shot('club-sheet');await wide('club sheet');await tap('.overlay [data-act=ov]');
    await tap('[data-act=tab][data-arg=squad]');await shot('squad');await wide('squad');
    await tap('[data-act=tobudget]');
    ok(await page.evaluate(()=>UI.tab==='money'&&UI.mt==='budget'),`${scheme}: the squad screen leads to the budget frame`);
    await tap('[data-act=tab][data-arg=squad]');
    await tap('.prow >> nth=0');await shot('player');await wide('player');await tap('.overlay [data-act=ov]');
    await tap('[data-act=tab][data-arg=club]');await shot('club');await wide('club');
    await tap('[data-act=ov][data-arg=ground]');await shot('ground');
    for(const t of ['complex','build','repairs']){await tap(`[data-act=gtab][data-arg=${t}]`);await wide('ground '+t)}
    await tap('[data-act=gtab][data-arg=build]');
    const cash0=await page.evaluate(()=>S.fin[S.my].cash);
    await tap('[data-act=gsel] >> nth=0');await tap('[data-act=gbuild] >> nth=1');await shot('ground-build');
    ok(await page.evaluate(()=>S.grounds[S.my].projects.some(p=>p.phase!=='done')),`${scheme}: a building project starts from the Build tab`);
    await tap('.overlay [data-act=ov]');
    // the coach: open the sheet, appoint the first candidate
    await tap('[data-act=staff][data-arg=coach]');await shot('staff');await wide('coach sheet');
    const c0=await page.evaluate(()=>C().cast.coach);await tap('.overlay [data-act=confirm] >> nth=0');await tap('.overlay [data-act=shire]');
    ok(await page.evaluate(c=>C().cast.coach!==c,c0),`${scheme}: a new head coach is appointed`);await tap('.overlay [data-act=ov]');
    // departments: open one, hire staff, change the course, build its facility from the sheet
    await tap('[data-act=dept][data-arg=medical]');await shot('dept');await wide('department');
    const lv=await page.evaluate(()=>S.grounds[S.my].depts.medical.staff);
    await tap(`[data-act=dstaff][data-arg="medical:${Math.min(5,lv+1)}"]`);
    ok(await page.evaluate(()=>!!S.grounds[S.my].depts.medical.hiring),`${scheme}: recruiting medical staff starts`);
    await tap('[data-act=gcourse][data-arg="medical:recovery"]');
    ok(await page.evaluate(()=>S.grounds[S.my].depts.medical.pending==='recovery'),`${scheme}: the medical course changes`);
    await tap('.overlay [data-act=ov]');
    await tap('[data-act=dept][data-arg=academy]');
    if(await page.locator('.overlay [data-act=gsel]').count()){await tap('.overlay [data-act=gsel]');await tap('.overlay [data-act=gbuild] >> nth=1')}
    await tap('.overlay [data-act=ov]');
    await tap('[data-act=tab][data-arg=money]');await shot('money');await wide('money');
    for(const t of ['budget','ledger','prices','sponsors','funding']){await tap(`[data-act=mtab][data-arg=${t}]`);await wide('money '+t)}
    await tap('[data-act=mtab][data-arg=prices]');await tap('[data-act=price][data-arg="terrace:1"]');
    ok(await page.evaluate(()=>S.fin[S.my].prices.terrace===PRICE_DEF[C().tier].terrace+1),`${scheme}: a ticket price changes`);
    await tap('[data-act=mtab][data-arg=budget]');await shot('budget');const w0=await page.evaluate(()=>wageCapK(S.my));await tap('[data-act=wager][data-arg="1"]');
    ok(await page.evaluate(w=>wageCapK(S.my)>w,w0),`${scheme}: the wage limit rises from the budget`);
    await tap('[data-act=mtab][data-arg=funding]');await shot('funding');if(await page.locator('[data-act=appeal]').count()){await tap('[data-act=appeal]');ok(await page.evaluate(()=>F(S.my).fundLast===S.season),`${scheme}: a members' appeal is launched`)}
    await tap('[data-act=mtab][data-arg=funding]');const loans=await page.locator('[data-act=loan]').count();
    if(loans){await tap('[data-act=loan] >> nth=0');ok(await page.evaluate(()=>S.fin[S.my].loans.some(l=>/Bank loan/.test(l.label))),`${scheme}: a loan is drawn`)}
    // play out the season by tapping, then close it
    await tap('[data-act=tab][data-arg=week]');
    for(let i=0;i<40;i++){if(await page.locator('[data-act=close]').count())break;await tap('[data-act=play]')}
    ok(await page.evaluate(()=>S.week===30),`${scheme}: thirty weeks played by tapping`);
    const paid=await page.evaluate(()=>S.fin[S.my].season.build||0);ok(paid<0,`${scheme}: the project was paid for in the ledger (${paid})`);
    await tap('[data-act=close]');await shot('review');await wide('review');
    ok(await page.locator('[data-act=startnext]').count()===1,`${scheme}: the season review appears`);
    await tap('[data-act=startnext]');
    ok(await page.evaluate(()=>S.season===2&&S.week===0),`${scheme}: season two begins`);
    ok(await page.locator('.panel:has-text("Season targets")').count()===1,`${scheme}: the week shows the season targets`);
    await tap('[data-act=tab][data-arg=club]');const d0=await page.evaluate(()=>M(S.my).dues);await tap('[data-act=dues][data-arg="1"]');
    ok(await page.evaluate(d=>M(S.my).dues===d+5,d0),`${scheme}: membership dues change`);await shot('members');await wide('members');
    // a season so bad the members vote the chairman out: the review shows the AGM, then three new chairs
    const old=await page.evaluate(()=>{const id=S.my;while(!seasonOver())advanceWeek();M(id).conf=2;UI.tab='week';render();return id});
    await tap('[data-act=close]');await shot('agm-out');await wide('AGM');
    ok(await page.locator('h1:has-text("Voted out")').count()===1,`${scheme}: the AGM votes the chairman out`);
    await tap('[data-act=startnext]');
    ok(await page.evaluate(o=>S.phase==='choose'&&!S.seats.includes(o),old),`${scheme}: three new chairs are offered`);await wide('choose again');
    await tap('[data-act=choose] >> nth=0');ok(await page.evaluate(()=>S.phase==='season'&&S.career.length===2),`${scheme}: a new club in the same world`);
    // reload: continue from the save
    await page.reload();ok(await page.locator('[data-act=cont]').count()===1,`${scheme}: Continue is offered after a reload`);
    await tap('[data-act=cont]');ok(await page.evaluate(()=>S&&S.season===3&&S.career.length===2),`${scheme}: the save continues at the new club in season three`);
    // tap targets: every button at least 44px high
    const small=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.getBoundingClientRect().height<43.5).map(b=>b.textContent.trim().slice(0,20)));
    ok(small.length===0,`${scheme}: all visible buttons are at least 44px (${small.join(', ')})`);
    ok(errors.length===0,`${scheme}: no script errors ${errors.slice(0,3).join(' | ')}`);
    await ctx.close();
  }
  await browser.close();
  console.log(fails?`${fails} check(s) failed`:'playtest: all checks passed');process.exit(fails?1:0);
})();
