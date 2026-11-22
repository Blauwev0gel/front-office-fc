// World-layer regression: foreign clubs must not enter the domestic economy.
const {loadEngine}=require('./load.js');
const E=loadEngine();E.newWorld(34567);const S=E.__get();
const assert=(condition,message)=>{if(!condition)throw Error(message)};
assert(Object.keys(S.foreign.countries).length===6,'six foreign countries');
assert(Object.keys(S.foreign.clubs).length===72,'72 foreign clubs');
assert(Object.keys(S.clubs).length===48,'domestic clubs remain separate');
assert(Object.keys(S.fin).length===48,'foreign clubs must not use domestic finances');
E.chooseClub(S.seats[0]);S.agmOff=true;
const domestic=new Set(Object.keys(S.clubs));
E.playSeason();
assert(S.foreign.lastSeason===1,'foreign season advanced');
assert(S.foreign.europe.seasons.length===1,'continental cup completed');
const cup=S.foreign.europe.seasons[0];
assert(cup.participants.length===16,'continental competition has 16 entrants');
assert(cup.rounds.length===4,'continental knockout has four rounds');
assert(cup.participants.filter(id=>domestic.has(id)).length===4,'Northmarch qualified four clubs');
for(const country of Object.values(S.foreign.countries)){
  const rows=country.tables[0].rows;
  assert(rows.length===12,'foreign league has 12 clubs');
  assert(rows.every(r=>r.w+r.d+r.l===22),'each club played 22 matches');
  assert(rows.reduce((a,r)=>a+r.gf-r.ga,0)===0,'league goals balance');
}
const saved=E.serialize();E.deserialize(saved);
assert(E.__get().foreign.europe.seasons[0].winner===cup.winner,'world survives save/load');
console.log('foreign-world-test: passed');
