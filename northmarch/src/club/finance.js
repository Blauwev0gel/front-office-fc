/* ---- club/finance.js ---- */
/* ================= Club: money =================
   From voorzitter-fundering club/finance.js (weekly ledger with named lines, price elasticity, attendance,
   season tickets, forecast). Adapted to every club (S.fin[id]) and extended with prize money, cup gates,
   transfer fees, loans, an overdraft and administration. book() is the ONLY function that changes cash, so the
   ledger always reconciles: cash = start + every booked line. Amounts in £k. */
const LINE={
  gate:['Tickets: terraces and seats','matchday'],business:['Business seats','matchday'],catering:['Catering','matchday'],seasontix:['Season tickets','matchday'],cupgate:['Cup gate','matchday'],
  sponsors:['Main sponsor','commercial'],partners:['Local partners','commercial'],naming:['Stadium naming rights','commercial'],fundraising:['Members\' appeals','commercial'],merch:['Merchandise','commercial'],events:['Events and hire','commercial'],dues:['Membership dues','commercial'],
  tv:['League and TV money','media'],prize:['League prize money','media'],cupprize:['Cup prize money','media'],europe:['European competition income','media'],
  feesIn:['Transfer fees received','transfers'],feesOut:['Transfer fees paid','transfers'],
  wages:['Player wages','wages'],
  depts:['Department budgets','costs'],upkeep:['Ground upkeep','costs'],ops:['Matchday stewards and police','costs'],travel:['Away travel','costs'],
  staff:['Head coach and director','wages'],staffpay:['Staff compensation','costs'],
  build:['Construction','costs'],repairs:['Repairs','costs'],interest:['Interest','costs'],
  rent:['Ground rent','costs'],
  loanIn:['Loans and bonds drawn','financing'],loanOut:['Loan and bond repayments','financing'],groundSale:['Sale or buy-back of the ground','capital']
};
const HEAD={matchday:'Matchday',commercial:'Commercial',media:'League & cup',transfers:'Transfers',wages:'Wages',costs:'Other costs',financing:'Loans',capital:'The ground'};
const PRICE_DEF=[{terrace:11,seated:16,business:35,season:140},{terrace:9,seated:13,business:30,season:110},{terrace:7,seated:10,business:22,season:85},{terrace:6,seated:9,business:18,season:65},{terrace:5,seated:8,business:15,season:50}];
const TV=[4.6,2.2,.8,.35,.15],SPONSOR=[3.4,1.9,.9,.45,.25],PRIZE=[[80,4],[40,2],[15,.6],[8,.3],[4,.15]];
const WAGE_RATIO={tight:.65,normal:.76,ambitious:.88,allin:.98};
/* club courses: a simple way to set the direction. Each bundles the existing policy settings (nothing new is simulated). */
const COURSE={
  balanced:{n:'Balanced',d:'A steady club: normal wages, some transfer money, the best player the money buys.',wage:'normal',spend:.5,loans:true,recruit:'balanced',fx:'Middle of the road on cost and results.'},
  youth:{n:'Youth first',d:'Grow your own: young signings, academy players get games, reserves go out on loan.',wage:'normal',spend:.4,loans:true,recruit:'youth',fx:'Younger signings and more games for academy players. In the short run the squad is no stronger.'},
  win:{n:'Win now',d:'Spend to win: high wages, big transfer money, proven players, nobody sent out on loan.',wage:'ambitious',spend:.8,loans:false,recruit:'experience',fx:'A stronger squad and more points, at the price of a bigger wage bill and less cash in the bank.'},
  frugal:{n:'Sustainable',d:'Live within the means: tight wages, little transfer money, bargains and free agents.',wage:'tight',spend:.3,loans:true,recruit:'value',fx:'A healthier bank balance, but a weaker squad and fewer points.'}};

