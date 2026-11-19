/* ================= Football ================= */
function lambdas(sa,sb,home){const d=(sa-sb)/20+(home?.15:-.15);return[Math.max(.4,1.35+.6*d),Math.max(.4,1.35-.6*d)]}
function pmf(l,k){let p=Math.exp(-l);for(let i=1;i<=k;i++)p*=l/i;return p}
function xpts(la,lb){let w=0,d=0;for(let i=0;i<=9;i++){const a=pmf(la,i);for(let j=0;j<=9;j++){const b=pmf(lb,j);if(i>j)w+=a*b;else if(i===j)d+=a*b}}return 3*w+d}
function myStr(r,home,opp){const c=C();let s=S.cf?cfStrength(S.youth):c.str;for(const m of S.mods)if(m.from<=r&&m.until>=r)s+=m.v;if(opp===c.rival&&home&&S.flags.derbyCrowd)s+=2;return s}
function addMod(key,v,until,from){S.mods.push({key,v,until,from:from??S.round+1})}
function nextBlockEnd(r){return BLOCK_ENDS.find(e=>e>=r)??30}
function rec(id,f,a){const t=S.tbl[id];t.p++;t.gf+=f;t.ga+=a;if(f>a){t.w++;t.pts+=3}else if(f===a){t.d++;t.pts++}else t.l++}
function simRound(r){
  let mine=null;if(S.cf)C().str=cfStrength(0);
  for(const tier of [0,1])for(const [h,a] of S.fx[tier][r-1]){
    const sh=h===S.my?myStr(r,true,a):CL(h).str,sa=a===S.my?myStr(r,false,h):CL(a).str;
    const [lh,la]=lambdas(sh,sa,true);const gh=pois(lh,rnd),ga=pois(la,rnd);rec(h,gh,ga);rec(a,ga,gh);
    if(h===S.my||a===S.my){const home=h===S.my,gf=home?gh:ga,gag=home?ga:gh,opp=home?a:h;const xp=home?xpts(lh,la):xpts(la,lh);const pts=gf>gag?3:gf===gag?1:0;
      S.realPts+=pts;S.xPts+=xp;if(opp===C().rival)S.derbyPts+=pts;
      mine={r,opp,home,gf,ga:gag,pts,derby:opp===C().rival,xf:home?lh:la,xa:home?la:lh,scorers:[],why:[]};
      if(S.cf)matchDetail(mine);}
  }
  return mine;
}
function standings(tier){return Object.keys(S.tbl).filter(i=>CL(i).tier===tier).sort((x,y)=>{const a=S.tbl[x],b=S.tbl[y];return b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf})}
function posOf(id){return standings(CL(id).tier).indexOf(id)+1}
function myPos(){return posOf(S.my)}
function luck(){const d=S.realPts-S.xPts;return d<=-4?'unlucky':d>=4?'lucky':'fair'}
function luckWord(){return{unlucky:'Unlucky: we deserved more',lucky:'Lucky: we got more than we deserved',fair:'About what we deserved'}[luck()]}
function computeChances(){
  if(S.cf)C().str=cfStrength(0);const r=mkRng(S.seed^(S.season*7919)),N=150,c=C(),tier=c.tier,ids=Object.keys(S.clubs).filter(i=>CL(i).tier===tier),cnt={survive:0,topHalf:0,promo:0,derby:0,goals:0};
  for(let s=0;s<N;s++){const tb={};ids.forEach(i=>tb[i]={pts:0,gd:0,gf:0});let dp=0;
    for(const rd of S.fx[tier])for(const [h,a] of rd){const [lh,la]=lambdas(CL(h).str,CL(a).str,true);const gh=pois(lh,r),ga=pois(la,r);const ph=gh>ga?3:gh===ga?1:0,pa=ga>gh?3:gh===ga?1:0;
      tb[h].pts+=ph;tb[a].pts+=pa;tb[h].gd+=gh-ga;tb[a].gd+=ga-gh;tb[h].gf+=gh;tb[a].gf+=ga;if(h===c.id&&a===c.rival)dp+=ph;if(a===c.id&&h===c.rival)dp+=pa}
    const o=ids.slice().sort((x,y)=>tb[y].pts-tb[x].pts||tb[y].gd-tb[x].gd);const p=o.indexOf(c.id)+1;
    if(p<=14)cnt.survive++;if(p<=8)cnt.topHalf++;if(p<=2)cnt.promo++;if(dp>=4)cnt.derby++;if(tb[c.id].gf>=42)cnt.goals++;}
  const out={};for(const k in cnt)out[k]=cnt[k]/N;return out;
}
function chanceWord(p){return p<.12?'Long shot':p<.35?'Unlikely':p<.6?'Coin toss':p<.85?'Likely':'Near certain'}

