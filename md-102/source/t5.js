const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1000,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  const url='file://'+process.cwd()+'/index.html';
  await p.goto(url); await p.waitForSelector('.grid');
  await p.click('[data-act=start][data-mode=diagnostic]');
  for (let i=0;i<4;i++){
    const o = await p.$('.opt'); if(o) await o.click(); else { console.log('no .opt (order?)'); }
    await p.click('[data-act=submit]').catch(()=>{});
  }
  const before = await p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('md102.lab.v1')).run; return {i:r.i, done:r.items.filter(x=>x.done).length, n:r.items.length};});
  console.log('saved before reload', before);
  await p.reload(); await p.waitForSelector('.grid');
  console.log('resume card', await p.textContent('[data-act=resume]'), (await p.textContent('.panel')).slice(0,120));
  await p.click('[data-act=resume]');
  console.log('after resume', await p.evaluate(()=>document.body.innerText.match(/Question \d+ of \d+|\d+ \/ \d+/)?.[0]));
  const done = await p.evaluate(()=>JSON.parse(localStorage.getItem('md102.lab.v1')).run.items.filter(x=>x.done).length);
  console.log('done after resume', done);
  await p.click('[data-act=end]'); await p.waitForSelector('.score').catch(()=>{});
  console.log('run cleared', await p.evaluate(()=>!('run' in JSON.parse(localStorage.getItem('md102.lab.v1')))));
  await p.reload(); await p.waitForSelector('.grid');
  console.log('no resume card after finish', (await p.$('[data-act=resume]'))===null);
  console.log('errors', errs);
  await b.close();
})();