function F(id){return S.fin[id]}
function finInit(id){
  const c=CL(id),t=c.tier,cash=[ri(90,260),ri(30,140),ri(10,60),ri(5,35),ri(2,20)][t],debt=pick([0,0,0,1,2,3])*[90,50,25,12,6][t];
  const v=chairValue(id);
  const f={cash:0,start:0,loans:[],prices:{...PRICE_DEF[t]},season:{},last:null,hist:[],od:0,admin:null,holders:0,sold:0,lastGate:null,
    policy:{wage:v==='glory'?'ambitious':v==='money'?'tight':'normal',spend:v==='glory'?.7:v==='money'?.3:.5,loans:true,recruit:v==='money'?'value':v==='glory'?'experience':v==='community'?'youth':'balanced'}};
  S.fin[id]=f;f.cash=cash;f.start=cash;
  if(debt){f.loans.push(mkLoan(debt,10,.05,'Old club debt'))}
  return f;
}
function book(id,line,amt){
  amt=r2(amt);if(!amt)return;const f=F(id);
  f.cash=r2(f.cash+amt);f.season[line]=r2((f.season[line]||0)+amt);
  if(f.week)f.week[line]=r2((f.week[line]||0)+amt);
}
function debt(id){return r1(F(id).loans.reduce((a,l)=>a+l.left,0))}

/* ----- demand: who comes to a home game ----- */
function attendance(id,opp,o={}){
  const c=CL(id),f=F(id),g=groundSignals(id),pr=f.prices,ref=PRICE_DEF[c.tier];
  const form=clamp(1+(ppg(id)-1.35)*.35,.6,1.6),pull=opp?Math.pow(CL(opp).support/1500,.15):1;
  const base=c.support*form*pull*(o.derby?1.35:1)*(o.cup?1+.1*(o.round||0):1)*(1+g.access*.03)*(1+g.atmosphere*.01);
  const t=Math.min(g.capTerrace,Math.round(base*.62*Math.pow(ref.terrace/pr.terrace,.6)));
  const s=Math.min(g.capSeated,Math.round(base*.38*(1+g.comfort*.02)*Math.pow(ref.seated/pr.seated,1.2)));
  const b=Math.min(g.business,Math.round(g.business*.7*Math.pow(ref.business/pr.business,.4)));
  const hold=o.cup?0:f.holders,holdT=Math.min(t,Math.round(hold*.62)),holdS=Math.min(s,hold-holdT);
  return{terrace:t,seated:s,business:b,total:t+s+b,paying:{terrace:t-holdT,seated:s-holdS},cap:g.capacity,fill:(t+s)/Math.max(1,g.capTerrace+g.capSeated),full:t>=g.capTerrace||s>=g.capSeated};
}
/* the regular weekly lines (no transfers, prizes or loans; those are booked where they happen) */
function weekLines(id,home,o={}){
  const c=CL(id),f=F(id),g=groundSignals(id),pr=f.prices,L={},t=c.tier,form=clamp(1+(ppg(id)-1.35)*.4,.6,1.5);
  if(home){const a=o.att||attendance(id,o.opp,o);const gate=(a.paying.terrace*pr.terrace+a.paying.seated*pr.seated)/1000;
    if(o.cup)L.cupgate=o.neutral?gate/2:gate;else L.gate=gate;
    L.business=a.business*pr.business/1000;L.catering=a.total*2.5*(.6+g.catering*.1)*.4/1000;L.ops=-(.25+a.total/6000*(o.derby?1.6:1))*(1.3-.3*g.ops)}
  else if(o.away)L.travel=-(t===0?.5:t===1?.35:.2);
  if(o.weekly!==false){
    L.sponsors=sponsorWeekK(id);L.partners=partnersWeekK(id,form);L.naming=namingWeekK(id);L.rent=-rentWeekK(id);
    L.merch=c.support/1000*.45*(1+g.shop*.15)*form;
    L.events=g.shop*.08+g.events*.07;
    L.dues=S.members&&S.members[id]?S.members[id].count*S.members[id].dues/SEASON_WEEKS/1000:c.support*.4*40/SEASON_WEEKS/1000;
    L.tv=TV[t];
    L.wages=-wageBillK(id);L.staff=-staffWeekK(id);L.depts=-deptCost(id);L.upkeep=-(.15+g.capacity/12000);
  }
  for(const k in L){L[k]=r2(L[k]);if(!L[k])delete L[k]}
  return L;
}
function sumLines(L,sign){let t=0;for(const k in L)if(!sign||(sign>0?L[k]>0:L[k]<0))t+=L[k];return r2(t)}

