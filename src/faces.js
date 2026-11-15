/* The Front Office · visual layer, part 1
   Procedural ink-style portraits for every person in the game, the CEO's office scene, reputation and sound. */
const ART = (function (F) {
'use strict';
let uidN = 0;
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; }; }
const SKIN = ['#f4d6be', '#ebbe9b', '#d6a178', '#b97f55', '#8f5c38', '#62402a'];
const SKIN_W = { dom: [3, 3, 2, 1, 1, 1], low: [3, 3, 2, 1, 1, .5], sca: [5, 3, 1, .3, .2, .1], ibe: [2, 3, 3, 1, .5, .3], sam: [1, 2, 3, 3, 1, .5], waf: [.1, .1, .3, 1, 3, 4], eeu: [5, 3, 1, .3, .1, .1] };
const HAIR = ['#1c1411', '#2e1d13', '#55331c', '#8c5a2b', '#c99a53', '#e2c47a'];
const pickW = (r, w) => { const t = w.reduce((a, b) => a + b, 0); let x = r() * t; for (let i = 0; i < w.length; i++) { x -= w[i]; if (x <= 0) return i; } return w.length - 1; };
const INK = 'var(--face-ink,#16201b)';
const SUITS = ['#26303d', '#3a3f47', '#1f2a44', '#4a3b32', '#2f3b33', '#55565c'];

