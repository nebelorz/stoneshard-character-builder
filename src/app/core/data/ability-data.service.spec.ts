import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AbilityDataService } from './ability-data.service';

const RAW_ABILITY = {
  id: 'warfare-1',
  name: 'War Cry',
  treeId: 'warfare',
  x: 0,
  y: 0,
  type: 'attack',
  target: 'No Target',
  range: 1,
  energy: 10,
  cooldown: 12,
  modifiedByLabel: 'STR',
  requires: [],
  unlockConditions: [],
  description: 'Grants {+5}% Crit Chance and {+15 + 2 * AGL}% Weapon Damage.',
  requiredBy: ['warfare-2'],
};

describe('AbilityDataService', () => {
  let service: AbilityDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AbilityDataService);
    httpMock = TestBed.inject(HttpTestingController);
    TestBed.tick();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('surfaces a trees load failure through the resource error state', async () => {
    httpMock
      .expectOne('assets/data/trees.json')
      .flush('boom', { status: 500, statusText: 'Server Error' });
    httpMock.expectOne('assets/data/abilities.json').flush({ abilities: [] });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.trees.error()).toBeTruthy();
  });

  it('surfaces an abilities load failure through the resource error state', async () => {
    httpMock.expectOne('assets/data/trees.json').flush({ trees: [] });
    httpMock
      .expectOne('assets/data/abilities.json')
      .flush('boom', { status: 500, statusText: 'Server Error' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.abilities.error()).toBeTruthy();
  });

  it('derives the plain description and token stream from the canonical source', async () => {
    httpMock.expectOne('assets/data/trees.json').flush({ trees: [] });
    httpMock.expectOne('assets/data/abilities.json').flush({ abilities: [RAW_ABILITY] });
    await TestBed.inject(ApplicationRef).whenStable();

    const ability = service.abilities.value()?.[0];
    expect(ability?.description).toBe('Grants +5% Crit Chance and +(15 + 2 * AGL)% Weapon Damage.');
    expect(ability?.descriptionLines[0]).toEqual({
      kind: 'paragraph',
      nodes: [
        { kind: 'text', text: 'Grants ' },
        { kind: 'modifier', expression: '+5', sign: 'pos' },
        { kind: 'text', text: '% Crit Chance and ' },
        { kind: 'modifier', expression: '+15 + 2 * AGL', sign: 'pos' },
        { kind: 'text', text: '% Weapon Damage.' },
      ],
    });
  });

  it('rejects a malformed canonical description at load', async () => {
    httpMock.expectOne('assets/data/trees.json').flush({ trees: [] });
    httpMock
      .expectOne('assets/data/abilities.json')
      .flush({ abilities: [{ ...RAW_ABILITY, description: 'Grants {+5% Crit Chance.' }] });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.abilities.error()).toBeTruthy();
  });
});
