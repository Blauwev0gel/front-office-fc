/* ================= Football: the market =================
   Free agents (S.fa, idea from voorzitter-fundering club/market.js), renewals, transfers between clubs and forced
   sales. squadManager() is the rule-based director of football that runs every club's squad within the club's
   policy (wage ratio, share of spare cash). It is the standard executor for the player's club too, until staff
   agents arrive in layer 3 (voorzitter-fundering td.js/summer.js are the candidates for that). */
const FA_MAX=90;

function faNew(n){
  // new faces come from below Northmarch Two (local leagues, abroad): mostly weaker; good free agents are players clubs let go
  for(let i=0;i<n;i++){const age=ri(19,33),base=11.5+(tierBaseStr(2)-50)/4 /* fixed level: new faces from below Northmarch Two do not grow with the world (T2) */;
    const country=rnd()<.16?pick(FOREIGN_COUNTRIES)[0]:null;
    const p=newPlayer(pick(POS),{age,q:base-1.8+rnd()*2+(rnd()<.1?1.2:0)-(age>=31?.5:0),contract:0,
      nationality:country||'nmr',name:country?foreignName(country):undefined});p.faEntered={s:S.season,w:S.week};p.why=pick(['released in the summer','out of contract','back from a spell abroad','released after a long injury','left a club that went part-time']);S.fa.push(p)}
}
function faInit(){S.fa=[];faNew(60)}
function faAdd(p,why,from){p.left={club:from||p.club,s:S.season};p.faEntered={s:S.season,w:S.week};p.club=null;p.why=why;p.contract=0;p.inj=0;S.fa.push(p)}
function faSummer(){
  // Players released during this same season-end have already aged in their club.
  for(const p of S.fa)if(!p.faEntered||p.faEntered.s<S.season||p.faEntered.w<SEASON_WEEKS)p.age++;
  S.fa=S.fa.filter(p=>p.age<35);
  S.fa.sort((a,b)=>b.q-a.q);if(S.fa.length>FA_MAX)S.fa.length=FA_MAX;
  faNew(Math.max(10,70-S.fa.length));
}

/* the value a club puts on a player it owns: its best eleven are not for sale cheaply */
function isCore(id,p){const xi=pickXI(S.squads[id]);return xi.some(x=>x.p===p)}
function marketClubName(id){return S.clubs[id]?.name||S.foreign?.clubs?.[id]?.name||id}
function foreignSeller(id){return !!(S.foreign&&S.foreign.clubs[id])}
/* richer divisions pay more for the same player (NM-012): the market sets the wage, and the market is the division */
const DIV_WAGE=[1.35,1.1,1,.92,.85];
function clubWageF(id){const c=S.clubs[id];return c?DIV_WAGE[c.tier]??1:1}
function moveWage(p,toId){return Math.round(wageFor(p.q)*clubWageF(toId)*(0.95+rnd()*.25)/5)*5}
function transfer(p,from,to,fee,why,premium){
  const sq=S.squads[from];playerCloseStint(p,from);sq.splice(sq.indexOf(p),1);if(from===S.my)youthLeft(p,'sold',to,fee);
  if(fee){book(to,'feesOut',-fee);book(from,'feesIn',fee)}
  p.history=p.history||[];p.history.push({season:S.season,week:S.week,type:'transfer',from,to,fee});
  p.wage=Math.round(moveWage(p,to)*(premium?1.3:1)/5)*5;p.contract=ri(2,3);p.club=to;p.joined=S.season;S.squads[to].push(p);
  emit('Transfer',to,`${p.name} joins ${CL(to).name} from ${CL(from).name}${fee?` for £${fee}k`:''}.`,{c2:from,pid:p.id,fee,why});
  if(typeof mbRecord==='function')mbRecord(p,from,to,fee);
}
function signFree(p,to){S.fa.splice(S.fa.indexOf(p),1);p.history=p.history||[];p.history.push({season:S.season,week:S.week,type:'free',to});p.wage=moveWage(p,to);p.contract=ri(1,2);p.club=to;p.joined=S.season;S.squads[to].push(p);
  emit('Signing',to,`${CL(to).name} sign free agent ${p.name} (${POS_ONE[p.pos]}).`,{pid:p.id});if(typeof mbRecord==='function')mbRecord(p,null,to,0)}
