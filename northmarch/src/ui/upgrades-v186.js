/* V18.6: Existing project engine, readable upgrades and cashflow. No new save state. */
(function(){
 const oldBuildView=buildView,oldWeekView=weekView;
 const money=v=>k1(Math.round(v*10)/10);
 const ledger=(id)=>{
   const f=F(id),lines=f.season||{},groups={};
   const entries=Object.entries(lines);
   const income=entries.filter(([k,v])=>v>0&&k!=='loanIn').reduce((s,[k,v])=>s+v,0);
   const outgo=entries.filter(([,v])=>v<0).reduce((s,[k,v])=>s-v,0);
   const construction=-(lines.build||0);
   const operating=operatingResult(lines);
   return {income,outgo,construction,operating,lines};
 };
 const cashPanel=id=>{
   const f=F(id),l=ledger(id),fc=cashForecast(id),loans=debt(id),weekly=f.last?.lines||{};
   const weeklyIn=Object.values(weekly).filter(v=>v>0).reduce((a,v)=>a+v,0);
   const weeklyOut=-Object.values(weekly).filter(v=>v<0).reduce((a,v)=>a+v,0);
   const risk=fc.minV<0;
   return '<section class="nm86-cash" aria-label="Club cashflow">'+
    '<div class="nm86-section"><div><span class="nm85-kicker">CLUB FINANCES · SEASON TO DATE</span><h3>Money in, money out</h3></div><button class="tbtn" data-act="tab" data-arg="money">Full accounts ›</button></div>'+
    '<div class="nm86-money-grid"><div><small>INCOME</small><strong>'+money(l.income)+'</strong></div><div><small>EXPENSES</small><strong>'+money(l.outgo)+'</strong></div><div><small>NET CASH MOVEMENT*</small><strong class="'+(l.income-l.outgo<0?'nm86-negative':'')+'">'+money(l.income-l.outgo)+'</strong></div></div>'+
    '<div class="nm86-cash-bottom"><span>Cash now <b>'+money(f.cash)+'</b></span><span>Construction paid <b>'+money(l.construction)+'</b></span><span>Debt <b>'+money(loans)+'</b></span></div>'+
    '<p class="nm86-forecast '+(risk?'nm86-risk':'')+'">Estimated lowest cash in the next 26 weeks: <b>'+money(fc.minV)+'</b>'+(risk?' · Risk of running short':'')+'</p>'+
    '<p class="nm86-footnote">*Income minus expenses booked this season, including construction; excludes new borrowing. Forecast is indicative, not guaranteed. Last matchweek: '+money(weeklyIn)+' in / '+money(weeklyOut)+' out.</p></section>';
 };
 const routes=[
  {name:'Better training',kind:'training',why:'Improve player growth towards potential. Stronger development takes seasons.',tag:'Sport'},
  {name:'Medical centre',kind:'medical',why:'Reduce injury risk and speed recovery; helps squad availability.',tag:'Sport'},
  {name:'Youth academy',kind:'academy',why:'Bring through more and better young players each season.',tag:'Future'},
  {name:'Scouting office',kind:'scouting',why:'Improve recruitment intelligence and candidate discovery.',tag:'Future'},
  {name:'Club shop',kind:'commercial',why:'Increase merchandise and event income through existing sales systems.',tag:'Income'},
  {name:'Clubhouse',kind:'clubhouse',why:'Strengthen community and events income.',tag:'Income'},
  {name:'Catering',key:'fac:catering',why:'Earn more from supporters attending home matches.',tag:'Income'},
  {name:'Turnstiles',key:'fac:access',why:'Increase licensed stadium capacity when access is the bottleneck.',tag:'Ground'},
  {name:'Safety upgrades',key:'fac:safety',why:'Increase licensed stadium capacity when safety is the bottleneck.',tag:'Ground'},
  {name:'Better pitch',key:'pitch:lv',why:'Improve home playing conditions and the matchday surface.',tag:'Ground'},
  {name:'North stand',key:'side:N:ring',why:'Add capacity, provided the licence allows it and fans attend.',tag:'Ground'}
 ];
 const optionFor=(id,route,cat)=>{
   if(route.key)return cat.find(o=>o.key===route.key);
   const plots=G(id).plots;
   const i=plots.findIndex(p=>p.kind===route.kind);
   if(i>=0)return cat.find(o=>o.key==='plot:'+i+':up');
   const empty=plots.findIndex(p=>!p.kind);
   return empty>=0?cat.find(o=>o.key==='plot:'+empty+':'+route.kind):null;
 };
 const upgradeCard=(id,route,cat,forecast)=>{
   const opt=optionFor(id,route,cat);
   const selected=opt&&UI.buildChoice===opt.key;
   const busy=opt&&opt.busy;
   const cash=F(id).cash;
   const reserve=opt?cash-opt.cost:cash;
   return '<article class="nm86-upgrade">'+
    '<div class="nm86-section"><span class="nm86-route">'+esc(route.tag)+'</span><b>'+esc(route.name)+'</b></div>'+
    '<p>'+esc(route.why)+'</p>'+
    (opt?'<div class="nm86-price"><strong>'+money(opt.cost)+'</strong><span>'+opt.weeks+' weeks'+(opt.permit?' + permit':'')+'</span></div>'+
      '<p class="nm86-effect">Next: '+esc(opt.label)+' · '+esc(opt.effect)+'</p>'+
      '<p class="nm86-footnote">Approx. '+money(opt.cost/Math.max(1,opt.weeks))+'/week during construction. Completed facilities add recurring upkeep; costs and benefits continue into future seasons. Possible delays and overruns.</p>'+
      (reserve<0?'<p class="nm86-risk">Cash after quoted cost: '+money(reserve)+' · review borrowing risk.</p>':'')+
      (busy?'<p class="nm86-muted">Work already under way at this location.</p>':
      selected?'<div class="nm86-confirm"><p>Commit '+money(opt.cost)+'? Payments occur over construction. Current 26-week forecast low: '+money(forecast.minV)+'.</p><button class="btn" data-act="buildgo" data-arg="'+esc(opt.key)+'">Approve project</button><button class="btn ghost" data-act="buildpick" data-arg="'+esc(opt.key)+'">Cancel</button></div>':
      '<button class="btn ghost" data-act="buildpick" data-arg="'+esc(opt.key)+'">Plan this upgrade</button>'):
      '<p class="nm86-muted">Unavailable: no free site or maximum level reached. Other projects may be available in the full catalog.</p>')+
    '</article>';
 };
 buildView=function(){
   if(!S||!S.my)return oldBuildView();
   const id=S.my,cat=projectCatalog(id),fc=cashForecast(id),active=G(id).projects.filter(p=>p.phase!=='done');
   return '<div class="nm86-upgrades"><header class="nm86-upgrades-head"><span class="nm85-kicker">CHAIRMAN\'S INVESTMENT PLAN</span><h2>Make your club better</h2><p>Choose where to invest. Every project uses the existing club economy and takes time to deliver.</p></header>'+
    cashPanel(id)+
    (UI.msg?'<div class="panel">'+msgLine()+'</div>':'')+
    (active.length?'<section class="nm86-active"><b>Work in progress</b>'+active.map(p=>'<p>'+esc(p.label)+' · '+(p.phase==='permit'?'Awaiting permit':p.left+' weeks remaining')+' · '+money(p.paid)+' paid of '+money(p.cost)+'</p>').join('')+'</section>':'')+
    '<div class="nm86-upgrade-grid">'+routes.map(r=>upgradeCard(id,r,cat,fc)).join('')+'</div>'+
    '<details class="nm86-full"><summary>All construction and specialist upgrades</summary>'+oldBuildView()+'</details></div>';
 };
 weekView=function(){
   const html=oldWeekView();
   if(!S||!S.my||UI.tab!=='week'||(UI.v183Stage&&UI.v183Stage!=='preview')||!html.includes('nm85-home'))return html;
   const insert=cashPanel(S.my)+'<div class="nm86-upgrade-cta"><span><b>Invest in your club</b><small>Training, youth, stadium and new income</small></span><button class="btn" data-act="tab" data-arg="build">Upgrades ›</button></div>';
   return html.replace('<div class="nm85-section-title">',insert+'<div class="nm85-section-title">');
 };
})();
