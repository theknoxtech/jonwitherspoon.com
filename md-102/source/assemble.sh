cd "$(dirname "$0")"
cat h.js q1.js q2.js q3.js q4.js q5.js q6.js q7.js q8.js q9.js q10.js q11.js q12.js q13.js q14.js q15.js labs.js q16.js q17.js q18.js q19.js q21.js q22.js q23.js q24.js q25.js q20.js > all.js
python3 - <<'PY'
s=open('app.html',encoding='utf-8').read(); d=open('all.js',encoding='utf-8').read()
open('index.html','w',encoding='utf-8').write(s.replace('/*__DATA__*/',d))
PY
# Standalone build for your own website: wraps index.html in a full HTML document and
# adds a small shim so the "Download backup" button works without the Claude runtime.
python3 - <<'PY'
import re
s=open('index.html',encoding='utf-8').read()
m=re.search(r'<title>.*?</title>',s,re.S); title=m.group(0) if m else '<title>Practice Lab</title>'
s=s.replace(title,'',1)
shim="""<script>
if (typeof claude === 'undefined') {
  window.claude = { use: async function (name) {
    if (name !== 'downloads') return null;
    return { save: async function (o) {
      var blob = new Blob([o.data], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = o.filename;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
    } };
  } };
}
</script>"""
head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'+title+'<style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>'+shim+'</head><body>'
open('standalone.html','w',encoding='utf-8').write(head+s+'</body></html>')
PY
