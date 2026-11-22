# NORTHMARCH / FRONT OFFICE FC — GITHUB ACTIONS KOSTENPROTOCOL

**Vastgelegd op:** 22 november 2026
**Status:** bindende werkinstructie van de projecteigenaar, tot deze uitdrukkelijk wordt gewijzigd.

## Harde hoofdregel

**GEEN GitHub-pushes, commits via GitHub API, PR-updates, merges, workflow-edits, workflow-herstarts of andere mutaties die CI kunnen triggeren zonder voorafgaande, expliciete toestemming van de gebruiker.**

Een algemene opdracht zoals "ga aan de slag", "prima", "ik wacht" of "maak het af" **is geen toestemming om GitHub Actions-minuten te verbruiken**. Vraag expliciete toestemming voor het specifieke publicatie-/CI-moment, niet voor iedere lokale ontwikkelstap.

## Werkproces zonder CI-kosten

1. Ontwikkel wijzigingen lokaal, bundel ze tot één samenhangend, getest werkblok; lees GitHub desgewenst **alleen read-only**, zonder side effects.
2. Voer build, unit-/integratietests, simulaties en browserchecks lokaal uit waar beschikbaar. Geen lange tests bij elk klein tussenstapje.
3. Rapporteer wat daadwerkelijk lokaal is getest en wat nog onbewezen is. Geen geclaimde GitHub-CI-status voor een ongepushte wijziging.
4. Stel vervolgens één concrete GitHub-push/PR en maximaal benodigde CI-validatie voor, met uitleg over de verwachte kosten en welke workflow wordt gestart; vraag de gebruiker expliciet of dat mag.
5. **Pas na toestemming:** maximaal één gebundelde push; laat oude tests uitlopen of annuleer ze alleen met toestemming en waar technisch mogelijk; voorkom dubbele concurrente runs.
6. Geen automatische zware 20-seizoenssimulaties, Playwright-installaties of browser-e2e per commit. Verplaats deze naar lokale tests of expliciet door de gebruiker goedgekeurde releasegates.
7. Bij onbedoeld geactiveerde workflow: onmiddellijk stoppen met GitHub-mutaties, oorzaak en mogelijke kosten melden, en geen poging tot repareren via nieuwe pushes zonder toestemming.

## Extra waarborgen voor een toekomstige, goedgekeurde CI-reparatie

- Definieer `concurrency` met `cancel-in-progress` zodat oudere jobs niet stapelen.
- Scheid snelle, goedkope controle van langzame simulatie- en browsertests (handmatig/release-only voor de laatste).
- Gebruik padfilters, gecachete dependencies en duidelijke timeouts waar zinvol; review de gevolgen voor de bestaande branch protection vóór aanpassing.
- Kies één stabiel releasekandidaat-SHA voor de eindtest in plaats van vele opeenvolgende kandidaat-commits.

## Wat expliciet niet is toegestaan

- Een goedbedoelde architectuur- of documentatie-update rechtstreeks naar GitHub pushen.
- Documentatiecommits die de volledige testworkflow opnieuw aftrappen.
- Meerdere commits achter elkaar pushen terwijl voorgaande tests nog lopen.
- Automatisch een extra zware testjob toevoegen omdat dat technisch grondig lijkt.
- `CI is groen` als prioriteit boven de kostenlimiet van de gebruiker stellen.

**Deze instructie geldt voor vervolgwerk aan Northmarch / Front Office FC, ook wanneer de gebruiker alleen in algemene termen vraagt verder te bouwen.**

**Opslag:** dit document is buiten GitHub aangemaakt. Het is nog niet opgenomen in de GitHub-repository en mag daar niet geplaatst worden zonder expliciete toestemming.
