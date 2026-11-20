/* ================= The chairman and the transfer summer =================
   The director draws up the priorities from depth, weakness and departures; the staff discuss them in the
   summer meeting, where the chairman's real lever is the mandate (money, wage cap, identity, red lines).
   After that the director works alone: the summer plays out as one running ticker, then a report. */
function sumAsk(){const s=S.cf.sum;return s?s.prios.reduce((a,x)=>a+(x.targets[0]&&x.targets[0].kind==='buy'?x.targets[0].price:0),0):0}
function startSummer(){tdPlanRefresh();for(let i=0;i<SUM_WEEKS;i++)tdSumWeek();tdSumDeadline();S.cf.sum.step='live';S.screen='tsum'}
function summerNext(){
  const s=S.cf.sum;
  if(s.step==='live'){s.step='report';s.analysis=sumAnalysis();log('The summer window closes',`${s.balance.prios.filter(x=>x.res!=='fail').length} of ${s.balance.prios.length} priorities done`,null);return}
  if(s.step==='report'){s.step='done';startSeasonPlay()}
}
