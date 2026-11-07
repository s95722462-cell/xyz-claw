// 휴대폰 화면: 조이스틱 끝까지 밀어도 알람 없음, 조이스틱·뽑기 한 줄, 한 판 진행
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ ...devices['Pixel 7'] }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file:///' + require('path').resolve(process.argv[2] || 'index.html').split(String.fromCharCode(92)).join('/'));
  await pg.waitForFunction(() => phase === 'aim', null, { timeout: 120000 });
  const box = async s => { const r = await pg.locator(s).boundingBox(); return r && [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
  console.log('조이스틱', await box('.stick'), '뽑기', await box('#grab'), '화면폭', pg.viewportSize().width);
  const el = pg.locator('[data-mom="M3020"]'); await el.dispatchEvent('pointerdown');
  await pg.waitForFunction(() => AX[0].pos >= 214, null, { timeout: 120000 }); await pg.waitForTimeout(4000); await el.dispatchEvent('pointerup'); await pg.waitForTimeout(800);
  const s1 = await pg.evaluate(() => ({ x: AX[0].pos.toFixed(1), err: AX[0].err, alarm: getB('M3075'), phase }));
  console.log('X+ 끝까지 꾹 (4초 더)', JSON.stringify(s1));
  await pg.screenshot({ path: 'mobile.png', fullPage: false });
  await pg.locator('#grab').tap(); await pg.waitForFunction(() => phase !== 'run', null, { timeout: 180000 });
  console.log('한 판 끝', await pg.evaluate(() => ({ phase, alarm: getB('M3075'), toast: document.getElementById('toast').textContent })));
  console.log('errors', errs); await b.close();
})();
