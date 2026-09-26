// Generate the Shadowtech compounds (drugs and toxins, p.95–100) and the Ares
// Squirt (p.92) into packs-src/st-gear. Every value was read from the RENDERED
// pages (item pages + the Equipment Table, p.109+). Needs sr2e with the
// drugs lean core (flags.sr2e.drug: Use a dose, toxin resist, addiction tests).
//
// Only these items are written, and an existing file's `img` is KEPT, so
// re-running this never un-wires item art (unlike a full re-generation).
//
// Codes: every compound has first-edition Staging 2 — SR II's fixed staging —
// so the printed codes carry over unchanged (5D2 → 5D; core p.277–278).
// Re-run, then `npm run build-packs st-gear`.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/st-gear";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("st-gear:" + s).digest("hex").slice(0, 16);
const STATS = { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.1.0", createdTime: 1784000000000, modifiedTime: 1784000000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null };
const fileFor = (name, id) => `${DIR}/${name.replace(/[^A-Za-z0-9]+/g, "_")}_${id}.json`;
const keepImg = (path, fallback) => {
  if (!existsSync(path)) return fallback;
  try { return JSON.parse(readFileSync(path, "utf8")).img ?? fallback; } catch (e) { return fallback; }
};

/** A numeric ADD Active Effect on the item (transfer false: applied by Use a dose). */
function effect(itemId, name, changes) {
  const _id = idFor(`${itemId}:effect:${name}`);
  return {
    _id, name, img: "icons/svg/pill.svg", type: "base", system: {},
    changes: changes.map(([key, value]) => ({ key, mode: 2, value: String(value), priority: null })),
    disabled: false, duration: {}, description: "", origin: null, tint: "#ffffff",
    transfer: false, statuses: [], flags: {}, sort: 0, _stats: STATS
  };
}

function drug(d) {
  const _id = idFor(d.name);
  const path = fileFor(d.name, _id);
  return { path, doc: {
    _id, name: d.name, type: "gear", img: keepImg(path, "icons/svg/pill.svg"),
    system: {
      category: "drug", rating: 0, quantity: d.doses ?? 1, streetIndex: d.si, weight: 0, cost: d.cost,
      availability: d.avail, legality: d.legality, equipped: false, concealability: 0,
      weaponAccessory: false, linkedWeaponId: "", combatTnMod: 0, accessoryRecoilComp: 0,
      requiresSmartgun: false, notes: d.notes
    },
    effects: d.changes ? [effect(_id, d.name, d.changes)] : [],
    flags: { sr2e: { drug: { key: d.key, damage: d.damage ?? null, repeatMinutes: d.repeatMinutes ?? 0,
      duration: d.duration ?? null, addiction: d.addiction ?? null, tolerance: d.tolerance ?? 0,
      strength: d.strength ?? 0, notes: d.card ?? "",
      absorb: d.absorb ?? 0, stimulant: !!d.stimulant, overload: !!d.overload, tn: d.tn ?? null } } },
    folder: null, sort: 0, _stats: STATS, ownership: { default: 0 }, _key: `!items!${_id}`
  } };
}

const DRUGS = [
  { key: "acth", name: "ACTH Inhaler", doses: 6, cost: 100, avail: "5/12 hrs", legality: "Legal", si: 1,
    addiction: { rating: 0, P: false, M: false }, tolerance: 2, strength: 25,
    card: "Instantly activates an adrenal pump (bioware) — the GM applies the pump. Not addictive, but tolerance builds (Shadowtech p.95).",
    notes: "Adrenocorticotrophic hormone in an inhaler of six doses. Triggers voluntary activation of the adrenal pump. Addiction 0, Tolerance 2, Strength 25. 100¥ for 6 doses and inhaler. Legal, 5/12 hrs, Street Index 1 (Shadowtech p.95)." },
  { key: "atropine", name: "Atropine", cost: 600, avail: "5/12 hrs", legality: "Legal", si: 1,
    damage: { power: 5, level: "D", type: "physical" }, repeatMinutes: 15,
    tn: { active: 1, meleeClose: 1, knowledge: 2, language: 2, build_repair: 2, technical: 2, magic: 2 },
    card: "TN penalties applied automatically (+1 Active, +1 more in melee and close-range firearms; +2 Knowledge, Technical, B/R, Language and Magic). Hallucinations and fever are the GM's. Damage repeats every 15 minutes until neutralised or filtered out (Shadowtech p.96).",
    notes: "Distilled alkaloid (belladonna). Rating 5D (printed 5D2), Speed special, Vector injection, 600¥/dose. Legal, 5/12 hrs, Street Index 1 (Shadowtech p.96)." },
  { key: "cyanide", name: "Cyanide", cost: 360, avail: "3/48 hrs", legality: "Legal", si: 0.5,
    damage: { power: 4, level: "D", type: "physical" },
    card: "Takes effect at once if inhaled, after 1 minute otherwise; an oxidizing agent applied immediately neutralises it (Shadowtech p.97).",
    notes: "Rating 4D (printed 4D2), Speed immediate/1 minute, Vector air, ingestion, injection, 360¥/dose. Legal, 3/48 hrs, Street Index .5 (Shadowtech p.97)." },
  { key: "hyper", name: "Hyper", cost: 180, avail: "4/24 hrs", legality: "4-M1", si: 0.9,
    damage: { power: 4, level: "S", type: "stun" }, duration: { minutes: 60, bodyReducesBy: 5 },
    overload: true, tn: { all: 1, spell: 4 },
    card: "Applied automatically while active: +1 to all TNs, +4 more on spellcasting, and any damage taken adds half its boxes (round up) as Stun. Other concentration tasks' +4 is the GM's (Shadowtech p.98).",
    notes: "Direct neural stimulator. Rating 4S Stun (printed 4S2), Speed immediate, Vector air and injection, 180¥/dose; lasts 60 minutes less 5 per Body success. 4-M1, 4/24 hrs, Street Index .9 (Shadowtech p.98)." },
  { key: "kamikaze", name: "Kamikaze", cost: 50, avail: "5/4 days", legality: "3-M1", si: 5,
    changes: [["system.body.mod", 1], ["system.quickness.mod", 1], ["system.strength.mod", 2],
              ["system.willpower.mod", 1], ["system.initiative.mod", 1]],
    duration: { minutes: "10*1d6" }, addiction: { rating: 4, P: true, M: false }, tolerance: 2, strength: 4,
    absorb: 4, stimulant: true,
    card: "Negates the first 4 boxes of damage taken after it's administered (applied automatically). Every 4 uses cost a box off both monitors' maximum; after (Body ÷ 2) uses, cyberware and bioware stop working — the GM tracks these (Shadowtech p.99).",
    notes: "Tailored amphetamine combat drug: +1 Body, +1 Quickness, +2 Strength, +1 Willpower, +1D6 Initiative for 10–60 minutes (10 × 1D6). Addiction 4P, Tolerance 2, Strength 4, 50¥/dose. 3-M1, 5/4 days, Street Index 5 (Shadowtech p.99)." },
  { key: "mao", name: "MAO", cost: 280, avail: "5/36 hrs", legality: "4-M1", si: 2,
    damage: { power: 10, level: "L", type: "stun" }, duration: { turns: 10, bodyReducesBy: 1 },
    changes: [["system.reaction.mod", -1], ["system.initiative.mod", -1]],
    card: "No defence against the Reaction and Initiative loss. An active adrenal pump gives only its Reaction bonus (Level 1) or acts as Level 1 for other attributes (Level 2). Further doses have no effect until it's flushed out (Shadowtech p.100).",
    notes: "Monoamine oxidase. Rating 10L Stun (printed 10L2), Speed immediate, Vector injection, 280¥/dose; −1 Reaction and −1D6 Initiative for 10 turns less Body successes. 4-M1, 5/36 hrs, Street Index 2 (Shadowtech p.100)." },
  { key: "mao", name: "MAO Injector", doses: 6, cost: 320, avail: "5/36 hrs", legality: "4-M1", si: 2,
    duration: { turns: 10, bodyReducesBy: 1 },
    changes: [["system.reaction.mod", -1], ["system.initiative.mod", -1]],
    card: "The injector's controlled dose inflicts no Stun damage — used to counter a random adrenal pump activation (Shadowtech p.100).",
    notes: "A six-dose MAO injector: the effect without the Stun attack. 320¥ for six doses. 4-M1, 5/36 hrs, Street Index 2 (Shadowtech p.100)." }
];

// Ares Squirt (p.92; Equipment Table p.109): Light, Conceal 7, 750¥, 4-E, 8/3 days, SI 2.
function squirt() {
  const _id = idFor("Ares Squirt");
  const path = fileFor("Ares Squirt", _id);
  return { path, doc: {
    _id, name: "Ares Squirt", type: "weapon", img: keepImg(path, "icons/svg/pistol.svg"),
    system: {
      weaponType: "firearm", skill: "firearms", damageCode: "Special", damageType: "physical",
      concealability: 7, reach: 0, firingModes: { ss: true, sa: false, bf: false, fa: false },
      ammo: { current: 10, max: 10, type: "cartridge" }, recoilComp: 0,
      ranges: { short: 5, medium: 15, long: 30, extreme: 50 }, strengthMin: 0,
      weight: 1.75, cost: 750, availability: "8/3 days", legality: "4-E", equipped: false, accessories: [],
      streetIndex: 2,
      notes: "Silent, recoilless compressed-air dart gun from Ares Arms: load a chemical cartridge (10 shots) and the DMSO gel reservoir (20 shots; 250¥ per refill), and a solid hit delivers the compound through the skin — armoured targets are no problem. Damage is the compound's. Light pistol ranges; no firing mode is printed (single shot assumed). Shadowtech p.92."
    },
    effects: [], flags: {}, folder: null, sort: 0, _stats: STATS, ownership: { default: 0 }, _key: `!items!${_id}`
  } };
}

let n = 0;
for (const { path, doc } of [...DRUGS.map(drug), squirt()]) {
  writeFileSync(path, JSON.stringify(doc, null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} item(s) to ${DIR}`);
