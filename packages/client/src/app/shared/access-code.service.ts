import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

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
  constructor(private _http: Http) {}

  getAccessCode(code: string): Observable<AccessCode> {
    const options = { params: new HttpParams().set('code', code) };
    return this._http.get('/api/accesscodes', options).pipe(
      map((response) => {
        const accessCodes: AccessCode[] = response.json().data;
        return accessCodes.length ? accessCodes.shift() : null;
      })
    );
  }

  validate(code: string): Observable<boolean> {
    const options = { params: new HttpParams().set('code', code) };
    return this._http.get('/api/accesscodes/validate', options).pipe(
      map((response) => {
        const data = response.json().data;
        return data.valid;
      })
    );
  }
}
