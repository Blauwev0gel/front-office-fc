/* ================= The opening: a newcomer, three dossiers, a sealed secret, a signature =================
   title -> the call (your name, three messages) -> the dossiers -> sign -> welcome -> the envelope (the secret,
   with a real consequence) -> the speech (the manifest, with the terrace reacting) -> day one's crisis -> staff.
   Every secret has one concrete effect in existing systems and its own first crisis. Half are good news. */
const SEAT_LABELS={chalice:'Poisoned chalice',rescue:'Rescue job',giant:'Sleeping giant',quiet:'The quiet one',dark:'Dark horse'};
const SEAT_QUOTE={chalice:'They say you are not afraid of a fight.',rescue:'We need someone. Anyone. Can we talk?',giant:'This town remembers better days. Do you?',quiet:'A steady club wants a steady hand.',dark:'Nobody rates us. That could suit you.'};
function seatLabel(c,used){const d=clubDiff(c),order=[d>=4?'chalice':null,c.debt>=150?'rescue':null,c.tier===1&&c.founded<1900?'giant':null,d<=1?'quiet':null,'dark','giant','rescue','quiet','chalice'].filter(Boolean);return order.find(k=>!used.has(k))}
function seatDream(c){const r=CL(c.rival);if(c.debt>=150)return'Clear the debt and own the club again';if(c.tier===1)return'Back to the Northmarch Premier';if(c.last<=6)return'A first league title in a generation';return r?`Finish above ${r.name}, at last`:'A full house every week'}
function seatPitch(c,reason){return`${reason.charAt(0).toUpperCase()+reason.slice(1)}. ${c.scar.charAt(0).toUpperCase()+c.scar.slice(1)}.`}

