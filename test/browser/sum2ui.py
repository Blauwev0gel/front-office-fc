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
        await pg.evaluate("()=>{FO.sumAuto(FO.rnd,true); for (const id of FO.G.press) FO.pressAnswer(id,0); FO.finishPress(); while(FO.G.phase==='season') FO.endWeek(); FO.startSeason(); render();}")
        n=0
        while await pg.locator('[data-a=mt-ans]').count() and n<20:
            await pg.screenshot(path=f'/tmp/mt{n}.png', full_page=True)
            if n==3:
                await pg.click('[data-a=mt-ans] >> nth=0'); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/mtsign.png', full_page=True); await pg.wait_for_timeout(1000); n+=1; continue
            k = 1 if n==2 and await pg.locator('[data-a=mt-ans]').count()>1 else 0
            await pg.click(f'[data-a=mt-ans] >> nth={k}'); n+=1; await pg.wait_for_timeout(1000)
        print('meeting clicks', n)
        await pg.wait_for_timeout(6000); await pg.screenshot(path='/tmp/tk1.png', full_page=True)
        for i in range(120):
            if await pg.locator('[data-a=tk-ans]').count():
                await pg.screenshot(path='/tmp/tkcall.png', full_page=True); await pg.click('[data-a=tk-ans] >> nth=0')
            if await pg.locator('.ddclock').count(): break
            await pg.wait_for_timeout(500)
        await pg.screenshot(path='/tmp/tk2.png', full_page=True)
        await pg.click('[data-a=dd-skip]'); await pg.click('[data-a=s2-step][data-i="2"]')
        await pg.screenshot(path='/tmp/ed.png', full_page=True)
        await pg.click('[data-a=s2-step][data-i="3"]'); await pg.click('[data-a=db-talk] >> nth=1'); await pg.screenshot(path='/tmp/db.png', full_page=True)
        await pg.click('[data-a=s2-step][data-i="4"]'); await pg.click('[data-a=pre-focus] >> nth=0'); await pg.click('[data-a=pre-focus] >> nth=1'); await pg.click('[data-a=s2-finish]')
        print('phase', await pg.evaluate("()=>FO.G.phase")); print('errors', errs)
        await b.close()
asyncio.run(main())