/* role → outfit */
function outfit(role, o, r, cx, top, sw) {
  const c1 = o.c1 || '#7a1e2b', c2 = o.c2 || '#f3d36b', sh = `M${cx - 40} 104 Q${cx - 38} ${top + 6} ${cx} ${top} Q${cx + 38} ${top + 6} ${cx + 40} 104Z`;
  const base = (fill) => `<path d="${sh}" fill="${fill}" stroke="${INK}" stroke-width="${sw}"/>`;
  const suit = SUITS[Math.floor(r() * SUITS.length)];
  if (['dof', 'fin', 'board', 'agent', 'com'].includes(role)) {
    const tie = role === 'com' ? '' : `<path d="M${cx - 2.5} ${top + 4} L${cx} ${top + 30} L${cx + 2.5} ${top + 4}Z" fill="${role === 'board' ? c2 : c1}" stroke="${INK}" stroke-width="1"/>`;
    const pocket = role === 'board' ? `<path d="M${cx + 16} ${top + 18} l6 -3 l1 5z" fill="${c2}" stroke="${INK}" stroke-width="1"/>` : '';
    return base(suit) + `<path d="M${cx - 11} ${top} L${cx} ${top + 24} L${cx + 11} ${top}" fill="#fff" stroke="${INK}" stroke-width="${sw * .6}"/>${tie}<path d="M${cx - 11} ${top} L${cx - 4} ${top + 30} M${cx + 11} ${top} L${cx + 4} ${top + 30}" stroke="${INK}" stroke-width="${sw * .5}" fill="none"/>${pocket}`;
  }
  if (role === 'coach') {
    const headset = r() < .5;
    return base(c1) + `<path d="M${cx} ${top + 2} L${cx} 104" stroke="${INK}" stroke-width="1.5"/><path d="M${cx - 12} ${top} Q${cx} ${top + 10} ${cx + 12} ${top}" fill="none" stroke="${c2}" stroke-width="4"/><path d="M${cx - 36} ${top + 22} L${cx - 26} ${top + 20}" stroke="${c2}" stroke-width="3"/>` + (headset ? '' : `<path d="M${cx - 8} ${top + 2} Q${cx - 4} ${top + 22} ${cx + 3} ${top + 26}" fill="none" stroke="#222" stroke-width="1.2"/><circle cx="${cx + 4}" cy="${top + 28}" r="3" fill="#c0c0c0" stroke="${INK}" stroke-width="1"/>`);
  }
  if (role === 'scout') { const coat = ['#8a7a5c', '#5d6466', '#6b5a45'][Math.floor(r() * 3)]; return base(coat) + `<path d="M${cx - 13} ${top - 1} L${cx - 3} ${top + 22} L${cx} ${top + 4} L${cx + 3} ${top + 22} L${cx + 13} ${top - 1}" fill="#e9e3d6" stroke="${INK}" stroke-width="${sw * .6}"/><rect x="${cx + 14}" y="${top + 16}" width="12" height="15" fill="#f3efe4" stroke="${INK}" stroke-width="1.2" transform="rotate(8 ${cx + 20} ${top + 24})"/>`; }
  if (role === 'acad') return base(c1) + `<path d="M${cx - 9} ${top} L${cx} ${top + 12} L${cx + 9} ${top}" fill="${c2}" stroke="${INK}" stroke-width="1"/><path d="M${cx - 10} ${top + 2} L${cx - 4} ${top + 32} M${cx + 10} ${top + 2} L${cx + 4} ${top + 32}" stroke="${c2}" stroke-width="2"/><rect x="${cx - 5}" y="${top + 31}" width="10" height="8" fill="#fff" stroke="${INK}" stroke-width="1"/>`;
  if (role === 'mkt') return base(['#222', '#3b3b4f', '#5a2f3b'][Math.floor(r() * 3)]) + `<path d="M${cx - 10} ${top - 2} Q${cx} ${top + 6} ${cx + 10} ${top - 2} L${cx + 10} ${top + 4} Q${cx} ${top + 12} ${cx - 10} ${top + 4}Z" fill="#444" stroke="${INK}" stroke-width="1"/>`;
  if (role === 'press') return base('#f0f0ec') + `<path d="M${cx - 10} ${top} L${cx} ${top + 10} L${cx + 10} ${top}" fill="none" stroke="${INK}" stroke-width="1.2"/><path d="M${cx - 9} ${top + 4} L${cx - 2} ${top + 30}" stroke="#2b6cb0" stroke-width="2"/><rect x="${cx - 9}" y="${top + 28}" width="14" height="9" fill="#2b6cb0" stroke="${INK}" stroke-width="1"/><text x="${cx - 2}" y="${top + 35}" font-size="4.5" font-weight="900" fill="#fff" text-anchor="middle" font-family="Arial">PRESS</text>`;
  if (role === 'fans') return base('#3a3f47') + `<path d="M${cx - 18} ${top + 2} Q${cx} ${top + 12} ${cx + 18} ${top + 2} L${cx + 18} ${top + 10} Q${cx} ${top + 20} ${cx - 18} ${top + 10}Z" fill="${c1}" stroke="${INK}" stroke-width="1.2"/><path d="M${cx - 9} ${top + 6} v8 M${cx} ${top + 8} v8 M${cx + 9} ${top + 6} v8" stroke="${c2}" stroke-width="3"/><path d="M${cx + 10} ${top + 10} l4 22 l6 -2 l-4 -21z" fill="${c1}" stroke="${INK}" stroke-width="1"/>`;
  if (role === 'youth') return base(c1) + `<path d="M${cx - 22} ${top + 6} L${cx - 20} 104 L${cx + 20} 104 L${cx + 22} ${top + 6} Q${cx} ${top + 14} ${cx - 22} ${top + 6}Z" fill="${o.bib || '#e8f25a'}" stroke="${INK}" stroke-width="1.2" opacity=".95"/>`;
  // player
  return base(c1) + `<path d="M${cx - 10} ${top} L${cx} ${top + 12} L${cx + 10} ${top}" fill="none" stroke="${c2}" stroke-width="3.5"/><path d="M${cx - 38} ${top + 24} L${cx - 30} ${top + 12}" stroke="${c2}" stroke-width="3"/><path d="M${cx + 38} ${top + 24} L${cx + 30} ${top + 12}" stroke="${c2}" stroke-width="3"/>` + (o.no ? `<text x="${cx + 20}" y="${top + 30}" font-size="10" font-weight="900" fill="${c2}" text-anchor="middle" font-family="Arial" stroke="${INK}" stroke-width=".4">${o.no}</text>` : '');
}


