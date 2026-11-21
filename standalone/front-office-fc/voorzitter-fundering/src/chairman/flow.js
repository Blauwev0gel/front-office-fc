/* ================= Flow (engine; UI calls act()) ================= */
function momentOf(w){return w<8?1:w<15?2:w<23?3:4}
function startSeasonPlay(){S.week=0;S.round=0;S.served=true;startWeek()}
function startWeek(){
  S.phase='season';S.week++;S.round=S.week-1;S.moment=momentOf(S.week);S.mlog=[];S.prevMood=Object.fromEntries(C().groups.map(g=>[g.k,g.mood]));
  if(S.flags.captainWaiting&&S.week%3===0){S.flags.captainWaiting=0;loy(cast('captain'),'wait','You sent them to the director and nothing happened')}
  const cev=clubWeek(S.week);
  if(S.week===15)aiWinter();
  const lines=[];if(S.week%4===0){lines.push(...oppMove());S.served=false}
  const rank={keySale:0,story:1,injury:1,sale:2,buy:3,pass:4,loanIn:5,renew:6,leave:7,window:8,return:9,refused:10,loanOut:11,frame:12,plan:13};
  S.atClub=cev.slice().sort((a,b)=>(rank[a.kind]??9)-(rank[b.kind]??9)).slice(0,3).map(e=>e.text);
  if(S.atClub.length<2){const plan=cfPlan()[0];const td=P(S.cf.tdId);if(plan)S.atClub.push(`${td.name} is working on it: ${plan.charAt(0).toLowerCase()+plan.slice(1)}.`);else S.atClub.push(`${td.name} says the squad is in good shape.`)}
  S.echo=buildEcho(lines,cev);feedWeek(S.week);S.desk=genDeskWeek(S.week);S.sit=null;S.screen='week';
}
function buildEcho(lines,cev){
  const c=C(),m=S.last;let head;const key=cev.find(e=>e.kind==='keySale');
  if(key)head=`${key.name} sold`;
  else if(S.week===1)head=S.season===S.startSeason?`New broom at ${c.name}`:`${c.name}: a new season`;
  else if(m)head=m.pts===3?(m.derby?`Derby delight for ${c.name}`:`${c.name} win`):m.pts===1?`${c.name} held`:(m.derby?`Derby misery for ${c.name}`:`${c.name} beaten`);
  else head='Matchday week';
  const first=S.week>1&&m?[`Last week: ${m.home?'':'at '}${CL(m.opp).name} ${m.gf}–${m.ga}. ${ord(myPos())} in the table.`]:[`The manifest: ${S.promises.map(p=>pdef(p.id).t).join('; ')||'no promises at all'}.`];
  if(S.flags.pressHostile&&S.week%4===0)first.push('Mo Abara: "The chairman still won\'t talk to this paper."');
  const news=S.news.filter(x=>x.s===S.season||x.s==null).sort((a,b)=>a.pri-b.pri).slice(0,2).map(x=>x.text);S.news=S.news.filter(x=>!news.includes(x.text));
  return{date:`Week ${S.week}`,head,lines:[...first,...lines,...news]};
}
function nextFixture(){const c=C(),r=S.week;if(!r||r>30)return null;for(const [h,a] of S.fx[c.tier][r-1])if(h===S.my||a===S.my)return{home:h===S.my,opp:h===S.my?a:h};return null}
const SEASON_MAX={derby:2,agenda:2,award:3,slump:2,cash:2,petition:2,returns:2,rival:2,bid:2,story:1,escalate:1,league:1,captain:1,poach:1,firstContract:2,farewell:1,wantsOut:2,conflict:2,defect:3};
function genDeskWeek(w){
  const out=[];S.cool=S.cool||{};S.genCount=S.genCount&&S.genCount._s===S.season?S.genCount:{_s:S.season};S.lastTitles=S.lastTitles||[];const k=momentOf(w);
  const cands=Object.keys(SIT).filter(g=>(S.cool[g]||0)<=w&&(S.genCount[g]||0)<(SEASON_MAX[g]||2));
  // weighted order: priority, minus recency; urgent ones (priority 8+) always first
  const weight=g=>SIT[g].pri*(0.6+rnd()*0.8)+(SIT[g].pri>=8?10:0);
  cands.sort((a,b)=>weight(b)-weight(a));
  for(const g of cands){if(out.length>=2)break;if(SIT[g].pri<8&&g!=='derby'&&rnd()<.5)continue;
    const d=SIT[g].make(k,w);if(!d)continue;const s={gen:g,data:d,done:false,choice:null};out.push(s);
    const title=SIT[g].build(d).title;if(S.lastTitles.some(x=>x.t===title&&w-x.w<8)){out.pop();continue}
    S.lastTitles.push({t:title,w});S.genCount[g]=(S.genCount[g]||0)+1;S.cool[g]=w+(g==='derby'?1:g==='agenda'?6:5)}
  S.lastTitles=S.lastTitles.filter(x=>w-x.w<10);
  return out;
}
function currentScene(){return S.sit!=null?sitBuild(S.sit):null}
function sceneCards(sc){return[...sc.cards,...(sc.noDeal?[sc.noDeal]:[])]}
const TOUCH={slump:'who you backed in his slump',firstContract:'whose first contract you made special',award:'whose award you presented',wantsOut:'who you persuaded to stay',farewell:'whose farewell you organised'};
function applyCard(i){const s=S.desk[S.sit],sc=sitBuild(S.sit),card=sceneCards(sc)[i];if(!card)return;card.run();if(sc.player&&!card.none&&TOUCH[s.gen]){const pl=playerById(sc.player);setTouch(pl,TOUCH[s.gen]);if(s.gen==='firstContract'&&pl)pl.proDealByYou=1}s.done=true;s.choice=card.none?'Left to run its course':card.t;
  for(const pid of sc.who)if(P(pid)){P(pid).seen=(P(pid).seen||0)+1;if(P(pid).seen>=2)P(pid).deepKnown=true}
  S.sit=null;if(S.hire){S.afterHire='week';S.screen='hire';return}S.screen='week'}
