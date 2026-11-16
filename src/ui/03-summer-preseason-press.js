/* ---------- the summer (M4) ---------- */
const STATUS_L = { need: ['Need', 'bad'], weak: ['Weak', 'warn'], ageing: ['Ageing', 'warn'], thin: ['Thin', ''], ok: ['Covered', 'good'] };
/* ---------- the summer, version 2 ---------- */
const WHO = r => r === 'you' ? 'You' : r === 'board' ? 'The chairman' : `${F.staffName(r)}${F.ROLE[r] ? ', ' + F.ROLE[r].s : ''}`;
function ddBlock(doneBtn) {
  const g = G(), S = g.sum, d = S.dd, dec = F.ddDecision(), H = F.DD_HOURS;
  return `<div class="ddclock"><div><div class="kick">Deadline day</div><b class="num">${d ? H[Math.max(0, d.t)] : '08:00'}</b></div><div class="small" style="text-align:right">Window shuts<br><span class="num" style="font-size:20px">23:00</span></div></div>
    <div class="ddbar"><i style="width:${d ? Math.max(0, d.t) / (H.length - 1) * 100 : 0}%"></i></div>
    ${dec ? `<div class="smsg dd" aria-live="assertive"><div class="kick">Exception: your call</div><b>${esc(dec.title)}</b><p class="small">${esc(dec.body)}</p>${caseHtml(F.ddCase ? F.ddCase() : null)}<div class="cd"><i style="animation-duration:${Math.max(0, (U.ddDecEnd || Date.now() + 12000) - Date.now())}ms"></i></div><div class="ch">${dec.opts.map((o, j) => `<button class="cbtn" data-a="dd-dec" data-i="${j}"><b>${esc(o.l)}</b>${o.h ? `<span>${esc(o.h)}</span>` : ''}</button>`).join('')}</div><p class="small">No answer and ${esc(F.staffName('dof'))} decides.</p></div>` : ''}
    ${d ? `<ul class="feedl dd">${d.feed.map(l => `<li class="fk-${l.k || 'quiet'}"><span class="fk num">${l.h}</span>${esc(l.t)}</li>`).join('')}</ul>` : ''}
    <div class="row" style="margin-top:18px">${d && d.done ? doneBtn : d ? `<button class="btn ghost" data-a="dd-pause">${d.run ? 'Pause' : 'Resume'}</button><button class="btn ghost" data-a="dd-skip">Skip to 23:00</button>` : ''}</div>`;
}
function mtCard(it) {
  const g = G(), S = g.sum, mt = S.mt, R = g.rec;
  if (it === 'club') {
    const pl = F.sumPlanner(), cs = F.sumView().contracts, L = g.lastReport;
    return `<section class="dcard">${L && L.table ? `<dl class="figs"><div><dt>Finished</dt><dd>${F.ord(L.pos)}</dd></div><div><dt>Goals</dt><dd>${L.table.find(x => x.id === 0).gf}–${L.table.find(x => x.id === 0).ga}</dd></div><div><dt>Squad</dt><dd>${g.squad.length}</dd></div></dl>` : ''}
    <div class="scroll"><table class="plan"><thead><tr><th>Position</th><th>Players</th><th>Best</th><th>Age</th><th></th></tr></thead><tbody>${pl.map(r => `<tr><td>${F.POS_L[r.pos]}</td><td class="num">${r.n}/${r.req}</td><td>${r.best ? stars(r.best) : '–'}</td><td class="num">${r.age || '–'}</td><td class="${STATUS_L[r.status][1]}">${STATUS_L[r.status][0]}</td></tr>`).join('')}</tbody></table></div>
    ${cs.length ? `<h3 style="margin-top:10px">Contract package</h3><ul class="list">${cs.map(({ p, c }) => `<li><span>${esc(p.name)} <span class="pos">${p.pos}</span><br><span class="small">${p.age}, ${F.stars(p.ca)}★, asks ${money(c.demand.wage)}/wk for ${c.demand.years}y${c.demand.refuse ? ', may refuse' : ''}</span></span><b class="${(c.choice || c.advice) === 'renew' ? 'good' : 'bad'}">${c.out ? (c.choice === 'release' || (!c.choice && c.advice === 'release') ? 'Released' : 'Done') : (c.choice || c.advice) === 'renew' ? 'Keep' : 'Let go'}</b></li>`).join('')}</ul>` : ''}</section>`;
  }
  if (it === 'money') {
    const b = F.budgetCosts(), wf = F.weekForecast(), net = wf.rev - wf.cost, cap = +F.man('fin', 'wageCap');
    const row = (role, k, l, cost, note) => F.staff(role) || role === 'fin' ? `<div class="sl"><div class="spread"><label for="pb-${role}-${k}">${l}</label><span class="num">${cost != null ? money(cost) + '/wk' : ''}</span></div><input type="range" min="0" max="100" step="5" id="pb-${role}-${k}" value="${F.man(role, k)}" data-sl="${role}" data-k="${k}" data-p="pb"><div class="ends"><span>${note[0]}</span><span>${note[1]}</span></div></div>` : '';
    return `<section class="dcard"><dl class="figs"><div><dt>Transfer budget</dt><dd>${money(F.transferBudget())}</dd></div><div><dt>Wages / revenue</dt><dd class="${F.wageRatio() * 100 > cap ? 'bad' : ''}">${r0(F.wageRatio() * 100)}% of ${cap}%</dd></div><div><dt>Cash</dt><dd>${money(g.club.cash)}</dd></div><div><dt>Weekly result</dt><dd class="${net < 0 ? 'bad' : 'good'}">${net >= 0 ? '+' : ''}${money(net)}</dd></div></dl>
    <details class="fold"><summary>Department budgets</summary>${row('scout', 'budget', 'Scouting', b.scouting, ['Lean', 'Lavish'])}${row('acad', 'budget', 'Academy', b.academy, ['Lean', 'Lavish'])}${row('mkt', 'budget', 'Marketing', b.marketing, ['Lean', 'Lavish'])}${row('fin', 'invest', 'Facility investment', b.facilities, ['Cut costs', 'Invest'])}</details></section>`;
  }
  if (it === 'needs') {
    const p = mt.plan; if (!p) return '';
    return `<section class="dcard"><div class="spread"><b>${p.approach === 'star' ? 'Approach: one big signing' : 'Approach: spread the money'}</b><span class="small">${money(F.transferBudget())}</span></div>
    ${p.prios.map((pos, i) => `<h3 style="margin-top:10px">${i + 1}. ${F.POS_L[pos]}</h3>${(p.lists[pos] || []).length ? (p.lists[pos] || []).map((id, j) => { const pl = R.pool[id], k = R.know[id]; return pl ? `<button class="rrow" data-a="target" data-id="${id}"><span class="gr g${k.grade}">${k.grade}</span><span class="rmain"><b>${esc(pl.name)}</b> <span class="small">${j === 0 ? 'plan A' : j === 1 ? 'plan B' : 'option'}</span><span class="small rsub">${pl.age}, ${F.REGIONS[pl.region].name}, ${F.recBand(k)}, ${pl.club ? money(pl.ask) : 'free agent'}</span></span></button>` : ''; }).join('') : '<p class="small">No names yet. The scouts keep looking.</p>'}`).join('')}
    ${p.sell.length || p.keep.length ? `<h3 style="margin-top:10px">Squad</h3><p class="small">${p.sell.length ? 'Can go: ' + p.sell.map(id => (g.squad.find(x => x.id === id) || {}).name).filter(Boolean).join(', ') + '. ' : ''}${p.keep.length ? 'Not for sale: ' + p.keep.map(id => (g.squad.find(x => x.id === id) || {}).name).filter(Boolean).join(', ') + '.' : ''}</p>` : ''}</section>`;
  }
  if (it === 'brief') {
    const B = mt.brief; if (!B) return '';
    return `<section class="dcard brief"><div class="kick">Summer brief, season ${g.season}</div><h3>Priorities</h3><p>${B.prios.map(x => F.POS_L[x]).join(', ')}. ${B.approach === 'star' ? 'One big signing.' : 'Spread across positions.'}</p>
    <h3>Money and limits</h3><p>Budget ${money(B.budget)}. You approve ${B.approve === '999' ? 'no deals' : B.approve === '0' ? 'every deal' : 'deals above ' + money(Math.round(B.budget * (+B.approve) / 100))}.${B.keep.length ? ' Not for sale: ' + B.keep.map(id => (g.squad.find(x => x.id === id) || {}).name).filter(Boolean).join(', ') + '.' : ''}${B.sell.length ? ' Can go: ' + B.sell.map(id => (g.squad.find(x => x.id === id) || {}).name).filter(Boolean).join(', ') + '.' : ''}</p>
    <h3>The DoF will be judged on</h3><ol>${B.kpis.map(k => `<li>${esc(k.t)}</li>`).join('')}</ol><div class="sigs"><span>${esc(F.staffName('dof'))}</span><span>${U.signing ? '<i class="sig">CEO</i>' : '<em>Your signature</em>'}</span></div>${U.signing ? '<div class="stampx">SIGNED</div>' : ''}</section>`;
  }
  return '';
}
function vSummer2() {
  const g = G(), S = g.sum, st = S.step, STEPS = F.SUM2_STEPS;
  const nav = `<div class="steps">${STEPS.map((l, i) => `<span class="stp ${i === st ? 'on' : i < st ? 'done' : ''}">${i + 1}. ${l}</span>`).join('')}</div>`;
  let body = '';
  if (st === 0) {
    const mt = S.mt, items = Object.keys(F.SUM2_ITEMS), it = items[mt.item], resp = F.sum2Responses();
    const agenda = `<ol class="agenda">${items.map((k, i) => `<li class="${i === mt.item ? 'on' : i < mt.item ? 'done' : ''}">${F.SUM2_ITEMS[k]}</li>`).join('')}</ol>`;
    const log = mt.log.filter(l => l.i === mt.item), last = log[log.length - 1], prev = log[log.length - 2];
    const who = { club: ['board', 'dof', 'coach'], money: ['board', 'fin', 'dof'], needs: ['coach', 'scout', 'dof'], brief: ['board', 'dof'] }[it];
    const moods = mt.moods || {}, speaker = last && last.who !== 'you' ? last.who : 'dof', d = F.staff('dof');
    const seats = who.map(w => `<div class="seat ${w === speaker ? 'talk' : ''}"><div class="sface">${ART.staffFace(w, moods[w])}</div><span class="nm">${esc(w === 'board' ? 'Chairman' : (F.staffName(w) || '').split(' ').slice(-1)[0])}</span></div>`).join('');
    const fx = mt.fx && mt.fx.n !== U.fxSeen ? (U.fxSeen = mt.fx.n, `<span class="fxf ${mt.fx.bad ? 'bad' : 'good'}">${esc(mt.fx.t)}</span>`) : '';
    body = `<div class="progress-l">${F.SUM2_ITEMS[it]}</div><div class="progress">${items.map((k, i) => `<i class="${i === mt.item ? 'on' : i < mt.item ? 'done' : ''}"></i>`).join('')}</div><div class="scene"><div class="table"></div>${seats}${fx}</div>
    ${prev && prev.who === 'you' ? `<p class="you-said">You: ${esc(prev.t)}</p>` : ''}
    ${last ? `<div class="bubble ${last.who === 'you' ? 'me' : ''} ${last.k === 'plan' ? 'plan' : ''}"><div class="who">${esc(WHO(last.who))}</div>${esc(last.t)}${last.who !== 'you' && last.who !== 'board' && ticOf(last.who, last.t) ? `<span class="tic">${esc(ticOf(last.who, last.t))}</span>` : ''}</div>` : ''}
    ${d ? `<div class="trustm">${ART.I.trust}<span>${esc(d.name.split(' ').slice(-1)[0])}'s trust</span><i><b style="width:${r0(d.rel)}%"></b></i><span class="num">${r0(d.rel)}</span></div>` : ''}
    ${mtCard(it)}
    ${log.length > 2 ? `<details class="fold minutes"><summary>Meeting notes (${log.length})</summary>${log.map(l => `<p><b>${esc(WHO(l.who))}:</b> ${esc(l.t)}</p>`).join('')}</details>` : ''}
    ${trayHtml(`<span>${it === 'brief' ? 'Sign it' : 'Your response'}</span><span>${mt.item + 1} of ${items.length}</span>`, resp.map((o, j) => o.k === 'sign' ? `<button class="btn" data-a="mt-ans" data-i="${j}" data-k="sign" ${U.signing ? 'disabled' : ''}>Sign the summer brief</button>` : choiceHtml(o, j, `data-a="mt-ans" data-i="${j}" data-k="${o.k}"`, false, U.signing)).join(''), '')}<div class="trayspace" style="--tray:${80 + resp.length * 66}px"></div>`;
  } else if (st === 1) {
    const tk = S.tk;
    if (tk.phase === 'dd') body = ddBlock(`<button class="btn" data-a="s2-step" data-i="2">Read the summer edition</button>`);
    else {
      const call = F.tkCall(), lines = tk.lines.slice(0, tk.shown).reverse(), W = F.SUM2_WEEKS, board = F.recPlanBoard();
      const plan = `<div class="planboard">${board.map(r => `<${r.pid ? `button data-a="target" data-id="${r.pid}"` : 'div'} class="pl ${r.st}"><i class="dot"></i>${F.POS_L[r.pos]}<span>${esc(r.who)}</span></${r.pid ? 'button' : 'div'}>`).join('')}</div>`;
      let callH = '';
      if (call) {
        const c = call.m.ctx || {}, R = g.rec, tp = c.pid && R.pool[c.pid], tk2 = tp && R.know[c.pid];
        const chips = tp ? `<div class="chips3"><div><small>Asking</small><b>${tp.club ? money(c.counter || tp.ask) : 'Free'}</b></div><div><small>Wage</small><b>${money(tp.wageAsk)}</b></div><div><small>Budget</small><b>${money(F.transferBudget())}</b></div></div>` : '';
        callH = `<div class="callhead"><div class="portrait">${ART.staffFace(F.EV[call.m.ev].from || 'dof')}</div><div><b>${esc(call.v.from.split(',')[0])}</b><span><i class="ringdot"></i>is calling</span></div><span class="phoneic">${ART.I.phone}</span></div>
        <h2 class="ask">${esc(call.v.title)}</h2>${tp ? pcard(tp, { k: tk2 }) : ''}${chips}
        <details class="more"><summary>Details ${ART.I.chev}</summary><p>${esc(call.v.body)}</p><p>${esc(call.v.why)}</p></details>`;
        U.tkTray = trayHtml('<span>Your call</span><span>His advice is marked</span>', call.v.opts.map((o, j) => `<button class="cho ${j === call.ai ? 'pick' : ''}" data-a="tk-ans" data-i="${j}">${j === call.ai ? '<span class="pk">His advice</span>' : ''}<b>${esc(o.l)}</b><span class="fx">${ART.fx(o.h)}</span></button>`).join(''), '');
      } else U.tkTray = '';
      const line = l => `<li class="fk-${l.k || 'quiet'}"><span class="fk">${esc(l.h)}</span>${l.pid && (g.squad.find(q => q.id === l.pid) || (g.rec.pool[l.pid])) ? `<button class="lnk" data-a="${g.squad.some(q => q.id === l.pid) ? 'player' : 'target'}" data-id="${l.pid}"><span class="mf">${(() => { const q = g.squad.find(q => q.id === l.pid) || g.rec.pool[l.pid]; return q.pool ? ART.poolFace(q) : ART.playerFace(q); })()}</span>${esc(l.t)}</button>` : esc(l.t)}</li>`;
      body = `<div class="clock"><div><div class="kick">The summer</div><b>${tk.wk < 0 ? 'Before the window' : W[Math.min(tk.wk, W.length - 1)] + ' of ' + W.length}</b></div><div class="pips">${W.map((l, i) => `<i class="${i <= tk.wk ? 'on' : ''}"></i>`).join('')}</div></div>
      ${callH || `<div class="sec" style="margin-top:8px">The plan, live</div>${plan}<div class="minifigs"><span>${ART.I.money}${money(F.transferBudget())} left</span><span>${ART.I.squad}${g.squad.length} players</span><span>${ART.I.chev}${S.log.filter(l => l.k === 'in').length} in, ${S.log.filter(l => l.k === 'out').length} out</span></div>`}
      <ul class="feedl dd">${lines.map(line).join('') || `<li class="fk-quiet"><span class="fk"></span>${esc(F.staffName('dof'))} picks up the phone.</li>`}</ul>
      ${call ? U.tkTray + `<div class="trayspace" style="--tray:${90 + call.v.opts.length * 60}px"></div>` : `<div class="row" style="margin-top:14px"><button class="btn ghost" data-a="tk-pause">${tk.run ? 'Pause' : 'Resume'}</button><button class="btn ghost" data-a="tk-skip">Skip to deadline day</button></div>`}`;
    }
  } else if (st === 2) {
    const E = F.sum2Edition(), R = g.rec;
    const card = l => { const p = g.squad.find(q => q.name === l.name && (!l.pos || q.pos === l.pos)); const lg = R.log.find(x => x.name === l.name && x.s === g.season); const sur = lg && lg.surplus; return p ? `<button class="inc ${sur ? 'flag' : ''}" data-a="player" data-id="${p.id}"><span class="pf">${ART.playerFace(p, 'happy')}</span><span><b>${esc(p.name.split(' ').slice(-1)[0])}</b><small>${p.pos}, ${lg && lg.fee ? money(lg.fee) : 'free'}${p.loan ? ', loan' : ''}${sur ? ', surplus' : ''}</small></span></button>` : ''; };
    const grp = { Keeper: ['GK'], Defence: ['CB', 'FB'], Midfield: ['DM', 'CM', 'AM'], Attack: ['W', 'ST'] };
    const bars = Object.entries(grp).map(([l, ps]) => { const rs = E.rows.filter(r => ps.includes(r.pos)), b = Math.max(0, ...rs.map(r => r.b)), a = Math.max(0, ...rs.map(r => r.a)); return `<div class="pb">${l}<i><u style="width:${b * 20}%"></u><b style="width:${a * 20}%"></b></i><em class="${a > b ? 'up' : a < b ? 'dn' : ''}">${a > b ? '+' + (a - b) : a < b ? '−' + (b - a) : '='}</em></div>`; }).join('');
    const outs = E.outs.map(o => (o.t || o.name || '').replace(/^.*?(sells|offloads)\s/, '').replace(/,? as you asked\.?|\.$/g, '')).slice(0, 5);
    body = `<article class="paper"><div class="mast">THE ${esc(g.club.city.toUpperCase())} GAZETTE <small>Summer edition</small></div><div class="gstamp g${E.grade}">${E.grade}<small>SUMMER</small></div>
    <h2 class="ehead2">${esc(E.head)}</h2><p class="esub2">${E.ins.length} in, ${E.outs.length} out, net spend ${money(E.net)}</p>
    <div class="ins">${E.ins.map(card).join('') || '<p class="small">Nobody came in.</p>'}</div>
    ${outs.length ? `<p class="outs">Out: ${esc(outs.join('; '))}</p>` : ''}
    <div class="sec2">The brief</div><div class="planboard">${E.ev.map(e => `<div class="pl ${e.met ? 'done' : 'open'}"><i class="dot"></i>${esc(e.t)}<span>${esc(e.note)} · ${e.met ? 'Met' : 'Missed'}</span></div>`).join('')}</div>
    <div class="sec2">Best player per line, May → now</div><div class="posbars">${bars}</div>
    <div class="quote"><span class="pf">${ART.staffFace('coach', E.xi > 0.15 ? 'happy' : E.xi < -0.1 ? 'worried' : null)}</span>${esc(E.coach)}</div>
    <div class="quote"><span class="pf">${ART.staffFace('board', E.met >= 2 ? 'happy' : 'worried')}</span>${esc(E.board)}</div></article>
    ${trayHtml('', `<button class="btn" data-a="s2-step" data-i="3">Debrief with ${esc(F.staffName('dof'))}</button>`, '')}<div class="trayspace" style="--tray:100px"></div>`;
  } else if (st === 3) {
    const D = F.sum2Debrief();
    body = `<h2>Debrief</h2><div class="meet"><div class="say"><div class="who">${esc(WHO('dof'))}</div><p>${esc(D.intro)} ${D.lines.map(esc).join(' ')}</p></div>${D.done ? `<div class="say me"><div class="who">You</div><p>${esc({ praise: '"Good work this summer."', probe: '"Walk me through what went wrong."', warn: '"This is not good enough."', tighten: '"From now on, every deal comes through me."', loosen: '"You have earned more freedom."' }[D.done.k])}</p></div><div class="say"><div class="who">${esc(WHO('dof'))}</div><p>${esc(D.done.t)}</p></div>` : ''}</div>
    ${D.done ? `<div class="row" style="margin-top:14px"><button class="btn" data-a="s2-step" data-i="4">Next: season goals</button></div>` : `<div class="ch">${[['praise', 'Praise his work', 'Trust up, more so if he delivered'], ['probe', 'Ask what went wrong', 'He explains, slightly defensive'], ['warn', 'Warn him', D.met < D.ev.length ? 'Sharpens him, counts as a strike' : 'Unfair after a good summer'], [D.met >= 2 ? 'loosen' : 'tighten', D.met >= 2 ? 'Give him more freedom' : 'Every deal through you from now on', D.met >= 2 ? 'You approve only big deals' : 'More control, less trust']].map(([k, l, h]) => `<button class="cbtn" data-a="db-talk" data-k="${k}"><b>${l}</b><span>${h}</span></button>`).join('')}</div><p class="small"><button class="link" data-a="s2-step" data-i="4">Skip the debrief</button></p>`}`;
  } else {
    const P = g.pre, fo = F.FOCUS.filter(f => !g.board.obj.some(o => o.k === f.k && !o.soft) || P.focus.includes(f.k));
    body = `<h2>Two focus goals</h2><p class="small">Extra goals for the season. Met: board confidence up. Missed: a small dent.</p>
    <div class="cards2">${fo.map(f => `<button class="card ${P.focus.includes(f.k) ? 'on' : ''}" data-a="pre-focus" data-k="${f.k}"><b style="font-size:17px">${esc(f.t())}</b><span class="small">${esc(f.d)}</span></button>`).join('')}</div>
    ${F.ACAD_PLANS ? `<h2 style="margin-top:22px">Academy plan</h2><div class="cards2">${F.ACAD_PLANS.map(a => `<button class="card ${P.acad === a.k ? 'on' : ''}" data-a="pre-acad" data-k="${a.k}"><b style="font-size:17px">${esc(a.t())}</b><span class="small">${esc(a.d)}</span></button>`).join('')}</div>` : ''}
    ${g.meeting && g.meeting.items.length ? `<div style="margin-top:22px">${meetingBlock(g.meeting, 'Projects for the season')}</div>` : ''}
    <div class="row" style="margin-top:18px"><button class="btn" data-a="s2-finish" ${P.focus.length === 2 ? '' : 'disabled'}>Meet the press</button>${P.focus.length === 2 ? '' : '<span class="small">Choose two focus goals.</span>'}</div>`;
  }
  return `<div class="setup" style="max-width:760px"><div class="sumhead">${crest(g.club.colors, g.club.short, 26)}<h1>The summer</h1><span class="chip" style="margin-left:auto">Step ${st + 1} of ${STEPS.length}</span></div>${body}</div>`;
}
function ddSchedule() {
  clearTimeout(U.ddT); const g = G(); if (!g || g.phase !== 'summer' || !g.sum) return;
  if (g.sum.v2 && g.sum.step === 1 && g.sum.tk && g.sum.tk.phase !== 'dd') { const tk = g.sum.tk; if (tk.call && U.rang !== tk.call) { U.rang = tk.call; ART.SND.ring(); ART.vib([60, 40, 60]); } if (tk.run && !tk.call) U.ddT = setTimeout(() => { F.tkStep(); saveGame(); render(); }, tk.shown < tk.lines.length ? 900 : 1300); return; }
  if (g.sum.step !== (g.sum.v2 ? 1 : 4)) return; const d = g.sum.dd; if (!d || !d.run || d.done) return;
  if (d.dec) { if (!U.ddDecEnd || U.ddDecId !== d.dec.id) { U.ddDecEnd = Date.now() + 12000; U.ddDecId = d.dec.id; render(); return; } U.ddT = setTimeout(() => { F.ddDecide(-1); saveGame(); render(); }, Math.max(0, U.ddDecEnd - Date.now())); }
  else U.ddT = setTimeout(() => { F.ddTick(); saveGame(); render(); }, 1700);
}
function vPreseason() {
  const g = G(), P = g.pre, st = P.step, lg = g.board.obj.find(o => o.k === 'league');
  const steps = ['Goals', 'Budget', 'Recruitment', 'Projects'];
  const nav = `<div class="steps">${steps.map((l, i) => `<button class="${i === st ? 'on' : ''}" data-a="pre-step" data-i="${i}">${i + 1}. ${l}</button>`).join('')}</div>`;
  let body = '';
  if (st === 0) {
    const fo = F.FOCUS.filter(f => !g.board.obj.some(o => o.k === f.k && !o.soft) || P.focus.includes(f.k));
    body = `<h2>The board's target</h2><p>The board expects us to finish <b>${F.ord(P.base)}</b> in the ${F.TIERS[g.club.tier]}. Our squad ranks about ${F.ord(F.expectedRank())} on paper. You can negotiate.</p>
    <div class="choice">${F.preTargets().map(o => `<button class="card ${P.deal === o.k ? 'on' : ''}" data-a="pre-target" data-k="${o.k}"><b>${esc(o.t)}: finish ${F.ord(o.target)}</b>${esc(o.d)}<div class="e">${esc(o.fx)}</div></button>`).join('')}</div>
    <h2 style="margin-top:22px">Two focus goals</h2><p class="small">Pick two extra goals for the season. Met: board confidence up. Missed: a small dent. Already set by the board: ${esc(g.board.obj.filter(o => o.k !== 'league' && !o.soft).map(o => o.t.toLowerCase()).join('; '))}.</p>
    <div class="cards2">${fo.map(f => `<button class="card ${P.focus.includes(f.k) ? 'on' : ''}" data-a="pre-focus" data-k="${f.k}"><b style="font-size:17px">${esc(f.t())}</b><span class="small">${esc(f.d)}</span></button>`).join('')}</div>
    ${F.ACAD_PLANS ? `<h2 style="margin-top:22px">Academy plan</h2><p class="small">Optional: one goal for the academy this season. Same reward as a focus goal.</p><div class="cards2">${F.ACAD_PLANS.map(a => `<button class="card ${P.acad === a.k ? 'on' : ''}" data-a="pre-acad" data-k="${a.k}"><b style="font-size:17px">${esc(a.t())}</b><span class="small">${esc(a.d)}</span></button>`).join('')}</div>` : ''}
    <div class="row" style="margin-top:18px"><button class="btn" data-a="pre-step" data-i="1" ${P.deal && P.focus.length === 2 ? '' : 'disabled'}>Next: budget</button>${P.deal && P.focus.length === 2 ? '' : '<span class="small">Choose a target and two focus goals.</span>'}</div>`;
  } else if (st === 1) {
    const b = F.budgetCosts(), wf = F.weekForecast(), net = wf.rev - wf.cost;
    const row = (role, k, l, cost, note) => F.staff(role) || role === 'fin' ? `<div class="sl"><div class="spread"><label for="pb-${role}-${k}">${l}</label><span class="num">${cost != null ? money(cost) + '/wk' : ''}</span></div><input type="range" min="0" max="100" step="5" id="pb-${role}-${k}" value="${F.man(role, k)}" data-sl="${role}" data-k="${k}" data-p="pb"><div class="ends"><span>${note[0]}</span><span>${note[1]}</span></div></div>` : '';
    body = `<h2>Budget round</h2><p class="small">Set how much each department may spend this season, and how much cash Finance releases for transfers. You can change these later through the mandates.</p>
    ${row('scout', 'budget', 'Scouting', b.scouting, ['Lean', 'Lavish'])}${row('acad', 'budget', 'Academy', b.academy, ['Lean', 'Lavish'])}${row('mkt', 'budget', 'Marketing', b.marketing, ['Lean', 'Lavish'])}${row('fin', 'invest', 'Facility investment', b.facilities, ['Cut costs', 'Invest'])}${row('fin', 'transfer', 'Cash released for transfers', null, ['Hold cash', 'Fund transfers'])}
    <dl class="figs"><div><dt>Expected revenue</dt><dd>${money(wf.rev)}/wk</dd></div><div><dt>Expected costs</dt><dd>${money(wf.cost)}/wk</dd></div><div><dt>Weekly result</dt><dd class="${net < 0 ? 'bad' : 'good'}">${net >= 0 ? '+' : ''}${money(net)}</dd></div><div><dt>Transfer budget</dt><dd>${money(F.transferBudget())}</dd></div><div><dt>Cash</dt><dd>${money(g.club.cash)}</dd></div></dl>
    <div class="row" style="margin-top:18px"><button class="btn ghost" data-a="pre-step" data-i="0">Back</button><button class="btn" data-a="pre-step" data-i="2">Next: recruitment</button></div>`;
  } else if (st === 2) {
    body = `<h2>Recruitment plan</h2><p class="small">Tell ${esc(F.staffName('dof'))} where to look. The scouts work to these priorities; the DoF uses your limits when he negotiates.</p>${recPlanBlock()}
    <div class="row" style="margin-top:18px"><button class="btn ghost" data-a="pre-step" data-i="1">Back</button><button class="btn" data-a="pre-step" data-i="3">Next: projects</button></div>`;
  } else {
    body = `${g.meeting && g.meeting.items.length ? meetingBlock(g.meeting, 'Pre-season planning meeting') : '<p class="note">No proposals this summer.</p>'}
    <div class="row" style="margin-top:18px"><button class="btn ghost" data-a="pre-step" data-i="2">Back</button><button class="btn" data-a="pre-done">Lock the plan and meet the press</button></div>`;
  }
  return `<div class="setup" style="max-width:860px"><div class="step">Pre-season, season ${g.season}. ${F.TIERS[g.club.tier]}.</div><h1 style="font-size:40px;margin:6px 0 12px">Plan the season</h1>${nav}${body}</div>`;
}
function vPress() {
  const g = G(), ids = g.press, i = U.pressI, first = g.season === 1 && !g.pressDone;
  const prog = `<div class="progress">${ids.map((_, k) => `<i class="${k === i && !U.quote ? 'on' : k < i ? 'done' : ''}"></i>`).join('')}</div>`;
  const crowd = `<div class="presshall"><div class="mics">${[9101, 9102, 9103, 9104].map((sd, k) => `<span class="jface ${k === (i % 4) ? 'ask' : ''}">${ART.face(sd + i * 3, { role: 'press', age: 28 + k * 7, bg: '#dfe9f5', emo: k === (i % 4) ? 'surprised' : null })}</span>`).join('')}</div><div class="podium">${crest(g.club.colors, g.club.short, 34)}<b>${first ? 'Unveiling' : 'Press conference'}</b></div></div>`;
  if (U.quote) return `<div class="setup">${prog}${crowd}<article class="paper qpaper"><div class="mast">THE ${esc(g.club.city.toUpperCase())} GAZETTE <small>Tomorrow</small></div><h2 class="ehead2" style="max-width:none">"${esc(U.quote)}"</h2><p class="esub2">The new CEO, speaking to the press.</p>${U.quoteP ? '<div class="promise">PROMISE: checked at the end of the season</div>' : ''}</article>
    <div class="trayspace" style="--tray:100px"></div></div>${trayHtml('', `<button class="btn" data-a="press-next">${i >= ids.length ? (first ? 'Start the season' : 'Back to work') : 'Next question'}</button>`, '')}`;
  const q = F.pressView(F.PRESS.find(p => p.id === ids[i])), FXI = { fans: 'fans', press: 'press', spons: 'money', board: 'board' };
  return `<div class="setup">${prog}${crowd}<div class="bubble" style="margin-top:18px"><div class="who">A reporter asks</div>${esc(q.q)}</div>
  <div class="trayspace" style="--tray:${80 + q.a.length * 66}px"></div></div>${trayHtml('<span>Your answer</span><span>On the record</span>', q.a.map((a, j) => `<button class="cho" data-a="press" data-q="${q.id}" data-i="${j}">${a.promise ? '<span class="pk" style="background:#d9472b;color:#fff">Promise</span>' : ''}<b>"${esc(a.t)}"</b><span class="fx">${Object.entries(a.fx).filter(([k]) => FXI[k]).map(([k, v]) => `<span class="eff ${v > 0 ? 'up' : 'dn'}">${ART.I[FXI[k]]}${v > 0 ? '+' : '−'}${Math.abs(v)}</span>`).join('')}</span></button>`).join(''), '')}`;
}
