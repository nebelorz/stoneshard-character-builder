import { parseRequirements, meetsRequirements } from './requirement.model';

describe('parseRequirements', () => {
  it('should parse AND requirements', () => {
    const result = parseRequirements(['A', 'B']);
    expect(result).toEqual([{ alternatives: ['A'] }, { alternatives: ['B'] }]);
  });

  it('should parse OR requirements', () => {
    const result = parseRequirements(['A|B']);
    expect(result).toEqual([{ alternatives: ['A', 'B'] }]);
  });

  it('should parse mixed AND/OR requirements', () => {
    const result = parseRequirements(['A|B', 'C']);
    expect(result).toEqual([{ alternatives: ['A', 'B'] }, { alternatives: ['C'] }]);
  });

  it('should return empty array for empty requires', () => {
    const result = parseRequirements([]);
    expect(result).toEqual([]);
  });

  it('should handle single requirement', () => {
    const result = parseRequirements(['A']);
    expect(result).toEqual([{ alternatives: ['A'] }]);
  });

  it('should handle multiple OR alternatives', () => {
    const result = parseRequirements(['A|B|C']);
    expect(result).toEqual([{ alternatives: ['A', 'B', 'C'] }]);
  });
});

describe('meetsRequirements', () => {
  it('should return true when all AND groups satisfied', () => {
    const requirements = [{ alternatives: ['A'] }, { alternatives: ['B'] }];
    expect(meetsRequirements(requirements, new Set(['A', 'B']))).toBe(true);
  });

  it('should return true when OR group satisfied', () => {
    const requirements = [{ alternatives: ['A', 'B'] }];
    expect(meetsRequirements(requirements, new Set(['A']))).toBe(true);
  });

  it('should return false when OR group not satisfied', () => {
    const requirements = [{ alternatives: ['A', 'B'] }];
    expect(meetsRequirements(requirements, new Set(['C']))).toBe(false);
  });

  it('should return true for mixed AND/OR when all groups met', () => {
    const requirements = [{ alternatives: ['A', 'B'] }, { alternatives: ['C'] }];
    expect(meetsRequirements(requirements, new Set(['A', 'C']))).toBe(true);
  });

  it('should return false for mixed AND/OR when one group missing', () => {
    const requirements = [{ alternatives: ['A', 'B'] }, { alternatives: ['C'] }];
    expect(meetsRequirements(requirements, new Set(['A']))).toBe(false);
  });

  it('should return true for empty requirements', () => {
    expect(meetsRequirements([], new Set(['A']))).toBe(true);
  });

  it('should accept string array as obtainedIds', () => {
    const requirements = [{ alternatives: ['A', 'B'] }];
    expect(meetsRequirements(requirements, ['A'])).toBe(true);
  });

  it('should return false when obtained is empty and requirements exist', () => {
    const requirements = [{ alternatives: ['A'] }];
    expect(meetsRequirements(requirements, new Set())).toBe(false);
  });
});
