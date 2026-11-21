# Front Office FC — onderzoeksdossier voor Claude en ChatGPT

**Laatst vastgelegde ontwikkelbesluit:** 21 november 2026  
**Repository:** `Blauwev0gel/front-office-fc`  
**Publicatiebranch:** `chatgpt`  
**Status:** onderzoek en ontwerp; GEEN implementatie of opdracht tot merge.

## BEGIN HIER — besluit dat voorrang heeft

**Front Office FC bevat uiteindelijk vier volwaardige spelsystemen:**
1. Clubmanagement;
2. Personenmanagement;
3. Beslissingen / gekozen bestuur;
4. Familie en dynastie.

**BESLOTEN WERKWIJZE:** bouw ze **een voor een**, te beginnen met **CLUBMANAGEMENT**. Elk systeem moet zelfstandig een diepgaande, speelbare, testbare managementervaring zijn, die later via expliciete API's/gebeurtenissen kan samenwerken met de andere drie. *Zelfstandig ontwikkelen betekent niet geïsoleerd ontwerpen.*

Er wordt **NIET** nu een gecombineerde gameplayketen voor de vier lagen gebouwd. Dat oudere voorstel uit v2 is op 21 november **expliciet vervangen** door de clubsysteem-eerst-aanpak. Gebruik v2 daarom als rijke **onderzoeks-/mechaniekbron**, niet als implementatievolgorde of bewijs dat zaken al werken.

De speler is **gekozen voorzitter van een ledenclub**, niet eigenaar. Geen erfopvolging van bestuursrechten. Geen trainer-tactiek, opstelling of individuele transferonderhandeling door de voorzitter.

## Leesvolgorde

1. [Clubmanagement — onderzoek & aanpak (actuele opdracht)](FRONT_OFFICE_FC_CLUBSYSTEEM_ONDERZOEK_EN_AANPAK_V1.md)
2. [Vierlagenblueprint v2 (conceptuele mechanieken; ontwikkelvolgorde deels superseded)](FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V2.md)
3. [Kritische game-design-audit](FRONT_OFFICE_FC_KRITISCHE_GAME_DESIGN_AUDIT.md)
4. [V1 naar v2 — wijzigingen en eerdere backlog (historisch)](FRONT_OFFICE_FC_V1_NAAR_V2_CHANGELOG_EN_BACKLOG.md)
5. [Vierlagenblueprint v1 (historisch uitgangspunt)](FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V1.md)
6. [Uitvoerende reviewprompt (historische methode)](FRONT_OFFICE_FC_PROMPT_KRITISCHE_GAME_DESIGN_REVIEW.md)
7. [CLAUDE_REVIEW_BRIEF.md](CLAUDE_REVIEW_BRIEF.md) — gerichte vragen en verwachte beoordeling.

## Wat deze bundel NIET is

- Geen automatisch goedgekeurde herbouw of nieuwe gamecode.
- Geen bewijs dat de vier lagen geïmplementeerd zijn.
- Geen opdracht om `main`, `claude-game`, `chatgpt` of `voorzitter-fundering` te wijzigen.
- Geen reden om sterke bestaande implementaties uit andere branches weg te gooien.

## Relevante bestaande branches

- `chatgpt`: modulaire bestaande club-CEO-game, engine, match, desk, cases en evidence loops.
- `claude-game`: bredere versie met o.a. `src/agreements.js`, `projects.js`, `parties.js`, `world.js` en `talks.js`; bepaalde systemen zijn standaard geparkeerd achter `PARK`, dus aanwezige code is niet automatisch actieve gameplay.
- `claude/loving-goodall-uv00vn`: `northmarch.html` plus zelfstandig voorzittersspel en ontwerp rond afspraken, ALV en mensen. Niet afdoen als alleen een theoretisch loopsim-onderzoek.
- `voorzitter-fundering`: apart modulair standalone onderzoek; geen directe drop-in replacement voor de hoofdgame.
- `main`: huidige gedeelde release, niet aanpassen zonder expliciete toestemming.

## Cruciale kwaliteitseis

Een **zelfstandig clubsysteem** moet jaren speelbaar blijven via clubbezit/infrastructuur, voorzieningen, capaciteit, exploitatie, inkomsten, onderhoud, lening/schuld, projecten, risico, herstel en verschillende levensvatbare clubstrategieën. De speler kan zelf initiatieven nemen. Geen simpele lineaire "betaal X → level +1"-upgrades, geen cosmetische rapportage in plaats van werking, geen schijnkeuzes.

Ontwerp wel interfaces zodat latere People/Board/Family-systemen invloed op uitvoering, macht, belangentegenstellingen of familiebeleggingen kunnen uitoefenen — zonder dat die systemen nodig zijn om Club v1 te laten werken.

**Voor Claude:** lees vervolgens `CLAUDE_REVIEW_BRIEF.md` en lever eerst de kritische bevindingen; ga niet zonder aparte opdracht coderen.
