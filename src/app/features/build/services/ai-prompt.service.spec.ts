import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AiPromptService } from './ai-prompt.service';
import { BuildStore } from './build-store';
import { CharacterDataService } from '@features/character/services';
import { AbilityDataService } from '@features/ability-trees/services';
import { ToastService } from '@shared/services';
import { Ability, AbilityTree } from '@models';

const MOCK_TEMPLATE = `# Stoneshard Build Analyst

You are an expert Stoneshard build analyst.

# SOURCE OF TRUTH

The build data below is the primary source of truth.

# NO EQUIPMENT DATA

The build carries no equipment, armor, or item data.

# OUTPUT CONTRACT

Respond with exactly one markdown table using these 12 fixed rows.

| Category | Recommendation |
| -------- | -------------- |
| **Playstyle** | ... |
| **Win Condition** | ... |
| **Ideal Range** | ... |
| **Main Combat Loop** | ... |
| **1v1 Gameplan** | ... |
| **1vX Gameplan** | ... |
| **Core Abilities** | ... |
| **Key Synergies** | ... |
| **Stat Priority** | ... |
| **Biggest Strength** | ... |
| **Biggest Weakness** | ... |
| **Biggest Mistake** | ... |

# BUILD DATA

Paste the complete character/build data below.

[CHARACTER DATA HERE]`;

const MOCK_CHARACTER = {
  id: 'jorna',
  name: 'Jorna',
  title: 'The Bold',
  race: 'Human (Skadian)',
  gender: 'Female',
  trait: { name: 'Brave', description: '+10% Crit Chance' },
  baseStats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
  traitsUnlockedOnStart: ['warfare'],
};

const MOCK_ABILITIES = [
  {
    id: 'warfare-1',
    name: 'War Cry',
    treeId: 'warfare',
    x: 0,
    y: 0,
    type: 'attack',
    target: 'No Target',
    range: 1,
    energy: 10,
    cooldown: 12,
    modifiedByLabel: 'STR',
    requires: [],
    unlockConditions: [],
    description: 'Boosts morale with +10% power. Activates "War Cry".',
    requiredBy: ['warfare-2'],
  },
  {
    id: 'warfare-2',
    name: 'Battle Focus',
    treeId: 'warfare',
    x: 0,
    y: 0,
    type: 'passive',
    target: 'No Target',
    range: 1,
    energy: 0,
    cooldown: 0,
    modifiedByLabel: 'STR',
    requires: ['warfare-1'],
    unlockConditions: [],
    description: 'Grants +(15 + 2 * AGL)% Weapon Damage for 3 turns.',
    requiredBy: [],
  },
  {
    id: 'athletics-1',
    name: 'Dash',
    treeId: 'athletics',
    x: 0,
    y: 0,
    type: 'maneuver',
    target: 'Target Tile',
    range: 4,
    energy: 12,
    cooldown: 8,
    modifiedByLabel: 'AGI',
    requires: [],
    unlockConditions: [],
    description: 'Quickly move to a target tile.',
    requiredBy: ['athletics-2'],
  },
  {
    id: 'athletics-2',
    name: 'Evasion',
    treeId: 'athletics',
    x: 0,
    y: 0,
    type: 'passive',
    target: 'No Target',
    range: 1,
    energy: 0,
    cooldown: 0,
    modifiedByLabel: 'AGI',
    requires: ['athletics-1'],
    unlockConditions: [],
    description: 'Grants +10% Dodge for 2 turns after using a maneuver.',
    requiredBy: [],
  },
  {
    id: 'survival-1',
    name: 'Butchering',
    treeId: 'survival',
    x: 54,
    y: 116,
    type: 'passive',
    target: 'Target Object',
    range: 1,
    energy: 0,
    cooldown: 0,
    modifiedByLabel: '',
    requires: [],
    unlockConditions: [],
    description: 'Carves the targeted animal carcass for meat.',
    requiredBy: ['survival-4', 'survival-5'],
  },
];

