// The technical director without a chairman: do philosophy and hidden craft change his work measurably?
// 20 seeds x 3 seasons per profile. Usage: node build.js && node tests/td-test.js
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../dist/artifact.html'),'utf8');
const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function load(){const mod={exports:{}};const ctx={module:mod,console,Math,Date,JSON,Object,Array,String,Number,Set,Map};vm.createContext(ctx);vm.runInContext(src+'\n;module.exports.run=(c)=>eval(c);module.exports.act=act;',ctx);return mod.exports}
function run(seed,td){
  const m=load();m.act('new',seed);
  return m.run(`(function(){
    const id=Object.keys(S.clubs).find(i=>CL(i).tier===1&&i!=='pell');S.my=id;S.flags={};S.mods=[];S.youth=0;S.promises=[];
    const c=CL(id);cfInit(id,c.str,c.cast.td,c.cast.coach,c.rival);P(c.cast.td).td=${JSON.stringify(td)};
    const out={buys:[],sales:0,saleIncome:0,err:null};
    try{for(let s=0;s<3;s++){tdWindow('summer');for(let w=1;w<=30;w++){S.week=w;clubWeek(w);simRound(w);S.round=w}
      for(const p of S.cf.squad)if(p.signedS===S.season&&!p._counted){p._counted=1;out.buys.push({age:p.age,q:p.q,seen:p.seenQ,local:!!p.localKid,free:false})}
      clubSeasonEnd();aiSeasonEnd();promoteRelegate();S.season++;startSeasonWorld()}}catch(e){out.err=e.stack.split('\\n').slice(0,3).join(' | ')}
    for(const e of S.cf.events){if(e.kind==='buy'&&e.price)out.buys.find(b=>!b.price&&(b.price=e.price,true));if(e.kind==='sale'||e.kind==='keySale'){out.sales++;out.saleIncome+=e.bid}}
    return out})()`);
}
const SEEDS=Array.from({length:20},(_,i)=>1000+i*37);
function agg(td){const all={buys:[],sales:0,inc:0,err:[]};for(const s of SEEDS){const r=run(s,td);if(r.err)all.err.push(r.err);all.buys.push(...r.buys);all.sales+=r.sales;all.inc+=r.saleIncome}
  const b=all.buys,n=b.length||1,paid=b.filter(x=>x.price);
  return{n:b.length,age:(b.reduce((a,x)=>a+x.age,0)/n).toFixed(1),local:Math.round(b.filter(x=>x.local).length/n*100),q:(b.reduce((a,x)=>a+x.q,0)/n).toFixed(2),
    err:(b.reduce((a,x)=>a+Math.abs((x.seen??x.q)-x.q),0)/n).toFixed(2),perQ:paid.length?(paid.reduce((a,x)=>a+x.price,0)/paid.reduce((a,x)=>a+x.q,0)).toFixed(2):'-',
    sales:all.sales,inc:all.inc,outBand:null,errors:all.err.length?all.err[0]:'none'}}
const base={eye:3,deal:3,plan:3,bond:3,rumour:null};let fails=0;const check=(ok,txt)=>{console.log((ok?'ok   ':'FAIL ')+txt);if(!ok)fails++};
console.log('philosophy (craft 3/3/3/3):');const P={};
for(const phil of ['data','network','eye','bargain']){P[phil]=agg({...base,phil});const r=P[phil];console.log(`  ${phil.padEnd(8)} buys ${r.n} | age ${r.age} | local ${r.local}% | quality ${r.q} | £ per quality point ${r.perQ} | sales ${r.sales} | errors ${r.errors}`)}
check(+P.eye.age<+P.data.age-1&&+P.data.age<+P.network.age,'eye buys youngest, network oldest');
check(P.network.local>P.data.local,'network buys more local players than data');
check(P.bargain.sales>=P.network.sales,'bargain sells at least as often as network');
console.log('eye (judging quality), data philosophy:');const e1=agg({...base,phil:'data',eye:1}),e5=agg({...base,phil:'data',eye:5});
console.log(`  eye 1: misjudged by ${e1.err} on average, bought quality ${e1.q} | eye 5: misjudged by ${e5.err}, bought quality ${e5.q}`);
check(+e5.err<+e1.err&&+e5.q>+e1.q,'a sharp eye misjudges less and buys better players');
console.log('deal (price), data philosophy:');const d1=agg({...base,phil:'data',deal:1}),d5=agg({...base,phil:'data',deal:5});
console.log(`  deal 1: £${d1.perQ} per quality point, sale income £${d1.inc}k | deal 5: £${d5.perQ}, sale income £${d5.inc}k`);
check(+d5.perQ<+d1.perQ,'a good negotiator pays less per quality point');
console.log('the transfer summer (20 seeds, own order vs reversed):');
function summer(seed,reverse){const m=load();m.act('new',seed);return m.run(`(function(){
  const id=Object.keys(S.clubs).find(i=>CL(i).tier===1&&i!=='pell');S.my=id;S.flags={};S.mods=[];S.youth=0;S.promises=[];
  const c=CL(id);cfInit(id,c.str,c.cast.td,c.cast.coach,c.rival);const s=tdSummerStart();const first=s.prios.slice().sort((a,b)=>a.order-b.order)[0].id;
  if(${reverse})sumSetOrder(s.prios.slice().sort((a,b)=>b.order-a.order).map(x=>x.id));
  const lens=[];for(let i=0;i<4;i++)lens.push(tdSumWeek().length);tdSumDeadline();
  const f=s.prios.find(x=>x.id===first);return{lens,keySold:s.keySold,firstA:f.res==='A'?1:0,firstOk:f.res&&f.res!=='fail'?1:0,n:s.prios.length,done:s.prios.filter(x=>x.res&&x.res!=='fail').length}})()`)}
let lens=[],key=0,aOwn=0,aRev=0,done=0,tot=0;for(const sd of SEEDS){const o=summer(sd,false),r=summer(sd,true);lens.push(...o.lens);key=Math.max(key,o.keySold,r.keySold);aOwn+=o.firstA;aRev+=r.firstA;done+=o.done;tot+=o.n}
console.log(`  ticker lines per week ${Math.min(...lens)}-${Math.max(...lens)} | most key sales in one summer ${key} | priorities done ${done}/${tot}`);
console.log(`  the director's first priority lands its A-target: ${aOwn}/20 at the top of the list, ${aRev}/20 at the bottom`);
check(Math.min(...lens)>=4&&Math.max(...lens)<=6,'every transfer week has 4-6 ticker lines');
check(key<=1,'at most one key sale per summer');
check(aOwn>aRev,'the chairman\'s order changes which priority gets its A-target');
console.log(fails?`${fails} check(s) failed`:'all checks passed');
