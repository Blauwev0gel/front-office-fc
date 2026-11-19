
"use strict";
const HAS_DOM=typeof document!=='undefined';
const SAVE_KEY='northmarch-chairman-v1';

/* ================= Static content ================= */
const FIRST=['Alan','Bev','Carl','Dawn','Eddie','Fiona','Gary','Helen','Ian','Jackie','Karen','Lee','Mandy','Neil','Pam','Rob','Sue','Terry','Una','Vic','Wendy','Yusuf','Zara','Priya','Tomasz','Kwame','Siobhan','Declan','Aisha','Rhys','Moira','Glen','Nadia','Owen','Bernie','Hamid','Lorna','Stuart','Ingrid','Dev'];
const LAST=['Ashby','Brook','Crane','Dowd','Ellery','Finch','Garside','Holt','Ince','Jessop','Kerr','Lund','Marsh','Nuttall','Oakes','Pryce','Quinlan','Rudd','Sowerby','Thwaite','Usher','Vasey','Wragg','Yates','Banerjee','Kowalski','Mensah','Doyle','Haddad','Ollerton','Pickles','Rowntree','Sefton','Tranter','Whitlock','Agyeman','Bairstow','Corrigan','Dunleavy','Fairclough'];
const TRAITS=['stubborn','proud','sly','honest','vain','loyal','ambitious','cautious','warm','resentful','impulsive','patient','principled','greedy'];
const VALUES=['money','glory','loyalty','recognition','control','community'];
const VALUE_WORD={money:'money',glory:'glory',loyalty:'loyalty',recognition:'recognition',control:'control',community:'community'};
const TOWNS={
 harbour:{n:'Harbour town',wk:'The Docks',bar:'The Anchor',w:{workers:5,business:3,students:2,families:2,ultras:2}},
 mill:{n:'Mill town',wk:'The Mill',bar:'The Weavers Arms',w:{workers:5,oldguard:4,families:3,ultras:2}},
 cathedral:{n:'Cathedral city',wk:'The Works',bar:'The Bishop\'s Head',w:{oldguard:4,students:4,business:3,retirees:3}},
 resort:{n:'Seaside resort',wk:'The Works',bar:'The Pier Bar',w:{traders:5,retirees:4,families:3,newcomers:2}},
 newtown:{n:'New town',wk:'The Works',bar:'The Social Club',w:{newcomers:5,families:4,business:3,volunteers:2}},
 mining:{n:'Mining valley',wk:'The Pit',bar:'Miners\' Welfare',w:{workers:5,oldguard:4,volunteers:3,ultras:2}}};
const ARCH={
 workers:{n:null,wants:'Beat the rival. No outside investor.',motion:{t:'No outside owner above 25%, ever',against:'business'}},
 oldguard:{n:'Old Guard',wants:'Results and tradition. No adventures.',motion:{t:'A chairman may serve two terms at most',against:null,anti:true}},
 families:{n:'Families',wants:'Affordable tickets. Our own youngsters.',motion:{t:'Freeze ticket prices for three seasons',against:'business',cost:30}},
 ultras:{n:'Ultras',wants:'A standing terrace. Keep the icons.',motion:{t:'Bring back a standing terrace',against:'retirees',cost:15}},
 students:{n:'Students',wants:'Attacking football. Cheap tickets.',motion:{t:'Half-price student season tickets',against:'business',cost:15}},
 business:{n:'Business',wants:'Healthy books. A new stadium.',motion:{t:'Allow outside investment up to 49%',against:'workers',gain:100}},
 retirees:{n:'Retirees',wants:'Seats and peace. Honour the old names.',motion:{t:'Seats in every stand, no standing',against:'ultras'}},
 traders:{n:'Traders',wants:'Busy matchdays. Parking.',motion:{t:'A matchday parking scheme',against:null,cost:10}},
 newcomers:{n:'Newcomers',wants:'A modern club. A women\'s team.',motion:{t:'Start a women\'s team',against:'oldguard',cost:20}},
 volunteers:{n:'Volunteers',wants:'A say. It\'s the volunteers\' club.',motion:{t:'A members\' council with a veto on big spending',against:null,anti:true}}};
