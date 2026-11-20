/* ================= Club foundation: the technical director as a person with a craft =================
   Visible: a philosophy, a three-year plan, two traits, one rumour (which may be wrong).
   Hidden (1-5): eye (judging quality), deal (price paid and received), plan (sticks to his line), bond (works with the coach).
   This layer knows nothing about the chairman; tdWindow() in club.js reads these hooks. */
const TD_PHIL={
  data:{t:'Data',d:'Buys on the numbers underneath.',ages:[22,28],plan:['A core aged 22 to 28','Sell players at their peak','Three academy players in the squad']},
  network:{t:'Network',d:'Buys from people and places the director knows.',ages:[24,31],plan:['Players from the region first','Keep the core together','Four academy players in the squad']},
  eye:{t:'Eye',d:'Young and raw: sees what others miss.',ages:[18,23],plan:['An average age under 24','Sell one big name a year','Five academy players in the squad']},
  bargain:{t:'Bargain',d:'Buys cheap, sells well.',ages:[20,30],plan:['Buy cheap in the lower leagues','Sell one player well every year','Bring the wage bill down']}};
const TD_TRAITS=['greedy','ambitious','cautious','stubborn','patient','principled','warm','proud'];
const TD_RUMOUR={
  eye:['Spotted two internationals before anyone else did.','Signed three flops in a row at the last club.'],
  deal:['A hard negotiator. Never pays the asking price.','Agents love selling to this one.'],
  plan:['Sticks to a plan like glue.','Changes direction every window.'],
  bond:['Coaches love working with this one.','Fell out with every coach so far.']};
const TD_SKILLS=['eye','deal','plan','bond'];

// Old saves and directors made before this module: a profile derived from traits, no random draws.
function tdDefault(p){const tr=p.traits||[];const phil=tr.includes('greedy')?'bargain':tr.includes('ambitious')?'eye':tr.includes('cautious')||tr.includes('loyal')?'network':'data';
  return{phil,eye:3,deal:3,plan:3,bond:3,rumour:null}}
function tdOf(pid){const p=P(pid);if(!p)return null;if(!p.td)p.td=tdDefault(p);return p.td}
function tdSkills(){let s;for(let i=0;i<30;i++){s=TD_SKILLS.map(()=>ri(1,5));const t=s.reduce((a,b)=>a+b,0);if(t>=10&&t<=14)break}return Object.fromEntries(TD_SKILLS.map((k,i)=>[k,s[i]]))}
function tdRumour(td){const k=pick(TD_SKILLS),honest=rnd()<.6,good=td[k]>=3;const positive=honest?good:!good;return{k,positive,honest,text:TD_RUMOUR[k][positive?0:1]}}
function tdCandidates(n=3){
  const phils=pickN(Object.keys(TD_PHIL),n);
  const used=new Set();return phils.map(phil=>{const pid=mkPerson('td',null,{traits:pickN(TD_TRAITS,2),age:ri(36,58)});for(let i=0;i<10&&used.has(P(pid).name.split(' ')[1]);i++)P(pid).name=`${pick(FIRST)} ${pick(LAST)}`;used.add(P(pid).name.split(' ')[1]);const td={phil,...tdSkills()};td.rumour=tdRumour(td);P(pid).td=td;return pid});
}
function tdPlanLines(pid){const td=tdOf(pid);return TD_PHIL[td.phil].plan}

/* ----- hooks for tdWindow and the market ----- */
function curTd(){return S.cf&&S.cf.tdId?tdOf(S.cf.tdId):{phil:'data',eye:3,deal:3,plan:3,bond:3}}
// ages: the mandate's profile and the director's philosophy meet halfway; a director with a loose plan sometimes ignores both
function tdAges(profile){const [f0,f1]=profileAges(profile),td=curTd(),[p0,p1]=TD_PHIL[td.phil].ages;
  if(td.plan<=2&&rnd()<.3)return[19,33];return[Math.round((f0+p0)/2),Math.max(Math.round((f0+p0)/2)+2,Math.round((f1+p1)/2))]}
// the price the director pays, relative to the asking price
function tdPayF(){return 1.18-.07*curTd().deal}
// what the director receives for a sale, relative to the bid on the table
function tdSellF(){return .9+.04*curTd().deal}
// how much more (or less) a bid must be before the director sells
function tdSellNeed(p){const td=curTd();let n=0;
  if(td.phil==='bargain')n-=.2;if(td.phil==='data'&&p.age>=29)n-=.25;if(td.phil==='network')n+=.2;if(td.phil==='eye'&&p.age>=27)n-=.15;
  if(td.plan>=4&&p.age<=21)n+=.3;return n}
// the director's view of a player: true quality plus noise that shrinks with his eye
function tdSee(p){const e=curTd().eye;return p.q+(rnd()*2-1)*(5-e)*.45}
function tdSort(list,amb){const td=curTd();
  for(const p of list){const seen=tdSee(p),seenPa=p.pa+(rnd()*2-1)*(5-td.eye)*.45,price=p.price||0;p.seenQ=Math.round(seen*10)/10;
    p._k=amb?seen:td.phil==='data'?seen-price*.03:td.phil==='network'?seen+(p.localKid?1.2:0)+(p.free?.4:0)+Math.min(1.2,Math.max(0,p.age-25)*.2):td.phil==='eye'?seen*.4+seenPa*.6:seen/(price+3)*6}
  list.sort((a,b)=>b._k-a._k);for(const p of list)delete p._k;return list}
function tdMarkSigning(p){p.signedBy=S.cf.tdId;p.signedS=S.season;if(p.seenQ==null)p.seenQ=p.q}
