# Shadowrun 2E: Shadowtech

A Foundry VTT V13 module bringing *Shadowtech* (FASA 7110) to the [Shadowrun 2nd Edition system](https://github.com/futurekill/sr2e-foundryvtt) (`sr2e`). Bioware, expanded cyberware, gene-tech, microbiologicals, drugs and toxins, and industrial chemistry.

## Contents

| Pack | Contents |
|---|---|
| Shadowtech Bioware | 22 items |
| Shadowtech Cyberware | 16 items |
| Shadowtech Gene-Tech & Chemistry | 22 items |

## Notes

- **Bioware** carries its Body Cost and grade; the character sheet sums installed bioware into Body Index and charges Essence to Awakened characters only.
- **Neural bioware** (Cerebral Booster, Damage Compensator, Mnemonic Enhancer, Pain Editor, Reflex Recorder, Synaptic Accelerator, Trauma Damper) is inherently cultured, and the printed Body Cost already includes the reduction (p.7), so these are stored at standard grade with the printed value.
- **Other bioware** is stored at standard Body Cost; set the grade to cultured in Foundry for 0.75× Body Cost.
- **Drugs** use the system's *Use a dose* and addiction tracking (sr2e 0.100.0).
- A few values were unreadable in the scan and are flagged in the item's notes (e.g. Orthoskin Level 2 Body Cost).
- Muscle Augmentation's attribute bonus is Level 1; raise it to match a higher Rating.

## Requirements

- Foundry VTT V13
- The `sr2e` system, version 0.100.0 or later

## Installation

In Foundry, **Add-on Modules → Install Module**, and paste this manifest URL:

```
https://github.com/futurekill/sr2e-shadowtech/releases/latest/download/module.json
```

Then enable it in your world (**Game Settings → Manage Modules**).

## Development

`packs-src/` (one JSON file per document) is the source of truth. `packs/` is built from it, gitignored, and rebuilt by the release workflow.

```bash
npm install
npm run build-packs     # packs-src/ JSON -> packs/ LevelDB (close Foundry first)
npm run extract-packs   # pull edits made in Foundry back to packs-src/
npm run validate        # pre-flight checks on the pack sources
npm run lint
```

To release: add a `## X.Y.Z — date` section to `CHANGELOG.md` (the release notes come from it), bump `module.json`, then tag and push `vX.Y.Z`.

## Copyright

*Shadowtech* and *Shadowrun* are © FASA and their rights holders. This is a fan-made, non-commercial module for personal table use by owners of the book.
