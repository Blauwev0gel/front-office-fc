function masthead() { const g = G(), c = g.club; return `<header class="hd">${crest(c.colors, c.short, 26)}<b>${esc(c.name)}</b><span class="wk" title="${F.blockOf ? esc(F.blockOf(g.week).t) : ''}">Wk ${Math.min(g.week, F.SEASON_WEEKS)}</span><button class="snd" data-a="sheet" data-s="help" aria-label="Help">?</button><button class="snd" data-a="sound" aria-label="Sound ${ART.SND.on() ? 'on' : 'off'}" aria-pressed="${ART.SND.on()}">${ART.SND.on() ? ART.I.sound : ART.I.mute}</button></header>`; }
function dl(now, k, fmt) { const p = G().prev; if (!p || p[k] == null) return ''; const prev = k === 'pos' ? -p.pos : p[k], d = now - prev; if (Math.abs(d) < (k === 'cash' ? 1 : 0.5)) return ''; return ` <small class="${d > 0 ? 'good' : 'bad'}">${d > 0 ? '▲' : '▼'}${fmt ? fmt(Math.abs(d)) : r0(Math.abs(d))}</small>`; }
function tabs() { return `<nav class="tabs">${[['desk', 'Desk'], ['news', 'News'], ['club', 'Club'], ['staff', 'Staff'], ['squad', 'Squad'], ['league', 'League']].map(([k, l]) => `<button class="${U.tab === k ? 'on' : ''}" data-a="tab" data-t="${k}">${l}</button>`).join('')}</nav>`; }

