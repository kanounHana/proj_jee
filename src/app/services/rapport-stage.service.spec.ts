import { TestBed } from '@angular/core/testing';

import { RapportStageService } from './rapport-stage.service';

describe('RapportStageService', () => {
  let service: RapportStageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RapportStageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
