# Prompt: de eigenaar aan tafel, en spelers die tot leven komen

*Branch `voorzitter-fundering`. Bouwt voort op `standalone/front-office-fc/voorzitter-fundering/` en het concept (§13, keuzes 37–45).*

## Feedback van de eigenaar (19-11-2026)
1. **Het bureau herhaalt zich te vaak.** Situaties zijn soms onlogisch of niet leuk, en het voelt als zwaar lezen. Het moet visueel beter.
2. **Je ziet niet hoeveel geld de club heeft.** De schuifjes voor budget en loon zijn te oppervlakkig. Een **vergadering met de staf**, waarin zij uitleggen wat ze willen, is leuker. Het **mandaat** moet vanuit het perspectief van de **eigenaar** worden uitgewerkt.
3. **Spelers hebben geen profiel en komen niet tot leven.** Hoe ontstaat binding met de spelers zelf?

## Keuzes van de eigenaar (bindend)
- **De zomervergadering is met de hele staf:** TD, coach en financieel directeur, elk met een eigen wens en eigen woorden.
- **Het mandaat** bevat minstens ambitie, financieel risico, identiteit en rode lijnen. Daarnaast mag ik zelf rijkere opties onderzoeken.
- **Spelers krijgen alle vier de routes:** een echt profiel, verhaallijnen, momenten in de wedstrijd, en ontmoetingen als eigenaar.

## Grenzen (blijven gelden)
- **Geen operationeel werk:** geen opstelling, geen training en geen transfers goedkeuren. Een eigenaar zet het mandaat; de staf voert uit.
- **Elke keuze verandert de wereld**, want het gedrag van de TD, de financiën en de spelers volgen eruit. Een keuze die alleen een verborgen score verschuift, is niet genoeg.
- **Woorden tijdens het spelen, getallen achteraf.** Geld is de uitzondering: dat mag je als bedrag zien, want een eigenaar kent zijn kas.
- Fictieve wereld; geen gegenereerde AI-tekst in het spel; mobiel 390 px, licht en donker.

## Ontwerp

### A. Geld zichtbaar
- **Een financieel directeur** wordt een nieuw personage in de cast, met trekken en een waarde.
- **Een eenvoudig weekmodel:**
  - inkomsten: wedstrijddagen, sponsors en een basisbedrag;
  - lasten: de loonsom van de selectie;
  - de kas, de schuld en de rente.
- **Op het weekscherm** staat altijd een geldregel: de kas en het weekresultaat. De Finance-kamer toont de loonsom, het resterende transferbudget en de schuld.

### B. De zomervergadering (vervangt de schuifjes)
- **Drie stemmen.** Ze worden gegenereerd uit de echte staat:
  - **de TD:** het plan, met posities en prijs;
  - **de coach:** het gat dat hij voelt en de speelstijl die hij wil;
  - **de financieel directeur:** wat de club kan dragen, met de kas, de loonsom en de bank.
- **Het mandaat** bestaat uit pijlers. Elke pijler is een keuze met gevolgen die je in woorden ziet, en de staf reageert erop. Een keuze die de waarde van een stafmedewerker raakt, verandert zijn loyaliteit.
  1. **Ambitie:** survive / steady / push / promotion or bust. Dit bepaalt welke kwaliteit de TD zoekt en hoeveel risico hij neemt.
  2. **Financieel risico:** balanced books / spend the reserves / borrow against the future. Dit bepaalt het transferbudget en de grens van de loonsom, met rente en de bank als gevolg.
  3. **Identiteit:** our own youth / local lads / proven pros / buy low, sell high. Dit bepaalt wie hij zoekt en wie hij houdt.
  4. **Loonhuis** (eigen onderzoek): one star allowed / nobody earns more than X / pay for performance. Dit bepaalt wie te halen en te houden is, en de onderlinge vrede in de kleedkamer.
  5. **Verkoopbeleid** (eigen onderzoek): keep the core / everyone has a price / never sell mid-season.
  6. **Afrekenen** (eigen onderzoek): waarop jij de TD aan het eind van het seizoen beoordeelt. Bijvoorbeeld de positie, de waarde van de selectie, minuten voor eigen jeugd of de loonsom. Dat wordt een moment in de ALV-week.
  7. **Rode lijnen:** never sell to the rival / the captain stays / no player over 30 on a long deal.
- **Na de vergadering** zie je samengevat wat het mandaat betekent, en wie van de staf tevreden is.

### C. Spelers die tot leven komen
1. **Een profiel per speler:**
   - waar hij vandaan komt (stad in de regio of daarbuiten);
   - een kort verhaal van één of twee zinnen, opgebouwd uit fragmenten;
   - karakter, en wat hij wil (spelen, een contract, hogerop, ergens wortelen);
   - vorm over de laatste zes duels, seizoenscijfers en mijlpalen.

   Je opent het door op een speler te tikken in de selectie.
2. **Verhaallijnen** die volgen uit de simulatie. Ze komen terug in de krant, in de uitslag en op je bureau:
   - het debuut en het eerste doelpunt van een jongen uit de academie;
   - de terugkeer na een blessure;
   - een vormcrisis;
   - het laatste seizoen van een veteraan;
   - het contractjaar van een sleutelspeler;
   - de 100e wedstrijd.
3. **Momenten in de wedstrijd.** De uitslag noemt mensen: wie de winnende goal maakte, een eerste doelpunt, een mijlpaal, de held van de derby.
4. **Ontmoetingen als eigenaar** (situaties):
   - je bent erbij als een jongen zijn eerste profcontract tekent;
   - je reikt de prijs voor speler van de maand uit;
   - je steunt een speler in een crisis;
   - een afscheidswedstrijd voor een veteraan;
   - een speler die weg wil, en wie hem tegenhoudt.

   Het gevolg zit in de **moraal** van de speler, en moraal stuurt zijn vorm.

### D. Het bureau: minder herhaling, meer logica, beter leesbaar
- **Per generator een seizoenslimiet en geheugen**, zodat dezelfde titel niet binnen acht weken terugkomt. Een gewogen keuze straft recente generatoren af.
- **Elke generator controleert of hij logisch is:**
  - een rivaal in nood moet echt onderaan staan of schulden hebben;
  - een petitie heeft een oorzaak;
  - "cash" komt pas als de kas minder dan twee weken loon bevat.
- **Visueel:**
  - op het bureau: kaarten met een gezicht en één regel als haak;
  - in een situatie: tekstballonnen met gezichten in plaats van lappen tekst;
  - afspraakkaarten compact: titel, *gives / gets* op twee regels, en het risico als één label.

## Testen
- Alle bestaande tests blijven groen: de fundering zonder voorzitter, de audit en de browserdoorloop.
- **Nieuw:**
  - per seizoen geen enkele situatietitel vaker dan twee keer;
  - het mandaat verandert het gedrag van de TD meetbaar;
  - de kas beweegt geloofwaardig en de club gaat niet vanzelf failliet;
  - er ontstaan per seizoen minstens vijf verhaallijnen van spelers;
  - screenshots van de vergadering, een spelersprofiel, het bureau en een uitslag met momenten.
