/* ---- club/commercial.js ---- */
/* ================= Club: the season budget, sponsors and members' financing =================
   Owns F(id).budget (the season plan), F(id).sponsor / offers / naming (commercial deals) and the members' funding
   (bonds, fundraising, the ground sold and leased back). Money still moves only through book(); the squad frame
   (F(id).policy) stays the one source the director works to. The statute (CL(id).statute) limits what a board may do. */
const SPONSOR_NAMES=['Holloway Haulage','Marsh & Daughters','Kestrel Bakeries','North Fen Energy','Brackwater Building Society','Cragside Motors','Ironbridge Insurance','Tarn Valley Dairy','Saltmere Ales','Penhallow Print','Greystone Quarries','Fellside Foods','Harbourline Ferries','Moorgate Joinery'];
const STATUTE_SALE='Members approve any sale above £50k',STATUTE_PRICES='Ticket prices are set by the members';
function hasStatute(id,s){return CL(id).statute.includes(s)}
/* ----- the season plan: what the board expects, and how the season is going against it ----- */
function wageRatio(id){const p=F(id).policy;return p.wageR??WAGE_RATIO[p.wage]}
function setBudget(id,season){
  const f=F(id),inc=estSeasonIncome(id);
  const build=G(id).projects.filter(p=>p.phase!=='done').reduce((a,p)=>a+Math.max(0,p.cost*(1+p.over/100)-p.paid),0);
  f.budget={s:season,income:Math.round(inc),wages:Math.round(wageCapK(id)*SEASON_WEEKS),staff:Math.round(staffWeekK(id)*SEASON_WEEKS),depts:Math.round(deptCost(id)*SEASON_WEEKS),
    build:Math.round(build),transfers:budgetFor(id),loans:Math.round(f.loans.reduce((a,l)=>a+l.pay,0)*SEASON_WEEKS)};
}
function setBudgetsAll(season){for(const id in S.clubs)setBudget(id,season)}
function budgetRows(id){
  const f=F(id),b=f.budget,L=f.season,w=Math.max(1,S.week),proj=v=>v*SEASON_WEEKS/w;
  const inc=Object.keys(L).filter(k=>L[k]>0&&!['loanIn','feesIn','groundSale'].includes(k)).reduce((a,k)=>a+L[k],0);
  const rows=[['Income',b.income,inc,true],['Player wages',-b.wages,L.wages||0,false],['Coach and director',-b.staff,L.staff||0,false],['Departments',-b.depts,L.depts||0,false],['Building',-b.build,L.build||0,false],['Transfers (net)',-b.transfers,(L.feesOut||0)+(L.feesIn||0),false]];
  const once=['seasontix','cupgate','cupprize','fundraising','prize'].reduce((a,k)=>a+Math.max(0,L[k]||0),0),prizeEst=L.prize?0:PRIZE[CL(id).tier][0]*.6;
  const incProj=(inc-once)*SEASON_WEEKS/w+once+prizeEst; // one-off income counts once, not thirty times
  return rows.map(([n,plan,now,isInc])=>{const p=isInc?incProj:n==='Building'||n.startsWith('Transfers')?now:proj(now);return{n,plan,now:r1(now),proj:r1(p),over:isInc?p<plan*.92:p<plan*1.05-1}})
}
function budgetWarnings(id){
  const out=[],f=F(id),b=f.budget;if(!b||!S.week)return out;
  const w=S.week,wg=wageBillK(id)*SEASON_WEEKS;if(wg>b.wages*1.05)out.push(`The wage bill is ${Math.round((wg/b.wages-1)*100)}% over budget.`);
  const ext=-((f.season.feesOut||0));if(b.transfers&&ext>b.transfers*1.05)out.push('Transfer spending is over budget.');
  const inc=budgetRows(id)[0].proj;
  if(w>=6&&inc<b.income*.9)out.push(`Income is tracking ${Math.round((1-inc/b.income)*100)}% below plan.`);
  return out;
}
/* ----- sponsors: one main deal, local partners, and sometimes naming rights for the ground ----- */
function sponsorBase(id){const c=CL(id),t=c.tier,g=groundSignals(id);return SPONSOR[t]*Math.pow(c.support/[3000,1700,850,500,300][t],.5)*(1+g.media*.03)*(.7+.3*g.sales)*(.85+.3*(c.rep??50)/100)}
function sponsorOffers(id){
  const b=sponsorBase(id)*.65,names=pickN(SPONSOR_NAMES,3),exp=Math.max(30,(CL(id).expect?(17-CL(id).expect)*3+20:45));
  const offers=[{name:names[0],kind:'fixed',years:3,perWeek:r2(b*.95)},{name:names[1],kind:'fixed',years:1,perWeek:r2(b*1.08)},{name:names[2],kind:'bonus',years:2,perWeek:r2(b*.42),perPoint:r2(b*.56*SEASON_WEEKS/exp)}];
  if(!F(id).naming&&chance(.35))offers.push({name:pick(SPONSOR_NAMES),kind:'naming',years:3,perWeek:r2(sponsorBase(id)*.45)});
  return offers;
}
function signSponsor(id,o){
  const f=F(id);
  if(o.kind==='naming'){f.naming={...o,until:S.season+o.years-1};emit('Naming',id,`${CL(id).ground} is renamed the ${o.name} Stadium for ${o.years} seasons (£${n0w(o.perWeek)}k a week).`)}
  else{f.sponsor={...o,until:S.season+o.years-(S.week>0?0:1)};emit('Sponsor',id,`${o.name} sign as main sponsor of ${CL(id).name} for ${o.years} season${o.years>1?'s':''}${o.kind==='bonus'?' (paid partly by results)':''}.`)}
  f.offers=(f.offers||[]).filter(x=>x!==o&&(o.kind==='naming'?x.kind!=='naming':x.kind==='naming'));
}
function n0w(v){return Math.round(v*10)/10}
/* AI boards pick by their chairman's values: money takes the long fixed deal, glory bets on results */
function aiSponsor(id){const f=F(id),v=chairValue(id),of=f.offers||[];if(!of.length)return;
  const main=of.filter(o=>o.kind!=='naming');if(main.length&&(!f.sponsor||f.sponsor.until<S.season+1))signSponsor(id,v==='money'?main[0]:v==='glory'?main.find(o=>o.kind==='bonus')||main[0]:main[1]||main[0]);
  const nm=(f.offers||[]).find(o=>o.kind==='naming');if(nm&&v==='money'&&!hasStatute(id,STATUTE_SALE))signSponsor(id,nm);
  f.offers=[];}
