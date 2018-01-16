import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TitleService {

  constructor(private _title: Title) { }

  private _baseTitle = '2tickets4me.com';

  title = new BehaviorSubject<string>(this._baseTitle);

  setTitle(newTitle: string) {
      newTitle += ` | ${this._baseTitle}`;
      this.title.next(newTitle);
      this._title.setTitle(newTitle);
  }

}
