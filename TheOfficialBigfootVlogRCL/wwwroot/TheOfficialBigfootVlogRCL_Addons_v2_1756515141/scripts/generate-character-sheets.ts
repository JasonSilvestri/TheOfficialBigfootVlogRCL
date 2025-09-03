import fs from "node:fs";
import path from "node:path";
import { BigfootModelV2, Character } from "../src/bigfoot/types.js";

const cfg = JSON.parse(fs.readFileSync("./palms.config.json", "utf-8"));
const DOCS_ROOT: string = cfg.docsRoot;

function ensureDir(p: string) { fs.mkdirSync(p, { recursive: true }); }
function writeUtf8(file: string, text: string) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, text, { encoding: "utf-8" });
}

function renderCharacter(c: Character): string {
  const hdr = `# Character Sheet — ${c.name} (v1)`;
  const rows: string[] = [];
  const pushRow = (k: string, v?: string) => { if (v && v.trim().length) rows.push(`| **${k}** | ${v} | \`Completed\` |`); };

  rows.push("| **Section** | **Detail** | **Workflow State** |");
  rows.push("| --- | --- | --- |");

  pushRow("Name", `**${c.name}**`);
  pushRow("ID", c.id);
  pushRow("Species & Role", c.speciesRole);
  pushRow("Height & Build", c.heightBuild);

  const furBits: string[] = [];
  if (c.fur?.base) furBits.push(`Base **${c.fur.base.hex}** (${c.fur.base.context ?? "base"})`);
  if (c.fur?.aliases?.length) furBits.push(...c.fur.aliases.map(a => `alias **${a.hex}** (${a.name})`));
  if (c.fur?.length) furBits.push(`coarse **${c.fur.length}** strands`);
  if (c.fur?.sheen) furBits.push(c.fur.sheen);
  if (c.fur?.highlights?.length) furBits.push(...c.fur.highlights.map(h => `highlight **${h.hex}** (${h.name})`));
  pushRow("Fur (Updated)", furBits.join("; "));

  pushRow("Head & Facial Features", c.headFace);
  pushRow("Expression & Posture", c.expressionPosture);
  pushRow("Lighting Context", c.lightingContext);
  pushRow("Environment & Physics", c.environmentPhysics);
  pushRow("Hands & Props", c.handsProps ?? "");
  pushRow("Lower Body", c.lowerBody ?? "");
  pushRow("Feet Detail", c.feetDetail?.description ?? "");
  pushRow("Personality & Vibe", c.personalityVibe);
  pushRow("Voice Note", `${c.voice.tone}; ${c.voice.pacing ?? ""}`.trim());
  pushRow("Signature Dialogue", c.signatureDialogue ?? "");
  pushRow("Cinematography Cues", c.cinematographyCues ?? "");

  const imgLines = (c.images ?? []).map(i => `- ${i.type}: ${i.path}${i.notes ? " — " + i.notes : ""}`).join("<br/>");
  pushRow("Image Assets", imgLines);

  return [hdr, "", rows.join("\r\n")].join("\r\n");
}

function main() {
  const model: BigfootModelV2 = JSON.parse(fs.readFileSync("./data/bigfoot-seed.v2.json", "utf-8"));
  const dir = path.join(DOCS_ROOT, "sheets");
  ensureDir(dir);
  for (const c of model.characters) {
    const file = path.join(dir, `${c.name.replace(/\s+/g, "-")}_v1.md`);
    writeUtf8(file, renderCharacter(c));
  }
  console.log("Character sheets emitted to", dir);
}

main();
