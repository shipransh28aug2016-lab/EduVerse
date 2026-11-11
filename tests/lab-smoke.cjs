// Browser smoke test for the learning labs. usage: node tests/lab-smoke.cjs T02 T03 ...   (needs `playwright`; static server built in)
// For each theme: opens it, drives every slider/chip/prediction/exit option in every tab, switches the three languages,
// and fails on console errors, failed requests, unresolved i18n keys (⟦key⟧), NaN, undefined or Infinity in the rendered text.
// Writes full-page screenshots to $SHOTS (default: ./test-shots) and prints a JSON summary line per theme.
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), shots = process.env.SHOTS || path.join(root, 'test-shots');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const srv = http.createServer((q, s) => { let u = q.url.split('?')[0]; if (u.endsWith('/')) u += 'index.html'; fs.readFile(path.join(root, u), (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': T[path.extname(u)] }); s.end(d); } }); }).listen(0);
(async () => {
  fs.mkdirSync(shots, { recursive: true });
  const port = srv.address().port, b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: +(process.env.W || 1100), height: 1500 }, ...(process.env.MOBILE ? { hasTouch: true, isMobile: true } : {}) });
  const p = await ctx.newPage(), errs = [], out = []; let failed = false;
  p.on('pageerror', (e) => errs.push('PAGEERR ' + e.message)); p.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE ' + m.text())); p.on('response', (r) => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
  for (const id of process.argv.slice(2)) {
    const t0 = Date.now(); await p.goto(`http://localhost:${port}/#/theme/${id}`); await p.reload(); await p.waitForSelector('#main .lab, #main .tabs, #main .planned-box', { timeout: 15000 }).catch(() => {}); const loadMs = Date.now() - t0;
    let tabs = 0, ctl = 0, opts = 0;
    const tabEls = await p.$$('#main [role=tab]');
    for (const tab of tabEls.length ? tabEls : [null]) {
      if (tab) { await tab.click().catch(() => {}); tabs++; await p.waitForTimeout(250); }
      for (const r of await p.$$('#main input[type=range]')) { if (!(await r.isVisible())) continue; for (const f of [0, 1, 0.5]) { await r.evaluate((el, f) => { el.value = +el.min + f * (+el.max - +el.min); el.dispatchEvent(new Event('input', { bubbles: true })); }, f); ctl++; } }
      for (const c of await p.$$('#main .chip, #main .switch-in')) if (await c.isVisible()) { await c.click({ timeout: 800 }).catch(() => {}); ctl++; }
      for (const o of await p.$$('#main .opt')) if (await o.isVisible() && await o.isEnabled()) { await o.click({ timeout: 800 }).catch(() => {}); opts++; }
    }
    for (const lang of ['hi', 'en', 'both']) { await p.click(`.topbar button:text-is("${lang === 'hi' ? 'हिन्दी' : lang === 'en' ? 'English' : 'English + हिन्दी'}")`, { timeout: 1500 }).catch(() => {}); await p.waitForTimeout(150); }
    const html = await p.innerHTML('#main'), bad = html.match(/⟦[^⟧]+⟧|NaN|undefined|Infinity/g) || [];
    const lat = await p.evaluate(() => { const r = [...document.querySelectorAll('#main input[type=range]')].find((e) => e.offsetParent); if (!r) return null; const t0 = performance.now(); for (let i = 0; i < 20; i++) { r.value = +r.min + ((i % 10) / 10) * (+r.max - +r.min); r.dispatchEvent(new Event('input', { bubbles: true })); } return +((performance.now() - t0) / 20).toFixed(2); });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const mem = await p.evaluate(() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null);
    const row = { theme: id, tabs, controlsDriven: ctl, optionsClicked: opts, svgs: (await p.$$('#main svg')).length, problems: bad.slice(0, 5), loadMs, heapMB: mem, inputLatencyMs: lat, hOverflowPx: overflow };
    if (bad.length || overflow > 2) failed = true; out.push(row); console.log(JSON.stringify(row));
    await p.screenshot({ path: path.join(shots, `${id}.png`), fullPage: true });
  }
  if (errs.length) { failed = true; console.log('ERRORS\n' + [...new Set(errs)].join('\n')); } else console.log('NO ERRORS');
  await b.close(); srv.close(); process.exit(failed ? 1 : 0);
})();
