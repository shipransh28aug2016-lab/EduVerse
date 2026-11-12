// Degraded-device / degraded-network behaviour. usage: node tests/perf-throttle.cjs
//  1. Cold load of home and two themes under "slow 3G-like" (400 kbit/s, 400 ms RTT) and 6x CPU slowdown (≈ low-end Android).
//  2. Input-to-redraw latency of a slider under the same CPU slowdown.
//  3. Offline: after one online visit the service worker must serve home and a lab theme with the network switched off.
// CPU throttling is an emulation, not a measurement on real hardware.
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(__dirname, '..'), T = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, s) => { let u = q.url.split('?')[0]; if (u.endsWith('/')) u += 'index.html'; fs.readFile(path.join(root, u), (e, d) => { if (e) { s.writeHead(404); s.end(); } else { const gz = /gzip/.test(q.headers['accept-encoding'] || '') && /\.(js|css|json|html)$/.test(u); s.writeHead(200, { 'content-type': T[path.extname(u)], 'cache-control': 'no-cache', ...(gz ? { 'content-encoding': 'gzip' } : {}) }); s.end(gz ? zlib.gzipSync(d) : d); } }); }).listen(0);   // gzip like GitHub Pages
(async () => {
  const port = srv.address().port, base = `http://localhost:${port}/`, b = await chromium.launch(), out = {};
  const throttled = async (label, hash, ready) => {
    const ctx = await b.newContext({ serviceWorkers: 'block' }), p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    const t0 = Date.now(); await p.goto(base + hash); await p.waitForSelector(ready, { timeout: 120000 }); out[label] = { secondsToUsable: +((Date.now() - t0) / 1000).toFixed(1) };
    if (hash.includes('theme')) { await p.waitForSelector('#main input[type=range]'); out[label].inputLatencyMs = await p.evaluate(() => { const r = document.querySelector('#main input[type=range]'); const t = performance.now(); for (let i = 0; i < 10; i++) { r.value = +r.min + (i / 10) * (+r.max - +r.min); r.dispatchEvent(new Event('input', { bubbles: true })); } return +((performance.now() - t) / 10).toFixed(1); }); }
    await ctx.close();
  };
  await throttled('home (cold, slow network, 6x CPU)', '', '.card');
  await throttled('T09 Price Puzzle (cold)', '#/theme/T09', '#main .lab');
  await throttled('T16 Finance (cold)', '#/theme/T16', '#main .lab');
  await throttled('T11 Ecosystems (cold)', '#/theme/T11', '#main .lab');
  // offline
  const ctx = await b.newContext(), p = await ctx.newPage(); await p.goto(base); await p.evaluate(() => navigator.serviceWorker.ready); await p.waitForTimeout(1500);
  const cached = await p.evaluate(async () => (await (await caches.keys()).length ? (await (await caches.open((await caches.keys())[0])).keys()).length : 0));
  await ctx.setOffline(true);
  await p.reload(); const homeOk = await p.waitForSelector('.card', { timeout: 8000 }).then(() => true).catch(() => false);
  await p.goto(base + '#/theme/T16'); await p.reload(); const labOk = await p.waitForSelector('#main .lab', { timeout: 8000 }).then(() => true).catch(() => false);
  const range = await p.$('#main input[type=range]'); if (range) await range.evaluate((el) => { el.value = el.max; el.dispatchEvent(new Event('input', { bubbles: true })); });
  out.offline = { cachedFiles: cached, homeLoads: homeOk, labLoads: labOk, labInteractive: !!range && /₹|%/.test(await p.innerText('#main')) };
  console.log(JSON.stringify(out, null, 1)); await b.close(); srv.close();
})();
