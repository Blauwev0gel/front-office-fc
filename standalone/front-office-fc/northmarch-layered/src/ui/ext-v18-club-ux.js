/* ================= UI extension, ported from Northmarch V19 =================
   V18: better club management UX.
   Ported verbatim: these layers wrap core functions (render, act, cmd, ...) instead of using the feature hooks.
   Do not add new behaviour here; convert to hooks module by module. */
/* Northmarch V18: better club management UX */
(function install(){
const tx=s=>esc(String(s??""));
const fnum=x=>Math.round(x).toLocaleString("en-GB");
const rnum=x=>(Math.round(x*10)/10).toFixed(1);
const link=(t,sub,act,arg,icon="›")=>`<button class="v18-link" data-act="${act}" data-arg="${tx(arg||"")}"><span class="v18-icon" aria-hidden="true">${icon}</span><span><b>${tx(t)}</b><small>${tx(sub)}</small></span><em>›</em></button>`;
const deptKeys=()=>Object.keys(DEPT);
function deptCards(keys){
 return keys.map(k=>{const d=G(S.my).depts[k],q=deptKpi(S.my,k);
 return `<button class="v18-dept" data-act="dept" data-arg="${k}"><span class="v18-dept-head"><b>${tx(DEPT[k].n)}</b><small>${d.staff}/5 staff</small></span><span class="v18-purpose">${tx(DEPT[k].does)}</span><span class="v18-tags"><span>${tx(d.budget)} budget</span><span>${tx(d.pending||d.course||"Standard")}${d.hiring?" · hiring":""}</span></span><span class="v18-dept-kpi">${tx(q.label)}: <strong>${tx(q.text)}</strong></span><span class="v18-jump">Manage ›</span></button>`}).join("");
}
function focus(){
 const info=windowInfo(),active=info.k==="open"||info.k==="next";const risk=signals(S.my).find(x=>x.lv>=2);
 const projects=G(S.my).projects.filter(x=>x.phase!=="done");
 if(active)return `<div class="v18-focus"><span class="v18-eyebrow">NEXT IMPORTANT DECISION</span><h3>${info.k==="open"?"Summer transfer window":"Winter transfer window"}</h3><p>Set the recruitment approach and check the finances before the director acts.</p><button class="btn" data-act="ctab" data-arg="window">Plan transfers</button></div>`;
 if(seasonOver())return `<div class="v18-focus"><span class="v18-eyebrow">SEASON COMPLETE</span><h3>Review your season</h3><p>See the sporting and financial consequences.</p><button class="btn" data-act="close">Close the season</button></div>`;
 if(risk)return `<div class="v18-focus"><span class="v18-eyebrow">NEEDS ATTENTION</span><h3>${tx(risk.text)}</h3><button class="btn" data-act="${tx(risk.act)}"${risk.arg!=null?` data-arg="${tx(risk.arg)}"`:""}>Review this</button></div>`;
 if(projects.length)return `<div class="v18-focus"><span class="v18-eyebrow">UNDER CONSTRUCTION</span><h3>${tx(projects[0].label)}</h3><p>${projects[0].phase==="permit"?"Waiting for permission":projects[0].left+" weeks remaining"}</p><button class="btn" data-act="ctab" data-arg="ground">See project</button></div>`;
 return `<div class="v18-focus"><span class="v18-eyebrow">YOUR CLUB THIS SEASON</span><h3>Decide what to improve next</h3><p>Football, facilities, staff and finances all affect the club over time.</p><button class="btn" data-act="ctab" data-arg="development">View club growth</button></div>`;
}
const nav=[
 ["Football","Coach, director and playing squad","ctab","football","⚽"],
 ["Transfer centre","Window, strategy and scouting","ctab","window","⇄"],
 ["Finances","Budget, costs, income and loans","hubmoney","overview","£"],
 ["Stadium & facilities","Building, repairs and training grounds","ctab","ground","▥"],
 ["Members & board","Confidence, prices, objectives","ctab","members","♟"],
 ["Club development","History, club growth, stadium","ctab","development","↗"]
];
function clubHome(){
 const c=CL(S.my),f=F(S.my),m=M(S.my),projects=G(S.my).projects.filter(x=>x.phase!=="done");
 const fgroup=["training","medical","academy","scouting"];
 const groups=[["FOOTBALL DEVELOPMENT",deptKeys().filter(k=>fgroup.includes(k))],["CLUB OPERATIONS",deptKeys().filter(k=>!fgroup.includes(k))]];
 return `<div class="v18-club">
 <header class="v18-head"><span class="v18-eyebrow">NORTHMARCH V18 · CLUB</span><h2>${tx(c.name)}</h2><p>Season ${S.season} · ${S.week?"Week "+S.week:"Pre-season"} · ${tx(TIER_NAME[c.tier])}</p></header>
 <section class="v18-stats"><div><small>LEAGUE</small><b>${S.week?ord(posOf(S.my)):"—"}</b><span>${S.week?"Current place":"Season starts soon"}</span></div><div><small>SQUAD</small><b>${rnum(teamStrength(S.my))}</b><span>Team strength</span></div><div><small>CASH</small><b>${k1(f.cash)}</b><span>${k1(debt(S.my))} debt</span></div><div><small>MEMBERS</small><b>${Math.round(m.conf)}/100</b><span>Confidence</span></div></section>
 ${focus()}
 <section class="v18-section"><div class="v18-section-title"><h3>Run your club</h3><small>One tap to every responsibility</small></div><div class="v18-links">${nav.map(x=>link(...x)).join("")}</div></section>
 <section class="v18-section"><div class="v18-section-title"><h3>All ${deptKeys().length} departments</h3><small>Staff, budget and actual results</small></div>
 <p class="small muted">Tap any department to see its detailed information and change staffing, funding or priorities.</p>
 ${groups.map(([label,ks])=>`<div class="v18-dept-group"><h4>${label}</h4><div class="v18-depts">${deptCards(ks)}</div></div>`).join("")}
 <button class="btn ghost" data-act="ctab" data-arg="depts">All department comparisons</button></section>
 <section class="v18-section"><div class="v18-section-title"><h3>Projects</h3><small>What is changing</small></div>
 ${projects.length?projects.map(x=>`<div class="v18-project"><b>${tx(x.label)}</b><span>${x.phase==="permit"?"Permit pending":Math.max(0,x.left)+" weeks left"}</span></div>`).join(""):'<p class="small muted">There are no active building projects.</p>'}
 <button class="btn ghost" data-act="ctab" data-arg="ground">See building options</button></section>
 <section class="v18-section"><div class="v18-section-title"><h3>More information</h3><small>Nothing hidden or removed</small></div><div class="v18-links">
 ${link("Detailed club report","League, finance, staffing and facilities","ctab","overview","▤")}
 ${link("Players","Full squad and player profiles","tab","squad","♙")}
 ${link("History & records","Previous seasons, achievements","history","","⌛")}
 ${link("Income & sponsorship","Sponsors, prices and other income","hubmoney","income","✦")}
 ${link("Funding & debt","Loans and borrowing","hubmoney","funding","£")}
 ${link("Operations overview","All eight department comparisons","ctab","depts","▦")}
 </div></section>
 </div>`;
}
function snapshot(){
 const id=S.my,q=S.squads[id].filter(x=>!x.loan);
 return {s:S.season,w:S.week,quality:r1(teamStrength(id)),count:q.length,age:r1(q.reduce((a,p)=>a+p.age,0)/Math.max(1,q.length)),wages:r1(wageBillK(id)),cash:r1(F(id).cash),needs:openNeeds().filter(x=>x.status==="open").slice(0,20).map(x=>({pos:x.pos,kind:x.kind,why:x.why}))};
}
const oldAdvance=advanceWeek;
advanceWeek=function(){
 const isWindow=!!(S?.my&&S.phase==="season"&&(S.week===0||S.week===WINTER_WEEK-1));
 let before=null,lastE=S?.evn||0;
 if(isWindow)before={s:S.season,kind:S.week===0?"summer":"winter",before:snapshot(),policy:{course:F(S.my).policy.course||"custom",recruit:recruitStrategy(S.my),spend:F(S.my).policy.spend}};
 const outcome=oldAdvance();
 if(before&&S?.my&&S.week>before.before.w){
   const id=S.my;
   before.after=snapshot();
   before.moves=eventsSince(lastE).filter(e=>["Transfer","Signing","InternationalTransfer"].includes(e.t)&&
      (e.c===id||e.c2===id||e.from===id||e.to===id)).slice(0,25).map(e=>({text:e.text||"",dir:e.t==="InternationalTransfer"?(e.to===id?"in":"out"):e.c2===id?"out":"in"}));
   S.v18=S.v18&&S.v18.club===id?S.v18:{club:id,windows:[]};
   S.v18.windows=S.v18.windows.filter(x=>!(x.s===before.s&&x.kind===before.kind)).concat([before]).slice(-6);
 }
 return outcome;
};
function stat(title,value,sub){return `<div><small>${tx(title)}</small><b>${tx(value)}</b><span>${tx(sub)}</span></div>`}
function change(x,y,key,digits=1){if(!x||!y)return"Not recorded";const v=Math.round((y[key]-x[key])*10**digits)/10**digits;return (v>0?"+":"")+v}
function reviewWindow(){
 const w=S.v18?.club===S.my?S.v18.windows?.at(-1):null;
 if(!w||!w.after)return '<p class="small muted">Your first V18 window review appears after the next transfer window. Previous saves have no reliable before-window measurements.</p>';
 const a=w.before,b=w.after,ins=w.moves.filter(x=>x.dir==="in"),out=w.moves.filter(x=>x.dir==="out");
 return `<p class="small muted">${tx(w.kind==="summer"?"Summer":"Winter")} window · Season ${w.s}</p>
 <div class="v18-review-stats">${stat("Squad quality",rnum(a.quality)+" → "+rnum(b.quality),change(a,b,"quality"))}
 ${stat("Squad size",a.count+" → "+b.count,change(a,b,"count",0))}
 ${stat("Weekly wages","£"+fnum(a.wages*1000)+" → £"+fnum(b.wages*1000),change(a,b,"wages")+"k/wk")}
 ${stat("Cash",k1(a.cash)+" → "+k1(b.cash),change(a,b,"cash")+"k")}</div>
 <p class="small muted">The financial comparison includes the whole playing week, not just transfers.</p>
 <div class="v18-moves"><h4>Arrivals (${ins.length})</h4>${ins.length?ins.map(x=>`<p class="small">${tx(x.text)}</p>`).join(""):'<p class="small muted">No recorded arrivals.</p>'}
 <h4>Departures (${out.length})</h4>${out.length?out.map(x=>`<p class="small">${tx(x.text)}</p>`).join(""):'<p class="small muted">No recorded departures.</p>'}</div>
 <p class="small"><b>Open squad needs:</b> ${b.needs.length?b.needs.slice(0,3).map(x=>tx(x.why)).join("; "):"None currently recorded"}.</p>`;
}
function transferCentre(){
 const id=S.my,inf=windowInfo(),decision=S.week===0||S.week===WINTER_WEEK-1,needs=openNeeds(),scouts=OPS().shortlist.filter(x=>x.status==="watching").slice(0,6),p=F(id).policy;
 return `<div class="v18-transfer">
 <header class="v18-head"><span class="v18-eyebrow">FOOTBALL · TRANSFER CENTRE</span><h2>${tx(inf.name)}</h2><p>${tx(inf.when)}</p></header>
 ${decision?`<div class="v18-focus"><span class="v18-eyebrow">YOUR DECISION</span><h3>Set the direction; the director signs the players.</h3><p>The chairman chooses real policies. The director operates within budget and market rules.</p></div>`:""}
 <section class="v18-section"><h3>Assess the squad</h3>
 <div class="v18-stats v18-mini">${stat("Quality",rnum(teamStrength(id)),"Current strength")}${stat("Players",S.squads[id].filter(x=>!x.loan).length,"In the squad")}${stat("Open needs",needs.length,"Squad plan")}${stat("Scouting",scoutObservations(id),"Looks each week")}</div>
 ${needs.length?needs.slice(0,6).map(n=>`<div class="v18-need"><b>${tx(POS_ONE[n.pos]||n.pos)}</b><span>${tx(n.why)}</span><small>${n.prio>=3?"Urgent":n.prio===2?"Soon":"Long term"}</small></div>`).join(""):'<p class="small muted">No unresolved squad-plan needs. Summer upgrades are still possible.</p>'}
 ${needs.length>6?`<details><summary>${needs.length-6} more needs</summary>${needs.slice(6).map(n=>`<p class="small">${tx(n.why)}</p>`).join("")}</details>`:""}
 <button class="btn ghost" data-act="tab" data-arg="squad">See full squad</button></section>
 <section class="v18-section"><h3>Choose a club course</h3>
 <p class="small muted">Changes wage limits, transfer spending, loans and the recruitment strategy together. You can use a preset or change individual limits in any order.</p>
 <div class="v18-options">${Object.entries(COURSE).map(([k,c])=>`<button class="v18-option ${p.course===k?"active":""}" data-act="course" data-arg="${k}" aria-pressed="${p.course===k}"><b>${tx(c.n)}</b><small>${tx(c.d)}</small></button>`).join("")}</div>
 <p class="small muted">${p.course&&COURSE[p.course]?"Selected: "+tx(COURSE[p.course].n):"Custom policy: individual controls are active."}</p></section>
 <section class="v18-section"><h3>Choose recruitment preference</h3>
 <p class="small muted">The director uses this to rank comparable affordable players. It does not guarantee any signing.</p>
 <div class="v18-options">${Object.entries(RECRUIT).map(([k,r])=>`<button class="v18-option ${recruitStrategy(id)===k?"active":""}" data-act="recruit" data-arg="${k}" aria-pressed="${recruitStrategy(id)===k}"><b>${tx(r.n)}</b><small>${tx(r.d)}</small></button>`).join("")}</div></section>
 <section class="v18-section"><h3>Review finances</h3><div class="v18-stats v18-mini">
 ${stat("Transfer money",k1(budgetFor(id)),"Budget formula")}${stat("Weekly wages","£"+fnum(wageBillK(id)*1000),"Current bill")}
 ${stat("Weekly limit","£"+fnum(wageCapK(id)*1000),"Wage ceiling")}${stat("Cash",k1(F(id).cash),k1(debt(id))+" debt")}</div>
 <button class="btn ghost" data-act="tobudget">Detailed spending settings</button></section>
 <section class="v18-section"><h3>Scouting reports</h3>
 <p class="small muted">Real observed candidates; ratings are estimates and available players may decline a deal.</p>
 ${scouts.length?scouts.map(x=>`<div class="v18-need"><b>${tx(x.name)}</b><span>${tx(x.pos)} · ${tx(x.age)} · ${tx(x.from?marketClubName(x.from):"Free agent")}</span><small>${rnum(x.est)} estimated · ${x.obs} looks</small></div>`).join(""):'<p class="small muted">No players currently watched. Scouting improves the search over time.</p>'}
 <button class="btn ghost" data-act="dept" data-arg="scouting">Manage scouting</button></section>
 ${decision?`<section class="v18-launch"><h3>${S.week===0?"Ready for summer transfers?":"Ready for the winter window?"}</h3>
 <p>${S.week===0?"Playing week 1 runs the summer window.":"Playing week "+WINTER_WEEK+" runs winter recruitment. Winter deals mainly cover emergencies."} You may keep your current policy.</p>
 <button class="btn" data-act="play">${S.week===0?"Execute window and play week 1":"Execute winter window and play week "+WINTER_WEEK}</button></section>`:""}
 <section class="v18-section"><h3>Window outcome</h3>${reviewWindow()}</section>
 <section class="v18-section"><h3>More recruitment information</h3>
 <div class="v18-links">${link("Full scouting & signings","The complete shortlist, squad plan and past signings","ctab","recruitdetail","▤")}
 ${link("Football organisation","Coach, director and squad overview","ctab","football","⚽")}</div></section>
 </div>`;
}
const formerClubView=clubView;
clubHub=clubHome;
clubView=function(){
 if(UI.ct==="window")return `<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club</button></div>`+transferCentre();
 if(UI.ct==="recruitdetail")return `<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="window">← Transfer centre</button></div>`+recruitPanels();
 if(UI.ct==="football"){
  return `<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club</button></div>
  <section class="v18-section"><h2>Football organisation</h2><p class="small muted">Manage the sporting staff, see the squad and prepare your transfer strategy.</p><div class="v18-links">
  ${link("Transfer centre","Current needs, policies and window results","ctab","window","⇄")}
  ${link("Full squad","Individual player information and form","tab","squad","⚽")}
  ${link("Academy","Young players and training","dept","academy","✦")}
  ${link("Scouting","Director's observations and reach","dept","scouting","◉")}
  </div></section>${staffPanel()}`;
 }
 return formerClubView();
};
windowPanel=function(){
 const w=windowInfo();
 return `<section class="panel"><div class="row"><p class="eyebrow">Transfer window</p><span class="pill">${w.k==="open"?"Open now":w.k==="next"?"Next week":w.k==="done"?"Completed":"Upcoming"}</span></div>
 <h3>${tx(w.name)}</h3><p class="small muted">${tx(w.when)}</p><button class="btn ghost" data-act="ctab" data-arg="window">Open transfer centre ›</button></section>`;
};
})();
