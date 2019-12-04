import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ListOrdersComponent } from './components/list-orders.component';
import { CreateOrderComponent } from './components/create-order.component';
import { AppRouteModule } from './approute.module';
import { OrderDatabase } from './order.db';
import { CanLeaveService } from './can-leave.service';

@NgModule({
  declarations: [
    AppComponent,
    ListOrdersComponent,
    CreateOrderComponent
  ],
  imports: [
    BrowserModule, AppRouteModule, FormsModule, ReactiveFormsModule
  ],
  providers: [ OrderDatabase, CanLeaveService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
