/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButton, MatDialog } from '@angular/material';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { ProgressService } from './shared/progress.service';
import { TitleService } from './shared/title.service';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        [MatButton, MatDialog]
      ],
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      providers: [
        ProgressService,
        TitleService
      ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
