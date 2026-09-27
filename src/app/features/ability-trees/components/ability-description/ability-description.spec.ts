import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionLine } from '@models';
import { AbilityDescriptionComponent } from './ability-description';

describe('AbilityDescriptionComponent', () => {
  let fixture: ComponentFixture<AbilityDescriptionComponent>;

  function setup(lines: readonly DescriptionLine[]): HTMLElement {
    TestBed.configureTestingModule({ imports: [AbilityDescriptionComponent] });
    fixture = TestBed.createComponent(AbilityDescriptionComponent);
    fixture.componentRef.setInput('lines', lines);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a paragraph as a row of text, modifier and effect spans', () => {
    const host = setup([
      {
        kind: 'paragraph',
        nodes: [
          { kind: 'text', text: 'Grants ' },
          { kind: 'modifier', expression: '+5', sign: 'pos' },
          { kind: 'text', text: '% Crit Chance to ' },
          { kind: 'effect', name: 'Fencer Stance' },
          { kind: 'text', text: '.' },
        ],
      },
    ]);

    const lines = host.querySelectorAll('.ability-description__line');
    expect(lines).toHaveLength(1);
    expect(lines[0].classList.contains('ability-description__line--bullet')).toBe(false);
    expect(host.querySelectorAll('.ability-description__text')).toHaveLength(3);
    expect(host.querySelector('.ability-description__modifier')?.textContent).toBe('+5%');
    expect(host.querySelector('.ability-description__effect')?.textContent).toBe('"Fencer Stance"');
  });

  it('includes the trailing percentage inside the modifier colour span', () => {
    const host = setup([
      {
        kind: 'paragraph',
        nodes: [
          { kind: 'modifier', expression: '+15 + 2 * AGL', sign: 'pos' },
          { kind: 'text', text: '% Weapon Damage' },
          { kind: 'modifier', expression: '-5', sign: 'neg' },
          { kind: 'text', text: '% Accuracy' },
        ],
      },
    ]);

    const modifiers = host.querySelectorAll('.ability-description__modifier');
    expect(modifiers).toHaveLength(2);
    expect(modifiers[0].textContent).toBe('+15 + 2 * AGL%');
    expect(modifiers[1].textContent).toBe('-5%');
    const textSpans = [...host.querySelectorAll('.ability-description__text')];
    expect(textSpans.map((span) => span.textContent)).toEqual([' Weapon Damage', ' Accuracy']);
  });

  it('renders bullet lines with a marker row each', () => {
    const host = setup([
      { kind: 'paragraph', nodes: [{ kind: 'text', text: 'Grants:' }] },
      { kind: 'bullet', nodes: [{ kind: 'modifier', expression: '+5', sign: 'pos' }] },
      { kind: 'bullet', nodes: [{ kind: 'modifier', expression: '-3', sign: 'neg' }] },
    ]);

    expect(host.querySelectorAll('.ability-description__line--bullet')).toHaveLength(2);
    expect(host.querySelectorAll('.ability-description__marker')).toHaveLength(2);
  });

  it('applies a themed colour class per modifier classification', () => {
    const host = setup([
      {
        kind: 'paragraph',
        nodes: [
          { kind: 'modifier', expression: '+5', sign: 'pos' },
          { kind: 'modifier', expression: '-5', sign: 'neg' },
          { kind: 'modifier', expression: 'WIL * 2', sign: 'neutral' },
        ],
      },
    ]);

    expect(host.querySelector('.ability-description__modifier--pos')).not.toBeNull();
    expect(host.querySelector('.ability-description__modifier--neg')).not.toBeNull();
    expect(host.querySelector('.ability-description__modifier--neutral')).not.toBeNull();
  });

  it('renders engine variables through the display lexicon', () => {
    const host = setup([
      {
        kind: 'paragraph',
        nodes: [{ kind: 'modifier', expression: 'max_hp / 100', sign: 'neutral' }],
      },
    ]);

    expect(host.querySelector('.ability-description__modifier')?.textContent).toBe(
      'Max Health / 100',
    );
  });
});
