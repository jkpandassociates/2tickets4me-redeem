/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccessCodeService } from './access-code.service';

describe('AccessCodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessCodeService]
    });
  });

  it('should ...', inject([AccessCodeService], (service: AccessCodeService) => {
    expect(service).toBeTruthy();
  }));
});
