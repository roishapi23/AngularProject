import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { CartsService } from 'src/app/services/carts.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public cartItems = [];
  public cartPrice = 0;
  public cartId:number;
  activatedRoute: ActivatedRoute;

  constructor(public cartsService:CartsService , public usersService:UsersService, private router:Router , private route: ActivatedRoute) {
    this.cartItems = this.cartsService.cartItemsList;
    // this.cartPrice = this.cartsService.cartTotalPrice;
    this.cartsService = cartsService;
   }

  ngOnInit() {
    // display logout button even if the page refreshed
    if (this.usersService.isUserLoggedIn == false) {
      this.usersService.isUserLoggedIn = true;
    }

    let observable = this.cartsService.setCustomerCart();
    observable.subscribe(userCart =>{
      // if cart is not empty - display it and it's price
      if (userCart.cart != null) {
        console.log("enter to display open cart")
        this.cartsService.cartItemsList = userCart.cart; 
        /* setting the cart on this component to show it, making it dynamic for changes from other components */
        /* thanks to the fact that his value is from the service */
        this.cartItems = this.cartsService.cartItemsList;

        this.cartsService.cartTotalPrice = userCart.cartPrice;
        this.cartPrice = this.cartsService.cartTotalPrice;
        
      }
    }, error =>{
      console.log(error)
        if (error.status == 500) {
        this.router.navigate(['home'], {relativeTo: this.activatedRoute})
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

  public deleteCartItem(cartItemToDelete){
    console.log(cartItemToDelete)
    this.deleteCartItemFromDB(cartItemToDelete);  
    this.deleteCartItemfromUI(cartItemToDelete);
    
  }
  
  public deleteCartItemfromUI(cartItemToDelete){
    this.cartItems = this.cartsService.cartItemsList
    let currentCartItems = this.cartItems;
    console.log(currentCartItems)
    currentCartItems.map((item,index) =>{
      console.log(index)
      if (item.id == cartItemToDelete) {
        currentCartItems.splice(index,1);
        console.log(currentCartItems)
        this.cartsService.cartItemsList = currentCartItems;
        this.cartItems = this.cartsService.cartItemsList;
        return;
      }
    } )
  }
  
  public deleteCartItemFromDB(cartItemToDelete){
    let observable = this.cartsService.deleteCartItem(cartItemToDelete);
    observable.subscribe(afterDeleteServerResponse => {
      let updatedTotalCartPrice = afterDeleteServerResponse.cartUpdatedPrice;
      this.cartsService.cartTotalPrice = updatedTotalCartPrice;
    },error =>{
      alert("something went wrong at deleting item");
    })
    
  }

  public emptyCart(){
    this.emptyCartFromDB();
    this.emptyCartFromUI()
  }

  public emptyCartFromDB(){
    let observable = this.cartsService.emptyCart();
    observable.subscribe(afterCartEmptyServerResponse => {
      // console.log(afterDeleteServerResponse.cartUpdatedPrice);
      let updatedTotalCartPrice = afterCartEmptyServerResponse.cartUpdatedPrice;
      this.cartsService.cartTotalPrice = updatedTotalCartPrice;
    },error =>{
      /* some error action */
    })
  }

  public emptyCartFromUI(){
    this.cartsService.cartItemsList = [];
    this.cartItems = this.cartsService.cartItemsList;
  }
  
  public navToPayment(){
    if (this.cartItems.length == 0) {
      alert("your cart is empty")
      return;
    }
    this.router.navigate(['payment'], {relativeTo: this.activatedRoute})
  }

  public back(){
    this.router.navigate(['home/customer'], {relativeTo: this.activatedRoute})
  }
}
