import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class AuthService implements CanActivate {

  token: string = null;

  constructor(private router: Router, private http: HttpClient) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree| boolean {
    if (this.token)
      return (true)
    return (this.router.parseUrl('login'));
  }

  getCustomers(): Promise<string[]> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
    return (
      this.http.get<string[]>('/customers', { headers })
        .toPromise()
        .catch(error => {
          console.info(error.status);
          this.token = null;
          return (Promise.reject(error))
        })
    );
  }

  authenticate(username: string, password: string): Promise<boolean> {
    const urlencoded = new HttpParams()
      .set('username', username)
      .set('password', password)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
    return (
      this.http.post('/authenticate', urlencoded.toString(), { headers })
        .toPromise()
        .then((result: any) => {
          console.info('>> returned: ', result)
          this.token = result.access_token
          return (true);
        })
        .catch(error => {
          this.token = null;
          return (false);
        })
    )
  }

}
