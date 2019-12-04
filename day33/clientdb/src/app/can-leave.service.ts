import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface Exitable {
  canLeave(): Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanLeaveService implements CanDeactivate<Exitable> {

  canDeactivate(component: Exitable, route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) {
    if (!component.canLeave())
        return (confirm('Are you sure?'))
    return (component.canLeave());
  }

}
