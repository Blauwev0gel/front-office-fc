/* ================= Rendering ================= */
const crest=`<svg class="crest" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2 L31 7 V17 C31 25 24 30 17 32 C10 30 3 25 3 17 V7 Z" fill="var(--navy)"/><path d="M8 22 L14 12 L18 18 L21 14 L26 22" stroke="var(--signal)" stroke-width="2.6" fill="none" stroke-linejoin="round"/><path d="M8 25 H26" stroke="var(--onnavy)" stroke-width="2"/></svg>`;
function topBar(){
  const c=S.my?C():null;
  const title=c?c.name:'The Northmarch';
  const sub=!c?`Season ${S.season} · Between clubs`:S.phase==='alv'?"Members' corner · The AGM":S.phase==='summer'?`Season ${S.season} · Summer`:!S.week?`Season ${S.season} · Pre-season`:`Week ${S.week} · ${ord(myPos())} in the ${c.tier===0?'Premier':'One'}`;
  return`<header class="top">${c&&c.col?crestSVG(c,40):crest}<div class="grow"><div class="club">${esc(title)}</div><div class="sub">${esc(sub)}</div></div>${S.phase!=='title'&&!(S.screen==='week')?'<button class="tbtn" style="border-color:var(--onclub);color:var(--onclub)" data-act="ov" data-arg="region">Region</button>':''}</header>`;
}
function face(pid){return personPortrait(pid,48)}
function whoRow(pid){const p=P(pid);const where=p.club?CL(p.club).name:p.role==='journalist'?'The Northmarch Echo':'Out of work';return`<div class="who">${face(pid)}<div><b>${esc(p.name)}</b><span>${esc(ROLE_WORD[p.role]||p.role)} · ${esc(where)}</span></div></div>`}
function dealHTML(c,i){
  const act=S.screen==='elect'?'electCard':'card';
  if(c.none)return`<button class="deal none" data-act="${act}" data-arg="${i}"><span class="dt">No deal</span><span class="muted small">${esc((s=>s.charAt(0).toUpperCase()+s.slice(1))(c.fail.replace(/^If you do nothing: /,'')))}</span></button>`;
  const give=c.give&&c.give!=='—'?c.give:'',get=c.get&&c.get!=='—'?c.get:'';
  return`<button class="deal" data-act="${act}" data-arg="${i}"><span class="dt">${esc(c.t)}</span>${c.hit?`<span class="hit">${esc(c.hit)}</span>`:''}
  <span class="trade">${give?`<span><i>You give</i>${esc(give)}</span>`:''}${get?`<span><i>You get</i>${esc(get)}</span>`:''}</span>
  <span class="tags">${c.test&&c.test!=='—'?`<span class="tag2">${esc(c.test)}</span>`:''}${c.fail&&c.fail!=='—'&&!c.warn?`<span class="tag2 risk">${esc(c.fail)}</span>`:''}${c.warn?`<span class="tag2 warnt">⚠ ${esc(c.warn)}</span>`:''}</span></button>`;
}
function arrow(k){const g=grpOf(k);const d=g.mood-((S.prevMood||{})[k]??g.mood);return d>=6?'<span class="up">↑↑</span>':d>0?'<span class="up">↑</span>':d<=-6?'<span class="down">↓↓</span>':d<0?'<span class="down">↓</span>':''}
function moodsPanel(title){return`<div class="panel">${title?`<p class="eyebrow">${title}</p>`:''}${C().groups.map(g=>`<div class="row"><span>${esc(gname(C(),g.k))} <span class="small muted">${g.share}%</span></span><span class="mood">${moodWord(g.mood)} ${arrow(g.k)}</span></div>`).join('')}</div>`}
const PRIMARY=['call','toEnvelope','crisisDone','sumNext','play','next','windowDone','mdone','meetNext','arrive','alvLobby','lobbyDone','toEnd','nextSeason','summerNext','toSeats','framesDone'];
let LAST_VIEW='';
function render(){
  if(!HAS_DOM)return;const $=document.getElementById('app');
  if(location.hash==='#style'){$.setAttribute('style','');$.innerHTML=styleView();document.body.classList.add('noNav');return}
  if(!S||S.screen==='title'){$.setAttribute('style','');$.innerHTML=titleView();document.body.classList.add('noNav');return}
  if(S.my&&!C().col)assignClubColours();
  if(S.screen==='prologue')S.screen='call';if(S.seats&&S.seats.length&&!S.seats[0].label)dressSeats();
  const v={call:callView,sign:signView,signed:signedView,envelope:envelopeView,crisis:crisisView,seats:seatsView,arrival:arrivalView,manifest:manifestView,week:weekView,meeting:meetingView,sit:sitView,hire:hireView,result:resultView,frames:framesView,window:windowView,tdhire:tdHireView,tsum:tsumView,alv:alvView,summer:summerView}[S.screen];
  const nav=S.screen==='week';UI.t=UI.t||'club';
  let body=v?v():'';
  body=body.replace(/class="btn( ghost)?" data-act="([a-zA-Z]+)"/g,(m,g,a)=>PRIMARY.includes(a)?`class="btn${g||''} primary" data-act="${a}"`:m);
  const key=S.screen+(nav?UI.t:'')+(S.sit??'');const enter=key!==LAST_VIEW?' enter':'';LAST_VIEW=key;
  $.setAttribute('style',S.my&&C().col?clubVars(C()):'');
  document.body.classList.toggle('noNav',!nav);
  $.innerHTML=topBar()+`<main class="${enter.trim()}">${body}</main>`+(nav?tabBar():'')+(UI.over?overlayView():'');
}
const TAB_ICON={staff:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 4h6v3H9zM8 11h8M8 14h8M8 17h5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',club:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v8c0 5-4 7.5-8 8.5C8 19.5 4 17 4 12z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
 post:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
 room:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3l-4 3 2 4 2-1v12h8V9l2 1 2-4-4-3c-1 2-3 2-4 2s-3 0-4-2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
 members:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 20c0-4 2.5-6 5-6s5 2 5 6M11 20c0-4 2.5-6 5-6s5 2 5 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>'};
function tabBar(){const open=S.desk?S.desk.filter(s=>!s.done).length:0;
  return`<nav class="tabbar" aria-label="Club">${[['club','Club'],['post','In the post'],['room','Squad'],['staff','Staff'],['members','Members']].map(([k,n])=>`<button class="tab${UI.t===k?' on':''}" data-act="tab2" data-arg="${k}" aria-current="${UI.t===k?'page':'false'}">${TAB_ICON[k]}<span>${n}</span>${k==='post'&&open?`<span class="badge">${open}</span>`:''}</button>`).join('')}</nav>`}
function echoBox(date,head,lines){return`<article class="echo"><div class="mast"><b>THE NORTHMARCH ECHO</b><span>${esc(date)}</span></div><div class="head">${esc(head)}</div><ul>${lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul></article>`}
function personLine(pid){const p=P(pid);if(!p||p.loy==null&&!p.mem.length)return'';const rel=p.rel.filter(r=>P(r.id)).slice(0,2).map(r=>`${r.type==='protégé'?'mentor of':r.type==='mentor'?'protégé of':r.type==='friends'?'friends with':r.type==='rivals'?'rivals with':'related to'} ${P(r.id).name}`).join('; ');
  return`<p class="small muted">${esc(p.name)}: ${p.traits.join(', ')}. ${band(p.loy)} with you${p.owes?', owes you a favour':''}${p.withOpp?', in the opposition camp':''}.${rel?' '+esc(rel.charAt(0).toUpperCase()+rel.slice(1))+'.':''}${p.deepKnown?` Values ${VALUE_WORD[p.value]}; wants ${esc(p.deep)}.`:''}</p>`}
function bubbles(sc){
  return sc.lines.filter(Boolean).map(l=>{const m=l.match(/^([A-Z][A-Za-z'.\- ]+): "(.*)"$/s);let pid=null,txt=l,quote=false;
    if(m){pid=sc.who.find(x=>P(x)&&P(x).name===m[1]);txt=m[2];quote=true}else if(l.startsWith('"')){pid=sc.who[0];txt=l.replace(/^"|"$/g,'');quote=true}
    if(!quote)return`<p class="narr">${esc(l)}</p>`;
    const p=pid&&P(pid);return`<div class="bubble">${p?face(pid).replace('class="face','class="face sm'):''}<div class="bb"><b>${p?esc(p.name):''}</b><p>${esc(txt)}</p></div></div>`}).join('');
}
function miniPlayer(id){const p=playerById(id);if(!p)return'';return`<button class="mini" data-act="player" data-arg="${p.id}"><span class="row"><b>${esc(p.name)}</b><span class="small muted">${POS_ONE[p.pos]} · ${p.age}</span></span><span class="small">${qWord(p.q)}, ${phaseWord(p)} · from ${esc(p.home)}</span><span class="small muted">${esc(p.story)}</span>${spark(p)}</button>`}
function spark(p){const h=p.formHist||[];if(!h.length)return'';return`<span class="spark" aria-label="recent form">${h.map(v=>`<i style="height:${Math.max(4,Math.round((v-30)/60*22))}px" class="${v>=70?'hi':v<50?'lo':''}"></i>`).join('')}</span>`}
function sitView(){
  const sc=sitBuild(S.sit);sc.who.forEach(x=>{if(P(x)&&P(x).role!=='talent')meet(x)});
  return`<p class="eyebrow">In the post</p><h2>${esc(sc.title)}</h2>${sc.player?miniPlayer(sc.player):''}<section class="scene">${bubbles(sc)}</section>
  <details class="who-more"><summary>Who is involved</summary>${sc.who.filter(x=>P(x)).map(x=>whoRow(x)+personLine(x)).join('')}</details>
  <p class="eyebrow">On the table</p><div class="stack">${sceneCards(sc).map(dealHTML).join('')}</div><button class="btn ghost" data-act="back">Back to the week</button>`;
}
function hireView(){
  const list=S.hire.map(pid=>{const p=P(pid);const m=p.mem[p.mem.length-1];const past=p.career.length?`Past: ${p.career.map(x=>CL(x).name).join(', ')}.`:'No league experience.';
    return`<button class="choice" data-act="hire" data-arg="${pid}"><b>${esc(p.name)}</b><span class="meta">${p.traits.join(', ')} · values ${VALUE_WORD[p.value]} · ${p.age}</span><span class="meta">${esc(past)}${m?` Remembers you: ${esc(m.txt)}.`:''}</span></button>`}).join('');
  return`<p class="eyebrow">The coaches available</p><h2>Who takes the job?</h2><p>These are the coaches out of work in the Northmarch right now.</p><div class="stack">${list}</div>`;
}
function verdict(p){return p>=75?'Overwhelmingly for':p>=58?'Clearly for':p>=50?'Narrowly for':p>=42?'Narrowly against':p>=25?'Clearly against':'Overwhelmingly against'}
function alvView(){
  const A=S.alv,c=C();
  if(A.step==='report'){const rows=A.report.map(r=>`<div class="row"><span>${esc(pdef(r.id).t)}</span><span class="mood ${r.res==='kept'?'up':r.res==='broken'?'down':''}">${r.res==='kept'?'Kept':r.res==='broken'?'Broken':'Void'}</span></div>`).join('<hr>')||'<p>You promised nothing.</p>';
    return`<p class="eyebrow">June · ${esc(c.name)}</p><h2>The annual report</h2><p>Final position: ${ord(myPos())}, ${S.tbl[S.my].pts} points. ${luckWord()}.</p><div class="panel">${rows}</div>${A.verdict?`<div class="panel"><p class="eyebrow">Your verdict on ${esc(P(cast('td')).name)}</p><p>${esc(A.verdict.txt)}: <b class="${A.verdict.ok?'up':'down'}">${A.verdict.ok?'Met':'Missed'}</b></p></div>`:''}${moodsPanel('How they walk in')}<button class="btn" data-act="alvLobby">Into the corridor</button>`}
  if(A.step==='lobby'){
    const opts=[...A.motions.map(m=>({id:m.id,t:`Back the ${gname(c,m.by)} motion`,d:`"${m.t}". ${gname(c,m.by)} warm to you${m.against&&grpOf(m.against)?`; ${gname(c,m.against)} see the deal`:''}.${m.anti?' It limits your own power.':''} If it passes, it binds the club.`})),
      ...(!S.flags.weakSeat?[{id:'seat',t:`Offer ${gname(c,S.oppGroup)} a seat with a veto`,d:'They join the table. Your big decisions go past them from now on.'}]:[])];
    return`<p class="eyebrow">The corridor, 7.45pm</p><h2>Motions and deals</h2><p>Binding motions tonight${A.two?', and the statute demands two-thirds':''}:</p><ul class="log">${A.motions.map(m=>`<li><b>${esc(gname(c,m.by))}:</b> ${esc(m.t)}</li>`).join('')}</ul><p>Make as many deals as you like. Everyone in the hall will know about each one.</p>
    <div class="stack">${opts.map(o=>`<label class="check${UI.lobby[o.id]?' on':''}" for="lb-${o.id}"><input type="checkbox" id="lb-${o.id}" data-lobby="${o.id}" ${UI.lobby[o.id]?'checked':''}><span><b>${esc(o.t)}</b><br><span class="small muted">${esc(o.d)}</span></span></label>`).join('')}</div><button class="btn" data-act="lobbyDone">Into the hall</button>`}
  if(A.step==='speech'){const opp=P(cast('opp'));
    const sp=A.speakers.map(s=>`<div class="stack" style="gap:6px">${whoRow(s.id)}<p class="voice">${esc(s.line)}</p></div>`).join('<hr>')||'<p class="muted">Nobody stands up for you, and nobody against.</p>';
    const res=A.motions.map(m=>`<div class="row"><span>${esc(m.t)}</span><span class="mood ${m.pass?'up':'down'}">${m.pass?'Carried':'Defeated'}</span></div>`).join('');
    const cand=A.candidate?`<div class="stack" style="gap:6px">${whoRow(opp.id)}<p class="voice">"Count the chairman's promises. Then vote for someone who delivers."</p></div>`:'<p>No one stands against you. Tonight is a vote of confidence.</p>';
    const defs=[['wrong','"Where I fell short, I was wrong."','Nothing changes tonight. Your next manifest will be believed.'],['luck','"We were unlucky."',luck()==='unlucky'?'True this season. They may accept it.':'The table says otherwise.'],['success','"Look at what worked."','Point to what you delivered. Some will call it changing the subject.'],['blame','"The coach let us down."',`${P(cast('coach')).name} hears every word.`]];
    return`<p class="eyebrow">The hall</p><h2>Motions and voices</h2><div class="panel">${res}</div><div class="panel">${sp}</div><div class="panel"><p class="eyebrow">${A.candidate?'Your opponent':'No challenger'}</p>${cand}</div><p class="eyebrow">Your speech</p><div class="stack">${defs.map(d=>`<button class="choice" data-act="defend" data-arg="${d[0]}"><b>${esc(d[1])}</b><span class="meta">${esc(d[2])}</span></button>`).join('')}</div>`}
  if(A.step==='count'){const order=c.groups.slice().sort((a,b)=>a.mood-b.mood);const won=A.result.won;
    return`<p class="eyebrow">The count</p><h2>${A.candidate?`You or ${esc(P(cast('opp')).name)}`:'Confidence in the chairman'}</h2><div class="count">${order.map(g=>`<div class="cg panel"><div class="row"><b>${esc(gname(c,g.k))}</b><span class="mood">${verdict(g.mood)}</span></div><div class="bar"><i style="width:${Math.round(g.mood)}%"></i></div></div>`).join('')}</div>
    <div class="verdict stack"><p class="big ${won?'up':'down'}">${won?'Re-elected':'Voted out'}</p><p>${won?'The members keep you. What you gave away tonight now binds the club.':'Your time here is over. Your reputation goes with you.'}</p><button class="btn" data-act="toEnd">The season in full</button></div>`}
  if(A.step==='end'){const kept=S.promises.filter(p=>p.st==='kept').length,broken=S.promises.filter(p=>p.st==='broken').length;
    const ppl=['coach','td','captain','fan','opp'].map(cast).filter(x=>x&&P(x).loy!=null).map(x=>`<div class="row small"><span>${esc(P(x).name)}<br><span class="muted">${esc(ROLE_WORD[P(x).role])}</span></span><span class="mood">${band(P(x).loy)}${P(x).withOpp?' · with the opposition':''}</span></div>`).join('');
    return`<p class="eyebrow">End of season ${S.season}</p><h2>${A.result.won?'Chairman for another year':'Former chairman of '+esc(c.name)}</h2><p>${ord(myPos())} with ${S.tbl[S.my].pts} points. Promises kept: ${kept}. Broken: ${broken}.</p>
    ${c.binding.length||A.motions.some(m=>m.pass)?`<div class="panel"><p class="eyebrow">What binds the club</p><ul class="log">${A.motions.filter(m=>m.pass).map(m=>`<li>${esc(m.t)}</li>`).join('')}${c.binding.map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div>`:''}
    <div class="panel"><p class="eyebrow">Your people</p>${ppl}</div><button class="btn" data-act="nextSeason">${A.result.won?'Into the summer':'Into the summer, without a club'}</button>`}
}
function summerView(){
  const news=S.news.filter(n=>n.s===S.season-1||n.s===S.season).sort((a,b)=>a.pri-b.pri).slice(0,5).map(n=>n.text);
  return`${echoBox('June',S.formerClub?`Life after ${CL(S.formerClub).name}`:'The summer',news.length?news:['A quiet summer in the Northmarch.'])}<p>The region moved on while you packed your desk. The people you met remember what you did.</p><button class="btn" data-act="summerNext">See the open seats</button>`;
}
function membersBody(){const c=C();const pr=S.promises.map(p=>`<div class="row small"><span>${esc(pdef(p.id).t)}</span><span class="mood">${p.st!=='open'?p.st:behind(p.id)?'Behind':'On track'}</span></div>`).join('')||'<p class="small muted">No promises.</p>';
  const st=standings(c.tier);return`<p class="eyebrow">Members' corner</p>${moodsPanel('The members')}<div class="panel"><p class="eyebrow">Chairman's notes</p>${pr}</div>${S.cf?moneyPanel()+mandatePanel():''}<div class="panel"><p class="eyebrow">The table</p>${st.map((id,i)=>`<div class="row small" style="font-variant-numeric:tabular-nums${id===S.my?';font-weight:700':''}${i===1?';border-bottom:2px solid var(--good)':''}${i===13?';border-bottom:2px solid var(--bad)':''}"><span style="display:flex;gap:8px;align-items:center">${i+1}. ${crestSVG(CL(id),20)} ${esc(CL(id).name)}</span><span>${S.tbl[id].pts}</span></div>`).join('')}</div><button class="btn ghost" data-act="ov" data-arg="region">The region, people and free agents</button>`}
function overlayView(){
  if(UI.over==='player')return playerOverlay();
  if(UI.over==='squad')return squadOverlay();
  if(UI.over==='table'){const c=C();
    const pr=S.promises.map(p=>`<div class="row small"><span>${esc(pdef(p.id).t)}</span><span class="mood">${p.st!=='open'?p.st:behind(p.id)?'Behind':'On track'}</span></div>`).join('')||'<p class="small muted">No promises.</p>';
    const ppl=['coach','td','captain','fan','opp'].map(cast).filter(Boolean).map(x=>{const p=P(x);return`<div class="row small"><span>${esc(p.name)}<br><span class="muted">${esc(ROLE_WORD[p.role])} · ${p.traits.join(', ')}</span></span><span class="mood">${band(p.loy)}${p.owes?' · owes you':''}${p.withOpp?' · with the opposition':''}</span></div>`}).join('<hr>');
    const fl=S.flags,deals=[fl.coachContract&&'Coach: two-year contract',fl.coachFinalSay&&'Coach has the final say',fl.tdFree&&'Director runs recruitment alone',fl.academy&&'A new academy',fl.captainSigned&&'Captain signed',fl.captainFuture&&'Captain: coaching future',fl.fanSeat&&'Supporters\' seat on the board',fl.fanName&&'A stand named for the supporters',fl.derbyCrowd&&'Free buses for the derby',fl.oppCommittee&&'Opposition chairs a committee',fl.truce&&'Truce with the opposition',fl.oppBoard&&'Opposition on the board',fl.council&&'Members\' council vets spending',fl.pressFriend&&'Exclusive given to the Echo',fl.pressHostile&&'Frozen out the Echo',fl.leagueVote&&`League vote with ${P(fl.leagueVote).name}`].filter(Boolean);
    return`<div class="overlay" role="dialog" aria-label="The table"><div class="inner"><div class="row"><h2>The table</h2><button class="tbtn" data-act="ov">Close</button></div><p class="muted small">${S.round?`${ord(myPos())} after round ${S.round}. `:''}Money: ${moneyWord(c.cash)}${c.debt?`, £${c.debt}k debt`:''}.</p>
    ${S.cf?moneyPanel():''}<div class="panel"><p class="eyebrow">Your promises</p>${pr}</div><div class="panel"><p class="eyebrow">Deals on the table</p>${deals.length?deals.map(d=>`<p class="small">${esc(d)}</p>`).join(''):'<p class="small muted">None yet.</p>'}</div>${moodsPanel('The members')}<div class="panel"><p class="eyebrow">Your people</p>${ppl}</div></div></div>`}
  const tabs=`<div class="tabs" role="tablist">${[['tables','Tables'],['free','Free agents'],['people','People you know'],['history','Your career']].map(([k,n])=>`<button class="${UI.tab===k?'on':''}" data-act="tab" data-arg="${k}">${n}</button>`).join('')}</div>`;
  let body='';
  if(UI.tab==='tables'){body=[0,1].map(t=>`<div class="panel"><p class="eyebrow">${t===0?'Northmarch Premier':'Northmarch One'}</p>${standings(t).map((id,i)=>`<div class="row small" style="font-variant-numeric:tabular-nums${id===S.my?';font-weight:600':''}"><span>${i+1}. ${esc(CL(id).name)}</span><span>${S.tbl[id].pts}</span></div>`).join('')}</div>`).join('')}
  if(UI.tab==='free'){const fa=S.fa||[];body=`<p class="small muted">${fa.length} players without a club in the Northmarch. They cost no fee, only wages, and can be signed in any week.</p>`+POS.map(pos=>{const ps=fa.filter(p=>p.pos===pos).sort((a,b)=>b.q-a.q);return`<div class="panel"><p class="eyebrow">${POS_L[pos]} <span class="muted">${ps.length}</span></p>${ps.slice(0,4).map(p=>`<div class="row small"><span><b>${esc(p.name)}</b> · ${p.age}<br><span class="muted">${qWord(p.q)}, ${esc(p.why)}</span></span><span class="mood">£${p.wage}/wk</span></div>`).join('')||'<p class="small muted">Nobody.</p>'}</div>`}).join('')}
  if(UI.tab==='people'){const known=Object.values(S.P).filter(p=>(p.loy!=null||p.mem.length)&&p.role!=='talent');body=`<div class="panel">${known.map(p=>`<div class="row small"><span>${esc(p.name)}<br><span class="muted">${esc(ROLE_WORD[p.role]||p.role)} · ${p.club?esc(CL(p.club).name):'out of work'}</span></span><span class="mood">${band(p.loy)}</span></div>`).join('<hr>')||'<p class="small muted">Nobody yet.</p>'}</div>`}
  if(UI.tab==='history'){body=`<div class="panel"><ul class="log">${S.history.map(h=>`<li><span class="num">S${h.s}</span> ${esc(h.txt)}</li>`).join('')}</ul></div><p class="small muted">Reputation: ${S.rep>=4?'a chairman who keeps promises':S.rep>=0?'mixed':'a chairman who breaks promises'}.</p>`}
  return`<div class="overlay" role="dialog" aria-label="The region"><div class="inner"><div class="row"><h2>The Northmarch</h2><button class="tbtn" data-act="ov">Close</button></div>${tabs}${body}</div></div>`;
}

/* ----- foundation screens ----- */
function weekView(){
  const fx=nextFixture(),open=S.desk.filter(s=>!s.done).length;
  const playBtn=`<button class="btn" data-act="play">${open?`Play Saturday · ${open} in the post`:'Play Saturday'}</button>`;
  if(UI.t==='post'){
    const desk=S.desk.map((s,i)=>{const sc=sitBuild(i);const f=sc.who.find(x=>P(x));const hook=(sc.lines.find(l=>l.includes('"'))||sc.lines[0]||'').replace(/^[A-Z][A-Za-z'.\- ]+: /,'');
      return s.done?`<div class="deskc done"><b>${esc(sc.title)}</b><span class="stamp${s.choice==='Left to run its course'||/^No deal/.test(s.choice)?' no':''}">${s.choice==='Left to run its course'?'NO DEAL':'AGREED'}</span><span class="meta">${esc(s.choice)}</span></div>`
        :`<button class="deskc" data-act="sit" data-arg="${i}">${f?personPortrait(f,44):crestSVG(C(),44)}<span class="dk"><b>${esc(sc.title)}</b><span class="meta clamp2">${esc(hook)}</span></span></button>`}).join('');
    return`<p class="eyebrow">In the post · Week ${S.week}</p>${S.desk.length?`<div class="stack">${desk}</div>`:'<p class="muted">Nothing in the post this week. Enjoy it.</p>'}${playBtn}`}
  if(UI.t==='room')return squadBody()+playBtn;
  if(UI.t==='members')return membersBody()+playBtn;
  if(UI.t==='staff')return staffBody()+playBtn;
  return`${coverView()}<p class="eyebrow">Club news</p>${feedView()}${fx?fixtureCard(fx):''}${playBtn}`;
}
function myForm(){return(S.myRes||[]).slice(-5).map(r=>`<span class="${r}">${r}</span>`).join('')}
function coverView(){const c=C(),t=S.tbl[S.my],f=S.cf&&S.cf.fin;
  return`<section class="cover">${crestSVG(c,96,true)}<div><h1>${esc(c.name)}</h1><p class="meta2">Founded ${c.founded} · ${c.tier===0?'Northmarch Premier':'Northmarch One'}</p><p class="meta2">${esc(c.ground)} · ${c.capacity.toLocaleString('en-GB')}</p></div></section>
  <div class="cover-stats"><div><i>Position</i><b>${S.week>1?ord(myPos()):'—'}</b></div><div><i>Form</i><span class="form">${myForm()||'<b>—</b>'}</span></div><div><i>Bank</i><b class="${c.cash<0?'down':''}">£${Math.round(c.cash)}k</b></div></div>`}
function resultView(){
  const m=S.last,c=C();const sc=m.scorers.length?m.scorers.join(', '):'none';
  const items=S.mlog.map(e=>`<li>${esc(e.text)} ${e.num?`<span class="num">${esc(e.num)}</span>`:''}<span class="why">${esc(e.why)}</span></li>`).join('');
  const st=standings(c.tier),p=st.indexOf(S.my);const around=st.slice(Math.max(0,p-2),Math.min(16,p+3));
  const tbl=around.map(id=>`<div class="row small" style="font-variant-numeric:tabular-nums${id===S.my?';font-weight:600':''}"><span>${st.indexOf(id)+1}. ${esc(CL(id).name)}</span><span>${S.tbl[id].pts} pts</span></div>`).join('');
  const prom=S.promises.filter(x=>x.st==='open').map(x=>`<div class="row small"><span>${esc(pdef(x.id).t)}</span><span class="mood ${behind(x.id)?'down':'up'}">${behind(x.id)?'Behind':'On track'}</span></div>`).join('');
  return`<p class="eyebrow">Week ${S.week} · Full time${m.derby?' · Derby':''}</p>
  <div class="board${m.pts===3?' celebrate':''}" role="img" aria-label="Full time"><span class="ft">FULL TIME</span><span class="t">${esc(m.home?c.name:CL(m.opp).name)}</span><span class="s">${m.home?m.gf:m.ga}</span><span class="t">${esc(m.home?CL(m.opp).name:c.name)}</span><span class="s" style="animation-delay:.25s">${m.home?m.ga:m.gf}</span></div>${m.pts===3?`<p class="small" style="display:flex;gap:8px;align-items:center">${crestSVG(c,28)} ${m.derby?'The town is ours tonight.':'The crowd sings all the way home.'}</p>`:''}
  ${(m.lines||[]).length?`<div class="panel"><p class="eyebrow">Moments</p>${m.lines.map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:''}
  ${(m.influence||[]).length?`<div class="panel yours"><p class="eyebrow">Your hand in it</p>${m.influence.map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:''}
  <div class="panel"><p class="eyebrow">Why</p>${m.why.map(w=>`<p>${esc(w)}</p>`).join('')}</div>
  ${items?`<div class="panel"><p class="eyebrow">What changed this week</p><ul class="log">${items}</ul></div>`:''}
  <div class="panel"><p class="eyebrow">The table</p>${tbl}</div>${prom?`<div class="panel"><p class="eyebrow">Your promises</p>${prom}</div>`:''}
  <button class="btn" data-act="next">${S.week>=30?'To the AGM':'Next week'}</button>`;
}
function frameChips(k,label){const cur=S.cf.frames[k];return`<div class="stack" style="gap:6px"><p class="small"><b>${label}</b></p><div class="tabs">${FRAME_OPTS[k].map(v=>`<button class="${v===cur?'on':''}" data-act="frame" data-arg="${k}:${v}" aria-pressed="${v===cur}">${k==='budget'?'£'+v+'k':k==='cap'?'£'+v+'/wk':esc(FRAME_WORD[v].split(':')[0])}</button>`).join('')}</div></div>`}
function framesPanel(){const td=P(S.cf.tdId);return`<div class="panel"><p class="eyebrow">Your frames for ${esc(td.name)}</p>${frameChips('budget','Transfer budget')}${frameChips('cap','Wage cap per player')}${frameChips('profile','Profile')}${frameChips('rule','House rule')}<p class="small muted">${esc(FRAME_WORD[S.cf.frames.profile])}. ${esc(FRAME_WORD[S.cf.frames.rule])}. Money: ${moneyWord(C().cash)}.</p></div>`}
function planPanel(){const plan=cfPlan(),td=P(S.cf.tdId);return`<div class="panel"><p class="eyebrow">${esc(td.name)}'s plan</p>${plan.length?`<ul class="log">${plan.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="small muted">No holes he is worried about.</p>'}<p class="small muted">${esc(td.name)}: ${td.traits.join(', ')}, values ${VALUE_WORD[td.value]}.</p></div>`}
function framesView(){return`<p class="eyebrow">Summer · Season ${S.season}</p><h2>Set the frames</h2><p>The director of football works inside these. You never pick a player.</p>${planPanel()}${framesPanel()}<button class="btn" data-act="framesDone">Open the summer window</button>`}
function windowView(){return`<p class="eyebrow">The summer window</p><h2>What ${esc(P(S.cf.tdId).name)} did</h2><div class="panel"><ul class="log">${S.windowLog.map(l=>`<li>${esc(l)}</li>`).join('')}</ul></div>${planPanel()}<p class="small muted">Team strength: ${qWord(squadQuality(S.cf.squad,0))}. Open the squad to see who plays where.</p><button class="btn" data-act="windowDone">Start the season</button>`}
function squadBody(){const sq=S.cf.squad,xi=pickXI(sq,S.youth),inXI=new Map(xi.map(x=>[x.p.id,x.slot]));
  return`<p class="eyebrow">The dressing room</p><p class="small muted">${sq.length} players. ● in the coach's eleven. Strength: ${qWord(squadQuality(sq,S.youth))}.</p>${planPanel()}${POS.map(pos=>{const ps=sq.filter(p=>p.pos===pos).sort((a,b)=>b.q-a.q);return`<div class="panel"><p class="eyebrow">${POS_L[pos]} <span class="muted">${ps.filter(p=>!p.loan&&p.inj<=0).length}/${REQ[pos]}</span></p>${ps.map(p=>`<button class="prow" data-act="player" data-arg="${p.id}"><span class="row small"><span style="display:flex;gap:10px;align-items:center">${playerPortrait(p,36)}<span>${inXI.has(p.id)?'● ':''}<b>${esc(p.name)}</b>${p.captain?' (c)':''} · ${p.age}<br><span class="muted">${qWord(p.q)}, ${phaseWord(p)}</span></span></span><span class="mood">${p.inj>0?`<span class="down">Injured</span>`:p.loan?'On loan':inXI.has(p.id)&&inXI.get(p.id)!==p.pos?`<span class="down">Plays ${inXI.get(p.id)}</span>`:''}</span></span></button>`).join('')||'<p class="small muted">Nobody.</p>'}</div>`}).join('')}`}
function squadOverlay(){
  const sq=S.cf.squad,xi=pickXI(sq,S.youth),inXI=new Map(xi.map(x=>[x.p.id,x.slot]));
  const rows=POS.map(pos=>{const ps=sq.filter(p=>p.pos===pos).sort((a,b)=>b.q-a.q);return`<div class="panel"><p class="eyebrow">${POS_L[pos]} <span class="muted">${ps.filter(p=>!p.loan&&p.inj<=0).length}/${REQ[pos]}</span></p>${ps.map(p=>`<button class="prow" data-act="player" data-arg="${p.id}"><span class="row small"><span>${inXI.has(p.id)?'● ':''}<b>${esc(p.name)}</b>${p.captain?' (c)':''} · ${p.age}<br><span class="muted">${qWord(p.q)}, ${phaseWord(p)} · ${p.contract>0?p.contract+'y':'loan'} · £${p.wage}/wk${p.trait?' · '+p.trait:''}</span></span><span class="mood">${p.inj>0?`<span class="down">Injured ${p.inj}w</span>`:p.loan?'On loan':inXI.has(p.id)&&inXI.get(p.id)!==p.pos?`<span class="down">Plays ${inXI.get(p.id)}</span>`:''}</span></span></button>`).join('')||'<p class="small muted">Nobody.</p>'}</div>`}).join('');
  return`<div class="overlay" role="dialog" aria-label="The squad"><div class="inner"><div class="row"><h2>The squad</h2><button class="tbtn" data-act="ov">Close</button></div><p class="small muted">${sq.length} players. ● means in the coach's eleven. Strength: ${qWord(squadQuality(sq,S.youth))}.</p>${moneyPanel()}${planPanel()}${mandatePanel()}${rows}</div></div>`;
}

/* ----- money, mandate, meeting, player profile ----- */
function moneyStrip(){if(!S.cf)return'';const c=C(),f=S.cf.fin;return`<div class="money" role="group" aria-label="Club money"><span><i>Bank</i><b>£${Math.round(c.cash)}k</b></span><span><i>Last week</i><b class="${f&&f.net<0?'down':'up'}">${f?(f.net>=0?'+':'−')+'£'+Math.abs(f.net)+'k':'—'}</b></span><span><i>Debt</i><b>£${c.debt}k</b></span></div>`}
function moneyPanel(){const c=C(),f=S.cf.fin||{inc:weeklyIncome(false),wb:wageBill(),interest:0,net:0},fc=seasonForecast();
  return`<div class="panel"><p class="eyebrow">Money · ${esc(P(cast('finance'))?.name||'Finance')}</p><div class="row small"><span>In the bank</span><b>£${Math.round(c.cash)}k</b></div><div class="row small"><span>Debt</span><b>£${c.debt}k</b></div><div class="row small"><span>Income per week</span><b>£${f.inc}k</b></div><div class="row small"><span>Wage bill per week</span><b>£${wageBill()}k</b></div><div class="row small"><span>Transfer budget left</span><b>£${Math.round(S.cf.budgetLeft)}k</b></div><p class="small muted">${fc<0?`On this course the club loses about £${-fc}k over a season.`:`On this course the club makes about £${fc}k over a season.`}</p></div>`}
function mandatePanel(){const F=S.cf.frames,ch=(k,v)=>{const pl=PILLARS.find(x=>x.k===k);const o=pl&&pl.opts.find(x=>x.v===v);return o?o.t:'—'};
  return`<div class="panel"><p class="eyebrow">Your mandate</p><div class="row small"><span>Ambition</span><b>${esc(ch('ambition',F.ambition))}</b></div><div class="row small"><span>Money</span><b>${esc(ch('risk',F.risk))}</b></div><div class="row small"><span>Identity</span><b>${esc(ch('identity',F.identity))}</b></div><div class="row small"><span>Wages</span><b>${esc(ch('wagehouse',F.wagehouse))}</b></div><div class="row small"><span>Selling</span><b>${esc(ch('sales',F.sales))}</b></div><div class="row small"><span>Judged on</span><b>${esc(ch('kpi',F.kpi))}</b></div>${(F.rules||[]).length?`<p class="small">Red lines: ${F.rules.map(r=>esc(ch('rules',r))).join('; ')}.</p>`:''}<p class="small muted">Budget £${F.budget}k · wage cap £${F.cap}/wk. You set the mandate each summer, with your staff.</p></div>`}
function meetingView(){
  const M=S.meeting;
  if(M.step===0){const v=staffVoices();return`<p class="eyebrow">Summer · The boardroom</p><h2>The summer meeting</h2><p>Your staff tell you what they want. Then you set the mandate: seven decisions only an owner makes.</p>${moneyStrip()}
    <section class="scene">${v.map(x=>`<div class="bubble">${face(x.pid).replace('class="face','class="face sm')}<div class="bb"><b>${esc(P(x.pid).name)} · ${esc(ROLE_WORD[P(x.pid).role])}</b><p>${esc(x.line.replace(/^"|"$/g,''))}</p></div></div>`).join('')}</section>${tdAssessment()}<button class="btn" data-act="meetNext">Set the mandate</button>`}
  if(M.step<=PILLARS.length){const pl=PILLARS[M.step-1];
    const opts=pl.opts.map(o=>{const r=['td','coach','finance'].map(role=>{const pid=staffPid(role);if(!pid||pl.multi)return'';let s=(o.like||[]).includes(role)?1:(o.dis||[]).includes(role)?-1:0;s+=valueLikes(role,pl.k,o.v);return s>0?`<span class="up">${esc(P(pid).name.split(' ')[0])} ↑</span>`:s<0?`<span class="down">${esc(P(pid).name.split(' ')[0])} ↓</span>`:''}).filter(Boolean).join(' · ');
      const on=pl.multi&&M.rules.includes(o.v);return`<button class="choice${on?' on':''}" data-act="mchoose" data-arg="${o.v}" ${pl.multi?`aria-pressed="${on}"`:''}><b>${pl.multi?(on?'✓ ':'')+'':''}${esc(o.t)}</b><span class="meta">${esc(o.d)}</span>${r?`<span class="meta">${r}</span>`:''}</button>`}).join('');
    return`<p class="eyebrow">The mandate · ${M.step} of ${PILLARS.length}</p><h2>${esc(pl.q)}</h2><div class="stack">${opts}</div>${pl.multi?`<button class="btn" data-act="meetNext">${M.rules.length?'Done':'No red lines'}</button>`:''}`}
  const ch=M.choice;const c=C();const pot=ch.risk==='balanced'?Math.max(10,c.cash*.25):Math.max(15,(c.cash+(ch.risk==='borrow'?80:0))*.65);const bud=Math.round(pot*AMB_F[ch.ambition]/5)*5;
  const moods=['td','coach','finance'].map(r=>staffPid(r)).filter(Boolean).map(pid=>`<div class="row small"><span>${esc(P(pid).name)}<br><span class="muted">${esc(ROLE_WORD[P(pid).role])}</span></span><span class="mood">${band(P(pid).loy)}</span></div>`).join('');
  return`<p class="eyebrow">The mandate</p><h2>What you decided</h2><div class="panel"><p>${esc(PILLARS[0].opts.find(o=>o.v===ch.ambition).t)}. ${esc(PILLARS[1].opts.find(o=>o.v===ch.risk).t)}. ${esc(PILLARS[2].opts.find(o=>o.v===ch.identity).t)}.</p><p class="small muted">That gives ${esc(P(cast('td')).name)} a budget of about £${bud}k${ch.risk==='borrow'?', with £80k borrowed':''}.</p></div><div class="panel"><p class="eyebrow">How your staff take it</p>${moods}</div><button class="btn" data-act="mdone">Open the summer window</button>`;
}
function playerOverlay(){const p=playerById(UI.pid);if(!p)return'';
  const stories=S.cf.events.filter(e=>e.kind==='story'&&e.pid===p.id).slice(-4).map(e=>`<li><span class="num">S${e.s} W${e.w}</span> ${esc(e.text)}</li>`).join('');
  return`<div class="overlay" role="dialog" aria-label="${esc(p.name)}"><div class="inner"><div class="row"><h2>${esc(p.name)}</h2><button class="tbtn" data-act="ov">Close</button></div>
  <p class="small muted">${POS_ONE[p.pos]} · ${p.age} · from ${esc(p.home)}${p.captain?' · captain':''}${p.academy?' · academy':''}</p>
  <div class="panel"><p>${esc(p.story)}</p><p class="small">Wants ${esc(WANTS[p.want]||'to play')}. Character: ${esc(p.trait)}. Mood: ${p.morale>=70?'happy':p.morale>=50?'settled':p.morale>=35?'unsettled':'unhappy'}.</p></div>
  <div class="panel"><p class="eyebrow">On the pitch</p><div class="row small"><span>Quality</span><b>${qWord(p.q)}, ${phaseWord(p)}</b></div><div class="row small"><span>Form</span>${spark(p)||'<b>—</b>'}</div><div class="row small"><span>This season</span><b>${p.sApps} games, ${p.sGoals} goals</b></div><div class="row small"><span>For the club</span><b>${p.apps} games, ${p.goals} goals</b></div><div class="row small"><span>Contract</span><b>${p.contract>0?p.contract+' year'+(p.contract>1?'s':''):'on loan'} · £${p.wage}/wk</b></div>${p.inj>0?`<p class="down small">Injured: ${p.inj} week${p.inj>1?'s':''}</p>`:''}</div>
  ${stories?`<div class="panel"><p class="eyebrow">His story so far</p><ul class="log">${stories}</ul></div>`:''}</div></div>`}

function arrivalView(){const c=C(),fan=P(cast('fan')),known=Object.values(c.cast).filter(x=>P(x)&&P(x).mem.length);
  return`<p class="eyebrow">Your first day · ${esc(c.name)}</p><h2>${esc(c.name)}</h2><p>${esc(TOWNS[c.town].n)}, founded ${c.founded}. Legend: ${esc(c.legend)}. Scar: ${esc(c.scar)}.</p>
  ${moneyStrip()}${moodsPanel('The members')}
  <div class="panel"><p class="eyebrow">The statute</p>${c.statute.map(s=>`<p class="small">${esc(s)}</p>`).join('')}</div>
  <section class="scene"><div class="bubble">${face(fan.id).replace('class="face','class="face sm')}<div class="bb"><b>${esc(fan.name)} · ${esc(ROLE_WORD[fan.role])}</b><p>Welcome, chairman. Here's what ${esc(gname(c,fan.infl))} want: ${esc(fan.deep)}.</p></div></div></section>
  ${known.length?`<p class="small muted">Already knows you: ${known.map(x=>esc(P(x).name)).join(', ')}.</p>`:''}
  <button class="btn" data-act="arrive">Write your manifest for the season</button>`}

/* ----- the feed and the fixture card ----- */
function formDots(id){const res=[];const tier=CL(id).tier;for(let r=Math.max(1,S.round-4);r<=S.round;r++){const f=S.fx[tier][r-1];if(!f)continue;const g=f.find(([h,a])=>h===id||a===id);if(!g)continue;res.push(g)}
  // results are not stored per match for AI clubs; use the table trend as an honest proxy
  const t=S.tbl[id];if(!t||!t.p)return'';const ppg=t.pts/t.p;return`<span class="small muted">${t.w}W ${t.d}D ${t.l}L</span>`}
function fixtureCard(fx){const c=C(),o=CL(fx.opp),derby=fx.opp===c.rival,ps=myPos(),po=posOf(fx.opp);
  const stake=derby?'The derby':Math.abs(ps-po)<=2&&ps<=4?'Top of the table':ps>=14&&po>=13?'Six-pointer at the bottom':'League match';
  const home=fx.home?c:o,away=fx.home?o:c,xi=S.cf?pickXI(S.cf.squad,S.youth):[];
  return`<section class="prog"><div class="band">Saturday 3pm · ${esc(home.ground||'')} · ${stake}</div><div class="vsrow"><div class="side">${crestSVG(home,64)}<b>${esc(home.name)}</b><span class="small muted">${ord(posOf(home.id))}</span></div><span class="vs">V</span><div class="side">${crestSVG(away,64)}<b>${esc(away.name)}</b><span class="small muted">${ord(posOf(away.id))}</span></div></div>
  ${xi.length?`<details><summary class="small" style="padding:0 12px 10px;min-height:44px;display:flex;align-items:center;cursor:pointer">Today's teamsheet</summary><ol class="teamsheet">${xi.map((x,i)=>`<li><b>${i+1}</b>${esc(lastName(x.p.name))}${x.p.pos!==x.slot?' <span class="down small">('+x.slot+')</span>':''}</li>`).join('')}</ol></details>`:''}</section>`}
function feedView(){
  const left=reactsLeft();
  const cards=(S.feed||[]).map(c=>{const p=c.pid?playerById(c.pid):null,r=(S.reacts||{})[c.id];
    const img=p?playerPortrait(p,44):c.src==='town'||c.src==='staff'?crestSVG(C(),40):`<span class="face sm src-${c.src}" aria-hidden="true">◆</span>`;const wt=['debut','firstGoal','winner','comeback','hundred','lastSeason'].includes(c.kind)?' heavy':['weather','groundsman','volunteers','physio','pubTalk','leader'].includes(c.kind)?' small':'';
    const btns=!r&&canReact(c)&&left>0?`<span class="reacts">${p?`<button class="rbtn" data-act="react" data-arg="${c.id}|note">Send a note</button>`:''}<button class="rbtn" data-act="react" data-arg="${c.id}|echo">Say it in the Echo</button></span>`:'';
    return`<article class="fcard${wt}${c.follow?' follow':''}">${img}<div class="fc"><span class="fsrc">${FEED_SRC[c.src]}${c.follow?' · Follow-up':''}</span>${p?`<button class="fhead linkish" data-act="player" data-arg="${p.id}">${esc(c.head)}</button>`:`<b class="fhead">${esc(c.head)}</b>`}<p>${esc(c.line)}</p>${r?`<p class="reply">${r.type==='note'?'✉':'📰'} ${esc(r.reply)}</p>`:btns}</div></article>`}).join('');
  return`<section class="feed" aria-label="This week">${cards||'<p class="small muted">A quiet week.</p>'}${left<2&&left>=0?`<p class="small muted">${left} reaction${left===1?'':'s'} left this week.</p>`:''}</section>`;
}

function styleView(){if(!S)act('new',7);const ids=Object.keys(S.clubs);
  return`<main style="padding-top:16px"><h1>Northmarch style</h1><p>Every club's crest, kit and colours, generated from the seed. Portraits below.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:12px">${ids.map(id=>{const c=CL(id);return`<div style="display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center">${crestSVG(c,72,true)}${kitSVG(c,48)}<span class="small">${esc(c.name)}</span></div>`}).join('')}</div>
  <h2>Portraits</h2><div style="display:flex;flex-wrap:wrap;gap:8px">${Object.keys(S.P).slice(0,24).map(id=>personPortrait(id,64)).join('')}</div>
  <h2>Stadium</h2>${stadiumSVG(CL(ids[0]),.7)}</main>`}
