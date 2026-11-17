/* ---------- sheets ---------- */
function vSheet() {
  const s = U.sheet; if (!s) return ''; const g = G(); let h = '';
  if (s.t === 'dept-issue') {
    const m = F.deptIssueMeeting(s.k, s.v);
    if (m.err) h = '<div class="sheethead"><b>Issue review</b><button class="iconbtn" data-a="close" aria-label="Close">' + ART.I.close + '</button></div><p>' + esc(m.err) + '</p>';
    else {
      const i = m.issue;
      h = '<div class="sheethead"><span class="chip">Department meeting</span><button class="iconbtn" data-a="close" aria-label="Close">' + ART.I.close + '</button></div>' +
        '<h2>' + esc(i.title) + '</h2><p class="small">With ' + esc(m.owner) + '</p><div class="panel2"><b>The evidence</b><p>' + esc(i.evidence) + '</p><p>' + esc(i.why) + '</p></div>';
      if (m.active) h += '<div class="panel2"><b>Assignment underway: ' + esc(m.active.approachTitle) + '</b><p>' + (m.active.steps || 0) + ' of 4 working weeks completed. Review due in ' + Math.max(0,m.active.due - F.absWeek()) + ' weeks.</p><p>Original evidence: ' + esc(m.active.baseline) + '</p></div>';
      else {
        h += '<p><b>How should ' + esc(m.owner) + ' address this?</b></p><p class="small">Choose a direction for the department. The department executes your instruction; results are not guaranteed.</p>';
        // An isolated full-width block: no inherited candidate or panel button layout.
        h += '<section class="dept-issue-choices" aria-label="Department response options">' +
          m.options.map(o => '<button type="button" class="dept-issue-choice" data-a="dept-plan" data-k="' + esc(s.k) + '" data-v="' + esc(s.v) + '" data-c="' + esc(o[2]) + '"><span class="dept-issue-choice-title">' + esc(o[0]) + '</span><span class="dept-issue-choice-desc">' + esc(o[1]) + '</span></button>').join('') +
          '</section>';
        h += '<button class="btn ghost wide" data-a="dept-plan" data-k="' + esc(s.k) + '" data-v="' + esc(s.v) + '" data-c="accept">Accept risk — no intervention</button>';
      }
    }
  }
  if (s.t === 'player') {
    const p = g.squad.find(x => x.id === s.id) || g.academy.find(x => x.id === s.id) || (g.loanedOut || []).find(x => x.id === s.id); if (!p) return '';
    h = `<div class="sheethead"><span class="chip">${g.academy.includes(p) ? 'Academy' : 'First team'}</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>${profileHtml(p, null, null)}`;
  }
  if (s.t === 'dcand') {
    const R = F.DEPT_ROLES[s.k][s.r], C = F.deptCands(s.k, s.r), d = F.DEPT[s.k];
    h = `<div class="sheethead"><span class="chip">${esc(R[0])}</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div><p class="small" style="margin:0 0 10px">${esc(R[1])}. Two candidates. A signing-on fee of four weeks' wages.</p>
    <div class="cands">${C.map((c, i) => `<button class="cand" data-a="dhire" data-k="${s.k}" data-r="${s.r}" data-i="${i}"><span class="cf">${ART.face(c.id * 17 + 5, { role: d.face, age: c.age, bg: '#fff' })}</span><span class="cm"><b>${esc(c.name)}</b><small>${c.age}</small><span class="traits"><span>${esc(c.trait)}</span></span></span><span class="cr"><small>${money(c.wage)}/wk</small><small>Fee ${money(c.wage * 4)}</small></span></button>`).join('')}</div>`;
  }
  if (s.t === 'help') {
    h = `<div class="sheethead"><span class="chip">How it works</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <p style="margin-top:0">You are the CEO. You hire the people, set their mandates and make the calls they bring you. You never pick the team or buy players yourself.</p>
    <div class="panel2">${Object.entries(TOUR).map(([k, t]) => `<div class="helpr"><span class="hic">${ART.I[k]}</span><span><b>${esc(t[0])}</b><small>${esc(t[1])}</small></span></div>`).join('')}</div>
    <div class="sec">Reading the screen</div><div class="panel2">
      <div class="helpr"><span class="hic">OK</span><span><b>One-tap replies</b><small>Tap an answer to send it instantly. Other CEO instructions are no longer limited by action points.</small></span></div>
      <div class="helpr"><span class="hic"><span class="gripchip hi" style="margin:0;min-width:0"><b>Grip</b></span></span><span><b>Grip</b><small>How firmly you steer the club. It lifts or drags every head of department.</small></span></div>
      <div class="helpr"><span class="hic"><i class="lg good"></i></span><span><b>Green</b><small>On track or good.</small></span></div>
      <div class="helpr"><span class="hic"><i class="lg mid"></i></span><span><b>Grey</b><small>Steady, nothing to do.</small></span></div>
      <div class="helpr"><span class="hic"><i class="lg bad"></i></span><span><b>Red</b><small>Needs attention.</small></span></div>
      <div class="helpr"><span class="hic"><em class="nbadge">2</em></span><span><b>Badges</b><small>Something waits for you on that tab.</small></span></div></div>
    <button class="btn ghost wide" data-a="tour-reset" style="margin-top:12px">Show the tab tips again</button>`;
  }
  if (s.t === 'grip') {
    const gr = Math.round(g.grip == null ? 60 : g.grip), bon = (gr - 50) / 14, L = (g.gripLog || []).slice(-12);
    h = `<div class="sheethead"><span class="chip">Your grip on the club</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <div class="kbig">${gr}<small class="small"> of 100</small></div><div class="budbar"><b class="${gr < 30 ? 'over' : ''}" style="width:${gr}%"></b></div>
    <p>A club drifts when nobody steers it. Every decision you take yourself, a talk, a press answer or a call in the summer, builds grip. Each week without them, it slips.</p>
    <div class="panel2"><div class="scr2"><span>Effect on every head of department</span><b class="${bon >= 0 ? 'good' : 'bad'}">${bon >= 0 ? '+' : '−'}${Math.abs(bon).toFixed(1)} on their skills</b></div><div class="scr2"><span>Most you can gain in a week</span><b>16</b></div><div class="scr2"><span>Lost every week</span><b>5</b></div>${gr < 25 ? '<div class="scr2"><span>Board and staff</span><b class="bad">Losing faith every week</b></div>' : ''}</div>
    ${L.length > 1 ? `<div class="sec">Last weeks</div><div class="panel2">${spark(L)}</div>` : ''}`;
  }
  if (s.t === 'sack') {
    const q = F.ftSackQuote(), c = F.staff('coach'); if (!q || !c) { U.sheet = null; return ''; }
    const fx = (l, v) => `<span class="eff ${v > 0 ? 'up' : v < 0 ? 'dn' : ''}">${l} ${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v)}</span>`;
    h = `<div class="sheethead"><span class="chip">Sack the coach</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <div class="stage"><div class="portrait">${ART.staffFace('coach', 'worried')}</div><div class="who"><b>${esc(c.name)}</b><span>${q.under ? 'Results are below what the squad should do.' : 'Results are on or above par.'}</span></div></div>
    <div class="panel2" style="margin:12px 0"><div class="scr2"><span>Compensation</span><b class="bad">${money(q.cost)}</b></div><div class="scr2"><span>Reaction</span><b>${fx('Fans', q.fans)}${fx('Press', q.press)}${fx('Board', q.board)}</b></div><div class="scr2"><span>Dressing room</span><b>${fx('Morale', q.squad)}</b></div></div>
    <p class="small">You will need to appoint a new head coach. Until then the team runs without one.</p>
    <div class="sheetfoot"><button class="btn ghost" data-a="close">Keep him</button><button class="btn danger" data-a="ft-sack">Sack ${esc(c.name.split(' ').slice(-1)[0])}</button></div>`;
  }
  if (s.t === 'target') {
    const { p, k, x } = F.recPlayer(s.id); if (!p) { const sp = g.squad.find(q => q.id === s.id); if (sp) { U.sheet = { t: 'player', id: sp.id }; return vSheet(); } return `<div class="sheethead"><span class="chip">Gone</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div><p>He is no longer available.</p>`; }
    const live = x && ['negotiating', 'agreed', 'signed', 'lost', 'approach'].includes(x.stage), d = x && x.deal;
    h = `<div class="sheethead"><span class="chip">${x ? esc(STG_L[x.stage]) : 'Target'}</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>${profileHtml(p, k, x)}
    ${d && d.rounds.length ? `<details class="more"><summary>Talks so far (${d.rounds.length}) ${ART.I.chev}</summary>${d.rounds.map(r => `<p>${esc(r)}</p>`).join('')}</details>` : ''}
    ${x && x.blocked ? `<p class="small bad">Blocked by ${esc(x.blocked.join(', '))}.</p>` : x && x.hold ? '<p class="small">On hold: that position is covered.</p>' : ''}
    ${U.recMsg ? `<p class="note">${esc(U.recMsg)}</p>` : ''}
    ${!live ? `<p class="small note">${esc(F.staffName ? F.staffName('dof') : 'The DoF')} decides whether to pursue him, within your mandate. Change priorities or limits in the recruitment mandate.</p>` : ''}`;
  }
  if (s.t === 'recplan') { h = `<div class="spread"><div><div class="kick">Recruitment plan</div><h2>What should we look for?</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>${recPlanBlock()}<div class="row" style="margin-top:12px"><button class="btn" data-a="close">Done</button></div>`; }
  if (s.t === 'mand') {
    const r = s.r, st = F.staff(r), m = U.draft; const al = previewAlign(r, m);
    h = `<div class="sheethead"><span class="chip">Mandate · club fit ${al}%</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>${staffHead(r)}${leanNote(r, m)}<div id="mand">${sliderRows(r, m, 'md')}</div>
    <div class="sheetfoot"><button class="btn ghost" data-a="close">Cancel</button><button class="btn" data-a="mand-save">Save mandate</button></div>`;
  }
  if (s.t === 'talk') {
    const roles = F.ROLES.filter(r => g.staff[r.id]);
    const selected = U.talkRole, person = selected ? F.staff(selected) : null;
    const selection = roles.map(r => {
      const st = g.staff[r.id], perf = F.record(r.id);
      const mood = st.rel < 35 ? 'Relationship strained' : st.rel >= 70 ? 'Strong working relationship' : 'Normal working relationship';
      return `<button class="fo-meeting-person" data-a="talk-who" data-r="${r.id}">
        <span><b>${esc(st.name)}</b><small>${esc(r.t)} · ${esc(mood)}</small></span>
        <strong>${esc(perf.verdict)} →</strong></button>`;
    }).join('');
    const toneOptions = [
      ['review','Review performance','Discuss evidence against the agreed expectations.'],
      ['praise','Recognise good work','Credibility depends on actual performance; confidence can become complacency.'],
      ['challenge','Ask for improvement','Ambition can motivate; an outspoken head may resist.'],
      ['reassure','Express confidence','More meaningful when results or confidence are poor.'],
      ['warn','Issue a formal warning','This may damage trust, especially if the warning is unfair.']
    ];
    const record = person ? F.record(selected) : null;
    const last = person && g.talks ? g.talks[selected] : null;
    const gap = last == null ? null : F.absWeek() - last;
    const approach = person ? `<div class="fo-meeting-dossier">
      <button class="fo-meeting-back" data-a="talk-who" data-r="">← All department heads</button>
      <span class="fo-case-kind">ONE-TO-ONE · ${esc(F.ROLE[selected].t)}</span>
      <h2>${esc(person.name)}</h2>
      <p>${esc(record.verdict)} · Relationship ${Math.round(person.rel)}/100</p>
      <p class="small">${gap == null ? 'No earlier meeting on record.' :
        gap < 3 ? 'You spoke recently. Repeating a conversation now has reduced impact.' :
        'You last met ' + gap + ' game weeks ago.'}</p>
      <h3>How do you want to approach the conversation?</h3>
      <div class="fo-meeting-options">${toneOptions.map(([key,label,detail]) =>
        `<button class="fo-meeting-choice" data-a="talk-do" data-t="${key}"
          ${key === 'review' && record.early ? 'disabled title="Not enough performance evidence yet"' : ''}>
          <b>${label}</b><small>${detail}</small></button>`).join('')}</div>
      ${U.talkOut ? `<div class="fo-meeting-outcome" role="status"><b>Conversation outcome</b><p>${esc(U.talkOut)}</p>
        <button data-a="close">Return to your club</button></div>` : ''}
      </div>` : '';
    h = `<div class="fo-meeting">
      <div class="sheethead"><h2>${person ? 'Conversation' : 'Meet your department heads'}</h2>
        <button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
      ${person ? approach : `<p class="small">Choose a person. Conversations affect working relationships, but they do not replace formal mandates.</p>
      <div class="fo-meeting-people">${selection || '<p>No department heads have been appointed.</p>'}</div>`}</div>`;
  }
  if (s.t === 'push') {
    h = `<div class="spread"><div><div class="kick">Lasts three weeks</div><h2>Back a department</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p class="small">Your visible backing lifts that department and its head. Rival departments notice.</p>
    <div class="choice">${Object.entries({ sporting: 'Squad morale up, a small edge on the pitch.', scouting: 'Network grows faster in the focus regions.', academy: 'Prospects develop faster; a better intake if it falls in the window.', commercial: 'Sponsor mood up; more commercial opportunities arrive.', marketing: 'Fan base and brand grow faster.', business: 'Running costs down five percent.', medical: 'Fewer injuries, faster recovery.' }).map(([k, d]) => `<button class="card" data-a="push" data-d="${k}"><b>${F.PUSH[k][0]}</b>${d}${g.push[k] > 0 ? `<div class="e">Already backed: ${g.push[k]} week${g.push[k] > 1 ? 's' : ''} left.</div>` : ''}</button>`).join('')}</div>`;
  }
  if (s.t === 'cands') {
    const r = s.r; if (!g.cands[r]) g.cands[r] = F.genCands(r);
    h = `<div class="spread"><div><div class="kick">Appointment</div><h2>${F.ROLE[r].t}</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div><div class="choice">${g.cands[r].map((c, i) => staffCard(c, r, { actions: `<button class="btn small" data-a="hire" data-r="${r}" data-i="${i}">Appoint ${esc(c.name.split(' ')[0])}</button>` })).join('')}</div>`;
  }
  if (s.t === 'fire') {
    const st = F.staff(s.r), cost = Math.round(st.wage * Math.max(8, st.contract * 20));
    h = `<div class="spread"><h2>Dismiss ${esc(st.name)}?</h2><button class="x" data-a="close" aria-label="Close">×</button></div>${numbers(s.r)}<p>Compensation: <b class="num">${money(cost)}</b>. The rest of the staff will be unsettled, and the role stays vacant until you appoint someone. </p><div class="row"><button class="btn" data-a="fire" data-r="${s.r}">Dismiss</button><button class="btn ghost" data-a="close">Keep him</button></div>`;
  }
  if (s.t === 'quick') {
    h = `<div class="spread"><div><div class="kick">Skip the founding</div><h2>Base club</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p>Harwick Athletic: a phoenix club at the old town ground, possession football, own academy, self-sustaining, community club, steady ambition. Staff are hired within budget and mandates follow the club DNA.</p>
    ${hasSave() ? '<p class="small bad">This replaces the club saved in this browser.</p>' : ''}
    <div class="row" style="flex-direction:column;gap:8px;margin-top:12px"><button class="btn" data-a="quick" data-v="summer">Start in the summer</button><button class="btn ghost" data-a="quick" data-v="season">Straight to week 1</button></div>
    <p class="small" style="margin-top:8px">Week 1 skips the summer window, pre-season and the first press day: your staff handle them.</p>`;
  }
  if (s.t === 'backers') {
    const B = F.backers(), D = { board: 'Your employer: judges results against targets, finances and promises.', fans: 'Supporters respond to results, ticket prices, community and club identity.', room: 'Squad morale: playing time, bonuses, results and the coach.' };
    h = `<div class="spread"><div><div class="kick">Three groups shape your future</div><h2>Your backers</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p class="small">Board, supporters and dressing room can trigger a crisis below ${F.VOTE_AT}. Press coverage still shapes stories and reactions, but cannot independently dismiss you. Delegating within a mandate is not a reputation penalty.</p>
    ${B.map(b => `<div class="bkrow ${b.danger ? 'lo' : ''}"><div class="spread"><b>${ART.I[b.ic] || ''} ${esc(b.t)}</b><span class="num">${b.v}${b.d ? ` <small class="${b.d > 0 ? 'good' : 'bad'}">${b.d > 0 ? '+' : ''}${b.d} this week</small>` : ''}</span></div><em><u style="width:${b.v}%"></u></em><p><i>${esc(b.voice)}</i> ${esc(D[b.k])}</p></div>`).join('')}
    <h3>Recent changes</h3>
    ${(F.stakeholderHistory ? F.stakeholderHistory(8) : []).slice().reverse().map(e => `<p class="small"><b>Week ${e.week} · ${esc(e.reason || e.source)}</b> — ${Object.entries(e.changes).map(([k,v]) => esc(k) + ' ' + (v > 0 ? '+' : '') + v).join(', ')}</p>`).join('') || '<p class="small">No significant changes recorded yet.</p>'}`;
  }
  if (s.t === 'analysis') {
    const A = F.analysis(), mx = Math.max(0.5, ...A.bars.map(b => Math.abs(b.v)));
    const lev = l => { if (l.a === 'mand') return `<button class="btn ghost small" data-a="sheet" data-s="mand" data-r="${l.x}">Open ${esc(F.ROLE[l.x].t)} mandate</button>`; if (l.a === 'push') return `<button class="btn ghost small" data-a="push" data-d="${l.x}">Back ${esc(F.PUSH[l.x][0].toLowerCase())} </button>`; if (l.a === 'talk') return `<button class="btn ghost small" data-a="sheet" data-s="talk" data-r="${l.x}">One-to-one</button>`; if (l.a === 'tab') return `<button class="btn ghost small" data-a="tab-close" data-t="${l.x}">Go to ${esc(l.x)}</button>`; return ''; };
    h = `<div class="spread"><div><div class="kick">Performance analysis</div><h2>Why we are ${F.ord(A.pos)}</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <dl class="figs"><div><dt>Position</dt><dd>${F.ord(A.pos)}</dd></div><div><dt>Board target</dt><dd>${F.ord(A.target)}</dd></div><div><dt>Gap</dt><dd class="${A.gap > 0 ? 'bad' : 'good'}">${A.gap > 0 ? A.gap + ' pts' : 'none'}</dd></div><div><dt>Forecast</dt><dd>${A.fc ? F.ord(A.fc) : '–'}</dd></div><div><dt>Points vs deserved</dt><dd>${A.pts} / ${A.xpts.toFixed(1)}</dd></div></dl>
    <h3 style="margin-top:14px">What drives our results</h3><p class="small">Compared with an average side in this division. Right of the line helps, left hurts.</p>
    ${A.bars.map(b => `<div class="drv"><span>${esc(b.l)}</span><div class="axis"><i class="${b.v >= 0 ? 'pos' : 'neg'}" style="width:${Math.abs(b.v) / mx * 50}%"></i></div><span class="small">${esc(b.note)}</span></div>`).join('')}
    <h3 style="margin-top:14px">Diagnosis</h3>${A.causes.length ? A.causes.map(c => `<p class="cause ${c.sev < 0 ? 'luck' : ''}">${esc(c.t)}</p>`).join('') : '<p>No structural problems. The squad and staff are performing to their level.</p>'}
    <h3 style="margin-top:14px">What you can do</h3>${A.levers.length ? A.levers.map(l => `<div class="lever"><p>${esc(l.t)}</p>${lev(l)}</div>`).join('') : '<p class="small">Keep going. Revisit if results turn.</p>'}`;
  }
  if (s.t === 'confirm') { const n = inboxItems().filter(i => i.kind === 'need').length; h = `<h2>Play week ${g.week}?</h2><p>${n} decision${n === 1 ? '' : 's'} will be taken by your staff, following their mandates.</p><div class="row"><button class="btn" data-a="end">Play anyway</button><button class="btn ghost" data-a="review">Review first</button></div>`; }
  if (s.t === 'ticker') return vTicker();
  return `<div class="veil" data-a="veil"><div class="sheet" role="dialog" aria-modal="true"${s.t === "dept-issue" ? ' style="display:block;box-sizing:border-box;width:min(100%,560px);max-width:100%;overflow-x:hidden"' : ""}>${h}</div></div>`;
}
function previewAlign(r, m) { const g = G(), old = g.mand[r]; g.mand[r] = m; const a = F.alignment(); g.mand[r] = old; return a; }

