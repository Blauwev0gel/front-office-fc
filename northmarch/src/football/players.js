/* ---- football/players.js ---- */
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
const DEV_PATHS=['early','steady','late','volatile'];
const PLAYER_STYLES={
  GK:['shot-stopper','organiser'],CB:['marker','ball-player'],FB:['runner','defender'],
  DM:['anchor','distributor'],CM:['runner','playmaker'],AM:['creator','finisher'],
  W:['creator','runner','finisher'],ST:['poacher','finisher','target']
};
const PTRAITS=['leader','professional','temperamental','injury-prone','local hero','quiet'];
const PFIRST=['Kyle','Bradley','Ryan','Nathan','Mo','Femi','Josh','Connor','Jamie','Callum','Kieran','Liam','Marcus','Jordan','Sam','Tyler','Ellis','Dean','Reece','Harvey','Aaron','Lewis','Theo','Ollie','Kofi','Jakub','Matty','Ethan','Joe','Danny','Brandon','Cian','Ruben','Isaac','Noah','Alfie','Zach','Billy','Jay','Ashley'];
const PLAST=['Agyeman','Rowntree','Whitlock','Dunleavy','Corrigan','Sefton','Pickles','Fairclough','Ashworth','Barraclough','Cawthorne','Dearden','Entwistle','Fenton','Greenhalgh','Hepworth','Illingworth','Jowett','Kershaw','Lockwood','Midgley','Nolan','Ormerod','Priestley','Ramsden','Sutcliffe','Thackeray','Uttley','Varley','Waddington','Yeadon','Okonjo','Mensah','Kowalczyk','Brannigan','Hussain','Achterberg','Doherty','Lomax','Tetley'];
const SQUAD_MIN=20,SQUAD_MAX=27;

function pname(){return `${pick(PFIRST)} ${pick(PLAST)}`}
/* weekly wage in £ for a player of quality q: semi-professional at the bottom, full-time at the top */
/* wages follow the market: quality relative to the world's level (S.qref), so a richer, better world does not inflate wages forever */
function wageFor(q){return Math.max(30,Math.round(150*Math.pow(1.65,q-Math.max(11.7,(S&&S.qref)||11.7)+2.2)/5)*5)} /* never below the calibration level, also for saves made while the reference was still too low */
/* the wage scale is calibrated on the top three divisions (48 clubs). Lower divisions sit below that reference; counting them would pull it down and make every contract dearer */
function worldQuality(){const ids=Object.keys(S.squads).filter(i=>S.clubs[i]&&S.clubs[i].tier<=2);return r2(ids.reduce((a,i)=>a+squadQuality(S.squads[i]),0)/Math.max(1,ids.length))}
function newPlayer(pos,o={}){
  const age=o.age??ri(18,33),q=r1(o.q??(9+rnd()*5));
  const head=o.pa!=null?0:age<=19?1.5+rnd()*4:age<=22?rnd()*2.5:age<=24?rnd():0;
  const p={id:'pl'+(S.pc++),name:o.name||pname(),nationality:o.nationality||(o.club&&o.club.startsWith('f_')?o.club.split('_')[1]:'nmr'),pos,age,q,pa:r1(o.pa??(q+head)),contract:o.contract??ri(1,3),
    wage:Math.round(wageFor(q)*(0.85+rnd()*.3)/5)*5,form:ri(55,75),inj:0,trait:o.trait||pick(PTRAITS),academy:!!o.academy,
    apps:0,goals:0,sApps:0,sGoals:0,joined:S.season,club:o.club||null,originClub:o.academy?o.club||null:null,career:[],grown:0,
    devPath:o.devPath||pick(DEV_PATHS),peakAge:o.peakAge??ri(26,31),history:[],
    cupApps:0,cupGoals:0,style:o.style||pick(PLAYER_STYLES[pos]),ambition:o.ambition??ri(30,90),
    loyalty:o.loyalty??ri(25,85),honours:[],breakthroughs:0,eApps:0,eGoals:0,europeLoad:0};
  return lifeDefaults(p);
}
/* Close the prior club's part-season before a move. This avoids crediting
   the buyer with goals and appearances the player earned somewhere else. */
