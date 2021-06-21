import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  constructor(private http: HttpClient) { }

  placeOrder(orders) {
    const token = localStorage.getItem('user');
    const header = new HttpHeaders({
      'Authorization': `Basic ${token}`
    });
    return this.http.post('/api/order', orders, { headers: header, observe: 'response'}).pipe(take(1));
  }

  getOrders() {
    return this.http.get('/api/order').pipe(take(1));
  }

  deleteOrders(id) {
    return this.http.delete(`/api/order/${id}`).pipe(take(1));
  }

}
