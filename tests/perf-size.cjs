// Network payload per page (raw and gzip bytes) for the home page and each theme, plus the cost of opening the 3D tab in T02.
// usage: node tests/perf-size.cjs   → prints JSON. The built-in server does not compress, so gzip is computed locally (what GitHub Pages sends).
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(__dirname, '..'), T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const srv = http.createServer((q, s) => { let u = q.url.split('?')[0]; if (u.endsWith('/')) u += 'index.html'; fs.readFile(path.join(root, u), (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': T[path.extname(u)] }); s.end(d); } }); }).listen(0);
(async () => {
  const port = srv.address().port, b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }), res = {};
  const measure = async (label, act) => {
    const ctx = await b.newContext(), p = await ctx.newPage(), seen = new Map();
    p.on('response', async (r) => { try { const u = new URL(r.url()); if (u.port != port) return; const body = await r.body(); seen.set(u.pathname, { raw: body.length, gz: zlib.gzipSync(body, { level: 9 }).length }); } catch {} });
    await act(p); await p.waitForTimeout(800);
    const all = [...seen.values()], sum = (k) => all.reduce((a, x) => a + x[k], 0);
    res[label] = { requests: seen.size, rawKB: +(sum('raw') / 1024).toFixed(1), gzipKB: +(sum('gz') / 1024).toFixed(1), largest: [...seen.entries()].sort((a, c) => c[1].gz - a[1].gz).slice(0, 3).map(([k, v]) => `${k} ${(v.gz / 1024).toFixed(1)}KB gz`) };
    await ctx.close();
  };
  await measure('home', (p) => p.goto(`http://localhost:${port}/`));
  for (const id of ['T02', 'T03', 'T04', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T13', 'T15', 'T16']) await measure(id, (p) => p.goto(`http://localhost:${port}/#/theme/${id}`).then(() => p.reload()));
  await measure('T02+3D tab', async (p) => { await p.goto(`http://localhost:${port}/#/theme/T02`); await p.reload(); await p.waitForTimeout(800); await (await p.$$('[role=tab]'))[1].click(); await p.waitForTimeout(2500); });
  console.log(JSON.stringify(res, null, 1)); await b.close(); srv.close();
})();
