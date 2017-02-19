/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccessGuardService } from './access-guard.service';

xdescribe('AccessGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessGuardService]
    });
  });

  it('should ...', inject([AccessGuardService], (service: AccessGuardService) => {
    expect(service).toBeTruthy();
  }));
});
