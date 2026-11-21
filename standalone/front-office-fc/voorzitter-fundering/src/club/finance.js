/* ================= Club foundation: money (layer 2, financiën) =================
   A weekly ledger with named lines. Amounts are in £k. Reads the ground signals (capacity, catering, shop)
   and the squad wage bill; owns prices, sponsors, the ledger and the forecast.
   Design: standalone-research/LAAG2-FINANCIEN-VOORZITTER.md. The old API (wageBill, weeklyIncome,
   financeWeek, seasonForecast, S.cf.fin) stays so the chairman layer keeps working. */
const SEASON_WEEKS=30;
const LINE={ // id -> label, group (the five headlines)
  gate:['Tickets: terraces and seats','matchday'],business:['Business seats','matchday'],catering:['Catering','matchday'],seasontix:['Season tickets','matchday'],
  sponsors:['Sponsors','commercial'],merch:['Merchandise','commercial'],events:['Events and hire','commercial'],dues:['Membership dues','commercial'],
  tv:['TV and league money','media'],
  wages:['Player wages','wages'],
  depts:['Department budgets','costs'],upkeep:['Ground upkeep','costs'],ops:['Matchday stewards and police','costs'],travel:['Away travel','costs'],
  build:['Construction','costs'],repairs:['Repairs','costs'],interest:['Interest','costs']
};
const HEAD={matchday:'Matchday',commercial:'Commercial',media:'Media',wages:'Wages',costs:'Other costs'};
const PRICE_REF={terrace:9,seated:13,business:30};
function prices(){if(!S.cf.prices)S.cf.prices={terrace:9,seated:13,business:30,season:110};return S.cf.prices}
function wageBill(){return Math.round(S.cf.squad.reduce((a,p)=>a+p.wage,0)/100)/10}
function clubPpg(){const t=S.tbl[S.cf.club];return t&&t.p?t.pts/t.p:1.3}
/* attendance for one home game: demand per type, price-sensitive, capped by the ground */
function attendance(derby){
  const c=S.clubs[S.cf.club],g=groundSignals(),pr=prices();
  const base=(c.tier===0?1150:900)*clamp(1+(clubPpg()-1.3)*.35,.6,1.6)*(derby?1.45:1)*(1+g.access*.03)*(1+g.atmosphere*.01);
  const st=S.cf.seasonHolders||0;
  const t=Math.min(g.capTerrace,Math.round(base*.62*Math.pow(PRICE_REF.terrace/pr.terrace,.6)));
  const s=Math.min(g.capSeated,Math.round(base*.38*(1+g.comfort*.02)*Math.pow(PRICE_REF.seated/pr.seated,1.2)));
  const b=Math.min(g.business,Math.round(g.business*.7*Math.pow(PRICE_REF.business/pr.business,.4)));
  const holdT=Math.min(t,Math.round(st*.62)),holdS=Math.min(s,st-holdT);
  return{terrace:t,seated:s,business:b,total:t+s+b,paying:{terrace:t-holdT,seated:s-holdS},cap:g.capacity,full:t>=g.capTerrace||s>=g.capSeated};
}
function weekLines(home,derby,real){
  const c=S.clubs[S.cf.club],g=groundSignals(),pr=prices(),L={};const r1=x=>Math.round(x*10)/10;
  if(home){const a=attendance(derby);L.gate=r1((a.paying.terrace*pr.terrace+a.paying.seated*pr.seated)/1000);L.business=r1(a.business*pr.business/1000);
    L.catering=r1(a.total*2.5*(.6+g.catering*.1)*.4/1000);L.ops=-r1(.3+a.total/6000*(derby?1.8:1));if(real)S.cf.lastGate=a}
  else L.travel=-.3;
  if(real&&(S.week||0)===1&&S.cf.seasonSold!==S.season){const hold=Math.round((c.tier===0?1500:900)*clamp(1+(clubPpg()-1.3)*.3,.6,1.4)*.28*Math.pow(110/pr.season,.8));S.cf.seasonHolders=hold;S.cf.seasonSold=S.season;L.seasontix=r1(hold*pr.season/1000)}
  L.sponsors=r1((c.tier===0?2.4:3.0)+(S.cf.sponsor||0));
  L.merch=r1((c.tier===0?1.2:.7)*(1+g.shop*.15)*clamp(1+(clubPpg()-1.3)*.4,.6,1.5));
  L.events=r1(g.shop*.08+g.community*.07);
  L.dues=.4;L.tv=c.tier===0?3:3.8;
  L.wages=-wageBill();L.depts=-deptCost();L.upkeep=-.4;
  if(real){L.build=-groundWeek(home);const rb=G().repairBill||0;if(rb){L.repairs=-rb;G().repairBill=0}}
  L.interest=-r1(c.debt*.0015);
  for(const k in L)if(!L[k])delete L[k];
  return L;
}
function sumLines(L,sign){let t=0;for(const k in L)if(sign>0?L[k]>0:L[k]<0)t+=L[k];return Math.round(t*10)/10}
/* expected income in an average home or away week (used by the chairman layer and forecasts) */
function weeklyIncome(home){return sumLines(weekLines(home,false,false),1)}
function financeWeek(home){
  const cf=S.cf,c=S.clubs[cf.club],tier=c.tier,fx=S.fx&&S.fx[tier]&&S.fx[tier][(S.week||1)-1];
  const g=fx&&fx.find(([h,a])=>h===cf.club||a===cf.club),derby=!!g&&(g[0]===cf.rivalId||g[1]===cf.rivalId);
  const L=weekLines(home,derby,true),inc=sumLines(L,1),out=sumLines(L,-1),wb=wageBill(),interest=-(L.interest||0);
  const net=Math.round((inc+out)*10)/10;c.cash=Math.round((c.cash+net)*10)/10;
  c.capacity=groundSignals().capacity;cf.fin={inc,wb,interest,net,lines:L,home,derby};cf.finHist=(cf.finHist||[]).concat([net]).slice(-30);
  cf.ledger=(cf.ledger||[]).concat([{s:S.season,w:S.week||0,L,net,cash:c.cash}]).slice(-90);
  if(c.cash<0){c.debt+=10;c.cash+=10;cfEv('finance','The bank extends the overdraft by £10k.')}
  return cf.fin;
}
/* season so far, per line and per headline */
function seasonLedger(season){const out={},head={};for(const e of (S.cf.ledger||[]).filter(x=>x.s===(season??S.season)))for(const k in e.L){out[k]=Math.round(((out[k]||0)+e.L[k])*10)/10;const h=LINE[k][1];head[h]=Math.round(((head[h]||0)+e.L[k])*10)/10}return{lines:out,head}}
/* 26-week cash forecast with a band (bad, middle, good results) */
function cashForecast(weeks=26){
  const c=S.clubs[S.cf.club],avg=(weeklyIncome(true)+weeklyIncome(false))/2,cost=wageBill()+deptCost()+.4+.3+c.debt*.0015+.3;
  const build=G().projects.filter(p=>p.phase!=='done').reduce((a,p)=>a+Math.max(0,p.cost*(1+p.over/100)-p.paid),0);
  const pts=[];let mid=c.cash;const per=Math.max(1,G().projects.filter(p=>p.phase!=='done').reduce((a,p)=>Math.max(a,p.left+(p.phase==='permit'?p.weeks:0)),1));
  for(let i=1;i<=weeks;i++){mid+=avg-cost-(i<=per?build/per:0);pts.push(Math.round(mid))}
  const low=pts.map((v,i)=>Math.round(v-(i+1)*avg*.12)),high=pts.map((v,i)=>Math.round(v+(i+1)*avg*.1));
  const minV=Math.min(...pts),minW=pts.indexOf(minV)+1;
  return{mid:pts,low,high,minV,minW};
}
function finHealth(){const c=S.clubs[S.cf.club],f=cashForecast();return c.cash<0?'in the red':f.minV<0||c.debt>250?'tight':'healthy'}
function setPrice(k,delta){const pr=prices();if(!(k in pr))return;const step=k==='season'?10:k==='business'?5:1;pr[k]=clamp(pr[k]+delta*step,k==='season'?40:k==='business'?10:3,k==='season'?400:k==='business'?120:40);cfEv('finance',`Price change: ${k==='season'?'season ticket':k} now £${pr[k]}.`)}
function seasonForecast(){const L1=weekLines(true,false,false),L0=weekLines(false,false,false);return Math.round((sumLines(L1,1)+sumLines(L1,-1)+sumLines(L0,1)+sumLines(L0,-1))/2*SEASON_WEEKS)}
