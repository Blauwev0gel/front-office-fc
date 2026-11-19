// Node-test en audit voor northmarch.html. Gebruik: node world-test.js
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../dist/artifact.html'),'utf8');
const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function load(){const mod={exports:{}};vm.runInNewContext(src,{module:mod,console,Math,Date,JSON,Object,Array,String,Number,Set,Map});return mod.exports}
function mk(seed){let s=seed|0;return()=>{let t=(s=(s+0x6D2B79F5)|0);t=Math.imul(t^(t>>>15),1|t);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
const STRONG={money:['money'],glory:['name','role'],loyalty:['security'],recognition:['name','role'],control:['power'],community:['role']};
const RANK={'Near certain':5,'Likely':4,'Coin toss':3,'Unlikely':2,'Long shot':1};
function play(policy,seed,seasons=2){
  const m=load();m.act('new',seed);const r=mk(seed^0xabc);const ri=n=>Math.floor(r()*n);
  const out={elections:[],agms:[],errors:null,steps:0,moves:0};
  const chooseCard=(cards,who)=>{
    if(policy==='random')return ri(cards.length);
    if(policy==='passive'){const i=cards.findIndex(c=>c.none);return i>=0?i:cards.length-1}
    const p=who?m.P(who):null;let best=0,bs=-99;
    cards.forEach((c,i)=>{let s=0;if(c.none)s=-1;else{s=1;if(c.warn)s-=4;if(p&&c.stake&&STRONG[p.value].includes(c.stake))s+=3;if(c.stake==='ask')s+=.3;if(/Keep it/.test(c.t))s=.5;if(/Speak for me|Call in/.test(c.t))s=2.5;if(/Replace|Refuse|back off/.test(c.t))s=-.5}
      if(s>bs){bs=s;best=i}});return best};
  try{
    while(out.steps++<20000){const S=m.S;
      switch(S.screen){
        case'prologue':m.act('toSeats');break;
        case'seats':m.act('seat',policy==='random'?S.seats[ri(S.seats.length)].id:S.seats[0].id);break;
        case'elect':{const sc=m.electionScene();m.act('electCard',chooseCard(m.sceneCards(sc),sc.who));break}
        case'manifest':{const slot=['sport','club','person'][S.step];let o=m.manifestOptions(slot);if(slot!=='sport')o=o.concat(['none']);let pick;
          if(policy==='random')pick=o[ri(o.length)];else if(policy==='passive')pick=slot==='sport'?(o.includes('survive')?'survive':o[0]):'none';
          else{if(slot==='sport'){const sc=id=>{const d=m.pdef(id);const w=RANK[(S.chances&&S.chances[id]!=null)?['Long shot','Unlikely','Coin toss','Likely','Near certain'][[.12,.35,.6,.85,1.01].findIndex(x=>S.chances[id]<x)]:'Coin toss'];return w*2+(d.size==='M'?1:d.size==='L'?2:0)-(w<3?6:0)};pick=o.slice().sort((a,b)=>sc(b)-sc(a))[0]}else pick=o[0]}
          m.act('pick',pick);break}
        case'electResult':out.elections.push(Math.round(S.elect.result.total));m.act('electNext');break;
        case'meeting':{const M=S.meeting;if(M.step===0){m.act('meetNext');break}
          if(M.step<=7){const pl=m.run?null:null;const opts={1:['survive','steady','push','promotion'],2:['balanced','reserves','borrow'],3:['own','local','pros','trade'],4:['flat','oneStar','performance'],5:['core','price','noMid'],6:['position','value','youth','wages'],7:['noRival','captainStays','heroesStay','noOldLong']}[M.step];
            if(M.step===7){if(policy==='active'&&!M.rules.length)m.act('mchoose','captainStays');else if(policy==='random'&&!M.rules.length&&r()<.5)m.act('mchoose',opts[ri(4)]);m.act('meetNext');break}
            const pickv=policy==='random'?opts[ri(opts.length)]:policy==='passive'?opts[0]:({1:'steady',2:'reserves',3:'pros',4:'oneStar',5:'core',6:'position'})[M.step];m.act('mchoose',pickv);break}
          m.act('mdone');break}
        case'window':m.act('windowDone');break;
        case'week':{out.weeks=(out.weeks||0)+1;out.sits=(out.sits||0)+S.desk.length;S.desk.forEach(x=>{if(!x._c){x._c=1;out.gens=out.gens||{};out.gens[x.gen]=(out.gens[x.gen]||0)+1;const tt=m.sitBuild(S.desk.indexOf(x)).title;const key=S.season+'|'+tt;out.titles=out.titles||{};out.titles[key]=(out.titles[key]||0)+1}});
          out.cash=out.cash||[];if(S.week===30)out.cash.push(Math.round(S.clubs[S.my].cash));
          const i=S.desk.findIndex(x=>!x.done);if(policy==='passive'||i<0||(policy==='random'&&r()<.3))m.act('play');else m.act('sit',i);break}
        case'sit':{const sc=m.currentScene();m.act('card',chooseCard(m.sceneCards(sc),sc.who[0]));break}
        case'result':m.act('next');break;
        case'hire':m.act('hire',S.hire[0]);break;
        case'alv':{const A=S.alv;
          if(A.step==='report')m.act('alvLobby');
          else if(A.step==='lobby'){let sel=[];if(policy==='active'){const m0=A.motions.find(x=>!x.anti);if(m0)sel=[m0.id];sel.push('seat')}else if(policy==='random')sel=A.motions.filter(()=>r()<.4).map(x=>x.id);m.act('lobbyDone',sel)}
          else if(A.step==='speech'){const d=policy==='random'?['wrong','luck','success','blame'][ri(4)]:policy==='passive'?'wrong':(A.report.some(x=>x.res==='kept')?'success':'wrong');m.act('defend',d)}
          else if(A.step==='count')m.act('toEnd');
          else if(A.step==='end'){out.agms.push({won:A.result.won,v:Math.round(A.result.total)});if(out.agms.length>=seasons){out.final=m.S;return out}m.act('nextSeason')}
          break}
        case'summer':m.act('summerNext');break;
        default:throw new Error('unknown screen '+S.screen);
      }
    }
    throw new Error('too many steps');
  }catch(e){out.errors=e.stack.split('\n').slice(0,3).join(' | ');out.final=m.S;return out}
}
// 1. Determinisme
const a=play('active',4242),b=play('active',4242);
const sig=o=>JSON.stringify({ag:o.agms,el:o.elections,log:o.final.log.length,coach:Object.values(o.final.clubs).map(c=>c.cast.coach).join(),sq:o.final.cf&&o.final.cf.squad.map(p=>p.name).join()});
console.log('determinism:',sig(a)===sig(b)?'OK':'FAIL',a.errors||'');
// 2. Wereld-checks op één run
const f=a.final;const ppl=Object.values(f.P);
console.log('clubs:',Object.keys(f.clubs).length,'tiers:',[0,1].map(t=>Object.values(f.clubs).filter(c=>c.tier===t).length).join('/'),'people:',ppl.length,'without deep want:',ppl.filter(p=>!p.deep).length);
const moved=ppl.filter(p=>p.career&&p.career.length>1).length;console.log('people with a career move:',moved,'| free coaches:',f.pool.length,'| seasons played:',f.season-1);
// 3. Audit over 20 seeds
const res={};
for(const pol of ['active','passive','random']){let errs=0,el=0,elw=0,ag=0,agw=0,sup=0;
  for(let s=1;s<=20;s++){const o=play(pol,1000+s*37);if(o.errors){errs++;if(errs<=2)console.log(pol,'error',o.errors);continue}
    o.elections.forEach(v=>{el++;if(v>=50)elw++});o.agms.forEach(x=>{ag++;if(x.won)agw++;sup+=x.v})}
  res[pol]={errors:errs,electionsWon:`${elw}/${el}`,agmsWon:`${agw}/${ag}`,avgAGMsupport:ag?Math.round(sup/ag):0};}
console.log(JSON.stringify(res,null,1));
const g=play('active',777);console.log('situations per week:',(g.sits/g.weeks).toFixed(2),'over',g.weeks,'weeks; generators used:',JSON.stringify(g.gens));
let maxRep=0,worst='';for(let s=1;s<=10;s++){const o=play(['active','random'][s%2],500+s*11);for(const [k,v] of Object.entries(o.titles||{}))if(v>maxRep){maxRep=v;worst=k}}
console.log('most repeated situation title in one season:',maxRep,'×',worst);
const st=g.final.cf.events.filter(e=>e.kind==='story');console.log('player storylines in the last season:',st.filter(e=>e.s===g.final.season).length,'| all seasons:',st.length,'| kinds:',JSON.stringify(st.reduce((a,e)=>(a[e.sk]=(a[e.sk]||0)+1,a),{})));
console.log('cash at week 30 per season (active run):',JSON.stringify(g.cash));
