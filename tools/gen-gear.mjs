// Generate Shadowtech gene-tech, microbiologicals, and chemistry into
// packs-src/st-gear as the system's `gear` item type. Stats from the Equipment
// tables (Shadowtech FASA7110 p.118); descriptions from the Gene-Tech (p.74–79)
// and Chemistry (p.83–89) chapters. Per-level microbiological pricing lives in
// the notes (gear has a flat cost). Re-run, then `npm run build-packs st-gear`.
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = "packs-src/st-gear";
mkdirSync(DIR, { recursive: true });
const idFor = (s) => createHash("sha1").update("st-gear:" + s).digest("hex").slice(0, 16);

function gear(g) {
  const _id = idFor(g.name);
  const system = {
    category: g.category ?? "general", rating: g.rating ?? 0, quantity: 1,
    streetIndex: g.si ?? 1, weight: 0, cost: g.cost ?? 0,
    availability: g.avail ?? "", legality: g.legality ?? "Legal",
    equipped: false, concealability: g.conceal ?? 0,
    weaponAccessory: false, linkedWeaponId: "", combatTnMod: 0,
    accessoryRecoilComp: 0, requiresSmartgun: false,
    notes: g.notes ?? ""
  };
  return {
    _id, name: g.name, type: "gear", img: g.img ?? "icons/svg/item-bag.svg",
    system, effects: [], flags: {}, folder: null, sort: 0,
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.1.0", createdTime: 1784000000000, modifiedTime: 1784000000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!items!${_id}`
  };
}

const ITEMS = [
  // ── Gene-Tech treatments ──────────────────────────────────────────────────
  { name: "Gene Therapy", cost: 50000, avail: "6/30 days", si: 2.5,
    notes: "Rewrites genetic material to fix defects or damage. Types: Cleansing (purge toxins/addictions) 50,000¥; Genetic Correction 60,000¥; Reconstruct/Healing 100,000¥; Other 50,000¥+. Availability 6/30 days, Street Index 2.5 (Shadowtech p.74)." },
  { name: "Immunization Therapy", cost: 40000, avail: "6/20 days", si: 2,
    notes: "Confers permanent immunity to a single disease or compound (tailored hybridomas). Single treatment 40,000¥; Full Spectrum 300,000¥. Street Index 2 (Shadowtech p.75)." },
  { name: "Leonization", cost: 2000000, avail: "6/30 days", si: 2.5,
    notes: "The elite anti-aging treatment: halts and partially reverses cellular aging. 2,000,000¥ plus 100,000¥ recurring. Street Index 2.5 (Shadowtech p.76)." },
  // ── Microbiologicals (per-Level; rating = potency) ────────────────────────
  { name: "Antibac", rating: 1, cost: 500, avail: "4/48 hrs",
    notes: "Broad-spectrum engineered antibiotic; rating = potency vs bacterial infection. Price per Level: ×500¥ (L1–3), ×1,000¥ (L4–6), ×1,500¥ (L7–9), ×2,500¥ (L10+). Availability 4/48 hrs (Shadowtech p.77)." },
  { name: "Binder", rating: 1, cost: 300, avail: "4/32 hrs", si: 2,
    notes: "Tailored agent that binds and neutralizes toxins in the bloodstream; rating = potency. Price per Level: ×300¥ (L1–3), ×600¥ (L4–6), ×900¥ (L7–9), ×1,500¥ (L10+). Street Index 2 (Shadowtech p.78)." },
  { name: "Zeta-Interferon", rating: 1, cost: 400, avail: "4/32 hrs", si: 2,
    notes: "Engineered antiviral interferon; rating = potency vs viral infection. Price per Level: ×400¥ (L1–3), ×800¥ (L4–6), ×1,200¥ (L7–9), ×2,000¥ (L10+). Street Index 2 (Shadowtech p.79)." },
  // ── Designer pathogens / food ─────────────────────────────────────────────
  { name: "Doom", cost: 500, avail: "14/30 days", legality: "I-M3", si: 5,
    notes: "A designer pathogen (bioweapon). 500¥/dose. Illegal (I-M3), Availability 14/30 days, Street Index 5 (Shadowtech p.80)." },
  { name: "Gamma-Anthrax", cost: 180, avail: "14/30 days", legality: "2-M3", si: 6,
    notes: "A weaponized, engineered anthrax strain. 180¥/dose. Restricted (2-M3), Availability 14/30 days, Street Index 6 (Shadowtech p.81)." },
  { name: "Myco-Protein", cost: 25, avail: "Always", si: 1,
    notes: "Cheap cultured single-cell/fungal protein — the sprawl's staple synthetic food. 25¥/kg, everywhere (Shadowtech p.82)." },
  // ── Chemistry compounds (p.89 table; descriptions p.83–89) ────────────────
  { name: "Carcerands", cost: 0, avail: "4/10 days", si: 2,
    notes: "Molecular “cage” compounds that trap a guest molecule and release it under a chosen trigger (delivery systems, slow-release toxins). Price: see text. Street Index 2 (Shadowtech p.89)." },
  { name: "Dikote", cost: 1000, avail: "6/14 days", si: 10,
    notes: "An ultra-hard ceramic-metal coating; applied to a blade or surface it dramatically improves edge/durability (and melee damage). 1,000¥ per 100 cm³. Street Index 10 (Shadowtech p.89)." },
  { name: "DMSO", cost: 10, avail: "2/12 hrs", si: 1.5,
    notes: "A carrier solvent that soaks through unbroken skin. Mixed with a drug or toxin it ferries that agent through the skin, effectively giving it a Contact vector. 10¥+. Street Index 1.5 (Shadowtech p.89)." },
  { name: "Oxygenated Flourocarbons", cost: 750, avail: "4/48 hrs", si: 1,
    notes: "Breathable oxygen-carrying liquid — lets the lungs “breathe” liquid (deep diving, high-g, drowning-proofing). 750¥ per liter. Street Index 1 (Shadowtech p.89)." },
  { name: "Ruthenium Polymers", cost: 10000, avail: "5/14 days", si: 7.5,
    notes: "Electro-optical polymer that shifts colour/temperature to match its surroundings — the basis of thermoptic/chameleon camouflage. 10,000¥ per m². Street Index 7.5 (Shadowtech p.89)." }
];

let n = 0;
for (const it of ITEMS) { const doc = gear(it); writeFileSync(`${DIR}/${doc.name.replace(/[^A-Za-z0-9]+/g, "_")}_${doc._id}.json`, JSON.stringify(doc, null, 2) + "\n"); n++; }
console.log(`wrote ${n} gear item(s) to ${DIR}`);
