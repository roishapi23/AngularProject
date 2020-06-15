import { ShippingDetails } from './../models/ShippingDetails';
import { PaymentResponse } from './../models/PaymentResponse';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  public isPurchaseCompleted = false;

  constructor(private http: HttpClient) { }

  public setThePurchase(purchaseDetails:ShippingDetails):Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>("/api/purchases" , purchaseDetails)
  }
  public getCustomerShippingAddress():Observable<ShippingDetails> {
    return this.http.get<ShippingDetails>("/api/users/address");
  }
}
