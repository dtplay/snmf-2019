import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  customers: string[] = [];

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.authSvc.getCustomers()
      .then(result => this.customers = result);
  }

}
