/* ================= Dynasty: what lasts after a season, a player or a chairman =================
   Owns S.legacy (the player's career): per club the players who wore the shirt (apps, goals, academy, first and last season)
   and the chairman's era season by season (finish, promises kept, trophies); plus the promises record across the career.
   Recorded once a season, after the AGM and before players age (closeSeason). Records stay after a player leaves or retires
   and after the chairman moves on. Reputation (S.rep) now also follows promises kept. No DOM; old saves start empty. */
function LEG(){if(!S.legacy)S.legacy={clubs:{},kept:0,made:0};return S.legacy}
function legacyClub(id){const L=LEG();if(!L.clubs[id])L.clubs[id]={players:{},era:[]};return L.clubs[id]}
function legacySeasonEnd(){
  const id=S.my;if(!id||!S.clubs[id])return;const L=LEG(),lc=legacyClub(id),pos=posOf(id),c=CL(id);
  for(const p of S.squads[id]){const apps=(p.sApps||0)+(p.cupApps||0);if(!apps&&!p.sGoals)continue;
    const r=lc.players[p.id]||(lc.players[p.id]={name:p.name,pos:p.pos,apps:0,goals:0,first:S.season,last:S.season,academy:!!(S.youth&&S.youth.grads&&S.youth.grads[p.id])||(p.career&&p.career[0]==='Academy'&&!p.history?.some(h=>h.club!==id))});
    r.apps+=apps;r.goals+=(p.sGoals||0)+(p.cupGoals||0);r.last=S.season;r.name=p.name}
  const goals=(M(id).goals||[]).map(g=>goalProgress(id,g)),met=goals.filter(x=>x.met).length,bold=(M(id).goals||[]).filter(g=>g.lv===2).length;
  const promoted=c.tier>0&&pos<=2,champs=pos===1,cup=S.cup.winner===id;
  lc.era.push({s:S.season,tier:c.tier,pos,relegated:c.tier<4&&pos>=15,pts:S.tbl[id].pts,met,total:goals.length,bold,champs,promoted,cup,conf:Math.round(M(id).conf)});
  L.kept+=met;L.made+=goals.length;
  /* reputation: keeping your word and winning things travel with you to the next club */
  S.rep=r1(clamp((S.rep||0)+(met>=2?.5:met===0?-.5:0)+(champs||cup?1:promoted?.5:0),-5,10));
}
function legends(id,n=6){const lc=S.legacy&&S.legacy.clubs[id];if(!lc)return[];return Object.entries(lc.players).map(([pid,r])=>({pid,...r})).sort((a,b)=>b.apps-a.apps||b.goals-a.goals).slice(0,n)}
function repWord(){const r=S.rep||0;return r>=6?'A name across the Northmarch':r>=3?'Respected':r>=0?'Unproven':'Known for broken promises'}
