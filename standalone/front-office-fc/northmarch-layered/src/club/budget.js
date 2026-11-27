/* ================= The budget meeting (module 2, MB-27): the heart of the chairman =================
   Every summer, before the director's plan, the chairman divides the money the club can move into four pots:
   players (the director's transfer budget), wages (room above what the turnover pays), building (new projects)
   and the bank (what stays). The money is cut into blocks of a fixed size for the club (a sixtieth of a season's income), so a rich summer has
   more blocks than a poor one; every block goes to one pot only. Four people
   ask for their share with a reason: the director, the head coach, the head of facilities and the treasurer.
   Together they always ask for more than there is. The pots then bind all season: the director cannot spend beyond
   the players pot (plus what he sells), wages beyond the limit need the wages pot, a project needs the building pot,
   and at the AGM the members see what each pot bought. Player's club only; AI clubs keep their policy.
   Owns S.bud = {s, unit, blocks, pots{players,wages,build,bank}, asks, loan, signed, built[], verdict[]}. No DOM. */
const BUD_POTS=['players','wages','build','bank'],BUD_LOAN_BLOCKS=3;
const BUD_POT={players:{n:'Players',role:'Director of football'},wages:{n:'Wages',role:'Head coach'},build:{n:'Building',role:'Head of facilities'},bank:{n:'The bank',role:'Treasurer'}};
const r5=v=>Math.max(0,Math.round(v/5)*5);
function budOn(){return !!(S.my&&S.bud&&S.bud.s===S.season)}
function budSigned(){return budOn()&&!!S.bud.signed}
/* four weeks of wages never go into a pot: the club must be able to pay its players next month */
function budFloor(id){return Math.round(wageBillK(id)*4)}
/* the money to divide: cash above the floor, plus most of the surplus the treasurer expects from the season (a club budgets
   on next season's income, as real clubs do). Summer transfers can only spend cash; the rest of the players pot waits for income. */
function budSurplus(id){return Math.round(estSeasonIncome(id)-budRunWeek(id)*SEASON_WEEKS)}
function budFree(id){return Math.max(0,Math.round(F(id).cash-budFloor(id)+Math.max(0,budSurplus(id))*.6))}
function budRunWeek(id){const wk=weekLines(id,false,{});return -((wk.wages||0)+(wk.staff||0)+(wk.depts||0)+(wk.upkeep||0)+(wk.rent||0))}
/* what a starter costs in this market: the median fee of players at or a little above our level, in our division and the ones next to it */
function budMarketFee(id,lo=-.3,hi=.7){const sq=squadQuality(S.squads[id]),t=CL(id).tier,fees=[];
  for(const c of allIds()){if(c===id||Math.abs(CL(c).tier-t)>1)continue;for(const p of S.squads[c])if(!p.loan&&p.q>=sq+lo&&p.q<=sq+hi&&p.age<=30)fees.push(askingFee(p,c))}
  fees.sort((a,b)=>a-b);return fees.length?fees[fees.length>>1]:RECORD_BASE[t]*.4}
