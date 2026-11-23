/* ---- world/league.js ---- */
/* ================= World: divisions, fixtures, tables, promotion and the cup =================
   Owns S.fx, S.tbl, S.cup and S.matches (this week's results). Three divisions of 16 (decision D3):
   30 league weeks, two up and two down between each pair of divisions, and a knock-out cup in six rounds.
   makeFixtures/standings are the Northmarch functions. */
const SEASON_WEEKS=30;
const CUP_WEEKS=[2,4,9,14,19,24,28];
const CUP_ROUND=['Preliminary round','First round','Second round','Third round','Quarter-final','Semi-final','Final'];
const CUP_PRIZE=[.5,1.5,3,6,10,16,30];

/* circle method (from Northmarch), with home and away balanced per club: whoever has been away longest, or at home least, plays at home.
   The Northmarch original alternated by position, which gave clubs runs of up to fifteen away games. Max run now 3. */
function makeFixtures(ids){
  const a=shuffle(ids.slice()),n=a.length,first=[],h={},st={};let arr=a.slice();for(const t of a){h[t]=0;st[t]=0}
  for(let r=0;r<n-1;r++){const m=[];for(let i=0;i<n/2;i++){const x=arr[i],y=arr[n-1-i];
      const homeX=st[x]!==st[y]?st[x]<st[y]:h[x]!==h[y]?h[x]<h[y]:(r+i)%2===0;
      const [hh,aa]=homeX?[x,y]:[y,x];m.push([hh,aa]);h[hh]++;st[hh]=st[hh]>0?st[hh]+1:1;st[aa]=st[aa]<0?st[aa]-1:-1}
    first.push(m);arr=[arr[0],arr[n-1],...arr.slice(1,n-1)]}
  return first.concat(first.map(rd=>rd.map(([x,y])=>[y,x])));
}
function tierIds(tier){return Object.keys(S.clubs).filter(i=>CL(i).tier===tier)}
function startSeason(){
  S.tbl={};S.fx={};
  for(const tier of TIERS){const ids=tierIds(tier);S.fx[tier]=makeFixtures(ids);
    const byStr=ids.slice().sort((x,y)=>teamStrength(y)-teamStrength(x));byStr.forEach((id,i)=>CL(id).expect=i+1);
    ids.forEach(id=>S.tbl[id]={p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,ded:0,form:[]});}
  S.week=0;S.matches=[];
  S.cup={round:0,alive:tierIds(3).concat(tierIds(4)),ties:[],winner:null,log:[]};
  cupDraw();
  foreignStartSeason();
  setGoalsAll();
}
function standings(tier){return Object.keys(S.tbl).filter(i=>CL(i).tier===tier).sort((x,y)=>{const a=S.tbl[x],b=S.tbl[y];return b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||(x<y?-1:1)})}
function posOf(id){return standings(CL(id).tier).indexOf(id)+1}
function ppg(id){const t=S.tbl[id];return t&&t.p?t.pts/t.p:1.35}
function rec(id,f,a){const t=S.tbl[id];t.p++;t.gf+=f;t.ga+=a;const r=f>a?'W':f===a?'D':'L';if(r==='W'){t.w++;t.pts+=3}else if(r==='D'){t.d++;t.pts++}else t.l++;t.form.push(r);if(t.form.length>5)t.form.shift()}
function fixtureOf(id,w){const tier=CL(id).tier,rd=S.fx[tier]&&S.fx[tier][w-1];if(!rd)return null;const m=rd.find(([h,a])=>h===id||a===id);return m?{h:m[0],a:m[1],home:m[0]===id,opp:m[0]===id?m[1]:m[0]}:null}
function cupTieOf(id){if(!S.cup||S.cup.round>=CUP_WEEKS.length)return null;const t=S.cup.ties.find(x=>x.h===id||x.a===id);return t||null}
function nextCupWeek(){return CUP_WEEKS[S.cup.round]}

/* ----- this week's games: league round + cup round. Strength comes from the squads (football/match.js) ----- */
function playWeekMatches(w){
  const out=[];
  for(const tier of TIERS)for(const [h,a] of S.fx[tier][w-1]){const m=playMatch(h,a,{comp:'league',tier});rec(h,m.gh,m.ga);rec(a,m.ga,m.gh);matchAftermath(m);out.push(m)}
  if(CUP_WEEKS[S.cup.round]===w)out.push(...playCupRound());
  S.matches=out;
  for(const m of out){
    const nm=`${CL(m.h).name} ${m.gh}–${m.ga} ${CL(m.a).name}${m.pens?` (${CL(m.pens).name} win on penalties)`:''}`;
    emit('Match',m.h,nm,{c2:m.a,comp:m.comp,gh:m.gh,ga:m.ga,scorers:m.scorers,round:m.round});
  }
  return out;
}
function cupDraw(){
  const cup=S.cup;if(cup.winner)return;if(cup.round===1)cup.alive=cup.alive.concat(cup.legacy?tierIds(0):tierIds(0).concat(tierIds(1),tierIds(2)));
  const a=shuffle(cup.alive.slice());cup.ties=[];
  for(let i=0;i+1<a.length;i+=2)cup.ties.push({h:a[i],a:a[i+1]});
}
function playCupRound(){
  const cup=S.cup,r=cup.round,out=[],won=[];
  for(const t of cup.ties){
    const final=r===CUP_WEEKS.length-1;
    const m=playMatch(t.h,t.a,{comp:'cup',round:r,neutral:final});matchAftermath(m);
    let w=m.gh>m.ga?t.h:m.ga>m.gh?t.a:null;
    if(!w){const p=.5+(m.sh-m.sa)*.01;w=rnd()<p?t.h:t.a;m.pens=w}
    m.winner=w;won.push(w);out.push(m);
    const lose=w===t.h?t.a:t.h;
    bookCupPrize(w,CUP_PRIZE[r],r);if(final)bookCupPrize(lose,CUP_PRIZE[r]/2,r);
    cup.log.push({r,h:t.h,a:t.a,gh:m.gh,ga:m.ga,w});
  }
  cup.round++;cup.alive=won;
  if(won.length===1){cup.winner=won[0];cup.round=CUP_WEEKS.length;cup.ties=[];emit('CupWon',won[0],`${CL(won[0]).name} win ${CUP_NAME}.`)}
  else if(won.length>1)cupDraw();
  else throw new Error('National cup produced no winners');
  return out;
}

/* ----- end of the league: two up, two down between each pair of divisions ----- */
function promoteRelegate(){
  const tables=TIERS.map(t=>standings(t)),moves=[];
  for(let t=0;t<TIERS.length-1;t++){
    const down=tables[t].slice(-2),up=tables[t+1].slice(0,2);
    down.forEach(i=>{CL(i).tier=t+1;moves.push({id:i,from:t,to:t+1});emit('Relegated',i,`${CL(i).name} are relegated to ${TIER_NAME[t+1]}.`)});
    up.forEach(i=>{CL(i).tier=t;moves.push({id:i,from:t+1,to:t});emit('Promoted',i,`${CL(i).name} are promoted to ${TIER_NAME[t]}.`)});
  }
  return moves;
}

