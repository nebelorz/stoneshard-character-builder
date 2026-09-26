import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ExtrasDisplayComponent } from './extras-display';
import { BuildStore } from '@features/build/services';

describe('ExtrasDisplayComponent', () => {
  let overlayContainer: OverlayContainer;
  let storeState: Record<string, unknown>;
  let fixture: ComponentFixture<ExtrasDisplayComponent>;

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

  it('renders the section header as Notes', () => {
    const title = fixture.nativeElement.querySelector('.right-sidenav__extras-title');
    expect(title.textContent!.trim()).toBe('Notes');
    expect(title.classList.contains('font-fantasy')).toBe(true);
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

  it('annotates the notes icon with the author notes tooltip', () => {
    const icon = fixture.nativeElement.querySelector('ng-icon[name="phosphorNote"]');
    expect(icon.getAttribute('tooltiptext')).toBe('Author notes about this build');
  });
});
