// Browser smoke for the stripped-down UI. Run after build.py:
// node test/browser/text-mode.cjs (requires Playwright + Chromium).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const html = fs.readFileSync(path.join(__dirname, '../../dist/index.html'));
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless:true, ...(process.env.TEST_BROWSER ? { executablePath:process.env.TEST_BROWSER } : {}) });
    const page = await browser.newPage({ viewport:{width:390,height:844} });
    const errors=[];
    page.on('pageerror', e => errors.push(e.message));
    const url = 'http://127.0.0.1:' + server.address().port + '/front-office-fc/chatgpt/';
    await page.goto(url);
    assert(await page.locator('h1').first().textContent().then(x => x.includes('The Front Office')));
    assert.equal(await page.locator('svg:visible,canvas:visible,img:visible').count(),0,'no illustrated UI visible');

    // Founding: swatch buttons must retain words after graphic removal.
    await page.click('[data-a="new"]');
    const swatches = page.locator('[data-a="col"]');
    assert(await swatches.count() >= 4,'club color options remain');
    assert((await swatches.first().textContent()).trim().length > 0,'swatch remains a readable choice');
    await page.evaluate(() => act('restart',{}));

    // The real summer engine must still initialise and show clickable choices.
    await page.click('[data-a="sheet"][data-s="quick"]');
    await page.click('[data-a="quick"][data-v="summer"]');
    assert.equal(await page.evaluate(() => FO.G.phase),'summer');
    assert(await page.locator('[data-a="mt-ans"]').count() > 0,'summer meeting choices visible');
    await page.locator('[data-a="mt-ans"]').first().click();
    assert.equal(await page.evaluate(() => FO.G.phase),'summer');
    await page.evaluate(() => { FO.sumAuto(FO.rnd,true); render(); });
    assert.notEqual(await page.evaluate(() => FO.G.phase),'summer','summer can complete without changing engines');

    // Start a separate club straight in week one and exercise navigation.
    await page.evaluate(() => act('restart',{}));
    await page.click('[data-a="sheet"][data-s="quick"]');
    await page.click('[data-a="quick"][data-v="season"]');
    assert.equal(await page.evaluate(() => FO.G.phase),'season');
    for(const tab of ['club','squad','league','staff','inbox']) {
      await page.locator('[data-a="tab"][data-t="'+tab+'"]').first().click();
      assert((await page.locator('[data-a="tab"][data-t="'+tab+'"]').first().getAttribute('class') || '').includes('on'),'tab action: '+tab);
    }
    assert.equal(await page.locator('svg:visible,canvas:visible,img:visible').count(),0,'illustrations remain hidden during play');

    // Trigger existing match preview, text commentary and Gazette controls.
    await page.evaluate(() => { FO.G.inbox.filter(m=>!m.done).forEach(m=>m.done=true); render(); });
    await page.click('[data-a="play"]');
    assert(await page.locator('[data-a="md-kick"]').count(),'match preview present');
    await page.click('[data-a="md-kick"]');
    assert(await page.locator('[data-a="md-skip"]').count(),'skip-to-fulltime preserved');
    await page.click('[data-a="md-skip"]');
    assert(await page.locator('[data-a="md-after"]').count(),'fulltime follow-up preserved');
    await page.click('[data-a="md-after"]');
    // A league+cup week may have two matches.
    if(await page.locator('[data-a="md-skip"]').count()) {
      await page.click('[data-a="md-skip"]');
      await page.click('[data-a="md-after"]');
    }
    assert(await page.locator('[data-a="md-done"]').count(),'Gazette follow-up preserved');
    await page.click('[data-a="md-done"]');
    assert.equal(await page.locator('svg:visible,canvas:visible,img:visible').count(),0);
    assert.deepEqual(errors,[],'no unhandled browser errors');
    console.log('PASS: text UI: founding choices, summer, tabs, match, Gazette and no visual artwork');
  } finally { if(browser) await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(e=>{console.error(e);process.exitCode=1;});
