import { TestBed } from '@angular/core/testing';
import { BuildState, BonusSlot } from '@models';
import { CharacterDataService } from '@features/character/services';
import { AbilityDataService } from '@features/ability-trees/services';
import { QuestDataService, ToastService } from '@shared/services';
import { BuildStore } from './build-store';
import { UrlShareService } from './url-share.service';

const ERROR_MESSAGE = 'Could not restore build from URL, starting fresh';

const MOCK_QUESTS = [
  {
    id: 'boulder-circle',
    resource: 'sp' as const,
    label: 'Boulder Circle',
    tooltip: 'Grants 1 Stat Point',
    pointsPer: 1,
    max: 1,
  },
];

const MOCK_CHARACTERS = [
  {
    id: 'jorna',
    name: 'Jorna',
    title: 'The Bold',
    race: 'Human (Skadian)',
    gender: 'Female',
    trait: { name: 'Brave', description: '+10% Crit Chance' },
    baseStats: { STR: 10, AGI: 8, PER: 7, VIT: 9, WIL: 6 },
    traitsUnlockedOnStart: ['warfare'],
    traitGains: [
      { id: 'trophies', resource: 'sp', label: 'Trophies delivered', pointsPer: 1, max: 5 },
    ],
  },
  {
    id: 'aldor',
    name: 'Aldor',
    title: 'The Wise',
    race: 'Elf (Jacinth)',
    gender: 'Male',
    trait: { name: 'Studious', description: '+15% Skill XP' },
    baseStats: { STR: 6, AGI: 8, PER: 9, VIT: 7, WIL: 10 },
    traitsUnlockedOnStart: ['geomancy'],
    traitGains: [
      {
        id: 'warfare-mastery',
        resource: 'ap',
        label: 'Warfare abilities learned',
        formula: 'abilities-per-3',
        treeId: 'warfare',
      },
    ],
  },
  {
    id: 'velmir',
    name: 'Velmir',
    title: 'Revenger',
    race: 'Human (Skadian)',
    gender: 'Male',
    trait: { name: 'With Great Vengeance', description: '2 Stat Points per boss.' },
    baseStats: { STR: 11, AGI: 11, PER: 11, VIT: 10, WIL: 10 },
    traitsUnlockedOnStart: [],
    traitGains: [{ id: 'bosses', resource: 'sp', label: 'Bosses killed', pointsPer: 2 }],
  },
];

const MOCK_ABILITIES = ['warfare-1', 'warfare-2', 'warfare-3', 'survival-2'].map((id) => ({
  id,
  name: id,
  treeId: id.split('-')[0],
  x: 0,
  y: 0,
  type: 'passive' as const,
  target: 'No Target' as const,
  range: 1,
  energy: 0,
  cooldown: 0,
  modifiedByLabel: 'STR',
  requires: [],
  unlockConditions: [],
  description: '',
  requiredBy: [],
}));

const KNOWN_STATE: BuildState = {
  characterId: 'jorna',
  level: 5,
  ap: 6,
  sp: 4,
  stats: { STR: 12, AGI: 10, PER: 8, VIT: 11, WIL: 7 },
  obtainedAbilities: [],
  pinnedTrees: [],
  statHistory: [],
  bonusSlots: [],
  notes: { buildName: '', author: '', content: '' },
};

function setCurrentUrl(url: string): void {
  window.history.replaceState({}, '', url);
}

