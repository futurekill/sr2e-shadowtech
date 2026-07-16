// Generate Shadowtech bioware into packs-src/st-bioware.
// Stats + effects transcribed from Shadowtech (FASA7110) p.14–35 (descriptions)
// and the Bioware table on p.118. The "Body Index" column IS each item's Body
// Cost. Requires the sr2e `bioware` item type (>= 0.36.0). Re-run, then
// `npm run build-packs st-bioware`.
//
// MODIFIER MODEL: attributeMods are PER-LEVEL — the system multiplies them by the
// item's Rating (all rated attribute bioware in Shadowtech scales linearly). Set
// `triggered: true` for implants whose bonus applies only when activated (Adrenal
// Pump, Pain Editor). Orthoskin's subdermal armor is per-rating (armor B/I on each
// ratingStats row). NEURAL bioware (p.7) is inherently cultured with the reduction
// already in the printed value, so it is stored at STANDARD grade (marking it
// cultured would double-reduce) — each neural item says so.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/st-bioware";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("st-bioware:" + s).digest("hex").slice(0, 16);
const NEURAL = " Neural bioware — inherently cultured; the listed Body Cost already includes the 25% reduction (Shadowtech p.7), so it is recorded at standard grade.";
const stripTags = (s) => s.replace(/<[^>]+>/g, "");
const ZMODS = () => ({ body: 0, quickness: 0, strength: 0, charisma: 0, intelligence: 0, willpower: 0, reaction: 0, initiativeDice: 0 });

