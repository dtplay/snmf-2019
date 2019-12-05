import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private authSvc: AuthService) { }

  ngOnInit() {
    if (!('access_token' in this.activatedRoute.snapshot.queryParams))
      return;
    this.authSvc.token = this.activatedRoute.snapshot.queryParams.access_token;
    this.router.navigate(['/list']);
  }

  performLogin(loginForm: NgForm) {
    this.authSvc.authenticate(loginForm.value['username'], loginForm.value['password'])
      .then(result => {
        if (result)
          return this.router.navigate(['/list'])
        prompt('Login incorrect. Try again')
      })
  }

}
