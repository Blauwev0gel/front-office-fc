/* ================= Football: players and squads =================
   Owns S.squads[clubId] (and S.fa, the free agents, in market.js). Positions, NEAR, REQ, XI_SLOTS, pickXI and
   squadQuality come from voorzitter-fundering club/players.js (which took them from claude-game). Adapted so every
   club has a squad (decision D1), with weekly development and injuries driven by the club's facilities. */
const POS=['GK','CB','FB','DM','CM','AM','W','ST'];
const POS_L={GK:'Goalkeepers',CB:'Centre-backs',FB:'Full-backs',DM:'Holding midfield',CM:'Central midfield',AM:'Attacking midfield',W:'Wingers',ST:'Strikers'};
const POS_ONE={GK:'goalkeeper',CB:'centre-back',FB:'full-back',DM:'holding midfielder',CM:'central midfielder',AM:'attacking midfielder',W:'winger',ST:'striker'};
const NEAR={GK:[],CB:['FB','DM'],FB:['CB','W'],DM:['CM','CB'],CM:['DM','AM'],AM:['CM','W','ST'],W:['AM','FB','ST'],ST:['W','AM']};
const REQ={GK:2,CB:4,FB:3,DM:2,CM:3,AM:2,W:3,ST:3};
const XI_SLOTS=['GK','FB','CB','CB','FB','DM','CM','AM','W','ST','W'];
const PTRAITS=['leader','professional','temperamental','injury-prone','local hero','quiet'];
const PFIRST=['Kyle','Bradley','Ryan','Nathan','Mo','Femi','Josh','Connor','Jamie','Callum','Kieran','Liam','Marcus','Jordan','Sam','Tyler','Ellis','Dean','Reece','Harvey','Aaron','Lewis','Theo','Ollie','Kofi','Jakub','Matty','Ethan','Joe','Danny','Brandon','Cian','Ruben','Isaac','Noah','Alfie','Zach','Billy','Jay','Ashley'];
const PLAST=['Agyeman','Rowntree','Whitlock','Dunleavy','Corrigan','Sefton','Pickles','Fairclough','Ashworth','Barraclough','Cawthorne','Dearden','Entwistle','Fenton','Greenhalgh','Hepworth','Illingworth','Jowett','Kershaw','Lockwood','Midgley','Nolan','Ormerod','Priestley','Ramsden','Sutcliffe','Thackeray','Uttley','Varley','Waddington','Yeadon','Okonjo','Mensah','Kowalczyk','Brannigan','Hussain','Achterberg','Doherty','Lomax','Tetley'];
const SQUAD_MIN=20,SQUAD_MAX=27;

function pname(){return `${pick(PFIRST)} ${pick(PLAST)}`}
/* weekly wage in £ for a player of quality q: semi-professional at the bottom, full-time at the top */
/* wages follow the market: quality relative to the world's level (S.qref), so a richer, better world does not inflate wages forever */
function wageFor(q){return Math.max(30,Math.round(150*Math.pow(1.65,q-((S&&S.qref)||11.7)+2.2)/5)*5)}
function worldQuality(){const ids=Object.keys(S.squads);return r2(ids.reduce((a,i)=>a+squadQuality(S.squads[i]),0)/ids.length)}
function newPlayer(pos,o={}){
  const age=o.age??ri(18,33),q=r1(o.q??(9+rnd()*5));
  const head=o.pa!=null?0:age<=19?1.5+rnd()*4:age<=22?rnd()*2.5:age<=24?rnd():0;
  const p={id:'pl'+(S.pc++),name:o.name||pname(),pos,age,q,pa:r1(o.pa??(q+head)),contract:o.contract??ri(1,3),
    wage:Math.round(wageFor(q)*(0.85+rnd()*.3)/5)*5,form:ri(55,75),inj:0,trait:o.trait||pick(PTRAITS),academy:!!o.academy,
    apps:0,goals:0,sApps:0,sGoals:0,joined:S.season,club:o.club||null,career:[],grown:0};
  return p;
}
function playerValue(p){const af=p.age<=21?1.6:p.age<=25?1.3:p.age<=29?1:p.age<=31?.6:.3;return Math.max(1,Math.round(wageFor(p.q)*.09*af*(1+Math.max(0,p.pa-p.q)*.15)))}
function qWord(q){return q<8.5?'Poor':q<10?'Squad player':q<11.5?'Solid':q<13?'Key player':q<14.5?'Star':'Elite'}
function genSquad(clubStr,clubId){
  const base=11.5+(clubStr-50)/4,sq=[];
  for(const pos of POS)for(let i=0;i<REQ[pos];i++)sq.push(newPlayer(pos,{q:base-1.2+rnd()*2.6,club:clubId}));
  const short=pick(['FB','CB','W','DM']);sq.splice(sq.findIndex(p=>p.pos===short),1);
  sq.push(newPlayer(pick(['CM','ST','W']),{q:base-.8+rnd()*1.6,club:clubId}));
  sq.push(newPlayer(pick(['ST','W','CM']),{age:ri(17,18),q:base-3+rnd(),academy:true,contract:2,club:clubId}));
  sq.push(newPlayer(pick(['CB','FB','AM']),{age:ri(17,18),q:base-3+rnd(),academy:true,contract:2,club:clubId}));
  return sq;
}
function fitFor(p,slot){return p.pos===slot?1:NEAR[p.pos].includes(slot)?.85:(slot==='GK'||p.pos==='GK')?.3:.6}
function available(sq){return sq.filter(p=>p.inj<=0)}
function pickXI(sq){
  const av=available(sq),xi=[];
  const score=p=>p.q+(p.form-65)/40;
  for(const slot of XI_SLOTS){let b=null,bv=-99;for(const p of av){if(xi.some(x=>x.p===p))continue;const v=score(p)*fitFor(p,slot);if(v>bv){bv=v;b=p}}if(b)xi.push({p:b,slot})}
  return xi;
}
function squadQuality(sq){const xi=pickXI(sq);if(!xi.length)return 6;return xi.reduce((a,x)=>a+x.p.q*fitFor(x.p,x.slot),0)/11-(11-xi.length)*.6}
function qualityToStr(q){return 50+(q-11.5)*4}
function squadGaps(sq){
  const out=[];
  for(const pos of POS){const n=available(sq).filter(p=>p.pos===pos).length;if(n<REQ[pos])out.push({pos,kind:'short',text:`${n?'Only '+n:'No'} fit ${POS_ONE[pos]}${n===1?'':'s'}; the squad needs ${REQ[pos]}`})}
  const xi=pickXI(sq);for(const x of xi)if(x.p.pos!==x.slot)out.push({pos:x.slot,kind:'oop',text:`${x.p.name} plays ${POS_ONE[x.slot]} out of position`});
  return out;
}
function wageBillK(id){return r2(S.squads[id].reduce((a,p)=>a+p.wage,0)/1000)}

