/* ---------- the red box: an email you answer on one screen ---------- */
const mFirst = n => /trust|board|press|office|the /i.test(n) ? n : n.split(' ')[0];
function mailParas(t) { let rest = String(t || '').trim(), out = []; while (rest && out.length < 6) { const [a, b] = clip2(rest); out.push(a); rest = b; } return out.map(p => `<p>${esc(p)}</p>`).join(''); }
function mailTop(role, name, roleT, title, tag, body, emo) {
  const g = G();
  return `<div class="mail"><div class="mtagr">${tag}</div><h2 class="msubj">${esc(title)}</h2>
  <div class="mfrom"><span class="mav">${ART.staffFace(role, emo)}</span><div class="mfm"><div class="mfr"><b>${esc(name)}</b><time>Week ${g.week}</time></div><div class="mto">To: You</div></div></div>
  <div class="mbody">${mailParas(body)}<p class="msign">${esc(mFirst(name))}</p><div class="msig"><span class="mcrest">${esc(g.club.short || 'FC')}</span><span><b>${esc(name)}</b><br>${esc(roleT ? roleT + ', ' : '')}${esc(g.club.name)}</span></div>${DEPT_OF[role] && F.DEPT ? `<button class="linkbtn mdept" data-a="godept" data-k="${DEPT_OF[role]}">Open ${esc(F.DEPT[DEPT_OF[role]].t)}</button>` : ''}</div></div>`;
}
const MSV = d => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const MAILI = { reply: MSV('<path d="M10 8L4 13l6 5"/><path d="M4 13h10a6 6 0 0 1 6 6"/>'), send: MSV('<path d="M12 19V5M5 12l7-7 7 7"/>'), env: MSV('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 7l9 6 9-6"/>'), x: MSV('<path d="M6 6l12 12M18 6L6 18"/>') };
function mailRows(k, id, opts, auto, dis, sel) {
  return `<div class="slist" role="radiogroup" aria-label="Suggested replies">${opts.map((o, j) => `<button class="srow ${j === auto ? 'isadv' : ''} ${j === sel ? 'sel' : ''}" role="radio" aria-checked="${j === sel}" data-a="mcomp" data-k="${k}" data-id="${id}" data-i="${j}" ${dis ? 'disabled' : ''}><span class="sk">${esc(o.l)}${j === auto ? '<small>Advised</small>' : ''}</span><span class="sfx">${ART.fx(o.h)}</span></button>`).join('')}</div>`;
}
// the reply dock: a second voice if there is one, the replies, and one Send button (B20)
function second2(sec) {
  if (!sec || !sec.text) return ''; const mm = /^(.*?) \((.*?)\): (.*)$/.exec(sec.text), who = mm ? mm[1] : sec.name, role = mm ? mm[2] : sec.role, txt = mm ? mm[3] : sec.text;
  const rk = (F.ROLES.find(r => r.t === role) || { id: 'club' }).id;
  return `<div class="m2nd"><span class="mav">${ART.staffFace(rk)}</span><p><b>${esc(who)}</b><small>${esc(role)}, second opinion</small>${esc(txt)}</p></div>`;
}
function replyDock(k, id, opts, auto, sel, big, foot, dis, sec, head) {
  const o = sel != null && sel >= 0 ? opts[sel] : null;
  return mailDock(`${second2(sec)}<div class="slh"><b>Your reply</b>${head || ''}</div>${mailRows(k, id, opts, auto, dis, sel)}
  <div class="mrow"><p class="mlv">${esc(foot)}</p><button class="msend ${o ? 'live' : ''} ${big && o ? 'hold' : ''}" ${big ? '' : 'data-a="msend"'} data-k="${k}" data-id="${id}" data-i="${o ? sel : -1}" ${o && !dis ? '' : 'disabled'}>${MAILI.send}<span>${o ? (big ? 'Hold to send' : 'Send') : 'Pick a reply'}</span><i class="mfill"></i></button></div>`, o ? 'open' : '');
}
function mailDock(inner, cls) { return `<div class="mdock ${cls || ''}" role="region" aria-label="Your reply"><div class="in">${inner}</div></div>`; }
function mailBanner() {
  const b = U.bn; if (!b || b.n === U.bnShown) return ''; U.bnShown = b.n;
  return `<div class="mbn" role="status"><span class="mbav">${ART.staffFace(b.role, 'happy')}</span><div><div class="mbt"><b>${esc(b.name)}</b><span>now</span></div><small>Re: ${esc(b.subj)}</small><p>${esc(clip2(b.txt)[0])}</p></div></div>`;
}
function mailSent(name, line, out) {
  return mailDock(`<div class="msent"><div class="msh"><span class="mok">${ART.I.trust}</span><b>Sent to ${esc(mFirst(name))}</b></div><p class="msaid">${esc(line)}</p><p class="mout">${esc(clip2(out)[0])}</p></div><button class="mnext" data-a="mnext">Next email ${ART.I.chev}</button>`, 'sent') + mailBanner();
}
function bkStrip() {
  if (!F.backers) return ''; const B = F.backers(), from = U.bkFrom;
  return `<div class="mbk" aria-label="Your backers">${B.map((b, j) => { const d = from && from[j] != null ? b.v - from[j] : 0; return `<span class="mbkb ${d ? 'bump ' + (d > 0 ? 'g' : 'r') : ''} ${b.danger ? 'lo' : ''}"><small>${esc(b.t === 'Dressing room' ? 'Room' : b.t === 'Supporters' ? 'Fans' : b.t)}</small><em><u style="width:${b.v}%"></u></em>${d ? `<i class="mfl ${d > 0 ? 'up' : 'dn'}">${d > 0 ? '+' : ''}${d}</i>` : ''}</span>`; }).join('')}</div>`;
}
function msgHtml(m, it) {
  const v = F.msgView(m), g = G(), role = v.role || (it && it.role) || 'club', name = v.from.split(',')[0], roleT = v.from.split(', ')[1] || ROLE_T[role] || '';
  const emo = /refuse|angry|furious|appalled|protest|demand/i.test(v.body) ? 'angry' : /worr|concern|pressure|injur|risk/i.test(v.body) ? 'worried' : null;
  const big = /^vote_/.test(m.ev), key = 'm' + m.id;
  const tag = v.done ? `<span class="mtg ok">${ART.I.trust}${v.by === 'you' ? 'Replied' : v.del ? (v.err ? 'Wrong call' : 'Staff call') : 'Handled'}</span>` : `<span class="mtg ${big ? 'big' : ''}">${big ? 'Big decision' : esc((it && it.label) || 'Your call')}</span>`;
  let h = mailTop(role, name, roleT, v.title, tag, v.body, emo);
  if (v.done) {
    if (U.sentK === key && v.by === 'you') { U.tray = mailSent(name, v.opts[v.choice].l + '.', v.outcome); U.trayH = 210; return h + fdHtml(m.fd); }
    return h + (v.del ? `<div class="whyr ${v.err ? 'bad' : 'ok'}"><span>${ART.I[v.err ? 'risk' : 'trust']}</span><p><b>${v.err ? 'A wrong call by your staff' : 'Decided by your staff'}</b>${v.err ? 'It went against your mandate. Too many of these and the board notices.' : 'Within the authority you gave the department. You did not need to act.'}</p></div>` : '') + `<div class="outc"><b>${v.by === 'you' ? 'You' : esc(v.by)}: ${esc(v.opts[v.choice].l)}.</b> ${esc(v.outcome)}</div>` + fdHtml(m.fd);
  }
  h += `<p class="mwhy"><b>Why it is yours.</b> ${esc(v.why)}</p>`;
  if (m.ev === 'pw_meet' && F.pwView) h += pwMeetHtml(F.pwView());
  if (m.ev === 'pw_eval' && F.pwView) h += pwEvalHtml(F.pwView());
  if (v.second && !v.second.text && v.second.avail) h += `<p class="small"><button class="linkbtn" data-a="second" data-m="${m.id}">Ask ${esc(v.second.name.split(' ')[0])} for a second opinion</button></p>`; // older messages: asking is free
  const leave = `Leave it and ${v.autoWho} sends the advised reply.`;
  const sel = U.mc && U.mc.k === 'm' && U.mc.id === m.id ? U.mc.i : -1, sec = v.second && v.second.text ? v.second : null;
  U.tray = replyDock('m', m.id, v.opts, v.auto, sel, big, leave, false, sec, ''); U.trayH = 150 + v.opts.length * 58 + (sec ? 90 : 0);
  return h;
}
function briefHtml(b, it) {
  const v = F.briefView(b), role = v.role || (it && it.role) || 'club', name = v.who.split(',')[0], roleT = v.who.split(', ')[1] || '', key = 'b' + b.id;
  const tag = v.done ? `<span class="mtg ok">${ART.I.trust}${v.del ? 'Staff call' : 'Replied'}</span>` : `<span class="mtg upd">${F.OPP_IDS && F.OPP_IDS.has(b.t) ? 'Opportunity' : 'Update'}</span>`;
  let h = mailTop(role, name, roleT, v.title, tag, v.text, null);
  if (v.done) {
    if (U.sentK === key && !v.del) { U.tray = mailSent(name, v.opts[v.choice].l + '.', v.out); U.trayH = 210; return h + fdHtml(b.fd); }
    return h + `<div class="outc"><b>${v.del ? esc(v.by) + ': ' : ''}${esc(v.opts[v.choice].l)}.</b> ${esc(v.out)}</div>` + fdHtml(b.fd);
  }
  if (v.why) h += `<p class="mwhy"><b>Why it is yours.</b> ${esc(v.why)}</p>`;
  const leave = 'Free. Leave it and nothing changes.';
  const sel = U.mc && U.mc.k === 'b' && U.mc.id === b.id ? U.mc.i : -1;
  U.tray = replyDock('b', b.id, v.opts, -1, sel, false, leave, false, null, ''); U.trayH = 150 + v.opts.length * 58;
  return h;
}
function mailCommit(p) {
  const bk0 = F.backers ? F.backers().map(b => b.v) : null;
  const r = p.k === 'm' ? F.respond(p.id, p.i) : F.answerBrief(p.id, p.i);
  if (!r || r.err) { if (r && r.err) toast(r.err); return; }
  let role = 'club', name = 'Club office', subj = '';
  if (p.k === 'm') { const m = G().inbox.find(x => x.id === p.id), v = F.msgView(m); role = v.role || 'club'; name = v.from.split(',')[0]; subj = v.title; }
  else { const b = (G().briefs || []).find(x => x.id === p.id), v = F.briefView(b); role = v.role || 'club'; name = v.who.split(',')[0]; subj = v.title; }
  U.sentK = p.k + p.id; U.bkFrom = bk0; U.bn = { role, name, subj, txt: r.out, n: (U.bn ? U.bn.n : 0) + 1 };
  ART.SND.card(); ART.vib(big(p) ? [20, 40, 30] : 15);
  clearTimeout(mailCommit.t); mailCommit.t = setTimeout(() => { U.bkFrom = null; }, 1500);
}
function big(p) { if (p.k !== 'm') return false; const m = G().inbox.find(x => x.id === p.id); return !!(m && /^vote_/.test(m.ev)); }
function mailSend(d) {
  const p = { k: d.k, id: +d.id, i: +d.i }; if (!(p.i >= 0)) return; U.mc = null; U.pend = null; U.mfly = (U.mfly || 0) + 1;
  mailCommit(p); // sent at once: no waiting, no undo (B20)
}
const MAIL_RM = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
function mailAfter() {
  const t = document.querySelector('#app .typed[data-full]');
  if (t) { const full = t.dataset.full, k = t.dataset.key; if (U.typedKey === k || MAIL_RM) t.textContent = full; else { U.typedKey = k; let n = 0; const tick = () => { if (!t.isConnected) return; t.textContent = full.slice(0, ++n); if (n < full.length) setTimeout(tick, 16); }; tick(); } }
  const seg = document.querySelector('#app .mseg'); if (seg) { const on = seg.querySelector('.sg.on'), ind = seg.querySelector('.mseg-i'); if (on && ind) { Object.assign(ind.style, { left: on.offsetLeft + 'px', top: on.offsetTop + 'px', width: on.offsetWidth + 'px', height: on.offsetHeight + 'px' }); seg.classList.add('has'); } }
  if (U.mfly && U.mfly !== U.mflyShown) { U.mflyShown = U.mfly; const e = document.createElement('span'); e.className = 'mfly'; e.innerHTML = MAILI.env; document.body.appendChild(e); setTimeout(() => e.remove(), 900); }
}
let MH = null;
document.addEventListener('pointerdown', e => { const b = e.target.closest('.msend.hold'); if (!b || b.disabled) return; e.preventDefault(); b.classList.add('holding'); MH = setTimeout(() => { b.classList.remove('holding'); MH = null; ART.vib([30, 30, 60]); mailSend(b.dataset); render(); }, MAIL_RM ? 10 : 1100); });
['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => document.addEventListener(ev, e => { if (!MH) return; clearTimeout(MH); MH = null; document.querySelectorAll('.msend.holding').forEach(b => b.classList.remove('holding')); }, true));

function propHtml(idx, row) { return pitchDeck(G().meeting, 'Project pitches', true); }
const TOUR = {
  inbox: ['This week', 'What needs you this week. Decisions cost an action and build your grip; leave them and your staff decide.'],
  club: ['Your club', 'How the club is doing: who backs you, the board\'s objectives, the money and your projects.'],
  squad: ['Your squad', 'The coach\'s likely eleven and the rest of the squad. Tap any player for his profile. You never pick the team yourself.'],
  league: ['The league', 'Where you stand, who is next and how the cup is going. Top three go up, bottom three go down.'],
  staff: ['Your departments', 'Each department has a head who runs his own staff. Open one to see how it goes and what he plans, or to talk to him.']
};
function tourCard(k) { const g = G(), t = TOUR[k]; if (!t || (g.flags.tour || {})[k]) return ''; return `<div class="tourc"><b>${esc(t[0])}</b><p>${esc(t[1])}</p><button class="btn small" data-a="tour-ok" data-k="${k}">Got it</button></div>`; }
function tabBadge(k) {
  const g = G();
  if (k === 'inbox') { const n = inboxItems().filter(isBox).length; return n ? `<em class="nbadge">${n}</em>` : ''; }
  if (k === 'club') { const run = F.finRunway ? F.finRunway() : null; return (g.grip != null && g.grip < 30) || (run != null && run <= 8) || g.board.conf < 30 ? '<em class="nbadge warn">!</em>' : ''; }
  if (k === 'squad') return (g.msNew || []).length ? `<em class="nbadge dot"></em>` : '';
  if (k === 'staff') { const n = F.deptOverview().filter(o => !o.s).length; return n ? '<em class="nbadge warn">!</em>' : ''; }
  return '';
}
function vBar() {
  const g = G(), open = inboxItems().filter(i => i.kind === 'need').length, gr = Math.round(g.grip == null ? 60 : g.grip);
  return `<div class="bar2"><div class="b2play"><span class="b2l"><button class="gripchip ${gr < 30 ? 'lo' : gr >= 70 ? 'hi' : ''}" data-a="sheet" data-s="grip" aria-label="Your grip on the club: ${gr}"><i style="width:${gr}%"></i><b>Grip ${gr}</b></button></span><button class="btn" data-a="play">${ART.I.play}${F.mtPreview && F.mtPreview() ? 'Next match' : 'Play week ' + g.week}${open ? ` <em class="cnt" aria-label="${open} need you">${open}</em>` : ''}</button></div><nav class="b2nav">${[['inbox', 'Inbox'], ['club', 'Club'], ['squad', 'Squad'], ['league', 'League'], ['staff', 'Depts']].map(([k, l]) => `<button class="${U.tab === k ? 'on' : ''}" data-a="tab" data-t="${k}" aria-label="${l}"><span class="nic">${ART.I[k]}${tabBadge(k)}</span>${l}</button>`).join('')}</nav></div>`;
}
function advance() { const nx = inboxItems().find(x => (x.kind === 'need' || x.kind === 'upd') && x.key !== U.open); if (nx) U.open = nx.key; else U.flash = ''; }
function markFresh() { U.seenB = U.seenB || new Set(); for (const b of document.querySelectorAll('#app .bubble')) { const k = b.textContent.slice(0, 80); if (!U.seenB.has(k)) { b.classList.add('anim'); U.seenB.add(k); } } if (U.seenB.size > 400) U.seenB = new Set(); }
function render() {
  const g = G(); const y = window.scrollY; let h = '';
  if (!g || U.title) h = vTitle();
  else if (g.phase === 'dna') h = vSetupDNA();
  else if (g.phase === 'staff') h = vSetupStaff();
  else if (g.phase === 'mandates') h = vSetupMandates();
  else if (g.phase === 'summer') { F.sum2Ensure(); h = vSummer2(); }
  else if (g.phase === 'preseason') h = vPreseason();
  else if (g.phase === 'press') h = vPress();
  else if (U.md) h = vMatchday();
  else if ((g.phase === 'review' || g.phase === 'sacked') && U.ticker) h = '';
  else if (g.phase === 'review') h = vReview2();
  else if (g.phase === 'sacked') h = vSacked();
  else { U.tray = ''; h = masthead() + ({ inbox: vInbox, desk: vInbox, news: vNews, club: vClub2, staff: () => U.dept ? vDept(U.dept) : vDepts(), squad: vSquad, league: vLeague2, money: vMoney })[U.tab](); h += ((U.tab === 'inbox' && U.open) || (U.tab === 'staff' && U.dept)) && U.tray ? U.tray : vBar(); }
  app.innerHTML = h + vSheet() + (U.toast ? `<div class="toast" role="status">${esc(U.toast)}</div>` : '') + (U.flash && U.flashN !== U.flashShown ? (U.flashShown = U.flashN, `<div class="fxtoast" role="status">${esc(U.flash)}</div>`) : '');
  markFresh(); mailAfter(); if (U.md && U.md.phase === 'match' && !U.md.ft) MDP.start();
  window.scrollTo(0, y); ddSchedule();
}

