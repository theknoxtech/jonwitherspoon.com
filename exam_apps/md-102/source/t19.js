const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/index.html');
const r=await p.evaluate(()=>{
 const q=Q.find(x=>x.type==='order'&&/device preparation \(user-driven/.test(x.q));
 const mk=seq=>({q,type:'order',seq});
 const a=q.steps.slice();const sw=a.slice();[sw[4],sw[5]]=[sw[5],sw[4]];
 const bad=a.slice();[bad[1],bad[2]]=[bad[2],bad[1]];
 return {orig:grade(mk(a)),swapped:grade(mk(sw)),bad:grade(mk(bad)),partial:grade(mk(a.slice(0,5)))};
});
console.log(r,errs);await b.close();})();