/* ----- weekly: injuries (medical) and development (training). Called once per club per week ----- */
function playersWeek(id){
  const sq=S.squads[id],sg=groundSignals(id),t=sg.training,med=sg.medical;
  const risk=clamp(1.25-.15*med-.05*t-(sg.hasTM?.12:0),.45,1.3);
  const grow=(.12+.08*t)/SEASON_WEEKS,fade=(1-.06*Math.min(t,8))/SEASON_WEEKS;
  for(const p of sq){
    if(p.inj>0){p.inj--;if(p.inj===0&&id===S.my)emit('Return',id,`${p.name} is fit again.`,{pid:p.id})}
    else if(rnd()<.02*risk*(p.trait==='injury-prone'?1.8:1)){
      let d=rnd()<.06*(1-.12*Math.min(med,6))?ri(6,16):ri(1,4);d=Math.max(1,Math.round(d*(1-.12*Math.min(med,6))));p.inj=d;
      emit('Injury',id,`${p.name} is injured: out for ${d} week${d>1?'s':''}.`,{pid:p.id,weeks:d,key:p.q>=squadQuality(sq)});
    }
    p.form=clamp(p.form+ri(-5,5),35,90);
    const before=p.q;
    if(p.age<=23&&p.pa>p.q)p.q+=(p.pa-p.q)*grow;
    else if(p.age<=29&&p.pa>p.q)p.q+=(p.pa-p.q)*grow*.4;
    else if(p.age>=31)p.q-=.55*fade;
    p.q=Math.round(clamp(p.q,4,19)*1000)/1000;p.grown+=p.q-before;
  }
}
/* ----- season end: ageing, noise in development, contracts, retirement, academy intake ----- */
function playersSeasonEnd(id){
  const sq=S.squads[id],c=CL(id),sg=groundSignals(id),left=[];
  for(const p of sq.slice()){
    p.age++;p.contract--;p.career.push(`${c.name} ${S.season}: ${p.sApps} apps, ${p.sGoals} goals`);p.sApps=0;p.sGoals=0;p.grown=0;
    p.q=r1(clamp(p.q+(rnd()-.5)*.4,4,19));
    if(p.age>=34&&rnd()<(p.age-32)*.25){sq.splice(sq.indexOf(p),1);left.push(p);emit('Retired',id,`${p.name} retires at ${p.age}.`,{pid:p.id})}
    else if(p.contract<=0){sq.splice(sq.indexOf(p),1);left.push(p);faAdd(p,'out of contract');if(id===S.my)emit('PlayerLeft',id,`${p.name} leaves at the end of his contract.`,{pid:p.id})}
  }
  // academy intake: the academy level decides how many, how good and how much potential
  const a=sg.academy,n=1+(a>=1?1:0)+(a>=3?1:0)+(a>=5?1:0),base=11.5+(tierBaseStr(c.tier)-50)/4;
  const kids=[];
  for(let i=0;i<n;i++){const q=base-3.2+.25*a+rnd()*1.2;const k=newPlayer(pick(POS.slice(1)),{age:ri(16,17),q,pa:q+1+.35*a+rnd()*2.5,academy:true,contract:2,club:id,trait:groundCourse(id,'academy')==='local'&&rnd()<.4?'local hero':null});
    k.career.push('Academy');sq.push(k);kids.push(k)}
  emit('YouthIntake',id,`${kids.length} academy graduate${kids.length>1?'s':''} join the squad.`,{n:kids.length,best:Math.max(...kids.map(k=>k.pa))});
  return left;
}
function tierBaseStr(t){const [a,b]=TIER_STR[t];return (a+b)/2}
