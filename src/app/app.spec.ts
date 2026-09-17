import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app';
import { AbilityDataService } from '@features/ability-trees/services';
import { CharacterDataService } from '@features/character/services';
import { BuildStore } from '@features/build/services';
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
    canIncrementStat1: () => false,
    canDecrementStat1: () => false,
    canIncrementStat5: () => false,
    canDecrementStat5: () => false,
  };
}

describe('AppComponent', () => {
  it('should create the app', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideAnimations(), provideHttpClient(), provideHttpClientTesting()],
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
        provideAnimations(),
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
        provideAnimations(),
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
        provideAnimations(),
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
