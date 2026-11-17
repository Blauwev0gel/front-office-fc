/* ---------- actions ---------- */
function readSetup() { const v = id => { const e = $('#' + id); return e ? e.value.trim() : ''; }; const s = U.setup; if ($('#f-city')) { s.city = v('f-city'); s.name = v('f-name'); s.short = v('f-short').toUpperCase(); } }
function act(a, d, el) {
  const g = G(); let r;
  switch (a) {
    case 'quick': U.sentK = null; quickStart(d.v === 'season'); break;
    case 'new': U.sentK = null; U.title = false; F.newGame(); U.setup = { step: 0, name: '', short: '', city: '', col: 0, dna: {} }; U.hire = {}; break;
    case 'continue': if (loadGame()) { U.title = false; setClub(G().club.colors); } break;
    case 'restart': wipe(); U.title = true; F.G = null; break;
    case 'col': readSetup(); U.setup.col = +d.i; break;
    case 's-next': readSetup(); if (U.setup.step === 0) { const s = U.setup; if (!s.city) s.city = 'Harwick'; if (!s.name) s.name = s.city + ' Athletic'; if (!s.short) s.short = s.city.slice(0, 3).toUpperCase(); setClub(PALETTES[s.col]); } U.setup.step++; window.scrollTo(0, 0); break;
    case 's-back': readSetup(); U.setup.step = Math.max(0, U.setup.step - 1); break;
    case 'dna': U.setup.dna[d.k] = d.v; break;
    case 'found': { const s = U.setup; F.setDNA(Object.assign({}, s.dna), s.name, s.short, s.city, PALETTES[s.col]); setClub(PALETTES[s.col]); window.scrollTo(0, 0); break; }
    case 'pick': U.hire[d.r] = +d.i; ART.SND.card(); { const ix = F.ROLES.findIndex(r => r.id === d.r), nx = F.ROLES.slice(ix + 1).find(r => U.hire[r.id] == null); if (nx) { U.hireRole = nx.id; window.scrollTo(0, 0); } } break;
    case 'hire-tab': U.hireRole = d.r; window.scrollTo(0, 0); break;
    case 'unpick': delete U.hire[d.r]; break;
    case 'hire-all': for (const k in U.hire) F.hire(k, U.hire[k]); F.finishStaff(); window.scrollTo(0, 0); break;
    case 'mand-done': F.finishMandates(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break;
    case 'press': { const q = F.PRESS.find(p => p.id === d.q); let ans = q.a[+d.i]; if (typeof ans === 'function') ans = ans(); U.quote = F.pressAnswer(d.q, +d.i); U.quoteP = !!ans[1]; U.pressI++; break; }
    case 'press-next': U.quote = null; if (U.pressI >= g.press.length) { F.finishPress(); U.tab = 'inbox'; window.scrollTo(0, 0); } break;
    case 'fo-squad': U.sqTable = d.v !== 'xi'; U.sq = d.v === 'stats' ? 'mb' : 'profile'; window.scrollTo(0, 0); break;
    case 'tab': U.tab = d.t; U.sub = null; U.dept = null; if (d.t === 'inbox') { U.open = null; U.flash = ''; U.filt = 'all'; } window.scrollTo(0, 0); break;
    case 'mchoose': mailSend(d); break; // commit and save immediately
    case 'mnext': U.sentK = null; advance(); window.scrollTo(0, 0); break;
    case 'opt': r = F.respond(+d.m, +d.i); if (r && r.err) toast(r.err); else if (r && U.open) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.card(); ART.vib(15); advance(); } break;
    case 'open': if (!d.k) break; if (d.k.startsWith('an') && false) { markRead(d.k); U.sheet = { t: 'analysis' }; break; } if (d.k.startsWith('ms') && !d.k.startsWith('msw')) { markRead(d.k); const it = inboxItems().find(x => x.key === d.k); if (it) { U.ptab = 'story'; U.sheet = { t: 'player', id: it.pid }; } break; } U.open = d.k; U.flash = ''; U.sentK = null; U.edI = 0; window.scrollTo(0, 0); break;
    case 'close-open': U.open = null; U.flash = ''; break;
    case 'dismiss': g.dis = g.dis || {}; g.dis[d.k] = F.absWeek(); for (const x in g.dis) if (g.dis[x] < F.absWeek() - 6) delete g.dis[x]; markRead(d.k); if (U.open === d.k) U.open = null; ART.SND.click(); break;
    case 'filt': U.filt = d.v; break;
    case 'md-kick': mdKick(); break;
    case 'md-close': U.md = null; break;
    case 'md-speed': MDP.fast = !MDP.fast; el.closest('button').textContent = MDP.fast ? 'Normal speed' : '2x speed'; return;
    case 'md-skip': MDP.skip(); return;
    case 'md-resume': clearTimeout(MDP.t); MDP.resume(); return;
    case 'md-after': if (U.md.replay) { U.md = null; window.scrollTo(0, 0); break; } if (U.md.cup) { U.md.m = U.md.cup; U.md.cup = null; U.md.ft = false; U.md.out = []; U.md.momTop = U.md.momBot = ''; } else U.md.phase = 'paper'; window.scrollTo(0, 0); break;
    case 'md-done': { const k = inboxItems().find(i => i.t === 'paper'); if (k) markRead(k.key); U.md = null; window.scrollTo(0, 0); break; }
    case 'play': if (G().phase === 'season' && F.mtPreview && F.mtPreview() && !U.md) { ART.SND.whistle(); U.md = { phase: 'preview' }; U.sheet = null; window.scrollTo(0, 0); break; } ART.SND.whistle(); if (inboxItems().some(i => i.kind === 'need')) U.sheet = { t: 'confirm' }; else { act('end', {}); return; } break;
    case 'review': { U.sheet = null; U.tab = 'inbox'; const f = inboxItems().find(i => i.kind === 'need'); U.open = f ? f.key : null; U.flash = ''; break; }
    case 'pw-ask': F.pwAsk(d.r); break;
    case 'pw-open': U.tab = 'inbox'; U.dept = null; U.open = 'pathway'; window.scrollTo(0, 0); break;
    case 'pw-change': r = F.specialistAct('academy.pathway',{k:d.k}); if (r && r.err) toast(r.err); else if (r) U.flash = r.out; break;
    case 'auth': r = F.setAuth(d.r, +d.v); if (r && r.err) toast(r.err); else if (r && r.out) toast(r.out); break;
    case 'second': r = F.secondOpinion(+d.m); if (r && r.err) toast(r.err); break;
    case 'brief': r = F.answerBrief(+d.b, +d.i); if (r && r.err) toast(r.err); else if (r && U.open) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.card(); ART.vib(15); advance(); } break;
    case 'prop': r = F.decideProposal(+d.i, d.c); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; if (U.open && (d.c === 'approve' || d.c === 'reject') && !(g.meeting.items.some(x => x.status === 'open'))) advance(); } break;
    case 'end': if (G().phase === 'season') { mdKick(); break; } { U.sheet = null; const res = F.endWeek(); if (!res) break; saveGame(); U.tab = 'inbox'; U.open = null; U.flash = ''; U.filt = 'all'; window.scrollTo(0, 0); if (res.ours) startTicker(res.ours, res.cup); else if (res.cup) startTicker(res.cup); return; }
    case 'replay': if (g.lastMatch) { U.md = { phase: 'match', m: g.lastMatch, replay: true, out: [], ft: false }; MDP.cur = null; window.scrollTo(0, 0); } break;
    case 'ed-open': U.edI = +d.i; window.scrollTo(0, 0); break;
    case 'tick-skip': U.ticker.i = U.ticker.match.ev.length; clearTimeout(tick.h); break;
    case 'tick-speed': U.ticker.fast = !U.ticker.fast; break;
    case 'tick-close': { const nx = U.ticker.next; clearTimeout(tick.h); U.ticker = null; U.sheet = null; if (nx) { startTicker(nx, null); return; } window.scrollTo(0, 0); break; }
    case 'sheet': U.sheet = { t: d.s, r: d.r }; if (d.s === 'mand') U.draft = Object.assign({}, g.mand[d.r]); if (d.s === 'talk') { U.talkRole = d.r || null; U.talkOut = null; } break;
    case 'close': U.sheet = null; break;
    case 'tab-close': U.sheet = null; U.tab = d.t; window.scrollTo(0, 0); break;
    case 'veil': if (el === document.querySelector('.veil')) U.sheet = null; else return; break;
    case 'player': U.ptab = 'over'; U.sheet = { t: 'player', id: +d.id }; break;
    case 'mt-ans': ART.SND.card(); F.sum2Answer(+d.i); break; // immediate, single-commit summer decision
    case 'sound': ART.SND.toggle(); break;
    case 'tk-ans': F.tkAnswer(+d.i); break;
    case 'tk-pause': G().sum.tk.run = !G().sum.tk.run; break;
    case 'tk-skip': F.tkSkip(); window.scrollTo(0, 0); break;
    case 's2-step': F.sum2Step(+d.i); window.scrollTo(0, 0); break;
    case 'db-talk': F.sum2Talk(d.k); break;
    case 's2-finish': clearTimeout(U.ddT); F.sum2Finish(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break;
    case 'mand-tab': U.mandOpen = d.r; break;
    case 'ptab': U.ptab = d.v; break;
    case 'lfull': U.lfull = !U.lfull; break;
    case 'sub': if (d.v === 'academy' || d.v === 'first') { U.tab = 'staff'; U.dept = d.v; U.dtab = d.v === 'academy' ? 'data' : 'over'; } else U.sub = d.v || null; U.tray = ''; window.scrollTo(0, 0); break;
    case 'dept': U.dept = d.k || null; U.dtab = d.v || 'over'; U.tray = ''; window.scrollTo(0, 0); break;
    case 'dtab': U.dtab = d.v; window.scrollTo(0, 0); break;
    case 'dept-meeting': U.sheet = { t: 'dept-issue', k: d.k, v: d.v }; break;
    case 'dept-plan':
      r = F.specialistAct('department.plan',{k:d.k,v:d.v,c:d.c});
      if (r && r.err) toast(r.err);
      else if (r) { U.sheet = null; saveGame(); toast(r.out); ART.SND.stamp(); }
      break;
    case 'dept-issue': r = F.specialistAct('department.issue',{k:d.k,v:d.v,c:d.c}); if (r && r.err) toast(r.err); else if (r) { saveGame(); toast(r.out); } break;
    case 'dcand': U.sheet = { t: 'dcand', k: d.k, r: d.r }; break;
    case 'dhire': r = F.deptHire(d.k, d.r, +d.i); U.sheet = null; if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); ART.vib(30); } break;
    case 'dletgo': r = F.deptLetGo(d.k, +d.id); if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; } break;
    case 'dinbox': U.tab = 'inbox'; U.open = d.key; U.dept = null; window.scrollTo(0, 0); break;
    case 'ft-talk': r = F.ftTalkStart(); if (r && r.err) { toast(r.err); return; } U.tab = 'staff'; U.dept = 'first'; ART.SND.ring(); window.scrollTo(0, 0); break;
    case 'ft-ans': r = F.specialistAct('firstteam.response',{id:d.id}); if (r && r.err) toast(r.err); ART.SND.card(); ART.vib(15); break;
    case 'ft-talk-close': F.ftTalkClose(); U.tray = ''; window.scrollTo(0, 0); break;
    case 'ft-buy': r = F.specialistAct('firstteam.support',{v:'buy',k:d.k}); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'ft-cancel': r = F.specialistAct('firstteam.support',{v:'cancel',k:d.k}); if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; } break;
    case 'ft-sackq': U.sheet = { t: 'sack' }; break;
    case 'ft-sack': r = F.ftSack(); U.sheet = null; if (r && r.err) toast(r.err); else { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); U.dtab = 'over'; window.scrollTo(0, 0); } break;
    case 'sqtable': U.sqTable = d.v != null ? d.v === '1' : !U.sqTable; break;
    case 'sp-conflict': r = F.specialistResolveConflict(d.id,d.v);
      if(r&&r.err) toast(r.err);
      else if(r&&r.out){U.flash=r.out;U.flashN=(U.flashN||0)+1;ART.SND.stamp();}
      break;
    case 'com-offer': r = F.specialistAct('commercial.offer',{k:d.k}); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND[d.k === 'reject' ? 'click' : 'stamp'](); } break;
    case 'com-price': r = F.specialistAct('commercial.price',{k:d.k,v:d.v}); if (r && r.err) toast(r.err); ART.SND.click(); break;
    case 'com-exp': r = F.specialistAct('commercial.experience',{v:d.v}); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'squad-plan-open': U.tab = 'staff'; U.dept = 'recruit'; U.dtab = 'over'; U.open = null; window.scrollTo(0, 0); break;
    case 'squad-plan-ask': F.squadPlanAsk(d.q); break;
    case 'rx-focus': r = F.specialistAct('recruit.focus',{k:d.k}); if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; } ART.SND.click(); break;
    case 'rx-invest': r = F.specialistAct('recruit.invest',{k:d.k}); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'biz-lv': r = F.specialistAct('business.level',{k:d.k,v:d.v}); if (r && r.err) toast(r.err); ART.SND.click(); break;
    case 'biz-prop': r = F.specialistAct('business.plan'); U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); break;
    case 'mk-camp': r = F.specialistAct('marketing.campaign',{k:d.k}); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'mk-comm': r = F.specialistAct('marketing.community',{v:d.v}); if (r && r.err) toast(r.err); ART.SND.click(); break;
    case 'com-promo': r = F.specialistAct('commercial.promo'); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; } break;
    case 'dept-go': U.tab = 'staff'; U.dept = d.k; U.dtab = d.v || 'over'; U.tray = ''; window.scrollTo(0, 0); break;
    case 'tour-reset': g.flags.tour = {}; U.sheet = null; break;
    case 'tour-ok': g.flags.tour = Object.assign({}, g.flags.tour, { [d.k]: 1 }); if (d.k === 'inbox') g.flags.howto = true; break;
    case 'preset': { const vals = PRESETS[d.r][+d.i][1], tgt = d.p === 'md' ? U.draft : g.mand[d.r]; Object.assign(tgt, vals); ART.SND.card(); break; }
    case 'ru-set': { const tgt = d.p === 'md' ? U.draft : g.mand[d.r]; tgt[d.k] = d.v; ART.SND.click(); break; }
    case 'dd-dec': F.ddDecide(+d.i); U.ddDecEnd = null; break;
    case 'dd-pause': G().sum.dd.run = !G().sum.dd.run; break;
    case 'dd-skip': F.ddSkip(); break;
    case 'target': U.recMsg = ''; U.ptab = 'over'; U.sheet = { t: 'target', id: +d.id }; break;
    case 'recplan': U.sheet = { t: 'recplan' }; break;
    case 'rec-prio': F.recTogglePrio(d.p, d.k); break;
    case 'rec-kind': F.recSetKind(d.p, d.k); break;
    case 'rec-appr': r = F.specialistAct('recruit.approval',{v:d.v}); if (r && r.err) toast(r.err); break;
    case 'prio-all': U.prioAll = true; break;
    case 'agr-review': r = F.agreementRespond(d.id, d.v);
      if (r && r.err) toast(r.err); else if (r && r.out) toast(r.out); break;
    case 'mand-save': r = F.setMandate(U.sheet.r, U.draft); if (r.err) toast(r.err); else { U.sheet = null; toast(r.out); } break;
    case 'talk-who': U.talkRole = d.r; U.talkOut = null; break;
    case 'talk-do': if (U.talkOut) break; r = F.talk(U.talkRole, d.t); if (r.err) toast(r.err); else U.talkOut = r.out; break;
    case 'push': r = F.push(d.d); if (r.err) toast(r.err); else { U.sheet = null; toast(r.out); } break;
    case 'hire': F.hire(d.r, +d.i); U.sheet = null; toast(`${F.staff(d.r).name} appointed. Check the mandate.`); break;
    case 'fire': r = F.fire(d.r); U.sheet = null; if (r.err) toast(r.err); else toast(r.out); break;
    case 'sq': U.sq = d.v; break;
    case 'acad-close': U.dept = null; window.scrollTo(0, 0); break;
    case 'ag': U.ag = d.v; break;
    case 'ysack': { const ns = F.acadSack(d.r); toast(ns ? `${ns.name} takes over.` : 'Replaced. The post stays vacant until a Director is appointed.'); break; }
    case 'pre-step': g.pre.step = +d.i; window.scrollTo(0, 0); break;
    case 'pre-target': F.preSetTarget(d.k); break;
    case 'pre-focus': F.preToggleFocus(d.k); break;
    case 'pre-advice': F.preAcceptAdvice(d.k); break;
    case 'pre-acad': g.pre.acad = g.pre.acad === d.k ? null : d.k; break;
    case 'pre-done': F.finishPreseason(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break;
    case 'lt': U.lt = +d.t; break;
    case 'next-season': F.startSeason(); U.pressI = 0; U.quote = null; U.lt = null; window.scrollTo(0, 0); break;
  }
  saveGame(); render();
  // One-tap choice has been committed; move focus to its result for accessibility.
  if (a === 'mchoose') {
    const target = document.querySelector('.mreply .msent');
    if (target) {
      target.focus({ preventScroll: true });
      const rect = target.getBoundingClientRect(), edge = document.querySelector('.bar2')?.getBoundingClientRect().top || innerHeight;
      if (rect.bottom > edge || rect.top < 0) target.scrollIntoView({ block: 'center' });
    }
  }
}
let SW = null, SR = null, noClick = 0;
document.addEventListener('pointerdown', e => { const r = e.target.closest('.ir.dis'); if (!r) return; SR = { r, x0: e.clientX, y0: e.clientY, dx: 0 }; });
document.addEventListener('pointermove', e => { if (!SR) return; const dx = e.clientX - SR.x0; if (Math.abs(e.clientY - SR.y0) > 24 && Math.abs(dx) < 20) { SR = null; return; } SR.dx = Math.min(0, dx); if (SR.dx < -8) { SR.r.style.transform = `translateX(${SR.dx}px)`; SR.r.style.opacity = String(1 + SR.dx / 300); } });
const srEnd = () => { if (!SR) return; const { r, dx } = SR; SR = null; r.style.transition = 'transform .2s, opacity .2s'; if (dx < -90) { noClick = Date.now(); r.style.transform = 'translateX(-110%)'; r.style.opacity = '0'; setTimeout(() => act('dismiss', { k: r.dataset.k }), 180); } else { if (dx < -8) noClick = Date.now(); r.style.transform = ''; r.style.opacity = ''; } };
document.addEventListener('pointerup', srEnd); document.addEventListener('pointercancel', srEnd);
document.addEventListener('pointerdown', e => { const c = e.target.closest('.swipe'); if (!c || e.target.closest('button')) return; SW = { c, x0: e.clientX, dx: 0 }; c.setPointerCapture(e.pointerId); c.style.transition = 'none'; });
document.addEventListener('pointermove', e => { if (!SW) return; SW.dx = e.clientX - SW.x0; SW.c.style.transform = `translateX(${SW.dx}px) rotate(${SW.dx / 18}deg)`; const R = SW.c.querySelector('.stampR'), L = SW.c.querySelector('.stampL'); if (R) R.style.opacity = Math.max(0, SW.dx / 90); if (L) L.style.opacity = Math.max(0, -SW.dx / 90); });
const swEnd = () => { if (!SW) return; const { c, dx } = SW; SW = null; c.style.transition = 'transform .28s'; if (Math.abs(dx) > 110) { c.style.transform = `translateX(${dx > 0 ? 480 : -480}px) rotate(${dx > 0 ? 22 : -22}deg)`; ART.SND[dx > 0 ? 'stamp' : 'click'](); ART.vib(25); const i = c.dataset.i; setTimeout(() => act('prop', { i, c: dx > 0 ? 'approve' : 'reject' }), 220); } else { c.style.transform = ''; c.querySelectorAll('.stampR,.stampL').forEach(x => x.style.opacity = 0); } };
document.addEventListener('pointerup', swEnd); document.addEventListener('pointercancel', swEnd);
document.addEventListener('keydown', e => { const c = e.target.closest && e.target.closest('.swipe'); if (!c) return; if (e.key === 'ArrowRight') act('prop', { i: c.dataset.i, c: 'approve' }); if (e.key === 'ArrowLeft') act('prop', { i: c.dataset.i, c: 'reject' }); });
document.addEventListener('click', e => { const t = e.target.closest('[data-a]'); if (!t) return; if (t.disabled) return; if (Date.now() - noClick < 350 && t.matches('.ir')) return; act(t.dataset.a, t.dataset, e.target); });
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-a]')) { e.preventDefault(); act(e.target.dataset.a, e.target.dataset, e.target); } if (e.key === 'Escape' && U.sheet && U.sheet.t !== 'ticker') { U.sheet = null; render(); } });
document.addEventListener('input', e => {
  const t = e.target; if (!t.dataset.sl) return; const v = +t.value, role = t.dataset.sl, k = t.dataset.k, lab = document.getElementById('v-' + t.dataset.p + '-' + k); if (lab) lab.textContent = v;
  t.style.setProperty('--v', v + '%'); const sy = document.getElementById('says-' + t.dataset.p + '-' + k); if (sy) { const D = F.MAND[role].sl.find(x => x[0] === k); sy.textContent = says(role, k, v, D[1], D[2]); }
  if (t.dataset.p === 'md') { U.draft[k] = v; const m = document.querySelector('.sheet .meter .num'), b = document.querySelector('.sheet .meter .bar i'); const al = previewAlign(role, U.draft); if (m) { m.textContent = al; b.style.width = al + '%'; } }
  else { G().mand[role][k] = v; const m = document.querySelector('.setup .meter .num'), b = document.querySelector('.setup .meter .bar i'); const al = F.alignment(); if (m) { m.textContent = al; b.style.width = al + '%'; } }
});
document.addEventListener('change', e => {
  const t = e.target; if (t.dataset.sl && t.dataset.p === 'pb') { saveGame(); render(); return; } if (t.dataset.sl && t.dataset.p !== 'md') { saveGame(); return; } if (!t.dataset.ru) return; const role = t.dataset.ru, k = t.dataset.k;
  if (t.dataset.p === 'md') { U.draft[k] = t.value; render(); } else { G().mand[role][k] = t.value; U.mandOpen = role; saveGame(); render(); }
});