function playerCloseStint(p,club){
  if(!club)return;
  const played=(p.sApps||0)+(p.eApps||0);
  if(!played&&!p.sGoals&&!p.eGoals&&!p.cupApps&&!p.cupGoals)return;
  p.history=p.history||[];
  p.history.push({season:S.season,club,age:p.age,apps:p.sApps||0,goals:p.sGoals||0,
    europe:p.eApps||0,europeGoals:p.eGoals||0,cupApps:p.cupApps||0,cupGoals:p.cupGoals||0,quality:r1(p.q),partial:true});
  if(p.history.length>40)p.history.splice(0,p.history.length-40);
  p.sApps=0;p.sGoals=0;p.eApps=0;p.eGoals=0;p.cupApps=0;p.cupGoals=0;p.cupApps=0;p.cupGoals=0;
}
function playerSeasonGoals(p){
  return(p.sGoals||0)+(p.history||[]).filter(h=>h.season===S.season&&h.partial).reduce((sum,h)=>sum+(h.goals||0),0);
}
function playerValue(p){
  const af=p.age<=21?1.6:p.age<=25?1.3:p.age<=29?1:p.age<=31?.6:.3;
  const visible=p.sApps>5?clamp(1+(p.sGoals/p.sApps-.09)*.65,.9,1.3):1;
  const honours=1+Math.min(.2,(p.honours||[]).length*.025);
  return Math.max(1,Math.round(wageFor(p.q)*.09*af*(1+Math.max(0,p.pa-p.q)*.15)*visible*honours));
}
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
function available(sq){return sq.filter(p=>p.inj<=0&&!(p.susp>0))}
function pickXI(sq){
  const av=available(sq),xi=[];
  const score=p=>p.q+(p.form-65)/40+((p.morale??60)-60)/60-(p.tired?1:0);
  for(const slot of XI_SLOTS){let b=null,bv=-99;for(const p of av){if(xi.some(x=>x.p===p))continue;const v=score(p)*fitFor(p,slot);if(v>bv){bv=v;b=p}}if(b)xi.push({p:b,slot})}
  return xi;
}
function squadQuality(sq){const xi=pickXI(sq);if(!xi.length)return 6;return xi.reduce((a,x)=>a+x.p.q*fitFor(x.p,x.slot)*moraleF(x.p)*(x.p.tired?.96:1),0)/11-(11-xi.length)*.6}
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
  const sq=S.squads[id],sg=groundSignals(id),t=sg.training,med=sg.medPrev,medR=sg.medRec,st=S.stats[id];
  const risk=clamp(1.25-.15*med-(sg.fitness?.08:.03)*Math.min(t,4)-(sg.hasTM?.12:0),.45,1.3);
  const grow=(.12+.08*t)*coachGrowth(id)*(1+((CL(id).devCulture??45)-45)/500)/SEASON_WEEKS,fade=(1-.06*Math.min(t,8))/SEASON_WEEKS;
  for(const p of sq){
    if(p.inj>0){p.inj--;if(p.inj===0&&id===S.my)emit('Return',id,`${p.name} is fit again.`,{pid:p.id})}
    else if(rnd()<.02*risk*(p.trait==='injury-prone'?1.8:1)){
      let d=rnd()<.06*(1-.12*Math.min(medR,6))?ri(6,16):ri(1,4);d=Math.max(1,Math.round(d*(1-.12*Math.min(medR,6))));p.inj=d;st.inj++;st.injWeeks+=d;
      emit('Injury',id,`${p.name} is injured: out for ${d} week${d>1?'s':''}.`,{pid:p.id,weeks:d,key:p.q>=squadQuality(sq)});
    }
    p.form=clamp(p.form+ri(-5,5),35,90);
    const before=p.q;
    const path=p.devPath||'steady',early=path==='early'?1.35:path==='late'?.7:1;
    const maturity=path==='late'&&p.age>=22&&p.age<=27?1.5:path==='volatile'?.7+rnd()*.9:early;
    const pt=p.age<=23?(p.played?1.4:.7):1;
    const character=p.trait==='professional'?1.12:p.trait==='temperamental'?.94:1;
    if(p.age<=23&&p.pa>p.q)p.q+=(p.pa-p.q)*grow*pt*maturity*character;
    else if(p.age<=29&&p.pa>p.q)p.q+=(p.pa-p.q)*grow*.4*maturity*character;
    else if(p.age>=(p.peakAge||30))p.q-=.55*fade*(p.age-(p.peakAge||30)+1)*.5;
    p.q=Math.round(clamp(p.q,4,19)*1000)/1000;p.grown+=p.q-before;if(p.age<=23)st.youthGrowth+=p.q-before;
  }
}
/* ----- season end: ageing, noise in development, contracts, retirement, academy intake ----- */
function playersSeasonEnd(id){
  const sq=S.squads[id],c=CL(id),sg=groundSignals(id),left=[];
  youthDevRecord(id);
  for(const p of sq.slice()){
    p.age++;p.contract--;p.yel=0;p.susp=0;p.career.push(`${c.name} ${S.season}: ${p.sApps} apps, ${p.sGoals} goals`);
    p.history=p.history||[];p.history.push({season:S.season,club:id,age:p.age,apps:p.sApps,goals:p.sGoals,europe:p.eApps||0,europeGoals:p.eGoals||0,cupApps:p.cupApps||0,cupGoals:p.cupGoals||0,quality:r1(p.q)});
    if(p.history.length>40)p.history.shift();
    p.honours=p.honours||[];
    const last=c.hist[c.hist.length-1];
    if(last&&last.pos===1&&p.sApps>=5)p.honours.push({season:S.season,type:'league',tier:last.tier,club:id});
    if(S.cup.winner===id&&(p.cupApps||0)>=1)p.honours.push({season:S.season,type:'cup',club:id});
    if(p.honours.length>30)p.honours.shift();
    if(p.age<=24&&p.grown>=.65&&p.sApps>=10){
      p.breakthroughs=(p.breakthroughs||0)+1;
      emit('Breakthrough',id,`${p.name} has made a breakthrough at ${c.name}: +${r1(p.grown)} ability in ${p.sApps} appearances.`,{pid:p.id,growth:r1(p.grown)});
    }
    if(c.hist.length&&c.hist[c.hist.length-1].tier<c.tier&&p.age<=30&&p.ambition>70&&p.loyalty<60){
      p.wantsOut=true;p.morale=clamp((p.morale??60)-12,0,100);
      if(id===S.my)emit('WantsOut',id,`${p.name} considers leaving after relegation.`,{pid:p.id});
    }
    p.eApps=0;p.eGoals=0;
    if(p.career.length>8)p.career.splice(0,p.career.length-8);
    p.sApps=0;p.sGoals=0;p.grown=0;
    p.q=r1(clamp(p.q+(rnd()-.5)*.4,4,19));
    if(p.age>=34&&rnd()<(p.age-33)*.22){sq.splice(sq.indexOf(p),1);left.push(p);youthLeft(p,'retired');emit('Retired',id,`${p.name} retires at ${p.age}.`,{pid:p.id})}
    else if(p.contract<=0){sq.splice(sq.indexOf(p),1);left.push(p);youthLeft(p,'released');faAdd(p,'out of contract',id);if(id===S.my)emit('PlayerLeft',id,`${p.name} leaves at the end of his contract.`,{pid:p.id})}
  }
  // academy intake: the academy level decides how many, how good and how much potential
  // youngsters who will not make it are let go at 19-21, as real academies do
  const sqq=squadQuality(sq),keep=sq.filter(p=>p.age<=21).sort((x,y)=>y.pa-x.pa).slice(0,3);
  for(const p of sq.slice())if(p.age>=18&&p.age<=21&&!p.loan&&!keep.includes(p)&&p.pa<sqq-.3&&sq.length>SQUAD_MIN){sq.splice(sq.indexOf(p),1);left.push(p);youthLeft(p,'released');faAdd(p,'released by the academy',id);if(id===S.my)emit('PlayerLeft',id,`${p.name} is released: he will not make the grade.`,{pid:p.id})}
  const a=sg.academy,n=1+(a>=3?1:0)+(a>=6?1:0),base=11.5+(tierBaseStr(c.tier)-50)/4;
  const kids=[];
  for(let i=0;i<n;i++){const q=base-3.2+.25*a+((c.devCulture??45)-45)*.009+rnd()*1.2;const k=newPlayer(pick(POS.slice(1)),{age:ri(16,17),q,pa:q+1+.35*a+((c.devCulture??45)-45)*.015+rnd()*2.5,academy:true,contract:2,club:id,trait:sg.academyLocal&&rnd()<.4?'local hero':null});
    k.career.push('Academy');sq.push(k);kids.push(k)}
  youthIntake(id,kids);
  S.stats[id].intake=kids.length;S.stats[id].intakeBest=r1(Math.max(...kids.map(k=>k.pa)));
  if(id===S.my){
    const st=S.stats[id],history=st.academyHistory||(st.academyHistory=[]);
    history.push({season:S.season,graduates:kids.map(p=>({pid:p.id,name:p.name,pos:p.pos,quality:r1(p.q)}))});
    if(history.length>12)history.splice(0,history.length-12);
  }
  emit('YouthIntake',id,`${kids.length} academy graduate${kids.length>1?'s':''} join the squad.`,{n:kids.length,best:Math.max(...kids.map(k=>k.pa))});
  return left;
}
function statsInit(){return{inj:0,injWeeks:0,youthGrowth:0,intake:0,intakeBest:0,buys:0,misbuys:0,spent:0}}
function tierBaseStr(t){const [a,b]=TIER_STR[t];return (a+b)/2}

