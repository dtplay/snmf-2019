import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { ListComponent } from './components/list.component';
import { MyService } from './myservice';

const ROUTER: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'list', component: ListComponent,
    // route guard has to be a service
    canActivate: [ MyService ]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  imports: [ RouterModule.forRoot(ROUTER) ],
  exports: [ RouterModule ],
})
export class AppRouteModule { }
