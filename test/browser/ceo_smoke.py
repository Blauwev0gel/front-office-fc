"""390px light/dark browser smoke for the CEO desk, staff tab and dedicated transfer phases."""
import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "test-results" / "ceo-mobile"
OUT.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as playwright:
        chrome = "/usr/bin/google-chrome"
        browser = await playwright.chromium.launch(
            executable_path=chrome if os.path.exists(chrome) else None,
            args=["--no-sandbox"],
        )
        page = await browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto((ROOT / "dist" / "index.html").as_uri())
        await page.evaluate("localStorage.clear()")
        await page.reload()
        # Enter through the real title-screen controls. UI state is scoped inside the bundle and is not a global API.
        await page.locator('[data-a="sheet"][data-s="quick"]').click()
        await page.locator('[data-a="quick"][data-v="season"]').click()
        assert await page.evaluate("FO.G.phase") == "season", "Quick-start did not reach the normal season desk"
        async def check(name):
            await page.wait_for_timeout(120)
            data = await page.evaluate("""() => ({
              width: document.documentElement.clientWidth,
              scrollWidth: document.documentElement.scrollWidth,
              buttons: document.querySelectorAll('button').length,
              phase: FO.G.phase,
              theme: document.documentElement.dataset.theme
            })""")
            assert data["width"] == 390, (name, data)
            assert data["scrollWidth"] <= 392, (name + " overflows horizontally", data)
            assert data["buttons"] > 0, (name + " has no clickable UI", data)
            await page.screenshot(path=str(OUT / (name + ".png")), full_page=True)
            print("PASS", name, data)
        for theme in ["light", "dark"]:
            await page.evaluate("(theme) => {document.documentElement.dataset.theme=theme;}", theme)
            await check("desk-" + theme)
            tabs = page.locator('[data-a=tab][data-t=staff]')
            assert await tabs.count() > 0, "staff tab absent"
            await tabs.first.click()
            await check("staff-" + theme)
            back = page.locator('[data-a=tab][data-t=inbox]')
            if await back.count(): await back.first.click()
        await page.evaluate("""() => {
          FO.G.week=17;
          if(!FO.winterOpen()) throw Error('Winter route did not open');
          localStorage.setItem('frontoffice_save_v1', FO.save());
        }""")
        await page.reload()
        await page.locator('[data-a=continue]').click()
        assert await page.evaluate("FO.G.phase") == "summer"
        print("WINTER DEBUG", await page.evaluate("""() => ({text: document.body.innerText.slice(0,700), html: document.querySelector('#app')?.innerHTML.slice(0,450), titleButtons: [...document.querySelectorAll('button')].map(x=>[x.dataset.a,x.innerText.slice(0,60)])})"""), "pageErrors", errors, flush=True)
        assert await page.locator(".steps").count() > 0, "Winter meeting progress/navigation is missing"
        assert "Winter meeting" in await page.locator("body").inner_text(), "Winter meeting is not rendered"
        for theme in ["light", "dark"]:
            await page.evaluate("(theme) => {document.documentElement.dataset.theme=theme;}", theme)
            await check("winter-" + theme)
        await page.evaluate("""() => {
          FO.sum2Auto(FO.rnd,true);
          if(FO.G.phase!=='season') throw Error('Winter failed to return to the season');
          FO.G.phase='review'; // direct navigation for visual inspection only; engine career tests advance real weeks
          FO.startSeason();
          if(FO.G.phase!=='summer'||FO.G.sum.win) throw Error('Summer failed to open');
          localStorage.setItem('frontoffice_save_v1', FO.save());
        }""")
        await page.reload()
        await page.locator('[data-a=continue]').click()
        assert await page.evaluate("FO.G.phase") == "summer"
        assert await page.locator(".steps").count() > 0, "Summer meeting progress/navigation is missing"
        assert "Summer meeting" in await page.locator("body").inner_text(), "Summer meeting is not rendered"
        for theme in ["light", "dark"]:
            await page.evaluate("(theme) => {document.documentElement.dataset.theme=theme;}", theme)
            await check("summer-" + theme)
        assert not errors, "JavaScript page errors: " + "; ".join(errors)
        print("ALL MOBILE UI SMOKE CHECKS PASSED")
        await browser.close()

asyncio.run(main())
