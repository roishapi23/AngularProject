import { UsersService } from './../../services/users.service';
import { AmountStatusFirstUI } from './../../models/AmountInfoFirstUI';
import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-first-site-status',
  templateUrl: './first-site-status.component.html',
  styleUrls: ['./first-site-status.component.css']
})
export class FirstSiteStatusComponent implements OnInit {

  public amountInfo: AmountStatusFirstUI ;
  public userFirstTime: Boolean;

  constructor(private productsService: ProductsService, public usersService: UsersService) {
    this.amountInfo = new Object;
   }

  ngOnInit() {
    let observable = this.productsService.getFirstUIAmountInfo();
    observable.subscribe(amountInfoDataFromServer=>{
      console.log(amountInfoDataFromServer)
      this.amountInfo = amountInfoDataFromServer;
    },error =>{
      console.log(error)
    })
  }

  

}
