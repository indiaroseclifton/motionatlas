# Icon families rebuild — plan

Spec: docs/superpowers/specs/2026-11-13-icons-rebuild-design.md

1. tools/icons.py: ICONIFY table, build_iconify(), specimen writing, specimens.json,
   LICENSES.txt blocks for new families. Run; check counts, licences, pack sizes.
2. site/specimens.js: families list (22, with look groups and toggles), svg() with cache.
3. site/icon-library.js + atlas.html#icons + app.css: look bar, look cards, inspect
   panel, a11y fixes; stop mounting extracted assets into #icons (extracted.js).
4. site/projects.js (+ atlas.html dialog, app.css): iconPicks, picker, swatches, export.
5. icons.html / icons-browser.js: verify new families, animated and colour sets.
6. README.md counts and family table; site/counts.json; tools-data.js FALLBACK.
7. QA: no console/page errors on #icons, #projects, icons.html; no sideways scroll at
   1440/390; axe serious/critical clean; phone screenshots.
8. Commit, push to main (Vercel deploys).
