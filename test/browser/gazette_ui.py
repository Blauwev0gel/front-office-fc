import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
import asyncio,sys
sys.path.insert(0,'/tmp')
from playwright.async_api import async_playwright
exec(open(os.path.join(os.path.dirname(__file__), 'playtest.py')).read().split('async def main')[0])
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':390,'height':844},color_scheme='dark'); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('file://'+ROOT+'/dist/index.html'); await pg.evaluate("localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(400)
    await pg.click('[data-a=new]'); await pg.wait_for_timeout(300)
    if await pg.locator('[data-a=quick]').count(): await pg.click('[data-a=quick] >> nth=0')
    else:
      await pg.click('[data-a=s-next]')
      for i in range(7): await pg.click('[data-a=dna] >> nth=1'); await pg.click('[data-a=s-next]')
      await pg.click('[data-a=found]')
      for r in ['dof','coach','scout','acad','com','mkt','fin']: await pg.click(f"[data-a=hire-tab][data-r={r}]"); await pg.click(f"[data-a=pick][data-r={r}][data-i=\"0\"]")
      await pg.click('[data-a=hire-all]'); await pg.click('[data-a=mand-done]')
    await pg.wait_for_timeout(600)
    if await pg.evaluate("FO.G.phase")=='summer': await pg.evaluate("()=>{FO.sumAuto(FO.rnd,true); render();}")
    await pg.wait_for_timeout(300)
    while await pg.locator('[data-a=press]').count(): await pg.click('[data-a=press] >> nth=0'); await pg.click('[data-a=press-next]')
    await pg.wait_for_timeout(400); await clear(pg)
    if await pg.locator('[data-a=tour-ok]').count(): await pg.click('[data-a=tour-ok] >> nth=0')
    OVF="(()=>{const d=document.documentElement;return d.scrollWidth>d.clientWidth+1})()"
    for w in range(3):
      await clear(pg)
      if await pg.locator('[data-a=tour-ok]').count(): await pg.click('[data-a=tour-ok] >> nth=0')
      await pg.click('[data-a=play] >> nth=0'); await pg.wait_for_timeout(500); await md_through(pg) if False else None
      await pg.click('[data-a=md-kick]'); await pg.wait_for_timeout(400)
      for _ in range(4):
        if await pg.locator('[data-a=md-skip]').count(): await pg.click('[data-a=md-skip]'); await pg.wait_for_timeout(300)
        if await pg.locator('[data-a=md-after]').count(): await pg.click('[data-a=md-after]'); await pg.wait_for_timeout(300)
        if await pg.locator('.mdnp').count(): break
      if w==2: await pg.screenshot(path='/tmp/z1.png')
      await pg.click('[data-a=md-done]'); await pg.wait_for_timeout(400)
    await pg.screenshot(path='/tmp/z2.png'); print('pin', await pg.locator('.paperpin').count())
    await pg.click('.paperpin'); await pg.wait_for_timeout(500); await pg.screenshot(path='/tmp/z3.png', full_page=True)
    print('inbox gazette', await pg.locator('.om .mdnews.gz-inbox').count(), 'archive', await pg.locator('[data-a=ed-open]').count(), 'replay', await pg.locator('[data-a=replay]').count(), 'ovf', await pg.evaluate(OVF))
    await pg.click('[data-a=ed-open][data-i="2"]'); await pg.wait_for_timeout(400); print('old edition head', await pg.locator('.mdnh').inner_text())
    await pg.click('[data-a=ed-open][data-i="0"]'); await pg.wait_for_timeout(300)
    await pg.click('[data-a=replay]'); await pg.wait_for_timeout(2500); print('replay screen', await pg.locator('.mdm').count(), 'veil', await pg.locator('.veil').count())
    await pg.click('[data-a=md-skip]'); await pg.wait_for_timeout(400); txt = await pg.locator('[data-a=md-after]').inner_text(); print('ft button', txt)
    await pg.click('[data-a=md-after]'); await pg.wait_for_timeout(400); print('back on gazette', await pg.locator('.om .mdnews.gz-inbox').count())
    await pg.reload(); await pg.wait_for_timeout(800)
    if await pg.locator('[data-a=continue]').count(): await pg.click('[data-a=continue]'); await pg.wait_for_timeout(500)
    print('after reload editions', await pg.evaluate("FO.edCount()"))
    print(errs); await b.close()
asyncio.run(main())