function sponsorWeekK(id){const f=F(id),s=f.sponsor;return r2(s&&s.until>=S.season?s.perWeek:sponsorBase(id)*.65*.4)}
function namingWeekK(id){const n=F(id).naming;return n&&n.until>=S.season?n.perWeek:0}
function partnersWeekK(id,form){const c=CL(id),t=c.tier,g=groundSignals(id);return SPONSOR[t]*.35*Math.pow(c.support/[3000,1700,850,500,300][t],.5)*(1+g.media*.03)*(form??1)*(.4+.6*g.sales)}
/* summer: expiring deals make way for new offers (the player chooses; computer boards choose at once) */
function commercialSeasonEnd(){
  for(const id in S.clubs){const f=F(id);
    if(f.naming&&f.naming.until<S.season+1){emit('Naming',id,`The naming deal for ${CL(id).ground} ends.`);f.naming=null}
    if(!f.sponsor||f.sponsor.until<S.season+1){f.offers=sponsorOffers(id);if(f.sponsor&&id===S.my)emit('Sponsor',id,`${f.sponsor.name}'s deal ends. Three companies have made offers.`);f.sponsor=null}
    else if(!f.naming&&chance(.15))f.offers=sponsorOffers(id).filter(o=>o.kind==='naming');
    if(aiRuns(id))aiSponsor(id);
  }
}
function commercialInit(id){const f=F(id),o=sponsorOffers(id).filter(x=>x.kind!=='naming');const pickO=pick(o);f.sponsor={...pickO,until:S.season+ri(0,2)};f.offers=[];f.naming=null;f.fundLast=-9;f.groundSold=null;f.bondSeason=-9}

