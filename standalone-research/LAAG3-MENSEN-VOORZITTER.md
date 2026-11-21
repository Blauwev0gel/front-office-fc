# Laag 3: mensen

*22-11-2026. Beschrijft wat er **in de code bestaat** (`voorzitter-fundering`), volgens het sjabloon uit `LAGENMODEL-VOORZITTER.md`. Gaat alleen over personen: wie ze zijn, wat ze van je vinden, en wat ze onthouden.*

## 1. Bezit (alleen deze laag verandert dit)
- **Personen** (`world/world.js` `mkPerson`):
  - naam, leeftijd, **rol**, club;
  - **twee eigenschappen** uit 14 (stubborn, proud, sly, honest, vain, loyal, ambitious, cautious, warm, resentful, impulsive, patient, principled, greedy);
  - **één waarde** uit 6 (money, glory, loyalty, recognition, control, community);
  - een **diepe wens** per rol en waarde (`DEEP`), die je pas ontdekt als je de persoon kent;
  - invloed op een ledengroep (`infl`);
  - **loyaliteit** 0–10 (`loy`);
  - een **geheugen** (`mem`): wat jij deed, met een plus of min;
  - **relaties** (`rel`): mentor, protégé, vrienden, rivalen, familie;
  - een **loopbaan** over clubs heen;
  - een openstaande **gunst** (`owes`).
- **Rollen:** trainer, technisch directeur, financieel directeur, aanvoerder, supportersleider, oppositiekandidaat, voorzitter (AI-clubs) en de hoofdverslaggever van de Echo.
- **De TD als vakman** (`club/td.js`):
  - een filosofie: *Data*, *Network*, *Eye* of *Bargain*;
  - een driejarenplan;
  - twee eigenschappen;
  - **vier vaardigheden**: oog, onderhandelen, plannen, binden;
  - een **gerucht** dat ook onwaar kan zijn.
- **Spelers als personen** (`club/stories.js`):
  - een thuisstad;
  - een verhaal (academie, terug uit het buitenland, enzovoort);
  - **een wens**: elke week spelen, een langer contract, hoger spelen, of hier wortelen;
  - verhaallijnen die uit de simulatie volgen.

## 2. Níét van deze laag
| Onderwerp | Hoort bij |
|---|---|
| Hoe goed een speler is, zijn loon en contract | 4 Voetbal |
| De stemming van een hele ledengroep | 5 Leden. Een leider brengt die alleen over (`infl`). |
| Afdelingen en wat die doen | 1 Clubbeheer. Laag 3 levert alleen de persoon. |
| Familieleden van de voorzitter | 7 Dynastie (nog niet gebouwd) |

## 3. Mechanieken (zoals gebouwd)
1. **Kennismaken** (`meet`): bij het eerste contact start de loyaliteit op 5. Die wordt bijgesteld door eerdere herinneringen (*resentful* telt negatieve dubbel) en door jouw reputatie.
2. **Loyaliteit verandert door wat je doet** (`loy` met een `KIND`):

   | Wat je doet | Effect |
   |---|---|
   | Beschermen | +2 |
   | Een wens vervullen | +1 |
   | Ingaan tegen iemand | −1 |
   | Iemand passeren | −2 |
   | De schuld geven | −3 |
   | De diepe wens raken | +3 |
   | Laten wachten | −1 |
   | Toegeven | +1 |
   | Een publiek aanbod doen | +1 |

3. **Eigenschappen vermenigvuldigen** (`traitMul`). Een paar voorbeelden:
   - *loyal* waardeert bescherming ×1,5;
   - *stubborn* neemt tegenspraak ×2 zwaar op;
   - een *sly* persoon gelooft een excuus nooit (×0);
   - een *proud* persoon neemt passeren en wachten zwaarder op.
4. **Waarden wegen mee:** gaat het om iets wat bij iemands waarde past, dan telt het dubbel; past het er niet bij, dan half.
5. **Doorwerking via relaties:** vrienden, mentor en protégé horen hoe je iemand behandelde (±0,5). Rivalen reageren omgekeerd.
6. **Drempels:**
   - een loyaliteit van **8 of hoger** levert een **gunst** op die je één keer kunt inzetten (`owesCard`);
   - **onder 4** loopt iemand over naar de oppositie;
   - meewerken (`comply`) hangt af van de loyaliteit: volledig, half of weigeren.
7. **Vertrek en opvolging** (`leaveClub`): wie vertrekt, wordt vervangen door een nieuwe persoon in dezelfde rol. De oude gaat naar een andere club of naar de pool.

## 4. Acties van de speler
- **Aannemen en ontslaan:** een trainer (`hireCoach`) of een TD (`tdCandidates`, `hireTd`), met keuze uit kandidaten.
- **Kaarten in de post** die personen raken: beschermen, passeren, de schuld geven of een gunst inzetten.
- **Reacties op de feed:** maximaal twee per week, als privénotitie of publiek in de Echo (`chairman/reactions.js`).
- **De ALV-verdediging:** de trainer de schuld geven, met een gevolg voor zijn loyaliteit.

## 5. Signalen uit
| Signaal | Naar |
|---|---|
| Kwaliteit en stijl van de trainer en de TD (vaardigheden, filosofie) | 4 Voetbal |
| Steun van leiders aan een ledengroep (`infl`) | 5 Leden |
| Overlopen naar de oppositie | 5 Leden (ALV) |
| *Nog niet:* de kwaliteit van het hoofd per afdeling | 1 Clubbeheer |
| *Nog niet:* staflonen | 2 Financiën |

## 6. Signalen in
| Signaal | Van |
|---|---|
| Prestaties, verkopen en speeltijd van spelers | 4 Voetbal (verhaallijnen) |
| Jouw reputatie (beloftes gehouden of gebroken) | 5 Leden |
| Kandidaten en rivaliserende personen | 6 Wereld |

## 7. Wat de speler ziet
- Portretten, de rol en de loyaliteit in woorden (`band`).
- *People you know* in het overzicht van de regio.
- Het *Staff*-tabblad met de TD.
- Per persoon zijn relaties (`personLine`).
- Elke verandering staat met de oorzaak in het logboek.

## 8. Wat ontbreekt
1. **Ambities als systeem:** ambitie is nu één eigenschap, maar geen doel dat iemand zelf nastreeft.
2. **Afdelingshoofden** voor de zes afdelingen van laag 1, met een kwaliteit die bouwrisico's en afdelingseffecten bepaalt.
3. **Staflonen** in het grootboek.
4. **Agenten die zelf handelen:** de TD doet dat al, maar de financieel directeur en de ledenleiders nog niet (`ENGINE-VOORZITTER.md` §3).

## 9. Status
**4 Speelbaar.** Sterk en verweven met laag 5; het geheugen en de relaties zijn het kenmerk van het spel.
