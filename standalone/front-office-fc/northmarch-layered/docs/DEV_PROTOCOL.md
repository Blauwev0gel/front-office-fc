# DEV_PROTOCOL: samenwerken zonder tussenpersoon
Principe: **GitHub bepaalt de waarheid**, niet wat een ontwikkelaar of een gesprek zegt. Wie wil weten wat de nieuwste versie is, leest `docs/DEV_STATE.md` op `slimline-main`.

## Branches
| Branch | Rol | Mag rechtstreeks gepusht worden? |
|---|---|---|
| `slimline-main` | **Officiële ontwikkelbasis.** Alleen gecontroleerde, geteste wijzigingen. Van hier komt elke publicatie. | **Nee**: alleen via pull request met groene CI |
| Werkbranch per ontwikkelaar (Claude: `claude/loving-goodall-uv00vn`; ChatGPT: eigen branch) | Eigen werk, vrij pushen | Ja, alleen door de eigenaar |
| `main`, `chatgpt`, `claude-game`, overige | Ander project of archief | Niet aanraken |
Beide ontwikkelaars pushen **nooit** naar elkaars werkbranch.

## Voor iedere codewijziging (verplicht)
1. `scripts/sync-check.sh` draaien. Exitcode 1 betekent: stop en synchroniseer eerst (`git merge origin/slimline-main`), los conflicten **zichtbaar** op (lees beide kanten, geen "ours/theirs" op de bonnefooi), bouw (`node build.js`), en draai de check opnieuw.
2. Geen stilzwijgende overschrijvingen: een conflict in iemands gebied wordt vermeld in `DEV_STATE.md` onder "Open wijzigingen".
3. Werk in het eigen gebied (tabel in `DEV_STATE.md`). Wil je een ander gebied raken, meld het eerst daar.

## Bij het afronden van een werksessie
1. `node build.js` en een korte controle (de bestaande snelle tests draait CI; zware tests alleen op verzoek van de eigenaar).
2. `docs/DEV_STATE.md` bijwerken: officiële SHA (na merge), werkgebieden, open wijzigingen, teststatus (wat is **echt** gedraaid, op welke SHA), artifact-SHA. Een resultaat zonder SHA telt niet; "niet gedraaid" is een geldig antwoord.
3. Pull request naar `slimline-main`. Titel: gebied + doel. CI (`build-and-test`, `dev-state-updated`) moet groen zijn en de branch up-to-date met `slimline-main`.
4. Na de merge: de andere ontwikkelaar haalt `slimline-main` op voordat die weer code wijzigt.

## Publiceren (artifact of release)
- Alleen vanaf de officiële tip: `scripts/sync-check.sh --publish` moet slagen (HEAD = tip van `slimline-main`, schone werkmap).
- Daarna `ARTIFACT_VERSION` en `ARTIFACT_SHA` in `DEV_STATE.md` bijwerken (aparte documentatiecommit via pull request).
- Nooit publiceren vanaf een werkbranch of een verouderde SHA.

## Branchbescherming (instellen door de repo-eigenaar in GitHub)
Settings → Branches → Add rule (of `gh api`), voor `slimline-main`:
- Require a pull request before merging (geen directe pushes, ook niet voor beheerders: "Do not allow bypassing").
- Require status checks to pass: `build-and-test` en `dev-state-updated`; **Require branches to be up to date before merging**.
- Block force pushes en deletions.
Hetzelfde als commando (eenmalig, nadat de eerste CI-run de checknamen heeft aangemaakt):
```
gh api -X PUT repos/Blauwev0gel/front-office-fc/branches/slimline-main/protection --input - <<'JSON'
{"required_status_checks":{"strict":true,"contexts":["build-and-test","dev-state-updated"]},
 "enforce_admins":true,
 "required_pull_request_reviews":{"required_approving_review_count":0},
 "restrictions":null,"allow_force_pushes":false,"allow_deletions":false}
JSON
```

## Vaste instructie voor elke AI-ontwikkelaar (plak aan het begin van een sessie)
> Je werkt aan Northmarch Slimline (`standalone/front-office-fc/northmarch-layered/`). GitHub is de waarheid. Voor iedere codewijziging: haal `origin/slimline-main` op en draai `scripts/sync-check.sh`; staat je branch achter, eerst synchroniseren en conflicten zichtbaar oplossen, nooit stilzwijgend overschrijven. Werk alleen op je eigen werkbranch en binnen je gebied uit `docs/DEV_STATE.md`. Zware tests alleen op verzoek; draai wel `node build.js` en een korte controle. Werk bij elke afgeronde sessie `docs/DEV_STATE.md` bij (officiële SHA, werkgebieden, open wijzigingen, wat echt gedraaid is op welke SHA, artifact-SHA) en lever via een pull request naar `slimline-main`. Publiceer nooit vanaf een werkbranch of een verouderde SHA. Verzin geen testresultaten.
