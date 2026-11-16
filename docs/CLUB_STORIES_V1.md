# The Front Office — Club Story Engine V1
16 November 2026 · source branch `chatgpt` · design decision B14

## Waarom dit bestaat
De bestaande weekloop geeft veel losse Red Box-berichten, ook als er weinig nieuws is. In `claude-game/design/weekflow.md` kwam de oorspronkelijke meting op 31% weken met maximaal één actie; een andere, uitgebreidere weekloop reduceerde dat tot 7%, maar **meer berichten is geen bewijs van meer kwaliteit**. `claude-game/notes/longevity-2026-11.md` mat 95% herhaalde event-types in seizoen 5 in een oudere simulatie. De concrete verbeterhypothese: minder op zichzelf staande willekeurige gebeurtenissen en méér herkenbare, state-driven gevolgen over weken.

## De drie werkelijke verhaallijnen

| Arc | Triggers uit echte speldata | Wat de CEO beslist | Wat de autonome engines uitvoeren | Wat na 8–15 weken wordt gemeten |
|---|---|---|---|---|
| Coach–DoF | Beide functies bezet; youth-mandaten lopen uiteen, relaties koud of meerdere nederlagen | DoF steunen, één gezamenlijke brief eisen, coach steunen; eventueel nadere instructie | Mandaatinstellingen veranderen; de hoofden kunnen een compromis vinden of weigeren, afhankelijk van staff-eigenschappen en relatie | Onderlinge relaties, afstand tussen instructies, eventuele veranderingen in bestaande matchstatistiek |
| Jeugdspeler | Werkelijke academyspeler van 17+ met hoog potentieel en ontwikkelruimte, academie en coach bezet; de bestaande `pathway` is niet actief | Versnellen, mentorplan of welzijn/opleiding; later bijsturen | `academy.js` ontwikkelt de speler. `acadPromote` promoveert alleen als staff/geschiktheid dat rechtvaardigt. `pickXI` en selectie blijven uitsluitend bij de coach | Echte promotie naar squad, echte speelminuten, opleiding, welzijn, CA-ontwikkeling |
| Financiële druk | Cash tekort, lage kas bij hoge loonratio of een reëel negatief resultaat en beperkte buffer; Finance en Commercial bezet | Kostenaanpak, commerciële opdracht of risico nemen; later bijsturen | `business.js` past budgetten pas na staff-uitvoering aan, of Commercial kan een daadwerkelijke deal binnenhalen dan wel mislukken; `weeklyFinance` verwerkt uitsluitend bestaande deals en uitgaven | Kas en verschil t.o.v. begin, board confidence, uitgevoerde budgetwijzigingen en echte sponsorcontracten |

## 12-week loop, niet 12 scripted scènes
1. Bij week 5–20 kan de club **maximaal twee** lopende verhalen starten, alleen als de bestaande state dat rechtvaardigt. Een type heeft 55 speelweken herhalingscooldown; tussen twee starts minstens vijf weken. Rustige weken zijn toegestaan.
2. Opening arriveert via `defineEvent` en `queueEvent` in de bestaande Red Box. Geen aparte action controller of extra decision currency.
3. CEO-besluit slaat beleid/mandaat/brief vast. Onbeantwoord wordt door `endWeek` op de bestaande automatische manier behandeld.
4. Na ongeveer drie speelweken handelt de betreffende afdeling op de opdracht, met seeded RNG, competentie en vertrouwen. De Gazette toont de **daadwerkelijke** uitkomst.
5. Na ongeveer zeven weken volgt alleen een tweede CEO-besluit als de relevante onderliggende situatie nog problematisch is. Anders handelt de staf verder zelfstandig.
6. Rond week elf sluiten de huidige spelers, stafrelaties, clubfinanciën en formele beleidsregels de verhaallijn af. Deze resultaten zijn niet van tevoren bepaald en hoeven niet gunstig te zijn.
7. `G.storybook` bevat de actieve toestand en een begrensd archief (20 verhalen, maximaal 10 logregels per actief verhaal). De oude saves werken via veilige lazy initialisatie zonder save-version bump.