/* ----- the secrets ----- */
const SECRETS={
  wonderkid:{good:true,ic:'⭐',chip:'A wonderkid in the academy',
    text:()=>{const p=secretKid();return`${p.name}, ${p.age}, is the best young player in the county. Premier clubs are already circling.`},
    apply:()=>{const p=secretKid(),xi=squadQuality(S.cf.squad,0);p.pa=Math.max(p.pa+1,Math.round((xi+3.5)*10)/10);p.q=Math.max(p.q,Math.round((xi-1)*10)/10);p.wonderkid=1;S.cf.talentPid=p.id},
    crisis:()=>{const p=secretKid();return{t:`A Premier club offers £60k for ${p.name}`,
      a:{t:'Sell him now',tone:'safe',give:[p.name,'The Ultras\' trust'],get:['£60k in the bank'],run:()=>{S.cf.squad.splice(S.cf.squad.indexOf(p),1);cash(60,`${p.name} sold on day one`);grp(fanGroup(),-5,`You sold ${p.name} before he played`)}},
      b:{t:'He stays and gets minutes',tone:'bold',give:['£60k'],get:['A local hero in the making'],run:()=>{grp(fanGroup(),4,`You kept ${p.name}`);p.morale=Math.min(90,(p.morale||60)+15);setTouch(p,'whose future you protected on day one')}}}}},
  legacy:{good:true,ic:'✉',chip:'+£25k in a will',
    text:()=>'An old member left the club £25k in her will. Nobody has spent it yet.',
    apply:()=>cash(25,'An old member\'s will'),
    crisis:()=>({t:'What happens to the £25k?',
      a:{t:'Into the transfer budget',tone:'safe',give:['A gesture to the members'],get:['£25k more for the director'],run:()=>{S.cf.budgetLeft+=25;S.flags.legacyBudget=25}},
      b:{t:'A new roof on the old stand',tone:'bold',give:['£25k'],get:['The oldest members, moved'],run:()=>{cash(-25,'A new roof on the old stand');grp(topGroup(),5,'You spent the will on the old stand')}}})},
  homecoming:{good:true,ic:'🏠',chip:'A club legend, for free',
    text:()=>{const p=secretHome();return`${p.name}, ${p.age}, a former hero here, wants to come home. He would play for almost nothing.`},
    apply:()=>{const p=secretHome();if(!S.cf.squad.includes(p))S.cf.squad.push(p)},
    crisis:()=>{const p=secretHome();return{t:`${p.name} wants the captain's armband back`,
      a:{t:'Give it to him',tone:'bold',give:['The current captain\'s pride'],get:['The terrace on its feet'],run:()=>{grp(topGroup(),4,`${p.name} is captain again`);const c=cast('captain');if(c)loy(c,'against','You gave the armband away',{raw:-1})}},
      b:{t:'He has to earn it',tone:'safe',give:['A headline'],get:['A calm dressing room'],run:()=>{const c=cast('captain');if(c)loy(c,'wish','You kept the armband where it was')}}}}},
  fans:{good:true,ic:'🎟',chip:'Season tickets up',
    text:()=>'Season-ticket sales are up fifteen percent since the news broke. They believe in you already.',
    apply:()=>{grp(topGroup(),5,'Season tickets are up since you arrived');cash(10,'Early season-ticket money')},
    crisis:()=>({t:'The supporters want a say in the new kit',
      a:{t:'Let them vote',tone:'safe',give:['A month of meetings'],get:['A kit they love'],run:()=>{grp(fanGroup(),4,'The fans chose the kit')}},
      b:{t:'Keep the traditional kit',tone:'bold',give:['The newcomers\' wish'],get:['The old guard pleased'],run:()=>{grp(topGroup(),2,'The kit stays as it always was')}}})},
  taxman:{good:false,ic:'⚠',chip:'−£40k due by March',
    text:()=>'£40k owed to the taxman. Nobody told the members. It is due in March.',
    apply:()=>{C().debt+=40;S.flags.taxDue=40},
    crisis:()=>({t:'The taxman writes: pay by March',
      a:{t:'Tell the members now',tone:'safe',give:['A calm summer'],get:['Trust: you hid nothing'],run:()=>{for(const g of C().groups)grp(g.k,1,'You told them about the tax bill');S.rep++}},
      b:{t:'Pay it quietly from the budget',tone:'bold',give:['£40k of transfer money'],get:['Nobody panics'],run:()=>{S.cf.budgetLeft=Math.max(0,S.cf.budgetLeft-40);C().debt-=40;cash(-40,'The tax bill, paid quietly');S.flags.taxDue=0}}})},
  feud:{good:false,ic:'⚡',chip:'A split dressing room',
    text:()=>`The captain and the coach have not spoken in a year.`,
    apply:()=>{const a=cast('captain'),b=cast('coach');if(a&&b)addRel(a,b,'rivals');const sq=S.cf.squad;for(const p of sq)p.morale=Math.max(35,(p.morale||60)-6)},
    crisis:()=>({t:'The captain wants a meeting without the coach',
      a:{t:'Meet him, alone',tone:'bold',give:['The coach\'s trust'],get:['The captain\'s ear'],run:()=>{const a=cast('captain'),b=cast('coach');if(a)loy(a,'wish','You met them alone on day one');if(b)loy(b,'against','You met the captain behind their back')}},
      b:{t:'Meet them together',tone:'safe',give:['The captain\'s patience'],get:['One message, one club'],run:()=>{for(const p of S.cf.squad)p.morale=Math.min(90,(p.morale||60)+4);const a=cast('captain');if(a)loy(a,'against','You would not see them alone',{raw:-.5})}}})},
  wantsOut:{good:false,ic:'✈',chip:'Your best player wants out',
    text:()=>{const p=secretBest();return`${p.name}, your best player, has told friends he wants to leave this summer.`},
    apply:()=>{const p=secretBest();p.morale=40;p.contract=1;p.wantsOut=1},
    crisis:()=>{const p=secretBest();return{t:`${p.name} asks to see you`,
      a:{t:'Promise him a better contract',tone:'bold',give:['£200 a week more','The wage cap'],get:[`${p.name} stays happy`],run:()=>{p.wage+=200;p.morale=70;p.contract=3;p.wantsOut=0}},
      b:{t:'Leave it to the director',tone:'safe',give:[`Maybe ${p.name}`],get:['A clear line: the director decides'],run:()=>{const t=cast('td');if(t)loy(t,'wish','You left transfers to the director')}}}}},
  pitch:{good:false,ic:'🌧',chip:'−£25k: the pitch',
    text:()=>'The pitch drains like a sponge. It needs relaying before the first home game: £25k.',
    apply:()=>cash(-25,'Relaying the pitch'),
    crisis:()=>({t:'The groundsman wants a full new drainage system',
      a:{t:'Do it properly: £15k more',tone:'bold',give:['£15k'],get:['No more postponements'],run:()=>{cash(-15,'New drainage')}},
      b:{t:'Patch it for now',tone:'safe',give:['The groundsman\'s respect'],get:['Money kept'],run:()=>{grp(topGroup(),-1,'A muddy pitch again')}}})},
  sponsor:{good:false,ic:'👕',chip:'−£20k: no shirt sponsor',
    text:()=>'The shirt sponsor pulled out last week. The shirts are printed, the money is gone: £20k.',
    apply:()=>cash(-20,'The shirt sponsor pulled out'),
    crisis:()=>({t:'A betting firm offers to sponsor the shirts',
      a:{t:'Take the money',tone:'bold',give:['The families\' goodwill'],get:['£25k'],run:()=>{cash(25,'A betting firm on the shirts');grp(grpOf('families')?'families':topGroup(),-5,'A betting logo on the children\'s shirts')}},
      b:{t:'Ask a local business instead',tone:'safe',give:['£15k less'],get:['A shirt the town is proud of'],run:()=>{cash(10,'A local sponsor on the shirts');grp(topGroup(),2,'A local name on the shirts')}}})}};
