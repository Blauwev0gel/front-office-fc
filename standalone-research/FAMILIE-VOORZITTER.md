# Familie en dynastie in De Voorzitter (ontwerpnotitie)

*21-11-2026, keuze 76. Een uitbreiding op de kern (keuze 75) en getoetst aan de pijlers. De speler speelt elk seizoen, zonder sprongen in de tijd.*

## Waarom (pijlers)
- **Pijler 1, een spoor over generaties:** jouw keuzes leven door in je erfgenaam en in de vetes en verbonden die je nalaat.
- **Pijler 2, de club leeft:** mensen hebben bloedbanden, eigenschappen die ze erven, en een geheugen dat overgaat op hun kinderen.
- **De bron:** Crusader Kings. Personages met eigenschappen, dynastieën, opvolging en vetes. We nemen **alleen wat beslismomenten oplevert, geen stamboom-spreadsheet.**

## 1. Karakters met eigenschappen (de basis)
- **Iedereen** (voorzitter, familie, staf, ledenleiders, rivalen) heeft **2 eigenschappen**, zoals ambitious, loyal, resentful, proud, honest, greedy of patient. Die bestaan al in de code en sturen de loyaliteit.
- **Kinderen erven 1 eigenschap** van een ouder, plus 1 eigenschap die door opvoeding en gebeurtenissen ontstaat. Jouw keuzes kunnen die beïnvloeden: een kind dat je in de academie liet spelen, wordt eerder *ambitious*.
- **Eigenschappen sturen het gedrag:** hoe iemand een crisis oplost, of hij je volgt, of hij wraak neemt.

## 2. Je eigen dynastie
- **Bij de start** kies je je achtergrond (keuze 72). Daaruit volgen je leeftijd (standaard 48–55), een partner en 1–3 kinderen die elk seizoen ouder worden.
- **Opvolging** gebeurt bij pensioen (vanaf ±68 kies je zelf), gezondheid (een kleine kans per seizoen na 65), weggestemd worden, of overlijden.
- **Een ledenclub is geen erfgoed.** Je erfgenaam moet bij de volgende ALV **zelf gekozen worden**. De familiereputatie en de eigenschappen van de erfgenaam tellen mee. Een gekozen erfgenaam is een generatie verder; een weggestemde erfgenaam zet de dynastie op een andere club voort, of laat haar wachten.
- **Het dynastieboek:** generaties, seizoenen, trofeeën, en de grote sporen ("Grandfather sold the ground; we bought it back").
- **Tijd (eerlijk):** zonder sprongen in de tijd is een generatie ±15–20 seizoenen. Daarom levert de familie ook binnen één generatie al momenten op (zie 3 en 4).

## 3. Familie in de club
- **Een kind met een voetbalambitie** kan de academie in. De vraag "speelt hij omdat hij goed is, of omdat hij jouw zoon is?" levert beslismomenten op met de trainer en de leden.
- **Familieleden willen een functie** (TD, commercie, bestuur). Ze zijn loyaal, maar hun kwaliteit is onzeker. Nepotisme kost steun bij groepen als de Old Guard en de Business-leden.
- **Familiegebeurtenissen:** een schandaal, een kind dat breekt met de club, een partner die wil dat je stopt.

## 4. Families in de wereld
- **3–5 oude clubfamilies** zijn verbonden aan ledengroepen ("The Rowntrees have led the Old Guard for sixty years").
- **Rivaliserende voorzittersfamilies** bij andere clubs.
- **Vetes en verbonden gaan over op de volgende generatie.** Wat je de vader aandeed, onthoudt de zoon.
- **Lichte verbonden:** een kind dat verkering krijgt in een rivaliserende familie, een huwelijk dat een ledengroep aan je bindt, een familie die een tegenkandidaat steunt bij de ALV.

## Nieuwe triggers voor een beslismoment
| Trigger | Voorbeeld van een keuze |
|---|---|
| Een kind kiest zijn pad | Academie · studie en dan de zakenwereld · de club uit laten |
| Een familielid wil een functie | Aannemen (loyaal, onzeker) · weigeren (de familie gekwetst) |
| Je zoon speelt slecht in het eerste elftal | De trainer laten beslissen · beschermen · verhuren |
| Een familie-schandaal | Opbiechten · toedekken · opofferen |
| Een verbond aangeboden | Aangaan (een groep bindt zich, een andere wordt jaloers) · afslaan |
| Een vete laait op | Uitpraten · terugslaan · negeren |
| Opvolging | Wie draag je voor, en wanneer stop je? |

## Grenzen (de pijlers bewaken)
- **Geen stamboomscherm als spreadsheet.** De familie is een kaart met portretten in het clubboek.
- **Hooguit één familiemoment per 2–3 sessies.** De club en het voetbal blijven de kern.
- **Geen nieuwe meters.** Familiereputatie hangt aan de bestaande reputatie (`S.rep`) en de loyaliteit van personen.
- **De papieren proef toetst** of familiemomenten "mijn keuze deed ertoe" versterken, of de aandacht van het voetbal weghalen.

## Wat al bestaat en hergebruikt wordt
Eigenschappen en waarden per persoon, loyaliteit met geheugen (`loy`, `mem`), relaties (`addRel`), reputatie (`S.rep`), mensen die meegaan naar een volgende club (keuze 73), en de ALV als verkiezing.