/* ----- members' financing ----- */
function bondCap(id){const m=M(id);return Math.max(0,Math.round(m.count*.15*(m.conf/100)*(CL(id).tier===0?1.4:1)))}
function bondRate(id){return r2(.03+(60-M(id).conf)*.0004)}
function fundraiseYield(id){const m=M(id),recent=S.season-F(id).fundLast<2;return Math.round(m.count*.025*(.5+m.conf/100)*(recent?.45:1))}
function groundValue(id){return Math.round(groundSignals(id).capacity*.11*[1.4,1,.75,.55,.4][CL(id).tier])}
function rentWeekK(id){const g=F(id).groundSold;return g?g.rent:0}
defCommand('SignSponsor',{check:(id,a)=>{const o=(F(id).offers||[])[a.i];if(!o)return'That offer has gone';if(o.kind==='naming'&&hasStatute(id,STATUTE_SALE)&&M(id).conf<55)return'The members would vote down naming rights';return null},
  run:(id,a)=>{const o=F(id).offers[a.i];signSponsor(id,o);if(o.kind==='naming')confLog(id,-4,'The ground renamed after a sponsor')}});
defCommand('IssueBond',{check:(id,a)=>{const f=F(id);if(f.bondSeason===S.season)return'One members\' bond a season';if(!(a.amount>0)||a.amount>bondCap(id))return`Members will lend at most £${bondCap(id)}k`;return null},
  run:(id,a)=>{const f=F(id),r=bondRate(id);f.loans.push(mkLoan(a.amount,5,r,'Members\' bond (5 years)'));book(id,'loanIn',a.amount);f.bondSeason=S.season;confLog(id,1.5,'Members invested in the club');
    emit('Bond',id,`${CL(id).name} raise £${a.amount}k from a members' bond at ${Math.round(r*1000)/10}%.`)}});
defCommand('Fundraise',{check:(id)=>F(id).fundLast===S.season?'One appeal a season':null,
  run:(id)=>{const f=F(id),y=fundraiseYield(id),recent=S.season-f.fundLast<2;book(id,'fundraising',y);f.fundLast=S.season;if(recent)confLog(id,-3,'Another appeal for money');
    emit('Fundraising',id,`A members' appeal raises £${y}k${recent?' (donors are tiring)':''}.`);return y}});
defCommand('SellGround',{check:(id)=>{if(F(id).groundSold)return'The ground is already sold';if(hasStatute(id,STATUTE_SALE)&&M(id).conf<60)return'The statute needs the members\' approval, and they would refuse';return null},
  run:(id)=>{const v=groundValue(id),f=F(id);f.groundSold={value:v,rent:r2(v*.075/SEASON_WEEKS),s:S.season};book(id,'groundSale',v);confLog(id,-15,'The ground was sold');
    emit('GroundSold',id,`${CL(id).name} sell ${CL(id).ground} for £${v}k and lease it back (£${n0w(f.groundSold.rent)}k a week).`)}});
defCommand('BuyBackGround',{check:(id)=>{const g=F(id).groundSold;if(!g)return'The club owns its ground';if(F(id).cash<g.value*1.1)return`Buying it back costs £${Math.round(g.value*1.1)}k`;return null},
  run:(id)=>{const g=F(id).groundSold;book(id,'groundSale',-Math.round(g.value*1.1));F(id).groundSold=null;confLog(id,10,'The ground is ours again');emit('GroundBought',id,`${CL(id).name} buy back their ground.`)}});
/* a computer board in trouble asks its members first */
function aiFunding(id){const f=F(id);if(f.cash>=-creditLimit(id)*.5)return;
  const cap=bondCap(id);if(f.bondSeason<S.season-1&&cap>=10&&M(id).conf>=50)cmd('IssueBond',id,{amount:Math.round(cap*.6)},'ai');else if(f.fundLast<S.season-1)cmd('Fundraise',id,{},'ai')}
function commercialAfterLoad(){for(const id in S.clubs){const f=F(id);if(f.fundLast==null)commercialInit(id);if(!f.budget||f.budget.s!==S.season)setBudget(id,S.season)}}

