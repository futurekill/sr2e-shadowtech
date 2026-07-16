# Changelog

## 0.5.0 — 2026-07-16
### Changed
- **Now requires sr2e 0.38.0.** Bone Lacing carries `unarmedPowerBonus` and
  Enhanced Articulation carries `activeSkillDice` — fields the system only added
  in 0.38.0, which automate the two rules those items had been describing in their
  notes without anything implementing them. On 0.37.0 the items would install and
  the automation would silently not exist.

## 0.4.1 — 2026-07-16
### Fixed
- **All 16 cyberware icons were broken.** They pointed at `icons/svg/chip.svg`,
  which isn't a Foundry core icon — it doesn't exist, so every entry in the
  Shadowtech Cyberware compendium rendered as a broken image. Now
  `icons/svg/upgrade.svg`, the same icon the system's own cyberware pack uses.
  Fixed in the generator. (Bioware and gear were unaffected — `biohazard.svg` and
  `item-bag.svg` are real.)

## 0.4.0 — 2026-07-16
### Changed
- **Now requires sr2e 0.37.0.** The Tactical Computer carries the system's new
  `isTacticalComputer` flag, which automates its Initiative bonus (rating added to
  Initiative, capped at the natural Reaction maximum — Shadowtech p.53). On 0.36.0
  the item would install and silently do nothing, so the minimum is raised rather
  than shipping a dead flag.

## 0.3.0 — 2026-07-15
### Added
- **Shadowtech Cyberware** compendium — 15 items from the Cybertechnology chapter
  (p.42–63): Bone Lacing (plastic/aluminum/titanium, with +Body and subdermal
  armor), Hydraulic Jack, Skillwire Plus, Softlink, improved Datajack, the three
  SPUs (Data Management / Input-Output / Math), Tactical Computer, and Senseware
  (Chemical Analyzer, Gas Spectrometer, Olfactory Booster, Orientation System) —
  correct essence/cost rating tables, effects, and page cites. (Only items not in
  the core sr2e cyberware pack.)
- **Shadowtech Gene-Tech & Chemistry** compendium — 14 gear items (p.74–89): Gene
  Therapy, Immunization, Leonization, the microbiologicals (Antibac, Binder,
  Zeta-Interferon), designer pathogens (Doom, Gamma-Anthrax), Myco-Protein, and the
  chemistry compounds (Carcerands, Dikote, DMSO, Oxygenated Flourocarbons, Ruthenium
  Polymers), each with description, table stats, Street Index, and page number.
- Requires **sr2e ≥ 0.36.0** (bioware type, Body Index, and cyber-implant armor).

## 0.2.0 — 2026-07-15
### Changed
- **Bioware now carries its full mechanical effect**, transcribed from the p.14–35
  descriptions: correct per-Level `attributeMods` (Suprathyroid +1 Body/Qui/Str/Rea,
  Cerebral Booster +Int, Tailored Pheromones +Cha, Muscle Augmentation +Str/+Qui,
  Synaptic Accelerator +Init dice, Enhanced Articulation +Reaction), **triggered**
  flags for the Adrenal Pump and Pain Editor (activate via the ⚡ on the sheet), and
  **Orthoskin subdermal armor** (per-rating Ballistic/Impact). Every item has flavor
  text and a page citation. Requires sr2e ≥ 0.36.0 (per-level scaling, triggers, armor).

## 0.1.0 — 2026-07-15
### Added
- **Shadowtech Bioware** compendium — 22 bioware implants (Shadowtech FASA7110
  p.14–35; stats from the table on p.118) as `bioware` items for the sr2e system:
  Platelet Factory, Symbiotes, Synthacardium, Orthoskin, Tailored Pheromones,
  Adrenal Pump, Suprathyroid Gland, Toxin Extractor, Pathogenic Defense, Nephritic
  Screen, Cerebral Booster, Damage Compensator, Mnemonic Enhancer, Pain Editor,
  Reflex Recorder, Synaptic Accelerator, Trauma Damper, Extended Volume, Toxin
  Exhaler, Tracheal Filter, Enhanced Articulation, Muscle Augmentation.
- Requires sr2e ≥ 0.36.0 (the bioware item type / Body Index mechanic).
- `validate` guards against derived fields (`actualBodyCost`) in source JSON and
  enforces sorted, unique bioware `ratingStats`.

### In progress
- `st-cyberware` (expanded cyberware) and `st-gear` (gene-tech, microbiologicals,
  industrial chemistry) packs are scaffolded but not yet populated.
