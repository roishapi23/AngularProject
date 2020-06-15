import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activatedRoute: ActivatedRoute;

  constructor(public userService:UsersService, public productsService:ProductsService ,private router:Router , private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  public navToHome() {
    this.router.navigate(['home/login'], {relativeTo: this.activatedRoute})
  }

  public logout(){
    this.router.navigate(['home/login'], {relativeTo: this.activatedRoute})
    this.userService.isUserLoggedIn = false;
    /* next two rows are to init admin UI vars after logout and*/
    /* to show first UI again - if the admin logged out and then logged in again */
    this.productsService.openedNewProductArea = false;
    this.productsService.adminCurrentChosenProduct = null;
    
    let observable = this.userService.logout();
    observable.subscribe(logoutResponse =>{
      console.log(logoutResponse)

    },error => {
      console.log(error)
    })

  }

}
