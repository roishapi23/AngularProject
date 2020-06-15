
import { Cart } from '../models/Cart';
import { AddCartItemResponse } from './../models/AddCartItemResponse';
import { AddCartResponse } from './../models/AddCartResponse';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCartsStatus } from '../models/userCartsStatus';
import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  public userFirstTime = false;
  public userHasOpenCart = false;
  public userHasOldCart = false;
  public userCartId:number;
  public cartTotalPrice = 0;
  public cartItemsList = [];

  constructor(private http: HttpClient) { }

  public getUserCartsStatus():Observable<UserCartsStatus> {
    return this.http.get<UserCartsStatus>("/api/carts/status")
  }
  public getCustomerFinalCart():Observable<UserCartsStatus> {
    return this.http.get<UserCartsStatus>("/api/carts/finalCart");
  }
  public setCustomerCart():Observable<UserCartsStatus> {
    return this.http.get<UserCartsStatus>("/api/carts/myCart")
  }

  public addNewCartItem(newCartItem : CartItem):Observable<AddCartItemResponse> {
    return this.http.post<AddCartItemResponse>("/api/cartItems" , newCartItem)
  }
  public updateCartItem(newCartItem : CartItem):Observable<AddCartItemResponse> {
    return this.http.put<AddCartItemResponse>("/api/cartItems" , newCartItem)
  }
  public deleteCartItem(productId : number):Observable<AddCartItemResponse> {
    return this.http.delete<AddCartItemResponse>("/api/cartItems/"+productId)
  }
  public emptyCart():Observable<AddCartItemResponse> {
    return this.http.delete<AddCartItemResponse>("/api/cartItems")
  }
}
