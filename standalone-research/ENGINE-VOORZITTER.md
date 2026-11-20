# De engine: een club die je bouwt met acties, niet alleen met keuzes

*21-11-2026, concept (keuze 78 na akkoord van de eigenaar). Uitwerking van `LOOP-DYNASTIE-VOORZITTER.md`.*

## Het probleem
Een spel dat alleen uit beslismomenten bestaat, is reactief: het spel vraagt en jij antwoordt. In Football Manager neem je zelf het initiatief: je bouwt, regelt en stuurt wanneer jij wilt, en de wereld reageert daarop.

**Doel:** een **systeemengine** waarin de club vanzelf leeft, jij er altijd met **acties** in kunt ingrijpen, en **gebeurtenissen voortkomen uit de toestand van de systemen**, niet uit een script.

## 1. Opbouw in drie lagen
```
┌──────────── SPELER ────────────┐
│ Acties (proactief) · Beslismomenten (reactief) │
└───────────────┬────────────────┘
                ▼  zet initiatieven in gang, verandert beleid
┌──────────── AGENTEN ───────────┐
│ Staf, spelers, ledenleiders, familie, rivalen: eigen doelen, eigenschappen, geheugen │
└───────────────┬────────────────┘
                ▼  handelen elke week zelf
┌──────────── SYSTEMEN ──────────┐
│ Voetbal · Financiën · Faciliteiten · Leden en politiek · Mensen · Wereld · Dynastie │
└────────────────────────────────┘
       ▲ gebeurtenissen ontstaan uit drempels in de systemen
```

