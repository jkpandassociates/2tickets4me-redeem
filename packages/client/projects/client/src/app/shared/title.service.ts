import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TitleService {
  constructor(private _title: Title) {}

  private _baseTitle = '2tickets4me.com';

  title = new BehaviorSubject<string>(this._baseTitle);

  setTitle(title: string) {
    const newTitle = `${title} | ${this._baseTitle}`;
    this.title.next(newTitle);
    this._title.setTitle(newTitle);
  }
}