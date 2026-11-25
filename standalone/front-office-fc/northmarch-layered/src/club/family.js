/* ================= L5 Dynasty: your family, succession and family moments =================
   Design: standalone-research/FAMILIE-VOORZITTER.md (choice 76). Crusader Kings as the source, but only what yields decisions:
   you are a person (age, two traits) with a partner and children who grow up, inherit a trait and choose a path.
   Succession: retire from 68, health after 65, or a voted-out chairman. A members' club is no inheritance: the heir must be
   elected at the AGM; a rejected heir carries the dynasty on at another club. The dynasty book keeps every generation.
   Moments: at most one open at a time and a quiet gap between them; each has options with real effects and a default if ignored.
   Owns S.family = {surname, gen, members[], book[], heir, retire, moment, last, log[]}. No DOM. Old saves get a family on load. */
const FAM_GAP=6,MOMENT_DEADLINE=2,RETIRE_AGE=68;
const FAM_FIRST=['Alex','Sam','Charlie','Jo','Robin','Morgan','Frankie','Jamie','Kit','Rowan','Ellis','Toby','Ruth','Ada','Hugh','Isla','Edwin','Maud','Owen','Nell'];
function FAM(){if(!S.family)familyInit();return S.family}
function famMember(rel,age,traits,o={}){return{id:'f'+(S.pc++),first:o.first||pick(FAM_FIRST),rel,age,traits:traits||pickN(TRAITS,2),path:o.path||null,pid:null,job:null,alive:true}}
function familyInit(){
  const surname=pick(LAST),you=famMember('you',ri(48,55)),partner=famMember('partner',you.age+ri(-4,3));
  const kids=Array.from({length:ri(1,3)},()=>{const k=(()=>{const a=pick(you.traits);return famMember('child',ri(9,24),[a,pick(TRAITS.filter(t=>t!==a))])})();if(k.age>=19)k.path=pick(['business','away']);return k});
  S.family={surname,gen:1,members:[you,partner,...kids],book:[{gen:1,first:you.first,from:S.season,to:null,clubs:[],why:null}],heir:null,retire:false,moment:null,last:-99,log:[]};
}
function famHead(){return FAM().members.find(m=>m.rel==='you')}
function famName(m){return`${m.first} ${FAM().surname}`}
function famKids(){return FAM().members.filter(m=>m.rel==='child'&&m.alive)}
function famAdults(){return famKids().filter(k=>k.age>=21&&k.path!=='away')}
function famNow(){return S.season*100+S.week}
function famLog(text){const F_=FAM();F_.log.push({s:S.season,w:S.week,text});if(F_.log.length>60)F_.log.shift()}

