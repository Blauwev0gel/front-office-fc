import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type=='error' and errs.append(m.text))
        await pg.goto('file://'+ROOT+'/dist/index.html'); await pg.wait_for_timeout(400)
        await pg.screenshot(path='/tmp/s0.png', full_page=False)
        await pg.click('[data-a=new]'); await pg.fill('#f-city','Harwick'); await pg.fill('#f-name','Harwick Athletic'); await pg.fill('#f-short','HAR')
        await pg.click('[data-a=col][data-i="1"]'); await pg.click('[data-a=s-next]')
        for i in range(7):
            await pg.click('[data-a=dna] >> nth=%d' % (i%3)); await pg.click('[data-a=s-next]')
        await pg.screenshot(path='/tmp/s1.png')
        await pg.click('[data-a=found]')
        for r in ['dof','coach','scout','acad','com','mkt','fin']:
            await pg.click(f"[data-a=hire-tab][data-r={r}]"); await pg.click(f"[data-a=pick][data-r={r}][data-i=\"1\"]")
        await pg.screenshot(path='/tmp/s2.png')
        await pg.click('[data-a=hire-all]')
        await pg.screenshot(path='/tmp/s3.png', full_page=False)
        await pg.click('[data-a=mand-done]')
        for i in range(4):
            await pg.click('[data-a=press] >> nth=0'); await pg.screenshot(path='/tmp/s4.png'); await pg.click('[data-a=press-next]')
        await pg.screenshot(path='/tmp/s5.png', full_page=True)
        await pg.click('[data-a=opt] >> nth=0')
        await pg.click('[data-a=end]'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path='/tmp/s6.png')
        await pg.click('[data-a=tick-skip]'); await pg.click('[data-a=tick-close]')
        for w in range(6):
            await pg.click('[data-a=end]'); await pg.click('[data-a=tick-skip]');
            while await pg.locator('[data-a=tick-close]').count():
                await pg.click('[data-a=tick-close]')
                if await pg.locator('[data-a=tick-skip]').count(): await pg.click('[data-a=tick-skip]')
        await pg.screenshot(path='/tmp/s7.png', full_page=True)
        for t in ['news','club','staff','squad','league']:
            await pg.click(f'[data-a=tab][data-t={t}]'); await pg.screenshot(path=f'/tmp/t-{t}.png', full_page=True)
        await pg.click('[data-a=tab][data-t=squad]'); await pg.click('[data-a=sq][data-v=mb]'); await pg.screenshot(path='/tmp/t-mb.png')
        await pg.click('tr[data-a=player] >> nth=3'); await pg.screenshot(path='/tmp/t-player.png')
        await pg.click('[data-a=close]')
        await pg.click('[data-a=tab][data-t=staff]'); await pg.click('[data-a=sheet][data-s=mand] >> nth=0'); await pg.screenshot(path='/tmp/t-mand.png')
        await pg.click('.sheet [data-a=close] >> nth=0')
        # desktop
        await pg.set_viewport_size({'width':1280,'height':900}); await pg.click('[data-a=tab][data-t=desk]'); await pg.screenshot(path='/tmp/d-desk.png')
        await pg.emulate_media(color_scheme='dark'); await pg.screenshot(path='/tmp/d-dark.png')
        await pg.set_viewport_size({'width':390,'height':844}); await pg.emulate_media(color_scheme='light')
        await pg.click('[data-a=tab][data-t=desk]')
        if await pg.locator('[data-s=analysis]').count():
            await pg.click('[data-s=analysis]'); await pg.screenshot(path='/tmp/t-analysis.png', full_page=False)
            await pg.click('.sheet [data-a=close] >> nth=0')
        await pg.click('[data-a=tab][data-t=club]'); await pg.screenshot(path='/tmp/t-club2.png', full_page=False)
        print('errors', errs[:10])
        await b.close()
asyncio.run(main())