## 2. De systemen (de toestand van de club)
| Systeem | Toestand | Wordt bewogen door |
|---|---|---|
| **Voetbal** | Selectie (kwaliteit, moraal, vorm), trainer, resultaten, stand | De trainer (opstelling en training), de TD (transfers), faciliteiten, moraal |
| **Financiën** | Kas, schuld, inkomstenstromen (wedstrijden, sponsors, merchandise, tv, transfers), kostenposten (lonen, faciliteiten, rente) | Prijzen, deals, transfers, faciliteiten, resultaten |
| **Faciliteiten** | Stadion (capaciteit, comfort), trainingscomplex, academie, scouting (regio's), clubhuis, elk met een niveau en onderhoud | Bouwprojecten (geld en tijd), onderhoud |
| **Leden en politiek** | Ledengroepen (aandeel, stemming, eisen), steun %, statuten, beloftes, moties | Resultaten, acties, beloftes, schandalen, prijzen |
| **Mensen** | Iedereen met eigenschappen, loyaliteit, ambitie, relaties en geheugen | Gesprekken, beloftes, aanstellingen, gebeurtenissen |
| **Wereld** | Competitie, rivalen (clubs en families), markt (spelers en staf), stad (sponsors, pers) | Een eigen simulatie |
| **Dynastie** | Familieleden (leeftijd, pad, eigenschappen), familiereputatie, vetes en verbonden | Tijd, opvoeding, acties, verkiezingen |

## 3. Agenten: de club leeft zonder jou
- **Iedereen met een rol** heeft een doel, competentie, eigenschappen en geheugen.
  - De **trainer** kiest de opstelling en de training volgens zijn stijl.
  - De **TD** werkt zijn plan af binnen het mandaat.
  - De **financieel directeur** bewaakt de begroting.
  - **Ledenleiders** stellen eisen en bereiden moties voor.
  - **Familieleden** volgen hun ambitie.
  - **Rivalen** proberen je zwak te zetten.
- **Ze handelen elke week zelf.** Hoe goed hangt af van hun competentie, en hun keuzes kleurt hun karakter.
- **Wat ze doen, zie je** in het clubboek en de rapporten. Je ziet het, ook als je niet ingrijpt.

## 4. De acties van de speler (proactief, altijd beschikbaar)
Elke actie heeft:
- **kosten:** geld, steun, of de relatie met iemand;
- **een looptijd:** direct, of in weken;
- **voorwaarden:** niveau, steun, een ledenbesluit;
- **effecten** op de systemen, met **onzekerheid**.

| Categorie | Voorbeeldacties |
|---|---|
| **Bouwen** | Een tribune uitbreiden · het trainingscomplex verbeteren · de academie uitbreiden · een scoutingregio openen · het clubhuis renoveren |
| **Mensen** | Een trainer, TD of afdelingshoofd aannemen of ontslaan · contracten verlengen · een gesprek voeren (doelen afspreken, steun uitspreken, onder druk zetten) · een belofte doen |
| **Beleid** | Begroting verdelen (selectie, faciliteiten, jeugd, reserve) · loonplafond · profiel (jeugd of ervaring) · prioriteiten van de TD · stijlwens aan de trainer (geen tactiek) |
| **Commercie** | Kaartprijzen en seizoenkaarten · een sponsordeal onderhandelen · een evenement organiseren · een merchandiselijn |
| **Politiek** | Een ledengroep bezoeken · een motie indienen · de statuten wijzigen (ALV) · een bondgenoot in het bestuur zetten · een tegenstander neutraliseren |
| **Familie** | Een familielid een plek geven · je erfgenaam klaarstomen (mentoring, zichtbaarheid) · een verbond met een clubfamilie · een vete bijleggen of uitvechten |
| **Pers** | Een interview · een open brief aan de leden · een conflict de wereld uit praten |

**Schaarste: de agenda.**
- Je kunt **hooguit drie initiatieven tegelijk** lopen hebben, zoals in Crusader Kings met zijn *schemes* en *focus*. Bijvoorbeeld: een tribune bouwen, je erfgenaam klaarstomen, en een sponsor binnenhalen.
- Losse acties zoals een gesprek of een prijswijziging kosten **een agendaplek per week**: twee per week.
- **Dit is een nieuwe meter, met een reden:** zonder schaarste in tijd verliezen proactieve acties hun gewicht, en wordt alles "doe alles". Geld en steun alleen zijn niet genoeg, want ze raken niet de keuze *waar besteed ik mijn aandacht aan*.

## 5. Gebeurtenissen ontstaan uit de systemen
- **Drempels** maken gebeurtenissen aan, bijvoorbeeld:
  - kas onder £10k → de bank belt;
  - een ledengroep onder 40% → een ultimatum;
  - trainer en TD lang oneens → een conflict;
  - een talent met een hoog potentieel en weinig speeltijd → hij wil weg;
  - een familielid wordt 18 → hij kiest zijn pad.
- **Een beslismoment** (keuze 75) is een gebeurtenis die jouw reactie vraagt. **De rest los je op met acties, of je laat het aan de agenten.**
- **Ketens:** een gevolg is weer input voor een systeem. Een tribune geeft meer inkomsten, dus een groter budget, dus een sterkere selectie, dus hogere verwachtingen bij de leden.

## 6. De tijd (de tick)
Elke **week** gebeurt in deze volgorde:
1. de agenten handelen;
2. de initiatieven vorderen;
3. de wedstrijd;
4. de financiën;
5. de leden en politiek;
6. de mensen (loyaliteit, ambitie);
7. de dynastie (veroudering, mijlpalen);
8. de drempels worden gecontroleerd en er ontstaan gebeurtenissen;
9. het clubboek en de rapporten worden bijgewerkt.

**Tempo:** je speelt door tot het volgende beslismoment, een mijlpaal, of tot je zelf pauzeert om acties te ondernemen. Dat past in sessies van 5–10 minuten.

## 7. Leesbaarheid (geen spreadsheet)
- **De club-hub** heeft één kaart per systeem met de status, een pijl en een waarschuwing. Tik erop voor de details.
- **Een voorspelling bij elke actie:** "Tribune +2.000 plaatsen: £60k, 16 weken, +£2k per thuisduel, Docks +." De onzekerheid staat erbij.
- **Rapporten van de staf** (wekelijks een regel, maandelijks een rapport) en de krant.
- **Het clubboek** met alle sporen: wat jij deed, en wat dat later veroorzaakte.

## 8. Opbouw in data
- **Acties, gebeurtenissen, faciliteiten en eigenschappen staan in datatabellen** (kosten, looptijd, voorwaarden, effecten en kansen), niet in code. Zo kan de inhoud groeien zonder dat de engine verandert.
- **Een effect** is altijd: *systeem.veld ± waarde, met kans p, na n weken*. Daardoor zijn simulatie en counterfactual-tests mogelijk.

## 9. Wat er van de bestaande code bruikbaar is
| Bestaand | Nieuwe rol |
|---|---|
| Clublaag (selectie, financiën, markt, TD, transferzomer) | De systemen voetbal en financiën, en de TD-agent |
| Ledengroepen, steun, beloftes, ALV | Het systeem leden en politiek |
| Personen met eigenschappen, loyaliteit, geheugen, relaties | Het systeem mensen en de agenten |
| Situaties en afspraakkaarten | Gebeurtenissen en beslismomenten |
| Wereld met 32 clubs | Het systeem wereld |
| **Nieuw** | Faciliteiten, initiatieven en agenda, de actietabellen, de dynastie |

## Vragen aan de eigenaar
1. **De agenda:** drie lopende initiatieven en twee losse acties per week als schaarste, akkoord?
2. **Jouw rol:** je schreef "CEO / eigenaar". Blijft het een **gekozen voorzitter** (ons verschil met Hometown FC, keuze 77), of word je eigenaar?
3. **De eerste systemen voor een prototype:** faciliteiten plus financiën plus mensen, met voetbal en leden als bestaande basis?