/* releasing a player costs a quarter of what is left on his contract */
function releaseCost(p){return r1(p.wage*SEASON_WEEKS*Math.max(0,p.contract)/1000*.25)}
function release(id,p,why){const sq=S.squads[id];playerCloseStint(p,id);const pay=releaseCost(p);if(pay)book(id,'wages',-pay);sq.splice(sq.indexOf(p),1);youthLeft(p,'released');faAdd(p,why||'released',id);if(id===S.my&&typeof mbRecord==='function')mbRecord(p,id,null,0);if(id===S.my)emit('Released',id,`${p.name} is released.`,{pid:p.id})}

/* the players a club's director can see: free agents and players at other clubs, wider with a better scouting office */
function scoutPool(id,pos,n,quiet){
  const reach=Math.max(4,6+Math.round(2*groundSignals(id).scouting+(pq(tdOf(id))-10)/2)),out=[];
  const fa=S.fa.filter(p=>(!pos||p.pos===pos)&&!(p.left&&p.left.club===id&&p.left.s>=S.season-1)); // a player who just left does not come back
  for(const p of pickN(fa,Math.ceil(reach*.6)))out.push({p,from:null});
  const others=shuffle(Object.keys(S.clubs).filter(i=>i!==id&&aiMarketOpen(i)&&Math.abs(CL(i).tier-CL(id).tier)<=1)); // the chairman's players leave only through the chairman's window
  // Scout players a selling club could actually spare. Sampling random protected starters
  // produced reports that could never turn into transfers.
  const budget=budgetFor(id),cap=wageCapK(id),bill=wageBillK(id);
  let found=0;
  for(const o of others){
    if(found>=reach)break;
    const c=S.squads[o].filter(p=>(!pos||p.pos===pos)&&p.inj<=0&&!p.loan&&
      canSpare(S.squads[o],p,true)&&
      (p.wantsOut||S.squads[o].filter(x=>x.pos===p.pos&&!x.loan).length>REQ[p.pos]||F(o).cash<0)&&
      askingFee(p,o)*tdBuyF(id)*.85<=budget&&
      bill+wageFor(p.q)/1000*(CL(o).rep>CL(id).rep+15&&!p.wantsOut?1.3:1)<=cap);
    if(!c.length)continue;
    const p=pick(c);
    out.push({p,from:o,premium:CL(o).rep>CL(id).rep+15&&!p.wantsOut});
    found++;
  }
  // Overseas scouting is part of the same director search, fee and mandate.
  // Players at foreign clubs are persistent people, not one-off generated offers.
  if(S.foreign&&S.foreign.squads&&budget>0){
    const maxForeign=Math.max(1,Math.floor(reach*.45)),countries=shuffle(Object.keys(S.foreign.clubs));
    let abroad=0;
    for(const from of countries){
      if(abroad>=maxForeign)break;
      const sq=S.foreign.squads[from]||[];
      const options=sq.filter(p=>(!pos||p.pos===pos)&&p.inj<=0&&p.contract>0&&
        sq.filter(x=>x.pos===p.pos).length>REQ[p.pos]&&playerAcceptsMove(p,from,id)&&
        askingFee(p,from)*tdBuyF(id)*.85<=budget&&
        bill+wageFor(p.q)*1.2/1000<=cap);
      if(!options.length)continue;
      out.push({p:pick(options),from,premium:false,international:true});abroad++;
    }
  }
  // Keep a compact record of candidates the director actually encountered.
  // This is evidence of a search, not a promise of a signing or a scout assignment.
  if(id===S.my&&!quiet){
    const st=S.stats[id],history=st.scoutHistory||(st.scoutHistory=[]);
    const found=out.slice(0,n||99);
    history.push({season:S.season,week:S.week,pos:pos||'any',director:tdOf(id).name,
      candidates:found.slice(0,16).map(c=>({pid:c.p.id,name:c.p.name,pos:c.p.pos,age:c.p.age,from:c.from?marketClubName(c.from):'Free agent',quality:r1(c.p.q)}))});
    if(history.length>12)history.splice(0,history.length-12);
  }
  return out.slice(0,n||99);
}
function askingFee(p,from){
  const v=playerValue(p);
  if(foreignSeller(from))return Math.max(1,Math.round(v*1.15));
  return Math.round(v*(isCore(from,p)&&!p.wantsOut?1.6:1)*(F(from).cash<0?.75:1)*(p.wantsOut?.85:1));
}
function sellerAgrees(p,from,fee,to=null){
  if(foreignSeller(from)){
    const sq=S.foreign.squads[from];
    return !!sq&&sq.includes(p)&&sq.filter(x=>x.pos===p.pos).length>REQ[p.pos]&&(!to||playerAcceptsMove(p,from,to))&&fee>=askingFee(p,from)*.85;
  }
  if(S.squads[from].length<=SQUAD_MIN)return false;
  if(from===S.my&&!S._chairSale&&typeof topThree==='function'&&topThree(from).includes(p))return false; /* D-L3-2: a bid for one of the three best players goes to the chairman */
  const need=S.squads[from].filter(x=>x.pos===p.pos).length<=REQ[p.pos];
  if(need&&F(from).cash>=0&&!p.wantsOut)return false;
  if(!canSpare(S.squads[from],p,true))return false; /* even a club in need of cash keeps its last players in a position */
  if(from===S.my&&!S.auto)return fee>=playerValue(p)*1.5&&!isCore(from,p); // the player's director only sells surplus at a premium
  return fee>=askingFee(p,from)*.85;
}
function budgetFor(id){const f=F(id),wk=weekLines(id,false,{}),reserve=Math.max(wageBillK(id)*4,-sumLines(wk,-1)*4);return Math.max(0,Math.round((f.cash-reserve)*f.policy.spend))}

