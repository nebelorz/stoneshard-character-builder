import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { AbilityDataService, CharacterDataService, QuestDataService } from '@core/data';
import { BuildStore } from '@core/state';
import { ToastService } from '@shared/services';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

function createBuildStoreMock(
  overrides: Partial<{ initStatus: 'idle' | 'loading' | 'ready' | 'error' }> = {},
): Partial<BuildStore> {
  return {
    initStatus: signal<'idle' | 'loading' | 'ready' | 'error'>(overrides.initStatus ?? 'idle'),
    initError: signal(''),
    state: signal(null),
    character: signal(null),
    stateSnapshot: signal({ ready: false } as const),
    canLevelUp: signal(false),
    canLevelDown: signal(false),
    canLevelUp5: signal(false),
    canLevelDown5: signal(false),
    traitsUnlockedOnStart: signal([]),
    derivedTraitAp: signal(0),
    totalAp: signal(0),
    bonusCount: () => 0,
    initialize: () => {},
    restoreState: () => {},
    reset: () => {},
    selectCharacter: () => {},
    levelUp: () => {},
    levelDown: () => {},
    levelUp5: () => {},
    levelDown5: () => {},
    incrementStat: () => {},
    decrementStat: () => {},
    incrementStat5: () => {},
    decrementStat5: () => {},
    obtainAbility: () => false,
    refundAbility: () => false,
    pinTree: () => {},
    unpinTree: () => {},
    canIncrementStat: () => false,
    canDecrementStat: () => false,
  };
}

describe('AppComponent', () => {
  it('should create the app', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

describe('Startup failure handling', () => {
  it('should render error component with retry button when initial data fetch fails', async () => {
    const charError = signal<{ message: string } | null>(null);
    const treesError = signal<{ message: string } | null>(null);
    const abilitiesError = signal<{ message: string } | null>(null);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CharacterDataService,
          useValue: {
            characters: {
              error: () => charError(),
              status: () => (charError() ? 'error' : 'idle'),
              reload: () => charError.set({ message: 'Failed to load characters' }),
              value: () => null,
            },
          },
        },
        {
          provide: AbilityDataService,
          useValue: {
            trees: {
              error: () => treesError(),
              status: () => (treesError() ? 'error' : 'idle'),
              reload: () => treesError.set({ message: 'Failed to load trees' }),
              value: () => null,
            },
            abilities: {
              error: () => abilitiesError(),
              status: () => (abilitiesError() ? 'error' : 'idle'),
              reload: () => abilitiesError.set({ message: 'Failed to load abilities' }),
              value: () => null,
            },
          },
        },
        {
          provide: BuildStore,
          useValue: createBuildStoreMock(),
        },
      ],
    }).compileComponents();

    charError.set({ message: 'Failed to load characters' });
    treesError.set({ message: 'Failed to load trees' });
    abilitiesError.set({ message: 'Failed to load abilities' });

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('app-error');
    expect(errorEl).toBeTruthy();

    const retryBtn = fixture.nativeElement.querySelector('.error__retry');
    expect(retryBtn).toBeTruthy();
    expect(retryBtn.textContent).toContain('Try Again');
  });
});

describe('Loading state', () => {
  it('should show loading spinner when build store is initializing', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CharacterDataService,
          useValue: {
            characters: {
              error: () => null,
              status: () => 'idle' as const,
              reload: () => {},
              value: () => null,
            },
          },
        },
        {
          provide: AbilityDataService,
          useValue: {
            trees: {
              error: () => null,
              status: () => 'idle' as const,
              reload: () => {},
              value: () => null,
            },
            abilities: {
              error: () => null,
              status: () => 'idle' as const,
              reload: () => {},
              value: () => null,
            },
          },
        },
        { provide: BuildStore, useValue: createBuildStoreMock({ initStatus: 'loading' }) },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const loadingEl = fixture.nativeElement.querySelector('.app-loading');
    expect(loadingEl).toBeTruthy();
    const spinnerEl = fixture.nativeElement.querySelector('.app-loading__spinner');
    expect(spinnerEl).toBeTruthy();
    const textEl = fixture.nativeElement.querySelector('.app-loading__text');
    expect(textEl.textContent).toContain('Loading...');
  });

  it('should show pin-area when data loads successfully', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CharacterDataService,
          useValue: {
            characters: {
              error: () => null,
              status: () => 'ready' as const,
              reload: () => {},
              value: () => null,
            },
          },
        },
        {
          provide: AbilityDataService,
          useValue: {
            trees: {
              error: () => null,
              status: () => 'ready' as const,
              reload: () => {},
              value: () => null,
            },
            abilities: {
              error: () => null,
              status: () => 'ready' as const,
              reload: () => {},
              value: () => null,
            },
          },
        },
        { provide: BuildStore, useValue: createBuildStoreMock({ initStatus: 'ready' }) },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const pinAreaEl = fixture.nativeElement.querySelector('app-pin-area');
    expect(pinAreaEl).toBeTruthy();
    const loadingEl = fixture.nativeElement.querySelector('.app-loading');
    expect(loadingEl).toBeNull();
  });
});

describe('Quest data failure handling', () => {
  const questsError = signal<{ message: string } | null>({ message: 'Failed to load quests' });

  const readyResource = () => ({
    error: () => null,
    status: () => 'ready' as const,
    reload: () => {},
    value: () => null,
  });

  const configureWithQuestError = async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CharacterDataService, useValue: { characters: readyResource() } },
        {
          provide: AbilityDataService,
          useValue: { trees: readyResource(), abilities: readyResource() },
        },
        {
          provide: QuestDataService,
          useValue: {
            quests: {
              error: () => questsError(),
              status: () => (questsError() ? 'error' : 'idle'),
              reload: () => {},
              value: () => null,
            },
            questList: () => [],
          },
        },
        { provide: BuildStore, useValue: createBuildStoreMock({ initStatus: 'ready' }) },
      ],
    }).compileComponents();
  };

  const createWithQuestError = () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('shows a non-blocking toast when quest data fails without blocking startup', async () => {
    await configureWithQuestError();
    const toastService = TestBed.inject(ToastService);
    const showSpy = vi.spyOn(toastService, 'show');

    const fixture = createWithQuestError();

    expect(showSpy).toHaveBeenCalledWith(
      'Could not load quest data; quest bonuses may be unavailable',
      'error',
    );
    expect(fixture.nativeElement.querySelector('app-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-pin-area')).toBeTruthy();
  });

  it('reports the quest data failure only once', async () => {
    await configureWithQuestError();
    const toastService = TestBed.inject(ToastService);
    const showSpy = vi.spyOn(toastService, 'show');

    const fixture = createWithQuestError();
    fixture.detectChanges();
    fixture.detectChanges();

    const questCalls = showSpy.mock.calls.filter(([message]) =>
      String(message).includes('quest data'),
    );
    expect(questCalls).toHaveLength(1);
  });
});
