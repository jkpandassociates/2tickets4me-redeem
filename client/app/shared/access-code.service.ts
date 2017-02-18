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
                return (accessCodes.length) ? accessCodes.shift() : null;
            });
    }

    validate(code: string): Observable<boolean> {
        const searchParams = new URLSearchParams(`code=${code}`);
        return this._http.get('/api/accesscodes/validate', { search: searchParams })
            .map(response => {
                const data = response.json().data;
                return data.valid;
            });
    }
}
