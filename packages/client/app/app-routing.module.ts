import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartOrderComponent } from './start-order/start-order.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { OrderComponent } from './order/order.component';

import { AccessGuard } from './shared/access-guard.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/start-order',
        pathMatch: 'full'
    },
    {
        path: 'start-order',
        component: StartOrderComponent
    },
    {
        path: 'order/:serial',
        component: OrderCompleteComponent
    },
    {
        path: 'order',
        component: OrderComponent,
        canActivate: [AccessGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
