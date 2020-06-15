import { CartsService } from 'src/app/services/carts.service';
import { UsersService } from './../../services/users.service';
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userLoginDetails: UserLoginDetails
  activatedRoute: ActivatedRoute;
  public isLoginFailed:boolean = false;
  public errorMessage : string;

  constructor(public usersService: UsersService, public cartsService:CartsService ,  private router:Router , private route: ActivatedRoute) {
    this.userLoginDetails = new UserLoginDetails();
    this.usersService = usersService;
    this.cartsService = cartsService;

   }

  ngOnInit() {
    sessionStorage.clear();
    this.initCartsService();
    // undisplay logout button if it's displayed
    if (this.usersService.isUserLoggedIn == true) {
    this.usersService.isUserLoggedIn = false;
    }
  }

  public login(){
    this.isLoginFailed = false
    console.log(this.userLoginDetails)

    let observable = this.usersService.login(this.userLoginDetails);

    observable.subscribe(successFullLoginResponse => {
      console.log(successFullLoginResponse);
      sessionStorage.setItem("userName", JSON.stringify(successFullLoginResponse.name))
      sessionStorage.setItem("token", successFullLoginResponse.token);
      this.usersService.customerName = successFullLoginResponse.name;
      this.usersService.userType = successFullLoginResponse.userType;
      this.usersService.userId = successFullLoginResponse.id;
      console.log("user id is : "+this.usersService.userId);
      this.usersService.isUserLoggedIn = true;
      if (this.usersService.userType == "ADMIN") {
      this.router.navigate(['admin'], {relativeTo: this.activatedRoute})
      return;
      }
      this.router.navigate(['home/customer'], {relativeTo: this.activatedRoute})

    },error =>{
      console.log(error)
      console.log(error.error.error)
      if (error.status == 401) {
        if (this.isLoginFailed == false) {
          this.isLoginFailed = true;
          this.errorMessage = error.error.error
        }
      }
      if (error.status = 404) {
        if (this.isLoginFailed == false) {
          this.isLoginFailed = true;
          this.errorMessage = "Connection Error"
        }
      }
    })
  }

  public routeToRegister(){
    this.router.navigate(['home/register'], {relativeTo: this.activatedRoute})
  }

  public initCartsService(){
    this.cartsService.userHasOldCart = false;
    this.cartsService.userHasOpenCart = false;
  }

}
