/* ================= World: clubs, people and the start of a new game =================
   Owns S.clubs (identity, tier, support, rivals) and S.P (people). mkPerson/castClub/addRel/weakest are the
   Northmarch functions (northmarch.html @7a2d5d3), kept so the story layer (L4) can attach later.
   Squads (football), grounds (club) and money (finance) are created here but owned by their own domains. */
const VERSION=8;
const SAVE_KEY='northmarch-layered-v1';
const TIERS=[0,1,2,3,4];
const TIER_STR=[[51,59],[44,53],[37,46],[31,40],[26,35]];
const TIER_SUPPORT=[[1900,4300],[1000,2500],[450,1300],[250,850],[150,550]];

function mkPerson(role,club,o={}){
  const id='p'+(S.pc++);
  const p={id,name:o.name||`${pick(FIRST)} ${pick(LAST)}`,age:o.age||(role==='fan'?ri(38,70):role==='captain'?ri(27,33):ri(34,62)),role,club,
    traits:o.traits||pickN(TRAITS,2),value:o.value||pick(VALUES),infl:o.infl??null,loy:o.loy??null,mem:o.mem||[],rel:[],career:club?[club]:[],
    owes:false,withOpp:false,deepKnown:false,shown:0};
  p.deep=DEEP[role][p.value];S.P[id]=p;return id;
}
function weakest(c){return c.groups.slice().sort((a,b)=>a.mood-b.mood)[0].k}
function addRel(a,b,type){if(!a||!b||a===b)return;P(a).rel.push({id:b,type});P(b).rel.push({id:a,type:type==='mentor'?'protégé':type})}
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
function mkClub(id,name,town,tier,o={}){
  const t=TOWNS[town],keys=Object.keys(t.w),n=rnd()<.5?3:4,groups=[];
  if(o.groups)o.groups.forEach(([k,sh,m])=>groups.push({k,share:sh,mood:m}));
  else{const pool=keys.slice();while(groups.length<n&&pool.length){const tot=pool.reduce((a,k)=>a+t.w[k],0);let x=rnd()*tot,k=pool[0];for(const kk of pool){x-=t.w[kk];if(x<=0){k=kk;break}}pool.splice(pool.indexOf(k),1);groups.push({k,share:ri(15,40),mood:ri(34,62)})}
    const sum=groups.reduce((a,g)=>a+g.share,0);groups.forEach(g=>g.share=Math.round(g.share/sum*100));}
  const [s0,s1]=TIER_SUPPORT[tier];
  const c={id,name,town,tier,support:o.support??ri(s0,s1),statute:o.statute||pickN(STATUTE,rnd()<.5?1:2),founded:o.founded||ri(1874,1925),scar:o.scar||pick(SCAR),
    legend:o.legend||`${pick(FIRST)} '${pick(['Big','Wee','Iron','Doc','Sailor'])}' ${pick(LAST)}`,rival:null,rivalWhy:pick(RIVALRY),groups,cast:{},hist:[],binding:[],
    ground:o.ground||pick(['Park','Road','Lane','Meadow','Moor','Fields'])};
  c.ground=`${name.split(' ')[0]} ${c.ground}`;c.rep=repInit(c);
  S.clubs[id]=c;return c;
}
function chairValue(id){const c=CL(id),p=c.cast.chair&&P(c.cast.chair);return p?p.value:'money'}

