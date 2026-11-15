const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1000,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.setContent('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width">'+require('fs').readFileSync('index.html','utf8'));
  await p.waitForSelector('.grid');
  await p.click('[data-mode=quick]');
  for (let i=0;i<10;i++){ await p.click('.opt[data-i="0"]'); await p.click('[data-act=submit]'); if(i===0) console.log('fb', (await p.textContent('.fb')).slice(0,90)); await p.click('[data-act=next]'); }
  console.log('score', await p.textContent('.score'));
  await p.click('[data-act=home]');
  await p.selectOption('#selObj', {index:1}); await p.click('[data-sel=selObj]');
  await p.keyboard.press('b'); await p.keyboard.press('Enter');
  console.log('after enter', (await p.textContent('.fb h3')));
  await p.evaluate(()=>location.hash='progress'); await p.waitForSelector('.dom');
  await p.evaluate(()=>location.hash='reference'); await p.waitForSelector('.tbl');
  await p.setViewportSize({width:390,height:800});
  console.log('sw', await p.evaluate(()=>document.documentElement.scrollWidth), errs);
  await p.evaluate(()=>location.hash='practice'); await p.click('[data-act=end]'); await p.click('[data-act=home]'); await p.click('[data-mode=quick]');
  console.log('sw q', await p.evaluate(()=>document.documentElement.scrollWidth));
  await p.screenshot({path:'q.png', fullPage:false});
  await b.close();
})();
