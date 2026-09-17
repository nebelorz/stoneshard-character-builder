interface RequirementGroup {
  alternatives: string[];
}

type Requirements = RequirementGroup[];

export function parseRequirements(requires: readonly string[]): Requirements {
  return requires.map((entry) => ({
    alternatives: entry.split('|'),
  }));
}

export function meetsRequirements(
  requirements: Requirements,
  obtainedIds: Set<string> | string[],
): boolean {
  const set = obtainedIds instanceof Set ? obtainedIds : new Set(obtainedIds);
  return requirements.every((group) => group.alternatives.some((id) => set.has(id)));
}
