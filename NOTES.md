# Project notes

## Current release

- Website repository: `thebalddudeco/braun-log-homes`
- Seasonal media repository: `TheBaldDudeCo/braun-log-homes-seasonal-gallery`
- Production domain: `https://braunloghomes.com/`
- GitHub Pages URL: `https://thebalddudeco.github.io/braun-log-homes/`
- Local preview: `http://localhost:4173/?preview=latest#top`

## Seasonal media contract

The website pulls all seasonal gallery media from the Hugging Face repository. The folder names are lowercase and must remain exactly:

```text
fall/
winter/
spring/
summer/
```

Each folder contains the optimized WebP image set for that season and a `hero.webm` file. Photos are capped at a 2048-pixel longest edge. The website maps the current season to the matching folder and uses the complete image list for the carousel.

## Preview override

Use `?season=winter`, `?season=spring`, `?season=summer`, or `?season=fall` to simulate a season locally. This override is for testing only; normal visitors use the calendar automatically.

## Release verification

After pushing website changes:

1. Confirm the GitHub Pages workflow completes successfully.
2. Open the local preview and verify the requested section or interaction.
3. For seasonal changes, test at least one explicit `season=` override and confirm the matching gallery and video load.
4. Confirm the custom domain still resolves to the GitHub Pages deployment.
