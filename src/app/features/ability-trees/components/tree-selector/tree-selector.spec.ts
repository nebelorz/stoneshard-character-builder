import { signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TreeSelectorComponent } from './tree-selector';
import { AbilityDataService } from '@core/data';
import { BuildStore } from '@core/state';
import { AbilityTree } from '@models';

const TREES: AbilityTree[] = [
  {
    id: 'warfare',
    name: 'Warfare',
    category: 'weaponry',
    focus: '',
    critEffect: '',
    icon: 'warfare',
  },
  {
    id: 'staves',
    name: 'Staves',
    category: 'weaponry',
    focus: '',
    critEffect: '',
    icon: 'staves',
  },
  {
    id: 'athletics',
    name: 'Athletics',
    category: 'utility',
    focus: '',
    critEffect: '',
    icon: 'athletics',
  },
];

const flush = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('TreeSelectorComponent keyboard navigation', () => {
  let fixture: ComponentFixture<TreeSelectorComponent>;

  const firstTreeCell = () =>
    fixture.nativeElement.querySelector('.tree-selector__tree-cell') as HTMLElement | null;

  const expandVia = (key: string) => {
    const tab = fixture.nativeElement.querySelector('#tree-tab-weaponry') as HTMLElement;
    tab.focus();
    tab.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeSelectorComponent],
      providers: [
        {
          provide: AbilityDataService,
          useValue: {
            trees: { value: () => TREES, status: () => 'ready' as const, error: () => null },
            abilities: { value: () => [], status: () => 'ready' as const, error: () => null },
          },
        },
        {
          provide: BuildStore,
          useValue: {
            state: signal(null),
            pinTree: () => {},
            unpinTree: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeSelectorComponent);
    fixture.detectChanges();
  });

  it('focuses the first tree item when a category expands with Enter', async () => {
    expandVia('Enter');
    await flush();

    const cell = firstTreeCell();
    expect(cell).toBeTruthy();
    expect(document.activeElement).toBe(cell);
  });

  it('focuses the first tree item when a category expands with ArrowDown', async () => {
    expandVia('ArrowDown');
    await flush();

    const cell = firstTreeCell();
    expect(cell).toBeTruthy();
    expect(document.activeElement).toBe(cell);
  });
});
