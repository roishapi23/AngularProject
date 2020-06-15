import { NavErrorComponent } from './components/nav-error/nav-error.component';
import { ShoppingByCategoryComponent } from './components/shopping-by-category/shopping-by-category.component';
import { ProductsByCategoryComponent } from './components/products-by-category/products-by-category.component';

import { PaymentComponent } from './components/payment/payment.component';
import { AdminComponent } from './components/admin/admin.component';
import { CustomerComponent } from './components/customer/customer.component';



import { MainComponent } from './components/main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';
import { ShopComponent } from './components/shop/shop.component';


const routes: Routes = [
    { 
        path: "home", component: MainComponent, children:[
            { path: "login", component: LoginComponent },
            { path: "customer", component: CustomerComponent },
            { path: "register", component: RegisterComponent },
            { path: "", redirectTo: "login", pathMatch: "full" }
            
          ]
        },
  {path: "" , redirectTo: "home" , pathMatch: "full"},
  { path: "admin/:category", component: AdminComponent },
  { path: "admin", redirectTo: "admin/Milk&Eggs", pathMatch: "full" },
  { path: "shop/:category", component: ShopComponent },
  { path: "shop", redirectTo: "shop/Milk&Eggs", pathMatch: "full" },
  
  { path: "payment", component: PaymentComponent },

    { path: "**", component: NavErrorComponent }
];

@NgModule({
  declarations: [],
    imports: [
      CommonModule,
      RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
