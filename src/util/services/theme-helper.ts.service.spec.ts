import { TestBed, inject } from '@angular/core/testing';

import { ThemeHelper.TsService } from './theme-helper.ts.service';

describe('ThemeHelper.TsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeHelper.TsService]
    });
  });

  it('should be created', inject([ThemeHelper.TsService], (service: ThemeHelper.TsService) => {
    expect(service).toBeTruthy();
  }));
});
