/* ================= Football: the market =================
   Free agents (S.fa, idea from voorzitter-fundering club/market.js), renewals, transfers between clubs and forced
   sales. squadManager() is the rule-based director of football that runs every club's squad within the club's
   policy (wage ratio, share of spare cash). It is the standard executor for the player's club too, until staff
   agents arrive in layer 3 (voorzitter-fundering td.js/summer.js are the candidates for that). */
const FA_MAX=90;

function faNew(n){
  // new faces come from below Northmarch Two (local leagues, abroad): mostly weaker; good free agents are players clubs let go
  for(let i=0;i<n;i++){const age=ri(19,33),base=11.5+(tierBaseStr(2)-50)/4+(S.qref-11.7);
    const p=newPlayer(pick(POS),{age,q:base-1.8+rnd()*2+(rnd()<.1?1.2:0)-(age>=31?.5:0),contract:0});p.why=pick(['released in the summer','out of contract','back from a spell abroad','released after a long injury','left a club that went part-time']);S.fa.push(p)}
}
function faInit(){S.fa=[];faNew(60)}
function faAdd(p,why,from){p.left={club:from||p.club,s:S.season};p.club=null;p.why=why;p.contract=0;p.inj=0;S.fa.push(p)}
function faSummer(){
  S.fa=S.fa.filter(p=>p.age<35);for(const p of S.fa)p.age++;
  S.fa.sort((a,b)=>b.q-a.q);if(S.fa.length>FA_MAX)S.fa.length=FA_MAX;
  faNew(Math.max(10,70-S.fa.length));
}

/* the value a club puts on a player it owns: its best eleven are not for sale cheaply */
function isCore(id,p){const xi=pickXI(S.squads[id]);return xi.some(x=>x.p===p)}
function moveWage(p,toId){return Math.round(wageFor(p.q)*(0.95+rnd()*.25)/5)*5}
function transfer(p,from,to,fee,why,premium){
  const sq=S.squads[from];sq.splice(sq.indexOf(p),1);
  if(fee){book(to,'feesOut',-fee);book(from,'feesIn',fee)}
  p.wage=Math.round(moveWage(p,to)*(premium?1.3:1)/5)*5;p.contract=ri(2,3);p.club=to;p.joined=S.season;S.squads[to].push(p);
  emit('Transfer',to,`${p.name} joins ${CL(to).name} from ${CL(from).name}${fee?` for £${fee}k`:''}.`,{c2:from,pid:p.id,fee,why});
}
function signFree(p,to){S.fa.splice(S.fa.indexOf(p),1);p.wage=moveWage(p,to);p.contract=ri(1,2);p.club=to;p.joined=S.season;S.squads[to].push(p);
  emit('Signing',to,`${CL(to).name} sign free agent ${p.name} (${POS_ONE[p.pos]}).`,{pid:p.id})}
/* releasing a player costs a quarter of what is left on his contract */
function releaseCost(p){return r1(p.wage*SEASON_WEEKS*Math.max(0,p.contract)/1000*.25)}
function release(id,p,why){const sq=S.squads[id];const pay=releaseCost(p);if(pay)book(id,'wages',-pay);sq.splice(sq.indexOf(p),1);faAdd(p,why||'released',id);if(id===S.my)emit('Released',id,`${p.name} is released.`,{pid:p.id})}

