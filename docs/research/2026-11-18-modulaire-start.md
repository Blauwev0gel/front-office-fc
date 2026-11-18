# Front Office FC — Onderzoeksreferentie en modulaire start (18 november 2026)

> Status: ONDERZOEK / HYPOTHESES, GEEN DEFINITIEF DESIGN. Deze notitie bewaart het gesprek over ontwerpvragen 1–9 als referentie. Niet behandelen als implementatieopdracht of als acceptatiecriteria voor de eerste module. De gebruiker wil juist klein beginnen, leren van werkende gameplay en daarna per module beslissen.

## Probleem dat we oplossen
Eerdere CEO-voetbalconcepten werden reactieve inbox- en budgetgoedkeuringsspellen. Een competente TD moet zelfstandig selectieleeftijd, scouting, contracten en transfers signaleren en afhandelen; een trainer beheert opstelling, tactiek en wissels. De eigenaar mag niet de taken van medewerkers overnemen. Eigenaarsspel moet intrinsiek interessant zijn, niet ontstaan door medewerkers kunstmatig incompetent te maken.

## Onderzochte richtingen (voorlopig)
1. Speler is één concreet persoon, eigenaar én CEO, niet de abstracte club of een alwetende familie-entiteit.
2. Medewerkers functioneren autonoom met bevoegdheden, verantwoordelijkheid, zichtbaar resultaat en achteraf verklaarbare beslissingen.
3. Dynastie-elementen geïnspireerd door Crusader Kings: familieleden met eigen belangen, relaties, karakter en geschiedenis; geen tevredenheidsmeters of soap-gebeurtenissen.
4. Generatiewisseling: speel één persoon per generatie; opvolgers hebben eigen levensloop en netwerk. Eigendom, stemrecht en dagelijkse leiding zijn afzonderlijk.
5. Familie kan controle over de club verliezen zonder game over. Het spel kan in beginsel doorgaan via andere clubs of een terugkeer. Dit vereist een wereld met autonome andere clubs, maar hoort NIET in eerste module.
6. Levende voetbalwereld: relaties en strategische initiatieven beïnvloeden elkaar, maar geen gespreksgrind, actiepunten, willekeurige inboxmeldingen of tycoon-upgrades.
7. Wedstrijd is het wekelijkse hoogtepunt: voorbeschouwing → eigen wedstrijdscherm → nabeschouwing/krant → terug naar clubleven. Geen sportieve ingrepen door eigenaar. Versnellen en tot einde simuleren veranderen alleen de presentatie, niet de uitkomst.
8. Tijd verloopt voorlopig week voor week, ook buiten seizoen. Rustige weken moeten snel en zonder verplichte beslissing passeren. Geen automatische maandensprongen. Medewerkers, clubs en familie ontwikkelen zich autonoom.
9. Persoonlijk leven naast voetbal: familie, carrière, relaties, levensfasen; geen volledige levenssimulator. Familieleden handelen zelfstandig en zijn niet louter bonussen of keuzes voor de speler.
10. Persoonlijke ambities: nog NIET gekozen/uitgewerkt.

## Ontwerprisico's
- Een eigenaar die alleen wacht op verzoeken of budgetten heeft geen eigen gameplay.
- Een wedstrijd zonder invloed kan passief voelen; de invloed van eigenaar is indirect en opgebouwd over tijd.
- Generaties duren potentieel duizenden weken: tempo en informatiedichtheid zijn cruciaal.
- Eigendomsrecht en opvolging kunnen onnodig complex worden.
- Familie-events mogen niet willekeurig of verplicht iedere week optreden.
- Andere clubs mogen geen lege schillen zijn bij een latere overname.
- Het spel moet altijd voetbal blijven, geen generieke familiesimulator.
- Een project- of relatie-initiatief mag geen verkapte upgrade/klikmeter worden.

## Bouwstrategie vanaf nu
Niet alle hypothesen tegelijk implementeren. Bouw een klein speelbaar, verticaal segment. Iedere module moet eindigen met een daadwerkelijk speelbare versie, bewijs van tests, expliciete scope en observaties. Onderzoek is referentie, geen verplichting. Nieuwe modules pas kiezen op basis van de ervaring met de vorige.

### Voorgestelde module 1 — De eerste voetbalweek
- Een eenvoudige club met herkenbare identiteit, trainer en TD.
- Een werkende, deterministisch te testen weekcyclus.
- Een begrijpelijke voorbeschouwing, wedstrijd als apart scherm, resultaat, korte nabeschouwing en volgende week.
- Trainer en TD nemen zelfstandig passende sportieve besluiten; eigenaar kiest geen tactiek/opstelling/transfers.
- Geen geforceerde eigenaarbeslissing; speler kan gewoon verder.
- Duidelijk onderscheid tussen echte simulatie en decoratieve tekst.
- Mobielvriendelijke, overzichtelijke UI; eenvoudige bediening; geen popups voor wedstrijden.
- Bewaar de game state, zodat refresh geen seizoen wist.
- Voor deze eerste module expliciet GEEN dynastie, uitgebreide familie, erfopvolging, overnames, meerdere bestuurbare clubs, uitgebreide relatie-engine, grote skill- of projectbomen.

## Aanpak voor iedere volgende module
1. Inspecteer werkende code en documentatie, bepaal herbruikbare basis.
2. Definieer één concrete spelerservaring en beperkte scope.
3. Schrijf acceptatiecriteria en regressietests voordat je bouwt.
4. Implementeer als geïntegreerd geheel, niet als losse mockups.
5. Test gameplay, state, mobiel en weekovergangen.
6. Lever alleen een werkende build, plus bevindingen, beperkingen en mogelijke volgende module.
7. Laat de gebruiker de volgende module kiezen; zet onderzoeksrichtingen niet stilzwijgend om in verplichtingen.

## Bewijsstatus
Dit document is een synthese van conceptueel gesprek, GEEN onafhankelijke repo-audit of codevalidatie. Het bewaart keuzes als verkende richtingen, geen onherroepelijke canon. Geen bestaande gameplay gewijzigd bij het vastleggen.
