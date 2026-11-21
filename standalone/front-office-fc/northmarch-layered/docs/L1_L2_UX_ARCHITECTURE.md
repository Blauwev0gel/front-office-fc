# L1/L2 UX-architectuur — werkdocument

## Scope en status
L1 en L2 uitsluitend. **Implementatie gedeeltelijk; niet vrijgegeven als gevalideerde release.**

## Bestuurlijke informatiearchitectuur
Behoud vijf bestaande tabs: Week, Tables, Squad, Club en Money. Club bevat voortaan bovenaan een bestuursdashboard met competitiepositie, kas, vertrouwen, stadion en waarschuwing. Zes shortcuts leiden naar bestaande verantwoordelijkheden: staf, afdelingen, stadion, begroting, commercie, leden.

De shortcuts veranderen de onderliggende commando's niet; ze maken bestaande handelingen vindbaar. Stafkandidaten krijgen een vergelijking met de zittende medewerker: relatieve geschatte rating, weekloondelta en upfront kosten.

## Beslissjabloon voor volgende implementatie
1. Huidige staat en divisiebenchmark.
2. Alternatieven met directe en structurele kosten.
3. Tijdsduur en onzekerheid.
4. Uitvoeren via bestaand `cmd()`.
5. Waar en wanneer het resultaat wordt teruggezien.

## Nog open
- Browsercontrole van navigatie, focus en touch targets.
- Consistente besliscontext bij afdelingen, sponsor, financiering en projecten.
- Weekflow met expliciete resultaten en consequenties.
- Volledige regressietests en meerjarige strategietests.
- Build `node build.js` en artefactcontrole.
