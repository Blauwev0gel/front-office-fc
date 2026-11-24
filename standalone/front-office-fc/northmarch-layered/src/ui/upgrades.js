/* ================= Upgrades tab (ported from Northmarch V19) =================
   Reads the existing project catalog and orders upgrades with the existing StartProject command. No own state or economy. */
const BUILD_FOCUS=[
 ['training','Training ground','football','training','Develop players and slow their decline.'],
 ['medical','Medical centre','football','medical','Help players recover and avoid injuries.'],
 ['academy','Youth academy','football','academy','Develop better youth intakes.'],
 ['scouting','Scouting office','football','scouting','Find and assess more transfer targets.'],
 ['commercial','Club shop','revenue','shop','Improve merchandise and events income.'],
 ['clubhouse','Clubhouse','revenue','community','Grow membership and supporter base.'],
 ['parking','Car park','revenue','access','Make home matches more accessible.']
];
const BUILD_GROUPS=[['all','All'],['football','Football'],['revenue','Revenue'],['ground','Stadium']];
function buildView(){
 const id=S.my,g=G(id),f=F(id),sg=groundSignals(id),cat=projectCatalog(id),active=g.projects.filter(p=>p.phase!=='done'),group=UI.buildGroup||'all',selected=UI.buildChoice,forecast=cashForecast(id);
 const card=(title,description,level,opt,signal)=>{
  const busy=opt&&opt.busy,chosen=opt&&selected===opt.key;
  return '<article class="build-card"><div class="row"><b>'+esc(title)+'</b><span class="pill">'+esc(level)+'</span></div><p class="small muted">'+esc(description)+'</p>'+
  (signal==null?'':'<p class="small">Current contribution: <b>'+signal+'</b></p>')+
  (!opt?'<p class="small muted">No upgrade available at this location.</p>':
  '<p class="small"><b>Next:</b> '+esc(opt.label)+' · '+esc(opt.effect)+'</p><p class="small">'+k1(opt.cost)+' standard estimate · '+opt.weeks+' weeks'+(opt.permit?' + permit':'')+'</p>'+
  (busy?'<p class="small muted">Construction already in progress.</p>':chosen?
  '<div class="build-confirm"><p class="small">Confirm this project? Construction is paid week by week. Delays, permits and overruns are possible. Forecast cash low: '+k1(forecast.minV)+'.</p><div class="row"><button class="btn" data-act="buildgo" data-arg="'+esc(opt.key)+'">Start standard build</button><button class="btn ghost" data-act="buildpick" data-arg="'+esc(opt.key)+'">Cancel</button></div></div>':
  '<button class="btn ghost" data-act="buildpick" data-arg="'+esc(opt.key)+'">Plan upgrade</button>'))+'</article>';
 };
 const cards=[];
 for(const [key,title,grp,signal,description] of BUILD_FOCUS){
  if(group!=='all'&&group!==grp)continue;
  const i=g.plots.findIndex(p=>p.kind===key),p=i>=0?g.plots[i]:null,empty=g.plots.findIndex(p=>!p.kind);
  const projectKey=p?'plot:'+i+':up':empty>=0?'plot:'+empty+':'+key:null;
  const opt=projectKey?cat.find(o=>o.key===projectKey):null;
  cards.push(card(title,description,p?'Level '+p.lv:'Not built',opt,Number.isFinite(sg[signal])?sg[signal]:null));
 }
 if(group==='all'||group==='ground'){
  for(const [key,title,description] of [['fac:access','Turnstiles','Increase licensed capacity.'],['fac:safety','Safety','Unlock legal ground capacity.'],['fac:catering','Catering','Earn more per fan.'],['pitch:lv','Pitch','Improve the playing surface.'],['side:N:ring','North stand','Add supporter places.']]){
   const obj=key.startsWith('fac:')?g.fac[key.split(':')[1]]:key.startsWith('pitch:')?g.pitch:g.sides.N;
   cards.push(card(title,description,key.startsWith('side:')?obj.rings+' rings':'Level '+obj.lv,cat.find(o=>o.key===key),null));
  }
 }
 return '<section class="build-head"><p class="eyebrow">Build your club · Season '+S.season+'</p><h2>Upgrade. Compete. Grow.</h2><p class="small muted">Invest in the existing club systems. Improvements take time, cost money and do not guarantee victories.</p><div class="build-kpis"><div><span>Cash</span><b>'+k1(f.cash)+'</b></div><div><span>Forecast low</span><b>'+k1(forecast.minV)+'</b></div><div><span>Squad strength</span><b>'+Math.round(teamStrength(id))+'</b></div><div><span>League</span><b>'+(S.week?ord(posOf(id)):'Pre-season')+'</b></div></div><div class="row"><button class="btn ghost" data-act="ctab" data-arg="football">Coach & director</button><button class="btn ghost" data-act="ctab" data-arg="depts">Staff & budgets</button></div></section>'+
 '<div class="build-filter">'+BUILD_GROUPS.map(([k,t])=>'<button class="tbtn '+(group===k?'on':'')+'" data-act="buildgroup" data-arg="'+k+'">'+t+'</button>').join('')+'</div>'+
 (UI.msg?'<div class="panel">'+msgLine()+'</div>':'')+
 (active.length?'<section class="panel"><p class="eyebrow">Construction in progress</p>'+active.map(p=>'<div class="build-progress"><b>'+esc(p.label)+'</b><span>'+(p.phase==='permit'?'Permit pending':p.left+' weeks left')+' · '+k1(p.cost)+' committed · '+k1(p.paid)+' paid</span></div>').join('')+'</section>':'')+
 '<div class="build-cards">'+cards.join('')+'</div><section class="panel"><p class="eyebrow">The next step</p><p class="small">Play matches and read The Northmarch Echo to follow consequences. The existing stadium menu has every other construction and repair option.</p><button class="btn ghost" data-act="ctab" data-arg="ground">All construction options</button></section>';
}
