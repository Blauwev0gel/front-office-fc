# DEV_PROTOCOL: samenwerken zonder tussenpersoon
Principe: **GitHub bepaalt de waarheid**, niet wat een ontwikkelaar of een gesprek zegt. Wie wil weten wat de nieuwste versie is, leest `docs/DEV_STATE.md` op `slimline-main`.

## Branches
| Branch | Rol | Mag rechtstreeks gepusht worden? |
|---|---|---|
| `slimline-main` | **Officiële ontwikkelbasis.** Alleen gecontroleerde, geteste wijzigingen. Van hier komt elke publicatie. | **Nee**: alleen via pull request met groene CI |
| Werkbranch per ontwikkelaar (Claude: `claude/loving-goodall-uv00vn`; ChatGPT: eigen branch) | Eigen werk, vrij pushen | Ja, alleen door de eigenaar |
| `main`, `chatgpt`, `claude-game`, overige | Ander project of archief | Niet aanraken |
Beide ontwikkelaars pushen **nooit** naar elkaars werkbranch.

## Functionele lagen en modulegrenzen (verplicht)

Lees `docs/LAYER_CONTRACT.md` naast `docs/ARCHITECTURE.md` en `docs/DEV_STATE.md`.
**Eerst het zelfstandig speelbare basisspel (L1 + L2), daarna pas L3 autonomie, L4 verhaal en L5 dynasty.**
Nieuwe code in een hogere laag moet via generieke events, commands en UI-slots integreren, niet door rechtstreeks het basisspel of de centrale klok afhankelijk te maken van extra lagen. De basis moet zonder de hogere module blijven werken; maak daarvoor een regressietest. S3.1 en S3.2 zijn nu als optionele modules losgetrokken; de standaard `node build.js` bevat uitsluitend L1/L2. De grens wordt door `tests/base-isolation-test.js` gecontroleerd.
Geef in iedere PR aan welke laag de wijziging raakt en bewijs de onafhankelijkheid van het basisspel. Verwar CI groen niet met de inhoudelijke fase-A-gate.

## Voor iedere codewijziging (verplicht)
1. `git fetch origin slimline-main` en `scripts/sync-check.sh` draaien. Bestaat het script op je branch nog niet, dan loop je achter: eerst `git merge origin/slimline-main`. Exitcode 1 betekent: stop en synchroniseer eerst (`git merge origin/slimline-main`), los conflicten **zichtbaar** op (lees beide kanten, geen "ours/theirs" op de bonnefooi), bouw (`node build.js`), en draai de check opnieuw.
2. Geen stilzwijgende overschrijvingen: een conflict in iemands gebied wordt vermeld in `DEV_STATE.md` onder "Open wijzigingen".
3. Werk in het eigen gebied (tabel in `DEV_STATE.md`). Wil je een ander gebied raken, meld het eerst daar.

## Bij het afronden van een werksessie
1. `node build.js` en een korte controle (de bestaande snelle tests draait CI; zware tests alleen op verzoek van de eigenaar).
2. `docs/DEV_STATE.md` bijwerken: officiële SHA (na merge), werkgebieden, open wijzigingen, teststatus (wat is **echt** gedraaid, op welke SHA), artifact-SHA. Een resultaat zonder SHA telt niet; "niet gedraaid" is een geldig antwoord.
3. Pull request naar `slimline-main`. Titel: gebied + doel. CI (`build-and-test`, `mobile-browser`, `dev-state-updated`) moet groen zijn en de branch up-to-date met `slimline-main`.
4. Na de merge: de andere ontwikkelaar haalt `slimline-main` op voordat die weer code wijzigt.

## Publiceren (artifact of release)
- Alleen vanaf de officiële tip: `scripts/sync-check.sh --publish` moet slagen. De controle kijkt naar de SHA, niet naar de branchnaam: HEAD moet **exact** de tip van `origin/slimline-main` zijn en de werkmap schoon.
- Daarna `ARTIFACT_VERSION`, `ARTIFACT_SHA` (de bron-commit waaruit gebouwd is) en de preview-velden in `DEV_STATE.md` bijwerken (aparte documentatiecommit via pull request).
- **`dist/` wordt niet in Git gezet**: het is gegenereerd (`node build.js`) en staat in `.gitignore`. Een speelbare kopie in Git is alleen `preview/northmarch-slimline.html`, en dan met bron-SHA, buildvariant (basis L1/L2 of met L3) en SHA-256 in `preview/README.md` en `DEV_STATE.md`. Zonder die velden geldt een bestand niet als nieuwste speelbare versie.
- Tests die de gebouwde HTML lezen (`base-isolation-test`, `playtest`) draaien altijd ná `node build.js` (zo staat het in `tests/run-fast.sh`).
- Nooit publiceren vanaf een SHA die niet de officiële tip is (dus niet vanaf een werkbranch met eigen, nog niet gemergede commits).

## Branchbescherming (instellen door de repo-eigenaar in GitHub)
Settings → Branches → Add rule (of `gh api`), voor `slimline-main`:
- Require a pull request before merging (geen directe pushes, ook niet voor beheerders: "Do not allow bypassing").
- Require status checks to pass: `build-and-test`, `mobile-browser` en `dev-state-updated`; **Require branches to be up to date before merging**.
- Block force pushes en deletions.
Hetzelfde als commando (eenmalig, nadat de eerste CI-run de checknamen heeft aangemaakt):
```
gh api -X PUT repos/Blauwev0gel/front-office-fc/branches/slimline-main/protection --input - <<'JSON'
{"required_status_checks":{"strict":true,"contexts":["build-and-test","mobile-browser","dev-state-updated"]},
 "enforce_admins":true,
 "required_pull_request_reviews":{"required_approving_review_count":0},
 "restrictions":null,"allow_force_pushes":false,"allow_deletions":false}
JSON
```

## Vaste instructie voor elke AI-ontwikkelaar (plak aan het begin van een sessie)
> Je werkt aan Northmarch Slimline (`standalone/front-office-fc/northmarch-layered/`). GitHub is de waarheid. Lees `docs/LAYER_CONTRACT.md`: basisspel (L1+L2) eerst, autonomie (L3) pas daarna, nooit nieuwe directe afhankelijkheden van de basis naar hogere lagen. Voor iedere codewijziging: haal `origin/slimline-main` op en draai `scripts/sync-check.sh`; staat je branch achter, eerst synchroniseren en conflicten zichtbaar oplossen, nooit stilzwijgend overschrijven. Werk alleen op je eigen werkbranch en binnen je gebied uit `docs/DEV_STATE.md`. Zware tests alleen op verzoek; draai wel `node build.js` en een korte controle. Werk bij elke afgeronde sessie `docs/DEV_STATE.md` bij (officiële SHA, werkgebieden, open wijzigingen, wat echt gedraaid is op welke SHA, artifact-SHA) en lever via een pull request naar `slimline-main`. Publiceer nooit vanaf een werkbranch of een verouderde SHA. Verzin geen testresultaten.
