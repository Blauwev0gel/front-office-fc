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
  return{countries,clubs,europe:{seasons:[]},lastSeason:0,current:null};
}
/* Persistent, week-driven international football. Foreign clubs deliberately remain lightweight:
   no Northmarch finances, squads or board commands. The domestic clubs use actual team strength. */
const EURO_WEEKS=[6,12,18,24];
function foreignRows(ids){return Object.fromEntries(ids.map(id=>[id,{id,p:0,pts:0,gf:0,ga:0,w:0,d:0,l:0}]))}
function foreignRank(rows){return Object.values(rows).sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.id.localeCompare(b.id))}
function foreignStrength(id){return S.foreign.clubs[id]?S.foreign.clubs[id].strength:teamStrength(id)}
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
  f.current={season:S.season,leagues:{},europe:null};
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
          x.p.apps++;x.p.sApps++;x.p.played=1;x.p.tired=1;
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
      club.strength=Math.max(35,Math.min(85,club.strength+Math.round((rnd()-.5)*5+(place<=3?1:place>=10?-1:0))));
      club.rep=Math.max(15,Math.min(95,club.rep+(place===1?2:place>=10?-1:0)));
      club.budget=Math.max(20,Math.round(club.budget*(.98+(13-place)*.004)));
    });
    if(country.tables.length>25)country.tables.shift();
    if(country.champions.length>25)country.champions.shift();
  }
  const euro=f.current.europe;
  f.europe.seasons.push({season:S.season,participants:euro.participants,rounds:euro.rounds,winner:euro.winner});
  if(f.europe.seasons.length>25)f.europe.seasons.shift();
  f.lastSeason=S.season;
  f.current=null;
}
