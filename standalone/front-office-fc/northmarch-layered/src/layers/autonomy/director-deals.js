/* Optional L3 S3.1: director deal authority, candidate scan and audit history.
   No mandate rules belong to the core market, clock, world or L1/L2 recruitment. */
const MANDATE_DEALS={small:{n:'Small',share:.4,d:'He signs himself up to 40% of the transfer budget a deal.'},medium:{n:'Medium',share:.75,d:'He signs himself up to 75% of the transfer budget a deal.'},large:{n:'Large',share:1,d:'He signs anyone within the transfer budget, no questions asked.'}};
function mandateOf(id){return(F(id).policy&&F(id).policy.mandate)||{deals:'large'}}
function dealCap(id){if(id!==S.my||S.auto)return Infinity;const m=MANDATE_DEALS[mandateOf(id).deals]||MANDATE_DEALS.large;return m.share>=1?Infinity:Math.max(5,Math.round(budgetFor(id)*m.share))}

function tdScan(id){
  if(id!==S.my||S.auto)return;const ops=OPS();ops.missed=(ops.missed||[]).filter(p=>p.status!=='above').slice(-9);
  const cap=dealCap(id);if(cap===Infinity)return;
  const sqQ=squadQuality(S.squads[id]),seen=new Set(),out=[];
  for(const n of openNeeds().filter(n=>n.prio>=1).slice(0,5)){
    if(seen.has(n.pos))continue;seen.add(n.pos);
    const own=n.pid&&S.squads[id].find(p=>p.id===n.pid),minQ=n.kind==='upgrade'&&own?own.q+.8:sqQ-2.5;
    const best=shopFor(id,n.pos,minQ,{dry:true,ignoreMandate:true});if(!best||best.fee<=cap)continue;
    const sl=shortlistEntry(best.p.id);
    out.push({pid:best.p.id,name:best.p.name,pos:best.p.pos,age:best.p.age,from:best.from||null,fee:best.fee,est:r1(best.seen??best.p.q),range:sl&&sl.obs?scoutRange(id,sl.obs):eyeRange(id),need:n.why,kind:n.kind});
  }
  out.sort((a,b)=>b.est-a.est);
  for(const o of out.slice(0,3))ops.missed.push({id:ops.pnext++,s:S.season,w:S.week,status:'above',cap,...o});
}
function aboveLimit(){return(S.ops&&S.ops.missed||[]).filter(p=>p.status==='above')}

defCommand('SetMandate',{check:(id,a)=>!MANDATE_DEALS[a.deals]?'Unknown mandate':null,run:(id,a)=>{F(id).policy.mandate={...mandateOf(id),deals:a.deals};
  const w=S.week===0||S.week===WINTER_WEEK-1;if(w&&S.ops){S.ops.missed=(S.ops.missed||[]).filter(p=>p.status!=='above');tdScan(id)} /* the list follows the new limit */}});

registerFeatureRule('dealCap',id=>dealCap(id));
registerFeatureRule('journalDescription',({name,a})=>name==='SetMandate'?`Director's deal limit: ${MANDATE_DEALS[a.deals]?.n||'Updated'}`:name);
onFeature('clubChosen',({club})=>{if(club===S.my){F(club).policy.mandate={deals:'medium'};S.ops.missed=[];S.ops.pnext=1}});
onFeature('windowPlanReady',({club})=>{if(club===S.my)tdScan(club)});
onFeature('transferWindowClosedAfterReport',({club})=>{if(S.ops&&club===S.my)for(const p of S.ops.missed||[])if(p.status==='above'){p.status='missed';p.closed=[S.season,S.week]}});
onFeature('saveLoaded',()=>{if(!S.ops)return;delete S.ops.proposals;if(!Array.isArray(S.ops.missed))S.ops.missed=[];S.ops.pnext=S.ops.pnext||1});
