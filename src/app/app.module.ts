import { PurchasesService } from './services/purchases.service';
import { ProductsService } from './services/products.service';
import { CartsService } from 'src/app/services/carts.service';

import { UsersService } from './services/users.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationInterceptor } from './interseptors/AuthenticationInterceptor';
import { AppRoutingModule } from './app-routing.module';

import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FirstSiteStatusComponent } from './components/first-site-status/first-site-status.component';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShopComponent } from './components/shop/shop.component';



import { MainComponent } from './components/main/main.component';

import { CustomerComponent } from './components/customer/customer.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminComponent } from './components/admin/admin.component';
import { PaymentComponent } from './components/payment/payment.component';
import { FinalCartComponent } from './components/final-cart/final-cart.component';
import { ShippingDetailsComponent } from './components/shipping-details/shipping-details.component';
import { AdminProductManagerComponent } from './components/admin-product-manager/admin-product-manager.component';

import { ProductsByCategoryComponent } from './components/products-by-category/products-by-category.component';
import { ShoppingByCategoryComponent } from './components/shopping-by-category/shopping-by-category.component';
import { NavErrorComponent } from './components/nav-error/nav-error.component';



@NgModule({
  declarations: [
    LayoutComponent,  
    HeaderComponent,
    WelcomeComponent,
    FirstSiteStatusComponent,
    RegisterComponent,
    LoginComponent,
    MainComponent,
    ShopComponent,
    CustomerComponent,
    CartComponent,
    AdminComponent,
    PaymentComponent,
    FinalCartComponent,
    ShippingDetailsComponent,
    AdminProductManagerComponent,
    ProductsByCategoryComponent,
    ShoppingByCategoryComponent,
    NavErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule

  ],
  providers: [UsersService , CartsService, PurchasesService , ProductsService, { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
