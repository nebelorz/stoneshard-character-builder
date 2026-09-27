import {
  ENGINE_VARIABLE_LEXICON,
  flattenDescription,
  formatModifierExpression,
  resolveEngineVariable,
  tokenizeDescription,
} from './ability-description.model';
import abilitiesData from '../../assets/data/abilities.json';

const DESCRIPTIONS: readonly string[] = abilitiesData.abilities.map(
  (ability) => ability.description,
);

describe('tokenizeDescription', () => {
  it('produces ordered text, modifier and effect nodes', () => {
    const [line] = tokenizeDescription('Grants {+7}% Bleed Chance to "Fencer Stance".');

    expect(line.kind).toBe('paragraph');
    expect(line.nodes).toEqual([
      { kind: 'text', text: 'Grants ' },
      { kind: 'modifier', expression: '+7', sign: 'pos' },
      { kind: 'text', text: '% Bleed Chance to ' },
      { kind: 'effect', name: 'Fencer Stance' },
      { kind: 'text', text: '.' },
    ]);
  });

  it('distinguishes bullet lines from paragraph lines', () => {
    const lines = tokenizeDescription('Head:\n- {+5}% Crit Chance\n- {-3}% Fumble Chance');

    expect(lines.map((line) => line.kind)).toEqual(['paragraph', 'bullet', 'bullet']);
    expect(lines[1].nodes).toEqual([
      { kind: 'modifier', expression: '+5', sign: 'pos' },
      { kind: 'text', text: '% Crit Chance' },
    ]);
  });

  it('classifies modifier sign from the leading character only', () => {
    const [line] = tokenizeDescription('{+5} {WIL * 2} {-2} {max_hp}');

    const signs = line.nodes.filter((node) => node.kind === 'modifier').map((node) => node.sign);
    expect(signs).toEqual(['pos', 'neutral', 'neg', 'neutral']);
  });

  it('keeps the raw expression on modifier nodes', () => {
    const [line] = tokenizeDescription('{+15 + 2 * AGL}%');

    expect(line.nodes[0]).toEqual({
      kind: 'modifier',
      expression: '+15 + 2 * AGL',
      sign: 'pos',
    });
  });

  it('rejects an unclosed modifier delimiter', () => {
    expect(() => tokenizeDescription('Grants {+5% damage')).toThrow(/Unclosed modifier delimiter/);
  });

  it('rejects an unbalanced closing modifier delimiter', () => {
    expect(() => tokenizeDescription('Grants +5}% damage')).toThrow(
      /Unbalanced modifier delimiter/,
    );
  });

  it('rejects an unclosed effect quote', () => {
    expect(() => tokenizeDescription('Activates "Fencer Stance for 10 turns')).toThrow(
      /Unclosed effect quote/,
    );
  });
});

describe('flattenDescription', () => {
  it('re-parenthesises multi-term positive modifiers', () => {
    expect(flattenDescription(tokenizeDescription('{+15 + 2 * AGL}%'))).toBe('+(15 + 2 * AGL)%');
  });

  it('keeps single-term modifiers unchanged', () => {
    expect(flattenDescription(tokenizeDescription('{+7}% {PRC}%'))).toBe('+7% PRC%');
  });

  it('joins bullet blocks into prose without bullet markers', () => {
    const flat = flattenDescription(
      tokenizeDescription('Grants:\n- {+5}% Crit Chance\n- {-3}% Fumble Chance'),
    );

    expect(flat).toBe('Grants: +5% Crit Chance -3% Fumble Chance');
    expect(flat).not.toContain('- ');
  });
});

describe('engine-variable lexicon', () => {
  it('maps a known key to its display label', () => {
    expect(resolveEngineVariable('max_hp').label).toBe('Max Health');
    expect(ENGINE_VARIABLE_LEXICON['Magic_Power'].label).toBe('Magic Power');
  });

  it('falls back to the raw key when no mapping exists', () => {
    expect(resolveEngineVariable('made_up_key').label).toBe('made_up_key');
  });

  it('rewrites known keys inside expressions and preserves unknown ones', () => {
    expect(formatModifierExpression('max_hp / 100 + Magic_Power + made_up_key')).toBe(
      'Max Health / 100 + Magic Power + made_up_key',
    );
  });
});

describe('shipped ability descriptions', () => {
  it('tokenizes every description without formatting errors', () => {
    expect(DESCRIPTIONS).toHaveLength(228);
    for (const description of DESCRIPTIONS) {
      expect(() => tokenizeDescription(description)).not.toThrow();
    }
  });

  it('yields at least one line per description', () => {
    for (const description of DESCRIPTIONS) {
      expect(tokenizeDescription(description).length).toBeGreaterThan(0);
    }
  });

  it('flattens every description to plain text with no delimiters or bullet markers', () => {
    for (const description of DESCRIPTIONS) {
      const flat = flattenDescription(tokenizeDescription(description));
      expect(flat).not.toContain('{');
      expect(flat).not.toContain('}');
      expect(flat).not.toContain('\n');
      expect(flat.startsWith('- ')).toBe(false);
    }
  });

  it('has no legacy stat aliases in the corpus', () => {
    for (const description of DESCRIPTIONS) {
      expect(description).not.toMatch(/\bVitality\b/);
      expect(description).not.toMatch(/\bHP\b/);
    }
  });

  it('leaves non-modifier quantities as literal text', () => {
    const [line] = tokenizeDescription(
      'Lasts for 5 turns across a 3x2 tile area, stacks up to IV.',
    );

    expect(line.nodes.some((node) => node.kind === 'modifier')).toBe(false);
  });

  it('tokenizes the normalized bonus runs into bullet lines', () => {
    const bulletDescriptions = DESCRIPTIONS.filter((description) => description.includes('\n- '));

    expect(bulletDescriptions.length).toBeGreaterThan(0);
    for (const description of bulletDescriptions) {
      expect(tokenizeDescription(description).some((line) => line.kind === 'bullet')).toBe(true);
    }
  });
});
