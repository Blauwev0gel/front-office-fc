import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
import asyncio, json
from playwright.async_api import async_playwright
OV = "(()=>{const d=document.documentElement;return d.scrollWidth>d.clientWidth+1?d.scrollWidth:0})()"
async def answer(pg, n):
    if not await pg.locator('.srow').count(): return False
    await pg.click(f'.srow >> nth={n}'); await pg.wait_for_timeout(250)
    b = pg.locator('.msend')
    if 'hold' in (await b.get_attribute('class') or ''):
        bb = await b.bounding_box(); await pg.mouse.move(bb['x']+20, bb['y']+20); await pg.mouse.down(); await pg.wait_for_timeout(1250); await pg.mouse.up()
    else: await b.click()
    await pg.wait_for_timeout(3300); return True

async def md_through(pg):
    if not await pg.locator('[data-a=md-kick]').count(): return
    await pg.click('[data-a=md-kick]'); await pg.wait_for_timeout(300)
    for _ in range(6):
        if await pg.locator('[data-a=md-skip]').count(): await pg.click('[data-a=md-skip]'); await pg.wait_for_timeout(200)
        if await pg.locator('[data-a=md-after]').count(): await pg.click('[data-a=md-after]'); await pg.wait_for_timeout(200); continue
        if await pg.locator('[data-a=md-done]').count(): await pg.click('[data-a=md-done]'); await pg.wait_for_timeout(200); break

async def clear(pg):
    for _ in range(6):
        if await pg.locator('.veil').count()==0: return
        print('   overlay:', (await pg.evaluate("(document.querySelector('.veil')||{}).innerText||''"))[:160].replace('\n',' | '))
        for sel in ['.veil [data-a=review]','[data-a=tick-skip]','[data-a=tick-close]','.veil [data-a=close]','[data-a=close]']:
            if await pg.locator(sel).count():
                try: await pg.click(sel, timeout=2000)
                except Exception: pass
                await pg.wait_for_timeout(200); break
        else: return
async def sclick(pg, sel):
    for _ in range(3):
        try: await pg.click(sel, timeout=4000); return True
        except Exception: await clear(pg)
    print('   could not click', sel); return False
