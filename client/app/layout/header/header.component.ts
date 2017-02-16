import { OnDestroy, Component,  OnInit, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProgressService } from '../../shared/progress.service';
import { TitleService } from '../../shared/title.service';

@Component({
    selector: 'tix-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewChecked {

    constructor(
        private _progress: ProgressService,
        private _title: TitleService) { }

    title: string;

    showProgressBar: boolean;
    showProgressBarSubscription: Subscription;

    ngOnInit() {
        this.showProgressBarSubscription = this._progress.progressActive.subscribe(x => this.showProgressBar = x);
    }

    ngOnDestroy() {
        this.showProgressBarSubscription.unsubscribe();
    }

    ngAfterViewChecked() {
        setTimeout(() => {
            this.title = this._title.getTitle();
        }, 0);
    }

}
