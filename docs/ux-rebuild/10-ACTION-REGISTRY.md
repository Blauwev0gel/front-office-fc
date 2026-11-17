# Complete Action Registry — dispatcher source audit

**Baseline:** `chatgpt` (November 17, 2026), `src/ui/15-actions.js` `act(a,d,el)`. This is an exhaustive registry of **defined dispatcher cases**, NOT proof that every control is reachable. A case can modify UI state and call helpers without calling `F` directly. For exact semantics, consult the cited case in source.

| ID | `data-a` action | Direct `F` calls | UI state written | Source excerpt |
|---|---|---|---|---|
| ACT-001 | `quick` | — | `U.sentK` | U.sentK = null; quickStart(d.v === 'season'); break; |
| ACT-002 | `new` | `newGame` | `U.sentK`, `U.title`, `U.setup`, `U.hire` | U.sentK = null; U.title = false; F.newGame(); U.setup = { step: 0, name: '', short: '', city: '', col: 0, dna: {} }; U.hire = {}; break; |
| ACT-003 | `continue` | — | `U.title` | if (loadGame()) { U.title = false; setClub(G().club.colors); } break; |
| ACT-004 | `restart` | — | `U.title` | wipe(); U.title = true; F.G = null; break; |
| ACT-005 | `col` | — | — | readSetup(); U.setup.col = +d.i; break; |
| ACT-006 | `s-next` | — | — | readSetup(); if (U.setup.step === 0) { const s = U.setup; if (!s.city) s.city = 'Harwick'; if (!s.name) s.name = s.city + ' Athletic'; if (!s.short) s.short = s.city.slic |
| ACT-007 | `s-back` | — | — | readSetup(); U.setup.step = Math.max(0, U.setup.step - 1); break; |
| ACT-008 | `dna` | — | — | U.setup.dna[d.k] = d.v; break; |
| ACT-009 | `found` | `setDNA` | — | { const s = U.setup; F.setDNA(Object.assign({}, s.dna), s.name, s.short, s.city, PALETTES[s.col]); setClub(PALETTES[s.col]); window.scrollTo(0, 0); break; } |
| ACT-010 | `pick` | — | `U.hireRole` | U.hire[d.r] = +d.i; ART.SND.card(); { const ix = F.ROLES.findIndex(r => r.id === d.r), nx = F.ROLES.slice(ix + 1).find(r => U.hire[r.id] == null); if (nx) { U.hireRole =  |
| ACT-011 | `hire-tab` | — | `U.hireRole` | U.hireRole = d.r; window.scrollTo(0, 0); break; |
| ACT-012 | `unpick` | — | — | delete U.hire[d.r]; break; |
| ACT-013 | `hire-all` | `hire`, `finishStaff` | — | for (const k in U.hire) F.hire(k, U.hire[k]); F.finishStaff(); window.scrollTo(0, 0); break; |
| ACT-014 | `mand-done` | `finishMandates` | `U.pressI`, `U.quote` | F.finishMandates(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break; |
| ACT-015 | `press` | `pressAnswer` | `U.quote`, `U.quoteP` | { const q = F.PRESS.find(p => p.id === d.q); let ans = q.a[+d.i]; if (typeof ans === 'function') ans = ans(); U.quote = F.pressAnswer(d.q, +d.i); U.quoteP = !!ans[1]; U.p |
| ACT-016 | `press-next` | `finishPress` | `U.quote`, `U.tab` | U.quote = null; if (U.pressI >= g.press.length) { F.finishPress(); U.tab = 'inbox'; window.scrollTo(0, 0); } break; |
| ACT-017 | `fo-squad` | — | `U.sqTable`, `U.sq` | U.sqTable = d.v !== 'xi'; U.sq = d.v === 'stats' ? 'mb' : 'profile'; window.scrollTo(0, 0); break; |
| ACT-018 | `tab` | — | `U.tab`, `U.sub`, `U.dept`, `U.open`, `U.flash`, `U.filt` | U.tab = d.t; U.sub = null; U.dept = null; if (d.t === 'inbox') { U.open = null; U.flash = ''; U.filt = 'all'; } window.scrollTo(0, 0); break; |
| ACT-019 | `mchoose` | — | — | mailSend(d); break; // commit and save immediately |
| ACT-020 | `mnext` | — | `U.sentK` | U.sentK = null; advance(); window.scrollTo(0, 0); break; |
| ACT-021 | `opt` | `respond` | `U.flash`, `U.flashN` | r = F.respond(+d.m, +d.i); if (r && r.err) toast(r.err); else if (r && U.open) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.card(); ART.vib(15); advance();  |
| ACT-022 | `open` | — | `U.sheet`, `U.ptab`, `U.open`, `U.flash`, `U.sentK`, `U.edI` | if (!d.k) break; if (d.k.startsWith('an') && false) { markRead(d.k); U.sheet = { t: 'analysis' }; break; } if (d.k.startsWith('ms') && !d.k.startsWith('msw')) { markRead( |
| ACT-023 | `close-open` | — | `U.open`, `U.flash` | U.open = null; U.flash = ''; break; |
| ACT-024 | `dismiss` | `absWeek` | `U.open` | g.dis = g.dis // {}; g.dis[d.k] = F.absWeek(); for (const x in g.dis) if (g.dis[x] < F.absWeek() - 6) delete g.dis[x]; markRead(d.k); if (U.open === d.k) U.open = null; A |
| ACT-025 | `filt` | — | `U.filt` | U.filt = d.v; break; |
| ACT-026 | `md-kick` | — | — | mdKick(); break; |
| ACT-027 | `md-close` | — | `U.md` | U.md = null; break; |
| ACT-028 | `md-speed` | — | — | MDP.fast = !MDP.fast; el.closest('button').textContent = MDP.fast ? 'Normal speed' : '2x speed'; return; |
| ACT-029 | `md-skip` | — | — | MDP.skip(); return; |
| ACT-030 | `md-resume` | — | — | clearTimeout(MDP.t); MDP.resume(); return; |
| ACT-031 | `md-after` | — | `U.md` | if (U.md.replay) { U.md = null; window.scrollTo(0, 0); break; } if (U.md.cup) { U.md.m = U.md.cup; U.md.cup = null; U.md.ft = false; U.md.out = []; U.md.momTop = U.md.mom |
| ACT-032 | `md-done` | — | `U.md` | { const k = inboxItems().find(i => i.t === 'paper'); if (k) markRead(k.key); U.md = null; window.scrollTo(0, 0); break; } |
| ACT-033 | `play` | `mtPreview` | `U.md`, `U.sheet` | if (G().phase === 'season' && F.mtPreview && F.mtPreview() && !U.md) { ART.SND.whistle(); U.md = { phase: 'preview' }; U.sheet = null; window.scrollTo(0, 0); break; } ART |
| ACT-034 | `review` | — | `U.sheet`, `U.tab`, `U.open`, `U.flash` | { U.sheet = null; U.tab = 'inbox'; const f = inboxItems().find(i => i.kind === 'need'); U.open = f ? f.key : null; U.flash = ''; break; } |
| ACT-035 | `pw-ask` | `pwAsk` | — | F.pwAsk(d.r); break; |
| ACT-036 | `pw-open` | — | `U.tab`, `U.dept`, `U.open` | U.tab = 'inbox'; U.dept = null; U.open = 'pathway'; window.scrollTo(0, 0); break; |
| ACT-037 | `pw-change` | `pwChange` | `U.flash` | r = F.pwChange(d.k); if (r && r.err) toast(r.err); else if (r) U.flash = r.out; break; |
| ACT-038 | `auth` | `setAuth` | — | r = F.setAuth(d.r, +d.v); if (r && r.err) toast(r.err); else if (r && r.out) toast(r.out); break; |
| ACT-039 | `second` | `secondOpinion` | — | r = F.secondOpinion(+d.m); if (r && r.err) toast(r.err); break; |
| ACT-040 | `brief` | `answerBrief` | `U.flash`, `U.flashN` | r = F.answerBrief(+d.b, +d.i); if (r && r.err) toast(r.err); else if (r && U.open) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.card(); ART.vib(15); advance |
| ACT-041 | `prop` | `decideProposal` | `U.flash`, `U.flashN` | r = F.decideProposal(+d.i, d.c); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; if (U.open && (d.c === 'approve' // d.c ===  |
| ACT-042 | `end` | `endWeek` | `U.sheet`, `U.tab`, `U.open`, `U.flash`, `U.filt` | if (G().phase === 'season') { mdKick(); break; } { U.sheet = null; const res = F.endWeek(); if (!res) break; saveGame(); U.tab = 'inbox'; U.open = null; U.flash = ''; U.f |
| ACT-043 | `replay` | — | `U.md` | if (g.lastMatch) { U.md = { phase: 'match', m: g.lastMatch, replay: true, out: [], ft: false }; MDP.cur = null; window.scrollTo(0, 0); } break; |
| ACT-044 | `ed-open` | — | `U.edI` | U.edI = +d.i; window.scrollTo(0, 0); break; |
| ACT-045 | `tick-skip` | — | — | U.ticker.i = U.ticker.match.ev.length; clearTimeout(tick.h); break; |
| ACT-046 | `tick-speed` | — | — | U.ticker.fast = !U.ticker.fast; break; |
| ACT-047 | `tick-close` | — | `U.ticker`, `U.sheet` | { const nx = U.ticker.next; clearTimeout(tick.h); U.ticker = null; U.sheet = null; if (nx) { startTicker(nx, null); return; } window.scrollTo(0, 0); break; } |
| ACT-048 | `sheet` | — | `U.sheet`, `U.draft`, `U.talkRole`, `U.talkOut` | U.sheet = { t: d.s, r: d.r }; if (d.s === 'mand') U.draft = Object.assign({}, g.mand[d.r]); if (d.s === 'talk') { U.talkRole = d.r // null; U.talkOut = null; } break; |
| ACT-049 | `close` | — | `U.sheet` | U.sheet = null; break; |
| ACT-050 | `tab-close` | — | `U.sheet`, `U.tab` | U.sheet = null; U.tab = d.t; window.scrollTo(0, 0); break; |
| ACT-051 | `veil` | — | `U.sheet` | if (el === document.querySelector('.veil')) U.sheet = null; else return; break; |
| ACT-052 | `player` | — | `U.ptab`, `U.sheet` | U.ptab = 'over'; U.sheet = { t: 'player', id: +d.id }; break; |
| ACT-053 | `mt-ans` | `sum2Answer` | — | ART.SND.card(); F.sum2Answer(+d.i); break; // immediate, single-commit summer decision |
| ACT-054 | `sound` | — | — | ART.SND.toggle(); break; |
| ACT-055 | `tk-ans` | `tkAnswer` | — | F.tkAnswer(+d.i); break; |
| ACT-056 | `tk-pause` | — | — | G().sum.tk.run = !G().sum.tk.run; break; |
| ACT-057 | `tk-skip` | `tkSkip` | — | F.tkSkip(); window.scrollTo(0, 0); break; |
| ACT-058 | `s2-step` | `sum2Step` | — | F.sum2Step(+d.i); window.scrollTo(0, 0); break; |
| ACT-059 | `db-talk` | `sum2Talk` | — | F.sum2Talk(d.k); break; |
| ACT-060 | `s2-finish` | `sum2Finish` | `U.pressI`, `U.quote` | clearTimeout(U.ddT); F.sum2Finish(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break; |
| ACT-061 | `mand-tab` | — | `U.mandOpen` | U.mandOpen = d.r; break; |
| ACT-062 | `ptab` | — | `U.ptab` | U.ptab = d.v; break; |
| ACT-063 | `lfull` | — | `U.lfull` | U.lfull = !U.lfull; break; |
| ACT-064 | `sub` | — | `U.tab`, `U.dept`, `U.dtab`, `U.sub`, `U.tray` | if (d.v === 'academy' // d.v === 'first') { U.tab = 'staff'; U.dept = d.v; U.dtab = d.v === 'academy' ? 'data' : 'over'; } else U.sub = d.v // null; U.tray = ''; window.s |
| ACT-065 | `dept` | — | `U.dept`, `U.dtab`, `U.tray` | U.dept = d.k // null; U.dtab = d.v // 'over'; U.tray = ''; window.scrollTo(0, 0); break; |
| ACT-066 | `dtab` | — | `U.dtab` | U.dtab = d.v; window.scrollTo(0, 0); break; |
| ACT-067 | `dept-meeting` | — | `U.sheet` | U.sheet = { t: 'dept-issue', k: d.k, v: d.v }; break; |
| ACT-068 | `dept-plan` | `deptIssuePlan` | `U.sheet` | r = F.deptIssuePlan(d.k, d.v, d.c); if (r && r.err) toast(r.err); else if (r) { U.sheet = null; saveGame(); toast(r.out); ART.SND.stamp(); } break; |
| ACT-069 | `dept-issue` | `deptIssueDecision` | — | r = F.deptIssueDecision(d.k, d.v, d.c); if (r && r.err) toast(r.err); else if (r) { saveGame(); toast(r.out); } break; |
| ACT-070 | `dcand` | — | `U.sheet` | U.sheet = { t: 'dcand', k: d.k, r: d.r }; break; |
| ACT-071 | `dhire` | `deptHire` | `U.sheet`, `U.flash`, `U.flashN` | r = F.deptHire(d.k, d.r, +d.i); U.sheet = null; if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.stamp(); ART.vib(30); |
| ACT-072 | `dletgo` | `deptLetGo` | `U.flash`, `U.flashN` | r = F.deptLetGo(d.k, +d.id); if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; } break; |
| ACT-073 | `dinbox` | — | `U.tab`, `U.open`, `U.dept` | U.tab = 'inbox'; U.open = d.key; U.dept = null; window.scrollTo(0, 0); break; |
| ACT-074 | `ft-talk` | `ftTalkStart` | `U.tab`, `U.dept` | r = F.ftTalkStart(); if (r && r.err) { toast(r.err); return; } U.tab = 'staff'; U.dept = 'first'; ART.SND.ring(); window.scrollTo(0, 0); break; |
| ACT-075 | `ft-ans` | `ftTalkAnswer` | — | F.ftTalkAnswer(d.id); ART.SND.card(); ART.vib(15); break; |
| ACT-076 | `ft-talk-close` | `ftTalkClose` | `U.tray` | F.ftTalkClose(); U.tray = ''; window.scrollTo(0, 0); break; |
| ACT-077 | `ft-buy` | `ftResBuy` | `U.flash`, `U.flashN` | r = F.ftResBuy(d.k); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.stamp(); } break; |
| ACT-078 | `ft-cancel` | `ftResCancel` | `U.flash`, `U.flashN` | r = F.ftResCancel(d.k); if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; } break; |
| ACT-079 | `ft-sackq` | — | `U.sheet` | U.sheet = { t: 'sack' }; break; |
| ACT-080 | `ft-sack` | `ftSack` | `U.sheet`, `U.flash`, `U.flashN`, `U.dtab` | r = F.ftSack(); U.sheet = null; if (r && r.err) toast(r.err); else { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.stamp(); U.dtab = 'over'; window.scrollTo(0, |
| ACT-081 | `sqtable` | — | `U.sqTable` | U.sqTable = d.v != null ? d.v === '1' : !U.sqTable; break; |
| ACT-082 | `com-offer` | `comOffer` | `U.flash`, `U.flashN` | r = F.comOffer(d.k); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND[d.k === 'reject' ? 'click' : 'stamp'](); } break |
| ACT-083 | `com-price` | `comSetPrice` | — | F.comSetPrice(d.k, +d.v); ART.SND.click(); break; |
| ACT-084 | `com-exp` | `comExpUp`, `comExpDown` | `U.flash`, `U.flashN` | r = d.v === 'up' ? F.comExpUp() : F.comExpDown(); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.stamp(); } break; |
| ACT-085 | `squad-plan-open` | — | `U.tab`, `U.dept`, `U.dtab`, `U.open` | U.tab = 'staff'; U.dept = 'recruit'; U.dtab = 'over'; U.open = null; window.scrollTo(0, 0); break; |
| ACT-086 | `squad-plan-ask` | `squadPlanAsk` | — | F.squadPlanAsk(d.q); break; |
| ACT-087 | `rx-focus` | `rxFocus` | `U.flash`, `U.flashN` | r = F.rxFocus(d.k); if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; } ART.SND.click(); break; |
| ACT-088 | `rx-invest` | `rxInvest` | `U.flash`, `U.flashN` | r = F.rxInvest(d.k); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.stamp(); } break; |
| ACT-089 | `biz-lv` | `bizSetLevel` | — | r = F.bizSetLevel(d.k, d.v); ART.SND.click(); break; |
| ACT-090 | `biz-prop` | `bizPropose`, `bizApply` | `U.flash`, `U.flashN` | F.bizPropose(); r = F.bizApply(); U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.stamp(); break; |
| ACT-091 | `mk-camp` | `mkCamp` | `U.flash`, `U.flashN` | r = F.mkCamp(d.k); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; ART.SND.stamp(); } break; |
| ACT-092 | `mk-comm` | `mkComm` | — | F.mkComm(+d.v); ART.SND.click(); break; |
| ACT-093 | `com-promo` | `comPromo` | `U.flash`, `U.flashN` | r = F.comPromo(); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN // 0) + 1; } break; |
| ACT-094 | `dept-go` | — | `U.tab`, `U.dept`, `U.dtab`, `U.tray` | U.tab = 'staff'; U.dept = d.k; U.dtab = d.v // 'over'; U.tray = ''; window.scrollTo(0, 0); break; |
| ACT-095 | `tour-reset` | — | `U.sheet` | g.flags.tour = {}; U.sheet = null; break; |
| ACT-096 | `tour-ok` | — | — | g.flags.tour = Object.assign({}, g.flags.tour, { [d.k]: 1 }); if (d.k === 'inbox') g.flags.howto = true; break; |
| ACT-097 | `preset` | — | — | { const vals = PRESETS[d.r][+d.i][1], tgt = d.p === 'md' ? U.draft : g.mand[d.r]; Object.assign(tgt, vals); ART.SND.card(); break; } |
| ACT-098 | `ru-set` | — | — | { const tgt = d.p === 'md' ? U.draft : g.mand[d.r]; tgt[d.k] = d.v; ART.SND.click(); break; } |
| ACT-099 | `dd-dec` | `ddDecide` | `U.ddDecEnd` | F.ddDecide(+d.i); U.ddDecEnd = null; break; |
| ACT-100 | `dd-pause` | — | — | G().sum.dd.run = !G().sum.dd.run; break; |
| ACT-101 | `dd-skip` | `ddSkip` | — | F.ddSkip(); break; |
| ACT-102 | `target` | — | `U.recMsg`, `U.ptab`, `U.sheet` | U.recMsg = ''; U.ptab = 'over'; U.sheet = { t: 'target', id: +d.id }; break; |
| ACT-103 | `recplan` | — | `U.sheet` | U.sheet = { t: 'recplan' }; break; |
| ACT-104 | `rec-prio` | `recTogglePrio` | — | F.recTogglePrio(d.p, d.k); break; |
| ACT-105 | `rec-kind` | `recSetKind` | — | F.recSetKind(d.p, d.k); break; |
| ACT-106 | `rec-appr` | — | — | g.mand.dof = g.mand.dof // {}; g.mand.dof.approve = d.v; break; |
| ACT-107 | `prio-all` | — | `U.prioAll` | U.prioAll = true; break; |
| ACT-108 | `mand-save` | `setMandate` | `U.sheet` | r = F.setMandate(U.sheet.r, U.draft); if (r.err) toast(r.err); else { U.sheet = null; toast(r.out); } break; |
| ACT-109 | `talk-who` | — | `U.talkRole`, `U.talkOut` | U.talkRole = d.r; U.talkOut = null; break; |
| ACT-110 | `talk-do` | `talk` | `U.talkOut` | r = F.talk(U.talkRole, d.t); if (r.err) toast(r.err); else U.talkOut = r.out; break; |
| ACT-111 | `push` | `push` | `U.sheet` | r = F.push(d.d); if (r.err) toast(r.err); else { U.sheet = null; toast(r.out); } break; |
| ACT-112 | `hire` | `hire`, `staff` | `U.sheet` | F.hire(d.r, +d.i); U.sheet = null; toast('${F.staff(d.r).name} appointed. Check the mandate.'); break; |
| ACT-113 | `fire` | `fire` | `U.sheet` | r = F.fire(d.r); U.sheet = null; if (r.err) toast(r.err); else toast(r.out); break; |
| ACT-114 | `sq` | — | `U.sq` | U.sq = d.v; break; |
| ACT-115 | `acad-close` | — | `U.dept` | U.dept = null; window.scrollTo(0, 0); break; |
| ACT-116 | `ag` | — | `U.ag` | U.ag = d.v; break; |
| ACT-117 | `ysack` | `acadSack` | — | { const ns = F.acadSack(d.r); toast(ns ? '${ns.name} takes over.' : 'Replaced. The post stays vacant until a Director is appointed.'); break; } |
| ACT-118 | `pre-step` | — | — | g.pre.step = +d.i; window.scrollTo(0, 0); break; |
| ACT-119 | `pre-target` | `preSetTarget` | — | F.preSetTarget(d.k); break; |
| ACT-120 | `pre-focus` | `preToggleFocus` | — | F.preToggleFocus(d.k); break; |
| ACT-121 | `pre-advice` | `preAcceptAdvice` | — | F.preAcceptAdvice(d.k); break; |
| ACT-122 | `pre-acad` | — | — | g.pre.acad = g.pre.acad === d.k ? null : d.k; break; |
| ACT-123 | `pre-done` | `finishPreseason` | `U.pressI`, `U.quote` | F.finishPreseason(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break; |
| ACT-124 | `lt` | — | `U.lt` | U.lt = +d.t; break; |
| ACT-125 | `next-season` | `startSeason` | `U.pressI`, `U.quote`, `U.lt` | F.startSeason(); U.pressI = 0; U.quote = null; U.lt = null; window.scrollTo(0, 0); break; |

## Interpretation and migration contract

- Every case requires a linked control or a documented internal invocation. Unreferenced cases are **candidates** for removal, not automatically dead.
- Replace action aliases or duplicate confirmation paths only after confirming their source call-sites and engine semantics.
- New decision handling must be idempotent on double tap, preserve `G`/save migrations, and keep one authoritative commit path for each decision type.
- UI implementation tasks must map `ACT-*` IDs to `SCR-*` IDs and `DEC-*` decision categories; until that mapping is complete, the registry is a source inventory rather than validated user-journey coverage.
