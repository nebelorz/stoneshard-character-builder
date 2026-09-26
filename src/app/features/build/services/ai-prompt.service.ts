import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BuildStore } from './build-store';
import { BonusService, ToastService } from '@shared/services';
import { AbilityDataService } from '@features/ability-trees/services';
import {
  BuildState,
  Character,
  Ability,
  AbilityTree,
  STAT_KEYS,
  DEFAULT_ABILITY_IDS,
} from '@models';

const TEMPLATE_URL = 'assets/ia/prompt_template.md';
const BUILD_DATA_HEADING = '# BUILD DATA';
const EMPTY_TEMPLATE_FALLBACK = '';

interface BonusGroup {
  label: string;
  order: number;
  allocations: string[];
  unallocated: number;
}

@Injectable({ providedIn: 'root' })
export class AiPromptService {
  private readonly http = inject(HttpClient);
  private readonly buildStore = inject(BuildStore);
  private readonly bonusService = inject(BonusService);
  private readonly abilityData = inject(AbilityDataService);
  private readonly toastService = inject(ToastService);

  private readonly _cachedTemplate = signal<string | null>(null);

  async generateCompletePrompt(): Promise<string> {
    const snapshot = this.buildStore.stateSnapshot();
    if (!snapshot || !('characterId' in snapshot)) {
      this.toastService.show('Build is not ready yet', 'warning');
      return '';
    }

    const state = snapshot as BuildState;
    const character = this.buildStore.character();
    const allAbilities = this.abilityData.abilities.value() ?? [];
    const allTrees = this.abilityData.trees.value() ?? [];

    if (!character) return '';

    const template = await this.loadTemplate();
    const abilitySubset = this.buildObtainedAbilitySubset(state, allAbilities);
    const relevantTrees = this.buildRelevantTrees(abilitySubset, allTrees);

    const sections: string[] = [];

    sections.push(this.buildCharacterSection(character, state));
    sections.push(this.buildStatsSection(character, state));
    const bonusSection = this.buildBonusSection(character, state);
    if (bonusSection) {
      sections.push(bonusSection);
    }
    sections.push(this.buildAbilitiesSection(state, allAbilities));
    sections.push(this.buildTreesSection(relevantTrees));

    const notesSection = this.buildNotesSection(state);
    if (notesSection) {
      sections.push(notesSection);
    }

    return template + '\n\n' + sections.join('\n\n');
  }

  async copyToClipboard(): Promise<boolean> {
    try {
      const prompt = await this.generateCompletePrompt();
      if (!prompt) return false;
      await navigator.clipboard.writeText(prompt);
      return true;
    } catch {
      return false;
    }
  }

  async loadTemplate(): Promise<string> {
    const cached = this._cachedTemplate();
    if (cached !== null) return cached;

    try {
      const raw = await firstValueFrom(this.http.get(TEMPLATE_URL, { responseType: 'text' }));
      const trimmed = this.trimTemplate(raw);
      this._cachedTemplate.set(trimmed);
      return trimmed;
    } catch {
      this._cachedTemplate.set(EMPTY_TEMPLATE_FALLBACK);
      return EMPTY_TEMPLATE_FALLBACK;
    }
  }

  trimTemplate(raw: string): string {
    const headingIndex = raw.indexOf(BUILD_DATA_HEADING);
    if (headingIndex === -1) return raw;
    return raw.substring(0, headingIndex).trimEnd();
  }

  buildObtainedAbilitySubset(state: BuildState, allAbilities: Ability[]): Ability[] {
    return this.buildCombinedAbilityList(state, allAbilities);
  }

  buildCombinedAbilityList(state: BuildState, allAbilities: Ability[]): Ability[] {
    const abilityMap = new Map(allAbilities.map((a) => [a.id, a]));
    const combined: Ability[] = [];
    const includedIds = new Set<string>();

    for (const id of DEFAULT_ABILITY_IDS) {
      const ability = abilityMap.get(id);
      if (ability && !includedIds.has(id)) {
        combined.push(ability);
        includedIds.add(id);
      }
    }

    const obtained = [...state.obtainedAbilities].sort((a, b) => a.order - b.order);
    for (const entry of obtained) {
      const ability = abilityMap.get(entry.abilityId);
      if (ability && !includedIds.has(entry.abilityId)) {
        combined.push(ability);
        includedIds.add(entry.abilityId);
      }
    }

    return combined;
  }

  buildRelevantTrees(abilitySubset: Ability[], allTrees: AbilityTree[]): AbilityTree[] {
    const treeIds = new Set(abilitySubset.map((a) => a.treeId));
    return allTrees.filter((t) => treeIds.has(t.id));
  }

  sanitizeTableCell(value: string): string {
    return value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  }

