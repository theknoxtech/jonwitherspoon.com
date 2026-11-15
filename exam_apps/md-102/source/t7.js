const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ acceptDownloads: true });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => m.type()==='error' && errs.push(m.text()));
  await p.goto('file://' + process.cwd() + '/standalone.html'); await p.waitForTimeout(600);
  console.log('title', await p.title(), '| topics', await p.$$eval('#selTopic option', o => o.length));
  await p.click('text=Progress').catch(()=>{}); await p.waitForTimeout(300);
  const btn = await p.$('#dlbtn');
  if (btn && await btn.isVisible()) { const [d] = await Promise.all([p.waitForEvent('download'), btn.click()]); console.log('download', d.suggestedFilename()); } else console.log('dlbtn hidden');
  console.log('errors', errs); await b.close();
})();
