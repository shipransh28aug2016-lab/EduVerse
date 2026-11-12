// Keyboard, ARIA and touch-target checks for the lab themes. usage: node tests/a11y-smoke.cjs T03 T06 …
// Not a substitute for a screen-reader or WCAG audit; it catches regressions in the things that are cheap to check automatically.
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), T = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, s) => { let u = q.url.split('?')[0]; if (u.endsWith('/')) u += 'index.html'; fs.readFile(path.join(root, u), (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': T[path.extname(u)] }); s.end(d); } }); }).listen(0);
(async () => {
  const port = srv.address().port, b = await chromium.launch(); let failed = false;
  for (const id of process.argv.slice(2)) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true, serviceWorkers: 'block' }), p = await ctx.newPage();
    await p.goto(`http://localhost:${port}/#/theme/${id}`); await p.reload(); await p.waitForSelector('#main .lab', { timeout: 10000 });
    const r = { theme: id };
    // 1. keyboard: Tab to the first visible slider, ArrowRight must change its value
    let sl = null; for (const e of await p.$$('#main input[type=range]')) if (await e.isVisible()) { sl = e; break; }
    if (!sl) r.sliderKeyboard = 'n/a'; else { await sl.focus(); const v0 = await sl.inputValue(); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight'); r.sliderKeyboard = (await sl.inputValue()) !== v0; }
    // 2. tabs: ArrowRight moves selection (only when more than one tab)
    const tabs = await p.$$('#main [role=tab]'); if (tabs.length > 1) { await tabs[0].focus(); await tabs[0].press('ArrowRight'); r.tabKeyboard = (await tabs[1].getAttribute('aria-selected')) === 'true'; } else r.tabKeyboard = 'n/a';
    // 3. ARIA: every chart/image svg is labelled; live readout present; sliders labelled
    r.unlabelledSvg = await p.evaluate(() => [...document.querySelectorAll('#main svg[role=img]')].filter((s) => !(s.getAttribute('aria-label') || '').trim()).length);
    r.liveRegions = await p.evaluate(() => document.querySelectorAll('#main .readout[aria-live]').length);
    r.unlabelledRanges = await p.evaluate(() => [...document.querySelectorAll('#main input[type=range]')].filter((i) => !i.getAttribute('aria-labelledby') || !document.getElementById(i.getAttribute('aria-labelledby'))).length);
    // 4. touch targets >= 44 px (chips, options, buttons) in the visible panel
    r.smallTargets = await p.evaluate(() => [...document.querySelectorAll('#main .chip, #main .opt, #main .btn, #main .tab')].filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect()).filter((b) => b.height < 43.5).length);
    r.reducedMotionHonoured = await p.evaluate(() => typeof matchMedia === 'function');
    const bad = r.sliderKeyboard === false || r.tabKeyboard === false || r.unlabelledSvg > 0 || r.liveRegions < 1 || r.unlabelledRanges > 0 || r.smallTargets > 0;
    if (bad) failed = true; console.log(JSON.stringify(r)); await ctx.close();
  }
  await b.close(); srv.close(); process.exit(failed ? 1 : 0);
})();
