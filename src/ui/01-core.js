/* The Front Office · UI (module 1) */
{
const F = FO, $ = s => document.querySelector(s), app = $('#app');
// Preview versions share an origin, so keep each branch's save separate.
const previewBranch = location.pathname.match(/\/front-office-fc\/(chatgpt|claude)(?:\/|$)/)?.[1];
const KEY = 'frontoffice_save_v1' + (previewBranch ? '_' + previewBranch : '');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const money = v => F.money(v), r0 = v => Math.round(v);
const PALETTES = [['#7a1e2b', '#f4e9d8', 'Claret & cream'], ['#0e3b2e', '#f2c14e', 'Green & gold'], ['#1b3a6b', '#ffffff', 'Navy & white'], ['#111111', '#e8e8e8', 'Black & white'], ['#c8102e', '#ffffff', 'Red & white'], ['#4b2a7b', '#e6c35c', 'Purple & gold'], ['#d9601a', '#1a1a1a', 'Orange & black'], ['#2b6cb0', '#f6e05e', 'Sky & yellow']];
const U = { tab: 'inbox', open: null, filt: 'all', flash: '', sheet: null, setup: { step: 0, name: '', short: '', city: '', col: 0, dna: {} }, hire: {}, pressI: 0, quote: null, sq: 'profile', lt: null, ticker: null, toast: '', draft: null, mandOpen: 'dof', talkRole: null, talkOut: null };
const G = () => F.G;

function saveGame() { try { if (G() && G().club) localStorage.setItem(KEY, F.save()); } catch (e) { } }
function hasSave() { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } }
function loadGame() { try { const s = localStorage.getItem(KEY); return s ? F.load(s) : false; } catch (e) { return false; } }
function wipe() { try { localStorage.removeItem(KEY); } catch (e) { } }
function toast(t) { U.toast = t; render(); clearTimeout(toast.h); toast.h = setTimeout(() => { U.toast = ''; render(); }, 3200); }
function setClub(c) { const r = document.documentElement.style; r.setProperty('--club', c[0]); r.setProperty('--club2', c[1]); const l = lum(c[0]); r.setProperty('--on', l > 0.55 ? '#111' : '#fff'); r.setProperty('--accL', l > 0.7 ? '#1f1715' : c[0]); r.setProperty('--accD', l < 0.4 ? c[1] : c[0]); }
function lum(h) { const n = parseInt(h.slice(1), 16), rr = (n >> 16) / 255, gg = (n >> 8 & 255) / 255, bb = (n & 255) / 255; return 0.299 * rr + 0.587 * gg + 0.114 * bb; }

/* ---------- atoms ---------- */
const stars = v => `<span class="text-stars" aria-label="${v} stars">${esc(v)}★</span>`;
const bar = (v, max = 100, cls = '') => {
  const pct = max ? Math.round(Math.max(0, Math.min(100, v / max * 100))) : 0;
  return `<span class="textbar ${esc(cls)}" aria-label="${pct} percent">${pct}%</span>`;
};
const meter = (l, v, max = 100, txt) => `<div class="meter"><span>${esc(l)}</span>${bar(v, max)}<span class="num">${txt != null ? esc(txt) : r0(v)}</span></div>`;
function crest(cols, short) {
  return `<span class="text-crest" aria-label="Club abbreviation">${esc((short || 'FC').slice(0, 3))}</span>`;
}
const apPips = n => ''; // The adjacent button already states the action count.
const sign = v => v > 0 ? '+' + v : '' + v;

/* ---------- base club: skip the founding ---------- */
const BASE_DNA = { origin: 'phoenix', style: 'possession', talent: 'academy', money: 'self', identity: 'community', ambition: 'steady', ground: 'old' };
function quickStart(toSeason) {
  F.newGame(); const g = G(), dna = {};
  for (const q of F.DNA) dna[q.k] = q.o.some(o => o.v === BASE_DNA[q.k]) ? BASE_DNA[q.k] : q.o[0].v;
  F.setDNA(dna, 'Harwick Athletic', 'HAR', 'Harwick', PALETTES[0]); setClub(PALETTES[0]);
  // staff: the cheapest of each role, then upgrade in order of importance while the budget allows
  const budget = F.staffBudget(), pick = {}; for (const r of F.ROLES) { const c = g.cands[r.id]; pick[r.id] = c.reduce((b, x, i) => x.wage < c[b].wage ? i : b, 0); }
  const cost = () => Object.entries(pick).reduce((a, [r, i]) => a + g.cands[r][i].wage, 0);
  for (const r of ['coach', 'dof', 'fin', 'com', 'acad', 'scout', 'mkt']) { if (!g.cands[r]) continue; const order = g.cands[r].map((c, i) => i).sort((a, b) => F.ovr(g.cands[r][b]) - F.ovr(g.cands[r][a])); for (const i of order) { const old = pick[r]; pick[r] = i; if (cost() <= budget) break; pick[r] = old; } }
  for (const r in pick) F.hire(r, pick[r]); F.finishStaff(); F.finishMandates();
  if (toSeason) {
    try { if (g.phase === 'summer') F.sumAuto(F.rnd, true); } catch (e) { }
    try { if (F.preSetTarget) F.preSetTarget('accept'); if (g.meeting) g.meeting.items.forEach((it, i) => F.decideProposal(i, 'approve')); if (F.finishPreseason) F.finishPreseason(); } catch (e) { }
    try { for (const id of (g.press || [])) F.pressAnswer(id, 1); if (F.finishPress) F.finishPress(); } catch (e) { }
  }
  U.title = false; U.setup = null; U.hire = {}; U.sheet = null; U.tab = 'inbox'; U.pressI = 0; U.quote = null; window.scrollTo(0, 0);
}