/* what each of the four people asks for, and why */
function budAsks(id,money){
  const sq=squadQuality(S.squads[id]),needs=preTargets(id).slice(0,2),fee=budMarketFee(id),d=tdOf(id),co=coachOf(id);
  let players=r5(fee*(needs.length>1?1.4:1)),big=false;
  const exp=S.squads[id].filter(p=>!p.loan&&p.contract<=1&&p.q>=sq-.5),renew=exp.reduce((a,p)=>a+Math.max(0,wageFor(p.q)*clubWageF(id)-p.wage)/1000*SEASON_WEEKS,0);
  const wages=Math.max(5,r5(wageFor(sq+1)*clubWageF(id)/1000*SEASON_WEEKS*.5+renew));
  const proj=projectCatalog(id).filter(o=>!o.busy&&o.group!=='Stadium').sort((a,b)=>a.cost-b.cost)[0]||projectCatalog(id).filter(o=>!o.busy).sort((a,b)=>a.cost-b.cost)[0];
  let build=proj?Math.max(5,proj.cost):0,proj2=null;
  /* when there is money, people ask for more: the director wants a statement signing, facilities the next project too */
  const modest=()=>players+build+(wages||0)+(bank||0);
  let bank=r5(budRunWeek(id)*4),safe=false;
  if(money&&modest()<money*1.4){const top=budMarketFee(id,.7,1.7);players=r5(players+top);big=true}
  if(money&&modest()<money*1.4&&proj){proj2=projectCatalog(id).filter(o=>!o.busy&&o.key!==proj.key).sort((a,b)=>a.cost-b.cost)[0];if(proj2)build+=proj2.cost}
  if(money&&modest()<money*1.3){bank=r5(bank*2);safe=true}
  return{
    players:{k:'players',who:d?d.name:'The director',ask:players,why:needs.length?`A starting ${POS_ONE[needs[0].pos]}${needs[1]?`, and a ${POS_ONE[needs[1].pos]} if the money stretches`:''}. A player who walks into our side costs about £${Math.round(fee)}k.${big?' And one statement signing who lifts the whole side.':''}`:`No holes, but a better player costs about £${Math.round(fee)}k here.`},
    wages:{k:'wages',who:co?co.name:'The coach',ask:wages,why:exp.length?`New deals for ${exp.slice(0,2).map(p=>p.name).join(' and ')}, and room for a better player's wages.`:'Room for a better player than we can pay now.'},
    build:{k:'build',who:deptHeadName(id,'facilities'),ask:build,why:proj?`${proj.label}${proj2?`, then ${proj2.label.toLowerCase()}`:''}. ${proj.effect||''}`.trim():'Nothing left to build.',project:proj?proj.label:null},
    bank:{k:'bank',who:deptHeadName(id,'finance'),ask:bank,why:safe?'Two months of running costs in the bank. Small clubs die in one bad winter.':'Four more weeks of running costs in the bank, in case the season goes wrong.'}};
}
/* the same name the club pages give a department head (same hash as the UI) */
function deptHeadName(id,k){let h=7;for(const ch of String(id+':'+k))h=(h*31+ch.charCodeAt(0))>>>0;return`${FIRST[h%FIRST.length]} ${LAST[(h>>>8)%LAST.length]}`}
function budTotal(){return S.bud?BUD_POTS.reduce((a,k)=>a+S.bud.pots[k],0):0}
/* the size of one block: a sixtieth of the season's income, in round money */
function budUnit(id){const u=estSeasonIncome(id)/60;return Math.max(1,u>=10?Math.round(u/5)*5:Math.round(u))}
/* the meeting opens: the treasurer's first draft shares the shortfall out evenly, so everyone is short and the chairman chooses who */
function budOpen(id){
  if(budOn())return S.bud;
  const free=budFree(id),unit=Math.max(budUnit(id),Math.ceil(free/16)),n=clamp(Math.round(free/unit),2,16),asks=budAsks(id,n*unit),tot=BUD_POTS.reduce((a,k)=>a+asks[k].ask,0)||1;
  const pots={};let left=n;for(const k of BUD_POTS){pots[k]=Math.floor(asks[k].ask/tot*n);left-=pots[k]}
  for(const k of BUD_POTS.slice().sort((a,b)=>(asks[b].ask/tot*n%1)-(asks[a].ask/tot*n%1))){if(left<=0)break;pots[k]++;left--}
  S.bud={s:S.season,club:id,free,unit,blocks:n,pots,asks,loan:0,signed:false,built:[],verdict:[]};return S.bud;
}
function budPotK(k){return S.bud?S.bud.pots[k]*S.bud.unit:0}
/* move one block between a pot and the bank (the bank holds whatever is not given away) */
defCommand('BudgetMove',{check:(id,a)=>{if(!budOn())return'There is no budget meeting';if(S.bud.signed)return'The budget is signed';if(!['players','wages','build'].includes(a.pot))return'Unknown pot';
  if(a.d>0&&S.bud.pots.bank<1)return'Every block is given away';if(a.d<0&&S.bud.pots[a.pot]<1)return'That pot is empty';return null},
  run:(id,a)=>{const d=a.d>0?1:-1;S.bud.pots[a.pot]+=d;S.bud.pots.bank-=d;return S.bud.pots}});
/* the bank lends three more blocks over five years: more to divide now, interest every season */
defCommand('BudgetLoan',{check:(id,a)=>{if(!budOn()||S.bud.signed)return'Only during the budget meeting';if(S.bud.loan)return'The bank already lent this summer';if(maxNewLoan(id)<S.bud.unit*BUD_LOAN_BLOCKS)return'The bank will not lend more';return null},
  run:(id,a)=>{const amt=S.bud.unit*BUD_LOAN_BLOCKS,r=cmd('TakeLoan',id,{amount:amt,years:5});if(r.ok===false)return r;S.bud.loan=amt;S.bud.pots.bank+=BUD_LOAN_BLOCKS;return{amount:amt}}});
