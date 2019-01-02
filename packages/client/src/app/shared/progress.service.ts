import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProgressService {
  progressActive = new BehaviorSubject(false);

  setProgressActive(value: boolean) {
    this.progressActive.next(value);
  }

  constructor() {}
}
