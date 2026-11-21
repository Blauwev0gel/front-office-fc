// De systeemlaag (laag 1 grond + laag 2 geld) op de bestaande fundering: een seizoen draait, geld klopt, bouwen werkt.
// Gebruik: node build.js && node tests/ground-test.js
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'../dist/artifact.html'),'utf8');const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function load(){const mod={exports:{}};const ctx={module:mod,console,Math,Date,JSON,Object,Array,String,Number,Set,Map};vm.createContext(ctx);vm.runInContext(src+'\n;module.exports.run=(c)=>eval(c);',ctx);return mod.exports}
function season(seed,setup){const m=load();m.act('new',seed);return JSON.parse(m.run(`(function(){
  const id=Object.keys(S.clubs).find(i=>CL(i).tier===1&&i!=='pell');S.my=id;S.flags={};S.mods=[];S.youth=0;S.promises=[];const c=CL(id);cfInit(id,c.str,c.cast.td,c.cast.coach,c.rival);
  ${setup||''};const cash0=c.cash;tdWindow('summer');let sum=0;const before=c.cash;
  for(let w=1;w<=30;w++){S.week=w;clubWeek(w);simRound(w);S.round=w;sum+=S.cf.fin.net}
  const g=G();return JSON.stringify({ok:true,sum:Math.round(sum*10)/10,cashDelta:Math.round((c.cash-before-(c.debt-${'0'}))*10)/10,debt:c.debt,lines:Object.keys(seasonLedger().lines),
    rings:g.sides.N.rings,medical:g.plots.some(p=>p.kind==='medical'),done:g.projects.filter(p=>p.phase==='done').length,cap:groundSignals().capacity,sig:JSON.stringify(S.cf.ledger.map(e=>e.net))})})()`))}
const a=season(5),b=season(5);
assert.strictEqual(a.sig,b.sig,'deterministisch');
for(const k of ['gate','sponsors','tv','wages','depts','seasontix'])assert.ok(a.lines.includes(k),'post '+k);
const built=season(5,"startProject('side:N:ring','premium');startProject('plot:3:medical','standard')");
assert.ok(built.rings>a.rings,'tribune uitgebreid');assert.ok(built.medical,'medisch centrum gebouwd');assert.strictEqual(built.cap,a.cap,'zonder draaihekken blijft de vergunning gelijk');
const both=season(5,"startProject('side:N:ring','premium');startProject('fac:access','premium');startProject('fac:safety','premium')");assert.ok(both.cap>a.cap,'met draaihekken en veiligheid gaat de capaciteit omhoog');
assert.ok(built.sum<a.sum,'bouwen kost geld');
const gen=season(5,"for(const k in G().depts)setDeptBudget(k,'generous')"),tight=season(5,"for(const k in G().depts)setDeptBudget(k,'tight')");
assert.ok(gen.sum<a.sum&&tight.sum>a.sum,'afdelingsbudget kost geld');
const dear=season(5,"S.cf.prices={terrace:20,seated:30,business:60,season:250}");
assert.notStrictEqual(dear.sum,a.sum,'prijzen doen ertoe');
console.log('ground-test OK | season net',a.sum,'| with building',built.sum,'| generous',gen.sum,'| tight',tight.sum,'| dear prices',dear.sum,'| capacity',a.cap,'→',both.cap,'(ring alone:',built.cap+')');