function deskDone(){for(let i=0;i<S.desk.length;i++){const s=S.desk[i];if(s.done)continue;const sc=sitBuild(i);if(sc.noDeal)sc.noDeal.run();s.done=true;s.choice='Left to run its course'}}
function playMatch(){deskDone();if(S.hire){S.afterHire='play';S.screen='hire';return}
  const m=simRound(S.week);S.round=S.week;m.influence=influenceMoments(m);m.lines=matchMoments(m);S.last=m;S.myRes=(S.myRes||[]).concat([m.pts===3?'W':m.pts===1?'D':'L']).slice(-10);S.screen='result'}
function afterResult(){if(S.week>=30)startALV();else startWeek()}
/* ----- Hiring the technical director: at a new club, and after a sacking ----- */
function startTdHire(){S.tdCands=tdCandidates(3);S.screen='tdhire'}
function hireTd(pid){
  if(!S.tdCands||!S.tdCands.includes(pid))pid=S.tdCands?S.tdCands[0]:pid;const old=cast('td'),c=C(),p=P(pid);
  if(old&&P(old)&&old!==pid){P(old).club=null;p.infl=P(old).infl}
  p.club=S.my;p.career.push(S.my);c.cast.td=pid;S.cf.tdId=pid;S.cf.tdHired=true;meet(pid);
  log(`${p.name} is your new director of football`,`${TD_PHIL[tdOf(pid).phil].t}: ${TD_PHIL[tdOf(pid).phil].d.toLowerCase()}`,null);
  S.history.push({s:S.season,club:S.my,txt:`Hired ${p.name} as director of football.`});S.tdCands=null;
}
function summerWindow(){S.windowLog=tdWindow('summer');S.screen='window'}

