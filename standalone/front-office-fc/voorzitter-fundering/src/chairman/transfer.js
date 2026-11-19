/* ================= The chairman in the transfer summer =================
   He reads the director's review, orders the priorities, and answers at most one talking point a week:
   a note to one person, a note to another, a line in the Echo, or nothing. Every answer shows up the week after. */
function startSummer(){tdSummerStart();S.screen='tsum'}
function topGroup(){return C().groups.slice().sort((a,b)=>b.share-a.share)[0].k}
function fanGroup(){return ['ultras','pit','terrace','students'].find(grpOf)||topGroup()}
function talkOptions(t){
  const td=P(S.cf.tdId),coach=P(cast('coach'));
  if(t.kind==='favSold')return[{k:'note',t:`Write to ${t.name}`,d:'A personal thank-you, out of the paper.'},{k:'back',t:'Echo: back the director',d:'"Hard choices make a club."'},{k:'soft',t:'Echo: "nothing is decided"',d:'Softer fans, an undermined director.'},{k:'none',t:'Say nothing',d:'Let the story run.'}];
  if(t.kind==='clash')return[{k:'noteCoach',t:`Write to ${coach?coach.name.split(' ')[0]:'the coach'}`,d:'"Give the new man six weeks."'},{k:'noteTd',t:`Write to ${td.name.split(' ')[0]}`,d:'"Bring the coach in on the next one."'},{k:'both',t:'Echo: back them both',d:'"Two strong people, one club."'},{k:'none',t:'Say nothing',d:'They sort it out, or it smoulders.'}];
  if(t.kind==='rival')return[{k:'jab',t:'Echo: hit back',d:'"We\'ll find better elsewhere."'},{k:'noteTd',t:`Write to ${td.name.split(' ')[0]}`,d:'"Keep going. I trust the list."'},{k:'none',t:'Say nothing',d:'Rise above it.'}];
  return[{k:'welcome',t:'Echo: welcome him',d:'"Glad to have him here."'},{k:'noteTd',t:`Write to ${td.name.split(' ')[0]}`,d:'"Well done."'},{k:'none',t:'Say nothing',d:'Let the football talk.'}];
}
function talkAnswer(k){
  const s=S.cf.sum,t=s.talk;if(!t||t.answered)return;t.answered=k;const td=S.cf.tdId,coach=cast('coach'),f=s.follow;S.cf.sum.talks.push({w:t.w,kind:t.kind,text:t.text,answer:k});
  if(t.kind==='favSold'){
    if(k==='note'){grp(topGroup(),3,`You thanked ${t.name} personally`);f.push(`${t.name}: "The chairman wrote to me. That's class. I'll clap the Ravensby end."`.replace('Ravensby',C().name.split(' ')[0]))}
    if(k==='back'){loy(td,'wish','You backed the director in public');grp(fanGroup(),-3,`You sounded cold about ${t.name}`);f.push(`The director, in the Echo: "The chairman gets it. This is how clubs grow."`)}
    if(k==='soft'){loy(td,'against','You undercut the director in public',{raw:-1});grp(topGroup(),3,'You sounded like one of them');f.push(`The director is quiet this week. Buyers smell doubt.`)}
    if(k==='none')f.push(`The ${t.name} story fades, slowly.`)}
  if(t.kind==='clash'){
    if(k==='noteCoach'&&coach){loy(coach,'wish','You asked for six weeks for the new man');f.push(`${P(coach).name}: "Six weeks. I'll hold you to it."`)}
    if(k==='noteTd'){loy(td,'against','You told the director to bring the coach in',{raw:-.5});if(coach)loy(coach,'wish','You made the director listen to them');f.push(`The director and the coach sit down together. The next target is slower, but shared.`)}
    if(k==='both')f.push(`"Two strong people, one club." Outside it sounds calm. Inside, nothing changes.`);
    if(k==='none'&&coach){loy(coach,'against','You let the row run',{raw:-.5});f.push(`The row smoulders. The dressing room has noticed.`)}}
  if(t.kind==='rival'){
    if(k==='jab'){grp(fanGroup(),3,`You hit back at ${CL(t.club).name}`);const ch=CL(t.club).cast&&CL(t.club).cast.chair;if(ch&&P(ch))P(ch).mem.push({s:S.season,club:S.my,v:-1,txt:'you mocked them in the Echo'});f.push(`The derby has a new edge. ${CL(t.club).name}'s chairman calls you "a sore loser".`)}
    if(k==='noteTd'){loy(td,'wish','You told the director you trust the list');f.push(`The director, back on the phone: "Plan B was always good."`)}
    if(k==='none')f.push(`You let ${CL(t.club).name} have their day.`)}
  if(t.kind==='signed'){
    if(k==='welcome'){grp(topGroup(),2,`You welcomed ${t.name} in the Echo`);f.push(`${t.name}: "The chairman's words meant a lot. Can't wait for Saturday."`)}
    if(k==='noteTd'){loy(td,'wish','You congratulated the director');f.push(`The director pins your note above the desk.`)}
    if(k==='none')f.push(`${t.name} trains quietly. The fans will decide.`)}
}
function summerNext(){
  const s=S.cf.sum;
  if(s.step==='review'){s.step='plan';return}
  if(s.step==='plan'||s.step==='week'){if(s.week<SUM_WEEKS){tdSumWeek();s.step='week';return}tdSumDeadline();s.step='deadline';return}
  if(s.step==='deadline'){s.step='balance';log(`The summer window closes`,`${s.balance.prios.filter(x=>x.res!=='fail').length} of ${s.balance.prios.length} priorities done`,null);return}
  if(s.step==='balance'){s.step='done';startSeasonPlay()}
}
