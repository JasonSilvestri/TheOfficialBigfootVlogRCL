# The Official Bigfoot Vlog — Project Scaffold (v1)

This repo contains a clean baseline structure for storyboards, shot cards, prompts, and renders.

## Structure
```
/Project
  /refs/
  /sheets/
  /storyboard/
  /shots/
  /prompts/
    /v1/
  /renders/
  CHANGELOG.md
  README.md
```

## Working Agreements
- Storyboard is the master narrative; ShotCards are tactical; Prompts are machine-ready; Renders are outputs.
- Use `_v001`+ semantic increments for all files.
- Every change is logged in `CHANGELOG.md`.

## Quick Start
1. Fill in `storyboard/Storyboard_v1.md` with scene beats.
2. Add `shots/ShotCards_Scene1_v1.md` specifics.
3. Copy a prompt scaffold in `prompts/v1/` and adapt details.
4. Save renders under `/renders` using the matching prompt filename.

## PaLM{} Integration (Planned)
- We will register Scenes, Shots, and Prompts as typed nodes with deterministic IDs.
- Generators will emit Markdown (storyboard/shotcards) and JSON (prompts) from a single source of truth.
