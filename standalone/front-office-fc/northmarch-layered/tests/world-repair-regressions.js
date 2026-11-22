// Regression contracts for the six-block world repair.
// AUTHORING ONLY on 2026-11-22: this file has NOT been executed or certified passing.
const assert=require('assert');
const {loadEngine}=require('./load.js');
const approximately=(a,b,tolerance=.1)=>Math.abs(a-b)<=tolerance;
const everyPlayer=S=>Object.values(S.squads).flat().concat(Object.values(S.foreign.squads).flat(),S.fa);
function uniqueOwnership(S){
  const ids=everyPlayer(S).map(p=>p.id);
  assert.strictEqual(ids.length,new Set(ids).size,'a player must belong to exactly one squad/free-agent pool');
  for(const [id,sq]of Object.entries(S.squads))for(const p of sq)assert(p.loan||p.club===id,'domestic owner must match player club');
  for(const [id,sq]of Object.entries(S.foreign.squads))for(const p of sq)assert.strictEqual(p.club,id,'foreign owner must match player club');
}
function foreignCash(S){
  for(const c of Object.values(S.foreign.clubs)){
    const l=c.ledger;if(!l||l.start==null)continue;
    const result=l.start+(l.income||0)+(l.wages||0)+(l.other||0)+(l.transfers||0)+(l.financing||0);
    assert(approximately(result,c.budget,.15),c.name+' ledger must reconcile: '+result+' versus '+c.budget);
  }
}
function verifyStats(){
  const E=loadEngine();E.newWorld(31021);
  const ids=E.tierIds(0),S=E.__get(),a=ids[0],b=ids[1],s=S.squads[a];
  const leagueBefore=s.reduce((n,p)=>n+p.sApps,0),cupBefore=s.reduce((n,p)=>n+(p.cupApps||0),0);
  E.playMatch(a,b,{comp:'cup'});
  assert.strictEqual(s.reduce((n,p)=>n+p.sApps,0),leagueBefore,'cup cannot count toward league appearances');
  assert(s.reduce((n,p)=>n+(p.cupApps||0),0)>cupBefore,'cup must count separately');
  const before=s.reduce((n,p)=>n+p.sApps,0);
  E.playMatch(a,b,{comp:'league'});
  assert(s.reduce((n,p)=>n+p.sApps,0)>before,'league appearances must increment');
  const [n1,n2]=E.lambdas(60,60,false);
  assert.strictEqual(n1,n2,'neutral games cannot give away team an xG advantage');
}
function verifyWorld(seed){
  const E=loadEngine();E.newWorld(seed);const S=E.__get();
  assert.strictEqual(S.v,10,'save schema version');
  assert.strictEqual(Object.keys(S.clubs).length,80,'80 Northmarch clubs');
  assert.strictEqual(Object.keys(S.foreign.clubs).length,72,'72 foreign clubs');
  assert.strictEqual(Object.keys(S.foreign.squads).length,72,'every foreign club has a persistent squad');
  for(let tier=0;tier<=4;tier++)assert.strictEqual(E.tierIds(tier).length,16,'16 per domestic tier');
  E.chooseClub(S.seats[0]);S.agmOff=true;
  for(let w=1;w<=30;w++){
    E.advanceWeek();
    if(w===11)assert.strictEqual(S.foreign.current.europe.rounds.length,2,'second European round in week 11');
  }
  assert.strictEqual(S.cup.log.length,79,'80-team cup produces 79 ties');
  assert(S.cup.winner,'domestic cup has a champion');
  for(let tier=0;tier<=4;tier++)
    for(const id of E.tierIds(tier))assert.strictEqual(S.tbl[id].p,30,'league club has 30 fixtures');
  for(const c of Object.values(S.foreign.countries)){
    const league=S.foreign.current.leagues[c.code];
    for(const row of Object.values(league.rows))assert.strictEqual(row.p,22,'foreign clubs have 22 league games');
  }
  assert.strictEqual(S.foreign.current.europe.rounds.length,4,'four European rounds');
  uniqueOwnership(S);foreignCash(S);
  const save=E.serialize(),previous=JSON.parse(save);
  E.deserialize(save);
  assert.strictEqual(E.__get().foreign.current.europe.winner,previous.foreign.current.europe.winner,'European champion survives save/load');
  E.closeSeason();
  assert.strictEqual(S.worldAwards.length,1,'one factual season award set');
  assert(S.foreign.europe.seasons[0].winner,'European champion is archived');
  for(let tier=0;tier<=4;tier++)assert.strictEqual(E.tierIds(tier).length,16,'promotion preserves 16-team division');
  uniqueOwnership(S);foreignCash(S);
}
verifyStats();
for(const seed of [12021,22021,32021])verifyWorld(seed);
console.log('world-repair-regressions: all constraints passed');
