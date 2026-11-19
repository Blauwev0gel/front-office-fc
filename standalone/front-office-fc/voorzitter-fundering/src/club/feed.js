/* ================= Club foundation: the weekly feed =================
   4-6 cards a week from four sources: players, staff at work, the region, the town and the fans.
   Cards come from real events in the simulation, filled into warm templates with variable parts.
   This layer knows nothing about the chairman; the chairman layer adds reactions on top. */
const FEED_SRC={players:'Your players',staff:'Your staff',region:'The region',town:'Town and fans'};
function fv(a){return a[Math.floor(rnd()*a.length)]}
function lastName(n){return n.split(' ').slice(-1)[0]}
const FT={
 debut:[p=>[`${lastName(p.name)} makes his debut`,`${p.story} Today he walked out in the first team.`],p=>[`A first game for ${lastName(p.name)}`,`He came through the academy. His family were in the stand.`]],
 firstGoal:[p=>[`${lastName(p.name)} scores his first goal`,`He ran straight to the corner where his friends stand.`],p=>[`First goal for ${p.name}`,`He has waited a long time for this one.`]],
 winner:[p=>[`${lastName(p.name)} wins it`,`The last goal of the afternoon, and the one that counted.`],p=>[`${lastName(p.name)}, match-winner`,`The dressing room sang his name afterwards.`]],
 slump:[p=>[`${lastName(p.name)} is struggling`,`Three quiet weeks. The coach says he needs an arm round the shoulder.`],p=>[`A hard spell for ${lastName(p.name)}`,`He stayed behind after training, alone, practising.`]],
 comeback:[p=>[`${lastName(p.name)} scores on his return`,`Weeks of rehab, and then this.`]],
 contractYear:[p=>[`${lastName(p.name)}'s contract runs down`,`He loves it here, he says. He would like to know where he stands.`]],
 lastSeason:[p=>[`A last season for ${lastName(p.name)}?`,`${p.age} years old. He wants to go out properly.`]],
 hundred:[p=>[`${lastName(p.name)}: 100 games`,`The kitman made him a shirt with 100 on the back.`]],
 training:[p=>[`${lastName(p.name)} trains with the first team`,`He's ${p.age}. His dad watched from the fence.`],p=>[`A young face in first-team training`,`${p.name}, ${p.age}, kept up all week. The senior players noticed.`]],
 birthday:[p=>[`Happy birthday, ${lastName(p.name)}`,`${p.age} today. The squad bought him a cake shaped like a football boot.`],p=>[`${lastName(p.name)} turns ${p.age}`,`He brought doughnuts for the whole staff.`]],
 dad:[p=>[`${lastName(p.name)} becomes a dad`,`A little girl, born on Tuesday. He trained on Wednesday anyway.`],p=>[`Baby news for ${lastName(p.name)}`,`A boy. The squad are already arguing about his best position.`]],
 friends:[(p,q)=>[`${lastName(p.name)} and ${lastName(q.name)}, inseparable`,`They share a car to training and a table at lunch.`]],
 spat:[(p,q)=>[`Words between ${lastName(p.name)} and ${lastName(q.name)}`,`It got heated at training. The captain stepped in.`]],
 injury:[p=>[`${lastName(p.name)} is injured`,`Out for ${p.inj} week${p.inj>1?'s':''}. He is gutted.`]],
 back:[p=>[`${lastName(p.name)} back in training`,`Smiling again. The physio says he is ready.`]],
 tdBuy:[(e)=>[`A new face arrives`,e.text]],
 tdWork:[(e,td)=>[`${lastName(td)} at work`,e.text]],
 youth:[(r)=>[`The youth team ${r.w?'win':r.d?'draw':'lose'} ${r.a}–${r.b}`,r.w?`The academy coach was beaming.`:`A tough afternoon, but they kept going.`]],
 finance:[(f,fi)=>[`${lastName(fi)} on the money`,f.net>=0?`A good week: we made £${f.net}k.`:`A tighter week: we lost £${-f.net}k. Wages keep coming.`]],
 region:[(n)=>[n.head,n.text]],
 soldOut:[(o)=>[`The away end sells out`,`Every ticket for ${o} went in a day.`]],
 sponsor:[(b)=>[`${b} back the club`,`A new board goes up by the corner flag.`],(b)=>[`A new sponsor: ${b}`,`The owner grew up two streets from the ground.`]],
 legend:[(c)=>[`Happy birthday, ${c.legend.split(' ')[0]} ${lastName(c.legend)}`,`The club legend came to training and told the same stories as last year. Everyone listened anyway.`]],
 topForm:[p=>[`${lastName(p.name)} is flying`,`Everything he touches in training goes in.`],p=>[`${lastName(p.name)} in the form of his life`,`The coach says he has never seen him this sharp.`]],
 lateNight:[p=>[`${lastName(p.name)} stays behind`,`Long after the others had gone, he was still practising free kicks.`],p=>[`Extra work for ${lastName(p.name)}`,`He asked the goalkeeper coach for twenty more minutes. Then another twenty.`]],
 mentor:[(p,q)=>[`${lastName(p.name)} takes ${lastName(q.name)} under his wing`,`The old pro and the kid, side by side at every session.`]],
 homesick:[p=>[`${lastName(p.name)} misses home`,`${p.home} feels far away this week. The squad took him out for dinner.`]],
 school:[p=>[`${lastName(p.name)} visits a primary school`,`Two hundred kids, one football, a lot of noise.`],p=>[`${lastName(p.name)} at the children's ward`,`He stayed an hour longer than planned.`]],
 shirts:[p=>[`${lastName(p.name)} shirts sell out`,`The club shop has ordered more. Kids want his number.`]],
 coachIdea:[(n)=>[`${lastName(n)} tries something new`,`A new drill this week: small pitches, two touches, lots of shouting.`],(n)=>[`${lastName(n)} brings in a yoga teacher`,`The defenders complained. Then they asked for a second session.`]],
 scouting:[(n,fa)=>[`${lastName(n)} on the road`,`Watched ${fa.name}, a free ${POS_ONE[fa.pos]}, on a wet Tuesday night.`]],
 physio:[(n,o)=>[n?`${n} on the treatment table`:`An empty treatment room`,n?`Ice baths all round before ${o}.`:`Everyone fit for ${o}. The physio is reorganising his shelves.`]],
 leader:[(c)=>[`${c.name} lead the way`,`Top of the ${c.tier===0?'Premier':'One'} and looking strong.`]],
 rivalWatch:[(c,p)=>[`${c.name} sit ${p}`,`The neighbours are being watched closely in the pubs this week.`]],
 groundsman:[(g,o,n)=>[`${lastName(g)} gets the pitch ready`,`${g} has been out since six, cutting stripes for ${o}.`],(g,o,n)=>[`New nets for the ${o} game`,`${g} says the old ones had ${n} holes nobody wanted to talk about.`],(g,o,n)=>[`${lastName(g)}'s pride`,`${n} hours on the pitch this week. ${o} won't find a better one.`]],
 pubTalk:[(g,o,n)=>[`${g} talk about ${o}`,`${n} of them in the bar on Thursday, and ${n} different line-ups.`],(g,o,n)=>[`A full bar before ${o}`,`${g} stayed until closing. Someone brought a drum.`]],
 volunteers:[(o,n)=>[`${n} volunteers paint the turnstiles`,`All done in time for ${o}. Most of the paint ended up on the volunteers.`],(o,n)=>[`The tea hut is ready for ${o}`,`${n} pies ordered. The new urn finally works.`],(o,n)=>[`${n} volunteers sell raffle tickets`,`First prize: a signed ball, and a seat in the dugout against ${o}.`]],
 weather:[(o,n)=>[`Rain before ${o}`,`${n} millimetres this week. The groundsman has been out every morning with a fork.`],(o,n)=>[`A cold week before ${o}`,`${n} degrees on Tuesday. The kitman has found the long sleeves.`]]
};
const SHOPS=['Kett\'s Bakery','Holt & Sons Builders','The Harbour Fish Bar','Garside Motors','Oakes Printing','Vasey Opticians','The Railway Café'];
function feedUsed(txt){S.feedUsed=S.feedUsed||{};const k=txt.toLowerCase();if(S.feedUsed[k]&&S.season-S.feedUsed[k]<2)return true;return false}
function feedMark(txt){S.feedUsed=S.feedUsed||{};S.feedUsed[txt.toLowerCase()]=S.season}
function nextOppName(w){const c=S.clubs[S.cf.club],f=S.fx[c.tier]&&S.fx[c.tier][w-1];const g=f&&f.find(([h,a])=>h===S.cf.club||a===S.cf.club);return g?S.clubs[g[0]===S.cf.club?g[1]:g[0]].name:'Saturday'}
function feedWeek(w){
  const cf=S.cf,c=S.clubs[cf.club],cards=[],sq=cf.squad;S.feedCool=S.feedCool||{};
  const now=S.season*100+w,ok=k=>(S.feedCool[k]||-99)<=now-3;
  const nf=nextOppName(w),gm=cf.groundsman||(cf.groundsman=`${pick(PFIRST)} ${pick(PLAST)}`);
  const add=(src,kind,fn,args,o={})=>{if(cards.length>=6)return false;const variants=FT[kind];for(let i=0;i<variants.length;i++){const v=variants[(i+Math.floor(rnd()*variants.length))%variants.length];const [head,line]=v(...args);if(feedUsed(head+line))continue;feedMark(head+line);S.feedPid=S.feedPid||{};const prev=o.pid&&S.feedPid[o.pid];if(prev&&prev.s===S.season&&w-prev.w<=6&&prev.w<w&&!['birthday','school','homesick'].includes(kind))o.follow=true;if(o.pid)S.feedPid[o.pid]={s:S.season,w};cards.push({id:'f'+S.season+'_'+w+'_'+cards.length,src,kind,head,line,...o});if(!o.always)S.feedCool[kind]=now;return true}return false};
  const evs=cf.events.filter(e=>e.s===S.season&&(e.w===w||e.w===w-1)&&!e.fed);evs.forEach(e=>e.fed=1);
  // 1. players: storylines from this week, follow-ups first
  for(const e of evs.filter(e=>e.kind==='story')){const p=playerById(e.pid);if(!p)continue;
    if(FT[e.sk]&&(ok(e.sk)||['debut','firstGoal','winner','comeback'].includes(e.sk)))add('players',e.sk,null,[p],{pid:p.id,follow:p.trainSeen&&e.sk==='debut',always:true})}
  for(const e of evs.filter(e=>e.kind==='injury'&&e.key)){const p=playerById(e.pid);if(p)add('players','injury',null,[p],{pid:p.id,always:true})}
  for(const e of evs.filter(e=>e.kind==='return')){const p=playerById(e.pid);if(p&&p.injFor>=3&&ok('back'))add('players','back',null,[p],{pid:p.id,follow:true})}
  const kid=sq.find(p=>p.academy&&p.apps===0&&p.form>=65&&!p.trainSeen&&!p.loan);if(kid&&ok('training')){kid.trainSeen=w;add('players','training',null,[kid],{pid:kid.id})}
  if(ok('birthday')&&rnd()<.35){const p=fv(sq);add('players','birthday',null,[p],{pid:p.id})}
  if(ok('dad')&&rnd()<.08){const p=fv(sq.filter(x=>x.age>=24));if(p)add('players','dad',null,[p],{pid:p.id})}
  if(ok('spat')&&rnd()<.15){const t=sq.filter(x=>x.trait==='temperamental');if(t.length>=2){const [a,b]=[t[0],t[1]];a.morale=clamp(a.morale-3,0,99);b.morale=clamp(b.morale-3,0,99);add('players','spat',null,[a,b],{pid:a.id})}}
  if(ok('friends')&&rnd()<.12){const a=fv(sq),b=fv(sq.filter(x=>x!==a&&Math.abs(x.age-a.age)<4));if(a&&b)add('players','friends',null,[a,b],{pid:a.id})}
  // 2. staff at work
  const td=P(cf.tdId);const tdE=evs.find(e=>e.kind==='buy')||evs.find(e=>['sale','keySale','pass','renew','loanIn'].includes(e.kind));
  if(tdE)add('staff',tdE.kind==='buy'?'tdBuy':'tdWork',null,[tdE,td?td.name:'The director'],{pid:tdE.pid});
  if(ok('youth')&&rnd()<.4){const a=ri(0,4),b=ri(0,3);add('staff','youth',null,[{a,b,w:a>b,d:a===b}])}
  if(ok('finance')&&cf.fin&&rnd()<.25){const fi=P(S.clubs[cf.club].cast.finance);add('staff','finance',null,[cf.fin,fi?fi.name:'Finance'])}
  // 3. the region (world news, most relevant first)
  const news=(S.news||[]).filter(n=>n.s===S.season&&!n.fed).sort((a,b)=>a.pri-b.pri).slice(0,2);
  for(const n of news){n.fed=1;const head=n.text.split(/[.:]/)[0].slice(0,60),text=n.text.length>head.length+2?n.text.slice(head.length+1).trim()||'The region talks of little else.':'The region talks of little else.';add('region','region',null,[{head,text}],{always:true})}
  // 4. town and fans
  const fx=S.fx[c.tier]&&S.fx[c.tier][w-1];const away=fx&&fx.find(([h,a])=>a===cf.club);
  if(away&&ok('soldOut')&&(away[0]===c.rival||rnd()<.2))add('town','soldOut',null,[S.clubs[away[0]].name]);
  if(ok('sponsor')&&rnd()<.12)add('town','sponsor',null,[fv(SHOPS)]);
  if(ok('legend')&&rnd()<.05)add('town','legend',null,[c]);
  // fill: every week at least four cards and three sources, with ordinary club life
  const fillers={
    players:[()=>{const p=sq.filter(x=>x.form>=74&&!x.loan).sort((a,b)=>b.form-a.form)[0];return p&&ok('topForm')&&add('players','topForm',null,[p],{pid:p.id})},
             ()=>{const p=fv(sq.filter(x=>x.trait==='professional'));return p&&ok('lateNight')&&add('players','lateNight',null,[p],{pid:p.id})},
             ()=>{const v=fv(sq.filter(x=>x.age>=30)),k=fv(sq.filter(x=>x.age<=20));return v&&k&&ok('mentor')&&add('players','mentor',null,[v,k],{pid:k.id})},
             ()=>{const p=fv(sq.filter(x=>ABROAD.includes(x.home)));return p&&ok('homesick')&&add('players','homesick',null,[p],{pid:p.id})},
             ()=>{const p=fv(sq.filter(x=>x.localKid));return p&&ok('school')&&add('players','school',null,[p],{pid:p.id})},
             ()=>{const p=sq.slice().sort((a,b)=>b.sGoals-a.sGoals)[0];return p&&p.sGoals>=3&&ok('shirts')&&add('players','shirts',null,[p],{pid:p.id})}],
    staff:[()=>{const co=P(c.cast.coach);return co&&ok('coachIdea')&&add('staff','coachIdea',null,[co.name])},
           ()=>{const fa=fv(S.fa||[]);return td&&fa&&ok('scouting')&&add('staff','scouting',null,[td.name,fa])},
           ()=>{const n=sq.filter(x=>x.inj>0).length;return ok('physio')&&add('staff','physio',null,[n,nf])},
           ()=>ok('youth')&&add('staff','youth',null,[{a:ri(0,4),b:ri(0,3),w:rnd()<.5,d:rnd()<.2}])],
    region:[()=>{const l=Object.keys(S.tbl).filter(i=>S.clubs[i].tier===c.tier&&i!==cf.club).sort((a,b)=>S.tbl[b].pts-S.tbl[a].pts)[0];return l&&w>3&&ok('leader')&&add('region','leader',null,[S.clubs[l]])},
            ()=>{const r=c.rival;return r&&S.tbl[r]&&w>3&&ok('rivalWatch')&&add('region','rivalWatch',null,[S.clubs[r],ord(Object.keys(S.tbl).filter(i=>S.clubs[i].tier===S.clubs[r].tier).sort((a,b)=>S.tbl[b].pts-S.tbl[a].pts).indexOf(r)+1)])}],
    town:[()=>ok('groundsman')&&add('town','groundsman',null,[gm,nf,ri(3,40)]),
          ()=>{const g=c.groups.slice().sort((a,b)=>b.share-a.share)[0];return ok('pubTalk')&&add('town','pubTalk',null,[g.k==='workers'?TOWNS[c.town].wk:ARCH[g.k].n,nf,ri(12,80)])},
          ()=>ok('volunteers')&&add('town','volunteers',null,[nf,ri(6,30)]),
          ()=>ok('sponsor')&&add('town','sponsor',null,[fv(SHOPS)]),
          ()=>ok('weather')&&add('town','weather',null,[nf,ri(2,40)])]};
  const order=['players','staff','region','town'];const tried=new Set();let guard=0;
  while((cards.length<4||new Set(cards.map(x=>x.src)).size<3)&&guard++<16){
    const have=new Set(cards.map(x=>x.src));let src=order.find(s=>!have.has(s)&&!tried.has(s));
    if(!src){tried.clear();src=order.find(s=>!tried.has(s))}
    tried.add(src);const fs=fillers[src].slice().sort(()=>rnd()-.5);for(const f of fs){if(f())break}}
  // the most important card first: own players' big moments, then people you know, then the rest
  const rank={debut:0,firstGoal:0,winner:1,comeback:1,injury:2,training:2,tdBuy:3,region:4,slump:3};
  cards.sort((a,b)=>(rank[a.kind]??5)-(rank[b.kind]??5));
  S.feed=cards.slice(0,6);S.feedLog=(S.feedLog||[]).concat(S.feed.map(x=>({s:S.season,w,kind:x.kind,src:x.src,follow:!!x.follow}))).slice(-400);
  return S.feed;
}
