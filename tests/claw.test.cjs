const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] }); const pg = await b.newPage({ viewport: { width: 1300, height: 950 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
  await pg.goto('file:///' + require('path').resolve(process.argv[2] || 'index.html').split(String.fromCharCode(92)).join('/'));
  const st = async tag => console.log(tag, JSON.stringify(await pg.evaluate(() => ({ pos: document.getElementById('pos').textContent, cr: document.getElementById('cr').textContent, win: document.getElementById('win').textContent, hint: document.getElementById('hint').textContent, steps: document.getElementById('steps').textContent, al: document.getElementById('al').textContent, toast: document.getElementById('toast').textContent, phase }))));
  await pg.waitForFunction(() => phase === 'aim', null, { timeout: 120000 }); await st('원점 후');
  // 가장 가까운 인형 위로 조준: 인형 좌표를 읽어 JOG
  const tgt = await pg.evaluate(() => { const d = items.filter(d=>d.h<d.half+1).slice().sort((a, b) => (a.x + a.y) - (b.x + b.y))[0]; return [d.x, d.y]; });
  console.log('목표 인형', tgt);
  const jog = async (key, mm, ax) => { await pg.keyboard.down(key); await pg.waitForFunction(([a, m]) => AX[a].pos >= m, [ax, mm], { timeout: 120000 }); await pg.keyboard.up(key); await pg.waitForTimeout(800); };
  await jog('ArrowRight', tgt[0] - 2, 0); await jog('ArrowDown', tgt[1] - 2, 1); await st('조준');
  await pg.screenshot({ path: 'c4_aim.png' });
  await pg.click('#grab'); await pg.waitForFunction(() => D[3170] >= 50 || phase !== 'run', null, { timeout: 120000 }); await pg.screenshot({ path: 'c4_grab.png' }); await st('잡는 중');
  await pg.waitForFunction(() => phase !== 'run', null, { timeout: 180000 }); await st('끝'); await pg.screenshot({ path: 'c4_end.png' });
  console.log('errors', errs.slice(0, 5)); await b.close();
})();
