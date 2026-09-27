import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AbilityDataService } from './ability-data.service';

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
});
