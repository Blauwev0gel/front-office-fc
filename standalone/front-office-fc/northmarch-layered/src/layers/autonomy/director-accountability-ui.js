/* L3 S3.2 — opt-in view composed into Club → Football. */
/* S3.2: a retrospective, factual window report. No individual transfer approval. */
function directorReviewPanel(){
  const trust=directorTrust(),reports=directorWindowReviews().slice(0,3);
  const evidence=`<div class="panel"><p class="eyebrow">Trust in the director</p><p><b>${esc(trust.label)}</b></p><p class="small muted">${trust.n?trust.hits+' of '+trust.n+' assessed signings met their original scouting estimate ('+trust.rate+'%).':'No signings assessed yet.'} Assessments require eight real club appearances; past seasons count, and each assessment stays fixed. A new director starts with his own record.</p><p class="note">This measures the director's recruitment judgement, not points gained or the board's confidence. It informs your mandate and staffing choices; it never changes them automatically.</p></div>`;

  if(!reports.length)return evidence+'<div class="panel"><p class="eyebrow">Director accountability</p><p class="small muted">The first window report appears when the director closes a transfer window.</p></div>';
  return evidence+reports.map(r=>`<div class="panel"><p class="eyebrow">${esc(r.kind)} S${r.s} · director's report</p>
    <p class="small muted">${esc(r.director)} · ${esc(MANDATE_DEALS[r.mandate]?.n||r.mandate)} mandate · ${r.signed.length} arrival${r.signed.length===1?'':'s'} · ${r.missed.length} above the limit.</p>
    ${r.players.length?r.players.map(p=>`<div class="row small"><span><b>${esc(p.name)}</b> · ${esc(p.pos)}<br><span class="muted">${esc(p.need)} · ${p.fee?k1(p.fee):'Free'} · estimated ${p.est}</span></span><span style="text-align:right">${p.current==null?'—':p.current}<br><span class="small muted">${esc(p.verdict)}${p.verdict==='Too early'?' ('+p.apps+' apps)':''}</span></span></div>`).join(''):'<p class="small muted">No arrivals recorded in this window.</p>'}
    ${r.missed.length?`<p class="small muted">Left beyond the mandate: ${r.missed.slice(0,3).map(p=>esc(p.name)+' ('+k1(p.fee)+')').join('; ')}.</p>`:''}
    <p class="note">${r.assessed?r.meeting+' of '+r.assessed+' assessed signings met the director’s original estimate.':'No signings have enough appearances to assess yet.'} This is a fixed retrospective judgement from the signing, not proof of transfer value or sporting impact.</p></div>`).join('');
}

registerFeaturePanel('directorAccountability',directorReviewPanel);