/* ----- the moments: triggers from the real state, options with effects ----- */
const FAM_MOMENTS={
  path:{when:()=>famKids().find(k=>k.age>=16&&!k.path),
    make:k=>({title:`${k.first} has to choose a path`,who:famName(k),text:`${k.first} is ${k.age} and ${k.traits.join(' and ')}. The academy has offered a place; there is also a future outside football.`,
      opts:[{label:'The academy',sub:'A place in the youth squad. Members may wonder if it is merit.'},{label:'Business school',sub:'A possible heir with a head for money'},{label:'Their own way',sub:'Away from the club; a warmer bond with you'}],dflt:2})},
  family_player:{when:()=>{const k=famKids().find(x=>x.pid&&S.squads[S.my].some(p=>p.id===x.pid));if(!k||S.week<10)return null;const p=S.squads[S.my].find(x=>x.pid===k.pid||x.id===k.pid);return p&&p.sApps<S.week*.2?k:null},
    make:k=>({title:`Is ${k.first} good enough?`,who:'Head coach',text:`${famName(k)} has hardly played. The dressing room is watching how you react, and so are the members.`,
      opts:[{label:'The coach decides',sub:'Fair, and the members notice. Your child may resent it.'},{label:'Ask for more games',sub:'Your child is grateful; the members cry favouritism'},{label:'Let the director loan them out',sub:'Loans are allowed from now on; games elsewhere'}],dflt:0})},
  job:{when:()=>famAdults().find(k=>k.path==='business'&&!k.job&&k.age>=24),
    make:k=>({title:`${k.first} wants a role at the club`,who:famName(k),text:`${k.first} wants to run the commercial side. Loyal to you, but untested, and the Old Guard hate nepotism.`,
      opts:[{label:'Give them the job',sub:'Commercial gets an extra pair of hands; members −4 confidence'},{label:'Not at this club',sub:'No nepotism; your child may hold it against you'}],dflt:1})},
  succession:{when:()=>{const h=famHead();return h.age>=66&&!FAM().heir&&famAdults().length?h:null},
    make:h=>({title:'Who follows you?',who:'The family',text:`You are ${h.age}. A members' club is no inheritance, but a name to put forward helps. Your heir must still win the AGM.`,
      opts:[...famAdults().slice(0,3).map(k=>({label:`Put forward ${k.first}`,sub:`${k.age}, ${k.traits.join(' and ')}${k.job?' · already at the club':''}`,heir:k.id})),{label:'Not yet',sub:'Decide later'}],dflt:-1})},
  health:{when:()=>{const h=famHead();return h.age>=65&&!FAM().retire&&rnd()<.04?h:null},
    make:h=>({title:'The doctors are worried',who:'Your partner',text:`At ${h.age} your heart is not what it was. Your partner wants you to step down this summer.`,
      opts:[{label:'Step down this summer',sub:'Your heir stands at the AGM'},{label:'Carry on',sub:'The next warning may not be a warning'}],dflt:1})},
  retire:{when:()=>{const h=famHead();return h.age>=RETIRE_AGE&&!FAM().retire&&S.week>=20&&S.week<=26?h:null},
    make:h=>({title:'One more season?',who:'You',text:`You are ${h.age}. You can hand over at the AGM, or go on for another year.`,
      opts:[{label:'Retire at the AGM',sub:FAM().heir?'Your heir stands for election':'No heir named: the dynasty waits'},{label:'One more season',sub:'The members decide whether you stay'}],dflt:1})}
};
function familyWeek(){
  if(!S.my||S.phase!=='season')return;const F_=FAM();
  if(F_.moment){if(famNow()-F_.moment.at>=MOMENT_DEADLINE){const d=F_.moment.dflt;familyChoose(d<0?F_.moment.opts.length-1:d,true)}return}
  if(S.moment)return;if(famNow()-Math.max(F_.last,S.momentLast??-99)<FAM_GAP)return;
  F_.seen=F_.seen||{};
  for(const key of ['health','retire','succession','path','family_player','job']){if(F_.seen[key]&&famNow()-F_.seen[key]<100)continue;const who=FAM_MOMENTS[key].when();if(who){F_.seen[key]=famNow();
    const m=FAM_MOMENTS[key].make(who);F_.moment={key,at:famNow(),...m,fid:who.id};F_.last=famNow();emit('FamilyMoment',S.my,m.title);return}}
}
function familyChoose(i,silent){
  const F_=FAM(),mo=F_.moment;if(!mo)return{ok:false,err:'Nothing to decide'};const o=mo.opts[i];if(!o)return{ok:false,err:'Unknown option'};
  const k=F_.members.find(m=>m.id===mo.fid),id=S.my;let note='';
  if(mo.key==='path'){
    if(i===0){const p=newPlayer(pick(POS.slice(1)),{age:k.age,q:squadQuality(S.squads[id])-3+rnd()*1.5,pa:squadQuality(S.squads[id])+rnd()*2.5,academy:true,contract:3,club:id,name:famName(k)});p.career.push('Academy');p.family=true;S.squads[id].push(p);k.pid=p.id;k.path='academy';note=`${k.first} joins the academy.`;if(!k.traits.includes('ambitious'))k.traits[1]='ambitious'}
    else if(i===1){k.path='business';note=`${k.first} goes to business school.`}
    else{k.path='away';if(!k.traits.includes('warm'))k.traits[1]='warm';note=`${k.first} goes their own way, with your blessing.`}}
  if(mo.key==='family_player'){
    if(i===0){confLog(id,2,'The chairman kept out of team selection');if(rnd()<.5&&!k.traits.includes('resentful'))k.traits[1]='resentful';note=`You leave it to the coach. ${k.first} ${k.traits.includes('resentful')?'feels let down':'understands'}.`}
    else if(i===1){confLog(id,-5,'Favouritism: the chairman’s child gets games');note=`The coach plays ${k.first} more. The members are muttering.`;}
    else{F(id).policy.loans=true;note=`Loans are allowed: the director can send ${k.first} out at the next window.`}}
  if(mo.key==='job'){
    if(i===0){k.job='commercial';const d=G(id).depts.commercial;d.staff=Math.min(5,d.staff+1);confLog(id,-4,'Nepotism: the chairman’s child runs commercial');note=`${famName(k)} now runs the commercial side.`}
    else{if(rnd()<.6&&!k.traits.includes('resentful'))k.traits[1]='resentful';note=`${k.first} is told no. ${k.traits.includes('resentful')?'They will remember.':'They take it well.'}`}}
  if(mo.key==='succession'){if(o.heir){F_.heir=o.heir;note=`${famName(F_.members.find(m=>m.id===o.heir))} is your chosen heir.`}else note='The succession can wait.'}
  if(mo.key==='health'){if(i===0){F_.retire=true;note='You will step down at the AGM.'}else{note='You carry on, against advice.'}}
  if(mo.key==='retire'){if(i===0){F_.retire=true;note='You will retire at the AGM.'}else note='One more season, then.'}
  F_.moment=null;famLog((silent?'You said nothing: ':'')+(note||o.label));if(id)emit('FamilyChoice',id,note||o.label);
  return{ok:true,note};
}
/* ----- season end: everyone ages; health may force the issue; a retiring chairman hands over at the AGM ----- */
function familySeasonEnd(){
  if(!S.family||!S.my)return;const F_=S.family,h=famHead();
  for(const m of F_.members)if(m.alive)m.age++;
  if(h.age>=72&&rnd()<.12){F_.retire=true;famLog(`${famName(h)} falls ill and must step down.`)}
  for(const k of famKids())if(k.pid){const f=findPlayer(k.pid);if(!f)k.pid=null}
}
/* called after the AGM (closeSeason): if the chairman retires, the heir stands for election in his place */
function familySuccession(){
  if(!S.family||!S.my||!S.family.retire)return null;const F_=S.family,h=famHead(),id=S.my,heir=F_.members.find(m=>m.id===F_.heir&&m.alive);
  const book=F_.book[F_.book.length-1];book.to=S.season;book.why='Retired';F_.retire=false;
  if(!heir){const next=famAdults().sort((a,b)=>b.age-a.age)[0];
    if(!next){book.to=null;book.why=null;famLog(`${famName(h)} wanted to step down, but there is no one to hand over to. You carry on.`);return{elected:false,none:true}}
    F_.heir=next.id;return familySuccessionWith(next,h,book,id)}
  return familySuccessionWith(heir,h,book,id);
}
function familySuccessionWith(heir,h,book,id){const F_=S.family;
  if(heir.pid){const f=findPlayer(heir.pid);if(f&&f.club&&S.squads[f.club]){const sq=S.squads[f.club];sq.splice(sq.indexOf(f.p),1)}heir.pid=null;heir.path='business'}
  const bonus=(heir.traits.includes('warm')||heir.traits.includes('honest')?6:0)-(heir.traits.includes('greedy')||heir.traits.includes('vain')?6:0)+(heir.job?4:0)+(S.rep||0)*1.5;
  const share=clamp(Math.round(20+.7*M(id).conf+bonus+(rnd()-.5)*16),5,95),elected=share>=50;
  h.rel='elder';heir.rel='you';F_.gen++;F_.heir=null;F_.book.push({gen:F_.gen,first:heir.first,from:S.season+1,to:null,clubs:[],why:null});
  const st=S.career[S.career.length-1];if(st){st.to=S.season;st.why=`${famName(h)} retired; ${heir.first} ${elected?'elected':'rejected'} (${share}%)`}
  if(elected){S.career.push({club:id,from:S.season+1,to:null,why:null});M(id).conf=r1(clamp(55+bonus,35,80));famLog(`${famName(heir)} is elected chairman with ${share}% of the vote. Generation ${F_.gen} begins.`)}
  else{S.votedOut=id;famLog(`The members reject ${famName(heir)} (${share}%). The ${F_.surname}s will have to start again elsewhere.`)}
  S.rep=r1((S.rep||0)*.8);
  return{elected,share,heir:famName(heir)};
}
onWeek(familyWeek);
