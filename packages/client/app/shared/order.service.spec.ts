/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrderService } from './order.service';

xdescribe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderService]
    });
  });

  it('should ...', inject([OrderService], (service: OrderService) => {
    expect(service).toBeTruthy();
  }));
});
