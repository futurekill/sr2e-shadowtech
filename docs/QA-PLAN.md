# sr2e-shadowtech — QA Plan

Manual checks for a live Foundry world with the sr2e system and this module
enabled. Automated: `npm run validate` and `npm run lint` (CI).

## Compendia
- [ ] **Shadowtech Bioware / Cyberware / Gear** open with no broken icons.
- [ ] Drag a bioware item onto a character: Body Index goes up by its Body Cost.
  A **neural** item offers no grade in the Buy dialog.

## Drugs and toxins (p.95–100)
- [ ] **Kamikaze** on a character → the syringe (Use a dose) in the gear tab:
  one dose spent, and Body +1, Quickness +1, Strength +2, Willpower +1, +1
  Initiative die. **Active drugs** shows "N min left"; End removes it.
- [ ] **Atropine** → the card's Resist (Body) applies 5D staged down by Body
  successes, once. As GM, "15 minutes pass" posts the next damage card.
- [ ] **Kamikaze** absorbs the next 4 boxes of damage; **Hyper** adds half of
  any damage as Stun and "+1 drugs" on rolls; **Atropine** adds "+1 drugs" on
  Active Skills and "+2 drugs" on Knowledge tests.
- [ ] **MAO** → −1 Reaction and −1 Initiative die for 10 turns less Body
  successes.
- [ ] **ACTH Inhaler** (6 doses) → five left after one use; selling it refunds
  5/6 of the price.
- [ ] **Ares Squirt** is a light pistol-range weapon, Conceal 7, 750¥.
