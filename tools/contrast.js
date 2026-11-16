// Measures WCAG contrast on the real department screens (390 px, light and dark) and forces the
// "wants a word" and vacant states so they are covered. Needs dist/index.html (python3 build.py).
// Usage: node tools/contrast.js [outdir]   -> prints a table of failures; exit code 1 if any text fails.
const path = require('path');
let chromium; for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch (e) { } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const OUT = process.argv[2] || null, URL = 'file://' + path.resolve(__dirname, '..', 'dist', 'index.html');
const cnt = (pg, s) => pg.locator(s).count();
async function clear(pg) { for (let i = 0; i < 6; i++) { if (!(await cnt(pg, '.veil'))) return; for (const sel of ['.veil [data-a=review]', '[data-a=tick-skip]', '[data-a=tick-close]', '.veil [data-a=close]', '[data-a=close]']) { if (await cnt(pg, sel)) { try { await pg.click(sel, { timeout: 2000 }); } catch (e) { } await pg.waitForTimeout(200); break; } } } }
async function week(pg) {
  await clear(pg); if (!(await cnt(pg, '[data-a=play]'))) return;
  try { await pg.click('[data-a=play]', { timeout: 3000 }); } catch (e) { return; }
  if (await cnt(pg, '[data-a=md-kick]')) { await pg.click('[data-a=md-kick]'); await pg.waitForTimeout(300); for (let i = 0; i < 6; i++) { if (await cnt(pg, '[data-a=md-skip]')) { await pg.click('[data-a=md-skip]'); await pg.waitForTimeout(200); } if (await cnt(pg, '[data-a=md-after]')) { await pg.click('[data-a=md-after]'); await pg.waitForTimeout(200); continue; } if (await cnt(pg, '[data-a=md-done]')) { await pg.click('[data-a=md-done]'); await pg.waitForTimeout(200); break; } } }
  await pg.waitForTimeout(300);
  if (await cnt(pg, '.veil [data-a=end]')) await pg.click('.veil [data-a=end]');
  for (let i = 0; i < 4; i++) { if (await cnt(pg, '[data-a=tick-skip]')) await pg.click('[data-a=tick-skip]'); if (await cnt(pg, '[data-a=tick-close]')) { await pg.click('[data-a=tick-close]'); break; } }
  await clear(pg); if (await cnt(pg, '[data-a=tour-ok]')) await pg.click('[data-a=tour-ok] >> nth=0');
}
// runs in the page: every text element inside .dflat with its colour, effective background and size
const MEASURE = `(() => {
  const parse = c => { let m = /rgba?\\(([^)]+)\\)/.exec(c); if (m) { const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    m = /color\\(srgb ([^)]+)\\)/.exec(c); if (m) { const p = m[1].split(/[ \\/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; } return null; };
  const over = (f, b) => { const a = f[3]; return [f[0] * a + b[0] * (1 - a), f[1] * a + b[1] * (1 - a), f[2] * a + b[2] * (1 - a), 1]; };
  const bgOf = el => { const stack = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; } } let b = [255, 255, 255, 1]; if (!stack.length || stack[stack.length - 1][3] < 1) { const c = parse(getComputedStyle(document.body).backgroundColor); if (c) b = c; } for (let i = stack.length - 1; i >= 0; i--) b = over(stack[i], b); return b; };
  const out = [], root = document.querySelector('.dflat'); if (!root) return out;
  const q = root.querySelectorAll('*');
  for (const el of q) {
    const own = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
    if (!own) continue; const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el); let fg = parse(cs.color); if (!fg) continue; const bg = bgOf(el); fg = over(fg, bg);
    out.push({ t: own.slice(0, 40), cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 40) || el.tagName.toLowerCase(), fg, bg, size: parseFloat(cs.fontSize), w: parseInt(cs.fontWeight) || 400, op: parseFloat(cs.opacity) });
  }
  return out;
})()`;
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] }); const fails = [], seen = new Set(); let total = 0; const errs = [];
  for (const scheme of ['light', 'dark']) {
    const pg = await (await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme, deviceScaleFactor: 2 })).newPage(); pg.on('pageerror', e => errs.push(String(e)));
    await pg.goto(URL); await pg.evaluate('localStorage.clear()'); await pg.reload(); await pg.waitForTimeout(300);
    await pg.click('[data-a=new]'); await pg.click('[data-a=s-next]');
    for (let i = 0; i < 7; i++) { await pg.click('[data-a=dna] >> nth=1'); await pg.click('[data-a=s-next]'); }
    await pg.click('[data-a=found]');
    for (const r of ['dof', 'coach', 'scout', 'acad', 'com', 'mkt', 'fin']) { await pg.click(`[data-a=hire-tab][data-r=${r}]`); await pg.click(`[data-a=pick][data-r=${r}][data-i="0"]`); }
    await pg.click('[data-a=hire-all]'); await pg.click('[data-a=mand-done]');
    await pg.evaluate('(()=>{FO.sumAuto(FO.rnd,true); render();})()');
    while (await cnt(pg, '[data-a=press]')) { await pg.click('[data-a=press] >> nth=0'); await pg.click('[data-a=press-next]'); }
    if (await cnt(pg, '[data-a=tour-ok]')) await pg.click('[data-a=tour-ok] >> nth=0');
    for (let w = 0; w < 4; w++) await week(pg);
    await clear(pg);
    // force states: several heads want a word (two in recruitment), one department without a head
    await pg.evaluate(`(() => { const G = FO.G; for (const r of ['coach', 'dof', 'scout', 'acad', 'fin']) { try { FO.convoAsk(r, { k: 'cold' }); } catch (e) {} } delete G.staff.mkt; render(); })()`);
    await pg.click('[data-a=tab][data-t=staff]'); await pg.waitForTimeout(200);
    const shots = [];
    const snap = async tag => { await pg.waitForTimeout(120); const rows = await pg.evaluate(MEASURE); if (OUT) await pg.screenshot({ path: `${OUT}/${scheme}_${tag}.png`, fullPage: true }); const ov = await pg.evaluate('(()=>{const d=document.documentElement;return d.scrollWidth>d.clientWidth+1?d.scrollWidth:0})()'); shots.push([tag, rows.length, ov]);
      for (const r of rows) { total++; const rt = ratio(r.fg, r.bg), large = r.size >= 24 || (r.size >= 18.66 && r.w >= 700), need = large ? 3 : 4.5; const key = [scheme, tag, r.cls, r.fg.map(Math.round), r.bg.map(Math.round), r.size].join('|'); if (rt < need - 0.005 && !seen.has(key)) { seen.add(key); fails.push({ scheme, screen: tag, el: r.cls, text: r.t, ratio: +rt.toFixed(2), need, size: r.size }); } } };
    await snap('list');
    for (const [k, tag] of [['first', 'first'], ['recruit', 'recruit'], ['academy', 'academy'], ['commercial', 'commercial'], ['marketing', 'vacant']]) {
      await pg.click(`[data-a=dept][data-k=${k}]`); await pg.waitForTimeout(150);
      await snap(tag + '_overview');
      await pg.click('[data-a=dtab][data-v=plan]'); await pg.waitForTimeout(100);
      for (const id of ['how', 'ppl', 'mon']) { const sel = `[data-a=dsec][data-k=${k}${id}]`; if (await cnt(pg, sel) && (await pg.getAttribute(sel, 'aria-expanded')) !== 'true') await pg.click(sel); }
      await snap(tag + '_setup');
      await pg.click('[data-a=dtab][data-v=record]'); await snap(tag + '_record');
      await pg.click('[data-a=dept][data-k=""]');
    }
  }
  await b.close();
  console.log(`measured ${total} text elements on ${new Set(fails.map(f => f.screen)).size ? '' : ''}department screens (light and dark); ${fails.length} distinct failures; page errors: ${errs.length}`);
  if (fails.length) { console.log('scheme | screen | element | text | ratio | need | px'); for (const f of fails) console.log([f.scheme, f.screen, f.el, JSON.stringify(f.text), f.ratio, f.need, f.size].join(' | ')); }
  process.exit(fails.length ? 1 : 0);
})();
