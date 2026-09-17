import { Component, inject, signal, computed, effect, ViewChild, ElementRef } from '@angular/core';

import { PinAreaComponent } from '@features/ability-trees/components/pin-area';
import { LeftSidenavComponent } from '@layout/left-sidenav/left-sidenav';
import { RightSidenavComponent } from '@layout/right-sidenav/right-sidenav';

import { ErrorComponent } from '@shared/ui/error/error';
import { ToastComponent } from '@shared/ui/toast/toast';
import { PopoverComponent } from '@shared/ui/popover/popover';
import { ConfirmPopupComponent } from '@shared/ui/confirm-popup/confirm-popup';
import { ToastService, PopupService } from '@shared/services';
import { copyWithFeedback } from '@shared/utils/clipboard';
import { BuildStore, UrlShareService, AiPromptService } from '@features/build/services';
import { AbilityDataService } from '@features/ability-trees/services';
import { CharacterDataService } from '@features/character/services';
import { fadeInOut } from '@shared/animations/fade';

@Component({
  imports: [
    PinAreaComponent,
    LeftSidenavComponent,
    RightSidenavComponent,
    ErrorComponent,
    ToastComponent,
    PopoverComponent,
    ConfirmPopupComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  animations: [fadeInOut],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class AppComponent {
  isRightSidenavOpen = signal(true);

  readonly shareUrlCopied = signal(false);
  readonly aiPromptCopied = signal(false);

  @ViewChild(LeftSidenavComponent, { read: ElementRef })
  private leftSidenavRef!: ElementRef<HTMLElement>;

  private readonly buildStore = inject(BuildStore);
  private readonly urlShare = inject(UrlShareService);
  private readonly aiPrompt = inject(AiPromptService);
  private readonly abilityData = inject(AbilityDataService);
  private readonly characterData = inject(CharacterDataService);
  private readonly toastService = inject(ToastService);
  readonly popupService = inject(PopupService);

  private readonly dataError = computed(() => {
    const charError = this.characterData.characters.error()?.message ?? null;
    const treesError = this.abilityData.trees.error()?.message ?? null;
    const abilitiesError = this.abilityData.abilities.error()?.message ?? null;
    return charError || treesError || abilitiesError;
  });

  private readonly dataLoading = computed(() => {
    return (
      this.characterData.characters.status() === 'loading' ||
      this.abilityData.trees.status() === 'loading' ||
      this.abilityData.abilities.status() === 'loading'
    );
  });

  readonly isLoading = computed(() => {
    return this.dataLoading() || this.buildStore.initStatus() === 'loading';
  });

  readonly errorMessage = computed(() => {
    if (this.dataError()) return this.dataError();
    if (this.buildStore.initStatus() === 'error') return this.buildStore.initError();
    return null;
  });

  private readonly urlRestoreDone = signal(false);

  constructor() {
    effect(() => {
      const loading = this.dataLoading();
      if (!loading && !this.urlRestoreDone()) {
        this.urlRestoreDone.set(true);
        this.urlShare.restoreFromUrl().then((result) => {
          if ('error' in result && result.error && result.error !== 'no_build') {
            this.toastService.show(result.error, 'error');
          }
          if ('state' in result) {
            this.buildStore.restoreState(result.state);
            this.urlShare.clearBuildParam();
          }
        });
        this.buildStore.initialize();
      }
    });
  }

  loadInitialData = (): void => {
    this.characterData.characters.reload();
    this.abilityData.trees.reload();
    this.abilityData.abilities.reload();
  };

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInsideLeftSidenav = this.leftSidenavRef?.nativeElement.contains(target);
    const clickedInsideOverlay = target.closest('.cdk-overlay-container') !== null;
    if (!clickedInsideLeftSidenav && !clickedInsideOverlay) {
      this.popupService.close();
    }
  }

  onEscape(): void {
    this.popupService.close();
  }

  async onShare(): Promise<void> {
    await copyWithFeedback(
      this.shareUrlCopied,
      () => this.urlShare.copyShareUrl(),
      this.toastService,
    );
  }

  async onCopyAiPrompt(): Promise<void> {
    await copyWithFeedback(
      this.aiPromptCopied,
      () => this.aiPrompt.copyToClipboard(),
      this.toastService,
    );
  }

  onResetConfirm(): void {
    this.buildStore.reset();
    this.popupService.close();
  }
}
