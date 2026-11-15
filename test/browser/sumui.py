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
        # season 1 summer quickly via helper, then play season to reach summer 2
        await pg.evaluate("()=>{FO.sumAuto(FO.rnd,true); for (const id of FO.G.press) FO.pressAnswer(id,0); FO.finishPress(); while(FO.G.phase==='season') FO.endWeek(); FO.startSeason(); render();}")
        await pg.screenshot(path='/tmp/m0.png', full_page=True)
        if await pg.locator('[data-a=sum-ctr][data-v=renew]').count(): await pg.click('[data-a=sum-ctr][data-v=renew] >> nth=0')
        await pg.click('.row [data-a=sum-step][data-i="1"]')
        await pg.click('[data-a=pre-target][data-k=accept]'); await pg.screenshot(path='/tmp/m1.png', full_page=True)
        await pg.click('.row [data-a=sum-step][data-i="2"]')
        for i in range(3):
            await pg.click('[data-a=sum-round]')
            if i==1: await pg.screenshot(path='/tmp/m2.png', full_page=True)
        await pg.screenshot(path='/tmp/m2b.png', full_page=True)
        await pg.click('.row [data-a=sum-step][data-i="3"]')
        await pg.click('[data-a=pre-focus] >> nth=0'); await pg.click('[data-a=pre-focus] >> nth=1')
        await pg.screenshot(path='/tmp/m3.png', full_page=True)
        await pg.click('.row [data-a=sum-step][data-i="4"]')
        await pg.click('[data-a=dd-start]')
        shot=False
        for k in range(40):
            await pg.wait_for_timeout(900)
            if await pg.locator('[data-a=dd-dec]').count() and not shot:
                await pg.screenshot(path='/tmp/m4.png'); shot=True
                await pg.click('[data-a=dd-dec] >> nth=0')
            if await pg.locator('[data-a=sum-finish]').count(): break
        await pg.screenshot(path='/tmp/m5.png', full_page=True)
        await pg.click('[data-a=sum-finish]')
        print('phase', await pg.evaluate("()=>FO.G.phase"), 'shot', shot)
        while await pg.locator('[data-a=press]').count(): await pg.click('[data-a=press] >> nth=0'); await pg.click('[data-a=press-next]')
        await pg.evaluate("()=>{ render(); }")
        await pg.screenshot(path='/tmp/w1.png')
        await pg.evaluate("()=>{ while(FO.G.week<10) FO.endWeek(); render(); }"); await pg.click('[data-a=tab][data-t=inbox]')
        await pg.screenshot(path='/tmp/w10.png')
        items = await pg.evaluate("()=>FO.G.inbox.filter(m=>!m.done).map(m=>m.ev).concat((FO.G.briefs||[]).map(b=>b.t))")
        print('w10 items', items)
        await pg.click('.ir >> nth=1'); await pg.screenshot(path='/tmp/w10b.png', full_page=True); await pg.click('[data-a=close-open]')
        await pg.evaluate("()=>{ while(FO.G.week<20) FO.endWeek(); render(); }"); await pg.click('[data-a=tab][data-t=squad]'); await pg.click('[data-a=sqv][data-v=rec]')
        await pg.screenshot(path='/tmp/w20.png', full_page=True)
        print('errors', errs)
        await b.close()
asyncio.run(main())