/* signing the budget: the four people react, the members hear about it, and the pots bind the season */
defCommand('SignBudget',{check:(id,a)=>!budOn()?'There is no budget meeting':S.bud.signed?'The budget is signed':null,run:(id,a)=>{
  const B=S.bud,met={};for(const k of BUD_POTS)met[k]=budPotK(k)>=B.asks[k].ask*.9;
  const d=tdOf(id),co=coachOf(id);
  if(d){d.loy=clamp((d.loy??50)+(met.players?5:-6),0,100);d.mem=d.mem||[];d.mem.push({s:S.season,t:met.players?'given the money in the budget':'short-changed in the budget'})}
  if(co){co.loy=clamp((co.loy??50)+(met.wages?4:-4),0,100);co.mem=co.mem||[];co.mem.push({s:S.season,t:met.wages?'given wage room in the budget':'denied wage room in the budget'})}
  const fx={};const add=(g,v)=>{fx[g]=(fx[g]||0)+v};
  if(met.players){add('workers',2);add('ultras',2)}else{add('ultras',-1)}
  if(met.bank){add('business',3);add('oldguard',2)}else add('business',-2);
  if(B.pots.build>0){add('families',2);add('newcomers',2)}
  if(B.loan){add('business',-2);add('volunteers',-1)}
  if(typeof agmMood==='function')agmMood(id,fx,'The summer budget');
  B.signed=true;B.met=met;B.signedAt={players:budPotK('players'),wages:budPotK('wages'),build:budPotK('build'),bank:budPotK('bank'),cash:Math.round(F(id).cash)};
  emit('Budget',id,`The ${CL(id).name} budget: £${budPotK('players')}k for players, £${budPotK('wages')}k for wages, £${budPotK('build')}k for building, £${budPotK('bank')}k kept in the bank${B.loan?` (with a £${B.loan}k loan)`:''}.`,{...B.signedAt});
  return{met};
}});
/* ----- how the pots bind the season ----- */
function budWindowNet(){const ws=[S.pre,S.win].filter(w=>w&&w.s===S.season);let spent=0,raised=0;for(const w of ws){spent+=w.deals.filter(d=>d.stage==='signed').reduce((a,d)=>a+d.fee,0);raised+=(w.sold||[]).reduce((a,s)=>a+s.fee,0)}return{spent,raised}}
/* the director's transfer money: the players pot, plus what he raised in sales, minus what he spent; never more than the cash allows */
function budPlayersLeft(id){if(!budSigned()||id!==S.my)return null;const n=budWindowNet();return Math.max(0,Math.min(S.bud.signedAt.players+n.raised-n.spent,Math.round(F(id).cash)))}
/* the wages pot pays for wages above what the turnover carries, spread over the season */
function budWageExtraK(id){if(!budSigned()||id!==S.my)return 0;return S.bud.signedAt.wages/SEASON_WEEKS}
/* the building pot: new projects only; repairs are upkeep and never wait for a pot */
function budBuildLeft(id){if(!budSigned()||id!==S.my)return null;const used=S.bud.built.reduce((a,b)=>a+b.cost,0);return Math.max(0,S.bud.signedAt.build-used)}
function budBuilt(id,label,cost){if(budSigned()&&id===S.my)S.bud.built.push({label,cost,w:S.week})}
/* the AGM: what each pot bought, in names */
function budReview(id){
  if(!budSigned()||id!==S.my)return null;const B=S.bud,a=B.signedAt,n=budWindowNet(),ins=[S.pre,S.win].filter(w=>w&&w.s===S.season).flatMap(w=>w.deals.filter(d=>d.stage==='signed'));
  const over=wageBillK(id)-(wageCapK(id)-budWageExtraK(id));
  return[
    {k:'players',n:'Players',pot:a.players,t:ins.length?`£${n.spent}k on ${ins.map(d=>d.name).slice(0,4).join(', ')}${n.raised?`; £${n.raised}k raised in sales`:''}.`:'Nobody signed.'},
    {k:'wages',n:'Wages',pot:a.wages,t:a.wages?(over>0?`Wages run £${Math.round(over*1000).toLocaleString('en-GB')} a week above what the turnover carries; the pot pays for it.`:'The turnover carried the wages; the pot was not needed.'):'No wage room: the coach worked with what there was.'},
    {k:'build',n:'Building',pot:a.build,t:B.built.length?B.built.map(b=>`${b.label} (£${b.cost}k)`).join(', ')+'.':'Nothing was started.'},
    {k:'bank',n:'The bank',pot:a.bank,t:`Kept back ${k1v(a.bank)}. Cash now ${k1v(F(id).cash)}, from ${k1v(a.cash)} in July.${B.loan?` A £${B.loan}k loan runs on.`:''}`}];
}
