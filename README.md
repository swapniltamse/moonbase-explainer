# Wiring the Moon

An interactive explainer of what it takes to put a lunar base online: communications, navigation, timing and observation at the lunar South Pole, phase by phase, built from NASA's own documents.

Live at [moonbase.swapniltamse.com](https://moonbase.swapniltamse.com).

The core source is NASA SCaN's *Lunar Communications, PNT and Observability Industry Demand Signal* (August 28, 2026). It is a dense paper of four requirement tables. The site turns those tables into something you can move through. Pick a phase and every figure on the page, and the 3D scene of the South Pole, updates to match.

Independent project. Not affiliated with, produced by, or endorsed by NASA.

## Design principles

Three rules shaped every decision.

1. **Every number is traceable.** Each figure carries a tag naming its source document and table or PDF page (`T2`, `UG 4`, `SRD 27`). Every tag links to its source on the Sources page, so a reviewer can check any value against the original in under a minute.
2. **Nothing is invented, and the exceptions are labeled.** Where a lay reader needs a yardstick (gigabit home fiber, an Olympic pool, how far light travels in a microsecond), it is tagged `mine` in a dashed box. Schematic elements, such as relay orbits the paper does not specify, are captioned as schematic.
3. **Disagreement is shown.** When sources conflict, the site shows both values and states which one it uses. It never silently picks one. The [Sources page](https://moonbase.swapniltamse.com/sources/) logs nine such conflicts, including NASA's own phase dates differing between a web page and the paper published four days later.

## What is interesting under the hood

### A verification pipeline for eight documents

The paper cites a stack of references: the LunaNet Interoperability Specification, the Augmented Forward Signal standard, the Lunar Relay Services Requirements Document, the Moon to Mars Architecture Definition Document (304 pages), the Moon Base User's Guide and several nasa.gov pages. Research agents read the references in parallel and returned facts with PDF page numbers and verbatim quotes.

Agent output was not trusted directly. A script split every source PDF's extracted text by page and checked all 50 quotes against the page they claimed. Two figures that could not be located in the source text were dropped instead of paraphrased. One document turned out to number its printed pages 9 lower than its PDF pages, so every tag was normalized to PDF page numbers.

The same pass surfaced findings a single read would miss:

- The relay requirements document was posted in 2025 but baselined in 2022 and last changed in 2023. It is dated accordingly on the site.
- Its first service volume starts at 80° S, while the 2026 paper uses 84° S.
- Artemis III is no longer a landing mission.
- One reference link in the paper returns 404. The site documents that and uses the specification that cites its predecessor revision.

### A South Pole close-up in its native projection

Global Moon maps are equirectangular, and they smear badly near the poles. The close-up view replaces that region with the LRO camera team's South Pole mosaic (LROC Wide Angle Camera, NASA/GSFC/Arizona State University) at about 474 m per pixel, more than ten times the detail the global map has there.

The mosaic is published in polar stereographic projection. The PDS label supplies the parameters (map scale, projection center, pixel offsets), and the site cropped it to 20° from the pole. At load time, each vertex of a spherical cap over the pole is converted back to latitude and longitude, then forward through the stereographic formula to its texture coordinate. The imagery therefore lands exactly where the global map places the same terrain, and a radial alpha fade removes the seam.

The mapping was validated before it shipped. The projection math predicted where Schrödinger basin should appear in the image, and the basin's double ring sits at that pixel. The 1.2 MB image loads only when someone first opens the close-up.

### Relays that move the way relays move

Relay orbits are schematic, because the requirements specify coverage, not constellations. Their motion is still physical. Positions come from solving Kepler's equation (Newton iteration on eccentric anomaly), so each relay slows at the high end of its orbit over the south and spends most of its time where the base needs it. A link line appears only when a relay is above a surface site's local horizon.

### Figures that stay honest at scale

- **Navigation accuracy.** The 50, 25 and 10 m uncertainty circles are drawn over a 300 m patch of real terrain near the pole at 1 m per pixel, from LRO's Narrow Angle Camera polar mosaic. That mosaic tile is a 2 GB uncompressed GeoTIFF, 45,488 pixels square. Rather than download it, a small file-like wrapper serves `tifffile` over HTTP range requests: the header costs 1 MB, the strip offsets give each row's byte position, and each candidate patch is one contiguous range of about 14 MB. The circles, the terrain and an Olympic pool share one metric coordinate system, so every comparison is exact.
- **Imaging resolution.** A 2 m patch of ground with two rocks is rendered at 1 cm, then each output pixel is the mean of its block, which is how a sensor integrates light. At 50 cm the patch is 16 pixels; at 25 cm the boulder begins to hold its outline.
- **Radio bands.** The band map uses a logarithmic axis from 2 to 30 GHz, so S-band, X-band and K-band allocations are all legible on one row.
- **Service volume.** The service region and its altitude (125 km, then 200 km) are drawn to scale against the Moon's 1,737.4 km radius, with a live 100 km scale bar in the close-up.

### Accessibility held to the federal standard

The site targets WCAG 2.1 AA, the standard U.S. federal sites are held to.

- An axe-core audit of all four pages, in both light and dark themes, reports zero violations. Before the redesign, the same audit found three violation types (color contrast, missing landmarks and an empty table header) across the pages.
- WCAG 2.2.2 requires a way to pause motion that runs longer than five seconds. Automated checkers cannot detect it, so it was added by review: a Pause control stops all animation, and the scene starts paused when the operating system requests reduced motion.
- The phase switch and the globe are keyboard operable (arrow keys, 1 to 3, Enter). Touch targets are at least 44 px. Every page has a skip link and header, main and footer landmarks.

### Design

The type system follows nasa.gov, which is built on the U.S. Web Design System: Inter for display, Public Sans for reading and DM Mono for numbers. It uses the carbon-and-gray palette, and no NASA insignia, logotype or wordmark. One element carries the visual weight, a sticky phase rail whose segments are proportional to the years each phase covers. Everything else is separated by rules and space.

### Performance, measured

A Lighthouse 12 audit (home page, local server, same conditions before and after) found a layout shift of 0.328 on desktop. Anything above 0.1 counts as poor. Three causes, three fixes:

- Web fonts re-wrapped the headline when they arrived. The fonts are now self-hosted (124 KB, variable files deduplicated) and the two needed for first paint are preloaded. This also removed a render-blocking third-party request.
- The 3D globe loaded three.js (600 KB) up front and drew every frame even off screen. three.js now loads only when the globe nears the viewport, and drawing pauses when it scrolls away or the tab is hidden.
- The globe rewrote label text every frame, which woke the page's DOM observers 60 times a second. Labels now change only when their text does.

| | Score | First paint | Largest paint | Layout shift |
| --- | --- | --- | --- | --- |
| Desktop, before | 45 | 0.9 s | 2.2 s | 0.328 |
| Desktop, after | 72 | 0.5 s | 1.4 s | 0.015 |
| Mobile, before | 40 | 3.0 s | 11.0 s | 0.002 |
| Mobile, after | 47 | 1.7 s | 6.9 s | 0.001 |

Most of the remaining mobile cost is WebGL start-up. The audit runs it on a throttled CPU with software rendering, so a phone with a GPU pays far less.

## Tradeoffs

| Decision | Why | Cost |
| --- | --- | --- |
| No framework, no build step | Four static pages; nothing to compile, nothing to go stale | Shared UI is repeated across pages |
| All data in one file (`assets/data.js`, `assets/refs.js`) | A revised source means editing one file, and the JSON and CSV downloads are generated from it | Data is plain JS objects, not a schema-validated format |
| Show conflicting sources side by side | Credibility with readers who know the documents | Some sections carry a note most readers skip |
| Schematic relay orbits | The requirements specify coverage, not constellations; drawing real orbits would imply knowledge the sources do not contain | Less literal than it could look |
| Lazy-load the polar mosaic | Most visitors never open the close-up | A short delay the first time someone does |

## Checks

The site's claims are tested, not just stated.

| Check | When | What it proves |
| --- | --- | --- |
| `node tools/export-data.mjs --check` | every push | The downloadable JSON and CSV match the data the page renders |
| `python tests/a11y.py` | every push | Zero axe-core WCAG 2.1 AA violations on all four pages in both themes, and no sideways scroll on a 390 px phone |
| `python tests/check_links.py` | every push, monthly | Every external link still resolves |
| `python tests/verify_quotes.py` | monthly | All 53 quoted facts are still on their cited PDF pages, re-downloaded from NASA |
| `python tests/source_watch.py` | monthly | The NASA pages the site relies on still say what it quotes |

The monthly run opens a GitHub issue when anything changes, so the site gets reviewed instead of quietly going stale. Each check was also run against a deliberate failure (a missing phrase, a dead link) to confirm it catches one.

## Running it

No install. Serve the folder with any static server:

```sh
python -m http.server 8000
# open http://localhost:8000
```

Deep links: `?phase=1|2|3` selects a phase, and `?theme=light|dark` sets the theme.

## Structure

```
index.html              the story: phase rail, globe, traffic, talk, navigate, see, base, build
standards/              LunaNet, the navigation signal, band map, relay build-out, security
sources/                every source document and every documented disagreement
how-it-works/           colophon
assets/data.js          SCaN paper and User's Guide figures, one object per phase
assets/refs.js          reference-document facts, sources and the conflicts log
assets/moonbase.css     components
assets/site.css         design tokens and base styles
assets/moonbase-data.*  every figure as JSON and CSV, generated by tools/export-data.mjs
tests/                  quote verification, source watch, link check, accessibility
.github/workflows/      checks on every push, and the monthly source check
```

## Sources

| Tag | Document |
| --- | --- |
| T1 to T4 | NASA SCaN, Lunar Communications, PNT and Observability Industry Demand Signal, August 28, 2026 |
| UG | NASA, Moon Base User's Guide: Architecture Resources, April 2026 |
| LN | LunaNet Interoperability Specification v5 (NASA, ESA, JAXA), January 2025 |
| AFS | LunaNet Signal-In-Space Recommended Standard, Augmented Forward Signal, Vol. A v1, January 2025 |
| SRD | Lunar Relay Services Requirements Document, ESC-LCRNS-REQ-0090 Rev B (baselined 2022) |
| ADD | Moon to Mars Architecture Definition Document, Revision C, December 2025 |
| FS | NASA Ignition fact sheet, Building the Moon Base, March 2026 |
| WEB | nasa.gov Moon Base, Moon Base phases, Moon Base systems and Artemis pages |

Full links are on the [Sources page](https://moonbase.swapniltamse.com/sources/).

## Credits and licenses

Code is released under the [MIT License](LICENSE). Third-party assets keep their own terms (see [NOTICE.md](NOTICE.md)):

- Moon surface texture: [Solar System Scope](https://www.solarsystemscope.com/textures/), CC BY 4.0, based on NASA data.
- South Pole mosaic: LROC Wide Angle Camera, NASA/GSFC/Arizona State University (Speyerer et al., 2020, Lunar Surface Science Workshop, abstract 5132).
- 1 m terrain patch: LROC Narrow Angle Camera controlled South Pole mosaic, NASA/GSFC/Arizona State University (Archinal et al., 2023, LPSC abstract 2333).
- [three.js](https://threejs.org/), MIT License, vendored in `assets/three.min.js`.
- NASA documents are public. Quotations are attributed to their source and page.

Companion to [Weighing the Moon](https://grail.swapniltamse.com), an interactive tribute to NASA's GRAIL mission.

Built by [Swapnil Tamse](https://www.swapniltamse.com) with Claude Code. Research design, verification and editorial decisions are mine, and every figure was checked against the source PDFs.