/* ----- Election at a new club ----- */
function chooseSeat(id){
  S.my=id;const c=C();S.oppGroup=weakest(c);S.promises=[];S.flags={captainExpiring:rnd()<.6};S.mods=[];S.youth=0;S.debuts=0;S.talentStarts=0;
  S.myRes=[];S.mlog=[];S.phase='arrival';S.screen='arrival';S.cool={};S.last=null;S.startSeason=S.season;
  cfInit(id,c.str,cast('td'),cast('coach'),c.rival);
  const sq=S.cf.squad,tal=sq.filter(p=>p.academy).sort((a,b)=>b.pa-a.pa)[0]||sq.slice().sort((a,b)=>a.age-b.age)[0];S.cf.talentPid=tal.id;if(P(cast('talent')))P(cast('talent')).name=tal.name;
  const capP=sq.filter(p=>p.age>=25).sort((a,b)=>b.q-a.q)[0];if(capP&&P(cast('captain'))){capP.name=P(cast('captain')).name;capP.captain=true;capP.age=P(cast('captain')).age;if(S.flags.captainExpiring)capP.contract=1}
  for(const pid of Object.values(c.cast))if(P(pid)&&P(pid).role!=='talent')meet(pid);
  S.history.push({s:S.season,club:S.my,txt:`Became chairman of ${c.name}.`});
}
/* ----- AGM ----- */
function startALV(){
  S.phase='alv';S.mlog=[];S.prevMood=Object.fromEntries(C().groups.map(g=>[g.k,g.mood]));
  if(openP('captainDeal')&&!S.flags.captainSigned){if(P(cast('td')).loy>=4){S.flags.captainSigned=1;log('The director signs the captain, reluctantly','Your promise, their signature',null)}else log('The director refuses to sign the captain','Distant with you',null)}
  if(S.flags.leagueVote){cash(20,'TV money from the league vote');const ch=P(S.flags.leagueVote);const riv=CL(CL(ch.club).rival).cast.chair;if(riv&&P(riv))P(riv).mem.push({s:S.season,club:S.my,v:-1,txt:'you voted against them at the league meeting'})}
  const verdict=S.cf?judgeDirector():null;
  const report=[];
  for(const p of S.promises){let v=p.st==='broken'?false:p.st==='void'?'void':evalP(p.id);if(v==='void'){report.push({id:p.id,res:'void'});continue}
    p.st=v?'kept':'broken';if(v)S.rep++;else S.rep--;report.push({id:p.id,res:p.st});for(const g of pgroups(p.id))grp(g,v?GAIN[pdef(p.id).size]:-20,`${v?'Kept':'Broken'}: ${pdef(p.id).t}`)}
  if(C().cash<0&&grpOf('business'))grp('business',-5,'The club is in the red');
  let mg=C().groups.slice().sort((a,b)=>a.mood-b.mood).slice(0,3).map(g=>g.k);if(S.alvExtra&&!mg.includes(S.alvExtra))mg=[S.alvExtra,...mg.slice(0,2)];S.alvExtra=null;const motions=mg.map(k=>({id:k,by:k,...ARCH[k].motion})).filter(m=>!(m.id==='business'&&S.flags.oppBoard));
  S.alv={step:'report',report,verdict,motions,lobby:[],speakers:[],defense:null,result:null,two:C().statute.some(x=>x.startsWith('Two-thirds'))};
  S.screen='alv';
}
function applyLobby(sel){
  const A=S.alv,c=C();A.lobby=sel;
  for(const id of sel){const m=A.motions.find(x=>x.id===id);
    if(m){grp(m.by,6,`You back their motion: ${m.t}`);if(m.against&&grpOf(m.against))grp(m.against,-3,'They saw the deal');if(m.anti)log('You backed a motion that limits your own power','Power traded for votes',null);
      if(m.id==='business'&&(hasP('noInvestor'))){const p=S.promises.find(x=>x.id==='noInvestor');if(p.st!=='broken'){p.st='broken';S.rep--;for(const g of pgroups('noInvestor'))grp(g,-20,'Broken: no outside investor')}}}
    if(id==='seat'){S.flags.weakSeat=1;grp(S.oppGroup,9,`You give ${gname(c,S.oppGroup)} a seat with a veto`)}}
  const sides=sel.map(id=>A.motions.find(x=>x.id===id)).filter(Boolean);
  for(const a of sides)for(const b of sides)if(a!==b&&a.against===b.by){grp(a.by,-3,'They saw you promise the other side');}
  const need=A.two?66.7:50;
  for(const m of A.motions){let yes=0;for(const g of c.groups){let base=g.k===m.by?90:g.k===m.against?15:45;if(sel.includes(m.id))base+=10;yes+=g.share/100*clamp(base,0,100)}m.pass=yes>=need;m.yes=yes}
  const sp=[];
  for(const role of ['fan','captain','coach','td']){const pid=cast(role);if(!pid)continue;const p=P(pid);if(p.loy==null)continue;const g=p.infl;
    if(p.withOpp){sp.push({id:pid,line:`${p.name} stands with the opposition: "I backed the wrong person."`});if(g)grp(g,-3,`${p.name} speaks against you`)}
    else if(S.flags[role+'Speaks']||p.owes){p.owes=false;sp.push({id:pid,line:`${p.name}: "The chairman kept faith with me. Keep faith with the chairman."`});if(g)grp(g,3,`${p.name} speaks for you`)}
    else if(g&&p.loy>6)grp(g,Math.min(2,Math.round(p.loy-6)),`${p.name} talks you up around the club`);
    else if(g&&p.loy<4)grp(g,-Math.round(4-p.loy),`${p.name} grumbles about you around the club`);}
  A.speakers=sp;A.candidate=!S.flags.oppBoard&&(S.flags.challenge||weighted()<50||c.groups.some(g=>g.share>=30&&g.mood<40));A.step='speech';
}
function applyDefense(d){
  const A=S.alv,c=C();A.defense=d;
  if(d==='luck'){const v=luck()==='unlucky'?5:-5;for(const g of c.groups)grp(g.k,v,v>0?'They accept it was bad luck: the numbers back you':'Excuses: we got what we deserved')}
  if(d==='success'){const kept=A.report.filter(r=>r.res==='kept');if(kept.length){const g=pgroups(kept[0].id)[0]||c.groups[0].k;grp(g,5,`You remind them: ${pdef(kept[0].id).t}`);const o=c.groups.filter(x=>x.k!==g).sort((a,b)=>a.mood-b.mood)[0];if(o)grp(o.k,-3,'They hear a chairman changing the subject')}else for(const g of c.groups)grp(g.k,-3,'Nothing to point at')}
  if(d==='blame'){const pid=cast('coach');loy(pid,'blame','You blamed the coach in front of the members',{mem:[-2,'you blamed them in front of the members']});const p=P(pid);if(p.infl)grp(p.infl,-3,`They liked ${p.name}`);const o=c.groups.find(x=>x.k!==p.infl);if(o)grp(o.k,4,'Someone finally takes the blame')}
  if(d==='wrong'){S.rep+=0;S.flags.trusted=1;log('You admitted your mistakes','Your next manifest will be believed',null)}
  const total=weighted();A.result={total,won:total>=50};A.step='count';
  S.history.push({s:S.season,club:S.my,txt:`${ord(myPos())} in the ${C().tier===0?'Premier':'One'}. ${A.result.won?'Re-elected':'Voted out'} with ${Math.round(total)}%.`});
}
function endSeason(){
  const won=S.alv.result.won;
  aiSeasonEnd();
  for(const m of S.alv.motions.filter(x=>x.pass)){C().binding.push(`${m.t} (season ${S.season})`);if(m.cost)C().cash-=m.cost;if(m.gain)C().cash+=m.gain}
  for(const k of Object.keys(S.flags))if(k.startsWith('summer_')&&S.flags[k]){const pid=k.slice(7),x=S.flags[k];if(P(pid)&&P(pid).club===S.my){C().cash+=x.fee;newsPush(`${P(pid).name} leaves for ${CL(x.club).name} as agreed.`,[pid],[x.club]);leaveClub(pid,x.club)}}
  if(won&&S.cf){if(S.flags.captainSigned){const cp=S.cf.squad.find(p=>p.captain);if(cp)cp.contract=Math.max(cp.contract,3)}clubSeasonEnd()}
  promoteRelegate();
  if(!won){const opp=cast('opp');const c=C();c.cast.chair=opp;P(opp).role='chair';c.cast.opp=mkPerson('opp',c.id,{infl:weakest(c)});S.formerClub=S.my;
    newsPush(`${P(opp).name} is the new chairman of ${c.name}.`,[opp],[c.id]);}
  S.season++;startSeasonWorld();
  if(won){S.promises=[];const keep={council:S.flags.council,coachContract:S.flags.coachContract,tdFree:S.flags.tdFree,academy:S.flags.academy,fanSeat:S.flags.fanSeat,fanName:S.flags.fanName,captainFuture:S.flags.captainFuture,oppBoard:S.flags.oppBoard,weakSeat:S.flags.weakSeat};
    S.flags={...keep,captainExpiring:!keep.captainFuture&&rnd()<.4};S.mods=[];S.cashStart=C().cash;S.oppGroup=weakest(C());S.oppMoves=0;S.step=0;S.pick={};S.chances=computeChances();S.phase='manifest';S.screen='manifest';}
  else{S.my=null;S.cf=null;makeSeats();dressSeats();S.phase='seats';S.screen='summer';}
}

