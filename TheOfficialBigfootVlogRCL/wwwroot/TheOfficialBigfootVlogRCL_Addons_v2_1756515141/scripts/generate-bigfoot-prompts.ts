import fs from "node:fs";
import path from "node:path";
import { BigfootModelV2, Character, Shot, Environment, Scene } from "../src/bigfoot/types.js";

const cfg = JSON.parse(fs.readFileSync("./palms.config.json", "utf-8"));
const DOCS_ROOT: string = cfg.docsRoot;

function ensureDir(p: string) { fs.mkdirSync(p, { recursive: true }); }
function writeJson(file: string, obj: unknown) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), { encoding: "utf-8" });
}

function characterToPromptDescription(c: Character): string {
  const furBase = c.fur?.base?.hex ? `base ${c.fur.base.hex}` : "";
  const furHl = (c.fur?.highlights ?? []).map(h => `${h.hex}`).join(", ");
  const foot = c.feetDetail?.description ? `; ${c.feetDetail.description}` : "";
  return `${c.name} — ${c.heightBuild}; ${c.speciesRole}; ${c.headFace}; fur ${furBase}${furHl ? " with highlights " + furHl : ""}; ${c.expressionPosture}${foot}`
    .replace(/\s+/g, " ").trim();
}

function sceneEnv(model: BigfootModelV2, sc: Scene): Environment {
  const env = model.environments.find(e => e.id === sc.environmentId);
  if (!env) throw new Error("Missing environment for scene " + sc.id);
  return env;
}

function main() {
  const model: BigfootModelV2 = JSON.parse(fs.readFileSync("./data/bigfoot-seed.v2.json", "utf-8"));
  const charIndex = new Map(model.characters.map(c => [c.id, c]));
  const scIndex = new Map(model.storyboard.scenes.map(s => [s.id, s]));

  for (const sh of model.storyboard.shots) {
    const sc = scIndex.get(sh.sceneId)!;
    const env = sceneEnv(model, sc);
    const code = `S${String(sc.index).padStart(2,"0")}_SC${sc.index}_SH${String(sh.index).padStart(2,"0")}`;
    const subjects = sh.characterIds.map(id => ({
      type: "character",
      name: charIndex.get(id)!.name,
      description: characterToPromptDescription(charIndex.get(id)!),
      action: sh.action
    }));

    const payload = {
      pipeline: ["gemini", "flow"],
      config: {
        duration: "8s",
        resolution: "3840x2160",
        fps: 60,
        aspect_ratio: "16:9"
      },
      scene_number: sc.index,
      description: sh.action,
      setting: {
        location: env.name,
        time_of_day: env.timeOfDay,
        weather: env.weather ?? "Clear",
        biome: env.biome ?? ""
      },
      subjects,
      camera: {
        angle: sh.camera.angle,
        motion: sh.camera.movement,
        framing: sh.camera.framing ?? "",
        lens: sh.camera.lens ?? "standard"
      },
      audio: {
        ambient: sh.audio.ambient ?? "",
        dialogue: sh.audio.dialogue ?? "",
        music: sh.audio.music ? {
          name: sh.audio.music.name,
          bpm: sh.audio.music.bpm,
          intensity: sh.audio.music.intensity,
          inAt: sh.audio.music.inAt,
          outAt: sh.audio.music.outAt
        } : undefined,
        sfx: (sh.audio.sfx ?? []).map(s => ({ name: s.name, inAt: s.inAt, outAt: s.outAt }))
      },
      effects: sh.effects ?? [],
      no_subtitles: sh.no_subtitles ?? true
    };

    const outFile = path.join(DOCS_ROOT, "prompts", "v1", `${code}_v${String(sh.promptVersion).padStart(3,"0")}.json`);
    writeJson(outFile, payload);
  }

  console.log("Veo prompt JSON emitted to", path.join(DOCS_ROOT, "prompts", "v1"));
}

main();
