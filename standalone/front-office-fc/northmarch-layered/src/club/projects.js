/* ================= Club: major projects, history, records and signals =================
   Major projects: extra land for the complex and a new stadium (a multi-season project). They reuse the ground's
   project machine (permit, builder, weekly payments through finance) and finish into a new ground.
   History: per-season records on CL(id).hist and S.records[id]. Signals: what needs the chairman's attention. */
const STADIUM_SIZE={compact:{n:'Compact new ground',f:1.4,min:1500,weeks:40},standard:{n:'New stadium',f:2,min:2500,weeks:55},grand:{n:'Grand new stadium',f:3,min:4000,weeks:70}};
const PLOT_MAX=9;
function plotPrice(id){const g=G(id),extra=Math.max(0,g.plots.length-6);return Math.round([90,60,40][CL(id).tier]*Math.pow(1.3,extra))}
function stadiumPlan(id,size){const sg=groundSignals(id),z=STADIUM_SIZE[size],cap=Math.round(Math.max(sg.capacity*z.f,sg.capacity+z.min)/100)*100;
  return{size,cap,cost:Math.round(cap*[.16,.12,.09][CL(id).tier]),weeks:z.weeks,deposit:Math.round(cap*[.16,.12,.09][CL(id).tier]*.15),label:z.n}}
function stadiumProject(id){return G(id).projects.find(p=>p.key.startsWith('stadium:')&&p.phase!=='done')}
function startStadium(id,size){
  const g=G(id),pl=stadiumPlan(id,size);book(id,'build',-pl.deposit);
  const p={id:g.next++,key:'stadium:new:'+size,target:'stadium',label:pl.label+` (${n0s(pl.cap)} places)`,offer:'standard',cost:pl.cost-pl.deposit,over:chance(.25)?ri(5,20):0,delay:chance(.25)?ri(3,10):0,
    phase:'permit',left:ri(8,16),weeks:pl.weeks,paid:0,started:[S.season,S.week],cap:pl.cap};
  g.projects.push(p);emit('NewStadium',id,`${CL(id).name} start work on a ${pl.label.toLowerCase()} for ${n0s(pl.cap)} (£${pl.cost}k, about ${Math.ceil(pl.weeks/SEASON_WEEKS)} seasons).`,{cap:pl.cap,cost:pl.cost});
  return p;
}
function n0s(v){return Math.round(v).toLocaleString('en-GB')}
/* the move: new stands, better facilities, the old ground sold (or the lease ended), a bigger crowd */
function finishStadium(id,p){
  const g=G(id),c=CL(id),f=F(id),cap=p.cap,oldValue=groundValue(id);
  const seatsShare=.55,seated=Math.round(cap*seatsShare),terrace=cap-seated;
  g.sides={N:{type:'terrace',rings:Math.max(1,Math.round(terrace*.5/RING.terrace)),roof:2,cond:100},E:{type:'seated',rings:Math.max(1,Math.round(seated*.35/RING.seated)),roof:2,cond:100},
    S:{type:'terrace',rings:Math.max(1,Math.round(terrace*.5/RING.terrace)),roof:2,cond:100},W:{type:'seated',rings:Math.max(1,Math.round(seated*.65/RING.seated)),roof:2,cond:100}};
  const lv=Math.max(2,Math.ceil((cap-1400)/1200));g.fac.access.lv=Math.max(g.fac.access.lv,lv);g.fac.safety.lv=Math.max(g.fac.safety.lv,lv);
  for(const k of ['lights','catering','media','screen','business'])g.fac[k].lv=Math.min(8,g.fac[k].lv+2);for(const k in g.fac)g.fac[k].cond=100;
  g.pitch={...g.pitch,lv:Math.min(8,g.pitch.lv+1),drain:Math.min(8,g.pitch.drain+2),cond:100};
  if(f.groundSold){f.groundSold=null;emit('GroundBought',id,`The lease on the old ground ends.`)}else book(id,'groundSale',oldValue);
  c.ground=`${c.name.split(' ')[0]} Stadium`;c.support=Math.round(c.support*1.1);
  p.phase='done';p.done=[S.season,S.week];
  emit('StadiumOpened',id,`${c.name} move into ${c.ground}: ${n0s(groundSignals(id).capacity)} places.`,{cap});
  if(S.members&&S.members[id])confLog(id,8,'A new stadium');
}
/* AI: a full big club with money to spare builds a new ground (rarely) */
function aiStadium(id){const c=CL(id),f=F(id);if(S.week!==4||stadiumProject(id)||c.tier>1)return;const a=f.lastGate;if(!a||a.fill<.97)return;
  const pl=stadiumPlan(id,'standard');if(f.cash>pl.cost*.45&&chance(.3))cmd('StartStadium',id,{size:'standard'},'ai')}