async def play_week(pg):
    await clear(pg)
    if await pg.locator('[data-a=play]').count()==0: return False
    try: await pg.click('[data-a=play]', timeout=3000); await md_through(pg)
    except Exception:
        print('   play blocked by:', (await pg.evaluate("(document.querySelector('.veil')||document.querySelector('.tour')||{}).innerText||''"))[:300].replace('\n',' | '), '| html:', (await pg.evaluate("(document.querySelector('.veil')||{}).outerHTML||''"))[:200])
        return False
    await pg.wait_for_timeout(300)
    if await pg.locator('.veil [data-a=end]').count(): await pg.click('.veil [data-a=end]'); await pg.wait_for_timeout(300)
    for _ in range(4):
        if await pg.locator('[data-a=tick-skip]').count(): await pg.click('[data-a=tick-skip]'); await pg.wait_for_timeout(200)
        if await pg.locator('[data-a=tick-close]').count(): await pg.click('[data-a=tick-close]'); await pg.wait_for_timeout(200); break
    await clear(pg)
    if await pg.locator('[data-a=tour-ok]').count(): await pg.click('[data-a=tour-ok] >> nth=0')
    return True
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]; ov=[]
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
    async def chk(tag):
        w = await pg.evaluate(OV)
        if w: ov.append(f'{tag}:{w}')
    await pg.goto('file://'+ROOT+'/dist/index.html'); await pg.evaluate("localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(300)
    # founding through the real screens
    await pg.click('[data-a=new]'); await pg.click('[data-a=s-next]')
    for i in range(7): await pg.click('[data-a=dna] >> nth=1'); await chk('dna'); await pg.click('[data-a=s-next]')
    await pg.click('[data-a=found]'); await chk('staff')
    for r in ['dof','coach','scout','acad','com','mkt','fin']: await pg.click(f"[data-a=hire-tab][data-r={r}]"); await pg.click(f"[data-a=pick][data-r={r}][data-i=\"0\"]")
    await pg.click('[data-a=hire-all]'); await chk('mandates'); await pg.click('[data-a=mand-done]')
    print('after founding phase:', await pg.evaluate("FO.G.phase"))
    await pg.evaluate("()=>{FO.sumAuto(FO.rnd,true); render();}")  # summer window handled by the staff
    await chk('preseason')
    while await pg.locator('[data-a=press]').count(): await pg.click('[data-a=press] >> nth=0'); await pg.click('[data-a=press-next]')
    print('season starts:', await pg.evaluate("FO.G.phase"), 'week', await pg.evaluate("FO.G.week"))
    if await pg.locator('[data-a=tour-ok]').count(): await pg.click('[data-a=tour-ok] >> nth=0')
    # a representative run of weeks with real clicks; answer the first decision each week through the UI
    for w in range(6):
        key = await pg.evaluate("()=>{const m=FO.G.inbox.find(m=>!m.done);return m?'m'+m.id:null}")
        await clear(pg)
        if key:
            try: await pg.click(f'[data-a=open][data-k="{key}"]', timeout=3000)
            except Exception:
                print('   blocked by:', (await pg.evaluate("(document.querySelector('.veil')||{}).innerText||''"))[:300].replace('\n',' | ')); await clear(pg); await pg.click(f'[data-a=open][data-k="{key}"]', timeout=3000)
            await pg.wait_for_timeout(150); await chk('msg')
            await answer(pg, 0)
            if await pg.locator('[data-a=close-open]').count(): await pg.click('[data-a=close-open]')
        for t in ['club','squad','league','staff','inbox']: await pg.click(f'[data-a=tab][data-t={t}]'); await chk('tab-'+t)
        await play_week(pg); await chk('week')
    print('after weeks: week', await pg.evaluate("FO.G.week"), 'phase', await pg.evaluate("FO.G.phase"))
    # the pathway storyline: give the academy a realistic subject and start it, then play it through the screens
    started = await pg.evaluate("""()=>{const G=FO.G,ta=FO.tierAvg(G.club.tier),xi=(G.ft&&G.ft.xiPrev)||[];const reg=G.squad.filter(p=>p.pos!=='GK'&&xi.includes(p.id)).sort((a,b)=>a.ca-b.ca)[0];const t=FO.genPlayer({pos:reg.pos,age:18,ca:reg.ca-0.8,region:'dom'});t.academy=true;t.pa=ta+2.6;G.academy.push(t);G.club.kitty=Math.max(G.club.kitty||0,60000);G.pw=null;G.pwLog=[];return FO.pwStart(true)}""")
    print('storyline started:', started)
    key = None
    for _ in range(3):
        await play_week(pg)
        key = await pg.evaluate("()=>{const m=FO.G.inbox.find(m=>!m.done&&m.ev==='pw_signal');return m?'m'+m.id:null}")
        if key: break
        print('   waiting for signal:', await pg.evaluate("JSON.stringify({st:FO.G.pw&&FO.G.pw.stage,q:FO.G.queue.map(q=>q.id),inb:FO.G.inbox.filter(m=>/^pw/.test(m.ev)).map(m=>[m.ev,m.done,m.by])})"))
    print('signal in inbox:', bool(key)); await clear(pg)
    await sclick(pg, f'[data-a=open][data-k="{key}"]'); await pg.wait_for_timeout(200); await pg.screenshot(path='/tmp/g_signal.png'); await chk('signal')
    await answer(pg, 0)
    if await pg.locator('[data-a=close-open]').count(): await sclick(pg, '[data-a=close-open]')
    await play_week(pg)
    key = await pg.evaluate("()=>{const m=FO.G.inbox.find(m=>!m.done&&m.ev==='pw_meet');return m?'m'+m.id:null}")
    print('meeting in inbox:', bool(key)); await clear(pg)
    await sclick(pg, f'[data-a=open][data-k="{key}"]'); await pg.wait_for_timeout(200)
    ap0 = await pg.evaluate("FO.G.ap")
    for r in ['coach','acad','dof']: await sclick(pg, f'[data-a=pw-ask][data-r={r}]'); await pg.wait_for_timeout(120)
    print('questions answered:', await pg.evaluate("Object.keys(FO.G.pw.asked).length"), 'actions unchanged:', ap0 == await pg.evaluate("FO.G.ap"))
    await pg.screenshot(path='/tmp/g_meet.png', full_page=True); await chk('meeting')
    covered = await pg.evaluate("(()=>{const t=document.querySelector('.mdock');const last=[...document.querySelectorAll('.pwr')].pop();if(!t||!last)return null;window.scrollTo(0,document.body.scrollHeight);const a=last.getBoundingClientRect(),b=t.getBoundingClientRect();return a.bottom>b.top})()")
    print('last route text hidden behind the decision tray after scrolling:', covered)
    await answer(pg, 2)
    if await pg.locator('[data-a=close-open]').count(): await sclick(pg, '[data-a=close-open]')
    await sclick(pg, '[data-a=filt][data-v=dos]'); await pg.wait_for_timeout(120)
    await sclick(pg, '[data-a=open][data-k=pathway]'); await pg.wait_for_timeout(200); await pg.screenshot(path='/tmp/g_card.png', full_page=True); await chk('card')
    await sclick(pg, '[data-a=close-open]')
    await sclick(pg, '[data-a=tab][data-t=staff]'); await sclick(pg, '[data-a=dept][data-k=first]'); await pg.wait_for_timeout(150)
    print('agreement visible on coach profile:', await pg.locator('[data-a=pw-open]').count() > 0)
    await sclick(pg, '[data-a=tab][data-t=inbox]')
    for w in range(8):
        if await pg.evaluate("!!FO.G.inbox.find(m=>!m.done&&m.ev==='pw_eval')"): break
        await play_week(pg)
    key = await pg.evaluate("()=>{const m=FO.G.inbox.find(m=>!m.done&&m.ev==='pw_eval');return m?'m'+m.id:null}")
    print('evaluation in inbox:', bool(key), 'week', await pg.evaluate("FO.G.week")); await clear(pg)
    if key:
        await sclick(pg, f'[data-a=open][data-k="{key}"]'); await pg.wait_for_timeout(200); await pg.screenshot(path='/tmp/g_eval.png', full_page=True); await chk('eval')
        await answer(pg, 0)
    if await pg.locator('[data-a=close-open]').count(): await sclick(pg, '[data-a=close-open]')
    await sclick(pg, '[data-a=tab][data-t=club]'); await pg.wait_for_timeout(150); await pg.screenshot(path='/tmp/g_club.png', full_page=True); await chk('club')
    # save and reload mid-season
    await pg.reload(); await pg.wait_for_timeout(300); await sclick(pg, '[data-a=continue]'); await pg.wait_for_timeout(200)
    print('after reload: phase', await pg.evaluate("FO.G.phase"), 'pathway stage', await pg.evaluate("FO.G.pw&&FO.G.pw.stage"))
    print('horizontal overflow:', ov or 'none'); print('errors:', errs or 'none')
    await b.close()
asyncio.run(main())
