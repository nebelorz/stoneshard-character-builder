import {
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  inject,
  effect,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import {
  Ability,
  BuildState,
  DEFAULT_ABILITY_IDS,
  parseRequirements,
  meetsRequirements,
} from '@models';
import { BuildStore } from '@core/state';
import { AbilityDataService } from '@core/data';
import { AbilityHoverService } from '@shared/services';
import { AbilityDescriptionComponent } from '../ability-description/ability-description';

type AbilityIconState = 'locked' | 'unlocked' | 'obtained';

interface ResolvedParent {
  ability: Ability;
  iconPath: string;
}

interface ResolvedRequirementGroup {
  alternatives: ResolvedParent[];
}

type ScalingStatKey = 'str' | 'agi' | 'per' | 'vit' | 'wil';

type ScalingTokenKind = 'stat' | 'neutral' | 'plain';

interface ScalingToken {
  readonly label: string;
  readonly kind: ScalingTokenKind;
  readonly statKey: ScalingStatKey | null;
}

const CORE_STAT_KEYS: Readonly<Record<string, ScalingStatKey>> = {
  strength: 'str',
  str: 'str',
  agility: 'agi',
  agi: 'agi',
  perception: 'per',
  per: 'per',
  vitality: 'vit',
  vit: 'vit',
  willpower: 'wil',
  wil: 'wil',
};

const NEUTRAL_SCALING_TERMS: ReadonlySet<string> = new Set([
  'arcanistic power',
  'backfire chance',
  'block chance',
  'block power',
  'bonus range',
  'dodge chance',
  'electromantic power',
  'geomantic power',
  'knockback chance',
  'magic power',
  'main hand efficiency',
  'miracle chance',
  'miracle potency',
  'off-hand efficiency',
  'pyromantic power',
]);

function classifyScalingTerm(term: string): ScalingToken {
  const key = term.toLowerCase();
  const statKey = CORE_STAT_KEYS[key];
  if (statKey) {
    return { label: term, kind: 'stat', statKey };
  }
  if (NEUTRAL_SCALING_TERMS.has(key)) {
    return { label: term, kind: 'neutral', statKey: null };
  }
  return { label: term, kind: 'plain', statKey: null };
}

@Component({
  selector: 'app-ability-icon',
  templateUrl: './ability-icon.html',
  styleUrl: './ability-icon.scss',
  imports: [AbilityDescriptionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbilityIconComponent implements OnDestroy, AfterViewInit {
  ability = input.required<Ability>();
  treeId = input('');

  obtain = output<string>();
  refund = output<string>();

  @ViewChild('iconWrapper', { static: true }) iconWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('tooltip') tooltipRef!: ElementRef<HTMLDivElement>;
  @ViewChild('tooltipBody') tooltipBodyRef?: ElementRef<HTMLDivElement>;

  state = signal<AbilityIconState>('locked');
  obtainedLevel = signal(0);
  defaultActive = signal(false);
  tooltipVisible = signal(false);
  tooltipScrollable = signal(false);
  tooltipX = signal(0);
  tooltipY = signal(0);
  tooltipPosition = signal<'right' | 'left'>('right');
  resolvedRequirementGroups = signal<ResolvedRequirementGroup[]>([]);
  tooltipId = computed(() => `ability-tooltip-${this.ability().id}`);
  scalingTokens = computed<ScalingToken[]>(() => {
    const label = this.ability().modifiedByLabel;
    if (!label) {
      return [];
    }
    return label
      .split(',')
      .map((term) => term.trim())
      .filter((term) => term !== '')
      .map((term) => classifyScalingTerm(term));
  });

  private allAbilities: Ability[] = [];
  private tooltipAttachedToBody = false;
  private rafId: number | null = null;
  private showTimer: number | null = null;
  private hideTimer: number | null = null;
  private readonly showDelay = 120;
  private readonly hideDelay = 60;

  private readonly buildStore = inject(BuildStore);
  private readonly abilityData = inject(AbilityDataService);
  private readonly hoverService = inject(AbilityHoverService);

  protected readonly isObtained = computed(() => this.state() === 'obtained');
  protected readonly isLocked = computed(() => this.state() === 'locked');
  protected readonly isUnlocked = computed(() => this.state() === 'unlocked');
  protected readonly isDefaultActive = computed(() => this.defaultActive());
  protected readonly isHighlighted = computed(
    () => this.hoverService.hoveredAbilityId() === this.ability().id,
  );

  private readonly stateEffect = effect(() => {
    const state = this.buildStore.state();
    if (state) {
      this.updateState(state);
    }
  });

  private readonly loadAbilitiesEffect = effect(() => {
    const abilities = this.abilityData.abilities.value();
    if (abilities) {
      this.allAbilities = abilities;
      this.resolveParents();
    }
  });

  private readonly activeTooltipEffect = effect(() => {
    const activeId = this.hoverService.activeTooltipId();
    if (activeId !== this.ability().id && this.tooltipVisible()) {
      this.hideNow();
    }
  });

  ngAfterViewInit(): void {
    if (this.tooltipRef) {
      this.moveTooltipToBody();
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.cancelShow();
    this.cancelHide();
    if (this.hoverService.activeTooltipId() === this.ability().id) {
      this.hoverService.setActiveTooltip(null);
    }
    this.removeTooltipFromBody();
  }

  get iconPath(): string {
    return this.buildIconPath(this.ability(), this.treeId());
  }

  onMouseEnter(): void {
    this.cancelHide();
    this.hoverService.setActiveTooltip(this.ability().id);
    if (this.tooltipVisible()) {
      this.moveTooltipToBody();
      this.updateTooltipPosition();
      this.refreshOverflowState();
      return;
    }
    this.scheduleShow();
  }

  onFocus(): void {
    this.cancelHide();
    this.hoverService.setActiveTooltip(this.ability().id);
    this.showNow();
  }

  onMouseMove(): void {
    if (this.tooltipVisible() && this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.updateTooltipPosition();
      });
    }
  }

  onMouseLeave(): void {
    this.cancelShow();
    this.scheduleHide();
  }

  onTooltipFocusIn(): void {
    this.cancelHide();
  }

  onTooltipFocusOut(): void {
    this.scheduleHide();
  }

  onEscape(): void {
    const active = document.activeElement;
    if (active instanceof HTMLElement && this.tooltipRef?.nativeElement.contains(active)) {
      active.blur();
    }
    this.hideNow();
  }

  onClick(event: Event): void {
    event.preventDefault();
    if (this.state() === 'unlocked') {
      this.obtain.emit(this.ability().id);
    }
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    if (this.state() === 'obtained' && !this.defaultActive()) {
      this.refund.emit(this.ability().id);
    }
  }

  onWheel(event: WheelEvent): void {
    if (!this.tooltipVisible()) {
      return;
    }
    const body = this.tooltipBodyRef?.nativeElement;
    if (body && body.scrollHeight > body.clientHeight + 1) {
      body.scrollTop += event.deltaY;
    }
    event.preventDefault();
  }

  buildIconPath(ability: Ability, treeId: string): string {
    const iconFileName = ability.name.replace(/ /g, '_');
    return `assets/icons/${treeId}/${iconFileName}.png`;
  }

  private moveTooltipToBody(): void {
    if (!this.tooltipRef || this.tooltipAttachedToBody) {
      return;
    }
    const tooltipEl = this.tooltipRef.nativeElement;
    document.body.appendChild(tooltipEl);
    this.tooltipAttachedToBody = true;
  }

  private removeTooltipFromBody(): void {
    if (!this.tooltipAttachedToBody || !this.tooltipRef) {
      return;
    }
    const tooltipEl = this.tooltipRef.nativeElement;
    tooltipEl.remove();
    this.tooltipAttachedToBody = false;
  }

  private scheduleShow(): void {
    this.cancelShow();
    this.showTimer = window.setTimeout(() => {
      this.showTimer = null;
      if (this.hoverService.activeTooltipId() === this.ability().id) {
        this.showNow();
      }
    }, this.showDelay);
  }

  private cancelShow(): void {
    if (this.showTimer !== null) {
      window.clearTimeout(this.showTimer);
      this.showTimer = null;
    }
  }

  private showNow(): void {
    this.cancelShow();
    this.tooltipVisible.set(true);
    this.moveTooltipToBody();
    this.updateTooltipPosition();
    this.refreshOverflowState();
  }

  private scheduleHide(): void {
    this.cancelHide();
    this.hideTimer = window.setTimeout(() => {
      this.hideTimer = null;
      this.hideNow();
    }, this.hideDelay);
  }

  private cancelHide(): void {
    if (this.hideTimer !== null) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private hideNow(): void {
    this.cancelHide();
    this.tooltipVisible.set(false);
    if (this.hoverService.activeTooltipId() === this.ability().id) {
      this.hoverService.setActiveTooltip(null);
    }
  }

  private refreshOverflowState(): void {
    const body = this.tooltipBodyRef?.nativeElement;
    if (!body) {
      return;
    }
    this.tooltipScrollable.set(body.scrollHeight > body.clientHeight + 1);
  }

  private updateState(state: BuildState): void {
    const obtained = state.obtainedAbilities.find((a) => a.abilityId === this.ability().id);
    this.defaultActive.set(!obtained && DEFAULT_ABILITY_IDS.includes(this.ability().id));
    if (obtained || this.defaultActive()) {
      this.state.set('obtained');
      this.obtainedLevel.set(obtained?.level ?? 0);
      return;
    }

    const obtainedIds = new Set(state.obtainedAbilities.map((a) => a.abilityId));
    for (const id of DEFAULT_ABILITY_IDS) obtainedIds.add(id);
    const requirementsMet = meetsRequirements(
      parseRequirements(this.ability().requires),
      obtainedIds,
    );
    this.state.set(requirementsMet ? 'unlocked' : 'locked');
  }

  private resolveParents(): void {
    const requirements = parseRequirements(this.ability().requires);
    const groups: ResolvedRequirementGroup[] = [];

    for (const group of requirements) {
      const resolvedAlternatives: ResolvedParent[] = [];
      for (const id of group.alternatives) {
        const parentAbility = this.allAbilities.find((a) => a.id === id);
        if (parentAbility) {
          resolvedAlternatives.push({
            ability: parentAbility,
            iconPath: this.buildIconPath(parentAbility, this.treeId()),
          });
        }
      }
      if (resolvedAlternatives.length > 0) {
        groups.push({ alternatives: resolvedAlternatives });
      }
    }

    this.resolvedRequirementGroups.set(groups);
  }

  private updateTooltipPosition(): void {
    if (!this.tooltipAttachedToBody) {
      return;
    }

    const iconRect = this.iconWrapper.nativeElement.getBoundingClientRect();
    const tooltipEl = this.tooltipRef.nativeElement;
    const tooltipWidth = tooltipEl.offsetWidth || 280;
    const tooltipHeight = tooltipEl.offsetHeight || 200;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const offset = 12;

    let targetX = iconRect.right + offset;
    let targetY = iconRect.top + iconRect.height / 2 - tooltipHeight / 2;

    if (targetX + tooltipWidth > viewportWidth - 8) {
      this.tooltipPosition.set('left');
      targetX = iconRect.left - tooltipWidth - offset;
    } else {
      this.tooltipPosition.set('right');
    }

    if (targetY < 8) {
      targetY = 8;
    } else if (targetY + tooltipHeight > viewportHeight - 8) {
      targetY = viewportHeight - tooltipHeight - 8;
    }

    if (targetX < 8) {
      targetX = 8;
    }

    this.tooltipX.set(targetX);
    this.tooltipY.set(targetY);
    this.refreshOverflowState();
  }

  trackByGroup(_index: number, group: ResolvedRequirementGroup): string {
    return group.alternatives.map((a) => a.ability.id).join('|');
  }

  trackByParent(_index: number, parent: ResolvedParent): string {
    return parent.ability.id;
  }

  trackByCondition(_index: number, condition: string): string {
    return condition;
  }
}