/* ----- loans: an annuity paid over 30 weeks a season ----- */
function mkLoan(amount,years,rate,label){const n=years*SEASON_WEEKS,r=rate/SEASON_WEEKS,pay=amount*r/(1-Math.pow(1+r,-n));return{label,amount,left:amount,rate,weeks:n,pay:r2(pay)}}
function loanRate(id,extra){return r2(.05+.04*clamp((debt(id)+(extra||0))/Math.max(50,estSeasonIncome(id)),0,1.5))}
function maxNewLoan(id){return Math.max(0,Math.floor(estSeasonIncome(id)*.8-debt(id)))}
function creditLimit(id){return Math.max(10,Math.round(estSeasonIncome(id)*.12))}
/* expected operating income over a full season (used by AI wage policy, credit and forecasts) */
function estSeasonIncome(id){
  const c=CL(id),opp=null,a=attendance(id,null,{}),L=weekLines(id,true,{opp,weekly:false,att:a}),wk=weekLines(id,false,{});
  const holdN=c.support*.28*Math.pow(PRICE_DEF[c.tier].season/F(id).prices.season,.8),share=F(id).holders?0:Math.min(.9,holdN/Math.max(1,a.total));
  const h=sumLines(L,1)-(L.gate||0)*share; // season-ticket holders do not pay at the gate
  const reg=(wk.sponsors||0)+(wk.partners||0)+(wk.naming||0)+(wk.merch||0)+(wk.events||0)+(wk.dues||0)+(wk.tv||0);
  const hold=c.support*.28*F(id).prices.season/1000;
  return Math.round(h*SEASON_WEEKS/2+reg*SEASON_WEEKS+hold+PRIZE[c.tier][0]*.6);
}
function wageCapK(id){return r2(estSeasonIncome(id)*wageRatio(id)/SEASON_WEEKS)}

