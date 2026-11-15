/* ---------- world constants ---------- */
const TIERS = [null, 'The Premiership', 'First Division', 'Second Division', 'Third Division', 'National Conference', 'Regional Premier', 'County Senior League', 'County League'];
const tierAvg = t => 5 + (8 - t) * 1.4;
const S = t => Math.pow(1.38, (8 - t) * 1.4);
const sc = () => S(G.club.tier);
const M = x => { const v = x * sc(); const m = v >= 1e6 ? 10000 : v >= 1e5 ? 1000 : v >= 1e4 ? 100 : 10; return Math.round(v / m) * m; };
function money(v) { const s = v < 0 ? '−' : ''; v = Math.abs(v); if (v >= 1e6) return s + '£' + (v / 1e6).toFixed(v >= 1e7 ? 1 : 2) + 'm'; if (v >= 1e3) return s + '£' + (v / 1e3).toFixed(v >= 1e5 ? 0 : 1).replace(/\.0$/, '') + 'k'; return s + '£' + Math.round(v); }
const CAPREQ = { 1: 20000, 2: 12000, 3: 7000, 4: 4500, 5: 3000 };

const TOWN_A = ['Ash', 'Bram', 'Carl', 'Dun', 'Elm', 'Fen', 'Glen', 'Hart', 'Ivel', 'King', 'Lang', 'Mill', 'North', 'Oak', 'Pen', 'Queens', 'Raven', 'Stan', 'Thorn', 'Wey', 'Whit', 'Ald', 'Bex', 'Cray', 'Dray', 'Eas', 'Frome', 'Gort', 'Hol', 'Kel', 'Lyn', 'Mar', 'Ned', 'Orr', 'Pres', 'Rud', 'Sel', 'Tad', 'Wil', 'Brack', 'Cold', 'Har', 'Lud', 'Sax'];
const TOWN_B = ['ford', 'ley', 'ton', 'bridge', 'wick', 'field', 'mouth', 'by', 'ham', 'stead', 'worth', 'gate', 'pool', 'haven', 'borough', 'well', 'moor', 'combe'];
const SUFFIX = ['United', 'Town', 'Athletic', 'Rovers', 'City', 'Albion', 'Wanderers', 'FC', 'Borough', 'Villa', 'Rangers', 'Sporting'];

