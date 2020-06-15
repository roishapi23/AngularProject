import { UserCartsStatus } from './../models/userCartsStatus';
import { IsUserAlreadyExistsResponse } from './../models/IsUserAlreadyExistsResponse';
import { NewUserDetails } from './../models/NewUserDetails';
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { UserLoginDetails } from '../models/UserLoginDetails';
import { Observable } from 'rxjs';
import { SuccessfullLoginServerResponse } from '../models/SuccessfullLoginServerResponse';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public isUserLoggedIn = false;
  public customerName:String;
  public userType:String;
  public userId:Number;



  // public isPasswordsMatch = false;
  // public isFirstRegisterApprove = false;

  constructor(private http: HttpClient) { }

  public login(userLoginDetails : UserLoginDetails):Observable<SuccessfullLoginServerResponse> {
    return this.http.post<SuccessfullLoginServerResponse>("/api/users/login",userLoginDetails)
  }
  public logout():Observable<{message:string}> {
    return this.http.delete<{message:string}>("/api/users/logout")
  }
  public checkIfUserIsAdmin():Observable<{message:string}> {
    return this.http.get<{message:string}>("/api/users/admin")
  }
  public registerApproval(newUserDetails : NewUserDetails):Observable<IsUserAlreadyExistsResponse> {
    return this.http.post<IsUserAlreadyExistsResponse>("/api/users/approveNewUser",newUserDetails)
  }
  public register(newUserDetails : NewUserDetails):Observable<{message:string}> {
    return this.http.post<{message:string}>("/api/users" ,newUserDetails)
  }

}
