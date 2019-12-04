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
    console.info('> ', this.activatedRoute.snapshot.queryParams)
    console.info('> ', this.activatedRoute.snapshot.params)
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
