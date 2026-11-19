/* ================= World: club identity, generated from the seed =================
   Colours, crest, kit, stadium and drawn portraits. Deterministic per club or person, SVG only, cached. */
const KIT_PAIRS=[['#1d3557','#f4a300'],['#7a1f2b','#8fc8ec'],['#111111','#ffffff'],['#0b6b3a','#ffffff'],['#c8102e','#ffffff'],['#1446a0','#ffd400'],['#f26b1d','#111111'],['#6b1a2a','#d4a537'],['#6cace4','#ffffff'],['#4b2a7b','#ffffff'],['#004d40','#f2c94c'],['#b31b1b','#111111'],['#1b3d2f','#e9d8a6'],['#0d2b52','#c8102e'],['#ffd100','#111111'],['#5d2e46','#9ad1d4'],['#2f4858','#f6ae2d'],['#8d0801','#f4d58d'],['#003f88','#ffffff'],['#2a9d8f','#264653'],['#e63946','#1d3557'],['#3d405b','#f2cc8f'],['#14213d','#fca311'],['#6a040f','#ffba08'],['#283618','#dda15e'],['#03045e','#00b4d8'],['#9b2226','#e9d8a6'],['#001219','#94d2bd'],['#432818','#ffe6a7'],['#540b0e','#e09f3e'],['#1a1a2e','#e94560'],['#22223b','#c9ada7']];
const SYMBOL_BY_TOWN={harbour:['anchor','ship','gull'],mill:['wheel','bee','shuttle'],cathedral:['tower','key','lion'],resort:['gull','sun','wave'],newtown:['star','oak','bridge'],mining:['lamp','picks','pithead']};
const ID_CACHE={};
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function hrng(s){let x=hashStr(s)||1;return()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return(x%100000)/100000}}
function assignClubColours(){
  const ids=Object.keys(S.clubs).sort(),r=mkRng(S.seed^0xc01);const pairs=KIT_PAIRS.slice();
  for(let i=pairs.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pairs[i],pairs[j]]=[pairs[j],pairs[i]]}
  ids.forEach((id,i)=>{const c=S.clubs[id];if(id==='pell'){c.col=['#1d3557','#f4a300']}else c.col=pairs[i%pairs.length].slice();
    const h=hrng(S.seed+':'+id);c.crestShape=['shield','round','diamond','banner'][Math.floor(h()*4)];c.crestField=['plain','pale','quarter','bend','chief'][Math.floor(h()*5)];
    c.symbol=(SYMBOL_BY_TOWN[c.town]||['star'])[Math.floor(h()*3)];c.kitPat=['plain','stripes','hoops','halves','sash','quarters'][Math.floor(h()*6)];
    c.ground=c.ground||`${c.name.split(' ')[0]} ${['Park','Road','Lane','Meadow','Fields','Ground'][Math.floor(h()*6)]}`;c.capacity=c.capacity||(c.tier===0?ri(5200,9000):ri(2400,5200));});
  // Pell and its rival must never share colours
}
/* --- colour helpers: contrast always WCAG AA --- */
function hexRgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function lum(h){const [r,g,b]=hexRgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b}
function contrast(a,b){const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function onColour(bg){return contrast(bg,'#ffffff')>=contrast(bg,'#111111')?'#ffffff':'#111111'}
function clubVars(c){const p=c.col[0],s=c.col[1];return`--club:${p};--club2:${s};--onclub:${onColour(p)};--onclub2:${onColour(s)}`}
/* --- crest --- */
const SYM={
 anchor:'<path d="M50 22v50M38 30h24M30 58c4 12 12 16 20 16s16-4 20-16" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="20" r="5" fill="none" stroke="currentColor" stroke-width="5"/>',
 ship:'<path d="M28 62h44l-8 12H36z M50 26v34 M50 28l16 26H50z" fill="currentColor"/>',
 gull:'<path d="M24 52c8-10 18-10 26 0 8-10 18-10 26 0" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
 wheel:'<circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="6"/><path d="M50 26v48M26 50h48M33 33l34 34M67 33L33 67" stroke="currentColor" stroke-width="4"/>',
 bee:'<ellipse cx="50" cy="54" rx="12" ry="16" fill="currentColor"/><ellipse cx="40" cy="38" rx="9" ry="6" fill="none" stroke="currentColor" stroke-width="4"/><ellipse cx="60" cy="38" rx="9" ry="6" fill="none" stroke="currentColor" stroke-width="4"/>',
 shuttle:'<path d="M24 50L50 40 76 50 50 60z" fill="currentColor"/><path d="M30 50h40" stroke="var(--crestbg,#fff)" stroke-width="3"/>',
 tower:'<path d="M38 74V40h24v34z M36 40l14-14 14 14z" fill="currentColor"/><rect x="46" y="54" width="8" height="12" fill="var(--crestbg,#fff)"/>',
 key:'<circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="6"/><path d="M47 47l22 22M60 60l6-6M65 65l6-6" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
 lion:'<path d="M30 70c0-16 8-26 20-26 6-10 18-10 22 0-6 0-8 4-8 8 6 2 8 8 6 18z" fill="currentColor"/>',
 sun:'<circle cx="50" cy="50" r="12" fill="currentColor"/><path d="M50 26v8M50 66v8M26 50h8M66 50h8M33 33l6 6M61 61l6 6M67 33l-6 6M39 61l-6 6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
 wave:'<path d="M22 46c7-8 14-8 21 0s14 8 21 0 14-8 14-8M22 62c7-8 14-8 21 0s14 8 21 0 14-8 14-8" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
 star:'<path d="M50 24l7 17h18l-14 11 5 18-16-10-16 10 5-18-14-11h18z" fill="currentColor"/>',
 oak:'<circle cx="50" cy="42" r="16" fill="currentColor"/><rect x="46" y="54" width="8" height="18" fill="currentColor"/>',
 bridge:'<path d="M22 62h56M28 62c4-18 40-18 44 0M34 62v-8M50 62V46M66 62v-8" fill="none" stroke="currentColor" stroke-width="5"/>',
 lamp:'<path d="M42 30h16l4 10H38z M38 40h24l-4 28H42z" fill="currentColor"/><rect x="47" y="22" width="6" height="8" fill="currentColor"/>',
 picks:'<path d="M30 30l40 40M70 30L30 70" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M24 34c4-8 12-12 16-10M76 34c-4-8-12-12-16-10" fill="none" stroke="currentColor" stroke-width="5"/>',
 pithead:'<path d="M34 74l10-46h12l10 46M38 56h24M40 44h20" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="50" cy="26" r="6" fill="none" stroke="currentColor" stroke-width="4"/>'};
function crestSVG(c,size,big){
  const key='crest:'+c.id+':'+size+(big?'b':'');if(ID_CACHE[key])return ID_CACHE[key];
  const p=c.col[0],s=c.col[1],shape={shield:'M10 8h80v38c0 26-18 40-40 48C28 86 10 72 10 46z',round:'M50 6a44 44 0 1 0 0.1 0z',diamond:'M50 4l44 46-44 46L6 50z',banner:'M12 6h76v70l-38 18-38-18z'}[c.crestShape||'shield'];
  const id='cl'+c.id.replace(/\W/g,'')+size;let field='';
  if(c.crestField==='pale')field=`<rect x="50" y="0" width="50" height="100" fill="${s}"/>`;
  if(c.crestField==='quarter')field=`<rect x="50" y="0" width="50" height="50" fill="${s}"/><rect x="0" y="50" width="50" height="50" fill="${s}"/>`;
  if(c.crestField==='bend')field=`<path d="M0 30L70 100H100V70L30 0H0z" fill="${s}"/>`;
  if(c.crestField==='chief')field=`<rect x="0" y="0" width="100" height="32" fill="${s}"/>`;
  const plainish=c.crestField==='plain'||c.crestField==='chief';const symCol=plainish&&contrast(s,p)>=2.2?s:onColour(p);
  const badge=plainish?'':`<circle cx="50" cy="50" r="27" fill="${p}" stroke="#111" stroke-width="2.5"/>`;
  const svg=`<svg class="crest" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${esc(c.name)} crest"><defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs><g clip-path="url(#${id})"><rect width="100" height="100" fill="${p}"/>${field}</g>${badge}<g style="color:${symCol};--crestbg:${p}" transform="translate(0,${c.crestField==='chief'?6:0})">${SYM[c.symbol]||SYM.star}</g><path d="${shape}" fill="none" stroke="#111" stroke-width="3.5"/>${big?`<text x="50" y="${c.crestShape==='round'?88:84}" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="700" font-size="11" fill="${onColour(p)}">${c.founded}</text>`:''}</svg>`;
  ID_CACHE[key]=svg;return svg;
}
/* --- kit --- */
function kitSVG(c,size){
  const key='kit:'+c.id+size;if(ID_CACHE[key])return ID_CACHE[key];const p=c.col[0],s=c.col[1],id='k'+c.id.replace(/\W/g,'')+size;
  const body='M30 14l12-6c2 6 14 6 16 0l12 6 18 14-10 14-8-6v54H30V36l-8 6-10-14z';
  const pat={plain:'',stripes:[38,50,62].map(x=>`<rect x="${x-4}" y="0" width="7" height="100" fill="${s}"/>`).join(''),hoops:[34,50,66,82].map(y=>`<rect x="0" y="${y-4}" width="100" height="8" fill="${s}"/>`).join(''),halves:`<rect x="50" y="0" width="50" height="100" fill="${s}"/>`,sash:`<path d="M22 20L36 14 82 86 68 96z" fill="${s}"/>`,quarters:`<rect x="50" y="0" width="50" height="50" fill="${s}"/><rect x="0" y="50" width="50" height="50" fill="${s}"/>`}[c.kitPat||'plain'];
  const svg=`<svg class="kit" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${esc(c.name)} home kit"><defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs><g clip-path="url(#${id})"><rect width="100" height="100" fill="${p}"/>${pat}</g><path d="${body}" fill="none" stroke="#111" stroke-width="3"/><path d="M42 8c2 6 14 6 16 0" fill="none" stroke="${s}" stroke-width="4"/></svg>`;
  ID_CACHE[key]=svg;return svg;
}
/* --- stadium: four stands, filled to the crowd --- */
function stadiumSVG(c,fill){
  const p=c.col[0],f=Math.max(.1,Math.min(1,fill??.6));const stand=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d9d4c7" stroke="#111" stroke-width="1.5"/><rect x="${x}" y="${y}" width="${w*f}" height="${h}" fill="${p}" opacity=".85"/>`;
  return`<svg class="stadium" viewBox="0 0 200 120" role="img" aria-label="${esc(c.ground)}, ${c.capacity} seats">${stand(30,4,140,18)}${stand(30,98,140,18)}${stand(4,26,18,68)}${stand(178,26,18,68)}<rect x="30" y="26" width="140" height="68" fill="#3f7d3a" stroke="#111" stroke-width="1.5"/><path d="M100 26v68" stroke="#fff" stroke-width="1.5"/><circle cx="100" cy="60" r="10" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="30" y="44" width="16" height="32" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="154" y="44" width="16" height="32" fill="none" stroke="#fff" stroke-width="1.5"/></svg>`;
}
/* --- drawn portraits: print-style heads, deterministic per person --- */
const SKIN=['#f2d0b5','#e7b896','#c98f65','#a86b45','#7c4a2d','#5a3420'];
const HAIR=['#1b1b1b','#3b2a1e','#6a4a2c','#a8743f','#d9b36c','#8c8c8c','#c9c9c9'];
function portraitSVG(key,o={}){
  const size=o.size||48,ck='por:'+key+':'+size+':'+(o.club||'')+(o.age||'');if(ID_CACHE[ck])return ID_CACHE[ck];
  const h=hrng(key),skin=SKIN[Math.floor(h()*SKIN.length)],age=o.age||30;let hair=HAIR[Math.floor(h()*5)];if(age>=48)hair=HAIR[5+Math.floor(h()*2)];
  const style=Math.floor(h()*5),brow=h()<.5,beard=h()<(age>=28?.3:.1),smile=h(),col=o.col||['#1d3557','#f4a300'];
  const hairPath=[`M28 40c0-14 10-22 22-22s22 8 22 22c-4-6-12-9-22-9s-18 3-22 9z`,`M27 44c-2-18 10-27 23-27s25 9 23 27c-3-10-10-13-23-13s-20 3-23 13z`,`M30 36c4-12 12-16 20-16s16 4 20 16c-6-3-12-4-20-4s-14 1-20 4z`,`M26 46c-1-20 11-30 24-30 14 0 26 10 24 30-2-4-4-8-6-10-6 2-12 3-18 3s-12-1-18-3c-2 2-4 6-6 10z`,age>=40&&h()<.6?`M30 38c2-6 6-9 10-10M70 38c-2-6-6-9-10-10`:`M29 38c2-12 10-18 21-18s19 6 21 18c-5-4-12-6-21-6s-16 2-21 6z`][style];
  const svg=`<svg class="portrait" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${esc(o.name||'Portrait')}"><circle cx="50" cy="50" r="49" fill="${o.bg||'#ece7da'}"/><path d="M18 100c2-18 14-26 32-26s30 8 32 26z" fill="${col[0]}" stroke="#111" stroke-width="2"/><path d="M40 75l10 10 10-10" fill="${col[1]}" stroke="#111" stroke-width="2"/><rect x="43" y="62" width="14" height="14" fill="${skin}" stroke="#111" stroke-width="2"/><ellipse cx="50" cy="46" rx="21" ry="24" fill="${skin}" stroke="#111" stroke-width="2.4"/>${style===4&&age>=40?`<path d="${hairPath}" stroke="${hair}" stroke-width="5" fill="none"/>`:`<path d="${hairPath}" fill="${hair}" stroke="#111" stroke-width="1.6"/>`}${brow?`<path d="M38 41h8M54 41h8" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>`:''}<circle cx="42" cy="47" r="2.2" fill="#111"/><circle cx="58" cy="47" r="2.2" fill="#111"/><path d="M50 49l-2 7h4" fill="none" stroke="#111" stroke-width="1.6"/>${smile>.4?`<path d="M42 60c4 4 12 4 16 0" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>`:`<path d="M43 61h14" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>`}${beard?`<path d="M30 52c2 16 10 22 20 22s18-6 20-22c-4 8-10 10-20 10s-16-2-20-10z" fill="${hair}" opacity=".85"/>`:''}${age>=45?`<path d="M36 36h6M58 36h6" stroke="#111" stroke-width="1" opacity=".5"/>`:''}</svg>`;
  ID_CACHE[ck]=svg;return svg;
}
function personPortrait(pid,size){const p=P(pid);if(!p)return'';const c=p.club&&S.clubs[p.club];return portraitSVG(pid,{size,age:p.age,col:c?c.col:['#555','#ccc'],name:p.name})}
function playerPortrait(pl,size){const c=S.cf&&S.clubs[S.cf.club];return portraitSVG(pl.id,{size,age:pl.age,col:c?c.col:['#555','#ccc'],name:pl.name})}
