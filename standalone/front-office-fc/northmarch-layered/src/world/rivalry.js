/* Club evolution: emergent rivalries and youth-development reputation.
   Clubs react to games, results and the playing time of their own graduates.
   Identities are calculated, never scripted or arbitrarily assigned. */
function rivalryPair(a,b){
  const c=CL(a);c.rivalries=c.rivalries||{};
  return c.rivalries[b]||(c.rivalries[b]={heat:0,meetings:0,wins:0,lastSeason:0});
}
function rivalryWeek(matches){
  for(const m of matches){
    if(!S.clubs[m.h]||!S.clubs[m.a])continue;
    const a=CL(m.h),b=CL(m.a),cup=m.comp==='cup';
    const derby=a.town===b.town,traditional=a.rival===b.id||b.rival===a.id;
    const close=Math.abs(m.gh-m.ga)<=1;
    const sameTier=a.tier===b.tier;
    const stakes=cup?2:(sameTier&&((posOf(a.id)<=4&&posOf(b.id)<=4)||(posOf(a.id)>=13&&posOf(b.id)>=13)))?2:0;
    const extra=(derby?2:0)+(traditional?1:0)+(close?1:0)+stakes;
    for(const [self,other,won] of [[a,b,m.gh>m.ga],[b,a,m.ga>m.gh]]){
      const r=rivalryPair(self.id,other.id);
      r.heat=Math.min(100,r.heat+1+extra+(won?1:0));
      r.meetings++;if(won)r.wins++;r.lastSeason=S.season;
    }
  }
}
function rivalrySeasonEnd(){
  for(const id of Object.keys(S.clubs)){
    const c=CL(id),all=c.rivalries||{};
    for(const [opp,r] of Object.entries(all)){
      r.heat=Math.round(r.heat*.83*10)/10;
      if(r.heat<1&&r.lastSeason<S.season-3)delete all[opp];
    }
    const strongest=Object.entries(all).filter(([opp])=>!!S.clubs[opp])
      .sort((a,b)=>b[1].heat-a[1].heat)[0];
    if(!strongest)continue;
    const current=all[c.rival]?.heat||0;
    if(strongest[0]!==c.rival&&strongest[1].heat>Math.max(18,current+10)){
      const old=c.rival;c.rival=strongest[0];
      c.rivalWhy=`${strongest[1].meetings} fiercely contested fixtures`;
      emit('Rivalry',id,`${c.name}'s rivalry with ${CL(c.rival).name} has overtaken their historic contest with ${S.clubs[old]?.name||'their old rivals'}.`,{c2:c.rival});
    }
  }
}
function clubCultureSeasonEnd(){
  for(const id of Object.keys(S.clubs)){
    const c=CL(id),sq=S.squads[id],total=sq.reduce((n,p)=>n+(p.sApps||0),0);
    const own=sq.filter(p=>p.academy&&(p.originClub||p.club)===id);
    const minutes=own.reduce((n,p)=>n+(p.sApps||0),0);
    const share=total?minutes/total:0;
    const target=Math.round(clamp(25+share*160+groundSignals(id).academy*3,10,95));
    c.devCulture=Math.round((c.devCulture??45)*.7+target*.3);
    const oldIdentity=c.identity||'Community club';
    const recent=c.hist.slice(-5),best=c.heritage?.bestTier??c.tier;
    const fell=best<=1&&c.tier>=best+2;
    const rising=recent.some(h=>h.tier>c.tier)&&c.heritage?.promotions>=1;
    c.identity=fell?(c.heritage?.titles?'Former champion':'Fallen club'):
      c.devCulture>=64?'Youth developer':
      rising?'Rising club':
      c.rep>=75?'Established name':'Community club';
    if(c.identity!==oldIdentity){
      c.identitySince=S.season;
      emit('ClubIdentity',id,`${c.name} are now regarded as ${c.identity.toLowerCase()}, following their results and development.`,{from:oldIdentity,to:c.identity});
    }
  }
}
