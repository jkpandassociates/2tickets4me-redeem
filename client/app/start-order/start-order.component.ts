import { MdDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProgressService } from '../shared/progress.service';
import { AccessCodeService } from '../shared/access-code.service';
import { ErrorDialogComponent } from '../shared/error-dialog/error-dialog.component';

@Component({
  selector: 'tix-start-order',
  templateUrl: './start-order.component.html',
  styleUrls: ['./start-order.component.scss']
})
export class StartOrderComponent {

    constructor(
        private _progress: ProgressService,
        private _accessCode: AccessCodeService,
        private _router: Router,
        private _dialog: MdDialog) {}

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
                let error = `Invalid Access Code: ${this.accessCode}`;
                console.warn(error);
                let dialogRef = this._dialog.open(ErrorDialogComponent, { role: 'alertdialog' });
                dialogRef.componentInstance.title = `${error}`;
                dialogRef.componentInstance.message = `
                The access code entered is either expired or invalid.
                If you have questions about this access code, please
                email us at <a href="mailto:techsupport@2tickets4me.com">techsupport@2tickets4me.com</a>.<br /><br />
                Please include company name and authorization rep and
                what date you were given this code in your e-mail.`;
                this.accessCode = null;
                this.form.reset();
            }
            // report error if valid = false
            this._progress.setProgressActive(false);
        });
    }

}
