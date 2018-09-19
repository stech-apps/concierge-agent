import { TestBed, inject } from '@angular/core/testing';

import { ServiceStateService } from './service-state.service';

describe('ServiceStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceStateService]
    });
  });

  it('should be created', inject([ServiceStateService], (service: ServiceStateService) => {
    expect(service).toBeTruthy();
  }));
});
