import { Injectable } from "@angular/core";
import Dexie from 'dexie';
import { Order } from './models';

@Injectable()
// Must extend Dexie
export class OrderDatabase extends Dexie {

  orders: Dexie.Table<Order, string>;

  constructor() {
    // call super with the database name
    super('eshop');
    // Create the collection
    this.version(1).stores({
      //indexing 2 fields
      orders: 'orderId,name',
    })
    this.orders = this.table('orders');
  }

}
