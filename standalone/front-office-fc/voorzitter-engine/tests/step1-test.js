// Stap 1: datamodel en tijdmotor.
const assert=require('assert');const E=require('./load')();
const S=E.newState(42);
assert.strictEqual(S.l1.plots.length,6,'6 kavels');
assert.strictEqual(Object.keys(S.l1.departments).length,6,'6 afdelingen');
assert.deepStrictEqual(Object.keys(S.l2.pots).join(),'transfers,wages,facilities,reserve','4 potjes');
for(const b of Object.values(E.BUILDINGS))assert.ok(E.DEPARTMENTS[b.dept],'gebouw hoort bij een afdeling');
// fasevolgorde en signalen: laag 1 zendt in 'initiatives', laag 2 leest in 'finance'
const seen=[];
E.onPhase('initiatives','l1',s=>{seen.push('l1');E.emit(s,'facility.capacity',1000)});
E.onPhase('finance','l2',s=>{seen.push('l2');s.l2.lastCap=E.signal(s,'facility.capacity',0)});
E.tick(S);
assert.deepStrictEqual(seen.join(),'l1,l2','vaste volgorde');
assert.strictEqual(S.l2.lastCap,1000,'signaal komt aan');
// seizoenswissel
E.run(S,E.CAL.WEEKS);
assert.strictEqual(S.season,2);assert.strictEqual(S.week,2);
// determinisme en save/load
const a=E.newState(7),b=E.newState(7);E.rnd(a);E.rnd(b);
assert.strictEqual(E.save(a),E.save(b),'zelfde seed, zelfde toestand');
const c=E.load(E.save(S));assert.strictEqual(E.save(c),E.save(S),'save/load rond');
console.log('step1-test OK');
