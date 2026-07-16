// Generate Shadowtech expanded cyberware into packs-src/st-cyberware, as the
// system's existing `cyberware` item type. Stats + effects from the
// Cybertechnology chapter (Shadowtech FASA7110 p.41–63). Only the items NOT in
// the core sr2e cyberware compendium are shipped here. Re-run, then
// `npm run build-packs st-cyberware`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/st-cyberware";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("st-cyberware:" + s).digest("hex").slice(0, 16);
const ZMODS = () => ({ body: 0, quickness: 0, strength: 0, charisma: 0, intelligence: 0, willpower: 0, reaction: 0, initiativeDice: 0 });

function cyber(c) {
  const _id = idFor(c.name);
  const system = {
    location: c.location ?? "headware", grade: "standard",
    essenceCost: c.essenceCost ?? 0, rating: 1,
    cost: c.cost ?? 0, availability: c.avail ?? "", streetIndex: c.si ?? "",
    legality: c.legality ?? "Legal", installed: false,
    isWeapon: false, weaponType: "melee", skill: "armed combat", damageCode: "", damageType: "physical", reach: 0,
    combatTnMod: 0, isVcr: false, noReactionBonus: false,
    isTacticalComputer: c.isTacticalComputer ?? false,
    unarmedPowerBonus: c.unarmedPowerBonus ?? 0,
    armorBallistic: c.armorBallistic ?? 0, armorImpact: c.armorImpact ?? 0,
    cranialDeck: c.cranialDeck ?? false,
    deck: Object.assign(
      { active: false, mpcp: 0, hardening: 0, activeMemory: 0, storageMemory: 0, loadSpeed: 0, ioSpeed: 0, response: 0 },
      c.deck ?? {}),
    ratingStats: c.ratingStats ?? [],
    attributeMods: Object.assign(ZMODS(), c.mods ?? {}),
    capacity: 0, modules: [],
    notes: c.notes ?? ""
  };
  return {
    _id, name: c.name, type: "cyberware", img: c.img ?? "icons/svg/upgrade.svg",
    system, effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.1.0", createdTime: 1784000000000, modifiedTime: 1784000000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}
// rated rows: [rating, essenceCost, cost, availability?, streetIndex?, legality?]
const rated = (rows) => rows.map(([rating, essenceCost, cost, availability = "", streetIndex = "", legality = "Legal"]) =>
  ({ rating, essenceCost, cost, availability, streetIndex, legality }));

const ITEMS = [
  // ── Bodyware ──────────────────────────────────────────────────────────────
  { name: "Bone Lacing (Plastic)", location: "bodyware", essenceCost: 0.50, cost: 7500, mods: { body: 1 }, unarmedPowerBonus: 1,
    notes: "Reinforced bones: +1 Body, unarmed blows become (Str+1)M — automated (the book prints the 1e code (Str+1)M2; SR2 staging is always 2, so the digit is dropped). May instead do Physical at half Power, round up (not automated — halve it by hand). +5 kg weight; Barrier Rating 6; doesn't show on metal detectors (Shadowtech p.42)." },
  { name: "Bone Lacing (Aluminum)", location: "bodyware", essenceCost: 1.15, cost: 25000, mods: { body: 1 }, armorImpact: 1, unarmedPowerBonus: 2,
    notes: "Reinforced bones: +1 Body and +1 Impact armor (cumulative with worn), unarmed blows become (Str+2)M — automated. May instead do Physical at half Power, round up (not automated). +10 kg weight; Barrier Rating 8; shows on metal detectors (Shadowtech p.42)." },
  { name: "Bone Lacing (Titanium)", location: "bodyware", essenceCost: 2.25, cost: 75000, mods: { body: 2 }, armorImpact: 1, armorBallistic: 1, unarmedPowerBonus: 3,
    notes: "Reinforced bones: +2 Body, +1 Impact and +1 Ballistic armor (cumulative with worn), unarmed blows become (Str+3)M — automated. May instead do Physical at half Power, round up (not automated). +15 kg weight; Barrier Rating 10; shows on metal detectors (Shadowtech p.42)." },
  { name: "Skillwire Plus", location: "bodyware", legality: "Legal",
    ratingStats: rated([
      [1,0.1,15000,"4/10 days","","Legal"],[2,0.2,30000,"4/10 days","","Legal"],[3,0.3,45000,"4/10 days","","Legal"],
      [4,0.8,500000,"5/10 days","","6P-CB"],[5,1.0,625000,"5/10 days","","6P-CB"],[6,1.2,750000,"5/10 days","","6P-CB"],
      [7,2.1,7000000,"12/20 days","","4P-CB"],[8,2.4,8000000,"12/20 days","","4P-CB"],[9,2.7,9000000,"12/20 days","","4P-CB"]]),
    notes: "Upgraded skillwires for Active skillsofts. Total accessible skillsoft ratings = Level × 2 (Classic skillwires cap at their Level). Essence = Level × 0.10 (L1–3), 0.20 (L4–6), 0.30 (L7–9); price by band (Shadowtech p.47)." },
  // ── Cyberlimb ─────────────────────────────────────────────────────────────
  { name: "Hydraulic Jack", location: "cyberlimb", essenceCost: 0.25,
    ratingStats: rated([[1,0.25,5000],[2,0.25,10000],[3,0.25,15000],[4,0.25,20000],[5,0.25,25000],[6,0.25,30000]]),
    notes: "Installed in a cyberleg: multiplies max leaping distance/height by its Level, and reduces the Power Level of a fall by its Level (if you land on your feet — Athletics (5) Test). Cyberleg only (Shadowtech p.43)." },
  // ── Headware: interface / skillsoft ───────────────────────────────────────
  { name: "Datajack (Improved)", location: "headware", legality: "Legal",
    ratingStats: rated([[1,0.10,500],[2,0.15,1000],[3,0.20,2000],[4,0.25,4000]]),
    notes: "Higher data-flow-rate datajack: DFR (Mp/turn) = 25 / 50 / 75 / 100 by Level. Still needs an encephalon or I/O SPU to reach internal memory; the DFR can't be boosted except by upgrading the jack (Shadowtech p.45)." },
  { name: "Softlink", location: "headware", legality: "Legal",
    ratingStats: rated([[1,0.15,1000],[2,0.20,2000],[3,0.25,4000],[4,0.30,8000]]),
    notes: "Replaces the chipjack: one softlink accepts up to 4 chips (Level = ports). Active skillsofts still need skillwires. Increases system load delay under heavy chip load (Shadowtech p.46)." },
  { name: "SPU: Data Management", location: "headware", legality: "Legal",
    ratingStats: rated([[1,0.10,9500],[2,0.15,19000],[3,0.20,28500],[4,0.25,38000]]),
    notes: "Data-compression subprocessor: effective memory increases by +25% / +50% / +75% / +100% by Level (adds a Load Rating to SLD). Transparent to normal use (Shadowtech p.50)." },
  { name: "SPU: Input/Output", location: "headware", legality: "Legal",
    ratingStats: rated([[1,0.10,5000],[2,0.15,7500],[3,0.20,12500],[4,0.25,22500]]),
    notes: "I/O subprocessor: enables access to internal memory and reduces system load delay (I/O Rating 1 / 2 / 4 / 8 by Level). Fullest use requires an encephalon (Shadowtech p.51)." },
  { name: "SPU: Math", location: "headware", legality: "Legal",
    ratingStats: rated([[1,0.10,2000],[2,0.15,5000],[3,0.20,11000],[4,0.25,23000]]),
    notes: "Math subprocessor: adds its rating to Mathematics Tests and half its rating (round down) to Technical/Technical(B&R)/Sciences — including +½ rating to the Hacking Pool. Also a precise chronometer (Shadowtech p.52)." },
  { name: "Tactical Computer", location: "headware", isTacticalComputer: true,
    ratingStats: rated([[1,3.5,350000,"","","4-CB"],[2,4.0,900000,"","","4-CC"]]),
    notes: "Marks up to (Level + Intelligence) targets and adds their Success Level in dice to attacks against them; its rating adds to Initiative (never exceeding the Reaction maximum, and no help to rigging/decking); embeds a Tactics expert system. Levels 3–4 are CLASSIFIED (2-CC / 1-CC). Extra senses and an Orientation System raise its effective level (Shadowtech p.53)." },
  // ── Matrixware: the cranial cyberdeck ("C2", p.54–59) ─────────────────────
  // One implant carrying the whole deck — the book: "C2 decks operate exactly
  // like regular cyberdecks", so it drives the Matrix tab like a gear deck.
  // Essence is DERIVED from the component ratings, so essenceCost is left 0.
  // Ships as a sample MPCP-6 build; edit the deck ratings to spec your own.
  { name: "Cranial Cyberdeck (C2)", location: "headware", legality: "6P-CB", cranialDeck: true,
    cost: 44450,   // MPCP 6: 6^3 × 200¥ + 1,250¥ matrixware simsense chip
    avail: "8/14 days",
    deck: { mpcp: 6, hardening: 3, activeMemory: 300, storageMemory: 600, loadSpeed: 300, ioSpeed: 2, response: 1 },
    notes: "A cyberdeck built into the skull. Operates exactly like a regular cyberdeck — activate it (⚡ on the Gear tab) to drive the Matrix tab. Essence is summed from its components: MPCP (Rating/10 + 0.1) + Persona Module 0.30 + Hardening 0.3 + Transfer 0.1 + Response 0.2. CAPS — MPCP max = 1.5 × Intelligence (round up); exceeding it costs +4 TN on EVERY action (automated). Persona module max = 75% of MPCP; Hardening max = ½ MPCP; Response max = MPCP/4. Active memory is MPCP × 50 Mp (dedicated); storage up to MPCP × 100 Mp. Transfer is capped by your datajack's DFR. Each Response level adds +2 Reaction while decking. Sample build shown is MPCP 6 (cost = Rating³ × 200¥ + 1,250¥); re-rate to taste (Shadowtech p.54–59)." },
  // ── Senseware ─────────────────────────────────────────────────────────────
  { name: "Chemical Analyzer", location: "headware", legality: "Legal",
    ratingStats: rated([[1,0.2,2500],[2,0.4,5000],[3,0.6,7500],[4,0.8,10000],[5,1.0,12500],[6,1.2,15000]]),
    notes: "Implanted in tongue/fingertip; analyzes a solid/liquid sample at Chemistry Skill = rating + 2. Needs a display link or datajack for output; a chemical reference program (50 Mp / 7,500¥) adds compound names. Max Level 6 (Shadowtech p.60)." },
  { name: "Gas Spectrometer", location: "headware", legality: "Legal",
    ratingStats: rated([[1,0.2,2000],[2,0.4,4000],[3,0.6,6000],[4,0.8,8000],[5,1.0,10000],[6,1.2,12000]]),
    notes: "Housed in the sinuses; analyzes gases at Chemistry Skill = rating + 2 from a small sniff. Needs a display link or datajack for output; a chemical reference program adds compound names. Max Level 6 (Shadowtech p.61)." },
  { name: "Olfactory Booster", location: "headware", legality: "Legal",
    ratingStats: rated([[1,0.2,1000],[2,0.4,2000],[3,0.6,3000],[4,0.8,4000],[5,1.0,5000],[6,1.2,6000]]),
    notes: "+1 die per Level to Perception Tests to detect/identify a smell, and +1 die per 3 Levels (round up) to taste Perception. Includes safety cut-offs to shut off intense odors. Max Level 6 (Shadowtech p.62)." },
  { name: "Orientation System", location: "headware", essenceCost: 0.50, cost: 15000, legality: "Legal",
    notes: "Inertial/magnetic positioning + a map unit (integral chipjack takes map datasofts: city street 250¥, city block 1,000¥, single building 750¥). Displays exact position/elevation. Synergizes with a Tactical Computer (+2 to its level). Needs a display link or datajack (Shadowtech p.63)." }
];

let n = 0;
for (const it of ITEMS) { const doc = cyber(it); writeFileSync(`${DIR}/${doc.name.replace(/[^A-Za-z0-9]+/g, "_")}_${doc._id}.json`, JSON.stringify(doc, null, 2) + "\n"); n++; }
console.log(`wrote ${n} cyberware item(s) to ${DIR}`);
