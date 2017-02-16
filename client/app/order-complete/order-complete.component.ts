import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrderService } from '../shared/order.service';

@Component({
    selector: 'tix-order-complete',
    templateUrl: './order-complete.component.html',
    styleUrls: ['./order-complete.component.scss']
})
export class OrderCompleteComponent implements OnInit {

    constructor(private _route: ActivatedRoute, private _order: OrderService) { }

    serialNumber: string;
    order: Order;

    regCardImage: string;

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.serialNumber = params['serial'];

            this._order.getOrder(this.serialNumber).subscribe(order => {
                this.order = order;
                this.regCardImage = `/api/orders/${order.SerialNumber}/regcard.png`;
            }, (error) => {
                // error occurred.
            });

        });
    }

}
