import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';



@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    constructor(private userService: UsersService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with our token if available
        // alert("somting")
        let token:string;
        token = "Bearer " + sessionStorage.getItem("token");
        console.log(token)
        if (token) {            
            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }
        return next.handle(request);
    }
}