/* ================= World layer: foreign football =================
   Lightweight autonomous leagues. Foreign clubs are deliberately NOT in S.clubs:
   the domestic match, wage, staff and stadium engines must never process them.
   All randomness uses the saved world RNG; no real clubs or trademarks. */
const FOREIGN_COUNTRIES=[
  ['eng','England',['Northbridge','Westford','Ashmere','Kingsport','Briarwick','Eastborough','Mereford','Redhaven','Stonebury','Whitecross','Blackmere','Southwick']],
  ['sco','Scotland',['Glenhaven','Lochford','Dunbrae','Strathmore','Inverwick','Forthside','Braeholm','Eastloch','Kirkhaven','Northglen','Cairnford','Westbrae']],
  ['ned','Netherlands',['Rijnstad','Havenburg','Noordveen','Zuiddam','Waterwijk','Veldhoven','Oostmeer','Duinrade','IJsselpoort','Maaswijk','Lindenstad','Westerveen']],
  ['ger','Germany',['Eisenstadt','Waldheim','Rosenbruck','Nordhafen','Bergfeld','Westtal','Grunfurt','Steinbach','Ostburg','Lindenheim','Falkenstadt','Sudhaven']],
  ['fra','France',['Montval','Saint-Roch','Valmer','Beaulac','Rivemont','Clairville','Port-Lumiere','Boisfort','Grandval','Bellemont','Rochefort','Aubepin']],
  ['esp','Spain',['Puerto Azul','Valdeoro','Sierra Blanca','Monteverde','Rioalto','Costa Sur','Villaluz','Campo Real','San Mirador','Altavista','Las Encinas','Marbella Norte']]
];
/* Fictional names with country-specific flavour. Nationality remains fixed as
   a player moves; being signed abroad does not change a person's origin. */
const FOREIGN_NAMES={
  eng:[['Harry','George','Oliver','Elliot','Daniel','Marcus','Lewis','Callum'],['Ashcroft','Fletcher','Bennett','Hawthorne','Whitmore','Hartley','Mercer','Pritchard']],
  sco:[['Ewan','Finlay','Alasdair','Ross','Fraser','Callum','Lewis','Iain'],['MacLeod','MacKenzie','Ferguson','Fraser','Munro','Baird','McInnes','Lennox']],
  ned:[['Daan','Jasper','Thijs','Lars','Bram','Milan','Koen','Jelle'],['de Vries','van Dijk','Bakker','Visser','van Leeuwen','Bos','Smit','Kuiper']],
  ger:[['Lukas','Jonas','Felix','Leon','Moritz','Timo','Julian','Maximilian'],['Weber','Schneider','Hartmann','Becker','Krause','Fischer','Vogel','Neumann']],
  fra:[['Hugo','Lucas','Noah','Yanis','Adrien','Mathis','Rayan','Bastien'],['Martin','Bernard','Dubois','Moreau','Laurent','Petit','Girard','Lefevre']],
  esp:[['Diego','Pablo','Hugo','Sergio','Iker','Adrian','Mateo','Nicolas'],['Garcia','Fernandez','Santos','Navarro','Ortega','Ruiz','Moreno','Serrano']]
};
function foreignName(code){
  const pools=FOREIGN_NAMES[code]||FOREIGN_NAMES.eng;
  return pick(pools[0])+' '+pick(pools[1]);
}
function foreignInit(){
  const countries={},clubs={};
  for(const [code,name,towns] of FOREIGN_COUNTRIES){
    const ids=[];
    towns.forEach((town,i)=>{const id='f_'+code+'_'+i;
      clubs[id]={id,country:code,name:town+(i%3===0?' Athletic':i%3===1?' FC':' United'),
        strength:Math.round(48+rnd()*28),rep:Math.round(35+rnd()*50),budget:Math.round(80+rnd()*800),
        form:0,history:[]};ids.push(id)});
    countries[code]={code,name,divisions:[{id:code+'_1',name:name+' Premier Division',clubs:ids}],champions:[],tables:[]};
  }
  return{countries,clubs,europe:{seasons:[]},lastSeason:0,current:null,market:{log:[]},squads:{}};
}
/* Persistent, week-driven international football. Foreign clubs deliberately remain lightweight:
   no Northmarch finances, squads or board commands. The domestic clubs use actual team strength. */
