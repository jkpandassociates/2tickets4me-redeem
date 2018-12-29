import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
    selector: 'tix-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {

    title: string;
    message: string;

    constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>) { }

}
