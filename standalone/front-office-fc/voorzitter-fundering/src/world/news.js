/* ================= Opposition and news ================= */
function oppMove(){
  const out=[],opp=P(cast('opp'));if(!opp)return out;
  if(S.flags.oppBoard){out.push(`${opp.name}, now on your board, has gone very quiet.`);return out}
  S.oppMoves=(S.oppMoves||0)+1;
  if(!S.served)grp(S.oppGroup,-2,`You left ${gname(C(),S.oppGroup)} to ${opp.name}`);
  const pending=S.cross.filter(c=>c.dir==='down').map(c=>c.id);
  const low=['captain','td','coach','fan'].map(cast).filter(id=>id&&P(id).loy!=null&&P(id).loy<4&&!P(id).withOpp&&!pending.includes(id));
  if(low.length&&!(S.flags.oppCommittee&&rnd()<.5)){const id=low[0];P(id).withOpp=true;log(`${P(id).name} is now in ${opp.name}'s camp`,`${opp.name} courts the people you neglect`,null);out.push(`Rumour: ${P(id).name} was seen at lunch with ${opp.name}. Twice.`);return out}
  const bp=S.promises.find(p=>p.st==='open'&&behind(p.id));
  if(bp&&!S.flags.truce){const g=pgroups(bp.id)[0];if(g)grp(g,-3,`${opp.name} attacks your promise: ${pdef(bp.id).t}`);out.push(`${opp.name}: "${pdef(bp.id).t}? Look at the table. What else did the chairman promise you?"`);return out}
  out.push(`${opp.name} at a members' evening: "This club could be so much more. Ask yourselves why it isn't."`);return out;
}
function knows(pid){const p=P(pid);return p&&(p.loy!=null||p.mem.length>0)}
function newsPush(text,ids=[],clubs=[]){let pri=4;if(ids.some(knows))pri=1;else if(clubs.includes(C()?.rival))pri=2;else if(clubs.some(c=>CL(c)&&C()&&CL(c).tier===C().tier))pri=3;S.news.push({pri,text,s:S.season,r:S.round})}
function aiWinter(){
  for(const id of Object.keys(S.clubs)){if(id===S.my)continue;const c=CL(id),ch=P(c.cast.chair),pos=posOf(id);
    const imp=ch&&(ch.traits.includes('impulsive')||ch.traits.includes('ambitious')||ch.value==='glory');
    if(pos-c.expect>=(imp?4:6)&&rnd()<.6)sackAI(c,'at Christmas');}
}
function sackAI(c,when){
  const old=c.cast.coach,op=P(old);if(!op)return;op.club=null;S.pool.push(old);c.str=clamp(c.str-0.5,40,60);
  const cand=S.pool.filter(x=>x!==old);let nu=cand.length?pick(cand):mkPerson('coach',null);S.pool=S.pool.filter(x=>x!==nu);
  const np=P(nu);np.club=c.id;np.career.push(c.id);c.cast.coach=nu;c.str=clamp(c.str+(rnd()<.5?1:0),40,60);
  newsPush(`${c.name} sack ${op.name} ${when}. ${np.name} takes over.`,[old,nu],[c.id]);
}
function aiSeasonEnd(){
  for(const id of Object.keys(S.clubs)){if(id===S.my)continue;const c=CL(id),pos=posOf(id);
    if(pos-c.expect>=5&&rnd()<.55){const old=P(c.cast.chair),nu=c.cast.opp;c.cast.chair=nu;P(nu).role='chair';c.cast.opp=mkPerson('opp',id,{infl:weakest(c)});newsPush(`${c.name}: chairman ${old.name} voted out at the AGM. ${P(nu).name} takes the chair.`,[old.id,nu],[id]);old.club=null}
    else if(pos-c.expect>=3&&rnd()<.35)sackAI(c,'in the summer');
    if(c.cast.captain&&P(c.cast.captain).age>=33&&rnd()<.5){const cap=P(c.cast.captain);cap.role='retired';newsPush(`${cap.name} retires as captain of ${c.name}.`,[cap.id],[id]);c.cast.captain=mkPerson('captain',id,{infl:cap.infl})}
  }
}
function promoteRelegate(){
  const t0=standings(0),t1=standings(1),down=t0.slice(-2),up=t1.slice(0,2);
  down.forEach(i=>CL(i).tier=1);up.forEach(i=>CL(i).tier=0);
  up.forEach(i=>newsPush(`${CL(i).name} are promoted to the Northmarch Premier.`,[],[i]));down.forEach(i=>newsPush(`${CL(i).name} go down.`,[],[i]));
  // a relegated club's star moves to a promoted one
  const from=pick(down),to=pick(up);CL(from).str=clamp(CL(from).str-1,40,60);CL(to).str=clamp(CL(to).str+1,40,60);
  newsPush(`${CL(from).name}'s best player joins ${CL(to).name}.`,[],[from,to]);
  Object.keys(S.clubs).forEach(i=>{CL(i).last=posOf(i);CL(i).str=clamp(CL(i).str+(rnd()<.5?-1:1)*(rnd()<.4?1:0),40,60)});
  Object.values(S.P).forEach(p=>p.age++);
}
