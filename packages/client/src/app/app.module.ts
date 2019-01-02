import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatButtonModule,
  MatDialogModule,
  MatToolbarModule,
  MatProgressBarModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { StartOrderComponent } from './start-order/start-order.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { OrderComponent } from './order/order.component';
import { ProgressService } from './shared/progress.service';
import { AccessCodeService } from './shared/access-code.service';
import { ErrorDialogComponent } from './shared/error-dialog/error-dialog.component';
import { AccessGuard } from './shared/access-guard.service';
import { OrderService } from './shared/order.service';
import { TitleService } from './shared/title.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StartOrderComponent,
    OrderCompleteComponent,
    OrderComponent,
    ErrorDialogComponent
  ],
  entryComponents: [ErrorDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    [
      MatButtonModule,
      MatDialogModule,
      MatToolbarModule,
      MatProgressBarModule,
      MatCardModule,
      MatInputModule,
      MatSelectModule,
      MatCheckboxModule,
      MatRadioModule,
      MatFormFieldModule
    ],
    AppRoutingModule
  ],
  providers: [
    ProgressService,
    AccessCodeService,
    AccessGuard,
    OrderService,
    Title,
    TitleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
