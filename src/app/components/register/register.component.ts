import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from './../../services/users.service';
import { NewUserDetails } from './../../models/NewUserDetails';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public firstPartRegisterShow:boolean = true;
  public secondPartRegisterShow:boolean = false;
  public registarionCompleted:boolean = false;
  public isUserDBDetailsInvalid:boolean = false;
  public isPasswordsMatch:Boolean = false;

  public errorMessage : Object;
  public newUserDetails: NewUserDetails;
  activatedRoute: ActivatedRoute;


  constructor(private usersService : UsersService , private router:Router , private route: ActivatedRoute) {
    this.newUserDetails = new NewUserDetails("","","","")
    this.usersService = usersService;
    this.errorMessage;
   }

  ngOnInit() {
    sessionStorage.clear();
     // undisplay logout button if it's displayed
    if (this.usersService.isUserLoggedIn == true) {
    this.usersService.isUserLoggedIn = false;
    }
  }

  public backTofirstPartRegisterUI(){
    this.firstPartRegisterShow = !this.firstPartRegisterShow;
    this.secondPartRegisterShow = !this.secondPartRegisterShow;
  }
  
  public register(){
    this.isUserDBDetailsInvalid = false;
    console.log(this.newUserDetails);

    let observable = this.usersService.register(this.newUserDetails);
    observable.subscribe(registrationResponse => {
      console.log(registrationResponse.message)
      this.secondPartRegisterShow = !this.secondPartRegisterShow;
      this.registarionCompleted = !this.registarionCompleted;
      
    },error =>{
      if (this.isUserDBDetailsInvalid == false) {
        this.isUserDBDetailsInvalid = true;
      }
      let connectionError = {message: "Faild to connect"}
      this.errorMessage = connectionError.message;
    })
  }
  
  public navToLogin(){
    this.router.navigate(["/home"]);
  }
  public backToLogin(){
    this.router.navigate(['home/login'], {relativeTo: this.activatedRoute})
  }
  
  public continueRegistration(){
    this.checkIfPasswordsMatch(this.newUserDetails.password, this.newUserDetails.confirmPassword);
    if (this.isPasswordsMatch == false) {
      this.isUserDBDetailsInvalid = true
      return;
    }
    this.isPasswordsMatch = false;
    // alert("checking if user exists")
    console.log(this.newUserDetails)
    let observable = this.usersService.registerApproval(this.newUserDetails);
    observable.subscribe(registerApprovalData => {
      console.log(registerApprovalData)
      
        if (this.isUserDBDetailsInvalid == true) {
          this.isUserDBDetailsInvalid = false;
        }
        // show and hide with the 2 parts
        this.firstPartRegisterShow = !this.firstPartRegisterShow;
        this.secondPartRegisterShow = !this.secondPartRegisterShow;
       
      
    },error =>{
      console.log(error)
      if (error.status == 605 || error.status == 606) {
        if (this.isUserDBDetailsInvalid == false) {
          this.isUserDBDetailsInvalid = true;
        }
          this.errorMessage = error.error.error;
      }
      if (error.status == 404) {
        if (this.isUserDBDetailsInvalid == false) {
          this.isUserDBDetailsInvalid = true;
        }
        let connectionError = {message: "Faild to connect"}
        this.errorMessage = connectionError.message;
      }
    })
  }

  public checkIfPasswordsMatch(password , confirmPassword){
    console.log(password)
    console.log(confirmPassword)
    if (password == confirmPassword) {
  
      this.isPasswordsMatch = true;
      return;
    }
   
    let error = {message: "Password don't match"}
    this.errorMessage = error.message;
  }

}
