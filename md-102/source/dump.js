const fs=require('fs');
let code=['h.js','q1.js','q2.js','q3.js','q4.js','q5.js','q6.js','q7.js','q8.js','q9.js','q10.js','q11.js','q12.js','q13.js','q14.js','q15.js','q16.js','q17.js','q18.js','q19.js','q21.js','q22.js','q23.js','q24.js','q25.js','q20.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+'\nmodule.exports=Q;';
fs.writeFileSync('/tmp/_q2.js',code);
const Q=require('/tmp/_q2.js');
let out=Q.filter(q=>!q.type).map(q=>`#${q.id} D${q.d} [${q.t}]\nQ: ${q.q}\nC: ${q.c.join(' || ')}\nW: ${q.w.join(' || ')}\n`).join('\n');
fs.writeFileSync('dump.txt',out);
console.log(Q.length, Q.filter(q=>!q.type).length, Q.filter(q=>!q.type&&q.c.length>1).length, Q.filter(q=>q.type).length);
