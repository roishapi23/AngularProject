import { UsersService } from './../../services/users.service';
import { PurchasesService } from './../../services/purchases.service';
import { Component, OnInit} from '@angular/core';
import { CartsService } from 'src/app/services/carts.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as jsPDF from 'jspdf'; 
import 'jspdf-autotable';

@Component({
  selector: 'app-final-cart',
  templateUrl: './final-cart.component.html',
  styleUrls: ['./final-cart.component.css']
})
export class FinalCartComponent implements OnInit {
  public cartItems = [];
  public cartPrice: number;
  public cartId:number;
  activatedRoute: ActivatedRoute;
  public searchInput : string;


  constructor(public usersService:UsersService , public cartsService:CartsService , public purchasesService:PurchasesService, private router:Router , private route: ActivatedRoute) { }

  ngOnInit() {

    if (this.usersService.isUserLoggedIn == false) {
      this.usersService.isUserLoggedIn = true;
    }

    let observable = this.cartsService.getCustomerFinalCart();
    observable.subscribe(finalCart =>{

        this.cartsService.cartItemsList = finalCart.cart; 
        /* setting the cart on this component to show it, making it dynamic for changes from other components */
        /* thanks to the fact that his value is from the service */
        this.cartItems = this.cartsService.cartItemsList;
        this.cartsService.cartTotalPrice = finalCart.cartPrice;
        this.cartPrice = this.cartsService.cartTotalPrice;
    }, error =>{
      console.log(error)
        if (error.status == 500) {
        this.router.navigate(['home'], {relativeTo: this.activatedRoute})
        }
        if (error.status == 600) {
        this.router.navigate(['home/customer'], {relativeTo: this.activatedRoute})
        }
        if (error.status == 404) {
        alert(error.error.error)
        }
        if (error.status == 607) { /* means that the token wasn't approve by the server */
          alert(error.error.error)
          this.router.navigate(['home'], {relativeTo: this.activatedRoute})
      }
    })
  }

  public backToCart(){
    this.router.navigate(['shop'], {relativeTo: this.activatedRoute})
  }

  public markBySearch(event: KeyboardEvent){
    this.searchInput = (event.target as HTMLInputElement).value
    let cartItem = document.getElementsByClassName("cartItem") as HTMLCollectionOf<HTMLElement>
    for (let index = 0; index < this.cartItems.length; index++) {
      if (this.cartItems[index].productName.includes(this.searchInput)) {
        cartItem[index].style.backgroundColor = "rgb(204, 163, 0)";
      }
      else{
        cartItem[index].style.backgroundColor = "";
      }
      
    }
    if (this.searchInput == "") {
      for (let index = 0; index < this.cartItems.length; index++) {
        cartItem[index].style.backgroundColor = "";
      }
    }
  }

}
