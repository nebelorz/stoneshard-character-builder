import { TestBed } from '@angular/core/testing';
import { BuildState } from '@models';
import { CharacterDataService } from '@features/character/services';
import { ToastService } from '@shared/services';
import { BuildStore } from './build-store';
import { UrlShareService } from './url-share.service';

const ERROR_MESSAGE = 'Could not restore build from URL, starting fresh';

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
  },
];

const KNOWN_STATE: BuildState = {
  characterId: 'jorna',
  level: 5,
  ap: 6,
  sp: 4,
  stats: { STR: 12, AGI: 10, PER: 8, VIT: 11, WIL: 7 },
  obtainedAbilities: [],
  pinnedTrees: [],
  statHistory: [],
  boulderCircleStat: null,
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
});