/* ----- action dispatcher (used by the UI and by the audit bots) ----- */
function act(a,arg){
  switch(a){
    case'new':newWorld(arg??((Date.now()%2147483647)|0));break;
    case'toSeats':S.phase='seats';S.screen='seats';break;
    case'call':startCall(arg);break;
    case'seat':pickSeat(arg);break;
    case'seatsBack':S.screen='seats';break;
    case'sign':signContract();break;
    case'toEnvelope':S.screen='envelope';break;
    case'openEnv':openEnvelope();break;
    case'crisis':answerCrisis(arg);break;
    case'crisisDone':afterCrisis();break;
    case'arrive':S.cashStart=C().cash;S.step=0;S.pick={};S.chances=computeChances();S.phase='manifest';S.screen='manifest';break;
    case'pick':S.pick[['sport','club','person'][S.step]]=arg;speechReact(arg);S.step++;if(S.step>=3){applyManifest();S.speech=[];if(S.dayOne&&secretCrisis())S.screen='crisis';else if(S.cf&&!S.cf.tdHired)startTdHire();else startMeeting()}break;
    case'sit':S.sit=+arg;S.screen='sit';break;
    case'back':S.sit=null;S.screen='week';break;
    case'card':applyCard(+arg);break;
    case'play':playMatch();break;
    case'react':{const [id,type]=String(arg).split('|');react(id,type);break}
    case'next':afterResult();break;
    case'hire':hireCoach(arg);if(S.afterHire==='play'){S.hire=null;playMatch()}else S.screen=S.afterHire||'week';break;
    case'frame':{const [k,v]=String(arg).split(':');setFrame(k,k==='budget'||k==='cap'?+v:v);break}
    case'framesDone':summerWindow();break;
    case'tdhire':hireTd(arg);startMeeting();break;
    case'meetNext':S.meeting.step++;break;
    case'mchoose':meetingChoose(arg);break;
    case'mdone':applyMandate();startSummer();break;
    case'sumNext':summerNext();break;
    case'sumSkip':if(S.cf.sum)S.cf.sum.skip=1;break;
    case'player':S.viewPlayer=arg;break;
    case'windowDone':startSeasonPlay();break;
    case'alvLobby':S.alv.step='lobby';break;
    case'lobbyDone':applyLobby(arg||[]);break;
    case'defend':applyDefense(arg);break;
    case'toEnd':S.alv.step='end';break;
    case'nextSeason':endSeason();break;
    case'summerNext':S.screen='seats';break;
    case'gtab':UI.gt=arg;UI.gsel=null;break;
    case'gsel':UI.gsel=arg||null;break;
    case'gbuild':{const [k,o]=String(arg).split('|');startProject(k,o);UI.gsel=null;break}
    case'grepair':{const r=repair(arg);if(r)C().cash=Math.round((C().cash-r.cost)*10)/10;G().repairBill=0;break}
    case'gdept':{const [d,l]=String(arg).split(':');setDeptBudget(d,l);break}
    case'gcourse':{const [d,c]=String(arg).split(':');setDeptCourse(d,c);break}
    case'mtab':UI.mt=arg;break;
    case'price':{const [k,d]=String(arg).split(':');setPrice(k,+d);break}
  }
}
