/* ================= Club foundation: money =================
   A simple weekly model. Amounts are in £k. The chairman sees money as numbers: an owner knows his cash. */
function wageBill(){return Math.round(S.cf.squad.reduce((a,p)=>a+p.wage,0)/100)/10}
function weeklyIncome(home){const c=S.clubs[S.cf.club],t=S.tbl[S.cf.club],ppg=t&&t.p?t.pts/t.p:1.3;
  return Math.round(((c.tier===0?11:9)+(home?4.5:0)+(ppg-1.3)*2.5+(S.cf.sponsor||0))*10)/10}
function financeWeek(home){
  const c=S.clubs[S.cf.club],inc=weeklyIncome(home),wb=wageBill(),interest=Math.round(c.debt*.0015*10)/10;
  const net=Math.round((inc-wb-interest)*10)/10;c.cash=Math.round((c.cash+net)*10)/10;
  S.cf.fin={inc,wb,interest,net};S.cf.finHist=(S.cf.finHist||[]).concat([net]).slice(-30);
  if(c.cash<0){c.debt+=10;c.cash+=10;cfEv('finance','The bank extends the overdraft by £10k.')}
  return S.cf.fin;
}
function seasonForecast(){const wb=wageBill();const inc=weeklyIncome(false)+2.25;return Math.round((inc-wb)*30)}
