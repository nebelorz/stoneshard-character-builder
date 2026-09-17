export const STAT_KEYS = ['STR', 'AGI', 'PER', 'VIT', 'WIL'] as const;
export type StatKey = (typeof STAT_KEYS)[number];