const SECRET_GOOD=Object.keys(SECRETS).filter(k=>SECRETS[k].good),SECRET_BAD=Object.keys(SECRETS).filter(k=>!SECRETS[k].good);
function secretKid(){const sq=S.cf.squad;return sq.find(p=>p.wonderkid)||sq.filter(p=>p.age<=19).sort((a,b)=>b.pa-a.pa)[0]||sq.slice().sort((a,b)=>a.age-b.age)[0]}
function secretBest(){return S.cf.squad.filter(p=>!p.loanIn).sort((a,b)=>b.q-a.q)[0]}
function secretHome(){const sq=S.cf.squad;let p=sq.find(x=>x.homecoming);if(p)return p;if(!S.secret.home){const xi=squadQuality(sq,0);const n=newPlayer(pick(['CB','CM','ST','W']),{age:ri(32,34),q:Math.round((xi+.6)*10)/10,contract:1,trait:'local hero'});n.wage=250;n.homecoming=1;n.localKid=true;n.story='Came home to finish where he started.';S.secret.home=n}return S.secret.home}

/* ----- the dossiers ----- */
function dressSeats(){
  const used=new Set(),secrets=[pick(SECRET_GOOD),pick(SECRET_BAD)];secrets.push(pick(Object.keys(SECRETS).filter(k=>!secrets.includes(k))));
  const order=pickN([0,1,2],3);
  S.seats.forEach((s,i)=>{const c=CL(s.id),k=seatLabel(c,used);used.add(k);s.label=k;s.stars=Math.min(5,clubDiff(c)+1);s.dream=seatDream(c);s.pitch=seatPitch(c,s.reason);s.secret=secrets[order[i]]});
}
function startCall(name){S.name=(String(name||'').trim()||'Alex Whitmore').slice(0,28);S.phase='seats';S.screen='seats'}
function pickSeat(id){S.pendingSeat=id;S.screen='sign'}
function signContract(){
  const s=S.seats.find(x=>x.id===S.pendingSeat)||S.seats[0];chooseSeat(s.id);S.secret={id:s.secret,club:s.id,revealed:false};S.dayOne=true;
  newsPush(`${S.name||'A newcomer'} is the new chairman of ${C().name}.`,[],[C().id]);S.screen='signed';
}
function openEnvelope(){const sc=S.secret;if(!sc||sc.revealed)return;const d=SECRETS[sc.id];sc.text=d.text();d.apply();sc.revealed=true;log(`The envelope: ${d.chip}`,sc.text,null)}
function secretCrisis(){const sc=S.secret;return sc&&SECRETS[sc.id]?SECRETS[sc.id].crisis():null}
function answerCrisis(k){const cr=secretCrisis();if(!cr||S.crisisDone)return;const o=cr[k]||cr.a;o.run();S.crisisDone={k,t:o.t,tone:o.tone}}
function afterCrisis(){S.dayOne=false;S.crisisDone=null;if(S.cf&&!S.cf.tdHired)startTdHire();else startMeeting()}
// the terrace reacts to each line of the speech: the groups a promise touches cheer
function speechReact(id){
  if(!id||id==='none'){S.speech=(S.speech||[]).concat([{id,txt:'A polite applause.'}]);return}
  const gs=pgroups(id);for(const g of gs)grp(g,2,`Your speech: ${pdef(id).t.toLowerCase()}`);
  const other=C().groups.filter(g=>!gs.includes(g.k)).sort((a,b)=>a.mood-b.mood)[0];
  S.speech=(S.speech||[]).concat([{id,txt:gs.length?`${gs.slice(0,2).map(k=>gname(C(),k)).join(' and ')} cheer${other?`. ${gname(C(),other.k)} stay quiet`:''}.`:'A polite applause.'}]);
}

function topGroup(){return C().groups.slice().sort((a,b)=>b.share-a.share)[0].k}
function fanGroup(){return ['ultras','students','workers'].find(grpOf)||topGroup()}
