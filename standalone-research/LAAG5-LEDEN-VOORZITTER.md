# Laag 5: leden en politiek

*22-11-2026. Beschrijft wat er **in de code bestaat** (`voorzitter-fundering`), volgens het sjabloon uit `LAGENMODEL-VOORZITTER.md`. De vereniging als parlement: jij bent gekozen, en de leden kunnen je wegsturen.*

## 1. Bezit (alleen deze laag verandert dit)
- **Ledengroepen** per club (3–4 stuks, `world/world.js` `mkClub`), elk met een aandeel in % en een **stemming** 0–100. Er zijn tien soorten (`ARCH` in `core/content.js`), elk met eigen wensen en een eigen motie:

  | Groep | Wil | Motie |
  |---|---|---|
  | Workers (naam per stad) | De rivaal verslaan; geen investeerder | Nooit een eigenaar boven 25% |
  | Old Guard | Resultaat en traditie | Hooguit twee termijnen voor een voorzitter |
  | Families | Betaalbare kaarten, eigen jeugd | Kaartprijzen drie seizoenen bevriezen |
  | Ultras | Een staantribune, iconen houden | Een staantribune terug |
  | Students | Aanvallend voetbal, goedkope kaarten | Halve prijs voor studenten |
  | Business | Gezonde boeken, een nieuw stadion | Investering tot 49% toestaan |
  | Retirees | Zitplaatsen en rust | Zitplaatsen overal |
  | Traders | Drukke wedstrijddagen, parkeren | Een parkeerregeling |
  | Newcomers | Een moderne club, een vrouwenteam | Een vrouwenteam |
  | Volunteers | Inspraak | Een ledenraad met veto op grote uitgaven |

- **Beloftes** (`chairman/promises.js`): drie per manifest, één uit sport, één uit club en één uit persoon. Elke belofte heeft een grootte (S, M of L), groepen die erom geven, voortgang en een status (open, gehouden, gebroken). Voorbeelden:
  - sport: handhaving, top-acht, promotie, vier punten uit de derby's, 42 goals;
  - club: goedkopere kaarten, sluitende boeken, een vrouwenteam, een staantribune, een ledenraad, drie academiedebuten;
  - persoon: de trainer krijgt het seizoen.
- **Statuten** per club (`STATUTE`), bijvoorbeeld een tweederdemeerderheid of *leden keuren elke verkoop boven £50k goed*. Daarnaast **bindende besluiten** van eerdere ALV's (`binding`).
- **Reputatie** (`S.rep`): stijgt als je beloftes houdt en daalt bij breuk.
- **De oppositie:** de zwakste groep (`oppGroup`) en een oppositiekandidaat.
- **De ALV:** jaarverslag, moties, lobby, sprekers, verdediging en uitslag.

## 2. Níét van deze laag
| Onderwerp | Hoort bij |
|---|---|
| De leiders als personen (loyaliteit, geheugen) | 3 Mensen |
| Kaartprijzen, sponsors, geld | 2 Financiën. Laag 5 zou de signalen moeten lezen (nog niet). |
| Tribunes, het clubhuis | 1 Clubbeheer. Laag 5 zou voorkeurssignalen moeten lezen (nog niet). |
| De familie en opvolging | 7 Dynastie (nog niet gebouwd) |

## 3. Mechanieken (zoals gebouwd)
1. **De stemming verandert** door resultaten, beloftes, kaarten, reacties en geld (`grp`), elke keer met een oorzaak in het logboek.
   - Een voorbeeld: Business daalt als de club rood staat (`flow.js`).
2. **Beloftes worden gevolgd** (`evalP`, `behind`): "op schema" of "achter". Breuk kost reputatie en de stemming van de betrokken groepen.
3. **De ALV in week 30** (`startALV`):
   1. de **drie ontevredenste groepen** dienen elk hun motie in;
   2. jij **lobbyt** (moties steunen of laten vallen);
   3. sprekers;
   4. **jouw verdediging** in vier soorten: *ik had ongelijk*, *we hadden pech* (alleen geloofwaardig als het echt pech was), *kijk wat werkte* of *de trainer liet ons zakken*;
   5. de **stemming**, eventueel met een tweederdemeerderheid.

   Aangenomen moties worden **bindend** en kosten of leveren geld op.
4. **Een oppositie** groeit uit de zwakste groep. Personen onder loyaliteit 4 lopen naar haar over.
5. **Situaties in de post** (`chairman/situations.js`): 19 soorten. Voorbeelden: een poging om iemand weg te halen, een overloper, de aanvoerder, geld, een bod, escalatie, een verhaal, een conflict, een petitie, een terugkeer, de rivaal, de competitie, de derby, een eerste contract, een prijs, een dip, een afscheid, iemand die weg wil, een agenda. Elke situatie heeft afspraakkaarten die groepen en personen raken.

## 4. Acties van de speler
- **Het manifest:** drie beloftes kiezen.
- **Kaarten in de post** kiezen; een gunst inzetten.
- **Reacties,** twee per week: privé of publiek.
- **De ALV:** lobbyen en je verdedigen.
- **Een groep een zetel met veto aanbieden** (in de ALV, `seat`).

## 5. Signalen uit
| Signaal | Naar |
|---|---|
| Stemming per groep, steun, de uitslag van de ALV | De flow: blijf je voorzitter? |
| Bindende besluiten (bijv. kaartprijzen bevroren) | 2 Financiën (nu als geld, nog niet als blokkade) |
| Reputatie | 3 Mensen (startloyaliteit) |
| Verwachtingen (de beloftes) | 4 Voetbal via het mandaat |

## 6. Signalen in
| Signaal | Van |
|---|---|
| Resultaten, derby's, debuten, verkopen | 4 Voetbal |
| Leiders en overlopers | 3 Mensen |
| Kas en rode cijfers | 2 Financiën |
| *Nog niet:* prijssignaal, sponsorsignaal, voorkeurssignaal per gebouw | 1 en 2 |

## 7. Wat de speler ziet
- Het *Members*-tabblad: de groepen met hun aandeel, de stemming in woorden en een pijl, de notities van de voorzitter (beloftes) en de stand.
- De post: situaties met afspraakkaarten.
- De ALV als eigen scène.

## 8. Wat ontbreekt
1. **Reacties op laag 1 en 2:**
   - een staantribune → Ultras +, Retirees −;
   - de kaartprijs → Families en Students;
   - een gokbedrijf als sponsor → Families −.

   Daarmee krijgen prijzen en gebouwen een prijs, en de beloftes *staantribune* en *goedkopere kaarten* een echte betekenis.
2. **Het aantal leden en ledenwerving.** Dat is nodig voor de contributie en verandert het electoraat.
3. **Ledenbesluiten** voor grote bouw, leningen en obligaties (gevraagd door laag 1 en 2).
4. **Coalities** tussen groepen.

## 9. Status
**4 Speelbaar.** Het hart van het verhaal; de ALV is het hoogtepunt van het seizoen.
