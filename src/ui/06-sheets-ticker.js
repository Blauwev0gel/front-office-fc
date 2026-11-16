/* ---------- sheets ---------- */
function vSheet() {
  const s = U.sheet; if (!s) return ''; const g = G(); let h = '';
  if (s.t === 'player') {
    const p = g.squad.find(x => x.id === s.id) || g.academy.find(x => x.id === s.id) || (g.loanedOut || []).find(x => x.id === s.id); if (!p) return '';
    h = `<div class="sheethead"><span class="chip">${g.academy.includes(p) ? 'Academy' : 'First team'}</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>${profileHtml(p, null, null)}`;
  }
  if (s.t === 'dcand') {
    const R = F.DEPT_ROLES[s.k][s.r], C = F.deptCands(s.k, s.r), d = F.DEPT[s.k];
    h = `<div class="sheethead"><span class="chip">${esc(R[0])}</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div><p class="small" style="margin:0 0 10px">${esc(R[1])}. Two candidates. A signing-on fee of four weeks' wages.</p>
    <div class="cands">${C.map((c, i) => `<button class="cand" data-a="dhire" data-k="${s.k}" data-r="${s.r}" data-i="${i}"><span class="cf">${ART.face(c.id * 17 + 5, { role: d.face, age: c.age, bg: '#fff' })}</span><span class="cm"><b>${esc(c.name)}</b><small>${c.age}</small><span class="traits"><span>${esc(c.trait)}</span></span></span><span class="cr"><small>${money(c.wage)}/wk</small><small>Fee ${money(c.wage * 4)}</small></span></button>`).join('')}</div>`;
  }
  if (s.t === 'actions') {
    h = `<div class="sheethead"><span class="chip">Actions</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <p>There is no limit on what you do in a week. Leave a decision and your staff take their pick; only decisions you take yourself build your grip.</p>`;
  }
  if (s.t === 'help') {
    h = `<div class="sheethead"><span class="chip">How it works</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <p style="margin-top:0">You are the CEO. You hire the people, set their mandates and make the calls they bring you. You never pick the team or buy players yourself.</p>
    <div class="panel2">${Object.entries(TOUR).map(([k, t]) => `<div class="helpr"><span class="hic">${ART.I[k]}</span><span><b>${esc(t[0])}</b><small>${esc(t[1])}</small></span></div>`).join('')}</div>
    <div class="sec">Reading the screen</div><div class="panel2">
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
    <div class="panel2" style="margin:12px 0"><div class="scr2"><span>Compensation</span><b class="bad">${money(q.cost)}</b></div><div class="scr2"><span>Reaction</span><b>${fx('Fans', q.fans)}${fx('Press', q.pressAll != null ? q.pressAll : q.press)}${fx('Board', q.board)}</b></div><div class="scr2"><span>Dressing room</span><b>${fx('Morale', q.squad)}</b></div>${q.staff ? `<div class="scr2"><span>Other heads</span><b>${fx('Trust', q.staff)}</b></div>` : ''}</div>
    <p class="small">You will need to appoint a new head coach. Until then the team runs without one.</p>
    <div class="sheetfoot"><button class="btn ghost" data-a="close">Keep him</button><button class="btn danger" data-a="ft-sack" ${G().ap < 1 ? 'disabled' : ''}>Sack ${esc(c.name.split(' ').slice(-1)[0])}</button></div>`;
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
    h = `<div class="sheethead"><span class="chip">Mandate · club fit ${al}%</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>${staffHead(r)}${leanNote(r, m)}<div id="mand">${sliderRows(r, m, 'md')}</div>${F.MAND[r].sl.concat(F.MAND[r].ru).some(x => RES_KEYS.includes(x[0])) ? '<p class="small">Budget and scouting regions are set on the department\'s Plan tab, at no cost.</p>' : ''}
    <div class="sheetfoot"><button class="btn ghost" data-a="close">Cancel</button><button class="btn" data-a="mand-save" ${g.ap < 1 ? 'disabled' : ''}>Save mandate</button></div>`;
  }
  if (s.t === 'talk') {
    const roles = F.ROLES.filter(r => g.staff[r.id]);
    const sel = U.talkRole;
    h = `<div class="spread"><div><div class="kick">One-to-one</div><h2>Who do you want to see?</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <div class="choice">${roles.map(r => { const s2 = g.staff[r.id]; return `<button class="card ${sel === r.id ? 'on' : ''}" data-a="talk-who" data-r="${r.id}"><b>${esc(s2.name)}</b>${r.t}. Relationship ${relW(s2.rel)} (${r0(s2.rel)}). The numbers: ${F.record(r.id).verdict.toLowerCase()}.<div class="e">${s2.p.ego > 14 ? 'Big ego. ' : ''}${s2.p.amb > 14 ? 'Very ambitious. ' : ''}${s2.p.loy < 7 ? 'Not very loyal.' : ''}</div></button>`; }).join('')}</div>
    ${sel ? `<h3>How do you approach it?</h3><div class="choice">${[['review', 'Go through the numbers', 'Evidence, not opinion. Good numbers earn real credit; bad ones are hard to argue with.'], ['praise', 'Praise his work', 'Builds trust. Some take it as licence to coast.'], ['challenge', 'Challenge him to do more', 'Ambitious people respond. Proud people bristle.'], ['reassure', 'Reassure him', 'Steadies someone who is struggling.'], ['warn', 'Warn him', 'Sharpens minds when results are poor. Unfair otherwise.']].map(([k, l, d]) => `<button class="card" data-a="talk-do" data-t="${k}"><b>${l}</b>${d}</button>`).join('')}</div>` : ''}
    ${U.talkOut ? `<div class="quote" style="font-size:22px">${esc(U.talkOut)}</div>` : ''}`;
  }
  if (s.t === 'push') {
    h = `<div class="spread"><div><div class="kick">Three weeks, one department at a time</div><h2>Back a department</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p class="small">Your visible backing lifts that department and its head. Backing another ends it; rival departments notice.</p>
    <div class="choice">${Object.entries({ sporting: 'A small edge on the pitch; scouts spot a little more.', scouting: 'Network grows faster in the focus regions.', academy: 'Prospects develop faster; a better intake if it falls in the window.', commercial: 'Sponsor mood up; more commercial opportunities arrive.', marketing: 'Fan base and brand grow faster.', business: 'Running costs down five percent.', medical: 'Fewer injuries, faster recovery.' }).map(([k, d]) => `<button class="card" data-a="push" data-d="${k}"><b>${k === 'medical' ? 'First team: medical' : F.PUSH[k][0]}</b>${d}${g.push[k] > 0 ? `<div class="e">Already backed: ${g.push[k]} week${g.push[k] > 1 ? 's' : ''} left.</div>` : ''}</button>`).join('')}</div>`;
  }
  if (s.t === 'cands') {
    const r = s.r; if (!g.cands[r]) g.cands[r] = F.genCands(r);
    h = `<div class="spread"><div><div class="kick">Appointment</div><h2>${F.ROLE[r].t}</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div><div class="choice">${g.cands[r].map((c, i) => staffCard(c, r, { actions: `<button class="btn small" data-a="hire" data-r="${r}" data-i="${i}">Appoint ${esc(c.name.split(' ')[0])}</button>` })).join('')}</div>`;
  }
  if (s.t === 'fire') {
    const st = F.staff(s.r), cost = Math.round(st.wage * Math.max(8, st.contract * 20));
    h = `<div class="spread"><h2>Dismiss ${esc(st.name)}?</h2><button class="x" data-a="close" aria-label="Close">×</button></div>${numbers(s.r)}<p>Compensation: <b class="num">${money(cost)}</b>. The rest of the staff will be unsettled, and the role stays vacant until you appoint someone.</p><div class="row"><button class="btn" data-a="fire" data-r="${s.r}" ${g.ap < 1 ? 'disabled' : ''}>Dismiss</button><button class="btn ghost" data-a="close">Keep him</button></div>`;
  }
  if (s.t === 'quick') {
    h = `<div class="spread"><div><div class="kick">Skip the founding</div><h2>Base club</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p>Harwick Athletic: a phoenix club at the old town ground, possession football, own academy, self-sustaining, community club, steady ambition. Staff are hired within budget and mandates follow the club DNA.</p>
    ${hasSave() ? '<p class="small bad">This replaces the club saved in this browser.</p>' : ''}
    <div class="row" style="flex-direction:column;gap:8px;margin-top:12px"><button class="btn" data-a="quick" data-v="summer">Start in the summer</button><button class="btn ghost" data-a="quick" data-v="season">Straight to week 1</button></div>
    <p class="small" style="margin-top:8px">Week 1 skips the summer window, pre-season and the first press day: your staff handle them.</p>`;
  }
  if (s.t === 'backers') {
    const B = F.backers(), D = { board: 'Owns your contract. Results against the target, money and promises.', fans: 'Results, ticket prices, community and respect for the club\'s identity.', press: 'Stories, access and how you handle scandals.', room: 'Morale of the first-team squad: playing time, bonuses, the coach.' };
    h = `<div class="spread"><div><div class="kick">Four groups hold your fate</div><h2>Your backers</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p class="small">Let one fall below ${F.VOTE_AT} and you face a vote of confidence. Survive it and you get one more chance this season, not two.</p>
    ${B.map(b => `<div class="bkrow ${b.danger ? 'lo' : ''}"><div class="spread"><b>${ART.I[b.ic] || ''} ${esc(b.t)}</b><span class="num">${b.v}${b.d ? ` <small class="${b.d > 0 ? 'good' : 'bad'}">${b.d > 0 ? '+' : ''}${b.d} this week</small>` : ''}</span></div><em><u style="width:${b.v}%"></u></em><p><i>${esc(b.voice)}</i> ${esc(D[b.k])}</p></div>`).join('')}`;
  }
  if (s.t === 'analysis') {
    const A = F.analysis(), mx = Math.max(0.5, ...A.bars.map(b => Math.abs(b.v)));
    const lev = l => { if (l.a === 'mand') return `<button class="btn ghost small" data-a="sheet" data-s="mand" data-r="${l.x}">Open ${esc(F.ROLE[l.x].t)} mandate</button>`; if (l.a === 'push') return `<button class="btn ghost small" data-a="push" data-d="${l.x}" ${g.ap < 1 ? 'disabled' : ''}>Back ${esc(F.PUSH[l.x][0].toLowerCase())} </button>`; if (l.a === 'talk') return `<button class="btn ghost small" data-a="sheet" data-s="talk" data-r="${l.x}" ${g.ap < 1 ? 'disabled' : ''}>One-to-one</button>`; if (l.a === 'tab') return `<button class="btn ghost small" data-a="tab-close" data-t="${l.x}">Go to ${esc(l.x)}</button>`; return ''; };
    h = `<div class="spread"><div><div class="kick">Performance analysis</div><h2>Why we are ${F.ord(A.pos)}</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <dl class="figs"><div><dt>Position</dt><dd>${F.ord(A.pos)}</dd></div><div><dt>Board target</dt><dd>${F.ord(A.target)}</dd></div><div><dt>Gap</dt><dd class="${A.gap > 0 ? 'bad' : 'good'}">${A.gap > 0 ? A.gap + ' pts' : 'none'}</dd></div><div><dt>Forecast</dt><dd>${A.fc ? F.ord(A.fc) : '–'}</dd></div><div><dt>Points vs deserved</dt><dd>${A.pts} / ${A.xpts.toFixed(1)}</dd></div></dl>
    <h3 style="margin-top:14px">What drives our results</h3><p class="small">Compared with an average side in this division. Right of the line helps, left hurts.</p>
    ${A.bars.map(b => `<div class="drv"><span>${esc(b.l)}</span><div class="axis"><i class="${b.v >= 0 ? 'pos' : 'neg'}" style="width:${Math.abs(b.v) / mx * 50}%"></i></div><span class="small">${esc(b.note)}</span></div>`).join('')}
    <h3 style="margin-top:14px">Diagnosis</h3>${A.causes.length ? A.causes.map(c => `<p class="cause ${c.sev < 0 ? 'luck' : ''}">${esc(c.t)}</p>`).join('') : '<p>No structural problems. The squad and staff are performing to their level.</p>'}
    <h3 style="margin-top:14px">What you can do</h3>${A.levers.length ? A.levers.map(l => `<div class="lever"><p>${esc(l.t)}</p>${lev(l)}</div>`).join('') : '<p class="small">Keep going. Revisit if results turn.</p>'}`;
  }
  if (s.t === 'confirm') { const n = inboxItems().filter(i => i.kind === 'need').length; h = `<h2>Play week ${g.week}?</h2><p>${n} decision${n === 1 ? '' : 's'} will be taken by your staff, following their mandates.</p><div class="row"><button class="btn" data-a="end">Play anyway</button><button class="btn ghost" data-a="review">Review first</button></div>`; }
  if (s.t === 'ticker') return vTicker();
  return `<div class="veil" data-a="veil"><div class="sheet" role="dialog" aria-modal="true">${h}</div></div>`;
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

