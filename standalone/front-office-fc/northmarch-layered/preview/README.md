# Speelbare preview (Northmarch Slimline)
Een kopie om te bekijken en te spelen. De bron van waarheid is `src/`; de HTML wordt door `build.js` gegenereerd. Niet bewerken. Dit bestand staat bewust in Git; `dist/` niet (die map is gegenereerd en genegeerd).

## Herkomst van dit bestand (bij elke nieuwe preview bijwerken)
| Veld | Waarde |
|---|---|
| Bestand | `preview/northmarch-slimline.html` |
| Bron-commit | `d7d705c` (officiële tip van `slimline-main` na pull request 9) |
| Buildvariant | **basis (L1/L2)**: standaard `node build.js`, `ENGINE_BASE` en `UI_BASE`, zonder optionele L3-modules |
| SHA-256 | `3e029ee71f0c38ab952dd9920d4d5969a4a77b50aa6c7aeac0c01218049ca781` |
| Ook gelijk aan | artifact V16 (`https://claude.ai/artifact/MsN96ouEWMVwn76jvKr3Qw`), gebouwd uit `02d2eaa`: een verse build van `02d2eaa` en van `d7d705c` geeft dezelfde checksum en onder `src/` en `build.js` verschilt geen bestand |
| Gebouwd op | 2026-11-22 |
Controleer: `sha256sum preview/northmarch-slimline.html`, en vergelijk met een eigen build van de genoemde commit (`git checkout <sha> && node build.js && sha256sum dist/artifact.html`).

## Openen
- Eén bestand, geen afhankelijkheden, geen netwerk nodig.
- Download `northmarch-slimline.html` en open het in een browser, of serveer lokaal: `python3 -m http.server` in deze map.
- Ruwe link (kan als platte tekst worden getoond; sla het dan op als .html): `https://raw.githubusercontent.com/Blauwev0gel/front-office-fc/claude/loving-goodall-uv00vn/standalone/front-office-fc/northmarch-layered/preview/northmarch-slimline.html`
- Mobiel testen: viewport 390 × 844.

## Regels
- Een preview wordt alleen bijgewerkt bij een bewuste publicatie, vanuit de officiële tip (`scripts/sync-check.sh --publish`), en alle velden hierboven worden dan mee bijgewerkt.
- `.gitignore` kan een preview niet tegenhouden: wie een nieuwe preview commit, legt bron-SHA, buildvariant en checksum hier vast, anders is de herkomst onbekend.
- Zonder die velden geldt een preview niet als "de nieuwste speelbare versie".
