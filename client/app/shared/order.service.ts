import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class OrderService {

    constructor(private _http: Http) { }

    createOrder(order: Order) {
        return this._http.post('/api/orders', order)
            .map(response => response.json().data as Order)
            .catch(this._handleError);
    }

    private _handleError(error: any) {
        return Observable.throw(error);
    }

}