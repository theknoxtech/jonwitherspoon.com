const fs=require('fs');
let code=['h.js','q1.js','q2.js','q3.js','q4.js','q5.js','q6.js','q7.js','q8.js','q9.js','q10.js','q11.js','q12.js','q13.js','q14.js','q15.js','q16.js','q17.js','q18.js','q19.js','q21.js','q22.js','q23.js','q24.js','q25.js','q26.js','q20.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+'\nmodule.exports=Q;';
fs.writeFileSync('/tmp/_q.js',code);
const Q=require('/tmp/_q.js');
const cnt={};Q.forEach(q=>cnt[q.d]=(cnt[q.d]||0)+1);
console.log(Q.length,cnt);
Q.filter(q=>!q.type).forEach(q=>{const m=Math.max(...q.c.map(x=>x.length));const w=Math.max(...q.w.map(x=>x.length));if(m>w)console.log(q.id,q.d,'LONG',m,w,q.c[0].slice(0,50));
 if(!q.l)console.log(q.id,'nolink');});
