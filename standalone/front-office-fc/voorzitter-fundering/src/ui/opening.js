/* ================= Screens of the opening ================= */
function titleView(){let has=false;try{has=!!localStorage.getItem(SAVE_KEY)}catch(e){}
  return`<main class="ttl"><div class="ttl-sky" aria-hidden="true"><span class="tw l"></span><span class="tw r"></span><svg class="ttl-town" viewBox="0 0 390 120" preserveAspectRatio="none"><path d="M0 70l20-8 14 6 18-20 16 14 22-6 18 10 26-30 20 22 24-8 16 12 30-18 22 16 18-6 26 14 20-10 24 12 16-8 20 6v68H0z" fill="#1c2229"/><path d="M0 92h390v28H0z" fill="#0b0e11"/></svg></div>
  <div class="ttl-b"><span class="lbl ttl-k">The Northmarch · 32 clubs</span><h1>The Chairman</h1><p>Thirty-two clubs. One of them is about to become yours.</p>
  <button class="btn gold" data-act="new">Begin</button>${has?'<button class="btn ghost on-dark" data-act="continue">Continue your career</button>':''}</div></main>`}
function callView(){
  const msgs=S.seats.map(s=>{const c=CL(s.id);return`<div class="msg">${crestSVG(c,40)}<span><b>${esc(c.name)}</b><i>"${esc(SEAT_QUOTE[s.label]||SEAT_QUOTE.dark)}"</i></span></div>`}).join('');
  return`<p class="eyebrow">Tuesday night · your phone</p><h2 class="big-h">Nobody in football knows you</h2><p>You made your money elsewhere. Tonight, that changes.</p>
  <div class="field"><label class="lbl" for="nm">Your name</label><input id="nm" value="${esc(S.name||'Alex Whitmore')}" maxlength="28" autocomplete="off"></div>
  <div class="msgs">${msgs}</div><button class="btn" data-act="call">Open the dossiers · ${S.seats.length}</button>`}
function dossierCard(s,i){const c=CL(s.id),r=CL(c.rival);
  return`<article class="dos" style="${clubVars(c)}"><div class="dos-top">${crestSVG(c,64)}<div><b>${esc(c.name)}</b><span class="dos-town">${esc(TOWNS[c.town].n)} · founded ${c.founded}</span><span class="dos-tag">${esc(SEAT_LABELS[s.label])}</span><span class="dos-stars" aria-label="difficulty ${s.stars} of 5">${'★'.repeat(s.stars)}${'☆'.repeat(5-s.stars)}</span></div></div>
  <div class="dos-mid"><p>${esc(s.pitch)}</p>
   <div class="chips"><span class="chipr">${ord(c.last)} in the ${c.tier===0?'Premier':'One'}</span><span class="chipr good">£${Math.round(c.cash)}k</span>${c.debt?`<span class="chipr bad">£${c.debt}k debt</span>`:'<span class="chipr good">No debt</span>'}${r?`<span class="chipr">Rival: ${esc(r.name)}</span>`:''}</div>
   <div class="dos-dream">${kitSVG(c,40)}<span><b>The dream:</b> ${esc(s.dream)}</span></div>
   <div class="dos-env"><span class="env-ic" aria-hidden="true">✉</span>What they're not telling you</div></div>
  <button class="dos-pick" data-act="seat" data-arg="${s.id}">Choose ${esc(c.name.split(' ')[0])}</button></article>`}
function seatsView(){
  return`<p class="eyebrow">${S.seats.length} clubs · one answer, tonight</p><h2 class="big-h">The dossiers</h2><p class="muted">Each club keeps one secret until you sign.</p>
  <div class="deck">${S.seats.map(dossierCard).join('')}</div><p class="deck-hint muted">← swipe →</p>`}
function signView(){const s=S.seats.find(x=>x.id===S.pendingSeat)||S.seats[0],c=CL(s.id);
  return`<div style="${clubVars(c)}" class="stack"><p class="eyebrow">The contract</p>
  <div class="contract"><div class="ct-h">${esc(c.name)}</div><p>Appoints <b>${esc(S.name||'Alex Whitmore')}</b> as chairman, to answer to the members at the AGM next June.</p><p class="muted">Signed at the clubhouse, Tuesday, 23:41.</p>
   <div class="sigline"></div><span class="lbl muted">Chairman</span></div>
  <button class="btn hold" data-act="sign" data-hold="sign"><span class="fill"></span><span class="hold-t">Hold to sign</span></button>
  <button class="btn ghost" data-act="seatsBack">Back to the dossiers</button></div>`}
function signedView(){const c=C();
  return`<section class="flood"><div class="flood-in">${crestSVG(c,120,true)}<span class="lbl">Welcome to</span><h2 class="big-h">${esc(c.name)}</h2><div class="paper">New chairman at ${esc(c.name.split(' ')[0])}</div><span class="stamp-s">Signed</span></div></section>
  <button class="btn" data-act="toEnvelope">Open the envelope</button>`}
