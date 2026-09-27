import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { QuestDataService } from './quest-data.service';

describe('QuestDataService', () => {
  let service: QuestDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(QuestDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('surfaces a quests load failure through the resource error state', async () => {
    service.quests.reload();
    TestBed.tick();

    httpMock
      .expectOne('assets/data/quests.json')
      .flush('boom', { status: 500, statusText: 'Server Error' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.quests.error()).toBeTruthy();
  });
});
