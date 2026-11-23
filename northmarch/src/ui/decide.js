/* ---- ui/decide.js ---- */
/* ================= Screens: the decision block =================
   One consistent block for every board decision: what it costs now, what it costs each week, when it takes effect,
   what it can bring, the risk, and where to check it later. Only numbers the simulation really uses are shown;
   where the outcome is uncertain the block says so instead of predicting. */
function impact(o){
  const rows=[['Now',o.now],['Each week',o.week],['Takes effect',o.when],['Can bring',o.gain],['Risk',o.risk],['Check it',o.check]].filter(r=>r[1]);
  return`<dl class="impact">${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
}
const wk=v=>`£${n0(v*1000)} a week`,once=v=>`£${n0(v*1000)}`;
function deptStaffImpact(id,k){
  const d=G(id).depts[k];if(d.hiring||d.staff>=5)return'';const nx=d.staff+1,fee=deptWeekCost(id,k,nx)*2,dw=deptWeekCost(id,k,nx)-deptWeekCost(id,k);
  return`<p class="small"><b>Next step: staff level ${nx} (${STAFF_WORD[nx].toLowerCase()})</b></p>${impact({now:once(fee)+' recruitment fee',week:'+'+wk(dw),when:`after ${HIRE_WEEKS} weeks of recruiting`,gain:`A stronger ${DEPT[k].n.toLowerCase()} department: ${esc(DEPT[k].does.split('. ').slice(1).join('. ')||DEPT[k].does)}`,risk:'Cost is certain; the gain shows over weeks, not at once',check:'The measure at the top of this page, and Your decisions on the club overview'})}`;
}
function deptBudgetImpact(id,k){const d=G(id).depts[k];return`<p class="note">Budget changes work at once. ${d.budget==='normal'?`Generous: +${wk(deptWeekCost(id,k,null,'generous')-deptWeekCost(id,k))}; tight saves ${wk(deptWeekCost(id,k)-deptWeekCost(id,k,null,'tight'))}.`:'Back to normal changes the weekly cost straight away.'}</p>`}
function deptCourseImpact(){return`<p class="note">A new way of working costs nothing but takes a full season (30 weeks) to settle; until then neither way gets the bonus.</p>`}
function loanImpact(id,amount,years){const r=loanRate(id,amount),l=mkLoan(amount,years,r,''),tot=l.pay*l.weeks-amount;return`${wk(l.pay)} for ${years} seasons · about £${n0(tot)}k interest`}
function sponsorValue(o){if(o.kind==='bonus'){const lo=o.perWeek*SEASON_WEEKS+o.perPoint*30,hi=o.perWeek*SEASON_WEEKS+o.perPoint*60;return`£${n0(lo)}k–£${n0(hi)}k a season (30–60 points)`}return`£${n0(o.perWeek*SEASON_WEEKS)}k a season, £${n0(o.perWeek*SEASON_WEEKS*o.years)}k over ${o.years} season${o.years>1?'s':''}`}
function priceImpact(id){
  const pi=priceIndex(id),a=attendance(id,null,{}),pr=F(id).prices;
  const conf=pi>1.2?`<b class="down">Members lose confidence every week at these prices</b> (${Math.round(pi*100)}% of the usual).`:pi<.9?'Members like cheap tickets: a little confidence each week.':`Prices are ${Math.round(pi*100)}% of the usual: members accept them.`;
  return impact({now:`Expected crowd ${n0(a.total)} of ${n0(a.cap)}`,week:`About £${n0((a.terrace*pr.terrace+a.seated*pr.seated)/1000)}k gate per home game`,when:'From the next home game; season tickets are sold in week 1',risk:conf,check:'Last home crowd in Money and in Your decisions'});
}
function duesImpact(id){
  const m=M(id),c=C(),ref=DUES_REF[c.tier],target=Math.round(c.support*.4*(1+groundSignals(id).community*.05)*Math.pow(ref/m.dues,.5));
  return impact({now:`${n0(m.count)} members paying £${m.dues} a year`,week:`About £${n0(m.count*m.dues/SEASON_WEEKS)} in dues`,when:`Membership moves towards about ${n0(target)} over the coming weeks`,risk:m.dues>ref*1.3?'<b class="down">Dues this high cost confidence every week</b>':'Higher dues: more money per member, fewer members',check:'Members, here and in Your decisions'});
}
function wageImpact(id){const room=(wageCapK(id)-wageBillK(id))*1000;return impact({now:room>=0?`Room for about £${n0(room)} a week of new wages`:`<b class="down">£${n0(-room)} a week over the limit</b>: the director will sell or release`,when:`In the next window (summer, week ${WINTER_WEEK}) and at renewals (week ${RENEW_WEEK})`,gain:'More room buys better players and keeps the good ones',risk:'Wages are paid every week, whatever the results',check:'Wage bill and squad strength in Your decisions'})}
function stadiumImpact(id,pl){const sg=groundSignals(id),a=attendance(id,null,{}),f=F(id),pr=f.prices;const extra=Math.max(0,pl.cap-sg.capacity);
  return impact({now:once(pl.deposit)+' deposit',week:`About ${wk((pl.cost-pl.deposit)/pl.weeks)} while it is built`,when:`Permit 8–16 weeks, then ${pl.weeks} weeks of building (about ${Math.ceil((pl.weeks+12)/SEASON_WEEKS)} seasons)`,
    gain:`${n0(extra)} more places. Today ${a.full?'the ground is full: demand is there':`${Math.round(a.fill*100)}% of places are taken: crowds grow only with support`}`,risk:'Overruns and delays happen; the money goes out every week. Borrow first.',check:'Capacity and gate in Your decisions and the club history'})}

