/* Optional L3 S3.1 director deal-limit interface. This file can be omitted from Basisspel V1. */
/* what the director's limit leaves on the table: information for the chairman, nothing to approve */
function missedPanel(){
  const ms=(S.ops&&S.ops.missed)||[],above=ms.filter(p=>p.status==='above'),past=ms.filter(p=>p.status==='missed'&&(p.s===S.season||p.s===S.season-1)).slice(-3),m=mandateOf(S.my).deals,next=m==='small'?'medium':'large';
  if(!above.length&&!past.length)return'';
  const row=p=>`<div class="row small"><span><b>${esc(p.name)}</b> · ${POS_ONE[p.pos]}, ${p.age}${p.from?` · ${nm(p.from)}`:' · free agent'}<br><span class="muted">${esc(p.need)}.</span></span><span style="text-align:right"><b>${k1(p.fee)}</b><br><span class="muted">his view ${p.est} ± ${p.range}</span></span></div>`;
  return`<div class="panel prop"><p class="eyebrow">${esc(tdOf(S.my).name)}: above your limit</p>
  ${above.length?`<p class="small muted">He would go for these but your limit of ${k1(above[0].cap)} a deal stops him. You do not have to decide anything: he signs within the limit.</p>${above.map(row).join('')}
  ${m!=='large'?`<button class="btn ghost" data-act="mandate" data-arg="${next}">Widen his limit to ${MANDATE_DEALS[next].n}</button>`:''}`:''}
  ${past.length?`<p class="eyebrow" style="margin-top:12px">Left alone last window</p>${past.map(row).join('')}`:''}</div>`;
}
function mandatePanel(){
  const m=mandateOf(S.my).deals,cap=dealCap(S.my);
  return`<div class="panel"><p class="eyebrow">The director's mandate</p><p class="small muted">How much he may decide alone. Above the limit he leaves a deal alone; you see afterwards what that cost.</p>
  <p class="small"><b>Deals</b></p><div class="seg grid3">${Object.entries(MANDATE_DEALS).map(([k,x])=>`<button class="${m===k?'on':''}" data-act="mandate" data-arg="${k}" aria-pressed="${m===k}">${x.n}</button>`).join('')}</div>
  <p class="note">${esc(MANDATE_DEALS[m].d)}${cap===Infinity?'':` Right now: up to ${k1(cap)} a deal.`}</p></div>`;
}

registerFeaturePanel('recruitment:beforePolicy',missedPanel);
registerFeaturePanel('week:recruitmentAlerts',missedPanel);
registerFeaturePanel('recruitment:afterPolicy',mandatePanel);
registerFeatureAction('mandate',arg=>say(cmd('SetMandate',S.my,{deals:arg}),'The director follows the new limit when the window closes.'));
