# Braun Log Homes website

Static website for Braun Log Homes, deployed to GitHub Pages with the custom domain `braunloghomes.com`.

## Repositories

- Website: [thebalddudeco/braun-log-homes](https://github.com/thebalddudeco/braun-log-homes)
- Seasonal media: [TheBaldDudeCo/braun-log-homes-seasonal-gallery](https://huggingface.co/datasets/TheBaldDudeCo/braun-log-homes-seasonal-gallery)

The Hugging Face repository is the source of truth for seasonal gallery images and hero videos. Each season folder contains its complete optimized WebP image set plus `hero.webm`:

- `fall/` — 12 images + `hero.webm`
- `winter/` — 11 images + `hero.webm`
- `spring/` — 12 images + `hero.webm`
- `summer/` — 12 images + `hero.webm`

Seasonal photos are stored as WebP files with the longest edge limited to 2048 pixels. Seasonal hero videos are WebM files with the longest edge limited to 2048 pixels.

## Seasonal behavior

The site selects the season from the calendar when it loads:

- Fall: September–November
- Winter: December–February
- Spring: March–May
- Summer: June–August

The selected season controls the hero video, feature image, selected-work image, and the full project carousel.

For local preview testing, append a season override:

```text
http://localhost:4173/?preview=latest&season=winter#top
```

Replace `winter` with `fall`, `spring`, or `summer` as needed. Without the parameter, the site uses the current calendar season.

## Local preview

Run the static site from this directory on port 4173, then open:

```text
http://localhost:4173/?preview=latest#top
```

The intro can be inspected with `?intro=1`. Reloading the page returns the site to the top.

## Deployment

Every push to `main` runs `.github/workflows/pages.yml` and deploys the site to GitHub Pages. The repository contains the `CNAME` file for `braunloghomes.com`.

The contact form does not use a third-party form service. It opens the visitor's native email app with the entered details addressed to `braunloghomesllc@yahoo.com`.
