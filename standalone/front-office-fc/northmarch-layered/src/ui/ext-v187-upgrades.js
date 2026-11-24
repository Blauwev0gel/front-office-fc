/* ================= UI extension, ported from Northmarch V19 =================
   V18.6/V18.7: money view, department facilities in their own tiles, upgrade navigation.
   Ported verbatim from the V19 build (the modular source in northmarch/src was behind for the upgrades part).
   These layers wrap core functions instead of using the feature hooks: convert module by module, add no new behaviour here. */
(function(){
 const previousMoneyView=moneyView,previousAct=act,previousDeptSheet=deptSheet;
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
 // Show the real facility project in the department's primary decision sheet.
 // The older V18.1 decision sheet hid building behind "Open full report".
 deptSheet=function(k){
   const html=previousDeptSheet(k);
   if(!S||!S.my||UI.v181DeptFull===k||!DEPT[k]?.fac)return html;
   const id=S.my,kind=DEPT[k].fac,fac=deptFacility(id,k),estate=G(id);
   if(!fac)return html;
   const idx=estate.plots.findIndex(p=>p.kind===kind);
   const job=estate.projects.find(p=>p.phase!=='done'&&(
     p.key.endsWith(':'+kind)||(idx>=0&&p.target==='plot:'+idx)));
   const opt=fac.opt,chosen=opt&&UI.gsel===opt.key;
   const title=COMPLEX[kind].n;
   const state=fac.have?'Level '+fac.have.lv+' · '+Math.round(fac.have.cond)+'% condition':'Not built';
   const benefit=COMPLEX[kind].sig;
   let action='';
   if(job){
     action='<div class="v187-facility-job"><b>Under construction</b><p>'+esc(job.label)+' · '+
       (job.phase==='permit'?'Awaiting permit':job.left+' weeks remaining')+
       ' · '+k1(job.paid)+' paid of '+k1(job.cost)+'</p></div>';
   }else if(opt){
     action='<p class="small muted">'+esc(opt.label)+' · '+k1(opt.cost)+' · '+opt.weeks+' weeks'+
       (opt.permit?' + planning permission':'')+'. Full operation: '+k1(opt.annual||0)+'/season; existing costs '+k1(fac.have?facilityRun(id,fac.have):0)+'/season. Tight budget and fewer staff reduce operating level, not building size.</p>'+
       (chosen?
         '<div class="v187-facility-confirm"><p>Commit '+k1(opt.cost)+' to this department? Paid as construction progresses; delays and overruns are possible.</p>'+
           '<button class="btn" data-act="gbuild" data-arg="'+esc(opt.key)+'|standard">Approve investment</button>'+
           '<button class="btn ghost" data-act="gsel" data-arg="">Cancel</button></div>':
         '<button class="btn ghost" data-act="gsel" data-arg="'+esc(opt.key)+'">Plan department investment</button>');
   }else action='<p class="small muted">'+(fac.noPlot?
      'No free plot. The club cannot build another facility until a plot is available.':
      'Facility is at its maximum level.')+'</p>';
   const panel='<section class="v181-dept-block v187-facility" aria-label="'+esc(title)+' investment">'+
     '<h3>Facility & investment</h3><div class="row small"><span><b>'+esc(title)+'</b></span><strong>'+esc(state)+'</strong></div>'+
     '<p class="small muted">'+esc(benefit)+'</p>'+(fac.have?'<p class="small">Operating level '+operatingLevel(id,fac.have)+' / '+fac.have.lv+' · '+k1(facilityRun(id,fac.have))+'/season</p>':'')+action+'</section>';
   const marker='<section class="v181-dept-block">';
   if(!html.includes(marker))throw Error('Department screen missing decision marker: '+k);
   let output=html.replace(marker,panel+marker);
   // Keep staff and reporting within this same sheet instead of sending players
   // to a second "full department report" screen.
   const advanced='<section class="v181-dept-block"><h3>More information and controls</h3>';
   const start=output.indexOf(advanced);
   if(start>=0){
     const stop=output.indexOf('</section>',start);
     if(stop<0)throw Error('Unclosed department controls: '+k);
     const dept=estate.depts[k];
     const staffChoices=[1,2,3,4,5].map(n=>'<button class="'+((dept.hiring?dept.hiring.to:dept.staff)===n?'on':'')+
       '" data-act="dstaff" data-arg="'+esc(k)+':'+n+'" '+(dept.hiring?'disabled':'')+'>'+
       n+'/5 · £'+n0(deptWeekCost(id,k,n)*1000)+'/wk</button>').join('');
     const staffPanel='<section class="v181-dept-block"><h3>People & staffing</h3>'+
       '<p class="small muted">Your team has '+dept.staff+'/5 staff. Hiring takes '+HIRE_WEEKS+' weeks and affects the weekly budget.</p>'+
       '<div class="seg">'+staffChoices+'</div>'+
       (dept.hiring?'<p class="small muted">Recruiting: '+dept.hiring.left+' weeks remaining.</p>':'')+'</section>';
     const pipeline=departmentPipeline(k);
     const extra=pipeline?'<details class="panel v187-dept-reports"><summary>Department pipeline and records</summary>'+pipeline+'</details>':'';
     output=output.slice(0,start)+staffPanel+extra+output.slice(stop+'</section>'.length);
   }
   return output;
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