const EURO_WEEKS=[6,11,17,25]; // deliberately avoid Northmarch cup weeks
/* Foreign player population is intentionally lighter than Northmarch's fully staffed clubs.
   Persistent individuals are shared with the domestic transfer economy, not a second fake market. */
function foreignSquadInit(){
  const f=S.foreign;if(!f)return;
  f.squads=f.squads||{};
  for(const id of Object.keys(f.clubs)){
    if(f.squads[id]&&f.squads[id].length)continue;
    const c=f.clubs[id],base=11.5+(c.strength-50)/4;
    f.squads[id]=[];
    for(const pos of POS){
      const count=Math.max(2,Math.ceil(REQ[pos]*.8));
      for(let j=0;j<count;j++)f.squads[id].push(newPlayer(pos,{q:base-1.3+rnd()*2.3,club:id,name:foreignName(c.country),nationality:c.country,contract:ri(1,4)}));
    }
    // Different squad construction philosophies: surplus in some positions,
    // gaps elsewhere. Without these, no foreign transfers are ever possible.
    for(let n=0;n<2;n++){
      const from=pick(POS.filter(pos=>pos!=='GK'&&f.squads[id].filter(x=>x.pos===pos).length>2));
      const to=pick(POS.filter(pos=>pos!==from&&pos!=='GK'));
      const p=pick(f.squads[id].filter(x=>x.pos===from));p.pos=to;
    }
  }
}
/* Lightweight but real weekly foreign ledger: cash pays wages, travel and facilities,
   media/matchday revenue arrives each week; transfer fees use the same balance.
   The foreign world deliberately does not run Northmarch's full stadium simulation. */
function foreignWageWeek(id){return r2((S.foreign.squads[id]||[]).reduce((sum,p)=>sum+(p.wage||0),0)/1000)}
function foreignBudgetWeek(w){
  const f=S.foreign;
  for(const [id,c] of Object.entries(f.clubs)){
    const wages=foreignWageWeek(id);
    const media=10+c.rep*.65,commercial=5+c.rep*.28;
    const matchday=w<=22?(7+c.rep*.18):0;
    const cost=5+(w<=22?3:1);
    const net=r2(media+commercial+matchday-wages-cost);
    c.budget=r2(c.budget+net);
    c.ledger=c.ledger||{season:S.season,income:0,wages:0,other:0,net:0};
    if(c.ledger.season!==S.season)c.ledger={season:S.season,income:0,wages:0,other:0,net:0};
    c.ledger.income=r2(c.ledger.income+media+commercial+matchday);
    c.ledger.wages=r2(c.ledger.wages-wages);
    c.ledger.other=r2(c.ledger.other-cost);
    c.ledger.net=r2(c.ledger.net+net);
  }
}
function foreignSigningAffordable(id,p,fee=0){
  const c=S.foreign.clubs[id],w=foreignWageWeek(id),limit=15+c.rep*1.25;
  const projected=w+(p.wage||wageFor(p.q))/1000;
  return !!c&&c.budget-fee>=Math.max(20,w*4)&&projected<=limit;
}
function foreignSquadStrength(id){
  const sq=S.foreign.squads&&S.foreign.squads[id];
  return sq&&sq.length>=11?qualityToStr(squadQuality(sq)):S.foreign.clubs[id].strength;
}
function playerAcceptsMove(p,from,to){
  const f=S.foreign,fromRep=S.clubs[from]?.rep??f.clubs[from]?.rep??45;
  const toRep=S.clubs[to]?.rep??f.clubs[to]?.rep??45;
  const gap=toRep-fromRep;
  if(p.wantsOut)return true;
  if((p.loyalty??55)>=85&&gap<15)return false;
  if((p.ambition??55)>=80&&gap<-15)return false;
  if(gap<-35&&(p.loyalty??55)>=55)return false;
  return true;
}
/* One transfer ledger for clubs across national borders. No direct mutation may
   bypass foreignMove, so ownership, budgets, player history and world events agree. */
