/* ================= Football: the life of a squad =================
   Morale, cards and suspensions, fatigue in cup weeks, playing time, loans, contract demands and club reputation.
   Owns the player fields morale, yel, susp, tired, played, loan, wantsOut, lowWeeks, and the club field rep.
   The chairman does not pick players (D5); he sees the consequences and sets the loan policy in the director's frame. */
const MORALE_WORD=m=>m<25?'Unhappy':m<45?'Restless':m<65?'Content':m<82?'Happy':'Flying';
function lifeDefaults(p){p.morale??=60;p.yel??=0;p.susp??=0;p.tired??=0;p.played??=0;p.loan??=null;p.wantsOut??=false;p.lowWeeks??=0;return p}
function moraleF(p){return .93+.12*(p.morale??60)/100}
function repInit(c){return Math.round(clamp([68,48,28,20,14][c.tier]+(c.support-[3000,1700,850,500,300][c.tier])/120,10,95))}
/* after each match: who played, cards and bans, and how the result feels */
function matchAftermath(m){
  for(const [side,club] of [['h',m.h],['a',m.a]]){
    const xi=side==='h'?m.xiH:m.xiA,gf=side==='h'?m.gh:m.ga,ga=side==='h'?m.ga:m.gh,res=gf>ga?1:gf<ga?-1:0;
    for(const pid of xi){const p=S.squads[club].find(x=>x.id===pid);if(!p)continue;
      p.played=1;if(m.comp==='league'&&CUP_WEEKS[S.cup.round]===S.week)p.tired=1; // a league game in a cup week tires a player for the cup tie
      const temper=p.trait==='temperamental'?2:1;
      if(rnd()<.006*temper){p.susp=ri(1,3);if(club===S.my)emit('Suspended',club,`${p.name} is sent off and banned for ${p.susp} match${p.susp>1?'es':''}.`,{pid})}
      else if(rnd()<.09*temper){p.yel++;if(p.yel%5===0){p.susp=1;if(club===S.my)emit('Suspended',club,`${p.name} collects his fifth booking: banned for one match.`,{pid})}}
      const scored=(m.scorers||[]).filter(x=>x.pid===pid).length;
      p.form=clamp(p.form+res*2+Math.min(6,scored*3),35,90);
      const rival=CL(club).rival===(side==='h'?m.a:m.h);
      p.morale=clamp(p.morale+res*(rival?5:3)+Math.min(4,scored*2),0,100);
    }
    for(const p of S.squads[club])if(!xi.includes(p.id))p.morale=clamp(p.morale+res,0,100);
  }
}
/* weekly, after development: bans served, morale drifts, the unhappy ask to leave */
function lifeWeek(id){
  const sq=S.squads[id],med=sq.map(p=>p.q).sort((a,b)=>a-b)[Math.floor(sq.length/2)]||10;
  for(const p of sq){
    if(p.susp>0&&!p.played)p.susp--;
    if(!p.played&&p.inj<=0&&!p.susp&&p.q>=med)p.morale-=2.5;else if(p.played)p.morale+=1;
    if(p.contract===1&&S.week>RENEW_WEEK)p.morale-=.5;
    p.morale=clamp(p.morale+(60-p.morale)*.03,0,100);
    if(p.morale<25){p.lowWeeks++;if(p.lowWeeks>=4&&!p.wantsOut&&!p.loan){p.wantsOut=true;if(id===S.my)emit('WantsOut',id,`${p.name} asks to leave: he is unhappy with his place in the side.`,{pid:p.id})}}
    else{p.lowWeeks=0;if(p.wantsOut&&p.morale>55)p.wantsOut=false}
    p.played=0;p.tired=0;
  }
}
/* loans: young players who would not play go to a club below that needs them, and come back in the summer */
function loanOut(id){
  if(F(id).policy.loans===false||CL(id).tier>=3)return;
  const sq=S.squads[id],xi=pickXI(sq).map(x=>x.p);
  const cands=sq.filter(p=>p.age<=21&&!xi.includes(p)&&!p.loan&&p.pa>p.q+1&&sq.length>SQUAD_MIN+2&&canSpare(sq,p,false)).sort((a,b)=>(b.pa-b.q)-(a.pa-a.q)).slice(0,2);
  for(const p of cands){
    const tos=Object.keys(S.clubs).filter(i=>CL(i).tier>CL(id).tier&&S.squads[i].length<SQUAD_MAX-1&&i!==S.my);
    const need=tos.filter(i=>S.squads[i].filter(x=>x.pos===p.pos).length<REQ[p.pos]+1);const to=need.length?pick(need):tos.length?pick(tos):null;if(!to)continue;
    sq.splice(sq.indexOf(p),1);p.loan={from:id,s:S.season};S.squads[to].push(p);
    emit('Loan',id,`${p.name} joins ${CL(to).name} on loan for the season.`,{c2:to,pid:p.id});
  }
}
function returnLoans(){
  for(const id in S.squads){const sq=S.squads[id];for(const p of sq.slice())if(p.loan&&p.loan.from!==id){
    p.loanStats={apps:p.sApps||0,goals:p.sGoals||0};playerCloseStint(p,id);
    sq.splice(sq.indexOf(p),1);const from=p.loan.from;p.loan=null;if(from===S.my)p.wasLoan=id;S.squads[from].push(p);
    if(from===S.my)emit('LoanBack',from,`${p.name} returns from his loan (${p.loanStats?.apps||0} appearances).`,{pid:p.id})}}
}
/* contract demands: what a player asks for at renewal (more if he is good, wanted, or unhappy) */
function wageDemand(p,med){return Math.round(wageFor(p.q)*(1+(p.q>=med?.12:0)+rnd()*.12+(p.morale<40?.2:0)+(p.age<=23&&p.pa>p.q+1?.1:0))/5)*5}
/* reputation: how the region sees a club, from where it plays and how it does */
function repSeasonEnd(){
  for(const id in S.clubs){
    const c=CL(id),pos=posOf(id),target=[70,48,28,20,14][c.tier]+(9-pos)*1.6+(S.cup.winner===id?6:0);
    const past=c.hist.slice(-5),recent=past.reduce((sum,h)=>sum+(h.pos<=3?2:h.pos>=14?-2:0),0);
    c.rep=Math.round(clamp(c.rep+(target+recent-c.rep)*.25,5,99));
    c.heritage=c.heritage||{titles:0,promotions:0,relegations:0,cups:0,bestTier:c.tier,streak:0};
    const h=c.heritage;h.bestTier=Math.min(h.bestTier,c.tier);
    if(pos===1&&c.tier===0)h.titles++;
    if(S.cup.winner===id)h.cups++;
    h.streak=pos<=3?Math.max(1,h.streak+1):pos>=14?Math.min(-1,h.streak-1):0;
  }
}
function repWord(r){return r<25?'Local':r<45?'Regional':r<65?'Respected':r<80?'Big name':'Famous'}
