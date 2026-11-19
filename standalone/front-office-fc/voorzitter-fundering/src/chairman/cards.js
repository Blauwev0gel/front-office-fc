/* ================= Cards ================= */
function D(t,give,get,test,fail,run,o={}){return{t,give,get,test,fail,run,...o}}
function noDeal(text,run){return{t:'No deal',none:true,fail:text,run:run||(()=>{})}}
function youthAsk(pid,useOwes){
  const p=P(pid),r=comply(pid,true,useOwes);
  if(r==='refuse'){log(`${p.name} refuses to play the kids`,`${p.name} is ${band(p.loy).toLowerCase()} with you`,null);return}
  S.youth=Math.max(S.youth,r==='full'?2:1);log(r==='full'?'The academy kids start every week':'The kids get some minutes, not many',r==='full'?'The coach does it properly':'The coach does it half-heartedly',null);
  if(!useOwes)loy(pid,'against','You asked for youth over results',{stake:'ask'});
  if(cast('td'))loy(cast('td'),'wish','The director sees academy players get minutes');
}
function valueHit(p,stake){return STRONG[p.value].includes(stake)}
function cardsFor(pid){
  const p=P(pid),r=p.role,cs=[],nm=p.name,deep=p.deepKnown;
  const add=(c)=>{if(c.stake&&deep&&valueHit(p,c.stake))c.hit=`Speaks to what ${nm} values most: ${VALUE_WORD[p.value]}`;cs.push(c)};
  if(r==='coach'){
    if(p.owes)add(D('Call in the favour: play the kids','The favour you are owed','The academy kids start every week','Points may suffer','',()=>youthAsk(pid,true)));
    if(!S.flags.coachBacked)add(D('Back the coach in public',`Your name: "${nm} is my coach."`,'A coach who knows where they stand','Every bad result is partly yours','The paper will quote you back',()=>{S.flags.coachBacked=1;loy(pid,'protect','You backed the coach in public',{stake:'name',mem:[1,'you backed them in public']});if(p.infl)grp(p.infl,2,`${nm} tells the press they have your backing`)},{stake:'name'}));
    add(D('Play the academy kids','Nothing. It is an ask','Minutes for the youngsters','Points may suffer','Against the coach\'s instinct: they may only half do it',()=>youthAsk(pid,false),{stake:'ask'}));
    add(D('Play it safe for a while','Nothing. It is an ask','Steadier results until the next moment','Fans who like attacking football will grumble','A coach who is cool on you only half listens',()=>{const x=comply(pid,true,false);if(x==='refuse'){log(`${nm} ignores the request`,'Distant with you',null);return}addMod('safe',x==='full'?1:.5,nextBlockEnd(S.round+1));log('The team plays it safe','You asked for results over style',null);loy(pid,'against','You asked for safety over style',{stake:'ask'});const g=['students','ultras','newcomers'].find(grpOf);if(g)grp(g,-2,'Dull football')},{stake:'ask'}));
    if(!S.flags.coachContract)add(D('Two more years, signed this week','Security: sacking them becomes expensive','They stay, even if a bigger club calls','End of season','Sacking them would cost a year\'s wages',()=>{S.flags.coachContract=1;cash(-20,'A longer contract for the coach');loy(pid,'deep','A long contract: the plan, not a stopgap',{stake:'security',mem:[1,'you gave them a long contract']})},{stake:'security'}));
    if(!S.flags.coachFinalSay)add(D('The final say on who plays and who is signed','Power, taken from the director','A coach in full control','—','The director will feel passed over',()=>{S.flags.coachFinalSay=1;loy(pid,'wish','You gave them full control',{stake:'power'});loy(cast('td'),'bypass','You gave the coach the director\'s job')},{stake:'power'}));
    if(S.moment>=3&&myPos()>11)add(D(`Replace ${nm}`,S.flags.protectCoach?'Your word: you promised them the season':'Severance pay','A new coach from the people available','The rest of the season','Their friends will remember',()=>sackMine(),{warn:S.flags.protectCoach?'This breaks a public promise':null}));
  }
  if(r==='td'){
    if(hasP('captainDeal')&&!S.flags.captainSigned||(!S.flags.captainSigned&&S.flags.captainExpiring))add(D('Extend the captain\'s contract','Nothing. It is their call, with your nudge','The captain signed','Now','A cool director may say no',()=>{if(p.loy>=4){S.flags.captainSigned=1;log('The director extends the captain\'s contract','You asked, and it is their call',null);loy(cast('captain'),'wish','Their contract is sorted',{stake:'security'})}else log(`${nm} refuses: "Not now."`,'Distant with you',null)}));
    if(!S.flags.tdFree&&S.round>=8)add(D('A loan striker for the run-in','£25k and the director\'s principles','A sharper attack for the rest of the season','Every match from now','They may only half commit',()=>{if(S.flags.council&&weighted()<50){log('The members\' council blocks the loan','The council vets big spending',null);return}const x=comply(pid,true,false);if(x==='refuse'){log(`${nm} refuses the loan`,'Distant with you',null);return}addMod('loan',x==='full'?1:.5,30);cash(-25,'A loan striker');log(x==='full'?'A good loan striker arrives':'A so-so loan striker arrives','The director did what you asked',null);loy(pid,'against','You made them buy',{stake:'ask'})},{stake:'ask',warn:S.flags.council?'The members\' council must approve big spending':null}));
    if(!S.flags.tdFree)add(D('Recruitment is yours alone','Power: no more asks from you','A director who feels trusted','—','You can no longer ask them to buy',()=>{S.flags.tdFree=1;loy(pid,'wish','You gave them full control of recruitment',{stake:'power',mem:[1,'you trusted them with recruitment']})},{stake:'power'}));
    if(!S.flags.tdPraise)add(D('Credit their signings in public','Your name, in the Echo','Recognition for their work','—','Others may feel overlooked',()=>{S.flags.tdPraise=1;loy(pid,'wish','You credited their work in public',{stake:'name'})},{stake:'name'}));
    if(!S.flags.academy)add(D('Head of a new academy','A role, and £20k','The director\'s legacy, built here','—','Money the coach would rather spend now',()=>{S.flags.academy=1;cash(-20,'Setting up an academy');loy(pid,'wish','A new academy to build',{stake:'role',mem:[1,'you gave them an academy']});S.youth=Math.max(S.youth,1)},{stake:'role'}));
  }
  if(r==='captain'){
    if(!S.flags.captainSigned&&!hasP('captainDeal'))add(D('Promise the contract, in public','Your name, and the director\'s authority','Your captain, back with you','Signed before the AGM','A broken promise to the dressing room',()=>{addPromise('captainDeal','You promised the captain in public');loy(pid,'protect','You promised their contract in public',{stake:'security'});loy(cast('td'),'bypass','You made the director\'s call for them')},{stake:'security'}));
    if(!S.flags.captainFuture)add(D('A coaching future','A role: youth coach when they retire','A captain loyal to the end','—','You will have to find them a place',()=>{S.flags.captainFuture=1;loy(pid,'wish','A future at the club',{stake:'role',mem:[1,'you promised them a future']});if(p.infl)grp(p.infl,2,'The fans love it')},{stake:'role'}));
    if(p.loy==null||p.loy>=4)add(D('Rally the dressing room','Nothing. It is an ask','A lift for the next block of games','Next block','—',()=>{meet(pid);if(p.loy>=4){addMod('morale',1,nextBlockEnd(S.round+1));log('The captain rallies the squad','You asked',null)}else log('The captain shrugs','Distant with you',null)},{stake:'ask'}));
    if(!S.flags.captainRaise)add(D('A pay rise','£10k','A happier captain','—','Others will ask too',()=>{S.flags.captainRaise=1;cash(-10,'A pay rise for the captain');loy(pid,'wish','A pay rise',{stake:'money'})},{stake:'money'}));
    if(p.owes&&!S.flags.captainSpeaks)add(D('Speak for me at the AGM','The favour you are owed','Your captain on your side','The AGM','',()=>{p.owes=false;S.flags.captainSpeaks=1;log('The captain will speak for you at the AGM','They owed you',null)}));
  }
  if(r==='fan'){
    const g=p.infl;
    if(!hasP('noInvestor')&&['workers','ultras','oldguard'].includes(g))add(D('"No investor while I\'m chairman." In public','Your name: a new public promise','The supporters behind you','The AGM','Broken the moment you back outside money',()=>{addPromise('noInvestor','You promised the supporters in public');loy(pid,'protect','You promised: no outside investor',{stake:'name'})},{stake:'name'}));
    if(!S.flags.fanSeat)add(D(`A seat on the board for ${gname(C(),g)}`,'Power: they sit in on decisions','The supporters at the table','—',C().statute.some(x=>x.startsWith('Two-thirds'))?'Needs two-thirds of the members at the AGM':'You will have to listen',()=>{S.flags.fanSeat=1;grp(g,6,'A seat at the table');loy(pid,'wish','A seat at the table',{stake:'power'})},{stake:'power'}));
    if(!S.flags.fanName)add(D('Name a stand after the supporters','£15k and a name over the gate','History honoured','—','Others will grumble at the cost',()=>{S.flags.fanName=1;cash(-15,'New signage');loy(pid,'wish','Their name over the gate',{stake:'role',mem:[1,'you named a stand for the supporters']});grp(g,4,'Their name on the stand')},{stake:'role'}));
    if(!S.flags.derbyCrowd&&S.round<23)add(D('Fill the ground for the home derby','Free buses on derby day (£5k)','A roaring crowd','The home derby','—',()=>{S.flags.derbyCrowd=1;cash(-5,'Derby buses');loy(pid,'wish','The supporters will make noise for the derby',{stake:'money'})},{stake:'money'}));
    if(p.owes&&!S.flags.fanSpeaks)add(D('Speak for me at the AGM','The favour you are owed','The supporters hear it from one of their own','The AGM','',()=>{p.owes=false;S.flags.fanSpeaks=1;log(`${nm} will speak for you at the AGM`,'They owed you',null)}));
  }
  if(r==='opp'){
    if(!S.flags.oppCommittee&&!S.flags.oppBoard)add(D('Chair a committee of your own choosing','A platform inside the club','Their followers see you working together','—','A sly opponent may use it',()=>{S.flags.oppCommittee=1;loy(pid,null,'You gave them a platform',{raw:2});grp(S.oppGroup,4,'Chairman and opposition, working together')},{stake:'role'}));
    if(!S.flags.truce)add(D('A truce: you review their big idea','Your word: a public review','They stop attacking you in the paper','The AGM','Your own supporters may call it weakness',()=>{S.flags.truce=1;addPromise('truce','Your truce with the opposition');if(openP('noInvestor'))breakPromise('noInvestor','You agreed to review outside money');grp(S.oppGroup,8,'A grown-up conversation at last');const fan=cast('fan');if(fan&&P(fan).infl!==S.oppGroup)loy(fan,'against','You did a deal with the opposition')},{stake:'name',warn:hasP('noInvestor')?'This breaks a public promise':null}));
    if(deep&&!S.flags.oppBoard)add(D('A seat on the board','Power: your opponent in the boardroom','They withdraw as your opponent','—','Your allies will not like it',()=>{S.flags.oppBoard=1;loy(pid,'deep','The seat they always wanted',{stake:'power'});grp(S.oppGroup,6,'One of their own on the board');const fan=cast('fan');if(fan)loy(fan,null,'The opposition on the board',{raw:-2})},{stake:'power'}));
    add(D('Tell them to back off','Nothing','Maybe nothing','—','Pressure feeds a sly opponent',()=>{if(p.traits.includes('cautious')){log(`${nm} backs off`,'Cautious people avoid a fight',null);S.flags.truce=1}else{log(`${nm} smiles. The paper has a quote by morning`,'Pressure does not work',null);grp(S.oppGroup,-2,`${nm}: "The chairman threatened me."`)}}));
  }
  if(r==='journalist'){
    add(D('Give them an exclusive','A story: the club\'s real finances','Fair coverage this season','—','Your enemies read it too',()=>{S.flags.pressFriend=1;loy(pid,'wish','An exclusive',{stake:'name'});const g=C().groups.slice().sort((a,b)=>a.mood-b.mood)[0].k;grp(g,3,'The paper explains the club\'s situation fairly')},{stake:'name'}));
    add(D('Off the record, every month','Your time, and trust','A friendly ear at the paper','—','If you fall out, they know everything',()=>{S.flags.pressBriefing=1;loy(pid,'wish','Regular briefings',{stake:'security'})},{stake:'security'}));
    add(D('Refuse to talk','Nothing','Nothing','—','They will write it their way',()=>{S.flags.pressHostile=1;loy(pid,null,'You froze the paper out',{raw:-2});log('The Echo turns sharper','You refused to talk',null)}));
  }
  if(r==='chair'){
    const their=CL(p.club);
    if(!S.flags['loan_'+pid])add(D('Borrow a player for the run-in','A favour you will owe','A useful player until May','Every match from now','They will call the favour in',()=>{S.flags['loan_'+pid]=1;addMod('borrow',.5,30);S.knownChairs[pid]=(S.knownChairs[pid]||0)+1;log(`You owe ${nm} a favour`,'A borrowed player',null);meet(pid)},{stake:'ask'}));
    if(!S.flags['pact_'+pid])add(D('A pact: neither of us poaches staff','Security, both ways','They will not approach your coach','—','You cannot approach theirs',()=>{S.flags['pact_'+pid]=1;loy(pid,'wish','A pact between chairmen',{stake:'security'})},{stake:'security'}));
    if(!S.flags.leagueVote)add(D('Vote with them at the league meeting','Your vote','A fairer share of TV money (£20k at season end)','End of season',`Their rivals at ${CL(their.rival).name} will remember`,()=>{S.flags.leagueVote=pid;loy(pid,'wish','Your vote at the league meeting',{stake:'power'})},{stake:'power'}));
  }
  return cs;
}
function sackMine(){
  const old=cast('coach'),op=P(old);if(openP('coachYear'))breakPromise('coachYear','You sacked the coach you promised the season');S.flags.coachSacked=1;
  cash(S.flags.coachContract?-40:-15,S.flags.coachContract?'A year\'s wages':'Severance');
  loy(old,'blame','You sacked them',{mem:[-2,'you sacked them']});op.club=null;S.pool.push(old);
  S.flags.coachBacked=0;S.flags.coachContract=0;S.flags.protectCoach=0;S.youth=0;
  while(S.pool.filter(x=>x!==old).length<3)S.pool.push(mkPerson('coach',null));
  S.hire=pickN(S.pool.filter(x=>x!==old),3);
  newsPush(`${C().name} sack ${op.name}.`,[old],[S.my]);
}
function hireCoach(pid){
  const p=P(pid);S.pool=S.pool.filter(x=>x!==pid);p.club=S.my;p.career.push(S.my);C().cast.coach=pid;p.infl=['students','ultras','newcomers'].find(grpOf)||null;meet(pid);
  addMod('newcoach',pid&&p.traits.includes('ambitious')?1:.5,30);log(`${p.name} is the new head coach`,'You chose them from the coaches available',null);S.hire=null;
}
