import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';

interface AccessCode {
    Id: number;
    Code: string;
    ClientId: number;
    StartDate: Date | null;
    ExpireDate: Date | null;
    MaxQuantity: number;
    UsedQuantity: number;
    Type: number;
    Active: boolean;
    SurveyUrl: string;
    SurveyPassword: string;
    EmailAddressesToNotify: string;
}

@Injectable()
export class AccessCodeService {

    constructor(private _http: Http) { }

    getAccessCode(code: string): Observable<AccessCode> {
        const searchParams = new URLSearchParams(`code=${code}`);
        return this._http.get('/api/accesscodes', { search: searchParams })
            .map(response => {
                const accessCodes: AccessCode[] = response.json().data;
                if (accessCodes.length) {
                    return accessCodes.shift();
                } else {
                    return null;
                }
            });
    }

    isAccessCodeValid(code: string): Observable<boolean> {
        return this.getAccessCode(code).map(c => {
            if (!c) {
                return false;
            }
            const today = new Date();
            let active = c.Active;
            if (active && c.StartDate) {
                let activeDate = new Date(c.StartDate);
                active = today > activeDate;
            }
            if (active && c.ExpireDate) {
                let expireDate = new Date(c.ExpireDate);
                active = today < expireDate;
            }
            if (active && c.MaxQuantity) {
                active = c.UsedQuantity < c.MaxQuantity;
            }
            return active;
        });
    }
}
