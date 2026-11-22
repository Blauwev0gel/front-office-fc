// L3 slice 1: the director's mandate on deals, his proposals above it, and what the chairman's answer does (seconds).
const {loadEngine}=require('./load.js');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
let used=0,tested=0;
for(let seed=1;seed<=15&&tested<3;seed++){
  const E=loadEngine();E.newWorld(seed*71);const S=E.__get();E.chooseClub(S.seats[0]);S.agmOff=true;const id=S.my;
  ok(S.fin[id].policy.mandate.deals==='medium'||seed>1,'a new club starts with a medium deal limit');
  /* large mandate: no proposals, the director signs alone */
  E.cmd('SetMandate',id,{deals:'large'});if(E.openProposals().length)ok(false,'a large mandate makes no proposals');
  E.cmd('SetMandate',id,{deals:'small'});const open=E.openProposals();if(!open.length)continue;tested++;
  const cap=E.dealCap(id);
  ok(open.length<=3&&open.every(p=>p.fee>cap&&p.est>0&&p.need),`seed ${seed}: proposals are real deals above the limit (${open.length}, limit £${cap}k)`);
  ok(open.every(p=>{const f=E.findPlayer(p.pid);return f&&f.club!==id&&(f.club||null)===(p.from||null)}),'every proposed player exists and is at the club named');
  const okR=E.cmd('ApproveProposal',id,{id:open[0].id}),decl=open[1]?E.cmd('DeclineProposal',id,{id:open[1].id}):{ok:true};
  ok(okR.ok&&decl.ok,'approving and declining work');ok(!E.cmd('ApproveProposal',id,{id:99999}).ok,'an unknown proposal is refused');
  ok(S.journal.some(j=>/Approved:/.test(j.text)),'the approval is in the decision journal');
  const sq0=S.squads[id].length,pid=open[0].pid;E.advanceWeek();
  const pr=S.ops.proposals.find(p=>p.id===open[0].id);
  ok(pr.status==='done'&&S.squads[id].some(p=>p.id===pid),`the approved player joins when the window closes (${pr.status})`);
  ok(S.ops.signings.some(s=>s.pid===pid),'and shows in the signings review');
  if(open[1])ok(S.ops.proposals.find(p=>p.id===open[1].id).status==='declined'&&!S.squads[id].some(p=>p.id===open[1].pid),'a declined player does not join');
  if(open[2])ok(S.ops.proposals.find(p=>p.id===open[2].id).status==='expired','an unanswered proposal lapses');
  ok(E.openProposals().length===0,'no proposal stays open after the window');
  /* save and load keep the proposals; an old save without them loads */
  const txt=E.serialize();E.deserialize(txt);ok(E.__get().ops.proposals.length>=1,'save and load keep the proposals');
  const old=JSON.parse(txt);delete old.ops.proposals;delete old.ops.pnext;delete old.fin[id].policy.mandate;E.deserialize(JSON.stringify(old));
  ok(Array.isArray(E.__get().ops.proposals)&&E.dealCap(id)===Infinity,'an older save loads, with no deal limit');
  /* the winter window asks again */
  E.cmd('SetMandate',id,{deals:'small'});while(E.__get().week<13)E.advanceWeek();E.advanceWeek();ok(E.__get().week===14,'play on to the week before the winter window');
}
ok(tested>=1,`proposals appeared in ${tested} of the tested worlds`);
console.log(fails?`l3-test: ${fails} failed`:'l3-test: all checks passed');process.exit(fails?1:0);
