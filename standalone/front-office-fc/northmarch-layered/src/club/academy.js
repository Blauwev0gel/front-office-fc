/* ================= The academy (MB-29): children who grow up at the club =================
   The player's club runs five age groups (U10, U12, U14, U16, U18). Every summer there is a trial day for nine-year-olds;
   the academy has a fixed number of places. Each child has a background (school, Sunday club, district), a way of
   growing (early, steady or late bloomer), and a season line for every year: team, games, goals, a match rating and a
   coach's note. Age groups play a youth league each season. At seventeen the best of the U18s graduate into the senior
   squad, carrying the whole history with them; the rest are released and remembered among the alumni.
   Uses its own seeded generator (ARNG), so the world's random stream is untouched. Owns S.acad. No DOM. */
const ACAD_TEAMS=[['U10',9,10],['U12',11,12],['U14',13,14],['U16',15,16],['U18',17,18]];
const ACAD_SCHOOLS=['St Anne\'s Primary','Holy Cross','Brook Lane School','Highfield Juniors','Canal Street Primary','Moor Park School','Church Road Juniors','Westgate Primary'];
const ACAD_SUNDAY=['Rovers Juniors','Albion Colts','Railway Rangers','Lions Youth','Swifts Under-9s','Saints JFC','Wanderers Kids','Athletic Minis'];
const ACAD_NOTE={
  early:['Bigger and faster than everyone in his age group.','Dominates games on strength alone. The others will catch up.','Already looks like a footballer. The question is what is left to grow.'],
  steady:['Learns something new every month.','Never the best on the pitch, never the worst. Keeps improving.','The coaches trust him with anything.'],
  late:['Small for his age; gets knocked off the ball.','Grew ten centimetres this year and lost his touch for a while.','Clever feet. Wait until his body catches up.'],
  volatile:['Brilliant one week, invisible the next.','The most talented in the group, when he wants to be.','Coaches argue about him in every meeting.']};
