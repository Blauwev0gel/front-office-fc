// The opening as an adventure: title -> week 1 over 20 seeds; dossiers, secrets, consequences, reading time.
// Usage: node build.js && node tests/opening-test.js
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../dist/artifact.html'),'utf8');
const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function load(){const mod={exports:{}};const ctx={module:mod,console,Math,Date,JSON,Object,Array,String,Number,Set,Map};vm.createContext(ctx);vm.runInContext(src+'\n;module.exports.run=(c)=>eval(c);',ctx);return mod.exports}
const words=h=>h.replace(/<style[\s\S]*?<\/style>/g,'').replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/g,' ').split(/\s+/).filter(Boolean).length;
let fails=0;const check=(ok,t)=>{console.log((ok?'ok   ':'FAIL ')+t);if(!ok)fails++};
const res=[];
for(let i=0;i<20;i++){const seed=3000+i*53,m=load();
  try{res.push(m.run(`(function(){
    act('new',${seed});const out={labels:S.seats.map(s=>s.label),secrets:S.seats.map(s=>s.secret),good:0,words:0,choices:0,effect:false,screens:[],err:null};
    const W=h=>{out.words+=(${words.toString()})(h)};
    W(callView());out.choices++;act('call','Test Chair');W(seatsView());out.choices++;
    const seat=S.seats[${i}%S.seats.length];act('seat',seat.id);W(signView());out.choices++;act('sign');W(signedView());act('toEnvelope');
    const snap=()=>JSON.stringify({cash:C().cash,debt:C().debt,moods:C().groups.map(g=>g.mood),sq:S.cf.squad.map(p=>[p.id,p.q,p.pa,p.morale,p.contract,p.wage]),rel:Object.values(S.P).map(p=>p.rel.length)});
    const before=snap();act('openEnv');out.effect=snap()!==before;out.good=SECRETS[S.secret.id].good?1:0;out.secret=S.secret.id;W(envelopeView());act('arrive');
    for(let k=0;k<3;k++){W(manifestView());out.choices++;act('pick',manifestOptions(['sport','club','person'][S.step])[0])}
    if(S.screen==='crisis'){W(crisisView());out.choices++;act('crisis','a');act('crisisDone')}
    if(S.screen==='tdhire'){W(tdHireView());out.choices++;act('tdhire',S.tdCands[0])}
    out.reached=S.screen;return out})()`))}catch(e){res.push({err:e.stack.split('\n').slice(0,2).join(' | ')})}}
const errs=res.filter(r=>r.err);if(errs.length)console.log(errs[0].err);
const ok=res.filter(r=>!r.err);
check(!errs.length&&ok.every(r=>r.reached==='meeting'),`title to the summer meeting without errors over 20 seeds (${ok.length}/20)`);
check(ok.every(r=>new Set(r.labels).size===r.labels.length&&r.labels.length>=3),'every set of dossiers has 3+ different labels');
check(ok.every(r=>new Set(r.secrets).size===r.secrets.length),'every set of dossiers has different secrets');
const goodShare=ok.reduce((a,r)=>a+r.good,0)/ok.length;check(goodShare>=.3&&goodShare<=.7,`secrets are roughly half good news (${Math.round(goodShare*100)}% good)`);
check(ok.every(r=>r.effect),'every revealed secret changes the game state');
const secs=ok.map(r=>r.words/3.5+r.choices*1.5),avg=secs.reduce((a,b)=>a+b,0)/secs.length;
console.log(`  estimated reading time to the summer meeting: ${Math.round(Math.min(...secs))}-${Math.round(Math.max(...secs))} s (avg ${Math.round(avg)} s); the meeting and summer add about 90-120 s`);
check(avg+100>=180&&avg+100<=300,'the opening fits 3-5 minutes including the summer meeting');
console.log('secrets seen:',[...new Set(ok.map(r=>r.secret))].join(', '));
console.log(fails?`${fails} check(s) failed`:'all checks passed');