/* icon set: inline SVG, currentColor */
const P = d => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  money: P('<circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.8-1-2-1.5-3.2-1.5-1.8 0-3 1-3 2.4 0 3.2 6.6 1.6 6.6 4.9 0 1.4-1.4 2.4-3.3 2.4-1.4 0-2.6-.6-3.4-1.6M12 5v2M12 17v2"/>'),
  board: P('<path d="M4 20V9l8-5 8 5v11z"/><path d="M9 20v-6h6v6"/>'),
  fans: P('<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 19c.7-3.4 3-5 5.5-5s4.8 1.6 5.5 5M14 14.5c2.6-.6 5.4.6 6.3 4.5"/>'),
  trust: P('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  time: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  risk: P('<path d="M12 3 2.5 20h19z"/><path d="M12 10v4M12 17.2v.1"/>'),
  academy: P('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>'),
  scout: P('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'),
  stadium: P('<path d="M3 18V9c3-2 15-2 18 0v9c-3 2-15 2-18 0z"/><path d="M3 12c3 2 15 2 18 0"/>'),
  wage: P('<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>'),
  morale: P('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0M9 9.5h.1M15 9.5h.1"/>'),
  star: P('<path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6L12 16.4 6.6 19.4l1.2-6L3.3 9.3l6.1-.7z"/>'),
  youth: P('<path d="M12 21V11M12 11c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/>'),
  chev: P('<path d="m9 6 6 6-6 6"/>'), close: P('<path d="M6 6l12 12M18 6 6 18"/>'), up: P('<path d="m6 15 6-6 6 6"/>'), back: P('<path d="m15 6-6 6 6 6"/>'), down: P('<path d="m6 9 6 6 6-6"/>'),
  sound: P('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9.5a4 4 0 0 1 0 5M19.5 7a7.5 7.5 0 0 1 0 10"/>'),
  mute: P('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 5 5M22 9l-5 5"/>'),
  inbox: P('<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>'),
  club: P('<path d="M3 18V9c3-2 15-2 18 0v9c-3 2-15 2-18 0z"/><path d="M3 12c3 2 15 2 18 0"/>'),
  squad: P('<path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3c-.5 2-2 3-4 3S8.5 5 8 3z"/>'),
  league: P('<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4c0 3 1.5 4.5 3.5 4.8M17 6h3c0 3-1.5 4.5-3.5 4.8M12 13v4M8 21h8M9 17h6"/>'),
  staff: P('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.5-3.8 3-6 6-6s5.5 2.2 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14c2.5.2 4 2 4.5 5"/>'),
  bulb: P('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'),
  play: P('<path d="M7 5l12 7-12 7z" fill="currentColor"/>'),
  press: P('<rect x="3" y="5" width="14" height="15" rx="1"/><path d="M17 9h4v9a2 2 0 0 1-4 0M6 9h8M6 13h8M6 16h5"/>'),
  phone: '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1z"/></svg>',
  info: P('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.1"/>')
};
/* turn a free-text effect hint like "Board ↑ · DoF ↓ · −£3k" into icon chips */
const FXMAP = [[/scouting|report/i, 'scout'], [/press|paper|media|reputation/i, 'press'], [/board|chairman/i, 'board'], [/fans?|supporters|crowd|attendance/i, 'fans'], [/trust|dof|coach|scout|staff|relation|chief/i, 'trust'], [/morale|squad mood|players/i, 'morale'], [/academy|youth/i, 'academy'], [/wage/i, 'wage'], [/cash|£|budget|cost|kitty|fee/i, 'money'], [/risk|injur/i, 'risk'], [/week|time|slow/i, 'time'], [/scout|report/i, 'scout']];
function fx(h) {
  if (!h) return '';
  return String(h).split(/\s·\s|,\s(?=[A-Z+−-])/).map(t => {
    t = t.trim(); if (!t) return '';
    const up = /↑|\+|up|more|faster|higher/i.test(t) && !/−|↓|-\d/.test(t), dn = /↓|−|-\d|down|less|lower|dent/i.test(t);
    const m = FXMAP.find(([re]) => re.test(t)); const num = (t.match(/[+−-]\s?£?[\d.]+k?%?/) || [''])[0].replace(/\s/g, '');
    if (!m || (!up && !dn && !num)) return `<span class="fxt">${t.replace(/[<>&]/g, '')}</span>`;
    return `<span class="eff ${dn ? 'dn' : up ? 'up' : ''}" title="${t.replace(/"/g, '')}">${I[m[1]]}${num || (dn ? '↓' : up ? '↑' : '')}</span>`;
  }).join('');
}

