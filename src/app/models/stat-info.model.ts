import { StatTooltipContent } from '@shared/directives/tooltip/tooltip-content.model';
import { StatKey } from './stat-key.model';

export const STAT_INFO: Record<StatKey, StatTooltipContent> = {
  STR: {
    kind: 'stat',
    name: 'Strength',
    description:
      'Strength affects your primary combat capabilities. In addition to that, it increases the base Block Power, the Damage and Range for thrown items, and also improves unarmed Damage.',
    perPointEffects: ['+1.5% Block Chance', '+1.5% Weapon Damage'],
    milestoneEffects: ['+7.5% Bodypart Damage', '+10% Crit Efficiency', '+15% Armor Damage'],
    cap: 'Cap: 30 points',
  },
  AGI: {
    kind: 'stat',
    name: 'Agility',
    description:
      'Agility influences your finesse in battle. In addition to that, it increases the Damage, Accuracy, and Crit Chance for thrown items.',
    perPointEffects: ['+1.5% Counter Chance', '-1.5% Fumble and Backfire Chances'],
    milestoneEffects: ['+5% Dodge Chance', '+2.5% Hands Efficiency', '+7.5% Move Resistance'],
    cap: 'Cap: 30 points',
  },
  PER: {
    kind: 'stat',
    name: 'Perception',
    description:
      'Perception allows you to spot danger earlier and helps delivering precise attacks. In addition to that, it increases the Damage, Accuracy, and Crit Chance for thrown items.',
    perPointEffects: ['+1.5% Accuracy', '+1.5% Armor Penetration'],
    milestoneEffects: ['+1 Vision', '+1 Bonus Range', '+5% Crit and Miracle Chances'],
    cap: 'Cap: 30 points',
  },
  VIT: {
    kind: 'stat',
    name: 'Vitality',
    description: 'Vitality affects your endurance and survivability.',
    perPointEffects: ['+4 Max Energy', '+2% Energy Restoration'],
    milestoneEffects: ['+15 Max Health', '+5% Block Power Recovery', '+7.5% Control Resistance'],
    cap: 'Cap: 30 points',
  },
  WIL: {
    kind: 'stat',
    name: 'Willpower',
    description: 'Willpower makes hardships and misery more tolerable.',
    perPointEffects: ['-1.5% Cooldowns Duration', '-1.5% Abilities Energy Cost'],
    milestoneEffects: ['+7.5% Magic Power', '+7.5% Pain Resistance', '+7.5% Fortitude'],
    cap: 'Cap: 30 points',
  },
};
