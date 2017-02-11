import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProgressService } from '../shared/progress.service';
import { AccessCodeService } from '../shared/access-code.service';

@Component({
  selector: 'tix-start-order',
  templateUrl: './start-order.component.html',
  styleUrls: ['./start-order.component.scss']
})
export class StartOrderComponent {

    constructor(private _progress: ProgressService, private _accessCode: AccessCodeService, private _router: Router) {}

    @ViewChild('startOrderForm') form: NgForm;

    accessCode: string;

    onSubmit() {
        if (this.form.invalid) {
            return; // prevent invalid data being sent to the server
        }
        this._progress.setProgressActive(true);
        this._accessCode.isAccessCodeValid(this.accessCode).subscribe(valid => {
            if (valid) {
                localStorage.setItem('access_code', this.accessCode);
                // this._router.navigate(['/order']);
                console.log(`Valid Access Code: ${this.accessCode}`)
            } else {
                console.warn(`Invalid Access Code: ${this.accessCode}`);
            }
            // report error if valid = false
            this._progress.setProgressActive(false);
        });
    }

}
