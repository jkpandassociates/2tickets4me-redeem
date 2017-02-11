import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {StartOrderComponent} from './start-order/start-order.component';

const routes: Routes = [
  {
    path: '',
    component: StartOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
