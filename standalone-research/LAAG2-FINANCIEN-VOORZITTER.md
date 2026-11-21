# Laag 2: financiën (v3, FM-diepte)

*22-11-2026, v3, concept na keuze 80 (maatstaf Football Manager; diep systeem, de speler ziet een samenvatting met doorklik). Bouwt voort op keuze 79: vier potjes, bankvoorwaarden met blokkades, sponsors alleen aannemen of weigeren. Punten met ❓ zijn open. Bedragen zijn op de schaal van de startclub: derde divisie, omzet ±£2,4m.*

## 1. Bezit (alleen deze laag verandert dit)
- Kas, schulden (per lening), vorderingen en verplichtingen (termijnen).
- Alle inkomsten- en kostenposten (§3, §4).
- Prijzen per vaktype, seizoenkaarten, contributie en horeca-marge.
- Sponsorcontracten per **slot**.
- De begroting met potjes en het loonplafond.
- De bank, leningen, ledenobligaties en investeerders.
- De **licentiestatus** bij de bond: de cijfers die de bond ziet.
- Het grootboek: per week, maand en seizoen. De balans en de kasstroomvoorspelling.

## 2. Níét van deze laag
| Onderwerp | Hoort bij |
|---|---|
| Plaatsen, kiosken, skyboxen, winkelruimte | 1. Financiën leest de ruimte en maakt er opbrengst van. |
| Spelerscontracten, transfers zelf | 4. Financiën leest loonsom, bonussen en transfertermijnen. |
| Aantal leden, vraag per groep, ledenbesluiten | 5 |
| Tv-contract, prijzengeld per divisie, rente, sponsoraanbod, licentieregels | 6 |
| Wie de financieel directeur is | 3 |

## 3. Inkomsten
| Groep | Post | Formule (kern) | Ritme |
|---|---|---|---|
| **Wedstrijddag** | Losse kaarten | Σ per vaktype: min(vraag(prijs), vrije plaatsen) × prijs | Per thuisduel |
| | Seizoenkaarten | Verkocht × prijs. Verlenging = 55–90%, volgens resultaat, prijsstijging en stemming. | Zomer, vooraf |
| | Horeca | Opkomst × besteding per hoofd (£3–6) × min(1, horecaruimte ÷ opkomst) × marge 40% | Per thuisduel |
| | Business en skyboxen | Seats × prijs × bezetting + skyboxen × huur per seizoen | Seizoen (business deels per duel) |
| | Programma, parkeren | Klein, vast per toeschouwer | Per thuisduel |
| | Beker | Recette gedeeld 50/50, plus bekergeld per ronde | Per bekerduel |
| **Commercieel** | Sponsors per slot | Zie §5 | Per kwartaal |
| | Merchandise | Basis × fanbasis × succes × winkelniveau × shirtjaar-bonus (nieuw shirt +40% in de zomer) | Per week, met pieken |
| | Evenementen | Evenementenruimte × boekingen × marge | Per week |
| | **Contributie** | Leden (laag 5) × contributie per soort lid (senior, jeugd, steun) | Begin seizoen |
| **Media en competitie** | Tv-geld | Vast per divisie + per live-duel | Per kwartaal |
| | Prijzengeld | Per eindpositie (tabel van de bond) | Einde seizoen |
| | Solidariteitsgeld | Vast per divisie | Twee keer per jaar |
| **Transfers** | Verkoop | In termijnen, met doorverkooppercentages | Per contract |
| **Overig** | Subsidie (gemeente), giften, verzekeringsuitkering, investering | Gebeurtenissen | Los |

**Prijsgevoeligheid per groep** (vraag uit laag 5, elasticiteit hier):

| Groep | Elasticiteit | Wil |
|---|---|---|
| Families | Hoog (−1,4) | Zit en toegankelijkheid |
| Ultras | Laag (−0,4) | Staan |
| Old Guard | Midden (−0,8) | Vaste plek, seizoenkaart |
| Business | Laag op prijs, hoog op comfort | — |

