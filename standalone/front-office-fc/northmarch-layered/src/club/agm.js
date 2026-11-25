/* ================= The AGM as a played moment (milestone M3b, start of L4) =================
   The yearly vote is the spine of the game (D-G5). Before the vote the chairman faces the hall:
   1 the annual report (finish, money, promises, agreements, what the members weigh),
   2 the floor: every members' group with its share, mood, wish, and one motion tabled by the unhappiest group
     (support or oppose; a motion that passes is binding: a statute where one exists, a recorded commitment otherwise),
   3 the speech: four themes, each pleasing some groups and costing others.
   Everything moves group moods and, weighted by share, the existing members' confidence that holdAGMs turns into the vote.
   After the vote the tally is shown per group, consistent with the real result.
   Owns S.agmPrep = {s, motion, motionDone, pass, speech} (player's club). No DOM. */
const SPEECH={
  humble:{n:'Own the mistakes',d:'Say what went wrong and what you will change.',fx:{oldguard:6,families:4,volunteers:4,business:-2,ultras:-2},conf:2},
  vision:{n:'A bold vision',d:'Promotion, a new stand, a bigger club.',fx:{business:8,students:6,newcomers:6,ultras:3,oldguard:-6,retirees:-4},conf:1,bold:true},
  thanks:{n:'Thank the members',d:'This is your club; I only look after it.',fx:{volunteers:6,families:5,workers:4,retirees:3},conf:2},
  blame:{n:'Blame the head coach',d:'Results were not good enough on the pitch.',fx:{ultras:5,oldguard:3,workers:2,families:-3,volunteers:-3},conf:2,blame:true}
};
function agmGroupName(id,g){return ARCH[g.k]?.n||TOWNS[CL(id).town]?.wk||g.k}
function AGMP(){const id=S.my;if(!S.agmPrep||S.agmPrep.s!==S.season)S.agmPrep={s:S.season,motion:agmPickMotion(id),motionDone:false,pass:null,speech:null};return S.agmPrep}
function agmPickMotion(id){const c=CL(id),gs=c.groups.filter(g=>ARCH[g.k]?.motion&&!c.statute.includes(ARCH[g.k].motion.t)&&!(c.binding||[]).some(b=>b.t===ARCH[g.k].motion.t)).sort((a,b)=>a.mood-b.mood);return gs[0]?{k:gs[0].k,...ARCH[gs[0].k].motion}:null}
/* group moods feed the members' confidence, weighted by each group's share of the hall */
function agmMood(id,fx,why){const c=CL(id);let w=0;for(const g of c.groups){const d=fx[g.k]||0;if(!d)continue;g.mood=clamp(g.mood+d,5,95);w+=d*g.share/100}if(w)confLog(id,r1(w*.6),why);return w}
function agmReport(id){
  const m=M(id),c=CL(id),goals=(m.goals||[]).map(g=>({t:g.text,...goalProgress(id,g)})),pacts=(S.pacts||[]).filter(p=>p.s===S.season&&p.status!=='open');
  return{pos:posOf(id),tier:c.tier,pts:S.tbl[id].pts,op:operatingResult(F(id).season),goals,kept:pacts.filter(p=>p.status==='kept').length,broken:pacts.filter(p=>p.status==='broken').length,reasons:seasonReasons(id),conf:Math.round(m.conf),forecast:agmForecastPct(id)};
}
function agmForecastPct(id){const m=M(id),c=CL(id),exp=goalsExpected(id),pos=posOf(id),fresh=S.career.length&&S.career[S.career.length-1].from===S.season?6:0;let conf=m.conf+exp+(c.tier>0&&pos<=2?12:0)+(c.tier<2&&pos>=15?-15:0);return clamp(Math.round(24+.75*conf+fresh),3,97)}
function goalsExpected(id){return(M(id).goals||[]).reduce((a,g)=>a+(goalProgress(id,g).met?g.w*.8:-g.w*.8),0)}
function agmGroupPct(id,base){const c=CL(id),avg=c.groups.reduce((s,g)=>s+g.mood*g.share,0)/100;let rows=c.groups.map(g=>({g,pct:clamp(base+(g.mood-avg)*2,3,97)}));const tot=rows.reduce((s,r)=>s+r.pct*r.g.share,0)/100,shift=base-tot;return rows.map(r=>({g:r.g,pct:Math.round(clamp(r.pct+shift,2,98))}))}
function agmFloor(id){const f=agmForecastPct(id);return agmGroupPct(id,f).map(({g,pct})=>({k:g.k,n:agmGroupName(id,g),share:g.share,pct,stance:pct>=55?'For you':pct>=45?'Undecided':'Against you',wants:ARCH[g.k]?.wants||''}))}
function agmMotionVote(id,support){
  const P_=AGMP(),mo=P_.motion;if(!mo||P_.motionDone)return{ok:false,err:'No motion to decide'};P_.motionDone=true;const c=CL(id);
  const fx={[mo.k]:support?12:-10};if(mo.against)fx[mo.against]=support?-8:5;agmMood(id,fx,support?`You backed the motion: ${mo.t}`:`You opposed the motion: ${mo.t}`);
  const share=c.groups.find(g=>g.k===mo.k)?.share||20,pass=support||(share>=35&&M(id).conf<50);P_.pass=pass;
  if(pass){c.binding=c.binding||[];c.binding.push({t:mo.t,s:S.season,by:mo.k});if(STATUTE.includes(mo.t)&&!c.statute.includes(mo.t))c.statute.push(mo.t);if(mo.cost)book(id,'other',-mo.cost)}
  emit('Club',id,`AGM motion “${mo.t}” ${pass?'passes':'falls'}${support?' with your support':''}.`);
  return{ok:true,pass,text:pass?`The motion passes${mo.cost?` (cost £${mo.cost}k)`:''}. It binds the club from now on.`:'The motion falls.'};
}
function agmSpeech(id,k){
  const P_=AGMP(),sp=SPEECH[k];if(!sp)return{ok:false,err:'Unknown speech'};if(P_.speech)return{ok:false,err:'You have spoken'};P_.speech=k;
  agmMood(id,sp.fx,`Your AGM speech: ${sp.n.toLowerCase()}`);if(sp.conf)confLog(id,sp.conf,'You faced the members');
  if(sp.blame){const co=P(CL(id).cast.coach);if(co)co.loy=clamp((co.loy??50)-20,0,100)}
  if(sp.bold){const m=M(id);m.manifest={league:2,money:1,youth:1,s:S.season+1,locked:'league'}}
  return{ok:true,text:sp.bold?'The hall stirs. You have promised a bold season: next year’s league promise is Bold.':sp.blame?'Some cheer. The head coach heard it too.':'The hall listens.'};
}
/* after the vote: the tally per group, consistent with the real result */
function agmTally(id){const a=M(id).agm;if(!a)return[];return agmGroupPct(id,a.for).map(({g,pct})=>({n:agmGroupName(id,g),share:g.share,pct}))}
/* a binding term limit (the Old Guard's motion): after two seasons in the chair you must step down; an heir may stand */
const TERM_LIMIT='A chairman may serve two terms at most';
function agmTermLimit(){
  const id=S.my;if(!id||S.votedOut)return;const c=CL(id),b=(c.binding||[]).find(x=>x.t===TERM_LIMIT);if(!b)return;
  const st=S.career[S.career.length-1];if(!st||st.club!==id)return;const served=S.season-st.from+1;if(served<2)return;
  if(S.family&&famAdults().length){S.family.retire=true;emit('Club',id,'The term limit: you step down. Your heir may stand.');}
  else{st.to=S.season;st.why='Term limit reached';S.votedOut=id;emit('ChairmanOut',id,'The members’ term limit ends your time in the chair.',{player:true})}
}
