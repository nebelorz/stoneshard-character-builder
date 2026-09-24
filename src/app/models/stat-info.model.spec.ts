import { STAT_KEYS } from './stat-key.model';
import { STAT_INFO } from './stat-info.model';

describe('STAT_INFO', () => {
  it('should provide content for every stat key', () => {
    for (const stat of STAT_KEYS) {
      expect(STAT_INFO[stat]).toBeDefined();
    }
  });

  it('should have complete content for every stat', () => {
    for (const stat of STAT_KEYS) {
      const info = STAT_INFO[stat];

      expect(info.kind).toBe('stat');
      expect(info.name.trim().length).toBeGreaterThan(0);
      expect(info.description.trim().length).toBeGreaterThan(0);
      expect(info.perPointEffects.length).toBeGreaterThan(0);
      expect(info.perPointEffects.every((effect) => effect.trim().length > 0)).toBe(true);
      expect(info.milestoneEffects.length).toBeGreaterThan(0);
      expect(info.milestoneEffects.every((effect) => effect.trim().length > 0)).toBe(true);
      expect(info.cap.trim().length).toBeGreaterThan(0);
    }
  });

  it('should use the expected display names', () => {
    expect(STAT_INFO.STR.name).toBe('Strength');
    expect(STAT_INFO.AGI.name).toBe('Agility');
    expect(STAT_INFO.PER.name).toBe('Perception');
    expect(STAT_INFO.VIT.name).toBe('Vitality');
    expect(STAT_INFO.WIL.name).toBe('Willpower');
  });
});
