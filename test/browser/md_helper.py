import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
async def md_through(pg):
    if not await pg.locator('[data-a=md-kick]').count(): return
    await pg.click('[data-a=md-kick]'); await pg.wait_for_timeout(300)
    for _ in range(6):
        if await pg.locator('[data-a=md-skip]').count(): await pg.click('[data-a=md-skip]'); await pg.wait_for_timeout(200)
        if await pg.locator('[data-a=md-after]').count(): await pg.click('[data-a=md-after]'); await pg.wait_for_timeout(200); continue
        if await pg.locator('[data-a=md-done]').count(): await pg.click('[data-a=md-done]'); await pg.wait_for_timeout(200); break
