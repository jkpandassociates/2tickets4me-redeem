import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {

  constructor(public title: Title) { }

  private _baseTitle = '2tickets4me.com';

  getTitle() {
      return this.title.getTitle();
  }

  setTitle(newTitle: string) {
      newTitle += ` | ${this._baseTitle}`;
      this.title.setTitle(newTitle);
  }

}