/* the face */
function face(seed, o) {
  o = o || {}; const r = rng(seed + 7), id = 'f' + (++uidN), age = o.age || 30, role = o.role || 'player', em = o.emo || 'neutral';
  const skin = SKIN[pickW(r, SKIN_W[o.region] || SKIN_W.dom)];
  const greyMix = age >= 62 ? '#e4e4e4' : age >= 52 ? '#a9a9a9' : null;
  let hair = HAIR[Math.floor(r() * HAIR.length)]; if (skin === SKIN[4] || skin === SKIN[5]) hair = HAIR[Math.floor(r() * 2)]; if (greyMix && r() < .8) hair = greyMix;
  const w = 33 + r() * 9, jaw = r(), hs = Math.floor(r() * 6), bald = age >= 45 && r() < (age - 40) / 55;
  const beard = role !== 'youth' && age >= 19 && r() < .32, stub = !beard && age >= 22 && r() < .25;
  const glasses = r() < (role === 'fin' ? .7 : age > 45 ? .4 : .12), cap = role === 'scout' && r() < .5, beanie = role === 'fans' && r() < .6;
  const headset = role === 'coach' && r() < .5;
  const cx = 50, cy = 44, rx = w / 2, ry = rx * 1.2, sw = 2.4;
  const jawP = `M${cx - rx} ${cy} Q${cx - rx} ${cy + ry * (.88 + jaw * .22)} ${cx} ${cy + ry * 1.05} Q${cx + rx} ${cy + ry * (.88 + jaw * .22)} ${cx + rx} ${cy} Q${cx + rx} ${cy - ry} ${cx} ${cy - ry} Q${cx - rx} ${cy - ry} ${cx - rx} ${cy}Z`;
  const HS = [
    `M${cx - rx - 2} ${cy + 2} Q${cx - rx - 4} ${cy - ry - 8} ${cx} ${cy - ry - 6} Q${cx + rx + 4} ${cy - ry - 8} ${cx + rx + 2} ${cy + 2} Q${cx + rx - 2} ${cy - ry * .5} ${cx} ${cy - ry * .62} Q${cx - rx + 2} ${cy - ry * .5} ${cx - rx - 2} ${cy + 2}Z`,
    `M${cx - rx - 1} ${cy - 2} Q${cx - rx} ${cy - ry - 4} ${cx} ${cy - ry - 3} Q${cx + rx} ${cy - ry - 4} ${cx + rx + 1} ${cy - 2} L${cx + rx - 3} ${cy - ry * .55} L${cx - rx + 3} ${cy - ry * .55}Z`,
    `M${cx - rx - 3} ${cy + 8} Q${cx - rx - 6} ${cy - ry - 10} ${cx + 4} ${cy - ry - 8} Q${cx + rx + 6} ${cy - ry - 6} ${cx + rx + 3} ${cy + 8} Q${cx + rx} ${cy - ry * .4} ${cx - 4} ${cy - ry * .7} Q${cx - rx} ${cy - ry * .3} ${cx - rx - 3} ${cy + 8}Z`,
    `M${cx - rx} ${cy - 6} Q${cx - rx} ${cy - ry - 2} ${cx} ${cy - ry - 1} Q${cx + rx} ${cy - ry - 2} ${cx + rx} ${cy - 6} Q${cx} ${cy - ry * .75} ${cx - rx} ${cy - 6}Z`,
    `M${cx - rx - 2} ${cy - 1} Q${cx - rx + 2} ${cy - ry - 12} ${cx + 2} ${cy - ry - 10} Q${cx + rx + 2} ${cy - ry - 8} ${cx + rx + 2} ${cy - 1} Q${cx + rx - 4} ${cy - ry * .6} ${cx + 6} ${cy - ry * .5} Q${cx - 2} ${cy - ry * .8} ${cx - rx - 2} ${cy - 1}Z`,
    `M${cx - rx - 4} ${cy + 4} Q${cx - rx - 8} ${cy - ry - 12} ${cx} ${cy - ry - 13} Q${cx + rx + 8} ${cy - ry - 12} ${cx + rx + 4} ${cy + 4} Q${cx + rx + 2} ${cy - ry * .3} ${cx} ${cy - ry * .55} Q${cx - rx - 2} ${cy - ry * .3} ${cx - rx - 4} ${cy + 4}Z`];
  const hairP = HS[hs];
  const browY = cy - ry * .28, eyeY = cy - ry * .1, ex = rx * .42;
  const brow = em === 'angry' ? `M${cx - ex - 6} ${browY - 2} L${cx - ex + 5} ${browY + 3} M${cx + ex + 6} ${browY - 2} L${cx + ex - 5} ${browY + 3}` : em === 'worried' ? `M${cx - ex - 6} ${browY + 2} L${cx - ex + 5} ${browY - 2} M${cx + ex + 6} ${browY + 2} L${cx + ex - 5} ${browY - 2}` : em === 'surprised' ? `M${cx - ex - 6} ${browY - 3} Q${cx - ex} ${browY - 7} ${cx - ex + 5} ${browY - 3} M${cx + ex + 6} ${browY - 3} Q${cx + ex} ${browY - 7} ${cx + ex - 5} ${browY - 3}` : `M${cx - ex - 6} ${browY} Q${cx - ex} ${browY - 3} ${cx - ex + 5} ${browY} M${cx + ex + 6} ${browY} Q${cx + ex} ${browY - 3} ${cx + ex - 5} ${browY}`;
  const mY = cy + ry * .5, mouth = em === 'happy' ? `M${cx - 8} ${mY - 2} Q${cx} ${mY + 7} ${cx + 8} ${mY - 2}` : em === 'angry' ? `M${cx - 7} ${mY + 3} Q${cx} ${mY - 4} ${cx + 7} ${mY + 3}` : em === 'worried' ? `M${cx - 6} ${mY + 1} Q${cx - 2} ${mY - 2} ${cx} ${mY} Q${cx + 3} ${mY + 2} ${cx + 6} ${mY - 1}` : em === 'surprised' ? `M${cx - 3} ${mY} a3 4 0 1 0 6 0 a3 4 0 1 0 -6 0` : `M${cx - 6} ${mY} L${cx + 6} ${mY}`;
  const top = cy + ry + 4;
  const wrinkles = age >= 42 ? `<path d="M${cx - 8} ${cy - ry * .55} q8 -2 16 0${age >= 55 ? ` M${cx - 6} ${cy - ry * .45} q6 -2 12 0` : ''}" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.2"/>${age >= 55 ? `<path d="M${cx - ex - 8} ${eyeY + 2} l-3 2 M${cx + ex + 8} ${eyeY + 2} l3 2" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/>` : ''}` : '';
  const bg = o.bg === 'none' ? '' : `<circle cx="50" cy="50" r="49" fill="${o.bg || '#fff'}"/><circle cx="50" cy="50" r="49" fill="url(#d${id})"/>`;
  const hairEl = bald ? `<path d="M${cx - rx - 1} ${cy + 2} Q${cx - rx - 2} ${cy - ry * .5} ${cx - rx * .55} ${cy - ry * .6} M${cx + rx + 1} ${cy + 2} Q${cx + rx + 2} ${cy - ry * .5} ${cx + rx * .55} ${cy - ry * .6}" fill="none" stroke="${hair}" stroke-width="5" stroke-linecap="round"/>` : `<path d="${hairP}" fill="${hair}" stroke="${INK}" stroke-width="${sw * .8}" stroke-linejoin="round"/>`;
  const capEl = cap ? `<path d="M${cx - rx - 3} ${cy - ry * .45} Q${cx} ${cy - ry - 12} ${cx + rx + 3} ${cy - ry * .45}Z" fill="#6b5a45" stroke="${INK}" stroke-width="${sw * .8}"/><path d="M${cx - rx - 2} ${cy - ry * .45} Q${cx + 4} ${cy - ry * .25} ${cx + rx + 9} ${cy - ry * .5}" fill="none" stroke="${INK}" stroke-width="${sw * .8}"/>` : beanie ? `<path d="M${cx - rx - 2} ${cy - ry * .35} Q${cx} ${cy - ry - 16} ${cx + rx + 2} ${cy - ry * .35}Z" fill="${o.c1 || '#7a1e2b'}" stroke="${INK}" stroke-width="${sw * .8}"/><rect x="${cx - rx - 3}" y="${cy - ry * .5}" width="${rx * 2 + 6}" height="7" rx="3" fill="${o.c2 || '#f3d36b'}" stroke="${INK}" stroke-width="1.5"/>` : '';
  const hsEl = headset ? `<path d="M${cx - rx - 3} ${cy + 2} Q${cx - rx - 4} ${cy - ry - 8} ${cx} ${cy - ry - 7} Q${cx + rx + 4} ${cy - ry - 8} ${cx + rx + 3} ${cy + 2}" fill="none" stroke="#222" stroke-width="2.5"/><rect x="${cx - rx - 6}" y="${cy - 3}" width="6" height="10" rx="2" fill="#222"/><path d="M${cx - rx - 3} ${cy + 6} Q${cx - rx} ${cy + ry * .6} ${cx - 6} ${mY + 1}" fill="none" stroke="#222" stroke-width="1.6"/>` : '';
  const beardEl = beard ? `<path d="M${cx - rx + 1} ${cy + 3} Q${cx - rx + 2} ${cy + ry + 2} ${cx} ${cy + ry * 1.08} Q${cx + rx - 2} ${cy + ry + 2} ${cx + rx - 1} ${cy + 3} Q${cx + rx - 6} ${cy + ry * .62} ${cx} ${cy + ry * .64} Q${cx - rx + 6} ${cy + ry * .62} ${cx - rx + 1} ${cy + 3}Z" fill="${hair}" stroke="${INK}" stroke-width="1.2"/>` : stub ? `<path d="M${cx - rx + 3} ${cy + 6} Q${cx} ${cy + ry * 1.2} ${cx + rx - 3} ${cy + 6}" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="7"/>` : '';
  const cheek = em === 'angry' ? `<ellipse cx="${cx - ex - 2}" cy="${eyeY + 9}" rx="5" ry="2.5" fill="#e0533c" opacity=".35"/><ellipse cx="${cx + ex + 2}" cy="${eyeY + 9}" rx="5" ry="2.5" fill="#e0533c" opacity=".35"/>` : '';
  const fx = em === 'angry' ? `<path d="M${cx + rx + 3} ${cy - ry - 2} l6 -6 m-1 9 l8 -3" stroke="#d9472b" stroke-width="2.6" stroke-linecap="round"/>` : em === 'worried' ? `<path d="M${cx + rx + 2} ${cy - ry * .4} q3 5 0 8 q-3 -3 0 -8z" fill="#7fc4ef" stroke="${INK}" stroke-width="1"/>` : em === 'happy' && o.spark ? `<path d="M${cx + rx + 6} ${cy - ry} l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" fill="#f3d36b" stroke="${INK}" stroke-width="1"/>` : '';
  return `<svg class="face" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><pattern id="d${id}" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".9" fill="rgba(0,0,0,.1)"/></pattern><clipPath id="c${id}"><circle cx="50" cy="50" r="49"/></clipPath></defs>${bg}<g clip-path="url(#c${id})">
  ${outfit(role, o, r, cx, top, sw)}
  <path d="M${cx - 6} ${cy + ry * .8} h12 v10 h-12z" fill="${skin}" stroke="${INK}" stroke-width="1.2"/>
  <ellipse cx="${cx - rx}" cy="${cy + 2}" rx="3.6" ry="5.2" fill="${skin}" stroke="${INK}" stroke-width="1.5"/><ellipse cx="${cx + rx}" cy="${cy + 2}" rx="3.6" ry="5.2" fill="${skin}" stroke="${INK}" stroke-width="1.5"/>
  <path d="${jawP}" fill="${skin}" stroke="${INK}" stroke-width="${sw}"/>
  <path d="M${cx + rx * .35} ${cy - ry * .2} Q${cx + rx * .95} ${cy + ry * .3} ${cx + rx * .25} ${cy + ry * .95}" fill="none" stroke="rgba(0,0,0,.13)" stroke-width="5"/>
  ${beardEl}${hairEl}${capEl}${wrinkles}${cheek}
  <path d="${brow}" stroke="${hair === '#e4e4e4' ? '#888' : '#1c1411'}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  ${em === 'happy' ? `<path d="M${cx - ex - 3} ${eyeY + 1} q3 -4 6 0 M${cx + ex - 3} ${eyeY + 1} q3 -4 6 0" stroke="#1a1a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : `<circle cx="${cx - ex}" cy="${eyeY}" r="${em === 'surprised' ? 3 : 2.5}" fill="#1a1a1a"/><circle cx="${cx + ex}" cy="${eyeY}" r="${em === 'surprised' ? 3 : 2.5}" fill="#1a1a1a"/>`}
  ${glasses ? `<g fill="rgba(255,255,255,.15)" stroke="#16201b" stroke-width="1.8"><rect x="${cx - ex - 6.5}" y="${eyeY - 5}" width="13" height="9.5" rx="3"/><rect x="${cx + ex - 6.5}" y="${eyeY - 5}" width="13" height="9.5" rx="3"/></g><path d="M${cx - ex + 6.5} ${eyeY - 1} L${cx + ex - 6.5} ${eyeY - 1}" stroke="#16201b" stroke-width="1.8"/>` : ''}
  <path d="M${cx} ${eyeY + 3} Q${cx + 3.5} ${cy + ry * .28} ${cx - 1} ${cy + ry * .31}" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>
  <path d="${mouth}" fill="${em === 'surprised' ? '#4a1f1a' : 'none'}" stroke="${INK}" stroke-width="2.3" stroke-linecap="round"/>
  ${hsEl}${fx}</g></svg>`;
}

/* people in the game */
const g = () => F.G;
const cols = () => { const c = g() && g().club ? g().club.colors : ['#7a1e2b', '#f3d36b']; return { c1: c[0], c2: c[1] }; };
const moodOf = s => !s ? 'neutral' : s.rel < 32 ? 'angry' : s.rel < 45 ? 'worried' : s.rel > 72 ? 'happy' : 'neutral';
const FIXED = { board: { seed: 9001, age: 61 }, press: { seed: 9002, age: 34 }, fans: { seed: 9003, age: 27 }, club: { seed: 9004, age: 40 }, agent: { seed: 9005, age: 45 } };
const BG = { dof: '#fff', coach: '#d9e8dc', scout: '#efe7d2', acad: '#e2ecf5', com: '#f5e3e3', mkt: '#ece2f2', fin: '#e8e8e8', board: '#f3d36b', press: '#dfe9f5', fans: '#fde9c8', club: '#fff' };
function staffFace(role, emo, extra) {
  const s = F.staff && F.ROLE[role] ? F.staff(role) : null, C = cols();
  if (s) return face(s.id * 31 + 3, Object.assign({ role, age: s.age, emo: emo || moodOf(s), bg: BG[role] }, C, extra || {}));
  const fx = FIXED[role] || FIXED.club;
  return face(fx.seed, Object.assign({ role: role === 'club' ? 'com' : role, age: fx.age, emo: emo || 'neutral', bg: BG[role] || '#fff' }, C, extra || {}));
}
function playerFace(p, emo, extra) { const C = cols(); return face(p.id * 17 + 11, Object.assign({ role: p.academy && g().academy && g().academy.includes(p) ? 'youth' : 'player', age: p.age, region: p.region, emo: emo || (p.morale > 75 ? 'happy' : p.morale < 40 ? 'worried' : 'neutral'), bg: '#fff' }, C, extra || {})); }
function poolFace(p, extra) { return face(p.id * 17 + 11, Object.assign({ role: 'player', age: p.age, region: p.region, c1: '#55606a', c2: '#e6ebe3', bg: '#efe7d2' }, extra || {})); }

/* CEO reputation */
const LEVELS = [[0, 'Rookie chairman'], [40, 'Steady hand'], [90, 'Ambitious'], [160, 'Respected'], [260, 'Visionary'], [400, 'Club legend']];
function rep() {
  const G = g(); if (!G || !G.club) return { pts: 0, lv: 1, title: LEVELS[0][1], next: 40, prog: 0 };
  const ups = (G.history || []).filter((h, i, a) => i > 0 && h.tier < a[i - 1].tier).length + (G.history || []).filter(h => h.tier < 8).length * 0;
  const pts = Math.round((G.season - 1) * 12 + (8 - G.club.tier) * 30 + (G.trophies || []).length * 35 + G.board.conf / 4 + (G.st.fans || 0) / 6);
  let i = 0; while (i < LEVELS.length - 1 && pts >= LEVELS[i + 1][0]) i++;
  const next = LEVELS[i + 1] ? LEVELS[i + 1][0] : pts, prev = LEVELS[i][0];
  return { pts, lv: i + 1, title: LEVELS[i][1], next, prog: next > prev ? (pts - prev) / (next - prev) : 1 };
}

/* the office scene */
function office(o) {
  const G = g(), C = cols(), cap = G.club.cap || 2500, stand = Math.min(1, (cap - 2000) / 18000), R = rep();
  const needs = o.needs || 0, letters = Math.min(6, o.items || 0), pos = o.pos || '–';
  const sh = 26 + stand * 22, sw2 = 60 + stand * 60;
  return `<svg class="office" viewBox="0 0 360 170" preserveAspectRatio="xMidYMid slice" role="img" aria-label="The CEO's office">
  <defs><pattern id="ofd" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="rgba(0,0,0,.07)"/></pattern></defs>
  <rect width="360" height="170" fill="var(--wall,#cfdccf)"/><rect width="360" height="170" fill="url(#ofd)"/>
  <g transform="translate(176 14)"><rect width="168" height="96" fill="#a9cce6" stroke="#16201b" stroke-width="3"/><circle cx="140" cy="22" r="10" fill="#f6d86b" stroke="#16201b" stroke-width="2"/>
  <rect y="62" width="168" height="34" fill="#4f8d5c"/><path d="M0 62 h168" stroke="#16201b" stroke-width="2"/>
  <path d="M${84 - sw2 / 2} 64 L${84 - sw2 / 2 + 10} ${64 - sh} L${84 + sw2 / 2 - 10} ${64 - sh} L${84 + sw2 / 2} 64Z" fill="${C.c1}" stroke="#16201b" stroke-width="2.5"/>
  <rect x="${84 - sw2 / 2 + 14}" y="${64 - sh + 5}" width="${sw2 - 28}" height="5" fill="${C.c2}"/>
  ${stand > .4 ? `<path d="M${84 - sw2 / 2 + 8} ${64 - sh} v-10 M${84 + sw2 / 2 - 8} ${64 - sh} v-10" stroke="#16201b" stroke-width="2"/><circle cx="${84 - sw2 / 2 + 8}" cy="${54 - sh}" r="3" fill="#fff" stroke="#16201b"/><circle cx="${84 + sw2 / 2 - 8}" cy="${54 - sh}" r="3" fill="#fff" stroke="#16201b"/>` : ''}
  <path d="M84 0 v96 M0 48 h168" stroke="#16201b" stroke-width="2.5"/></g>
  <g transform="translate(14 14)"><rect width="128" height="62" fill="#fff" stroke="#16201b" stroke-width="3"/><text x="10" y="18" font-size="10" font-weight="800" fill="#16201b" font-family="var(--head)">THIS SEASON</text><text x="10" y="50" font-size="30" font-weight="900" fill="${C.c1}" font-family="var(--head)" font-style="italic">${pos}</text><text x="70" y="36" font-size="10" fill="#16201b" font-family="var(--head)" font-weight="700">target</text><text x="70" y="50" font-size="14" fill="#16201b" font-family="var(--head)" font-weight="800">${o.target || '–'}</text></g>
  <rect y="118" width="360" height="52" fill="#6b4a33" stroke="#16201b" stroke-width="3"/><rect y="118" width="360" height="6" fill="#86603f"/>
  <g transform="translate(26 92)"><g class="${needs ? 'ringing' : ''}"><path d="M8 18 h56 l-6 22 h-44z" fill="#16201b"/><path d="M2 12 q34 -16 68 0 l-4 10 q-30 -10 -60 0z" fill="${needs ? '#d9472b' : '#2d3a33'}" stroke="#16201b" stroke-width="3"/></g></g>
  ${needs ? `<g class="badge-ring"><circle cx="102" cy="96" r="13" fill="#d9472b" stroke="#16201b" stroke-width="2.5"/><text x="102" y="101" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="var(--head)">${needs}</text></g>` : ''}
  <g transform="translate(140 104)">${Array.from({ length: letters }, (_, i) => `<rect x="${(i % 2) * 6}" y="${-i * 5}" width="62" height="20" fill="${i % 3 === 0 ? '#f3d36b' : '#fff'}" stroke="#16201b" stroke-width="2.2" transform="rotate(${(i * 37 % 9) - 4} 31 10)"/>`).join('')}</g>
  <g transform="translate(232 128)"><rect width="114" height="30" fill="#fff" stroke="#16201b" stroke-width="2.5"/><rect x="2" y="24" width="${Math.max(4, R.prog * 110)}" height="4" fill="var(--acc)"/><text x="8" y="13" font-size="9" font-weight="800" fill="#16201b" font-family="var(--head)">CEO LV ${R.lv}</text><text x="8" y="22" font-size="10" font-weight="900" font-style="italic" fill="#16201b" font-family="var(--head)">${R.title}</text></g>
  </svg>`;
}

/* sound: tiny WebAudio cues, off by default */
let actx = null;
const on = () => { try { return localStorage.getItem('fo_sound') === '1'; } catch (e) { return false; } };
function tone(f, d, type, vol, slide) { if (!on()) return; try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const t = actx.currentTime, o = actx.createOscillator(), gn = actx.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol || .08, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn); gn.connect(actx.destination); o.start(t); o.stop(t + d); } catch (e) { } }
function noise(d, vol) { if (!on()) return; try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const b = actx.createBuffer(1, actx.sampleRate * d, actx.sampleRate), c = b.getChannelData(0); for (let i = 0; i < c.length; i++) c[i] = (Math.random() * 2 - 1) * (1 - i / c.length); const s = actx.createBufferSource(), gn = actx.createGain(); gn.gain.value = vol || .1; s.buffer = b; s.connect(gn); gn.connect(actx.destination); s.start(); } catch (e) { } }
const SND = {
  on, toggle: () => { try { localStorage.setItem('fo_sound', on() ? '0' : '1'); } catch (e) { } if (on()) SND.click(); },
  click: () => tone(660, .06, 'square', .03),
  card: () => { tone(420, .05, 'triangle', .05); tone(620, .08, 'triangle', .04); },
  stamp: () => { noise(.12, .25); tone(90, .18, 'sine', .2, 50); },
  ring: () => { for (let i = 0; i < 3; i++) setTimeout(() => { tone(880, .09, 'square', .03); tone(1100, .09, 'square', .025); }, i * 140); },
  whistle: () => { tone(2300, .25, 'sine', .05, 2500); setTimeout(() => tone(2300, .4, 'sine', .05, 2200), 280); },
  cheer: () => { noise(.9, .12); tone(523, .15, 'triangle', .05); setTimeout(() => tone(659, .15, 'triangle', .05), 120); setTimeout(() => tone(784, .3, 'triangle', .05), 240); },
  bad: () => tone(200, .3, 'sawtooth', .04, 120)
};
const vib = ms => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { } };

return { face, staffFace, playerFace, poolFace, moodOf, rep, office, SND, vib, LEVELS, I, fx };
})(FO);
