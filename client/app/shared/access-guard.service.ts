import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AccessCodeService } from './access-code.service';

@Injectable()
export class AccessGuard implements CanActivate {

    constructor(
        private _accessCode: AccessCodeService,
        private _router: Router) {}

    canActivate() {
        return this.checkForValidAccessCode();
    }

    checkForValidAccessCode() {
        const valid = !!(localStorage.getItem('access_code'));

        if (!valid) {
            this._router.navigate(['/']);
        }

        return valid;
    }
}
