/* L1/L2 only: one useful weekly briefing from real game data.
   Read-only UI projection; no autonomous staff, invented stories or new state. */
function chairmanFocus(){
  const id=S.my,urgent=signals(id)[0];
  if(urgent&&urgent.lv>=2)return{tag:'Needs attention',text:urgent.text,act:urgent.act,arg:urgent.arg,cta:'Review this'};
  if(S.week===0)return{tag:'Before kickoff',text:'Set your club’s spending and recruitment direction before the summer window closes.',act:'hubmoney',arg:'budget',cta:'Review the budget'};
  if(S.week===WINTER_WEEK-1)return{tag:'Next week',text:'The winter transfer window is next. Check the squad plan and limits before your director acts.',act:'ctab',arg:'football',cta:'Review the squad plan'};
  if(S.week>=SEASON_WEEKS)return{tag:'Season complete',text:'The season is over. Review the final table and the club’s annual results.',act:'tab',arg:'table',cta:'See the league table'};
  if(urgent)return{tag:'Worth reviewing',text:urgent.text,act:urgent.act,arg:urgent.arg,cta:'Take a look'};
  const target=M(id).goals.find(g=>g.k==='league');
  if(target&&!goalProgress(id,target).met)return{tag:'Your season target',text:target.text+'. Currently '+goalProgress(id,target).text+'.',act:'tab',arg:'table',cta:'View the table'};
  const need=S.ops&&openNeeds()[0];
  if(need)return{tag:'Squad planning',text:need.why+'. The director will use the budget and the current plan.',act:'ctab',arg:'football',cta:'See recruitment'};
  return{tag:'Your next move',text:'Review the club’s finances and priorities, or play the next week. No decision is mandatory.',act:'ctab',arg:'hub',cta:'Review your club'};
}
function chairmanBriefingData(){
  const id=S.my,focus=chairmanFocus(),f=F(id),m=M(id),latest=(S.journal||[]).filter(j=>j.club===id).slice(-1)[0]||null;
  const last=(S.week&&f.last&&Number.isFinite(f.last.net))?f.last.net:null;
  const match=S.week?myMatches()[0]:null;
  const score=match?{opponent:marketClubName(match.h===id?match.a:match.h),
    ours:match.h===id?match.gh:match.ga,theirs:match.h===id?match.ga:match.gh,
    competition:match.comp==='cup'?'Cup':'League'}:null;
  const safe=['cash','debt','wagebill','strength','members','conf'];
  const measured=latest&&safe.includes(latest.key)?metric(latest.key,id):null;
  const decision=latest?{text:latest.text,metric:measured&&Number.isFinite(latest.before)&&Number.isFinite(measured.v)?
    {label:measured.label,before:measured.fmt(latest.before),now:measured.fmt(measured.v)}:null}:null;
  return{focus,season:S.season,week:S.week,cash:f.cash,weeklyNet:last,confidence:m.conf,
    strength:Math.round(teamStrength(id)),position:S.week?posOf(id):null,decision,match:score};
}
function chairmanBriefingView(){
  if(!S||!S.my)return'';
  const b=chairmanBriefingData(),f=b.focus,metricBox=(name,value)=>`<div class="brief-stat"><span class="small muted">${esc(name)}</span><b>${esc(value)}</b></div>`;
  const direction=b.weeklyNet==null?'Not played yet':(b.weeklyNet<0?'−':'+')+k1(Math.abs(b.weeklyNet));
  const score=b.position?ord(b.position)+' in '+TIER_NAME[C().tier]:'Pre-season';
  return`<section class="panel chairman-brief" aria-label="Chairman's weekly briefing">
  <div class="row"><p class="eyebrow">Chairman's briefing · season ${b.season}, ${b.week?'week '+b.week:'pre-season'}</p><span class="pill">L1/L2</span></div>
  ${b.match?`<div class="brief-match"><span class="eyebrow">${esc(b.match.competition)} result</span><b>${b.match.ours}–${b.match.theirs} <span class="small muted">against ${esc(b.match.opponent)}</span></b></div>`:''}
  <div class="brief-stats">${metricBox('League',score)}${metricBox('Cash',k1(b.cash))}${metricBox('Last week net',direction)}</div>
  <div class="brief-focus"><p class="eyebrow">${esc(f.tag)}</p><p class="small">${esc(f.text)}</p>
  <button class="btn ghost" data-act="${esc(f.act)}" data-arg="${esc(f.arg||'')}">${esc(f.cta)}</button></div>
  ${b.decision?`<p class="small muted brief-decision"><b>Last decision:</b> ${esc(b.decision.text)}${b.decision.metric?` · ${esc(b.decision.metric.label)}: ${esc(b.decision.metric.before)} → ${esc(b.decision.metric.now)}`:''} <span class="muted">(Observed change, not proof of cause.)</span></p>`:''}
  </section>`;
}