## Interactie en conflictpreventie
- `stories.js` wordt in `build.py` **na** `ceocore.js` geladen. De module wikkelt `HOOK.seasonAfterMatch` om de bestaande modules heen in plaats van hun gedrag te vervangen.
- Red Box gebruikt zes gewone forced events: `story_*_opening` en `story_*_followup`. `forced=1`, `ceo=1`, `w=0`: de random gewone eventpool wordt niet opgeblazen.
- De inbox toont club-story berichten met expliciet label en één ingeklapt, tekstgericht `Ongoing club stories`-overzicht met actieve dossiers en recente afsluitingen.
- Tijdens een actieve youth-story begint `pathway.js` geen tweede onafhankelijk verhaal over dezelfde jeugdproblematiek. Bij een bestaande actieve pathway kan de youth-story niet starten.
- Club Stories gebruiken geen directe selectie, onderhandelingen namens de CEO, phantom signings of nieuwe visuele componenten.
- De drie arctypen zijn de eerste gecontroleerde set; geen claim dat alle 80+ bestaande eventtypen nu doorlopende narratieven zijn.

## Pre-push validatie
Het volledige enginepakket is in een geïsoleerde V8-testomgeving opnieuw samengesteld. `test/stories.js` is met een equivalente module-loader uitgevoerd en slaagde: drie oorspronkelijke situaties, zes contrasterende CEO-routes op identieke seeds, geldige 8–15-week afsluiting, echte competitie/afdeling/Gazette in de loop, minstens twee narratieve vervolgberichten per verhaal, maximum twee gelijktijdige verhalen, geen dubbelen, save/load, oude saves, pathway-uitsluiting en automatische besluitafhandeling als CEO niets doet.

Geobserveerde voorbeelden (één seed, geen balansclaim):
- Coach–DoF: DoF steunen sloot af met mandaatverschil 46; coach steunen met 68; relaties en verloop verschilden.
- Jeugd: versnelde route bracht het talent in de seniorenselectie met 221 wedstrijdminuten; welzijnsroute hield hem in de academie. Dit is geen hardcoded promotiegarantie.
- Financiën: kostenroute eindigde rond £557 negatief, doorgaan met investeren rond £6.700 negatief. Ook de board confidence verschilde.

**Aanvullende niet-geforceerde seizoensproef:** 12 seeds × 34 weken, zonder door de test gestarte verhalen. Alle 12 bereikten de seizoensbeoordeling; in alle 12 startten vanzelf één tot drie verhaalbogen, die allemaal sloten vóór de seizoensbeoordeling. Geen crash en geen overschrijding van maximaal twee gelijktijdige verhalen. Voor deze technische duurtest werden de kas en het bestuursvertrouwen op een veilige ondergrens gehouden om irrelevante ontslag/insolventie te vermijden. Dit is dus **geen** balans- of moeilijkheidstest.

**Belangrijke grenzen:** dit is een engine/API-test, geen bewezen mobiele visuele kliktest, en zes trajecten bewijzen geen lange-termijnbalans of lage herhalingsgraad. `node test/stories.js`, `node test/ceocore.js` en bestaande buildchecks zijn GitHub CI-gates op `chatgpt`; controleer daadwerkelijke run en deployment vóór releaseclaim.

## Volgende kwaliteitsstap
Voer 100+ seizoenen in meerdere runs uit en meet herhaling, volledig doorlopen arcs, spelers met relevante speelminuten, ontslag/insolventie, en of normale spelers zonder geforceerde fixtures voldoende maar niet te veel verhalen zien. Doe vervolgens een echte 390px browserplaytest: Club Story opening, keuzes, hervatten, Gazette en herladen.
