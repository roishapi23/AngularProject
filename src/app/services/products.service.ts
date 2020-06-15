import { Product } from 'src/app/models/productDetails';
// import { Product } from './../models/productDetails';
import { AmountStatusFirstUI } from './../models/AmountInfoFirstUI';
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public isUrlAtSearch = false;
  public userSearchInput : string;
  public adminCurrentChosenProduct:Product; /* for admin use*/
  public openedNewProductArea = false; /* for admin use*/
  public categorysArrayWithOutChosenProductCategory = []; /* for admin use */
  public productCategoryBeforeUpdate:string; /* for admin use - parameter to check if the category has been changed */
  public productCategoryNameBeforeUpdate:string; /* for admin use - parameter to keep original category */
  public products : Product[];
  public updatedProssesOver = false;

  constructor(private http: HttpClient) { }

  public getProductsbyCategory(id):Observable<Product[]> {
    return this.http.get<Product[]>("/api/products/byCategory/"+id)
  }
  public getFirstUIAmountInfo():Observable<AmountStatusFirstUI> {
    return this.http.get<AmountStatusFirstUI>("/api/products/amount")
  }
  public getAllProducts():Observable<Product[]> {
    return this.http.get<Product[]>("/api/products")
  }
  public updateProduct(product:Product):Observable<string> {
    return this.http.put<string>("/api/products" , product)
  }
  public addNewProduct(product:Product):Observable<Product> {
    return this.http.post<Product>("/api/products" , product)
  }

  
}
