/* ================= The week's shape (milestone M2): the topic, the stakes, and looking back =================
   The week screen shows, in order: the topic of the week (one line from the world), at most one escalation or moment,
   the match with what is at stake, your week, and the close (what the staff did, looking back, the world).
   This module only reads the state and returns words; it decides nothing. Owns S.lookBack = {shown[]} (which
   earlier decisions were already looked back on). No DOM. */
function weekTopic(id){
  const w=S.week+1,c=CL(id),fx=seasonOver()?null:fixtureOf(id,w),pos=S.week?posOf(id):null,n=tierIds(c.tier).length,form=(S.tbl[id]?.form||[]).slice(-3).join('');
  const cup=!seasonOver()&&CUP_WEEKS[S.cup.round]===w&&cupTieOf(id);
  const opp=fx?CL(fx.opp):null,op=fx&&S.week?posOf(fx.opp):null,inj=S.squads[id].filter(p=>p.inj>0).length;
  const m=M(id),lg=(m.goals||[]).find(g=>g.k==='league');
  if(seasonOver())return{k:'agm',t:`The season is over. The members vote at the AGM: confidence ${Math.round(m.conf)}.`};
  if(cup)return{k:'cup',t:`Cup week: a tie on top of the league game. A run is worth money and goodwill.`};
  if(opp&&(opp.town===c.town||opp.rival===id||c.rival===fx.opp))return{k:'derby',t:`Derby week against ${opp.name}. The town talks about nothing else.`};
  if(S.week>=3&&pos<=3&&op<=3)return{k:'top',t:`Top of the table: ${ord(pos)} against ${ord(op)}. A title race takes shape.`};
  if(S.week>=5&&pos>=n-3&&op>=n-3)return{k:'six',t:`A six-pointer at the bottom: ${ord(pos)} against ${ord(op)}.`};
  if(w===WINTER_WEEK)return{k:'window',t:'The winter window opens this week. The director goes back to the market.'};
  if(S.week>=24)return{k:'agm',t:`${SEASON_WEEKS-S.week} weeks to the AGM. Members' confidence stands at ${Math.round(m.conf)}.`};
  if(form==='LLL')return{k:'crisis',t:'Three defeats in a row. The pressure on the head coach is growing.'};
  if(form==='WWW')return{k:'form',t:'Three wins in a row. The ground fills, the members smile.'};
  if(inj>=4)return{k:'injuries',t:`${inj} players injured. The medical staff are stretched.`};
  if(lg&&S.week>=10&&pos>lg.target+3)return{k:'promise',t:`You promised ${ord(lg.target)} or better; you are ${ord(pos)}. The members are counting.`};
  /* quieter weeks: still a story from the squad, the opponent or the members */
  const sq=S.squads[id],opts=[];
  const debut=sq.find(p=>p.joined===S.season&&!p.sApps&&!p.inj&&!p.loan&&S.week<=8);if(debut)opts.push({k:'debut',t:`${debut.name} could make his debut this week.`});
  const scorer=sq.slice().sort((a,b)=>b.sGoals-a.sGoals)[0];if(scorer&&scorer.sGoals>=4)opts.push({k:'scorer',t:`${scorer.name} has ${scorer.sGoals} goals this season. Can he keep it going?`});
  const kid=sq.find(p=>p.age<=19&&p.sApps>=1&&p.sApps<=3);if(kid)opts.push({k:'youth',t:`${kid.name}, ${kid.age}, has broken into the side. The academy is watching.`});
  if(opp){const of=(S.tbl[fx.opp]?.form||[]).slice(-3).join('');if(of==='WWW')opts.push({k:'opp',t:`${opp.name} arrive with three straight wins.`});else if(of==='LLL')opts.push({k:'opp',t:`${opp.name} have lost three in a row. A chance.`})}
  if(m.conf<45)opts.push({k:'members',t:`The members are restless: confidence ${Math.round(m.conf)}.`});
  if(pos&&S.week>=6){const ids=tierIds(c.tier),tab=ids.slice().sort((a,b)=>S.tbl[b].pts-S.tbl[a].pts),top=S.tbl[tab[Math.min(3,tab.length-1)]].pts,safe=S.tbl[tab[Math.max(0,n-3)]].pts,me=S.tbl[id].pts;
    if(pos>4&&top-me<=6)opts.push({k:'race',t:`${top-me} point${top-me===1?'':'s'} behind the top four.`});else if(pos>=n-2)opts.push({k:'six',t:`In the bottom places: ${safe-me<=0?'level with':(safe-me)+' point'+(safe-me===1?'':'s')+' from'} safety.`})}
  if(opts.length)return opts[S.week%opts.length];
  return{k:'week',t:`Week ${w} of ${SEASON_WEEKS}${pos?`: ${ord(pos)} in ${TIER_NAME[c.tier]}`:''}.`};
}
/* what a result would do to the table (others' results unknown: an honest range) */
function matchStakes(id){
  if(S.week<4||seasonOver())return null;const t=CL(id).tier,ids=tierIds(t).filter(x=>x!==id),pts=S.tbl[id].pts,n=ids.length+1;
  const posIf=add=>1+ids.filter(x=>S.tbl[x].pts>pts+add).length,worst=add=>1+ids.filter(x=>S.tbl[x].pts>=pts+add).length;
  const win=posIf(3),lose=Math.min(n,worst(0)+ids.filter(x=>S.tbl[x].pts>=pts-2&&S.tbl[x].pts<pts).length),now=posOf(id);
  const zone=p=>t>0&&p<=2?' (promotion places)':p>=n-1&&t<4?' (relegation places)':'';
  return{now,win,lose,text:`Win: up to ${ord(win)}${zone(win)} · Lose: as low as ${ord(lose)}${zone(lose)}`};
}
/* looking back: one earlier decision, at least four weeks old, and what it has done since (measured, never invented) */
function lookingBack(id){
  const L=S.lookBack||(S.lookBack={shown:[]}),now=S.season*100+S.week,age=(s,w)=>now-(s*100+w),cand=[];L.when=L.when||{};const used=k=>L.when[k]!=null&&now-L.when[k]<6;
  for(const j of (S.journal||[]).filter(j=>j.club===id&&j.key&&j.before!=null)){const k='j'+j.s+'.'+j.w+j.cmd;if(age(j.s,j.w)<4||used(k))continue;const m=metric(j.key,id);if(!m)continue;
    cand.push({k,s:j.s,w:j.w,t:`${j.text} (season ${j.s}, week ${j.w}). ${m.label}: ${m.fmt(j.before)} then, ${m.fmt(m.v)} now.`,good:m.hi?m.v>j.before:m.v<j.before})}
  for(const r of (S.mb||[]).filter(r=>r.s!=null&&r.so==null)){const k='mb'+r.pid;if(age(r.s,r.w||0)<6||used(k))continue;const f=findPlayer(r.pid);if(!f||f.club!==id)continue;
    const lc=S.legacy&&S.legacy.clubs[id],apps=(lc&&lc.players[r.pid]?lc.players[r.pid].apps:0)+(f.p.sApps||0);
    cand.push({k,s:r.s,w:r.w||0,t:`${r.name}, signed ${r.in?`for £${r.in}k`:'on a free'} in season ${r.s}: ${apps?apps+' game'+(apps===1?'':'s'):'has not played yet'}, quality ${r1(f.p.q-r.q0)>=0?'+':''}${r1(f.p.q-r.q0)} since${r.found?' — one of your own finds':''}.`,good:apps?f.p.q>=r.q0:null})}
  for(const g of (S.scout&&S.scout.gems||[]).filter(g=>g.status==='gone'&&g.to)){const k='gem'+g.pid;if(age(g.s,g.w)<4||used(k))continue;const f=findPlayer(g.pid);
    cand.push({k,s:g.s,w:g.w,t:`${g.name}, whom you found in season ${g.s}, joined ${marketClubName(g.to)}${f?`: worth ~£${Math.round(playerValue(f.p))}k now`:''}.`,good:false})}
  for(const p of (S.pacts||[]).filter(p=>p.status!=='open'&&p.closed)){const k='pact'+p.s+'.'+p.w+p.key;if(age(p.closed[0],p.closed[1])<1||used(k))continue;cand.push({k,s:p.closed[0],w:p.closed[1],t:`${p.status==='kept'?'Kept':'Broken'}: “${p.label}” with ${p.who} (week ${p.w}). ${p.why}`,good:p.status==='kept'})}
  for(const e of (S.family&&S.family.log||[])){const k='fam'+e.s+'.'+e.w;if(age(e.s,e.w)<6||used(k))continue;cand.push({k,s:e.s,w:e.w,t:`Season ${e.s}, week ${e.w}: ${e.text}`,good:null})}
  if(!cand.length)return null;const pickC=cand.sort((a,b)=>(a.s*100+a.w)-(b.s*100+b.w))[S.week%cand.length];
  if(L.lastW!==now){L.lastW=now;L.cur=pickC.k;}const c=cand.find(x=>x.k===L.cur)||pickC;return c;
}
function lookingBackSeen(){const L=S.lookBack;if(L&&L.cur){L.when=L.when||{};L.when[L.cur]=S.season*100+S.week}}