/* buy the best affordable player for a position. Returns true if someone signed */
function shopFor(id,pos,minQ,o={}){
  const cap=wageCapK(id),bill=wageBillK(id);let budget=o.budget??budgetFor(id);
  let best=null,bv=-Infinity;
  const pool=scoutPool(id,pos,undefined,o.dry),evaluated=[],capDeal=o.ignoreMandate?Infinity:featureRule('dealCap',id,Infinity); /* o.dry: look, do not sign (the director's proposals); o.ignoreMandate: ignore the deal limit */
  for(const c of shortlistCandidates(id,pos))if(!pool.some(x=>x.p===c.p))pool.unshift(c); // players the scouts have been watching come first
  for(const c of pool){
    const p=c.p,sl=c.listed?shortlistEntry(p.id):null,seen=sl&&sl.obs?sl.est:p.q+(rnd()+rnd()-1)*2.5*tdNoise(id)*reportNoise(id); // watched players are judged on the scouts' refined estimate
    const fee=c.from?Math.round(askingFee(p,c.from)*tdBuyF(id)):0,wage=wageFor(p.q)/1000*(c.premium?1.3:1);
    const cheap=wageFor(11.5+(tierBaseStr(2)-50)/4-1)/1000,coverOk=bill+wage<=cap||wage<=cheap; /* emergency cover: within the wage limit, or a cheap basic contract. A strict ceiling alone leaves a club on its limit with no way to field a squad */
    let reason=seen<minQ?'Below target':fee>budget?'Outside transfer budget':fee>capDeal&&!o.mustHave?'Above my mandate':bill+wage>cap&&(!o.mustHave||!coverOk)?'Outside wage limit':c.from&&!sellerAgrees(p,c.from,fee,id)?'Selling club unwilling':'Considered';
    if(reason==='Considered'){
      const st=(F(id).policy||{}).recruit,ageB=st==='youth'?(26-p.age)*40:st==='experience'?(p.age-26)*40:0; /* even the cheapest cover follows the director's profile: a youth-minded director takes the younger of two cheap players */
      const v0=o.mustHave?-wage*1000-fee+ageB:recruitValue(id,p,seen,fee,wage,sl),v=sl&&sl.chair&&!o.mustHave?v0+Math.abs(v0)*.25:v0; /* the director trusts what has been watched; a player the chairman recommended gets a quarter more weight */
      if(v>bv){bv=v;best={...c,fee,seen};}
    }
    if(id===S.my)evaluated.push({pid:p.id,name:p.name,pos:p.pos,age:p.age,from:c.from?marketClubName(c.from):'Free agent',estimate:r1(seen),fee,reason});
  }
  if(o.dry)return best;
  if(!best&&o.mustHave){const base=11.5+(tierBaseStr(2)-50)/4 /* fixed level: new faces from below Northmarch Two do not grow with the world (T2) */,p=newPlayer(pos,{age:ri(19,30),q:base-2+rnd()*1.2,contract:0});
    // A trialist is not a free escape hatch from the wage ceiling: if there is no room, the director cannot sign him.
    if(bill+wageFor(p.q)/1000<=cap||wageFor(p.q)/1000<=wageFor(11.5+(tierBaseStr(2)-50)/4-1)/1000){p.why='a trialist from the local leagues';S.fa.push(p);best={p,from:null,fee:0};}}
  if(id===S.my){
    const history=S.stats[id].scoutHistory||[];
    const h=history[history.length-1];
    if(h){
      h.target=r1(minQ);h.budget=budget;
      h.candidates=evaluated.slice(0,16);
      h.decision=best?{pid:best.p.id,name:best.p.name,fee:best.fee,reason:o.mustHave?'Emergency cover':'Highest-rated affordable option'}:{reason:'No suitable affordable candidate'};
      for(const c of h.candidates)if(best&&c.pid===best.p.id)c.reason='Selected';
    }
  }
  if(!best){recordDecision(id,pos,null,evaluated,o.mustHave);return false;}
  if(!o.mustHave&&minQ>0){const st=S.stats[id];st.buys=(st.buys||0)+1;if(best.p.q<minQ)st.misbuys=(st.misbuys||0)+1;st.spent=r1((st.spent||0)+best.fee)}
  if(best.from){
    if(foreignSeller(best.from)){
      if(!foreignMove(best.p,best.from,id,best.fee,'director scouting'))return false;
    }else transfer(best.p,best.from,id,best.fee,'buy',best.premium);
  }else signFree(best.p,id);
  // Review the real post-transfer squad, not the pre-signing snapshot.
  recordDecision(id,pos,best,evaluated,o.mustHave);
  return best;
}
/* the director's work in a window: fill holes, upgrade the weakest starter, trim the squad to the wage cap */
/* a player may only leave if his position stays covered: the full requirement normally, at least one (two keepers) in a wage crisis */
function canSpare(sq,p,crisis){const n=sq.filter(x=>x.pos===p.pos&&!x.loan).length;return n>(crisis?(p.pos==='GK'?2:1):REQ[p.pos])}
/* the player's club buys only through its own director in the window the chairman plays: other clubs' surplus sales and
   transfer requests never land there behind the chairman's back (no hidden second market, bible §7.2) */
