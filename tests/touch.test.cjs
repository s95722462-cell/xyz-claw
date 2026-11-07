// 휴대폰 실제 터치(CDP touchStart/End)로 방향키를 여러 번 눌러 매번 움직이는지
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ ...devices['Pixel 7'] }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file:///' + require('path').resolve(process.argv[2] || 'index.html').split(String.fromCharCode(92)).join('/'));
  await pg.waitForFunction(() => phase === 'aim', null, { timeout: 120000 });
  const cdp = await ctx.newCDPSession(pg);
  const hold = async (sel, ms) => {
    const r = await pg.locator(sel).boundingBox(); const p = { x: r.x + r.width / 2, y: r.y + r.height / 2, id: 1 };
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [p] });
    await pg.waitForTimeout(ms);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await pg.waitForTimeout(1200);
    return pg.evaluate(() => ({ x: AX[0].pos.toFixed(1), y: AX[1].pos.toFixed(1), bits: ['M3020','M3021','M3022','M3023'].map(getB).join(''), y68: getB('Y68') + '' + getB('Y6A'), mode: AX.map(a => a.mode), phase }));
  };
  console.log('한 판 전', JSON.stringify(await hold('[data-mom="M3020"]', 1500)));
  await pg.locator('#grab').tap(); await pg.waitForFunction(() => phase !== 'run', null, { timeout: 200000 });
  console.log('한 판 뒤 Z', await pg.evaluate(() => [AX[2].pos, D[3152], D[3153], getB('M3070'), getB('M3064'), getB('M3016'), getB('M3060'), getB('M3005'), getB('M3040'), phase].join(' ')));
  for (const [s, n] of [['[data-mom="M3020"]', '▶'], ['[data-mom="M3022"]', '▼'], ['[data-mom="M3020"]', '▶'], ['[data-mom="M3021"]', '◀'], ['[data-mom="M3022"]', '▼']])
    console.log(n, JSON.stringify(await hold(s, 2500)));
  const ok = await pg.evaluate(() => AX[0].pos);
  console.log(ok > 17.5 ? '한 판 뒤에도 움직임 OK' : '한 판 뒤 안 움직임 (실패)');
  console.log('errors', errs); await b.close();
})();
