/* ================= Staff run the daily club (the chairman does not approve repairs or ticket prices) =================
   Every week, for the player's club only, the department heads act within a fixed authority and report what they did:
   grounds repair what wears (while the club can afford it), the ticket office nudges prices within a band,
   commercial signs a main sponsor when there is none. AI clubs already do this through sim/ai.js.
   Owns S.staffLog (the player's club): [{s,w,dept,text,cost}], the last 40 entries. No DOM; old saves start empty. */
const STAFF_LOG_MAX=40,REPAIR_AT=55,PRICE_BAND=[.8,1.25];
function staffLog(id,dept,text,cost){if(!S.staffLog)S.staffLog=[];S.staffLog.push({s:S.season,w:S.week,dept,text,cost:cost||0});if(S.staffLog.length>STAFF_LOG_MAX)S.staffLog.splice(0,S.staffLog.length-STAFF_LOG_MAX)}
function staffReserve(id){return Math.max(10,wageBillK(id)*4)}
function staffOpsWeek(){
  const id=S.my;if(!id||aiRuns(id)||S.phase!=='season')return;const f=F(id);
  /* grounds: repair the worst part once it is worn, if the club keeps four weeks of wages in the bank */
  const w=repairList(id).sort((a,b)=>a.cond-b.cond)[0];
  if(w&&w.cond<REPAIR_AT&&f.cash-w.cost>staffReserve(id)&&!cmd('Repair',id,{key:w.key},'staff').err)staffLog(id,'grounds',`Repaired ${w.label} (was ${Math.round(w.cond)}%).`,w.cost);
  else if(w&&w.cond<35)staffLog(id,'grounds',`${w.label} is at ${Math.round(w.cond)}%, but there is no money to repair it.`,0);
  /* ticket office: every four weeks, a £1 step towards a fuller ground or a better gate, within 80–125% of the usual price */
  if(S.week%4===2){const fill=attendance(id,null,{}).fill,ref=PRICE_DEF[CL(id).tier],pr=f.prices,d=fill<.6?-1:fill>.95?1:0;
    if(d){const moved=['terrace','seated'].filter(k=>{const nx=pr[k]+d;return nx>=Math.round(ref[k]*PRICE_BAND[0])&&nx<=Math.round(ref[k]*PRICE_BAND[1])&&!cmd('SetPrice',id,{kind:k,delta:d},'staff').err});
      if(moved.length)staffLog(id,'matchday',`${d<0?'Cut':'Raised'} ticket prices by £1 (the ground was ${Math.round(fill*100)}% full).`,0)}}
  /* commercial: no main sponsor and offers on the table: sign the steadiest deal */
  const offers=(f.offers||[]).map((o,i)=>({o,i})).filter(x=>x.o.kind==='fixed').sort((a,b)=>b.o.years-a.o.years);
  if(!f.sponsor&&offers.length){const {o,i}=offers[0];if(!cmd('SignSponsor',id,{i},'staff').err)staffLog(id,'commercial',`Signed ${o.name} as main sponsor (£${r2(o.perWeek)}k a week, ${o.years} seasons).`,0)}
}
onWeek(staffOpsWeek);
function staffWeekNotes(id,s,w){return(S.staffLog||[]).filter(e=>e.s===s&&e.w===w)}