## 4. Kosten
| Groep | Post | Bron |
|---|---|---|
| **Lonen** | Spelerslonen, staflonen | 4, 3 |
| | Loonbelasting en premies ±20% bovenop | Hier |
| **Bonussen** | Winst-, doel- en promotiebonus, tekengeld | 4 |
| **Transfers** | Aankooptermijnen, makelaarskosten (5–10%) | 4 |
| **Afdelingen** | Zes budgetten (krap, normaal, ruim) | 1 |
| **Stadion en terrein** | Onderhoud, energie, verzekering, gemeentelijke heffing | 1 |
| | Bouw | 1 |
| **Wedstrijddag** | Stewards, politie (hoger bij risicoduels), schoonmaak | Per thuisduel |
| **Ploeg** | Reizen (afstand uitduel), kamp, kleding | 4, 6 |
| **Financiering** | Rente, aflossing, kosten bankgarantie | Hier |
| **Bond** | Licentiekosten, boetes | 6 |
| **Belasting** | Winstbelasting (❓ alleen boven nul, als vereniging laag) | Hier |

## 5. Sponsors (aannemen of weigeren, keuze 79)
**Slots** (elk een eigen contract):

| Slot | Aandeel commercieel | Looptijd |
|---|---|---|
| Hoofdsponsor (shirtborst) | 40% | 1–3 seizoenen |
| Kledingleverancier | 15% | Geld plus kleding; bepaalt de merchandisemarge |
| Mouw | — | 1–2 seizoenen |
| Rug | — | 1–2 seizoenen |
| Trainingskleding | — | 1–2 seizoenen |
| Stadionnaam | — | 3–5 seizoenen |
| Partners (bord, lokaal) | — | Tot 12, klein |

**Elk aanbod** bevat: partner, **karakter** (gok, brouwer, bouw, tech, lokaal mkb, …), basisbedrag, bonusdoelen, looptijd en een clausule. Een clausule is bijvoorbeeld *"exit bij degradatie"* of *"stadionnaam moet zichtbaar"*.

**De hoogte van een aanbod:**
> basis per slot × divisiefactor × (0,7 + 0,3 × vorm) × reputatie × marktgevoel (laag 6)

Het karakter stuurt een sponsorsignaal naar laag 5. Na weigeren komt een nieuw aanbod pas na 2–6 weken.

## 6. Begroting en potjes (keuze 79)
- **Vier potjes:** transfers, lonen (met **loonplafond** per week), faciliteiten en afdelingen, reserve.
- Vastgesteld in de zomer en bij te stellen in januari.
- **Loonstructuur:** een plafond per speler, en maximaal 70% van de omzet (❓ als bondsregel of als eigen grens).
- **Begroting tegenover werkelijk** per post. Een overschrijding geeft een waarschuwing van de financieel directeur.

## 7. Financiering
| Instrument | Werking | Gevolg |
|---|---|---|
| **Rekening-courant** | Kredietlijn tot ±10% van de omzet, hoge rente | Snel; geen voorwaarden tot de grens |
| **Banklening** | Bedrag, looptijd, rente, aflossingsschema | Bij grote leningen **voorwaarden** |
| **Ledenobligaties** | Leden lenen de club geld tegen lage rente | Ledenbesluit (laag 5); het vertrouwen van de leden staat op het spel. Past bij een vereniging. |
| **Hypotheek op het stadion** | Veel geld | Het stadion is onderpand; bij faillissement weg; de Old Guard is fel tegen |
| **Investeerder** | Geld voor invloed (zetel, statutenwijziging) | Laag 5 beslist |
| **Achtergestelde lening van een weldoener** | Lage of geen rente | Een persoon (laag 3) met eigen wensen |

**Bankvoorwaarden** (keuze 79), boven een schuld/omzet-grens van 60%:
- geen nieuwe bouw (blokkade in laag 1);
- het loonplafond omlaag;
- een verkoopopdracht (laag 4);
- minimale kas.

Overtreding: een boeterente, of de lening wordt opeisbaar.

