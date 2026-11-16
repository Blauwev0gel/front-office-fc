// Summarises the output of tools/longrun.js: content repetition, progression, DNA spread, dossiers.
const D=require(require('path').resolve(process.argv[2] || 'longrun.json')).runs;const N=D.length;
console.log('runs',N,'sacked',D.filter(r=>r.sacked).map(r=>'r'+r.r+'@S'+r.sacked).join(' ')||'none','seasons completed',D.map(r=>r.seasons.length).join(','));
// content repetition per season index
const maxS=10;const rep=[];
for(let si=1;si<=maxS;si++){let tot=0,rp=0,uniq=new Set();for(const r of D){const seenBefore=new Set(r.msgs.filter(m=>m.s<si).map(m=>m.ev));for(const m of r.msgs.filter(m=>m.s===si)){tot++;if(seenBefore.has(m.ev))rp++;uniq.add(m.ev)}}
 if(tot)rep.push({season:si,msgs:+(tot/D.filter(r=>r.seasons.length>=si).length).toFixed(1),repeatShare:+(rp/tot).toFixed(2),uniqEvents:uniq.size})}
console.table(rep);
// cumulative unique events per run
const cum=[];for(let si=1;si<=maxS;si++){const v=D.filter(r=>r.seasons.length>=si).map(r=>new Set(r.msgs.filter(m=>m.s<=si).map(m=>m.ev)).size);if(v.length)cum.push({season:si,avgUniqueSeen:+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1)})}
console.table(cum);
// messages by source/ev concentration
const cnt={};D.forEach(r=>r.msgs.forEach(m=>cnt[m.ev]=(cnt[m.ev]||0)+1));const tot=Object.values(cnt).reduce((a,b)=>a+b,0);const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
console.log('distinct events seen overall',top.length,'total msgs',tot,'top10 share',(top.slice(0,10).reduce((a,b)=>a+b[1],0)/tot).toFixed(2),'top10',top.slice(0,10).map(x=>x[0]+':'+x[1]).join(' '));
console.log('never-seen events:',(97-top.length));
const fr={};D.forEach(r=>r.msgs.forEach(m=>fr[m.from]=(fr[m.from]||0)+1));console.log('by from',JSON.stringify(fr));
// quiet weeks
console.log('weeks',D.reduce((a,r)=>a+r.weeksN,0),'weeks with zero new inbox',D.reduce((a,r)=>a+r.quiet,0),'avg new msgs/week',(tot/D.reduce((a,r)=>a+r.weeksN,0)).toFixed(2));
// progression / solved
const prog=[];for(let si=1;si<=maxS;si++){const v=D.map(r=>r.seasons[si-1]).filter(Boolean);if(v.length)prog.push({season:si,n:v.length,avgTier:+(v.reduce((a,x)=>a+x.tier,0)/v.length).toFixed(1),tier1:v.filter(x=>x.tier===1).length,medCash:v.map(x=>x.cash).sort((a,b)=>a-b)[v.length>>1],avgConf:Math.round(v.reduce((a,x)=>a+x.conf,0)/v.length),avgFans:Math.round(v.reduce((a,x)=>a+x.fans,0)/v.length)})}
console.table(prog);
console.log('pos distribution after S5-10',JSON.stringify(D.flatMap(r=>r.seasons.slice(4)).reduce((a,x)=>{a[x.pos]=(a[x.pos]||0)+1;return a},{})));
// DNA: first 5 seasons
const key=(r,k)=>r.dna[k];for(const k of Object.keys(D[0].dna)){const g={};D.forEach(r=>{const x=r.seasons.slice(0,5);const t=x.length?x[x.length-1].tier:null;(g[key(r,k)]=g[key(r,k)]||[]).push(t)});console.log('dna',k,Object.entries(g).map(([a,b])=>a+':'+(b.reduce((s,x)=>s+x,0)/b.length).toFixed(1)+'(n'+b.length+')').join(' '))}
// event profile similarity between runs of different dna: share of top-20 events common
const prof=r=>{const c={};r.msgs.filter(m=>m.s<=5).forEach(m=>c[m.ev]=(c[m.ev]||0)+1);return c};
let cs=0,np=0;for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=prof(D[i]),b=prof(D[j]);const ka=new Set(Object.keys(a)),kb=new Set(Object.keys(b));const inter=[...ka].filter(x=>kb.has(x)).length,uni=new Set([...ka,...kb]).size;cs+=inter/uni;np++}
console.log('avg overlap (jaccard) of event sets between two careers, first 5 seasons',(cs/np).toFixed(2));
console.log('briefs/run bstat sample',JSON.stringify(D[0].bstat));
