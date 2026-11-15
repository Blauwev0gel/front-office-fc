/* The Front Office · engine (module 1)
   Pure game logic. No DOM. Runs in the browser and in Node for tests. */
var FO = (function () {
'use strict';
let G = null;
const VERSION = 3;
const HOOK = {};
const SEASON_WEEKS = 34;

/* ---------- rng & utils ---------- */
function rnd() { let a = G.rs = (G.rs + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = a => a[Math.floor(rnd() * a.length)];
const chance = p => rnd() < p;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) * 1.73;
function wpick(arr, wf) { let tot = 0; const ws = arr.map(x => { const w = Math.max(0, wf(x)); tot += w; return w; }); if (tot <= 0) return arr[0]; let r = rnd() * tot; for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1]; }
function poisson(l) { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const uid = () => (G.nid = (G.nid || 1) + 1);
const ord = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const absWeek = () => (G.season - 1) * SEASON_WEEKS + G.week;

