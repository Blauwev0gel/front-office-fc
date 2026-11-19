/* ================= World generation ================= */
function mkPerson(role,club,o={}){
  const id='p'+(S.pc++);
  const p={id,name:o.name||`${pick(FIRST)} ${pick(LAST)}`,age:o.age||(role==='fan'?ri(38,70):role==='captain'?ri(27,33):ri(34,62)),role,club,
    traits:o.traits||pickN(TRAITS,2),value:o.value||pick(VALUES),infl:o.infl??null,loy:o.loy??null,mem:o.mem||[],rel:[],career:club?[club]:[],
    owes:false,withOpp:false,deepKnown:false,shown:0};
  p.deep=DEEP[role][p.value];S.P[id]=p;return id;
}
function mkClub(id,name,town,tier,o={}){
  const t=TOWNS[town],keys=Object.keys(t.w),n=o.groups?o.groups.length:(rnd()<.5?3:4),groups=[];
  if(o.groups)o.groups.forEach(([k,sh,m])=>groups.push({k,share:sh,mood:m}));
  else{const pool=keys.slice();while(groups.length<n&&pool.length){const tot=pool.reduce((a,k)=>a+t.w[k],0);let x=rnd()*tot,k=pool[0];for(const kk of pool){x-=t.w[kk];if(x<=0){k=kk;break}}pool.splice(pool.indexOf(k),1);groups.push({k,share:ri(15,40),mood:ri(34,62)})}
    const sum=groups.reduce((a,g)=>a+g.share,0);groups.forEach(g=>g.share=Math.round(g.share/sum*100));}
  const c={id,name,town,tier,str:o.str??(tier===0?ri(48,58):ri(43,54)),cash:o.cash??ri(20,140),debt:o.debt??pick([0,0,80,200,450]),
    statute:o.statute||pickN(STATUTE,rnd()<.5?1:2),founded:o.founded||ri(1874,1925),scar:o.scar||pick(SCAR),legend:o.legend||`${pick(FIRST)} '${pick(['Big','Wee','Iron','Doc','Sailor'])}' ${pick(LAST)}`,
    rival:null,rivalWhy:pick(RIVALRY),groups,cast:{},last:ri(2,16),hist:[],binding:[]};
  S.clubs[id]=c;return c;
}
function newWorld(seed){
  S={v:1,seed,rs:seed,pc:1,clubs:{},P:{},season:1,round:0,my:null,rep:2,log:[],mlog:[],news:[],
    phase:'title',screen:'title',moment:0,promises:[],flags:{},mods:[],youth:0,debuts:0,talentStarts:0,
    realPts:0,xPts:0,derbyPts:0,cross:[],served:false,echo:null,wait:null,scene:null,block:null,alv:null,
    seats:[],elect:null,pick:{},step:0,chances:null,pool:[],history:[],journalist:null,cashStart:0,hire:null,knownChairs:{}};
  // fixed core
  const pell=mkClub('pell','Pell United','harbour',1,{str:50,cash:60,debt:0,groups:[['workers',40,58],['students',25,62],['business',35,40]],statute:['No outside owner above 25%'],founded:1891,legend:"Jack 'Sailor' Garside",scar:'lost a cup final to their rivals'});
  const corden=mkClub('corden','Corden Athletic','mill',1,{str:53});
  const harrow=mkClub('harrow','Harrowgate Town','cathedral',0,{str:57});
  pell.rival='corden';pell.rivalWhy='a captain sold to them on deadline day';corden.rival='pell';corden.rivalWhy=pell.rivalWhy;
  const names=pickN(TOWNNAMES,29);const towns=Object.keys(TOWNS);
  names.forEach((tn,i)=>{const tier=i<15?0:1;const nm=tn+(rnd()<.85?' '+pick(SUFFIX):'');mkClub('c'+i,nm,pick(towns),tier)});
  // fix tier sizes: 16 + 16
  const ids=Object.keys(S.clubs);let t0=ids.filter(i=>CL(i).tier===0);while(t0.length>16){CL(t0.pop()).tier=1}t0=ids.filter(i=>CL(i).tier===0);
  let t1=ids.filter(i=>CL(i).tier===1&&!['pell','corden'].includes(i));while(t0.length<16){const x=t1.pop();CL(x).tier=0;t0.push(x)}
  // rivals
  ids.forEach(i=>{const c=CL(i);if(c.rival)return;const cands=ids.filter(j=>j!==i&&CL(j).tier===c.tier&&!CL(j).rival);const r=cands.length?pick(cands):pick(ids.filter(j=>j!==i));c.rival=r;if(!CL(r).rival){CL(r).rival=i;CL(r).rivalWhy=c.rivalWhy}});
  // casts
  ids.forEach(i=>{const c=CL(i);if(['pell','corden'].includes(i))return;castClub(c)});
  // Pell core people
  pell.cast.chair=mkPerson('chair','pell',{name:'Gareth Vance',traits:['sly','ambitious'],value:'recognition',infl:'business',mem:[{s:1,club:'pell',v:-1,txt:'beat you at the AGM'}]});
  pell.cast.fan=mkPerson('fan','pell',{name:'Pat Kearney',traits:['stubborn','loyal'],value:'recognition',infl:'workers',mem:[{s:1,club:'pell',v:1,txt:'you kept your word to the Docks'}]});
  pell.cast.captain=mkPerson('captain','pell',{name:'Lewis Hart',age:30,traits:['proud','loyal'],value:'community',infl:'workers',mem:[{s:1,club:'pell',v:1,txt:'you looked after his contract'}]});
  pell.cast.td=mkPerson('td','pell',{name:'Colin Ward',traits:['loyal','stubborn'],value:'community',mem:[]});
  pell.cast.opp=mkPerson('opp','pell',{name:'Ruth Okon',traits:['honest','stubborn'],value:'control',infl:'business',mem:[{s:1,club:'pell',v:1,txt:'you gave Business a seat'}]});
  pell.cast.coach=mkPerson('coach','pell',{name:'Bryn Talbot',traits:['stubborn','loyal'],value:'loyalty',infl:'workers'});
  pell.cast.talent=mkPerson('talent','pell',{name:'Jay Okoro',age:19});
  corden.cast.chair=mkPerson('chair','corden',{name:'Frank Ollerton',traits:['proud','resentful'],value:'glory'});
  corden.cast.coach=mkPerson('coach','corden',{name:'Maria Esteves',traits:['honest','ambitious'],value:'recognition',infl:'students',mem:[{s:1,club:'pell',v:1,txt:'you backed her in public at Pell'}]});
  P(corden.cast.coach).career=['pell','corden'];
  ['td','captain','fan','opp','talent'].forEach(r=>corden.cast[r]=mkPerson(r,'corden',{infl:r==='fan'?corden.groups[0].k:r==='captain'?corden.groups[0].k:r==='opp'?weakest(corden):null}));
  // relations inside clubs and across
  ids.forEach(i=>{const cs=Object.values(CL(i).cast).filter(x=>P(x).role!=='talent');cs.forEach(a=>{if(rnd()<.6){const b=pick(cs.filter(x=>x!==a));addRel(a,b,pick(['friends','rivals','mentor']))}})});
  addRel(pell.cast.fan,pell.cast.captain,'friends');addRel(pell.cast.td,pell.cast.talent,'mentor');addRel(pell.cast.chair,pell.cast.fan,'rivals');
  // a few cross-club links to the core
  const core=[pell.cast.fan,pell.cast.td,corden.cast.coach,pell.cast.chair];
  pickN(ids.filter(i=>!['pell','corden'].includes(i)),5).forEach(i=>{const a=pick(Object.values(CL(i).cast).filter(x=>P(x).role!=='talent'));addRel(a,pick(core),pick(['friends','rivals','cousins']))});
  S.journalist=mkPerson('journalist',null,{name:'Mo Abara',traits:pickN(['vain','honest','sly','ambitious','principled'],2),value:pick(['recognition','glory','money','community'])});
  // free coaches pool
  for(let k=0;k<5;k++)S.pool.push(mkPerson('coach',null));
  // fixtures and expectations
  startSeasonWorld();
  // seats: three open chairs with spread
  S.history.push({s:0,club:'pell',txt:'One season as chairman of Pell United. Voted out by Gareth Vance.'});
  makeSeats();
  S.news=[{pri:1,text:'Maria Esteves, sacked by Pell at Christmas, is the new coach of Corden Athletic.'},{pri:1,text:'Pat Kearney at the Pell AGM: "Say what you like about the last chairman. At least he came to the Anchor."'},{pri:2,text:'Gareth Vance renames Pell\'s North Stand after a bookmaker.'}];
  S.phase='prologue';S.screen='prologue';
}
function castClub(c){
  const big=c.groups.slice().sort((a,b)=>b.share-a.share)[0].k;
  c.cast.chair=mkPerson('chair',c.id);
  c.cast.coach=mkPerson('coach',c.id,{infl:c.groups.find(g=>['students','ultras','newcomers'].includes(g.k))?.k||null});
  c.cast.td=mkPerson('td',c.id);
  c.cast.captain=mkPerson('captain',c.id,{infl:big});
  c.cast.fan=mkPerson('fan',c.id,{infl:big});
  c.cast.opp=mkPerson('opp',c.id,{infl:weakest(c)});
  c.cast.talent=mkPerson('talent',c.id,{age:ri(17,19)});
}
function weakest(c){return c.groups.slice().sort((a,b)=>a.mood-b.mood)[0].k}
function addRel(a,b,type){if(!a||!b||a===b)return;P(a).rel.push({id:b,type});P(b).rel.push({id:a,type:type==='mentor'?'protégé':type})}
function makeFixtures(ids){
  const a=ids.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  const n=a.length;let arr=a.slice();const first=[];
  for(let k=0;k<n-1;k++){const m=[];for(let i=0;i<n/2;i++){const x=arr[i],y=arr[n-1-i];m.push((k+i)%2?[y,x]:[x,y])}first.push(m);arr=[arr[0],arr[n-1],...arr.slice(1,n-1)]}
  return first.concat(first.map(rd=>rd.map(([x,y])=>[y,x])));
}
function startSeasonWorld(){
  S.tbl={};S.fx={};
  for(const tier of [0,1]){const ids=Object.keys(S.clubs).filter(i=>CL(i).tier===tier);S.fx[tier]=makeFixtures(ids);
    const byStr=ids.slice().sort((x,y)=>CL(y).str-CL(x).str);byStr.forEach((id,i)=>CL(id).expect=i+1);
    ids.forEach(id=>S.tbl[id]={p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0});}
  S.round=0;S.realPts=0;S.xPts=0;S.derbyPts=0;
}
function makeSeats(){
  const ids=Object.keys(S.clubs).filter(i=>i!=='pell'&&i!==S.my);
  const diff=id=>clubDiff(CL(id));const seats=[];
  for(const want of [[1,2],[3],[4,3]]){const cand=ids.filter(i=>want.includes(diff(i))&&!seats.includes(i)&&!seats.some(x=>CL(x).town===CL(i).town));seats.push(cand.length?pick(cand):pick(ids.filter(i=>!seats.includes(i))))}
  S.seats=seats.map(id=>({id,reason:pick(['the chairman resigned after a vote of no confidence','the chairman is retiring after twenty years','the chairman was ousted at the last AGM','the chairman quit over a sponsorship scandal'])}));
}
function clubDiff(c){const avg=c.groups.reduce((a,g)=>a+g.mood*g.share,0)/100;return clamp(Math.round(1+(c.debt>=200?1:0)+(avg<46?1:0)+((c.last-(c.expect||8))>=4?1:0)+(c.statute.length>1?.5:0)),1,4)}
const DIFF_LABEL={1:'Comfortable and cautious',2:'Steady, with an itch',3:'A club in trouble',4:'A club in crisis'};