function aiMarketOpen(i){return !(S.my&&i===S.my&&(summerPlayed()||!!(S.win&&S.win.s===S.season&&S.win.brief)))}
function squadManager(id,phase){
  const sq=S.squads[id];
  // over the wage cap or too big: let the least useful players go
  const trim=()=>{const cap=wageCapK(id);let guard=14;
    while(guard-->0){const bill=wageBillK(id),crisis=bill>cap*1.15;
      if(!(sq.length>SQUAD_MAX||(bill>cap*1.05&&sq.length>SQUAD_MIN)))break;
      const xi=pickXI(sq).map(x=>x.p);
      const pool=sq.filter(p=>!p.loan&&(crisis||!xi.includes(p))&&!(p.age<=20&&p.pa>p.q+1.5)&&canSpare(sq,p,crisis));
      const p=pool.sort((a,b)=>crisis?(b.wage/Math.max(1,b.q)-a.wage/Math.max(1,a.q)):(a.q-a.wage/400)-(b.q-b.wage/400))[0];if(!p)break;
      const fee=playerValue(p),buyers=Object.keys(S.clubs).filter(i=>i!==id&&aiMarketOpen(i)&&budgetFor(i)>=fee&&wageBillK(i)+wageFor(p.q)/1000<=wageCapK(i)&&S.squads[i].length<SQUAD_MAX);
      if(buyers.length)transfer(p,id,pick(buyers),fee,'surplus');
      else if(!xi.includes(p)||sq.length>SQUAD_MIN+3)release(id,p,'released to cut the wage bill');else break}};
  trim();
  // players who asked to leave are sold if someone pays a fair price
  for(const p of sq.filter(x=>x.wantsOut&&!x.loan&&canSpare(sq,x,false))){const fee=Math.round(playerValue(p)*.9),buyers=Object.keys(S.clubs).filter(i=>i!==id&&aiMarketOpen(i)&&budgetFor(i)>=fee&&wageBillK(i)+wageFor(p.q)/1000<=wageCapK(i)&&S.squads[i].length<SQUAD_MAX&&CL(i).rep>=CL(id).rep-10);
    if(buyers.length&&sq.length>SQUAD_MIN){p.wantsOut=false;p.morale=70;transfer(p,id,pick(buyers),fee,'request')}}
  // holes: below the minimum per position (in winter only real emergencies: injuries leave the position bare)
  for(const pos of POS){let guard=3;
    // Permanent squad gaps require permanent cover. In winter, an injury alone only
    // triggers emergency cover when no fit player remains in the position.
    const have=()=>sq.filter(p=>p.pos===pos&&!p.loan).length;
    const target=phase==='winter'&&!available(sq).some(p=>p.pos===pos)?Math.max(REQ[pos],have()+1):REQ[pos];
    while(guard-->0&&(have()<target||(phase==='winter'&&!available(sq).some(p=>p.pos===pos)))){
      const base=squadQuality(sq);if(!shopFor(id,pos,base-2.5)&&!shopFor(id,pos,0,{mustHave:true,budget:0}))break;
    }}
  // upgrades: replace the weakest starter if a clearly better player is within reach
  // more money buys more attempts: a rich director keeps looking for upgrades
  if(phase==='summer'){const tries=upgradeAttempts(id);for(let k=0;k<tries;k++){const xi=pickXI(sq);if(!xi.length)break;const worst=xi.slice().sort((a,b)=>a.p.q-b.p.q)[0];
    const got=shopFor(id,worst.slot,worst.p.q+(budgetFor(id)>150?.6:.8));if(!got)continue}}
  while(sq.length<SQUAD_MIN){if(!shopFor(id,pick(POS),0,{mustHave:true,budget:0}))break}
  trim();
  coverAll(id);
}
/* the last step of every round: no position is left without cover (two keepers, one player elsewhere) */
function coverAll(id){const sq=S.squads[id];for(const pos of POS){let guard=3;while(guard-->0&&sq.filter(p=>p.pos===pos&&!p.loan).length<(pos==='GK'?2:1)){if(!shopFor(id,pos,0,{mustHave:true,budget:0}))break}}}
/* renewals in the spring: keep the players worth keeping within the wage cap */
function renewals(id){
  const sq=S.squads[id],med=sq.map(p=>p.q).sort((a,b)=>a-b)[Math.floor(sq.length/2)];
  for(const p of sq.filter(x=>x.contract===1).sort((a,b)=>b.q-a.q)){
    const short=sq.filter(x=>x.contract>1).length<22;
    const want=(p.q>=med-.3||(p.age<=23&&p.pa>med-.3)||short)&&p.age<34;
    if(!want||p.loan)continue;
    // contract talks: the player names his price; the director offers what the wage limit allows
    const demand=Math.round(wageDemand(p,med)*clubWageF(id)/5)*5,room=(wageCapK(id)*1.05-wageBillK(id))*1000+p.wage,offer=Math.min(demand,Math.round(room/5)*5);
    if(p.wantsOut||offer<demand*.9){p.morale=clamp(p.morale-10,0,100);if(id===S.my)emit('RefusedContract',id,`${p.name} turns down a new contract${p.wantsOut?': he wants to leave':` (he asked £${demand} a week, the wage limit allows £${Math.max(0,offer)})`}. He can leave in the summer.`,{pid:p.id,demand});continue}
    p.wage=offer;p.contract=ri(2,3);p.morale=clamp(p.morale+8,0,100);if(id===S.my)emit('Renewed',id,`${p.name} signs a new ${p.contract}-year contract (£${p.wage} a week).`,{pid:p.id})
  }
}
/* the bank wants cash: sell the most valuable player who fetches a fee */
function forcedSale(id){
  const sq=S.squads[id];if(sq.length<=SQUAD_MIN)return;
  const p=sq.filter(x=>!x.loan&&canSpare(sq,x,true)).sort((a,b)=>playerValue(b)-playerValue(a))[0];if(!p)return;
  const fee=Math.round(playerValue(p)*.8);
  const buyers=Object.keys(S.clubs).filter(i=>i!==id&&F(i).cash>fee+wageBillK(i)*4&&S.squads[i].length<SQUAD_MAX).sort((a,b)=>F(b).cash-F(a).cash);
  if(buyers.length){transfer(p,id,buyers[0],fee,'forced');emit('ForcedSale',id,`${CL(id).name} must sell ${p.name} to ${CL(buyers[0]).name} for £${fee}k.`,{pid:p.id})}
}
defCommand('ReleasePlayer',{who:['player','td'],check:(id,a)=>{const p=S.squads[id].find(x=>x.id===a.pid);if(!p)return'Not in the squad';if(p.loan)return'He is here on loan';if(S.squads[id].length<=SQUAD_MIN)return`The squad needs at least ${SQUAD_MIN} players`;return null},
  run:(id,a)=>{const p=S.squads[id].find(x=>x.id===a.pid);const pay=releaseCost(p);release(id,p,'released by the club');return pay}});