function envelopeView(){const sc=S.secret,d=SECRETS[sc.id],c=C();
  if(!sc.revealed)return`<p class="eyebrow">${esc(c.name)} · after signing</p><h2 class="big-h">What they weren't telling you</h2>
   <button class="envbig" data-act="openEnv" aria-label="Open the envelope"><span class="flap"></span><span class="seal">Open</span></button><p class="muted">Tap the envelope.</p>`;
  const fan=P(cast('fan'));
  return`<p class="eyebrow">${esc(c.name)} · after signing</p><h2 class="big-h">What they weren't telling you</h2>
   <div class="envbig opened" aria-hidden="true"><span class="flap"></span><span class="env-sym">${d.ic}</span></div>
   <div class="secret"><p>${esc(sc.text)}</p><div class="chips"><span class="chipr ${d.good?'good':'bad'}">${d.good?'Good news':'Bad news'}</span><span class="chipr ${d.good?'good':'bad'}">${esc(d.chip)}</span></div></div>
   ${fan?`<div class="bubble">${face(fan.id).replace('class="face','class="face sm')}<div class="bb"><b>${esc(fan.name)} · ${esc(ROLE_WORD[fan.role])}</b><p>The members are waiting on the terrace. Tell them who you are.</p></div></div>`:''}
   <button class="btn" data-act="arrive">Walk out to the terrace</button>`}
const SPEECH_Q={sport:'"This club will…"',club:'"And off the pitch…"',person:'"And I promise you…"'};
function moodFace(m){const v=m<25?0:m<40?1:m<50?2:m<65?3:4,P=['M8 15.5c1.5-2 6.5-2 8 0','M8.5 15.5c1.5-1 5.5-1 7 0','M9 15h6','M8 14c1.5 1.5 6.5 1.5 8 0','M7.5 13.5c2 3 7 3 9 0'],col=['#b3261e','#c4561c','#8a6a00','#2e7d3f','#1f7a3f'][v];
  return`<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[v]}" fill="none" stroke="${col}" stroke-width="2.2" stroke-linecap="round"/><path d="M9 10h.01M15 10h.01" stroke="${col}" stroke-width="2.8" stroke-linecap="round"/></svg>`}
function terrace(){const c=C();return`<div class="stand" aria-label="The members">${c.groups.map(g=>`<div class="grp"><span class="sface" title="${moodWord(g.mood)}">${moodFace(g.mood)}</span>${esc(gname(c,g.k))}<span class="g-m">${moodWord(g.mood)}</span></div>`).join('')}</div>`}
function manifestView(){
  const slot=['sport','club','person'][S.step],last=(S.speech||[]).slice(-1)[0];
  const items=manifestOptions(slot).map(id=>{const d=pdef(id),gs=pgroups(id).map(k=>gname(C(),k)),ch=chanceFor(id);return`<button class="choice" data-act="pick" data-arg="${id}"><b>${esc(d.t)}</b><span class="chips"><span class="chipr ${/Long|Unlikely/.test(ch)?'bad':/Coin|Likely|Depends/.test(ch)?'warn':'good'}">${esc(ch)}</span>${gs.length?`<span class="meta">${esc(gs.join(', '))}</span>`:''}</span></button>`}).join('');
  const none=slot!=='sport'?`<button class="choice" data-act="pick" data-arg="none"><b>Nothing I cannot keep</b><span class="meta">Hands free. Nobody cheers.</span></button>`:'';
  return`<p class="eyebrow">${S.dayOne?'Day one · the speech':`Season ${S.season} · your speech`} · ${S.step+1} of 3</p><h2 class="big-h">${S.step===0?'You walk out to the terrace':'They are listening'}</h2>
   ${terrace()}<div class="prog">${[0,1,2].map(i=>`<i class="${i<S.step?'on':''}"></i>`).join('')}</div>${last?`<p class="react">${esc(last.txt)}</p>`:''}
   <p class="say">${SPEECH_Q[slot]}</p><div class="stack">${items}${none}</div>${S.step===0?'<p class="muted small">Every promise is judged at the AGM in June.</p>':''}`}
function crisisView(){const cr=secretCrisis(),d=S.crisisDone;
  const card=(o,k)=>`<button class="trade${d&&d.k===k?' chosen':''}" data-act="crisis" data-arg="${k}"${d?' disabled':''}><span class="tt"><b>${esc(o.t)}</b><span class="tone ${o.tone}">${o.tone==='safe'?'Safe':'Bold'}</span></span><span class="cols"><span class="col give"><i>You give</i>${o.give.map(x=>`<span>${esc(x)}</span>`).join('')}</span><span class="col get"><i>You get</i>${o.get.map(x=>`<span>${esc(x)}</span>`).join('')}</span></span><span class="st">Agreed</span></button>`;
  return`<p class="eyebrow">Day one · on your desk</p><h2 class="big-h">${esc(cr.t)}</h2><div class="stack">${card(cr.a,'a')}${card(cr.b,'b')}</div>
   ${d?`<p class="react">${d.tone==='bold'?'A bold start. Half the club loves it, half is waiting for you to fail.':'A careful start. Word gets round by Friday: the new chairman listens.'}</p><button class="btn" data-act="crisisDone">Meet your staff</button>`:''}`}