function foreignMove(p,from,to,fee,reason){
  const f=S.foreign,src=S.squads[from]||f.squads[from],dst=S.squads[to]||f.squads[to];
  if(!src||!dst||from===to)throw new Error('Invalid international transfer clubs');
  if(!src.includes(p)||dst.some(x=>x.id===p.id))throw new Error('International transfer ownership mismatch');
  if(!playerAcceptsMove(p,from,to))return false;
  if(!Number.isFinite(fee)||fee<0)throw new Error('Invalid international fee');
  const fromDom=!!S.clubs[from],toDom=!!S.clubs[to];
  if(toDom&&(dst.length>=SQUAD_MAX||fee>budgetFor(to)))return false;
  if(!toDom&&!foreignSigningAffordable(to,p,fee))return false;
  if(fromDom&&(src.length<=SQUAD_MIN||!canSpare(src,p,false)))return false;
  if(!fromDom&&src.filter(x=>x.pos===p.pos).length<=REQ[p.pos])return false;
  const dueWage=toDom?moveWage(p,to):Math.round(wageFor(p.q)*1.1/5)*5;
  if(toDom&&wageBillK(to)+dueWage/1000>wageCapK(to))return false;
  playerCloseStint(p,from);
  src.splice(src.indexOf(p),1);
  if(fromDom){book(from,'feesIn',fee);if(from===S.my)youthLeft(p,'sold',to,fee)}
  else f.clubs[from].budget+=fee;
  if(toDom)book(to,'feesOut',-fee);
  else f.clubs[to].budget-=fee;
  p.history=p.history||[];
  p.history.push({season:S.season,week:S.week,type:'transfer',from,to,fee});
  p.club=to;p.joined=S.season;p.contract=ri(2,4);p.wage=dueWage;p.loan=null;
  dst.push(p);
  const clubName=id=>S.clubs[id]?.name||f.clubs[id]?.name||id;
  const text=`${p.name} joins ${clubName(to)} from ${clubName(from)} for £${fee}k.`;
  const move={season:S.season,week:S.week,pid:p.id,name:p.name,from,to,fee,reason};
  f.market.log.push(move);
  emit('InternationalTransfer',toDom?to:fromDom?from:null,text,{pid:p.id,fee,reason,from,to});
  return true;
}
/* Recruitment follows sporting deficits and finances rather than random full-squad
   swaps. The three phases let sales cause replacement demand in the same window. */
