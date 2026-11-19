const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:390,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.addInitScript(()=>{ window.__saved=null; window.claude={use:async n=> n==='downloads'?{save:async r=>{window.__saved=r;return {status:'saved'}}}:null}; });
  await p.setContent('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width">'+require('fs').readFileSync('index.html','utf8'));
  console.log('Q', await p.evaluate(()=>Q.length), 'labs', await p.evaluate(()=>LABS.length));
  await p.evaluate(()=>location.hash='labs'); await p.waitForSelector('details.lab');
  console.log('total', await p.textContent('#labTotal'));
  await p.click('details.lab summary'); await p.click('input[data-lab="1-0-0"]'); await p.click('input[data-lab="1-0-1"]');
  console.log('after', await p.textContent('#labTotal'), await p.textContent('#lc1'));
  console.log('sw labs', await p.evaluate(()=>document.documentElement.scrollWidth));
  // sequences new
  const bad = await p.evaluate(()=>Q.filter(q=>q.type==='order').filter(q=>q.notes.length!==q.steps.length).map(q=>q.id));
  console.log('bad notes', bad);
  await p.evaluate(()=>{S=null;view='home';}); await p.evaluate(()=>{window.__saved=null; window.claude={use:async n=> n==='downloads'?{save:async r=>{window.__saved=r;return {status:'saved'}}}:null};});
  await p.evaluate(()=>location.hash='progress'); await p.waitForSelector('#exp');
  await p.waitForSelector('#dlbtn:not([hidden])');
  await p.click('#dlbtn'); await p.waitForFunction(()=>window.__saved);
  const sv = await p.evaluate(()=>window.__saved); console.log('saved', sv.filename, JSON.parse(sv.data).lab);
  // restore from file after clearing
  await p.evaluate(()=>{store.lab={}; save();});
  require('fs').writeFileSync('/tmp/bk.json', sv.data);
  await p.setInputFiles('#impfile','/tmp/bk.json'); await p.waitForTimeout(300);
  console.log('restored lab', await p.evaluate(()=>Object.keys(store.lab)), await p.textContent('#filemsg'));
  require('fs').writeFileSync('/tmp/bad.json','{"x":1}');
  await p.setInputFiles('#impfile','/tmp/bad.json'); await p.waitForTimeout(300);
  console.log('bad msg', await p.textContent('#filemsg'));
  await p.evaluate(()=>location.hash='practice'); await p.waitForSelector('[data-mode=diagnostic]');
  await p.click('[data-mode=diagnostic]');
  console.log('diag', await p.evaluate(()=>[S.items.length, new Set(S.items.map(i=>i.q.t)).size, new Set(Q.map(q=>q.t)).size]));
  await p.click('[data-act=end]').catch(()=>{});
  await p.evaluate(()=>{S=null;view='home';location.hash='practice';render();}); await p.waitForSelector('[data-mode=weak14]'); await p.click('[data-mode=weak14]');
  console.log('weak14', await p.evaluate(()=>S.label));
  await p.evaluate(()=>location.hash='plan'); await p.waitForSelector('.week');
  const cnt=async()=>[await p.$$eval('.week h3',e=>e.length), await p.textContent('h2.sec:nth-of-type(3)').catch(()=>'')];
  console.log('plan default', await p.$$eval('.week h3',e=>e.map(x=>x.textContent.slice(0,40)).slice(0,3)), await p.$$eval('h2.sec',e=>e.map(x=>x.textContent).filter(t=>/Plan from/.test(t))));
  for (const d of ['2026-11-20','2027-03-01','2026-11-11']){ await p.fill('#examDate', d); await p.dispatchEvent('#examDate','change'); await p.waitForTimeout(100);
    console.log(d, await p.$$eval('.week h3',e=>e.length), await p.$$eval('h2.sec',e=>e.map(x=>x.textContent).filter(t=>/Plan from|passed/.test(t))), await p.$$eval('.week li input',e=>e.length)); }
  console.log('sw prog', await p.evaluate(()=>document.documentElement.scrollWidth), errs);
  await b.close();
})();
