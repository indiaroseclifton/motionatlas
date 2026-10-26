# Image, film, icon and font licences in the site builder

Which assets the page builder (`site/page-builder.html`) offers, where they come from, and whether a user may
use them in a site they export or publish. The same data drives `site/builder/credits.js`, which writes
`assets/CREDITS.txt` into every export. Updated with the photo library (`site/assets/photos/photos.json`).

| Asset | Where it lives | Source | Licence | OK in an exported site? | Notice in `CREDITS.txt` |
|---|---|---|---|---|---|
| Shelf pictures (20 `.webp`: amber, bloom, dove, lion, owl, …) | `assets/shelf/` | Generated for the atlas (AI image generation; renders also used as start frames for the films) | Original to the atlas, no third-party stock | Yes, as offered by the atlas. The generating service's terms are not recorded in this repository: owner to confirm commercial-use terms | "Atlas generated art" block with the caveat |
| Atlas films and posters (26 loops: smoke-plume, light-threads, paper-bird, …) | `assets/films/` | AI image-to-video loops made for the atlas (`docs/film-prompts.md`, `tools/add-film.sh`) | Original to the atlas | Yes. Exports link the films on the atlas domain (not copied) so keep that host up or copy them | Same block |
| Landing-effect clips | `assets/fx/` | Generated for the atlas | Original to the atlas | Yes | Same block |
| Photo library (see below) | `assets/photos/` | Wikimedia Commons and other CC0 / public-domain sources, per `photos.json` | CC0 or public domain, per photo | Yes. Attribution not required, listed anyway | One line per photo used (title, author, licence, source URL) |
| Met Open Access artworks (44) | `assets/art-refs/` | The Metropolitan Museum of Art Open Access | CC0 | Yes, but not offered in the builder library | Credit line if used |
| Generated backgrounds (shaders), interactions, theme kits, section layouts, glyphs | code | Written for the atlas | Original | Yes | Single sentence |
| Icon family Phosphor (thin, light, regular, bold, fill, duotone) | `icons/` | `@phosphor-icons/core` 2.1.1 | MIT | Yes | Copyright line |
| Heroicons (hero-outline, hero-solid) | `icons/` | heroicons 2.2.0 | MIT | Yes | Copyright line |
| Lucide | `icons/` | lucide-static | ISC | Yes | Copyright line |
| Tabler | `icons/` | `@tabler/icons` | MIT | Yes | Copyright line |
| Pixelarticons | `icons/` | pixelarticons 2.4.2 | MIT | Yes | Copyright line |
| OpenMoji | `icons/` | openmoji 17.0.0 | CC BY-SA 4.0 | Yes **with attribution and share-alike** for the emoji | Credit and share-alike notice |
| Fluent Emoji (fluent-3d) | `icons/` | microsoft/fluentui-emoji | MIT | Yes | Copyright line |
| Fonts | Google Fonts at runtime | Google Fonts | SIL OFL / Apache 2.0 | Yes (linked from Google) | One sentence |
| Uploaded images | the user's browser | The user | The user's responsibility | Yes | "Other files" note |
| Official vendor resources (Apple, Atlassian, Material, Spectrum thumbnails) | `assets/official-*`, `apple-ui-kit-official.webp` | Vendor design-system pages | Vendor terms | **Not offered in the builder.** Used only on the atlas's own reference pages | n/a |

## Findings

* Nothing offered by the builder's media library is third-party museum or stock material. The only items needing
  a notice in an export are the icon families (MIT/ISC lines, and OpenMoji's CC BY-SA) and the public-domain photos.
* The shelf pictures and films are generated, and the repository records no terms for the generating service.
  They are treated as the owner's own output, but this is **unverified**: confirm before commercial redistribution.
* Templates prefer real photographs where one fits (step 3 of the photo work), so generated art is now used mainly
  where no photograph does.
* Any asset path the credits table does not know is reported as "Other files" and flagged as not cleared in the export QA.
