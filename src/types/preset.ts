export const PRESET_KEYS = [
  'academic',
  'business',
  'social',
  'technical',
  'creative',
  'translation',
] as const;

export type PresetKey = (typeof PRESET_KEYS)[number];

export interface PresetDefinition {
  readonly id: PresetKey;
  readonly label: string;
  readonly description: string;
  readonly promptKey: PresetKey;
}