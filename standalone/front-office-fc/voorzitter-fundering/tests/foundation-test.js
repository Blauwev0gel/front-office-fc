// De fundering zonder voorzitter: drie seizoenen, en of de kaders het gedrag van de TD meetbaar veranderen.
// Gebruik: node build.js && node tests/foundation-test.js
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../dist/artifact.html'),'utf8');
const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function load(){const mod={exports:{}};const ctx={module:mod,console,Math,Date,JSON,Object,Array,String,Number,Set,Map};vm.createContext(ctx);vm.runInContext(src+'\n;module.exports.G=()=>S;module.exports.run=(c)=>eval(c);',ctx);return mod.exports}
function seasonsWithoutChairman(seed,frames,n=3){
  const m=load();m.act('new',seed);
  return m.run(`(function(){
    const id=Object.keys(S.clubs).find(i=>CL(i).tier===1&&i!=='pell');S.my=id;S.flags={};S.mods=[];S.youth=0;S.promises=[];
    const c=CL(id);cfInit(id,c.str,c.cast.td,c.cast.coach,c.rival);Object.assign(S.cf.frames,${JSON.stringify(frames)});S.cf.budgetLeft=S.cf.frames.budget;
    const out={sizes:[],renew:0,buys:[],sales:0,loans:0,passes:0,errors:null,points:[]};
    try{for(let s=0;s<${n};s++){tdWindow('summer');for(let w=1;w<=30;w++){S.week=w;clubWeek(w);simRound(w);S.round=w;out.sizes.push(S.cf.squad.length)}
      out.points.push(S.tbl[id].pts);clubSeasonEnd();aiSeasonEnd();promoteRelegate();S.season++;startSeasonWorld()}}catch(e){out.errors=e.stack.split('\\n').slice(0,3).join(' | ')}
    for(const e of S.cf.events){if(e.kind==='renew')out.renew++;if(e.kind==='buy')out.buys.push(e);if(e.kind==='sale'||e.kind==='keySale')out.sales++;if(e.kind==='loanOut')out.loans++;if(e.kind==='pass')out.passes++}
    out.buyAges=out.buys.map(e=>e.age);out.spend=out.buys.reduce((a,e)=>a+(e.price||0),0);out.events=S.cf.events.length;out.sig=JSON.stringify(S.cf.squad.map(p=>p.name+p.q))+S.tbl[id].pts;return out})()`);
}
const base={budget:40,cap:900,profile:'value',rule:'none'};
const a=seasonsWithoutChairman(31,base),b=seasonsWithoutChairman(31,base);
console.log('errors:',a.errors||'none','| deterministic:',a.sig===b.sig?'OK':'FAIL');
console.log('squad size min/max over 3 seasons:',Math.min(...a.sizes),Math.max(...a.sizes),'| renewals',a.renew,'| buys',a.buys.length,'| sales',a.sales,'| loans out',a.loans,'| passes',a.passes,'| points per season',a.points.join(','));
// frames: does the director behave differently?
const avg=x=>x.length?Math.round(x.reduce((s,v)=>s+v,0)/x.length*10)/10:0;
for(const [k,vals] of [['profile',['youth','experience','value']],['budget',[0,40,100]],['cap',[600,1200]],['rule',['none','noRival','heroesStay','ownFive']]]){
  const row=[];for(const v of vals){let ages=[],buys=0,sales=0,passes=0,refused=0,spend=0,loans=0;for(let s=1;s<=10;s++){const o=seasonsWithoutChairman(100+s*13,{...base,[k]:v},1);if(o.errors){console.log('ERR',o.errors);continue}ages.push(...o.buyAges);buys+=o.buys.length;spend+=o.spend;sales+=o.sales;passes+=o.passes;loans+=o.loans}
    row.push(`${v}: age ${avg(ages)}, buys ${buys}, spend £${spend}k, sales ${sales}, passes ${passes}, loans ${loans}`)}
  console.log(`frame ${k} →`,row.join(' | '));
}
