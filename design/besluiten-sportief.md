# Besluiten sportieve organisatie

Werklijst voor alle problemen uit `design/analyse-sportief.md` (**A**) en `design/analyse-structuur-sportief.md` (**S**).
De eigenaar beslist per ronde; daarna wordt gebouwd. Echte ontwerpbesluiten gaan ook naar het besluitenlog in `BIBLE.md`.

Status: **open** · **besloten** · **gebouwd** · **getest**. Type: bug · misleidend · dubbel · ontwerp · balans · opschonen.

## Ronde 1 — Repareren

| Id | Probleem | Bron | Type | Status |
|---|---|---|---|---|
| R1 | De mini-kop breekt op People, Data en Decisions: het bevoegdheidsblok wordt in de kop geperst ("H C", "Sho leas"). | S §3.3 | bug | getest |
| R2 | Het budgetsegment toont "Lean" bij een budget onder Lean (Recruitment £90 tegenover £195). | S §3.3 | misleidend | getest |
| R3 | "Wrong calls: frequent" (voorspelde kans) staat naast "0 against your mandate" (werkelijke telling). | S §3.3 | misleidend | getest |
| R4 | De grade-badge van een kandidaat toont de huidige grade, de tekst de grade van toen (D tegenover "grade B"). | S §3.3 | misleidend | getest |
| R5 | Coach-afspraken met een deadline na week 34 lopen nooit af ("Top two", laat "youngsters"/"top half"). Daarna kan er nooit meer een target worden afgesproken. | A §4.2 | bug | getest |
| R6 | "Loan him out" en "One more season" in *Is he ready?* worden aan het seizoenseinde teruggedraaid door het academiemandaat. | A §4.4 | bug | getest |
| R7 | Het ontslagsheet van de coach toont andere effecten op board, press en relaties dan er werkelijk gebeuren. | A §4.2 | misleidend | getest |
| R8 | De hint "Back the coach: recruitment more conservative" (coach–DoF-clash) belooft een effect dat niet bestaat. | A §4.1 | misleidend | getest |
| R9 | De push "First team" belooft "Squad morale up", maar heeft geen effect op morale. | A §6 | misleidend | getest |
| R10 | "Next trial day in week 28" staat er ook na week 28. | S §3.3 | bug | getest |
| R11 | Het label "Academy players protected in squad" suggereert speeltijd; de regel beschermt alleen tegen verkoop. | A §4.4 | misleidend | getest |
| R12 | De bijbel (§9.2) zegt dat de tests de zomer via v1 draaien; ze draaien al via v2. | A §3 | misleidend (doc) | getest |

## Ronde 2 — Structuur van een afdeling

| Id | Probleem | Bron | Type | Status |
|---|---|---|---|---|
| T1 | De tabs (Overview, People, Data, Decisions) zijn bakken voor soorten inhoud, niet antwoorden op vragen. Voorstel: Now / Plan / People / Record. | S §4.1 | ontwerp | open |
| T2 | De status-chip ("2 to fix") en "5 need attention" zeggen niet wat er mis is. Een rode rij buiten de eerste vier tegels is onzichtbaar. | S §3.1 | misleidend | open |
| T3 | "All numbers" herhaalt de KPI-tegels. | S §3.2 | dubbel | open |
| T4 | "Full academy report" is een tweede academiescherm in het eerste. | S §3.2 | dubbel | open |
| T5 | Recruitment Data is ongeveer 3.000 px, met dezelfde signings in drie lijsten. | S §3.2, §3.5 | dubbel | open |
| T6 | De regio's staan vier keer (kaart, focuschips, tripchips, mandaat). | S §3.5 | dubbel | open |
| T7 | Het budget heeft twee bedieningen: een schuif van 0–100 in het mandaat en een knop met drie standen. | S §3.5 | dubbel | open |
| T8 | Kale getallen zonder schaal of oordeel (relatie 44, "Follows mandate 71%", netwerk 21/100, ±1.7★, categoriescore). | S §3.4 | ontwerp | open |
| T9 | "Holding it back" (oorzaak plus knop) staat verstopt op de Data-tab. | S §3.1 | ontwerp | open |
| T10 | Een inboxbericht linkt niet naar de afdeling. | S §3.7 | ontwerp | open |
| T11 | Wat een hoofd namens de CEO besliste, is alleen een telling ("16 staff calls"). | S §3.7 | ontwerp | open |
| T12 | Het statuswoord weegt de rijen niet ("Good" op de 11e plek). | S §3.3 | misleidend | open |
| T13 | Dezelfde instelling kost via de ene route 1 AP en via de andere niets (mandaat, chips, budget, debrief). | A §4.1, S §2 | ontwerp | open |
| T14 | "+25 vs your mandate" en "Friction" zeggen niet wat het kost. | S §3.1 | ontwerp | open |
| T15 | Talk en Sack staan in de kop op elke tab; het coachgesprek staat twee keer. | S §3.5 | dubbel | open |

