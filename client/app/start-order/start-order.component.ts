import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProgressService } from '../shared/progress.service';

@Component({
  selector: 'tix-start-order',
  templateUrl: './start-order.component.html',
  styleUrls: ['./start-order.component.scss']
})
export class StartOrderComponent {

    constructor(private _progress: ProgressService) {}

    @ViewChild('') form: NgForm;

    onSubmit() {
        this._progress.setProgressActive(true);
    }

}