/* the squad behind the result: who played, who scored, and two lines of why */
function matchDetail(m){
  const xi=pickXI(S.cf.squad,S.youth),c=C();
  for(const x of xi){x.p.apps++;if(x.p.academy&&x.p.apps===1)S.debuts++;if(S.cf.talentPid===x.p.id)S.talentStarts++}
  const w={ST:4,W:3,AM:3,CM:1.2,DM:.5,FB:.4,CB:.5,GK:0};
  const scP=[];for(let g=0;g<m.gf;g++){let tot=0;for(const x of xi)tot+=(w[x.slot]||0)*x.p.q;let r=rnd()*tot,sc=xi[0].p;for(const x of xi){r-=(w[x.slot]||0)*x.p.q;if(r<=0){sc=x.p;break}}sc.goals++;sc.sGoals++;scP.push(sc);m.scorers.push(sc.name.split(' ').slice(-1)[0])}
  const mins=scP.map(()=>ri(3,90)).sort((a,b)=>a-b);m.goals=scP.map((p,i)=>({id:p.id,name:p.name,min:mins[i]}));m.xiIds=xi.map(x=>x.p.id);
  const gk=xi.find(x=>x.slot==='GK');if(gk&&m.ga===0&&m.xa>1.1)m.save={id:gk.p.id,name:gk.p.name};
  if(m.ga>=3){const df=xi.filter(x=>['CB','FB'].includes(x.slot));if(df.length)m.error={id:df[0].p.id,name:fv?df[Math.floor(rnd()*df.length)].p.name:df[0].p.name}}
  storiesAfterMatch(m,xi,scP);m.moments=S.cf.events.filter(e=>e.kind==='story'&&e.w===S.week&&e.s===S.season&&['debut','firstGoal','hundred','comeback','winner'].includes(e.sk)).map(e=>e.text);
  const why=[],oop=xi.filter(x=>x.p.pos!==x.slot),injKey=S.cf.squad.filter(p=>p.inj>0&&p.q>=12),opp=CL(m.opp);
  if(m.pts<3&&oop.length)why.push(`${oop[0].p.name} played ${POS_ONE[oop[0].slot]} out of position${oop.length>1?`, and ${oop.length-1} more were out of place`:''}.`);
  if(m.pts<3&&injKey.length)why.push(`We missed ${injKey[0].name}${injKey.length>1?' and '+injKey[1].name:''} through injury.`);
  if(m.gf+.8<m.xf)why.push('We created enough. The finishing let us down.');
  if(m.gf>m.xf+1.2)why.push('We scored more than our chances deserved.');
  if(m.xa>m.xf+.5&&m.pts<3)why.push(`${opp.name} were simply the stronger side.`);
  if(m.xf>m.xa+.5&&m.pts===3)why.push(`We were the better side and it showed.`);
  if(m.derby&&m.home&&S.flags.derbyCrowd)why.push('The crowd carried us through the derby.');
  if(S.youth&&xi.some(x=>x.p.age<=21))why.push(`The youngsters started: ${xi.filter(x=>x.p.age<=21).map(x=>x.p.name.split(' ').slice(-1)[0]).slice(0,3).join(', ')}.`);
  if(!why.length)why.push(m.pts===3?'A solid team performance.':m.pts===1?'An even game.':'A bad day at the office.');
  m.why=why.slice(0,2);m.xi=xi.map(x=>({n:x.p.name,slot:x.slot,oop:x.p.pos!==x.slot}));
}
