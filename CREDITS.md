# The Masters prototype - sources and licences

Everything below is a placeholder to be replaced by the client's own material, except the logos, which come from the client's own site.

## Video (Pexels licence: free for commercial use, no attribution required)

| File | Source | Uploader (as shown on page data) | Use |
|---|---|---|---|
| `assets/video/hero-rolex-slow.mp4` (in use: source slowed 2.5x with frame interpolation, played at 0.5) and `hero-rolex.mp4` (unslowed) + `hero-rolex-poster.jpg` | https://www.pexels.com/video/close-up-view-of-a-rolex-oyster-perpetual-watch-17197593/ | westarmoney | Hero slide 1, also blurred in the background. Chosen by Ori. Re-encoded (H.264, 1920 wide, no audio). |
| `assets/video/card-mechanism.mp4` + `card-mechanism-poster.jpg` (made from `hero-movement.mp4`: slowed 2x with frame interpolation, 1280 wide, no audio; played at 0.8) | https://www.pexels.com/video/intricate-clock-mechanism-in-motion-31592458/ | tima-miroshnichenko | Uniqueness card 2, muted loop, plays only on screen. Replaced the still `value-2-vintage-gold.jpg` (kept, unused). |

## Photographs (Pexels licence)

| File | Source | Uploader (as shown on page data) | Use |
|---|---|---|---|
| `assets/images/hero-3-daytona-stand.jpg` | https://www.pexels.com/photo/luxurious-emerald-green-gold-watch-display-36450789/ | atelierbyvineeth | Hero slide 2 (shows a real Rolex watch) |
| `assets/images/concept-gold-bridge.jpg` | https://www.pexels.com/photo/close-up-of-intricate-mechanical-watch-gears-34182730/ | pixabay | About section |
| `assets/images/value-1-skeleton.jpg` | https://www.pexels.com/photo/macro-view-of-intricate-watch-gears-31123762/ | alankrantas | Uniqueness card 1 |
| `assets/images/value-2-vintage-gold.jpg` | https://www.pexels.com/photo/round-skeleton-watch-277319/ | pixabay | Uniqueness card 2 |
| `assets/images/value-3-gold-gears.jpg` | https://www.pexels.com/photo/close-up-of-elegant-watch-gears-and-mechanisms-34182727/ | alankrantas | Uniqueness card 3 |

| `assets/images/hero-1-movement-dark.jpg` | https://www.pexels.com/photo/close-up-of-watch-movement-mechanics-34149486/ | JimBear | Brand panel 6 (stand-in) |
| `assets/images/brand-7-rosegold-dial.jpg` | https://www.pexels.com/photo/19810831/ | (not read) | Brand panel 7 (stand-in) |
| `assets/images/brand-8-gold-reflection.jpg` | https://www.pexels.com/photo/28135838/ | (not read) | Brand panel 8 (stand-in) |

The photographs in the brand panels are stand-ins and are not pictures of those brands' watches.

## Example brands (not the client's)

At Ori's request three brands from the reference site are shown only to see the panels with eight items: Ferdinand Berthoud, Greubel Forsey and Laurent Ferrier (`assets/logos/ref/*-on-dark.png`, made from the logo files on https://www.art-in-time.com/, black on white converted to white on transparent). They carry `data-example="true"` in `index.html`. Remove before anything is shown as the client's real list.

## Copy

The FAQ answers are the client's own text from https://www.themasters.co.il/ rewritten for clarity; no facts were added. Claims such as the warranty length (two to five years) and free cleaning during the warranty are the client's and unverified here.

Uploader names were read from each Pexels page and are not verified. Some pictures show third-party watch brands or a Rolex; they are stand-ins only.

## Brand assets (taken 1:1 from https://www.themasters.co.il/)

- `assets/logos/*.png`: The Masters (brown and light versions), Rolex, Tudor, L'Epée 1839, H. Moser & Cie, Urwerk, as served by the client's site. `assets/logos/trim/` holds the same files with transparent margins cropped, nothing redrawn.
- `assets/logos/masters-logo-brown.svg` and `masters-emblem.svg`: vector paths taken from the SVG the client's site serves for its own logo, coloured with the brown (#593D2C) and gold (#C99E66) of the client's brown PNG. They replace the cropped PNG in the header (the automatic margin crop had clipped the left edge of the T).
- Official Rolex Retailer badge: the live widget Rolex provides, embedded as the client's site embeds it (`static.rolex.com/retailers/clock`). The key in the embed belongs to the client's own site; confirm it is allowed on the final domain.

## Font

COLBO Extended (Hagilda), weights 300, 400, 700, 900, web subset of 80 glyphs. Self-hosting licence is per domain; Ori reported a licence for The Masters was bought and the bank transfer is pending. Source files came from `My.webinside/clients/Shaar-Hanegev/assets/fonts/colbo/`.

## Working files

`assets/_cand/` holds candidate downloads used for selecting pictures and videos. Not part of the page.
