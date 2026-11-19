/* ================= Reactions on the feed, and the chairman's touch on match day =================
   On up to two cards a week the owner can send a note (private) or say something in the Echo (public).
   Effects are small and visible in the person's own words. Players the owner touched carry that into match moments. */
const REPLY_NOTE=['"Thanks, chairman. That means a lot."','"I\'ll keep the note. My mum will want to see it."','"Didn\'t expect that from the chairman. Cheers."','"I won\'t let you down."'];
const REPLY_ECHO=['The quote ran on the back page. He pinned it to his locker.','The fans read it on the bus. Some cut it out.','The coach saw it too, and raised an eyebrow.'];
function canReact(card){return card&&(card.pid&&playerById(card.pid)||card.src==='region')&&!(S.reacts||{})[card.id]}
function reactsLeft(){S.reacts=S.reacts||{};return 2-Object.values(S.reacts).filter(r=>r.s===S.season&&r.w===S.week).length}
function setTouch(p,txt){if(p){p.touch={txt,s:S.season,w:S.week}}}
function react(cardId,type){
  const card=(S.feed||[]).find(c=>c.id===cardId);if(!card||!canReact(card)||reactsLeft()<=0)return;
  const p=card.pid?playerById(card.pid):null,co=cast('coach');let reply;
  if(type==='note'&&p){
    p.morale=clamp(p.morale+6,0,99);reply=REPLY_NOTE[(p.name.length+S.week)%REPLY_NOTE.length];
    setTouch(p,card.kind==='slump'?'who got your note when he was struggling':card.kind==='injury'?'who got your note when he was injured':'who got a note from you');
    log(`${p.name}: delighted`,`Your note after "${card.head}"`,'+6');
    const rival=S.cf.squad.find(x=>x!==p&&x.pos===p.pos&&x.trait==='temperamental');if(rival&&rnd()<.5){rival.morale=clamp(rival.morale-3,0,99);reply+=` ${rival.name} noticed, and sulked.`;log(`${rival.name}: a bit jealous`,`You wrote to ${p.name}, not him`,'−3')}
  }
  if(type==='echo'){
    if(p){p.morale=clamp(p.morale+4,0,99);setTouch(p,'who you praised in the Echo');const g=p.localKid?C().groups.slice().sort((a,b)=>b.share-a.share)[0].k:['ultras','workers','students'].find(grpOf);if(g)grp(g,p.localKid?2:1,`The chairman praised ${p.name} in the Echo`);
      if(['training','slump','debut'].includes(card.kind)&&co)loy(co,null,'The chairman talking about players in public',{raw:-.5});
      reply=REPLY_ECHO[(p.name.length+S.week)%REPLY_ECHO.length]}
    else{const riv=CL(C().rival).cast.chair;if(riv&&P(riv))P(riv).mem.push({s:S.season,club:S.my,v:-1,txt:'you mocked them in the Echo'});const g=['workers','ultras'].find(grpOf);if(g)grp(g,2,'The chairman had a dig at the neighbours');reply='The neighbours did not find it funny. Our fans did.'}
  }
  S.reacts[cardId]={type,reply,s:S.season,w:S.week};
}
function influenceMoments(m){
  // lines that tie a match moment to something the owner did; counted for the test
  const out=[];const c=C();
  for(const g of m.goals||[]){const p=playerById(g.id);if(!p)continue;
    if(p.touch&&p.touch.s===S.season&&S.week-p.touch.w<=8)out.push(`${g.min}' ${p.name}, ${p.touch.txt}, scores.`);
    else if(p.mandateSigning===S.season)out.push(`${g.min}' ${p.name}, signed under your mandate, scores.`);
    else if(p.proDealByYou)out.push(`${g.min}' ${p.name}, whose first contract you made special, scores.`);}
  if(m.save){const p=playerById(m.save.id);if(p&&p.mandateSigning===S.season)out.push(`${p.name}, signed under your mandate, keeps a clean sheet.`)}
  if(m.derby&&m.home&&S.flags.derbyCrowd)out.push('The crowd you filled carried us through the derby.');
  S.influence=S.influence||{};S.influence[S.season]=(S.influence[S.season]||0)+out.length;
  return out.slice(0,2);
}
function matchMoments(m){
  const out=[];const win=m.pts===3&&m.goals&&m.goals.length?m.goals[m.goals.length-1]:null;
  if(win&&m.gf-m.ga===1)out.push(`${win.min}' ${win.name} scores the winner.`);
  else if(m.goals&&m.goals.length)out.push(`Goals: ${m.goals.map(g=>`${lastName(g.name)} ${g.min}'`).join(', ')}.`);
  if(m.save)out.push(`${m.save.name} made the save of the afternoon.`);
  if(m.error)out.push(`A mistake from ${m.error.name} cost us.`);
  for(const x of m.moments||[])if(out.length<4)out.push(x);
  return out;
}
