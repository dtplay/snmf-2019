import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class MyService implements CanActivate {

  private authenticated = false;
  private token: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated(): boolean {
    return (this.authenticated);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authenticated)
      this.router.navigate(['/login']);
    return (this.authenticated)
  }

  getCustomers(): Promise<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
    return (
      this.http.get('http://localhost:3000/customers', { headers })
        .toPromise()
    );
  }

  authenticate(username: string, password: string): Promise<boolean> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')

    return (
      this.http.post('http://localhost:3000/authenticate',
          params.toString(), { headers })
        .toPromise()
        .then((result: any) => {
          console.info('> result: ', result)
          this.authenticated = true;
          this.token = result.access_token;
          return true;
        })
        .catch(() => {
          this.authenticated = false;
          this.token = '';
          return false;
        })
    )
  }

}
