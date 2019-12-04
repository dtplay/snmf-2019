import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Order, LineItem } from '../models';
import * as uuid from 'uuid';
import { OrderDatabase } from '../order.db';
import { Exitable } from '../can-leave.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit, Exitable {

  form: FormGroup;
  lineItems: FormArray;

  constructor(private fb: FormBuilder, private orderDB: OrderDatabase) { }

  ngOnInit() {
    this.form = this.createOrder();
    this.lineItems = this.form.get('lineItems') as FormArray;
  }

  addLineItem() {
    this.lineItems.push(this.createLineItem());
  }
  removeLineItem(idx) {
    this.lineItems.removeAt(idx)
  }

  canLeave(): boolean {
    return (this.form.pristine);
  }

  processOrder() {
    const order: Order = {
      orderId: uuid().toString().substring(0, 8),
      date: (new Date()).getTime(),
      name: this.form.value['name'],
      lineItems: this.lineItems.controls.map(v => {
        return {
          description: v.value['description'],
          quantity: parseInt(v.value['quantity'])
        } as LineItem;
      })
    }
    console.info('>> order: ', order)
    this.orderDB.orders.add(order)
      .then(result => {
        console.info('result: ', result)
      })
      .catch(error => {
        console.error('Insert error: ', error)
      })
  }

  private createLineItem(): FormGroup {
    return (this.fb.group({
      // <input type="text" name="description" ngModel required>
      description: this.fb.control('', [ Validators.required ]),
      // <input type="number" name="quantity" ngModel required min="1">
      quantity: this.fb.control(1, [ Validators.required, Validators.min(1) ]),
    }))
  }

  private createOrder(): FormGroup {
    return (
      this.fb.group({
        name: this.fb.control('', [ Validators.required ]),
        lineItems: this.fb.array([])
      })
    )
  }

}