const ACAD_MOMENT=['Scored the winner in the Easter tournament final.','Captain of his age group this season.','Hat-trick against {rival}.','Player of the season at the youth awards night.','Missed three months with a broken wrist.','Moved up a year to train with the older boys.','Scored from the halfway line in a cup tie.','Picked for the county squad.','Kept six clean sheets in a row.','Cried after the cup final defeat; came back stronger.'];
/* a small seeded generator: the same academy for the same club and season, without touching rnd() */
function ARNG(seed){let a=0;for(const ch of String(seed))a=(a*31+ch.charCodeAt(0))>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const apick=(r,a)=>a[Math.floor(r()*a.length)];
function acadTeamOf(age){const t=ACAD_TEAMS.find(x=>age<=x[2]);return t?t[0]:'U18'}
function ACAD(){if(!S.my)return null;if(!S.acad||S.acad.club!==S.my)acadInit(S.my);return S.acad}
/* how strong the academy is: the department (people and building), as the rest of the game sees it */
function acadLevel(id){return groundSignals(id).academy}
function acadPlaces(id){return clamp(2+Math.floor(acadLevel(id)/2),2,5)}
function acadBase(id){return 11.5+(tierBaseStr(CL(id).tier)-50)/4}
/* the gap between a child's ability now and at seventeen: early bloomers are close to it young, late bloomers far */
const BLOOM={early:-.45,steady:0,late:.5,volatile:.1};
function acadQ(k,age){const gap=2.4+Math.max(0,17-(age??k.age))*.85*(1+BLOOM[k.grow]);return r1(k.pa-gap+(k.form||0))}
/* where the child stands in the age group (0–100): ability against what is normal at that age */
function acadStanding(id,k){const norm=acadBase(id)-3.8+.6*acadLevel(id)+.6+.6+.85*acadLevel(id)+1.25-2.4-Math.max(0,17-k.age)*.85;return clamp(Math.round(50+(acadQ(k)-norm)*14),5,99)}
/* what the academy staff believe the ceiling is: a fixed error per child, smaller with better staff */
function acadSeen(id,k){const st=G(id).depts.academy.staff,e=(ARNG(k.id)()*2-1)*clamp(1.8-.3*st,.3,1.8);return r1(k.pa+e)}
function acadStars(id,k){const d=acadSeen(id,k)-squadQuality(S.squads[id]);return d>=1?5:d>=.3?4:d>=-.5?3:d>=-1.5?2:1}
/* one child: who they are and where they come from */
function acadKid(id,age,r0,opts={}){
  const r=ARNG(id+':kid:'+S.acad.next+':'+Math.floor(r0()*1e9)); /* one generator per child, so attributes never line up between children */
  const A=S.acad,lv=acadLevel(id),c=CL(id),town=TOWNS[c.town]||{wk:'the town'},broad=G(id).depts.academy.course==='broad';
  const pa=r1(acadBase(id)-3.8+.6*lv+((c.devCulture??45)-45)*.009+r()*1.2+.6+.85*lv+((c.devCulture??45)-45)*.015+r()*(broad?3:2.5));
  const grow=apick(r,['early','steady','steady','late','volatile']),local=!broad||r()<.5;
  const from=opts.from||(local?{kind:'local',school:apick(r,ACAD_SCHOOLS),club:apick(r,ACAD_SUNDAY),where:town.wk}:{kind:'region',school:apick(r,ACAD_SCHOOLS),club:apick(r,ACAD_SUNDAY),where:'out of town'});
  return{id:'ak'+(A.next++),name:`${apick(r,PFIRST)} ${apick(r,PLAST)}`,pos:apick(r,['GK','CB','CB','FB','DM','CM','CM','AM','W','W','ST','ST']),foot:r()<.22?'left':r()<.06?'both':'right',
    age,pa,grow,form:0,from,joined:S.season-(age-9),joinAge:opts.joinAge??9,hist:[],moment:null,status:'in'};
}
/* a season in a child's life: games, goals, a rating and a coach's note */
function acadSeasonLine(id,k,s,r,mates){
  const st=acadStanding(id,k),rank=mates.filter(m=>acadStanding(id,m)>st).length,regular=rank<11;
  const apps=regular?14+Math.floor(r()*8):3+Math.floor(r()*8),att=['ST','W','AM'].includes(k.pos)?1:['CM','DM'].includes(k.pos)?.35:k.pos==='GK'?0:.12;
  const goals=Math.round(apps*att*(.25+st/140)*(0.6+r()*.8)),rat=r1(clamp(5.6+st/40+(r()-.5)*.8,5,9.2));
  const team=acadTeamOf(k.age),prev=(k.hist[k.hist.length-1]||{}).note,rv=CL(id).rival?CL(CL(id).rival).name:'the rivals';
  const stat=k.pos==='GK'?(st>60?`${Math.round(apps*.4)} clean sheets in ${apps} games for the ${team}s.`:null):goals>=12?`${goals} goals for the ${team}s: top scorer material.`:apps<8?`Only ${apps} games: on the bench behind older boys.`:st>75?`One of the best in the ${team}s, by a distance.`:null;
  const pool=[apick(r,ACAD_NOTE[k.grow]),apick(r,ACAD_MOMENT.filter(m=>k.pos==='GK'?!/Scored|Hat-trick/.test(m):!/clean sheets/.test(m))).replace('{rival}',rv),stat,stat].filter(x=>x&&x!==prev);let note=apick(r,pool.length?pool:[apick(r,ACAD_NOTE[k.grow])]);
  return{s,age:k.age,team:acadTeamOf(k.age),apps,goals,rat,note};
}
/* a new academy: every age group filled, every child with the seasons they have already played here */
function acadInit(id){
  S.acad={club:id,next:1,kids:[],teams:{},alumni:[],trial:null,news:[],v:1};const r=ARNG(id+':acad:'+S.season),n=acadPlaces(id);
  for(let age=9;age<=17;age++){const m=n+(age>=13?1:0);for(let i=0;i<m;i++){const k=acadKid(id,age,r,{joinAge:age>=13&&r()<.25?13+Math.floor(r()*(age-12)):9});k.joined=S.season-(age-k.joinAge);S.acad.kids.push(k)}}
  /* the history they already have */
  for(const k of S.acad.kids){const yrs=k.age-k.joinAge;const now=k.age;for(let y=yrs;y>=1;y--){k.age=now-y;const mates=S.acad.kids.filter(m=>Math.abs(m.age-now)<=1);k.hist.push(acadSeasonLine(id,k,S.season-y,r,mates.length?mates:[k]))}k.age=now;if(k.joinAge>9)k.hist.unshift({s:k.joined-1,age:k.joinAge-1,team:'Joined',apps:0,goals:0,rat:null,note:`Signed from ${k.from.club} at ${k.joinAge}.`})}
  acadTrial(id);return S.acad;
}
/* trial day: six nine-year-olds for the places the academy has */
function acadTrial(id){const A=S.acad,r=ARNG(id+':trial:'+S.season);A.trial={s:S.season,places:acadPlaces(id),kids:Array.from({length:6},()=>acadKid(id,9,r)),picked:[]};
  /* the academy manager's own order: what the staff can see */
  A.trial.kids.sort((a,b)=>acadSeen(id,b)-acadSeen(id,a));A.trial.advice=A.trial.kids.slice(0,A.trial.places).map(k=>k.id);return A.trial}
defCommand('AcademyPick',{check:(id,a)=>{const A=ACAD();if(!A||!A.trial||A.trial.done)return'There is no trial day';const k=A.trial.kids.find(x=>x.id===a.kid);if(!k)return'Not at the trial';if(!A.trial.picked.includes(a.kid)&&A.trial.picked.length>=A.trial.places)return`Only ${A.trial.places} places this year`;return null},
  run:(id,a)=>{const T=S.acad.trial,i=T.picked.indexOf(a.kid);if(i>=0)T.picked.splice(i,1);else T.picked.push(a.kid);return T.picked}});
/* the places are filled when the season starts: by the chairman's picks, or by the academy manager's advice */
function acadTrialClose(id){const A=ACAD();if(!A||!A.trial||A.trial.done)return;const T=A.trial,ids=(T.picked.length?T.picked:T.advice).slice(0,T.places);
  for(const k of T.kids.filter(x=>ids.includes(x.id))){k.joined=S.season;k.hist.push({s:S.season-1,age:8,team:'Trial',apps:0,goals:0,rat:null,note:T.picked.includes(k.id)&&!T.advice.includes(k.id)?'Picked by the chairman against the academy\'s advice.':'Picked at the trial day.'});A.kids.push(k)}
  T.done=true;T.taken=ids.length}
/* during the season: now and then the age groups make the news */
function acadWeek(id){const A=ACAD();if(!A)return;if(S.week===1)acadTrialClose(id);const r=ARNG(id+':wk:'+S.season+':'+S.week);if(r()>.3)return;
  const t=apick(r,ACAD_TEAMS)[0],kids=A.kids.filter(k=>acadTeamOf(k.age)===t);if(!kids.length)return;const star=kids.slice().sort((a,b)=>acadStanding(id,b)-acadStanding(id,a))[Math.floor(r()*Math.min(3,kids.length))];
  const opp=r()<.3&&CL(id).rival?CL(CL(id).rival).name:apick(r,allIds().filter(c=>c!==id).map(c=>CL(c).name)),gf=1+Math.floor(r()*4),ga=Math.floor(r()*3);
  const txt=gf>ga?`${CL(id).name} ${t} beat ${opp} ${t} ${gf}–${ga}${['ST','W','AM'].includes(star.pos)?`: ${star.name} scores ${gf>2?'twice':'the winner'}`:`: ${star.name} the man of the match`}.`:`${CL(id).name} ${t} ${gf}–${ga} ${opp} ${t}.`;
  A.news.push({s:S.season,w:S.week,t:txt,kid:star.id});if(A.news.length>12)A.news.shift();star.moment=txt}
/* season end: a season line for every child, the youth league tables, a year older, releases, graduates */
function acadSeasonEnd(id){
  const A=ACAD();if(!A)return[];const r=ARNG(id+':end:'+S.season);
  const byTeam={};for(const k of A.kids)(byTeam[acadTeamOf(k.age)]=byTeam[acadTeamOf(k.age)]||[]).push(k);
  A.teams[S.season]={};
  for(const [t] of ACAD_TEAMS){const ks=byTeam[t]||[];if(!ks.length)continue;for(const k of ks)k.hist.push(acadSeasonLine(id,k,S.season,r,ks));
    const str=ks.reduce((a,k)=>a+acadStanding(id,k),0)/ks.length,divLv=tierIds(CL(id).tier).reduce((a,c)=>a+groundSignals(c).academy,0)/Math.max(1,tierIds(CL(id).tier).length),pos=clamp(Math.round(5.5-(str-50)/8-(acadLevel(id)-divLv)*1.2+(r()-.5)*5),1,10),w=clamp(Math.round(18*(.75-pos*.055)+(r()-.5)*3),1,16),d=clamp(Math.round(3+r()*4),0,18-w),l=18-w-d;
    const top=ks.slice().sort((a,b)=>b.hist[b.hist.length-1].goals-a.hist[a.hist.length-1].goals)[0];
    A.teams[S.season][t]={pos,w,d,l,top:top?{name:top.name,goals:top.hist[top.hist.length-1].goals}:null}}
  for(const k of A.kids){k.age++;k.moment=null;if(k.hist.length>12)k.hist.shift()}
  /* moving up to U12, U14 and U16: the academy lets go of children it does not believe in, if the group is full */
  const out=[];for(const k of A.kids.slice()){if([11,13,15].includes(k.age)&&acadStars(id,k)<=1){const peers=A.kids.filter(m=>acadTeamOf(m.age)===acadTeamOf(k.age));if(peers.length>acadPlaces(id)){acadLeave(k,'released',`Released at ${k.age}, moving up to the ${acadTeamOf(k.age)}s.`);out.push(k)}}}
  const T=A.teams[S.season];for(const t in T)if(T[t].pos===1)A.news.push({s:S.season,w:31,t:`${CL(id).name} ${t} are youth league champions.`});
  return out;
}
function acadLeave(k,how,why){const A=S.acad;A.kids.splice(A.kids.indexOf(k),1);k.status=how;k.left={s:S.season,how,why};A.alumni.push({id:k.id,name:k.name,pos:k.pos,age:k.age,how,why,s:S.season,hist:k.hist.slice(-3),pid:k.pid||null});if(A.alumni.length>40)A.alumni.shift()}
/* graduation (called from the season end with the intake the engine already drew): the best seventeen-year-olds take
   those places in the senior squad and bring their name, position, potential and whole history; the rest are released */
function acadGraduate(id,kids){
  if(id!==S.my)return;const A=ACAD();if(!A)return;acadSeasonEnd(id);
  const ready=A.kids.filter(k=>k.age>=17).sort((a,b)=>acadSeen(id,b)-acadSeen(id,a));
  /* a seventeen-year-old the academy rates (three stars or more) always gets a contract, also beyond the usual places;
     the extra players are drawn with the world's generator put back afterwards, so the world does not change */
  const extra=Math.min(2,Math.max(0,ready.filter(k=>acadStars(id,k)>=3).length-kids.length));
  for(let i=0;i<extra;i++){const rs=S.rs,p=newPlayer('CM',{age:17,q:10,academy:true,contract:3,club:id});S.rs=rs;p.career.push('Academy');S.squads[id].push(p);kids.push(p)}
  kids.forEach((p,i)=>{const k=ready[i];if(!k)return;
    p.name=k.name;p.pos=k.pos;p.age=k.age;p.pa=k.pa;p.q=acadQ(k,17);p.devPath=k.grow;p.style=PLAYER_STYLES[k.pos]?apick(ARNG(k.id+':st'),PLAYER_STYLES[k.pos]):p.style;p.wage=Math.round(wageFor(p.q)*clubWageF(id)/5)*5;
    if(k.from.kind==='local'&&k.joinAge===9)p.trait='local hero';
    p.youth={from:k.from,joinAge:k.joinAge,foot:k.foot,hist:k.hist.slice()};p.career.unshift(`Academy from age ${k.joinAge}`);
    k.pid=p.id;acadLeave(k,'graduated',`Graduated into the first team at ${k.age}.`)});
  for(const k of A.kids.filter(x=>x.age>=18).slice())acadLeave(k,'released','Not offered a professional contract at 18.');
  acadTrial(id);
}
onWeek(()=>{if(S.my)acadWeek(S.my)});
onFeature('clubChosen',({club})=>{if(club===S.my){S.acad=null;ACAD()}});
