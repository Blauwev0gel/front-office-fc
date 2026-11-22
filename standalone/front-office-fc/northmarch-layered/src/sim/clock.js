/* ================= Simulation: the one clock =================
   advanceWeek() is the only way time moves. The order is fixed and documented in docs/ARCHITECTURE.md:
   1 injuries and recovery → 2 matches (league + cup) → 3 development → 4 money and building (per club)
   → 5 boards and directors (windows, renewals) → 6 week closed. closeSeason() runs once after week 30.
   Higher layers (staff, story, dynasty) hook in through S.layers and the event log, never by moving time. */
const WINTER_WEEK=15,RENEW_WEEK=24;
const HOOKS={weekClosed:[],seasonClosed:[]}; // later layers subscribe here
function onWeek(f){HOOKS.weekClosed.push(f)}
function onSeason(f){HOOKS.seasonClosed.push(f)}
function clearHooks(){HOOKS.weekClosed.length=0;HOOKS.seasonClosed.length=0}
function allIds(){return Object.keys(S.clubs)}
/* the summer transfer window: open through the pre-season (week 0), closed when the new season's first week is played.
   The director of every club signs, sells and loans in one go; the chairman's strategy and frame are what count by then. */
function summerWindow(){
  const ids=allIds();
  if(S.my){for(let k=0;k<4;k++)scoutWeek(S.my,k*3+1);buildPlan(S.my)} /* the pre-season weeks of scouting before the window closes */
  const order=shuffle(ids.slice()).sort((a,b)=>F(b).cash-F(a).cash);
  for(const pass of [0,1])for(const id of order)squadManager(id,'summer');
  if(S.my)buildPlan(S.my);
  for(const id of order)loanOut(id);
  youthReconcile();
  for(const t of TIERS)tierIds(t).slice().sort((x,y)=>teamStrength(y)-teamStrength(x)).forEach((id,i)=>CL(id).expect=i+1);
  setGoalsAll();
}
function advanceWeek(){
  if(S.phase!=='season'||S.week>=SEASON_WEEKS)return null;
  if(S.week===0)summerWindow();
  S.week++;const w=S.week,ids=allIds();
  const mark=S.evn||0;
  const matches=playWeekMatches(w);
  for(const id of ids)playersWeek(id);
  for(const id of ids)lifeWeek(id);
  for(const id of ids)financeWeek(id,matches.filter(m=>m.h===id||m.a===id));
  recordsWeek(matches);
  for(const id of ids)membersWeek(id,matches.filter(m=>m.h===id||m.a===id));
  for(const id of ids){if(aiRuns(id)){aiBoardWeek(id);aiStaffWeek(id);aiStadium(id)}}
  if(S.my){scoutWeek(S.my);if(w===WINTER_WEEK-1||w===RENEW_WEEK)buildPlan(S.my)} // the player's club: scouting every week, the plan before the winter window and after renewals
  if(w===WINTER_WEEK){for(const id of shuffle(ids.slice()))squadManager(id,'winter');youthReconcile()}
  if(w===RENEW_WEEK)for(const id of ids)renewals(id);
  membersOnEvents(eventsSince(mark));
  emit('WeekClosed',null,`Week ${w} played.`);
  for(const f of HOOKS.weekClosed)f(w);
  return eventsSince(mark);
}
function seasonOver(){return S.phase!=='season'||S.week>=SEASON_WEEKS}
function closeSeason(){
  if(S.phase!=='season'||S.week<SEASON_WEEKS)return null;
  const ids=allIds(),s=S.season,tables={};
  // the AGM comes first: targets, promotion and relegation are judged on the final table
  const outIds=holdAGMs(),agm=S.my?{...M(S.my).agm,club:S.my}:null;afterAGMs(outIds);
  for(const t of TIERS){tables[t]=standings(t);tables[t].forEach((id,i)=>{financeSeasonEnd(id,i+1,t);CL(id).hist.push({s,tier:t,pos:i+1,pts:S.tbl[id].pts,top:topScorer(id),cup:cupReached(id),you:id===S.my})})}
  // support grows with success, promotion and the clubhouse; shrinks with failure
  for(const id of ids){const c=CL(id),pos=posOf(id),exp=c.expect||8,sg=groundSignals(id);
    c.support=Math.round(clamp(c.support*(1+.025*(exp-pos)/8+.004*sg.community),250,9000))}
  repSeasonEnd();
  const moves=promoteRelegate();
  for(const m of moves){const c=CL(m.id);c.support=Math.round(c.support*(m.to<m.from?1.08:.93))}
  S.hist.push({s,tables,cup:S.cup.winner,moves:moves.map(m=>({...m})),agm,chairsOut:outIds.filter(i=>i!==S.my)});
  for(const id of ids){const st=S.stats[id];st.prev={inj:st.inj,injWeeks:st.injWeeks,youthGrowth:st.youthGrowth};st.inj=0;st.injWeeks=0;st.youthGrowth=0}
  commercialSeasonEnd();
  returnLoans();
  for(const id of ids)playersSeasonEnd(id);
  S.qref=r2(S.qref*.7+worldQuality()*.3);
  faSummer();
  setBudgetsAll(s+1);
  for(const id of ids)groundSeasonEnd(id);
  staffSeasonEnd();
  emit('SeasonClosed',null,`Season ${s} is over.`,{season:s});
  for(const f of HOOKS.seasonClosed)f(s);
  S.season++;startSeason();S.phase='season';
  if(S.votedOut){S.my=null;S.seats=seatsAfterOut();S.phase='choose'}
  return S.hist[S.hist.length-1];
}
/* run the world without a human: the test harness and the 'simulate' tool */
/* one full season; a chairman who was voted out takes the first open chair (test harness and simulations) */
function playSeason(){if(S.phase==='choose')chooseClub(S.seats[0]);while(!seasonOver())advanceWeek();return closeSeason()}
function simulateSeasons(n){for(let i=0;i<n;i++)playSeason()}