/* ----- the week for one club. matches: this week's games involving the club ----- */
function financeWeek(id,matches){
  const f=F(id),c=CL(id);f.week={};
  // European competition payments pass through this week's ledger, not a separate off-book update.
  if(S.continentalReceipts?.[id]){
    book(id,'europe',S.continentalReceipts[id]);delete S.continentalReceipts[id];
  }
  if(S.week===1&&f.sold!==S.season){const hold=Math.round(c.support*.28*clamp(1+(ppg(id)-1.35)*.3,.6,1.4)*Math.pow(PRICE_DEF[c.tier].season/f.prices.season,.8));
    f.holders=hold;f.sold=S.season;book(id,'seasontix',hold*f.prices.season/1000)}
  let away=false;
  for(const m of matches){const home=m.h===id,derby=CL(m.h).rival===m.a;
    if(home||(m.neutral&&m.a===id)){const att=attendance(m.h,m.a,{derby,cup:m.comp==='cup',round:m.round});m.att=att.total;if(home&&m.comp==='league')f.lastGate=att;
      const L=weekLines(id,true,{att,derby,cup:m.comp==='cup',neutral:m.neutral,weekly:false});for(const k in L)book(id,k,L[k])}
    else away=true;
    if(m.comp==='league'&&f.sponsor&&f.sponsor.kind==='bonus'&&f.sponsor.until>=S.season){const gf=home?m.gh:m.ga,ga=home?m.ga:m.gh,pts=gf>ga?3:gf===ga?1:0;if(pts)book(id,'sponsors',pts*f.sponsor.perPoint)}}
  const L=weekLines(id,false,{away});for(const k in L)book(id,k,L[k]);
  const b=groundWeek(id,matches.some(m=>m.h===id&&!m.neutral));if(b)book(id,'build',-b);
  const g=G(id);if(g.repairBill){book(id,'repairs',-g.repairBill);g.repairBill=0}
  for(const l of f.loans){const int=l.left*l.rate/SEASON_WEEKS,prin=Math.min(l.left,l.pay-int);book(id,'interest',-int);book(id,'loanOut',-prin);l.left=r2(l.left-prin);l.weeks--}
  f.loans=f.loans.filter(l=>l.left>.05);
  if(f.cash<0)book(id,'interest',f.cash*.12/SEASON_WEEKS);
  solvency(id);
  f.last={lines:f.week,net:sumLines(f.week),cash:f.cash,w:S.week};f.week=null;
  return f.last;
}
/* overdraft beyond the credit limit: the club must sell; three weeks on, administration (once a season) */
function solvency(id){
  const f=F(id),lim=creditLimit(id);
  if(f.cash<-lim){f.od++;
    if(f.od===1)emit('CashCrisis',id,`${CL(id).name} are over their overdraft limit. The bank wants players sold.`);
    forcedSale(id);
    if(f.od>=3&&(!f.admin||f.admin<S.season)){f.admin=S.season;S.tbl[id].pts-=6;S.tbl[id].ded+=6;
      const amt=Math.ceil(-f.cash+lim*.5);f.loans.push(mkLoan(amt,5,.09,'Administration loan'));book(id,'loanIn',amt);f.policy.wage='tight';
      emit('Administration',id,`${CL(id).name} go into administration: six points deducted and a £${amt}k rescue loan at 9%.`)}
  }else f.od=0;
}
/* close the books for the season: league prize money, archive the lines */
function financeSeasonEnd(id,pos,tier){
  const [top,step]=PRIZE[tier];book(id,'prize',top-(pos-1)*step);
  const f=F(id);f.hist.push({s:S.season,tier,pos,lines:f.season,cash:f.cash,debt:debt(id)});while(f.hist.length>(id===S.my?40:12)){const old=f.hist.shift();for(const k in old.lines)f.start=r2(f.start+old.lines[k])} // keep the save small: an archived season is carried into the opening balance, so the ledger still reconciles
  f.season={};f.holders=0;
}
function seasonTotals(id,s){const f=F(id),lines=s==null||s===S.season?f.season:(f.hist.find(h=>h.s===s)||{lines:{}}).lines,head={};
  for(const k in lines){const h=LINE[k][1];head[h]=r1((head[h]||0)+lines[k])}return{lines,head}}
function operatingResult(lines){let t=0;for(const k in lines)if(!['loanIn','loanOut','groundSale'].includes(k))t+=lines[k];return r1(t)}
/* 26-week forecast with a band */
function cashForecast(id,weeks=26){
  const f=F(id),avg=(sumLines(weekLines(id,true,{}))+sumLines(weekLines(id,false,{away:true})))/2;
  const loanPay=f.loans.reduce((a,l)=>a+l.pay,0),build=G(id).projects.filter(p=>p.phase!=='done').reduce((a,p)=>a+Math.max(0,p.cost*(1+p.over/100)-p.paid),0);
  const per=Math.max(1,G(id).projects.filter(p=>p.phase!=='done').reduce((a,p)=>Math.max(a,p.left+(p.phase==='permit'?p.weeks:0)),1));
  const pts=[];let mid=f.cash;const left=SEASON_WEEKS-S.week;
  for(let i=1;i<=weeks;i++){mid+=(i<=left?avg-loanPay:-loanPay*.2)-(i<=per?build/per:0);pts.push(Math.round(mid))}
  const low=pts.map((v,i)=>Math.round(v-(i+1)*Math.abs(avg)*.12-(i+1)*.4)),high=pts.map((v,i)=>Math.round(v+(i+1)*Math.abs(avg)*.1+(i+1)*.4));
  const minV=Math.min(...pts),minW=pts.indexOf(minV)+1;
  return{mid:pts,low,high,minV,minW};
}
function bookCupPrize(id,amt,r){book(id,'cupprize',amt)}
function finHealth(id){const f=F(id),fc=cashForecast(id);return f.cash<0?'red':fc.minV<0||debt(id)>estSeasonIncome(id)*.6?'tight':'healthy'}

