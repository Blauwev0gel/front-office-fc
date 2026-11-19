/* ================= Promises ================= */
function pdef(id){
  const c=C(),tal=P(cast('talent'))?.name||'our best youngster',coach=P(cast('coach')),cap=P(cast('captain'));
  const D={
   survive:{slot:'sport',t:'Stay up',size:'S',arch:['oldguard','retirees','volunteers','families']},
   topHalf:{slot:'sport',t:'A top-half finish',size:'M',arch:['oldguard','business','workers','traders']},
   promo:{slot:'sport',t:'Promotion',size:'L',arch:['workers','oldguard','ultras','business','students','families','retirees','traders','newcomers','volunteers']},
   derby:{slot:'sport',t:`Four points from the ${CL(c.rival).name} derbies`,size:'M',arch:['workers','ultras']},
   goals:{slot:'sport',t:'Forty-two league goals',size:'S',arch:['students','ultras','newcomers']},
   tickets:{slot:'club',t:'Cheaper tickets for everyone',size:'S',arch:['students','families','ultras','workers']},
   books:{slot:'club',t:'Books that balance',size:'M',arch:['business','oldguard','retirees']},
   women:{slot:'club',t:'A women\'s team',size:'S',arch:['newcomers','families','volunteers']},
   standing:{slot:'club',t:'A standing terrace',size:'S',arch:['ultras','workers']},
   council:{slot:'club',t:'A members\' council',size:'S',arch:['volunteers','ultras','families']},
   youth:{slot:'club',t:'Three academy debuts',size:'M',arch:['families','students','volunteers']},
   coachYear:{slot:'person',t:`${coach?coach.name:'The coach'} gets the season`,size:'M',arch:coach&&coach.infl?[coach.infl]:['oldguard']},
   captainDeal:{slot:'person',t:`${cap?cap.name:'The captain'} gets a new contract`,size:'M',arch:cap&&cap.infl?[cap.infl]:['workers']},
   talent:{slot:'person',t:`${tal} starts ten games`,size:'M',arch:['families','students','volunteers','workers']},
   noInvestor:{slot:'deal',t:'No outside investor while you are chairman',size:'M',arch:['workers','ultras','oldguard']},
   truce:{slot:'deal',t:'A fair review of outside investment',size:'M',arch:['business']},
   fanWish:{slot:'deal',t:P(cast('fan'))?`${gname(C(),P(cast('fan')).infl)}: ${P(cast('fan')).deep}`:'What the supporters asked for',size:'M',arch:[P(cast('fan'))?.infl||'workers']}
  };
  return D[id];
}
function pgroups(id){const ks=c=>C().groups.map(g=>g.k);return pdef(id).arch.filter(a=>ks().includes(a))}
function behind(id){
  const r=S.round,p=myPos(),gf=S.tbl[S.my].gf;
  switch(id){case'survive':return r>=8&&p>13;case'topHalf':return r>=8&&p>10;case'promo':return r>=8&&p>5;
    case'derby':return r>=15&&S.derbyPts<(r>=23?4:1);case'goals':return r>=8&&gf<42*r/30-3;
    case'youth':return r>=15&&S.debuts<3*r/30-.5;case'talent':return r>=15&&S.talentStarts<10*r/30-1;
    case'captainDeal':return r>=23&&!S.flags.captainSigned;case'books':return r>=15&&C().cash<S.cashStart-20;default:return false}
}
function evalP(id){
  switch(id){case'survive':return myPos()<=14;case'topHalf':return myPos()<=8;case'promo':return myPos()<=2;case'derby':return S.derbyPts>=4;case'goals':return S.tbl[S.my].gf>=42;
    case'books':return C().cash>=S.cashStart;case'youth':return S.debuts>=3;case'talent':return S.talentStarts>=10;
    case'coachYear':return !S.flags.coachSacked;case'captainDeal':return !!S.flags.captainSigned;default:return true}
}
function chanceFor(id){const c=S.chances;if(c&&c[id]!=null)return chanceWord(c[id]);return{tickets:'Yours to keep',books:'Depends on you',women:'Yours to keep',standing:'Yours to keep',council:'Yours to keep',youth:'Needs the coach',coachYear:'Yours to keep',captainDeal:'Needs the director',talent:'Needs the coach'}[id]||''}
function manifestOptions(slot){
  const ids=['survive','topHalf','promo','derby','goals','tickets','books','women','standing','council','youth','coachYear','captainDeal','talent'];
  return ids.filter(id=>{const d=pdef(id);if(d.slot!==slot)return false;if(id==='derby'&&CL(C().rival).tier!==C().tier)return false;return pgroups(id).length>0||slot==='person'}).slice(0,5);
}
function applyManifest(){
  for(const k of ['sport','club','person']){const id=S.pick[k];if(id&&id!=='none')addPromise(id,'Your manifest')}
  if(hasP('tickets')){cash(-40,'Cheaper tickets: the first year\'s gap');if(grpOf('business'))grp('business',-3,'Business sees money walk out of the door')}
  if(hasP('women'))cash(-20,'Setting up a women\'s team');
  if(hasP('standing')){cash(-15,'Building a standing terrace');if(grpOf('retirees'))grp('retirees',-3,'Standing near the old seats')}
  if(hasP('council')){S.flags.council=1;log('A members\' council will vet big spending','Your manifest',null)}
  if(hasP('coachYear')){loy(cast('coach'),'protect','You promised the coach the season in public',{stake:'security',mem:[1,'you promised them the season']});S.flags.protectCoach=1}
  if(hasP('captainDeal')){loy(cast('captain'),'protect','You promised the captain a contract in public',{stake:'security'});loy(cast('td'),'bypass','Contracts are the director\'s call, and you made it for them')}
  if(hasP('talent')){loy(cast('td'),'wish','You backed the academy\'s best youngster');youthAsk(cast('coach'),false)}
  if(hasP('youth'))loy(cast('td'),'wish','Academy debuts are the director\'s pride');
}
