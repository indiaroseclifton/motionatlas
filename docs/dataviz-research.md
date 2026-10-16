# Data visualisation and flowchart research (October 2026)

These notes summarise web research (design systems, newsroom graphics, diagram tools) and the owner's Pinterest board ("website ux ui", including its Flowcharts section). The styles in `site/dataviz/styles.js` come from here.

## From the Pinterest board
- **Workflow canvases** (automation builders such as n8n, Zapier and Sendlane):
  - White cards on a dotted canvas, each with an icon tile, a bold title, a quiet subtitle and metric chips.
  - Connectors tinted by branch, with pill labels on the line and dots at each end.
- **Soft surfaces:**
  - Neumorphism: one pale surface, raised by a light from the top left and a shade to the bottom right.
  - Frosted, "liquid" glass panes over mint, rose and lilac washes (Vision Pro style).
  - Puffy pastel clay.
- **Calm kits:** ivory and sage with Inter; lilac/violet with a serif display face; generous radius and soft shadows.
- **Lineage swimlanes:** tinted columns with headers and compact nodes carrying tag chips.
- **OKR trees:** goals, then plan, then effort, joined by translucent ribbons.

## Recurring styles from research
1. **Swiss editorial (FT / Economist):** a headline that states the finding, hairline horizontal grid, direct labels, red tag. Chart choice follows the FT Visual Vocabulary: https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md
2. **Minimal Tufte:** data-ink first, range-frame axes, sparklines and small multiples.
3. **Newsroom grey with one highlight:** https://blog.datawrapper.de/colors
4. **Design-system SaaS:** Carbon's categorical order (https://carbondesignsystem.com/data-visualization/color-palettes/), Polaris (https://polaris.shopify.com/design/data-visualizations), Atlassian chart tokens (https://atlassian.design/foundations/color/data-visualization-color).
5. **Monochrome developer (Vercel / Linear):** hairlines, Geist and mono numerals.
6. **Hand-drawn (Excalidraw / tldraw):** Rough.js jitter, Excalifont: https://plus.excalidraw.com/excalifont
7. **Pastel diagramming (Whimsical / Eraser / FigJam):** https://docs.eraser.io/docs/styling
8. **Blueprint:** Prussian ground, cyan grid, mono labels. Mermaid themes for comparison: https://mermaid.js.org/config/theming.html
9. **Dark glass:** a 2023–24 period style.
10. **Neo-brutalist:** thick outlines, hard offset shadow.
11. **Risograph:** two spot inks, grain, misregistration.

## Flowchart rules the engine applies
- One direction across the whole chart.
- Consistent shapes: pill for start and end, rounded rectangle for an action, a decision badge (or diamond) for a decision, cylinder for data, parallelogram for input or output.
- Right-angle connectors with small rounded elbows, no crossings where avoidable, every branch labelled, loops routed round the outside.
- At most 5–6 lanes or stages. Split charts beyond about 25 steps.
- Colour has one job (status or group). Status is always colour plus a glyph, never colour alone.
- Sources:
  - Creately: https://creately.com/guides/flowchart-rules/
  - Nulab: https://nulab.com/learn/design-and-ux/keep-it-simple-follow-flowchart-rules-for-better-diagrams
  - draw.io: https://www.drawio.com/docs/manual/layouts/flow-layouts/
  - Swimlanes (Miro): https://miro.com/blog/swimlane-diagram/

## Accessibility
- Chart marks need 3:1 contrast with what's beside them, and text needs 4.5:1: https://dequeuniversity.com/resources/wcag2.1/1.4.11-non-text-contrast
- Colour-safe sets:
  - Okabe–Ito: `#E69F00 #56B4E9 #009E73 #F0E442 #0072B2 #D55E00 #CC79A7`
  - UK Analysis Function: https://gss.civilservice.gov.uk/policy-store/data-visualisation-colours-in-charts/

## Dashboards (for the next pass)
- Order: KPI row, then trends, then breakdowns, then tables. Keep to 5–7 KPIs.
- KPI tile anatomy: label, a large value in tabular figures, a ▲/▼ delta with its sign, the comparison period, and an optional sparkline.
- Current period in colour, comparison period in grey. Bento grids.
