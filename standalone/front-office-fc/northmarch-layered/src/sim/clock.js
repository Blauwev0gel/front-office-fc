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
function advanceWeek(){
  if(S.phase!=='season'||S.week>=SEASON_WEEKS)return null;
  S.week++;const w=S.week,ids=allIds();
  const mark=S.evn||0;
  const matches=playWeekMatches(w);
  for(const id of ids)playersWeek(id);
  for(const id of ids)financeWeek(id,matches.filter(m=>m.h===id||m.a===id));
  for(const id of ids){if(aiRuns(id))aiBoardWeek(id)}
  if(w===WINTER_WEEK)for(const id of shuffle(ids.slice()))squadManager(id,'winter');
  if(w===RENEW_WEEK)for(const id of ids)renewals(id);
  emit('WeekClosed',null,`Week ${w} played.`);
  for(const f of HOOKS.weekClosed)f(w);
  return eventsSince(mark);
}
function seasonOver(){return S.week>=SEASON_WEEKS}
function closeSeason(){
  if(!seasonOver())return null;
  const ids=allIds(),s=S.season,tables={};
  for(const t of TIERS){tables[t]=standings(t);tables[t].forEach((id,i)=>{financeSeasonEnd(id,i+1,t);CL(id).hist.push({s,tier:t,pos:i+1,pts:S.tbl[id].pts})})}
  // support grows with success, promotion and the clubhouse; shrinks with failure
  for(const id of ids){const c=CL(id),pos=posOf(id),exp=c.expect||8,sg=groundSignals(id);
    c.support=Math.round(clamp(c.support*(1+.025*(exp-pos)/8+.004*sg.community),250,9000))}
  const moves=promoteRelegate();
  for(const m of moves){const c=CL(m.id);c.support=Math.round(c.support*(m.to<m.from?1.08:.93))}
  S.hist.push({s,tables,cup:S.cup.winner,moves:moves.map(m=>({...m}))});
  for(const id of ids){const st=S.stats[id];st.prev={inj:st.inj,injWeeks:st.injWeeks,youthGrowth:st.youthGrowth};st.inj=0;st.injWeeks=0;st.youthGrowth=0}
  for(const id of ids)playersSeasonEnd(id);
  S.qref=r2(S.qref*.7+worldQuality()*.3);
  faSummer();
  const order=shuffle(ids.slice()).sort((a,b)=>F(b).cash-F(a).cash);
  for(const pass of [0,1])for(const id of order)squadManager(id,'summer');
  for(const id of ids)groundSeasonEnd(id);
  emit('SeasonClosed',null,`Season ${s} is over.`,{season:s});
  for(const f of HOOKS.seasonClosed)f(s);
  S.season++;startSeason();S.phase='season';
  return S.hist[S.hist.length-1];
}
/* run the world without a human: the test harness and the 'simulate' tool */
function simulateSeasons(n){for(let i=0;i<n;i++){while(!seasonOver())advanceWeek();closeSeason()}}
