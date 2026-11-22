# Northmarch Slimline: speelbare versie

Eén bestand, `index.html`. Gewoon openen in een browser; geen installatie, geen netwerk nodig.

| Veld | Waarde |
|---|---|
| Bron-commit | `6d28014` (`slimline-main`, de officiële tip) |
| Buildvariant | basis (L1/L2), standaard `node build.js`, zonder optionele L3-modules |
| SHA-256 van index.html | `3e029ee71f0c38ab952dd9920d4d5969a4a77b50aa6c7aeac0c01218049ca781` |
| Gebouwd op | 2026-11-22 |

Deze branch bevat **alleen** de build. De broncode staat op `slimline-main` (`standalone/front-office-fc/northmarch-layered/`). Hier wordt niet ontwikkeld: de branch wordt alleen bij een bewuste publicatie bijgewerkt, vanuit de officiële tip, en dan worden de velden hierboven mee bijgewerkt.

Controleren: `sha256sum index.html` moet gelijk zijn aan de checksum hierboven; een eigen build van de bron-commit (`node build.js`, `dist/artifact.html`) geeft dezelfde bytes.

Ruwe link (sla op als .html): https://raw.githubusercontent.com/Blauwev0gel/front-office-fc/slimline-live/index.html
