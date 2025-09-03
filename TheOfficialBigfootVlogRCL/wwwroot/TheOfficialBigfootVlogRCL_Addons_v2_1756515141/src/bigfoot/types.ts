export type GUID = string;

export interface CharacterImage {
  id: GUID;
  type: "cutout" | "in_environment";
  path: string;
  notes?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  context?: string;
}

export interface LimbDetail {
  description: string;
}

export interface VoiceProfile {
  tone: string;
  pacing?: string;
  sampleLine?: string;
}

export interface Character {
  id: GUID;
  name: string;
  speciesRole: string;
  heightBuild: string;
  fur: {
    base: ColorSwatch;
    aliases?: ColorSwatch[];
    length?: string;
    sheen?: string;
    highlights?: ColorSwatch[];
  };
  headFace: string;
  expressionPosture: string;
  lightingContext: string;
  environmentPhysics: string;
  handsProps?: string;
  lowerBody?: string;
  feetDetail?: LimbDetail;
  personalityVibe: string;
  voice: VoiceProfile;
  signatureDialogue?: string;
  cinematographyCues?: string;
  images?: CharacterImage[];
  workflowState?: string;
}

export interface Environment {
  id: GUID;
  name: string;
  timeOfDay: string;
  weather?: string;
  biome?: string;
  physicsNotes?: string;
  colorNotes?: string;
}

export interface OverlayLowerThird {
  id: GUID;
  text: string;
  position?: "bottom_left" | "bottom_right" | "top_left" | "top_right";
  safeAreaPct?: number;
}

export interface Ticker {
  id: GUID;
  text: string;
  speed?: number;
  loop?: boolean;
}

export interface MusicCue {
  id: GUID;
  name: string;
  bpm?: number;
  key?: string;
  intensity?: "low" | "medium" | "high";
  inAt?: number;
  outAt?: number;
}

export interface SfxCue {
  id: GUID;
  name: string;
  inAt?: number;
  outAt?: number;
}

export interface CameraPlan {
  angle: string;
  movement: string;
  framing?: string;
  lens?: string;
}

export interface Scene {
  id: GUID;
  index: number;
  title: string;
  environmentId: GUID;
  clip: boolean;
  characters: GUID[];
  actions: string;
  camera: string;
  audio: string;
  effects: string;
  overlays?: OverlayLowerThird[];
  tickers?: Ticker[];
}

export interface Shot {
  id: GUID;
  sceneId: GUID;
  index: number;
  setting: string;
  characterIds: GUID[];
  subjectDescription: string;
  action: string;
  camera: CameraPlan;
  audio: {
    ambient?: string;
    dialogue?: string;
    music?: MusicCue;
    sfx?: SfxCue[];
  };
  effects?: string[];
  no_subtitles?: boolean;
  promptVersion: number;
}

export interface Storyboard {
  id: GUID;
  title: string;
  version: number;
  scenes: Scene[];
  shots: Shot[];
}

export interface BigfootModelV2 {
  characters: Character[];
  environments: Environment[];
  storyboard: Storyboard;
}