/* ---------- ticker ---------- */
function vTicker() {
  const T = U.ticker, m = T.match, g = G(), shown = m.ev.slice(0, T.i);
  const last = shown.filter(e => e.sc).pop(), sc = last ? last.sc : [0, 0], min = shown.length ? shown[shown.length - 1].m : 0, done = T.i >= m.ev.length;
  const oS = (() => { const n = (m.oppName || 'OPP').toUpperCase().replace(/[^A-Z ]/g, ''); let t = n.replace(/ /g, '').slice(0, 3); if (t === g.club.short) { const w = n.split(' '); t = w.length > 1 ? (w[0].slice(0, 2) + w[1][0]) : (n[0] + n.slice(1).replace(/[AEIOU]/g, '').slice(0, 2)); } if (t === g.club.short) t = n[0] + n.slice(-2); return t; })();
  const home = m.home, hn = home ? g.club.short : oS, an = home ? oS : g.club.short, hg = home ? sc[0] : sc[1], ag = home ? sc[1] : sc[0];
  const xgOf = e => { const x = (e.t.match(/xG ([\d.]+)/) || [])[1]; return x ? +x : e.k === 'goal' ? 0.35 : 0.15; };
  let ux = 0, tx = 0; const shots = shown.map((e, k) => { if (e.k !== 'goal' && e.k !== 'ch') return ''; const xg = xgOf(e); if (e.us) ux += xg; else tx += xg; const h = (k * 2654435761 >>> 0) % 1000 / 1000, us = !!e.us, x = us ? 72 + h * 22 : 6 + h * 22, y = 18 + ((k * 40503 >>> 0) % 1000) / 1000 * 64; return `<i class="shot ${e.k} ${us ? 'us' : 'them'} ${k === shown.length - 1 ? 'new' : ''}" style="left:${x}%;top:${y}%;--s:${10 + xg * 30}px"></i>`; }).join('');
  const lastE = shown[shown.length - 1], goalNow = lastE && lastE.k === 'goal' && !done && T.flashI !== T.i ? lastE : null;
  if (goalNow) { T.flashI = T.i; if (goalNow.us) { ART.SND.cheer(); ART.vib([80, 40, 80]); } else ART.SND.bad(); }
  const IC = { goal: '<i class="evi goal">●</i>', ch: '<i class="evi ch">○</i>', card: '<i class="evi ecard"></i>', sub: '<i class="evi sub">⇄</i>', inj: '<i class="evi inj">+</i>', info: '<i class="evi info">·</i>', ft: '<i class="evi info">■</i>' };
  return `<div class="veil"><div class="sheet live" role="dialog" aria-modal="true" aria-label="Live match">
  <div class="bug"><span class="team ${home ? 'mine' : ''}">${esc(hn)}</span><span class="sc">${hg}<i>–</i>${ag}</span><span class="team ${!home ? 'mine' : ''}">${esc(an)}</span><span class="min">${done ? 'FT' : min + "'"}</span></div>
  <div class="bugsub">${m.comp === 'Cup' ? 'National Cup' + (m.rd ? ', ' + esc(m.rd) : '') : F.TIERS[g.club.tier]}${m.att ? ', crowd ' + m.att.toLocaleString('en-GB') : ''}${done && m.pens ? ', ' + esc(m.pens) : ''}</div>
  <div class="mbar"><b style="width:${Math.min(100, min / 90 * 100)}%"></b></div>
  <div class="mpitch"><div class="ml"></div>${shots}${goalNow ? `<div class="goalflash ${goalNow.us ? 'us' : 'them'}">GOAL${goalNow.us ? '!' : ''}</div>` : ''}<span class="dir l">${esc(home ? an : hn)} attack</span><span class="dir r">${esc(g.club.short)} attack</span></div>
  ${(() => { const rec = shown.filter(e => (e.k === 'goal' || e.k === 'ch') && e.m > min - 15); let a = 0, b = 0; for (const e of rec) { const x = xgOf(e) + (e.k === 'goal' ? 0.3 : 0); if (e.us) a += x; else b += x; } const tot = a + b, sh = tot ? a / tot : 0.5, lft = home ? sh : 1 - sh; return `<div class="mom" aria-label="Momentum"><span>${esc(hn)}</span><i><b style="width:${Math.round(lft * 100)}%"></b></i><span>${esc(an)}</span></div><div class="small" style="text-align:center;margin:-2px 0 6px;color:#9fb0c6">Momentum, last 15 minutes</div>`; })()}
  <div class="xgbar"><span>${home ? ux.toFixed(1) : tx.toFixed(1)}</span><i><b style="width:${(home ? ux : tx) / Math.max(0.1, ux + tx) * 100}%"></b></i><span>${home ? tx.toFixed(1) : ux.toFixed(1)}</span></div><div class="small" style="text-align:center;margin-top:-2px">Expected goals</div>
  <ul class="feed2" aria-live="polite">${shown.slice().reverse().map(e => { const p = e.pid && e.us && (e.k === 'goal' || e.k === 'ch') ? g.squad.find(x => x.id === e.pid) : null; const ht = e.k === 'info' && /^Half-time/.test(e.t); return ht ? `<li class="htc"><b>Half-time</b><span>${esc(e.t.replace('Half-time: ', ''))}</span></li>` : `<li class="k-${e.k} ${e.us ? 'us' : ''} ${e.red ? 'red' : ''}"><span class="m">${e.m}'</span>${p && e.k === 'goal' ? `<span class="fpf">${ART.playerFace(p, 'happy')}</span>` : IC[e.k] || IC.info}<span>${esc(e.t.replace(/\s*\(xG [\d.]+\)/, ''))}</span></li>`; }).join('')}</ul>
  <div class="row2 live-btns">${done ? `<button class="btn" data-a="tick-close">${T.next ? 'To the cup tie' : 'Back to the office'}</button>` : `<button class="btn ghost" data-a="tick-speed">${T.fast ? 'Normal speed' : 'Faster'}</button><button class="btn ghost" data-a="tick-skip">Skip to full time</button>`}</div></div></div>`;
}
function startTicker(match, next) {
  U.ticker = { match, i: 0, fast: false, next }; U.sheet = { t: 'ticker' }; render(); tick();
}
function tick() { clearTimeout(tick.h); const T = U.ticker; if (!T || T.i >= T.match.ev.length) return; T.i++; const live = document.querySelector('.veil .sheet.live'); if (live && U.sheet && U.sheet.t === 'ticker') live.closest('.veil').outerHTML = vTicker(); else render(); const nx = T.match.ev[T.i]; tick.h = setTimeout(tick, T.fast ? 260 : nx && (nx.k === 'goal' || (nx.k === 'ch' && /Huge|big save/.test(nx.t))) ? 1700 : 1100); }

