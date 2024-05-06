import { TestBed } from '@angular/core/testing';

import { AvaFrontAPIService } from './ava-front-api.service';

describe('AvaFrontAPIService', () => {
  let service: AvaFrontAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvaFrontAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
