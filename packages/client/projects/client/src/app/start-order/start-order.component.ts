import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProgressService } from '../shared/progress.service';
import { AccessCodeService } from '../shared/access-code.service';
import { ErrorDialogComponent } from '../shared/error-dialog/error-dialog.component';
import { TitleService } from '../shared/title.service';

@Component({
  selector: 'tix-start-order',
  templateUrl: './start-order.component.html',
  styleUrls: ['./start-order.component.scss']
})
export class StartOrderComponent implements OnInit {
  constructor(
    private _progress: ProgressService,
    private _accessCode: AccessCodeService,
    private _router: Router,
    private _dialog: MatDialog,
    private _title: TitleService
  ) {}

  @ViewChild('startOrderForm') form: NgForm;

  accessCode: string;

  onSubmit() {
    if (this.form.invalid) {
      return; // prevent invalid data being sent to the server
    }

    // Show progress indicator bar
    this._progress.setProgressActive(true);

    // Make sure access code is valid
    this._accessCode.validate(this.accessCode).subscribe((valid) => {
      if (valid) {
        this._accessCode
          .getAccessCode(this.accessCode)
          .subscribe((accessCode) => {
            localStorage.setItem('access_code', this.accessCode);
            console.log(`Valid Access Code: ${this.accessCode}`);
            if (!accessCode.SurveyUrl) {
              this._router.navigate(['/order']);
            } else {
              location.href = accessCode.SurveyUrl;
            }
          });
      } else {
        const error = `Invalid Access Code: ${this.accessCode}`;
        console.warn(error);
        const dialogRef = this._dialog.open(ErrorDialogComponent, {
          role: 'alertdialog'
        });
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

      // Hide progress indicator bar
      this._progress.setProgressActive(false);
    });
  }

  ngOnInit() {
    this._title.setTitle('Start Order');
  }
}