const MOCK_TREES = [
  {
    id: 'warfare',
    name: 'Warfare',
    category: 'weaponry',
    focus: 'Melee combat',
    critEffect: 'Critical hits deal +50% damage.',
    icon: 'warfare-icon',
  },
  {
    id: 'athletics',
    name: 'Athletics',
    category: 'utility',
    focus: 'Mobility',
    critEffect: 'Critical hits restore 5 Energy.',
    icon: 'athletics-icon',
  },
  {
    id: 'survival',
    name: 'Survival',
    category: 'utility',
    focus: 'Survival skills to aid in harsh environments',
    critEffect: 'Exploiting environmental advantages',
    icon: 'survival-icon',
  },
];

function buildState(obtainedAbilities: { abilityId: string; level: number; order: number }[]): {
  characterId: string;
  level: number;
  ap: number;
  sp: number;
  stats: Record<string, number>;
  obtainedAbilities: { abilityId: string; level: number; order: number }[];
  pinnedTrees: string[];
  statHistory: never[];
  boulderCircleStat: null;
  notes: { buildName: string; author: string; content: string };
} {
  return {
    characterId: 'jorna',
    level: 1,
    ap: 0,
    sp: 0,
    stats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
    obtainedAbilities,
    pinnedTrees: [],
    statHistory: [],
    boulderCircleStat: null,
    notes: { buildName: '', author: '', content: '' },
  };
}

