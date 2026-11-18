# Prompt: de CEO als bouwer van de club (ontwerp, daarna bouwen)

*Voor Claude op `claude-game`. Herschreven versie van de ontwerpopdracht "De CEO als actieve bouwer van een voetbalclub", toegesneden op dit project. Besluit van de eigenaar (B58): **de speler blijft CEO, maar met eigenaarsbevoegdheden.** Veel eigenaarszaken (financiering, partnerships, grond, stadion, samenwerking met clubs) horen gewoon bij een CEO.*

---

Je werkt als game designer, simulatieontwerper en iemand die weet hoe voetbalclubs bestuurd worden. Nederlands in het gesprek, Engels in het spel. Volg `CLAUDE.md`.

## De vraag
Hoe wordt het actief, verrassend en leuk om een club **op te bouwen**, terwijl anderen het voetbalwerk doen? Ook een speler die alle wedstrijden, transfers en tactiek aan zijn staf overlaat, moet iets te doen hebben dat ertoe doet.

De toets na vijf tot tien seizoenen: *"Deze club is geworden wat zij is door wie ik aanstelde, welke kansen ik zag, welke relaties ik bouwde en welke richting ik koos."*

## Grenzen (bindend)
- **CEO met eigenaarsbevoegdheden.** De speler kan zelf het initiatief nemen tot financiering, partnerships, grond- en stadionzaken, samenwerking met andere clubs en langlopende commerciële afspraken. Hij onderhandelt daar **zelf** over. Dat is eigenaarsniveau, geen spelerstransfer.
- Er blijft **een bestuur** dat oordeelt. De verliesconditie (ontslag, B2) blijft gelden. Grote stappen (een investeerder met zeggenschap, schuld, grond) gaan langs het bestuur, en dat is een kans op een interessant gesprek, geen formaliteit.
- **Nooit:** het elftal kiezen, tactiek bepalen, zelf onderhandelen over spelers (B1). Ook geen aandelenhandel, fusies of overnames in deze ronde; dat kan later, als de basis werkt.
- Geen nieuwe meters, valuta, actiepunten of verplichte wekelijkse taken. Geen "koop een niveau hoger".
- Mobiel (P5): elke onderhandeling past in korte rondes met duidelijke kaarten, geen dialoogboom.
- Bouw op wat er is:
  - het afsprakenmodel (`G.agr` in `agreements.js`: eigenaar, doel, uitvoering, beoordeling);
  - de wereld (`world.js`);
  - commercial, business en finance;
  - DNA, het bestuur en de backers;
  - de desk;
  - de Gazette.

  Geen tweede systeem ernaast.

## Wat er al is, en wat de kritiek raakt (lees de code, bevestig of weerleg)
- **Projecten uit de bestuursvergadering** zijn nu "betaal, wacht, upgrade" (`engine/09`, `projectsWeekly`). Dat is precies het patroon dat we niet willen.
- **Heads** hebben karakter (ego, risico, ambitie, loyaliteit), maar **geen netwerk.** Een vertrek kost nu niets aan relaties.
- **De wereld** kent spelers en clubs, maar **geen partijen met eigen belangen**: geen gemeente, geen investeerders, geen sponsorstrategie en geen clubs die financieel in de problemen raken.
- **De initiatief-loop** (CEO-2) werkt al voor sportieve problemen. Gebruik dat patroon: zien → bevragen → afspreken → uitvoeren → beoordelen.

## Opdracht
### 1. Diagnose (kort, hooguit ±2 pagina's)
- Wat doet de speler nu als bouwer? Wat werkt al, wat bestaat half, wat ontbreekt, en wat moet anders?
- Zeg bij elke bewering of je het **gelezen** (code), **gemeten** of **vermoed** hebt.

### 2. Eén motor: projecten als trajecten
Ontwerp één mechaniek, en geen vijf: een traject met deze stappen:
1. kans
2. onderzoek
3. betrokken partijen met hun belangen
4. routes
5. eigenaar en mandaat
6. onderhandeling
7. uitvoering door de staf
8. tegenslag of verandering
9. uitkomst
10. nieuwe mogelijkheden

Projecten kunnen elkaar versterken, vertragen of uitsluiten.

Leg vast:
- welke state erbij komt;
- hoe het traject zich elke week ontwikkelt;
- wat de CEO zelf doet en wat de staf doet;
- wat er gebeurt als hij niets doet.

### 3. Een paar partijen met eigen belangen
Niet meer dan vier:
- de gemeente;
- een lokale investeerder;
- de hoofdsponsor;
- een rivaliserende club.

Elk heeft doelen, informatie en een alternatief. Ze handelen ook zonder de speler: een kans kan verdwijnen, of door een ander worden gepakt. Kansen ontstaan uit de toestand van de wereld, niet als losse inboxberichten.

### 4. Onderhandelen op CEO-niveau
- Twee tot drie rondes. Elke ronde draait om **belang, informatie, alternatief, concessie en vertrouwen**.
- Laat zien hoe een onderhandeling verandert als de speler van strategie wisselt, of als er nieuw bewijs komt.
- De betrokken head (Finance of Commercial) adviseert en mag het oneens zijn.

### 5. Groei als capaciteit, en verlies
Groei bestaat uit **concrete dingen**: een complex, een samenwerking, een investeerder, een netwerk, een gemeente die je steunt. Geen abstracte scores.

Laat ook zien hoe groei verloren gaat: een directeur vertrekt en zijn sponsors gaan mee, een partner trekt zich terug, een investeerder eist zeggenschap.

### 6. Scenario's, alleen die onze systemen kunnen dragen
1. De afhankelijkheid van één hoofdsponsor verminderen.
2. Een trainingscomplex zonder genoeg geld of grond.
3. Een rivaliserende club raakt in de problemen.
4. Een directeur vertrekt en zijn afdeling blijkt op zijn netwerk te draaien.
5. Een onverwachte promotie: stadioncapaciteit, financiering, organisatie.
6. Een eigen scenario uit het pathway-verhaal of de scouting-bets.

Per scenario hooguit één pagina met:
- de uitgangssituatie;
- de partijen en hun belangen;
- wat de CEO zelf kan doen;
- wat de staf doet;
- drie wezenlijk verschillende uitkomsten;
- wat er blijvend verandert;
- waarom het leuk is.

### 7. Drie clubpaden over tien seizoenen (kort)
- een ambitieuze profclub;
- een financieel onafhankelijke lokale club;
- een opleidingsclub.

Laat zien waarom geen van de drie altijd wint, met oorzaken en gevolgen en zonder vast verhaal.

### 8. Kritisch
- Wat bouwen we juist niet?
- Waar dreigt micromanagement, waar passiviteit?
- Wat lijkt leuker dan het is?

## Oplevering
- `notes/ceo-builder.md`, **hooguit ±10 pagina's**, eindigend met **één aanbevolen verticale doorsnede** die we direct bouwen. Mijn verwachting: het trainingscomplex. Dat vervangt de huidige "betaal en wacht"-projecten door één echt traject met de gemeente, een investeerder, Finance en Commercial.
- Bij die doorsnede:
  - de state;
  - de bestanden;
  - de tests met vaste seeds, inclusief "de CEO doet niets" en "een andere partij pakt de kans";
  - wat je weghaalt.
- Daarna **stop je** voor akkoord. Na akkoord bouw je die doorsnede volledig, met tests en een browsercheck op 390 px, en push je naar `claude-game`.
- Maak van voorstellen geen bijbelbesluiten zonder akkoord. Alleen B58 staat vast.
