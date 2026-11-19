/* ================= State changes (each logs its cause) ================= */
function log(text,why,num){const e={s:S.season,r:S.round,text,why,num};S.log.push(e);S.mlog.push(e)}
function memo(pid,v,txt){P(pid).mem.push({s:S.season,club:S.my,v,txt})}
function meet(pid){const p=P(pid);if(p.loy!=null)return;const ms=p.mem.reduce((a,m)=>a+m.v*(p.traits.includes('resentful')&&m.v<0?2:1),0);p.loy=clamp(5+clamp(ms,-3,3)+clamp(Math.round(S.rep/2),-2,2),1,8)}
function traitMul(kind,tr){let m=1;const has=t=>tr.includes(t);
  if(kind==='protect'&&has('loyal'))m*=1.5; if(kind==='wish'&&has('ambitious'))m*=1.5;
  if(kind==='against'&&has('stubborn'))m*=2; if(kind==='bypass'&&has('proud'))m*=1.5; if(kind==='blame'&&has('honest'))m*=.5;
  if((kind==='blame'||kind==='wait'||kind==='bypass')&&has('resentful'))m*=1.5; if(kind==='wait'&&has('proud'))m*=1.5;
  if(kind==='admit'&&has('proud'))m*=2; if(kind==='admit'&&has('sly'))m*=0; if(kind==='publicOffer'&&has('vain'))m*=1.5; return m}
const KIND={protect:2,wish:1,against:-1,bypass:-2,blame:-3,deep:3,wait:-1,admit:1,publicOffer:1};
function loy(pid,kind,why,o={}){
  const p=P(pid);if(!p)return;meet(pid);
  let v=o.raw!=null?o.raw:KIND[kind]*traitMul(kind,p.traits);
  if(o.stake&&o.raw==null&&v>0){if(STRONG[p.value].includes(o.stake))v*=2;else if(WEAK[p.value].includes(o.stake))v*=.5}
  v=Math.round(v*10)/10;const before=p.loy;p.loy=clamp(p.loy+v,0,10);
  if(before<8&&p.loy>=8){p.owes=true;S.cross.push({id:pid,dir:'up'})}
  if(before>=8&&p.loy<8)p.owes=false;
  if(before>=4&&p.loy<4&&!p.withOpp)S.cross.push({id:pid,dir:'down'});
  log(`${p.name}: ${band(before)} → ${band(p.loy)}`,why,(v>0?'+':'')+v);
  if(o.mem)memo(pid,o.mem[0],o.mem[1]);
  if(!o.noRipple&&Math.abs(v)>=1)for(const r of p.rel){const q=P(r.id);if(!q||q.club!==S.my||q.loy==null)continue;
    const d=r.type==='rivals'?-.5*Math.sign(v):.5*Math.sign(v);loy(r.id,null,`${q.name} hears how you treated ${p.name} (${r.type==='protégé'?'their mentor':r.type==='mentor'?'their protégé':r.type})`,{raw:d,noRipple:true})}
}
function grp(k,d,why){if(!d)return;const g=grpOf(k);if(!g)return;const b=g.mood;g.mood=clamp(b+d,0,100);if(k===weakestNow()&&d>0)S.served=true;log(`${gname(C(),k)}: ${moodWord(b)} → ${moodWord(g.mood)}`,why,(d>0?'+':'')+d)}
function weakestNow(){return S.oppGroup}
function cash(d,why){C().cash+=d;log(`Money: ${d>0?'+':'−'}£${Math.abs(d)}k`,why,null)}
function hasP(id){return S.promises.some(p=>p.id===id)}
function openP(id){return S.promises.find(p=>p.id===id&&p.st==='open')}
function addPromise(id,why){if(hasP(id))return;S.promises.push({id,st:'open'});log(`New promise: ${pdef(id).t}`,why,null)}
function breakPromise(id,why){const p=openP(id);if(!p)return;p.st='broken';S.rep--;log(`Promise broken: ${pdef(id).t}`,why,null)}
function comply(pid,against,useOwes){const p=P(pid);meet(pid);if(useOwes){p.owes=false;return'full'}if(!against)return p.loy>=2?'full':'refuse';return p.loy>=4?'half':'refuse'}
function cast(r){return C().cast[r]}
