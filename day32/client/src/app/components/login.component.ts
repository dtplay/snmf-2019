import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MyService } from '../myservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private mySvc: MyService, private router: Router) { }

  ngOnInit() {
  }
  performLogin(form: NgForm) {
    console.info('> ', form.value);
    this.mySvc.authenticate(form.value['username'], form.value['password'])
      .then(result => {
        console.log('authenticated: ', result);
        this.router.navigate(['/list'])
      })
  }
}