/* ----- history and records ----- */
function recordsInit(){return{bigWin:null,crowd:null,topSeason:null}}
function recordsWeek(matches){
  for(const m of matches)for(const [id,gf,ga,opp] of [[m.h,m.gh,m.ga,m.a],[m.a,m.ga,m.gh,m.h]]){const r=S.records[id];if(!r)continue;
    if(gf-ga>0&&(!r.bigWin||gf-ga>r.bigWin.gf-r.bigWin.ga||(gf-ga===r.bigWin.gf-r.bigWin.ga&&gf>r.bigWin.gf)))r.bigWin={gf,ga,opp,s:S.season,w:S.week};
    if(id===m.h&&m.att&&(!r.crowd||m.att>r.crowd.n))r.crowd={n:m.att,opp,s:S.season}}
}
function cupReached(id){const log=S.cup.log.filter(l=>l.h===id||l.a===id);if(!log.length)return null;const last=log[log.length-1];return S.cup.winner===id?'Winners':CUP_ROUND[last.r]+(last.w===id?'':' (out)')}
function topScorer(id){const p=S.squads[id].filter(x=>!x.loan).slice().sort((a,b)=>b.sGoals-a.sGoals)[0];return p&&p.sGoals?{name:p.name,goals:p.sGoals}:null}
function honours(id){const h=CL(id).hist;return{titles:h.filter(x=>x.pos===1).map(x=>({s:x.s,tier:x.tier})),promotions:h.filter((x,i)=>x.tier>0&&x.pos<=2).length,cups:S.hist.filter(x=>x.cup===id).map(x=>x.s)}}

/* ----- signals: what needs attention, each linked to the screen where the chairman acts ----- */
function signals(id){
  const out=[],f=F(id),g=G(id),sq=S.squads[id],m=M(id);
  if(S.week>=18){const end=sq.filter(p=>p.contract===1&&!p.loan&&p.q>=squadQuality(sq)-.5);if(end.length)out.push({lv:2,text:`${end.length} key player${end.length>1?'s':''} out of contract this summer`,act:'tab',arg:'squad'})}
  const ref=sq.filter(p=>p.wantsOut);if(ref.length)out.push({lv:2,text:`${ref[0].name}${ref.length>1?` and ${ref.length-1} more`:''} want${ref.length>1?'':'s'} to leave`,act:'tab',arg:'squad'});
  for(const role of ['coach','td']){const p=P(CL(id).cast[role]);if(p&&p.pro){if(p.pro.caretaker)out.push({lv:3,text:`A caretaker is in charge as ${role==='coach'?'head coach':'director'}`,act:'staff',arg:role});else if(p.pro.contract<=1&&S.week>=15)out.push({lv:1,text:`The ${role==='coach'?'head coach':'director'}'s contract ends this season`,act:'staff',arg:role})}}
  const w=groundCondWorst(id);if(w.c<40)out.push({lv:w.c<30?3:2,text:`${w.n} is at ${Math.round(w.c)}%: repair before inspectors close it`,act:'ctab',arg:'ground'});
  const fc=cashForecast(id);if(fc.minV<-creditLimit(id)*.5)out.push({lv:3,text:`The cash forecast dips to ${k1v(fc.minV)} in ${fc.minW} weeks`,act:'tab',arg:'money'});
  for(const t of budgetWarnings(id))out.push({lv:2,text:t,act:'tobudget'});
  if((f.offers||[]).length)out.push({lv:2,text:`${f.offers.length} sponsor offer${f.offers.length>1?'s':''} waiting`,act:'mtabgo',arg:'sponsors'});
  if(!f.sponsor||f.sponsor.until<S.season)out.push({lv:2,text:'No main sponsor: sign one',act:'mtabgo',arg:'sponsors'});
  if(m.conf<45)out.push({lv:3,text:`Members' confidence is ${Math.round(m.conf)}: an AGM today would be close`,act:'ctab',arg:'members'});
  const sp=stadiumProject(id);if(sp&&sp.phase==='build'&&sp.left<=5)out.push({lv:1,text:`The new stadium opens in ${sp.left} weeks`,act:'ctab',arg:'ground'});
  return out.sort((a,b)=>b.lv-a.lv);
}
function projectsAfterLoad(){S.journal=S.journal||[];S.records=S.records||{};for(const id in S.clubs)S.records[id]=S.records[id]||recordsInit()}

defCommand('BuyPlot',{check:id=>{const g=G(id);if(g.plots.length>=PLOT_MAX)return'There is no more land next to the ground';if(F(id).cash-plotPrice(id)<-creditLimit(id))return'The bank will not cover this';return null},
  run:id=>{const price=plotPrice(id);book(id,'build',-price);G(id).plots.push({kind:null});emit('PlotBought',id,`${CL(id).name} buy a plot of land next to the ground (£${price}k).`);return price}});
defCommand('StartStadium',{check:(id,a)=>{if(!STADIUM_SIZE[a.size])return'Unknown size';if(stadiumProject(id))return'A new stadium is already being built';const pl=stadiumPlan(id,a.size);
  if(F(id).cash-pl.deposit<-creditLimit(id))return`The deposit of £${pl.deposit}k is more than the bank will cover`;if(hasStatute(id,STATUTE_SALE)&&M(id).conf<50)return'Selling the old ground needs the members\' approval, and they would refuse';return null},
  run:(id,a)=>startStadium(id,a.size)});
