import fs from "node:fs";
import path from "node:path";
import { BigfootModelV2, Scene, Shot, Character, Environment } from "../src/bigfoot/types.js";

const cfg = JSON.parse(fs.readFileSync("./palms.config.json", "utf-8"));
const DOCS_ROOT: string = cfg.docsRoot;

function ensureDir(p: string) { fs.mkdirSync(p, { recursive: true }); }
function writeUtf8(file: string, text: string) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, text, { encoding: "utf-8" });
}

function linkTop(anchor: string) { return "\r\n[`⇧ Back to Top`](#" + anchor + ")\r\n"; }

function renderVerticalScene(scene: Scene, env: Environment, chars: Character[]): string {
  const charNames = chars.map(c => c.name).join(", ");
  const rows: string[] = [];
  rows.push(`### Scene ${scene.index} — ${scene.title}`);
  rows.push("");
  rows.push("| Field | Detail |");
  rows.push("| :-- | :-- |");
  rows.push(`| **Clip?** | ${scene.clip ? "true" : "false"} |`);
  rows.push(`| **Setting** | ${env.name}, ${env.timeOfDay}${env.weather ? "; " + env.weather : ""} |`);
  rows.push(`| **Biome** | ${env.biome ?? ""} |`);
  rows.push(`| **Characters** | ${charNames} |`);
  rows.push(`| **Actions** | ${scene.actions} |`);
  rows.push(`| **Camera** | ${scene.camera} |`);
  rows.push(`| **Audio** | ${scene.audio} |`);
  rows.push(`| **Effects** | ${scene.effects} |`);
  if (scene.overlays?.length) {
    rows.push(`| **Lower Thirds** | ${(scene.overlays ?? []).map(o => `${o.text} (${o.position ?? "bottom_left"})`).join("; ")} |`);
  }
  if (scene.tickers?.length) {
    rows.push(`| **Ticker** | ${(scene.tickers ?? []).map(t => t.text).join(" • ")} |`);
  }
  return rows.join("\r\n");
}

function renderStoryboard(model: BigfootModelV2): string {
  const sb = model.storyboard;
  const envIndex = new Map(model.environments.map(e => [e.id, e]));
  const charIndex = new Map(model.characters.map(c => [c.id, c]));
  const lines: string[] = [];
  lines.push("# " + sb.title);
  lines.push("");
  for (const sc of sb.scenes.sort((a,b)=>a.index-b.index)) {
    const env = envIndex.get(sc.environmentId)!;
    const chars = sc.characters.map(id => charIndex.get(id)!).filter(Boolean);
    lines.push(renderVerticalScene(sc, env, chars));
    lines.push("");
  }
  lines.push(linkTop(sb.title.toLowerCase().replace(/\s+/g, "-")));
  return lines.join("\r\n");
}

function renderShotCards(model: BigfootModelV2, sceneId: string): string {
  const scene = model.storyboard.scenes.find(s => s.id === sceneId)!;
  const shots = model.storyboard.shots.filter(s => s.sceneId === sceneId).sort((a,b)=>a.index-b.index);
  const lines: string[] = [];
  lines.push("# ShotCards — Scene " + scene.index + " (v1)");
  lines.push("");
  for (const sh of shots) {
    const code = `S${String(scene.index).padStart(2,"0")}_SC${scene.index}_SH${String(sh.index).padStart(2,"0")}`;
    lines.push(`## ${code} — ${sh.action.split(".")[0]}`);
    lines.push(`- Setting: ${sh.setting}`);
    lines.push(`- Subject Description: ${sh.subjectDescription}`);
    lines.push(`- Action: ${sh.action}`);
    lines.push(`- Camera: ${sh.camera.angle}; ${sh.camera.movement}; ${sh.camera.framing ?? ""}`.trim());
    lines.push(`- Audio: ambient(${sh.audio.ambient ?? ""})` + (sh.audio.dialogue ? `; dialogue(${sh.audio.dialogue})` : ""));
    if (sh.effects?.length) lines.push(`- Effects: ${sh.effects.join("; ")}`);
    lines.push(`- no_subtitles: ${sh.no_subtitles ? "true" : "false"}`);
    lines.push(`- Prompt Ref: \`prompts/v1/${code}_v${String(sh.promptVersion).padStart(3,"0")}.json\``);
    lines.push("");
  }
  return lines.join("\r\n");
}

function main() {
  const model: BigfootModelV2 = JSON.parse(fs.readFileSync("./data/bigfoot-seed.v2.json", "utf-8"));
  // Storyboard vertical
  writeUtf8(path.join(DOCS_ROOT, "storyboard", `Storyboard_v${model.storyboard.version}.md`), renderStoryboard(model));

  // One ShotCards file per scene marked clip=true
  const clipScenes = model.storyboard.scenes.filter(s => s.clip);
  for (const sc of clipScenes) {
    const out = renderShotCards(model, sc.id);
    writeUtf8(path.join(DOCS_ROOT, "shots", `ShotCards_Scene${sc.index}_v1.md`), out);
  }

  console.log("Storyboard + ShotCards generated under", DOCS_ROOT);
}

main();
