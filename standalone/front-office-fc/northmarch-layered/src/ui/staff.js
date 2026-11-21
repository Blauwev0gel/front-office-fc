/* ================= Screens: the head coach and the director of football ================= */
const ROLE_N={coach:'Head coach',td:'Director of football'};
function starsHtml(q){const n=staffStars(q);return`<span class="dots" aria-label="rated about ${n} of 5">${'★'.repeat(n)}<span class="muted">${'☆'.repeat(5-n)}</span></span>`}
function recordLine(p){const r=p.pro.record.slice(-3).reverse();return r.length?r.map(x=>`${tierShort(x.tier)} ${ord(x.pos)} (${esc(CL(x.club).name.split(' ')[0])})`).join(', '):'No record yet'}
function staffPanel(){
  const id=S.my;
  return`<div class="panel"><p class="eyebrow">Coach and director</p><p class="small muted">The two people who run the football. You appoint them; they do the work.</p>
  <div class="stack">${['coach','td'].map(role=>{const p=P(CL(id).cast[role]),pr=p.pro;return`<button class="dept" data-act="staff" data-arg="${role}">
    <span class="dh"><b>${ROLE_N[role]}</b>${starsHtml(staffEstimate(p.id))}</span>
    <span class="small"><b>${esc(p.name)}</b>${pr.caretaker?' · <span class="down">caretaker</span>':` · ${esc(STAFF_SPEC[role][pr.spec])}`}</span>
    <span class="small muted">${pr.caretaker?'Appoint someone: a caretaker is weak':`${pr.contract<=1?'<b class="down">contract ends this season</b>':pr.contract+' seasons left'} · £${pr.wage} a week`}</span></button>`}).join('')}</div></div>`;
}
function staffSheet(role){
  const id=S.my,cur=P(CL(id).cast[role]),cands=staffCandidates(id,role),set=settlement(cur.id);
  const curHtml=`<div class="panel"><div class="row"><b>${esc(cur.name)}</b>${starsHtml(staffEstimate(cur.id))}</div><p class="small">${cur.pro.caretaker?'Caretaker: holds the fort until you appoint someone.':esc(STAFF_SPEC[role][cur.pro.spec])}</p>
    <p class="small muted">Age ${cur.age} · ${cur.pro.caretaker?'interim':cur.pro.contract+' season'+(cur.pro.contract===1?'':'s')+' left'} · £${cur.pro.wage} a week · ${esc(recordLine(cur))}</p>
    ${cur.pro.caretaker?'':`<div class="seg">${cur.pro.contract<=1?`<button data-act="srenew" data-arg="${role}">Renew 2 seasons (+10%)</button>`:''}<button data-act="ssack" data-arg="${role}">Sack (£${set}k)</button></div>`}</div>`;
  const list=cands.map(c=>{const p=P(c.pid),pr=p.pro,cost=c.comp+set;return UI.confirm===c.pid?`<div class="opt on"><b>Appoint ${esc(p.name)}?</b><span class="small">${c.comp?`£${c.comp}k compensation to ${nm(c.from)}. `:''}${set?`£${set}k settlement for ${esc(cur.name)}. `:''}£${Math.max(pr.wage,staffWage(role,pr.q))} a week.</span><div class="seg"><button data-act="shire" data-arg="${role}|${c.pid}">Appoint (£${r1(cost)}k now)</button><button data-act="confirm" data-arg="">Cancel</button></div></div>`
    :`<button class="opt" data-act="confirm" data-arg="${c.pid}"><span class="row"><b>${esc(p.name)}</b>${starsHtml(staffEstimate(c.pid))}</span><span class="small">${esc(STAFF_SPEC[role][pr.spec])} · age ${p.age}</span><span class="small muted">${c.from?`At ${nm(c.from)} · £${c.comp}k compensation`:'Free to start'} · £${pr.wage}/wk · ${esc(recordLine(p))}</span></button>`}).join('');
  return overlayShell(ROLE_N[role],`<p class="muted">${role==='coach'?'The coach decides how good the team plays: results, style and how fast young players grow.':'The director signs and sells within your frame. A sharp eye wastes less money on players who disappoint.'}</p>
  ${curHtml}<p class="eyebrow">Candidates</p><p class="small muted">Ratings are your scouts' estimate. People at your own club are judged more sharply.</p><div class="stack">${list||'<p class="small muted">Nobody available.</p>'}</div>`);
}
