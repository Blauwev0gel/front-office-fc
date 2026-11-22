// L3 slice 1: the director's mandate on deals. Inside it he decides alone; above it he leaves a deal alone and the chairman sees what that cost.
// Nothing is ever approved by the chairman: no individual transfers.
const {loadEngine}=require('./load.js');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
let tested=0;
for(let seed=1;seed<=15&&tested<3;seed++){
  const E=loadEngine();E.newWorld(seed*71);const S=E.__get();E.chooseClub(S.seats[0]);S.agmOff=true;const id=S.my;
  ok(S.fin[id].policy.mandate.deals==='medium'||seed>1,'a new club starts with a medium deal limit');
  ok(!E.cmd('ApproveProposal',id,{id:1}).ok&&!E.cmd('DeclineProposal',id,{id:1}).ok,'the chairman cannot approve or decline individual transfers: no such command');
  E.cmd('SetMandate',id,{deals:'large'});ok(E.aboveLimit().length===0,'a large mandate leaves nothing above the limit');
  E.cmd('SetMandate',id,{deals:'small'});const above=E.aboveLimit();if(!above.length)continue;tested++;
  const cap=E.dealCap(id);
  ok(above.length<=3&&above.every(p=>p.fee>cap&&p.cap===cap&&p.est>0&&p.need),`seed ${seed}: what is left alone is real and above the limit (${above.length}, limit £${cap}k)`);
  ok(above.every(p=>{const f=E.findPlayer(p.pid);return f&&f.club!==id&&(f.club||null)===(p.from||null)}),'every player named exists at the club named');
  ok(S.journal.some(j=>/deal limit: Small/.test(j.text)),'the limit change is in the decision journal');
  const names=above.map(p=>p.pid);E.advanceWeek();
  const sg=S.ops.signings.filter(x=>x.need!=='Emergency cover'&&x.s===1&&x.w===0);
  ok(sg.every(x=>x.fee<=cap),`the director signs nobody above the limit (${sg.length} signings, none over £${cap}k)`);
  ok(!S.squads[id].some(p=>names.includes(p.id)),'and the players above the limit did not come');
  ok(E.aboveLimit().length===0&&S.ops.missed.filter(p=>p.status==='missed').length===above.length,'after the window the list becomes "left alone"');
  ok(!('proposals' in S.ops),'there are no proposals to answer');
  /* widening the limit is a policy choice; the next scan follows it */
  const txt=E.serialize();E.deserialize(txt);ok(E.__get().ops.missed.length===above.length,'save and load keep the record');
  const old=JSON.parse(txt);old.ops.proposals=[{id:1,status:'open'}];delete old.ops.missed;delete old.fin[id].policy.mandate;E.deserialize(JSON.stringify(old));
  ok(Array.isArray(E.__get().ops.missed)&&!('proposals' in E.__get().ops)&&E.dealCap(id)===Infinity,'an older save loads, with no deal limit and no proposals');
  E.cmd('SetMandate',id,{deals:'small'});while(E.__get().week<13)E.advanceWeek();E.advanceWeek();ok(E.__get().week===14,'play on to the week before the winter window');
}
ok(tested>=1,`deals above the limit appeared in ${tested} of the tested worlds`);
console.log(fails?`l3-test: ${fails} failed`:'l3-test: all checks passed');process.exit(fails?1:0);
