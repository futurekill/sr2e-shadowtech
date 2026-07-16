# Shadowrun 2E: Shadowtech

Compendium content from **Shadowtech** (FASA 7110) for the
[sr2e](https://github.com/futurekill/sr2e-foundryvtt) Foundry VTT system.

> **Requires sr2e ≥ 0.36.0** — that release adds the `bioware` item type and the
> Body Index mechanic this module's bioware relies on. Foundry will refuse to
> enable the module against an older system.

## Packs
- **Shadowtech Bioware** (`st-bioware`) — 22 bioware implants (Shadowtech p.14–35,
  stats from the table on p.118). Each carries its **Body Cost** and grade; the
  character sheet sums installed bioware into **Body Index** and charges Essence to
  awakened characters only.
- **Shadowtech Cyberware** (`st-cyberware`) — 15 expanded cyberware items (Bone Lacing, Hydraulic Jack, Softlink, Skillwire Plus, SPUs, Tactical Computer, Senseware) — Cybertechnology chapter p.42–63.
- **Shadowtech Gene-Tech & Chemistry** (`st-gear`) — gene therapy, immunization,
  leonization, microbiologicals, and industrial chemistry (Carcerands, Dikote, DMSO, Ruthenium Polymers, ...) — 14 gear items, p.74–89.

## Notes on fidelity
- **Neural bioware** (Cerebral Booster, Damage Compensator, Mnemonic Enhancer, Pain
  Editor, Reflex Recorder, Synaptic Accelerator, Trauma Damper) is inherently
  cultured, and Shadowtech (p.7) already folds the 25% reduction into the printed
  Body Cost. These items are therefore recorded at **standard** grade with the
  printed value — marking them "cultured" would apply the reduction a second time.
- **Non-neural** bioware is listed at standard Body Cost; set an item's grade to
  **cultured** in Foundry to apply the 0.75× Body Cost (the nuyen ×4 is not
  auto-applied — the book prints cultured prices where relevant, so adjust cost
  manually if you culture a standard item).
- A couple of values were unreadable in the source scan and are flagged in the
  item's notes (e.g. Orthoskin Level 2 Body Cost) — verify against a clean copy.
- Per-level attribute scaling (Muscle Augmentation) isn't auto-derived; the item's
  `attributeMods` are Level 1 — raise them to match a higher Rating.

## Building
`npm install` then `npm run build-packs` (JSON in `packs-src/` → LevelDB in
`packs/`). `npm run validate` runs the pre-flight checks. `packs/` is gitignored.