function bioware(b) {
  const _id = idFor(b.name);
  const system = {
    bodySystem: b.system, grade: "standard",
    bodyCost: b.bodyCost ?? 0, rating: 1,
    cost: b.cost ?? 0, availability: b.avail ?? "", streetIndex: b.si ?? "",
    legality: b.legality ?? "Legal", installed: false,
    triggered: b.triggered ?? false, active: false,
    ratingStats: b.ratingStats ?? [],
    armorBallistic: b.armorBallistic ?? 0, armorImpact: b.armorImpact ?? 0,
    attributeMods: Object.assign(ZMODS(), b.mods ?? {}),
    noReactionBonus: b.noReactionBonus ?? false,
    activeSkillDice: b.activeSkillDice ?? 0,
    damageCompensator: b.damageCompensator ?? false,
    ignoresStunPenalty: b.ignoresStunPenalty ?? false,
    notes: stripTags(b.notes + (b.neural ? NEURAL : ""))
  };
  return {
    _id, name: b.name, type: "bioware", img: b.img ?? "icons/svg/biohazard.svg",
    system, effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.1.0", createdTime: 1784000000000, modifiedTime: 1784000000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

// rated rows: [rating, bodyCost, cost, armorBallistic?, armorImpact?]
const rated = (rows, avail, si, legality) => rows.map(([rating, bodyCost, cost, aB = 0, aI = 0]) =>
  ({ rating, bodyCost, cost, availability: avail, streetIndex: si ?? "", armorBallistic: aB, armorImpact: aI }));

const ITEMS = [
  // ── Circulatory ──────────────────────────────────────────────────────────
  { name: "Platelet Factory", system: "circulatory", bodyCost: 0.4, cost: 30000, avail: "5/8 days", si: "1.5",
    notes: "Boosts the body's clotting and repair, improving its ability to handle physical damage (Shadowtech p.14)." },
  { name: "Symbiotes", system: "circulatory", legality: "Legal",
    ratingStats: rated([[1,0.4,15000],[2,0.7,35000],[3,1.0,60000]], "5/10 days", "", "Legal"),
    notes: "Tailored nanite microorganisms in the bloodstream that add dice to resist damage, disease, and toxins. Require extra nutrients — triple food cost or a tailored diet (Shadowtech p.15)." },
  { name: "Synthacardium", system: "circulatory",
    ratingStats: rated([[1,0.2,6000],[2,0.3,15000]], "4/10 days", "1.5", "Legal"),
    notes: "Enhanced myocardium: add Rating dice to Athletics Tests and other sustained-exertion checks (Shadowtech p.16)." },
  // ── Dermal ───────────────────────────────────────────────────────────────
  { name: "Orthoskin", system: "dermal", legality: "SP-BA",
    // per-rating subdermal armor: L1 +1 Impact; L2 +1 Impact +1 Ballistic; L3 +2 Impact +1 Ballistic
    ratingStats: rated([[1,0.5,25000,0,1],[2,1.0,60000,1,1],[3,1.5,100000,1,2]], "8/8 days", ".8", "SP-BA"),
    notes: "An energy-diffusing weave under the skin granting subdermal armor (adds to worn armor; not compatible with dermal plating) — Level 1 +1 Impact, Level 2 +1 Impact/+1 Ballistic, Level 3 +2 Impact/+1 Ballistic (Shadowtech p.17)." },
  { name: "Tailored Pheromones", system: "dermal", legality: "Legal",
    ratingStats: rated([[1,0.4,20000],[2,0.6,45000]], "12/14 days", "2", "Legal"),
    mods: { charisma: 1 },
    notes: "Secreted pheromones add +1 Charisma per Level to Charisma and Social Skill Tests (no effect on the astrally active or non-humanoids). Cultured doubles the effect (Shadowtech p.18)." },
  // ── Endocrine ────────────────────────────────────────────────────────────
  { name: "Adrenal Pump", system: "endocrine", legality: "5P-BB", triggered: true, noReactionBonus: true,
    ratingStats: rated([[1,1.25,60000],[2,2.5,100000]], "10/16 days", "3", "5P-BB"),
    mods: { quickness: 1, strength: 1, willpower: 1, reaction: 2 },
    notes: "<strong>Triggered.</strong> When activated (a light wound, a Willpower (6) Test, or an ACTH inhaler), each Level adds +1 Quickness, +1 Strength, +1 Willpower, +2 Reaction for 1D6 turns per Level (this Quickness does NOT raise Reaction). When it ends the user takes Deadly Stun — Power ½ the turns active (round down), Staging 2, resisted with Body — and cannot fire again that encounter (Shadowtech p.19)." },
  { name: "Suprathyroid Gland", system: "endocrine", bodyCost: 1.4, cost: 50000, avail: "8/12 days", si: "2.5", legality: "6P-BB",
    mods: { body: 1, quickness: 1, strength: 1, reaction: 1 },
    notes: "Supercharged metabolism: +1 Body, +1 Quickness, +1 Strength, +1 Reaction (the Quickness also feeds Reaction). Requires double food/drink; radiates heat (−1 TN for thermographic observers to notice). The Reaction bonus doesn't help rigging or decking (Shadowtech p.20)." },
  // ── Hepatic / Lymphatic / Renal ──────────────────────────────────────────
  { name: "Toxin Extractor", system: "hepatic", legality: "Legal",
    ratingStats: rated([[1,0.2,24000],[2,0.4,48000],[3,0.6,72000],[4,0.8,96000],[5,1.0,120000],[6,1.2,144000]], "4/4 days", "1", "Legal"),
    notes: "Reduces the Power Level of a blood-borne toxin attack by 1 per 2 Levels of extractor. Max Level = unaugmented Body (0.2 Body Cost per Level, Shadowtech p.21)." },
  { name: "Pathogenic Defense", system: "lymphatic", legality: "Legal",
    ratingStats: rated([[1,0.2,24000],[2,0.4,48000],[3,0.6,72000],[4,0.8,96000],[5,1.0,120000],[6,1.2,144000]], "4/4 days", "1.5", "Legal"),
    notes: "Reduces the Power Level of a disease/allergen/microbiological attack by 1 per 2 Levels. Max Level = unaugmented Body (0.2 Body Cost per Level, Shadowtech p.22)." },
  { name: "Nephritic Screen", system: "renal", bodyCost: 0.4, cost: 20000, avail: "4/4 days", si: "1", legality: "Legal",
    notes: "Rebuilt kidney: +1 Body die to resist toxins and pathogens, and reduce the Power Level of pathogen/blood-toxin attacks by 1 (Shadowtech p.30)." },
  // ── Neural (inherently cultured; listed values already reduced) ───────────
  { name: "Cerebral Booster", system: "neural", neural: true, legality: "Legal",
    ratingStats: rated([[1,0.4,50000],[2,0.8,110000]], "6/14 days", "2", "Legal"),
    mods: { intelligence: 1 },
    notes: "+1 Intelligence per Level (the Intelligence gain also raises Reaction). Level 2 additionally grants a Task Pool equal to its Level for Technical/Knowledge/B&R skills (tracked by hand) (Shadowtech p.23)." },
  { name: "Damage Compensator", system: "neural", neural: true, legality: "6P-BA", damageCompensator: true,
    ratingStats: [
      ...rated([[1,0.2,25000],[2,0.4,50000]], "6/6 days", "2.5", "6P-BA"),
      ...rated([[3,0.6,150000],[4,0.8,200000],[5,1.0,250000]], "10/6 days", "2.5", "6P-BA"),
      ...rated([[6,1.2,600000],[7,1.4,700000],[8,1.6,800000],[9,1.8,900000]], "12/6 days", "2.5", "6P-BA")
    ],
    notes: "Ignores Initiative and target-number wound penalties as long as damage stays at or below the compensator's Level (physical and mental tracked separately). Once a track exceeds the Level, its penalties apply in full (0.2 Body Cost per Level; cost tiers by band, Shadowtech p.24)." },
  { name: "Mnemonic Enhancer", system: "neural", neural: true, legality: "Legal",
    ratingStats: rated([[1,0.2,15000],[2,0.4,30000],[3,0.6,45000]], "6/7 days", "", "Legal"),
    notes: "+1 die per Level to Intelligence Tests to recall information, and +1 die per 2 Levels to Knowledge and Language Success Tests. Max Level = unaugmented Body (Shadowtech p.25)." },
  { name: "Pain Editor", system: "neural", neural: true, triggered: true, ignoresStunPenalty: true, bodyCost: 0.6, cost: 60000, avail: "6/6 days", si: "1.2", legality: "6P-BA",
    mods: { willpower: 1, intelligence: -1 },
    notes: "<strong>Triggered.</strong> While active the user feels no pain: mental-damage Initiative/TN penalties are ignored and mental damage/fatigue can't knock them out, and they gain +1 Willpower but −1 Intelligence and +4 TN to tactile Perception Tests. Physical-damage penalties still apply but are hidden from the player until the editor is switched off (Shadowtech p.26)." },
  { name: "Reflex Recorder (General)", system: "neural", neural: true, bodyCost: 0.25, cost: 25000, avail: "8/6 days", si: "1.5", legality: "Legal",
    notes: "Permanently adds +1 die to one chosen Active or Vehicle Skill (not B&R). General model = a whole skill. <em>Concentration model: Body Cost 0.1, 10,000¥, Avail 5/6 days — one Concentration only.</em> Not cumulative and incompatible with skillwires (Shadowtech p.27)." },
  { name: "Synaptic Accelerator", system: "neural", neural: true, legality: "5P-BB",
    ratingStats: rated([[1,0.3,75000],[2,1.6,200000]], "6/12 days", "2", "5P-BB"),
    mods: { initiativeDice: 1 },
    notes: "+1D6 Initiative die per Level (cumulative). Incompatible with boosted or wired reflexes; the bonus doesn't help rigging or decking (Shadowtech p.28)." },
  { name: "Trauma Damper", system: "neural", neural: true, bodyCost: 0.4, cost: 40000, avail: "6/8 days", si: "2", legality: "6P-BA",
    notes: "Per wound, shifts one box of physical damage to the Mental monitor (or removes one box of mental damage); +2 TN to pain-based tasks against the user and −2 TN to resist pain. Doesn't work with an active Pain Editor (Shadowtech p.29)." },
  // ── Respiratory ──────────────────────────────────────────────────────────
  { name: "Extended Volume", system: "respiratory", legality: "Legal",
    ratingStats: rated([[1,0.2,8000],[2,0.3,15000],[3,0.4,25000]], "4/4 days", "", "Legal"),
    notes: "Increased lung volume: +45 seconds of breath-holding per Level and a −1 (Levels 1–2) or −2 (Level 3) TN modifier to stamina tests (Shadowtech p.31)." },
  { name: "Toxin Exhaler", system: "respiratory", bodyCost: 0.6, cost: 30000, avail: "10/4 days", si: "3", legality: "S-BB",
    notes: "Exhales a stored toxin (chosen at implantation, bought separately, +100× a dose) as a 2m cone: Quickness (4) Test to hit, +1 TN per ½m, range = ½ unaugmented Body. The user is immunized against that toxin (double natural Body to resist) (Shadowtech p.32)." },
  { name: "Tracheal Filter", system: "respiratory", legality: "Legal",
    ratingStats: rated([[1,0.2,30000],[2,0.4,60000],[3,0.6,90000]], "4/4 days", "", "Legal"),
    notes: "Reduces the Power Level of a non-microbiological air-vectored attack by ½ the filter's Level (round down). Breathing becomes harder while it works (0.2 Body Cost per Level, Shadowtech p.33)." },
  // ── Structural ───────────────────────────────────────────────────────────
  { name: "Enhanced Articulation", system: "structural", bodyCost: 0.6, cost: 40000, avail: "5/6 days", si: "1.5", legality: "Legal",
    mods: { reaction: 1 }, activeSkillDice: 1,
    notes: "Fluid joints and tendons: +1 die to any Active Skill Success Test (automated — applies to skill rolls AND weapon attacks; RAW that includes Sorcery/Conjuring and the social skills, since SR2 counts them as Active Skills), and +1 Reaction (automatically excluded from rigging and pure cyber-decking) (Shadowtech p.34)." },
  { name: "Muscle Augmentation", system: "structural", legality: "4P-BC/D",
    ratingStats: rated([[1,0.8,45000],[2,1.6,90000],[3,2.4,135000],[4,3.2,180000]], "6/6 days", ".9", "4P-BC/D"),
    mods: { strength: 1, quickness: 1 },
    notes: "Gortex-braided muscle: +1 Quickness and +1 Strength per Level (max Level 4; the Quickness DOES feed Reaction). Bonuses don't help rigging or decking except for lifting/carrying (Shadowtech p.35)." }
];

let n = 0;
for (const it of ITEMS) { const doc = bioware(it); writeFileSync(`${DIR}/${doc.name.replace(/[^A-Za-z0-9]+/g, "_")}_${doc._id}.json`, JSON.stringify(doc, null, 2) + "\n"); n++; }
console.log(`wrote ${n} bioware item(s) to ${DIR}`);
