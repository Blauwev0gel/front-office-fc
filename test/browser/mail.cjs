// Run after build.py. Requires Playwright and an installed Chrome/Chromium.
// MAIL_SCREENSHOTS optionally saves visual QA images outside the repository.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const html = fs.readFileSync(path.join(__dirname, '../../dist/index.html'));
const server = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); });

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.TEST_BROWSER ? { executablePath: process.env.TEST_BROWSER } : {}) });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/front-office-fc/chatgpt/`);
    await page.click('[data-a="sheet"][data-s="quick"]');
    await page.click('[data-a="quick"][data-v="season"]');
    const baseline = await page.evaluate(() => FO.save());
    const key = 'frontoffice_save_v1_chatgpt';
    async function fixture(kind = 'message', ap = 3) {
      return page.evaluate(({ baseline, kind, ap }) => {
        FO.load(baseline);
        const g = FO.G, id = FO.uid(); g.ap = ap; g.inbox = []; g.briefs = [];
        const item = { id, ctx: {}, done: false, season: g.season, week: g.week };
        if (kind === 'brief') {
          item.t = 'fin_wage'; item.ctx = { wr: 60, cp: 70 }; g.briefs.push(item);
        } else {
          item.ev = kind === 'big' ? 'vote_board' : 'wage_cap';
          if (kind === 'big') { item.ctx.k = 'board'; FO.rnd = () => 0; }
          g.inbox.push(item);
        }
        act('open', { k: (kind === 'brief' ? 'b' : 'm') + id });
        return id;
      }, { baseline, kind, ap });
    }
    async function saved() { return page.evaluate(key => JSON.parse(localStorage.getItem(key)), key); }
    async function shot(name) {
      if (!process.env.MAIL_SCREENSHOTS) return;
      fs.mkdirSync(process.env.MAIL_SCREENSHOTS, { recursive: true });
      await page.screenshot({ path: path.join(process.env.MAIL_SCREENSHOTS, name + '.png'), fullPage: true, animations: 'disabled' });
    }
    const rows = page.locator('.mreply .srow'), send = page.locator('.mreply [data-a="msend"]');
    let id = await fixture();
    assert.equal(await rows.count(), 3);
    assert.equal(await page.locator('[data-a="mcomp"]').count(), 0);
    assert.equal(await page.locator('.mreply .srow[aria-pressed="true"]').count(), 0);
    assert.equal(await send.isDisabled(), true);
    await rows.nth(0).click();
    await rows.nth(2).click();
    assert.equal(await page.evaluate(() => FO.G.ap), 3);
    assert.equal(await page.locator('.mln').textContent(), 'Freeze recruitment.');
    assert.equal(await rows.nth(2).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.i), '2');
    await shot('reply-mobile-light');
    // Dispatch twice in one JS task; assert commit and persistence in that task.
    const instant = await send.evaluate((button, key) => {
      button.click(); button.click();
      const saved = JSON.parse(localStorage.getItem(key));
      return { done: FO.G.inbox[0].done, ap: FO.G.ap, fee: FO.G.mand.dof.maxFee,
        saved: saved.inbox[0].done, savedAP: saved.ap, sent: !!document.querySelector('.msent'),
        waiting: !!document.querySelector('.msending, .mundo') };
    }, key);
    assert.deepEqual(instant, { done: true, ap: 2, fee: '0', saved: true, savedAP: 2, sent: true, waiting: false });
    await shot('sent-mobile-light');
    await page.reload();
    await page.click('[data-a="continue"]');
    assert.equal(await page.evaluate(id => FO.G.inbox.find(m => m.id === id).done, id), true);
    assert.equal(await page.evaluate(() => FO.G.ap), 2);
    console.log('PASS: one-screen replies; immediate commit/save; double send; reload');

    await fixture(); await rows.nth(1).click();
    await page.click('[data-a="close-open"]');
    assert.equal(await page.evaluate(() => FO.G.inbox[0].done), false);
    assert.equal(await page.evaluate(() => FO.G.ap), 3);
    await page.locator('.rbr').first().click();
    assert.equal(await send.isDisabled(), true);
    await fixture('message', 0);
    assert.equal(await send.isDisabled(), true);
    assert.equal(await rows.nth(0).isDisabled(), true);
    assert.equal(await page.locator('.msent').count(), 0);
    // Exhaust actions after selection to exercise the engine's error path too.
    await fixture(); await rows.nth(2).click();
    await page.evaluate(() => { FO.G.ap = 0; });
    await send.click();
    assert.equal(await page.evaluate(() => FO.G.inbox[0].done), false);
    assert.equal(await page.locator('.msent').count(), 0);
    await page.locator('.toast').waitFor({ state: 'hidden' });
    console.log('PASS: leaving, reopening, no actions and failed send');

    await fixture('brief', 0); await rows.nth(0).click(); await send.click();
    assert.equal((await saved()).briefs[0].done, true);
    assert.equal((await saved()).mand.dof.maxWage, '100');
    assert.equal((await saved()).ap, 0);
    await page.click('[data-a="mnext"]');
    assert.equal(await page.locator('.mreply [aria-pressed="true"]').count(), 0);
    console.log('PASS: free briefing at zero actions; next email clears selection');

    await fixture('big'); await rows.nth(0).focus(); await page.keyboard.press('Enter');
    for (let tabs = 0; tabs < 8 && !await send.evaluate(button => button === document.activeElement); tabs++) await page.keyboard.press('Tab');
    assert.equal(await send.evaluate(button => button === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.mconfirm').count(), 1);
    assert.equal(await page.evaluate(() => FO.G.inbox[0].done), false);
    assert.equal(await page.evaluate(() => FO.G.ap), 3);
    await page.locator('[data-a="mcancel"]').click();
    assert.equal(await page.locator('.mconfirm').count(), 0);
    await send.click();
    assert.equal(await send.evaluate(button => button.getBoundingClientRect().bottom <= document.querySelector('.bar2').getBoundingClientRect().top), true);
    await shot('confirm-mobile-light');
    await page.keyboard.press('Enter');
    assert.equal((await saved()).inbox[0].done, true);
    assert.equal((await saved()).ap, 2);
    console.log('PASS: big decision confirmation and cancel work by keyboard');

    await page.locator('.toast').waitFor({ state: 'hidden' });

    for (const [width, colorScheme, reducedMotion] of [[390, 'dark', 'reduce'], [1280, 'light', 'no-preference'], [1280, 'dark', 'reduce']]) {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ colorScheme, reducedMotion });
      await fixture(); await rows.nth(2).click();
      await send.scrollIntoViewIfNeeded();
      const layout = await send.evaluate(button => {
        const rect = button.getBoundingClientRect(), bar = document.querySelector('.bar2').getBoundingClientRect();
        return { width: document.documentElement.scrollWidth, viewport: innerWidth, bottom: rect.bottom, barTop: bar.top, height: rect.height };
      });
      assert.ok(layout.width <= layout.viewport, JSON.stringify(layout));
      assert.ok(layout.bottom <= layout.barTop, JSON.stringify(layout));
      assert.ok(layout.height >= 44);
      await shot(`reply-${width}-${colorScheme}`);
      await send.click(); assert.equal((await saved()).ap, 2);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: mobile/desktop, light/dark, reduced motion, no overlap or browser errors');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
