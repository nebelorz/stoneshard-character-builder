export interface TraitTooltipContent {
  kind: 'trait';
  name: string;
  description: string;
}

export interface StatTooltipContent {
  kind: 'stat';
  name: string;
  description: string;
  perPointEffects: string[];
  milestoneEffects: string[];
  cap: string;
}

export interface TreeTooltipContent {
  kind: 'tree';
  name: string;
  description?: string;
}

export interface QuestTooltipContent {
  kind: 'quest';
  name: string;
  description: string;
}

export type TooltipContent =
  TraitTooltipContent | StatTooltipContent | TreeTooltipContent | QuestTooltipContent;
