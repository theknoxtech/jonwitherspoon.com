const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:390,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.setContent('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width">'+require('fs').readFileSync('index.html','utf8'));
  await p.waitForSelector('[data-mode=seq]');
  await p.click('[data-mode=seq]');
  let right=0, n=0;
  while (await p.evaluate(()=>!!S && S.items[S.i].type==='order')) {
    const steps = await p.evaluate(()=>S.items[S.i].q.steps);
    if (n===1) { // wrong order on purpose: reverse
      steps.reverse();
    }
    for (const t of steps) { await p.click('button.stepb[data-t="'+t.replace(/"/g,'\\"')+'"]'); }
    await p.click('[data-act=submit]');
    const h = await p.textContent('.fb b'); if (h==='Correct order') right++;
    n++;
    if (n===1) console.log('screenshot'), await p.screenshot({path:'o.png'});
    await p.click('[data-act=next]');
    if (n>20) break;
  }
  console.log('sequences', n, 'right', right, 'score', await p.textContent('.score b'));
  console.log('review', (await p.$$('.rev')).length);
  await p.click('[data-act=home]');
  await p.click('[data-mode=weak14]');
  for (let i=0;i<3;i++){ const ord = await p.evaluate(()=>S.items[S.i].type==='order'); if (ord){ const st = await p.evaluate(()=>S.items[S.i].q.steps); for (const t of st) await p.click('button.stepb[data-t="'+t.replace(/"/g,'\\"')+'"]'); } else await p.click('.opt[data-i="0"]'); await p.click('[data-act=submit]'); await p.click('[data-act=next]'); }
  await p.evaluate(()=>location.hash='plan'); await p.waitForSelector('details');
  console.log('sw', await p.evaluate(()=>document.documentElement.scrollWidth), errs);
  await b.close();
})();
