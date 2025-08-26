# Bigfoot Vlog Protocol v1

## Purpose
To standardize how storyboards, shot cards, prompts, and renders are created, versioned, and refined for **The Official Bigfoot Vlog** project.

---

## Core Rules

1. **Storyboard = Master Narrative**
   - Defines the big story beats.
   - Rarely updated unless narrative changes.
   - File format: `Storyboard_v{n}.md`

2. **ShotCards = Tactical Breakdown**
   - Linked directly to storyboard beats.
   - Updated frequently as visuals evolve.
   - File format: `ShotCards_Scene{n}_v{n}.md`

3. **Prompts = Machine-Ready**
   - Generated from ShotCards (never from scratch).
   - Always JSON schema.
   - File format: `S{Scene}_SC{Card}_SH{Shot}_v{n}.json`

4. **Renders = Output Only**
   - Final videos/images live here.
   - Filename must match JSON prompt that generated it.

---

## Versioning Rules
- Use `_v001`, `_v002` increments for any file updates.  
- Do **not overwrite** old versions; keep history.  
- Summarize each update in `CHANGELOG.md`.

---

## Automation Ideas
- Future scripts may:
  - Auto-generate JSON scaffolds from ShotCards.
  - Increment version numbers automatically.
  - Append changelog entries.

---

## Example Flow
1. Update `Storyboard_v1.md` → add Scene 1 beat.  
2. Create `ShotCards_Scene1_v1.md` with detailed shots.  
3. Generate JSON: `S01_SC1_SH01_v001.json`.  
4. Render output → save to `/renders/S01_SC1_SH01_v001.mp4`.  
5. Log update in `CHANGELOG.md`.

---

[`⇧ Back to Top`](#bigfoot-vlog-protocol-v1)
