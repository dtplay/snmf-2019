import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  customers: string[] = [];

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.authSvc.getCustomers()
      .then(result => this.customers = result)
      .catch(error => {
        this.router.navigate(['/']);
      });
  }
}