  formatAbility(ability: Ability, order: number): string {
    const isPassive = ability.type === 'passive';
    const energy = isPassive ? '-' : String(ability.energy);
    const cooldown = isPassive ? '-' : ability.cooldown;
    const range = isPassive ? '-' : ability.range;
    const scalesWith = isPassive ? '-' : ability.modifiedByLabel;
    const description = this.sanitizeTableCell(ability.description);
    return `| ${order} | ${ability.name} | ${ability.type} | ${energy} | ${cooldown} | ${range} | ${scalesWith} | ${description} |`;
  }

  private buildCharacterSection(character: Character, state: BuildState): string {
    const trait = this.sanitizeTableCell(
      `${character.trait.name} - ${character.trait.description}`,
    );
    const lines = [
      '## Character',
      '',
      '| Name | Title | Race | Trait | Level |',
      '| ---- | ----- | ---- | ----- | ----- |',
      `| ${character.name} | ${character.title} | ${character.race} | ${trait} | ${state.level} |`,
    ];
    return lines.join('\n');
  }

  private buildStatsSection(character: Character, state: BuildState): string {
    const lines = [
      '## Stats',
      '',
      '| STR | AGI | PER | VIT | WIL |',
      '| --- | --- | --- | --- | --- |',
    ];

    const values = STAT_KEYS.map((stat) => {
      const base = character.baseStats[stat];
      const route = state.stats[stat] ?? base;
      const current = route + this.bonusService.bonusCount(state, stat);
      const allocated = current - base;
      return allocated > 0 ? `${current} (${base}+${allocated})` : `${current}`;
    });

    lines.push(`| ${values.join(' | ')} |`);
    return lines.join('\n');
  }

  private sourceLabel(
    sourceId: string,
    character: Character | null,
  ): { label: string; kind: 'quest' | 'trait' } {
    const quest = this.bonusService.findQuest(sourceId);
    if (quest) return { label: `Quest - ${quest.label}`, kind: 'quest' };
    const gain = character ? this.bonusService.findTraitGain(character, sourceId) : null;
    if (gain) return { label: `Trait - ${gain.label}`, kind: 'trait' };
    return { label: sourceId, kind: 'trait' };
  }

  buildBonusSection(character: Character | null, state: BuildState): string | null {
    if (state.bonusSlots.length === 0) return null;

    const groups = new Map<string, BonusGroup>();
    for (const slot of state.bonusSlots) {
      const { label, kind } = this.sourceLabel(slot.sourceId, character);
      let group = groups.get(slot.sourceId);
      if (!group) {
        group = { label, order: kind === 'quest' ? 0 : 1, allocations: [], unallocated: 0 };
        groups.set(slot.sourceId, group);
      }
      if (slot.stat) {
        group.allocations.push(`+1 ${slot.stat}`);
      } else {
        group.unallocated++;
      }
    }

    const rows = [...groups.values()].filter((g) => g.allocations.length > 0 || g.unallocated > 0);
    if (rows.length === 0) return null;

    const lines = ['## Bonus Points', '', '| Source | Allocation |', '| ------ | ---------- |'];
    rows.sort((a, b) => a.order - b.order);
    for (const group of rows) {
      const parts = [...group.allocations];
      if (group.unallocated > 0) {
        parts.push(`${group.unallocated} unallocated`);
      }
      lines.push(`| ${this.sanitizeTableCell(group.label)} | ${parts.join(', ')} |`);
    }
    return lines.join('\n');
  }

  buildAbilitiesSection(state: BuildState, allAbilities: Ability[]): string {
    const lines = ['## Abilities', ''];

    const combined = this.buildCombinedAbilityList(state, allAbilities);

    if (combined.length === 0) {
      lines.push('_No abilities obtained._');
      return lines.join('\n');
    }

    lines.push('| # | Ability | Type | Energy | Cooldown | Range | Scales with | Effect |');
    lines.push('| - | ------- | ---- | ------ | -------- | ----- | ----------- | ------ |');

    combined.forEach((ability, index) => {
      lines.push(this.formatAbility(ability, index + 1));
    });

    return lines.join('\n');
  }

  private buildTreesSection(trees: AbilityTree[]): string {
    const lines = ['## Relevant Trees', ''];

    if (trees.length === 0) {
      lines.push('_No relevant trees._');
      return lines.join('\n');
    }

    lines.push('| Tree | Category | Focus | Crit Effect |');
    lines.push('| ---- | -------- | ----- | ----------- |');

    for (const tree of trees) {
      lines.push(
        `| ${tree.name} | ${tree.category} | ${tree.focus} | ${this.sanitizeTableCell(tree.critEffect)} |`,
      );
    }

    return lines.join('\n');
  }

  private buildNotesSection(state: BuildState): string | null {
    const { buildName, author, content } = state.notes;
    if (!buildName && !author && !content) return null;

    const lines = [
      '## Notes',
      '',
      'The user provides these notes and insights about this character build:',
      '',
    ];

    if (buildName) lines.push(`**Build Name:** ${buildName}`);
    if (author) lines.push(`**Author:** ${author}`);
    if (content) lines.push(content);

    return lines.join('\n');
  }
}
