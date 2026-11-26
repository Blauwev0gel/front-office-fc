/* ================= Screens: watch the match (text commentary brought to life) =================
   Tells the match that has already been played (sim/commentary.js matchStory). The chairman watches; he does not coach.
   The clock, ball, pressure strip, statistics and commentary run on a timer that redraws only the live blocks. */
const LIVE_KEY='northmarch-layered-live';
/* the match is the payoff of the week: it opens live by default; one tick in the overlay turns that off (and is remembered) */
function liveAutoGet(){try{return localStorage.getItem(LIVE_KEY)!=='0'}catch(e){return true}}
function liveAutoSet(v){try{localStorage.setItem(LIVE_KEY,v?'1':'0')}catch(e){}}
function liveOpen(i){const m=myMatches()[i];if(!m)return;const story=matchStory(m);UI.live={i,story,min:0,acc:0,hold:0,playing:true,speed:UI.autoLive?3:1,end:story.events[story.events.length-1].min};UI.over='live'}
function liveMinLabel(e){return e.t==='start'?'KO':e.t==='half'?'HT':e.t==='end'?'FT':e.t==='pens'?'PEN':e.min>90?`90+${e.min-90}'`:`${e.min}'`}
function liveClock(L){return L.min<=0?'Kick-off':L.min>=L.end?'Full time':L.min>90?`90+${L.min-90}'`:`${L.min}'`}
function liveAt(L){
  const evs=L.story.events.filter(e=>e.min<=L.min),sh={h:0,a:0,on:{h:0,a:0},xg:{h:0,a:0}};
  for(const e of evs){if(e.t==='goal')sh[e.side]++;if(e.side&&['goal','save','off','block','post','miss'].includes(e.t)){sh[e.side+'n']=(sh[e.side+'n']||0)+1;if(['goal','save','post'].includes(e.t))sh.on[e.side]++;sh.xg[e.side]+=e.xg}}
  const mm=L.story.mom.slice(0,Math.max(1,Math.min(90,L.min))),avg=mm.reduce((a,v)=>a+v,0)/mm.length,ph=Math.round(clamp(50+(avg-.5)*60,25,75));
  return{evs,gh:sh.h,ga:sh.a,shots:[sh.hn||0,sh.an||0],on:[sh.on.h,sh.on.a],xg:[r1(sh.xg.h),r1(sh.xg.a)],poss:[ph,100-ph]};
}
function liveTop(L){
  const A=liveAt(L),n=L.story.names,fin=L.min>=L.end;
  return`<div class="lvscore"><span class="lvt">${esc(n.h)}</span><b aria-label="Score">${A.gh}–${A.ga}</b><span class="lvt">${esc(n.a)}</span></div>
  <p class="lvclock" role="status">${esc(liveClock(L))}</p><div class="bar lvprog" role="img" aria-label="Match progress"><i style="width:${Math.min(100,Math.round(L.min/Math.max(90,L.end)*100))}%"></i></div>
  ${fin&&L.story.pens?`<p class="small" style="text-align:center"><b>${esc(n[L.story.pens.h>L.story.pens.a?'h':'a'])} win on penalties, ${Math.max(L.story.pens.h,L.story.pens.a)}–${Math.min(L.story.pens.h,L.story.pens.a)}</b></p>`:''}`;
}
function liveMom(L){
  const m=L.story.mom,t=Math.min(90,L.min);let bars='';
  for(let i=0;i<t;i++){const v=m[i]-.5,h=Math.min(46,Math.abs(v)*170);bars+=`<rect x="${i+.1}" y="${v>=0?50-h:50}" width=".8" height="${Math.max(.6,h)}" fill="${v>=0?'var(--signal)':'var(--muted)'}"/>`}
  let marks='';for(const e of L.story.events)if(e.t==='goal'&&e.min<=L.min){const x=Math.min(89.5,e.min)+.5;marks+=`<rect x="${x-.9}" y="${e.side==='h'?0:88}" width="1.8" height="12" fill="var(--ink)"/>`}
  return`<svg viewBox="0 0 90 100" preserveAspectRatio="none" role="img" aria-label="Who is on top, minute by minute: upper half ${esc(L.story.names.h)}, lower half ${esc(L.story.names.a)}"><line x1="0" y1="50" x2="90" y2="50" stroke="var(--line)" stroke-width=".6"/>${bars}${marks}</svg>`;
}
function liveStats(L){
  const A=liveAt(L),row=(k,a,b)=>`<div class="lvstat"><b>${a}</b><span>${k}</span><b>${b}</b></div>`;
  return row('Shots',A.shots[0],A.shots[1])+row('On target',A.on[0],A.on[1])+row('Expected goals',A.xg[0].toFixed(1),A.xg[1].toFixed(1))+row('Possession',A.poss[0]+'%',A.poss[1]+'%');
}
function liveFeed(L){
  const evs=liveAt(L).evs.slice().reverse();
  return evs.map((e,i)=>`<div class="lvrow ${e.t==='goal'?'goal':''} ${i===0?'now':''}"><b class="lvmin">${liveMinLabel(e)}</b><span>${e.t==='goal'?'<b>⚽ ':''}${esc(e.text)}${e.t==='goal'?'</b>':''}${e.t==='pens'&&L.story.pens?`<br><small class="muted">${L.story.pens.seq.map(s=>esc((s.side==='h'?L.story.names.h:L.story.names.a).split(' ')[0]+': '+s.text)).join(' ')}</small>`:''}</span></div>`).join('');
}
function liveBall(L){const e=liveAt(L).evs.slice(-1)[0]||{x:50,y:50};return{x:e.x??50,y:e.y??50,goal:e&&e.t==='goal'&&L.hold>0}}
function liveControls(L){
  const fin=L.min>=L.end;
  return fin?`<button class="btn" data-act="ov">Back to the club</button>`:
  `<div class="lvctl"><button class="btn ${L.playing?'ghost':''}" data-act="lv" data-arg="pp" aria-pressed="${L.playing}">${L.playing?'Pause':'Play'}</button>${[1,2,4].map(s=>`<button class="btn ghost ${L.speed===s?'on':''}" data-act="lv" data-arg="s${s}" aria-pressed="${L.speed===s}">${s}×</button>`).join('')}<button class="btn ghost" data-act="lv" data-arg="skip">Skip to full time</button></div>`;
}
function liveView(){
  const L=UI.live;if(!L)return'';const b=liveBall(L);
  return`<div class="overlay live" role="dialog" aria-modal="true" aria-label="The match"><div class="inner">
  <div class="row"><p class="eyebrow">${esc(L.story.names.h)} v ${esc(L.story.names.a)}</p><button class="tbtn" data-act="ov">Close</button></div>
  <div id="lvTop">${liveTop(L)}</div>
  <div class="lvpitch${b.goal?' flash':''}" id="lvPitch"><svg viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="98" height="62" rx="1"/><line x1="50" y1="1" x2="50" y2="63"/><circle cx="50" cy="32" r="8"/><rect x="1" y="16" width="14" height="32"/><rect x="85" y="16" width="14" height="32"/><rect x="1" y="25" width="5" height="14"/><rect x="94" y="25" width="5" height="14"/></svg><i class="lvball" id="lvBall" style="left:${b.x}%;top:${b.y}%"></i><span class="lvside l">${esc(L.story.names.h)} attack →</span><span class="lvside r">← ${esc(L.story.names.a)} attack</span></div>
  <div class="panel"><p class="eyebrow">Who is on top</p><div class="lvmom" id="lvMom">${liveMom(L)}</div><p class="note">Above the line: ${esc(L.story.names.h)}. Below: ${esc(L.story.names.a)}. A dark bar marks a goal.</p></div>
  <div id="lvCtl">${liveControls(L)}</div>
  <div class="panel" id="lvStats">${liveStats(L)}</div>
  <div class="panel"><p class="eyebrow">Commentary</p><div id="lvFeed" role="log">${liveFeed(L)}</div></div>
  <label class="lvauto"><input type="checkbox" data-act="lv" data-arg="auto" ${UI.autoLive?'checked':''}> Open my match live after Play</label>
  <p class="note">The result was decided by the match engine before you opened this. Watching changes nothing; you cannot coach from the chair.</p></div></div>`;
}
/* redraw only the live blocks, so the ball can glide and the page does not jump */
function liveUpdate(){
  const L=UI.live;if(!HAS_DOM||!L||UI.over!=='live')return;const set=(id,h)=>{const el=document.getElementById(id);if(el)el.innerHTML=h};
  set('lvTop',liveTop(L));set('lvMom',liveMom(L));set('lvStats',liveStats(L));set('lvFeed',liveFeed(L));
  const b=liveBall(L),ball=document.getElementById('lvBall'),pit=document.getElementById('lvPitch');if(ball){ball.style.left=b.x+'%';ball.style.top=b.y+'%'}if(pit)pit.classList.toggle('flash',b.goal);
  const ctl=document.getElementById('lvCtl');if(ctl&&L.min>=L.end&&!ctl.dataset.fin){ctl.innerHTML=liveControls(L);ctl.dataset.fin='1'}
}
function liveTick(){
  const L=UI.live;if(!L||UI.over!=='live'||!L.playing||L.min>=L.end)return;
  if(L.hold>0){L.hold--;return}
  L.acc+=L.speed;if(L.acc<4)return;L.acc=0;L.min++;
  const hit=L.story.events.some(e=>e.min===L.min&&e.t==='goal');if(hit)L.hold=Math.round(16/L.speed);
  liveUpdate();
}
function liveAct(arg){
  const L=UI.live;if(arg==='auto'){UI.autoLive=!UI.autoLive;liveAutoSet(UI.autoLive);return}
  if(!L)return;
  if(arg==='pp')L.playing=!L.playing;else if(arg==='skip'){L.min=L.end;L.hold=0}else if(/^s\d$/.test(arg))L.speed=+arg.slice(1)
}
UI.autoLive=HAS_DOM?liveAutoGet():false;
if(HAS_DOM)setInterval(()=>{if(UI.over==='live')liveTick()},120);
