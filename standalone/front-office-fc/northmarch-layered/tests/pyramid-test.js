// Five-division pyramid and inclusive national cup regression.
const {loadEngine}=require('./load.js');
const E=loadEngine(),assert=require('assert');
E.newWorld(12345);let S=E.__get();
assert.strictEqual(Object.keys(S.clubs).length,80);
const tiers=[0,1,2,3,4];
for(const tier of tiers){
  assert.strictEqual(E.tierIds(tier).length,16,'division '+tier);
  assert.strictEqual(S.fx[tier].length,30,'30 matchdays');
  assert.strictEqual(S.fx[tier].flat().length,240,'240 fixtures');
}
assert.strictEqual(S.cup.alive.length,32,'lower divisions enter preliminary cup round');
E.chooseClub(S.seats[0]);S.agmOff=true;
const before=Object.fromEntries(Object.keys(S.clubs).map(id=>[id,S.clubs[id].tier]));
for(let w=1;w<=30;w++){
  E.advanceWeek();
  if(w===2){assert.strictEqual(S.cup.log.filter(l=>l.r===0).length,16,'16 preliminary ties played');assert.strictEqual(S.cup.alive.length,64,'16 preliminary winners plus the 48 clubs of divisions 0-2 enter the first round')}
  if(w===4)assert.strictEqual(S.cup.alive.length,32,'32 first-round winners');
}
assert.strictEqual(S.cup.log.length,79,'80-club knockout needs 79 ties');
assert(S.cup.winner,'national cup winner');
const oldTop=E.standings(0).slice(-2),oldBottom=E.standings(4).slice(0,2);
E.closeSeason();
for(const id of oldTop)assert.strictEqual(S.clubs[id].tier,1,'top-tier relegation');
for(const id of oldBottom)assert.strictEqual(S.clubs[id].tier,3,'bottom-tier promotion');
for(const tier of tiers)assert.strictEqual(E.tierIds(tier).length,16,'balanced after promotion');
assert.strictEqual(S.foreign.europe.seasons.length,1,'Europe also advanced');
const snapshot=E.serialize();E.deserialize(snapshot);
assert.strictEqual(E.__get().foreign.europe.seasons.length,1,'foreign save persistence');
console.log('pyramid-test: passed');
