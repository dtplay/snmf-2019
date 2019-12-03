import { Component, OnInit } from '@angular/core';
import { MyService } from '../myservice';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private mySvc: MyService) { }

  ngOnInit() {
    console.info('is authenticated: ', this.mySvc.isAuthenticated());
    this.reload()
  }

  reload() {
    this.mySvc.getCustomers()
      .then(result => {
        console.info('result: ', result);
      })
      .catch(error => {
        console.info('error: ', error)
      })
  }

}
