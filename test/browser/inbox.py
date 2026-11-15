import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
import asyncio
from playwright.async_api import async_playwright
async def md_through(pg):
    if not await pg.locator('[data-a=md-kick]').count(): return
    await pg.click('[data-a=md-kick]'); await pg.wait_for_timeout(300)
    for _ in range(6):
        if await pg.locator('[data-a=md-skip]').count(): await pg.click('[data-a=md-skip]'); await pg.wait_for_timeout(200)
        if await pg.locator('[data-a=md-after]').count(): await pg.click('[data-a=md-after]'); await pg.wait_for_timeout(200); continue
        if await pg.locator('[data-a=md-done]').count(): await pg.click('[data-a=md-done]'); await pg.wait_for_timeout(200); break

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+ROOT+'/dist/index.html'); await pg.wait_for_timeout(300)
        await pg.click('[data-a=new]'); await pg.click('[data-a=s-next]')
        for i in range(7): await pg.click('[data-a=dna] >> nth=0'); await pg.click('[data-a=s-next]')
        await pg.click('[data-a=found]')
        for r in ['dof','coach','scout','acad','com','mkt','fin']: await pg.click(f"[data-a=hire-tab][data-r={r}]"); await pg.click(f"[data-a=pick][data-r={r}][data-i=\"1\"]")
        await pg.click('[data-a=hire-all]'); await pg.click('[data-a=mand-done]')
        await pg.evaluate("()=>{FO.sumAuto(FO.rnd,true); render();}")
        while await pg.locator('[data-a=press]').count(): await pg.click('[data-a=press] >> nth=0'); await pg.click('[data-a=press-next]')
        await pg.click('[data-a=tour-ok][data-k=inbox]')
        async def playweek():
            await pg.click('[data-a=play]'); await md_through(pg)
            if await pg.locator('.sheet [data-a=end]').count(): await pg.click('.sheet [data-a=end]')
            if await pg.locator('[data-a=tick-skip]').count(): await pg.click('[data-a=tick-skip]')
            while await pg.locator('[data-a=tick-close]').count():
                await pg.click('[data-a=tick-close]')
                if await pg.locator('[data-a=tick-skip]').count(): await pg.click('[data-a=tick-skip]')
        for w in range(5): await playweek()
        await pg.screenshot(path='/tmp/i1.png')
        m = await pg.evaluate("()=>{const i=document.querySelector('.redbox').getBoundingClientRect(), bar=document.querySelector('.bar2').getBoundingClientRect(); return {inboxTop:i.top, barTop:bar.top, pct: Math.round((bar.top-i.top)/844*100), barH: Math.round(bar.height)}}")
        print('layout', m)
        # tap count: handle everything ourselves
        taps=0
        await pg.click('.rbr, .dkr, .paperpin'); taps+=1
        await pg.screenshot(path='/tmp/i2.png', full_page=True)
        for k in range(8):
            if await pg.locator('.om .cbtn:not([disabled])').count()==0: break
            await pg.click('.om .cbtn:not([disabled]) >> nth=0'); taps+=1
        await pg.screenshot(path='/tmp/i3.png', full_page=True)
        await pg.click('[data-a=close-open]'); taps+=1
        print('taps to handle all + back', taps)
        await pg.evaluate("()=>{ while(FO.G.week<17) FO.endWeek(); }"); await pg.click('[data-a=tab][data-t=inbox]')
        await pg.screenshot(path='/tmp/i4.png')
        await pg.click('[data-a=play]'); await pg.screenshot(path='/tmp/i5.png'); await md_through(pg)
        await pg.set_viewport_size({'width':1280,'height':850}); await pg.screenshot(path='/tmp/i6.png')
        print(errs)
        await b.close()
asyncio.run(main())
