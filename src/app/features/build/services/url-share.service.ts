import { Injectable, inject } from '@angular/core';
import { BuildState, BonusSlot, Character, isStatKey } from '@models';
import { CharacterDataService } from '@features/character/services';
import { AbilityDataService } from '@features/ability-trees/services';
import { BuildStore } from './build-store';
import { BonusService, ToastService } from '@shared/services';

const MIN_LEVEL = 1;
const MAX_LEVEL = 30;

function compress(plaintext: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(data);
  writer.close();

  return new Response(cs.readable).arrayBuffer().then((buf) => {
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  });
}

function decompress(base64url: string): Promise<string> {
  let b64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) {
    b64 += '=';
  }

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();

  return new Response(ds.readable).arrayBuffer().then((buf) => {
    return new TextDecoder().decode(buf);
  });
}

@Injectable({ providedIn: 'root' })
export class UrlShareService {
  private readonly buildStore = inject(BuildStore);
  private readonly toastService = inject(ToastService);
  private readonly characterData = inject(CharacterDataService);
  private readonly abilityData = inject(AbilityDataService);
  private readonly bonusService = inject(BonusService);

  async generateShareUrl(): Promise<string | null> {
    const state = this.buildStore.stateSnapshot();
    if (!state || !('characterId' in state)) {
      this.toastService.show('Build is not ready yet', 'warning');
      return null;
    }
    const json = JSON.stringify(state);
    const compressed = await compress(json);
    const base = window.location.origin + window.location.pathname;
    return `${base}?build=${compressed}`;
  }

  async copyShareUrl(): Promise<boolean> {
    try {
      const url = await this.generateShareUrl();
      if (!url) return false;
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }

  async restoreFromUrl(): Promise<{ state: BuildState } | { error: string }> {
    try {
      const params = new URLSearchParams(window.location.search);
      const buildParam = params.get('build');
      if (!buildParam) return { error: 'no_build' };

      const json = await decompress(buildParam);
      const parsed = JSON.parse(json) as Record<string, unknown>;

      if (!this.isValidBuildState(parsed, this.characterData.characters.value())) {
        return { error: 'Could not restore build from URL, starting fresh' };
      }

      const state = this.normalizeBuildState(parsed);

      return { state };
    } catch {
      return { error: 'Could not restore build from URL, starting fresh' };
    }
  }

  clearBuildParam(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('build');
    window.history.replaceState({}, '', url.toString());
  }

  private isValidBuildState(
    state: unknown,
    characters: readonly Character[] | undefined,
  ): state is BuildState {
    if (typeof state !== 'object' || state === null) return false;
    const s = state as Record<string, unknown>;
    if (
      typeof s['characterId'] !== 'string' ||
      typeof s['level'] !== 'number' ||
      typeof s['ap'] !== 'number' ||
      typeof s['sp'] !== 'number' ||
      typeof s['stats'] !== 'object' ||
      s['stats'] === null ||
      !Array.isArray(s['obtainedAbilities']) ||
      !Array.isArray(s['pinnedTrees']) ||
      (s['statHistory'] !== undefined && !Array.isArray(s['statHistory'])) ||
      (s['bonusSlots'] !== undefined && s['bonusSlots'] !== null && !Array.isArray(s['bonusSlots']))
    ) {
      return false;
    }

    if (s['notes'] !== undefined && s['notes'] !== null) {
      if (typeof s['notes'] !== 'object') return false;
      const notes = s['notes'] as Record<string, unknown>;
      if (
        (notes['buildName'] !== undefined && typeof notes['buildName'] !== 'string') ||
        (notes['author'] !== undefined && typeof notes['author'] !== 'string') ||
        (notes['content'] !== undefined && typeof notes['content'] !== 'string')
      ) {
        return false;
      }
    }

    const loadedCharacters = characters ?? [];
    if (!loadedCharacters.some((c) => c.id === s['characterId'])) return false;

    const level = s['level'] as number;
    if (!Number.isInteger(level) || level < MIN_LEVEL || level > MAX_LEVEL) return false;

    return true;
  }

  private normalizeBuildState(parsed: Record<string, unknown>): BuildState {
    const characters = this.characterData.characters.value() ?? [];
    const character = characters.find((c) => c.id === parsed['characterId']) ?? null;

    const rawSlots: unknown[] = Array.isArray(parsed['bonusSlots'])
      ? [...(parsed['bonusSlots'] as unknown[])]
      : [];

    const legacyStat = parsed['boulderCircleStat'];
    if (isStatKey(legacyStat)) {
      rawSlots.push({ sourceId: 'boulder-circle', index: 0, stat: legacyStat });
    }

    const sanitized = this.bonusService.sanitizeBonusSlots(rawSlots, character);
    const bonusSlots: readonly BonusSlot[] = sanitized === 'invalid' ? [] : sanitized;

    const obtainedAbilities = parsed['obtainedAbilities'] as BuildState['obtainedAbilities'];
    const derivedFloor = this.bonusService.derivedFloor(
      character,
      obtainedAbilities,
      this.abilityData.abilities.value() ?? [],
    );

    return {
      ...(parsed as unknown as BuildState),
      ap: Math.max(parsed['ap'] as number, derivedFloor),
      bonusSlots,
      notes: (parsed['notes'] as BuildState['notes']) ?? {
        buildName: '',
        author: '',
        content: '',
      },
    };
  }
}
