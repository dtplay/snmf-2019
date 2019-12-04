import { NgModule } from "@angular/core";
import { Router, Routes, RouterModule } from '@angular/router';
import { ListOrdersComponent } from './components/list-orders.component';
import { CreateOrderComponent } from './components/create-order.component';
import { CanLeaveService } from './can-leave.service';

const ROUTES: Routes = [
  { path: '', component: ListOrdersComponent },
  { path: 'create', component: CreateOrderComponent,
    canDeactivate: [ CanLeaveService ]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
]

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [ RouterModule ]
})
export class AppRouteModule { }
