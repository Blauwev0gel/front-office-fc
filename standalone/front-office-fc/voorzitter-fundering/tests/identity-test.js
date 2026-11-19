// Club identity: WCAG AA contrast for every club colour, unique crests, deterministic output. node tests/identity-test.js
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../dist/artifact.html'),'utf8');const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function load(){const mod={exports:{}};const ctx={module:mod,console,Math,Date,JSON,Object,Array,String,Number,Set,Map};vm.createContext(ctx);vm.runInContext(src+';module.exports.run=c=>eval(c)',ctx);return mod.exports}
let bad=0,dups=0;const sigs=[];
for(const seed of [1,7,42,2611,9001]){const m=load();m.act('new',seed);
  const r=m.run(`Object.values(S.clubs).map(c=>({n:c.name,p:c.col[0],s:c.col[1],c1:contrast(c.col[0],onColour(c.col[0])),c2:contrast(c.col[1],onColour(c.col[1])),sig:c.crestShape+c.crestField+c.symbol+c.col.join(''),crest:crestSVG(c,64,true).length}))`);
  for(const x of r){if(x.c1<4.5||x.c2<4.5){bad++;console.log('contrast',seed,x.n,x.p,x.c1.toFixed(2),x.s,x.c2.toFixed(2))}}
  const s=new Set(r.map(x=>x.sig));dups+=r.length-s.size;sigs.push(JSON.stringify(r.map(x=>x.sig)));
  const again=load();again.act('new',seed);const r2=again.run(`Object.values(S.clubs).map(c=>c.crestShape+c.crestField+c.symbol+c.col.join(''))`);if(JSON.stringify(r2)!==JSON.stringify(r.map(x=>x.sig)))console.log('NOT deterministic',seed);
  const p1=m.run(`portraitSVG('p5',{size:48,age:30})`),p2=again.run(`portraitSVG('p5',{size:48,age:30})`);if(p1!==p2)console.log('portrait not deterministic',seed);}
console.log('contrast failures (text on club colours, AA 4.5):',bad,'| duplicate crest+colour combinations:',dups);
