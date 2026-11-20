/* ================= The chairman and the transfer summer =================
   The director draws up the plan and presents it in the summer meeting; the chairman's lever is the mandate.
   Then: the brief he signs -> six weeks in the transfer centre -> the summer edition -> the debrief (a strike when it
   went wrong and it was not the market). No negotiation, no calls: the chairman watches, reads and judges. */
function sumAsk(){const s=S.cf.sum;return s?s.prios.reduce((a,x)=>a+(x.targets[0]&&x.targets[0].kind==='buy'?x.targets[0].price:0),0):0}
function startSummer(){tdPlanRefresh();S.cf.sum.step='brief';S.screen='tsum'}
function summerNext(){
  const s=S.cf.sum;
  if(s.step==='brief'){for(let i=0;i<SUM_WEEKS;i++)tdSumWeek();tdSumDeadline();s.step='live';return}
  if(s.step==='live'){s.analysis=sumAnalysis();s.verdict=sumVerdict(true);s.step='edition';log(`The summer edition gives ${P(S.cf.tdId).name}'s summer a ${s.verdict.grade}`,`${s.verdict.met} of ${s.verdict.kpis.length} points of the brief met`,null);return}
  if(s.step==='edition'){s.step='debrief';if(s.verdict.strike)loy(S.cf.tdId,'against','A strike after a bad summer',{raw:-1});return}
  if(s.step==='debrief'){s.step='done';startSeasonPlay()}
}