function foreignTransferWindow(){
  const f=S.foreign;if(!f)return;
  foreignSquadInit();
  f.market=f.market||{log:[]};
  const abroad=shuffle(Object.keys(f.clubs)),home=shuffle(Object.keys(S.clubs)),affected=new Set();
  const foreignOptions=(from,pos)=>f.squads[from].filter(p=>p.pos===pos&&p.age<=31&&
    f.squads[from].filter(x=>x.pos===pos).length>REQ[pos]&&p.inj<=0&&p.contract>0);
  // Foreign clubs participate in the same free-agent pool after Northmarch's
  // domestic directors have completed their first summer recruitment pass.
  for(const to of abroad){
    const sq=f.squads[to],club=f.clubs[to];
    if(sq.length>=SQUAD_MAX)continue;
    const gaps=POS.filter(pos=>sq.filter(p=>p.pos===pos).length<REQ[pos]);
    if(!gaps.length)continue;
    const pos=pick(gaps),options=S.fa.filter(p=>p.pos===pos&&p.age<=32&&p.q>=10);
    if(!options.length)continue;
    const p=options.sort((a,b)=>Math.abs(a.q-(11.5+(club.strength-50)/4))-Math.abs(b.q-(11.5+(club.strength-50)/4)))[0];
    const signing=Math.max(1,Math.round(playerValue(p)*.04));
    if(!foreignSigningAffordable(to,p,signing))continue;
    S.fa.splice(S.fa.indexOf(p),1);
    club.budget-=signing;p.club=to;p.joined=S.season;p.contract=ri(2,4);
    p.wage=Math.round(wageFor(p.q)*1.03/5)*5;
    p.history=p.history||[];p.history.push({season:S.season,week:S.week,type:'free',to});
    sq.push(p);
    emit('ForeignSigning',null,`${club.name} sign free agent ${p.name}.`,{pid:p.id,foreignClub:to});
  }
  // Northmarch directors seek an imported player only when the existing squad
  // has a genuine gap or there is a clear, affordable quality improvement.
  for(const to of home){
    const dest=S.squads[to];if(dest.length>=SQUAD_MAX)continue;
    const gaps=POS.filter(pos=>dest.filter(p=>p.pos===pos&&!p.loan).length<REQ[pos]);
    const target=gaps.length?pick(gaps):null;
    if(!target)continue;
    const minQ=Math.min(...dest.filter(p=>p.pos===target).map(p=>p.q).concat([squadQuality(dest)-1]));
    let best=null,bestScore=-Infinity;
    for(const from of abroad.slice(0,26))for(const p of foreignOptions(from,target)){
      const fee=Math.max(1,Math.round(playerValue(p)*1.15));
      if(fee>budgetFor(to)||wageBillK(to)+wageFor(p.q)*1.1/1000>wageCapK(to)||!playerAcceptsMove(p,from,to))continue;
      const score=p.q+.16*(p.pa-p.q)-fee/100;
      if(p.q>=minQ&&score>bestScore){best={p,from,fee};bestScore=score}
    }
    if(best&&foreignMove(best.p,best.from,to,best.fee,'squad need'))affected.add(to);
  }
  // Foreign clubs make a limited number of active bids. A Northmarch player
  // can leave only when his club can spare him; human-owned protected squads
  // are not raided without an approved autonomous selling policy.
  for(const to of abroad){
    const buyer=f.clubs[to],sq=f.squads[to];
    if(sq.length>=SQUAD_MAX||rnd()>.35)continue;
    const needs=POS.filter(pos=>sq.filter(p=>p.pos===pos).length<REQ[pos]);
    if(!needs.length)continue;
    const pos=pick(needs);
    let best=null,bestScore=-Infinity;
    for(const from of home.slice(0,22)){
      if(from===S.my&&!S.auto)continue;
      const source=S.squads[from];
      if(source.length<=SQUAD_MIN+1)continue;
      for(const p of source.filter(p=>p.pos===pos&&p.age<=30&&!p.loan&&canSpare(source,p,false))){
        const fee=Math.max(1,Math.round(playerValue(p)*1.3));
        if(fee>buyer.budget*.22||!playerAcceptsMove(p,from,to))continue;
        const score=p.q+(p.age<=23?.4:0)-fee/130;
        if(score>bestScore){best={p,from,fee};bestScore=score}
      }
    }
    if(best&&foreignMove(best.p,best.from,to,best.fee,'foreign club recruitment'))affected.add(best.from);
  }
  // Foreign-only deals circulate players and directly change the match strengths.
  for(const to of abroad){
    const sq=f.squads[to],needs=POS.filter(pos=>sq.filter(p=>p.pos===pos).length<REQ[pos]);
    if(!needs.length||rnd()>.5)continue;
    const pos=pick(needs),buyer=f.clubs[to];
    for(const from of shuffle(abroad.filter(id=>id!==to)).slice(0,22)){
      const pool=foreignOptions(from,pos).sort((a,b)=>b.q-a.q);
      if(!pool.length)continue;
      const p=pool[0],fee=Math.max(1,Math.round(playerValue(p)*1.1));
      if(fee>buyer.budget*.16||!playerAcceptsMove(p,from,to))continue;
      if(foreignMove(p,from,to,fee,'foreign league recruitment'))break;
    }
  }
  // Clubs that lost cover can react in the current market, not after a full year.
  for(const id of affected)coverAll(id);
  if(f.market.log.length>1400)f.market.log.splice(0,f.market.log.length-1400);
}
function foreignRows(ids){return Object.fromEntries(ids.map(id=>[id,{id,p:0,pts:0,gf:0,ga:0,w:0,d:0,l:0}]))}
function foreignRank(rows){return Object.values(rows).sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.id.localeCompare(b.id))}
function foreignStrength(id){return S.foreign.clubs[id]?foreignSquadStrength(id):teamStrength(id)}
function foreignFixtureRounds(ids){
  const a=shuffle(ids.slice()),n=a.length,rounds=[];let order=a.slice();
  for(let w=0;w<n-1;w++){
    const fixtures=[];
    for(let j=0;j<n/2;j++){const h=order[j],v=order[n-1-j];fixtures.push((w+j)%2?[v,h]:[h,v])}
    rounds.push(fixtures);order=[order[0],order[n-1],...order.slice(1,n-1)];
  }
  return rounds.concat(rounds.map(round=>round.map(([h,a])=>[a,h])));
}
function foreignGame(h,a,neutral=false){
  const [lh,la]=lambdas(foreignStrength(h),foreignStrength(a),!neutral);
  return{h,a,gh:pois(lh,rnd),ga:pois(la,rnd)};
}
/* Foreign leagues simulate actual XI appearances, scorers and squad availability.
   Only foreign squads are handled here; domestic games use playMatch/matchAftermath. */