/* the players a club's director can see: free agents and players at other clubs, wider with a better scouting office */
function scoutPool(id,pos,n){
  const reach=Math.max(4,6+Math.round(2*groundSignals(id).scouting+(pq(tdOf(id))-10)/2)),out=[];
  const fa=S.fa.filter(p=>(!pos||p.pos===pos)&&!(p.left&&p.left.club===id&&p.left.s>=S.season-1)); // a player who just left does not come backfor(const p of pickN(fa,Math.ceil(reach*.6)))out.push({p,from:null});
  const others=Object.keys(S.clubs).filter(i=>i!==id&&Math.abs(CL(i).tier-CL(id).tier)<=1);
  for(let k=0;k<reach&&others.length;k++){const o=pick(others),c=S.squads[o].filter(p=>(!pos||p.pos===pos)&&p.inj<=0&&!p.loan);if(c.length){const p=pick(c);out.push({p,from:o,premium:CL(o).rep>CL(id).rep+15&&!p.wantsOut})} /* stepping down to a smaller club costs a wage premium */}
  // Keep a compact record of candidates the director actually encountered.
  // This is evidence of a search, not a promise of a signing or a scout assignment.
  if(id===S.my){
    const st=S.stats[id],history=st.scoutHistory||(st.scoutHistory=[]);
    const found=out.slice(0,n||99);
    history.push({season:S.season,week:S.week,pos:pos||'any',director:tdOf(id).name,
      candidates:found.slice(0,16).map(c=>({pid:c.p.id,name:c.p.name,pos:c.p.pos,age:c.p.age,from:c.from?CL(c.from).name:'Free agent',quality:r1(c.p.q)}))});
    if(history.length>12)history.splice(0,history.length-12);
  }
  return out.slice(0,n||99);
}
function askingFee(p,from){const v=playerValue(p);return Math.round(v*(isCore(from,p)&&!p.wantsOut?1.6:1)*(F(from).cash<0?.75:1)*(p.wantsOut?.85:1))}
function sellerAgrees(p,from,fee){
  if(S.squads[from].length<=SQUAD_MIN)return false;
  const need=S.squads[from].filter(x=>x.pos===p.pos).length<=REQ[p.pos];
  if(need&&F(from).cash>=0&&!p.wantsOut)return false;
  if(from===S.my&&!S.auto)return fee>=playerValue(p)*1.5&&!isCore(from,p); // the player's director only sells surplus at a premium
  return fee>=askingFee(p,from)*.85;
}
function budgetFor(id){const f=F(id),reserve=wageBillK(id)*6;return Math.max(0,Math.round((f.cash-reserve)*f.policy.spend))}

