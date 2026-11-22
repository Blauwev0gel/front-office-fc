/* World records, season awards and press wire.
   All highlights are calculated from the live simulation; no random news events.
   News remains in a bounded archive, independent of the short technical event bus. */
const WORLD_LOG_TYPES=['CupWon','Promoted','Relegated','InternationalTransfer','StaffPoached','Administration','EuropeanMatch','SeasonAward','Rivalry','ForcedSale','PlayerLeft','Retired','YouthIntake'];
function worldNewsRecord(e){
  if(!WORLD_LOG_TYPES.includes(e.t))return;
  S.worldLog=S.worldLog||[];
  const priority={CupWon:5,Promoted:5,Relegated:5,SeasonAward:5,Administration:5,Rivalry:4,EuropeanMatch:3,
    InternationalTransfer:3,StaffPoached:3,ForcedSale:4,Retired:2,PlayerLeft:1,YouthIntake:1}[e.t]||1;
  S.worldLog.push({s:e.s,w:e.w,t:e.t,c:e.c,text:e.text,priority,pid:e.pid||null,fee:e.fee||0});
  if(S.worldLog.length>1400){
    // Retain a broad multi-season snapshot rather than allowing one busy summer to erase history.
    const years=[...new Set(S.worldLog.map(x=>x.s))].sort((a,b)=>a-b);
    const oldest=years[0];
    const old=S.worldLog.filter(x=>x.s===oldest),keep=old.sort((a,b)=>b.priority-a.priority).slice(0,40);
    if(old.length>40)S.worldLog=S.worldLog.filter(x=>x.s!==oldest).concat(keep).sort((a,b)=>a.s-b.s||a.w-b.w);
    if(S.worldLog.length>1400)S.worldLog.splice(0,S.worldLog.length-1400);
  }
}
function worldSeasonAwards(){
  S.worldAwards=S.worldAwards||[];
  const players=Object.entries(S.squads).flatMap(([club,sq])=>sq.filter(p=>!p.loan||p.loan.from===club).map(p=>({p,club})));
  if(!players.length)return null;
  const scored=players.slice().sort((a,b)=>playerSeasonGoals(b.p)-playerSeasonGoals(a.p)||b.p.sApps-a.p.sApps||b.p.q-a.p.q);
  const eligible=players.filter(x=>x.p.age<=23&&x.p.sApps>=10);
  const breakthrough=eligible.slice().sort((a,b)=>b.p.grown-a.p.grown||b.p.sApps-a.p.sApps)[0]||null;
  const year={
    season:S.season,
    champions:TIERS.map(t=>({tier:t,club:standings(t)[0]})),
    cup:S.cup.winner,
    topScorer:scored.length?{id:scored[0].p.id,name:scored[0].p.name,club:scored[0].club,goals:playerSeasonGoals(scored[0].p),apps:scored[0].p.sApps}:null,
    breakthrough:breakthrough?{id:breakthrough.p.id,name:breakthrough.p.name,club:breakthrough.club,age:breakthrough.p.age,delta:r2(breakthrough.p.grown)}:null,
    europe:S.foreign?.europe?.seasons?.slice(-1)[0]?.winner||null
  };
  if(year.topScorer)emit('SeasonAward',year.topScorer.club,
    `${year.topScorer.name} wins the Northmarch Golden Boot with ${year.topScorer.goals} goals.`,{pid:year.topScorer.id,award:'golden-boot'});
  if(year.breakthrough&&year.breakthrough.delta>0)emit('SeasonAward',year.breakthrough.club,
    `${year.breakthrough.name} is the season's breakthrough player (+${year.breakthrough.delta} development).`,{pid:year.breakthrough.id,award:'breakthrough'});
  S.worldAwards.push(year);
  if(S.worldAwards.length>40)S.worldAwards.shift();
  return year;
}
function worldLatestNews(limit=8){
  return(S.worldLog||[]).filter(x=>x.priority>=2)
    .slice().sort((a,b)=>b.s-a.s||b.w-a.w||b.priority-a.priority).slice(0,limit);
}

/* Where the football pyramid is heading: derived directly from seasons played. */
function worldTrends(){
  const clubs=Object.values(S.clubs).filter(c=>c.hist.length>=2).map(c=>{
    const first=c.hist[Math.max(0,c.hist.length-5)],last=c.hist[c.hist.length-1],oldTier=first.tier,newTier=c.tier;
    return{id:c.id,name:c.name,from:oldTier,to:newTier,delta:oldTier-newTier,
      rep:c.rep,culture:c.devCulture??45,identity:c.identity||'Community club',
      period:S.season-first.s,position:last.pos};
  });
  const rise=clubs.filter(c=>c.delta>0).sort((a,b)=>b.delta-a.delta||b.rep-a.rep).slice(0,5);
  const fall=clubs.filter(c=>c.delta<0).sort((a,b)=>a.delta-b.delta||a.rep-b.rep).slice(0,5);
  const academies=clubs.filter(c=>c.culture>=55).sort((a,b)=>b.culture-a.culture).slice(0,5);
  const young=Object.entries(S.squads).flatMap(([club,sq])=>sq.filter(p=>p.age<=23&&p.sApps>=5&&p.grown>.08)
    .map(p=>({id:p.id,club,name:p.name,age:p.age,growth:r2(p.grown),apps:p.sApps})))
    .sort((a,b)=>b.growth-a.growth||b.apps-a.apps).slice(0,6);
  return{rise,fall,academies,young};
}
