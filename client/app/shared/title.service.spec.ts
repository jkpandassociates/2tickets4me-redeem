/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TitleService } from './title.service';

xdescribe('TitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleService]
    });
  });

  it('should ...', inject([TitleService], (service: TitleService) => {
    expect(service).toBeTruthy();
  }));
});
