import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
import asyncio
from playwright.async_api import async_playwright
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
        await pg.click('[data-a=pre-target][data-k=accept]'); await pg.click('[data-a=pre-focus] >> nth=0'); await pg.click('[data-a=pre-focus] >> nth=1')
        await pg.click('[data-a=pre-step][data-i="1"]'); await pg.click('.row [data-a=pre-step][data-i="2"]')
        await pg.click('[data-a=rec-kind] >> nth=1'); await pg.click('[data-a=rec-appr][data-v="25"]')
        await pg.screenshot(path='/tmp/r1.png', full_page=True)
        await pg.click('.row [data-a=pre-step][data-i="3"]'); await pg.click('[data-a=pre-done]')
        while await pg.locator('[data-a=press]').count(): await pg.click('[data-a=press] >> nth=0'); await pg.click('[data-a=press-next]')
        if await pg.locator('[data-a=tour-ok][data-k=inbox]').count(): await pg.click('[data-a=tour-ok][data-k=inbox]')
        async def playweek():
            await pg.click('[data-a=play]')
            if await pg.locator('.sheet [data-a=end]').count(): await pg.click('.sheet [data-a=end]')
            if await pg.locator('[data-a=tick-skip]').count(): await pg.click('[data-a=tick-skip]')
            while await pg.locator('[data-a=tick-close]').count():
                await pg.click('[data-a=tick-close]')
                if await pg.locator('[data-a=tick-skip]').count(): await pg.click('[data-a=tick-skip]')
        for w in range(4): await playweek()
        await pg.click('[data-a=tab][data-t=squad]'); await pg.click('[data-a=sqv][data-v=rec]')
        await pg.screenshot(path='/tmp/r2.png', full_page=True)
        if await pg.locator('.rrow').count():
            await pg.click('.rrow >> nth=0'); await pg.screenshot(path='/tmp/r3.png', full_page=True)
            if await pg.locator('[data-a=recact][data-v=report]').count(): await pg.click('[data-a=recact][data-v=report]')
            await pg.click('.sheet [data-a=close] >> nth=0')
        await pg.evaluate("()=>{ while(FO.G.week<16) FO.endWeek(); }")
        for w in range(3): await playweek()
        await pg.click('[data-a=tab][data-t=inbox]')
        await pg.screenshot(path='/tmp/r4.png')
        recs = await pg.evaluate("()=>FO.G.inbox.filter(m=>m.ev.startsWith('rec_')).map(m=>m.ev+':'+FO.msgView(m).title)")
        print('rec msgs', recs)
        await pg.click('[data-a=tab][data-t=squad]'); await pg.click('[data-a=sqv][data-v=rec]')
        await pg.screenshot(path='/tmp/r5.png', full_page=True)
        print('errors', errs)
        await b.close()
asyncio.run(main())