const MORE_DOM = ['Ashworth', 'Bramley', 'Carver', 'Dunmore', 'Ellison', 'Fairley', 'Gaskell', 'Hollins', 'Ingham', 'Jessop', 'Kenworthy', 'Lockett', 'Mabry', 'Nuttall', 'Oakes', 'Pendle', 'Quarry', 'Rowntree', 'Sutcliffe', 'Tindall', 'Underwood', 'Varley', 'Whitlock', 'Yardley', 'Aldridge', 'Birtles', 'Cropper', 'Denholm', 'Eccles', 'Fowler', 'Garside', 'Hesketh', 'Kitchen', 'Lightfoot', 'Midgley', 'Norbury', 'Ormerod', 'Pickup', 'Ramsden', 'Shackleton', 'Thwaite', 'Wardle'];
const MORE_FIRST = ['Adam', 'Billy', 'Charlie', 'Ethan', 'Finley', 'George', 'Isaac', 'Jake', 'Kyle', 'Leo', 'Mason', 'Noah', 'Oscar', 'Rhys', 'Toby', 'Will', 'Zach', 'Alex', 'Ellis', 'Jordan'];
const REGIONS = {
  dom: { name: 'Domestic', cost: 1.0, adapt: 0, first: ['Jack', 'Harry', 'Callum', 'Liam', 'Ryan', 'Ben', 'Tom', 'Josh', 'Kieran', 'Owen', 'Lewis', 'Dan', 'Sam', 'Connor', 'Jamie', 'Alfie', 'Reece', 'Nathan'], last: ['Hart', 'Walsh', 'Barker', 'Cole', 'Fenton', 'Dawson', 'Price', 'Holt', 'Marsh', 'Reid', 'Shaw', 'Tanner', 'Webb', 'Doyle', 'Pike', 'Lowe', 'Croft', 'Ashby', 'Norris', 'Quinn'] },
  low: { name: 'Low Countries', cost: 0.9, adapt: 0.06, first: ['Daan', 'Joost', 'Ruben', 'Sem', 'Milan', 'Thijs', 'Lars', 'Bram', 'Jesse', 'Wout', 'Niels', 'Koen'], last: ['de Vries', 'Bakker', 'Visser', 'Smit', 'Mulder', 'de Boer', 'Peeters', 'Janssens', 'Maes', 'Kok', 'Hendriks', 'Verbeek'] },
  sca: { name: 'Scandinavia', cost: 0.85, adapt: 0.06, first: ['Erik', 'Magnus', 'Oskar', 'Anders', 'Sindre', 'Elias', 'Jonas', 'Mikkel', 'Viktor', 'Aksel'], last: ['Lindqvist', 'Hansen', 'Berg', 'Nyström', 'Dahl', 'Eriksen', 'Holm', 'Solberg', 'Strand', 'Lund'] },
  ibe: { name: 'Iberia', cost: 0.95, adapt: 0.1, first: ['Pablo', 'Diego', 'Iker', 'Rui', 'Tiago', 'Álvaro', 'Sergio', 'Nuno', 'Marcos', 'Hugo'], last: ['García', 'Ferreira', 'Moreno', 'Santos', 'Ruiz', 'Costa', 'Navarro', 'Pires', 'Ortega', 'Vidal'] },
  sam: { name: 'South America', cost: 0.7, adapt: 0.22, first: ['Mateo', 'Thiago', 'Lautaro', 'Bruno', 'Facundo', 'Gabriel', 'Nicolás', 'Felipe', 'Joaquín', 'Enzo'], last: ['Silva', 'Pereyra', 'Gómez', 'Rodrigues', 'Acosta', 'Medina', 'Rojas', 'Cabral', 'Benítez', 'Souza'] },
  waf: { name: 'West Africa', cost: 0.6, adapt: 0.2, first: ['Kwame', 'Ibrahim', 'Moussa', 'Kofi', 'Seydou', 'Emeka', 'Yaw', 'Abdoulaye', 'Chidi', 'Mamadou'], last: ['Mensah', 'Diallo', 'Traoré', 'Okafor', 'Boateng', 'Koné', 'Sarr', 'Adeyemi', 'Camara', 'Owusu'] },
  eeu: { name: 'Eastern Europe', cost: 0.75, adapt: 0.14, first: ['Luka', 'Marek', 'Andrei', 'Dmytro', 'Petar', 'Tomasz', 'Bogdan', 'Filip', 'Nikola', 'Pavel'], last: ['Novak', 'Kowalski', 'Popescu', 'Horvat', 'Petrov', 'Kovač', 'Nowak', 'Ionescu', 'Marić', 'Bondar'] },
};
REGIONS.dom.last.push(...MORE_DOM); REGIONS.dom.first.push(...MORE_FIRST);
const MORE_LAST = { low: ['Wouters', 'Claes', 'Meijer', 'Dekker', 'Brouwer', 'Vos', 'Jacobs', 'Willems'], sca: ['Aas', 'Bakke', 'Ek', 'Lie', 'Moen', 'Sand', 'Vik', 'Wik'], ibe: ['Pinto', 'Ramos', 'Cruz', 'Lopes', 'Ortega', 'Rocha', 'Vidal', 'Serra'], sam: ['Rojas', 'Acosta', 'Medina', 'Vargas', 'Herrera', 'Ríos', 'Castro', 'Sosa'], waf: ['Owusu', 'Koné', 'Bamba', 'Sarr', 'Adeyemi', 'Boateng', 'Camara', 'Okafor'], eeu: ['Horvat', 'Kovač', 'Lis', 'Marin', 'Babić', 'Zając', 'Ionescu', 'Petrov'] };
for (const k in MORE_LAST) if (REGIONS[k]) REGIONS[k].last.push(...MORE_LAST[k]);