## 8. De licentie van de bond (❓ fictieve regels, de bond hoort bij laag 6)
- **Elk kwartaal** toetst de bond: eigen vermogen, de kasstroomvoorspelling, achterstallige betalingen en de faciliteitseisen (signaal van laag 1).
- **Categorie 1** (gezond), **2** (onder toezicht: transferbeperking) en **3** (sancties: puntenaftrek, of uiteindelijk geen licentie).
- Dit is de "FFP" van ons spel, maar passend bij een kleine vereniging.

## 9. Overzicht en voorspelling
- **Kasstroom per week.** Het ritme is ongelijk: seizoenkaarten in de zomer, tv per kwartaal, sponsors per kwartaal en prijzengeld aan het eind. Daardoor heb je in de winter vaak een kasdip, zoals in het echt.
- **Voorspelling** van 26 weken met een band (laag, midden, hoog volgens resultaten). Elke actie toont wat ze met die lijn doet.
- **Maandoverzicht** met alle posten, de top 5 en de vergelijking met de begroting.
- **Seizoensresultaat:** de winst-en-verliesrekening en de **balans**:
  - bezittingen: stadion en complex (boekwaarde uit laag 1), spelers (boekwaarde uit laag 4), kas, vorderingen;
  - schulden: leningen, obligaties, transfertermijnen.
- **Gezondheid:** gezond → krap → rode cijfers → onder curatele → failliet. Die volgt uit de kas, de schuld/omzet-verhouding en de licentiecategorie.

## 10. Agent: de financieel directeur
- Werkt elke week de begroting bij en waarschuwt bij een dreigende overschrijding of een kasdip in de voorspelling.
- Adviseert over aanbiedingen, met een kwaliteit die laag 3 bepaalt: een slechte FD mist dingen.

## 11. Acties van de speler
- Prijzen zetten per vaktype, voor seizoenkaarten, horeca en contributie.
- Een sponsor aannemen of weigeren; een slot "in de markt zetten".
- De begroting en het loonplafond vaststellen of bijstellen.
- Lenen of aflossen per instrument; ledenobligaties uitschrijven (laag 5 beslist).
- Een seizoenkaartactie starten.
- **Noodmaatregelen:** afdelingen naar krap, een verkoopopdracht, een investeerder toelaten.

## 12. Signalen
**Uit:**
- naar 1: budget goedgekeurd of geweigerd, blokkades;
- naar 3: lonen beschikbaar;
- naar 4: `transferbudget`, `loonplafond`, verkoopopdracht;
- naar 5: prijssignaal, sponsorsignaal, gezondheid, obligatievoorstel;
- naar 6: kredietwaardigheid en licentiecijfers.

**In:**
- van 1: kosten en ruimte (capaciteit per vaktype, horeca, business, skyboxen, winkel, evenementen, tv-geschikt), boekwaarde;
- van 3: staflonen, de kwaliteit van de FD;
- van 4: loonsom, bonussen, transfertermijnen, resultaten;
- van 5: vraag per groep, aantal leden, besluiten;
- van 6: tv-geld en prijzengeld per divisie, rente, sponsoraanbod, licentieregels, het weer.

## 13. Wat de speler ziet (mobiel, keuze 80)
- **Hub-kaart "Money":** kas, een pijl, de gezondheid, en de laagste punt in de voorspelling (*"Lowest: £38k in wk 31"*).
- **Doorklik 1, vijf hoofdlijnen:**
  - wedstrijddag;
  - commercieel;
  - media;
  - lonen;
  - overige kosten.

  Elk met de begroting tegenover werkelijk en een sparkline.
- **Doorklik 2:** het volledige maandoverzicht met alle posten, de balans en de leningen.
- **Doorklik 3:** het grootboek per week.

## 14. Open vragen ❓
1. **Loonplafond van 70% van de omzet:** een bondsregel (laag 6) of alleen een eigen grens?
2. **Ledenobligaties en een hypotheek op het stadion** als instrumenten: akkoord?
3. **Licentie in drie categorieën met puntenaftrek** als zwaarste sanctie: akkoord?
4. **Contributie** als inkomstenpost die de speler zelf zet (met een signaal naar de leden): akkoord?
