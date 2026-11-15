/* ---------- players: cards, profiles, stories ---------- */
const STR_P = { fin: 'Clinical finisher', pas: 'Precise passer', dri: 'Beats his man', cro: 'Dangerous crosses', tac: 'Wins the ball', mar: 'Tight marker', hea: 'Strong in the air', pac: 'Rapid', sta: 'Tireless', str: 'Physically strong', vis: 'Sees the pass', com: 'Calm under pressure', han: 'Safe hands', ref: 'Sharp reflexes' };
const STR_N = { fin: 'Wasteful in front of goal', pas: 'Loose passing', dri: 'Poor on the ball', cro: 'Weak crossing', tac: 'Soft in the tackle', mar: 'Loses his man', hea: 'Weak in the air', pac: 'Lacks pace', sta: 'Tires late on', str: 'Lightweight', vis: 'Limited vision', com: 'Nervous', han: 'Spills shots', ref: 'Slow to react' };
function strengths(p, k) {
  const w = F.POSW[p.pos], keys = Object.keys(w), val = a => k && k.attr ? (k.attr[a][0] + k.attr[a][1]) / 2 : p.a[a];
  const base = F.tierAvg(G().club.tier);
  const sorted = keys.slice().sort((a, b) => val(b) * (1 + w[b] / 10) - val(a) * (1 + w[a] / 10)), lo = keys.slice().sort((a, b) => val(a) - val(b))[0];
  const out = sorted.slice(0, 2).filter(a => val(a) >= base + 1.2).map(a => `<span>${STR_P[a]}</span>`);
  if (val(lo) <= base - 1.2) out.push(`<span class="neg">${STR_N[lo]}</span>`);
  return out.join('');
}
function roleOf(p) { const g = G(); if (!g.squad.includes(p)) return ''; const L = F.pickXI(false); if (L.xi.some(x => x.p === p)) return 'First choice'; if (L.bench.includes(p)) return 'Bench'; return p.age <= 21 ? 'Prospect' : 'Squad player'; }
function starsTxt(v) { return `<span class="stx">${v}★</span>`; }
function pcard(p, o) {
  o = o || {}; const k = o.k, face = p.pool ? ART.poolFace(p) : ART.playerFace(p), meta = o.meta || `${p.age}, ${F.POS_L[p.pos]}${p.pool ? (p.club ? ', ' + F.cname(p.club) : ', free agent') : ''}`;
  const lvl = k ? F.recBand(k) : starsTxt(F.stars(p.ca));
  return `<button class="pcd ${o.cls || ''}" data-a="${p.pool ? 'target' : 'player'}" data-id="${p.id}" aria-label="Open profile of ${esc(p.name)}"><span class="pf">${face}</span><span class="pm"><b>${esc(p.name)}</b><small>${esc(meta)}</small>${o.noStr ? '' : `<span class="strengths">${strengths(p, k)}</span>`}</span><span class="pr">${lvl}${k ? `<i class="gr g${k.grade}">${k.grade}</i>` : ''}</span></button>`;
}
function hashN(n) { let x = (n * 2654435761) >>> 0; x = (x ^ (x >>> 13)) >>> 0; return x; }
const ORIGIN = { dom: ['Grew up two streets from a lower-league ground.', 'Came through a local Sunday league side.', 'Was a ball boy at his hometown club.'], low: ['Learned the game on the street pitches of a port city.', 'Released at 18, rebuilt his career in the second tier.'], sca: ['Played futsal through the winters.', 'Combined football with a forestry course.'], ibe: ['Raised on endless rondos at a famous street academy.', 'Left home at 15 for a club academy.'], sam: ['Grew up playing barefoot on a dirt pitch.', 'Sold fruit at the market before training.'], waf: ['Found by a local coach at a school tournament.', 'Moved countries alone at 17.'], eeu: ['Learned his trade in a strict state academy.', 'Worked nights in a factory to pay for boots.'] };
const DRIVE = ['Wants to play at a higher level within two years.', 'Plays for his family back home.', 'Says he still has a point to prove to the club that released him.', 'Loves the club and its supporters.', 'A quiet professional, first in at training.', 'Thrives on big occasions.'];
function storyOf(p) {
  const r = hashN(p.id), o = ORIGIN[p.region] || ORIGIN.dom, lines = [o[r % o.length], DRIVE[(r >> 3) % DRIVE.length]];
  const R = G().rec, l = R && R.log.find(x => x.pid === p.id || (x.name === p.name && x.pos === p.pos));
  if (l) { const sc = (F.recScouts ? F.recScouts() : []).find(s => s.id === l.by); lines.push(`Signed in season ${l.s} for ${l.fee ? money(l.fee) : 'nothing'}${sc ? `, found by ${sc.name}` : ''}.`); }
  if (p.academy) lines.push('An academy graduate: one of our own.');
  return lines.concat((p.ms || []).slice(-6).map(m => `S${m.s} W${m.w}: ${m.t}`));
}
function attrGroups(p, k) {
  const v = a => k && k.attr ? k.attr[a] : null, val = a => k && k.attr ? Math.round((k.attr[a][0] + k.attr[a][1]) / 2) : Math.round(p.a[a]);
  const G3 = p.pos === 'GK' ? [['Keeping', ['han', 'ref', 'com']], ['Physical', ['pac', 'str', 'sta']], ['Ball', ['pas', 'hea', 'vis']]] : [['Attack', ['fin', 'dri', 'cro', 'vis']], ['Defence', ['tac', 'mar', 'hea']], ['Physical', ['pac', 'sta', 'str', 'pas', 'com']]];
  const key = Object.keys(F.POSW[p.pos]);
  return `<div class="groups">${G3.map(([t, as]) => `<div class="grp"><h5>${t}</h5>${as.filter(a => !k || (k.attr && k.attr[a])).map(a => `<div class="att"><span>${F.ATTR_L[a].slice(0, 4)}</span><i><b class="${val(a) >= F.tierAvg(G().club.tier) + 2 ? 'hi' : val(a) <= F.tierAvg(G().club.tier) - 1.5 ? 'lo' : ''}" style="width:${Math.min(100, val(a) / (F.tierAvg(G().club.tier) + 6) * 100)}%"></b></i><em>${v(a) ? (v(a)[0] === v(a)[1] ? v(a)[0] : v(a)[0] + '–' + v(a)[1]) : val(a)}</em></div>`).join('') || '<p class="small">Not scouted</p>'}</div>`).join('')}</div>`;
}
function formBars(p) { const rs = p.rats || []; if (!rs.length) return '<p class="small">No games yet.</p>'; return `<div class="form">${rs.map(r => `<i class="${r >= 7 ? '' : r >= 6.4 ? 'mid' : 'low'}" style="height:${Math.max(15, (r - 5) / 4 * 100)}%" title="${r.toFixed(1)}"></i>`).join('')}</div>`; }
function profileHtml(p, k, x) {
  const g = G(), pool = !!p.pool, st = p.st || {}, rat = st.apps ? (st.rat / st.apps).toFixed(2) : '–', tab = U.ptab || 'over', role = pool ? (x ? STG_L[x.stage] : 'Target') : roleOf(p) || (g.academy.includes(p) ? 'Academy' : '');
  const now = k ? F.recBand(k) : starsTxt(g.academy.includes(p) ? F.absStars(p.ca) : F.stars(p.ca)), pot = k ? F.recPot(k) : starsTxt(g.academy.includes(p) && p.band ? p.band[1] : F.stars(p.pa));
  const head = `<div class="ph"><div class="portrait">${pool ? ART.poolFace(p) : ART.playerFace(p)}</div><div><b>${esc(p.name)}</b><div class="pmeta">${p.age}, ${F.POS_L[p.pos].toLowerCase()}, ${F.REGIONS[p.region].name}<br>${pool ? (p.club ? esc(F.cname(p.club)) + ', asking ' + money(p.ask) : 'Free agent') : money(p.wage) + '/wk, ' + p.contract + 'y left'}</div>${role ? `<span class="rolebadge">${esc(role)}</span>` : ''}</div></div>
  <div class="lvls"><span>Now ${now}</span><span>Potential ${pot}</span>${k ? `<i class="gr g${k.grade}">${k.grade}</i>` : ''}</div><div class="strengths">${strengths(p, k)}</div>
  <div class="tabs3">${[['over', 'Overview'], ['stats', 'Stats'], ['story', 'Story']].map(([t, l]) => `<button class="${tab === t ? 'on' : ''}" data-a="ptab" data-v="${t}">${l}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'over') {
    body = attrGroups(p, k);
    if (k) { const sc = (F.recScouts ? F.recScouts() : []).find(s => s.id === k.byId) || null; body += `<div class="scoutrep"><div class="mini">${sc ? ART.face(sc.id * 31 + 3, { role: 'scout', age: sc.age, bg: '#efe7d2' }) : ART.staffFace('scout')}</div><div><p>"${esc(scoutLine(p, k))}"</p><small>${esc(k.by)}, ${k.n} report${k.n === 1 ? '' : 's'}, ${k.conf} confidence</small></div></div>`; }
    else body += `<div class="statrow"><div><small>Apps</small><b>${st.apps || 0}</b></div><div><small>${p.pos === 'GK' ? 'Rating' : 'Goals'}</small><b>${p.pos === 'GK' ? rat : st.g || 0}</b></div><div><small>Morale</small><b>${r0(p.morale || 0)}</b></div><div><small>Value</small><b>${money(p.value)}</b></div></div><div class="sec">Form</div>${formBars(p)}`;
  } else if (tab === 'stats') {
    body = pool ? `<p class="small">No reliable stats for players at other clubs. The scouts' view is on the overview.</p>` : `<div class="statrow"><div><small>Apps</small><b>${st.apps}</b></div><div><small>Minutes</small><b>${st.mins}</b></div><div><small>Goals</small><b>${st.g}</b></div><div><small>Assists</small><b>${st.a}</b></div><div><small>xG</small><b>${st.xg.toFixed(1)}</b></div><div><small>xA</small><b>${st.xa.toFixed(1)}</b></div><div><small>Rating</small><b>${rat}</b></div><div><small>Duels</small><b>${st.dt ? Math.round(st.dw / st.dt * 100) + '%' : '–'}</b></div></div><div class="sec">Form, last games</div>${formBars(p)}<p class="small" style="margin-top:8px">Career: ${p.car.apps} games, ${p.car.g} goals.</p>`;
  } else {
    body = `<div class="story"><ul>${storyOf(p).map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>`;
  }
  return head + body;
}
function scoutLine(p, k) {
  const s = strengths(p, k).replace(/<[^>]+>/g, '|').split('|').filter(Boolean);
  const good = s.filter((_, i) => i < 2), bad = s[2];
  return `${good.length ? good.join(', ') + '.' : 'Nothing special yet.'} ${bad ? bad + '.' : ''} ${k.grade === 'A' ? 'Would improve us now.' : k.grade === 'B' ? 'A good addition.' : 'Squad level at best.'}`.trim();
}

