export interface LineItem {
  description: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  name: string;
  date: number;
  lineItems: LineItem[];
}