describe('UrlShareService', () => {
  let service: UrlShareService;
  let stateSnapshotMock: () => BuildState | { ready: false };

  async function buildParamFor(state: BuildState): Promise<string> {
    stateSnapshotMock = () => state;
    const url = await service.generateShareUrl();
    if (!url) throw new Error('generateShareUrl returned null');
    const searchParam = new URL(url).searchParams.get('build');
    if (!searchParam) throw new Error('No build parameter in generated URL');
    return searchParam;
  }

  async function restoreFromUrlWithParam(buildParam: string) {
    const base = window.location.origin + window.location.pathname;
    setCurrentUrl(`${base}?build=${buildParam}`);
    return service.restoreFromUrl();
  }

  beforeEach(() => {
    stateSnapshotMock = () => ({ ready: false });
    TestBed.configureTestingModule({
      providers: [
        UrlShareService,
        {
          provide: CharacterDataService,
          useValue: {
            characters: { value: () => MOCK_CHARACTERS },
          },
        },
        {
          provide: AbilityDataService,
          useValue: {
            abilities: { value: () => MOCK_ABILITIES },
          },
        },
        {
          provide: QuestDataService,
          useValue: {
            quests: { value: () => MOCK_QUESTS },
          },
        },
        {
          provide: BuildStore,
          useValue: {
            stateSnapshot: () => stateSnapshotMock(),
          },
        },
        {
          provide: ToastService,
          useValue: { show: () => {} },
        },
      ],
    });
    service = TestBed.inject(UrlShareService);
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  it('should round-trip a valid build state', async () => {
    const buildParam = await buildParamFor(KNOWN_STATE);
    await expect(restoreFromUrlWithParam(buildParam)).resolves.toEqual({ state: KNOWN_STATE });
  });

  it('should reject a corrupt build parameter', async () => {
    await expect(restoreFromUrlWithParam('not-a-valid-build')).resolves.toEqual({
      error: ERROR_MESSAGE,
    });
  });

  it('should reject a build with an unknown character id', async () => {
    const buildParam = await buildParamFor({ ...KNOWN_STATE, characterId: 'ghost' });
    await expect(restoreFromUrlWithParam(buildParam)).resolves.toEqual({ error: ERROR_MESSAGE });
  });

  it.each([0, 31])('should reject an out-of-range level (%i)', async (level) => {
    const buildParam = await buildParamFor({ ...KNOWN_STATE, level });
    await expect(restoreFromUrlWithParam(buildParam)).resolves.toEqual({ error: ERROR_MESSAGE });
  });

  it('should reject a non-integer level', async () => {
    const buildParam = await buildParamFor({ ...KNOWN_STATE, level: 2.5 });
    await expect(restoreFromUrlWithParam(buildParam)).resolves.toEqual({ error: ERROR_MESSAGE });
  });

  describe('bonus slots', () => {
    it('should round-trip allocated bonus slots', async () => {
      const slots: BonusSlot[] = [
        { sourceId: 'boulder-circle', index: 0, stat: 'STR' },
        { sourceId: 'trophies', index: 2, stat: 'VIT' },
      ];
      const state = { ...KNOWN_STATE, bonusSlots: slots };
      const buildParam = await buildParamFor(state);
      await expect(restoreFromUrlWithParam(buildParam)).resolves.toEqual({ state });
    });

    it('should round-trip claimed null-stat rows', async () => {
      const slots: BonusSlot[] = [
        { sourceId: 'bosses', index: 0, stat: null },
        { sourceId: 'bosses', index: 1, stat: null },
        { sourceId: 'bosses', index: 2, stat: 'PER' },
        { sourceId: 'bosses', index: 3, stat: null },
      ];
      const state = { ...KNOWN_STATE, characterId: 'velmir', bonusSlots: slots };
      const buildParam = await buildParamFor(state);
      await expect(restoreFromUrlWithParam(buildParam)).resolves.toEqual({ state });
    });

    it('should invalidate the payload when bonusSlots is not an array', async () => {
      const state = { ...KNOWN_STATE, bonusSlots: 'nope' } as unknown as BuildState;
      const buildParam = await buildParamFor(state);
      await expect(restoreFromUrlWithParam(buildParam)).resolves.toEqual({ error: ERROR_MESSAGE });
    });

    it('should drop malformed, out-of-range, duplicate, unknown, and foreign trait entries', async () => {
      const state = {
        ...KNOWN_STATE,
        bonusSlots: [
          { sourceId: 'boulder-circle', index: 0, stat: 'STR' },
          { sourceId: 'boulder-circle', index: 0, stat: 'AGI' },
          { sourceId: 'bosses', index: 0, stat: null },
          { sourceId: 'bosses', index: 25, stat: null },
          { sourceId: 'trophies', index: 0, stat: 'STR' },
          { sourceId: 'unknown', index: 0, stat: 'STR' },
          { sourceId: 'boulder-circle', index: 'x', stat: null },
          { sourceId: 'boulder-circle', index: 0, stat: 'NOPE' },
        ],
      } as unknown as BuildState;
      const buildParam = await buildParamFor(state);
      const result = await restoreFromUrlWithParam(buildParam);
      expect(result).toEqual({
        state: {
          ...KNOWN_STATE,
          bonusSlots: [
            { sourceId: 'boulder-circle', index: 0, stat: 'STR' },
            { sourceId: 'trophies', index: 0, stat: 'STR' },
          ],
        },
      });
    });

    it('should clamp ap up to the derived floor', async () => {
      const state = {
        ...KNOWN_STATE,
        characterId: 'aldor',
        ap: -5,
        obtainedAbilities: [
          { abilityId: 'warfare-1', level: 1, order: 1 },
          { abilityId: 'warfare-2', level: 2, order: 2 },
          { abilityId: 'warfare-3', level: 3, order: 3 },
        ],
      };
      const buildParam = await buildParamFor(state);
      const result = (await restoreFromUrlWithParam(buildParam)) as { state: BuildState };
      expect(result.state.ap).toBe(-1);
    });
  });

  describe('legacy payload migration', () => {
    it('should migrate a legacy boulderCircleStat into a boulder-circle slot', async () => {
      const legacy = {
        ...KNOWN_STATE,
        boulderCircleStat: 'STR',
        bonusSlots: undefined,
      } as unknown as BuildState;
      const buildParam = await buildParamFor(legacy);
      const result = (await restoreFromUrlWithParam(buildParam)) as { state: BuildState };
      expect(result.state.bonusSlots).toEqual([
        { sourceId: 'boulder-circle', index: 0, stat: 'STR' },
      ]);
    });

    it('should migrate a legacy null boulderCircleStat to no slots', async () => {
      const legacy = {
        ...KNOWN_STATE,
        boulderCircleStat: null,
        bonusSlots: undefined,
      } as unknown as BuildState;
      const buildParam = await buildParamFor(legacy);
      const result = (await restoreFromUrlWithParam(buildParam)) as { state: BuildState };
      expect(result.state.bonusSlots).toEqual([]);
    });

    it('should treat a missing bonusSlots field as empty', async () => {
      const legacy = { ...KNOWN_STATE, bonusSlots: undefined } as unknown as BuildState;
      const buildParam = await buildParamFor(legacy);
      const result = (await restoreFromUrlWithParam(buildParam)) as { state: BuildState };
      expect(result.state.bonusSlots).toEqual([]);
    });
  });
});
