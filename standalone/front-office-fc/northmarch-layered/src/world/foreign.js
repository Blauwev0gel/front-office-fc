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
  return{countries,clubs,europe:{seasons:[]},lastSeason:0};
}
function foreignStandings(ids){
  const rows=ids.map(id=>({id,pts:0,gf:0,ga:0,w:0,d:0,l:0}));
  const byId=Object.fromEntries(rows.map(r=>[r.id,r]));
  const order=shuffle(ids.slice());
  for(let leg=0;leg<2;leg++)for(let i=0;i<order.length;i++)for(let j=i+1;j<order.length;j++){
    const h=byId[leg?order[j]:order[i]],a=byId[leg?order[i]:order[j]];
    const sh=S.foreign.clubs[h.id].strength,sa=S.foreign.clubs[a.id].strength;
    const [lh,la]=lambdas(sh,sa,true),gh=pois(lh,rnd),ga=pois(la,rnd);
    h.gf+=gh;h.ga+=ga;a.gf+=ga;a.ga+=gh;
    if(gh>ga){h.w++;h.pts+=3;a.l++}else if(gh<ga){a.w++;a.pts+=3;h.l++}else{h.d++;a.d++;h.pts++;a.pts++}
  }
  return rows.sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.id.localeCompare(b.id));
}
function foreignSeasonEnd(){
  if(!S.foreign)S.foreign=foreignInit();
  const f=S.foreign;if(f.lastSeason>=S.season)return;
  const qualifiers=[];
  for(const country of Object.values(f.countries)){
    const ids=country.divisions[0].clubs,table=foreignStandings(ids);
    country.tables.push({season:S.season,rows:table});
    country.champions.push({season:S.season,id:table[0].id});
    for(const row of table){
      const club=f.clubs[row.id],place=table.indexOf(row)+1;
      club.history.push({season:S.season,place,pts:row.pts});
      club.form=Math.round((row.pts-33)/5);
      club.strength=Math.max(35,Math.min(85,club.strength+Math.round((rnd()-.5)*5+(place<=3?1:place>=10?-1:0))));
      club.rep=Math.max(15,Math.min(95,club.rep+(place===1?2:place>=10?-1:0)));
      club.budget=Math.max(20,Math.round(club.budget*(.98+(13-place)*.004)));
    }
    qualifiers.push(...table.slice(0,2).map(x=>x.id));
    if(country.tables.length>25)country.tables.shift();
    if(country.champions.length>25)country.champions.shift();
  }
  // Northmarch enters through its actual top-division standings, not a fictional placeholder.
  const home=standings(0).slice(0,4);
  const participants=qualifiers.concat(home);
  let alive=shuffle(participants);
  const rounds=[];
  while(alive.length>1){
    const next=[],ties=[];
    for(let i=0;i<alive.length;i+=2){
      const a=alive[i],b=alive[i+1],sa=f.clubs[a]?.strength??teamStrength(a),sb=f.clubs[b]?.strength??teamStrength(b);
      const [la,lb]=lambdas(sa,sb,false),ga=pois(la,rnd),gb=pois(lb,rnd);
      const winner=ga===gb?(rnd()<.5+(sa-sb)/150?a:b):ga>gb?a:b;
      ties.push({a,b,ga,gb,winner});next.push(winner);
    }
    rounds.push(ties);alive=next;
  }
  f.europe.seasons.push({season:S.season,participants,rounds,winner:alive[0]});
  if(f.europe.seasons.length>25)f.europe.seasons.shift();
  f.lastSeason=S.season;
}
