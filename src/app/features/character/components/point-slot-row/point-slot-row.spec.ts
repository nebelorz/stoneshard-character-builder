import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PointSlotRowComponent } from './point-slot-row';
import { STAT_KEYS } from '@models';

describe('PointSlotRowComponent', () => {
  let fixture: ComponentFixture<PointSlotRowComponent>;
  let component: PointSlotRowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointSlotRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PointSlotRowComponent);
    component = fixture.componentInstance;
  });

  function toggleButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.point-slot-row__toggle');
  }

  function openDropdown(): void {
    toggleButton().click();
    fixture.detectChanges();
  }

  it('shows the placeholder when unallocated', () => {
    fixture.componentRef.setInput('stat', null);
    fixture.detectChanges();
    expect(toggleButton().textContent!.trim()).toBe('-');
  });

  it('shows the stat chip when allocated', () => {
    fixture.componentRef.setInput('stat', 'STR');
    fixture.detectChanges();
    const chip = toggleButton().querySelector('.stat-chip--str');
    expect(chip).not.toBeNull();
    expect(toggleButton().textContent!.trim()).toContain('+1 STR');
  });

  it('emits statChange when an option is selected', () => {
    const changes: (string | null)[] = [];
    component.statChange.subscribe((stat) => changes.push(stat));
    openDropdown();
    const options = fixture.nativeElement.querySelectorAll('.point-slot-row__option');
    options[1].click();
    fixture.detectChanges();
    expect(changes).toEqual(['STR']);
    expect(component.dropdownOpen()).toBe(false);
  });

  it('emits null when the placeholder option is selected', () => {
    fixture.componentRef.setInput('stat', 'STR');
    const changes: (string | null)[] = [];
    component.statChange.subscribe((stat) => changes.push(stat));
    openDropdown();
    const options = fixture.nativeElement.querySelectorAll('.point-slot-row__option');
    options[0].click();
    fixture.detectChanges();
    expect(changes).toEqual([null]);
  });

  it('toggles the dropdown open and closed', () => {
    expect(component.dropdownOpen()).toBe(false);
    toggleButton().click();
    fixture.detectChanges();
    expect(component.dropdownOpen()).toBe(true);
    expect(fixture.nativeElement.querySelector('.point-slot-row__overlay')).not.toBeNull();
    toggleButton().click();
    fixture.detectChanges();
    expect(component.dropdownOpen()).toBe(false);
  });

  it('offers every stat key as an option that emits that key', () => {
    STAT_KEYS.forEach((key) => {
      const changes: (string | null)[] = [];
      const subscription = component.statChange.subscribe((stat) => changes.push(stat));
      openDropdown();
      const options = fixture.nativeElement.querySelectorAll(
        '.point-slot-row__option',
      ) as NodeListOf<HTMLElement>;
      const option = Array.from(options).find((el) => el.textContent!.includes(`+1 ${key}`));
      expect(option).toBeTruthy();
      option!.click();
      fixture.detectChanges();
      expect(changes).toEqual([key]);
      subscription.unsubscribe();
    });
  });

  it('closes on outside document click', () => {
    openDropdown();
    document.body.click();
    fixture.detectChanges();
    expect(component.dropdownOpen()).toBe(false);
  });

  it('does not move focus when clicking outside a closed dropdown', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    outside.click();
    fixture.detectChanges();
    expect(component.dropdownOpen()).toBe(false);
    expect(document.activeElement).toBe(outside);

    outside.remove();
  });

  it('closes an open dropdown on outside click without stealing focus', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    openDropdown();
    outside.focus();
    outside.click();
    fixture.detectChanges();
    expect(component.dropdownOpen()).toBe(false);
    expect(document.activeElement).toBe(outside);

    outside.remove();
  });

  describe('accessibility', () => {
    it('declares listbox semantics on the toggle', () => {
      fixture.detectChanges();
      expect(toggleButton().getAttribute('aria-haspopup')).toBe('listbox');
      expect(toggleButton().getAttribute('aria-expanded')).toBe('false');
      openDropdown();
      expect(toggleButton().getAttribute('aria-expanded')).toBe('true');
    });

    it('announces options with a single option role', () => {
      openDropdown();
      const options = fixture.nativeElement.querySelectorAll('.point-slot-row__option');
      expect(options.length).toBeGreaterThan(0);
      options.forEach((option: HTMLElement) => {
        expect(option.getAttribute('role')).toBe('option');
      });
      expect(
        fixture.nativeElement.querySelector('.point-slot-row__overlay').getAttribute('role'),
      ).toBe('listbox');
    });

    it('moves the active option with arrow keys', () => {
      openDropdown();
      const first = fixture.nativeElement.querySelector('#point-slot-option-0');
      expect(first.classList.contains('point-slot-row__option--active')).toBe(true);
      toggleButton().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      );
      fixture.detectChanges();
      const second = fixture.nativeElement.querySelector('#point-slot-option-1');
      expect(second.classList.contains('point-slot-row__option--active')).toBe(true);
      toggleButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      fixture.detectChanges();
      expect(first.classList.contains('point-slot-row__option--active')).toBe(true);
    });

    it('selects the active option with Enter and closes', () => {
      const changes: (string | null)[] = [];
      component.statChange.subscribe((stat) => changes.push(stat));
      openDropdown();
      toggleButton().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      );
      toggleButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();
      expect(changes).toEqual(['STR']);
      expect(component.dropdownOpen()).toBe(false);
    });

    it('closes with Escape and returns focus to the toggle', () => {
      openDropdown();
      toggleButton().focus();
      toggleButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();
      expect(component.dropdownOpen()).toBe(false);
      expect(document.activeElement).toBe(toggleButton());
    });
  });
});