/* buy the best affordable player for a position. Returns true if someone signed */
function shopFor(id,pos,minQ,o={}){
  const cap=wageCapK(id),bill=wageBillK(id);let budget=o.budget??budgetFor(id);
  let best=null,bv=-1;
  for(const c of scoutPool(id,pos)){
    const p=c.p,seen=p.q+(rnd()+rnd()-1)*2.5*tdNoise(id);if(seen<minQ)continue; // the director judges by eye: a weak eye is fooled more often
    const fee=c.from?Math.round(askingFee(p,c.from)*tdBuyF(id)):0,wage=wageFor(p.q)/1000*(c.premium?1.3:1);
    if(fee>budget)continue;if(bill+wage>cap&&!o.mustHave)continue;
    if(c.from&&!sellerAgrees(p,c.from,fee))continue;
    const v=o.mustHave?-wage*1000-fee:seen+(p.age<=24?(p.pa-p.q)*.18:0)-(p.age>=32?.4:0)-fee/200+(tdYouth(id)&&p.age<=21?.5:0);
    if(v>bv){bv=v;best={...c,fee}}
  }
  if(!best&&o.mustHave){const base=11.5+(tierBaseStr(2)-50)/4+(S.qref-11.7),p=newPlayer(pos,{age:ri(19,30),q:base-2+rnd()*1.2,contract:0});
    p.why='a trialist from the local leagues';S.fa.push(p);best={p,from:null,fee:0}}
  if(!best)return false;
  if(!o.mustHave&&minQ>0){const st=S.stats[id];st.buys=(st.buys||0)+1;if(best.p.q<minQ)st.misbuys=(st.misbuys||0)+1;st.spent=r1((st.spent||0)+best.fee)} // a signing that is not what the director thought
  if(best.from)transfer(best.p,best.from,id,best.fee,'buy',best.premium);else signFree(best.p,id);
  return best;
}
/* the director's work in a window: fill holes, upgrade the weakest starter, trim the squad to the wage cap */
function squadManager(id,phase){
  const sq=S.squads[id];
  // over the wage cap or too big: let the least useful players go
  const trim=()=>{const cap=wageCapK(id);let guard=14;
    while(guard-->0){const bill=wageBillK(id),crisis=bill>cap*1.15;
      if(!(sq.length>SQUAD_MAX||(bill>cap*1.05&&sq.length>SQUAD_MIN)))break;
      const xi=pickXI(sq).map(x=>x.p);
      const pool=sq.filter(p=>!p.loan&&(crisis||!xi.includes(p))&&!(p.age<=20&&p.pa>p.q+1.5));
      const p=pool.sort((a,b)=>crisis?(b.wage/Math.max(1,b.q)-a.wage/Math.max(1,a.q)):(a.q-a.wage/400)-(b.q-b.wage/400))[0];if(!p)break;
      const fee=playerValue(p),buyers=Object.keys(S.clubs).filter(i=>i!==id&&budgetFor(i)>=fee&&wageBillK(i)+wageFor(p.q)/1000<=wageCapK(i)&&S.squads[i].length<SQUAD_MAX);
      if(buyers.length)transfer(p,id,pick(buyers),fee,'surplus');
      else if(!xi.includes(p)||sq.length>SQUAD_MIN+3)release(id,p,'released to cut the wage bill');else break}};
  trim();
  // players who asked to leave are sold if someone pays a fair price
  for(const p of sq.filter(x=>x.wantsOut&&!x.loan)){const fee=Math.round(playerValue(p)*.9),buyers=Object.keys(S.clubs).filter(i=>i!==id&&budgetFor(i)>=fee&&wageBillK(i)+wageFor(p.q)/1000<=wageCapK(i)&&S.squads[i].length<SQUAD_MAX&&CL(i).rep>=CL(id).rep-10);
    if(buyers.length&&sq.length>SQUAD_MIN){p.wantsOut=false;p.morale=70;transfer(p,id,pick(buyers),fee,'request')}}
  // holes: below the minimum per position (in winter only real emergencies: injuries leave the position bare)
  for(const pos of POS){let guard=3;const have=()=>phase==='winter'?available(sq).filter(p=>p.pos===pos).length+1:sq.filter(p=>p.pos===pos).length;
    while(guard-->0&&have()<REQ[pos]){const base=squadQuality(sq);if(!shopFor(id,pos,base-2.5)&&!shopFor(id,pos,0,{mustHave:true,budget:0}))break}}
  // upgrades: replace the weakest starter if a clearly better player is within reach
  // more money buys more attempts: a rich director keeps looking for upgrades
  if(phase==='summer'){const tries=clamp(Math.round(2+budgetFor(id)/60),3,6);for(let k=0;k<tries;k++){const xi=pickXI(sq);if(!xi.length)break;const worst=xi.slice().sort((a,b)=>a.p.q-b.p.q)[0];
    const got=shopFor(id,worst.slot,worst.p.q+(budgetFor(id)>150?.6:.8));if(!got)break}}
  while(sq.length<SQUAD_MIN){if(!shopFor(id,pick(POS),0,{mustHave:true,budget:0}))break}
  trim();
}
/* renewals in the spring: keep the players worth keeping within the wage cap */
function renewals(id){
  const sq=S.squads[id],med=sq.map(p=>p.q).sort((a,b)=>a-b)[Math.floor(sq.length/2)];
  for(const p of sq.filter(x=>x.contract===1).sort((a,b)=>b.q-a.q)){
    const short=sq.filter(x=>x.contract>1).length<22;
    const want=(p.q>=med-.3||(p.age<=22&&p.pa>med)||short)&&p.age<34;
    if(!want||p.loan)continue;
    // contract talks: the player names his price; the director offers what the wage limit allows
    const demand=wageDemand(p,med),room=(wageCapK(id)*1.05-wageBillK(id))*1000+p.wage,offer=Math.min(demand,Math.round(room/5)*5);
    if(p.wantsOut||offer<demand*.9){p.morale=clamp(p.morale-10,0,100);if(id===S.my)emit('RefusedContract',id,`${p.name} turns down a new contract${p.wantsOut?': he wants to leave':` (he asked £${demand} a week, the wage limit allows £${Math.max(0,offer)})`}. He can leave in the summer.`,{pid:p.id,demand});continue}
    p.wage=offer;p.contract=ri(2,3);p.morale=clamp(p.morale+8,0,100);if(id===S.my)emit('Renewed',id,`${p.name} signs a new ${p.contract}-year contract (£${p.wage} a week).`,{pid:p.id})
  }
}
/* the bank wants cash: sell the most valuable player who fetches a fee */
function forcedSale(id){
  const sq=S.squads[id];if(sq.length<=SQUAD_MIN)return;
  const p=sq.filter(x=>!x.loan).sort((a,b)=>playerValue(b)-playerValue(a))[0];if(!p)return;
  const fee=Math.round(playerValue(p)*.8);
  const buyers=Object.keys(S.clubs).filter(i=>i!==id&&F(i).cash>fee+wageBillK(i)*4&&S.squads[i].length<SQUAD_MAX).sort((a,b)=>F(b).cash-F(a).cash);
  if(buyers.length){transfer(p,id,buyers[0],fee,'forced');emit('ForcedSale',id,`${CL(id).name} must sell ${p.name} to ${CL(buyers[0]).name} for £${fee}k.`,{pid:p.id})}
}
defCommand('ReleasePlayer',{who:['player','td'],check:(id,a)=>{const p=S.squads[id].find(x=>x.id===a.pid);if(!p)return'Not in the squad';if(p.loan)return'He is here on loan';if(S.squads[id].length<=SQUAD_MIN)return`The squad needs at least ${SQUAD_MIN} players`;return null},
  run:(id,a)=>{const p=S.squads[id].find(x=>x.id===a.pid);const pay=releaseCost(p);release(id,p,'released by the club');return pay}});