const STATUTE=['Two-thirds majority to change anything at the AGM','No outside owner above 25%','Members approve any sale above £50k','Ticket prices are set by the members'];
const SCAR=['relegated three times in ten years','went into administration in 2009','lost a cup final to their rivals','sold the ground and rent it back','a match-fixing scandal in the eighties'];
const RIVALRY=['the 1984 strike','a captain sold to them on deadline day','a shared ground they were thrown out of','a cup semi-final nobody has forgiven','the bus company that served one town and not the other'];
const SUFFIX=['United','Town','Athletic','Rovers','Albion','City','Vale','Wanderers'];
const TOWNNAMES=['Saltmere','Kestle','Brackwater','Dunmore','Fenwick','Holbeck','Ilsworth','Marrow Bay','Northcliffe','Ottery','Ravensby','Selcombe','Tarn Valley','Wexmoor','Yarrowby','Ashcombe','Blackridge','Cragmoor','Downholme','Eastwick','Farleigh','Gorsedale','Hadley Cross','Irwell','Kilnsey','Longthwaite','Mardale','Netherby','Penhallow','Rothmere','Skelwith','Ullsby','Varley'];
const ROLE_WORD={coach:'Head coach',td:'Director of football',captain:'Captain',fan:'Supporters\' leader',opp:'Opposition candidate',chair:'Chairman',journalist:'Chief reporter, The Echo',finance:'Finance director'};
const DEEP={
 coach:{money:'a contract that finally pays like a real job',glory:'a promotion with their name on it',loyalty:'a chairman who stands by them through a bad run',recognition:'to stop being called a stopgap',control:'the final say on who plays',community:'a team built on local players'},
 td:{money:'a budget they do not have to beg for',glory:'one signing the whole region talks about',loyalty:'to stay at the club that gave them their start',recognition:'public credit for the players they find',control:'nobody interfering in recruitment',community:'an academy for the town\'s kids'},
 captain:{money:'one last contract that looks after the family',glory:'to lift something before they retire',loyalty:'to finish their career here',recognition:'to be remembered as a club great',control:'a say in how the dressing room is run',community:'to coach the kids when the legs go'},
 fan:{money:'cheaper tickets for the regulars',glory:'to see the club go up in their lifetime',loyalty:'that the club never forgets its old supporters',recognition:'the supporters\' name on something permanent',control:'a vote on the big decisions',community:'the ground open to the town on weekdays'},
 opp:{money:'a stake in the club\'s future',glory:'to be the one who saved the club',loyalty:'revenge for how the last board treated their friends',recognition:'a seat at the table their family never got',control:'to run the club like their own business',community:'to hand the club back to the members'},
 chair:{money:'a club that pays its own way',glory:'to beat their rival to promotion',loyalty:'friends they can count on at the league meeting',recognition:'respect from the bigger clubs',control:'to run their club without the league meddling',community:'a region where small clubs survive'},
 finance:{money:'books that balance every season',glory:'to be the one who got the club out of debt',loyalty:'a chairman who listens before spending',recognition:'credit when the bank is happy',control:'a veto on reckless spending',community:'a club that pays local suppliers on time'},
 talent:{money:'a first professional contract',glory:'a debut in front of a full house',loyalty:'to play for the club they grew up watching',recognition:'to be picked on merit',control:'a say in their own future',community:'to make the town proud'},
 journalist:{money:'a story that sells papers',glory:'a scoop the nationals pick up',loyalty:'sources who stay with them',recognition:'their byline on the big story',control:'to set the agenda, not follow it',community:'clubs that answer to their towns'}};
const DEEPQ={money:'"I\'ve given years to this. I\'d like to be paid like I matter."',glory:'"I want one thing people remember. Just one."',loyalty:'"Stand by me when it goes wrong. That\'s all I ask."',recognition:'"Everyone gets the credit but me. Once, I\'d like it said out loud."',control:'"Let me do my job without someone looking over my shoulder."',community:'"This club belongs to the town. I want the town to feel it."'};
const TONE=[['"Say it and go."','"I\'ve nothing to say to you."','"You\'ve got a nerve."'],['"{opp} returns my calls, chairman. You don\'t."','"I hear you\'ve been busy. Not with me."','"Funny. {opp} asked after you yesterday."'],['"Chairman."','"Keep it short?"','"What can I do for you?"'],['"Good to see you."','"Pull up a chair."','"Come in, come in."'],['"For you, always."','"Sit down, I\'ll get them in."','"There they are! The lads were asking after you."']];
const FLAVOUR={stubborn:'"If this is about changing my mind, save your breath."',proud:'"I don\'t usually wait for people."',sly:'"Funny, I was just talking about you."',honest:'"I\'ll be straight with you."',vain:'"Did you see the paper? They spelled my name right for once."',loyal:'"Whatever the club needs."',ambitious:'"I\'ve plans, chairman. Big ones."',cautious:'"Let\'s not rush anything."',warm:'"How are you holding up?"',resentful:'"I remember the last person who sat in that chair."',impulsive:'"Go on then, spit it out."',patient:'"Take your time."',principled:'"As long as this is above board."',greedy:'"Is this about money? I hope it\'s about money."'};
const STRONG={money:['money'],glory:['name','role'],loyalty:['security'],recognition:['name','role'],control:['power'],community:['role']};
const WEAK={money:['name'],glory:['security'],loyalty:['money'],recognition:['money'],control:['ask'],community:['money']};
const BLOCK_ENDS=[8,15,23,30];
const MONTH=['','July','October','January','April'];
const GAIN={S:8,M:15,L:22};
const SIZE_WORD={S:'Small promise',M:'Medium promise',L:'Big promise'};
