import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MyService } from './myservice';
import { LoginComponent } from './components/login.component';
import { ListComponent } from './components/list.component';
import { AppRouteModule } from './approute.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, AppRouteModule
  ],
  providers: [ MyService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