describe('AiPromptService', () => {
  let service: AiPromptService;
  let buildStore: BuildStore;
  let httpMock: HttpTestingController;

  function setup(): void {
    TestBed.configureTestingModule({
      providers: [
        AiPromptService,
        BuildStore,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CharacterDataService,
          useValue: {
            characters: {
              value: () => [MOCK_CHARACTER],
              status: () => 'ready' as const,
              error: () => null,
            },
          },
        },
        {
          provide: AbilityDataService,
          useValue: {
            abilities: {
              value: () => MOCK_ABILITIES,
              status: () => 'ready' as const,
              error: () => null,
            },
            trees: {
              value: () => MOCK_TREES,
              status: () => 'ready' as const,
              error: () => null,
            },
          },
        },
        {
          provide: ToastService,
          useValue: { show: () => {} },
        },
      ],
    });

    buildStore = TestBed.inject(BuildStore);
    buildStore.initialize();
    buildStore.obtainAbility('warfare-1');
    buildStore.obtainAbility('warfare-2');
    service = TestBed.inject(AiPromptService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  it('loads and trims the template, excluding BUILD DATA section', async () => {
    setup();
    const prompt$ = service.generateCompletePrompt();
    const req = httpMock.expectOne('assets/ia/prompt_template.md');
    req.flush(MOCK_TEMPLATE);
    const prompt = await prompt$;

    expect(prompt).toContain('# Stoneshard Build Analyst');
    expect(prompt).toContain('# OUTPUT CONTRACT');
    expect(prompt).not.toContain('# BUILD DATA');
    expect(prompt).not.toContain('# ADDITIONAL GAME DATA');
  });

  it('caches the template after first fetch', async () => {
    setup();
    const prompt1$ = service.generateCompletePrompt();
    const req1 = httpMock.expectOne('assets/ia/prompt_template.md');
    req1.flush(MOCK_TEMPLATE);
    const prompt1 = await prompt1$;

    const prompt2$ = service.generateCompletePrompt();
    const prompt2 = await prompt2$;

    expect(prompt1).toBe(prompt2);
  });

  it('falls back to build-data-only on template fetch failure', async () => {
    setup();
    const prompt$ = service.generateCompletePrompt();
    const req = httpMock.expectOne('assets/ia/prompt_template.md');
    req.error(new ProgressEvent('error'));
    const prompt = await prompt$;

    expect(prompt).toContain('## Character');
    expect(prompt).toContain('## Stats');
    expect(prompt).toContain('## Abilities');
  });

  it('formats obtained abilities as table rows with no old bullet fields', async () => {
    setup();
    const prompt$ = service.generateCompletePrompt();
    const req = httpMock.expectOne('assets/ia/prompt_template.md');
    req.flush(MOCK_TEMPLATE);
    const prompt = await prompt$;

    expect(prompt).toContain('| 1 | Butchering | passive | - | - | - | - |');
    expect(prompt).toContain('| 2 | War Cry | attack | 10 | 12 | 1 | STR |');
    expect(prompt).toContain('| 3 | Battle Focus | passive | - | - | - | - |');
    expect(prompt).not.toContain('Requires:');
    expect(prompt).not.toContain('Children:');
    expect(prompt).not.toContain('Modified by:');
    expect(prompt).not.toContain('Level:');
  });

  it('escapes pipes and line breaks inside description cells', () => {
    const description = 'Deals 5\n10 damage | ignores armor';
    expect(service.sanitizeTableCell(description)).toBe('Deals 5 10 damage \\| ignores armor');
  });

  it('includes default abilities without expanding the set with prereqs or children', () => {
    const state = buildState([{ abilityId: 'warfare-1', level: 1, order: 1 }]);
    const subset = service.buildObtainedAbilitySubset(state, MOCK_ABILITIES as Ability[]);

    expect(subset.map((a) => a.id)).toEqual(['survival-1', 'warfare-1']);
  });

  it('builds the abilities section with obtained and default abilities', async () => {
    setup();
    const prompt$ = service.generateCompletePrompt();
    const req = httpMock.expectOne('assets/ia/prompt_template.md');
    req.flush(MOCK_TEMPLATE);
    const prompt = await prompt$;

    expect(prompt).toContain('War Cry');
    expect(prompt).toContain('Battle Focus');
    expect(prompt).toContain('Butchering');
    expect(prompt).not.toContain('### Ability Prerequisites');
    expect(prompt).not.toContain('## Prerequisites');
  });

  it('includes obtained and default abilities and omits raw IDs', async () => {
    setup();
    const state = buildState([{ abilityId: 'warfare-1', level: 1, order: 1 }]);
    const section = service.buildAbilitiesSection(state, MOCK_ABILITIES as Ability[]);

    expect(section).toContain('War Cry');
    expect(section).toContain('Butchering');
    expect(section).not.toContain('Battle Focus');
    expect(section).not.toContain('warfare-2');
  });

  it('shows the no-abilities notice when no default abilities exist', () => {
    const state = buildState([]);
    const noDefaultAbilities = (MOCK_ABILITIES as Ability[]).filter((a) => a.id !== 'survival-1');
    const section = service.buildAbilitiesSection(state, noDefaultAbilities);

    expect(section).toContain('_No abilities obtained._');
  });

  it('includes the default ability with an empty build', () => {
    const state = buildState([]);
    const section = service.buildAbilitiesSection(state, MOCK_ABILITIES as Ability[]);

    expect(section).toContain('Butchering');
    expect(section).toContain('| 1 | Butchering |');
    expect(section).not.toContain('_No abilities obtained._');
  });

  it('does not duplicate a default ability when it is also obtained', () => {
    const state = buildState([
      { abilityId: 'survival-1', level: 1, order: 1 },
      { abilityId: 'warfare-1', level: 1, order: 2 },
    ]);
    const section = service.buildAbilitiesSection(state, MOCK_ABILITIES as Ability[]);

    expect(section).toContain('| 1 | Butchering |');
    expect(section).toContain('| 2 | War Cry |');
    expect(section.match(/\| Butchering \|/g)).toHaveLength(1);
  });

  it('includes the default ability tree metadata on its own', () => {
    const state = buildState([]);
    const abilitySubset = service.buildObtainedAbilitySubset(state, MOCK_ABILITIES as Ability[]);
    const trees = service.buildRelevantTrees(abilitySubset, MOCK_TREES as AbilityTree[]);

    expect(trees.map((t) => t.id)).toContain('survival');
    expect(trees).toHaveLength(1);
  });

  it('includes relevant tree metadata for abilities spanning multiple trees', () => {
    const state = buildState([
      { abilityId: 'warfare-1', level: 1, order: 1 },
      { abilityId: 'athletics-1', level: 1, order: 2 },
    ]);
    const abilitySubset = service.buildObtainedAbilitySubset(state, MOCK_ABILITIES as Ability[]);
    const trees = service.buildRelevantTrees(abilitySubset, MOCK_TREES as AbilityTree[]);

    expect(trees.length).toBe(3);
    expect(trees.map((t) => t.id)).toContain('survival');
    expect(trees.map((t) => t.id)).toContain('warfare');
    expect(trees.map((t) => t.id)).toContain('athletics');
  });

  it('includes character data in the prompt', async () => {
    setup();
    const prompt$ = service.generateCompletePrompt();
    const req = httpMock.expectOne('assets/ia/prompt_template.md');
    req.flush(MOCK_TEMPLATE);
    const prompt = await prompt$;

    expect(prompt).toContain('Jorna');
    expect(prompt).toContain('The Bold');
    expect(prompt).toContain('Human (Skadian)');
    expect(prompt).toContain('Brave');
  });

  it('includes stats in the prompt as a compact table', async () => {
    setup();
    const prompt$ = service.generateCompletePrompt();
    const req = httpMock.expectOne('assets/ia/prompt_template.md');
    req.flush(MOCK_TEMPLATE);
    const prompt = await prompt$;

    expect(prompt).toContain('## Stats');
    expect(prompt).toContain('| STR | AGI | PER | VIT | WIL |');
  });

  it('preserves the stat base+allocated format', async () => {
    setup();
    const state = buildState([]);
    state.stats = { STR: 24, AGI: 8, PER: 7, VIT: 9, WIL: 6 };
    buildStore.restoreState(state as never);

    const prompt$ = service.generateCompletePrompt();
    const req = httpMock.expectOne('assets/ia/prompt_template.md');
    req.flush(MOCK_TEMPLATE);
    const prompt = await prompt$;

    expect(prompt).toContain('24 (10+14)');
  });

  it('formats trees as a compact table', () => {
    const trees = service.buildRelevantTrees(
      MOCK_ABILITIES as Ability[],
      MOCK_TREES as AbilityTree[],
    );
    const section = service['buildTreesSection'](trees);

    expect(section).toContain('| Tree | Category | Focus | Crit Effect |');
    expect(section).toContain('| Warfare | weaponry | Melee combat |');
    expect(section).toContain('| Athletics | utility | Mobility |');
  });

  it('enforces the one-shot template contract with no equipment or coaching instructions', async () => {
    setup();
    const prompt$ = service.generateCompletePrompt();
    const req = httpMock.expectOne('assets/ia/prompt_template.md');
    req.flush(MOCK_TEMPLATE);
    const prompt = await prompt$;

    expect(prompt).toContain('# OUTPUT CONTRACT');
    expect(prompt).toContain('| **Playstyle** |');
    expect(prompt).toContain('| **Biggest Mistake** |');
    expect(prompt).toContain('# NO EQUIPMENT DATA');
    expect(prompt).not.toContain('EQUIPMENT SYNERGY');
    expect(prompt).not.toContain('ARMOR CLASS');
    expect(prompt).not.toContain('INTERACTIVE COACH');
    expect(prompt).not.toContain('COMBAT SCENARIO');
    expect(prompt).not.toContain('COMPARISON MODE');
  });

  it('returns empty string when build is not ready', async () => {
    TestBed.configureTestingModule({
      providers: [
        AiPromptService,
        BuildStore,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CharacterDataService,
          useValue: {
            characters: {
              value: () => [],
              status: () => 'ready' as const,
              error: () => null,
            },
          },
        },
        {
          provide: AbilityDataService,
          useValue: {
            abilities: {
              value: () => [],
              status: () => 'ready' as const,
              error: () => null,
            },
            trees: {
              value: () => [],
              status: () => 'ready' as const,
              error: () => null,
            },
          },
        },
        {
          provide: ToastService,
          useValue: { show: () => {} },
        },
      ],
    });

    const freshService = TestBed.inject(AiPromptService);
    const prompt = await freshService.generateCompletePrompt();
    expect(prompt).toBe('');
  });
});
