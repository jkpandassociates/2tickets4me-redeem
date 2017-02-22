/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccessGuard } from './access-guard.service';

xdescribe('AccessGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessGuard]
    });
  });

  it('should ...', inject([AccessGuard], (service: AccessGuard) => {
    expect(service).toBeTruthy();
  }));
});
