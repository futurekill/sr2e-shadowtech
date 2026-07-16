# sr2e-shadowtech — Dev Notes

Content module for the **Shadowtech** sourcebook (FASA 7110), riding the sr2e
system. Mirrors the `sr2e-fields-of-fire` pattern: compendium content only, **no
esmodules**. Requires sr2e ≥ 0.37.0 (the `bioware` item type + Body Index, and the
`isTacticalComputer` flag the Tactical Computer relies on).

## Workflow
- `packs-src/<pack>/*.json` is the source of truth (one document per file).
- `tools/gen-*.mjs` regenerate the JSON from transcribed book data.
- `npm run build-packs [name]` → LevelDB in `packs/` (gitignored).
- `npm run validate` — structural + bioware-specific checks (no derived fields;
  sorted/unique ratingStats).

## Rules accuracy
Never transcribe from memory. The Shadowtech PDF is in the parent folder; extract
with `pdftotext -layout`. Bioware stats are on the table at book p.118; per-item
descriptions p.14–35. Cite pages in item notes. Flag any value unreadable in the
scan (don't guess silently) — ask for a clean capture.

## Bioware modelling gotcha (Shadowtech p.7)
Neural bioware is inherently cultured and its printed Body Cost ALREADY includes
the 0.75× reduction. Store neural items at **standard** grade with the printed
value (grade `cultured` would double-reduce). Non-neural items are standard; the
GM may switch grade to cultured in Foundry for the 0.75× (nuyen ×4 not auto-applied).