## Ronde 3 — Rollen en eigenaarschap

| Id | Probleem | Bron | Type | Status |
|---|---|---|---|---|
| O1 | De Chief Scout zit half tussen eigen afdeling en DoF-staf in (eigen mandaat en gesprek, geen bevoegdheid, KPI of inbox). | A §3, §4.3 · S §3.6 | ontwerp | open |
| O2 | Medical bestaat alleen als push zonder eigenaar. | A §3 | ontwerp | open |
| O3 | Proefdag: de briefing belooft dat de CEO kinderen kiest, het scherm laat dat niet toe. Mag de CEO dat überhaupt (P1)? | A §4.4 · S §3.3 | ontwerp | open |
| O4 | "Give him minutes" negeert de wil van de coach (P7). | A §4.2 | ontwerp | open |
| O5 | Zes routes voor jeugdminuten, verspreid over vijf schermen. | A §5 · S §3.6 | ontwerp | open |
| O6 | Bij "blocked by rule" is niet zichtbaar welke regel van de DoF is en welke van Finance. | A §4.1 · S §4.3 | ontwerp | open |
| O7 | Het academiemandaat bevat eerste-elftalzaken (beschermde spelers, mentoren). | S §3.6 | ontwerp | open |
| O8 | Hoeveel academiediepte hoort op de telefoon (jeugdtabellen, jeugdstaf, Youth Cup)? | S §7 | ontwerp | open |

## Ronde 4 — Doorwerking en balans

| Id | Probleem | Bron | Type | Status |
|---|---|---|---|---|
| D1 | Het DoF-schuifje Scout's eye ↔ Data doet niets in de live pipeline; de persoonlijkheid (LEAN) van de DoF hangt eraan. | A §4.1 | balans | open |
| D2 | De scout-schuifjes Proven ↔ Potential en Data zijn dood; zijn LEAN hangt eraan. Rapporten negeren boost, grip en staf. | A §4.3 | balans | open |
| D3 | De DoF-attributen Judgement en Network doen (bijna) niets. | A §4.1 | balans | open |
| D4 | Geen van de vier coachschuifjes verandert punten; "your way" is gratis relatie. | A §4.2 | balans | open |
| D5 | Grip beloont klikken en bestraft delegeren. | A §5 | balans | open |
| D6 | Academy credibility heeft geen gevolg. | A §4.4 | balans | open |
| D7 | Hits en misses gaan altijd naar de DoF, ook als de scout misleest. | A §4.3 | ontwerp | open |
| D8 | Clash-uitkomsten zijn alleen relatie ±. | A §5 | ontwerp | open |
| D9 | De scout heeft geen moment in het seizoen; de DoF is stil tussen de windows. | A §4.1, §4.3 | ontwerp | open |
| D10 | De DoF-waarschuwing in de debrief (`dofStrikes`) wordt nergens gebruikt. | A §4.1 | ontwerp | open |
| D11 | "Question the misses: data focus up" verschuift een dood schuifje. | A §4.1 | misleidend | open |
| D12 | Lage trainingsintensiteit lijkt dominant (minder blessures, gelijke punten). | A §4.2 | balans | open |
| D13 | `test/audit.js` laadt loop, dossiers, pathway en matchday niet; de stijl "active" kiest wat de staf kiest. De audit meet zo geen CEO-oordeel. | A §5 | opschonen | open |

## Buiten deze rondes (fase 2, opschonen)

| Id | Probleem | Bron | Status |
|---|---|---|---|
| X1 | Dode delen van `summer.js` (`sumRound`, `sumPending`, `sumAnswer`, `sumStep`, de oude `sumAuto`, `sumMigrate`). | A §3 | open |
| X2 | Onbereikbare `resBuy`-UI van het eerste elftal (`ft-buy`). | A §4.2 | open |
| X3 | `vAcademy` wordt dode code zodra T4 gebouwd is. | S §4.4 | open |

## Ontwerpnotities

### Ronde 1 (besloten 15-11-2026)
Alleen reparaties, geen nieuwe state behalve twee veilige velden: `p.loanCEO` (academiespeler) en `deal.s` (seizoen van een coach-afspraak).
- R2: het budget krijgt de toestand "Cut" onder Lean (`business.js` `lvOf`); geen knop licht dan op en de rij zegt "Cut below Lean".
- R5: targets worden uiterlijk in week 34 afgerekend; opties die niet meer kunnen, verschijnen niet; buiten het seizoen geen targets; oude afspraken met een deadline na week 34 of uit een vorig seizoen worden bij het laden opgeruimd (`firstteam.js` `ft()`).
- R8/R9: teksten aangepast aan wat er gebeurt; echte gevolgen van clashes volgen in ronde 4 (D8).
- Getest: build, alle `node test/*.js` (incl. `mig.js` en een kleine `audit.js`), een scriptcheck van de afspraken (top two, youth laat, top half, unbeaten, oude save), screenshots op 390 px licht en donker.

