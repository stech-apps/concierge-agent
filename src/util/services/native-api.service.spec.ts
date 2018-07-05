import { TestBed, inject } from '@angular/core/testing';

import { NativeApiService } from './native-api.service';

describe('NativeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeApiService]
    });
  });

  it('should be created', inject([NativeApiService], (service: NativeApiService) => {
    expect(service).toBeTruthy();
  }));
});
