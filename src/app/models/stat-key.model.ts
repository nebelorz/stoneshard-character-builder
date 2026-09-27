export const STAT_KEYS = ['STR', 'AGI', 'PER', 'VIT', 'WIL'] as const;
export type StatKey = (typeof STAT_KEYS)[number];

export function isStatKey(value: unknown): value is StatKey {
  return typeof value === 'string' && (STAT_KEYS as readonly string[]).includes(value);
}
