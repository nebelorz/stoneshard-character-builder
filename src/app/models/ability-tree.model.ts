export const DEFAULT_TREE_WIDTH = 338;
export const DEFAULT_TREE_HEIGHT = 522;

export interface AbilityTree {
  readonly id: string;
  readonly name: string;
  readonly category: 'weaponry' | 'utility' | 'sorcery';
  readonly focus: string;
  readonly critEffect: string;
  readonly icon: string;
  readonly width?: number;
  readonly height?: number;
}