function newWorld(seed){
  S={v:VERSION,seed,rs:seed|0||1,pc:1,season:1,week:0,phase:'choose',my:null,clubs:{},P:{},squads:{},grounds:{},fin:{},fa:[],
    tbl:{},fx:{},cup:null,qref:11.7,matches:[],ev:[],evn:0,stats:{},members:{},career:[],rep:0,votedOut:null,staffPool:[],records:{},hist:[],layers:{story:false,staff:false,dynasty:false},auto:false,seats:[]};
  // the Northmarch core clubs
  mkClub('pell','Pell United','harbour',1,{support:1600,groups:[['workers',40,58],['students',25,62],['business',35,40]],statute:['No outside owner above 25%'],founded:1891,legend:"Jack 'Sailor' Garside",scar:'lost a cup final to their rivals',ground:'Dock Road'});
  mkClub('corden','Corden Athletic','mill',1,{support:1800});
  mkClub('harrow','Harrowgate Town','cathedral',0,{support:3600});
  CL('pell').rival='corden';CL('pell').rivalWhy='a captain sold to them on deadline day';CL('corden').rival='pell';CL('corden').rivalWhy=CL('pell').rivalWhy;
  CL('pell').ground='Dock Road';
  // 77 more clubs, sized by a hidden potential, then cut into five divisions of 16
  const baseNames=TOWNNAMES.concat(TOWNNAMES2);
  const names=baseNames.concat(baseNames.slice(0,26).map((name,i)=>name+' '+(i%2?'Vale':'Heath')));
  const towns=Object.keys(TOWNS);
  const pot=names.map((tn,i)=>({tn,i,v:rnd()}));pot.sort((a,b)=>b.v-a.v);
  const need=[15,14,16,16,16]; // harrow fills tier 0; pell and corden tier 1
  let k=0;for(const tier of TIERS)for(let j=0;j<need[tier];j++){const x=pot[k++];mkClub('c'+x.i,x.tn+(rnd()<.85?' '+pick(SUFFIX):''),pick(towns),tier)}
  const ids=Object.keys(S.clubs);
  ids.forEach(i=>{const c=CL(i);if(c.rival)return;const cands=ids.filter(j=>j!==i&&CL(j).tier===c.tier&&!CL(j).rival);const r=cands.length?pick(cands):pick(ids.filter(j=>j!==i));c.rival=r;if(!CL(r).rival){CL(r).rival=i;CL(r).rivalWhy=c.rivalWhy}});
  ids.forEach(i=>castClub(CL(i)));
  ids.forEach(i=>{const cs=Object.values(CL(i).cast).filter(x=>P(x).role!=='talent');cs.forEach(a=>{if(rnd()<.6){const b=pick(cs.filter(x=>x!==a));addRel(a,b,pick(['friends','rivals','mentor']))}})});
  // the domains: squads, grounds, money
  for(const id of ids){const c=CL(id),[a,b]=TIER_STR[c.tier];
    const str=id==='pell'?48:id==='harrow'?57:ri(a,b)+Math.round((c.support-(TIER_SUPPORT[c.tier][0]+TIER_SUPPORT[c.tier][1])/2)/600);
    S.squads[id]=genSquad(str,id);S.grounds[id]=groundInit(id);S.fin[id]=finInit(id);S.stats[id]=statsInit();S.members[id]=membersInit(id);S.records[id]=recordsInit();giveProfile(CL(id).cast.coach,'coach',CL(id).tier);giveProfile(CL(id).cast.td,'td',CL(id).tier);}
  S.foreign=foreignInit();
  staffPoolInit();
  for(const id of ids)commercialInit(id);
  S.qref=worldQuality();
  faInit();
  startSeason();
  setBudgetsAll(1);
  makeSeats();
  emit('WorldCreated',null,`${ids.length} clubs in five divisions.`);
  return S;
}
/* three chairs to choose from: one per division, each with its own problem */
function makeSeats(){
  const ids=Object.keys(S.clubs),out=[];
  const t0=ids.filter(i=>CL(i).tier===0).sort((a,b)=>teamStrength(a)-teamStrength(b));
  out.push(t0[ri(0,4)]);out.push('pell');
  const t2=ids.filter(i=>CL(i).tier===2).sort((a,b)=>CL(b).support-CL(a).support);out.push(t2[ri(0,5)]);
  S.seats=out;
}
function chooseClub(id){
  if(!S.seats.includes(id))return false;
  S.my=id;S.phase='season';S.votedOut=null;
  S.career.push({club:id,from:S.season,to:null,why:null});
  S.ops=opsInit();S.youth=youthInit();F(id).policy.mandate={deals:'medium'};openWindow();
  const m=M(id);m.conf=r1(clamp(62+S.rep*2,40,80));m.log.push({s:S.season,w:S.week,d:0,why:'A new chairman: the members give you a chance'});
  emit('ChairmanElected',id,`You are elected chairman of ${CL(id).name}.`);
  return true;
}
