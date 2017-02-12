import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
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

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        StartOrderComponent,
        OrderCompleteComponent,
        OrderComponent,
        ErrorDialogComponent
    ],
    entryComponents: [
        ErrorDialogComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        MaterialModule.forRoot(),
        AppRoutingModule
    ],
    providers: [
        ProgressService,
        AccessCodeService,
        AccessGuard,
        OrderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
