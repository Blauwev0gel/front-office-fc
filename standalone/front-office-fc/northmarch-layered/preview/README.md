# Speelbare preview (Northmarch Slimline)
Dit is exact de HTML-build van de officiële tip `d7d705c` (`slimline-main`), gelijk aan artifact versie 16. Alleen een kopie om te bekijken en te spelen; de bron staat in `src/`, de build in `build.js`. Niet bewerken.

## Openen
- Eén bestand, geen afhankelijkheden, geen netwerk nodig.
- Download `northmarch-slimline.html` en open het in een browser, of lokaal serveren: `python3 -m http.server` in deze map, daarna `/northmarch-slimline.html`.
- Ruwe link (kan als platte tekst worden getoond; sla het dan op als .html):
  https://raw.githubusercontent.com/Blauwev0gel/front-office-fc/claude/loving-goodall-uv00vn/standalone/front-office-fc/northmarch-layered/preview/northmarch-slimline.html
- Mobiel testen: viewport 390 × 844.

## Bijwerken
Opnieuw bouwen uit de officiële tip: `node build.js`, daarna `cp dist/artifact.html preview/northmarch-slimline.html`. Werk de SHA hierboven bij.
