/* ================= Club foundation: players who come alive =================
   Profiles (home town, story, what they want) and storylines that follow from the simulation.
   Storylines are club events with kind 'story'; the chairman layer reads them. */
const ABROAD=['Lisbon','Accra','Cork','Gdańsk','Lagos','Rotterdam','Bergen','Dakar','Swansea','Glasgow'];
const STORY={
 academy:['Came through the academy from the age of nine.','Was spotted at a Sunday league game in the rain.','Their mum still washes the youth team kit.','Turned down a bigger academy to stay near home.'],
 local:['Grew up two streets from the ground.','Watched from the terrace as a kid; now plays on the pitch.','Works the family shop on Mondays.','Their grandad played for the club in the sixties.'],
 abroad:['Came over at nineteen with one suitcase.','Learned the language from the dressing-room radio.','Calls home every matchday night.','Left a bigger league for a chance to play every week.'],
 journeyman:['This is club number six.','Has played in every division of the Northmarch.','Was a bricklayer until twenty-two.','Nearly quit the game after a bad injury.'],
 veteran:['Has more appearances than anyone in the dressing room.','The first name the young lads ask for advice.','Wants one more good season, then coaching.','Has outlasted four managers.']};
const WANTS={play:'to play every week',contract:'a longer contract',up:'to play at a higher level',roots:'to settle and buy a house here'};
function givePlayerLife(p,o){
  const towns=Object.values(S.clubs||{}).map(c=>c.name.split(' ')[0]);
  const local=p.academy||rnd()<.35;p.home=local&&towns.length?pick(towns):pick(ABROAD.concat(towns.slice(0,8)));
  const kind=p.academy?'academy':p.age>=31?'veteran':ABROAD.includes(p.home)?'abroad':local?'local':'journeyman';
  p.story=pick(STORY[kind]);if(kind==='academy'||kind==='local')p.localKid=true;
  p.want=p.age<=21?'play':p.age>=30?'roots':p.q>=12.5?'up':pick(['contract','play','roots']);
}
function storyEv(p,kind,text){if(!p.storySeen)p.storySeen={};const key=kind+'_'+S.season;if(p.storySeen[key]&&kind!=='winner')return;p.storySeen[key]=1;cfEv('story',text,{pid:p.id,sk:kind})}
function storiesAfterMatch(m,xi,scorers){
  const c=S.clubs[S.cf.club];
  for(const x of xi){const p=x.p;p.sApps++;
    if(p.academy&&p.apps===1)storyEv(p,'debut',`${p.name} made his debut. ${p.story}`);
    if(p.apps===100)storyEv(p,'hundred',`${p.name}'s 100th game for ${c.name}.`);
    if(p.backFromInj&&scorers.includes(p)){storyEv(p,'comeback',`${p.name} scored on his return from injury.`)}
    p.backFromInj=false;
    p.formHist.push(scorers.includes(p)?Math.min(95,p.form+15):p.form);if(p.formHist.length>6)p.formHist.shift();
  }
  for(const p of scorers){if(p.goals===1)storyEv(p,'firstGoal',`${p.name}'s first goal for the club${p.academy?', from the academy':''}.`)}
  if(m.pts===3&&m.gf-m.ga===1&&scorers.length){const hero=scorers[scorers.length-1];storyEv(hero,'winner',`${hero.name} scored the winner${m.derby?' in the derby':''}.`);m.hero=hero.name}
}
function storiesWeekly(w){
  const sq=S.cf.squad;
  for(const p of sq){
    p.morale=clamp(p.morale+(p.want==='play'&&p.sApps<w*.3&&w>6?-2:0)+(p.form>70?1:0)-(p.inj>0?1:0),5,95);
    p.form=clamp(p.form+Math.round((p.morale-60)/15),35,90);
    if(p.form<45&&!p.slumpW)p.slumpW=w;if(p.form>=50)p.slumpW=0;
    if(p.slumpW&&w-p.slumpW>=3)storyEv(p,'slump',`${p.name} has lost his way: three poor weeks in a row.`);
    if(w===10&&p.contract===1&&p.q>=12&&!p.renewDone)storyEv(p,'contractYear',`${p.name} enters the last months of his contract. ${p.want==='up'?'He wants a bigger stage.':'He wants to know where he stands.'}`);
    if(w===2&&p.age>=33&&p.contract===1)storyEv(p,'lastSeason',`${p.name}, ${p.age}, starts what may be his last season. ${p.story}`);
  }
}
function playerById(id){return S.cf&&S.cf.squad.find(p=>p.id===id)}
