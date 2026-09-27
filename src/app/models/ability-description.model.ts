export type ModifierSign = 'pos' | 'neg' | 'neutral';

export interface DescriptionTextNode {
  readonly kind: 'text';
  readonly text: string;
}

export interface DescriptionModifierNode {
  readonly kind: 'modifier';
  readonly expression: string;
  readonly sign: ModifierSign;
}

export interface DescriptionEffectNode {
  readonly kind: 'effect';
  readonly name: string;
}

export type DescriptionNode = DescriptionTextNode | DescriptionModifierNode | DescriptionEffectNode;

export interface DescriptionLine {
  readonly kind: 'paragraph' | 'bullet';
  readonly nodes: readonly DescriptionNode[];
}

export interface EngineVariableInfo {
  readonly label: string;
  readonly category: string;
}

export const ENGINE_VARIABLE_LEXICON: Readonly<Record<string, EngineVariableInfo>> = {
  max_hp: { label: 'Max Health', category: 'health' },
  max_mp: { label: 'Max Energy', category: 'energy' },
  Magic_Power: { label: 'Magic Power', category: 'magic' },
  Pyromantic_Power: { label: 'Pyromantic Power', category: 'magic' },
  Geomantic_Power: { label: 'Geomantic Power', category: 'magic' },
  Electromantic_Power: { label: 'Electromantic Power', category: 'magic' },
  Arcanistic_Power: { label: 'Arcanistic Power', category: 'magic' },
  Miracle_Chance: { label: 'Miracle Chance', category: 'magic' },
  Miracle_Power: { label: 'Miracle Power', category: 'magic' },
  Miscast_Chance: { label: 'Miscast Chance', category: 'magic' },
  Spell_Hit_Chance: { label: 'Spell Hit Chance', category: 'magic' },
  open_weapon_skills: { label: 'Weaponry', category: 'skill' },
  open_weapon_one_hand_skills: { label: 'One-Handed Weaponry', category: 'skill' },
  ranged_skill_learned: { label: 'Learned Ranged Weapons', category: 'skill' },
  Block_Chance: { label: 'Block Chance', category: 'combat' },
  Block_PowerMax: { label: 'Max Block Power', category: 'combat' },
  Shield_Block_Chance: { label: 'Shield Block Chance', category: 'combat' },
  Knockback_Chance: { label: 'Knockback Chance', category: 'combat' },
  Mainhand_Efficiency: { label: 'Main Hand Efficiency', category: 'combat' },
  Offhand_Efficiency: { label: 'Off Hand Efficiency', category: 'combat' },
  Retaliation: { label: 'Retaliation', category: 'combat' },
  Body_DEF: { label: 'Body Protection', category: 'defense' },
  Legs_DEF: { label: 'Legs Protection', category: 'defense' },
};

const NON_LEXICON_KEYS = new Set(['math_round', 'max']);

const LEXICON_PATTERN = new RegExp(
  '\\b(' +
    Object.keys(ENGINE_VARIABLE_LEXICON)
      .sort((a, b) => b.length - a.length)
      .join('|') +
    ')\\b',
  'g',
);

export function resolveEngineVariable(key: string): EngineVariableInfo {
  return (
    ENGINE_VARIABLE_LEXICON[key] ?? {
      label: key,
      category: NON_LEXICON_KEYS.has(key) ? 'function' : 'variable',
    }
  );
}

export function formatModifierExpression(expression: string): string {
  return expression.replace(LEXICON_PATTERN, (key) => ENGINE_VARIABLE_LEXICON[key]?.label ?? key);
}

function classifySign(expression: string): ModifierSign {
  if (expression.startsWith('+')) return 'pos';
  if (expression.startsWith('-')) return 'neg';
  return 'neutral';
}

function tokenizeLine(content: string): DescriptionNode[] {
  const nodes: DescriptionNode[] = [];
  let index = 0;
  let textStart = 0;

  const flushText = (end: number): void => {
    if (end > textStart) {
      nodes.push({ kind: 'text', text: content.slice(textStart, end) });
    }
  };

  while (index < content.length) {
    const char = content[index];
    if (char === '{') {
      flushText(index);
      const close = content.indexOf('}', index + 1);
      if (close === -1) {
        throw new Error(`Unclosed modifier delimiter in description line: "${content}"`);
      }
      const expression = content.slice(index + 1, close).trim();
      if (expression === '') {
        throw new Error(`Empty modifier delimiter in description line: "${content}"`);
      }
      nodes.push({ kind: 'modifier', expression, sign: classifySign(expression) });
      index = close + 1;
      textStart = index;
      continue;
    }
    if (char === '}') {
      throw new Error(`Unbalanced modifier delimiter in description line: "${content}"`);
    }
    if (char === '"') {
      flushText(index);
      const close = content.indexOf('"', index + 1);
      if (close === -1) {
        throw new Error(`Unclosed effect quote in description line: "${content}"`);
      }
      nodes.push({ kind: 'effect', name: content.slice(index + 1, close) });
      index = close + 1;
      textStart = index;
      continue;
    }
    index++;
  }

  flushText(content.length);
  return nodes;
}

export function tokenizeDescription(description: string): DescriptionLine[] {
  return description.split('\n').map((rawLine) => {
    const isBullet = rawLine.startsWith('- ');
    return {
      kind: isBullet ? 'bullet' : 'paragraph',
      nodes: tokenizeLine(isBullet ? rawLine.slice(2) : rawLine),
    };
  });
}

function hasTopLevelOperator(expression: string): boolean {
  let depth = 0;
  for (const char of expression) {
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (depth === 0 && (char === '+' || char === '-' || char === '*' || char === '/')) {
      return true;
    }
  }
  return false;
}

function flattenExpression(expression: string): string {
  const sign = expression.startsWith('+') || expression.startsWith('-') ? expression[0] : '';
  const rest = sign ? expression.slice(1) : expression;
  if (!hasTopLevelOperator(rest) && !rest.startsWith('(')) return expression;
  return sign === '+' ? `+(${rest})` : `(${expression})`;
}

export function flattenDescription(lines: readonly DescriptionLine[]): string {
  const text = lines
    .map((line) =>
      line.nodes
        .map((node) => {
          if (node.kind === 'text') return node.text;
          if (node.kind === 'effect') return `"${node.name}"`;
          return flattenExpression(node.expression);
        })
        .join(''),
    )
    .join(' ');
  return text.replace(/\s+/g, ' ').trim();
}
