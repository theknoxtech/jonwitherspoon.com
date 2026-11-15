const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://'+process.cwd()+'/index.html');await p.waitForSelector('.grid');
await p.click('[data-act=start][data-mode=seq]');await p.waitForSelector('.qtext');
console.log(await p.textContent('.note b'), '|', (await p.textContent('.panel .note:not(b)')).slice(0,60));
console.log(errs);await b.close();})();
