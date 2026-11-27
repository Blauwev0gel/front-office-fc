// Northmarch vertical slices — shared helpers. Seeded RNG so every run can be replayed.
(function (g) {
  function rng(seed) {
    let a = seed >>> 0;
    const r = function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.pick = (arr) => arr[Math.floor(r() * arr.length)];
    r.chance = (p) => r() < p;
    r.int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.poisson = (l) => { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= r(); } while (p > L); return k - 1; };
    return r;
  }
  const money = (n) => {
    const s = n < 0 ? '−' : '';
    n = Math.abs(n);
    if (n >= 1e6) return s + '£' + (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.?0+$/, '') + 'm';
    if (n >= 1e3) return s + '£' + Math.round(n / 1e3) + 'k';
    return s + '£' + Math.round(n);
  };
  const hhmm = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  const reduced = () => g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((res) => setTimeout(res, reduced() ? Math.min(ms, 60) : ms));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  // expected goals from two strengths (roughly 40–80), home bonus in strength points
  function xg(att, def, home) { return clamp(1.25 * Math.exp((att + (home || 0) - def) / 22), 0.25, 3.6); }
  // a match as a list of goal minutes per side
  function match(r, sH, sA, homeBonus) {
    const gh = r.poisson(xg(sH, sA, homeBonus == null ? 3 : homeBonus)), ga = r.poisson(xg(sA, sH, 0));
    const mins = (n) => Array.from({ length: n }, () => r.int(2, 94)).sort((a, b) => a - b);
    return { h: mins(gh), a: mins(ga) };
  }
  const seedFromUrl = () => {
    const m = (g.location.hash || '').match(/seed(\d+)/);
    return m ? +m[1] : Math.floor(Math.random() * 99999) + 1;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  g.NM = { rng, money, hhmm, wait, clamp, xg, match, seedFromUrl, esc, reduced };
})(window);
