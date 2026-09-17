import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  QueryList,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { BuildStore } from '@features/build/services';
import { CharacterDataService } from '@features/character/services';
import { Character } from '@models';
import { fadeInOut } from '@shared/animations/fade';

interface CharacterOptionItem extends Highlightable {
  id: string;
  label: string;
  elementRef: ElementRef;
  getLabel(): string;
}

const DROPDOWN_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
];

const TOOLTIP_POSITIONS: ConnectedPosition[] = [
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8 },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 },
];

@Component({
  selector: 'app-character-selector',
  host: { '(document:click)': 'onDocumentClick($event)' },
  templateUrl: './character-selector.html',
  styleUrl: './character-selector.scss',
  animations: [fadeInOut],
})
export class CharacterSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('toggleBtn') toggleBtnRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('traitIcon') traitIconRef!: ElementRef<HTMLDivElement>;
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<unknown>;
  @ViewChild('traitBubbleTemplate') traitBubbleTemplate!: TemplateRef<unknown>;
  @ViewChild('traitTooltipTemplate') traitTooltipTemplate!: TemplateRef<unknown>;
  @ViewChildren('optionBtn') optionBtns!: QueryList<ElementRef<HTMLButtonElement>>;

  keyManager!: ActiveDescendantKeyManager<CharacterOptionItem>;
  optionItems: CharacterOptionItem[] = [];

  currentCharacter = computed(() => this.buildStore.character());
  allCharacters = signal<Character[]>([]);
  dropdownOpen = signal(false);
  hoveredCharacter = signal<Character | null>(null);
  traitHovered = signal(false);

  private readonly buildStore = inject(BuildStore);
  private readonly characterData = inject(CharacterDataService);
  private readonly elementRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private scrollListener: (() => void) | null = null;

  private dropdownOverlayRef: OverlayRef | null = null;
  private traitBubbleOverlayRef: OverlayRef | null = null;
  private traitTooltipOverlayRef: OverlayRef | null = null;

  private readonly charactersEffect = effect(() => {
    const chars = this.characterData.characters.value();
    if (chars) {
      this.allCharacters.set(chars);
    }
  });

  private readonly dropdownEffect = effect(() => {
    const isOpen = this.dropdownOpen();
    if (isOpen) {
      this.showDropdown();
    } else {
      this.hideDropdown();
    }
  });

  private readonly keyManagerEffect = effect(() => {
    const isOpen = this.dropdownOpen();
    const chars = this.allCharacters();
    if (isOpen && chars.length > 0) {
      setTimeout(() => {
        const btns = this.optionBtns;
        if (btns && btns.length > 0) {
          this.optionItems = chars.map((char, i) => ({
            id: char.id,
            label: char.name,
            elementRef: btns.get(i)!,
            getLabel() {
              return this.label;
            },
            setActiveStyles() {
              this.elementRef.nativeElement.classList.add(
                'char-selector__option--active-descendant',
              );
            },
            setInactiveStyles() {
              this.elementRef.nativeElement.classList.remove(
                'char-selector__option--active-descendant',
              );
            },
          }));
          this.keyManager = new ActiveDescendantKeyManager<CharacterOptionItem>(this.optionItems)
            .withWrap()
            .withTypeAhead();
        }
      });
    }
  });

  private readonly traitBubbleEffect = effect(() => {
    const hovered = this.traitHovered();
    const isOpen = this.dropdownOpen();
    if (hovered && !isOpen) {
      this.showTraitBubble();
    } else {
      this.hideTraitBubble();
    }
  });

  private readonly traitTooltipEffect = effect(() => {
    const hovered = this.hoveredCharacter();
    const isOpen = this.dropdownOpen();
    if (hovered && isOpen) {
      this.showTraitTooltip(hovered);
    } else {
      this.hideTraitTooltip();
    }
  });

  ngOnInit(): void {
    const sideNav = this.elementRef.nativeElement.closest('.left-sidenav');
    if (sideNav) {
      this.scrollListener = () => {
        this.dropdownOpen.set(false);
      };
      sideNav.addEventListener('scroll', this.scrollListener);
    }
  }

  ngOnDestroy(): void {
    this.hideDropdown();
    this.hideTraitBubble();
    this.hideTraitTooltip();
    if (this.scrollListener) {
      const sideNav = this.elementRef.nativeElement.closest('.left-sidenav');
      if (sideNav) {
        sideNav.removeEventListener('scroll', this.scrollListener);
      }
      this.scrollListener = null;
    }
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideHost = this.elementRef.nativeElement.contains(target);
    const clickedInsideDropdown = this.dropdownOverlayRef?.hostElement.contains(target) ?? false;
    if (!clickedInsideHost && !clickedInsideDropdown) {
      this.dropdownOpen.set(false);
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  selectCharacter(characterId: string): void {
    this.buildStore.selectCharacter(characterId);
    this.dropdownOpen.set(false);
  }

  onToggleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.dropdownOpen()) {
        this.dropdownOpen.set(true);
      }
      if (this.keyManager) {
        if (event.key === 'ArrowDown') {
          this.keyManager.setNextItemActive();
        } else {
          this.keyManager.setPreviousItemActive();
        }
      }
    } else if (event.key === 'Home' && this.dropdownOpen()) {
      event.preventDefault();
      if (this.keyManager) {
        this.keyManager.setFirstItemActive();
      }
    } else if (event.key === 'End' && this.dropdownOpen()) {
      event.preventDefault();
      if (this.keyManager) {
        this.keyManager.setLastItemActive();
      }
    } else if (event.key === 'Escape' && this.dropdownOpen()) {
      event.preventDefault();
      this.dropdownOpen.set(false);
    }
  }

  onOptionKeydown(event: KeyboardEvent, index: number): void {
    const chars = this.allCharacters();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.keyManager) {
        this.keyManager.setNextItemActive();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.keyManager) {
        this.keyManager.setPreviousItemActive();
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      if (this.keyManager) {
        this.keyManager.setFirstItemActive();
      }
    } else if (event.key === 'End') {
      event.preventDefault();
      if (this.keyManager) {
        this.keyManager.setLastItemActive();
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.selectCharacter(chars[index].id);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.dropdownOpen.set(false);
    }
  }

  private showDropdown(): void {
    if (this.dropdownOverlayRef) {
      return;
    }

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.toggleBtnRef)
      .withPositions(DROPDOWN_POSITIONS);

    this.dropdownOverlayRef = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
    });

    const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
    this.dropdownOverlayRef.attach(portal);
  }

  private hideDropdown(): void {
    if (this.dropdownOverlayRef) {
      this.dropdownOverlayRef.detach();
      this.dropdownOverlayRef.dispose();
      this.dropdownOverlayRef = null;
    }
  }

  private showTraitBubble(): void {
    if (this.traitBubbleOverlayRef || !this.traitIconRef) {
      return;
    }

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.traitIconRef)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
      ]);

    this.traitBubbleOverlayRef = this.overlay.create({
      positionStrategy: strategy,
      hasBackdrop: false,
    });

    const portal = new TemplatePortal(this.traitBubbleTemplate, this.viewContainerRef);
    this.traitBubbleOverlayRef.attach(portal);
  }

  private hideTraitBubble(): void {
    if (this.traitBubbleOverlayRef) {
      this.traitBubbleOverlayRef.detach();
      this.traitBubbleOverlayRef.dispose();
      this.traitBubbleOverlayRef = null;
    }
  }

  private showTraitTooltip(character: Character): void {
    this.hideTraitTooltip();

    const index = this.allCharacters().indexOf(character);
    if (index === -1) {
      return;
    }

    if (!this.dropdownOverlayRef) {
      return;
    }

    const dropdownEl = this.dropdownOverlayRef.hostElement.querySelector(
      '.char-selector__dropdown',
    );
    if (!dropdownEl) {
      return;
    }

    const options = dropdownEl.querySelectorAll('.char-selector__option');
    const optionEl = options[index] as HTMLElement;
    if (!optionEl) {
      return;
    }

    const optionRef = new ElementRef(optionEl);
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(optionRef)
      .withPositions(TOOLTIP_POSITIONS);

    this.traitTooltipOverlayRef = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
    });

    const portal = new TemplatePortal(this.traitTooltipTemplate, this.viewContainerRef);
    this.traitTooltipOverlayRef.attach(portal);
  }

  private hideTraitTooltip(): void {
    if (this.traitTooltipOverlayRef) {
      this.traitTooltipOverlayRef.detach();
      this.traitTooltipOverlayRef.dispose();
      this.traitTooltipOverlayRef = null;
    }
  }

  getPortraitPath(character: Character): string {
    const capitalizedId = character.id.charAt(0).toUpperCase() + character.id.slice(1);
    return `assets/portraits/${capitalizedId}.png`;
  }

  trackByCharacterId(_index: number, character: Character): string {
    return character.id;
  }

  getActiveItemId(): string | null {
    return this.keyManager?.activeItem?.id ?? null;
  }
}
