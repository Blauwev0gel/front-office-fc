# De technisch directeur: ontwerpnotitie v0.1 (19-11-2026)

*Uit `PROMPT-TD-VOORZITTER.md`, fase 2, met de antwoorden van de eigenaar (keuze 65). Ter goedkeuring; nog niets gebouwd.*

## Doel en pijlers
- **Doel:** de TD wordt een collega met een plan, een karakter en een zichtbaar resultaat. Een transferzomer voelt als een seizoen op zich.
- **Pijlers:**
  - *binding* (je TD leren kennen);
  - *levende club* (de transferticker);
  - *inzet* (zijn plan en jouw geld, met Hit of Miss als gevolg).
- **De voorzitter koopt of keurt geen spelers.** Hij bespreekt het plan, geeft richting en geld, en oordeelt.

## 1. De zomer (het hart)
1. **Evaluatie** (na de mandaatvergadering): de TD loopt de selectie door.
   - Per speler: *Keep*, *Sell*, *Loan out* of *Release*, met één reden. Bijvoorbeeld: "Whitlock: 31, wage too high for his minutes."
   - Jouw reactie per speler: *Agree* of *I'd keep him*. Keep je iemand tegen zijn zin, dan kost dat budget en wat van zijn vertrouwen.
2. **Het plan:** twee of drie prioriteiten, bijvoorbeeld "A left-back who can run", "A striker for 12+ goals" of "Cut the wage bill".
   - Per prioriteit: targets A, B en C met leeftijd, type, geschatte prijs en loon, en één zin over het waarom.
   - Wat jij doet, per prioriteit: *Go for it* (zijn budgetverdeling), *Do it cheaper* of *Not this summer*. Dat schuift geld tussen de prioriteiten, maar je wijst nooit een target aan.
   - Dit is een ruilkaart volgens de templates: *You give* (geld, een principe) tegenover *You get* (wat hij wil bereiken).
3. **Transferweken** (vier voorbereidingsweken plus deadline day): een **ticker** die vanzelf loopt.
   - Statussen: *Talks → Bid → Agreed → Medical → Signed*, of *Rejected / Hijacked by [rival] / Moved to target B*.
   - Ook verkopen, biedingen op jouw spelers en vertrekken staan in de ticker.
   - Hooguit één telefoontje per week: geld erbij voor target A, een bod op een sleutelspeler (hooguit één sleutelverkoop, keuze 44), of de trainer die klaagt.
4. **Deadline day:** een tijdlijn per uur met de laatste deals. De uitkomst is een **zomerbalans**: in en uit, geld, en welke prioriteiten gehaald zijn.

**De winter** is dezelfde opzet, kleiner: één prioriteit, twee weken plus deadline day.

## 2. De maandmeeting (elke 4 weken, buiten de windows)
- **Rapport in drie regels:** wat goed ging, één zorg, waar hij aan werkt. Denk aan contracten, scouting of de vorm van een aankoop.
- **Jouw richting voor de maand (één keuze):**
  - "Watch a position"
  - "Sort [X]'s contract"
  - "Look at the academy"
  - "Leave it to you"

  De richting kleurt zijn werk en de feed, en geeft zijn plan voor de winter een voorsprong.

## 3. Karakter zichtbaar, vak verborgen
- **Zichtbaar bij het aannemen:**
  - een filosofie: *Data*, *Network* (eigen regio en contacten), *Eye* (jong en ruw) of *Bargain* (kopen en doorverkopen);
  - twee eigenschappen (bestaand: greedy, ambitious, cautious, stubborn).
- **Verborgen, 1–5:**
  - *eye*: hoe dicht zijn inschatting van een target bij de echte kwaliteit zit;
  - *deal*: welke prijs en welk loon hij uitonderhandelt;
  - *reach*: hoe vaak target A lukt en hoe vaak hij gekaapt wordt.
- **Test:** elke filosofie en elk vakmanschap moet meetbaar ander gedrag geven, anders vervalt het.

## 4. Het oordeel
- **Per aankoop, na een half seizoen:** een stempel *Hit*, *Miss* of *Too early*, op basis van minuten en vorm tegenover de verwachting. De stempels staan op de spelerskaart en in een lijst *His signings*.
- **Zomerrapport:** zijn Hits en Misses, het geld, de gehaalde prioriteiten en jouw relatie met hem.
- **Daarna kies je:**
  - *Keep*;
  - *Warn*: hij krijgt een seizoen om te verbeteren, onder druk;
  - *Sack*: dat kan alleen nu, met een afkoopsom. Daarna kies je uit drie kandidaten met een eigen filosofie.

## State en migratie
- **In de clublaag:**
  - `S.cf.td = {phil, eye, deal, reach}`;
  - `S.cf.plan = {verdicts[], priorities[{text, budget, targets[A,B,C], status}]}`;
  - `S.cf.ticker[]`;
  - `p.signedBy`, `p.verdict`.
- **Oude saves:** bij het laden krijgt de TD een filosofie op basis van zijn eigenschappen en vakmanschap 3/3/3, en is het plan leeg. `VERSION` gaat omhoog.
- **De voorzitterslaag** leest alleen via de cfApi en past aan via `setPlanSay(prio, say)` en `setMonthNudge(k)`.
- **Zonder voorzitter** volgt de TD gewoon zijn eigen plan (de fundering blijft draaien).

## Bestanden
- `club/club.js`: `tdWindow` wordt plan → weken → deadline.
- Nieuw: `club/td.js` (plan, ticker, oordeel).
- `club/feed.js`: tickerkaarten.
- `chairman/meeting.js`: evaluatie, plan, zomerrapport, kandidaten.
- `chairman/flow.js`: de maandmeeting.
- `ui/render.js`: tickerkaarten, evaluatielijst, Hit/Miss-chips.

## Bewust niet (nu)
- Makelaars als personages, en doorverkoopclausules: later, als het plan staat.
- Een scoutingscherm, een database, onderhandelen over bedragen, of de voorzitter die een speler kiest of afwijst.

## Testen
- Een nieuwe `td-test.js` over 20 seeds en drie seizoenen zonder voorzitter:
  - elke filosofie koopt meetbaar anders (leeftijd, herkomst, prijs);
  - een TD met een hoog *eye* scoort meer Hits, maar niet altijd;
  - target A lukt bij een hoge *reach* aantoonbaar vaker;
  - hooguit één sleutelverkoop per window;
  - elke transferweek heeft tickerkaarten.
- De bestaande tests blijven groen, en een week duurt nog steeds 30–60 s, ook in een transferweek.
- **Speeltest door de eigenaar:** "Weet ik na één zomer wat mijn TD wilde, of het lukte, en of ik hem wil houden?"