function vMsg(m) {
  const v = F.msgView(m);
  if (v.done) return `<article class="msg done"><div class="kick">${esc(cap(v.dept))}</div><h3>${esc(v.title)}</h3><div class="from">${esc(v.from)}</div><div class="outcome"><b>${v.by === 'you' ? 'You' : esc(v.by)}: ${esc(v.opts[v.choice].l)}.</b> ${esc(v.outcome)}</div></article>`;
  return `<article class="msg"><div class="kick">${esc(cap(v.dept))}</div><h3>${esc(v.title)}</h3><div class="from">${esc(v.from)}</div><div class="body">${esc(v.body)}</div>
  <p class="why"><b>On your desk because</b> ${esc(v.why)}</p>
  ${v.second ? (v.second.text ? `<p class="second">${esc(v.second.text)}</p>` : v.second.avail ? `<button class="btn ghost small" style="margin-bottom:10px" data-a="second" data-m="${m.id}" ${G().ap < 1 ? 'disabled' : ''}>Ask ${esc(v.second.name)} (${esc(v.second.role)}) for a second opinion: 1 action</button>` : '') : ''}
  <div class="opts">${v.opts.map((o, i) => `<button class="opt ${i === v.auto ? 'auto' : ''}" data-a="opt" data-m="${m.id}" data-i="${i}" ${G().ap < 1 ? 'disabled' : ''}><b>${esc(o.l)}</b><span>${esc(o.h)}</span></button>`).join('')}</div>
  <div class="foot">Costs one action. If you leave it, ${esc(v.autoWho)} will choose: "${esc(v.opts[v.auto].l)}" (dashed).</div></article>`;
}
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';
function vNews() { return `<article class="om gzwrap">${gazette()}</article>`; }
function tile(l, v, sub, cls, k) { return `<div class="tile"><span class="tl">${l}</span><b class="${cls || ''}">${v}</b>${k || ''}<span class="ts">${sub || ''}</span></div>`; }
function vDesk() {
  const g = G(), c = g.club, pend = g.inbox.filter(m => !m.done), doneW = g.inbox.filter(m => m.done && m.season === g.season && m.week === g.week), A = F.analysis(), lm = g.lastMatch;
  const st = A.pos <= A.target ? 'good' : A.pos <= A.target + 2 ? 'warn' : 'bad';
  const last = lm ? `${lm.result === 'W' ? 'Won' : lm.result === 'L' ? 'Lost' : 'Drew'} ${lm.home ? lm.ug + '–' + lm.tg : lm.tg + '–' + lm.ug} ${lm.home ? 'v' : 'at'} ${lm.oppName}` : '';
  return `<section class="stats">
    ${tile('Position', F.ord(A.pos), `target ${F.ord(A.target)}${A.g ? ', forecast ' + F.ord(A.fc) : ''}`, st, dl(-F.myPos(), 'pos', v => Math.abs(v)))}
    ${tile('Board', r0(g.board.conf) + '%', 'confidence', g.board.conf < 30 ? 'bad' : '', dl(g.board.conf, 'conf'))}
    ${tile('Supporters', r0(g.st.fans), 'mood', g.st.fans < 35 ? 'bad' : '', dl(g.st.fans, 'fans'))}
    ${tile('Cash', money(c.cash), `budget ${money(F.transferBudget())}`, c.cash < 0 ? 'bad' : '', dl(c.cash, 'cash', money))}
  </section>
  <div class="deskbar">${lm ? `<button class="linkish" data-a="tab" data-t="news">${esc(last)}. Read the paper</button>` : '<span class="small">Week one. Your staff are waiting for direction.</span>'}${A.g ? `<button class="linkish" data-a="sheet" data-s="analysis">${A.behind ? 'Why are we behind?' : 'Performance analysis'}</button>` : ''}</div>
  ${!g.flags.howto ? `<div class="note">Your staff handle everything their mandates allow. Only decisions that need you appear here, each with the reason. Leave one and the staff member decides (dashed option). You have three actions a week. The big choices were made in pre-season; there is one review meeting in week 17. <button class="linkish" data-a="howto">Got it</button></div>` : ''}
  ${vMeeting()}
  ${vBriefs()}
  <div class="deskhead"><h2>Decisions${pend.length ? ' (' + pend.length + ')' : ''}</h2><span class="row" style="gap:6px"><button class="btn ghost small" data-a="sheet" data-s="talk" ${g.ap < 1 ? 'disabled' : ''}>One-to-one</button><button class="btn ghost small" data-a="sheet" data-s="push" ${g.ap < 1 ? 'disabled' : ''}>Back a department</button></span></div>
  ${pend.length ? pend.map(vMsg).join('') : `<p class="note">Nothing needs you this week. Your staff are working within their mandates.${F.nextMeeting() && F.nextMeeting() !== g.week ? ` Next management meeting: week ${F.nextMeeting()}.` : ''}</p>`}
  ${doneW.length ? `<h3 style="margin:18px 0 6px">Decided this week</h3><ul class="list">${doneW.map(m => { const v = F.msgView(m); return `<li style="display:block"><b>${esc(v.title)}</b><div class="small">${v.by === 'you' ? 'You' : esc(v.by)}: ${esc(v.opts[v.choice].l)}. ${esc(v.outcome)}</div></li>`; }).join('')}</ul>` : ''}`;
}
function vBriefs() {
  const g = G(), B = g.briefs || []; if (!B.length) return '';
  return `<div class="deskhead"><h2>This week</h2><span class="small">Quick responses, no action cost</span></div><div class="briefs">${B.map(b => { const v = F.briefView(b); return `<article class="brief ${v.done ? 'done' : ''}"><div class="kick">${esc(v.who)}</div><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p>${v.done ? `<p class="outcome"><b>${esc(v.opts[v.choice].l)}.</b> ${esc(v.out)}</p>` : `<div class="chipsrow">${v.opts.map((o, i) => `<button class="chipbtn" data-a="brief" data-b="${b.id}" data-i="${i}"><b>${esc(o.l)}</b>${o.h ? `<span>${esc(o.h)}</span>` : ''}</button>`).join('')}</div>`}</article>`; }).join('')}</div>`;
}
function vPlayBar() {
  const g = G(), pend = g.inbox.filter(m => !m.done).length + (g.meeting && g.meeting.week === g.week && g.meeting.season === g.season ? g.meeting.items.filter(i => i.status === 'open').length : 0);
  return `<div class="playbar"><div class="pb-in"><div class="pb-txt">${apPips(g.ap)} <span>${pend ? `${pend} open, staff decide if you play on` : 'All clear'}</span><small>${nextFixture()}</small></div><button class="btn" data-a="end">Play week ${g.week}</button></div></div>`;
}
function vStand() {
  const g = G(), A = F.analysis(); if (!A.g) return '';
  const st = A.pos <= A.target ? 'good' : A.pos <= A.target + 2 ? 'warn' : 'bad';
  return `<section class="stand ${st}"><div class="spread"><div><div class="kick">Where we stand</div><h3 style="font-size:22px">${F.ord(A.pos)} <span class="small">target ${F.ord(A.target)}</span></h3></div><button class="btn ghost small" data-a="sheet" data-s="analysis">Why? See the analysis</button></div>
  <p class="small" style="margin:6px 0 0">${A.pos <= A.target ? 'On target.' : `${A.gap} point${A.gap === 1 ? '' : 's'} off ${F.ord(A.target)}.`} Forecast: ${A.fc ? F.ord(A.fc) : '–'}. Points ${A.pts}, deserved on chances ${A.xpts.toFixed(0)}.${A.causes.length && A.behind ? ' Main issue: ' + esc(A.causes[0].t.split('.')[0]) + '.' : ''}</p></section>`;
}
function vMeeting() {
  const g = G(), mt = g.meeting; if (!mt || mt.pre || mt.week !== g.week || mt.season !== g.season || !mt.items.length) return '';
  return meetingBlock(mt, 'Mid-season review');
}
