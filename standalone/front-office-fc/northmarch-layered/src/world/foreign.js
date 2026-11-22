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
const EURO_WEEKS=[6,12,18,24];
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
      for(let j=0;j<count;j++)f.squads[id].push(newPlayer(pos,{q:base-1.3+rnd()*2.3,club:id,contract:ri(1,4)}));
    }
  }
}
function foreignSquadStrength(id){
  const sq=S.foreign.squads&&S.foreign.squads[id];
  return sq&&sq.length>=11?qualityToStr(squadQuality(sq)):S.foreign.clubs[id].strength;
}
function foreignTransferWindow(){
  const f=S.foreign;if(!f)return;
  foreignSquadInit();
  const ids=shuffle(Object.keys(f.clubs));
  for(const id of ids){
    const club=f.clubs[id],sq=f.squads[id],positions=POS.filter(pos=>sq.filter(p=>p.pos===pos).length<Math.max(2,REQ[pos]-1));
    const target=positions.length?pick(positions):pick(POS);
    const candidates=shuffle(Object.keys(S.clubs)).filter(from=>S.squads[from].length>SQUAD_MIN+1&&CL(from).tier<=3);
    for(const from of candidates.slice(0,12)){
      const available=S.squads[from].filter(p=>p.pos===target&&p.age<=30&&!p.loan&&canSpare(S.squads[from],p,true));
      if(!available.length)continue;
      const p=pick(available),fee=Math.max(1,Math.round(playerValue(p)*1.25));
      if(fee>club.budget*.18||p.q<10.5)continue;
      S.squads[from].splice(S.squads[from].indexOf(p),1);
      book(from,'feesIn',fee);
      club.budget-=fee;
      p.club=id;p.joined=S.season;p.contract=ri(2,4);
      p.wage=Math.round(wageFor(p.q)*1.15/5)*5;
      sq.push(p);
      const move={season:S.season,week:S.week,pid:p.id,name:p.name,from,to:id,fee};
      f.market.log.push(move);
      emit('Transfer',from,`${p.name} moves from ${CL(from).name} to ${club.name} for £${fee}k.`,{pid:p.id,c2:id,fee,why:'foreign interest'});
      break;
    }
  }
  // Domestic clubs can sign affordable foreign players where the squad has a real gap.
  for(const to of shuffle(Object.keys(S.clubs))){
    const dest=S.squads[to];if(dest.length>=SQUAD_MAX-1)continue;
    const short=POS.filter(pos=>dest.filter(p=>p.pos===pos).length<REQ[pos]);
    if(!short.length)continue;
    const pos=pick(short),cash=budgetFor(to);
    if(cash<=0)continue;
    const sellers=shuffle(ids);
    for(const from of sellers.slice(0,16)){
      const source=f.squads[from],options=source.filter(p=>p.pos===pos&&p.age<=30&&source.filter(x=>x.pos===pos).length>REQ[pos]&&p.q>=10);
      if(!options.length)continue;
      const p=pick(options),fee=Math.max(1,Math.round(playerValue(p)*1.2));
      if(fee>cash||wageBillK(to)+wageFor(p.q)/1000>wageCapK(to))continue;
      source.splice(source.indexOf(p),1);dest.push(p);
      book(to,'feesOut',-fee);f.clubs[from].budget+=fee;
      p.club=to;p.joined=S.season;p.contract=ri(2,4);p.wage=moveWage(p,to);
      f.market.log.push({season:S.season,week:S.week,pid:p.id,name:p.name,from,to,fee});
      emit('Transfer',to,`${p.name} joins ${CL(to).name} from ${f.clubs[from].name} for £${fee}k.`,{pid:p.id,c2:from,fee,why:'international scouting'});
      break;
    }
  }
  // Foreign clubs also recruit from one another to replace gaps and circulate talent.
  for(const id of ids){
    const buyer=f.clubs[id],sq=f.squads[id],target=pick(POS);
    if(sq.filter(p=>p.pos===target).length>=REQ[target]+1)continue;
    const sellers=shuffle(ids.filter(x=>x!==id));
    for(const from of sellers.slice(0,10)){
      const seller=f.clubs[from],pool=f.squads[from].filter(p=>p.pos===target&&p.age<32&&f.squads[from].filter(x=>x.pos===target).length>REQ[target]);
      if(!pool.length)continue;
      const p=pick(pool),fee=Math.max(1,Math.round(playerValue(p)));
      if(fee>buyer.budget*.12)continue;
      f.squads[from].splice(f.squads[from].indexOf(p),1);sq.push(p);
      buyer.budget-=fee;seller.budget+=fee;p.club=id;p.joined=S.season;p.contract=ri(2,4);
      f.market.log.push({season:S.season,week:S.week,pid:p.id,name:p.name,from,to:id,fee});
      break;
    }
  }
  if(f.market.log.length>1200)f.market.log.splice(0,f.market.log.length-1200);
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
function foreignWeek(w){
  const f=S.foreign;if(!f)return;
  if(!f.current||f.current.season!==S.season)foreignStartSeason();
  for(const league of Object.values(f.current.leagues)){
    const round=league.rounds[w-1];if(!round)continue;
    const results=round.map(([h,a])=>foreignGame(h,a));
    for(const m of results)foreignRecord(league.rows,m);
    league.results.push({week:w,matches:results});
  }
  const euro=f.current.europe,idx=EURO_WEEKS.indexOf(w);
  if(idx>=0&&euro.alive.length>1){
    const winners=[],ties=[];
    for(let i=0;i<euro.alive.length;i+=2){
      const a=euro.alive[i],b=euro.alive[i+1],m=foreignGame(a,b,true);
      const winner=m.gh===m.ga?(rnd()<.5+(foreignStrength(a)-foreignStrength(b))/150?a:b):m.gh>m.ga?a:b;
      ties.push({...m,winner,week:w});winners.push(winner);
      // Domestic entrants use their actual squad; continental minutes and fatigue affect players.
      for(const id of [a,b])if(S.clubs[id]){
        const xi=pickXI(S.squads[id]);
        for(const x of xi){
          x.p.eApps=(x.p.eApps||0)+1;x.p.europeLoad=(x.p.europeLoad||0)+1;
          // The extra fixture creates a small but real injury exposure.
          if(x.p.inj<=0&&rnd()<.006)x.p.inj=ri(1,2);
        }
        book(id,'europe',id===winner?4:2);
        emit('EuropeanMatch',id,`${S.clubs[id].name} ${id===a?m.gh:m.ga}–${id===a?m.ga:m.gh} ${S.clubs[id===a?b:a]?.name||f.clubs[id===a?b:a].name} in Europe.`,{comp:'europe',opp:id===a?b:a,week:w,winner});
      }
    }
    euro.rounds.push(ties);euro.alive=winners;
    if(winners.length===1)euro.winner=winners[0];
  }
}
function foreignPlayerSeasonEnd(){
  const f=S.foreign;if(!f)return;
  for(const [id,sq] of Object.entries(f.squads||{})){
    const club=f.clubs[id];
    for(const p of sq.slice()){
      p.career=p.career||[];
      p.career.push(`${club.name} ${S.season}: foreign league`);
      if(p.career.length>12)p.career.shift();
      p.age++;p.contract--;
      if(p.age>=35||p.contract<=0){sq.splice(sq.indexOf(p),1);continue}
      if(p.age<=24&&p.q<p.pa)p.q=Math.min(p.pa,p.q+(p.pa-p.q)*(.04+rnd()*.08));
      if(p.age>=31)p.q=Math.max(4,p.q-(p.age-30)*.045);
      p.q=r1(p.q);
    }
    for(const pos of POS){
      const min=Math.max(2,Math.ceil(REQ[pos]*.8));
      while(sq.filter(p=>p.pos===pos).length<min){
        const q=11.5+(club.strength-50)/4-2+rnd()*2;
        sq.push(newPlayer(pos,{q,age:ri(17,24),contract:ri(2,4),club:id}));
      }
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
      club.budget=Math.max(20,Math.round(club.budget*(.98+(13-place)*.004)));
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
