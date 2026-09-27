import { Component, computed, input } from '@angular/core';
import { DescriptionLine, DescriptionNode, ModifierSign, formatModifierExpression } from '@models';

interface DescriptionTextNodeView {
  readonly kind: 'text';
  readonly text: string;
}

interface DescriptionEffectNodeView {
  readonly kind: 'effect';
  readonly name: string;
}

interface DescriptionModifierNodeView {
  readonly kind: 'modifier';
  readonly text: string;
  readonly sign: ModifierSign;
}

type DescriptionNodeView =
  DescriptionTextNodeView | DescriptionEffectNodeView | DescriptionModifierNodeView;

interface DescriptionLineView {
  readonly kind: 'paragraph' | 'bullet';
  readonly nodes: readonly DescriptionNodeView[];
}

function buildNodeViews(nodes: readonly DescriptionNode[]): DescriptionNodeView[] {
  const views: DescriptionNodeView[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.kind !== 'modifier') {
      views.push(node);
      continue;
    }
    const formatted = formatModifierExpression(node.expression);
    const next = nodes[i + 1];
    if (next?.kind === 'text' && next.text.startsWith('%')) {
      views.push({ kind: 'modifier', text: `${formatted}%`, sign: node.sign });
      const rest = next.text.slice(1);
      if (rest !== '') {
        views.push({ kind: 'text', text: rest });
      }
      i++;
      continue;
    }
    views.push({ kind: 'modifier', text: formatted, sign: node.sign });
  }
  return views;
}

@Component({
  selector: 'app-ability-description',
  templateUrl: './ability-description.html',
  styleUrl: './ability-description.scss',
})
export class AbilityDescriptionComponent {
  readonly lines = input.required<readonly DescriptionLine[]>();

  protected readonly renderLines = computed<readonly DescriptionLineView[]>(() =>
    this.lines().map((line) => ({ kind: line.kind, nodes: buildNodeViews(line.nodes) })),
  );
}
