import { CartsService } from './../../services/carts.service';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  activatedRoute: ActivatedRoute;
  public cartDate;

  constructor(public usersService:UsersService , public cartsService:CartsService , private router:Router , private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.usersService.isUserLoggedIn == false) {
      this.usersService.isUserLoggedIn = true;
    }
    this.initCartsServiceElements();

    // make the name of the user shown, even if the page was refreshed
    if (this.usersService.customerName == undefined) { 
      let userName = JSON.parse(sessionStorage.getItem("userName"))
      this.usersService.customerName = userName
    }
    
    let observable = this.cartsService.getUserCartsStatus();
    observable.subscribe(userCartsStatus =>{
      if (userCartsStatus.status == "NEW USER" ) {
        this.cartsService.userFirstTime = true; /* if it's new user, set as true - to show custom message */
        return;
      }
        // cut the date information to be writen as dd/mm/yyyy 
        let serverExactCartDate = JSON.stringify(userCartsStatus.lastCartDate).slice(1,11);
        if (userCartsStatus.status == "OPEN CART"){ 
          this.cartsService.userHasOpenCart = true;
          this.cartDate = serverExactCartDate;
          // sessionStorage.setItem("Cart ID" , JSON.stringify(userCartsStatus.cartId));
          return
        }
        if (userCartsStatus.status == "OLD USER") {
          this.cartsService.userHasOldCart = true
          this.cartDate = serverExactCartDate;
          return
        }
    },error => {
      console.log(error)
      if (error.status == 500 || error.status == 504) {
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

  public navigateToShop(){
    this.router.navigate(['shop'], {relativeTo: this.activatedRoute})
  }
  public initCartsServiceElements(){
    this.cartsService.userHasOldCart = false;
    this.cartsService.userHasOpenCart = false;
    this.cartsService.userFirstTime = false;
  }
}
