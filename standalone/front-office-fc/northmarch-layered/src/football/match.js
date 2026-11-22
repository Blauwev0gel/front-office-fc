/* ================= Football: the match =================
   lambdas/pmf/xpts are the Northmarch match engine (Poisson goals). Strength now comes from each club's own
   squad (fit players, positions, form) plus a home edge from the ground (atmosphere, pitch). */
function lambdas(sa,sb,home){const d=(sa-sb)/20+(home?.15:-.15);return[Math.max(.4,1.35+.6*d),Math.max(.4,1.35-.6*d)]}
function pmf(l,k){let p=Math.exp(-l);for(let i=1;i<=k;i++)p*=l/i;return p}
function xpts(la,lb){let w=0,d=0;for(let i=0;i<=9;i++){const a=pmf(la,i);for(let j=0;j<=9;j++){const b=pmf(lb,j);if(i>j)w+=a*b;else if(i===j)d+=a*b}}return 3*w+d}
function teamStrength(id){return qualityToStr(squadQuality(S.squads[id]))}
function homeEdge(id){const sg=groundSignals(id);return sg.atmosphere*.12+(sg.pitch<1.5?-.6:0)}
const SCORE_W={GK:0,CB:.5,FB:.5,DM:.6,CM:1.4,AM:2.6,W:2.8,ST:5};
function scorerWeight(x){
  const role=x.p.style;
  return SCORE_W[x.slot]*x.p.q*(role==='finisher'?1.3:role==='poacher'?1.35:role==='creator'?.92:1);
}
function scorerFrom(xi){
  const tot=xi.reduce((a,x)=>a+scorerWeight(x),0);let r=rnd()*tot;
  for(const x of xi){r-=scorerWeight(x);if(r<=0)return x.p}
  return xi[xi.length-1].p;
}
function lineupStyle(xi){
  const count=style=>xi.filter(x=>x.p.style===style).length;
  const attack=clamp(1+count('finisher')*.015+count('poacher')*.012+count('creator')*.009,1,1.1);
  const defense=clamp(1-count('marker')*.013-count('anchor')*.014-count('organiser')*.01,.9,1);
  return{attack,defense};
}
function recentForm(id){
  const form=S.tbl?.[id]?.form||[];
  return clamp(1+form.reduce((sum,x)=>sum+(x==='W'?1:x==='L'?-1:0),0)*.008,.96,1.04);
}
function tacticalMatchup(h,a){
  const hs=coachOf(h)?.pro?.spec,as=coachOf(a)?.pro?.spec;
  // Styles are small modifiers, not a replacement for squad quality.
  const pressure=hs==='attacking'&&as==='defensive'?.94:hs==='defensive'&&as==='attacking'?1.06:1;
  const counter=as==='attacking'&&hs==='defensive'?.94:as==='defensive'&&hs==='attacking'?1.06:1;
  return[pressure,counter];
}
function playMatch(h,a,o={}){
  const xh=pickXI(S.squads[h]),xa=pickXI(S.squads[a]);
  const sh=teamStrength(h)+coachEdge(h)+(o.neutral?0:homeEdge(h)),sa=teamStrength(a)+coachEdge(a);
  const [lh0,la0]=lambdas(sh,sa,!o.neutral),ch=coachLambda(h),ca=coachLambda(a),tm=tacticalMatchup(h,a),hs=lineupStyle(xh),as=lineupStyle(xa),lh=lh0*ch[0]*ca[1]*tm[0]*hs.attack*as.defense*recentForm(h),la=la0*ca[0]*ch[1]*tm[1]*as.attack*hs.defense*recentForm(a);
  const gh=pois(lh,rnd),ga=pois(la,rnd),scorers=[];
  for(const [xi,n,side] of [[xh,gh,'h'],[xa,ga,'a']]){
    for(const x of xi){x.p.apps++;if(o.comp==='cup')x.p.cupApps=(x.p.cupApps||0)+1;else x.p.sApps++}
    for(let i=0;i<n&&xi.length;i++){const p=scorerFrom(xi);p.goals++;if(o.comp==='cup')p.cupGoals=(p.cupGoals||0)+1;else p.sGoals++;scorers.push({side,pid:p.id,name:p.name})}}
  return{xiH:xh.map(x=>x.p.id),xiA:xa.map(x=>x.p.id),comp:o.comp||'league',tier:o.tier,round:o.round,h,a,gh,ga,sh:r1(sh),sa:r1(sa),lh:r2(lh),la:r2(la),xh:r2(xpts(lh,la)),xa:r2(xpts(la,lh)),scorers,styles:{home:hs,away:as},neutral:!!o.neutral};
}
