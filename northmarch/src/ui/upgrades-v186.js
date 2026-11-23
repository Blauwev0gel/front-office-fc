/* V18.7 navigation correction: facilities belong to their departments.
   The V18.6 economic model is unchanged. No separate upgrades hub or home CTA.
   Existing club/ground, department and finance views remain the owners of actions. */
(function(){
 const previousMoneyView=moneyView,previousAct=act;
 const money=v=>k1(Math.round(v*10)/10);
 function cashPanel(id){
   const f=F(id),lines=f.season||{},entries=Object.entries(lines);
   const income=entries.filter(([,v])=>v>0).reduce((sum,[,v])=>sum+v,0);
   const outgo=entries.filter(([,v])=>v<0).reduce((sum,[,v])=>sum-v,0);
   const operating=operatingResult(lines),fc=cashForecast(id);
   const weekly=f.last?.lines||{},weeklyIn=Object.values(weekly).filter(v=>v>0).reduce((s,v)=>s+v,0);
   const weeklyOut=-Object.values(weekly).filter(v=>v<0).reduce((s,v)=>s+v,0);
   return '<section class="nm86-cash" aria-label="Club cashflow">'+
     '<div class="nm86-section"><div><span class="nm85-kicker">CLUB FINANCES · SEASON TO DATE</span><h3>Money in, money out</h3></div></div>'+
     '<div class="nm86-money-grid"><div><small>CASH IN</small><strong>'+money(income)+'</strong></div><div><small>CASH OUT</small><strong>'+money(outgo)+'</strong></div><div><small>NET CASH MOVEMENT</small><strong class="'+(income-outgo<0?'nm86-negative':'')+'">'+money(income-outgo)+'</strong></div></div>'+
     '<div class="nm86-cash-bottom"><span>Cash now <b>'+money(f.cash)+'</b></span><span>Operating result <b>'+money(operating)+'</b></span><span>Construction paid <b>'+money(-(lines.build||0))+'</b></span><span>Debt <b>'+money(debt(id))+'</b></span></div>'+
     '<p class="nm86-forecast '+(fc.minV<0?'nm86-risk':'')+'">Lowest forecast cash, next 26 weeks: <b>'+money(fc.minV)+'</b></p>'+
     '<p class="nm86-footnote">Net cash includes borrowing, repayments and construction. Operating result excludes capital and financing. Forecast is indicative. Last matchweek: '+money(weeklyIn)+' in / '+money(weeklyOut)+' out.</p></section>';
 }
 moneyView=function(){
   const original=previousMoneyView();
   if(!S||!S.my||UI.mt!=='overview')return original;
   return cashPanel(S.my)+original;
 };
 // Older deep links may still target Upgrades. Resolve them to the physical ground,
 // where stadium improvements live; department facilities use their own tiles.
 act=function(a,arg){
   if((a==='tab'&&arg==='build')||a==='hubprojects'){
     UI.tab='week';UI.over='ground';UI.gt='build';UI.gsel=null;UI.msg=null;
     render();return;
   }
   return previousAct(a,arg);
 };
})();