/* Physical availability is advanced once per world week, not once per fixture.
   Development rewards real appearances; continental load alters next week's XI.
   Historical fixture reconstruction must not damage the current saved squad. */
function foreignPlayersBeginWeek(){
  for(const sq of Object.values(S.foreign.squads||{}))for(const p of sq){
    p.tired=(p.europeLoad||0)>0?1:0;p.europeLoad=0;p.played=0;
    if(p.inj>0)p.inj--;
  }
}
function foreignPlayersEndWeek(){
  for(const sq of Object.values(S.foreign.squads||{}))for(const p of sq){
    const played=p.played||0;
    if(p.age<=27&&p.q<p.pa){
      const potential=Math.max(0,p.pa-p.q),ageFactor=p.age<=21?1.25:p.age<=24?1:.5;
      const stage=p.devPath==='late'&&p.age<=22?.7:p.devPath==='early'&&p.age<=21?1.25:1;
      const growth=potential*(.10/SEASON_WEEKS)*(played?1.35:.48)*ageFactor*stage;
      p.q=Math.min(p.pa,r1(p.q+growth));
      p.grown=r2((p.grown||0)+growth);
    }
    p.form=clamp(p.form+(65-p.form)*.035,35,90);
  }
}
function foreignPlayerMatch(m,comp='league'){
  const f=S.foreign;
  for(const [id,goals] of [[m.h,m.gh],[m.a,m.ga]]){
    if(!f.clubs[id])continue;
    const sq=f.squads[id];if(!sq||!sq.length)continue;
    const xi=pickXI(sq);
    for(const x of xi){
      const p=x.p;p.apps++;p.fApps=(p.fApps||0)+1;p.played=1;
      if(comp==='europe')p.europeLoad=(p.europeLoad||0)+1;
      if(comp==='europe')p.eApps=(p.eApps||0)+1;else p.sApps++;
      p.form=clamp(p.form+(goals>=2?1:goals===0?-1:0),40,88);
      if(p.inj<=0&&comp==='europe'&&rnd()<.006)p.inj=ri(2,4);
    }
    const scorers=[];
    for(let g=0;g<goals&&xi.length;g++){
      const p=scorerFrom(xi);p.goals++;if(comp==='europe')p.eGoals=(p.eGoals||0)+1;else p.sGoals++;scorers.push({pid:p.id,name:p.name});
    }
    if(!m.scorers)m.scorers={};
    m.scorers[id]=scorers;
  }
}
function foreignRecord(rows,m){
  const h=rows[m.h],a=rows[m.a];h.p++;a.p++;h.gf+=m.gh;h.ga+=m.ga;a.gf+=m.ga;a.ga+=m.gh;
  if(m.gh>m.ga){h.w++;a.l++;h.pts+=3}else if(m.gh<m.ga){a.w++;h.l++;a.pts+=3}else{h.d++;a.d++;h.pts++;a.pts++}
}
function foreignStartSeason(){
  const f=S.foreign;if(!f)return;
  f.current={season:S.season,leagues:{},europe:null,startedAt:S.week||0};
  for(const c of Object.values(f.countries)){
    const ids=c.divisions[0].clubs;
    f.current.leagues[c.code]={rounds:foreignFixtureRounds(ids),rows:foreignRows(ids),results:[]};
  }
  // Qualify from the completed preceding season, never from the current unfinished standings.
  const entrants=[];
  for(const c of Object.values(f.countries)){
    const prev=c.tables[c.tables.length-1];
    const ordered=prev?prev.rows.map(x=>x.id):c.divisions[0].clubs.slice().sort((a,b)=>f.clubs[b].strength-f.clubs[a].strength);
    entrants.push(...ordered.slice(0,2));
  }
  const prev=S.hist&&S.hist[S.hist.length-1],home=prev&&prev.tables&&prev.tables[0]
    ?prev.tables[0].slice(0,4):tierIds(0).slice().sort((a,b)=>teamStrength(b)-teamStrength(a)).slice(0,4);
  entrants.push(...home);
  f.current.europe={participants:entrants,alive:shuffle(entrants.slice()),rounds:[],winner:null};
}
function foreignWeek(w,{historical=false}={}){
  const f=S.foreign;if(!f)return;
  if(!f.current||f.current.season!==S.season)foreignStartSeason();
  if(!historical)foreignBudgetWeek(w);
  if(!historical)foreignPlayersBeginWeek();
  for(const league of Object.values(f.current.leagues)){
    const round=league.rounds[w-1];if(!round)continue;
    const results=round.map(([h,a])=>foreignGame(h,a));
    for(const m of results){foreignRecord(league.rows,m);if(!historical)foreignPlayerMatch(m)}
    league.results.push({week:w,matches:results});
  }
  const euro=f.current.europe,idx=EURO_WEEKS.indexOf(w);
  if(idx>=0&&euro.alive.length>1){
    const winners=[],ties=[];
    for(let i=0;i<euro.alive.length;i+=2){
      const a=euro.alive[i],b=euro.alive[i+1],m=foreignGame(a,b,true);
      const winner=m.gh===m.ga?(rnd()<.5+(foreignStrength(a)-foreignStrength(b))/150?a:b):m.gh>m.ga?a:b;
      if(!historical)foreignPlayerMatch(m,'europe');
      // Domestic entrants have their own match statistics rather than contaminating
      // league apps/goals. Event data and the European archive share the same scorers.
      for(const id of [a,b])if(!historical&&S.clubs[id]){
        const xi=pickXI(S.squads[id]),gf=id===a?m.gh:m.ga,ga=id===a?m.ga:m.gh;
        if(!m.scorers)m.scorers={};m.scorers[id]=[];
        for(const x of xi){
          const p=x.p;p.eApps=(p.eApps||0)+1;p.europeLoad=(p.europeLoad||0)+1;
          p.morale=clamp(p.morale+(gf>ga?2:gf<ga?-2:0),0,100);
          if(p.inj<=0&&rnd()<.006){
            p.inj=ri(2,4);
            emit('Injury',id,`${p.name} suffers an injury in Europe and will miss ${p.inj} week${p.inj===1?'':'s'}.`,{pid:p.id,weeks:p.inj,comp:'europe'});
          }
        }
        for(let goal=0;goal<gf&&xi.length;goal++){
          const scorer=scorerFrom(xi);
          if(!scorer)continue;
          scorer.eGoals=(scorer.eGoals||0)+1;
          m.scorers[id].push({pid:scorer.id,name:scorer.name});
        }
        S.continentalReceipts=S.continentalReceipts||{};
        S.continentalReceipts[id]=r2((S.continentalReceipts[id]||0)+(id===winner?4:2));
        const other=id===a?b:a,oppName=S.clubs[other]?.name||f.clubs[other]?.name||other;
        emit('EuropeanMatch',id,`${S.clubs[id].name} ${gf}–${ga} ${oppName} in Europe.`,{comp:'europe',opp:other,week:w,winner,scorers:m.scorers[id]});
      }
      ties.push({...m,winner,week:w});winners.push(winner);
    }
    euro.rounds.push(ties);euro.alive=winners;
    if(winners.length===1)euro.winner=winners[0];
  }
  if(!historical)foreignPlayersEndWeek();
}
function foreignPlayerSeasonEnd(){
  const f=S.foreign;if(!f)return;
  for(const [id,sq] of Object.entries(f.squads||{})){
    const club=f.clubs[id];
    for(const p of sq.slice()){
      p.career=p.career||[];
      p.career.push(`${club.name} ${S.season}: ${p.sApps||0} apps, ${p.sGoals||0} goals`);
      p.history=p.history||[];
      p.history.push({season:S.season,club:id,age:p.age,apps:p.sApps||0,goals:p.sGoals||0,europe:p.eApps||0,europeGoals:p.eGoals||0,quality:r1(p.q)});
      if(p.history.length>30)p.history.shift();
      p.sApps=0;p.sGoals=0;p.eApps=0;p.eGoals=0;
      if(p.career.length>12)p.career.shift();
      p.age++;p.contract--;p.inj=Math.max(0,(p.inj||0)-3);
      if(p.age>=35){
        sq.splice(sq.indexOf(p),1);
        emit('Retired',null,`${p.name} retires after playing for ${club.name}.`,{pid:p.id,foreignClub:id});
        continue;
      }
      if(p.contract<=0){
        const retain=club.budget>35&&p.age<=31&&rnd()<clamp((p.loyalty??55)/130+.12,.15,.85);
        if(retain){
          p.contract=ri(2,4);
          p.wage=Math.round(p.wage*1.08/5)*5;
          club.budget=Math.max(0,club.budget-Math.round(playerValue(p)*.02));
        }else{
          sq.splice(sq.indexOf(p),1);
          faAdd(p,'out of contract abroad',id);
          emit('ForeignRelease',null,`${p.name} leaves ${club.name} on a free transfer.`,{pid:p.id,foreignClub:id});
          continue;
        }
      }
      // Growth accrued each week from actual playing time, not guaranteed every summer.
      if(p.age>=31)p.q=Math.max(4,p.q-(p.age-30)*.045);
      p.q=r1(p.q);p.grown=0;
    }
    // Keep a playable side, but do not automatically repair every recruitment
    // shortage: those shortages are the reason foreign clubs make market bids.
    for(const pos of POS){
      const min=pos==='GK'?2:Math.max(1,Math.floor(REQ[pos]*.75));
      while(sq.filter(p=>p.pos===pos).length<min){
        const q=11.5+(club.strength-50)/4-2+rnd()*2;
        sq.push(newPlayer(pos,{q,age:ri(17,24),contract:ri(2,4),club:id,name:foreignName(club.country),nationality:club.country}));
      }
    }
    while(sq.length<20){
      const pos=pick(POS.slice(1)),q=11.5+(club.strength-50)/4-2+rnd()*2;
      sq.push(newPlayer(pos,{q,age:ri(16,22),contract:ri(2,4),academy:true,club:id,name:foreignName(club.country),nationality:club.country}));
    }
  }
}
function foreignSeasonEnd(){
  const f=S.foreign;if(!f)return;
  if(f.lastSeason>=S.season)return;
  if(!f.current||f.current.season!==S.season)throw new Error('Foreign season not initialized');
  for(const country of Object.values(f.countries)){
    const league=f.current.leagues[country.code],table=foreignRank(league.rows);
    country.tables.push({season:S.season,rows:table});
    country.champions.push({season:S.season,id:table[0].id});
    table.forEach((row,i)=>{
      const club=f.clubs[row.id],place=i+1;
      club.history.push({season:S.season,place,pts:row.pts});
      club.form=Math.round((row.pts-33)/5);
      club.strength=Math.max(35,Math.min(85,Math.round(foreignSquadStrength(row.id)+(place<=3?1:place>=10?-1:0))));
      club.rep=Math.max(15,Math.min(95,club.rep+(place===1?2:place>=10?-1:0)));
      // Season performance affects next year's broadcast and sponsorship prospects via reputation.
      // Never replace the ledger's real cash balance with a random place-based multiplier.
      club.budget=r2(club.budget);
    });
    if(country.tables.length>25)country.tables.shift();
    if(country.champions.length>25)country.champions.shift();
  }
  const euro=f.current.europe;
  f.europe.seasons.push({season:S.season,participants:euro.participants,rounds:euro.rounds,winner:euro.winner});
  if(f.europe.seasons.length>25)f.europe.seasons.shift();
  foreignPlayerSeasonEnd();
  f.lastSeason=S.season;
  f.current=null;
}
/* Saves made before the weekly European calendar have no current fixture state.
   Reconstruct only missing foreign results; do not retroactively pay prizes or injure
   Northmarch players. Deterministic once the reconstructed state is saved. */
function foreignRestoreCalendar(){
  const f=S.foreign;
  if(!f)return;
  if(!f.squads||!Object.keys(f.squads).length)foreignSquadInit();
  if(!f.market)f.market={log:[]};
  if(f.current&&f.current.season===S.season)return;
  foreignStartSeason();
  const through=Math.max(0,Math.min(SEASON_WEEKS,S.week||0));
  for(let w=1;w<=through;w++)foreignWeek(w,{historical:true});
  f.current.reconstructed=through>0;
}
