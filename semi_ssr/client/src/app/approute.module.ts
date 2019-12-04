import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login.component';
import {ListComponent} from './components/list.component';
import {AuthService} from './auth.service';

const ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'list', component: ListComponent, canActivate: [ AuthService ] },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES, { useHash: false }) ],
  exports: [ RouterModule ]
})
export class AppRouteModule { }
