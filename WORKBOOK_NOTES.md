# Workbook structure reference (captured from real files, not the original spec)

## Plant 2 — Quick Hitch Cycle Time Database Workbook
Sheets: Bucket Roll, Manual Shell Weld, Teeth And Logo, Teeth Weld, Ear & Bushing Install, Master Dashboard, Fastest by Process

Standard columns (Bucket Roll, Manual Shell Weld, Teeth Weld):
Date, Frame #, Frame Width (in), Operator, Cycle Time (min), VA Time (min), NNVA Time (min), VA %, NNVA %, # of Observations, Notes

Teeth And Logo adds: Tooth Type, # of Teeth, Time per Tooth (min) (inserted after Operator/# of Teeth)
Ear & Bushing Install adds: Ear Type (inserted after Frame Width)

VA % / NNVA % are formulas, never typed manually.
Width values use "in" suffix (e.g. "10in") — required for Master Dashboard AVERAGEIFS lookups.

## Plant 1 — Large Bucket Cycle Time Workbook
Sheets: Bucket Roll, Teeth and Logo, Ears, Weld, Bushing Install, Bushing Weld, Master Dashboard
(Not yet inspected column-by-column — assume same pattern as Plant 2 equivalents; verify before Wave 3.)

## Plant 2, Pin On stream — Pin On Cycle Time Database Workbook
Sheets: Bucket Roll, Manual Shell Weld, Teeth Install, Ear and Bushing Install, Final Weld, Master Dashboard
(no "Fastest by Process" sheet, unlike Quick Hitch)

Columns confirmed per sheet:
- Bucket Roll: Date, Frame #, Frame Width, Operator, Cycle Time (min), VA Time (min), NNVA Time (min), VA %, NNVA %, # of Observations, Notes
- Manual Shell Weld: Date, Frame #, Width (in), Operator, Cycle Time (min), VA Time (min), NNVA Time (min), VA %, NNVA %, Notes
- Teeth Install: Date, Frame Size, Frame Width, Tooth Type, Operator, Number of Teeth, Cycle Time (min), Time per Tooth (min), VA Time (min), NNVA Time (min), VA %, NNVA %, Notes
- Ear and Bushing Install: Date, Frame #, Width (in), Ear Type, Operator, Cycle Time (min), VA Time (min), NNVA Time (min), VA %, NNVA %, Notes
- Final Weld: Date, Frame Size, Frame Width, Operator, Cycle Time (min), VA Time (min), NNVA Time (min), VA %, NNVA %, Notes

## Quick Hitch vs Pin On sheet-name mapping (same processes, different labels)
| Quick Hitch sheet | Pin On sheet |
|---|---|
| Bucket Roll | Bucket Roll |
| Manual Shell Weld | Manual Shell Weld |
| Teeth And Logo | Teeth Install |
| Teeth Weld | Final Weld |
| Ear & Bushing Install | Ear and Bushing Install |
| Fastest by Process | (no equivalent) |

Export logic for Wave 3 should pick the sheet-name set based on `state.stream` ('Quick Hitch' vs 'Pin On'), but the element→process grouping logic (which elements feed which sheet) is identical between the two streams — only the destination sheet names differ.

## Key design implication for the app's export
Each workbook row = one bucket's TOTALS for one process, not one row per element tap.
Export must group the bucket's logged elements by which process/sheet they belong to,
then sum durations within each process, split into VA Time (green-tier elements) and
NNVA Time (amber-tier elements), to produce Cycle Time = VA + NNVA per process per bucket.
Red-tier (waste) elements are excluded from process sheets — they're not represented in
the workbook today (open question: confirm whether Robert wants waste captured anywhere).

Tooth Type, # of Teeth, Ear Type collected as optional Bucket Header modal fields (decided
2026-06-23) so export rows are complete without manual Excel touch-up.

Red-tier (waste) time is dropped from the xlsx export entirely (workbook has no place for
it) but stays fully visible in the in-app Log screen for Chase's own review (decided
2026-06-23).

## Wave 4 TODO — manual update button
Tablet has no hard-refresh gesture. Add a visible "Check for Update" button (Session Home,
maybe also Log screen) that unregisters/re-registers the service worker and forces a fresh
fetch of index.html, so Chase can pull a newly-deployed version without needing a desktop
browser trick. (decided 2026-06-23)

## Notes field UX
Bucket Header modal Notes field = large multi-line textarea, big tap target, plain free
text. No quick-note chips (decided 2026-06-23, kept simple).
