import { Component, OnInit } from '@angular/core';

import { ProgressService } from '../../shared/progress.service';
import { TitleService } from '../../shared/title.service';

@Component({
  selector: 'tix-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private _progress: ProgressService,
    private _title: TitleService
  ) {}

  title: string;

  showProgressBar: boolean;

  ngOnInit() {
    this._progress.progressActive.subscribe((x) => (this.showProgressBar = x));
    this._title.title.subscribe((title: string) => (this.title = title));
  }
}
