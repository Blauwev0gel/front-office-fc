// Datatabellen voor laag 1 en 2. Inhoud groeit hier, niet in de engine.
const CAL={WEEKS:52,SEASON_START:1}; // week 1 = begin zomer; mechanieken (stap 2-4) bepalen wat per week gebeurt
const PLOTS=6;
const DEPARTMENTS={ // laag 1: zes afdelingen, elk met twee koersen
  matchday:{name:'Matchday',courses:['atmosphere','comfort']},
  training:{name:'Training & medical',courses:['fitness','development']},
  academy:{name:'Academy',courses:['local','broad']},
  scouting:{name:'Scouting',courses:['domestic','abroad']},
  commercial:{name:'Commercial',courses:['local','premium']},
  community:{name:'Community',courses:['members','events']}
};
const BUDGET_LEVELS=['tight','normal','generous'];
const BUILDINGS={ // type -> afdeling en signalen (waarden per niveau volgen in stap 2)
  terrace:{name:'Terrace',dept:'matchday',signals:['capacity','atmosphere']},
  seated:{name:'Seated stand',dept:'matchday',signals:['capacity','comfort']},
  main_stand:{name:'Main stand',dept:'matchday',signals:['capacity','business_seats']},
  training_ground:{name:'Training ground',dept:'training',signals:['training_level']},
  medical:{name:'Medical centre',dept:'training',signals:['medical_level']},
  academy:{name:'Academy building',dept:'academy',signals:['academy_level']},
  scouting_office:{name:'Scouting office',dept:'scouting',signals:['scouting_reach']},
  fanshop:{name:'Fan shop',dept:'commercial',signals:['commercial_space']},
  clubhouse:{name:'Clubhouse',dept:'community',signals:['community_space']},
  parking:{name:'Car park',dept:'matchday',signals:['access','nuisance']}
};
const POTS=['transfers','wages','facilities','reserve']; // laag 2: vier potjes (keuze 79)
const HEALTH=['healthy','tight','in_the_red','administration','bankrupt'];