/* ----- commands ----- */
defCommand('SetPrice',{check:(id,a)=>{if(!(a.kind in F(id).prices))return'Unknown price';const ref=PRICE_DEF[CL(id).tier][a.kind],step=a.kind==='season'||a.kind==='business'?5:1;
    if(a.delta>0&&hasStatute(id,STATUTE_PRICES)&&F(id).prices[a.kind]+step>Math.round(ref*1.15))return'The statute lets the members set prices: no more than 15% above the usual';return null},run:(id,a)=>{const pr=F(id).prices,k=a.kind,step=k==='season'?5:k==='business'?5:1,ref=PRICE_DEF[CL(id).tier][k];
  pr[k]=clamp(pr[k]+a.delta*step,Math.round(ref*.4),Math.round(ref*2.5));if(id===S.my)emit('Finance',id,`Price change: ${k==='season'?'season ticket':k} now £${pr[k]}.`)}});
defCommand('TakeLoan',{check:(id,a)=>{if(!(a.amount>0))return'Choose an amount';if(a.amount>maxNewLoan(id))return`The bank lends at most £${maxNewLoan(id)}k more`;if(![3,5,10].includes(a.years))return'Choose 3, 5 or 10 years';return null},
  run:(id,a)=>{const rate=loanRate(id,a.amount),l=mkLoan(a.amount,a.years,rate,`Bank loan (${a.years} years)`);F(id).loans.push(l);book(id,'loanIn',a.amount);emit('LoanTaken',id,`${CL(id).name} borrow £${a.amount}k over ${a.years} years at ${Math.round(rate*1000)/10}%.`);return l}});
defCommand('RepayLoan',{check:(id,a)=>{const l=F(id).loans[a.i];if(!l)return'No such loan';if(F(id).cash<l.left)return'Not enough cash to repay it';return null},
  run:(id,a)=>{const l=F(id).loans[a.i];book(id,'loanOut',-l.left);emit('LoanRepaid',id,`Loan repaid early: £${r1(l.left)}k.`);F(id).loans.splice(a.i,1)}});
defCommand('SetSquadPolicy',{check:(id,a)=>(a.wage&&!WAGE_RATIO[a.wage])||(a.wageR!=null&&!(a.wageR>=.4&&a.wageR<=1.05))||(a.spend!=null&&!(a.spend>=0&&a.spend<=1))||(a.loans!=null&&typeof a.loans!=='boolean')||(a.recruit!=null&&!RECRUIT[a.recruit])||(a.course!=null&&!COURSE[a.course])?'Unknown policy':null,
  run:(id,a)=>{const p=F(id).policy;if(a.course){const c=COURSE[a.course];p.wage=c.wage;p.wageR=WAGE_RATIO[c.wage];p.spend=c.spend;p.loans=c.loans;p.recruit=c.recruit;p.course=a.course;return}p.course=null;if(a.wage){p.wage=a.wage;p.wageR=WAGE_RATIO[a.wage]}if(a.wageR!=null)p.wageR=r2(a.wageR);if(a.spend!=null)p.spend=a.spend;if(a.loans!=null)p.loans=a.loans;if(a.recruit)p.recruit=a.recruit}});

