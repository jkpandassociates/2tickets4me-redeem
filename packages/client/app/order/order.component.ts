import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OrderService } from '../shared/order.service';
import { ErrorDialogComponent } from '../shared/error-dialog/error-dialog.component';
import { TitleService } from '../shared/title.service';
import { ProgressService } from '../shared/progress.service';

@Component({
    selector: 'tix-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    constructor(
        private _fb: FormBuilder,
        private _order: OrderService,
        private _dialog: MatDialog,
        private _route: Router,
        private _title: TitleService,
        private _progress: ProgressService) { }

    orderForm: FormGroup;

    todaysDate = new Date();

    states: { name: string; abbreviation: string }[] = [];

    orderFormErrors = {
        FirstName: '',
        LastName: '',
        Address: '',
        City: '',
        State: '',
        ZipCode: '',
        Phone: '',
        WorkPhone: '',
        Email: '',
        Destination: '',
        Sponsor: '',
        RepresentativeName: '',
        AgreeToTerms: ''
    }

    validationMessages = {
        FirstName: {
            required: 'First Name is required.'
        },
        LastName: {
            required: 'Last Name is required.'
        },
        Address: {
            required: 'Mailing Address is required.'
        },
        City: {
            required: 'City is required.'
        },
        State: {
            required: 'State is required.'
        },
        ZipCode: {
            required: 'Zip Code is required.',
            pattern: 'Zip Code must be a number.',
            minlength: 'Zip Code must be 5 digits.',
            maxlength: 'Zip Code must be 5 digits.'
        },
        Phone: {
            required: 'Cell/Home Phone is required.'
        },
        WorkPhone: {},
        Email: {
            required: 'Email Address is required.',
            invalid: 'Email Address must be valid.'
        },
        Destination: {
            required: 'Destination is required.'
        },
        Sponsor: {
            required: 'Sponsor is required.'
        },
        RepresentativeName: {
            required: 'Authorized Rep is required.'
        },
        AgreeToTerms: {
            required: 'You must agree to the terms and conditions.'
        }
    };

    buildForm() {
        this.orderForm = this._fb.group({
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Address: ['', Validators.required],
            City: ['', Validators.required],
            State: ['', Validators.required],
            ZipCode: ['', [
                    Validators.required,
                    Validators.pattern(/^\d+$/),
                    Validators.minLength(5),
                    Validators.maxLength(5)
                ]
            ],
            Phone: ['', Validators.required],
            WorkPhone: '',
            Email: ['', Validators.required],
            Destination: ['', Validators.required],
            Sponsor: ['', Validators.required],
            RepresentativeName: ['', Validators.required],
            AgreeToTerms: [false, Validators.requiredTrue]
        });

        this.orderForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

        this.onValueChanged();
    }

    onValueChanged(data?: any) {
        if (!this.orderForm) { return; }
        const form = this.orderForm;
        for (const field in this.orderFormErrors) {
            // clear previous error message (if any)
            this.orderFormErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.orderFormErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    markInvalidFields() {
        if (!this.orderForm) { return; }
        const form = this.orderForm;
        for (const field in this.orderFormErrors) {
            this.orderFormErrors[field] = '';
            const control = form.get(field);
            if (control && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.orderFormErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onSubmit() {
        if (this.orderForm.invalid) {
            this.markInvalidFields();
            return;
        }

        this._progress.setProgressActive(true);

        const order: Order = this.orderForm.value;
        order.CodeName = localStorage.getItem('access_code');

        this._order.createOrder(order).subscribe((newOrder) => {
            localStorage.removeItem('access_code');
            this._progress.setProgressActive(false);
            this._route.navigate([`/order/${newOrder.SerialNumber}`]);
        }, (error) => {
            // Error
            this._progress.setProgressActive(false);
            if (error instanceof Response) {
                const response = error.json();
                if (response.validation && response.validation.keys) {
                    const keys: string[] = response.validation.keys;
                    for (const field in this.orderFormErrors) {
                        // clear previous error message (if any)
                        this.orderFormErrors[field] = '';
                        const messages = this.validationMessages[field];
                        if (keys.indexOf(field) > -1 && messages.invalid) {
                            this.orderFormErrors[field] += messages.invalid + ' ';
                        }
                    }
                } else if (response.errors) {
                    const err = response.errors.shift();
                    const dialogRef = this._dialog.open(ErrorDialogComponent, { role: 'alertdialog' });
                    if (err.title) {
                        dialogRef.componentInstance.title = `${err.title}`;
                    }
                    if (err.detail) {
                        dialogRef.componentInstance.message = `${err.detail}`;
                    }
                }
            } else {
                console.error(error);
                this._dialog.open(ErrorDialogComponent, { role: 'alertdialog' });
            }
        });

    }

    ngOnInit() {
        this._title.setTitle('Register');
        this.states = this._order.states;
        this.buildForm();
    }

}
