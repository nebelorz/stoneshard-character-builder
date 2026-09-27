import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ExtrasDisplayComponent } from './extras-display';
import { BuildStore } from '@core/state';

const HOVER_DELAY = 200;

const settle = (ms = HOVER_DELAY + 50) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('ExtrasDisplayComponent', () => {
  let overlayContainer: OverlayContainer;
  let storeState: Record<string, unknown>;
  let fixture: ComponentFixture<ExtrasDisplayComponent>;

  const tooltipEl = () => overlayContainer.getContainerElement().querySelector('[role="tooltip"]');

  function createFixture(): void {
    fixture = TestBed.createComponent(ExtrasDisplayComponent);
    fixture.detectChanges();
  }

  beforeEach(() => {
    storeState = {
      bonusSlots: [],
      notes: { buildName: '', author: '', content: '' },
    };
    TestBed.configureTestingModule({
      imports: [ExtrasDisplayComponent],
      providers: [
        {
          provide: BuildStore,
          useValue: {
            state: () => storeState,
          },
        },
      ],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    createFixture();
  });

  afterEach(() => {
    fixture.destroy();
    overlayContainer.ngOnDestroy();
  });

  it('exposes the section title as a heading for assistive tech', () => {
    const heading = fixture.nativeElement.querySelector('[role="heading"]') as HTMLElement;
    expect(heading).not.toBeNull();
    expect(heading.getAttribute('aria-level')).toBe('2');
    expect(heading.textContent!.trim()).toBe('Notes');
  });

  it('shows the notes placeholder when there are no notes', () => {
    const placeholder = fixture.nativeElement.querySelector(
      '.right-sidenav__extras-notes-placeholder',
    );
    expect(placeholder.textContent!.trim()).toBe('No notes for this build');
  });

  it('shows a truncated preview when notes exist', () => {
    storeState = {
      bonusSlots: [],
      notes: { buildName: 'Spearman', author: 'Alex', content: 'Focus crit chance.' },
    };
    createFixture();
    expect(fixture.nativeElement.textContent).toContain('Spearman');
    expect(fixture.nativeElement.textContent).toContain('Alex');
    expect(fixture.nativeElement.textContent).toContain('Focus crit chance.');
  });

  it('emits openNotes when the notes section is clicked', () => {
    const opened: boolean[] = [];
    const subscription = fixture.componentInstance.openNotes.subscribe(() => opened.push(true));
    const row = fixture.nativeElement.querySelector('.right-sidenav__extras-row--notes');
    row.click();
    expect(opened.length).toBe(1);
    subscription.unsubscribe();
  });

  it('describes the notes icon with the author-notes tooltip', async () => {
    const icon = fixture.nativeElement.querySelector('ng-icon[name="phosphorNote"]') as HTMLElement;
    icon.dispatchEvent(new MouseEvent('mouseenter'));
    await settle();

    const tooltip = tooltipEl();
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Author notes about this build');
    expect(icon.getAttribute('aria-describedby')).toBe(tooltip?.id);
  });
});
