import { Component, OnInit } from '@angular/core';
import { Order } from '../models';
import { OrderDatabase } from '../order.db';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {

  orders: Order[] = [];

  constructor(private orderDB: OrderDatabase) { }

  ngOnInit() {
    this.orderDB.orders.toArray()
      .then(result => {
        this.orders = result;
      })
  }

}
