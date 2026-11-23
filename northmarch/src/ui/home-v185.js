/* V18.5 prototype: progressive home. Pure presentation, no new simulation state.
   Existing match -> full time -> Echo flow remains owned by V18.3. */
(function(){
 const previousWeek=weekView;
 const tile=(label,value,sub,action,arg,icon)=>'<button class="nm85-tile" data-act="'+action+'" data-arg="'+(arg||'')+'"><span class="nm85-icon">'+icon+'</span><span class="nm85-label">'+esc(label)+'</span><strong>'+esc(String(value))+'</strong><small>'+esc(sub)+'</small></button>';
 weekView=function(){
   if(!S||!S.my||S.phase!=='season'||(UI.v183Stage&&UI.v183Stage!=='preview'))return previousWeek();
   const id=S.my,c=CL(id),f=F(id),m=M(id),g=G(id),sig=groundSignals(id);
   const fixture=seasonOver()?null:fixtureOf(id,S.week+1);
   const recent=(S.tbl[id]?.form||[]).slice(-5).join(' · ')||'No results yet';
   const active=g.projects.filter(p=>p.phase!=='done');
   const alerts=signals(id).filter(x=>x.lv>=2).slice(0,1);
   const last=S.v183?.club===id?S.v183.issues?.at(-1):null;
   const level=k=>{const p=g.plots.find(x=>x.kind===k);return p?'Level '+p.lv:'Not built'};
   const dept=k=>{const d=g.depts[k];return d?d.staff+'/5 staff':'View'};
   const club=esc(c.name);
   const match=fixture?'<div class="nm85-fixture"><span class="nm85-kicker">NEXT MATCH · WEEK '+(S.week+1)+'</span><h2>'+club+' <span>vs</span> '+esc(CL(fixture.opp).name)+'</h2><p>'+ (fixture.home?'Home':'Away')+' · '+esc(TIER_NAME[c.tier])+' · Form '+esc(recent)+'</p><button class="btn nm85-primary" data-act="play">▶ Play next match</button></div>':
     '<div class="nm85-fixture"><h2>Season complete</h2><p>Review the final standings and accounts.</p><button class="btn nm85-primary" data-act="close">Finish season</button></div>';
   const attention=alerts.length?'<button class="nm85-alert" data-act="'+esc(alerts[0].act)+'" data-arg="'+esc(String(alerts[0].arg||''))+'"><b>Needs attention</b><span>'+esc(alerts[0].text)+'</span><em>Review ›</em></button>':'';
   return '<div class="nm85-home"><header class="nm85-heading"><span class="nm85-kicker">CHAIRMAN\'S OFFICE</span><h1>'+club+'</h1><p>Season '+S.season+' · '+esc(TIER_NAME[c.tier])+' · '+(S.week?'Week '+S.week:'Pre-season')+'</p></header>'+
     '<section class="nm85-score"><div><small>LEAGUE</small><b>'+(S.week?ord(posOf(id)):'—')+'</b></div><div><small>CASH</small><b>'+k1(f.cash)+'</b></div><div><small>SQUAD</small><b>'+Math.round(teamStrength(id))+'</b></div><div><small>CONFIDENCE</small><b>'+Math.round(m.conf)+'/100</b></div></section>'+
     match+attention+
     '<div class="nm85-section-title"><h3>Run your club</h3><span>Tap to manage</span></div>'+
     '<section class="nm85-grid" aria-label="Club departments">'+
     tile('Squad',Math.round(teamStrength(id)),'Players & contracts','tab','squad','⚽')+
     tile('Manager','Staff','Coach & director','ctab','football','♟')+
     tile('Training',level('training'),dept('training'),'dept','training','↗')+
     tile('Youth',level('academy'),dept('academy'),'dept','academy','★')+
     tile('Scouting',level('scouting'),dept('scouting'),'dept','scouting','⌕')+
     tile('Stadium',Math.round(sig.capacity).toLocaleString('en-GB'),'Ground & projects','ctab','ground','▥')+
     tile('Finances',k1(f.cash),'Accounts & budgets','hubmoney','overview','£')+
     tile('Commercial',level('commercial'),dept('commercial'),'dept','commercial','▣')+
     tile('Board',Math.round(m.conf)+'/100','Members & goals','ctab','members','♜')+
     '</section>'+
     (active.length?'<section class="nm85-progress"><b>Under construction</b><p>'+active.slice(0,2).map(p=>esc(p.label)+' · '+(p.phase==='permit'?'Permit pending':p.left+' weeks left')).join(' · ')+'</p><button class="tbtn" data-act="tab" data-arg="build">Manage upgrades ›</button></section>':'<section class="nm85-progress"><b>Improve your club</b><p>Invest in facilities to build long-term strength and income.</p><button class="tbtn" data-act="tab" data-arg="build">Explore upgrades ›</button></section>')+
     (last?'<button class="nm85-news" data-act="v183paper" data-arg="'+esc(last.key)+'"><span class="nm85-kicker">THE NORTHMARCH ECHO · WEEK '+last.w+'</span><b>'+esc(last.matches[0]?.headline||'Your club this week')+'</b><span>Weekly news and accounts ›</span></button>':'')+
     '<details class="nm85-details"><summary>Full reports, transfer planning and club signals</summary>'+previousWeek()+'</details></div>';
 };
})();
