import { OnDestroy, Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProgressService } from '../../shared/progress.service';

@Component({
    selector: 'tix-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    constructor(private _progress: ProgressService) { }

    showProgressBar: boolean;
    showProgressBarSubscription: Subscription;

    ngOnInit() {
        this.showProgressBarSubscription = this._progress.progressActive.subscribe(x => this.showProgressBar = x);
    }

    ngOnDestroy() {
        this.showProgressBarSubscription.unsubscribe();
    }

}
